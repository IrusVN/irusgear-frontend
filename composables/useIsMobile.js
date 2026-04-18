import { ref, onMounted, onUnmounted } from 'vue'

/**
 * SSR-safe composable to detect mobile viewport (≤768px).
 * Defaults to `false` on server — client hydration will correct.
 */
export function useIsMobile() {
  const isMobile = ref(false)
  let mql = null

  const update = () => {
    if (mql) isMobile.value = mql.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    mql = window.matchMedia('(max-width: 768px)')
    isMobile.value = mql.matches
    mql.addEventListener('change', update)
  })

  onUnmounted(() => {
    if (mql) mql.removeEventListener('change', update)
  })

  return { isMobile }
}
