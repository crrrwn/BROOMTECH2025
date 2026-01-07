<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Upload Valid ID</h3>
      <p class="text-gray-600 mb-4">
        Please upload a valid government-issued ID (e.g., Driver's License, National ID, Passport, etc.)
      </p>

      <!-- ID Preview -->
      <div v-if="idPreview" class="mb-4">
        <div class="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          <img :src="idPreview" alt="ID Preview" class="w-full h-full object-contain" />
          <button
            @click="removeId"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Upload Area -->
      <div v-else class="mb-4">
        <label
          for="id-upload"
          class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
          </div>
          <input
            id="id-upload"
            type="file"
            class="hidden"
            accept="image/*,application/pdf"
            @change="handleFileSelect"
          />
        </label>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Upload Progress -->
      <div v-if="uploading" class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        <p class="text-sm text-gray-600 mt-2 text-center">Uploading... {{ uploadProgress }}%</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end">
        <button
          @click="handleUpload"
          :disabled="!idFile || uploading"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ uploading ? 'Uploading...' : 'Upload ID' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storage } from '@/firebase/config'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const emit = defineEmits(['uploaded', 'cancel'])

const idFile = ref(null)
const idPreview = ref(null)
const error = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB'
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Please upload an image (JPG, PNG, WebP) or PDF file'
    return
  }

  error.value = ''
  idFile.value = file

  // Create preview for images
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      idPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    idPreview.value = null
  }
}

const removeId = () => {
  idFile.value = null
  idPreview.value = null
  error.value = ''
}

const handleCancel = () => {
  emit('cancel')
}

const handleUpload = async () => {
  if (!idFile.value) {
    error.value = 'Please select a file to upload'
    return
  }

  uploading.value = true
  error.value = ''
  uploadProgress.value = 0

  try {
    // Get user ID from auth store (we'll need to pass it as prop or get from store)
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()
    const userId = authStore.user?.uid

    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Upload to Firebase Storage
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = idFile.value.name.split('.').pop() || 'jpg'
    const fileName = `valid-id_${timestamp}_${randomString}.${fileExtension}`
    const fileRef = storageRef(storage, `user-documents/${userId}/${fileName}`)

    const uploadTask = uploadBytesResumable(fileRef, idFile.value, {
      contentType: idFile.value.type,
      customMetadata: {
        originalName: idFile.value.name,
        uploadedAt: new Date().toISOString(),
        documentType: 'validId'
      }
    })

    // Monitor upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        uploadProgress.value = Math.round(progress)
      },
      (uploadError) => {
        console.error('Upload error:', uploadError)
        error.value = 'Failed to upload ID. Please try again.'
        uploading.value = false
        uploadProgress.value = 0
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          emit('uploaded', downloadURL)
        } catch (urlError) {
          console.error('Error getting download URL:', urlError)
          error.value = 'Failed to get download URL. Please try again.'
          uploading.value = false
        }
      }
    )
  } catch (err) {
    console.error('Upload error:', err)
    error.value = err.message || 'An error occurred during upload'
    uploading.value = false
    uploadProgress.value = 0
  }
}
</script>

