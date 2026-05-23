import { computed, ref } from 'vue'
import { useI18n, useRequestHeaders, useRuntimeConfig } from '#imports'

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

const MAX_AVATAR_BYTES = 3 * 1024 * 1024

export const useAvatarUpload = () => {
  const config = useRuntimeConfig()
  const { t } = useI18n()
  const progress = ref(0)
  const error = ref(null)
  const status = ref('idle')

  const isUploading = computed(() => ['creating', 'uploading', 'confirming'].includes(status.value))

  const buildHeaders = (extra = {}) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...extra,
    }

    if (import.meta.server) {
      const reqHeaders = useRequestHeaders(['cookie'])
      if (reqHeaders.cookie) {
        headers.cookie = reqHeaders.cookie
      }
    }

    return headers
  }

  const parseApiError = async (response) => {
    let body = {}

    try {
      body = await response.json()
    } catch (_) {}

    const apiError = new Error(body?.error?.message || body?.message || `HTTP ${response.status}`)
    apiError.status = response.status
    apiError.code = body?.error?.code
    apiError.data = body
    apiError.errors = body?.errors || null

    return apiError
  }

  const validateFile = (file) => {
    if (!(file instanceof File)) {
      throw new Error(t('profile.layout.avatar.errors.invalidFile'))
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error(t('profile.layout.avatar.errors.unsupportedType'))
    }

    if (!file.size || file.size < 1) {
      throw new Error(t('profile.layout.avatar.errors.emptyFile'))
    }

    if (file.size > MAX_AVATAR_BYTES) {
      throw new Error(t('profile.layout.avatar.errors.tooLarge'))
    }
  }

  const createUploadTarget = async (file) => {
    const response = await fetch(`${config.public.apiBaseUrl}/user/avatar/upload-target`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({
        filename: file.name || 'avatar',
        contentType: file.type,
        size: file.size,
      }),
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    const body = await response.json()
    const target = body?.data

    if (!target?.uploadUrl || !target?.storageKey || !target?.cdnUrl) {
      throw new Error(t('profile.layout.avatar.errors.createTargetFailed'))
    }

    return target
  }

  const uploadFileToTarget = (file, target) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(target.method || 'PUT', target.uploadUrl)

    Object.entries(target.headers || {}).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      progress.value = Math.round((event.loaded / event.total) * 100)
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        progress.value = 100
        resolve()
        return
      }

      reject(new Error(t('profile.layout.avatar.errors.uploadHttpFailed', { status: xhr.status })))
    }

    xhr.onerror = () => reject(new Error(t('profile.layout.avatar.errors.networkFailed')))
    xhr.onabort = () => reject(new Error(t('profile.layout.avatar.errors.aborted')))
    xhr.send(file)
  })

  const confirmUpload = async (target, file) => {
    const response = await fetch(`${config.public.apiBaseUrl}/user/avatar/confirm`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({
        uploadId: target.uploadId,
        storageKey: target.storageKey,
        cdnUrl: target.cdnUrl,
        contentType: target.contentType || file.type,
        size: file.size,
      }),
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    return await response.json()
  }

  const uploadAvatar = async (file) => {
    error.value = null
    progress.value = 0

    try {
      validateFile(file)

      status.value = 'creating'
      const target = await createUploadTarget(file)

      status.value = 'uploading'
      await uploadFileToTarget(file, target)

      status.value = 'confirming'
      const response = await confirmUpload(target, file)

      status.value = 'done'
      return response
    } catch (uploadError) {
      status.value = 'failed'
      error.value = uploadError.message
      throw uploadError
    }
  }

  const reset = () => {
    progress.value = 0
    error.value = null
    status.value = 'idle'
  }

  return {
    error,
    progress,
    status,
    isUploading,
    uploadAvatar,
    reset,
  }
}
