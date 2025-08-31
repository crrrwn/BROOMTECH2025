<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-white">Admin Portal</h2>
        <p class="mt-2 text-sm text-gray-400">Restricted access for administrators only</p>
        <div class="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p class="text-yellow-200 text-sm">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            This portal is for authorized administrators only
          </p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-xl p-8">
        <form @submit.prevent="handleAdminLogin" class="space-y-6">
          <div>
            <label for="admin-email" class="block text-sm font-medium text-gray-700">Administrator Email</label>
            <input id="admin-email" v-model="form.email" type="email" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="admin@broomtech.com"/>
          </div>

          <div>
            <label for="admin-password" class="block text-sm font-medium text-gray-700">Administrator Password</label>
            <div class="mt-1 relative">
              <input id="admin-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter admin password"/>
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="admin-remember" v-model="form.rememberMe" type="checkbox"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"/>
              <label for="admin-remember" class="ml-2 block text-sm text-gray-900">Keep me signed in</label>
            </div>

            <button type="button" @click="showForgotPassword = true" class="text-sm text-red-600 hover:text-red-500">
              Forgot password?
            </button>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </span>
              {{ loading ? 'Signing in...' : 'Access Admin Portal' }}
            </button>
          </div>

          <div class="text-center">
            <router-link to="/login" class="text-sm text-gray-600 hover:text-gray-500">← Back to regular login</router-link>
          </div>
        </form>
      </div>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Reset Admin Password</h3>
            <form @submit.prevent="handleForgotPassword">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Administrator Email</label>
                <input v-model="forgotPasswordEmail" type="email" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="admin@broomtech.com"/>
              </div>
              <div class="flex justify-end space-x-3">
                <button type="button" @click="showForgotPassword = false" class="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" :disabled="loading" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({ email: '', password: '', rememberMe: false })
const loading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')

const handleAdminLogin = async () => {
  loading.value = true
  try {
    const result = await authStore.loginAdmin(form.value.email, form.value.password)
    if (result.success) {
      toast.success('Welcome to Admin Portal')
      router.push('/admin')
    } else {
      toast.error(result.message || 'Admin login failed')
    }
  } catch (e) {
    toast.error('An error occurred during admin login')
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!forgotPasswordEmail.value) return
  loading.value = true
  try {
    const result = await authStore.resetPassword(forgotPasswordEmail.value)
    if (result.success) {
      toast.success('Password reset email sent to administrator')
      showForgotPassword.value = false
      forgotPasswordEmail.value = ''
    } else {
      toast.error(result.message)
    }
  } catch (e) {
    toast.error('An error occurred while sending reset email')
  } finally {
    loading.value = false
  }
}
</script>
