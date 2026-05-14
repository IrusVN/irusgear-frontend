import { onMounted, onUnmounted, nextTick } from 'vue'

/**
 * @param {Ref} sheetRef - Ref của component Sheet
 * @param {Function|Boolean} shouldOpenCondition - Điều kiện để mở (VD: step === 2)
 */
export function useMobileSheet(sheetRef, shouldOpenCondition = true) {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      sheetRef.value?.close();
    }
  }

  onMounted(() => {
    const conditionMet = typeof shouldOpenCondition === 'function' 
      ? shouldOpenCondition() 
      : shouldOpenCondition;

    if (conditionMet && window.innerWidth < 768) {
      setTimeout(() => {
        sheetRef.value?.open();
      }, 100);
    }
    window.addEventListener('resize', handleResize);
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  })
  return {
    handleResize
  }
}
