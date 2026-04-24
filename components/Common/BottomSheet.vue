<template>
    <Teleport to="body">
        <Transition name="sheet-fade">
            <div v-if="isVisible" class="sheet-backdrop" @click="close">

                <div class="sheet-panel" @click.stop :style="panelStyle">

                    <div class="drag-handle-area" @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag">
                        <div class="drag-handle"></div>
                    </div>

                    <div class="sheet-content">
                        <slot :close="close"></slot>
                    </div>
                </div>

            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const emit = defineEmits(['open', 'close'])
const isVisible = ref(false)

const open = () => {
    isVisible.value = true
    emit('open')
}
const close = () => {
    isVisible.value = false
    currentY.value = 0
    emit('close')
}

defineExpose({ open, close })

const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

const startDrag = (e) => { startY.value = e.touches[0].clientY; isDragging.value = true }

const onDrag = (e) => {
    if (!isDragging.value) return
    const diff = e.touches[0].clientY - startY.value
    if (diff > 0) currentY.value = diff
}

const endDrag = () => {
    isDragging.value = false
    if (currentY.value > 100) close()
    else currentY.value = 0
}

const panelStyle = computed(() => {
    if (!isDragging.value && currentY.value === 0) return {}
    return { transform: `translateY(${currentY.value}px)`, transition: 'none' }
})

watch(isVisible, (val) => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = val ? 'hidden' : ''
    }
})
</script>

<style scoped>
.sheet-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    backdrop-filter: blur(2px);
}

.sheet-panel {
    width: 100%;
    max-height: 90vh;
    background: white;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sheet-content {
    overflow-y: auto;
    flex-grow: 1;
    padding: 0;
}

.drag-handle-area {
    width: 100%;
    padding: 12px 0;
    display: flex;
    justify-content: center;
    cursor: grab;
    background: white;
    flex-shrink: 0;
    touch-action: none;
}

.drag-handle {
    width: 48px;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 100px;
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
    transition: opacity 0.3s ease;
}

.sheet-fade-enter-active .sheet-panel,
.sheet-fade-leave-active .sheet-panel {
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
    opacity: 0;
}

.sheet-fade-enter-from .sheet-panel,
.sheet-fade-leave-to .sheet-panel {
    transform: translateY(100%);
}
</style>
