<template>
  <div class="min-h-screen w-full bg-gray-50/50 overflow-x-hidden font-sans pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <div class="relative overflow-hidden bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-3xl p-8 shadow-lg text-white">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
             <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight">Driver Profile</h1>
            <p class="text-green-50 font-medium">Manage your personal and vehicle information.</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f0fce6] to-transparent z-0"></div>
            
            <div class="relative z-10 mb-4">
              <div class="relative group">
                <div class="w-40 h-40 rounded-full p-1 bg-white shadow-xl">
                   <img
                    v-if="profile.profilePictureUrl"
                    :src="profile.profilePictureUrl"
                    alt="Profile Picture"
                    class="w-full h-full rounded-full object-cover border-4 border-gray-50"
                  />
                  <div
                    v-else
                    class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-gray-50"
                  >
                    <svg class="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>

                <button 
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="absolute bottom-1 right-1 bg-[#3ED400] hover:bg-[#32b000] text-white p-3 rounded-full cursor-pointer shadow-lg transition-all transform hover:scale-110 border-4 border-white flex items-center justify-center focus:outline-none z-20"
                  :disabled="uploadingProfilePicture"
                  :class="uploadingProfilePicture ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <svg v-if="!uploadingProfilePicture" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <svg v-else class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </button>
                
                <input 
                  ref="fileInput" 
                  type="file" 
                  accept="image/*" 
                  @change="handleProfilePictureSelect" 
                  class="hidden" 
                  style="display: none;" 
                />
              </div>
            </div>

            <h2 class="text-xl font-bold text-gray-900 relative z-10">{{ profile.fullName || 'Driver Name' }}</h2>
            <p class="text-sm text-gray-500 relative z-10">{{ profile.email }}</p>

            <div v-if="uploadingProfilePicture" class="w-full mt-6 relative z-10 px-4">
              <div class="flex justify-between text-xs text-gray-500 mb-1 font-bold">
                <span>Uploading Image...</span>
                <span>{{ profilePictureProgress }}%</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div class="bg-[#3ED400] h-2 rounded-full transition-all duration-300" :style="{ width: profilePictureProgress + '%' }"></div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
             <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Availability Status</h3>
             <div class="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                   <p class="text-xs text-gray-500 font-bold uppercase">Work Schedule</p>
                   <p class="text-gray-900 font-bold capitalize">{{ profile.availability || 'Not Set' }}</p>
                </div>
             </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-8">
          
          <div class="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-1.5 h-6 bg-[#3ED400] rounded-full mr-3"></span>
              Personal Information
            </h3>
            
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" v-model="profile.fullName" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm" placeholder="Juan Dela Cruz" />
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Number</label>
                  <input type="tel" v-model="profile.contact" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm" placeholder="09XXXXXXXXX" />
                </div>

                <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                   <input type="email" v-model="profile.email" disabled class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm outline-none shadow-sm" />
                </div>

                <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Experience</label>
                   <div class="relative">
                      <select v-model="profile.experience" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm appearance-none cursor-pointer shadow-sm">
                        <option value="">Select Years</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                         <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                   </div>
                </div>

                <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</label>
                   <div class="relative">
                      <select v-model="profile.availability" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm appearance-none cursor-pointer shadow-sm">
                        <option value="">Select Schedule</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="flexible">Flexible</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                         <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                   </div>
                </div>
              </div>
            </form>
          </div>

          <div class="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
              Vehicle Details
            </h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Brand</label>
                   <input type="text" v-model="profile.motorcycleInfo.brand" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm" placeholder="e.g. Yamaha" />
                </div>
                <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Model</label>
                   <input type="text" v-model.trim="profile.motorcycleInfo.model" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm" placeholder="e.g. NMAX 155" />
                </div>
                <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plate Number</label>
                   <input type="text" v-model="profile.motorcycleInfo.plateNumber" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm uppercase" placeholder="ABC 1234" />
                </div>
                <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year Model</label>
                   <input type="number" v-model="profile.motorcycleInfo.year" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm" placeholder="2024" />
                </div>
            </div>

             <div class="flex justify-end pt-6 mt-6 border-t border-gray-100">
                <button
                  @click="updateProfile"
                  :disabled="loading"
                  class="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-[#74E600] to-[#00C851] hover:shadow-lg text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ loading ? 'Saving Profile...' : 'Save All Changes' }}
                </button>
              </div>
          </div>

          <div class="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-1.5 h-6 bg-red-500 rounded-full mr-3"></span>
              Security
            </h3>
            
            <form @submit.prevent="changePassword" class="space-y-6">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                <div class="relative">
                   <input :type="showCurrentPassword ? 'text' : 'password'" v-model="passwordForm.currentPassword" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm pr-10" placeholder="••••••••" />
                   <button type="button" @click="showCurrentPassword = !showCurrentPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                      <svg v-if="showCurrentPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
                   </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <div class="relative">
                     <input :type="showNewPassword ? 'text' : 'password'" v-model="passwordForm.newPassword" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm pr-10" placeholder="••••••••" />
                     <button type="button" @click="showNewPassword = !showNewPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                        <svg v-if="showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
                     </button>
                  </div>
                </div>
                <div>
                   <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                   <div class="relative">
                      <input :type="showConfirmPassword ? 'text' : 'password'" v-model="passwordForm.confirmPassword" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm shadow-sm pr-10" placeholder="••••••••" />
                      <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                         <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                         <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
                      </button>
                   </div>
                </div>
              </div>
              
              <div class="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  :disabled="passwordLoading"
                  class="inline-flex items-center px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 shadow-sm"
                >
                   <svg v-if="passwordLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ passwordLoading ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>

    <div v-if="showNotificationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300" @click="closeNotificationModal">
      <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform scale-100 transition-transform animate-in zoom-in-95" @click.stop>
        <div :class="[
          'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-sm',
          notificationType === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        ]">
          <svg v-if="notificationType === 'success'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <h3 class="text-2xl font-extrabold text-gray-900 mb-2">
          {{ notificationType === 'success' ? 'Success!' : 'Oops!' }}
        </h3>
        <p class="text-gray-600 text-base mb-8 leading-relaxed">{{ notificationMessage }}</p>
        <button @click="closeNotificationModal" class="w-full py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black shadow-md transition-colors">
          Okay, Got it
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { db, storage } from '@/firebase/config'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default {
  name: 'DriverProfile',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      loading: false,
      passwordLoading: false,
      uploadingProfilePicture: false,
      profilePictureProgress: 0,
      profilePictureFile: null,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      profile: {
        firstName: '',
        lastName: '',
        middleName: '',
        contact: '',
        address: '',
        barangay: '',
        email: '',
        profilePictureUrl: '',
        motorcycleInfo: {
          brand: '',
          model: '',
          plateNumber: '',
          year: ''
        },
        experience: '',
        availability: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showNotificationModal: false,
      notificationType: 'success',
      notificationMessage: ''
    }
  },
  async mounted() {
    await this.loadProfile()
  },
  methods: {
    // 1. Trigger File Input Programmatically
    triggerFileInput() {
       this.$refs.fileInput.click()
    },

    async loadProfile() {
      try {
        if (this.authStore.user) {
          const docRef = doc(db, 'drivers', this.authStore.user.uid)
          const docSnap = await getDoc(docRef)
          
          if (docSnap.exists()) {
            const data = docSnap.data()
            this.profile = {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              // Check various fields for contact/email incase of schema drift
              contact: data.contact || data.phone || '',
              email: data.email || this.authStore.user.email || '',
              profilePictureUrl: data.profilePictureUrl || data.driverInfo?.documents?.profilePicture || '',
              motorcycleInfo: {
                brand: data.motorcycleInfo?.brand || '',
                model: data.motorcycleInfo?.model || '',
                plateNumber: data.motorcycleInfo?.plateNumber || '',
                year: data.motorcycleInfo?.year || ''
              },
              experience: data.experience || '',
              availability: data.availability || ''
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    },
    
    handleProfilePictureSelect(event) {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        this.showNotification('error', 'Please select an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('error', 'Image size must be less than 5MB')
        return
      }

      this.profilePictureFile = file
      this.uploadProfilePicture()
    },

    async uploadProfilePicture() {
      if (!this.profilePictureFile || !this.authStore.user) return

      try {
        this.uploadingProfilePicture = true
        this.profilePictureProgress = 0

        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = this.profilePictureFile.name.split('.').pop() || 'jpg'
        const fileName = `profile_${timestamp}_${randomString}.${fileExtension}`
        const fileRef = storageRef(storage, `driver-profiles/${this.authStore.user.uid}/${fileName}`)

        const uploadTask = uploadBytesResumable(fileRef, this.profilePictureFile)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.profilePictureProgress = Math.round(progress)
          },
          (error) => {
            this.uploadingProfilePicture = false
            this.showNotification('error', 'Upload Unsuccessful. Please try again.')
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              const docRef = doc(db, 'drivers', this.authStore.user.uid)
              
              // Ensure doc exists or create/merge
              await setDoc(docRef, {
                profilePictureUrl: downloadURL,
                updatedAt: new Date()
              }, { merge: true })

              this.profile.profilePictureUrl = downloadURL
              this.uploadingProfilePicture = false
              this.profilePictureFile = null
              this.showNotification('success', 'Upload Successful!')
            } catch (error) {
              this.uploadingProfilePicture = false
              this.showNotification('error', 'Upload Unsuccessful. Failed to update profile.')
            }
          }
        )
      } catch (error) {
        this.uploadingProfilePicture = false
        this.showNotification('error', 'Upload Unsuccessful. Please try again.')
      }
    },
    
    async updateProfile() {
      this.loading = true
      try {
        if (this.authStore.user) {
          const docRef = doc(db, 'drivers', this.authStore.user.uid)
          
          const updateData = {
            fullName: this.profile.firstName + ' ' + this.profile.lastName, // Store full name for display
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            contact: this.profile.contact,
            email: this.profile.email,
            profilePictureUrl: this.profile.profilePictureUrl,
            motorcycleInfo: this.profile.motorcycleInfo,
            experience: this.profile.experience,
            availability: this.profile.availability,
            updatedAt: new Date()
          }
          
          await setDoc(docRef, updateData, { merge: true })
          
          this.showNotification('success', 'Profile Updated Successfully!')
        }
      } catch (error) {
        this.showNotification('error', 'Update Unsuccessful. ' + error.message)
      } finally {
        this.loading = false
      }
    },
    
    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.showNotification('error', 'New passwords do not match')
        return
      }
      if (this.passwordForm.newPassword.length < 6) {
        this.showNotification('error', 'New password must be at least 6 characters long')
        return
      }
      
      this.passwordLoading = true
      try {
        if (this.authStore.user) {
          const credential = EmailAuthProvider.credential(
            this.authStore.user.email,
            this.passwordForm.currentPassword
          )
          await reauthenticateWithCredential(this.authStore.user, credential)
          await updatePassword(this.authStore.user, this.passwordForm.newPassword)
          
          const docRef = doc(db, 'drivers', this.authStore.user.uid)
          await updateDoc(docRef, { passwordUpdatedAt: new Date() })
          
          this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' }
          this.showNotification('success', 'Password Changed Successfully!')
        }
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          this.showNotification('error', 'Current password is incorrect')
        } else {
          this.showNotification('error', 'Change Password Unsuccessful')
        }
      } finally {
        this.passwordLoading = false
      }
    },

    showNotification(type, message) {
      this.notificationType = type
      this.notificationMessage = message
      this.showNotificationModal = true
    },

    closeNotificationModal() {
      this.showNotificationModal = false
      this.notificationMessage = ''
    }
  }
}
</script>