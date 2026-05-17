import { toast } from "vue-sonner";
import { useNuxtApp } from "#imports";

/**
 * Promise-based confirm dialog using vue-sonner toast.
 * Resolves true if user clicks confirm action, false on cancel/dismiss/timeout.
 *
 * Replaces native window.confirm() which blocks the JS thread and breaks UX consistency.
 *
 * @example
 *   const { confirm } = useConfirm();
 *   const ok = await confirm({
 *     message: t('admin.products.deleteConfirm', { name: item.name }),
 *     variant: 'danger',
 *   });
 *   if (!ok) return;
 *
 * @param {object} opts
 * @param {string} opts.message       - Main confirmation message
 * @param {string} [opts.description] - Optional description below message
 * @param {string} [opts.confirmLabel] - Confirm button label (defaults to t('common.confirmYes'))
 * @param {string} [opts.cancelLabel]  - Cancel button label (defaults to t('common.confirmNo'))
 * @param {'default'|'danger'} [opts.variant='default']
 * @param {number} [opts.duration=10000] - Auto-dismiss after N ms (resolves false)
 * @returns {Promise<boolean>}
 */
export const confirmAction = ({
  message,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
  duration = 10000,
} = {}) => {
  // Resolve i18n labels if not provided
  let resolvedConfirm = confirmLabel;
  let resolvedCancel = cancelLabel;
  if (!resolvedConfirm || !resolvedCancel) {
    try {
      const { $i18n } = useNuxtApp();
      const t = $i18n?.t?.bind($i18n);
      if (t) {
        resolvedConfirm = resolvedConfirm || t("common.confirmYes");
        resolvedCancel = resolvedCancel || t("common.confirmNo");
      }
    } catch {
      // SSR or no i18n — fall through to English defaults
    }
  }
  resolvedConfirm = resolvedConfirm || "Confirm";
  resolvedCancel = resolvedCancel || "Cancel";

  return new Promise((resolve) => {
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const toastFn = variant === "danger" ? toast.warning : toast;

    toastFn(message, {
      description,
      duration,
      action: {
        label: resolvedConfirm,
        onClick: () => settle(true),
      },
      cancel: {
        label: resolvedCancel,
        onClick: () => settle(false),
      },
      onDismiss: () => settle(false),
      onAutoClose: () => settle(false),
    });
  });
};

export const useConfirm = () => ({
  confirm: confirmAction,
});
