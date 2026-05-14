<template>
  <div class="skeleton-feature-chip">
    <img src="/image/logo-irusgear-black.png" alt="" class="skeleton-feature-icon" />
    <div class="skeleton-feature-text">{{ $t('common.loading') }}</div>
  </div>
</template>

<style scoped>
.skeleton-feature-chip {
  min-width: 146px;
  min-height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f5f6f7;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
}

.skeleton-feature-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 7px;
  background: #e2e6ea;
  position: relative;
  overflow: hidden;
  object-fit: contain;
  padding: 2px;
  animation: skeletonPulse 2s infinite ease-in-out;
}

.skeleton-feature-icon::after {
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

.skeleton-feature-text {
  flex: 1 1 auto;
  height: 18px;
  border-radius: 6px;
  background: #eef1f4;
  position: relative;
  overflow: hidden;
  min-width: 60px;
  font-size: 0.73rem;
  font-weight: 600;
  line-height: 1.2;
  display: flex;
  align-items: center;
  color: #8fa0b0;
  padding: 0 4px;
  white-space: nowrap;
}

.skeleton-feature-text::after {
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

@keyframes skeletonShimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes skeletonPulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
