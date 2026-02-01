<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/80 via-black/80 to-black/60 backdrop-blur-md">
    <div class="relative w-full max-w-lg rounded-[28px] bg-white/95 shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-white/60 overflow-hidden validid-card">
      <div class="relative bg-gradient-to-br from-[#A8EB12] via-[#74E600] to-[#00C851] px-6 py-5 sm:px-8">
        <div class="absolute inset-0 opacity-40 animate-glow pointer-events-none"></div>
        <h3 class="relative text-xl sm:text-2xl font-black text-white mb-1">Upload Valid ID</h3>
        <p class="relative text-[13px] sm:text-sm text-white/90 max-w-xl">
          Upload a government-issued ID (Driver's License, Passport, National ID) clearly showing your name and photo.
        </p>
      </div>

      <div class="p-5 sm:p-6 space-y-4">
        <p class="text-[12px] sm:text-xs tracking-[0.2em] uppercase text-[#2E7D32] font-semibold flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-[#3ED400] shadow-lg"></span>
          Secure upload • up to 5MB
        </p>

        <!-- ID Preview -->
        <div v-if="idPreview" class="relative rounded-2xl border border-dashed border-[#3ED400]/40 bg-white/80 overflow-hidden h-48 flex items-center justify-center">
          <img :src="idPreview" alt="ID Preview" class="w-full h-full object-contain" />
          <button
            @click="removeId"
            class="absolute top-3 right-3 bg-white/90 text-[#3ED400] rounded-full p-2 shadow-lg hover:bg-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Upload Area -->
        <div v-else class="relative rounded-2xl border-2 border-dashed border-[#A8EB12] bg-[#F8FFF0] h-48 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#74E600] hover:bg-white/90">
          <label for="id-upload" class="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
            <svg class="w-12 h-12 mb-3 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="text-sm font-semibold text-gray-700 mb-1">Click or drag to upload</p>
            <p class="text-[11px] text-gray-500">PNG / JPG / PDF • max 5MB</p>
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
        <div v-if="error" class="p-3 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-600 shadow-inner">
          {{ error }}
        </div>

        <!-- Upload Progress -->
        <div v-if="uploading" class="space-y-2">
          <div class="w-full rounded-full h-2.5 bg-[#E8F5E9] overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-[#A8EB12] via-[#74E600] to-[#00C851] transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-[12px] text-gray-600 text-center font-semibold tracking-wide">
            Uploading {{ uploadProgress }}%
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center sm:items-stretch gap-3">
          <button
            @click="handleUpload"
            :disabled="!idFile || uploading"
            class="flex-1 px-5 py-3 rounded-2xl font-bold text-sm text-[#0A2A0F] bg-gradient-to-r from-[#A8EB12] via-[#74E600] to-[#3ED400] shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {{ uploading ? 'Uploading...' : 'Upload ID' }}
          </button>
          <button
            @click="handleCancel"
            class="flex-1 px-5 py-3 rounded-2xl text-sm font-semibold text-[#3ED400] border border-[#3ED400]/40 hover:border-[#3ED400] hover:text-[#0A2A0F] transition-all bg-white/80 shadow-sm active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
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

<style scoped>
.validid-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at top right, rgba(58, 240, 137, 0.25), transparent 60%);
  z-index: 0;
}
.validid-card > div:first-child {
  position: relative;
  z-index: 1;
}
.animate-glow {
  animation: glow 10s ease-in-out infinite;
}
@keyframes glow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
</style>

