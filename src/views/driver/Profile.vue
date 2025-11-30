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
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                v-model="profile.fullName"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label for="contact" class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                id="contact"
                v-model="profile.contact"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Enter your contact number"
              />
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
          </div>
        </div>
      </div>

      <!-- Motorcycle Information -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Motorcycle Information</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="motorcycleBrand" class="block text-sm font-medium text-gray-700 mb-2">Motorcycle Brand</label>
              <input
                type="text"
                id="motorcycleBrand"
                v-model="profile.motorcycleInfo.brand"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="e.g., Honda, Yamaha, Kawasaki"
              />
            </div>
            
            <div>
              <label for="motorcycleModel" class="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                id="motorcycleModel"
                v-model="profile.motorcycleInfo.model"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="e.g., Click 150i, Mio i125"
              />
            </div>
            
            <div>
              <label for="plateNumber" class="block text-sm font-medium text-gray-700 mb-2">Plate Number</label>
              <input
                type="text"
                id="plateNumber"
                v-model="profile.motorcycleInfo.plateNumber"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Enter plate number"
              />
            </div>
            
            <div>
              <label for="year" class="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                id="year"
                v-model="profile.motorcycleInfo.year"
                min="2000"
                max="2024"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="e.g., 2020"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Experience & Availability -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Experience & Availability</h3>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">Years of Driving Experience</label>
              <select
                id="experience"
                v-model="profile.experience"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
              >
                <option value="">Select experience</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div>
              <label for="availability" class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                id="availability"
                v-model="profile.availability"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
              >
                <option value="">Select availability</option>
                <option value="full-time">Full Time (8+ hours/day)</option>
                <option value="part-time">Part Time (4-8 hours/day)</option>
                <option value="weekends">Weekends Only</option>
                <option value="flexible">Flexible Schedule</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Update Profile Button -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-end">
            <button
              @click="updateProfile"
              :disabled="loading"
              class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Updating...' : 'Update Profile' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Change Password Section -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Change Password</h3>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button
              @click="changePassword"
              :disabled="passwordLoading"
              class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ passwordLoading ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div
      v-if="showNotificationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeNotificationModal"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              notificationType === 'success' ? 'bg-green-100' : 'bg-red-100'
            ]">
              <svg
                v-if="notificationType === 'success'"
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg
                v-else
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ notificationType === 'success' ? 'Success' : 'Error' }}
            </h3>
          </div>
          <button
            @click="closeNotificationModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-700 mb-6">{{ notificationMessage }}</p>
        <div class="flex justify-end">
          <button
            @click="closeNotificationModal"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            OK
          </button>
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
import { db, storage } from '@/firebase/config'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default {
  name: 'DriverProfile',
  setup() {
    const authStore = useAuthStore()
    const loading = ref(false)
    const passwordLoading = ref(false)
    const uploadingProfilePicture = ref(false)
    const profilePictureProgress = ref(0)
    const showNotificationModal = ref(false)
    const notificationType = ref('success')
    const notificationMessage = ref('')

    const profile = ref({
      fullName: '',
      contact: '',
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
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const showNotification = (type, message) => {
      notificationType.value = type
      notificationMessage.value = message
      showNotificationModal.value = true
    }

    const closeNotificationModal = () => {
      showNotificationModal.value = false
    }

    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'drivers', authStore.user.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data()
          profile.value = {
            fullName: data.fullName || '',
            contact: data.contact || '',
            email: data.email || authStore.user.email || '',
            profilePictureUrl: data.profilePictureUrl || data.driverInfo?.documents?.profilePicture || '',
            motorcycleInfo: {
              brand: data.motorcycleInfo?.brand || data.driverInfo?.motorcycleInfo?.brand || '',
              model: data.motorcycleInfo?.model || data.driverInfo?.motorcycleInfo?.model || '',
              plateNumber: data.motorcycleInfo?.plateNumber || data.driverInfo?.motorcycleInfo?.plateNumber || '',
              year: data.motorcycleInfo?.year || data.driverInfo?.motorcycleInfo?.year || ''
            },
            experience: data.experience || data.driverInfo?.experience || '',
            availability: data.availability || data.driverInfo?.availability || ''
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        showNotification('error', 'Error loading profile. Please try again.')
      }
    }

    const handleProfilePictureSelect = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'File size must be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please select an image file')
        return
      }

      try {
        uploadingProfilePicture.value = true
        profilePictureProgress.value = 0

        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop()
        const fileName = `profile_${timestamp}_${randomString}.${fileExtension}`
        const fileRef = storageRef(storage, `driver-profiles/${authStore.user.uid}/${fileName}`)

        const uploadTask = uploadBytesResumable(fileRef, file)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            profilePictureProgress.value = Math.round(progress)
          },
          (error) => {
            console.error('Error uploading profile picture:', error)
            uploadingProfilePicture.value = false
            showNotification('error', 'Failed to upload profile picture. Please try again.')
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            profile.value.profilePictureUrl = downloadURL
            
            // Save to Firestore
            const docRef = doc(db, 'drivers', authStore.user.uid)
            await updateDoc(docRef, {
              profilePictureUrl: downloadURL,
              updatedAt: new Date()
            })
            
            uploadingProfilePicture.value = false
            profilePictureProgress.value = 0
            showNotification('success', 'Profile picture uploaded successfully!')
          }
        )
      } catch (error) {
        console.error('Error uploading profile picture:', error)
        uploadingProfilePicture.value = false
        showNotification('error', 'Failed to upload profile picture. Please try again.')
      }
    }

    const updateProfile = async () => {
      if (!profile.value.fullName || !profile.value.contact) {
        showNotification('error', 'Please fill in all required fields')
        return
      }

      loading.value = true
      try {
        const docRef = doc(db, 'drivers', authStore.user.uid)
        await updateDoc(docRef, {
          fullName: profile.value.fullName,
          contact: profile.value.contact,
          email: profile.value.email,
          profilePictureUrl: profile.value.profilePictureUrl,
          motorcycleInfo: profile.value.motorcycleInfo,
          experience: profile.value.experience,
          availability: profile.value.availability,
          updatedAt: new Date()
        })
        
        showNotification('success', 'Profile updated successfully!')
      } catch (error) {
        console.error('Error updating profile:', error)
        showNotification('error', 'Error updating profile. Please try again.')
      } finally {
        loading.value = false
      }
    }

    const changePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        showNotification('error', 'New passwords do not match!')
        return
      }
      
      if (passwordForm.value.newPassword.length < 6) {
        showNotification('error', 'Password must be at least 6 characters long!')
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
        
        // Save password update timestamp to Firestore
        const docRef = doc(db, 'drivers', authStore.user.uid)
        await updateDoc(docRef, {
          passwordUpdatedAt: new Date()
        })
        
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        showNotification('success', 'Password changed successfully!')
      } catch (error) {
        console.error('Error changing password:', error)
        if (error.code === 'auth/wrong-password') {
          showNotification('error', 'Current password is incorrect!')
        } else if (error.code === 'auth/weak-password') {
          showNotification('error', 'New password is too weak!')
        } else {
          showNotification('error', 'Error changing password. Please try again.')
        }
      } finally {
        passwordLoading.value = false
      }
    }

    onMounted(async () => {
      if (authStore.user) {
        profile.value.email = authStore.user.email
        await loadProfile()
      }
    })

    return {
      profile,
      passwordForm,
      loading,
      passwordLoading,
      uploadingProfilePicture,
      profilePictureProgress,
      showNotificationModal,
      notificationType,
      notificationMessage,
      handleProfilePictureSelect,
      updateProfile,
      changePassword,
      showNotification,
      closeNotificationModal
    }
  }
}
</script>
