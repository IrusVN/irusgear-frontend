import { computed, ref } from 'vue'
import { useRuntimeConfig, useRequestHeaders } from '#imports'

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

const DEFAULT_MAX_FILES = 5

const createClientId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useProofPhotoUpload = () => {
  const config = useRuntimeConfig()
  const items = ref([])
  const error = ref(null)

  const isUploading = computed(() => items.value.some((item) => item.status === 'uploading'))
  const uploadedItems = computed(() => items.value.filter((item) => item.status === 'uploaded'))
  const hasFailedUploads = computed(() => items.value.some((item) => item.status === 'failed'))

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

  const toUploadFilePayload = (photo) => {
    const file = photo?.file || photo

    return {
      clientId: photo?.id || photo?.clientId || createClientId(),
      filename: file.name || 'proof-photo',
      contentType: file.type || 'application/octet-stream',
      size: file.size || 0,
      file,
    }
  }

  const validateFiles = (files, { maxFiles = DEFAULT_MAX_FILES } = {}) => {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('Cần ít nhất 1 ảnh bằng chứng giao hàng.')
    }

    if (files.length > maxFiles) {
      throw new Error(`Chỉ được tải tối đa ${maxFiles} ảnh.`)
    }

    files.forEach((item, index) => {
      if (!(item.file instanceof File)) {
        throw new Error(`Ảnh ${index + 1} không hợp lệ.`)
      }

      if (!ALLOWED_IMAGE_TYPES.has(item.contentType)) {
        throw new Error(`Ảnh ${index + 1} có định dạng không hỗ trợ.`)
      }

      if (!item.size || item.size < 1) {
        throw new Error(`Ảnh ${index + 1} không có dung lượng hợp lệ.`)
      }
    })
  }

  const createUploadTargets = async (orderId, photos, action) => {
    const files = photos.map(toUploadFilePayload)
    validateFiles(files)

    const response = await fetch(`${config.public.apiBaseUrl}/shipper/orders/${orderId}/proof-photos/upload-targets`, {
      method: 'POST',
      credentials: 'include',
      headers: buildHeaders(),
      body: JSON.stringify({
        action,
        files: files.map(({ clientId, filename, contentType, size }) => ({
          clientId,
          filename,
          contentType,
          size,
        })),
      }),
    })

    if (response.status === 401) {
      throw await parseApiError(response)
    }

    if (!response.ok) {
      throw await parseApiError(response)
    }

    const body = await response.json()
    const targets = body?.data?.uploads || []

    return files.map((file) => {
      const target = targets.find((item) => item.clientId === file.clientId)

      if (!target?.uploadUrl) {
        throw new Error(`Không tạo được upload URL cho ảnh ${file.filename}.`)
      }

      if (!target?.cdnUrl) {
        throw new Error('Proof photo CDN URL is not configured.')
      }

      return {
        ...file,
        target,
      }
    })
  }

  const uploadFileToTarget = (file, target, onProgress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(target.method || 'PUT', target.uploadUrl)

    Object.entries(target.headers || {}).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      onProgress?.(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100)
        resolve({
          uploadId: target.uploadId,
          storageKey: target.storageKey,
          cdnUrl: target.cdnUrl,
          contentType: target.contentType,
          size: target.size,
          action: target.action,
        })
        return
      }

      reject(new Error(`Upload ảnh thất bại với HTTP ${xhr.status}.`))
    }

    xhr.onerror = () => reject(new Error('Upload ảnh thất bại do lỗi mạng.'))
    xhr.onabort = () => reject(new Error('Upload ảnh đã bị hủy.'))
    xhr.send(file)
  })

  const uploadPhotos = async (orderId, photos, action) => {
    error.value = null
    const filesWithTargets = await createUploadTargets(orderId, photos, action)

    items.value = filesWithTargets.map(({ file, target, clientId, filename, contentType, size }) => ({
      clientId,
      filename,
      contentType,
      size,
      file,
      target,
      progress: 0,
      status: 'queued',
      error: null,
      uploadId: null,
      storageKey: null,
      cdnUrl: null,
    }))

    for (const item of items.value) {
      item.status = 'uploading'
      item.error = null

      try {
        const uploaded = await uploadFileToTarget(item.file, item.target, (progress) => {
          item.progress = progress
        })

        Object.assign(item, {
          ...uploaded,
          status: 'uploaded',
          progress: 100,
        })
      } catch (uploadError) {
        item.status = 'failed'
        item.error = uploadError.message
        error.value = uploadError.message
        throw uploadError
      }
    }

    return uploadedItems.value.map(({ uploadId, storageKey, cdnUrl, contentType, size, action: itemAction }) => ({
      uploadId,
      storageKey,
      url: cdnUrl,
      contentType,
      size,
      action: itemAction,
    }))
  }

  const reset = () => {
    items.value = []
    error.value = null
  }

  return {
    items,
    error,
    isUploading,
    uploadedItems,
    hasFailedUploads,
    createUploadTargets,
    uploadFileToTarget,
    uploadPhotos,
    reset,
  }
}
