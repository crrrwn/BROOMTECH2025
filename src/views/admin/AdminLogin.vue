<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 font-poppins relative overflow-hidden">
    
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#74E600] opacity-5 blur-[120px]"></div>
      <div class="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#00C851] opacity-5 blur-[100px]"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10 animate-fade-in-up">
      
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#A8EB12] to-[#3ED400] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative w-20 h-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg class="w-10 h-10 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-white">
          Admin <span class="text-[#74E600]">Portal</span>
        </h2>
        <p class="mt-2 text-sm text-slate-400">Secure access point for administrators</p>
        
        <div class="mt-6 p-3 bg-[#74E600]/10 border border-[#74E600]/20 rounded-lg backdrop-blur-sm">
          <div class="flex items-center justify-center gap-2 text-[#A8EB12] text-xs font-medium uppercase tracking-wider">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Authorized Personnel Only
          </div>
        </div>
      </div>

      <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleAdminLogin" class="space-y-6">
          
          <div class="space-y-2">
            <label for="admin-email" class="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Admin Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input id="admin-email" v-model="form.email" type="email" required
                class="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all duration-300 sm:text-sm"
                placeholder="admin@broomtech.com"/>
            </div>
          </div>

          <div class="space-y-2">
            <label for="admin-password" class="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input id="admin-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="block w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all duration-300 sm:text-sm"
                placeholder="••••••••"/>
              <button type="button" @click="showPassword = !showPassword" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-[#74E600] transition-colors cursor-pointer">
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="admin-remember" v-model="form.rememberMe" type="checkbox"
                class="h-4 w-4 text-[#74E600] focus:ring-[#74E600] bg-slate-900 border-slate-600 rounded transition duration-200"/>
              <label for="admin-remember" class="ml-2 block text-sm text-slate-300 select-none cursor-pointer">Keep me signed in</label>
            </div>

            <button type="button" @click="showForgotPassword = true" 
              class="text-sm font-medium text-[#74E600] hover:text-[#A8EB12] transition-colors focus:outline-none">
              Forgot password?
            </button>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-gradient-to-r from-[#74E600] to-[#3ED400] hover:to-[#74E600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-[#74E600] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#74E600]/20 hover:shadow-[#74E600]/40 transform hover:-translate-y-0.5">
              
              <span class="flex items-center gap-2">
                Access Admin Portal
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          <div class="text-center pt-2">
            <router-link to="/login" class="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1 group">
              <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to regular login
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showForgotPassword" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="showForgotPassword = false"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-700">
            <div class="bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#74E600]/10 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-1 1-2-2-2 2-2-2-2 2-2-2-2 2-2-2 1-1 1-1 1-1 1-1 1-1 1-1 6-6 4 4 0 010-5.656z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-white font-poppins" id="modal-title">Reset Admin Credentials</h3>
                  <div class="mt-2">
                    <p class="text-sm text-slate-400">
                      Enter your administrator email address. We'll send you a secure link to reset your access.
                    </p>
                    <div class="mt-4">
                      <input v-model="forgotPasswordEmail" type="email" required
                        class="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all sm:text-sm"
                        placeholder="admin@broomtech.com"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-700">
              <button type="button" @click="handleForgotPassword" :disabled="loading" 
                class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-[#74E600] text-base font-medium text-slate-900 hover:bg-[#3ED400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-[#74E600] sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </button>
              <button type="button" @click="showForgotPassword = false" 
                class="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-600 shadow-sm px-4 py-2 bg-transparent text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="loading" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
        <div class="flex flex-col items-center p-6 bg-slate-800/40 rounded-3xl border border-[#74E600]/20 shadow-2xl">
           <div class="relative w-24 h-24 mb-4">
             <div class="absolute inset-0 rounded-full border-2 border-[#74E600]/30 animate-ping opacity-75"></div>
             <div class="absolute inset-0 rounded-full border-4 border-t-[#74E600] border-r-transparent border-b-[#74E600] border-l-transparent animate-spin"></div>
             <div class="absolute inset-4 rounded-full bg-[#74E600]/10 blur-sm animate-pulse"></div>
           </div>
           
           <h3 class="text-xl font-bold text-white tracking-widest animate-pulse">AUTHENTICATING</h3>
           <p class="text-xs text-[#74E600] mt-2 uppercase tracking-wide">Secure Link Established</p>
        </div>
      </div>
    </Transition>

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
  // Simulating delay so the user can see the cool loading effect
  await new Promise(r => setTimeout(r, 1500)) 
  
  try {
    const result = await authStore.loginAdmin(form.value.email, form.value.password)
    if (result.success) {
      toast.success('Welcome back, Administrator')
      
      // FIX HERE: Reset the dashboard welcome state
      // This ensures the welcome modal appears again when entering the dashboard
      sessionStorage.removeItem('admin_welcome_shown')
      
      router.push('/admin')
    } else {
      toast.error(result.message || 'Access Denied: Invalid Credentials')
    }
  } catch (e) {
    toast.error('System Error: Unable to verify admin status')
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
      toast.success('Reset instructions sent to secure email')
      showForgotPassword.value = false
      forgotPasswordEmail.value = ''
    } else {
      toast.error(result.message)
    }
  } catch (e) {
    toast.error('Error contacting authentication server')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Import Poppins Font (If not globally imported) */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s ease-out;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.95) translateY(10px);
}

/* Fade Animation for Loading Overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Entry Animation for Card */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>