<template>
  <div
    ref="containerRef"
    class="address-search-select"
    :class="{
      'address-search-select--open': isOpen,
      'address-search-select--disabled': disabled,
      'address-search-select--error': error,
    }"
  >
    <button
      type="button"
      class="address-search-select__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="'listbox'"
      @click="toggleDropdown"
      @keydown="handleKeydown"
    >
      <span v-if="selectedOption" class="address-search-select__value">
        {{ selectedOption.label }}
      </span>
      <span v-else class="address-search-select__placeholder">
        {{ placeholder }}
      </span>
      <i :class="isOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </button>

    <div v-if="isOpen" class="address-search-select__dropdown" role="listbox">
      <div class="address-search-select__search">
        <i class="bi bi-search"></i>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          class="address-search-select__search-input"
          :placeholder="$t('checkout.searchAddress')"
          @input="onSearch"
          @keydown="handleKeydown"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="address-search-select__clear"
          @click="searchQuery = ''"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="address-search-select__options">
        <div v-if="filteredOptions.length === 0" class="address-search-select__empty">
          {{ $t("checkout.noResults") }}
        </div>

        <button
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          type="button"
          :class="[
            'address-search-select__option',
            { 'address-search-select__option--selected': option.value === modelValue?.value },
            { 'address-search-select__option--focused': index === focusedIndex },
          ]"
          role="option"
          :aria-selected="option.value === modelValue?.value"
          @click="selectOption(option)"
          @mouseenter="focusedIndex = index"
        >
          <span>{{ option.label }}</span>
          <i v-if="option.value === modelValue?.value" class="bi bi-check"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Chọn...",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const isOpen = ref(false);
const searchQuery = ref("");
const focusedIndex = ref(0);
const containerRef = ref(null);
const searchInputRef = ref(null);

const selectedOption = computed(() => {
  if (!props.modelValue) return null;
  return props.options.find((o) => o.value === props.modelValue.value) || props.modelValue;
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const q = searchQuery.value.toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

const toggleDropdown = async () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = "";
    focusedIndex.value = 0;
    await nextTick();
    searchInputRef.value?.focus();
  }
};

const selectOption = (option) => {
  emit("update:modelValue", option);
  emit("change", option);
  isOpen.value = false;
  searchQuery.value = "";
};

const onSearch = () => {
  focusedIndex.value = 0;
};

const handleKeydown = (e) => {
  if (!isOpen.value) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      isOpen.value = true;
      nextTick(() => searchInputRef.value?.focus());
    }
    return;
  }

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      focusedIndex.value = Math.min(focusedIndex.value + 1, filteredOptions.value.length - 1);
      break;
    case "ArrowUp":
      e.preventDefault();
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
      break;
    case "Enter":
      e.preventDefault();
      if (filteredOptions.value[focusedIndex.value]) {
        selectOption(filteredOptions.value[focusedIndex.value]);
      }
      break;
    case "Escape":
      isOpen.value = false;
      break;
  }
};

const handleClickOutside = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

watch(isOpen, (val) => {
  if (val) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

onMounted(() => {
  if (props.modelValue && props.options.length > 0) {
    const found = props.options.find((o) => o.value === props.modelValue.value);
    if (found && found !== props.modelValue) {
      emit("update:modelValue", found);
    }
  }
});
</script>

<style scoped>
.address-search-select {
  position: relative;
}

.address-search-select--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.address-search-select--error .address-search-select__trigger {
  border-color: #be123c;
}

.address-search-select__trigger {
  align-items: center;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 8px;
  justify-content: space-between;
  min-height: 44px;
  padding: 8px 12px;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}

.address-search-select__trigger:hover {
  border-color: #d4d4d8;
}

.address-search-select--open .address-search-select__trigger {
  border-color: #d70018;
  box-shadow: 0 0 0 3px rgba(215, 0, 24, 0.1);
}

.address-search-select__placeholder {
  color: #a1a1aa;
}

.address-search-select__value {
  color: #18181b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address-search-select__trigger i {
  color: #71717a;
  flex-shrink: 0;
}

.address-search-select__dropdown {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  left: 0;
  max-height: 300px;
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 150;
}

.address-search-select__search {
  align-items: center;
  border-bottom: 1px solid #f0f0f2;
  display: flex;
  gap: 8px;
  padding: 10px 12px;
}

.address-search-select__search > i {
  color: #71717a;
  flex-shrink: 0;
}

.address-search-select__search-input {
  border: none;
  flex: 1;
  font-size: 14px;
  outline: none;
  width: 100%;
}

.address-search-select__clear {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}

.address-search-select__options {
  max-height: 240px;
  overflow-y: auto;
}

.address-search-select__option {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 8px;
  justify-content: space-between;
  padding: 10px 14px;
  text-align: left;
  transition: background 0.1s ease;
  width: 100%;
}

.address-search-select__option:hover,
.address-search-select__option--focused {
  background: #f7f7f8;
}

.address-search-select__option--selected {
  color: #d70018;
  font-weight: 600;
}

.address-search-select__empty {
  color: #71717a;
  font-size: 13px;
  padding: 16px;
  text-align: center;
}
</style>
