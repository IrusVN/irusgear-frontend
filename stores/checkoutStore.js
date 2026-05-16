import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { useCartStore } from "@/stores/cartStore";
import { vietnamAddressApi } from "@/composables/useVietnamAddressApi";

// Single delivery options cache — same options apply to all addresses
let _deliveryOptionsCache = null;
let _voucherValidateTimer = null;
let _voucherPendingValidate = false;

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
  const preparedIdemKey = ref(null); // idempotency key cho payment, thay đổi khi session mới
  const preparedPricing = ref(null);
  const guestToken = ref(null);
  const guestEmail = ref(null);

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

  const hasFreeshipVoucher = computed(() =>
    appliedVouchers.value.some((v) => v.isFreeship === true)
  );

  const finalDeliveryFee = computed(() => {
    if (hasFreeshipVoucher.value) return 0;
    const base = selectedDelivery.value?.fee || 0;
    return base + timeSlotFee.value;
  });

  // Chỉ tính subtotal/savings dựa trên items user đã chọn ở trang /cart.
  // Khi không có item nào uncheck → selectedSubtotal == subtotal (toàn bộ cart).
  const subtotal = computed(() => cartStore.selectedSubtotal || formatMoney(0));
  const savings = computed(() => cartStore.selectedSavings || formatMoney(0));

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
      !isSubmitting.value &&
      !voucherValidateLoading.value
    );
  });

  const hasUnsavedChanges = computed(() => {
    if (!selectedAddressId.value) return false;
    return true;
  });

  const fetchAddresses = async ({ silent = false } = {}) => {
    // silent=true → không bật skeleton (dùng khi mutation đã có spinner riêng,
    // tránh hiện cả skeleton card + spinner "Đang lưu..." cùng lúc gây rối UI).
    if (!silent) {
      addressesLoading.value = true;
    }
    try {
      feGlobalStore.setApiUrl("addresses");
      const response = await feGlobalStore.fetchItem();
      if (response?.data) {
        // Resolve province/district/ward codes → names so AddressCard displays correctly
        const resolvedAddresses = await Promise.all(
          response.data.map(async (addr) => {
            const resolved = await vietnamAddressApi.resolveAddressCode({
              province_code: addr.province_code || addr.province,
              district_code: addr.district_code || addr.district,
              ward_code: addr.ward_code || addr.ward,
            });

            return {
              ...addr,
              province: resolved.province || addr.province,
              district: resolved.district || addr.district,
              ward: resolved.ward || addr.ward,
              is_default: addr.is_default ?? addr.isDefault ?? false,
            };
          }),
        );

        savedAddresses.value = resolvedAddresses.sort((a, b) => {
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
      }
    } catch (e) {
      console.error("fetchAddresses error:", e);
    } finally {
      if (!silent) {
        addressesLoading.value = false;
      }
    }
  };

  const fetchDeliveryOptions = async () => {
    // Use cached options if available (instant, no API call).
    // Cache chỉ lưu khi BE trả data thật — fallback không bị cache nên sẽ retry
    // sau khi user chọn address.
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
      // address_id optional — BE sẽ tính phí mặc định nếu thiếu (hoặc trả 400 → fallback)
      const payload = selectedAddressId.value
        ? { address_id: selectedAddressId.value }
        : {};
      const response = await feGlobalStore.createItem(payload);
      if (response?.data && response.data.length > 0) {
        // Chỉ cache khi có address (response đã chính xác theo địa chỉ).
        // Không có address → response là default → không cache để re-fetch sau.
        if (selectedAddressId.value) {
          _deliveryOptionsCache = response.data;
        }
        deliveryOptions.value = response.data;
        if (!selectedDeliveryId.value) {
          selectedDeliveryId.value = String(response.data[0].id);
        }
      } else {
        deliveryOptions.value = _getFallbackDeliveryOptions();
        if (!selectedDeliveryId.value) {
          selectedDeliveryId.value = "standard";
        }
      }
    } catch (e) {
      console.error("fetchDeliveryOptions error:", e);
      deliveryOptions.value = _getFallbackDeliveryOptions();
      if (!selectedDeliveryId.value) {
        selectedDeliveryId.value = "standard";
      }
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
        selectedAddressId.value = String(response.data.id);
      }
      // Re-fetch all addresses to sync is_default and resolve codes → names.
      // silent=true: form đã có spinner "Đang lưu..."; bật skeleton ở list cùng lúc sẽ rối UI.
      await fetchAddresses({ silent: true });
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
      // Re-fetch silent — form đã có spinner "Đang lưu..."
      await fetchAddresses({ silent: true });
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
      // Re-fetch silent — nút "Đặt mặc định" đã có spinner riêng (setDefaultLoading)
      await fetchAddresses({ silent: true });
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

      // Extract string codes — support both raw codes ("01") and resolved objects ({value, label})
      const extractCode = (code) => {
        if (!code) return null;
        if (typeof code === "string") return code.trim() || null;
        return String(code.value || code.code || "").trim() || null;
      };

      const provinceCode = extractCode(address.province_code) || extractCode(address.province);
      const districtCode = extractCode(address.district_code) || extractCode(address.district);
      const wardCode = extractCode(address.ward_code) || extractCode(address.ward);

      // Single call: resolve all codes → {value, label} objects
      // Uses esgoo API (with 7-day cache) as primary, static files as fallback
      const resolved = await vietnamAddressApi.resolveAddressCode({
        province_code: provinceCode,
        district_code: districtCode,
        ward_code: wardCode,
      });

      addressForm.value = {
        name: address.name || "",
        phone: address.phone || "",
        province: resolved.province || null,
        district: resolved.district || null,
        ward: resolved.ward || null,
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

  const setPreparedOrder = ({ sessionId, pricing, guestToken: gt, guestEmail: ge }) => {
    preparedSessionId.value = sessionId;
    preparedPricing.value = pricing;
    preparedIdemKey.value = crypto.randomUUID(); // key mới cho mỗi lần prepare, đảm bảo duy nhất
    guestToken.value = gt ?? null;
    guestEmail.value = ge ?? null;
  };

  const createOrder = async (paymentMethod = "cod") => {
    if (!preparedSessionId.value) {
      throw new Error("Chưa chuẩn bị đơn hàng");
    }
    feGlobalStore.setApiUrl("orders");
    const response = await feGlobalStore.createItem({
      session_id: preparedSessionId.value,
      payment_method: paymentMethod,
    });
    if (response?.success && response?.data) {
      return response.data;
    }
    throw new Error(response?.data?.message || "Tạo đơn hàng thất bại");
  };

  const createPayment = async (method) => {
    if (!preparedSessionId.value) {
      throw new Error("Chưa chuẩn bị đơn hàng");
    }
    feGlobalStore.setApiUrl(`payment/${method}/create`);
    const response = await feGlobalStore.createItem({
      session_id: preparedSessionId.value,
      idempotency_key: preparedIdemKey.value,
    });
    if (response?.success && response?.data?.payUrl) {
      return response.data;
    }
    throw new Error(response?.data?.message || "Tạo thanh toán thất bại");
  };

  const verifyPayment = async (params) => {
    feGlobalStore.setApiUrl("payment/verify");
    const response = await feGlobalStore.fetchItems(params);
    return response?.data;
  };

  /**
   * Fetch order details by orderId for the success page.
   * Returns full order data including items, address, pricing.
   */
  const fetchOrderById = async (orderId) => {
    if (!orderId) return null;
    feGlobalStore.setApiUrl(`orders/${encodeURIComponent(orderId)}`);
    const response = await feGlobalStore.fetchItem();
    // API wraps in { success, data } — unwrap to get order object directly
    return response?.data || response;
  };

  /**
   * Poll payment status for QR modal.
   * Backend tìm order từ session_id (UUID), KHÔNG tin orderId từ request.
   * Trả về payment data khi status = completed/failed/cancelled, null on timeout.
   * Nhận abortController để có thể hủy polling khi user navigate away.
   */
  const pollOrderPaymentStatus = async (sessionIdOrOrderId, options = {}, abortController = null) => {
    const { maxAttempts = 20, intervalMs = 5000 } = options;
    // Backend hỗ trợ cả orderId (để backward compat) và sessionId (UUID)
    // Dùng GET /orders/payment/poll với sessionId trong query param
    feGlobalStore.setApiUrl(`orders/payment/poll?session_id=${encodeURIComponent(sessionIdOrOrderId)}`);
    for (let i = 0; i < maxAttempts; i++) {
      // Kiểm tra abort trước mỗi request
      if (abortController?.signal.aborted) {
        return null;
      }
      try {
        const response = await feGlobalStore.fetchItem({}, { signal: abortController?.signal });
        if (abortController?.signal.aborted) {
          return null;
        }
        if (response?.data) {
          const status = response.data.status;
          if (
            status === "completed" ||
            status === "paid" ||
            status === "failed" ||
            status === "cancelled"
          ) {
            return response.data;
          }
        }
      } catch {
        // continue polling on error
      }
      if (i < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
    return null;
  };

  const prepareOrder = async () => {
    isSubmitting.value = true;
    submitError.value = null;
    try {
      const cartStore = useCartStore();
      const selectedIds = cartStore.selectedItemIds || [];

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
        selected_item_ids: selectedIds.length > 0 ? selectedIds : undefined,
      });

      if (response?.data) {
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
    preparedIdemKey.value = null;
    preparedPricing.value = null;
    guestToken.value = null;
    guestEmail.value = null;
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
    preparedOrderId,   // order number từ backend response (ORD-YYYYMMDD-XXXX)
    preparedSessionId, // UUID session key
    preparedPricing,
    guestToken,
    guestEmail,

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
    verifyPayment,
    pollOrderPaymentStatus,
    fetchOrderById,
    resetCheckout,
  };
});
