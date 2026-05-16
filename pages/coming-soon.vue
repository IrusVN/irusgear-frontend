<template>
  <div class="cs-shell">
    <!-- SVG background base -->
    <div class="cs-bg" aria-hidden="true"></div>
    <!-- Purple gradient overlay để text trắng đọc được + match màu hình mẫu -->
    <div class="cs-overlay" aria-hidden="true"></div>
    <!-- Decorative blurred blobs -->
    <div class="cs-blob cs-blob--purple" aria-hidden="true"></div>
    <div class="cs-blob cs-blob--pink" aria-hidden="true"></div>

    <!-- Top-right hamburger -->
    <button
      type="button"
      class="cs-menu-btn"
      aria-label="Menu"
      @click="onMenuClick"
    >
      <i class="bi bi-list"></i>
    </button>

    <!-- Right-side social icons -->
    <ul class="cs-socials" aria-label="Social links">
      <li v-for="s in socials" :key="s.name">
        <a :href="s.href" target="_blank" rel="noopener" :aria-label="s.name" class="cs-social-link">
          <i :class="s.icon"></i>
        </a>
      </li>
    </ul>

    <!-- Center content -->
    <main class="cs-center">
      <h1 class="cs-title">Launching Soon</h1>

      <div class="cs-countdown" role="timer" aria-live="polite">
        <div class="cs-count-item">
          <div class="cs-count-value">{{ days }}</div>
          <div class="cs-count-label">DAYS</div>
        </div>
        <div class="cs-count-item">
          <div class="cs-count-value">{{ hours }}</div>
          <div class="cs-count-label">HOURS</div>
        </div>
        <div class="cs-count-item">
          <div class="cs-count-value">{{ minutes }}</div>
          <div class="cs-count-label">MINUTES</div>
        </div>
      </div>

      <p class="cs-subtitle">We'll let you know when we are Launching</p>

      <form class="cs-form" @submit.prevent="notify">
        <input
          v-model="email"
          type="email"
          class="cs-form__input"
          placeholder="Email Address"
          :disabled="submitting"
          required
        />
        <button
          type="submit"
          class="cs-form__btn"
          :disabled="submitting"
        >
          <span
            v-if="submitting"
            class="spinner-border spinner-border-sm text-white me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ submitting ? "Sending..." : "Notify Me" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue-sonner";

definePageMeta({
  layout: false,
});

useHead({
  title: "Launching Soon — IrusGear",
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap",
    },
  ],
});

// Target = 20 ngày kể từ hôm nay (2026-05-16) → 2026-06-05.
// Có thể đổi sang ngày khác mà không break logic countdown.
const TARGET_DATE = new Date("2026-06-05T00:00:00");

const now = ref(new Date());
let intervalId = null;

const diffMs = computed(() => Math.max(0, TARGET_DATE.getTime() - now.value.getTime()));

const pad = (n) => String(n).padStart(2, "0");
const days = computed(() => pad(Math.floor(diffMs.value / 86_400_000)));
const hours = computed(() => pad(Math.floor((diffMs.value % 86_400_000) / 3_600_000)));
const minutes = computed(() => pad(Math.floor((diffMs.value % 3_600_000) / 60_000)));

onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
});

const socials = [
  { name: "Facebook", icon: "bi bi-facebook", href: "https://facebook.com" },
  { name: "Twitter", icon: "bi bi-twitter", href: "https://twitter.com" },
  { name: "LinkedIn", icon: "bi bi-linkedin", href: "https://linkedin.com" },
  { name: "Instagram", icon: "bi bi-instagram", href: "https://instagram.com" },
  { name: "Dribbble", icon: "bi bi-dribbble", href: "https://dribbble.com" },
];

const email = ref("");
const submitting = ref(false);

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const notify = async () => {
  if (submitting.value) return;

  if (!isValidEmail(email.value)) {
    toast.error("Vui lòng nhập email hợp lệ");
    return;
  }

  submitting.value = true;
  try {
    // Stub: thay bằng API thật khi backend có endpoint /coming-soon/subscribe
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Chúng tôi sẽ gửi thông báo đến ${email.value}`);
    email.value = "";
  } catch (e) {
    toast.error(e?.message || "Không thể đăng ký, vui lòng thử lại");
  } finally {
    submitting.value = false;
  }
};

const onMenuClick = () => {
  // Placeholder — image chỉ có icon, chưa có menu thực sự
  toast.info("Menu");
};
</script>

<style scoped>
.cs-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #fff;
  overflow: hidden;
  isolation: isolate;
}

/* Lớp 1: SVG background gốc */
.cs-bg {
  position: absolute;
  inset: 0;
  background-image: url("/image/background-image.svg");
  background-size: cover;
  background-position: center;
  z-index: -3;
}

/* Lớp 2: Black & white gradient overlay (đen → xám đậm) */
.cs-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #1c1c1c 35%,
    #2a2a2a 70%,
    #3d3d3d 100%
  );
  opacity: 0.94;
  z-index: -2;
}

/* Lớp 3: 2 blob blur tông trắng/xám tạo chiều sâu */
.cs-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  z-index: -1;
  pointer-events: none;
}

.cs-blob--purple {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  top: -120px;
  left: -120px;
}

.cs-blob--pink {
  width: 620px;
  height: 620px;
  background: radial-gradient(circle, #d4d4d4 0%, transparent 70%);
  bottom: -180px;
  right: -180px;
}

/* Hamburger top-right */
.cs-menu-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.18);
  border: 0;
  border-radius: 10px;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s ease, transform 0.2s ease;
  z-index: 10;
}

.cs-menu-btn:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}

/* Vertical social icons (right side) */
.cs-socials {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 10;
}

.cs-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  backdrop-filter: blur(6px);
  transition: background 0.2s ease, transform 0.2s ease;
}

.cs-social-link:hover {
  background: rgba(255, 255, 255, 0.32);
  transform: scale(1.08);
  color: #fff;
}

/* Center content */
.cs-center {
  position: relative;
  z-index: 5;
  text-align: center;
  width: 100%;
  max-width: 620px;
}

.cs-title {
  margin: 0 0 36px;
  font-size: 60px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #fff;
  line-height: 1.1;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.18);
}

/* Countdown */
.cs-countdown {
  display: flex;
  justify-content: center;
  gap: 22px;
  margin-bottom: 36px;
}

.cs-count-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cs-count-value {
  font-family: "Orbitron", "Courier New", monospace;
  font-weight: 700;
  font-size: 54px;
  letter-spacing: 6px;
  color: #fff;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.06)
  );
  padding: 14px 22px;
  border-radius: 10px;
  min-width: 140px;
  text-align: center;
  text-shadow: 0 0 14px rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.cs-count-label {
  margin-top: 14px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.92);
}

.cs-subtitle {
  margin: 0 0 18px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.92);
}

/* Email form */
.cs-form {
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 460px;
  margin: 0 auto;
  padding: 5px;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 8px 26px rgba(15, 23, 42, 0.18);
}

.cs-form__input {
  flex: 1;
  min-width: 0;
  padding: 10px 18px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #1f2937;
  font-size: 14px;
}

.cs-form__input::placeholder {
  color: #9ca3af;
}

.cs-form__input:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.cs-form__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  background: linear-gradient(90deg, #1a1a1a, #404040);
  color: #fff;
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.cs-form__btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #000000, #2a2a2a);
  transform: translateY(-1px);
}

.cs-form__btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 767.98px) {
  .cs-title {
    font-size: 44px;
    margin-bottom: 28px;
  }

  .cs-countdown {
    gap: 14px;
  }

  .cs-count-value {
    font-size: 38px;
    padding: 10px 14px;
    min-width: 96px;
    letter-spacing: 4px;
  }

  .cs-count-label {
    font-size: 11px;
    letter-spacing: 3px;
    margin-top: 10px;
  }

  .cs-socials {
    right: 12px;
    gap: 10px;
  }

  .cs-social-link {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .cs-shell {
    padding: 32px 16px;
  }

  .cs-title {
    font-size: 32px;
    margin-bottom: 24px;
  }

  .cs-count-value {
    font-size: 28px;
    padding: 8px 10px;
    min-width: 72px;
    letter-spacing: 3px;
  }

  .cs-form {
    max-width: 100%;
  }

  .cs-form__btn {
    padding: 9px 18px;
    font-size: 13px;
  }

  .cs-menu-btn {
    width: 36px;
    height: 36px;
    top: 16px;
    right: 16px;
    font-size: 16px;
  }
}
</style>
