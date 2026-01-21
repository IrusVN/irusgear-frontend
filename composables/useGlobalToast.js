import { useToast } from 'vue-toastification'
import Toast from '@/components/Toast/Toast.vue'

export const useGlobalToast = () => {
  const toast = useToast()

  const show = (message, type = 'info', options = {}) => {
    toast(
      {
        component: Toast,
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
