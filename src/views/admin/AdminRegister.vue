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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-white">
          Create Admin <span class="text-[#74E600]">Account</span>
        </h2>
        <p class="mt-2 text-sm text-slate-400">Administrator registration</p>
        
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
        <form @submit.prevent="handleAdminRegister" class="space-y-6">
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="firstName" class="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">First Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input id="firstName" v-model="form.firstName" type="text" required
                  class="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all duration-300 sm:text-sm"
                  placeholder="John"/>
              </div>
            </div>
            <div class="space-y-2">
              <label for="lastName" class="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input id="lastName" v-model="form.lastName" type="text" required
                  class="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all duration-300 sm:text-sm"
                  placeholder="Doe"/>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Administrator Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input id="email" v-model="form.email" type="email" required
                class="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all duration-300 sm:text-sm"
                placeholder="admin@broomtech.com"/>
            </div>
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required minlength="6"
                class="block w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all duration-300 sm:text-sm"
                placeholder="Enter secure password"/>
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
            <p class="text-xs text-slate-500 ml-1">Password must be at least 6 characters long</p>
          </div>

          <div class="space-y-2">
            <label for="confirmPassword" class="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input id="confirmPassword" v-model="form.confirmPassword" type="password" required
                class="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#74E600] focus:border-transparent transition-all duration-300 sm:text-sm"
                placeholder="Confirm your password"/>
            </div>
          </div>

          <div class="flex items-center">
            <input id="terms" v-model="form.acceptTerms" type="checkbox"
              class="h-4 w-4 text-[#74E600] focus:ring-[#74E600] bg-slate-900 border-slate-600 rounded transition duration-200"/>
            <label for="terms" class="ml-2 block text-sm text-slate-300 select-none cursor-pointer">
              I accept the responsibility of system administration
            </label>
          </div>

          <div>
            <button type="submit" :disabled="loading || !isFormValid"
              class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-gradient-to-r from-[#74E600] to-[#3ED400] hover:to-[#74E600] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-[#74E600] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#74E600]/20 hover:shadow-[#74E600]/40 transform hover:-translate-y-0.5">
              
              <span class="flex items-center gap-2">
                {{ loading ? 'Creating Admin Account...' : 'Create Administrator Account' }}
                <svg v-if="!loading" class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <svg v-else class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </button>
          </div>

          <div class="text-center pt-2">
            <router-link to="/admin/login" class="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1 group">
              <span class="group-hover:-translate-x-1 transition-transform">←</span> Already have an admin account? Sign in
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="loading" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
        <div class="flex flex-col items-center p-6 bg-slate-800/40 rounded-3xl border border-[#74E600]/20 shadow-2xl">
           <div class="relative w-24 h-24 mb-4">
             <div class="absolute inset-0 rounded-full border-2 border-[#74E600]/30 animate-ping opacity-75"></div>
             <div class="absolute inset-0 rounded-full border-4 border-t-[#74E600] border-r-transparent border-b-[#74E600] border-l-transparent animate-spin"></div>
             <div class="absolute inset-4 rounded-full bg-[#74E600]/10 blur-sm animate-pulse"></div>
           </div>
           
           <h3 class="text-xl font-bold text-white tracking-widest animate-pulse">CREATING ACCOUNT</h3>
           <p class="text-xs text-[#74E600] mt-2 uppercase tracking-wide">Processing Registration</p>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const loading = ref(false)
const showPassword = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.firstName &&
    form.value.lastName &&
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.password === form.value.confirmPassword &&
    form.value.password.length >= 6 &&
    form.value.acceptTerms
  )
})

const handleAdminRegister = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields correctly')
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }

  loading.value = true
  
  try {
    const result = await authStore.registerAdmin({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password
    })
    
    if (result.success) {
      toast.success(result.message)
      router.push('/admin/login')
    } else {
      toast.error(result.message)
    }
  } catch (error) {
    console.error('Admin registration error:', error)
    toast.error('An error occurred during admin registration')
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
