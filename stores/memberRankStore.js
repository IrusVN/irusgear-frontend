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

  const normalizeRank = (raw) => ({
    key: raw.rank_key,
    name: raw.rank_name,
    icon: raw.icon,
    spentThreshold: raw.spent_threshold,
    spentThresholdFormatted: raw.spent_threshold_formatted,
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
    upgradeConditions: raw.upgrade_conditions,
    isLocked: raw.is_locked,
  });

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
        currentUser.value = {
          name: data.name,
          rankKey: data.rank_key,
          totalSpent: data.total_spent,
          totalSpentFormatted: data.total_spent_formatted,
          spentThreshold: data.spent_threshold,
          progressPercent: data.progress_percent,
          nextRankKey: data.next_rank_key,
          nextRankName: data.next_rank_name,
          nextRankThreshold: data.next_rank_threshold,
          amountToNextRankFormatted: data.amount_to_next_rank_formatted,
          renewalDate: data.renewal_date,
          isStudent: data.is_student,
          studentTag: data.student_tag,
        };
        ranks.value = (data.ranks || []).map(normalizeRank);
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
