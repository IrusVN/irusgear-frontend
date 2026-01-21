<template>
  <div class="position-relative">
    <div class="fixed-top w-100 d-flex justify-content-center mt-4 px-3">
      <nav class="container navbar navbar-expand-lg glass-navbar rounded-pill px-4 py-2 w-100 shadow-sm">
        <div class="container-fluid px-0">
          <NuxtLink to="/" class="navbar-brand d-flex align-items-center gap-2 fw-bolder text-dark me-0">
            <img src="@/public/image/logo-irusgear-black.png" alt="" class="img-fluid navbar-logo">
          </NuxtLink>

          <div class="d-none d-lg-flex mx-auto">
            <ul class="navbar-nav d-flex flex-row align-items-center gap-1">
              <li class="nav-item">
                <NuxtLink to="/" class="nav-link px-3 py-2 rounded-pill fw-semibold text-secondary">{{ $t('sidebar.menu.home') }}</NuxtLink>
              </li>

              <li class="nav-item dropdown group-hover position-static">
                <a class="nav-link px-3 py-2 rounded-pill fw-semibold text-secondary dropdown-toggle no-caret" href="#" role="button">
                  {{ $t('sidebar.menu.products') }} <i class="bi bi-chevron-down ms-1"></i>
                </a>

                <div class="dropdown-menu glass-dropdown border-0 shadow-lg p-0 rounded-4 overflow-hidden mega-dropdown">
                  <div class="container-fluid p-4 bg-white bg-opacity-75">
                    <div class="d-flex gap-4">
                      <!-- Cột 1 -->
                      <div class="flex-fill">
                        <h6 class="text-uppercase text-secondary fw-bold fs-7 mb-3 ls-1">
                          Công nghệ
                        </h6>
                        <div class="d-flex flex-column gap-2">
                          <NuxtLink to="#" class="dropdown-item rounded-3 p-2 d-flex align-items-center gap-2 text-dark">
                            <i class="bi bi-laptop text-secondary"></i> Laptop & PC
                          </NuxtLink>
                          <NuxtLink to="#" class="dropdown-item rounded-3 p-2 d-flex align-items-center gap-2 text-dark">
                            <i class="bi bi-phone text-secondary"></i> Smart Phone
                          </NuxtLink>
                          <NuxtLink to="#" class="dropdown-item rounded-3 p-2 d-flex align-items-center gap-2 text-dark">
                            <i class="bi bi-headphones text-secondary"></i> Âm thanh
                          </NuxtLink>
                        </div>
                      </div>

                      <!-- Cột 2 -->
                      <div class="flex-fill">
                        <h6 class="text-uppercase text-secondary fw-bold fs-7 mb-3 ls-1">
                          Phụ kiện
                        </h6>
                        <div class="d-flex flex-column gap-2">
                          <NuxtLink to="#" class="dropdown-item rounded-3 p-2 text-dark">
                            Bàn phím cơ
                          </NuxtLink>
                          <NuxtLink to="#" class="dropdown-item rounded-3 p-2 text-dark">
                            Chuột Gaming
                          </NuxtLink>
                          <NuxtLink to="#" class="dropdown-item rounded-3 p-2 text-dark">
                            Setup bàn làm việc
                          </NuxtLink>
                        </div>
                      </div>

                      <!-- Cột 3 -->
                      <div class="flex-fill">
                        <div class="card border-0 h-100 bg-light rounded-3 overflow-hidden position-relative text-white">
                          <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-gradient"></div>
                          <div class="card-body position-relative d-flex flex-column justify-content-end h-100 pt-5">
                            <span class="badge bg-primary mb-2">New</span>
                            <h6 class="fw-bold mb-0">RTX 5090 Series</h6>
                            <small class="text-white-50">Sức mạnh tối thượng</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="nav-item">
                <NuxtLink to="#" class="nav-link px-3 py-2 rounded-pill fw-semibold text-secondary">Tin tức</NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink to="#" class="nav-link px-3 py-2 rounded-pill fw-semibold text-secondary">Liên hệ</NuxtLink>
              </li>
            </ul>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-icon text-secondary rounded-circle">
              <i class="bi bi-search fs-5"></i>
            </button>

            <NuxtLink to="#" class="btn btn-icon text-secondary rounded-circle position-relative me-2">
              <i class="bi bi-cart3 fs-5"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white p-1">2</span>
            </NuxtLink>
            <div class="vr d-none d-lg-block mx-2 bg-secondary opacity-25"></div>

            <div class="dropdown">
              <a href="#" class="d-flex align-items-center gap-2 text-decoration-none p-1 rounded-pill hover-bg ps-2" data-bs-toggle="dropdown">
                <img src="https://ui-avatars.com/api/?name=Huy+Hoang&background=000&color=fff" class="rounded-circle border" width="35" height="35" alt="Avatar">
                <div class="d-none d-xl-block text-start lh-1">
                  <div class="fw-bold text-dark fs-7">Huy Hoàng</div>
                  <small class="text-secondary fs-8">Thành viên vàng</small>
                </div>
                <i class="bi bi-caret-down-fill fs-8 text-secondary ms-1"></i>
              </a>

              <ul class="dropdown-menu dropdown-menu-end glass-dropdown border-0 shadow-lg mt-3 rounded-4 p-2">
                <li><NuxtLink to="#" class="dropdown-item rounded-3 py-2"><i class="bi bi-person me-2"></i>Hồ sơ cá nhân</NuxtLink></li>
                <li><NuxtLink to="#" class="dropdown-item rounded-3 py-2"><i class="bi bi-box-seam me-2"></i>Đơn mua</NuxtLink></li>
                <li><NuxtLink to="#" class="dropdown-item rounded-3 py-2"><i class="bi bi-heart me-2"></i>Yêu thích</NuxtLink></li>
                <li><hr class="dropdown-divider opacity-10 my-1"></li>
                <li><a class="dropdown-item rounded-3 py-2 text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
@keyframes flow {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.glass-navbar {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.nav-link {
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: #000 !important;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.btn-icon {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none;
  transition: 0.2s;
}
.btn-icon:hover {
  background-color: rgba(0,0,0,0.05);
  color: black !important;
}

.no-caret::after { display: none; }

.glass-dropdown {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.navbar-logo {
  height: 32px;
  width: auto;
}

.mega-dropdown {
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
}

@media (min-width: 992px) {
  .group-hover:hover .dropdown-menu {
    display: block;
    animation: slideUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
