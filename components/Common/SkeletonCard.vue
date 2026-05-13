<template>
  <div class="skeleton-card-shell h-100 px-1 py-1">
    <div class="skeleton-card h-100">
      <div class="skeleton-image-area">
        <img src="/image/logo-irusgear-black.png" alt="" class="skeleton-logo-img" />
      </div>

      <div class="skeleton-body">
        <div class="skeleton-line skeleton-name"></div>

        <div class="skeleton-description">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line-short"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 1,
  },
});
</script>

<style scoped>
.skeleton-card-shell {
  padding-top: 8px !important;
}

.skeleton-card {
  background: #fff;
  border: 1px solid #e4e8ee;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  min-height: 100%;
}

.skeleton-image-area {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  background: #e2e6ea;
  position: relative;
  overflow: hidden;
}

.skeleton-image-area::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: skeletonShimmer 1.5s infinite;
}

.skeleton-logo-img {
  max-width: 70%;
  max-height: 70%;
  object-fit: contain;
  position: relative;
  z-index: 1;
  animation: skeletonPulse 2s infinite ease-in-out;
}

.skeleton-body {
  padding: 10px 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-description {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-line {
  height: 14px;
  border-radius: 6px;
  background: #eef1f4;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.skeleton-line::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: skeletonShimmer 1.5s infinite;
}

.skeleton-name {
  height: 22px;
  width: 75%;
}

.skeleton-line-short {
  width: 50%;
}

@keyframes skeletonShimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes skeletonPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
