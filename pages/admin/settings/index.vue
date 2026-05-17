<template>
  <div>
    <NuxtLayout name="admin">
      <div class="admin-content-inner">
        <h2 style="font-size:1.35rem;font-weight:800;margin:0 0 18px">{{ $t('admin.settings.title') }}</h2>

        <!-- Tabs -->
        <div class="settings-tabs admin-card-shell" style="display:flex;gap:0;border-bottom:2px solid var(--admin-border);border-radius:var(--admin-radius) var(--admin-radius) 0 0;overflow-x:auto">
          <button v-for="tab in tabs" :key="tab.key" class="stab" :class="{active:activeTab===tab.key}" @click="activeTab=tab.key">
            <i :class="tab.icon" style="font-size:1rem"></i> {{ tab.label }}
          </button>
        </div>

        <!-- Account -->
        <div v-if="activeTab==='account'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <!-- Avatar -->
          <div style="display:flex;align-items:center;gap:18px;margin-bottom:28px">
            <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg, #8b7cf6, #f0efff);color:#222233;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700">
              {{ userInitials }}
            </div>
            <div>
              <div style="display:flex;gap:10px;margin-bottom:6px">
                <button class="admin-primary-button" style="height:36px;font-size:.82rem"><i class="bi bi-cloud-upload"></i> {{ $t('admin.settings.uploadNewPhoto') }}</button>
                <button class="admin-secondary-button" style="height:36px;font-size:.82rem">{{ $t('admin.settings.reset') }}</button>
              </div>
              <span style="font-size:.78rem;color:var(--admin-muted)">{{ $t('admin.settings.photoAllowed') }}</span>
            </div>
          </div>
          <!-- Form -->
          <div class="sgrid">
            <div class="sfield"><label>{{ $t('admin.settings.firstName') }}</label><input class="admin-control" v-model="form.first_name"></div>
            <div class="sfield"><label>{{ $t('admin.settings.lastName') }}</label><input class="admin-control" v-model="form.last_name"></div>
            <div class="sfield"><label>{{ $t('admin.settings.email') }}</label><input class="admin-control" v-model="form.email" type="email"></div>
            <div class="sfield"><label>{{ $t('admin.settings.organization') }}</label><input class="admin-control" v-model="form.org"></div>
            <div class="sfield"><label>{{ $t('admin.settings.phoneNumber') }}</label><input class="admin-control" v-model="form.phone"></div>
            <div class="sfield"><label>{{ $t('admin.settings.address') }}</label><input class="admin-control" v-model="form.address"></div>
            <div class="sfield"><label>{{ $t('admin.settings.state') }}</label><input class="admin-control" v-model="form.state"></div>
            <div class="sfield"><label>{{ $t('admin.settings.zipCode') }}</label><input class="admin-control" v-model="form.zip"></div>
            <div class="sfield">
              <label>{{ $t('admin.settings.country') }}</label>
              <select class="admin-control" v-model="form.country">
                <option>{{ $t('admin.settings.countryVietnam') }}</option>
                <option>{{ $t('admin.settings.countryUnitedStates') }}</option>
                <option>{{ $t('admin.settings.countryJapan') }}</option>
              </select>
            </div>
            <div class="sfield">
              <label>{{ $t('admin.settings.language') }}</label>
              <select class="admin-control" v-model="form.lang">
                <option>{{ $t('admin.settings.langEnglish') }}</option>
                <option>{{ $t('admin.settings.langVietnamese') }}</option>
                <option value="fr">{{ $t('admin.settings.langFrench') }}</option>
              </select>
            </div>
            <div class="sfield">
              <label>{{ $t('admin.settings.timezone') }}</label>
              <select class="admin-control" v-model="form.tz">
                <option>{{ $t('admin.settings.tzHoChiMinh') }}</option>
                <option>{{ $t('admin.settings.tzNewYork') }}</option>
              </select>
            </div>
            <div class="sfield">
              <label>{{ $t('admin.settings.currency') }}</label>
              <select class="admin-control" v-model="form.currency">
                <option>{{ $t('admin.settings.currencyVnd') }}</option>
                <option>{{ $t('admin.settings.currencyUsd') }}</option>
              </select>
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:22px">
            <button class="admin-primary-button" :disabled="isSavingProfile" @click="updateProfile">
              {{ isSavingProfile ? $t('admin.settings.saving') : $t('admin.settings.saveChanges') }}
            </button>
            <button class="admin-secondary-button">{{ $t('admin.settings.cancel') }}</button>
          </div>

          <!-- Danger Zone -->
          <div style="margin-top:36px;padding-top:24px;border-top:1px solid var(--admin-border)">
            <h4 style="color:var(--admin-danger);font-size:.95rem;font-weight:700;margin:0 0 6px">{{ $t('admin.settings.deleteAccount') }}</h4>
            <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 14px">{{ $t('admin.settings.deleteAccountDesc') }}</p>
            <label style="display:flex;align-items:center;gap:8px;font-size:.84rem;cursor:pointer;margin-bottom:14px">
              <input type="checkbox" v-model="confirmDelete"> {{ $t('admin.settings.confirmDeactivate') }}
            </label>
            <button class="admin-danger-button" :disabled="!confirmDelete">{{ $t('admin.settings.deactivateAccount') }}</button>
          </div>
        </div>

        <!-- Security -->
        <div v-if="activeTab==='security'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 18px">{{ $t('admin.settings.changePassword') }}</h4>
          <div class="sgrid">
            <div class="sfield"><label>{{ $t('admin.settings.currentPassword') }}</label><input class="admin-control" type="password" v-model="pwdForm.current_password" placeholder="••••••••"></div>
            <div class="sfield"><label>{{ $t('admin.settings.newPassword') }}</label><input class="admin-control" type="password" v-model="pwdForm.new_password" placeholder="••••••••"></div>
            <div class="sfield"><label>{{ $t('admin.settings.confirmNewPassword') }}</label><input class="admin-control" type="password" v-model="pwdForm.new_password_confirmation" placeholder="••••••••"></div>
            <div class="sfield" style="align-self:start">
              <label style="margin-bottom:8px">{{ $t('admin.settings.passwordRequirements') }}</label>
              <ul style="font-size:.82rem;color:var(--admin-muted);padding-left:18px;margin:0;line-height:1.8">
                <li>{{ $t('admin.settings.passwordReq1') }}</li>
                <li>{{ $t('admin.settings.passwordReq2') }}</li>
                <li>{{ $t('admin.settings.passwordReq3') }}</li>
              </ul>
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:22px">
            <button class="admin-primary-button" :disabled="isSavingPassword" @click="changePassword">
              {{ isSavingPassword ? $t('admin.settings.saving') : $t('admin.settings.saveChanges') }}
            </button>
            <button class="admin-secondary-button" @click="pwdForm.current_password='';pwdForm.new_password='';pwdForm.new_password_confirmation=''">{{ $t('admin.settings.cancel') }}</button>
          </div>

          <!-- 2FA -->
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--admin-border)">
            <h4 style="font-size:1rem;font-weight:700;margin:0 0 6px">{{ $t('admin.settings.twoFactor') }}</h4>
            <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 16px">{{ $t('admin.settings.twoFactorDesc') }}</p>
            <div v-for="m in twoFA" :key="m.title" style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--admin-border)">
              <div><strong style="font-size:.9rem">{{ m.title }}</strong><p style="font-size:.82rem;color:var(--admin-muted);margin:4px 0 0">{{ m.desc }}</p></div>
              <button class="admin-secondary-button" style="height:34px;font-size:.8rem">{{ m.action }}</button>
            </div>
          </div>

          <!-- Active Sessions -->
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--admin-border)">
            <h4 style="font-size:1rem;font-weight:700;margin:0 0 6px">{{ $t('admin.settings.activeSessions') }}</h4>
            <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 16px">{{ $t('admin.settings.activeSessionsDesc') }}</p>
            <div v-for="s in sessions" :key="s.device" style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--admin-border)">
              <div style="display:flex;align-items:center;gap:12px">
                <i :class="s.icon" style="font-size:1.3rem;color:var(--admin-muted)"></i>
                <div>
                  <strong style="font-size:.88rem">{{ s.device }}</strong>
                  <span v-if="s.current" style="background:var(--admin-success);color:#fff;font-size:.7rem;padding:2px 7px;border-radius:4px;margin-left:8px">{{ $t('admin.settings.current') }}</span>
                  <p style="font-size:.78rem;color:var(--admin-muted);margin:2px 0 0">{{ s.location }} · {{ s.time }}</p>
                </div>
              </div>
              <button v-if="!s.current" class="admin-danger-button" style="height:32px;font-size:.78rem;padding:0 12px">{{ $t('admin.settings.revoke') }}</button>
            </div>
          </div>
        </div>

        <!-- Billing -->
        <div v-if="activeTab==='billing'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 18px">{{ $t('admin.settings.currentPlan') }}</h4>
          <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:24px">
            <div v-for="p in plans" :key="p.name" class="admin-card-shell" style="flex:1;min-width:200px;padding:20px;text-align:center" :style="p.active?'border-color:var(--admin-primary);box-shadow:0 0 0 2px var(--admin-primary)':''">
              <h5 style="font-size:.95rem;font-weight:700;margin:0 0 4px">{{ p.name }}</h5>
              <p style="font-size:1.4rem;font-weight:800;margin:8px 0">{{ p.price }}</p>
              <p style="font-size:.78rem;color:var(--admin-muted);margin:0 0 12px">{{ p.desc }}</p>
              <button :class="p.active?'admin-secondary-button':'admin-primary-button'" style="width:100%;height:36px;font-size:.82rem">{{ p.active ? $t('admin.settings.currentPlanBtn') : $t('admin.settings.upgrade') }}</button>
            </div>
          </div>

          <h4 style="font-size:1rem;font-weight:700;margin:28px 0 14px">{{ $t('admin.settings.paymentMethods') }}</h4>
          <div v-for="pm in paymentMethods" :key="pm.label" style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--admin-border)">
            <div style="display:flex;align-items:center;gap:12px">
              <i :class="pm.icon" style="font-size:1.4rem"></i>
              <div><strong style="font-size:.88rem">{{ pm.label }}</strong><p style="font-size:.78rem;color:var(--admin-muted);margin:2px 0 0">{{ pm.detail }}</p></div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="admin-secondary-button" style="height:32px;font-size:.78rem">{{ $t('admin.settings.edit') }}</button>
              <button class="admin-danger-button" style="height:32px;font-size:.78rem">{{ $t('admin.settings.delete') }}</button>
            </div>
          </div>
          <button class="admin-primary-button" style="margin-top:16px;height:36px;font-size:.84rem"><i class="bi bi-plus-lg"></i> {{ $t('admin.settings.addPaymentMethod') }}</button>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab==='notifications'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 18px">{{ $t('admin.settings.notificationPreferences') }}</h4>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:left;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted);text-transform:uppercase">{{ $t('admin.settings.notificationType') }}</th>
                <th style="text-align:center;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted)">{{ $t('admin.settings.notificationEmail') }}</th>
                <th style="text-align:center;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted)">{{ $t('admin.settings.notificationBrowser') }}</th>
                <th style="text-align:center;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted)">{{ $t('admin.settings.notificationApp') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in notifications" :key="n.label" style="border-top:1px solid var(--admin-border)">
                <td style="padding:14px 0;font-size:.88rem;font-weight:600">{{ n.label }}</td>
                <td style="text-align:center"><label class="toggle"><input type="checkbox" v-model="n.email"><span class="slider"></span></label></td>
                <td style="text-align:center"><label class="toggle"><input type="checkbox" v-model="n.browser"><span class="slider"></span></label></td>
                <td style="text-align:center"><label class="toggle"><input type="checkbox" v-model="n.app"><span class="slider"></span></label></td>
              </tr>
            </tbody>
          </table>
          <button class="admin-primary-button" style="margin-top:22px">{{ $t('admin.settings.saveChanges') }}</button>
        </div>

        <!-- Connections -->
        <div v-if="activeTab==='connections'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 6px">{{ $t('admin.settings.connectedAccounts') }}</h4>
          <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 20px">{{ $t('admin.settings.connectedAccountsDesc') }}</p>
          <div v-for="c in connections" :key="c.name" style="display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--admin-border)">
            <div style="display:flex;align-items:center;gap:14px">
              <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem" :style="{background:c.bg,color:c.color}">
                <i :class="c.icon"></i>
              </div>
              <div><strong style="font-size:.9rem">{{ c.name }}</strong><p style="font-size:.78rem;color:var(--admin-muted);margin:2px 0 0">{{ c.desc }}</p></div>
            </div>
            <label class="toggle"><input type="checkbox" v-model="c.connected"><span class="slider"></span></label>
          </div>
        </div>

      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useI18n, useHead } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })
const { t } = useI18n()
useHead({ title: () => t('admin.settings.pageTitle') })

const adminStore = useAdminStore()

const activeTab = ref('account')
const confirmDelete = ref(false)

const tabs = computed(() => [
  { key: 'account', label: t('admin.settings.account'), icon: 'bi bi-person' },
  { key: 'security', label: t('admin.settings.security'), icon: 'bi bi-shield-lock' },
  { key: 'billing', label: t('admin.settings.billingPlans'), icon: 'bi bi-credit-card' },
  { key: 'notifications', label: t('admin.settings.notifications'), icon: 'bi bi-bell' },
  { key: 'connections', label: t('admin.settings.connections'), icon: 'bi bi-link-45deg' },
])

// -- Profile Form --
const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  country: '',
  // Mock fields to preserve layout
  org: t('admin.settings.defaultOrg'),
  address: t('admin.settings.defaultAddress'),
  state: t('admin.settings.defaultState'),
  zip: t('admin.settings.defaultZip'),
  lang: t('admin.settings.langEnglish'),
  tz: t('admin.settings.tzHoChiMinh'),
  currency: t('admin.settings.currencyVnd'),
})

const isSavingProfile = ref(false)

onMounted(async () => {
  // Ensure we have user data
  if (!adminStore.adminUser) {
    await adminStore.fetchAdminMe()
  }

  if (adminStore.adminUser) {
    const user = adminStore.adminUser
    form.first_name = user.first_name || ''
    form.last_name = user.last_name || ''
    form.email = user.email || ''
    form.phone = user.phone || ''
    form.country = user.country || t('admin.settings.countryVietnam')
  }
})

const userInitials = computed(() => {
  const name = adminStore.adminUser?.name || 'Admin'
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('') || 'A'
})

const updateProfile = async () => {
  isSavingProfile.value = true
  try {
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      name: `${form.first_name} ${form.last_name}`.trim(),
      phone: form.phone,
      country: form.country,
    }

    const res = await adminStore.patch('me/profile', null, payload)
    if (res && res.success) {
      toast.success(res.message || t('admin.settings.profileUpdated'))
      adminStore.adminUser = res.data.user
    }
  } catch (err) {
    toast.error(t('admin.settings.profileUpdateFailed'))
  } finally {
    isSavingProfile.value = false
  }
}

// -- Password Form --
const pwdForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})
const isSavingPassword = ref(false)

const changePassword = async () => {
  if (!pwdForm.current_password || !pwdForm.new_password || !pwdForm.new_password_confirmation) {
    toast.error(t('admin.settings.fillPasswordFields'))
    return
  }

  if (pwdForm.new_password !== pwdForm.new_password_confirmation) {
    toast.error(t('admin.settings.passwordsNoMatch'))
    return
  }

  isSavingPassword.value = true
  try {
    const res = await adminStore.create('me/change-password', pwdForm)
    if (res && res.success) {
      toast.success(res.message || t('admin.settings.passwordChanged'))
      pwdForm.current_password = ''
      pwdForm.new_password = ''
      pwdForm.new_password_confirmation = ''
    }
  } catch (err) {
    toast.error(err.message || t('admin.settings.passwordChangeFailed'))
  } finally {
    isSavingPassword.value = false
  }
}

// -- Mock UI Data --
const twoFA = computed(() => [
  { title: t('admin.settings.authenticatorApp'), desc: t('admin.settings.authenticatorAppDesc'), action: t('admin.settings.setUp') },
  { title: t('admin.settings.smsVerification'), desc: t('admin.settings.smsVerificationDesc'), action: t('admin.settings.setUp') },
])

const sessions = computed(() => [
  { device: t('admin.settings.deviceChromeWindows'), icon: 'bi bi-laptop', location: t('admin.settings.sessionLocation'), time: t('admin.settings.sessionActiveNow'), current: true },
  { device: t('admin.settings.deviceSafariIphone'), icon: 'bi bi-phone', location: t('admin.settings.sessionLocation'), time: t('admin.settings.sessionTwoHoursAgo'), current: false },
])

const plans = computed(() => [
  { name: t('admin.settings.planBasic'), price: t('admin.settings.planFree'), desc: t('admin.settings.planBasicDesc'), active: false },
  { name: t('admin.settings.planStandard'), price: '$9/mo', desc: t('admin.settings.planStandardDesc'), active: true },
  { name: t('admin.settings.planEnterprise'), price: '$29/mo', desc: t('admin.settings.planEnterpriseDesc'), active: false },
])

const paymentMethods = computed(() => [
  { icon: 'bi bi-credit-card-2-front', label: t('admin.settings.visaCard'), detail: t('admin.settings.visaCardExpires') },
  { icon: 'bi bi-paypal', label: t('admin.settings.paypal'), detail: t('admin.settings.paypalEmail') },
])

const notifications = reactive([
  { label: t('admin.settings.notifNewOrders'), email: true, browser: true, app: true },
  { label: t('admin.settings.notifOrderStatus'), email: true, browser: false, app: true },
  { label: t('admin.settings.notifSecurity'), email: true, browser: true, app: true },
])

const connections = reactive([
  { name: t('admin.settings.connGoogle'), desc: t('admin.settings.connGoogleDesc'), icon: 'bi bi-google', bg: '#fef3f2', color: '#ea4335', connected: true },
  { name: t('admin.settings.connStripe'), desc: t('admin.settings.connStripeDesc'), icon: 'bi bi-stripe', bg: '#f0f4ff', color: '#635bff', connected: true },
])
</script>

<style scoped>
.sgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
.sfield { display: flex; flex-direction: column; gap: 6px; }
.sfield label { font-size: .74rem; font-weight: 700; color: var(--admin-muted); letter-spacing: .04em; }
.sfield .admin-control { width: 100%; }
.stab {
  padding: 14px 22px; border: 0; background: transparent; font-size: .88rem; font-weight: 600;
  color: var(--admin-muted); cursor: pointer; white-space: nowrap; display: inline-flex;
  align-items: center; gap: 7px; border-bottom: 2px solid transparent; margin-bottom: -2px;
  transition: color .18s, border-color .18s;
}
.stab.active { color: var(--admin-primary); border-bottom-color: var(--admin-primary); }
.stab:hover:not(.active) { color: var(--admin-text); }

/* Toggle switch */
.toggle { position: relative; display: inline-block; width: 42px; height: 24px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle .slider {
  position: absolute; inset: 0; background: #ccc; border-radius: 24px; cursor: pointer;
  transition: background .2s;
}
.toggle .slider::before {
  content: ''; position: absolute; width: 18px; height: 18px; left: 3px; bottom: 3px;
  background: #fff; border-radius: 50%; transition: transform .2s;
}
.toggle input:checked + .slider { background: var(--admin-success); }
.toggle input:checked + .slider::before { transform: translateX(18px); }

@media screen and (max-width: 768px) {
  .sgrid { grid-template-columns: 1fr; }
  .stab { padding: 12px 14px; font-size: .82rem; }

  /* Touch-friendly inputs */
  .sfield .admin-control { min-height: 44px; font-size: 16px; }

  /* Larger toggles */
  .toggle { width: 48px; height: 28px; }
  .toggle .slider::before { width: 22px; height: 22px; }
  .toggle input:checked + .slider::before { transform: translateX(20px); }

  /* Buttons */
  .admin-primary-button,
  .admin-secondary-button { min-height: 44px; }
}
</style>
