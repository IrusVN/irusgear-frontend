import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRuntimeConfig, useRequestHeaders } from "#imports";
import { useAuthStore } from "@/stores/authStore";
import { useFeGlobalStore } from "@/stores/feGlobalStore";

const defaultStats = () => ({
  pending_pickup: 0,
  delivering: 0,
  delivered_today: 0,
  failed_today: 0,
  returned_today: 0,
});

export const useShipperStore = defineStore("shipper/orders", () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const feGlobalStore = useFeGlobalStore();

  const orders = ref([]);
  const selectedOrder = ref(null);
  const stats = ref(defaultStats());
  const meta = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const pendingOrders = computed(() =>
    orders.value.filter((order) => ["pending_pickup", "picked_up", "delivering", "failed"].includes(order.status)),
  );

  const buildHeaders = (extra = {}) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...extra,
    };

    if (import.meta.server) {
      const reqHeaders = useRequestHeaders(["cookie"]);
      if (reqHeaders.cookie) {
        headers.cookie = reqHeaders.cookie;
      }
    }

    return headers;
  };

  const parseError = async (res) => {
    let body = {};
    try {
      body = await res.json();
    } catch (_) {}

    const err = new Error(body?.error?.message || body?.message || `HTTP ${res.status}`);
    err.data = body;
    return err;
  };

  const normalizeOrder = (order = {}) => {
    const address = order.address || {};
    const items = order.items || order.items_summary || [];
    const recipientName = order.recipient_name || address.recipient_name || address.name || "";
    const recipientPhone = order.recipient_phone || address.recipient_phone || address.phone || "";
    const addressLine = [
      order.address_line1 || address.line1,
      order.ward_code || address.ward_code,
      order.district_code || address.district_code,
      order.province_code || address.province_code,
    ].filter(Boolean).join(", ");

    return {
      id: order.id,
      shipmentId: order.shipment_id,
      assignedShipperId: order.assigned_shipper_id,
      orderCode: order.order_number,
      status: order.status,
      orderStatus: order.order_status,
      pickupZone: order.pickup_zone,
      customer: {
        name: recipientName,
        phone: recipientPhone,
      },
      address: addressLine,
      shippingFee: Number(order.delivery_fee || 0),
      total: Number(order.total || order.payment?.amount || 0),
      paymentMethod: order.payment_method || order.payment?.method || "cod",
      paymentStatus: order.payment_status || order.payment?.status,
      codAmount: Number(order.cod_amount || order.payment?.cod_amount || 0),
      pickedUpAt: order.picked_up_at,
      lastAttemptAt: order.last_attempt_at,
      attemptsCount: Number(order.attempts_count || order.attempts?.length || 0),
      items: items.map((item) => ({
        id: item.id,
        name: item.name || item.product_name,
        quantity: Number(item.quantity || 0),
        price: Number(item.unit_price || item.price || 0),
        image: item.thumbnail || item.image || "",
      })),
      attempts: order.attempts || [],
      raw: order,
    };
  };

  const fetchOrders = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      feGlobalStore.setApiUrl("shipper/orders");
      const response = await feGlobalStore.fetchItems({
        per_page: params.per_page ?? 20,
        ...params,
      });

      if (response?.data) {
        orders.value = response.data.map(normalizeOrder);
        meta.value = response.meta || null;
      }

      return response;
    } finally {
      loading.value = false;
    }
  };

  const fetchStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      feGlobalStore.setApiUrl("shipper/orders/stats");
      const response = await feGlobalStore.fetchItem();
      stats.value = { ...defaultStats(), ...(response?.data || {}) };
      return response;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrder = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      feGlobalStore.setApiUrl(`shipper/orders/${id}`);
      const response = await feGlobalStore.fetchItem();

      if (response?.data) {
        selectedOrder.value = normalizeOrder(response.data);
      }

      return selectedOrder.value;
    } finally {
      loading.value = false;
    }
  };

  const idempotencyKey = () =>
    globalThis.crypto?.randomUUID?.() || `shipper-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const postOrderAction = async (orderId, action, payload = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${config.public.apiBaseUrl}/shipper/orders/${orderId}/${action}`, {
        method: "POST",
        credentials: "include",
        headers: buildHeaders({ "Idempotency-Key": idempotencyKey() }),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        auth.logout();
        return null;
      }

      if (!res.ok) {
        throw await parseError(res);
      }

      return await res.json();
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const upsertOrder = (order) => {
    if (!order) return;

    const normalized = normalizeOrder(order);
    const index = orders.value.findIndex((item) => item.id === normalized.id);

    if (index >= 0) {
      orders.value.splice(index, 1, normalized);
    } else {
      orders.value.unshift(normalized);
    }

    selectedOrder.value = normalized;
  };

  const claim = async (orderId) => {
    const response = await postOrderAction(orderId, "claim");
    upsertOrder(response?.data);
    await fetchStats();
    return response;
  };

  const pickup = (orderId, payload = {}) => postOrderAction(orderId, "pickup", payload);
  const startDelivery = (orderId, payload = {}) => postOrderAction(orderId, "start-delivery", payload);
  const complete = (orderId, payload = {}) => postOrderAction(orderId, "complete", payload);
  const fail = (orderId, payload = {}) => postOrderAction(orderId, "fail", payload);
  const reschedule = (orderId, payload = {}) => postOrderAction(orderId, "reschedule", payload);

  const reset = () => {
    orders.value = [];
    selectedOrder.value = null;
    stats.value = defaultStats();
    meta.value = null;
    error.value = null;
  };

  return {
    orders,
    pendingOrders,
    selectedOrder,
    stats,
    meta,
    loading,
    error,
    fetchOrders,
    fetchStats,
    fetchOrder,
    claim,
    pickup,
    startDelivery,
    complete,
    fail,
    reschedule,
    reset,
  };
});
