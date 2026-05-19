import { ref } from "vue";

/**
 * Composable that lazily generates a UUID v4 idempotency key for a single
 * client-driven submission. The key persists across retries triggered by
 * 5xx / network errors so the backend can replay the original response,
 * and resets only after the caller explicitly invokes `reset()` (after a
 * successful submit or when the user discards the form).
 *
 * Usage:
 *   const { ensure, reset, value } = useIdempotencyKey()
 *   await api.complete(payload, { headers: { 'Idempotency-Key': ensure() } })
 *   reset()
 */
export function useIdempotencyKey() {
  const value = ref(null);

  const generate = () => {
    if (typeof globalThis.crypto?.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    // Fallback (non-cryptographic): RFC4122 v4 layout. Used only when the
    // browser doesn't expose `crypto.randomUUID` (very old WebViews).
    const bytes = new Uint8Array(16);
    if (typeof globalThis.crypto?.getRandomValues === "function") {
      globalThis.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  const ensure = () => {
    if (!value.value) value.value = generate();
    return value.value;
  };

  const reset = () => {
    value.value = null;
  };

  return { ensure, reset, value };
}
