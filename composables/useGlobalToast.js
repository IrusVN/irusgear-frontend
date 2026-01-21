import GlobalToast from '@/components/Toast/GlobalToast.vue'

export const useGlobalToast = () => {
  const nuxtApp = useNuxtApp()

  const show = (message, type = 'info', options = {}) => {
    // Only run on client-side where toast is available
    if (import.meta.client && nuxtApp.$toast) {
      nuxtApp.$toast(
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
  }

  return {
    success: (message, options) => show(message, 'success', options),
    error: (message, options) => show(message, 'error', options),
    warning: (message, options) => show(message, 'warning', options),
    info: (message, options) => show(message, 'info', options),
  }
}
