<template>
  <div class="error-page" ref="heroRef">
    <!-- Braces text -->
    <p class="braces">{{ $t('error.cantFind') || "we can't find that page..." }}</p>
    
    <!-- Main heading -->
    <h1 class="error-heading">{{ $t('error.oops') || 'Oops' }}</h1>

    <!-- Hero section -->
    <section class="pricing-hero" data-block="pricing-hero">
      <div class="container">
        <div class="pricing-hero__content">
          <div class="pricing-hero__flair">
            <!-- Custom cursor hand -->
            <div class="pricing-hero__hand" ref="handRef">
              <img class="pricing-hero__drag" src="https://assets.codepen.io/16327/hand-drag.png" alt="" ref="dragRef">
              <img class="pricing-hero__rock" src="https://assets.codepen.io/16327/hand-rock.png" alt="" ref="rockRef">
              <img class="pricing-hero__handle" src="https://assets.codepen.io/16327/2D-circle.png" alt="" ref="handleRef">
              <small ref="instructionsRef">{{ $t('error.dragMe') || 'drag me' }}</small>
            </div>

            <!-- Image preloaders -->
            <div class="image-preload" aria-hidden="true">
              <img v-for="img in preloadImages" :key="img.key" :data-key="img.key" :src="img.src" width="1" height="1" />
            </div>
            <div class="explosion-preload" aria-hidden="true">
              <img v-for="img in explosionImages" :key="img.key" :data-key="img.key" :src="img.src" />
            </div>
          </div>
        </div>
        <svg class="pricing-hero__canvas" ref="canvasRef"></svg>
        <div class="pricing-hero__proxy" ref="proxyRef"></div>
      </div>
    </section>

    <!-- Back home button -->
    <button @click="handleError" class="back-home-btn">
      <i class="bi bi-house-door"></i>
      {{ $t('error.backHome') || 'Back Home' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

defineProps({ error: Object })

const authStore = useAuthStore()

// Load GSAP from CDN
useHead({
  script: [
    { src: 'https://unpkg.com/gsap@3/dist/gsap.min.js', defer: true },
    { src: 'https://unpkg.com/gsap@3/dist/Observer.min.js', defer: true },
    { src: 'https://unpkg.com/gsap@3/dist/CustomEase.min.js', defer: true },
    { src: 'https://unpkg.com/gsap@3/dist/CustomWiggle.min.js', defer: true },
    { src: 'https://unpkg.com/gsap@3/dist/Physics2DPlugin.min.js', defer: true },
  ]
})

// Refs
const heroRef = ref(null)
const handRef = ref(null)
const dragRef = ref(null)
const rockRef = ref(null)
const handleRef = ref(null)
const instructionsRef = ref(null)
const canvasRef = ref(null)
const proxyRef = ref(null)

// State
let isDrawing = false
let currentLine = null
let startImage = null
let circle = null
let startX = 0
let startY = 0
let lastDistance = 0
let imageMap = {}
let imageKeys = []
let explosionMap = {}
let explosionKeys = []
let xSetter = null
let ySetter = null
let clamper = null

// Preload images data
const preloadImages = [
  { key: 'combo', src: 'https://assets.codepen.io/16327/3D-combo.png' },
  { key: 'cone', src: 'https://assets.codepen.io/16327/3D-cone.png' },
  { key: 'hoop', src: 'https://assets.codepen.io/16327/3D-hoop.png' },
  { key: 'keyframe', src: 'https://assets.codepen.io/16327/3D-keyframe.png' },
  { key: 'semi', src: 'https://assets.codepen.io/16327/3D-semi.png' },
  { key: 'spiral', src: 'https://assets.codepen.io/16327/3D-spiral.png' },
  { key: 'squish', src: 'https://assets.codepen.io/16327/3D-squish.png' },
  { key: 'triangle', src: 'https://assets.codepen.io/16327/3D-triangle.png' },
  { key: 'tunnel', src: 'https://assets.codepen.io/16327/3D-tunnel.png' },
  { key: 'wat', src: 'https://assets.codepen.io/16327/3D-poly.png' }
]

const explosionImages = [
  { key: 'blue-circle', src: 'https://assets.codepen.io/16327/2D-circles.png' },
  { key: 'green-keyframe', src: 'https://assets.codepen.io/16327/2D-keyframe.png' },
  { key: 'orange-lightning', src: 'https://assets.codepen.io/16327/2D-lightning.png' },
  { key: 'orange-star', src: 'https://assets.codepen.io/16327/2D-star.png' },
  { key: 'purple-flower', src: 'https://assets.codepen.io/16327/2D-flower.png' },
  { key: 'cone', src: 'https://assets.codepen.io/16327/3D-cone.png' },
  { key: 'spiral', src: 'https://assets.codepen.io/16327/3D-spiral.png' },
  { key: 'tunnel', src: 'https://assets.codepen.io/16327/3D-tunnel.png' },
  { key: 'hoop', src: 'https://assets.codepen.io/16327/3D-hoop.png' },
  { key: 'semi', src: 'https://assets.codepen.io/16327/3D-semi.png' }
]

const handleError = async () => {
  await authStore.fetchUser();
  clearError({ redirect: '/' });
}

// Wait for GSAP to load from CDN
function waitForGSAP() {
  return new Promise((resolve) => {
    const checkGSAP = () => {
      if (window.gsap && window.Observer && window.CustomWiggle && window.Physics2DPlugin) {
        window.gsap.registerPlugin(window.Observer, window.CustomEase, window.CustomWiggle, window.Physics2DPlugin)
        resolve()
      } else {
        setTimeout(checkGSAP, 50)
      }
    }
    checkGSAP()
  })
}

function initImageMaps() {
  const preloadContainer = heroRef.value?.querySelector('.image-preload')
  const explosionContainer = heroRef.value?.querySelector('.explosion-preload')
  
  if (preloadContainer) {
    preloadContainer.querySelectorAll('img').forEach(img => {
      const key = img.dataset.key
      imageMap[key] = img
      imageKeys.push(key)
    })
  }
  
  if (explosionContainer) {
    explosionContainer.querySelectorAll('img').forEach(img => {
      const key = img.dataset.key
      explosionMap[key] = img
      explosionKeys.push(key)
    })
  }
}

function initAnimation() {
  const gsap = window.gsap
  const Observer = window.Observer
  const CustomWiggle = window.CustomWiggle
  
  if (!gsap || !heroRef.value) return
  
  const animationIsOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  CustomWiggle.create('myWiggle', { wiggles: 6 })
  clamper = gsap.utils.clamp(1, 100)
  
  xSetter = gsap.quickTo(handRef.value, 'x', { duration: 0.1 })
  ySetter = gsap.quickTo(handRef.value, 'y', { duration: 0.1 })
  
  gsap.set(handRef.value, { xPercent: -50, yPercent: -50 })
  
  if (!animationIsOk) return
  
  if (isTouch) {
    Observer.create({
      target: proxyRef.value,
      type: 'touch',
      onPress: (e) => createExplosion(e.x, e.y, 400)
    })
  } else {
    heroRef.value.style.cursor = 'none'
    
    heroRef.value.addEventListener('mouseenter', (e) => {
      gsap.set(handRef.value, { opacity: 1 })
      xSetter(e.x, e.x)
      ySetter(e.y, e.y)
    })
    
    heroRef.value.addEventListener('mouseleave', () => {
      gsap.set(handRef.value, { opacity: 0 })
    })
    
    heroRef.value.addEventListener('mousemove', (e) => {
      xSetter(e.x)
      ySetter(e.y)
    })
    
    Observer.create({
      target: proxyRef.value,
      type: 'pointer',
      onPress: (e) => startDrawing(e),
      onDrag: (e) => isDrawing && updateDrawing(e),
      onDragEnd: (e) => clearDrawing(e),
      onRelease: (e) => clearDrawing(e)
    })
  }
  
  // Initial explosion
  gsap.delayedCall(1, () => {
    createExplosion(window.innerWidth / 2, window.innerHeight / 2, 600)
  })
}

function startDrawing(e) {
  const gsap = window.gsap
  isDrawing = true
  
  gsap.set(instructionsRef.value, { opacity: 0 })
  
  startX = e.x
  startY = e.y + window.scrollY
  
  // Create line
  currentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  currentLine.setAttribute('x1', startX)
  currentLine.setAttribute('y1', startY)
  currentLine.setAttribute('x2', startX)
  currentLine.setAttribute('y2', startY)
  currentLine.setAttribute('stroke', '#0e100f')
  currentLine.setAttribute('stroke-width', '2')
  currentLine.setAttribute('stroke-dasharray', '4')
  
  circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('cx', startX)
  circle.setAttribute('cy', startY)
  circle.setAttribute('r', '30')
  circle.setAttribute('fill', '#ffffff')
  
  // Create image at start point
  const randomKey = gsap.utils.random(imageKeys)
  const original = imageMap[randomKey]
  const clone = document.createElementNS('http://www.w3.org/2000/svg', 'image')
  
  clone.setAttribute('x', startX - 25)
  clone.setAttribute('y', startY - 25)
  clone.setAttribute('width', '50')
  clone.setAttribute('height', '50')
  clone.setAttributeNS('http://www.w3.org/1999/xlink', 'href', original.src)
  
  startImage = clone
  
  canvasRef.value.appendChild(currentLine)
  canvasRef.value.appendChild(circle)
  canvasRef.value.appendChild(startImage)
  
  gsap.set(dragRef.value, { opacity: 1 })
  gsap.set(handleRef.value, { opacity: 1 })
  gsap.set(rockRef.value, { opacity: 0 })
}

function updateDrawing(e) {
  const gsap = window.gsap
  if (!currentLine || !startImage || !gsap) return
  
  const cursorX = e.x
  const cursorY = e.y + window.scrollY
  
  const dx = cursorX - startX
  const dy = cursorY - startY
  
  const distance = Math.sqrt(dx * dx + dy * dy)
  const shrink = (distance - 30) / distance
  
  let x2 = startX + dx * shrink
  let y2 = startY + dy * shrink
  
  if (distance < 30) {
    x2 = startX
    y2 = startY
  }
  
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  
  gsap.to(currentLine, {
    attr: { x2, y2 },
    duration: 0.1,
    ease: 'none'
  })
  
  // Eased scale
  const raw = distance / 100
  const eased = Math.pow(raw, 0.5)
  const clamped = clamper(eased)
  
  gsap.set([startImage, circle], {
    scale: clamped,
    rotation: `${angle + -45}_short`,
    transformOrigin: 'center center'
  })
  
  // Move & rotate hand
  gsap.to(handRef.value, {
    rotation: `${angle + -90}_short`,
    duration: 0.1,
    ease: 'none'
  })
  
  lastDistance = distance
}

function createExplosion(x, y, distance = 100) {
  const gsap = window.gsap
  if (!gsap) return
  
  const count = Math.round(gsap.utils.clamp(3, 100, distance / 20))
  const angleSpread = Math.PI * 2
  const explosion = gsap.timeline()
  const speed = gsap.utils.mapRange(0, 500, 0.3, 1.5, distance)
  const sizeRange = gsap.utils.mapRange(0, 500, 20, 60, distance)
  
  for (let i = 0; i < count; i++) {
    const randomKey = gsap.utils.random(explosionKeys)
    const original = explosionMap[randomKey]
    if (!original) continue
    
    const img = original.cloneNode(true)
    
    img.className = 'explosion-img'
    img.style.position = 'absolute'
    img.style.pointerEvents = 'none'
    img.style.height = `${gsap.utils.random(20, sizeRange)}px`
    img.style.left = `${x}px`
    img.style.top = `${y}px`
    img.style.zIndex = '4'
    
    heroRef.value.appendChild(img)
    
    const angle = Math.random() * angleSpread
    const velocity = gsap.utils.random(500, 1500) * speed
    
    explosion
      .to(img, {
        physics2D: {
          angle: angle * (180 / Math.PI),
          velocity: velocity,
          gravity: 3000
        },
        rotation: gsap.utils.random(-180, 180),
        duration: 1 + Math.random()
      }, 0)
      .to(img, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.out',
        onComplete: () => img.remove()
      }, 1)
  }
  
  return explosion
}

function clearDrawing() {
  const gsap = window.gsap
  if (!isDrawing || !gsap) return
  
  createExplosion(startX, startY, lastDistance)
  
  gsap.set(dragRef.value, { opacity: 0 })
  gsap.set(handleRef.value, { opacity: 0 })
  gsap.set(rockRef.value, { opacity: 1 })
  
  gsap.to(rockRef.value, {
    duration: 0.4,
    rotation: '+=30',
    ease: 'myWiggle',
    onComplete: () => {
      gsap.set(rockRef.value, { opacity: 0 })
      gsap.set(handRef.value, { rotation: 0, overwrite: 'auto' })
      gsap.to(instructionsRef.value, { opacity: 1 })
      gsap.set(dragRef.value, { opacity: 1 })
    }
  })
  
  isDrawing = false
  
  // Clear all elements from SVG
  if (canvasRef.value) {
    canvasRef.value.innerHTML = ''
  }
  currentLine = null
  startImage = null
}

definePageMeta({
  layout: false
})

onMounted(async () => {
  await waitForGSAP()
  initImageMaps()
  initAnimation()
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
:root {
  --color-surface-white: #fffce1;
  --color-just-black: #0e100f;
  --light: #fffce1;
}

.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #ffff;
  position: relative;
}

.error-heading {
  position: relative;
  font-size: 15vw;
  width: 100%;
  text-align: center;
  z-index: 999;
  pointer-events: none;
  color: #0e100f;
  margin: 0;
  font-weight: bold;
}

.braces {
  pointer-events: none;
  position: relative;
  color: #0e100f;
  margin-bottom: 1rem;
  z-index: 999;
  font-size: 1.2rem;
}

.braces::before {
  position: absolute;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 27 78'%3E%3Cpath fill='%230e100f' d='M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z'%3E%3C/path%3E%3C/svg%3E");
  right: 100%;
  height: 2rem;
  transform: translateY(-50%);
  top: 50%;
  aspect-ratio: 1/2;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: 0.5rem;
}

.braces::after {
  position: absolute;
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 27 78'%3E%3Cpath fill='%230e100f' d='M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z'%3E%3C/path%3E%3C/svg%3E");
  left: 100%;
  height: 2rem;
  transform: rotate(180deg) translateY(50%);
  top: 50%;
  aspect-ratio: 1/2;
  background-repeat: no-repeat;
  background-size: contain;
  margin-left: 0.5rem;
}

.pricing-hero {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}

.pricing-hero .container {
  width: 100%;
  height: 100%;
}

.pricing-hero__content {
  padding-bottom: max(4rem, min(10.7443vw + 1.4818rem, 14.375rem));
  padding-top: max(4rem, min(10.7443vw + 1.4818rem, 14.375rem));
  text-align: center;
  width: 100%;
}

.pricing-hero__flair {
  display: block;
  margin: max(2rem, min(2.0712vw + 1.51456rem, 4rem)) auto max(2rem, min(6.21359vw + 0.543689rem, 8rem));
  width: 100%;
}

.pricing-hero__hand {
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  width: 30px;
  z-index: 4;
}

.pricing-hero__hand small {
  left: -60%;
  position: absolute;
  top: 20px;
  width: 200%;
  color: #fffce1;
  font-size: 12px;
}

.pricing-hero__drag,
.pricing-hero__rock {
  position: absolute;
  z-index: 4;
  max-width: 141%;
  right: 1px;
  top: -22px;
  width: 131%;
}

.pricing-hero__rock {
  opacity: 0;
}

.pricing-hero__drag {
  opacity: 1;
}

.pricing-hero__handle {
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: -40px;
  width: 100%;
}

.pricing-hero__canvas {
  z-index: -1;
}

.pricing-hero__canvas,
.pricing-hero__proxy {
  bottom: 0;
  height: 100vh;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
}

.pricing-hero__proxy {
  z-index: 3;
}

.image-preload,
.explosion-preload {
  position: absolute;
  left: -9999px;
  visibility: hidden;
}

.image-preload img,
.explosion-preload img {
  position: absolute;
  left: -9999px;
}

.back-home-btn {
  position: relative;
  z-index: 1000;
  background: #0e100f;
  color: #ffff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 2rem;
}

.back-home-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(255, 252, 225, 0.3);
}

.back-home-btn:active {
  transform: scale(0.98);
}

:deep(.explosion-img) {
  will-change: transform;
}

::selection {
  background: transparent;
}

::-moz-selection {
  background: transparent;
}
</style>
