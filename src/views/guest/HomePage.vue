<template>
  <div class="min-h-screen flex flex-col font-sans bg-gray-50 smooth-scroll">
    
    <section class="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#74E600]">
      
      <!-- Animated Background Particles -->
      <div class="absolute inset-0 w-full h-full z-5 particles-container">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
      
      <div class="absolute inset-0 w-full h-full z-0">
        <video
          ref="videoRef"
          class="absolute inset-0 w-full h-full object-cover scale-105 hero-video"
          playsinline
          webkit-playsinline
          loop
          muted
          autoplay
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-POb2ZvFC3XFHt2BagDAbR1nHObljsH.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        
        <div class="absolute inset-0 bg-black/40 z-10"></div>
      </div>

      <div class="absolute inset-0 bg-gradient-to-br from-[#A8EB12]/20 via-[#74E600]/25 to-[#3ED400]/20 z-20 pointer-events-none animate-gradient-shift"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20 pointer-events-none"></div>
      
      <!-- Animated Shapes - Hidden on mobile -->
      <div class="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-[#A8EB12]/20 rounded-full blur-xl animate-float-slow z-15"></div>
      <div class="hidden sm:block absolute bottom-20 right-10 w-40 h-40 bg-[#3ED400]/20 rounded-full blur-xl animate-float-delay z-15"></div>
      <div class="hidden md:block absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse-slow z-15"></div>

      <div class="relative z-30 container mx-auto px-4 sm:px-6 text-center mt-6 sm:mt-10 hero-content">
        <div class="inline-block p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-fade-in-up floating-animation w-full sm:w-auto max-w-[95%] sm:max-w-none">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 leading-tight drop-shadow-xl text-animate px-2 sm:px-0">
            <span class="inline-block animate-slide-in-left text-reveal">
              <span v-for="(char, idx) in 'Fast & Reliable'.split('')" :key="idx" class="inline-block char-animate" :style="{ animationDelay: `${idx * 0.05}s` }">{{ char === ' ' ? '\u00A0' : char }}</span>
            </span>
            <span class="block mt-1 sm:mt-2 text-[#A8EB12] drop-shadow-lg inline-block animate-slide-in-right text-reveal">
              <span v-for="(char, idx) in 'Delivery Service'.split('')" :key="idx" class="inline-block char-animate" :style="{ animationDelay: `${idx * 0.05 + 0.4}s` }">{{ char === ' ' ? '\u00A0' : char }}</span>
            </span>
          </h1>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium animate-fade-in-delay px-2 sm:px-0">
            From food delivery to bill payments, we've got you covered in Calapan City. Experience seamless service today.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-buttons-in px-2 sm:px-0">
            <router-link 
              to="/login" 
              @click="handleNavigation('/login')"
              class="relative w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-[#74E600] transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg button-pulse button-ripple overflow-hidden group"
            >
              <span class="relative z-10">Login</span>
              <span class="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></span>
            </router-link>
            <router-link 
              to="/register" 
              @click="handleNavigation('/register')"
              class="relative w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-full bg-white text-[#74E600] font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-rotate-1 hover:bg-gray-100 button-pulse button-shimmer overflow-hidden group"
            >
              <span class="relative z-10">Get Started</span>
              <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section id="services-section" class="py-10 sm:py-12 md:py-16 bg-gray-50 relative z-10 scroll-animate">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="text-center mb-8 sm:mb-10 md:mb-12 section-header">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#05103B] mb-2 animate-title-in">Our Services</h2>
          <div class="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#74E600] mx-auto rounded-full animate-line-expand"></div>
        </div>
        
        <!-- Carousel Container -->
        <div class="relative px-8 sm:px-0">
          <!-- Left Arrow Button -->
          <button 
            @click="prevSlide('services')"
            class="absolute left-0 sm:-left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white active:bg-[#74E600] transition-all duration-300 transform hover:scale-110 active:scale-95 carousel-btn touch-manipulation"
            :class="{ 'opacity-50 cursor-not-allowed': currentServiceIndex === 0 }"
            :disabled="currentServiceIndex === 0"
          >
            <svg class="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Services Carousel -->
          <div class="overflow-hidden">
            <div 
              class="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-4 md:gap-6"
              :style="{ transform: `translateX(-${currentServiceIndex * (100 / servicesPerView)}%)` }"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd('services')"
            >
          <div 
            v-for="(service, index) in services" 
            :key="service.id" 
            class="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-105 flex flex-col items-center text-center service-card flex-shrink-0"
            :style="{ width: `calc(${100 / servicesPerView}% - ${(servicesPerView - 1) * 12 / servicesPerView}px)`, animationDelay: `${index * 0.1}s` }"
          >
            <div class="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#74E600] to-[#5CBC00] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-md text-white icon-container icon-glow">
              <div class="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#A8EB12] to-[#3ED400] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>
              <div class="relative z-10">
               <svg v-if="service.id === 1" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M20.193 18.092v8.198c0 .389-.383.702-.859.702s-.859-.313-.859-.702v-8.198m-2.017 0v8.198c0 .389-.383.702-.859.702s-.859-.313-.859-.702v-8.198m5.226 24.407v-9.15c0-.963.006-1.397 1.223-2.616c1.218-1.218 1.223-1.694 1.223-2.615v-8.704c0-.732-.589-1.32-1.32-1.32h-.898m-5.452 0h-.9c-.732 0-1.32.588-1.32 1.32l.003 8.704c.004.921.01 1.397 1.227 2.615s1.224 1.653 1.22 2.615l-.005 9.151m3.51-24.405H16.46m17.025 24.405V30.577c1.667-1.185 2.705-3.456 2.708-5.925c0-3.736-2.33-6.765-5.205-6.766h-.003c-2.875 0-5.205 3.03-5.205 6.766c.003 2.469 1.04 4.74 2.706 5.925v11.922M16.451 12.724v-2.99c0-.731.589-1.32 1.32-1.32h12.456c.732 0 1.321.589 1.321 1.32v2.99zM33.485 42.5h3.278c2.195 0 3.884-1.768 3.962-3.96l.924-25.917L36.873 5.5H11.129l-4.778 7.123l.924 25.917c.078 2.192 1.767 3.96 3.962 3.96h3.73m4.998 0h8.52" /></svg>
               <svg v-else-if="service.id === 2" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5zm8 16h12m-12 8h12M18 14h12" /></svg>
               <svg v-else-if="service.id === 3" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="m17.578 4.432l-2-1.05C13.822 2.461 12.944 2 12 2s-1.822.46-3.578 1.382l-.321.169l8.923 5.099l4.016-2.01c-.646-.732-1.688-1.279-3.462-2.21m4.17 3.534l-3.998 2V13a.75.75 0 0 1-1.5 0v-2.286l-3.5 1.75v9.44c.718-.179 1.535-.607 2.828-1.286l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.597-1.014.597-2.277.597-4.8v-.117c0-1.893 0-3.076-.252-3.978M11.25 21.904v-9.44l-8.998-4.5C2 8.866 2 10.05 2 11.941v.117c0 2.525 0 3.788.597 4.802c.598 1.015 1.674 1.58 3.825 2.709l2 1.049c1.293.679 2.11 1.107 2.828 1.286M2.96 6.641l9.04 4.52l3.411-1.705l-8.886-5.078l-.103.054c-1.773.93-2.816 1.477-3.462 2.21" /></svg>
               <svg v-else-if="service.id === 4" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M1 2v2h2l3.6 7.59l-1.35 2.45c-.16.28-.25.61-.25.96c0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12l.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2" /></svg>
               <svg v-else-if="service.id === 5" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 48 48"><defs><mask id="SVGOK6PceUP"><g fill="none"><rect width="38" height="26" x="5" y="16" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="3"/><path fill="#fff" d="M19 8h10V4H19zm11 1v7h4V9zm-12 7V9h-4v7zm11-8a1 1 0 0 1 1 1h4a5 5 0 0 0-5-5zM19 4a5 5 0 0 0-5 5h4a1 1 0 0 1 1-1z"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M18 29h12m-6-6v12"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGOK6PceUP)"/></svg>
               <svg v-else-if="service.id === 6" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M20.25 13.5a.25.25 0 0 0-.25.25v3a.25.25 0 0 0 .25.25h2.25a1.5 1.5 0 0 0 1.5-1.5v-1.75a.25.25 0 0 0-.25-.25Zm-1.5-1a.25.25 0 0 0 .25-.25V10.5a.5.5 0 0 1 1 0v1.75a.25.25 0 0 0 .25.25h3.5a.25.25 0 0 0 .25-.25V10.5A1.5 1.5 0 0 0 22.5 9h-.84a.25.25 0 0 1-.23-.15a.26.26 0 0 1 .06-.28L22 8a.75.75 0 0 0-1-1l-1.32 1.26a.25.25 0 0 1-.36 0L18 7a.75.75 0 0 0-1 1l.54.54a.26.26 0 0 1 .06.28a.25.25 0 0 1-.23.15h-.87A1.5 1.5 0 0 0 15 10.5v1.75a.25.25 0 0 0 .25.25Zm.25 1.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25v1.75a1.5 1.5 0 0 0 1.5 1.5h2.25a.25.25 0 0 0 .25-.25Z"/><path d="M10.61 15.5H13a1 1 0 0 0 0-2h-1.83a.5.5 0 0 1-.38-.17a.47.47 0 0 1-.12-.38l.68-6.5a.5.5 0 0 1 .5-.45h6.65a1 1 0 0 0 0-2h-.75a.25.25 0 0 1-.25-.25V3a3 3 0 0 0-6 0v.9a.09.09 0 0 1-.1.1a2 2 0 0 0-2 1.79l-.79 7.5a2 2 0 0 0 .51 1.55a2 2 0 0 0 1.49.66M13.5 3a1 1 0 0 1 2 0v.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25ZM1 14.75a1 1 0 0 0-1 1V23a1 1 0 0 0 2 0v-7.25a1 1 0 0 0-1-1m14.5 4.75H6.38a.63.63 0 1 1 0-1.25H8.9a1 1 0 0 0 .92-1.39a2.23 2.23 0 0 0-2.06-1.36H3.5a.5.5 0 0 0-.5.5v6.5a.5.5 0 0 0 .5.5h10.76a2.24 2.24 0 0 0 2.24-2.24v-.26a1 1 0 0 0-1-1"/></svg>
              </div>
            </div>

            <h3 class="text-base sm:text-lg md:text-xl font-bold text-[#05103B] mb-1 sm:mb-2 group-hover:text-[#74E600] transition-all duration-300 group-hover:scale-105 group-hover:tracking-wide">{{ service.name }}</h3>
            <p class="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 flex-grow line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 group-hover:leading-relaxed">{{ service.description }}</p>
            
            <div class="mt-auto pt-3 sm:pt-4 border-t border-gray-100 w-full group-hover:border-[#74E600] transition-all duration-300 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-[#74E600]/10 via-transparent to-[#74E600]/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span class="text-sm sm:text-base md:text-lg font-bold text-[#74E600] group-hover:scale-110 inline-block transition-transform duration-300 relative z-10">Starts at ₱{{ service.price }}</span>
            </div>
            </div>
          </div>
          </div>

          <!-- Right Arrow Button -->
          <button 
            @click="nextSlide('services')"
            class="absolute right-0 sm:-right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white active:bg-[#74E600] transition-all duration-300 transform hover:scale-110 active:scale-95 carousel-btn touch-manipulation"
            :class="{ 'opacity-50 cursor-not-allowed': currentServiceIndex >= services.length - servicesPerView }"
            :disabled="currentServiceIndex >= services.length - servicesPerView"
          >
            <svg class="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Carousel Indicators -->
          <div class="flex justify-center gap-2 mt-6">
            <button
              v-for="(dot, index) in serviceDots"
              :key="index"
              @click="goToSlide('services', index)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentServiceDot ? 'bg-[#74E600] w-8' : 'bg-gray-300'"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <section id="about-section" class="py-10 sm:py-12 md:py-16 bg-white overflow-hidden relative z-10 scroll-animate">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center mb-8 sm:mb-10 md:mb-12">
          <div class="order-2 md:order-1 about-content">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#05103B] mb-3 sm:mb-4 animate-title-in">About BROOOM</h2>
            <div class="w-12 sm:w-16 h-0.5 sm:h-1 bg-[#74E600] mb-4 sm:mb-6 rounded-full animate-line-expand"></div>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 animate-fade-in-delay">Founded on <span class="font-semibold text-[#74E600] animate-highlight">Feb 7, 2020</span>, BROOOM SERVICES connects customers with providers in Calapan City.</p>
            <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
              <div v-for="(item, idx) in ['Quality', 'Trust', 'Innovation']" :key="item" class="relative p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl text-center border border-gray-100 hover:border-[#74E600] hover:scale-110 hover:shadow-lg transition-all duration-300 feature-box overflow-hidden feature-box-hover" :style="{ animationDelay: `${idx * 0.15}s` }">
                <div class="absolute inset-0 bg-gradient-to-br from-[#74E600]/20 to-transparent opacity-0 feature-overlay transition-opacity duration-300"></div>
                <span class="font-bold text-[#74E600] text-xs sm:text-sm md:text-base relative z-10 feature-text inline-block transition-transform duration-300">{{ item }}</span>
              </div>
            </div>
          </div>
          <div class="order-1 md:order-2 relative flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-4">
            <!-- Logo Image with Animation -->
            <div class="relative w-full md:w-auto flex justify-center md:justify-start flex-shrink-0">
              <div class="relative logo-animation-container">
                <!-- Subtle Glow Background -->
                <div class="absolute inset-0 bg-gradient-to-br from-[#74E600]/15 to-[#3ED400]/10 rounded-full blur-2xl animate-gentle-pulse -z-10"></div>
                
                <!-- Main Logo Image -->
                <div class="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center logo-image-wrapper">
                  <img 
                    src="/Broooom1.png" 
                    alt="BROOOM Logo"
                    class="w-full h-full object-contain animate-smooth-float"
                  />
                </div>
              </div>
            </div>

            <!-- Why Choose Us Box -->
            <div class="flex-1 bg-gradient-to-br from-[#74E600] to-[#3ED400] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] hover:rotate-1 transition-all duration-500 cta-box cta-glow">
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
              <h4 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 relative z-10 animate-title-in">Why Choose Us?</h4>
              <ul class="space-y-3 sm:space-y-4 relative z-10">
                <li v-for="(feat, idx) in ['Fast delivery', 'Real-time tracking', 'Affordable pricing', 'Community focused']" :key="feat" class="flex items-center animate-list-item text-sm sm:text-base" :style="{ animationDelay: `${idx * 0.1}s` }"><div class="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 shrink-0 hover:scale-125 hover:bg-white/30 transition-all duration-300 text-xs sm:text-sm">✓</div><span class="hover:translate-x-2 transition-transform duration-300">{{ feat }}</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Image Slide Carousel Section -->
        <div class="mt-8 sm:mt-10 md:mt-12 relative">
          <div class="max-w-5xl mx-auto">
            <!-- Left Arrow Button -->
            <button 
              v-if="aboutSlides.length > 1"
              @click="prevSlide('about')"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-6 z-20 bg-white rounded-full p-1.5 sm:p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white transition-all duration-300 transform hover:scale-110 carousel-btn"
              :class="{ 'opacity-50 cursor-not-allowed': currentAboutIndex === 0 }"
              :disabled="currentAboutIndex === 0"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <!-- Carousel Container -->
            <div class="overflow-hidden rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 lg:px-12">
              <div 
                class="flex transition-transform duration-500 ease-in-out"
                :style="{ transform: `translateX(-${currentAboutIndex * 100}%)` }"
              >
                <!-- Slide - Horizontal Layout with Plus Icons -->
                <div 
                  v-for="(slide, slideIndex) in aboutSlides" 
                  :key="slideIndex"
                  class="w-full flex-shrink-0"
                >
                  <div class="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-2 lg:gap-6">
                    <div 
                      v-for="(item, index) in slide.images" 
                      :key="item.id"
                      class="flex flex-col md:flex-row items-center w-full md:w-auto"
                    >
                      <!-- Image Card -->
                      <div class="flex flex-col items-center text-center group about-image-slide">
                        <div class="relative mb-3 sm:mb-4">
                          <div class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 border-[#74E600]/30 hover:border-[#74E600] transition-all duration-300 bg-white p-2 sm:p-3 md:p-4 flex items-center justify-center hover:scale-110 hover:shadow-xl">
                            <img 
                              :src="item.image" 
                              :alt="item.title"
                              class="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                        <p class="text-xs sm:text-sm md:text-base text-gray-700 font-medium max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] leading-tight px-2">
                          {{ item.description }}
                        </p>
                      </div>

                      <!-- Plus Icon (show between items, not after last) -->
                      <div 
                        v-if="index < slide.images.length - 1"
                        class="flex items-center justify-center my-2 md:my-0 md:mx-2 lg:mx-4 flex-shrink-0"
                      >
                        <div class="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#74E600] rounded-full flex items-center justify-center shadow-lg hover:scale-125 hover:rotate-90 transition-all duration-300 icon-plus">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7">
                            <path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Arrow Button -->
            <button 
              v-if="aboutSlides.length > 1"
              @click="nextSlide('about')"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-6 z-20 bg-white rounded-full p-1.5 sm:p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white transition-all duration-300 transform hover:scale-110 carousel-btn"
              :class="{ 'opacity-50 cursor-not-allowed': currentAboutIndex >= aboutSlides.length - 1 }"
              :disabled="currentAboutIndex >= aboutSlides.length - 1"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <!-- Carousel Indicators -->
            <div v-if="aboutSlides.length > 1" class="flex justify-center gap-2 mt-6">
              <button
                v-for="(slide, index) in aboutSlides"
                :key="index"
                @click="goToSlide('about', index)"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="index === currentAboutIndex ? 'bg-[#74E600] w-8' : 'bg-gray-300'"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision & Mission Section -->
    <section id="vision-mission-section" class="py-10 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white relative z-10 scroll-animate overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="text-center mb-8 sm:mb-10 md:mb-12 section-header">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#05103B] mb-2 animate-title-in">Vision & Mission</h2>
          <div class="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#74E600] mx-auto rounded-full animate-line-expand"></div>
        </div>

        <!-- Vision & Mission Carousel Container -->
        <div class="relative max-w-4xl mx-auto px-8 sm:px-0">
          <!-- Left Arrow Button -->
          <button 
            @click="prevSlide('visionMission')"
            class="absolute left-0 sm:-left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white active:bg-[#74E600] transition-all duration-300 transform hover:scale-110 active:scale-95 carousel-btn touch-manipulation"
            :class="{ 'opacity-50 cursor-not-allowed': currentVisionMissionIndex === 0 }"
            :disabled="currentVisionMissionIndex === 0"
          >
            <svg class="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Carousel Container -->
          <div class="overflow-hidden rounded-xl sm:rounded-2xl">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentVisionMissionIndex * 100}%)` }"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd('visionMission')"
            >
              <!-- Vision Slide -->
              <div class="w-full flex-shrink-0 px-2 sm:px-6 md:px-8">
                <div class="bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden vision-mission-card">
                  <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  <div class="relative z-10">
                    <div class="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                      <div class="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center sm:mr-3 sm:mr-4 shadow-lg">
                        <svg class="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </div>
                      <h3 class="text-xl sm:text-3xl md:text-4xl font-extrabold">VISION</h3>
                    </div>
                    <div class="w-12 sm:w-20 h-0.5 sm:h-1 bg-white/30 mx-auto mb-4 sm:mb-8 rounded-full"></div>
                    <p class="text-xs sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-relaxed text-center font-medium px-1 sm:px-0">
                      Our VISION is to ensuring superior customer satisfaction by providing extensive, reliable, fast, and secure delivery services, aiming to become a first Top choice courier, quick commerce platform, empowering local communities.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Mission Slide -->
              <div class="w-full flex-shrink-0 px-2 sm:px-6 md:px-8">
                <div class="bg-gradient-to-br from-[#3ED400] to-[#74E600] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden vision-mission-card">
                  <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  <div class="relative z-10">
                    <div class="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                      <div class="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center sm:mr-3 sm:mr-4 shadow-lg">
                        <svg class="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 class="text-xl sm:text-3xl md:text-4xl font-extrabold">MISSION</h3>
                    </div>
                    <div class="w-12 sm:w-20 h-0.5 sm:h-1 bg-white/30 mx-auto mb-4 sm:mb-8 rounded-full"></div>
                    <p class="text-xs sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-relaxed text-center font-medium px-1 sm:px-0">
                      Our mission is to provide fast, secure, and reliable delivery solutions, to support our local community by offering quick, and affordable courier services, helping small businesses thrive by connecting them with their customers. To make every delivery a positive experience by prioritizing customer needs, ensuring accuracy, and treating every product with the utmost care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Arrow Button -->
          <button 
            @click="nextSlide('visionMission')"
            class="absolute right-0 sm:-right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-2 sm:p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white active:bg-[#74E600] transition-all duration-300 transform hover:scale-110 active:scale-95 carousel-btn touch-manipulation"
            :class="{ 'opacity-50 cursor-not-allowed': currentVisionMissionIndex >= visionMissionSlides.length - 1 }"
            :disabled="currentVisionMissionIndex >= visionMissionSlides.length - 1"
          >
            <svg class="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Carousel Indicators -->
          <div class="flex justify-center gap-2 mt-6">
            <button
              v-for="(slide, index) in visionMissionSlides"
              :key="index"
              @click="goToSlide('visionMission', index)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentVisionMissionIndex ? 'bg-[#74E600] w-8' : 'bg-gray-300'"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-10 sm:py-12 md:py-16 bg-gray-50 relative z-10 scroll-animate">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="text-center mb-8 sm:mb-10 section-header"><h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-[#05103B] animate-title-in">Customer Reviews</h2></div>
        
        <!-- Reviews Carousel Container -->
        <div v-if="testimonials.length > 0" class="relative">
          <!-- Left Arrow Button -->
          <button 
            @click="prevSlide('reviews')"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-6 z-20 bg-white rounded-full p-1.5 sm:p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white transition-all duration-300 transform hover:scale-110 carousel-btn"
            :class="{ 'opacity-50 cursor-not-allowed': currentReviewIndex === 0 }"
            :disabled="currentReviewIndex === 0"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Reviews Carousel -->
          <div class="overflow-hidden">
            <div 
              class="flex transition-transform duration-500 ease-in-out gap-6"
              :style="{ transform: `translateX(-${currentReviewIndex * (100 / reviewsPerView)}%)` }"
            >
          <div v-for="(t, idx) in testimonials" :key="t.id" class="relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border-l-4 border-[#74E600] hover:-translate-y-2 hover:scale-105 review-card overflow-hidden review-card-hover flex-shrink-0" :style="{ width: `calc(${100 / reviewsPerView}% - ${(reviewsPerView - 1) * 24 / reviewsPerView}px)`, animationDelay: `${idx * 0.1}s` }">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#74E600] via-[#A8EB12] to-[#74E600] transform scale-x-0 review-top-line transition-transform duration-500 origin-left"></div>
            <div class="flex items-center mb-4">
              <div class="relative w-10 h-10 bg-[#74E600] rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md hover:scale-125 hover:rotate-12 transition-all duration-300 avatar-glow">
                <div class="absolute inset-0 rounded-full bg-[#A8EB12] opacity-0 hover:opacity-50 blur-md transition-opacity duration-300"></div>
                <span class="relative z-10">{{ t.initials }}</span>
              </div>
              <div>
                <h4 class="font-bold text-[#05103B] hover:text-[#74E600] transition-colors duration-300">{{ t.name }}</h4>
                <div class="flex text-yellow-400 text-xs">
                  <svg v-for="i in 5" :key="i" 
                       :class="i <= (t.rating || 5) ? 'text-yellow-400 hover:scale-125' : 'text-gray-300'" 
                       class="w-4 h-4 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic text-sm hover:text-gray-800 transition-colors duration-300">"{{ t.comment }}"</p>
          </div>
            </div>
          </div>

          <!-- Right Arrow Button -->
          <button 
            @click="nextSlide('reviews')"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-[#74E600] hover:text-white transition-all duration-300 transform hover:scale-110 carousel-btn"
            :class="{ 'opacity-50 cursor-not-allowed': currentReviewIndex >= testimonials.length - reviewsPerView }"
            :disabled="currentReviewIndex >= testimonials.length - reviewsPerView"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Carousel Indicators -->
          <div class="flex justify-center gap-2 mt-6">
            <button
              v-for="(dot, index) in reviewDots"
              :key="index"
              @click="goToSlide('reviews', index)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentReviewDot ? 'bg-[#74E600] w-8' : 'bg-gray-300'"
            ></button>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <div class="inline-block p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <p class="text-gray-500 font-medium mb-4">No reviews yet. Be the first to share your experience!</p>
            <button 
              @click="loadReviews()" 
              class="px-4 py-2 bg-[#74E600] text-white rounded-lg hover:bg-[#63c400] transition-colors text-sm font-medium"
            >
              Refresh Reviews
            </button>
            <p class="text-xs text-gray-400 mt-2">Check browser console (F12) for details</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-[#05103B] text-white relative overflow-hidden z-10 scroll-animate">
      <div class="absolute inset-0 bg-[#74E600] opacity-5 mix-blend-overlay animate-pulse-slow"></div>
      <div class="container mx-auto px-4 text-center relative z-10 cta-section">
        <h2 class="text-2xl md:text-3xl font-bold mb-4 animate-title-in">Ready to Get Started?</h2>
        <div class="flex flex-wrap justify-center gap-4 animate-buttons-in">
          <router-link 
            to="/login" 
            @click="handleNavigation('/login')"
            class="relative px-8 py-3 rounded-full border border-white hover:bg-white hover:text-[#05103B] transition-all duration-300 font-semibold hover:scale-110 hover:rotate-1 button-pulse overflow-hidden cta-button"
          >
            <span class="relative z-10">Login</span>
            <span class="absolute inset-0 bg-white/20 rounded-full scale-0 cta-ripple transition-transform duration-500 origin-center"></span>
          </router-link>
          <router-link 
            to="/register" 
            @click="handleNavigation('/register')"
            class="relative bg-[#74E600] text-white px-8 py-3 rounded-full font-bold hover:bg-[#63c400] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:-rotate-1 button-pulse overflow-hidden cta-button"
          >
            <span class="relative z-10">Create Account</span>
            <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full cta-shimmer transition-transform duration-1000"></span>
          </router-link>
        </div>
      </div>
    </section>

    <transition name="fade">
      <button 
        v-show="showScrollTop" 
        @click="scrollToTop" 
        class="fixed bottom-8 right-6 z-50 bg-[#74E600] text-white p-3 rounded-full shadow-lg hover:bg-[#63c400] transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 scroll-button floating-button"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
        </svg>
      </button>
    </transition>

    <button
      v-show="showScrollBottom"
      @click="scrollToBottom"
      class="fixed bottom-20 right-6 z-40 bg-[#3ED400] text-white p-3 rounded-full shadow-lg hover:bg-[#2eb300] transition-all duration-300 hover:scale-110 hover:-translate-y-1 scroll-button floating-button-delay"
      aria-label="Scroll to bottom"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <FloatingChatbot />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import FloatingChatbot from '@/components/FloatingChatbot.vue'
import { db } from '@/firebase/config'
import { collection, query, getDocs, orderBy, limit, where, onSnapshot } from 'firebase/firestore'

export default {
  name: 'HomePage',
  components: {
    FloatingChatbot
  },
  setup() {
    const router = useRouter()
    const videoRef = ref(null)
    
    const showScrollTop = ref(false)
    const showScrollBottom = ref(true)

    // Carousel states
    const currentServiceIndex = ref(0)
    const currentReviewIndex = ref(0)
    const currentAboutIndex = ref(0)
    const currentVisionMissionIndex = ref(0)
    const servicesPerView = ref(3)
    const reviewsPerView = ref(3)

    // Touch/swipe support for mobile
    const touchStartX = ref(0)
    const touchEndX = ref(0)
    
    const handleTouchStart = (e) => {
      touchStartX.value = e.touches[0].clientX
    }
    
    const handleTouchMove = (e) => {
      touchEndX.value = e.touches[0].clientX
    }
    
    const handleTouchEnd = (type) => {
      const swipeDistance = touchStartX.value - touchEndX.value
      const minSwipeDistance = 50 // Minimum distance for a swipe
      
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swipe left - next slide
          nextSlide(type)
        } else {
          // Swipe right - previous slide
          prevSlide(type)
        }
      }
    }

    // Calculate dots for carousel indicators
    const serviceDots = computed(() => {
      return Math.ceil(services.value.length / servicesPerView.value)
    })

    const reviewDots = computed(() => {
      return Math.ceil(testimonials.value.length / reviewsPerView.value)
    })

    const currentServiceDot = computed(() => {
      return Math.floor(currentServiceIndex.value / servicesPerView.value)
    })

    const currentReviewDot = computed(() => {
      return Math.floor(currentReviewIndex.value / reviewsPerView.value)
    })

    // Carousel functions
    const nextSlide = (type) => {
      if (type === 'services') {
        const maxIndex = services.value.length - servicesPerView.value
        if (currentServiceIndex.value < maxIndex) {
          currentServiceIndex.value = Math.min(currentServiceIndex.value + servicesPerView.value, maxIndex)
        }
      } else if (type === 'reviews') {
        const maxIndex = testimonials.value.length - reviewsPerView.value
        if (currentReviewIndex.value < maxIndex) {
          currentReviewIndex.value = Math.min(currentReviewIndex.value + reviewsPerView.value, maxIndex)
        }
      } else if (type === 'about') {
        if (currentAboutIndex.value < aboutSlides.value.length - 1) {
          currentAboutIndex.value = currentAboutIndex.value + 1
        }
      } else if (type === 'visionMission') {
        if (currentVisionMissionIndex.value < visionMissionSlides.value.length - 1) {
          currentVisionMissionIndex.value = currentVisionMissionIndex.value + 1
        }
      }
    }

    const prevSlide = (type) => {
      if (type === 'services') {
        if (currentServiceIndex.value > 0) {
          currentServiceIndex.value = Math.max(currentServiceIndex.value - servicesPerView.value, 0)
        }
      } else if (type === 'reviews') {
        if (currentReviewIndex.value > 0) {
          currentReviewIndex.value = Math.max(currentReviewIndex.value - reviewsPerView.value, 0)
        }
      } else if (type === 'about') {
        if (currentAboutIndex.value > 0) {
          currentAboutIndex.value = currentAboutIndex.value - 1
        }
      } else if (type === 'visionMission') {
        if (currentVisionMissionIndex.value > 0) {
          currentVisionMissionIndex.value = currentVisionMissionIndex.value - 1
        }
      }
    }

    const goToSlide = (type, dotIndex) => {
      if (type === 'services') {
        currentServiceIndex.value = dotIndex * servicesPerView.value
      } else if (type === 'reviews') {
        currentReviewIndex.value = dotIndex * reviewsPerView.value
      } else if (type === 'about') {
        currentAboutIndex.value = dotIndex
      } else if (type === 'visionMission') {
        currentVisionMissionIndex.value = dotIndex
      }
    }

    // Auto-play carousel
    let servicesAutoPlay = null
    let reviewsAutoPlay = null
    let aboutAutoPlay = null
    let visionMissionAutoPlay = null

    const startAutoPlay = () => {
      // Auto-play services carousel
      servicesAutoPlay = setInterval(() => {
        const maxIndex = services.value.length - servicesPerView.value
        if (currentServiceIndex.value >= maxIndex) {
          currentServiceIndex.value = 0
        } else {
          nextSlide('services')
        }
      }, 4000)

      // Auto-play reviews carousel
      if (testimonials.value.length > reviewsPerView.value) {
        reviewsAutoPlay = setInterval(() => {
          const maxIndex = testimonials.value.length - reviewsPerView.value
          if (currentReviewIndex.value >= maxIndex) {
            currentReviewIndex.value = 0
          } else {
            nextSlide('reviews')
          }
        }, 5000)
      }

      // Auto-play about carousel (only if more than 1 slide)
      if (aboutSlides.value.length > 1) {
        aboutAutoPlay = setInterval(() => {
          if (currentAboutIndex.value >= aboutSlides.value.length - 1) {
            currentAboutIndex.value = 0
          } else {
            nextSlide('about')
          }
        }, 4500)
      }

      // Auto-play vision/mission carousel
      if (visionMissionSlides.value.length > 1) {
        visionMissionAutoPlay = setInterval(() => {
          if (currentVisionMissionIndex.value >= visionMissionSlides.value.length - 1) {
            currentVisionMissionIndex.value = 0
          } else {
            nextSlide('visionMission')
          }
        }, 5000)
      }
    }

    const stopAutoPlay = () => {
      if (servicesAutoPlay) clearInterval(servicesAutoPlay)
      if (reviewsAutoPlay) clearInterval(reviewsAutoPlay)
      if (aboutAutoPlay) clearInterval(aboutAutoPlay)
      if (visionMissionAutoPlay) clearInterval(visionMissionAutoPlay)
    }

    // Update items per view based on screen size
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        servicesPerView.value = 1
        reviewsPerView.value = 1
      } else if (window.innerWidth < 1024) {
        servicesPerView.value = 2
        reviewsPerView.value = 2
      } else {
        servicesPerView.value = 3
        reviewsPerView.value = 3
      }
      // Reset indices when view changes
      currentServiceIndex.value = 0
      currentReviewIndex.value = 0
    }

    // Generate random particle styles
    const getParticleStyle = (index) => {
      const size = Math.random() * 4 + 2
      const left = Math.random() * 100
      const top = Math.random() * 100
      const delay = Math.random() * 5
      const duration = Math.random() * 3 + 2
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    }

    const handleNavigation = (path) => {
      router.push(path).catch(err => {
        console.error('[v0] HomePage navigation error:', err)
      })
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const scrollToBottom = () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      })
    }

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      showScrollTop.value = scrollTop > 300
      showScrollBottom.value = scrollTop < documentHeight - windowHeight - 100
      
      // Parallax effect for hero content and video
      const heroSection = document.querySelector('.hero-content')
      const heroVideo = document.querySelector('.hero-video')
      
      if (scrollTop < windowHeight) {
        const parallaxValue = scrollTop * 0.3
        const videoParallax = scrollTop * 0.2
        
        if (heroSection) {
          heroSection.style.transform = `translateY(${parallaxValue}px)`
          heroSection.style.opacity = `${1 - scrollTop / windowHeight}`
        }
        
        if (heroVideo) {
          heroVideo.style.transform = `translateY(${videoParallax}px) scale(${1.05 + scrollTop * 0.0001})`
        }
      }
    }

    let reviewsUnsubscribe = null
    
    // Intersection Observer for scroll animations
    const setupScrollAnimations = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view')
          }
        })
      }, observerOptions)
      
      // Observe all sections
      const sections = document.querySelectorAll('.scroll-animate')
      sections.forEach(section => {
        observer.observe(section)
      })
      
      return observer
    }
    
    let scrollObserver = null
    
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      handleScroll()
      
      // Update items per view on mount and resize
      updateItemsPerView()
      window.addEventListener('resize', updateItemsPerView)
      
      // Setup scroll animations
      scrollObserver = setupScrollAnimations()
      
      // Start auto-play carousel
      startAutoPlay()
      
      // Load reviews from Firestore with real-time listener
      loadReviews().then((unsubscribe) => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          reviewsUnsubscribe = unsubscribe
        }
      }).catch((error) => {
        console.error('Error loading reviews:', error)
      })
      
      const video = videoRef.value;
      if (video) {
        // Ensure muted is true via JS as well for autoplay policies
        video.muted = true;
        // Try to play immediately
        video.play().catch(e => {
            console.log("Autoplay prevented by browser:", e);
            // This is why the solid background color is important!
        });
      }
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateItemsPerView)
      stopAutoPlay()
      if (scrollObserver) {
        scrollObserver.disconnect()
      }
      if (reviewsUnsubscribe && typeof reviewsUnsubscribe === 'function') {
        reviewsUnsubscribe()
        console.log('🛑 Unsubscribed from reviews listener')
      }
    })

    const services = ref([
      { id: 1, name: 'Food Delivery', description: 'Hot & fresh from local favorites', price: '55' },
      { id: 2, name: 'Bill Payments', description: 'Secure hassle-free payments', price: '55' },
      { id: 3, name: 'Pick-up & Drop', description: 'Fast local courier service', price: '55' },
      { id: 4, name: 'Grocery', description: 'We shop and deliver to you', price: '55' },
      { id: 5, name: 'Medicine', description: 'Safe pharmacy delivery', price: '55' },
      { id: 6, name: 'Surprise Gifts', description: 'Send gifts to loved ones', price: '55' }
    ])

    const aboutImages = ref([
      { 
        id: 1, 
        image: '/BROOOOM2.png', 
        title: 'Speed', 
        description: 'Symbolizes speed (Express or Quick Service)' 
      },
      { 
        id: 2, 
        image: '/BROOOOM.png', 
        title: 'Care', 
        description: 'Handle with Care (Caring for customers)' 
      },
      { 
        id: 3, 
        image: '/BROOOOM4.png', 
        title: 'Location', 
        description: 'GPS/Location (Locating customers accurately)' 
      }
    ])

    // About slides - each slide contains the horizontal layout
    const aboutSlides = computed(() => {
      // For now, we have one slide with all images
      // Can be extended to have multiple slides if needed
      return [{ images: aboutImages.value }]
    })

    // Vision & Mission slides
    const visionMissionSlides = computed(() => {
      return [
        { id: 1, type: 'vision' },
        { id: 2, type: 'mission' }
      ]
    })

    // Initialize with empty array - will be populated from Firestore
    const testimonials = ref([])

    // Process reviews from snapshot
    const processReviews = (snapshot) => {
      console.log(`📊 Processing ${snapshot.size} documents from reviews collection`)
      
      if (!snapshot || snapshot.empty) {
        console.log('⚠️ No documents found in reviews collection')
        testimonials.value = []
        return
      }
      
      const fetchedReviews = []
      
      snapshot.forEach((doc) => {
        try {
          const reviewData = doc.data()
          
          // Log each review for debugging
          console.log('📝 Review document:', {
            id: doc.id,
            approved: reviewData.approved,
            hasComment: !!reviewData.comment,
            commentLength: reviewData.comment?.length || 0,
            rating: reviewData.rating,
            ratingType: typeof reviewData.rating,
            userName: reviewData.userName,
            userInitials: reviewData.userInitials,
            createdAt: reviewData.createdAt,
            allKeys: Object.keys(reviewData)
          })
          
          // Very lenient filtering - just need comment and rating
          const hasComment = reviewData.comment && 
                            typeof reviewData.comment === 'string' && 
                            reviewData.comment.trim().length > 0
          
          const ratingValue = reviewData.rating
          const hasRating = ratingValue !== undefined && 
                           ratingValue !== null && 
                           !isNaN(Number(ratingValue)) && 
                           Number(ratingValue) > 0
          
          console.log(`🔍 Review ${doc.id} check: hasComment=${hasComment}, hasRating=${hasRating}, rating=${ratingValue}`)
          
          // Include if it has comment and rating
          if (hasComment && hasRating) {
            const rating = Number(ratingValue)
            const comment = String(reviewData.comment).trim()
            const userName = reviewData.userName || 'Anonymous'
            
            // Generate initials if not provided
            let userInitials = reviewData.userInitials
            if (!userInitials || userInitials.trim() === '') {
              if (userName && userName !== 'Anonymous') {
                const nameParts = userName.trim().split(/\s+/)
                if (nameParts.length >= 2) {
                  userInitials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                } else if (nameParts.length === 1) {
                  userInitials = nameParts[0].substring(0, 2).toUpperCase()
                } else {
                  userInitials = 'A'
                }
              } else {
                userInitials = 'A'
              }
            }
            
            fetchedReviews.push({
              id: doc.id,
              name: userName,
              initials: userInitials,
              comment: comment,
              rating: rating,
              createdAt: reviewData.createdAt
            })
            
            console.log(`✅ Added review: ${userName} (${userInitials}) - ${rating} stars - "${comment.substring(0, 50)}..."`)
          } else {
            console.log(`⏭️ Skipped review ${doc.id}: hasComment=${hasComment}, hasRating=${hasRating}`)
          }
        } catch (docError) {
          console.error(`❌ Error processing review document ${doc.id}:`, docError)
        }
      })
      
      console.log(`📈 Total valid reviews found: ${fetchedReviews.length}`)
      
      // Sort by createdAt (most recent first)
      if (fetchedReviews.length > 0) {
        fetchedReviews.sort((a, b) => {
          let aTime = 0
          let bTime = 0
          
          if (a.createdAt) {
            if (a.createdAt.toDate && typeof a.createdAt.toDate === 'function') {
              aTime = a.createdAt.toDate().getTime()
            } else if (a.createdAt.seconds) {
              aTime = a.createdAt.seconds * 1000
            } else if (a.createdAt instanceof Date) {
              aTime = a.createdAt.getTime()
            }
          }
          
          if (b.createdAt) {
            if (b.createdAt.toDate && typeof b.createdAt.toDate === 'function') {
              bTime = b.createdAt.toDate().getTime()
            } else if (b.createdAt.seconds) {
              bTime = b.createdAt.seconds * 1000
            } else if (b.createdAt instanceof Date) {
              bTime = b.createdAt.getTime()
            }
          }
          
          return bTime - aTime // Most recent first
        })
        
        testimonials.value = fetchedReviews.slice(0, 6) // Show up to 6 reviews
        console.log(`✅ Successfully loaded ${testimonials.value.length} reviews:`, testimonials.value.map(r => `${r.name} (${r.rating}⭐)`))
      } else {
        testimonials.value = []
        console.log('⚠️ No valid reviews found after filtering (checked', snapshot.size, 'documents)')
      }
    }

    // Fetch reviews from Firestore - try multiple methods
    const loadReviews = async () => {
      console.log('🔄 Loading reviews from Firestore...')
      
      // Method 1: Try onSnapshot first (real-time)
      try {
        const reviewsRef = collection(db, 'reviews')
        const reviewsQuery = query(reviewsRef, limit(50))
        
        console.log('📡 Attempting onSnapshot...')
        const unsubscribe = onSnapshot(
          reviewsQuery,
          (snapshot) => {
            console.log(`📊 onSnapshot received: ${snapshot.size} documents`)
            processReviews(snapshot)
          },
          (error) => {
            console.error('❌ onSnapshot error:', error)
            console.error('Error details:', {
              message: error.message,
              code: error.code
            })
            // Fallback to getDocs
            console.log('🔄 Falling back to getDocs...')
            loadReviewsWithGetDocs()
          }
        )
        
        // Store unsubscribe for cleanup
        return unsubscribe
      } catch (error) {
        console.error('❌ Error setting up onSnapshot:', error)
        // Fallback to getDocs
        console.log('🔄 Falling back to getDocs...')
        loadReviewsWithGetDocs()
        return null
      }
    }

    // Fallback method using getDocs
    const loadReviewsWithGetDocs = async () => {
      try {
        console.log('📡 Attempting getDocs...')
        const reviewsRef = collection(db, 'reviews')
        const reviewsQuery = query(reviewsRef, limit(50))
        
        const snapshot = await getDocs(reviewsQuery)
        console.log(`📊 getDocs received: ${snapshot.size} documents`)
        processReviews(snapshot)
      } catch (error) {
        console.error('❌ Error with getDocs:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        })
        testimonials.value = []
      }
    }

    return {
      handleNavigation,
      services,
      testimonials,
      aboutImages,
      showScrollTop,
      showScrollBottom,
      scrollToTop,
      scrollToBottom,
      videoRef,
      loadReviews,
      getParticleStyle,
      currentServiceIndex,
      currentReviewIndex,
      currentAboutIndex,
      currentVisionMissionIndex,
      aboutSlides,
      visionMissionSlides,
      servicesPerView,
      reviewsPerView,
      serviceDots,
      reviewDots,
      currentServiceDot,
      currentReviewDot,
      nextSlide,
      prevSlide,
      goToSlide,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    }
  }
}
</script>

<style scoped>
/* Smooth scrolling for the entire page */
:deep(html) {
  scroll-behavior: smooth;
}

.smooth-scroll {
  scroll-behavior: smooth;
}

/* Hero Section Animations */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-delay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes buttons-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.1;
  }
}

@keyframes button-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-20px) translateX(10px);
  }
  66% {
    transform: translateY(10px) translateX(-10px);
  }
}

@keyframes float-delay {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-30px) translateX(15px);
  }
}

@keyframes char-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px) rotateX(90deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(116, 230, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(116, 230, 0, 0.8), 0 0 30px rgba(168, 235, 18, 0.5);
  }
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px) rotate(90deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-40px) translateX(-10px) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-20px) translateX(5px) rotate(270deg);
    opacity: 0.6;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes border-glow {
  0%, 100% {
    border-color: rgba(116, 230, 0, 0.5);
    box-shadow: 0 0 5px rgba(116, 230, 0, 0.3);
  }
  50% {
    border-color: rgba(116, 230, 0, 1);
    box-shadow: 0 0 20px rgba(116, 230, 0, 0.6), 0 0 30px rgba(168, 235, 18, 0.4);
  }
}

/* Scroll animations */
@keyframes slide-up-fade {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes title-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes line-expand {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 80px;
    opacity: 1;
  }
}

@keyframes highlight {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes list-item {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Hero Content Animations */
.hero-content .animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out forwards;
}

.hero-content .animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.hero-content .animate-fade-in-delay {
  animation: fade-in-delay 1s ease-out 0.6s forwards;
  opacity: 0;
}

.hero-content .animate-buttons-in {
  animation: buttons-in 0.8s ease-out 0.9s forwards;
  opacity: 0;
}

.floating-animation {
  animation: floating 3s ease-in-out infinite;
}

.button-pulse {
  animation: button-pulse 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-fade-in-up { 
  animation: fade-in-up 0.8s ease-out forwards; 
}

/* Section Header Animations */
.section-header .animate-title-in {
  animation: title-in 0.6s ease-out forwards;
}

.section-header .animate-line-expand {
  animation: line-expand 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

/* Scroll animation classes */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-animate.animate-in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Service Cards Animations */
.service-card {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-animate.animate-in-view .service-card {
  animation: slide-up-fade 0.6s ease-out forwards;
}

.scroll-animate.animate-in-view .service-card:nth-child(1) { animation-delay: 0.1s; }
.scroll-animate.animate-in-view .service-card:nth-child(2) { animation-delay: 0.2s; }
.scroll-animate.animate-in-view .service-card:nth-child(3) { animation-delay: 0.3s; }
.scroll-animate.animate-in-view .service-card:nth-child(4) { animation-delay: 0.4s; }
.scroll-animate.animate-in-view .service-card:nth-child(5) { animation-delay: 0.5s; }
.scroll-animate.animate-in-view .service-card:nth-child(6) { animation-delay: 0.6s; }

.icon-container {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* About Section Animations */
.about-content .animate-title-in {
  animation: title-in 0.6s ease-out forwards;
}

.about-content .animate-line-expand {
  animation: line-expand 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.about-content .animate-fade-in-delay {
  animation: fade-in-delay 0.8s ease-out 0.5s forwards;
  opacity: 0;
}

.animate-highlight {
  animation: highlight 2s ease-in-out infinite;
  display: inline-block;
}

.feature-box {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease-out;
}

.scroll-animate.animate-in-view .feature-box {
  animation: slide-up-fade 0.5s ease-out forwards;
}

.cta-box .animate-title-in {
  animation: title-in 0.6s ease-out forwards;
}

.cta-box .animate-list-item {
  animation: list-item 0.5s ease-out forwards;
  opacity: 0;
}

/* Review Cards */
.review-card {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-animate.animate-in-view .review-card {
  animation: slide-up-fade 0.6s ease-out forwards;
}

/* CTA Section */
.cta-section .animate-title-in {
  animation: title-in 0.6s ease-out forwards;
}

.cta-section .animate-buttons-in {
  animation: buttons-in 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

/* Scroll Buttons */
.scroll-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-button {
  animation: floating 2s ease-in-out infinite;
}

.floating-button-delay {
  animation: floating 2s ease-in-out infinite 0.5s;
}

/* Smooth transitions */
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; 
}

.fade-enter-from { 
  opacity: 0; 
  transform: translateY(10px);
}

.fade-leave-to { 
  opacity: 0; 
  transform: translateY(-10px);
}

/* Parallax effect for hero video */
.hero-content {
  will-change: transform, opacity;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
}

.hero-video {
  will-change: transform;
  transition: transform 0.1s ease-out;
}

/* Particles Animation */
.particles-container {
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float infinite ease-in-out;
  pointer-events: none;
}

/* Gradient Shift Animation */
.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

/* Floating Shapes */
.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-float-delay {
  animation: float-delay 8s ease-in-out infinite;
}

/* Text Reveal Animation */
.text-reveal {
  display: inline-block;
}

.char-animate {
  display: inline-block;
  animation: char-reveal 0.5s ease-out forwards;
  opacity: 0;
  transform-style: preserve-3d;
}

/* Button Effects */
.button-ripple {
  position: relative;
  overflow: hidden;
}

.button-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

/* Icon Glow Effect */
.icon-glow {
  position: relative;
}

.icon-glow::before {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: inherit;
  background: linear-gradient(45deg, #74E600, #A8EB12, #3ED400);
  opacity: 0;
  filter: blur(10px);
  transition: opacity 0.5s;
  z-index: -1;
}

.icon-glow:hover::before {
  opacity: 0.7;
  animation: glow-pulse 2s ease-in-out infinite;
}

/* Avatar Glow */
.avatar-glow {
  position: relative;
}

.avatar-glow:hover {
  animation: glow-pulse 1.5s ease-in-out infinite;
}

/* CTA Box Glow */
.cta-glow {
  position: relative;
}

.cta-glow::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  background: linear-gradient(45deg, #74E600, #A8EB12, #3ED400, #74E600);
  background-size: 200% 200%;
  opacity: 0;
  filter: blur(15px);
  transition: opacity 0.5s;
  z-index: -1;
  animation: gradient-shift 3s ease infinite;
}

.cta-glow:hover::after {
  opacity: 0.6;
}

/* Feature Box Hover */
.feature-box-hover {
  position: relative;
}

.feature-box-hover:hover {
  transform: scale(1.1) translateY(-5px);
  border-color: #74E600;
}

.feature-box-hover:hover .feature-overlay {
  opacity: 1;
}

.feature-box-hover:hover .feature-text {
  transform: scale(1.1);
}

/* Review Card Effects */
.review-card-hover {
  position: relative;
}

.review-card-hover:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 20px 40px rgba(116, 230, 0, 0.2);
}

.review-card-hover:hover .review-top-line {
  transform: scaleX(1);
}

/* CTA Button Effects */
.cta-button {
  position: relative;
}

.cta-button:hover .cta-ripple {
  transform: scale(1);
}

.cta-button:hover .cta-shimmer {
  transform: translateX(100%);
}

/* Service Card Enhanced Hover */
.service-card:hover {
  border-color: #74E600;
  box-shadow: 0 20px 40px rgba(116, 230, 0, 0.15);
}

.service-card:hover .icon-container {
  animation: glow-pulse 2s ease-in-out infinite;
}

/* Price Shimmer Effect */
.service-card:hover .mt-auto::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(116, 230, 0, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

/* Enhanced Scroll Animations */
.scroll-animate.animate-in-view .service-card {
  animation: slide-up-fade 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.scroll-animate.animate-in-view .review-card {
  animation: slide-up-fade 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.scroll-animate.animate-in-view .feature-box {
  animation: slide-up-fade 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Performance optimizations */
.scroll-animate,
.service-card,
.review-card,
.feature-box,
.particle,
.icon-glow,
.cta-glow {
  will-change: transform, opacity;
}

/* Smooth hover effects */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Additional micro-interactions */
.service-card:hover h3 {
  letter-spacing: 0.05em;
}

.service-card:hover p {
  line-height: 1.6;
}

/* Loading shimmer for cards */
@keyframes loading-shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.service-card,
.review-card {
  background: linear-gradient(90deg, #fff 0%, #f9fafb 50%, #fff 100%);
  background-size: 2000px 100%;
}

.service-card:hover,
.review-card:hover {
  background-position: 0 0;
  transition: background-position 0.5s;
}

/* Carousel Styles */
.carousel-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.carousel-btn:hover:not(:disabled) {
  transform: scale(1.15) translateY(-50%);
  box-shadow: 0 10px 25px rgba(116, 230, 0, 0.3);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-btn:active:not(:disabled) {
  transform: scale(0.95) translateY(-50%);
}

/* Smooth carousel transitions */
.flex.transition-transform {
  will-change: transform;
}

/* Carousel indicators */
button[class*="w-2 h-2 rounded-full"] {
  transition: all 0.3s ease;
  cursor: pointer;
}

button[class*="w-2 h-2 rounded-full"]:hover {
  transform: scale(1.2);
}

/* Touch manipulation for better mobile interaction */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Responsive carousel adjustments */
@media (max-width: 640px) {
  .carousel-btn {
    padding: 0.5rem;
    min-width: 40px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .carousel-btn:hover:not(:disabled),
  .carousel-btn:active:not(:disabled) {
    transform: scale(0.95) translateY(-50%);
  }
  
  /* Ensure carousel buttons are accessible on mobile */
  .carousel-btn svg {
    width: 20px;
    height: 20px;
  }
}

/* Touch/swipe support */
.flex.transition-transform {
  touch-action: pan-y;
}

/* Carousel item spacing */
.flex-shrink-0 {
  flex-shrink: 0;
}

/* About Image Slide Styles */
.about-image-slide {
  transition: all 0.3s ease;
}

.about-image-slide:hover {
  transform: translateY(-5px);
}

.icon-plus {
  animation: pulse-glow 2s ease-in-out infinite;
  z-index: 10;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(116, 230, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(116, 230, 0, 0.8), 0 0 30px rgba(168, 235, 18, 0.5);
  }
}

.about-image-slide img {
  transition: transform 0.3s ease;
}

.about-image-slide:hover img {
  transform: scale(1.05);
}

/* Logo Animation Styles - Clean & Elegant */
.logo-animation-container {
  position: relative;
  z-index: 10;
}

.logo-image-wrapper {
  animation: logo-fade-in 1s ease-out forwards;
  transform-origin: center;
  position: relative;
  filter: drop-shadow(0 10px 30px rgba(116, 230, 0, 0.2));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-image-wrapper:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 15px 40px rgba(116, 230, 0, 0.3));
}

@keyframes logo-fade-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-smooth-float {
  animation: smooth-float 6s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.logo-image-wrapper:hover .animate-smooth-float {
  animation-play-state: paused;
  transform: translateY(-8px) scale(1.05);
}

@keyframes smooth-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

.animate-gentle-pulse {
  animation: gentle-pulse 4s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.05);
  }
}

/* Vision & Mission Card Styles */
.vision-mission-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vision-mission-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.vision-mission-card h3 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  word-break: break-word;
}

.vision-mission-card p {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  hyphens: auto;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .about-image-slide {
    margin-bottom: 1rem;
  }
  
  .logo-animation-container {
    margin-bottom: 2rem;
  }

  .vision-mission-card {
    padding: 1.25rem !important;
    min-height: auto;
  }

  .vision-mission-card h3 {
    font-size: 1.25rem;
    line-height: 1.3;
  }

  .vision-mission-card p {
    font-size: 0.75rem;
    line-height: 1.5;
  }
}

/* Mobile-specific improvements */
@media (max-width: 640px) {
  /* Services section mobile improvements */
  #services-section .service-card {
    min-width: calc(100% - 0.5rem);
    padding: 1rem;
  }

  #services-section .service-card h3 {
    font-size: 0.875rem;
  }

  #services-section .service-card p {
    font-size: 0.75rem;
  }

  /* Vision & Mission section mobile improvements */
  #vision-mission-section {
    padding: 2rem 0;
  }

  #vision-mission-section .carousel-btn {
    position: absolute;
    z-index: 30;
  }

  /* Ensure text is readable on small screens */
  #vision-mission-section .vision-mission-card p {
    font-size: 0.7rem;
    line-height: 1.6;
  }
}
</style>