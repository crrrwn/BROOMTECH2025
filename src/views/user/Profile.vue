<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Profile Picture Section -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Profile Picture</h3>
          
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <img
                v-if="profile.profilePictureUrl"
                :src="profile.profilePictureUrl"
                alt="Profile Picture"
                class="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
              />
              <div
                v-else
                class="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200"
              >
                <svg class="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <div class="flex-1">
              <label for="profilePicture" class="block text-sm font-medium text-gray-700 mb-2">
                Upload Profile Picture
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                @change="handleProfilePictureSelect"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-700"
              />
              <p class="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 5MB)</p>
              <div v-if="uploadingProfilePicture" class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary h-2 rounded-full transition-all duration-300"
                    :style="{ width: profilePictureProgress + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Uploading... {{ profilePictureProgress }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Personal Information</h3>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  v-model="profile.firstName"
                  required
                  pattern="[A-Za-z\s\-]+"
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="profile.lastName"
                  required
                  pattern="[A-Za-z\s\-]+"
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Enter your last name"
                />
              </div>
              
              <div>
                <label for="middleName" class="block text-sm font-medium text-gray-700 mb-2">Middle Name (Optional)</label>
                <input
                  type="text"
                  id="middleName"
                  v-model="profile.middleName"
                  pattern="[A-Za-z\s\-]*"
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Enter your middle name"
                />
              </div>
              
              <div>
                <label for="contact" class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  id="contact"
                  v-model="profile.contact"
                  required
                  pattern="^(09|\+639)\d{9}$"
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                />
                <p class="mt-1 text-xs text-gray-500">Format: 09XXXXXXXXX or +639XXXXXXXXX</p>
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  v-model="profile.email"
                  disabled
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 sm:text-sm"
                />
              </div>
              
              <div>
                <label for="barangay" class="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
                <select
                  id="barangay"
                  v-model="profile.barangay"
                  required
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                >
                  <option value="">Select Barangay</option>
                  <option v-for="barangay in barangays" :key="barangay" :value="barangay">
                    {{ barangay }}
                  </option>
                </select>
              </div>
            </div>
            
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Home Street Address</label>
              <input
                type="text"
                id="address"
                v-model="profile.address"
                required
                minlength="10"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Enter your complete address"
              />
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Change Password Section -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Change Password</h3>
          
          <form @submit.prevent="changePassword" class="space-y-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div class="relative">
                <input
                  :type="showCurrentPassword ? 'text' : 'password'"
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  required
                  class="mt-1 block w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showCurrentPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div class="relative">
                <input
                  :type="showNewPassword ? 'text' : 'password'"
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  required
                  class="mt-1 block w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showNewPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div class="relative">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  required
                  class="mt-1 block w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="passwordLoading"
                class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ passwordLoading ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <div class="flex items-center mb-4">
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center mr-4',
            notificationType === 'success' ? 'bg-green-100' : 
            notificationType === 'error' ? 'bg-red-100' : 
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
            'text-blue-900'
          ]">
            {{ notificationType === 'success' ? 'Success' : notificationType === 'error' ? 'Error' : 'Information' }}
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
        console.error('Error loading profile:', error)
        this.showNotification('error', 'Error loading profile data')
      }
    },
    
    handleProfilePictureSelect(event) {
      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showNotification('error', 'Please select an image file')
        return
      }

      // Validate file size (5MB max)
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
            console.error('Error uploading profile picture:', error)
            this.uploadingProfilePicture = false
            this.profilePictureProgress = 0
            this.showNotification('error', 'Failed to upload profile picture. Please try again.')
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              
              // Update Firestore with profile picture URL
              const userRef = doc(db, 'users', this.authStore.user.uid)
              await updateDoc(userRef, {
                profilePictureUrl: downloadURL,
                photoURL: downloadURL,
                updatedAt: new Date()
              })

              this.profile.profilePictureUrl = downloadURL
              this.uploadingProfilePicture = false
              this.profilePictureProgress = 0
              this.profilePictureFile = null
              
              this.showNotification('success', 'Profile picture uploaded successfully!')
            } catch (error) {
              console.error('Error updating profile picture URL:', error)
              this.uploadingProfilePicture = false
              this.profilePictureProgress = 0
              this.showNotification('error', 'Failed to update profile picture. Please try again.')
            }
          }
        )
      } catch (error) {
        console.error('Error handling profile picture:', error)
        this.uploadingProfilePicture = false
        this.profilePictureProgress = 0
        this.showNotification('error', 'Failed to process profile picture. Please try again.')
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
          
          this.showNotification('success', 'Profile updated successfully!')
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        this.showNotification('error', 'Error updating profile: ' + (error.message || 'Unknown error'))
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
          // Reauthenticate user
          const credential = EmailAuthProvider.credential(
            this.authStore.user.email,
            this.passwordForm.currentPassword
          )
          await reauthenticateWithCredential(this.authStore.user, credential)
          
          // Update password through Firebase Auth
          await updatePassword(this.authStore.user, this.passwordForm.newPassword)
          
          // Update Firestore
          const userRef = doc(db, 'users', this.authStore.user.uid)
          await updateDoc(userRef, {
            passwordUpdatedAt: new Date()
          })
          
          // Clear form
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
          
          this.showNotification('success', 'Password changed successfully!')
        }
      } catch (error) {
        console.error('Error changing password:', error)
        if (error.code === 'auth/wrong-password') {
          this.showNotification('error', 'Current password is incorrect')
        } else if (error.code === 'auth/weak-password') {
          this.showNotification('error', 'New password is too weak')
        } else {
          this.showNotification('error', 'Error changing password: ' + (error.message || 'Unknown error'))
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
