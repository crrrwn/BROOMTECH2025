<template>
  <div class="min-h-screen relative flex items-center justify-center py-4 sm:py-5 md:py-6 px-3 sm:px-4 md:px-5 lg:px-6 bg-gradient-to-br from-[#A8EB12]/20 via-[#74E600]/15 to-[#3ED400]/25 overflow-hidden font-sans">
    
    <!-- Enhanced Animated Background Blobs -->
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-[#A8EB12] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-pulse"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-[#3ED400] rounded-full mix-blend-multiply filter blur-[90px] opacity-50 animate-pulse" style="animation-delay: 1s;"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-[#74E600] rounded-full mix-blend-multiply filter blur-[70px] opacity-45 animate-pulse" style="animation-delay: 0.5s;"></div>
    <div class="absolute top-1/4 right-1/4 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-[#00C851] rounded-full mix-blend-multiply filter blur-[70px] opacity-35 animate-pulse" style="animation-delay: 1.5s;"></div>

    <!-- Enhanced Login Card -->
    <div class="relative w-full max-w-[320px] sm:max-w-sm md:max-w-md bg-white/95 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] border border-white/80 p-5 sm:p-6 md:p-7 z-10 transition-all duration-300 hover:shadow-[0_35px_70px_rgba(62,212,0,0.25)] hover:scale-[1.01]">
      
      <div class="text-center space-y-4 sm:space-y-5">
        <div class="flex justify-center relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-[#3ED400] to-[#00C851] rounded-full blur-xl opacity-25 animate-pulse"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-[#74E600] to-[#A8EB12] rounded-full blur-lg opacity-15 animate-pulse" style="animation-delay: 0.3s;"></div>
          
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[4px] sm:border-[5px] border-white shadow-2xl overflow-hidden bg-white transform group-hover:scale-105 transition-all duration-500 p-1.5 sm:p-2">
             <img 
              src="/LOGO.jpg" 
              alt="BROOOOM Delivery Services Logo"
              class="w-full h-full object-cover rounded-full"
              @error="handleImageError"
            />
          </div>
        </div>

        <div class="space-y-1.5">
           <h2 class="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent tracking-tight">Welcome Back!</h2>
           <p class="text-xs sm:text-sm text-gray-600 font-medium">
             Login to continue.
           </p>
        </div>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
        <div class="space-y-4 sm:space-y-5">
          
          <div class="group relative">
            <label for="email" class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Email Address</label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#3ED400] focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300"
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          <div class="group relative">
            <label for="password" class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Password</label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="w-full pl-10 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#3ED400] focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300"
                placeholder="Enter password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-0 pr-3 sm:pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#00C851] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C851]/30 rounded-lg p-1"
              >
                <svg v-if="showPassword" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 sm:px-2">
          <div class="flex items-center group/checkbox">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-[#3ED400] focus:ring-2 focus:ring-[#3ED400]/50 border-2 border-gray-300 rounded-md cursor-pointer transition-all duration-200 checked:bg-[#3ED400] checked:border-[#3ED400] hover:border-[#3ED400]"
            />
            <label for="remember-me" class="ml-2 block text-xs font-semibold text-gray-700 cursor-pointer select-none transition-colors group-hover/checkbox:text-[#3ED400]">
              Remember me
            </label>
          </div>

          <button
            type="button"
            @click="showForgotPassword = true"
            class="text-xs font-bold text-[#00C851] hover:text-[#3ED400] hover:underline transition-all duration-200 active:scale-95"
          >
            Forgot password?
          </button>
        </div>

        <div class="pt-1">
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-black tracking-wide rounded-xl text-white bg-gradient-to-r from-[#3ED400] via-[#74E600] to-[#00C851] hover:from-[#74E600] hover:via-[#3ED400] hover:to-[#00C851] focus:outline-none focus:ring-4 focus:ring-[#3ED400]/40 shadow-[0_8px_20px_rgba(62,212,0,0.35)] hover:shadow-[0_12px_30px_rgba(62,212,0,0.5)] transform transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-[0_8px_20px_rgba(62,212,0,0.35)] overflow-hidden"
          >
            <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-4">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span class="relative z-10">{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </div>

        <div class="mt-4 sm:mt-5">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-xs uppercase tracking-wider">
               </div>
          </div>

          <div class="mt-4">
            <p class="text-center text-xs sm:text-sm text-gray-600 font-medium">
                Don't have an account? 
                <router-link to="/register" class="text-[#00C851] font-bold hover:text-[#3ED400] hover:underline transition-all duration-200 inline-flex items-center gap-1">
                  Register Here
                  <svg class="w-3 h-3 inline-block transition-transform duration-200 hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </router-link>
            </p>
          </div>
        </div>
      </form>

      <transition 
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 scale-95 blur-sm"
        enter-to-class="opacity-100 scale-100 blur-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 scale-100 blur-0"
        leave-to-class="opacity-0 scale-95 blur-sm"
      >
        <div v-if="showForgotPassword" class="fixed inset-0 bg-gray-900/70 backdrop-blur-lg overflow-y-auto h-full w-full z-50 flex items-center justify-center p-3 sm:p-4" @click.self="showForgotPassword = false">
          <div class="relative p-6 sm:p-8 md:p-10 w-full max-w-md shadow-2xl rounded-2xl sm:rounded-[2rem] bg-white border border-gray-100 text-center transform transition-all duration-300">
            
            <!-- Enhanced Icon -->
            <div class="relative mx-auto mb-6">
              <div class="absolute inset-0 bg-gradient-to-br from-[#3ED400] to-[#00C851] rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#3ED400] via-[#74E600] to-[#00C851] rounded-full flex items-center justify-center shadow-xl shadow-green-200/50">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 12 10 10.464 8.536 12 5 8.464 3 10.464V20H15a6 6 0 014-9.83"></path></svg>
              </div>
            </div>
            
            <h3 class="text-xl sm:text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-2">Reset Password</h3>
            <p class="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">Enter your registered email address and we'll send you a link to reset your password.</p>
            
            <form @submit.prevent="handleForgotPassword" class="space-y-5 sm:space-y-6">
              <div class="relative group">
                <div class="absolute left-0 pl-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-colors duration-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                </div>
                <input
                  v-model="forgotPasswordEmail"
                  type="email"
                  required
                  class="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-[#3ED400] focus:ring-4 focus:ring-[#3ED400]/20 transition-all text-sm sm:text-base font-medium bg-gradient-to-br from-gray-50/80 to-white hover:border-gray-300"
                  placeholder="Enter your email"
                />
              </div>
              <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  @click="showForgotPassword = false"
                  class="px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base text-gray-700 font-bold hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all duration-200 active:scale-95 border-2 border-gray-200 hover:border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-[#3ED400] via-[#74E600] to-[#00C851] text-white text-sm sm:text-base font-bold rounded-xl hover:shadow-xl hover:shadow-green-200/50 transition-all disabled:opacity-50 transform hover:-translate-y-0.5 active:scale-95 disabled:transform-none relative overflow-hidden group"
                >
                  <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span class="relative z-10">{{ loading ? 'Sending...' : 'Send Link' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>

    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 scale-95 blur-sm"
      enter-to-class="opacity-100 translate-y-0 scale-100 blur-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 scale-100 blur-0"
      leave-to-class="opacity-0 translate-y-4 scale-95 blur-sm"
    >
      <div v-if="showNotificationModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[70] p-3 sm:p-4" @click="closeNotificationModal">
        <div class="bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl max-w-xs sm:max-w-sm w-full p-6 sm:p-8 pt-12 sm:pt-14 relative overflow-visible" @click.stop>
          
          <!-- Enhanced Icon with Animation -->
          <div :class="[
            'absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transform transition-all duration-300 hover:rotate-6 hover:scale-110',
            notificationType === 'success' ? 'bg-gradient-to-br from-[#3ED400] via-[#74E600] to-[#00C851] text-white shadow-green-300/50' : 
            notificationType === 'error' ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-300/50' : 
            'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-300/50'
          ]">
            <div class="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-3xl animate-pulse"></div>
            <svg v-if="notificationType === 'success'" class="w-10 h-10 sm:w-12 sm:h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else-if="notificationType === 'error'" class="w-10 h-10 sm:w-12 sm:h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            <svg v-else class="w-10 h-10 sm:w-12 sm:h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          
          <div class="flex flex-col items-center text-center mt-2 sm:mt-4">
            <h3 :class="[
              'text-xl sm:text-2xl font-black mb-2 sm:mb-3',
              notificationType === 'success' ? 'bg-gradient-to-r from-[#3ED400] to-[#00C851] bg-clip-text text-transparent' : 
              notificationType === 'error' ? 'text-red-600' : 
              'text-blue-600'
            ]">
              {{ notificationType === 'success' ? 'Great!' : notificationType === 'error' ? 'Oops!' : 'Notice' }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 font-medium leading-relaxed px-2">{{ notificationMessage }}</p>
            
            <button
              @click="closeNotificationModal"
              :class="[
                'w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group',
                notificationType === 'success' ? 'bg-gradient-to-r from-[#3ED400] via-[#74E600] to-[#00C851] hover:from-[#74E600] hover:via-[#3ED400] hover:to-[#00C851] shadow-green-300/50' : 
                notificationType === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-300/50' : 
                'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-300/50'
              ]"
            >
              <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span class="relative z-10">Continue</span>
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
  // Prevent multiple clicks while loading
  if (loading.value) return
  
  // Set loading state immediately when button is clicked
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
        loading.value = false
      } else {
        // User has face registered - show face verification
        const descriptor = await authStore.getFaceDescriptor(authStore.user.uid)
        if (descriptor) {
          registeredFaceDescriptor.value = descriptor
          pendingLoginSuccess.value = true
          showFaceVerification.value = true
          loading.value = false
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
    // Always reset loading state if not showing modals
    if (!showFaceRegistration.value && !showFaceVerification.value) {
      loading.value = false
    }
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

/* Enhanced Responsive Design */
@media (max-width: 640px) {
  /* Ensure smooth scrolling on mobile */
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Better touch targets on mobile */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Smooth transitions for all interactive elements */
input, button, a {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent layout shift on load */
img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Better focus visibility for accessibility */
*:focus-visible {
  outline: 2px solid #3ED400;
  outline-offset: 2px;
}
</style>