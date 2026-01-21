import { useToast } from 'vue-toastification'
import GlobalToast from '@/components/Toast/GlobalToast.vue'

export const useGlobalToast = () => {
  const toast = useToast()

  const show = (message, type = 'info', options = {}) => {
    toast(
      {
        component: GlobalToast,
        props: {
          message,
          type,
        },
      },
      {
        timeout: 3000,
        ...options,
      }
    )
  }

  return {
    success: (message, options) => show(message, 'success', options),
    error: (message, options) => show(message, 'error', options),
    warning: (message, options) => show(message, 'warning', options),
    info: (message, options) => show(message, 'info', options),
  }
}
