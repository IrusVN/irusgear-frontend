<template>
  <div class="register-page d-flex align-items-center justify-content-center py-5">
    <div class="register-container irus-card w-100 overflow-hidden" style="max-width: 1000px;">

      <div class="d-flex flex-column flex-lg-row">
        <div class="p-4 p-md-5 d-flex flex-column justify-content-center align-items-center text-center bg-light-subtle"
          style="min-width: 350px;">
          <div class="mb-4">
            <img src="@/public/favicon-dark.svg" alt="Logo" class="mb-3" style="height: 80px;">
            <h3 class="text-dark fw-bold text-uppercase mb-2">Đăng ký</h3>
            <p class="text-secondary small">Trở thành thành viên ngay hôm nay</p>
          </div>
          <div class="w-100">
            <p class="text-secondary small fw-bold mb-3">Đăng ký nhanh bằng</p>
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

        <div class="p-4 p-md-5 flex-grow-1 bg-white">
          <div class="d-flex align-items-center mb-4">
            <div class="flex-grow-1 border-top"></div>
            <span class="fw-bold text-nowrap ms-3 me-3">Hoặc điền thông tin</span>
            <div class="flex-grow-1 border-top"></div>
          </div>

          <form @submit.prevent="handleRegister" class="irus-form">
            <h6 class="fw-bold mb-0 text-dark">Thông tin cá nhân</h6>

            <div class="d-flex gap-3 flex-column flex-md-row">
              <div class="w-100">
                <label class="form-label small fw-bold text-dark mb-1">Họ và tên</label>
                <div class="irus-input-wrapper">
                  <input type="text" class="irus-input ps-3 pe-3" placeholder="Nhập họ và tên" v-model="form.fullName" required />
                </div>
              </div>
              <div class="w-100">
                <label class="form-label small fw-bold text-dark mb-1">Ngày sinh</label>
                <div class="irus-input-wrapper">
                  <input type="date" class="irus-input ps-3 pe-3" v-model="form.dob" required />
                </div>
              </div>
            </div>

            <div class="d-flex gap-3 flex-column flex-md-row">
              <div class="w-100">
                <label class="form-label small fw-bold text-dark mb-1">Số điện thoại</label>
                <div class="irus-input-wrapper">
                  <input type="tel" class="irus-input ps-3 pe-3" placeholder="Nhập số điện thoại" v-model="form.phone" required />
                </div>
              </div>
              <div class="w-100">
                <label class="form-label small fw-bold text-dark mb-1">Email</label>
                <div class="irus-input-wrapper">
                  <input type="email" class="irus-input ps-3 pe-3" placeholder="Nhập email" v-model="form.email" />
                </div>
              </div>
            </div>

            <h6 class="fw-bold mt-2 mb-0 text-dark">Bảo mật</h6>

            <div class="d-flex gap-3 flex-column flex-md-row">
              <div class="w-100">
                <label class="form-label small fw-bold text-dark mb-1">Mật khẩu</label>
                <div class="irus-input-wrapper">
                  <input :type="showPass ? 'text' : 'password'" class="irus-input ps-3 pe-5" placeholder="Mật khẩu" v-model="form.password" required />
                  <button type="button" class="btn position-absolute end-0 me-2 text-secondary border-0 bg-transparent" @click="showPass = !showPass">
                    <i :class="showPass ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                  </button>
                </div>
              </div>
              <div class="w-100">
                <label class="form-label small fw-bold text-dark mb-1">Xác nhận mật khẩu</label>
                <div class="irus-input-wrapper">
                  <input :type="showConfirmPass ? 'text' : 'password'" class="irus-input ps-3 pe-5" placeholder="Nhập lại mật khẩu" v-model="form.confirmPassword" required />
                  <button type="button" class="btn position-absolute end-0 me-2 text-secondary border-0 bg-transparent" @click="showConfirmPass = !showConfirmPass">
                    <i :class="showConfirmPass ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-check mt-2">
              <input class="form-check-input" type="checkbox" id="promo" v-model="form.receivePromo">
              <label class="form-check-label small text-secondary" for="promo">
                Nhận tin khuyến mãi từ IrusGear
              </label>
            </div>

            <hr class="border-secondary opacity-10 my-3">

            <div class="d-flex justify-content-between align-items-center py-2">
              <span class="fw-bold small">Học sinh - Sinh viên / Giáo viên</span>
              <div class="form-check form-switch m-0">
                <input class="form-check-input custom-switch shadow-none" type="checkbox" v-model="isStudent" @change="handleToggle('student')">
              </div>
            </div>

            <div v-if="isStudent" class="bg-light p-3 rounded-3 animate-fade mb-3 border">
              <label class="small fw-bold mb-2 text-dark">Bạn là:</label>
              <div class="d-flex gap-3 mb-3">
                <label class="role-selector w-100 cursor-pointer">
                  <input type="radio" name="role" value="student" v-model="form.studentRole" class="d-none peer">
                  <div class="selector-content p-2 rounded-3 text-center border d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-backpack"></i>
                    <span class="small fw-bold">Học sinh - SV</span>
                  </div>
                </label>

                <label class="role-selector w-100 cursor-pointer">
                  <input type="radio" name="role" value="teacher" v-model="form.studentRole" class="d-none peer">
                  <div
                    class="selector-content p-2 rounded-3 text-center border d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-person-video3"></i>
                    <span class="small fw-bold">Giáo viên</span>
                  </div>
                </label>
              </div>

              <div class="d-flex flex-column flex-md-row gap-3">
                <div class="position-relative w-100" ref="dropdownRef">
                  <div class="irus-input ps-3 pe-3 d-flex align-items-center justify-content-between cursor-pointer bg-white" :class="{ 'border-black': isDropdownOpen }" @click="toggleDropdown">
                    <span :class="form.schoolLevel ? 'text-dark fw-medium' : 'text-muted'">
                      {{ currentSchoolLabel }}
                    </span>
                    <i class="bi bi-chevron-down text-secondary transition-rotate" :class="{ 'rotate-180': isDropdownOpen }" style="font-size: 0.85rem;"></i>
                  </div>

                  <Transition name="slide-fade">
                    <div v-if="isDropdownOpen"
                      class="custom-dropdown-menu shadow-lg rounded-4 border-0 mt-2 position-absolute w-100 bg-white"
                      style="z-index: 1000;">
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

                <div class="w-100">
                  <input type="text" class="irus-input ps-3" placeholder="Nhập tên trường" v-model="form.schoolName">
                </div>
              </div>

              <div class="mt-3">
                <label class="x-small text-muted mb-2 fw-bold">Tải ảnh thẻ (Mặt trước & sau)</label>
                <div class="d-flex gap-3">
                  <div
                    class="w-50 upload-area p-3 text-center bg-white rounded-3 border border-dashed d-flex flex-column align-items-center justify-content-center">
                    <i class="bi bi-cloud-arrow-up fs-4 text-secondary mb-1"></i>
                    <span class="x-small text-secondary">Mặt trước</span>
                  </div>
                  <div
                    class="w-50 upload-area p-3 text-center bg-white rounded-3 border border-dashed d-flex flex-column align-items-center justify-content-center">
                    <i class="bi bi-cloud-arrow-up fs-4 text-secondary mb-1"></i>
                    <span class="x-small text-secondary">Mặt sau</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center py-2 mt-2">
              <h6 class="fw-bold small">Tôi là Khách hàng Doanh nghiệp</h6>
              <div class="form-check form-switch m-0">
                <input class="form-check-input custom-switch shadow-none" type="checkbox" v-model="isBusiness" @change="handleToggle('business')">
              </div>
            </div>

            <div v-if="isBusiness" class="bg-light p-3 rounded-3 animate-fade mb-3 border">

               <div class="d-flex flex-column flex-md-row gap-3 mb-3">
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">Mã số thuế</label>
                    <input type="text" class="irus-input ps-3 pe-3" placeholder="Nhập mã số thuế" v-model="form.taxCode">
                  </div>
                  <div class="w-100">
                    <label class="small fw-bold mb-1 text-dark">Tên công ty</label>
                    <input type="text" class="irus-input ps-3 pe-3" placeholder="Nhập tên công ty" v-model="form.companyName">
                  </div>
               </div>

               <div class="d-flex flex-column flex-md-row gap-3 mb-3">
                  <div class="w-100">
                     <label class="small fw-bold mb-1 text-dark">Địa chỉ công ty</label>
                     <input type="text" class="irus-input ps-3 pe-3" placeholder="Nhập địa chỉ công ty" v-model="form.companyAddress">
                  </div>
                  <div class="w-100">
                     <label class="small fw-bold mb-1 text-dark">Địa chỉ email công ty</label>
                     <input type="email" class="irus-input ps-3 pe-3" placeholder="Nhập địa chỉ email công ty" v-model="form.companyEmail">
                  </div>
               </div>

               <div class="d-flex flex-column flex-md-row gap-3 mb-3">
                  <div class="w-100">
                     <label class="small fw-bold mb-1 text-dark">CCCD người được uỷ quyền</label>
                     <input type="text" class="irus-input ps-3 pe-3" placeholder="Nhập CCCD người được uỷ quyền" v-model="form.authorizedCCCD">
                  </div>
                  <div class="w-100">
                     <label class="small fw-bold mb-1 text-dark">Ghi chú <span class="text-muted fw-normal">(Không bắt buộc)</span></label>
                     <input type="text" class="irus-input ps-3 pe-3" placeholder="Nhập ghi chú" v-model="form.note">
                  </div>
               </div>

               <div class="d-flex flex-column flex-md-row gap-3">
                  
                  <div class="w-100">
                     <label class="small fw-bold mb-1 text-dark">Giấy phép kinh doanh</label>
                     <div class="upload-area p-4 text-center bg-white rounded-3 border border-dashed position-relative d-flex flex-column align-items-center justify-content-center">
                        <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3 py-0 position-absolute top-0 end-0 mt-2 me-2" style="font-size: 0.7rem;">
                           Xem file mẫu
                        </button>
                        
                        <i class="bi bi-upload fs-4 text-dark mb-2"></i> 
                        <p class="small mb-1 text-dark">Kéo thả hoặc <span class="text-dark fw-bold">Chọn file</span> tải lên</p>
                        <span class="x-small text-muted opacity-75">Định dạng: .JPG, .PNG, .PDF - Tối đa 5 MB</span>
                     </div>
                  </div>

                  <div class="w-100">
                     <label class="small fw-bold mb-1 text-dark">Giấy uỷ quyền</label>
                     <div class="upload-area p-4 text-center bg-white rounded-3 border border-dashed position-relative d-flex flex-column align-items-center justify-content-center">
                        <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3 py-0 position-absolute top-0 end-0 mt-2 me-2" style="font-size: 0.7rem;">
                           Xem file mẫu
                        </button>

                        <i class="bi bi-upload fs-4 text-dark mb-2"></i> 
                        <p class="small mb-1 text-dark">Kéo thả hoặc <span class="text-dark fw-bold">Chọn file</span> tải lên</p>
                        <span class="x-small text-muted opacity-75">Định dạng: .JPG, .PNG, .PDF - Tối đa 5 MB</span>
                     </div>
                  </div>
               </div>

            </div>

            <div class="d-flex gap-3 mt-4">
              <button type="button" @click="goBack" class="irus-btn irus-btn--secondary bg-white text-dark w-50 small fw-bold">
                Quay lại
              </button>
              <button type="submit" class="irus-btn irus-btn--primary bg-black border-black w-50 small fw-bold shadow">
                Đăng ký
              </button>
            </div>

            <p class="x-small text-center text-secondary mt-3 mb-0">
              Bằng việc đăng ký, bạn đồng ý với <a href="#" class="text-dark">Điều khoản</a> & <a href="#"
                class="text-dark">Chính sách</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import GoogleLogo from '@/components/Icons/Logo/GoogleLogo.vue'
import FacebookLogo from '@/components/Icons/Logo/FacebookLogo.vue'

const localePath = useLocalePath()
const showPass = ref(false)
const showConfirmPass = ref(false)
const isStudent = ref(false)
const isBusiness = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

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

const form = reactive({
  fullName: '', dob: '', phone: '', email: '',
  password: '', confirmPassword: '', receivePromo: false,
  studentRole: 'student', schoolLevel: '', schoolName: '',
  taxCode: '', companyName: '', companyAddress: '',
  companyEmail: '',
  authorizedCCCD: '',
  note: ''
})

const handleToggle = (type) => {
  if (type === 'student' && isStudent.value) isBusiness.value = false
  if (type === 'business' && isBusiness.value) isStudent.value = false
}

const goBack = () => navigateTo('/auth/login')
const handleRegister = () => console.log('Registering...', form)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.irus-input.ps-3 {
  padding-left: 1rem !important;
}

.x-small {
  font-size: 0.75rem;
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
</style>