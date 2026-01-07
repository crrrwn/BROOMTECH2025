<template>
  <div class="min-h-screen relative flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden font-sans">
    
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#A8EB12] rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-80 h-80 bg-[#3ED400] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#74E600] rounded-full mix-blend-multiply filter blur-[60px] opacity-40"></div>

    <div class="relative w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 p-8 z-10 transition-all duration-500 hover:shadow-[0_40px_70px_rgba(0,0,0,0.15)]">
      
      <div class="text-center space-y-4">
        <div class="flex justify-center relative group">
          <div class="absolute inset-0 bg-[#3ED400] rounded-full blur-lg opacity-20 animate-pulse"></div>
          
          <div class="relative w-24 h-24 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white transform group-hover:rotate-6 transition-transform duration-500">
             <img 
              src="https://placehold.co/150x150/3ED400/ffffff?text=B" 
              alt="BroomTech Logo"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
        </div>

        <div>
           <h2 class="text-3xl font-black text-gray-800 tracking-tight">Welcome Back!</h2>
           <p class="text-sm text-gray-500 font-medium mt-1">
             Ready to ride? Login to continue.
           </p>
        </div>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-5">
        <div class="space-y-4">
          
          <div class="group relative">
            <label for="email" class="ml-4 block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-[#3ED400]">Email Address</label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-colors duration-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="w-full pl-11 pr-4 py-3.5 text-sm bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#3ED400] focus:ring-4 focus:ring-[#3ED400]/10 transition-all duration-300 shadow-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          <div class="group relative">
            <label for="password" class="ml-4 block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 transition-colors group-focus-within:text-[#3ED400]">Password</label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-colors duration-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="w-full pl-11 pr-12 py-3.5 text-sm bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#3ED400] focus:ring-4 focus:ring-[#3ED400]/10 transition-all duration-300 shadow-sm"
                placeholder="Enter password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#00C851] transition-colors focus:outline-none"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between px-2">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-[#3ED400] focus:ring-[#3ED400] border-gray-300 rounded cursor-pointer transition-colors"
            />
            <label for="remember-me" class="ml-2.5 block text-xs font-medium text-gray-600 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <button
            type="button"
            @click="showForgotPassword = true"
            class="text-xs font-bold text-[#00C851] hover:text-[#3ED400] hover:underline transition-all"
          >
            Forgot password?
          </button>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black tracking-wide rounded-2xl text-white bg-gradient-to-r from-[#3ED400] to-[#00C851] hover:to-[#009e3f] focus:outline-none focus:ring-4 focus:ring-[#3ED400]/30 shadow-[0_10px_25px_rgba(62,212,0,0.4)] hover:shadow-[0_20px_35px_rgba(62,212,0,0.5)] transform transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-4">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-xs uppercase tracking-wider">
               </div>
          </div>

          <div class="mt-5">
            <p class="text-center text-xs text-gray-500">
                Don't have an account? 
                <router-link to="/register" class="text-[#00C851] font-bold hover:underline">Register Here</router-link>
            </p>
          </div>
        </div>
      </form>

      <transition 
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 scale-90 blur-sm"
        enter-to-class="opacity-100 scale-100 blur-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 scale-100 blur-0"
        leave-to-class="opacity-0 scale-90 blur-sm"
      >
        <div v-if="showForgotPassword" class="fixed inset-0 bg-gray-900/60 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div class="relative p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2rem] bg-white border border-gray-100 text-center">
            
            <div class="w-16 h-16 bg-gradient-to-tr from-[#3ED400] to-[#A8EB12] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200">
               <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 12 10 10.464 8.536 12 5 8.464 3 10.464V20H15a6 6 0 014-9.83"></path></svg>
            </div>
            
            <h3 class="text-xl font-black text-gray-800 mb-2">Reset Password</h3>
            <p class="text-sm text-gray-500 mb-6 leading-relaxed">Enter your registered email address and we'll send you a link to reset your password.</p>
            
            <form @submit.prevent="handleForgotPassword">
              <div class="mb-6 relative group">
                <input
                  v-model="forgotPasswordEmail"
                  type="email"
                  required
                  class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3ED400] focus:ring-4 focus:ring-[#3ED400]/10 transition-all text-center text-sm font-medium"
                  placeholder="Enter your email"
                />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="showForgotPassword = false"
                  class="px-4 py-3 text-sm text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-3 bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>

    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div v-if="showNotificationModal" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4" @click="closeNotificationModal">
        <div class="bg-white rounded-[2rem] shadow-2xl max-w-xs w-full p-6 pt-10 relative overflow-visible mt-10" @click.stop>
          
          <div :class="[
            'absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg rotate-3 transform transition-transform hover:rotate-6',
            notificationType === 'success' ? 'bg-gradient-to-br from-[#3ED400] to-[#00C851] text-white' : 
            notificationType === 'error' ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 
            'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
          ]">
            <svg v-if="notificationType === 'success'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else-if="notificationType === 'error'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          
          <div class="flex flex-col items-center text-center mt-4">
            <h3 class="text-xl font-black text-gray-800 mb-2">
              {{ notificationType === 'success' ? 'Great!' : notificationType === 'error' ? 'Oops!' : 'Notice' }}
            </h3>
            <p class="text-sm text-gray-500 mb-8 font-medium leading-relaxed px-2">{{ notificationMessage }}</p>
            
            <button
              @click="closeNotificationModal"
              :class="[
                'w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 transform hover:scale-105 shadow-md active:scale-95',
                notificationType === 'success' ? 'bg-[#3ED400] hover:bg-[#00C851] shadow-green-200' : 
                notificationType === 'error' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 
                'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
              ]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </transition>

    <FaceRegistration
      v-if="showFaceRegistration"
      @registered="handleFaceRegistered"
      @failed="handleFaceRegistrationFailed"
      @cancel="handleFaceRegistrationCancel"
    />

    <ValidIdUpload
      v-if="showValidIdUpload"
      @uploaded="handleValidIdUploaded"
      @cancel="handleValidIdCancel"
    />

    <FaceVerification
      v-if="showFaceVerification"
      :registered-descriptor="registeredFaceDescriptor"
      @verified="handleFaceVerified"
      @failed="handleFaceVerificationFailed"
      @cancel="handleFaceVerificationCancel"
      @signout="handleFaceVerificationSignout"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FaceRegistration from '@/components/FaceRegistration.vue'
import FaceVerification from '@/components/FaceVerification.vue'
import ValidIdUpload from '@/components/ValidIdUpload.vue'

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

// Face recognition state
const showFaceRegistration = ref(false)
const showFaceVerification = ref(false)
const registeredFaceDescriptor = ref(null)
const pendingLoginSuccess = ref(false)
const showValidIdUpload = ref(false)
const capturedFaceImage = ref(null)

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
    // Check if a different role is already logged in
    if (authStore.isAuthenticated && authStore.userProfile) {
      const currentRole = authStore.userProfile.role
      if (currentRole !== 'user') {
        // Force logout if different role is logged in
        await authStore.logout()
        showNotification('info', 'Please log in with your user account.')
        loading.value = false
        return
      }
    }
    
    // Login with expected role = 'user'
    const result = await authStore.login(form.value.email, form.value.password, 'user')
    
    if (result.success) {
      // Check if user has face registered
      await authStore.refreshAndGetProfile()
      const hasFace = authStore.hasFaceRegistered()
      
      if (!hasFace) {
        // First time login - show face registration
        pendingLoginSuccess.value = true
        showFaceRegistration.value = true
      } else {
        // User has face registered - show face verification
        const descriptor = await authStore.getFaceDescriptor(authStore.user.uid)
        if (descriptor) {
          registeredFaceDescriptor.value = descriptor
          pendingLoginSuccess.value = true
          showFaceVerification.value = true
        } else {
          // Fallback if descriptor not found
          showNotification('success', result.message)
          setTimeout(() => {
            router.push('/user')
          }, 1500)
        }
      }
    } else {
      showNotification('error', result.message)
    }
  } catch (error) {
    showNotification('error', 'An error occurred during login')
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

// Face Registration Handlers
const handleFaceRegistered = async (data) => {
  try {
    // data can be either descriptor (old format) or { descriptor, faceImage } (new format)
    const descriptor = data.descriptor || data
    const faceImage = data.faceImage || null
    
    const result = await authStore.saveFaceDescriptor(authStore.user.uid, descriptor, faceImage)
    
    if (result.success) {
      // Reset registration attempts on success
      await authStore.resetFaceAttempts(authStore.user.uid, 'registration')
      showFaceRegistration.value = false
      
      // Store face image for later use
      if (faceImage) {
        capturedFaceImage.value = faceImage
      }
      
      // Show valid ID upload after face registration
      showValidIdUpload.value = true
    } else {
      // Registration failed - trigger failed handler to track attempts
      await handleFaceRegistrationFailed(0) // 0 means this is a save failure, not an attempt limit
      showNotification('error', result.message || 'Failed to register face. Please try again.')
    }
  } catch (error) {
    // Registration failed - trigger failed handler to track attempts
    await handleFaceRegistrationFailed(0)
    showNotification('error', 'An error occurred during face registration')
  }
}

// Valid ID Upload Handlers
const handleValidIdUploaded = async (validIdUrl) => {
  try {
    const result = await authStore.saveValidId(authStore.user.uid, validIdUrl)
    
    if (result.success) {
      showValidIdUpload.value = false
      showNotification('success', 'Valid ID uploaded successfully!')
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/user')
      }, 1500)
    } else {
      showNotification('error', result.message || 'Failed to save valid ID. Please try again.')
    }
  } catch (error) {
    showNotification('error', 'An error occurred while saving valid ID')
  }
}

const handleValidIdCancel = () => {
  // User must upload ID - don't allow skipping
  showNotification('warning', 'Please upload your valid ID to complete registration.')
}

const handleFaceRegistrationFailed = async (attempts) => {
  try {
    // Increment attempts
    const result = await authStore.incrementFaceAttempts(authStore.user.uid, 'registration')
    
    if (result.success) {
      const totalAttempts = result.totalAttempts || 0
      
      // Check if total attempts reached 5 - auto-ban
      if (totalAttempts >= 5) {
        showFaceRegistration.value = false
        const banResult = await authStore.banUser(
          authStore.user.uid, 
          'Account banned due to 5 failed face recognition attempts'
        )
        showNotification('error', 'Your account has been banned due to multiple face recognition failures. Please contact support.')
        return
      }
      
      // If 3 attempts reached, check if this is the second time (after cooldown)
      if (attempts >= 3) {
        const attemptsData = await authStore.getFaceAttempts(authStore.user.uid)
        const registrationAttempts = attemptsData?.registrationAttempts || 0
        
        // If registration attempts >= 3 again (after cooldown), auto-logout
        if (registrationAttempts >= 3) {
          showFaceRegistration.value = false
          await authStore.logout()
          showNotification('error', 'Face registration failed after multiple attempts. Please log in again.')
          return
        }
      }
    }
  } catch (error) {
    console.error('Error handling registration failure:', error)
  }
}

const handleFaceRegistrationCancel = async () => {
  showFaceRegistration.value = false
  // Logout user if they cancel face registration
  await authStore.logout()
  showNotification('warning', 'Face registration is required. Please log in again to complete registration.')
}

// Face Verification Handlers
const handleFaceVerified = async () => {
  try {
    // Reset verification attempts on success
    await authStore.resetFaceAttempts(authStore.user.uid, 'verification')
    showFaceVerification.value = false
    showNotification('success', 'Face verified successfully!')
    
    // Redirect to dashboard
    setTimeout(() => {
      router.push('/user')
    }, 1500)
  } catch (error) {
    console.error('Error resetting verification attempts:', error)
    showFaceVerification.value = false
    showNotification('success', 'Face verified successfully!')
    setTimeout(() => {
      router.push('/user')
    }, 1500)
  }
}

const handleFaceVerificationFailed = async (attempts) => {
  try {
    // Increment attempts
    const result = await authStore.incrementFaceAttempts(authStore.user.uid, 'verification')
    
    if (result.success) {
      const totalAttempts = result.totalAttempts || 0
      
      // Check if total attempts reached 5 - auto-ban
      if (totalAttempts >= 5) {
        showFaceVerification.value = false
        const banResult = await authStore.banUser(
          authStore.user.uid, 
          'Account banned due to 5 failed face recognition attempts'
        )
        showNotification('error', 'Your account has been banned due to multiple face recognition failures. Please contact support.')
        return
      }
      
      // If 3 attempts reached, check if this is the second time (after cooldown)
      if (attempts >= 3) {
        const attemptsData = await authStore.getFaceAttempts(authStore.user.uid)
        const verificationAttempts = attemptsData?.verificationAttempts || 0
        
        // If verification attempts >= 3 again (after cooldown), auto-logout
        if (verificationAttempts >= 3) {
          showFaceVerification.value = false
          await authStore.logout()
          showNotification('error', 'Face verification failed after multiple attempts. Access denied. Please log in again.')
          return
        }
      }
    }
  } catch (error) {
    console.error('Error handling verification failure:', error)
    // Fallback: logout on failure
    showFaceVerification.value = false
    await authStore.logout()
    showNotification('error', 'Face verification failed. Access denied. Please log in again.')
  }
}

const handleImageError = (event) => {
  // Hide image on error (403, etc.)
  event.target.style.display = 'none'
}

const handleFaceVerificationCancel = async () => {
  showFaceVerification.value = false
  // Logout user if they cancel face verification
  await authStore.logout()
  showNotification('warning', 'Face verification is required. Please log in again.')
}

const handleFaceVerificationSignout = async () => {
  // Sign out user immediately when face doesn't match - BLOCK LOGIN
  showFaceVerification.value = false
  // Ensure user is logged out completely
  await authStore.logout()
  showNotification('error', 'Face verification failed. Face does not match registered face. Access denied. Please log in again.')
}
</script>

<style scoped>
/* Progress Bar Animation */
@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}
.animate-progress {
  animation: progress 2s linear forwards;
}

/* Modal Bounce In */
.bounce-in-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>