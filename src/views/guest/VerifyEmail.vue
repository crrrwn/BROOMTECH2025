<template>
  <div class="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden font-sans">
    
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A8EB12] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-[#3ED400] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse delay-1000 pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#74E600] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>

    <div class="relative w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 p-8 sm:p-10 z-10 transition-all duration-300">
      
      <button 
        @click="$router.push('/register')"
        class="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-[#00C851] hover:bg-green-50 transition-all duration-200 z-20"
        title="Go back"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </button>

      <div class="text-center space-y-6">
        
        <div class="flex justify-center pt-4">
          <div class="relative">
            <div class="absolute inset-0 bg-[#3ED400] rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div class="relative w-24 h-24 bg-gradient-to-tr from-[#A8EB12] to-[#00C851] rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7.171-5.123a2 2 0 012.176 0l7.171 5.123a2 2 0 01.89 1.664V19a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l6.972 5.093a2.956 2.956 0 003.498 0L21 10"></path>
              </svg>
            </div>
            <div class="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-50 shadow-sm">
              <span class="flex h-3 w-3 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Check your email</h2>
          <p class="text-gray-500 text-sm sm:text-base">
            We've sent a verification link to
          </p>
          <div class="inline-block px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 mt-2 max-w-full truncate">
            <p class="text-base sm:text-lg font-bold text-[#00C851] truncate">
              {{ email }}
            </p>
          </div>
        </div>

        <div class="py-4 sm:py-6">
          <div class="flex flex-col items-center">
            <span class="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Link Expires In</span>
            <div class="text-4xl sm:text-5xl font-black tabular-nums tracking-tight" 
                 :class="timeRemaining <= 60 ? 'text-red-500 animate-pulse' : 'text-gray-800'">
              {{ formatTime(timeRemaining) }}
            </div>
          </div>
        </div>

        <div class="bg-[#F0FFF4] border border-[#A8EB12] rounded-2xl p-5 text-left shadow-inner">
          <p class="text-sm font-bold text-[#00C851] flex items-center mb-3">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Next Steps:
          </p>
          <ul class="space-y-3">
            <li class="flex items-start text-sm text-gray-600">
              <div class="flex-shrink-0 w-5 h-5 rounded-full bg-[#00C851] text-white flex items-center justify-center text-xs font-bold mt-0.5 mr-3">1</div>
              Check your inbox (and spam folder)
            </li>
            <li class="flex items-start text-sm text-gray-600">
              <div class="flex-shrink-0 w-5 h-5 rounded-full bg-[#00C851] text-white flex items-center justify-center text-xs font-bold mt-0.5 mr-3">2</div>
              Click the verification link
            </li>
            <li class="flex items-start text-sm text-gray-600">
              <div class="flex-shrink-0 w-5 h-5 rounded-full bg-[#00C851] text-white flex items-center justify-center text-xs font-bold mt-0.5 mr-3">3</div>
              Log in to your account
            </li>
          </ul>
        </div>

        <div class="pt-2">
          <p class="text-sm text-gray-500 mb-4">Didn't receive the email?</p>
          <button
            @click="resendVerification"
            :disabled="resending || timeRemaining > 0"
            class="w-full py-3.5 sm:py-4 px-6 rounded-full font-bold text-sm transition-all duration-300 shadow-md flex items-center justify-center"
            :class="timeRemaining > 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white hover:to-[#009e3f] hover:shadow-lg hover:-translate-y-1'"
          >
            <svg v-if="resending" class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else-if="timeRemaining <= 0" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            
            <span v-if="resending">Sending...</span>
            <span v-else-if="timeRemaining > 0">Resend available in {{ formatTime(timeRemaining) }}</span>
            <span v-else>Resend Verification Link</span>
          </button>
        </div>

        <div class="mt-6 border-t border-gray-100 pt-6">
          <router-link
            to="/login"
            class="inline-flex items-center text-sm font-bold text-[#00C851] hover:text-[#3ED400] transition-colors group"
          >
            <svg class="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            Already verified? Go to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'VerifyEmail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const email = ref(route.query.email || '')
    const timeRemaining = ref(240) // 4 minutes in seconds
    const resending = ref(false)
    let countdownInterval = null

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const startCountdown = () => {
      // Clear existing interval if any
      if (countdownInterval) clearInterval(countdownInterval)
      
      countdownInterval = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--
        } else {
          clearInterval(countdownInterval)
        }
      }, 1000)
    }

    const resendVerification = async () => {
      if (timeRemaining.value > 0 || resending.value) return

      resending.value = true
      try {
        // NOTE: In a real app, you might need to pass the email to your API here
        // await authStore.resendVerificationEmail(email.value)
        
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.info('Please check your email for a new verification link')
        timeRemaining.value = 240 // Reset timer
        startCountdown()
      } catch (error) {
        toast.error('Failed to resend verification link. Please try again.')
      } finally {
        resending.value = false
      }
    }

    onMounted(() => {
      if (!email.value) {
        // If no email query param, redirect back to register
        // But for development checking, you might want to comment this out
        // router.push('/register')
        // return
        
        // Placeholder for dev viewing if query param missing
        email.value = 'user@example.com' 
      }
      startCountdown()
    })

    onUnmounted(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    })

    return {
      email,
      timeRemaining,
      resending,
      formatTime,
      resendVerification
    }
  }
}
</script>