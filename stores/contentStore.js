import { ref } from "vue";
import { defineStore } from "pinia";
import { useRuntimeConfig, useRequestHeaders } from "#imports";

export const useContentStore = defineStore("content", () => {
  const config = useRuntimeConfig();

  const policies = ref([]);
  const terms = ref([]);
  const isLoadingPolicies = ref(false);
  const isLoadingTerms = ref(false);

  const apiFetch = async (endpoint) => {
    const headers = import.meta.server ? useRequestHeaders(["cookie"]) : {};
    return await $fetch(`${config.public.apiBaseUrl}/${endpoint}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
    });
  };

  const fetchPolicies = async () => {
    if (policies.value.length > 0) return policies.value;
    isLoadingPolicies.value = true;
    try {
      const res = await apiFetch("content/policies");
      policies.value = res?.data?.sections || res?.data || [];
      return policies.value;
    } catch (e) {
      policies.value = [];
      return [];
    } finally {
      isLoadingPolicies.value = false;
    }
  };

  const fetchTerms = async () => {
    if (terms.value.length > 0) return terms.value;
    isLoadingTerms.value = true;
    try {
      const res = await apiFetch("content/terms");
      terms.value = res?.data?.sections || res?.data || [];
      return terms.value;
    } catch (e) {
      terms.value = [];
      return [];
    } finally {
      isLoadingTerms.value = false;
    }
  };

  const reset = () => {
    policies.value = [];
    terms.value = [];
  };

  return {
    policies,
    terms,
    isLoadingPolicies,
    isLoadingTerms,
    fetchPolicies,
    fetchTerms,
    reset,
  };
});
