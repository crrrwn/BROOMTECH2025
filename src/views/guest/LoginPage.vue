<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">B</span>
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-primary hover:text-green-600">
            create a new account
          </router-link>
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <button
            type="button"
            @click="showForgotPassword = true"
            class="text-sm text-primary hover:text-green-600"
          >
            Forgot your password?
          </button>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleLogin"
              :disabled="loading"
              class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </form>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Reset Password</h3>
            <form @submit.prevent="handleForgotPassword">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input
                  v-model="forgotPasswordEmail"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showForgotPassword = false"
                  class="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeNotificationModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <div class="flex items-center mb-4">
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center mr-4',
            notificationType === 'success' ? 'bg-green-100' : 
            notificationType === 'error' ? 'bg-red-100' : 
            notificationType === 'warning' ? 'bg-yellow-100' :
            'bg-blue-100'
          ]">
            <svg 
              v-if="notificationType === 'success'"
              class="w-6 h-6 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg 
              v-else-if="notificationType === 'error'"
              class="w-6 h-6 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <svg 
              v-else-if="notificationType === 'warning'"
              class="w-6 h-6 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <svg 
              v-else
              class="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 :class="[
            'text-lg font-semibold',
            notificationType === 'success' ? 'text-green-900' : 
            notificationType === 'error' ? 'text-red-900' : 
            notificationType === 'warning' ? 'text-yellow-900' :
            'text-blue-900'
          ]">
            {{ notificationType === 'success' ? 'Success' : notificationType === 'error' ? 'Error' : notificationType === 'warning' ? 'Warning' : 'Information' }}
          </h3>
        </div>
        <p class="text-gray-700 mb-6">{{ notificationMessage }}</p>
        <div class="flex justify-end">
          <button
            @click="closeNotificationModal"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              notificationType === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 
              notificationType === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 
              notificationType === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
              'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')

// Notification modal state
const showNotificationModal = ref(false)
const notificationType = ref('success') // 'success', 'error', 'warning', 'info'
const notificationMessage = ref('')

const showNotification = (type, message) => {
  notificationType.value = type
  notificationMessage.value = message
  showNotificationModal.value = true
}

const closeNotificationModal = () => {
  showNotificationModal.value = false
  notificationMessage.value = ''
}

const handleLogin = async () => {
  loading.value = true
  
  try {
    const result = await authStore.login(form.value.email, form.value.password)
    
    if (result.success) {
      showNotification('success', result.message)
      
      // Redirect based on user role after a short delay
      setTimeout(() => {
        const userRole = authStore.userProfile?.role
        if (userRole === 'user') {
          router.push('/user')
        } else if (userRole === 'driver') {
          router.push('/driver')
        } else if (userRole === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 1500)
    } else {
      showNotification('error', result.message)
    }
  } catch (error) {
    showNotification('error', 'An error occurred during login')
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  loading.value = true
  
  try {
    const result = await authStore.loginWithGoogle()
    
    if (result.success) {
      showNotification('success', result.message)
      
      // Redirect based on user role after a short delay
      setTimeout(() => {
        const userRole = authStore.userProfile?.role
        if (userRole === 'user') {
          router.push('/user')
        } else if (userRole === 'driver') {
          router.push('/driver')
        } else if (userRole === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 1500)
    } else {
      showNotification('error', result.message)
    }
  } catch (error) {
    showNotification('error', 'An error occurred during Google login')
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
      showNotification('success', result.message)
      showForgotPassword.value = false
      forgotPasswordEmail.value = ''
    } else {
      showNotification('error', result.message)
    }
  } catch (error) {
    showNotification('error', 'An error occurred while sending reset email')
  } finally {
    loading.value = false
  }
}
</script>
