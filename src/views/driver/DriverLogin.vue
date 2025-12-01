<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Driver Login</h2>
          <p class="text-gray-600 mt-2">Sign in to your driver account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <span class="text-sm text-gray-500">
              Forgot password? Contact admin
            </span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In as Driver</span>
          </button>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Don't have a driver account?
              <router-link to="/driver/register" class="text-blue-600 hover:text-blue-500 font-medium">
                Apply to become a driver
              </router-link>
            </p>
          </div>

          <div class="text-center">
            <router-link to="/login" class="text-sm text-gray-500 hover:text-gray-700">
              ← Back to regular login
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export default {
  name: 'DriverLogin',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const rememberMe = ref(false)
    const loading = ref(false)

    const handleLogin = async () => {
      if (!email.value || !password.value) {
        toast.error('Please fill in all fields')
        return
      }

      loading.value = true
      try {
        // Check if a different role is already logged in
        if (authStore.isAuthenticated && authStore.userProfile) {
          const currentRole = authStore.userProfile.role
          if (currentRole !== 'driver') {
            // Force logout if different role is logged in
            await authStore.logout()
            toast.info('Please log in with your driver account.')
          }
        }

        // Try to login - we'll check the role after
        const result = await authStore.login(email.value, password.value, 'driver')

        if (!result.success) {
          toast.error(result.message || result.error || 'Login failed')
          return
        }

        // ✅ Primary check: role from Firestore profile in the store
        const role = authStore.userProfile?.role
        if (role === 'driver') {
          toast.success('Welcome back, driver!')
          router.push('/driver')
          return
        }

        // 🔎 Secondary check: baka nasa /drivers collection pero nauna nabasa ang /users doc
        const uid = authStore.user?.uid
        if (uid) {
          const drvSnap = await getDoc(doc(db, 'drivers', uid))
          if (drvSnap.exists()) {
            const drv = drvSnap.data()
            if (drv?.role === 'driver' && drv?.approved === true && drv?.banned !== true) {
              // i-refresh locally ang profile para sa session na ito
              authStore.userProfile = { id: drvSnap.id, ...drv }
              toast.success('Welcome back, driver!')
              router.push('/driver')
              return
            }
          }
        }

        // ✋ Kung umabot dito, hindi siya driver account
        toast.error('This account is not registered as a driver. Please use the user login page.')
        await authStore.logout()
      } catch (err) {
        console.error('Driver login error:', err)
        toast.error('An error occurred during login')
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      showPassword,
      rememberMe,
      loading,
      handleLogin
    }
  }
}
</script>
