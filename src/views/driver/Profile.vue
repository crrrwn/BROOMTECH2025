<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Driver Profile</h3>
          
          <!-- Profile Information -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="profile.name"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="profile.email"
                disabled
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                v-model="profile.phone"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="license" class="block text-sm font-medium text-gray-700">Driver's License</label>
              <input
                type="text"
                id="license"
                v-model="profile.licenseNumber"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="vehicle" class="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <select
                id="vehicle"
                v-model="profile.vehicleType"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Vehicle Type</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            
            <div>
              <label for="plateNumber" class="block text-sm font-medium text-gray-700">Plate Number</label>
              <input
                type="text"
                id="plateNumber"
                v-model="profile.plateNumber"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div class="mt-6">
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              id="address"
              v-model="profile.address"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button
              @click="updateProfile"
              :disabled="loading"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Update Profile' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Change Password Section -->
      <div class="bg-white shadow rounded-lg mt-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Change Password</h3>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button
              @click="changePassword"
              :disabled="passwordLoading"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {{ passwordLoading ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { db } from '@/firebase/config'

const authStore = useAuthStore()
const loading = ref(false)
const passwordLoading = ref(false)

const profile = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  licenseNumber: '',
  vehicleType: '',
  plateNumber: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
  if (authStore.user) {
    profile.value.email = authStore.user.email
    await loadProfile()
  }
})

const loadProfile = async () => {
  try {
    const docRef = doc(db, 'drivers', authStore.user.uid)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      profile.value = {
        ...profile.value,
        ...data
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

const updateProfile = async () => {
  loading.value = true
  try {
    const docRef = doc(db, 'drivers', authStore.user.uid)
    await updateDoc(docRef, {
      name: profile.value.name,
      phone: profile.value.phone,
      address: profile.value.address,
      licenseNumber: profile.value.licenseNumber,
      vehicleType: profile.value.vehicleType,
      plateNumber: profile.value.plateNumber,
      updatedAt: new Date()
    })
    
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Error updating profile. Please try again.')
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match!')
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    alert('Password must be at least 6 characters long!')
    return
  }
  
  passwordLoading.value = true
  try {
    const credential = EmailAuthProvider.credential(
      authStore.user.email,
      passwordForm.value.currentPassword
    )
    
    await reauthenticateWithCredential(authStore.user, credential)
    await updatePassword(authStore.user, passwordForm.value.newPassword)
    
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    alert('Password changed successfully!')
  } catch (error) {
    console.error('Error changing password:', error)
    if (error.code === 'auth/wrong-password') {
      alert('Current password is incorrect!')
    } else {
      alert('Error changing password. Please try again.')
    }
  } finally {
    passwordLoading.value = false
  }
}
</script>
