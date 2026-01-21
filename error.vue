<template>
  <div 
    class="min-vh-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden bg-white" 
    ref="errorPage" 
    @mousedown="startDrag" 
    @mousemove="onDrag" 
    @mouseup="endDrag" 
    @mouseleave="endDrag"
    style="cursor: crosshair; user-select: none;"
  >
    <!-- Banner SVG -->
    <svg class="position-absolute top-0 start-0 w-100 h-100 pe-none" style="z-index: 5;" v-if="isDragging || showBanner">
      <defs>
        <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff6b9d" />
          <stop offset="50%" style="stop-color:#c44569" />
          <stop offset="100%" style="stop-color:#ff6b9d" />
        </linearGradient>
      </defs>
      <path :d="bannerPath" fill="url(#bannerGradient)" stroke="#ff4081" stroke-width="2" />
    </svg>

    <!-- Main Content -->
    <div class="text-center position-relative p-4" style="z-index: 2;">
      <h1 class="display-1 fw-bold text-dark mb-2">{{ error?.statusCode || '404' }}</h1>
      <h2 class="display-4 fw-bold text-dark mb-3">Oops!</h2>
      <p class="fs-5 text-secondary mb-2">{{ error?.message || 'Trang bạn tìm kiếm không tồn tại' }}</p>
      <p class="text-muted fst-italic mb-4">Kéo chuột để tạo băng rôn và thả ra để xem hiệu ứng pháo hoa!</p>
      <button @click="handleError" class="btn btn-dark btn-lg rounded-pill px-5 py-3 d-inline-flex align-items-center gap-2">
        <i class="bi bi-house-door"></i>
        Về trang chủ
      </button>
    </div>

    <!-- Confetti & Ribbons -->
    <div class="position-absolute top-0 start-0 w-100 h-100 pe-none" style="z-index: 100;" ref="confettiContainer"></div>
    <div class="position-absolute top-0 start-0 w-100 h-100 pe-none" style="z-index: 100;" ref="ribbonsContainer"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ error: Object })

const errorPage = ref(null)
const confettiContainer = ref(null)
const ribbonsContainer = ref(null)

const isDragging = ref(false)
const showBanner = ref(false)
const startPos = ref({ x: 0, y: 0 })
const currentPos = ref({ x: 0, y: 0 })
const bannerPath = ref('')

const handleError = () => clearError({ redirect: '/' })

function startDrag(e) {
  isDragging.value = true
  const rect = errorPage.value.getBoundingClientRect()
  startPos.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  currentPos.value = { ...startPos.value }
  updateBannerPath()
}

function onDrag(e) {
  if (!isDragging.value) return
  const rect = errorPage.value.getBoundingClientRect()
  currentPos.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  updateBannerPath()
}

function updateBannerPath() {
  const { x: startX, y: startY } = startPos.value
  const { x: endX, y: endY } = currentPos.value
  const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)
  
  if (distance < 20) { bannerPath.value = ''; return }
  
  const thickness = 15 + distance * 0.05
  const radius = thickness / 2
  const waves = Math.floor(distance / 40) + 2
  const angle = Math.atan2(endY - startY, endX - startX)
  const perpAngle = angle + Math.PI / 2
  const offsetX = Math.cos(perpAngle) * radius
  const offsetY = Math.sin(perpAngle) * radius
  
  let path = `M ${startX + offsetX} ${startY + offsetY} A ${radius} ${radius} 0 0 1 ${startX - offsetX} ${startY - offsetY}`
  
  for (let i = 1; i <= waves; i++) {
    const x = startX + (endX - startX) * (i / waves)
    const y = startY + (endY - startY) * (i / waves)
    const waveOffset = (i % 2 === 0 ? 1 : -1) * 10
    const cpX = startX + (endX - startX) * ((i - 0.5) / waves)
    const cpY = startY + (endY - startY) * ((i - 0.5) / waves) + waveOffset
    path += ` Q ${cpX - offsetX} ${cpY - offsetY} ${x - offsetX} ${y - offsetY}`
  }
  
  path += ` A ${radius} ${radius} 0 0 1 ${endX + offsetX} ${endY + offsetY}`
  
  for (let i = waves; i >= 1; i--) {
    const x = startX + (endX - startX) * ((i - 1) / waves)
    const y = startY + (endY - startY) * ((i - 1) / waves)
    const waveOffset = (i % 2 === 0 ? 1 : -1) * 10
    const cpX = startX + (endX - startX) * ((i - 0.5) / waves)
    const cpY = startY + (endY - startY) * ((i - 0.5) / waves) + waveOffset
    path += ` Q ${cpX + offsetX} ${cpY + offsetY} ${x + offsetX} ${y + offsetY}`
  }
  
  bannerPath.value = path + ' Z'
}

function endDrag() {
  if (!isDragging.value) return
  const distance = Math.sqrt((currentPos.value.x - startPos.value.x) ** 2 + (currentPos.value.y - startPos.value.y) ** 2)
  if (distance > 50) createExplosion()
  isDragging.value = false
  showBanner.value = false
  bannerPath.value = ''
}

function createExplosion() {
  const centerX = (startPos.value.x + currentPos.value.x) / 2
  const centerY = (startPos.value.y + currentPos.value.y) / 2
  const colors = ['#ff6b9d', '#c44569', '#ff4081', '#f48fb1', '#ffd54f', '#4fc3f7', '#81c784', '#ba68c8']
  
  for (let i = 0; i < 50; i++) createConfetti(centerX, centerY, colors[i % 8])
  for (let i = 0; i < 15; i++) createRibbon(centerX, centerY, colors[i % 8])
}

function createConfetti(x, y, color) {
  const el = document.createElement('div')
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${Math.random()*10+5}px;height:${Math.random()*10+5}px;background:${color};border-radius:${Math.random()>0.5?'50%':'2px'};pointer-events:none;`
  confettiContainer.value.appendChild(el)
  
  const angle = Math.random() * Math.PI * 2
  const v = Math.random() * 400 + 200
  el.animate([
    { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
    { transform: `translate(${Math.cos(angle)*v}px,${Math.sin(angle)*v+200}px) rotate(${Math.random()*720-360}deg)`, opacity: 0 }
  ], { duration: 1000 + Math.random() * 500, easing: 'ease-out' }).onfinish = () => el.remove()
}

function createRibbon(x, y, color) {
  const w = Math.random() * 8 + 4
  const el = document.createElement('div')
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${Math.random()*60+40}px;background:linear-gradient(180deg,${color},transparent);border-radius:${w/2}px;pointer-events:none;`
  ribbonsContainer.value.appendChild(el)
  
  const angle = Math.random() * Math.PI * 2
  const v = Math.random() * 300 + 150
  el.animate([
    { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
    { transform: `translate(${Math.cos(angle)*v}px,${Math.sin(angle)*v+300}px) rotate(${Math.random()*360-180}deg)`, opacity: 0 }
  ], { duration: 1500 + Math.random() * 500, easing: 'ease-out' }).onfinish = () => el.remove()
}
</script>
