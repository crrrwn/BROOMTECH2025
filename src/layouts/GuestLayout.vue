<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav v-if="!isAuthPage" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">B</span>
              </div>
              <span class="text-xl font-bold text-gray-900">BroomTech</span>
            </router-link>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-primary transition-colors">Home</router-link>
            <a @click="scrollToSection('about-section')" class="text-gray-700 hover:text-primary transition-colors cursor-pointer">About</a>
            <a @click="scrollToSection('services-section')" class="text-gray-700 hover:text-primary transition-colors cursor-pointer">Services</a>
            <router-link 
              to="/login" 
              @click="handleNavigation('/login')"
              class="text-gray-700 hover:text-primary transition-colors"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              @click="handleNavigation('/register')"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Register
            </router-link>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-primary">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="block px-3 py-2 text-gray-700 hover:text-primary">Home</router-link>
          <a @click="scrollToSection('about-section')" class="block px-3 py-2 text-gray-700 hover:text-primary cursor-pointer">About</a>
          <a @click="scrollToSection('services-section')" class="block px-3 py-2 text-gray-700 hover:text-primary cursor-pointer">Services</a>
          <router-link 
            to="/login" 
            @click="handleNavigation('/login')"
            class="block px-3 py-2 text-gray-700 hover:text-primary"
          >
            Login
          </router-link>
          <router-link 
            to="/register" 
            @click="handleNavigation('/register')"
            class="block px-3 py-2 bg-primary text-white rounded-lg mx-3"
          >
            Register
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- Main content -->
    <main>
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer v-if="!isAuthPage" class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">B</span>
              </div>
              <span class="text-xl font-bold">BroomTech</span>
            </div>
            <p class="text-gray-400">Your reliable delivery service in Calapan City.</p>
          </div>
          
          <div>
            <h3 class="font-semibold mb-4">Services</h3>
            <ul class="space-y-2 text-gray-400">
              <li>Food Delivery</li>
              <li>Bill Payments</li>
              <li>Pick-up & Drop</li>
              <li>Grocery Shopping</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold mb-4">Company</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a @click="scrollToSection('about-section')" class="hover:text-white cursor-pointer">About Us</a></li>
              <li><a @click="scrollToSection('services-section')" class="hover:text-white cursor-pointer">Services</a></li>
              <li>Contact</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-400">
              <li>Calapan City, Oriental Mindoro</li>
              <li>support@broomtech.com</li>
              <li>+63 123 456 7890</li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8">
          <div class="flex flex-col sm:flex-row justify-between items-center">
            <p class="text-gray-400">&copy; 2025 BroomTech. All rights reserved.</p>
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
      return route.name === 'login' || route.name === 'register'
    })

    const handleNavigation = (path) => {
      console.log('[v0] Navigating to:', path)
      mobileMenuOpen.value = false // Close mobile menu if open
      
      // Force navigation using router.push as fallback
      router.push(path).catch(err => {
        console.error('[v0] Navigation error:', err)
      })
    }

    const scrollToSection = (sectionId) => {
      mobileMenuOpen.value = false // Close mobile menu if open
      
      // If not on homepage, navigate to homepage first then scroll
      if (router.currentRoute.value.path !== '/') {
        router.push('/').then(() => {
          // Wait for navigation to complete, then scroll
          setTimeout(() => {
            const element = document.getElementById(sectionId)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }, 100)
        })
      } else {
        // Already on homepage, just scroll
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
