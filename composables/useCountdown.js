import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Countdown composable.
 * @param {Date|number|null} targetDate — defaults to end of today
 * @returns {{ hours, minutes, seconds, isExpired }}
 */
export function useCountdown(targetDate = null) {
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const isExpired = ref(false)
  let timer = null

  const getTarget = () => {
    if (targetDate instanceof Date) return targetDate.getTime()
    if (typeof targetDate === 'number') return targetDate
    // Default: end of today
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime()
  }

  const tick = () => {
    const diff = Math.max(0, getTarget() - Date.now())
    if (diff <= 0) {
      hours.value = 0
      minutes.value = 0
      seconds.value = 0
      isExpired.value = true
      if (timer) clearInterval(timer)
      return
    }

    const totalSec = Math.floor(diff / 1000)
    hours.value = Math.floor(totalSec / 3600)
    minutes.value = Math.floor((totalSec % 3600) / 60)
    seconds.value = totalSec % 60
    isExpired.value = false
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { hours, minutes, seconds, isExpired }
}
