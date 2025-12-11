<template>
  <div class="min-h-screen flex flex-col font-sans">
    
    <section class="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#74E600]">
      <div class="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref="videoRef"
          class="absolute inset-0 w-full h-full object-cover scale-105"
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
        </video>
        <div class="absolute inset-0 bg-black/40 z-10"></div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-br from-[#A8EB12]/20 via-[#74E600]/25 to-[#3ED400]/20 z-10 animate-pulse"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 z-15"></div>

      <div class="relative z-30 container mx-auto px-4 sm:px-6 text-center mt-10">
        <div class="inline-block p-6 sm:p-10 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl animate-fade-in-up">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl">
            Fast & Reliable 
            <span class="block mt-2 bg-gradient-to-r from-[#A8EB12] via-[#74E600] to-white bg-clip-text text-transparent">
              Delivery Service
            </span>
          </h1>
          <p class="text-base sm:text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            From food delivery to bill payments, we've got you covered in Calapan City. Experience seamless service today.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link 
              to="/login" 
              @click="handleNavigation('/login')"
              class="w-full sm:w-auto px-8 py-3 rounded-full border-2 border-white/80 text-white font-bold hover:bg-white hover:text-[#74E600] transition-all duration-300 transform hover:scale-105 backdrop-blur-sm shadow-lg"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              @click="handleNavigation('/register')"
              class="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-[#74E600] font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-50"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section id="services-section" class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-[#05103B] mb-2">Our Services</h2>
          <div class="w-20 h-1.5 bg-[#74E600] mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(service, index) in services" 
            :key="service.id" 
            class="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#74E600] to-[#5CBC00] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md text-white">
               
               <svg v-if="service.id === 1" class="w-8 h-8 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                 <path d="M20.193 18.092v8.198c0 .389-.383.702-.859.702s-.859-.313-.859-.702v-8.198m-2.017 0v8.198c0 .389-.383.702-.859.702s-.859-.313-.859-.702v-8.198m5.226 24.407v-9.15c0-.963.006-1.397 1.223-2.616c1.218-1.218 1.223-1.694 1.223-2.615v-8.704c0-.732-.589-1.32-1.32-1.32h-.898m-5.452 0h-.9c-.732 0-1.32.588-1.32 1.32l.003 8.704c.004.921.01 1.397 1.227 2.615s1.224 1.653 1.22 2.615l-.005 9.151m3.51-24.405H16.46m17.025 24.405V30.577c1.667-1.185 2.705-3.456 2.708-5.925c0-3.736-2.33-6.765-5.205-6.766h-.003c-2.875 0-5.205 3.03-5.205 6.766c.003 2.469 1.04 4.74 2.706 5.925v11.922M16.451 12.724v-2.99c0-.731.589-1.32 1.32-1.32h12.456c.732 0 1.321.589 1.321 1.32v2.99zM33.485 42.5h3.278c2.195 0 3.884-1.768 3.962-3.96l.924-25.917L36.873 5.5H11.129l-4.778 7.123l.924 25.917c.078 2.192 1.767 3.96 3.962 3.96h3.73m4.998 0h8.52" />
               </svg>

               <svg v-else-if="service.id === 2" class="w-8 h-8 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                 <path d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5zm8 16h12m-12 8h12M18 14h12" />
               </svg>

               <svg v-else-if="service.id === 3" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                 <path d="m17.578 4.432l-2-1.05C13.822 2.461 12.944 2 12 2s-1.822.46-3.578 1.382l-.321.169l8.923 5.099l4.016-2.01c-.646-.732-1.688-1.279-3.462-2.21m4.17 3.534l-3.998 2V13a.75.75 0 0 1-1.5 0v-2.286l-3.5 1.75v9.44c.718-.179 1.535-.607 2.828-1.286l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.597-1.014.597-2.277.597-4.8v-.117c0-1.893 0-3.076-.252-3.978M11.25 21.904v-9.44l-8.998-4.5C2 8.866 2 10.05 2 11.941v.117c0 2.525 0 3.788.597 4.802c.598 1.015 1.674 1.58 3.825 2.709l2 1.049c1.293.679 2.11 1.107 2.828 1.286M2.96 6.641l9.04 4.52l3.411-1.705l-8.886-5.078l-.103.054c-1.773.93-2.816 1.477-3.462 2.21" />
               </svg>

               <svg v-else-if="service.id === 4" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M1 2v2h2l3.6 7.59l-1.35 2.45c-.16.28-.25.61-.25.96c0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12l.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2" />
               </svg>

               <svg v-else-if="service.id === 5" class="w-8 h-8 text-white" viewBox="0 0 48 48">
                 <defs><mask id="SVGOK6PceUP"><g fill="none"><rect width="38" height="26" x="5" y="16" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="3"/><path fill="#fff" d="M19 8h10V4H19zm11 1v7h4V9zm-12 7V9h-4v7zm11-8a1 1 0 0 1 1 1h4a5 5 0 0 0-5-5zM19 4a5 5 0 0 0-5 5h4a1 1 0 0 1 1-1z"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M18 29h12m-6-6v12"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGOK6PceUP)"/>
               </svg>

               <svg v-else-if="service.id === 6" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M20.25 13.5a.25.25 0 0 0-.25.25v3a.25.25 0 0 0 .25.25h2.25a1.5 1.5 0 0 0 1.5-1.5v-1.75a.25.25 0 0 0-.25-.25Zm-1.5-1a.25.25 0 0 0 .25-.25V10.5a.5.5 0 0 1 1 0v1.75a.25.25 0 0 0 .25.25h3.5a.25.25 0 0 0 .25-.25V10.5A1.5 1.5 0 0 0 22.5 9h-.84a.25.25 0 0 1-.23-.15a.26.26 0 0 1 .06-.28L22 8a.75.75 0 0 0-1-1l-1.32 1.26a.25.25 0 0 1-.36 0L18 7a.75.75 0 0 0-1 1l.54.54a.26.26 0 0 1 .06.28a.25.25 0 0 1-.23.15h-.87A1.5 1.5 0 0 0 15 10.5v1.75a.25.25 0 0 0 .25.25Zm.25 1.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25v1.75a1.5 1.5 0 0 0 1.5 1.5h2.25a.25.25 0 0 0 .25-.25Z"/>
                 <path d="M10.61 15.5H13a1 1 0 0 0 0-2h-1.83a.5.5 0 0 1-.38-.17a.47.47 0 0 1-.12-.38l.68-6.5a.5.5 0 0 1 .5-.45h6.65a1 1 0 0 0 0-2h-.75a.25.25 0 0 1-.25-.25V3a3 3 0 0 0-6 0v.9a.09.09 0 0 1-.1.1a2 2 0 0 0-2 1.79l-.79 7.5a2 2 0 0 0 .51 1.55a2 2 0 0 0 1.49.66M13.5 3a1 1 0 0 1 2 0v.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25ZM1 14.75a1 1 0 0 0-1 1V23a1 1 0 0 0 2 0v-7.25a1 1 0 0 0-1-1m14.5 4.75H6.38a.63.63 0 1 1 0-1.25H8.9a1 1 0 0 0 .92-1.39a2.23 2.23 0 0 0-2.06-1.36H3.5a.5.5 0 0 0-.5.5v6.5a.5.5 0 0 0 .5.5h10.76a2.24 2.24 0 0 0 2.24-2.24v-.26a1 1 0 0 0-1-1"/>
               </svg>
               
            </div>

            <h3 class="text-xl font-bold text-[#05103B] mb-2 group-hover:text-[#74E600] transition-colors">{{ service.name }}</h3>
            <p class="text-gray-500 text-sm mb-4 flex-grow line-clamp-2">{{ service.description }}</p>
            
            <div class="mt-auto pt-4 border-t border-gray-100 w-full">
               <span class="text-lg font-bold text-[#74E600]">Starts at ₱{{ service.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="about-section" class="py-16 bg-white overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <h2 class="text-3xl font-bold text-[#05103B] mb-4">About BROOOM</h2>
            <div class="w-16 h-1 bg-[#74E600] mb-6 rounded-full"></div>
            <p class="text-gray-600 leading-relaxed mb-6">Founded on <span class="font-semibold text-[#74E600]">Feb 7, 2020</span>, BROOOM SERVICES connects customers with providers in Calapan City.</p>
            <div class="grid grid-cols-3 gap-4 mb-8">
              <div v-for="item in ['Quality', 'Trust', 'Innovation']" :key="item" class="p-4 bg-gray-50 rounded-xl text-center border border-gray-100 hover:border-[#74E600] transition-all"><span class="font-bold text-[#74E600] text-sm md:text-base">{{ item }}</span></div>
            </div>
          </div>
          <div class="order-1 md:order-2 bg-gradient-to-br from-[#74E600] to-[#3ED400] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
            <h4 class="text-2xl font-bold mb-6 relative z-10">Why Choose Us?</h4>
            <ul class="space-y-4 relative z-10">
              <li v-for="feat in ['Fast delivery', 'Real-time tracking', 'Affordable pricing', 'Community focused']" :key="feat" class="flex items-center"><div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 shrink-0">✓</div>{{ feat }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="text-center mb-10"><h2 class="text-2xl font-bold text-[#05103B]">Customer Reviews</h2></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t.id" class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border-l-4 border-[#74E600]">
            <div class="flex items-center mb-4"><div class="w-10 h-10 bg-[#74E600] rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md">{{ t.initials }}</div><div><h4 class="font-bold text-[#05103B]">{{ t.name }}</h4><div class="flex text-[#3ED400] text-xs">★★★★★</div></div></div><p class="text-gray-600 italic text-sm">"{{ t.comment }}"</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-[#05103B] text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-[#74E600] opacity-5 mix-blend-overlay"></div>
      <div class="container mx-auto px-4 text-center relative z-10">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link 
            to="/login" 
            @click="handleNavigation('/login')"
            class="px-8 py-3 rounded-full border border-white hover:bg-white hover:text-[#05103B] transition-colors font-semibold"
          >
            Login
          </router-link>
          <router-link 
            to="/register" 
            @click="handleNavigation('/register')"
            class="bg-[#74E600] text-white px-8 py-3 rounded-full font-bold hover:bg-[#63c400] transition-colors shadow-lg"
          >
            Create Account
          </router-link>
        </div>
      </div>
    </section>

    <transition name="fade">
      <button 
        v-show="showScrollTop" 
        @click="scrollToTop" 
        class="fixed bottom-8 right-6 z-50 bg-[#74E600] text-white p-3 rounded-full shadow-lg hover:bg-[#63c400] transform hover:-translate-y-1 transition-all"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
        </svg>
      </button>
    </transition>

    <!-- Scroll to Bottom Button -->
    <button
      v-show="showScrollBottom"
      @click="scrollToBottom"
      class="fixed bottom-20 right-6 z-40 bg-[#3ED400] text-white p-3 rounded-full shadow-lg hover:bg-[#2eb300] transition-all duration-300"
      aria-label="Scroll to bottom"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Floating Chatbot -->
    <FloatingChatbot />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import FloatingChatbot from '@/components/FloatingChatbot.vue'

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

    const handleNavigation = (path) => {
      console.log('[v0] HomePage navigating to:', path)
      
      // Force navigation using router.push as fallback
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

      // Show scroll to top button when scrolled down 300px
      showScrollTop.value = scrollTop > 300

      // Hide scroll to bottom button when near bottom (within 100px)
      showScrollBottom.value = scrollTop < documentHeight - windowHeight - 100
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initial check
      
      const video = videoRef.value;
      if (video) {
        video.muted = true;
        video.play().catch(e => console.log("Video autoplay blocked", e));
      }
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    const services = ref([
      {
        id: 1,
        name: 'Food Delivery',
        description: 'Hot & fresh from local favorites',
        price: '55',
        icon: 'svg'
      },
      {
        id: 2,
        name: 'Bill Payments',
        description: 'Secure hassle-free payments',
        price: '55',
        icon: 'svg'
      },
      {
        id: 3,
        name: 'Pick-up & Drop',
        description: 'Fast local courier service',
        price: '55',
        icon: 'svg'
      },
      {
        id: 4,
        name: 'Grocery',
        description: 'We shop and deliver to you',
        price: '55',
        icon: 'svg'
      },
      {
        id: 5,
        name: 'Medicine',
        description: 'Safe pharmacy delivery',
        price: '55',
        icon: 'svg'
      },
      {
        id: 6,
        name: 'Surprise Gifts',
        description: 'Send gifts to loved ones',
        price: '55',
        icon: 'svg'
      }
    ])

    const testimonials = ref([
      {
        id: 1,
        name: 'Juliana Juan JulSeb',
        initials: 'JJJ',
        comment: 'You can ask them to buy anything you want to as long as it is available in your town. As of now at para sa akin Legit at maayos ang service nila. Five star ⭐ for Broooom Delivery Services.'
      },
      {
        id: 2,
        name: 'Rhane Cielo-Blanca',
        initials: 'RC',
        comment: 'Very accommodating. Fast transaction. Thank you for the good service.'
      },
      {
        id: 3,
        name: 'Jenny Joy Bensurto',
        initials: 'JJB',
        comment: 'Thank you so much, Broooom! Napaka-bilis magreply ng admin and laging nag-uupdate si rider. Very smooth ang transaction!'
      }
    ])

    return {
      handleNavigation,
      services,
      testimonials,
      showScrollTop,
      showScrollBottom,
      scrollToTop,
      scrollToBottom,
      videoRef
    }
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
.animate-float { animation: float 6s ease-in-out infinite; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
