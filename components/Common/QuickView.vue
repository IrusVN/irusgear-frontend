<template>
  <Teleport to="body">
    <Transition name="quick-view-fade">
      <div
        v-if="modelValue"
        class="quick-view"
        :class="overlayClass"
        :style="{ zIndex }"
        role="presentation"
        @click.self="handleOverlayClick"
      >
        <aside
          class="quick-view__panel"
          :class="panelClass"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <!-- Grab handle mobile-only: gợi ý có thể vuốt để đóng + nhìn giống native bottom sheet -->
          <div class="quick-view__handle" aria-hidden="true"></div>

          <!-- Header: cho phép override hoàn toàn qua slot, nếu không thì render title + close mặc định -->
          <header v-if="!hideHeader" class="quick-view__header" :class="headerClass">
            <slot name="header">
              <h2 :id="titleId" class="quick-view__title">{{ title }}</h2>
              <button
                v-if="!hideClose"
                type="button"
                class="quick-view__close"
                :aria-label="closeLabel"
                @click="close"
              >
                <i class="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            </slot>
          </header>

          <!-- Body wrapper: scrollable area giữa header và footer.
               Khi consumer cần bọc <form> bao quanh cả body+footer thì dùng slot "body-wrapper". -->
          <slot name="body-wrapper">
            <div class="quick-view__body" :class="bodyClass">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="quick-view__footer" :class="footerClass">
              <slot name="footer" />
            </footer>
          </slot>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, useId, watch } from 'vue'

/**
 * Shared right-side drawer (slide từ phải sang).
 * Quản lý: teleport, overlay backdrop, transition fade + slide, ESC close,
 * body scroll lock, click-outside close. UI bên trong do consumer cung cấp qua slot.
 *
 * Slots:
 *  - default: nội dung body (đã có wrapper scrollable)
 *  - footer:  nội dung footer (sticky bottom)
 *  - header:  override toàn bộ header (mất title + close button mặc định)
 *  - body-wrapper: override hẳn body + footer (vd: bọc <form> quanh cả 2)
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closeLabel: { type: String, default: 'Đóng' },
  /** Width của panel (vd: "454px" hoặc "min(540px, 92vw)"). */
  width: { type: String, default: '454px' },
  /** Cho phép đóng khi click overlay. */
  closeOnOverlay: { type: Boolean, default: true },
  /** Cho phép đóng khi nhấn Escape. */
  closeOnEsc: { type: Boolean, default: true },
  /** Khoá scroll body khi mở. */
  lockBodyScroll: { type: Boolean, default: true },
  hideHeader: { type: Boolean, default: false },
  hideClose: { type: Boolean, default: false },
  /** z-index của overlay — set cao hơn nếu drawer mở chồng. */
  zIndex: { type: [Number, String], default: 10030 },
  overlayClass: { type: [String, Array, Object], default: '' },
  panelClass: { type: [String, Array, Object], default: '' },
  headerClass: { type: [String, Array, Object], default: '' },
  bodyClass: { type: [String, Array, Object], default: '' },
  footerClass: { type: [String, Array, Object], default: '' },
})

const emit = defineEmits(['update:modelValue', 'close', 'open'])

const titleId = `qv-${useId()}`
let previousBodyOverflow = ''

const panelStyle = computed(() => ({ width: `min(${props.width}, calc(100vw - 16px))` }))

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) close()
}

const onKeydown = (event) => {
  if (event.key === 'Escape' && props.modelValue && props.closeOnEsc) close()
}

const lock = () => {
  if (!props.lockBodyScroll || typeof document === 'undefined') return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

const unlock = () => {
  if (!props.lockBodyScroll || typeof document === 'undefined') return
  document.body.style.overflow = previousBodyOverflow
}

watch(
  () => props.modelValue,
  (visible) => {
    if (typeof window === 'undefined') return
    if (visible) {
      lock()
      window.addEventListener('keydown', onKeydown)
      emit('open')
    } else {
      unlock()
      window.removeEventListener('keydown', onKeydown)
    }
  }
)

onBeforeUnmount(() => {
  unlock()
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.quick-view {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 16px 0;
  background: rgba(0, 0, 0, 0.56);
  backdrop-filter: blur(3px);
}

.quick-view__panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.18);
}

.quick-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  height: 45px;
  padding: 0 14px 0 13px;
  border-bottom: 1px solid #edf0f3;
}

.quick-view__title {
  margin: 0;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
}

.quick-view__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #6b7280;
  cursor: pointer;
  background: #f3f4f6;
  border: 0;
  border-radius: 50%;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.quick-view__close:hover {
  color: #111827;
  background: #e5e7eb;
}

.quick-view__close i {
  font-size: 10px;
  line-height: 1;
}

/* Grab handle: ẩn ở desktop, hiện ở mobile (xem media query bên dưới) */
.quick-view__handle {
  display: none;
}

/* Transition: overlay fade + panel slide-in từ phải (desktop default) */
.quick-view-fade-enter-active,
.quick-view-fade-leave-active {
  transition: opacity 0.2s ease;
}

.quick-view-fade-enter-from,
.quick-view-fade-leave-to {
  opacity: 0;
}

.quick-view-fade-enter-active .quick-view__panel,
.quick-view-fade-leave-active .quick-view__panel {
  transition: transform 0.24s ease;
}

.quick-view-fade-enter-from .quick-view__panel,
.quick-view-fade-leave-to .quick-view__panel {
  transform: translateX(16px);
}

/* ─── Mobile: bottom sheet style ───
   Thay vì full-screen drawer (cảm giác như form Web cũ), dùng bottom sheet
   chiếm 92vh từ dưới lên, top rounded, có grab handle gợi ý native UX.
   Slide từ dưới lên thay vì từ phải sang.
   Safe-area inset cho devices có notch / home indicator. */
@media (max-width: 640px) {
  .quick-view {
    padding: 0;
    align-items: flex-end;
    justify-content: stretch;
  }

  .quick-view__panel {
    width: 100% !important;
    height: auto;
    max-height: 92vh;
    border-radius: 16px 16px 0 0;
    padding-top: 6px;
    box-shadow: 0 -8px 32px rgba(15, 23, 42, 0.18);
  }

  .quick-view__handle {
    display: block;
    width: 36px;
    height: 4px;
    margin: 6px auto 0;
    background: #d1d5db;
    border-radius: 999px;
    flex: 0 0 auto;
  }

  .quick-view__header {
    height: 52px;
    padding: 0 16px;
  }

  .quick-view__title {
    font-size: 15px;
  }

  /* Close button to hơn + dễ tap (Apple HIG ≥ 44px) */
  .quick-view__close {
    width: 32px;
    height: 32px;
  }

  .quick-view__close i {
    font-size: 14px;
  }

  /* Slide-up transition cho mobile, override slide-from-right desktop */
  .quick-view-fade-enter-from .quick-view__panel,
  .quick-view-fade-leave-to .quick-view__panel {
    transform: translateY(100%);
  }
}
</style>

<style>
/* Helper layout classes — UNSCOPED để consumer dùng được trong body-wrapper slot.
   Render dù bởi QuickView (default body slot) hay bởi consumer (custom form wrapper)
   đều áp dụng đồng nhất.
   .quick-view__body  → vùng scrollable nội dung
   .quick-view__footer → thanh nút sticky đáy panel */
.quick-view__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 13px;
  min-height: 0;
  padding: 16px 18px 24px;
  overflow-y: auto;
  /* Cho phép momentum scroll mượt trên iOS */
  -webkit-overflow-scrolling: touch;
}

.quick-view__footer {
  flex: 0 0 auto;
  padding: 13px 18px 24px;
  background: #fff;
  box-shadow: 0 -18px 34px rgba(255, 255, 255, 0.96);
}

/* Mobile: thêm safe-area inset cho devices có home indicator (iPhone X+);
   inputs ≥ 16px để iOS Safari không auto-zoom khi focus.
   Phải dùng :global (unscoped) vì đè lên class quick-view__body / __footer
   của QuickView từ trong block CSS không scoped. */
@media (max-width: 640px) {
  .quick-view__body {
    padding: 16px 16px 20px;
  }

  .quick-view__footer {
    padding: 12px 16px max(16px, env(safe-area-inset-bottom));
  }

  /* iOS auto-zoom guard cho input bên trong quick-view */
  .quick-view__panel input,
  .quick-view__panel select,
  .quick-view__panel textarea {
    font-size: 16px;
  }
}
</style>
