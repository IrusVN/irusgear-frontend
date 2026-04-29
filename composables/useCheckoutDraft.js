import { watch } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";

const DRAFT_KEY = "checkout_draft";

export function useCheckoutDraft() {
  const checkoutStore = useCheckoutStore();

  const saveDraft = () => {
    if (!import.meta.client) return;
    const draft = {
      selectedAddressId: checkoutStore.selectedAddressId,
      selectedDeliveryId: checkoutStore.selectedDeliveryId,
      selectedTimeSlot: checkoutStore.selectedTimeSlot,
      appliedVoucher: checkoutStore.appliedVoucher,
      orderNote: checkoutStore.orderNote,
      orderInsurance: checkoutStore.orderInsurance,
      secondaryContact: checkoutStore.secondaryContact,
      savedAt: Date.now(),
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  const loadDraft = () => {
    if (!import.meta.client) return null;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      const draft = JSON.parse(raw);
      // Expire after 2 hours
      if (draft.savedAt && Date.now() - draft.savedAt > 2 * 60 * 60 * 1000) {
        clearDraft();
        return null;
      }
      return draft;
    } catch {
      return null;
    }
  };

  const clearDraft = () => {
    if (!import.meta.client) return;
    sessionStorage.removeItem(DRAFT_KEY);
  };

  const restoreDraft = (draft) => {
    if (!draft) return;
    if (draft.selectedDeliveryId) {
      checkoutStore.selectDelivery(draft.selectedDeliveryId);
    }
    if (draft.orderNote) {
      checkoutStore.orderNote = draft.orderNote;
    }
    if (draft.orderInsurance !== undefined) {
      checkoutStore.orderInsurance = draft.orderInsurance;
    }
    if (draft.secondaryContact) {
      checkoutStore.secondaryContact = { ...checkoutStore.secondaryContact, ...draft.secondaryContact };
    }
  };

  const startAutoSave = () => {
    if (!import.meta.client) return;
    watch(
      () => ({
        selectedDeliveryId: checkoutStore.selectedDeliveryId,
        orderNote: checkoutStore.orderNote,
        orderInsurance: checkoutStore.orderInsurance,
        secondaryContact: checkoutStore.secondaryContact,
      }),
      () => {
        saveDraft();
      },
      { deep: true }
    );
  };

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    restoreDraft,
    startAutoSave,
  };
}
