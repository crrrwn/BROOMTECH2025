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
                Phone Number <span v-if="showCompletionNotice" class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                v-model="profile.phone"
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { db } from '@/firebase/config'

export default {
  name: 'Profile',
  setup() {
    const authStore = useAuthStore()
    const loading = ref(false)
    const passwordLoading = ref(false)
    const showCompletionNotice = ref(false)
    
    const profile = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: ''
    })
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const loadProfile = async () => {
      try {
        if (authStore.user) {
          const userDoc = await getDoc(doc(db, 'users', authStore.user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            profile.value = {
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || authStore.user.email,
              phone: userData.phone || '',
              address: userData.address || ''
            }
            // Check if the user is a Google user and needs to complete their profile
            if (authStore.user.providerData.some(provider => provider.providerId === 'google.com') && (!userData.phone || !userData.address)) {
              showCompletionNotice.value = true
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        alert('Error loading profile data')
      }
    }
    
    const updateProfile = async () => {
      loading.value = true
      try {
        if (authStore.user) {
          await updateDoc(doc(db, 'users', authStore.user.uid), {
            firstName: profile.value.firstName,
            lastName: profile.value.lastName,
            phone: profile.value.phone,
            address: profile.value.address,
            updatedAt: new Date()
          })
          alert('Profile updated successfully!')
          // Hide the completion notice if the profile is now complete
          if (profile.value.phone && profile.value.address) {
            showCompletionNotice.value = false
          }
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Error updating profile')
      } finally {
        loading.value = false
      }
    }
    
    const changePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        alert('New passwords do not match')
        return
      }
      
      if (passwordForm.value.newPassword.length < 6) {
        alert('New password must be at least 6 characters long')
        return
      }
      
      passwordLoading.value = true
      try {
        if (authStore.user) {
          // Reauthenticate user
          const credential = EmailAuthProvider.credential(
            authStore.user.email,
            passwordForm.value.currentPassword
          )
          await reauthenticateWithCredential(authStore.user, credential)
          
          // Update password
          await updatePassword(authStore.user, passwordForm.value.newPassword)
          
          // Clear form
          passwordForm.value = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
          
          alert('Password changed successfully!')
        }
      } catch (error) {
        console.error('Error changing password:', error)
        if (error.code === 'auth/wrong-password') {
          alert('Current password is incorrect')
        } else {
          alert('Error changing password')
        }
      } finally {
        passwordLoading.value = false
      }
    }
    
    onMounted(() => {
      loadProfile()
    })
    
    return {
      profile,
      passwordForm,
      loading,
      passwordLoading,
      showCompletionNotice,
      updateProfile,
      changePassword
    }
  }
}
</script>
