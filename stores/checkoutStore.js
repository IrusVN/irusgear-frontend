import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { useCartStore } from "@/stores/cartStore";
import { vietnamAddressApi } from "@/composables/useVietnamAddressApi";

// Cache provinces/districts/wards data for resolving address codes to names
const _addressCache = {
  provinces: [],
  districts: {},
  wards: {},
  loaded: false,
};

// Single delivery options cache — same options apply to all addresses
let _deliveryOptionsCache = null;
let _voucherValidateTimer = null;
let _voucherPendingValidate = false;

const _loadAddressData = async () => {
  if (_addressCache.loaded) return;
  _addressCache.provinces = await vietnamAddressApi.getProvinces();
  _addressCache.loaded = true;
};

const _resolveProvince = (code) => {
  const p = _addressCache.provinces.find(
    (pr) => String(pr.value) === String(code)
  );
  return p ? { value: String(code), label: p.label } : { value: String(code), label: String(code) };
};

const formatMoney = (value = 0) => {
  const normalizedValue = Number(value) || 0;
  return {
    value: normalizedValue,
    formatted: `${new Intl.NumberFormat("vi-VN").format(normalizedValue)}đ`,
  };
};

const _getFallbackDeliveryOptions = () => [
  { id: "standard", name: "Tiết kiệm", description: "Giao thường", time: "3-5 ngày", fee: 0, hasTimeSlots: false },
  { id: "express", name: "Nhanh", description: "Giao nhanh", time: "1-2 ngày", fee: 30000, hasTimeSlots: true },
  { id: "pickup", name: "Nhận tại cửa hàng", description: "Tự đến lấy", time: "Linh hoạt", fee: 0, hasTimeSlots: false },
];

export const useCheckoutStore = defineStore("checkout", () => {
  const feGlobalStore = useFeGlobalStore();
  const cartStore = useCartStore();

  // Address state
  const savedAddresses = ref([]);
  const selectedAddressId = ref(null);
  const addressForm = ref({
    name: "",
    phone: "",
    province: null,
    district: null,
    ward: null,
    detail: "",
    label: "home",
    isDefault: false,
  });
  const isEditingAddress = ref(false);
  const editingAddressId = ref(null);
  const addressesLoading = ref(false);
  const addressSaving = ref(false); // spam protection
  const setDefaultLoading = ref(false);

  // Delivery state
  const deliveryOptions = ref([]);
  const selectedDeliveryId = ref(null);
  const selectedTimeSlot = ref(null);
  const deliveryLoading = ref(false);

  // Voucher state
  const appliedVouchers = ref([]);
  const availableVouchers = ref([]);
  const selectedVoucherCodes = ref([]);
  const voucherInput = ref("");
  const voucherLoading = ref(false);
  const voucherError = ref(null);
  const voucherExpanded = ref(false);
  const voucherValidateResult = ref(null); // { applied: [], rejected: [], totalDiscount: number }
  const voucherValidateLoading = ref(false);

  // Order state
  const orderNote = ref("");
  const agreedToTerms = ref(false);
  const isSubmitting = ref(false);
  const submitError = ref(null);

  // Order review dialog
  const showOrderReview = ref(false);

  // Insurance & secondary contact (Phase 4)
  const orderInsurance = ref(false);

  // Prepared order data (from /checkout/prepare)
  const preparedOrderId = ref(null);
  const preparedSessionId = ref(null);
  const preparedPricing = ref(null);
  const secondaryContact = ref({
    enabled: false,
    name: "",
    phone: "",
    notifyOriginal: true,
  });

  // Computed
  const selectedAddress = computed(() =>
    savedAddresses.value.find((a) => String(a.id) === String(selectedAddressId.value)) || null
  );

  const selectedDelivery = computed(() =>
    deliveryOptions.value.find((d) => String(d.id) === String(selectedDeliveryId.value)) || null
  );

  const timeSlotFee = computed(() => selectedTimeSlot.value?.extraFee || 0);

  const finalDeliveryFee = computed(() => {
    const base = selectedDelivery.value?.fee || 0;
    return base + timeSlotFee.value;
  });

  const subtotal = computed(() => cartStore.subtotal || formatMoney(0));
  const savings = computed(() => cartStore.savings || formatMoney(0));

  const voucherDiscount = computed(() => {
    if (!selectedVoucherCodes.value.length) return formatMoney(0);
    let discount = 0;
    for (const code of selectedVoucherCodes.value) {
      const applied = appliedVouchers.value.find((v) => v.code === code);
      if (applied?.discount) {
        discount += applied.discount;
      } else {
        const available = availableVouchers.value.find((v) => v.code === code);
        if (available?.savingsPreview) {
          discount += available.savingsPreview;
        }
      }
    }
    return formatMoney(discount);
  });

  const insuranceFee = computed(() => {
    return orderInsurance.value ? formatMoney(29000) : formatMoney(0);
  });

  const finalTotal = computed(() => {
    if (preparedPricing.value) {
      return formatMoney(preparedPricing.value.total);
    }
    const sub = Number(subtotal.value?.value || 0);
    const save = Number(savings.value?.value || 0);
    const voucher = Number(voucherDiscount.value?.value || 0);
    const delivery = finalDeliveryFee.value;
    const insurance = Number(insuranceFee.value?.value || 0);
    return formatMoney(sub - save - voucher + delivery + insurance);
  });

  const canSubmit = computed(() => {
    return (
      selectedAddressId.value &&
      selectedDeliveryId.value &&
      agreedToTerms.value &&
      !isSubmitting.value
    );
  });

  const hasUnsavedChanges = computed(() => {
    if (!selectedAddressId.value) return false;
    return true;
  });

  // Actions
  const fetchAddresses = async () => {
    addressesLoading.value = true;
    try {
      feGlobalStore.setApiUrl("addresses");
      const response = await feGlobalStore.fetchItem();
      if (response?.data) {
        savedAddresses.value = response.data.map((a) => ({
          ...a,
          // Normalize: backend may return isDefault (camelCase) or is_default
          is_default: a.is_default ?? a.isDefault ?? false,
        }));
        // Sort: default address first, then by creation order
        savedAddresses.value.sort((a, b) => {
          if (a.is_default && !b.is_default) return -1;
          if (!a.is_default && b.is_default) return 1;
          return 0;
        });
        const defaultAddr = savedAddresses.value.find((a) => a.is_default);
        if (defaultAddr) {
          selectedAddressId.value = String(defaultAddr.id);
        } else if (savedAddresses.value.length > 0) {
          selectedAddressId.value = String(savedAddresses.value[0].id);
        }
        // Fetch delivery options once (same options for all addresses)
        await fetchDeliveryOptions();
      }
    } catch (e) {
      console.error("fetchAddresses error:", e);
    } finally {
      addressesLoading.value = false;
    }
  };

  const fetchDeliveryOptions = async () => {
    if (!selectedAddressId.value) return;

    // Use cached options if available (instant, no API call)
    if (_deliveryOptionsCache) {
      deliveryOptions.value = _deliveryOptionsCache;
      if (!selectedDeliveryId.value && deliveryOptions.value.length > 0) {
        selectedDeliveryId.value = String(deliveryOptions.value[0].id);
      }
      return;
    }

    deliveryLoading.value = true;
    try {
      feGlobalStore.setApiUrl("checkout/delivery-options");
      const response = await feGlobalStore.createItem({ address_id: selectedAddressId.value });
      if (response?.data && response.data.length > 0) {
        _deliveryOptionsCache = response.data;
        deliveryOptions.value = response.data;
        if (!selectedDeliveryId.value) {
          selectedDeliveryId.value = String(response.data[0].id);
        }
      } else {
        deliveryOptions.value = _getFallbackDeliveryOptions();
        selectedDeliveryId.value = "standard";
      }
    } catch (e) {
      console.error("fetchDeliveryOptions error:", e);
      deliveryOptions.value = _getFallbackDeliveryOptions();
      selectedDeliveryId.value = "standard";
    } finally {
      deliveryLoading.value = false;
    }
  };

  const fetchAvailableVouchers = async () => {
    try {
      feGlobalStore.setApiUrl("checkout/vouchers");
      const response = await feGlobalStore.fetchItem();
      if (response?.data) {
        availableVouchers.value = response.data;
      }
    } catch (e) {
      console.error("fetchAvailableVouchers error:", e);
    }
  };

  const validateVouchers = async () => {
    if (!selectedVoucherCodes.value.length) {
      appliedVouchers.value = [];
      voucherError.value = null;
      return;
    }
    voucherValidateLoading.value = true;
    voucherError.value = null;
    try {
      feGlobalStore.setApiUrl("checkout/vouchers/validate");
      const response = await feGlobalStore.createItem({
        codes: selectedVoucherCodes.value,
        cart_total: subtotal.value?.value || 0,
        items: cartStore.items.map((item) => ({
          product_id: item.productId,
          category_id: null,
          quantity: item.quantity,
          price: item.unitPrice?.value || 0,
        })),
      });

      voucherValidateResult.value = response?.data || null;

      if (!response?.success) {
        voucherError.value = response?.data?.rejected?.[0]?.message || "Mã giảm giá không hợp lệ";
        return;
      }

      appliedVouchers.value = (response.data?.applied || []).map((v) => {
        const info = availableVouchers.value.find((av) => av.code === v.code);
        return {
          code: v.code,
          name: v.name || info?.name || v.code,
          description: v.description || info?.description || "",
          discountType: v.discountType,
          discount: v.discount || 0,
          finalPrice: v.finalPrice,
          isFreeship: v.discountType === "freeship",
        };
      });

      // Tự động bỏ tick voucher bị rejected (không stackable)
      const rejectedCodes = (response.data?.rejected || []).map((r) => r.code);
      if (rejectedCodes.length > 0) {
        selectedVoucherCodes.value = selectedVoucherCodes.value.filter(
          (code) => !rejectedCodes.includes(code)
        );
      }

      // Có request mới trong khi đang loading → gọi lại
      if (_voucherPendingValidate) {
        _voucherPendingValidate = false;
        await validateVouchers();
      }
    } catch (e) {
      const msg = e?.data?.message || "Mã giảm giá không hợp lệ";
      voucherError.value = msg;
      // Vẫn re-validate nếu có pending
      if (_voucherPendingValidate) {
        _voucherPendingValidate = false;
        await validateVouchers();
      }
    } finally {
      voucherValidateLoading.value = false;
    }
  };

  const _debouncedValidate = () => {
    if (voucherValidateLoading.value) {
      _voucherPendingValidate = true;
      return;
    }
    clearTimeout(_voucherValidateTimer);
    _voucherValidateTimer = setTimeout(validateVouchers, 300);
  };

  const toggleVoucher = (code) => {
    if (selectedVoucherCodes.value.includes(code)) {
      selectedVoucherCodes.value = selectedVoucherCodes.value.filter((c) => c !== code);
    } else {
      selectedVoucherCodes.value = [...selectedVoucherCodes.value, code];
    }
    _debouncedValidate();
  };

  const applyVoucherFromInput = () => {
    const code = voucherInput.value.trim().toUpperCase();
    if (!code) return;
    if (!selectedVoucherCodes.value.includes(code)) {
      selectedVoucherCodes.value = [...selectedVoucherCodes.value, code];
    }
    voucherInput.value = "";
    _debouncedValidate();
  };

  const applyVouchers = async () => {
    await validateVouchers();
  };

  const removeVoucher = async (code) => {
    if (code) {
      selectedVoucherCodes.value = selectedVoucherCodes.value.filter((c) => c !== code);
    } else {
      selectedVoucherCodes.value = [];
    }
    appliedVouchers.value = appliedVouchers.value.filter((v) => v.code !== code);
    voucherInput.value = "";
    if (code) {
      clearTimeout(_voucherValidateTimer);
      _voucherValidateTimer = setTimeout(validateVouchers, 300);
    } else {
      appliedVouchers.value = [];
      selectedVoucherCodes.value = [];
    }
  };

  const saveAddress = async (addressData) => {
    if (addressSaving.value) return;
    addressSaving.value = true;
    try {
      const payload = {
        name: addressData.name,
        phone: addressData.phone,
        province_code: addressData.province?.value || addressData.province?.code || null,
        district_code: addressData.district?.value || addressData.district?.code || null,
        ward_code: addressData.ward?.value || addressData.ward?.code || null,
        address_line1: addressData.detail || null,
        label: addressData.label || "home",
        is_default: addressData.isDefault || false,
      };
      feGlobalStore.setApiUrl("addresses");
      const response = await feGlobalStore.createItem(payload);
      if (response?.data) {
        const newAddr = {
          ...response.data,
          is_default: response.data.is_default ?? response.data.isDefault ?? false,
        };
        savedAddresses.value.unshift(newAddr);
        selectedAddressId.value = String(response.data.id);
        if (newAddr.is_default) {
          savedAddresses.value.sort((a, b) => {
            if (a.is_default && !b.is_default) return -1;
            if (!a.is_default && b.is_default) return 1;
            return 0;
          });
        }
      }
      isEditingAddress.value = false;
      editingAddressId.value = null;
      resetAddressForm();
      return response;
    } finally {
      addressSaving.value = false;
    }
  };

  const updateAddress = async (id, addressData) => {
    if (addressSaving.value) return;
    addressSaving.value = true;
    try {
      const payload = {
        name: addressData.name,
        phone: addressData.phone,
        province_code: addressData.province?.value || addressData.province?.code || null,
        district_code: addressData.district?.value || addressData.district?.code || null,
        ward_code: addressData.ward?.value || addressData.ward?.code || null,
        address_line1: addressData.detail || null,
        label: addressData.label || "home",
        is_default: addressData.isDefault || false,
      };
      feGlobalStore.setApiUrl("addresses");
      const response = await feGlobalStore.updateItem(id, payload);
      if (response?.data) {
        const idx = savedAddresses.value.findIndex((a) => String(a.id) === String(id));
        if (idx !== -1) {
          savedAddresses.value[idx] = {
            ...response.data,
            is_default: response.data.is_default ?? response.data.isDefault ?? savedAddresses.value[idx].is_default,
          };
        }
      }
      isEditingAddress.value = false;
      editingAddressId.value = null;
      resetAddressForm();
      return response;
    } finally {
      addressSaving.value = false;
    }
  };

  const deleteAddress = async (id) => {
    const strId = String(id);
    feGlobalStore.setApiUrl("addresses");
    const response = await feGlobalStore.deleteItem(id);
    savedAddresses.value = savedAddresses.value.filter((a) => String(a.id) !== strId);
    if (String(selectedAddressId.value) === strId) {
      selectedAddressId.value = savedAddresses.value[0] ? String(savedAddresses.value[0].id) : null;
    }
    return response;
  };

  const setDefaultAddress = async (id) => {
    setDefaultLoading.value = true;
    try {
      await feGlobalStore.putItem(`addresses/${id}/default`);
      // Optimistic update: set is_default locally, no refetch needed
      savedAddresses.value.forEach((a) => {
        a.is_default = String(a.id) === String(id);
      });
      // Sort: default address first
      savedAddresses.value.sort((a, b) => {
        if (a.is_default && !b.is_default) return -1;
        if (!a.is_default && b.is_default) return 1;
        return 0;
      });
    } finally {
      setDefaultLoading.value = false;
    }
  };

  const selectAddress = (id) => {
    const newId = String(id);
    if (selectedAddressId.value === newId) return; // skip if same address
    selectedAddressId.value = newId;
    selectedTimeSlot.value = null;
    fetchDeliveryOptions();
  };

  const selectDelivery = (id) => {
    selectedDeliveryId.value = String(id);
    selectedTimeSlot.value = null;
  };

  const resetAddressForm = () => {
    addressForm.value = {
      name: "",
      phone: "",
      province: null,
      district: null,
      ward: null,
      detail: "",
      label: "home",
      isDefault: false,
    };
  };

  const openAddressForm = async (address = null) => {
    if (address) {
      editingAddressId.value = String(address.id);

      // Backend trả province_code/district_code/ward_code là string codes
      // AddressSearchSelect dùng format {value, label} — resolve ra tên
      await _loadAddressData();

      const provinceCode = address.province_code || address.province;
      const districtCode = address.district_code || address.district;
      const wardCode = address.ward_code || address.ward;

      // Province — resolve từ cache
      const provinceOpt = _resolveProvince(provinceCode);

      // District — load từ API
      let districtOpt = null;
      if (districtCode && provinceCode) {
        const districts = await vietnamAddressApi.getDistricts(provinceCode);
        const d = districts.find((dr) => String(dr.value) === String(districtCode));
        districtOpt = d
          ? { value: String(districtCode), label: d.label }
          : { value: String(districtCode), label: String(districtCode) };
      }

      // Ward — load từ API
      let wardOpt = null;
      if (wardCode && districtCode) {
        const wards = await vietnamAddressApi.getWards(districtCode);
        const w = wards.find((wr) => String(wr.value) === String(wardCode));
        wardOpt = w
          ? { value: String(wardCode), label: w.label }
          : { value: String(wardCode), label: String(wardCode) };
      }

      addressForm.value = {
        name: address.name || "",
        phone: address.phone || "",
        province: provinceOpt,
        district: districtOpt,
        ward: wardOpt,
        detail: address.detail || address.addressLine1 || "",
        label: address.label || "home",
        isDefault: address.is_default || false,
      };
    } else {
      editingAddressId.value = null;
      resetAddressForm();
    }
    isEditingAddress.value = true;
  };

  const closeAddressForm = () => {
    isEditingAddress.value = false;
    editingAddressId.value = null;
    resetAddressForm();
  };

  const openOrderReview = () => {
    showOrderReview.value = true;
  };

  const closeOrderReview = () => {
    showOrderReview.value = false;
  };

  const setPreparedOrder = ({ orderId, sessionId, pricing }) => {
    preparedOrderId.value = orderId;
    preparedSessionId.value = sessionId;
    preparedPricing.value = pricing;
  };

  const createOrder = async (paymentMethod = "cod") => {
    if (!preparedOrderId.value) {
      throw new Error("Chưa chuẩn bị đơn hàng");
    }
    feGlobalStore.setApiUrl("orders");
    const response = await feGlobalStore.createItem({
      order_id: preparedOrderId.value,
      payment_method: paymentMethod,
    });
    if (response?.success && response?.data) {
      return response.data;
    }
    throw new Error(response?.data?.message || "Tạo đơn hàng thất bại");
  };

  const createPayment = async (method) => {
    if (!preparedOrderId.value) {
      throw new Error("Chưa chuẩn bị đơn hàng");
    }
    feGlobalStore.setApiUrl(`payment/${method}/create`);
    const response = await feGlobalStore.createItem({
      order_id: preparedOrderId.value,
    });
    if (response?.success && response?.data?.payUrl) {
      return response.data;
    }
    throw new Error(response?.data?.message || "Tạo thanh toán thất bại");
  };

  const prepareOrder = async () => {
    isSubmitting.value = true;
    submitError.value = null;
    try {
      feGlobalStore.setApiUrl("checkout/prepare");
      const response = await feGlobalStore.createItem({
        address_id: selectedAddressId.value,
        delivery: {
          method: selectedDeliveryId.value,
          time_slot: selectedTimeSlot.value?.id || null,
        },
        vouchers: appliedVouchers.value.map((v) => v.code),
        order_note: orderNote.value || null,
        secondary_contact: secondaryContact.value.enabled ? {
          name: secondaryContact.value.name,
          phone: secondaryContact.value.phone,
          notify_original: secondaryContact.value.notifyOriginal,
        } : null,
        order_insurance: orderInsurance.value,
      });

      if (response?.data) {
        preparedOrderId.value = response.data.orderId;
        preparedSessionId.value = response.data.sessionId;
        preparedPricing.value = response.data.pricing;
      }

      return response;
    } catch (e) {
      submitError.value = e?.data?.message || "Không thể chuẩn bị đơn hàng";
      throw e;
    } finally {
      isSubmitting.value = false;
    }
  };

  const resetCheckout = () => {
    selectedAddressId.value = null;
    deliveryOptions.value = [];
    _deliveryOptionsCache = null;
    selectedDeliveryId.value = null;
    selectedTimeSlot.value = null;
    appliedVouchers.value = [];
    availableVouchers.value = [];
    selectedVoucherCodes.value = [];
    voucherInput.value = "";
    voucherError.value = null;
    voucherValidateResult.value = null;
    clearTimeout(_voucherValidateTimer);
    _voucherValidateTimer = null;
    _voucherPendingValidate = false;
    orderNote.value = "";
    agreedToTerms.value = false;
    isSubmitting.value = false;
    submitError.value = null;
    showOrderReview.value = false;
    orderInsurance.value = false;
    secondaryContact.value = {
      enabled: false,
      name: "",
      phone: "",
      notifyOriginal: true,
    };
    preparedOrderId.value = null;
    preparedSessionId.value = null;
    preparedPricing.value = null;
  };

  return {
    // Address state
    savedAddresses,
    selectedAddressId,
    addressForm,
    isEditingAddress,
    editingAddressId,
    addressesLoading,
    addressSaving,
    setDefaultLoading,

    // Delivery state
    deliveryOptions,
    selectedDeliveryId,
    selectedTimeSlot,
    deliveryLoading,

    // Voucher state
    appliedVouchers,
    availableVouchers,
    selectedVoucherCodes,
    voucherInput,
    voucherLoading,
    voucherError,
    voucherExpanded,
    voucherValidateResult,
    voucherValidateLoading,

    // Order state
    orderNote,
    agreedToTerms,
    isSubmitting,
    submitError,
    showOrderReview,

    // Insurance & secondary
    orderInsurance,
    secondaryContact,

    // Prepared order data
    preparedOrderId,
    preparedSessionId,
    preparedPricing,

    // Computed
    selectedAddress,
    selectedDelivery,
    timeSlotFee,
    finalDeliveryFee,
    subtotal,
    savings,
    voucherDiscount,
    insuranceFee,
    finalTotal,
    canSubmit,
    hasUnsavedChanges,

    // Actions
    fetchAddresses,
    fetchDeliveryOptions,
    fetchAvailableVouchers,
    validateVouchers,
    toggleVoucher,
    applyVoucherFromInput,
    applyVouchers,
    removeVoucher,
    saveAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    selectDelivery,
    openAddressForm,
    closeAddressForm,
    openOrderReview,
    closeOrderReview,
    setPreparedOrder,
    prepareOrder,
    createOrder,
    createPayment,
    resetCheckout,
  };
});
