<template>
    <footer class="bg-black text-white py-5">
        <div class="container">
            <div class="d-flex flex-wrap justify-content-between gap-4">
                <!-- Brand Slogan -->
                <div>
                    <h2 class="fs-3 fw-bold lh-sm">
                        {{ $t('footer.slogan.line1') }}<br>
                        {{ $t('footer.slogan.line2') }}<br>
                        {{ $t('footer.slogan.line3') }}<sup class="fs-6">®</sup>
                    </h2>
                </div>
                
                <!-- Location 1: HCM -->
                <div>
                    <h6 class="text-uppercase fw-bold mb-3 text-white-50">{{ $t('footer.locations.hcm.name') }}</h6>
                    <p class="mb-1">
                        <a href="mailto:contact@irusgear.com" class="text-white text-decoration-underline">
                            contact@irusgear.com
                        </a>
                    </p>
                    <p class="mb-1">+84 28 1234 5678</p>
                    <p class="mb-3 text-white-50">
                        {{ $t('footer.locations.hcm.address1') }}<br>
                        {{ $t('footer.locations.hcm.address2') }}
                    </p>
                    <a href="#" class="text-white text-decoration-underline small">
                        {{ $t('footer.seeOnMap') }} <i class="bi bi-arrow-up-right"></i>
                    </a>
                </div>
                
                <!-- Location 2: Hanoi -->
                <div>
                    <h6 class="text-uppercase fw-bold mb-3 text-white-50">{{ $t('footer.locations.hanoi.name') }}</h6>
                    <p class="mb-1">
                        <a href="mailto:hanoi@irusgear.com" class="text-white text-decoration-underline">
                            hanoi@irusgear.com
                        </a>
                    </p>
                    <p class="mb-1">+84 24 9876 5432</p>
                    <p class="mb-3 text-white-50">
                        {{ $t('footer.locations.hanoi.address1') }}<br>
                        {{ $t('footer.locations.hanoi.address2') }}
                    </p>
                    <a href="#" class="text-white text-decoration-underline small">
                        {{ $t('footer.seeOnMap') }} <i class="bi bi-arrow-up-right"></i>
                    </a>
                </div>
                
                <!-- Newsletter & Social -->
                <div>
                    <p class="text-uppercase small text-white-50 mb-2">{{ $t('footer.newsletter.question') }}</p>
                    <a href="#" class="text-white text-decoration-underline fw-bold d-block mb-4">
                        {{ $t('footer.newsletter.signup') }} <i class="bi bi-arrow-right"></i>
                    </a>
                    
                    <p class="text-uppercase small text-white-50 mb-2">{{ $t('footer.followUs') }}</p>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-white fs-5"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="text-white fs-5"><i class="bi bi-tiktok"></i></a>
                        <a href="#" class="text-white fs-5"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="text-white fs-5"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>
            </div>
            
            <!-- Bottom divider -->
            <hr class="my-4 border-secondary">
            
            <!-- Copyright -->
            <div class="text-center text-white-50 small">
                <p class="mb-0">{{ $t('footer.copyright') }}</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
</script>

<style scoped>
</style>
