// utils/deviceId.js
// Device fingerprint cho anonymous user — persist trong localStorage
const DEVICE_ID_KEY = 'irusgear_device_id'

export function getDeviceId() {
  if (typeof window === 'undefined') return null

  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}
