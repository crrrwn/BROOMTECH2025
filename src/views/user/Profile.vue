<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Add profile completion notice for Google users -->
      <div v-if="showCompletionNotice" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Complete Your Profile</h3>
            <p class="mt-1 text-sm text-yellow-700">
              Please complete your profile information (phone number and address) before you can book services.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
            User Profile
          </h3>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  v-model="profile.firstName"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  v-model="profile.lastName"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                v-model="profile.email"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Contact Number <span v-if="showCompletionNotice" class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                v-model="profile.phone"
                placeholder="Enter your contact number"
                :class="[
                  'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  showCompletionNotice && !profile.phone ? 'border-red-300' : ''
                ]"
                :required="showCompletionNotice"
              />
            </div>
            
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700">
                Address <span v-if="showCompletionNotice" class="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                v-model="profile.address"
                rows="3"
                placeholder="Enter your complete address"
                :class="[
                  'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                  showCompletionNotice && !profile.address ? 'border-red-300' : ''
                ]"
                :required="showCompletionNotice"
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ loading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Change Password Section -->
      <div class="bg-white shadow rounded-lg mt-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
            Change Password
          </h3>
          
          <form @submit.prevent="changePassword" class="space-y-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="passwordLoading"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {{ passwordLoading ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { db } from '@/firebase/config'

export default {
  name: 'Profile',
  data() {
    return {
      loading: false,
      passwordLoading: false,
      showCompletionNotice: false,
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    }
  },
  async mounted() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        if (this.authStore.user) {
          console.log('[v0] Loading profile for user:', this.authStore.user.uid)
          const userDoc = await getDoc(doc(db, 'users', this.authStore.user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log('[v0] User data from Firestore:', userData)
            
            this.profile = {
              firstName: userData.firstName || userData.first_name || '',
              lastName: userData.lastName || userData.last_name || '',
              email: userData.email || this.authStore.user.email,
              phone: userData.contact || userData.phone || userData.phoneNumber || userData.contactNumber || userData.contact_number || userData.mobile || '',
              address: userData.address || userData.location || userData.barangay || ''
            }
            
            console.log('[v0] Mapped profile data:', this.profile)
            
            // Check if the user is a Google user and needs to complete their profile
            if (this.authStore.user.providerData.some(provider => provider.providerId === 'google.com') && (!this.profile.phone || !this.profile.address)) {
              this.showCompletionNotice = true
            }
          } else {
            console.log('[v0] No user document found in Firestore')
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        alert('Error loading profile data')
      }
    },
    
    async updateProfile() {
      this.loading = true
      try {
        if (this.authStore.user) {
          console.log('[v0] Updating profile with data:', this.profile)
          
          const updateData = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            email: this.profile.email,
            contact: this.profile.phone, // Primary contact field
            phone: this.profile.phone,
            phoneNumber: this.profile.phone,
            contactNumber: this.profile.phone,
            mobile: this.profile.phone,
            address: this.profile.address,
            location: this.profile.address,
            updatedAt: new Date()
          }
          
          await updateDoc(doc(db, 'users', this.authStore.user.uid), updateData)
          
          console.log('[v0] Profile updated successfully in Firestore')
          alert('Profile updated successfully!')
          
          // Hide the completion notice if the profile is now complete
          if (this.profile.phone && this.profile.address) {
            this.showCompletionNotice = false
          }
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Error updating profile: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    
    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('New passwords do not match')
        return
      }
      
      if (this.passwordForm.newPassword.length < 6) {
        alert('New password must be at least 6 characters long')
        return
      }
      
      this.passwordLoading = true
      try {
        if (this.authStore.user) {
          console.log('[v0] Changing password for user')
          
          // Reauthenticate user
          const credential = EmailAuthProvider.credential(
            this.authStore.user.email,
            this.passwordForm.currentPassword
          )
          await reauthenticateWithCredential(this.authStore.user, credential)
          
          // Update password through Firebase Auth
          await updatePassword(this.authStore.user, this.passwordForm.newPassword)
          
          await updateDoc(doc(db, 'users', this.authStore.user.uid), {
            passwordUpdatedAt: new Date()
          })
          
          // Clear form
          this.passwordForm = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
          
          console.log('[v0] Password changed successfully')
          alert('Password changed successfully!')
        }
      } catch (error) {
        console.error('Error changing password:', error)
        if (error.code === 'auth/wrong-password') {
          alert('Current password is incorrect')
        } else if (error.code === 'auth/weak-password') {
          alert('New password is too weak')
        } else {
          alert('Error changing password: ' + error.message)
        }
      } finally {
        this.passwordLoading = false
      }
    }
  }
}
</script>
