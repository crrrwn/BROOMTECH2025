<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden font-sans">
    
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-[#A8EB12] rounded-full mix-blend-multiply filter blur-[60px] sm:blur-[80px] opacity-70 animate-pulse"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-[#3ED400] rounded-full mix-blend-multiply filter blur-[80px] sm:blur-[100px] opacity-60 animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-[#74E600] rounded-full mix-blend-multiply filter blur-[40px] sm:blur-[60px] opacity-40"></div>

    <div class="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,200,81,0.15)] border border-white/50 p-6 sm:p-10 z-10 transition-all duration-300">
      
      <div class="text-center space-y-4 mb-8">
        <div class="relative inline-block group">
          <div class="absolute inset-0 bg-gradient-to-r from-[#A8EB12] to-[#00C851] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
          <img 
            src="https://scontent.fmnl7-2.fna.fbcdn.net/v/t1.15752-9/514071591_1252432816270252_1243204019946633211_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEne1_QgvnzPimBbfxq_loR-tDfpI8SJXz60N-kjxIlfByb9W5QUiBtwAWWz58nuc7ZAQLaDdcR5XLMXSyYpi5e&_nc_ohc=22TieV_Z_voQ7kNvwEBjgNT&_nc_oc=AdmJoOb5TZPB2UkZ578pEyqjn4tdhSMxb3cDlReTD7jSlZjkBve5-yz6nF0muTBRlD4&_nc_zt=23&_nc_ht=scontent.fmnl7-2.fna&oh=03_Q7cD4AFN1-ZJ3iUsGG3W2txeNI23-eE-tCCECL3b4wKZE1CQAQ&oe=695CED92" 
            alt="BroomTech Logo"
            class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white ring-4 ring-[#74E600]/30 shadow-xl transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div>
          <h2 class="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">Rider Portal</h2>
          <p class="text-sm sm:text-base text-gray-500 font-medium mt-1">Start your engine, start earning.</p>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        
        <div class="space-y-4">
          <div class="group relative">
            <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#00C851] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
              </div>
              <input
                v-model="email"
                type="email"
                required
                class="w-full pl-11 pr-4 py-3 text-base sm:text-sm bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner"
                placeholder="rider@broomtech.com"
              />
            </div>
          </div>

          <div class="group relative">
            <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#00C851] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-11 pr-12 py-3 text-base sm:text-sm bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#00C851] transition-colors focus:outline-none h-full"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between px-1">
          <label class="flex items-center cursor-pointer">
            <input v-model="rememberMe" type="checkbox" class="form-checkbox h-4 w-4 text-[#00C851] rounded border-gray-300 focus:ring-[#74E600] transition duration-150 ease-in-out">
            <span class="ml-2 text-xs sm:text-sm font-medium text-gray-600 select-none">Remember me</span>
          </label>
          <a href="#" class="text-xs sm:text-sm font-bold text-[#00C851] hover:text-[#74E600] transition-colors">Forgot Password?</a>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-[#74E600] to-[#00C851] hover:to-[#009e3f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ED400] shadow-[0_10px_20px_rgba(0,200,81,0.3)] hover:shadow-[0_15px_25px_rgba(0,200,81,0.4)] transform transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span class="flex items-center gap-2">
             Ride & Earn Now
             <svg class="w-5 h-5 text-white animate-bounce-slight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </span>
        </button>

        <div class="mt-6 pt-6 border-t border-gray-100 text-center">
          <p class="text-xs text-gray-500 mb-3">Want to join our fleet?</p>
          <router-link 
            to="/driver/register" 
            class="inline-flex items-center justify-center w-full py-2.5 px-4 border-2 border-dashed border-[#74E600]/50 rounded-2xl text-xs sm:text-sm font-bold text-[#00C851] hover:bg-[#A8EB12]/20 hover:border-[#00C851] transition-all duration-200"
          >
            Apply for Rider Account
          </router-link>
        </div>

        <div class="text-center mt-4">
          <router-link to="/login" class="text-xs sm:text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1 group">
            <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to User Login
          </router-link>
        </div>

      </form>
    </div>

    <Transition name="fade">
      <div v-if="loading && !showWelcomeModal" class="fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-md flex items-center justify-center">
        <div class="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl animate-pulse-slow max-w-xs w-full mx-4">
           <div class="relative w-20 h-20 mb-6">
              <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-[#74E600] rounded-full border-t-transparent animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                 <svg class="w-8 h-8 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
           </div>
           <h3 class="text-lg font-bold text-gray-800">Authenticating...</h3>
           <p class="text-xs text-gray-500 mt-1">Verifying your credentials</p>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showWelcomeModal" class="fixed inset-0 z-[70] bg-gray-900/60 backdrop-blur-md flex items-center justify-center">
        <div class="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl transform transition-all scale-100 max-w-sm w-full mx-4 border border-green-100">
           
           <div class="w-24 h-24 bg-gradient-to-tr from-[#74E600] to-[#A8EB12] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200 animate-bounce-slight">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
           </div>
           
           <h2 class="text-2xl font-black text-gray-800 mb-2 text-center">Welcome Back!</h2>
           <p class="text-lg font-bold text-[#00C851] mb-6 text-center">{{ driverName }}</p>
           
           <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div class="h-full bg-[#74E600] animate-progress"></div>
           </div>
           <p class="text-xs text-gray-400 mt-2">Redirecting to dashboard...</p>

        </div>
      </div>
    </Transition>

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
    
    // States for Modals
    const loading = ref(false)
    const showWelcomeModal = ref(false)
    const driverName = ref('Rider')

    const handleLogin = async () => {
      if (!email.value || !password.value) {
        toast.error('Please fill in all fields')
        return
      }

      // 1. Show Loading Modal
      loading.value = true

      try {
        // Check if a different role is already logged in
        if (authStore.isAuthenticated && authStore.userProfile) {
          const currentRole = authStore.userProfile.role
          if (currentRole !== 'driver') {
            await authStore.logout()
            // toast.info('Please log in with your driver account.') // Optional: Suppress toast if using modal
          }
        }

        // Attempt login
        const result = await authStore.login(email.value, password.value, 'driver')

        if (!result.success) {
          loading.value = false // Hide loading on error
          toast.error(result.message || 'Invalid credentials')
          return
        }

        // Verify Driver Role
        const uid = authStore.user?.uid
        if (uid) {
          const drvSnap = await getDoc(doc(db, 'drivers', uid))
          
          if (drvSnap.exists()) {
            const drv = drvSnap.data()
            
            // Check status
            if (drv.status === 'suspended' || drv.banned) {
               loading.value = false
               toast.error('Your driver account is suspended.')
               await authStore.logout()
               return
            }
            if (!drv.approved) {
               loading.value = false
               toast.info('Your application is pending approval.')
               await authStore.logout()
               return
            }
            
            // --- SUCCESS FLOW ---
            
            // 2. Get Driver Name for Welcome Modal
            const name = drv.firstName || 'Rider';
            driverName.value = name;

            // 3. Switch from Loading Modal to Welcome Modal
            loading.value = false;
            showWelcomeModal.value = true;

            // 4. Wait 2 seconds then Redirect
            setTimeout(() => {
                router.push('/driver')
            }, 2000)
            
            return
          }
        }

        // If not found in drivers or wrong role
        loading.value = false
        toast.error('This account is not a registered driver.')
        await authStore.logout()

      } catch (err) {
        loading.value = false
        console.error('Driver login error:', err)
        toast.error('An error occurred during login')
      }
    }

    return {
      email,
      password,
      showPassword,
      rememberMe,
      loading,
      showWelcomeModal,
      driverName,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* Slight bounce animation for the button icon */
@keyframes bounce-slight {
  0%, 100% { transform: translateY(-10%); }
  50% { transform: translateY(10%); }
}
.animate-bounce-slight {
  animation: bounce-slight 1.5s infinite;
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}
.animate-progress {
  animation: progress 2s ease-out forwards;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>