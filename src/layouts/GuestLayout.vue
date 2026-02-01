<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <nav v-if="!isAuthPage" class="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-[#3ED400] shadow-md group-hover:scale-105 transition-transform duration-300 bg-gray-200">
                 <img 
                  src="/LOGO.jpg" 
                  alt="BroomTech Logo"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-lg font-bold bg-gradient-to-r from-[#05103B] to-[#74E600] bg-clip-text text-transparent leading-tight">BROOOOM</span>
                <span class="text-[10px] text-gray-600 leading-none font-medium tracking-wide">DELIVERY SERVICES</span>
              </div>
            </router-link>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="relative text-sm text-gray-600 hover:text-[#74E600] transition-all duration-300 font-semibold group">
              Home
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#74E600] to-[#3ED400] group-hover:w-full transition-all duration-300"></span>
            </router-link>
            <a @click="scrollToSection('about-section')" class="relative text-sm text-gray-600 hover:text-[#74E600] transition-all duration-300 cursor-pointer font-semibold group">
              About
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#74E600] to-[#3ED400] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a @click="scrollToSection('services-section')" class="relative text-sm text-gray-600 hover:text-[#74E600] transition-all duration-300 cursor-pointer font-semibold group">
              Services
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#74E600] to-[#3ED400] group-hover:w-full transition-all duration-300"></span>
            </a>
            
            <div class="flex items-center gap-3 ml-4 border-l border-gray-200 pl-6">
              <router-link 
                to="/login" 
                @click="handleNavigation('/login')"
                class="text-sm font-bold text-gray-700 hover:text-[#74E600] transition-colors"
              >
                Login
              </router-link>
              
              <router-link 
                to="/register" 
                @click="handleNavigation('/register')"
                class="bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-300"
              >
                Register
              </router-link>
            </div>
          </div>
          
          <div class="md:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-[#74E600] p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-if="mobileMenuOpen" class="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-xl absolute w-full top-16 left-0 z-40">
          <div class="px-4 py-6 space-y-3">
            <router-link to="/" @click="mobileMenuOpen = false" class="block px-4 py-3 text-sm text-gray-700 hover:text-[#74E600] hover:bg-green-50 rounded-xl font-bold transition-colors">Home</router-link>
            <a @click="scrollToSection('about-section')" class="block px-4 py-3 text-sm text-gray-700 hover:text-[#74E600] hover:bg-green-50 rounded-xl cursor-pointer font-bold transition-colors">About</a>
            <a @click="scrollToSection('services-section')" class="block px-4 py-3 text-sm text-gray-700 hover:text-[#74E600] hover:bg-green-50 rounded-xl cursor-pointer font-bold transition-colors">Services</a>
            <div class="border-t border-gray-100 my-2 pt-2"></div>
            <router-link to="/login" @click="handleNavigation('/login')" class="block px-4 py-3 text-sm text-gray-700 hover:text-[#74E600] hover:bg-green-50 rounded-xl font-bold transition-colors">Login</router-link>
            <router-link to="/register" @click="handleNavigation('/register')" class="block w-full text-center mt-4 px-4 py-3 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-sm rounded-xl font-bold shadow-lg shadow-green-200">Create Account</router-link>
          </div>
        </div>
      </transition>
    </nav>
    
    <main class="flex-grow">
      <router-view />
    </main>
    
    <footer v-if="!isAuthPage" class="bg-[#05103B] text-white py-12 relative overflow-hidden text-sm border-t border-gray-800 z-10">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-[#74E600] rounded-full blur-[120px] opacity-10"></div>
        <div class="absolute top-1/2 -right-24 w-64 h-64 bg-[#3ED400] rounded-full blur-[120px] opacity-10"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-[#74E600] bg-gray-800">
                  <img 
                    src="/LOGO.jpg" 
                    alt="BroomTech Logo"
                    class="w-full h-full object-cover"
                  />
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-bold text-white tracking-tight leading-none">BROOOM</span>
                <span class="text-[10px] text-[#74E600] font-bold tracking-widest uppercase mt-0.5">DELIVERY SERVICES</span>
              </div>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your reliable delivery partner in Calapan City. We connect you to what matters most with speed, care, and affordability.
            </p>
            <div class="pt-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                <span class="w-2 h-2 rounded-full bg-[#74E600] mr-2 animate-pulse"></span> Service Active
              </span>
            </div>
          </div>
          
          <div>
            <h3 class="font-bold text-base mb-5 text-white flex items-center">
              Our Services
              <span class="h-1 w-8 bg-[#74E600] rounded-full ml-3"></span>
            </h3>
            <ul class="space-y-3 text-gray-400 text-sm">
              <li class="hover:text-[#74E600] transition-colors duration-200 cursor-pointer flex items-center group">
                <svg class="w-4 h-4 mr-2 text-[#74E600] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                Food Delivery
              </li>
              <li class="hover:text-[#74E600] transition-colors duration-200 cursor-pointer flex items-center group">
                <svg class="w-4 h-4 mr-2 text-[#74E600] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                Pay Bills / Remittances
              </li>
              <li class="hover:text-[#74E600] transition-colors duration-200 cursor-pointer flex items-center group">
                <svg class="w-4 h-4 mr-2 text-[#74E600] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                Pick-up Service
              </li>
              <li class="hover:text-[#74E600] transition-colors duration-200 cursor-pointer flex items-center group">
                <svg class="w-4 h-4 mr-2 text-[#74E600] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                Surprise Delivery
              </li>
              <li class="hover:text-[#74E600] transition-colors duration-200 cursor-pointer flex items-center group">
                <svg class="w-4 h-4 mr-2 text-[#74E600] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                Medicines Delivery
              </li>
              <li class="hover:text-[#74E600] transition-colors duration-200 cursor-pointer flex items-center group">
                <svg class="w-4 h-4 mr-2 text-[#74E600] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                Grocery / Shopping
              </li>
              <li class="hover:text-[#74E600] transition-colors duration-200 cursor-pointer flex items-center group">
                <svg class="w-4 h-4 mr-2 text-[#74E600] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                Babili Service
              </li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold text-base mb-5 text-white flex items-center">
              Contact Us
              <span class="h-1 w-8 bg-[#3ED400] rounded-full ml-3"></span>
            </h4>
            <div class="space-y-4 text-gray-400 text-sm">
              <div class="flex items-start space-x-3 group hover:text-white transition-colors">
                <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#74E600]/20 transition-colors">
                  <svg class="w-4 h-4 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <span>Calapan City, Oriental Mindoro<br>Philippines 5200</span>
              </div>
              <div class="flex items-center space-x-3 group hover:text-white transition-colors">
                <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#74E600]/20 transition-colors">
                  <svg class="w-4 h-4 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <span>broooomexpressdelivery@gmail.com</span>
              </div>
              <div class="flex items-center space-x-3 group hover:text-white transition-colors">
                <div class="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#74E600]/20 transition-colors">
                  <svg class="w-4 h-4 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <span>0955 773 9438</span>
              </div>
            </div>
          </div>

        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; 2025 Broooom Delivery Services. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'GuestLayout',
  setup() {
    const router = useRouter()
    const mobileMenuOpen = ref(false)
    
    // Check if current route is login or register page
    const isAuthPage = computed(() => {
      const route = router.currentRoute.value
      // Safely check if route and route.name exist
      return route && (route.name === 'login' || route.name === 'register')
    })

    const handleNavigation = (path) => {
      console.log('[v0] Navigating to:', path)
      mobileMenuOpen.value = false // Close mobile menu if open
      
      router.push(path).catch(err => {
        console.error('[v0] Navigation error:', err)
      })
    }

    const scrollToSection = (sectionId) => {
      mobileMenuOpen.value = false // Close mobile menu if open
      
      // If not on homepage, navigate to homepage first then scroll
      if (router.currentRoute.value.path !== '/') {
        router.push('/').then(() => {
          setTimeout(() => {
            const element = document.getElementById(sectionId)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }, 300) // Increased timeout slightly to ensure DOM is ready
        })
      } else {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    return {
      mobileMenuOpen,
      isAuthPage,
      handleNavigation,
      scrollToSection
    }
  }
}
</script>