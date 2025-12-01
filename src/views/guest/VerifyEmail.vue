<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Back Button -->
        <div class="flex justify-start mb-4">
          <button
            @click="$router.push('/register')"
            class="text-gray-600 hover:text-gray-900"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        </div>

        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-gray-900">Verify Your Email</h2>
        <p class="mt-2 text-sm text-gray-600">
          Click the verification link sent to your email
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <p class="text-sm text-gray-700 text-center mb-4">
          We've sent a verification link to
        </p>
        <p class="text-sm font-semibold text-gray-900 text-center mb-6">
          {{ email }}
        </p>

        <!-- Countdown Timer -->
        <div class="text-center mb-6">
          <p class="text-sm text-gray-600 mb-2">Link expires in:</p>
          <p class="text-2xl font-bold" :class="timeRemaining <= 60 ? 'text-red-600' : 'text-gray-900'">
            {{ formatTime(timeRemaining) }}
          </p>
        </div>

        <!-- Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800">
            <strong>Instructions:</strong>
          </p>
          <ol class="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click on the verification link in the email</li>
            <li>You will be redirected to the login page</li>
          </ol>
        </div>

        <!-- Resend Button -->
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-3">Didn't receive the link?</p>
          <button
            @click="resendVerification"
            :disabled="resending || timeRemaining > 0"
            class="w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :class="timeRemaining > 0 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-yellow-400 text-white hover:bg-yellow-500'"
          >
            <span v-if="resending">Sending...</span>
            <span v-else-if="timeRemaining > 0">Resend Link ({{ formatTime(timeRemaining) }})</span>
            <span v-else>Resend Verification Link</span>
          </button>
        </div>
      </div>

      <div class="text-center">
        <router-link
          to="/login"
          class="text-sm text-primary hover:text-green-600 font-medium"
        >
          Already verified? Go to Login
        </router-link>
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
        // Note: This would require the user to be logged in or we need to store the user ID
        // For now, we'll show a message
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
        router.push('/register')
        return
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










