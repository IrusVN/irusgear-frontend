// stores/searchStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFeGlobalStore } from '@/stores/feGlobalStore'
import { getDeviceId } from '@/utils/deviceId'

export const useSearchStore = defineStore('search', () => {
  const history = ref([])
  const trending = ref([])
  const suggestions = ref([])
  const products = ref([])
  const loading = ref(false)
  const suggestionsLoading = ref(false)

  const api = () => useFeGlobalStore()
  const deviceIdHeader = () => ({ 'X-Device-Id': getDeviceId() || '' })

  // Lấy lịch sử tìm kiếm
  const fetchHistory = async () => {
    loading.value = true
    try {
      const res = await api().fetchWithHeaders(
        'search/history',
        {},
        deviceIdHeader()
      )
      history.value = res?.data?.history || []
    } catch (e) {
      console.error('fetchHistory error', e)
    } finally {
      loading.value = false
    }
  }

  // Lưu từ khóa tìm kiếm (POST /search/history)
  const saveKeyword = async (keyword) => {
    if (!keyword?.trim()) return
    try {
      await api().createItemWithPath('search/history', {
        keyword: keyword.trim(),
      })
      await fetchHistory()
    } catch (e) {
      console.error('saveKeyword error', e)
    }
  }

  // Xóa toàn bộ lịch sử
  const clearHistory = async () => {
    try {
      await api().deleteWithHeaders('search/history', deviceIdHeader())
      history.value = []
    } catch (e) {
      console.error('clearHistory error', e)
    }
  }

  // Xóa 1 item history
  const removeHistoryItem = async (id) => {
    try {
      await api().deleteWithHeaders(`search/history/${id}`, deviceIdHeader())
      history.value = history.value.filter(h => h.id !== id)
    } catch (e) {
      console.error('removeHistoryItem error', e)
    }
  }

  // Lấy trending (không cần auth)
  const fetchTrending = async () => {
    try {
      const res = await api().fetchWithHeaders('search/trending', {})
      trending.value = res?.data?.trending || []
    } catch (e) {
      console.error('fetchTrending error', e)
    }
  }

  // Autocomplete suggestions — debounced với coalescing
  let _suggestionTimer = null
  let _pendingSuggestion = null

  const fetchSuggestions = async (query) => {
    if (query.length < 1) {
      suggestions.value = []
      products.value = []
      return
    }
    if (suggestionsLoading.value) {
      _pendingSuggestion = query
      return
    }
    clearTimeout(_suggestionTimer)
    _suggestionTimer = setTimeout(async () => {
      suggestionsLoading.value = true
      try {
        const res = await api().fetchWithHeaders(
          `search/suggestions?q=${encodeURIComponent(query)}`,
          {},
          {}
        )
        suggestions.value = res?.data?.suggestions || []
        products.value = res?.data?.products || []
      } catch (e) {
        suggestions.value = []
        products.value = []
      } finally {
        suggestionsLoading.value = false
        if (_pendingSuggestion !== null) {
          const pending = _pendingSuggestion
          _pendingSuggestion = null
          fetchSuggestions(pending)
        }
      }
    }, 300)
  }

  // Clear suggestions khi input < 2 chars
  const clearSuggestions = () => {
    suggestions.value = []
    products.value = []
    _pendingSuggestion = null
  }

  return {
    history,
    trending,
    suggestions,
    products,
    loading,
    suggestionsLoading,
    fetchHistory,
    saveKeyword,
    clearHistory,
    removeHistoryItem,
    fetchTrending,
    fetchSuggestions,
    clearSuggestions,
  }
})
