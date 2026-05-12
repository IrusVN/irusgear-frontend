import { ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

export const useMemberRankStore = defineStore("memberRank", () => {
  const feGlobalStore = useFeGlobalStore();

  // API-05 data
  const currentUser = ref(null);
  const ranks = ref([]);
  const isLoadingRank = ref(false);
  const hydratedRank = ref(false);

  // API-06 (benefits) data
  const shoppingBenefits = ref([]);
  const servicePolicies = ref([]);
  const isLoadingBenefits = ref(false);
  const hydratedBenefits = ref(false);

  const normalizeRankKey = (value) => {
    const key = String(value || "").trim().toLowerCase();
    if (!key) return "";
    return key.replace(/[^a-z0-9]/g, "");
  };

  const normalizeRank = (raw = {}) => {
    const key = normalizeRankKey(raw.key || raw.rank_key || raw.rankKey || raw.code || raw.name || raw.rank_name);

    return {
      key,
      name: raw.name || raw.rank_name || "",
      icon: raw.icon || "bi bi-star",
      spentThreshold: raw.spent_threshold || raw.threshold || null,
      spentThresholdFormatted: raw.spent_threshold_formatted || raw.threshold_display || "",
      benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
      upgradeConditions: raw.upgrade_conditions || null,
      isLocked: raw.is_locked ?? raw.status === "locked",
    };
  };

  const normalizeBenefit = (raw) => ({
    id: raw.id,
    type: raw.type,
    title: raw.title,
    description: raw.description,
    icon: raw.icon,
    isLocked: raw.is_locked,
  });

  const fetchMemberRank = async () => {
    if (hydratedRank.value) return { currentUser: currentUser.value, ranks: ranks.value };
    isLoadingRank.value = true;
    try {
      feGlobalStore.setApiUrl("member-rank");
      const res = await feGlobalStore.fetchItem();
      if (res?.success !== false) {
        const data = res?.data || {};
        const user = data.current_user || data;
        currentUser.value = {
          name: user.name,
          rankKey: normalizeRankKey(user.rank_key || user.rankKey),
          totalSpent: user.total_spent,
          totalSpentFormatted: user.total_spent_formatted,
          spentThreshold: user.spent_threshold,
          progressPercent: Number(user.progress_percent || 0),
          nextRankKey: normalizeRankKey(user.next_rank_key || user.nextRankKey),
          nextRankName: user.next_rank_name,
          nextRankThreshold: user.next_rank_threshold,
          amountToNextRankFormatted: user.amount_to_next_rank_formatted,
          renewalDate: user.renewal_date,
          isStudent: user.is_student,
          studentTag: user.student_tag,
        };
        ranks.value = (data.ranks || []).map(normalizeRank).filter((rank) => rank.key);
        hydratedRank.value = true;
      }
      return { currentUser: currentUser.value, ranks: ranks.value };
    } catch (e) {
      currentUser.value = null;
      ranks.value = [];
      return { currentUser: null, ranks: [] };
    } finally {
      isLoadingRank.value = false;
    }
  };

  const fetchBenefits = async () => {
    if (hydratedBenefits.value) {
      return { shoppingBenefits: shoppingBenefits.value, servicePolicies: servicePolicies.value };
    }
    isLoadingBenefits.value = true;
    try {
      feGlobalStore.setApiUrl("member-rank/benefits");
      const res = await feGlobalStore.fetchItem();
      if (res?.success !== false) {
        const data = res?.data || {};
        shoppingBenefits.value = (data.shopping_benefits || []).map(normalizeBenefit);
        servicePolicies.value = (data.service_policies || []).map(normalizeBenefit);
        hydratedBenefits.value = true;
      }
      return { shoppingBenefits: shoppingBenefits.value, servicePolicies: servicePolicies.value };
    } catch (e) {
      shoppingBenefits.value = [];
      servicePolicies.value = [];
      return { shoppingBenefits: [], servicePolicies: [] };
    } finally {
      isLoadingBenefits.value = false;
    }
  };

  const reset = () => {
    currentUser.value = null;
    ranks.value = [];
    isLoadingRank.value = false;
    hydratedRank.value = false;
    shoppingBenefits.value = [];
    servicePolicies.value = [];
    isLoadingBenefits.value = false;
    hydratedBenefits.value = false;
  };

  registerStore({ reset });

  return {
    currentUser,
    ranks,
    isLoadingRank,
    hydratedRank,
    shoppingBenefits,
    servicePolicies,
    isLoadingBenefits,
    hydratedBenefits,
    fetchMemberRank,
    fetchBenefits,
    reset,
  };
});
