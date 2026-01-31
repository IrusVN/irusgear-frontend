<template>
  <div class="register-page d-flex align-items-center justify-content-center py-5">
    <div class="register-container irus-card overflow-hidden">

      <div class="d-flex flex-column flex-lg-row">
        <div class="p-4 d-flex flex-column justify-content-center align-items-center text-center bg-light-subtle"
          style="min-width: 350px;">
          <div class="mb-4">
            <img src="@/public/favicon-dark.svg" alt="Logo" class="mb-3" style="height: 80px;">
            <h3 class="text-dark fw-bold text-uppercase mb-2">{{ $t('register.title') }}</h3>
            <p class="text-secondary small">{{ $t('register.subtitle') }}</p>
          </div>
          <div class="w-100">
            <p class="text-secondary small fw-bold mb-3">{{ $t('register.quickRegister') }}</p>
            <div class="d-flex flex-column gap-3 w-100 px-lg-4">
              <button
                class="btn bg-white border rounded-3 py-2 px-4 d-flex align-items-center justify-content-center gap-2 shadow-sm w-100 social-hover">
                <GoogleLogo /> <span class="fw-semibold">Google</span>
              </button>
              <button
                class="btn bg-white border rounded-3 py-2 px-4 d-flex align-items-center justify-content-center gap-2 shadow-sm w-100 social-hover">
                <FacebookLogo /> <span class="fw-semibold">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        <div class="d-none d-lg-block border-end opacity-25 my-4"></div>
        <div class="d-block d-lg-none border-top w-100 opacity-25"></div>

        <div class="p-4 flex-grow-1 bg-white">

          <div v-if="authStore.registerStep === 1">
            <div class="d-flex align-items-center mb-4">
              <div class="flex-grow-1 border-top"></div>
              <span class="fw-bold text-nowrap ms-3 me-3">{{ $t('register.orInfo') }}</span>
              <div class="flex-grow-1 border-top"></div>
            </div>

            <form @submit.prevent="handleRegister" class="irus-form">
              <h6 class="fw-bold mb-0 text-dark">{{ $t('register.personalInfo') }}</h6>

              <div class="d-flex gap-3">
                <div class="w-100">
                  <label class="form-label small fw-bold text-dark mb-1">{{ $t('common.lastName') }}</label>
                  <div class="irus-input-wrapper">
                    <input type="text" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.lastName }"
                      :placeholder="$t('common.lastName')" 
                      v-model="form.lastName" 
                      @blur="validateField('lastName')"
                      required />
                  </div>
                  <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">
                    {{ errors.lastName }}
                  </div>
                </div>

                <div class="w-100">
                  <label class="form-label small fw-bold text-dark mb-1">{{ $t('common.firstName') }}</label>
                  <div class="irus-input-wrapper">
                    <input type="text" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.firstName }"
                      :placeholder="$t('common.firstName')" 
                      v-model="form.firstName" 
                      @blur="validateField('firstName')"
                      required />
                  </div>
                  <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">
                    {{ errors.firstName }}
                  </div>
                </div>
              </div>

              <div class="d-flex gap-3">
                <div class="w-100">
                  <label class="form-label small fw-bold text-dark mb-1">{{ $t('register.dob') }}</label>
                  <div class="irus-input-wrapper">
                    <input type="date" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.dob }"
                      v-model="form.dob" 
                      @blur="validateField('dob')"
                      required />
                  </div>
                  <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">
                    {{ errors.dob }}
                  </div>
                </div>
              </div>

              <div class="d-flex gap-3">
                <div class="w-100">
                  <label class="form-label small fw-bold text-dark mb-1">{{ $t('register.phone') }}</label>
                  <div class="irus-input-wrapper">
                    <input type="tel" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.phone }"
                      :placeholder="$t('register.enterPhone')" 
                      v-model="form.phone" 
                      @blur="validateField('phone')"
                      required />
                  </div>
                  <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">
                    {{ errors.phone }}
                  </div>
                </div>

                <div class="w-100">
                  <label class="form-label small fw-bold text-dark mb-1">{{ $t('register.email') }}</label>
                  <div class="irus-input-wrapper">
                    <input type="email" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.email }"
                      :placeholder="$t('register.enterEmail')" 
                      v-model="form.email" 
                      @blur="validateField('email')" />
                  </div>
                  <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mt-2 mb-0 text-dark">{{ $t('register.security') }}</h6>

              <div class="d-flex gap-3">
                <div class="w-100">
                  <label class="form-label small fw-bold text-dark mb-1">{{ $t('register.password') }}</label>
                  <div class="irus-input-wrapper d-flex align-items-center">
                    <input :type="showPass ? 'text' : 'password'" class="irus-input ps-3 pe-3 flex-grow-1 border-0" 
                      :class="{ 'border-danger': errors.password }"
                      :placeholder="$t('register.password')" 
                      v-model="form.password" 
                      @blur="validateField('password')"
                      required />
                    <button type="button" class="btn text-secondary border-0 bg-transparent px-2" @click="showPass = !showPass">
                      <i :class="showPass ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                    </button>
                  </div>
                  <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">
                    {{ errors.password }}
                  </div>
                </div>

                <div class="w-100">
                  <label class="form-label small fw-bold text-dark mb-1">{{ $t('register.confirmPassword') }}</label>
                  <div class="irus-input-wrapper d-flex align-items-center">
                    <input :type="showConfirmPass ? 'text' : 'password'" class="irus-input ps-3 pe-3 flex-grow-1 border-0" 
                      :class="{ 'border-danger': errors.confirmPassword }"
                      :placeholder="$t('register.reEnterPassword')" 
                      v-model="form.confirmPassword" 
                      @blur="validateField('confirmPassword')"
                      required />
                    <button type="button" class="btn text-secondary border-0 bg-transparent px-2" @click="showConfirmPass = !showConfirmPass">
                      <i :class="showConfirmPass ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                    </button>
                  </div>
                  <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">
                    {{ errors.confirmPassword }}
                  </div>
                </div>
              </div>

              <div class="form-check mt-0 mb-3"> 
                <input class="form-check-input" type="checkbox" id="promo" v-model="form.receivePromo">
                <label class="form-check-label small text-secondary" for="promo">
                  {{ $t('register.promo') }}
                </label>
              </div>

              <hr class="border-secondary opacity-10 my-3">

              <div class="d-flex justify-content-between align-items-center py-2">
                <span class="fw-bold small">{{ $t('register.roleSwitch') }}</span>
                <div class="form-check form-switch m-0">
                  <input class="form-check-input custom-switch shadow-none" type="checkbox" v-model="isStudent" @change="handleToggle('student')">
                </div>
              </div>

              <div v-if="isStudent" class="bg-light p-3 rounded-3 animate-fade mb-3 border">
                <label class="small fw-bold mb-2 text-dark">{{ $t('register.youAre') }}</label>
                <div class="d-flex gap-3 mb-3">
                  <label class="role-selector w-100 cursor-pointer">
                    <input type="radio" name="role" value="student" v-model="form.studentRole" class="d-none peer">
                    <div class="selector-content p-2 rounded-3 text-center border d-flex align-items-center justify-content-center gap-2">
                      <i class="bi bi-backpack"></i> <span class="small fw-bold">{{ $t('register.student') }}</span>
                    </div>
                  </label>
                  <label class="role-selector w-100 cursor-pointer">
                    <input type="radio" name="role" value="teacher" v-model="form.studentRole" class="d-none peer">
                    <div class="selector-content p-2 rounded-3 text-center border d-flex align-items-center justify-content-center gap-2">
                      <i class="bi bi-person-video3"></i> <span class="small fw-bold">{{ $t('register.teacher') }}</span>
                    </div>
                  </label>
                </div>

                <div class="d-flex gap-3">
                  <div class="w-100">
                    <div class="d-flex flex-column w-100" ref="dropdownRef">
                      <div class="irus-input ps-3 pe-3 d-flex align-items-center justify-content-between cursor-pointer bg-white" 
                        :class="{ 'border-danger': errors.schoolLevel, 'border-black': isDropdownOpen && !errors.schoolLevel }" 
                        @click="toggleDropdown">
                        <span :class="form.schoolLevel ? 'text-dark fw-medium' : 'text-muted'">{{ currentSchoolLabel }}</span>
                        <i class="bi bi-chevron-down text-secondary transition-rotate" :class="{ 'rotate-180': isDropdownOpen }" style="font-size: 0.85rem;"></i>
                      </div>
                      <Transition name="slide-fade">
                        <div v-if="isDropdownOpen" class="custom-dropdown-menu shadow-lg rounded-4 border-0 mt-2 w-100 bg-white" style="z-index: 1000;">
                          <ul class="list-unstyled mb-0 p-2">
                            <li v-for="option in schoolOptions" :key="option.value"
                              class="dropdown-item rounded-2 py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center"
                              :class="{ 'active-item': form.schoolLevel === option.value }" @click="selectOption(option)">
                              <span>{{ option.label }}</span>
                              <i v-if="form.schoolLevel === option.value" class="bi bi-check-lg text-black"></i>
                            </li>
                          </ul>
                        </div>
                      </Transition>
                    </div>
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.schoolLevel }}</div>
                  </div>

                  <div class="w-100">
                    <input type="text" class="irus-input ps-3" 
                      :class="{ 'border-danger': errors.schoolName }"
                      :placeholder="$t('register.enterSchoolName')" 
                      v-model="form.schoolName"
                      @blur="validateField('schoolName')">
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.schoolName }}</div>
                  </div>
                </div>
                
                <div class="mt-0">
                  <label class="x-small text-muted mb-2 fw-bold">{{ $t('register.uploadID') }}</label>
                  <div class="d-flex gap-3">
                    <div class="w-50 upload-area p-3 text-center bg-white rounded-3 border border-dashed"><i class="bi bi-cloud-arrow-up fs-4 text-secondary"></i><br><span class="x-small text-secondary">{{ $t('register.frontSide') }}</span></div>
                    <div class="w-50 upload-area p-3 text-center bg-white rounded-3 border border-dashed"><i class="bi bi-cloud-arrow-up fs-4 text-secondary"></i><br><span class="x-small text-secondary">{{ $t('register.backSide') }}</span></div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center py-2 mt-2">
                <h6 class="fw-bold small">{{ $t('register.businessCustomer') }}</h6>
                <div class="form-check form-switch m-0">
                  <input class="form-check-input custom-switch shadow-none" type="checkbox" v-model="isBusiness" @change="handleToggle('business')">
                </div>
              </div>

              <div v-if="isBusiness" class="bg-light p-3 rounded-3 animate-fade mb-3 border">

                <div class="d-flex gap-3">
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">{{ $t('register.taxCode') }}</label>
                    <input type="text" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.taxCode }"
                      :placeholder="$t('register.enterTaxCode')" 
                      v-model="form.taxCode"
                      @blur="validateField('taxCode')">
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.taxCode }}</div>
                  </div>
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">{{ $t('register.companyName') }}</label>
                    <input type="text" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.companyName }"
                      :placeholder="$t('register.enterCompanyName')" 
                      v-model="form.companyName"
                      @blur="validateField('companyName')">
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.companyName }}</div>
                  </div>
                </div>

                <div class="d-flex gap-3">
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">{{ $t('register.companyAddress') }}</label>
                    <input type="text" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.companyAddress }"
                      :placeholder="$t('register.enterCompanyAddress')" 
                      v-model="form.companyAddress"
                      @blur="validateField('companyAddress')">
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.companyAddress }}</div>
                  </div>
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">{{ $t('register.companyEmail') }}</label>
                    <input type="email" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.companyEmail }"
                      :placeholder="$t('register.enterCompanyEmail')" 
                      v-model="form.companyEmail"
                      @blur="validateField('companyEmail')">
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.companyEmail }}</div>
                  </div>
                </div>

                <div class="d-flex gap-3">
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">{{ $t('register.authorizedCCCD') }}</label>
                    <input type="text" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.authorizedCCCD }"
                      :placeholder="$t('register.enterAuthorizedCCCD')" 
                      v-model="form.authorizedCCCD"
                      @blur="validateField('authorizedCCCD')">
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.authorizedCCCD }}</div>
                  </div>
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">{{ $t('register.note') }} <span class="text-muted fw-normal">{{ $t('register.optional') }}</span></label>
                    <input type="text" class="irus-input ps-3 pe-3" 
                      :class="{ 'border-danger': errors.note }"
                      :placeholder="$t('register.enterNote')" 
                      v-model="form.note"
                      @blur="validateField('note')">
                    <div class="text-danger x-small mt-1 ps-1" style="min-height: 25px;">{{ errors.note }}</div>
                  </div>
                </div>
                
                <div class="d-flex gap-3 mt-0">
                  <div class="w-100">
                      <label class="small fw-bold mb-1 text-dark">{{ $t('register.businessLicense') }}</label>
                      <div class="upload-area p-4 text-center bg-white rounded-3 border border-dashed">
                        <i class="bi bi-upload fs-4 text-dark"></i> <br> <span class="x-small text-secondary">{{ $t('register.uploadFormat') }}</span>
                      </div>
                  </div>
                  <div class="w-100">
                      <label class="small fw-bold mb-1 text-dark">{{ $t('register.authorizationLetter') }}</label>
                      <div class="upload-area p-4 text-center bg-white rounded-3 border border-dashed">
                        <i class="bi bi-upload fs-4 text-dark"></i> <br> <span class="x-small text-secondary">{{ $t('register.uploadFormat') }}</span>
                      </div>
                  </div>
                </div>
              </div>

              <div class="form-check mt-3 mb-3">
                <input class="form-check-input" type="checkbox" id="agreeTerms" v-model="form.agreeTerms" required>
                <label class="form-check-label text-secondary" for="agreeTerms">
                  {{ $t('register.agreeWith') }} <a href="#" class="text-dark">{{ $t('register.terms') }}</a> {{ $t('register.and') }} <a href="#" class="text-dark">{{ $t('register.policy') }}</a>.
                </label>
              </div>

              <div class="d-flex gap-3 btn-actions">
                <button type="button" @click="goBack" class="irus-btn irus-btn--secondary bg-white text-dark w-50 small fw-bold">
                  {{ $t('register.goBack') }}
                </button>
                <button type="submit" 
                  :disabled="loading"
                  class="irus-btn irus-btn--primary bg-black border-black w-50 small fw-bold shadow d-flex align-items-center justify-content-center gap-2">
                  <span v-if="loading" class="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true"></span>
                  {{ $t('register.register') }}
                </button>
              </div>
            </form>
          </div>

          <div v-else-if="authStore.registerStep === 2" class="h-100 d-flex align-items-center justify-content-center flex-column">
            <OtpInput />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import GoogleLogo from '@/components/Icons/Logo/GoogleLogo.vue'
import FacebookLogo from '@/components/Icons/Logo/FacebookLogo.vue'
import OtpInput from '@/components/Models/OtpInput.vue' // Import OtpInput
import { registerSchema } from '@/utils/validation/registerSchema'
import { useGlobalToast } from '@/composables/useGlobalToast.js'
import { useAuthStore } from '@/stores/authStore.js'

const localePath = useLocalePath()
const showPass = ref(false)
const showConfirmPass = ref(false)
const isStudent = ref(false)
const isBusiness = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const toast = useGlobalToast()
const authStore = useAuthStore() // Sử dụng Store
const loading = ref(false)

const schoolOptions = [
  { value: 'university', label: 'Đại học / Cao đẳng' },
  { value: 'highschool', label: 'Trung học phổ thông' },
  { value: 'secondary', label: 'Trung học cơ sở' }
]

const currentSchoolLabel = computed(() => {
  const selected = schoolOptions.find(opt => opt.value === form.schoolLevel)
  return selected ? selected.label : 'Chọn cấp học'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectOption = (option) => {
  form.schoolLevel = option.value
  isDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const goBack = () => {
  navigateTo(localePath('/'))
}

const form = ref({
  firstName: '',
  lastName: '',
  dob: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  receivePromo: false,
  agreeTerms: false,
  studentRole: 'student',
  schoolLevel: '',
  schoolName: '',
  taxCode: '',
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  authorizedCCCD: '',
  note: ''
})

const errors = reactive({
  firstName: null,
  lastName: null,
  dob: null,
  phone: null,
  email: null,
  password: null,
  confirmPassword: null,
  schoolLevel: null,
  schoolName: null,
  taxCode: null,
  companyName: null,
  companyAddress: null,
  companyEmail: null,
  authorizedCCCD: null,
  note: null
})

const validateField = async (field) => {
  try {
    const schema = registerSchema(isStudent.value, isBusiness.value)
    await schema.validateAt(field, form.value, {
      context: form.value
    });
    errors[field] = "";
  } catch (err) {
    errors[field] = err.message;
  }
}

const fieldsToWatch = [
  "firstName", "lastName", "dob", "phone", "email",
  "password", "confirmPassword",
  "schoolLevel", "schoolName",
  "taxCode", "companyName", "companyAddress", "companyEmail", "authorizedCCCD"
];

fieldsToWatch.forEach(field => {
  watch(() => form.value[field], () => {
    validateField(field)
  })
})

const handleToggle = (type) => {
  if (type === 'student' && isStudent.value) isBusiness.value = false
  if (type === 'business' && isBusiness.value) isStudent.value = false
  Object.keys(errors).forEach(key => errors[key] = null)
}

const handleRegister = async () => {
  if (loading.value) return;
  loading.value = true;
  Object.keys(errors).forEach(key => errors[key] = null);

  try {
    const schema = registerSchema(isStudent.value, isBusiness.value);
    await schema.validate(form.value, { abortEarly: false });

    let userType = 'personal';
    if (isStudent.value) userType = form.value.studentRole;
    if (isBusiness.value) userType = 'business';

    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      dob: form.value.dob,
      phoneNumber: form.value.phone,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      receivePromo: form.value.receivePromo,
      type: userType,

      schoolLevel: isStudent.value ? form.value.schoolLevel : null,
      schoolName: isStudent.value ? form.value.schoolName : null,

      taxCode: isBusiness.value ? form.value.taxCode : null,
      companyName: isBusiness.value ? form.value.companyName : null,
      companyAddress: isBusiness.value ? form.value.companyAddress : null,
      companyEmail: isBusiness.value ? form.value.companyEmail : null,
      authorizedCCCD: isBusiness.value ? form.value.authorizedCCCD : null,
      note: isBusiness.value ? (form.value.note || null) : null,
    };

    // GỌI STORE ĐỂ ĐĂNG KÝ
    const response = await authStore.register(payload);
    
    if (response.status === true) {
      toast.success(response.message);
      // KHÔNG CẦN NAVIGATE
      // Store sẽ tự động set registerStep = 2 -> Giao diện tự đổi sang OTP
    }

  } catch (err) {
      if (err.inner) {
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
      } 
      else {
        const apiErrors = err.data?.errors;
        if (apiErrors) {
          Object.keys(apiErrors).forEach((key) => {
            if (key in errors) {
              errors[key] = apiErrors[key][0];
            } 
          });
        } else {
          toast.error(err.data?.message || err.message || 'Đăng ký thất bại');
        }
      }
  } finally {
      loading.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Tùy chọn: Reset store về step 1 khi rời trang để lần sau vào lại là form trắng
  authStore.resetToRegister(); 
})
</script>

<style scoped>
.register-container {
  max-width: 950px;
  width: 950px;
}

.irus-form .d-flex > .w-100 {
  min-width: 0;
  flex: 1 1 0;
  overflow: hidden;
}

.irus-input.ps-3 {
  padding-left: 1rem !important;
}

.x-small {
  font-size: 0.75rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.cursor-pointer {
  cursor: pointer;
}

.animate-fade {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.transition-rotate {
  transition: transform 0.3s ease-in-out;
}

.rotate-180 {
  transform: rotate(180deg);
  color: #1a1a1a !important;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.custom-switch {
  width: 2.8em;
  height: 1.4em;
  cursor: pointer;
  background-color: #e9ecef;
  border-color: #dee2e6;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}

.custom-switch:checked {
  background-color: #1a1a1a;
  border-color: #1a1a1a;
}

.selector-content {
  background-color: #fff;
  border-color: #dee2e6;
  color: #6c757d;
  transition: all 0.2s ease-in-out;
  height: 48px;
}

.role-selector:hover .selector-content {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

.peer:checked+.selector-content {
  background-color: #ffff;
  border-color: #1a1a1a !important;
  color: #1a1a1a;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.1);
}

.border-dashed {
  border-style: dashed !important;
  border-color: #ced4da !important;
}

.upload-area {
  transition: all 0.2s;
  cursor: pointer;
}

.upload-area:hover {
  background-color: #ffff !important;
  border-color: #1a1a1a !important;
}

.upload-area:hover i,
.upload-area:hover span {
  color: #1a1a1a !important;
}

.dropdown-item {
  transition: all 0.2s;
  color: #495057;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #000;
  transform: translateX(5px);
}

.active-item {
  background-color: #ffff !important;
  color: #1a1a1a !important;
  font-weight: 600;
}

.social-hover:hover {
  background-color: #f8f9fa !important;
  border-color: #000 !important;
}

.form-check-input:checked {
  background-color: #000;
  border-color: #000;
}

@media screen and (max-width: 991px) {
  .register-container {
    max-width: 100%;
    width: 100%;
    margin: 0 1rem;
  }
}

@media screen and (max-width: 767px) {
  .register-container {
    margin: 0 0.5rem;
  }

  .irus-form > .d-flex.gap-3:not(.btn-actions) {
    flex-direction: column;
    gap: 0 !important;
  }

  .irus-form > .d-flex.gap-3 > .w-100 {
    flex: 1 1 100%;
    width: 100%;
  }

  .btn-actions {
    flex-direction: row !important;
    gap: 0.75rem !important;
  }

  .btn-actions .w-50 {
    flex: 1;
  }

  .irus-input-wrapper {
    width: 100%;
  }

  .selector-content {
    height: 44px;
  }

  .upload-area {
    padding: 0.75rem !important;
  }
}

@media screen and (max-width: 480px) {
  .register-page {
    padding: 1rem 0 !important;
  }

  .register-container {
    margin: 0;
    border-radius: 0 !important;
  }
}
</style>
