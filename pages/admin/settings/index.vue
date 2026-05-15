<template>
  <div>
    <NuxtLayout name="admin">
      <div class="admin-content-inner">
        <h2 style="font-size:1.35rem;font-weight:800;margin:0 0 18px">Settings</h2>

        <!-- Tabs -->
        <div class="settings-tabs admin-card-shell" style="display:flex;gap:0;border-bottom:2px solid var(--admin-border);border-radius:var(--admin-radius) var(--admin-radius) 0 0;overflow-x:auto">
          <button v-for="t in tabs" :key="t.key" class="stab" :class="{active:activeTab===t.key}" @click="activeTab=t.key">
            <i :class="t.icon" style="font-size:1rem"></i> {{ t.label }}
          </button>
        </div>

        <!-- Account -->
        <div v-if="activeTab==='account'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <!-- Avatar -->
          <div style="display:flex;align-items:center;gap:18px;margin-bottom:28px">
            <img src="https://i.pravatar.cc/80?img=12" style="width:72px;height:72px;border-radius:50%;object-fit:cover" alt="avatar">
            <div>
              <div style="display:flex;gap:10px;margin-bottom:6px">
                <button class="admin-primary-button" style="height:36px;font-size:.82rem"><i class="bi bi-cloud-upload"></i> Upload New Photo</button>
                <button class="admin-secondary-button" style="height:36px;font-size:.82rem">Reset</button>
              </div>
              <span style="font-size:.78rem;color:var(--admin-muted)">Allowed JPG, GIF or PNG. Max size 800kB</span>
            </div>
          </div>
          <!-- Form -->
          <div class="sgrid">
            <div class="sfield"><label>FIRST NAME</label><input class="admin-control" v-model="form.firstName"></div>
            <div class="sfield"><label>LAST NAME</label><input class="admin-control" v-model="form.lastName"></div>
            <div class="sfield"><label>EMAIL</label><input class="admin-control" v-model="form.email" type="email"></div>
            <div class="sfield"><label>ORGANIZATION</label><input class="admin-control" v-model="form.org"></div>
            <div class="sfield"><label>PHONE NUMBER</label><input class="admin-control" v-model="form.phone"></div>
            <div class="sfield"><label>ADDRESS</label><input class="admin-control" v-model="form.address"></div>
            <div class="sfield"><label>STATE</label><input class="admin-control" v-model="form.state"></div>
            <div class="sfield"><label>ZIP CODE</label><input class="admin-control" v-model="form.zip"></div>
            <div class="sfield">
              <label>COUNTRY</label>
              <select class="admin-control" v-model="form.country"><option>Vietnam</option><option>United States</option><option>Japan</option></select>
            </div>
            <div class="sfield">
              <label>LANGUAGE</label>
              <select class="admin-control" v-model="form.lang"><option>English</option><option>Tiếng Việt</option><option value="fr">Français</option></select>
            </div>
            <div class="sfield">
              <label>TIMEZONE</label>
              <select class="admin-control" v-model="form.tz"><option>Asia/Ho Chi Minh (UTC +7)</option><option>America/New_York (UTC -5)</option></select>
            </div>
            <div class="sfield">
              <label>CURRENCY</label>
              <select class="admin-control" v-model="form.currency"><option>VND – Vietnamese Đồng</option><option>USD – US Dollar</option></select>
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:22px">
            <button class="admin-primary-button">Save Changes</button>
            <button class="admin-secondary-button">Cancel</button>
          </div>

          <!-- Danger Zone -->
          <div style="margin-top:36px;padding-top:24px;border-top:1px solid var(--admin-border)">
            <h4 style="color:var(--admin-danger);font-size:.95rem;font-weight:700;margin:0 0 6px">Delete Account</h4>
            <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 14px">Once you delete your account, there is no going back. Please be certain.</p>
            <label style="display:flex;align-items:center;gap:8px;font-size:.84rem;cursor:pointer;margin-bottom:14px">
              <input type="checkbox" v-model="confirmDelete"> I confirm my account deactivation
            </label>
            <button class="admin-danger-button" :disabled="!confirmDelete">Deactivate Account</button>
          </div>
        </div>

        <!-- Security -->
        <div v-if="activeTab==='security'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 18px">Change Password</h4>
          <div class="sgrid">
            <div class="sfield"><label>CURRENT PASSWORD</label><input class="admin-control" type="password" placeholder="••••••••"></div>
            <div class="sfield"><label>NEW PASSWORD</label><input class="admin-control" type="password" placeholder="••••••••"></div>
            <div class="sfield"><label>CONFIRM NEW PASSWORD</label><input class="admin-control" type="password" placeholder="••••••••"></div>
            <div class="sfield" style="align-self:start">
              <label style="margin-bottom:8px">PASSWORD REQUIREMENTS:</label>
              <ul style="font-size:.82rem;color:var(--admin-muted);padding-left:18px;margin:0;line-height:1.8">
                <li>Minimum 8 characters long – the more, the better</li>
                <li>At least one lowercase character</li>
                <li>At least one number, symbol, or whitespace character</li>
              </ul>
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:22px">
            <button class="admin-primary-button">Save Changes</button>
            <button class="admin-secondary-button">Cancel</button>
          </div>

          <!-- 2FA -->
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--admin-border)">
            <h4 style="font-size:1rem;font-weight:700;margin:0 0 6px">Two-Factor Authentication</h4>
            <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 16px">Add additional security to your account using two factor authentication.</p>
            <div v-for="m in twoFA" :key="m.title" style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--admin-border)">
              <div><strong style="font-size:.9rem">{{ m.title }}</strong><p style="font-size:.82rem;color:var(--admin-muted);margin:4px 0 0">{{ m.desc }}</p></div>
              <button class="admin-secondary-button" style="height:34px;font-size:.8rem">{{ m.action }}</button>
            </div>
          </div>

          <!-- Active Sessions -->
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--admin-border)">
            <h4 style="font-size:1rem;font-weight:700;margin:0 0 6px">Active Sessions</h4>
            <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 16px">These devices are currently signed in to your account.</p>
            <div v-for="s in sessions" :key="s.device" style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--admin-border)">
              <div style="display:flex;align-items:center;gap:12px">
                <i :class="s.icon" style="font-size:1.3rem;color:var(--admin-muted)"></i>
                <div>
                  <strong style="font-size:.88rem">{{ s.device }}</strong>
                  <span v-if="s.current" style="background:var(--admin-success);color:#fff;font-size:.7rem;padding:2px 7px;border-radius:4px;margin-left:8px">Current</span>
                  <p style="font-size:.78rem;color:var(--admin-muted);margin:2px 0 0">{{ s.location }} · {{ s.time }}</p>
                </div>
              </div>
              <button v-if="!s.current" class="admin-danger-button" style="height:32px;font-size:.78rem;padding:0 12px">Revoke</button>
            </div>
          </div>
        </div>

        <!-- Billing -->
        <div v-if="activeTab==='billing'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 18px">Your Current Plan</h4>
          <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:24px">
            <div v-for="p in plans" :key="p.name" class="admin-card-shell" style="flex:1;min-width:200px;padding:20px;text-align:center" :style="p.active?'border-color:var(--admin-primary);box-shadow:0 0 0 2px var(--admin-primary)':''">
              <h5 style="font-size:.95rem;font-weight:700;margin:0 0 4px">{{ p.name }}</h5>
              <p style="font-size:1.4rem;font-weight:800;margin:8px 0">{{ p.price }}</p>
              <p style="font-size:.78rem;color:var(--admin-muted);margin:0 0 12px">{{ p.desc }}</p>
              <button :class="p.active?'admin-secondary-button':'admin-primary-button'" style="width:100%;height:36px;font-size:.82rem">{{ p.active?'Current Plan':'Upgrade' }}</button>
            </div>
          </div>

          <h4 style="font-size:1rem;font-weight:700;margin:28px 0 14px">Payment Methods</h4>
          <div v-for="pm in paymentMethods" :key="pm.label" style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--admin-border)">
            <div style="display:flex;align-items:center;gap:12px">
              <i :class="pm.icon" style="font-size:1.4rem"></i>
              <div><strong style="font-size:.88rem">{{ pm.label }}</strong><p style="font-size:.78rem;color:var(--admin-muted);margin:2px 0 0">{{ pm.detail }}</p></div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="admin-secondary-button" style="height:32px;font-size:.78rem">Edit</button>
              <button class="admin-danger-button" style="height:32px;font-size:.78rem">Delete</button>
            </div>
          </div>
          <button class="admin-primary-button" style="margin-top:16px;height:36px;font-size:.84rem"><i class="bi bi-plus-lg"></i> Add Payment Method</button>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab==='notifications'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 18px">Notification Preferences</h4>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:left;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted);text-transform:uppercase">Type</th>
                <th style="text-align:center;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted)">Email</th>
                <th style="text-align:center;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted)">Browser</th>
                <th style="text-align:center;padding:10px 0;font-size:.78rem;font-weight:700;color:var(--admin-muted)">App</th>
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
          <button class="admin-primary-button" style="margin-top:22px">Save Changes</button>
        </div>

        <!-- Connections -->
        <div v-if="activeTab==='connections'" class="admin-card-shell" style="border-top:0;border-radius:0 0 var(--admin-radius) var(--admin-radius);padding:28px 32px">
          <h4 style="font-size:1rem;font-weight:700;margin:0 0 6px">Connected Accounts</h4>
          <p style="font-size:.84rem;color:var(--admin-muted);margin:0 0 20px">Manage your connected third-party services and applications.</p>
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
definePageMeta({ layout: false })
useHead({ title: 'Settings – IrusGear Admin' })

const activeTab = ref('account')
const confirmDelete = ref(false)

const tabs = [
  { key: 'account', label: 'Account', icon: 'bi bi-person' },
  { key: 'security', label: 'Security', icon: 'bi bi-shield-lock' },
  { key: 'billing', label: 'Billing & Plans', icon: 'bi bi-credit-card' },
  { key: 'notifications', label: 'Notifications', icon: 'bi bi-bell' },
  { key: 'connections', label: 'Connections', icon: 'bi bi-link-45deg' },
]

const form = reactive({
  firstName: 'Admin', lastName: 'IrusGear', email: 'admin@irusgear.com', org: 'IrusGear Corp.',
  phone: '+84 900 000 000', address: '45 Nguyen Hue Street', state: 'Ho Chi Minh', zip: '70000',
  country: 'Vietnam', lang: 'English', tz: 'Asia/Ho Chi Minh (UTC +7)', currency: 'VND – Vietnamese Đồng',
})

const twoFA = [
  { title: 'Authenticator App', desc: 'Use an authenticator app to generate one-time codes.', action: 'Set Up' },
  { title: 'SMS Verification', desc: 'Use your phone number to receive verification codes.', action: 'Set Up' },
]

const sessions = [
  { device: 'Chrome on Windows', icon: 'bi bi-laptop', location: 'Ho Chi Minh, VN', time: 'Active now', current: true },
  { device: 'Safari on iPhone', icon: 'bi bi-phone', location: 'Ho Chi Minh, VN', time: '2 hours ago', current: false },
  { device: 'Firefox on macOS', icon: 'bi bi-laptop', location: 'Hanoi, VN', time: '3 days ago', current: false },
]

const plans = [
  { name: 'Basic', price: 'Free', desc: 'For personal use', active: false },
  { name: 'Standard', price: '$9/mo', desc: 'For small teams', active: true },
  { name: 'Enterprise', price: '$29/mo', desc: 'For large organizations', active: false },
]

const paymentMethods = [
  { icon: 'bi bi-credit-card-2-front', label: 'Visa ending in 4242', detail: 'Expires 12/2027' },
  { icon: 'bi bi-paypal', label: 'PayPal', detail: 'admin@irusgear.com' },
]

const notifications = reactive([
  { label: 'New orders', email: true, browser: true, app: true },
  { label: 'Order status updates', email: true, browser: false, app: true },
  { label: 'New customers', email: false, browser: true, app: false },
  { label: 'Inventory alerts', email: true, browser: true, app: true },
  { label: 'Promotional emails', email: false, browser: false, app: false },
  { label: 'Security alerts', email: true, browser: true, app: true },
])

const connections = reactive([
  { name: 'Google', desc: 'Calendar, Drive, and Gmail integration', icon: 'bi bi-google', bg: '#fef3f2', color: '#ea4335', connected: true },
  { name: 'Slack', desc: 'Order notifications and team updates', icon: 'bi bi-slack', bg: '#f0f4ff', color: '#4a154b', connected: true },
  { name: 'GitHub', desc: 'Deploy and version control', icon: 'bi bi-github', bg: '#f5f5f5', color: '#24292e', connected: false },
  { name: 'Stripe', desc: 'Payment processing', icon: 'bi bi-stripe', bg: '#f0f4ff', color: '#635bff', connected: true },
  { name: 'Mailchimp', desc: 'Email marketing campaigns', icon: 'bi bi-envelope', bg: '#fff8e1', color: '#ffe01b', connected: false },
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
