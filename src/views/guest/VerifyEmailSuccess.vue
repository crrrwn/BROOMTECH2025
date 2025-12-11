<template>
  <div class="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden font-sans">
    
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A8EB12] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-[#3ED400] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse delay-1000 pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#74E600] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>

    <div class="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 p-8 sm:p-10 z-10 transition-all duration-300">
      
      <div class="text-center space-y-6">
        
        <div v-if="!isExpired && !error">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 bg-[#3ED400] rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div class="relative w-24 h-24 bg-gradient-to-tr from-[#3ED400] to-[#A8EB12] rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">Email Verified!</h2>
          <p class="text-gray-500 font-medium">
            Your email address has been successfully verified. Redirecting you to login...
          </p>
        </div>

        <div v-else>
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div class="relative w-24 h-24 bg-gradient-to-tr from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <h2 class="text-2xl font-extrabold text-gray-800 tracking-tight">Verification Failed</h2>
          <p class="text-gray-500 font-medium mt-2">
            {{ error || 'This verification link has expired or is invalid.' }}
          </p>
        </div>
      </div>
      
      <div class="mt-8 space-y-4">
        <router-link
          v-if="!isExpired && !error"
          to="/login"
          class="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white hover:to-[#009e3f] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md flex items-center justify-center"
        >
          Go to Login Now
        </router-link>
        
        <div v-else class="space-y-4">
          <router-link
            to="/verify-email"
            class="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white hover:to-[#009e3f] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md flex items-center justify-center"
          >
            Request New Link
          </router-link>
          
          <router-link
            to="/register"
            class="block text-center text-sm font-bold text-[#00C851] hover:text-[#3ED400] transition-colors"
          >
            Back to Registration
          </router-link>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router' // Added useRouter

export default {
  name: 'VerifyEmailSuccess',
  setup() {
    const route = useRoute()
    const router = useRouter() // Use router for cleaner SPA navigation
    const isExpired = ref(false)
    const error = ref('')

    onMounted(() => {
      // Check for error parameters in URL (Firebase adds these for expired/invalid links)
      const mode = route.query.mode
      const oobCode = route.query.oobCode
      const errorParam = route.query.error

      if (errorParam) {
        error.value = decodeURIComponent(errorParam)
        isExpired.value = true
      } else if (mode === 'verifyEmail' && !oobCode) {
        // If mode is verifyEmail but no code, link might be expired/broken
        isExpired.value = true
        error.value = 'Verification code is missing. Please try again.'
      }

      // Auto-redirect to login after 3 seconds if successful
      if (!isExpired.value && !error.value) {
        setTimeout(() => {
          // Use router.push instead of window.location for smoother transition
          router.push('/login')
        }, 3000)
      }
    })

    return {
      isExpired,
      error
    }
  }
}
</script>