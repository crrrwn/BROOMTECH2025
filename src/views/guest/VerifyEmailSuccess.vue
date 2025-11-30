<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Success State -->
        <div v-if="!isExpired && !error">
          <div class="flex justify-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Email Verified!</h2>
          <p class="mt-2 text-sm text-gray-600">
            Your email address has been successfully verified. You can now log in to your account.
          </p>
        </div>

        <!-- Expired/Error State -->
        <div v-else>
          <div class="flex justify-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">Verification Link Expired</h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ error || 'This verification link has expired. Please request a new verification link.' }}
          </p>
        </div>
      </div>
      
      <div class="mt-8">
        <router-link
          v-if="!isExpired && !error"
          to="/login"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Go to Login
        </router-link>
        <div v-else class="space-y-3">
          <router-link
            to="/verify-email"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Request New Verification Link
          </router-link>
          <router-link
            to="/register"
            class="block text-center text-sm text-primary hover:text-green-600 font-medium"
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
import { useRoute } from 'vue-router'

export default {
  name: 'VerifyEmailSuccess',
  setup() {
    const route = useRoute()
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
        // If mode is verifyEmail but no code, link might be expired
        isExpired.value = true
        error.value = 'This verification link has expired. Verification links expire after 4 minutes.'
      }

      // Auto-redirect to login after 3 seconds if successful
      if (!isExpired.value && !error.value) {
        setTimeout(() => {
          window.location.href = '/login'
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

