<template>
  <div class="shipment-timeline">
    <div v-if="groups.length" class="timeline-groups">
      <section v-for="group in groups" :key="group.key" class="timeline-day">
        <div class="day-label">
          <span>{{ group.label }}</span>
        </div>

        <article
          v-for="event in group.items"
          :key="event.id"
          class="timeline-event"
          :class="`is-${event.type}`"
        >
          <div class="event-marker">
            <i class="bi" :class="event.icon" aria-hidden="true"></i>
          </div>

          <div class="event-body">
            <div class="event-header">
              <div>
                <strong>{{ event.title }}</strong>
                <small v-if="event.description">{{ event.description }}</small>
              </div>
              <time :datetime="event.timestamp" :title="formatAbsolute(event.timestamp)">
                {{ formatRelative(event.timestamp) }}
              </time>
            </div>

            <p v-if="event.note" class="event-note">{{ event.note }}</p>

            <dl v-if="event.meta.length" class="event-meta">
              <div v-for="meta in event.meta" :key="meta.label">
                <dt>{{ meta.label }}</dt>
                <dd>{{ meta.value }}</dd>
              </div>
            </dl>

            <div v-if="event.photos.length" class="pod-grid">
              <button
                v-for="photo in event.photos"
                :key="photo.id"
                type="button"
                class="pod-thumb"
                @click="openPhoto(photo)"
              >
                <img :src="photo.thumb_url || photo.url" :alt="$t('admin.orders.timeline.photoAlt')" />
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>

    <div v-else class="timeline-empty">
      <i class="bi bi-truck" aria-hidden="true"></i>
      <span>{{ $t('admin.orders.timeline.empty') }}</span>
    </div>

    <div v-if="selectedPhoto" class="lightbox-backdrop" @click.self="closePhoto">
      <button type="button" class="lightbox-close" :aria-label="$t('common.close')" @click="closePhoto">
        <i class="bi bi-x-lg"></i>
      </button>
      <img :src="selectedPhoto.url || selectedPhoto.thumb_url" :alt="$t('admin.orders.timeline.photoAlt')" class="lightbox-image" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '#imports'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const { t, locale } = useI18n()
const selectedPhoto = ref(null)
const nowMs = ref(Date.now())
const timer = ref(null)

const events = computed(() => {
  const timeline = props.order?.timelines || props.order?.timeline || props.order?.activity || []
  const attempts = props.order?.shipment?.delivery_attempts || []

  const timelineEvents = timeline.map((item, index) => {
    const timestamp = item.created_at || item.timestamp

    return {
      id: `timeline-${item.id || index}`,
      type: 'timeline',
      icon: timelineIcon(item.actor_type),
      title: item.label || item.title || t('admin.orders.timeline.statusUpdated'),
      description: item.actor_name || item.description || actorLabel(item.actor_type),
      note: item.note || '',
      timestamp,
      photos: [],
      meta: [],
    }
  })

  const attemptEvents = attempts.map((attempt) => {
    const photos = (attempt.photos || []).filter((photo) => photo.thumb_url || photo.url)

    return {
      id: `attempt-${attempt.id}`,
      type: 'attempt',
      icon: attempt.outcome === 'delivered' ? 'bi-box-seam' : 'bi-exclamation-circle',
      title: t('admin.orders.timeline.attemptTitle', { number: attempt.attempt_number }),
      description: outcomeLabel(attempt.outcome),
      note: attempt.note || '',
      timestamp: attempt.attempted_at || attempt.created_at,
      photos,
      meta: attemptMeta(attempt),
    }
  })

  return [...timelineEvents, ...attemptEvents]
    .filter((event) => Boolean(event.timestamp))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const groups = computed(() => {
  const byDay = new Map()

  events.value.forEach((event) => {
    const date = new Date(event.timestamp)
    const key = date.toISOString().slice(0, 10)

    if (!byDay.has(key)) {
      byDay.set(key, {
        key,
        label: date.toLocaleDateString(locale.value, { day: '2-digit', month: 'short', year: 'numeric' }),
        items: [],
      })
    }

    byDay.get(key).items.push(event)
  })

  return Array.from(byDay.values())
})

const attemptMeta = (attempt) => {
  const meta = []
  if (attempt.recipient_name) {
    meta.push({ label: t('admin.orders.timeline.recipient'), value: attempt.recipient_name })
  }
  if (Number(attempt.cod_collected_amount) > 0) {
    meta.push({ label: t('admin.orders.timeline.codCollected'), value: formatCurrency(attempt.cod_collected_amount) })
  }
  if (attempt.gps_lat && attempt.gps_lng) {
    meta.push({ label: t('admin.orders.timeline.location'), value: `${attempt.gps_lat}, ${attempt.gps_lng}` })
  }
  return meta
}

const actorLabel = (actorType) => {
  if (!actorType) return ''
  const key = `admin.orders.timeline.actor.${actorType}`
  const label = t(key)
  return label === key ? actorType : label
}

const timelineIcon = (actorType) => ({
  admin: 'bi-person-badge',
  delivery: 'bi-truck',
  gateway: 'bi-credit-card',
  system: 'bi-gear',
  user: 'bi-person',
}[actorType] || 'bi-clock-history')

const outcomeLabel = (outcome) => {
  if (!outcome) return t('admin.orders.timeline.attempt')
  const key = `admin.orders.timeline.outcome.${outcome}`
  const label = t(key)
  return label === key ? outcome.replaceAll('_', ' ') : label
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const formatAbsolute = (timestamp) => new Date(timestamp).toLocaleString(locale.value, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const formatRelative = (timestamp) => {
  const date = new Date(timestamp)
  const diffSeconds = Math.round((date.getTime() - nowMs.value) / 1000)
  const absSeconds = Math.abs(diffSeconds)
  const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })

  if (absSeconds < 60) return rtf.format(diffSeconds, 'second')
  if (absSeconds < 3600) return rtf.format(Math.round(diffSeconds / 60), 'minute')
  if (absSeconds < 86400) return rtf.format(Math.round(diffSeconds / 3600), 'hour')
  if (absSeconds < 2592000) return rtf.format(Math.round(diffSeconds / 86400), 'day')
  if (absSeconds < 31536000) return rtf.format(Math.round(diffSeconds / 2592000), 'month')
  return rtf.format(Math.round(diffSeconds / 31536000), 'year')
}

const openPhoto = (photo) => {
  selectedPhoto.value = photo
}

const closePhoto = () => {
  selectedPhoto.value = null
}

onMounted(() => {
  timer.value = window.setInterval(() => {
    nowMs.value = Date.now()
  }, 60000)
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.shipment-timeline {
  min-width: 0;
}

.timeline-groups {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.timeline-day {
  display: grid;
  gap: 12px;
}

.day-label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--admin-subtle);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.day-label::after {
  content: "";
  height: 1px;
  background: var(--admin-border);
  flex: 1;
}

.timeline-event {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 12px;
}

.event-marker {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(115, 103, 240, 0.12);
  color: var(--admin-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}

.timeline-event.is-attempt .event-marker {
  background: rgba(0, 207, 232, 0.14);
  color: #00a9c0;
}

.event-body {
  min-width: 0;
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  padding: 12px;
  background: var(--admin-surface);
}

.event-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.event-header strong {
  display: block;
  color: var(--admin-text);
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.event-header small,
.event-header time {
  color: var(--admin-muted);
  font-size: 0.78rem;
}

.event-header time {
  flex: 0 0 auto;
  white-space: nowrap;
}

.event-note {
  margin: 10px 0 0;
  color: var(--admin-muted);
  font-size: 0.84rem;
  line-height: 1.55;
}

.event-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 12px 0 0;
}

.event-meta div {
  min-width: 0;
}

.event-meta dt {
  color: var(--admin-subtle);
  font-size: 0.72rem;
  font-weight: 800;
  margin-bottom: 2px;
  text-transform: uppercase;
}

.event-meta dd {
  margin: 0;
  color: var(--admin-text);
  font-size: 0.82rem;
  word-break: break-word;
}

.pod-grid {
  display: grid;
  grid-template-columns: repeat(5, 96px);
  gap: 8px;
  margin-top: 12px;
  overflow-x: auto;
}

.pod-thumb {
  width: 96px;
  height: 96px;
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  padding: 0;
  background: var(--admin-surface-soft);
  overflow: hidden;
}

.pod-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.timeline-empty {
  min-height: 120px;
  border: 1px dashed var(--admin-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: var(--admin-muted);
  font-size: 0.88rem;
}

.timeline-empty i {
  font-size: 1.4rem;
}

.lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(15, 18, 32, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 20px 20px;
}

.lightbox-image {
  max-width: min(960px, 100%);
  max-height: 86vh;
  border-radius: 8px;
  object-fit: contain;
}

.lightbox-close {
  position: fixed;
  top: 18px;
  right: 18px;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 767.98px) {
  .timeline-event {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 10px;
  }

  .event-marker {
    width: 28px;
    height: 28px;
    font-size: 0.82rem;
  }

  .event-header {
    flex-direction: column;
    gap: 6px;
  }

  .event-meta {
    grid-template-columns: 1fr;
  }

  .pod-grid {
    grid-template-columns: repeat(3, 78px);
  }

  .pod-thumb {
    width: 78px;
    height: 78px;
  }
}
</style>
