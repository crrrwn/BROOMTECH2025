<template>
  <div class="min-h-screen w-full bg-gray-50/50 overflow-x-hidden font-sans pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">
      
      <div class="relative overflow-hidden bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg text-white transform transition hover:scale-[1.005] duration-500">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10">
          <div class="flex items-center space-x-3 mb-2">
            <div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">My Profile</h1>
          </div>
          <p class="text-[#e6ffcc] text-base md:text-lg font-medium">Manage your personal information and security settings.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#f0fce6] to-white z-0"></div>
            
            <div class="relative z-10 mb-4">
              <div class="relative">
                <img
                  v-if="profile.profilePictureUrl"
                  :src="profile.profilePictureUrl"
                  alt="Profile Picture"
                  class="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div
                  v-else
                  class="h-32 w-32 md:h-40 md:w-40 rounded-full bg-green-50 flex items-center justify-center border-4 border-white shadow-md text-green-400"
                >
                  <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                
                <label 
                  for="profilePicture" 
                  class="absolute bottom-0 right-0 bg-[#3ED400] hover:bg-[#32b000] text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 border-2 border-white flex items-center justify-center"
                  :class="uploadingProfilePicture ? 'opacity-50 cursor-not-allowed' : ''"
                >
                   <svg v-if="!uploadingProfilePicture" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   <svg v-else class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </label>
                <input id="profilePicture" type="file" accept="image/*" @change="handleProfilePictureSelect" class="hidden" :disabled="uploadingProfilePicture" />
              </div>
            </div>

            <h2 class="text-xl font-bold text-gray-900 relative z-10">{{ profile.firstName }} {{ profile.lastName }}</h2>
            <p class="text-sm text-gray-500 relative z-10">{{ profile.email }}</p>

            <div v-if="uploadingProfilePicture" class="w-full mt-4 relative z-10 px-4">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading...</span>
                <span>{{ profilePictureProgress }}%</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div class="bg-[#3ED400] h-1.5 rounded-full transition-all duration-300" :style="{ width: profilePictureProgress + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
             <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Details</h3>
             <div class="space-y-3">
                <div class="flex items-center text-gray-700 text-sm bg-gray-50 p-3 rounded-xl">
                   <div class="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3 shrink-0">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                   </div>
                   <span class="font-medium">{{ profile.contact || 'No contact set' }}</span>
                </div>
                <div class="flex items-center text-gray-700 text-sm bg-gray-50 p-3 rounded-xl">
                   <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 shrink-0">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   </div>
                   <span class="truncate font-medium">{{ profile.address || 'No address' }}</span>
                </div>
             </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-8">
          
          <div class="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-1.5 h-6 bg-[#3ED400] rounded-full mr-3"></span>
              Personal Information
            </h3>
            
            <form @submit.prevent="updateProfile" class="space-y-5">
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                  <input type="text" v-model="profile.firstName" required pattern="[A-Za-z\s\-]+" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm" placeholder="Enter first name" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                  <input type="text" v-model="profile.lastName" required pattern="[A-Za-z\s\-]+" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm" placeholder="Enter last name" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Middle Name (Optional)</label>
                  <input type="text" v-model="profile.middleName" pattern="[A-Za-z\s\-]*" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm" placeholder="Enter middle name" />
                </div>
                <div>
                  <label for="profileContact" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Number</label>
                  <input id="profileContact" type="tel" v-model="profile.contact" autocomplete="tel" required pattern="^(09|\+639)\d{9}$" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm" placeholder="09XXXXXXXXX" />
                </div>
                <div class="md:col-span-2">
                  <label for="profileEmail" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input id="profileEmail" type="email" v-model="profile.email" autocomplete="email" disabled class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm outline-none" />
                </div>
                <div>
                  <label for="profileBarangay" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Barangay</label>
                  <div class="relative">
                     <select id="profileBarangay" v-model="profile.barangay" autocomplete="address-level2" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm appearance-none cursor-pointer">
                        <option value="">Select Barangay</option>
                        <option v-for="barangay in barangays" :key="barangay" :value="barangay">{{ barangay }}</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                         <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                  </div>
                </div>
                <div>
                  <label for="profileStreetAddress" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Street Address</label>
                  <input id="profileStreetAddress" type="text" v-model="profile.address" autocomplete="street-address" required minlength="10" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm" placeholder="House No., Street" />
                </div>
              </div>

              <div class="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#74E600] to-[#00C851] hover:shadow-lg text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {{ loading ? 'Saving Changes...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <div class="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-1.5 h-6 bg-red-500 rounded-full mr-3"></span>
              Security Settings
            </h3>
            
            <form @submit.prevent="changePassword" class="space-y-5">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                <div class="relative">
                  <input :type="showCurrentPassword ? 'text' : 'password'" v-model="passwordForm.currentPassword" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm pr-10" placeholder="••••••••" />
                  <button type="button" @click="showCurrentPassword = !showCurrentPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    <svg v-if="showCurrentPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <div class="relative">
                    <input :type="showNewPassword ? 'text' : 'password'" v-model="passwordForm.newPassword" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm pr-10" placeholder="••••••••" />
                    <button type="button" @click="showNewPassword = !showNewPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                       <svg v-if="showNewPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                       <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                  <div class="relative">
                    <input :type="showConfirmPassword ? 'text' : 'password'" v-model="passwordForm.confirmPassword" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-800 text-sm pr-10" placeholder="••••••••" />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
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
                  class="inline-flex items-center px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 shadow-sm"
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

    <div v-if="showNotificationModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" @click="closeNotificationModal">
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
        <p class="text-gray-600 text-base mb-8 leading-relaxed font-medium">{{ notificationMessage }}</p>
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
  name: 'UserProfile',
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
        profilePictureUrl: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      barangays: [
        'Balingayan', 'Balite', 'Baruyan', 'Batino', 'Bayanan I', 'Bayanan II', 'Biga', 'Bondoc', 'Bucayao', 'Buhuan', 'Bulusan',
        'Calero', 'Camansihan', 'Camilmil', 'Canubing I', 'Canubing II', 'Comunal',
        'Guinobatan', 'Gulod', 'Gutad',
        'Ibaba East', 'Ibaba West', 'Ilaya',
        'Lalud', 'Lazareto', 'Libis', 'Lumangbayan',
        'Mahal na Pangalan', 'Maidlang', 'Malad', 'Malamig', 'Managpi', 'Masipit', 'Nag-iba I', 'Nag-iba II', 'Navotas',
        'Pachoca', 'Palhi', 'Panggalaan', 'Parang', 'Patas', 'Personas', 'Puting Tubig',
        'Salong', 'San Antonio', 'San Vicente Central', 'San Vicente East', 'San Vicente North', 'San Vicente South', 'San Vicente West', 'Sapul', 'Silonay', 'Sta. Cruz', 'Sta. Isabel', 'Sta. Maria Village', 'Sta. Rita', 'Sto. Niño', 'Suqui',
        'Tawagan', 'Tawiran', 'Tibag',
        'Wawa'
      ],
      showNotificationModal: false,
      notificationType: 'success',
      notificationMessage: ''
    }
  },
  async mounted() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        if (this.authStore.user) {
          const userDoc = await getDoc(doc(db, 'users', this.authStore.user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            this.profile = {
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              middleName: userData.middleName || '',
              contact: userData.contact || userData.phone || '',
              address: userData.address || '',
              barangay: userData.barangay || '',
              email: userData.email || this.authStore.user.email || '',
              profilePictureUrl: userData.profilePictureUrl || userData.photoURL || ''
            }
          }
        }
      } catch (error) {
        this.showNotification('error', 'Error loading profile data')
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
        const fileRef = storageRef(storage, `profiles/${this.authStore.user.uid}/${fileName}`)

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
              const userRef = doc(db, 'users', this.authStore.user.uid)
              await updateDoc(userRef, {
                profilePictureUrl: downloadURL,
                photoURL: downloadURL,
                updatedAt: new Date()
              })

              this.profile.profilePictureUrl = downloadURL
              this.uploadingProfilePicture = false
              this.profilePictureFile = null
              this.showNotification('success', 'Profile Picture Uploaded Successfully!')
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
          const userRef = doc(db, 'users', this.authStore.user.uid)
          const userDoc = await getDoc(userRef)
          
          const updateData = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            middleName: this.profile.middleName || '',
            contact: this.profile.contact,
            phone: this.profile.contact,
            address: this.profile.address,
            barangay: this.profile.barangay,
            email: this.profile.email,
            updatedAt: new Date()
          }
          
          if (userDoc.exists()) {
            await updateDoc(userRef, updateData)
          } else {
            await setDoc(userRef, {
              ...updateData,
              uid: this.authStore.user.uid,
              createdAt: new Date()
            })
          }
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
          const userRef = doc(db, 'users', this.authStore.user.uid)
          await updateDoc(userRef, { passwordUpdatedAt: new Date() })
          
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