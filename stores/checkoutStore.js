import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { useCartStore } from "@/stores/cartStore";

// Cache provinces/districts/wards data for resolving address codes to names
const _addressCache = {
  provinces: [],
  districts: {},
  wards: {},
  loaded: false,
};

const _loadAddressData = async () => {
  if (_addressCache.loaded) return;
  try {
    const res = await fetch("/data/vn-addresses/provinces.json");
    if (res.ok) {
      _addressCache.provinces = await res.json();
    }
    _addressCache.loaded = true;
  } catch {
    _addressCache.loaded = true;
  }
};

const _resolveProvince = (code) => {
  const p = _addressCache.provinces.find(
    (pr) => String(pr.code) === String(code)
  );
  return p ? { value: String(code), label: p.name } : { value: String(code), label: String(code) };
};

const formatMoney = (value = 0) => {
  const normalizedValue = Number(value) || 0;
  return {
    value: normalizedValue,
    formatted: `${new Intl.NumberFormat("vi-VN").format(normalizedValue)}đ`,
  };
};

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

  // Delivery state
  const deliveryOptions = ref([]);
  const selectedDeliveryId = ref(null);
  const selectedTimeSlot = ref(null);
  const deliveryLoading = ref(false);

  // Voucher state
  const appliedVoucher = ref(null);
  const availableVouchers = ref([]);
  const voucherInput = ref("");
  const voucherLoading = ref(false);
  const voucherError = ref(null);
  const voucherExpanded = ref(false);

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
    if (!appliedVoucher.value) return formatMoney(0);
    const discount = appliedVoucher.value.discount || 0;
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
        savedAddresses.value = response.data;
        const defaultAddr = savedAddresses.value.find((a) => a.isDefault);
        if (defaultAddr) {
          selectedAddressId.value = String(defaultAddr.id);
        } else if (savedAddresses.value.length > 0) {
          selectedAddressId.value = String(savedAddresses.value[0].id);
        }
      }
    } catch (e) {
      console.error("fetchAddresses error:", e);
    } finally {
      addressesLoading.value = false;
    }
  };

  const fetchDeliveryOptions = async () => {
    if (!selectedAddressId.value) return;
    deliveryLoading.value = true;
    try {
      feGlobalStore.setApiUrl("checkout/delivery-options");
      const response = await feGlobalStore.createItem({ address_id: selectedAddressId.value });
      if (response?.data) {
        deliveryOptions.value = response.data;
        if (deliveryOptions.value.length > 0 && !selectedDeliveryId.value) {
          selectedDeliveryId.value = String(deliveryOptions.value[0].id);
        }
      }
    } catch (e) {
      console.error("fetchDeliveryOptions error:", e);
      // Fallback default options
      deliveryOptions.value = [
        {
          id: "standard",
          name: "Tiết kiệm",
          description: "Giao thường",
          time: "3-5 ngày",
          fee: 0,
          hasTimeSlots: false,
        },
        {
          id: "express",
          name: "Nhanh",
          description: "Giao nhanh",
          time: "1-2 ngày",
          fee: 30000,
          hasTimeSlots: true,
        },
        {
          id: "pickup",
          name: "Nhận tại cửa hàng",
          description: "Tự đến lấy",
          time: "Linh hoạt",
          fee: 0,
          hasTimeSlots: false,
        },
      ];
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

  const validateVoucher = async (code) => {
    voucherLoading.value = true;
    voucherError.value = null;
    try {
      feGlobalStore.setApiUrl("checkout/vouchers/validate");
      const response = await feGlobalStore.createItem({
        codes: [code],
        cart_total: subtotal.value?.value || 0,
      });

      if (!response?.success || !response?.data?.applied?.length) {
        const msg = response?.data?.rejected?.[0]?.message || "Mã giảm giá không hợp lệ";
        voucherError.value = msg;
        return null;
      }

      const applied = response.data.applied[0];
      return {
        code: applied.code,
        discountType: applied.discountType,
        discount: applied.discount,
        finalPrice: applied.finalPrice,
      };
    } catch (e) {
      const msg = e?.data?.message || "Mã giảm giá không hợp lệ";
      voucherError.value = msg;
      return null;
    } finally {
      voucherLoading.value = false;
    }
  };

  const applyVoucher = async (code) => {
    const data = await validateVoucher(code);
    if (data) {
      // Backend validate không trả name/description — lấy từ availableVouchers
      const voucherInfo = availableVouchers.value.find((v) => v.code === code);
      appliedVoucher.value = {
        ...data,
        name: voucherInfo?.name || code,
        description: voucherInfo?.description || "",
        isFreeship: data.discountType === "freeship",
      };
      voucherInput.value = "";
      voucherError.value = null;
    }
  };

  const removeVoucher = () => {
    appliedVoucher.value = null;
    voucherInput.value = "";
    voucherError.value = null;
  };

  const saveAddress = async (addressData) => {
    // AddressSearchSelect dùng format {value, label} — extract code cho backend
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
      savedAddresses.value.unshift(response.data);
      selectedAddressId.value = String(response.data.id);
    }
    isEditingAddress.value = false;
    editingAddressId.value = null;
    resetAddressForm();
    return response;
  };

  const updateAddress = async (id, addressData) => {
    // AddressSearchSelect dùng format {value, label} — extract code cho backend
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
        savedAddresses.value[idx] = response.data;
      }
    }
    isEditingAddress.value = false;
    editingAddressId.value = null;
    resetAddressForm();
    return response;
  };

  const deleteAddress = async (id) => {
    feGlobalStore.setApiUrl("addresses");
    const response = await feGlobalStore.deleteItem(id);
    savedAddresses.value = savedAddresses.value.filter((a) => String(a.id) !== String(id));
    if (String(selectedAddressId.value) === String(id)) {
      selectedAddressId.value = savedAddresses.value[0] ? String(savedAddresses.value[0].id) : null;
    }
    return response;
  };

  const setDefaultAddress = async (id) => {
    await feGlobalStore.putItem(`addresses/${id}/default`);
    savedAddresses.value.forEach((a) => {
      a.isDefault = String(a.id) === String(id);
    });
  };

  const selectAddress = (id) => {
    selectedAddressId.value = String(id);
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

      // District — load từ province file nếu có province code
      let districtOpt = null;
      if (districtCode && provinceCode) {
        const key = String(provinceCode);
        if (!_addressCache.districts[key]) {
          try {
            const res = await fetch(`/data/vn-addresses/districts/${provinceCode}.json`);
            if (res.ok) {
              _addressCache.districts[key] = await res.json();
            }
          } catch { /* ignore */ }
        }
        const districts = _addressCache.districts[key] || [];
        const d = districts.find((dr) => String(dr.code) === String(districtCode));
        districtOpt = d
          ? { value: String(districtCode), label: d.name }
          : { value: String(districtCode), label: String(districtCode) };
      }

      // Ward — load từ district file nếu có district code
      let wardOpt = null;
      if (wardCode && districtCode) {
        const key = String(districtCode);
        if (!_addressCache.wards[key]) {
          try {
            const res = await fetch(`/data/vn-addresses/wards/${districtCode}.json`);
            if (res.ok) {
              _addressCache.wards[key] = await res.json();
            }
          } catch { /* ignore */ }
        }
        const wards = _addressCache.wards[key] || [];
        const w = wards.find((wr) => String(wr.code) === String(wardCode));
        wardOpt = w
          ? { value: String(wardCode), label: w.name }
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
        isDefault: address.isDefault || false,
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
        vouchers: appliedVoucher.value?.code ? [appliedVoucher.value.code] : [],
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
    selectedDeliveryId.value = null;
    selectedTimeSlot.value = null;
    appliedVoucher.value = null;
    availableVouchers.value = [];
    voucherInput.value = "";
    voucherError.value = null;
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

    // Delivery state
    deliveryOptions,
    selectedDeliveryId,
    selectedTimeSlot,
    deliveryLoading,

    // Voucher state
    appliedVoucher,
    availableVouchers,
    voucherInput,
    voucherLoading,
    voucherError,
    voucherExpanded,

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
    validateVoucher,
    applyVoucher,
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
    resetCheckout,
  };
});
