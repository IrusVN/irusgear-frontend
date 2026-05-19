<template>
  <div
    ref="root"
    class="quick-select"
    :class="[
      { 'is-open': isOpen, 'is-disabled': disabled, 'has-error': error },
      sizeClass,
    ]"
  >
    <button
      :id="triggerId"
      type="button"
      class="quick-select__trigger"
      :disabled="disabled"
      :aria-haspopup="'listbox'"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      @click.stop="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="quick-select__value" :class="{ 'is-placeholder': !selectedOption }">
        <i
          v-if="selectedOption?.icon"
          class="bi quick-select__option-icon"
          :class="selectedOption.icon"
          aria-hidden="true"
        ></i>
        <span class="quick-select__value-text">
          {{ selectedOption?.label ?? placeholder }}
        </span>
      </span>
      <i class="bi bi-chevron-down quick-select__chevron" aria-hidden="true"></i>
    </button>

    <Transition name="quick-select-menu">
      <ul
        v-if="isOpen"
        :id="menuId"
        ref="menu"
        class="quick-select__menu"
        role="listbox"
        :aria-labelledby="triggerId"
        :aria-activedescendant="focusedOption ? optionId(focusedOption) : undefined"
        tabindex="-1"
        @keydown.stop="onMenuKeydown"
      >
        <li
          v-for="(opt, idx) in options"
          :key="opt.value"
          role="option"
          :id="optionId(opt)"
          :aria-selected="isSelected(opt)"
          class="quick-select__option"
          :class="{
            'is-selected': isSelected(opt),
            'is-focused': focusedIndex === idx,
            'is-danger': opt.variant === 'danger',
          }"
          @click="pick(opt)"
          @mouseenter="focusedIndex = idx"
        >
          <i v-if="opt.icon" class="bi quick-select__option-icon" :class="opt.icon" aria-hidden="true"></i>
          <span class="quick-select__option-label">{{ opt.label }}</span>
          <span v-if="opt.description" class="quick-select__option-desc">{{ opt.description }}</span>
          <i
            v-if="isSelected(opt)"
            class="bi bi-check2 quick-select__check"
            aria-hidden="true"
          ></i>
        </li>

        <li v-if="!options.length" class="quick-select__option is-muted" aria-disabled="true">
          {{ emptyLabel }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

/**
 * Custom dropdown component — drop-in replacement cho native <select>.
 *
 * Tại sao không dùng native <select>?
 *   - Style trên iOS Safari & Android không thể custom (border-radius, padding, font-weight bị
 *     ép theo system UI).
 *   - Không hỗ trợ icon, description, group divider.
 *   - Bị browser auto-zoom khi font-size < 16px (iOS).
 *
 * Features:
 *   - v-model (string | number | boolean) — bind thẳng vào option.value
 *   - Keyboard nav: Arrow Up/Down focus, Enter chọn, Esc đóng, Home/End đầu/cuối
 *   - Click outside để đóng
 *   - Mobile responsive: option to hơn (44px min touch target), font-size 16px tránh iOS zoom
 *   - Hỗ trợ icon (Bootstrap Icons class) + description
 *
 * Usage:
 *   <QuickSelect
 *     v-model="form.status"
 *     :options="[
 *       { value: 'active', label: 'Active', icon: 'bi-check-circle' },
 *       { value: 'inactive', label: 'Inactive', icon: 'bi-pause-circle' },
 *     ]"
 *     placeholder="Chọn trạng thái"
 *   />
 */
const props = defineProps({
  modelValue: { type: [String, Number, Boolean, null], default: null },
  /**
   * @type {Array<{ value: any, label: string, icon?: string, description?: string, variant?: 'danger' }>}
   */
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Chọn...' },
  disabled: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  emptyLabel: { type: String, default: 'Không có lựa chọn' },
  size: {
    type: String,
    default: 'md', // 'sm' | 'md' | 'lg'
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const root = ref(null)
const menu = ref(null)
const isOpen = ref(false)
const focusedIndex = ref(-1)

const uid = useId()
const triggerId = `qs-trigger-${uid}`
const menuId = `qs-menu-${uid}`
const optionId = (opt) => `qs-opt-${uid}-${String(opt.value)}`

const sizeClass = computed(() => `quick-select--${props.size}`)

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue) ?? null
)

const focusedOption = computed(() =>
  focusedIndex.value >= 0 ? props.options[focusedIndex.value] : null
)

const isSelected = (opt) => opt.value === props.modelValue

const open = async () => {
  if (props.disabled) return
  // Singleton: nếu có QuickSelect khác đang mở → đóng nó trước. Tránh nhiều
  // menu hiện chồng nhau (xem screenshot user báo).
  if (activeClose && activeClose !== close) {
    activeClose()
  }
  activeClose = close
  isOpen.value = true
  // Pre-focus item đang được chọn để keyboard nav bắt đầu từ đó
  const idx = props.options.findIndex((o) => o.value === props.modelValue)
  focusedIndex.value = idx >= 0 ? idx : 0
  await nextTick()
  menu.value?.focus()
}

const close = () => {
  isOpen.value = false
  focusedIndex.value = -1
  if (activeClose === close) {
    activeClose = null
  }
}

const toggle = () => (isOpen.value ? close() : open())

const pick = (opt) => {
  if (opt.value !== props.modelValue) {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
  }
  close()
}

const moveFocus = (delta) => {
  if (!props.options.length) return
  const len = props.options.length
  const next = (focusedIndex.value + delta + len) % len
  focusedIndex.value = next
}

const onTriggerKeydown = (event) => {
  // Mở menu khi nhấn các phím navigation, hoặc Space/Enter
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault()
    open()
  }
}

const onMenuKeydown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      moveFocus(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      moveFocus(-1)
      break
    case 'Home':
      event.preventDefault()
      focusedIndex.value = 0
      break
    case 'End':
      event.preventDefault()
      focusedIndex.value = props.options.length - 1
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (focusedOption.value) pick(focusedOption.value)
      break
    case 'Escape':
    case 'Tab':
      close()
      break
  }
}

const onDocumentClick = (event) => {
  if (!root.value || root.value.contains(event.target)) return
  close()
}

watch(
  () => props.disabled,
  (d) => {
    if (d) close()
  }
)

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', onDocumentClick)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocumentClick)
  }
  // Nếu instance này đang là owner của singleton → null ra để instance khác mở được.
  if (activeClose === close) activeClose = null
})
</script>

<script>
// Module-scope (chia sẻ giữa mọi instance QuickSelect) — trỏ tới hàm `close`
// của instance đang mở. Plain let thay vì reactive ref vì không cần render reactive.
let activeClose = null
</script>

<style scoped>
.quick-select {
  position: relative;
  display: block;
  width: 100%;
}

.quick-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 0 12px;
  background: #fff;
  border: 1px solid #cfd4dc;
  border-radius: 6px;
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  outline: 0;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.quick-select__trigger:hover:not(:disabled) {
  border-color: #98a2b3;
}

.quick-select__trigger:focus-visible {
  border-color: #98a2b3;
  box-shadow: 0 0 0 3px rgba(152, 162, 179, 0.18);
}

.quick-select.is-open .quick-select__trigger {
  border-color: #98a2b3;
  box-shadow: 0 0 0 3px rgba(152, 162, 179, 0.18);
}

.quick-select.is-disabled .quick-select__trigger {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.quick-select.has-error .quick-select__trigger {
  border-color: #e45464;
}

.quick-select.has-error.is-open .quick-select__trigger {
  box-shadow: 0 0 0 3px rgba(228, 84, 100, 0.18);
}

/* Size variants */
.quick-select--sm .quick-select__trigger { height: 32px; font-size: 12px; }
.quick-select--md .quick-select__trigger { height: 39px; font-size: 13px; }
.quick-select--lg .quick-select__trigger { height: 44px; font-size: 14px; }

.quick-select__value {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.quick-select__value-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-select__value.is-placeholder .quick-select__value-text {
  color: #b1b6c0;
  font-weight: 500;
}

.quick-select__chevron {
  flex-shrink: 0;
  color: #4b5563;
  font-size: 13px;
  transition: transform 0.18s ease;
}

.quick-select.is-open .quick-select__chevron {
  transform: rotate(180deg);
}

.quick-select__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 1100;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
  max-height: 240px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  outline: 0;
}

.quick-select__menu::-webkit-scrollbar {
  width: 4px;
}

.quick-select__menu::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

.quick-select__option {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 4px 10px;
  padding: 8px 10px;
  border-radius: 6px;
  color: #111827;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.12s ease, color 0.12s ease;
}

.quick-select__option:not(.is-muted):hover,
.quick-select__option.is-focused {
  background: #f3f4f6;
}

.quick-select__option.is-selected {
  background: var(--irus-color-accent-soft, #fef2f4);
  color: var(--irus-color-accent, #e11d48);
}

.quick-select__option.is-selected.is-focused {
  background: var(--irus-color-accent-soft, #fef2f4);
  filter: brightness(0.97);
}

.quick-select__option.is-danger {
  color: #d70018;
}

.quick-select__option.is-danger:hover,
.quick-select__option.is-danger.is-focused {
  background: rgba(215, 0, 24, 0.06);
}

.quick-select__option.is-muted {
  color: #9ca3af;
  cursor: default;
  grid-template-columns: 1fr;
}

.quick-select__option-icon {
  grid-column: 1;
  font-size: 14px;
  color: inherit;
  opacity: 0.85;
}

.quick-select__option-label {
  grid-column: 2;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-select__option-desc {
  grid-column: 2;
  grid-row: 2;
  font-size: 11px;
  font-weight: 400;
  color: #6b7280;
  margin-top: 2px;
}

.quick-select__check {
  grid-column: 3;
  font-size: 14px;
  color: inherit;
}

/* Transition cho menu */
.quick-select-menu-enter-active,
.quick-select-menu-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.quick-select-menu-enter-from,
.quick-select-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Mobile (≤640px) ──
   - font-size 16px trên trigger để Safari iOS không zoom khi user click.
   - touch target ≥ 44px (Apple HIG) cho option + trigger.
   - menu full-width có thể overflow xuống dưới ở list cuối page → vẫn ổn vì position absolute. */
@media (max-width: 640px) {
  .quick-select--sm .quick-select__trigger,
  .quick-select--md .quick-select__trigger,
  .quick-select--lg .quick-select__trigger {
    height: 44px;
    font-size: 16px;
  }

  .quick-select__option {
    min-height: 44px;
    padding: 10px 12px;
    font-size: 15px;
  }

  .quick-select__menu {
    max-height: 60vh;
  }
}

/* ── Tablet 641–991px ──
   Vẫn giữ trigger compact nhưng option to hơn 1 chút. */
@media (min-width: 641px) and (max-width: 991px) {
  .quick-select__option {
    min-height: 38px;
    padding: 9px 11px;
  }
}
</style>
