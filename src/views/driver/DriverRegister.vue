<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden font-sans">
    
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A8EB12] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-pulse"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-[#3ED400] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#74E600] rounded-full mix-blend-multiply filter blur-[60px] opacity-40"></div>

    <div class="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,200,81,0.15)] border border-white/50 p-6 sm:p-10 z-10 transition-all duration-300">
      
      <div class="text-center space-y-4 mb-10">
        <div class="relative inline-block group">
          <div class="absolute inset-0 bg-gradient-to-r from-[#A8EB12] to-[#00C851] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
          <img 
            src="https://scontent.fmnl7-2.fna.fbcdn.net/v/t1.15752-9/514071591_1252432816270252_1243204019946633211_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEne1_QgvnzPimBbfxq_loR-tDfpI8SJXz60N-kjxIlfByb9W5QUiBtwAWWz58nuc7ZAQLaDdcR5XLMXSyYpi5e&_nc_ohc=22TieV_Z_voQ7kNvwEBjgNT&_nc_oc=AdmJoOb5TZPB2UkZ578pEyqjn4tdhSMxb3cDlReTD7jSlZjkBve5-yz6nF0muTBRlD4&_nc_zt=23&_nc_ht=scontent.fmnl7-2.fna&oh=03_Q7cD4AFN1-ZJ3iUsGG3W2txeNI23-eE-tCCECL3b4wKZE1CQAQ&oe=695CED92" 
            alt="BroomTech Logo"
            class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white ring-4 ring-[#74E600]/30 shadow-xl transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div>
          <h2 class="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight">Join the Fleet</h2>
          <p class="text-sm sm:text-base text-gray-500 font-medium mt-1">Register today and start earning on your terms.</p>
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-8">
        
        <div class="space-y-6">
          <div class="flex items-center gap-3 pb-2 border-b border-gray-100">
             <div class="p-2 bg-[#A8EB12]/20 rounded-xl text-[#00C851]">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </div>
             <h3 class="text-xl font-extrabold text-gray-800">Personal Information</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="group relative">
              <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
              <div class="relative flex items-center">
                <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#00C851] transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <input v-model="formData.fullName" type="text" required class="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="Juan Dela Cruz" />
              </div>
            </div>

            <div class="group relative">
              <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contact Number</label>
              <div class="relative flex items-center">
                <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#00C851] transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
                <input v-model="formData.contact" type="tel" required class="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="0912 345 6789" />
              </div>
            </div>

            <div class="group relative md:col-span-2">
              <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
              <div class="relative flex items-center">
                <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#00C851] transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg></div>
                <input v-model="formData.email" type="email" required class="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="rider@broomtech.com" />
              </div>
            </div>

            <div class="group relative md:col-span-2">
              <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
              <div class="relative flex items-center">
                <div class="absolute left-0 pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#00C851] transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
                <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" required class="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="••••••••" />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#00C851] transition-colors focus:outline-none h-full">
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-3 pb-2 border-b border-gray-100 mt-2">
             <div class="p-2 bg-[#A8EB12]/20 rounded-xl text-[#00C851]">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
             <h3 class="text-xl font-extrabold text-gray-800">Vehicle Information</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div class="group relative">
               <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Brand</label>
               <input v-model="formData.motorcycleInfo.brand" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="e.g. Honda" />
             </div>
             <div class="group relative">
               <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Model</label>
               <input v-model="formData.motorcycleInfo.model" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="e.g. Click 150i" />
             </div>
             <div class="group relative">
               <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Plate Number</label>
               <input v-model="formData.motorcycleInfo.plateNumber" type="text" required class="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="ABC 123" />
             </div>
             <div class="group relative">
               <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Year</label>
               <input v-model="formData.motorcycleInfo.year" type="number" required class="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner" placeholder="2024" />
             </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
           <div class="group relative">
              <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Experience</label>
              <select v-model="formData.experience" class="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner">
                 <option value="">Select years</option>
                 <option value="1-2">1-2 years</option>
                 <option value="3-5">3-5 years</option>
                 <option value="6-10">6-10 years</option>
                 <option value="10+">10+ years</option>
              </select>
           </div>
           <div class="group relative">
              <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Availability</label>
              <select v-model="formData.availability" class="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 focus:outline-none focus:bg-white focus:border-[#74E600] focus:ring-4 focus:ring-[#74E600]/20 transition-all duration-300 shadow-inner">
                 <option value="">Select type</option>
                 <option value="full-time">Full Time</option>
                 <option value="part-time">Part Time</option>
                 <option value="weekends">Weekends Only</option>
              </select>
           </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-3 pb-2 border-b border-gray-100 mt-2">
             <div class="p-2 bg-[#A8EB12]/20 rounded-xl text-[#00C851]">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             </div>
             <h3 class="text-xl font-extrabold text-gray-800">Requirements</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(label, key) in {license: 'Driver\'s License', orcr: 'OR/CR', selfie: 'Selfie w/ License', profilePicture: 'Profile Picture'}" :key="key">
               <label class="ml-3 block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{{ label }}</label>
               <div class="relative border-2 border-dashed border-[#74E600]/40 rounded-2xl hover:bg-[#A8EB12]/10 transition-all group h-28 flex items-center justify-center cursor-pointer bg-gray-50/50">
                  <input type="file" :id="key" accept="image/*,.pdf" required @change="handleFileUpload($event, key)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div class="text-center" v-if="!formData.documents[key]">
                     <div class="bg-white p-2 rounded-full inline-block shadow-sm mb-1">
                        <svg class="h-6 w-6 text-[#00C851] group-hover:scale-110 transition-transform" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
                     </div>
                     <p class="text-xs text-gray-500 font-medium">Tap to upload</p>
                  </div>
                  <div v-else class="flex flex-col items-center text-[#00C851]">
                     <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     <span class="text-xs font-bold truncate max-w-[150px] px-2">{{ formData.documents[key].name }}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div class="pt-4">
           <div class="flex items-start mb-6 px-1">
              <div class="flex items-center h-5">
                <input id="terms" v-model="formData.acceptTerms" type="checkbox" required class="w-5 h-5 text-[#00C851] border-gray-300 rounded focus:ring-[#74E600] cursor-pointer transition duration-150" />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-gray-600">I accept the <a href="#" class="text-[#00C851] hover:text-[#74E600] font-bold">Terms of Service</a> and <a href="#" class="text-[#00C851] hover:text-[#74E600] font-bold">Privacy Policy</a></label>
              </div>
           </div>

           <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-wider rounded-2xl text-white bg-gradient-to-r from-[#74E600] to-[#00C851] hover:to-[#009e3f] focus:outline-none focus:ring-4 focus:ring-[#3ED400]/40 shadow-[0_15px_30px_rgba(0,200,81,0.3)] hover:shadow-[0_20px_40px_rgba(0,200,81,0.4)] transform transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center gap-2">
               <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Creating Account...
            </span>
            <span v-else class="flex items-center gap-2">
               Submit Application
               <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </span>
          </button>

           <div class="mt-8 text-center border-t border-gray-100 pt-6">
              <p class="text-sm text-gray-500">
                 Already registered? 
                 <router-link to="/driver/login" class="font-bold text-[#00C851] hover:text-[#74E600] transition-colors ml-1">Sign in to Dashboard</router-link>
              </p>
              <div class="mt-4">
                 <router-link to="/register" class="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition-colors group">
                    <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to Regular User Registration
                 </router-link>
              </div>
           </div>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'DriverRegister',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    
    const showPassword = ref(false)
    const loading = ref(false)
    
    const formData = reactive({
      fullName: '',
      contact: '',
      email: '',
      password: '',
      motorcycleInfo: {
        brand: '',
        model: '',
        plateNumber: '',
        year: ''
      },
      experience: '',
      availability: '',
      documents: {
        license: null,
        orcr: null,
        selfie: null,
        profilePicture: null
      },
      acceptTerms: false
    })

    const handleFileUpload = (event, documentType) => {
      const file = event.target.files[0]
      if (file) {
        formData.documents[documentType] = file
      }
    }

    const handleRegister = async () => {
      // Basic Validation
      if (!formData.fullName || !formData.contact || !formData.email || !formData.password || 
          !formData.motorcycleInfo.brand || !formData.motorcycleInfo.model || 
          !formData.motorcycleInfo.plateNumber || !formData.motorcycleInfo.year ||
          !formData.experience || !formData.availability) {
        toast.error('Please fill in all required fields')
        return
      }

      if (!formData.documents.license || !formData.documents.orcr || 
          !formData.documents.selfie || !formData.documents.profilePicture) {
        toast.error('Please upload all required documents')
        return
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long')
        return
      }

      if (!formData.acceptTerms) {
        toast.error('Please accept the terms and conditions')
        return
      }

      loading.value = true
      try {
        const result = await authStore.registerDriver({
          fullName: formData.fullName,
          contact: formData.contact,
          email: formData.email,
          password: formData.password,
          motorcycleInfo: formData.motorcycleInfo,
          experience: formData.experience,
          availability: formData.availability,
          documents: formData.documents
        })
        
        if (result.success) {
          toast.success('Application submitted! Wait for admin approval.')
          router.push('/driver/login')
        } else {
          toast.error(result.error || 'Registration failed')
        }
      } catch (error) {
        console.error('Registration error:', error)
        toast.error('An error occurred during registration')
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      showPassword,
      loading,
      handleRegister,
      handleFileUpload
    }
  }
}
</script>

<style scoped>
/* Optional Custom Scrollbar if form is long */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent; 
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>