import { ref, onUnmounted } from 'vue'

export function useMediaQuery(query) {
  const matches = ref(false)

  if (import.meta.client) {
    const mql = window.matchMedia(query)
    matches.value = mql.matches
    const handler = (e) => { matches.value = e.matches }
    mql.addEventListener('change', handler)
    onUnmounted(() => mql.removeEventListener('change', handler))
  }

  return matches
}
