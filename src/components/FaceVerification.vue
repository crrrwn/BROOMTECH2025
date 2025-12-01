<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Face Verification</h3>
      <p class="text-gray-600 mb-4">
        Please position your face in front of the camera to verify your identity.
      </p>

      <div class="relative mb-4" style="aspect-ratio: 4/3;">
        <video
          ref="videoElement"
          autoplay
          playsinline
          class="w-full h-full object-cover rounded-lg bg-gray-900"
          style="transform: scaleX(-1);"
        ></video>
        <canvas ref="canvasElement" class="hidden"></canvas>
        
        <!-- Circular Overlay (like GCash) - creates new circle for verification -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="relative w-64 h-64">
            <!-- Outer circle guide -->
            <div class="absolute inset-0 rounded-full border-4 border-white opacity-50"></div>
            <!-- Inner circle for face alignment - changes color based on verification status -->
            <div 
              class="absolute inset-4 rounded-full border-2 transition-colors" 
              :class="faceDetected ? (verifying ? 'border-blue-500 animate-pulse' : 'border-green-500') : 'border-gray-400'"
            ></div>
            <!-- Center dot -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        <!-- Face detection status -->
        <div v-if="faceDetected && !detecting && !verifying" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          ✓ Face Detected
        </div>

        <div v-if="detecting" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div class="text-white text-center">
            <svg class="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm">Detecting face...</p>
          </div>
        </div>

        <div v-if="verifying" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div class="text-white text-center">
            <svg class="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm">Matching face...</p>
          </div>
        </div>
      </div>

      <!-- Attempts counter -->
      <div v-if="verificationAttempts > 0 && verificationAttempts < 3" class="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        Verification failed. Attempt {{ verificationAttempts }} of 3. Please try again.
      </div>

      <!-- Cooldown countdown -->
      <div v-if="showCooldown" class="mb-4 p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded text-center">
        <p class="font-semibold mb-2">Too many failed attempts</p>
        <p class="text-lg">Please wait <span class="font-bold">{{ formatTime(cooldownSeconds) }}</span> before trying again.</p>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Auto-verification status -->
      <div v-if="faceDetected && !verifying && !showCooldown" class="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-center">
        <p class="font-semibold">Face detected! Verification will start automatically...</p>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <!-- Keep button as fallback but hide it when auto-verifying -->
        <button
          v-if="!faceDetected || showCooldown"
          @click="handleVerify"
          :disabled="!faceDetected || verifying || showCooldown || verificationAttempts >= 3"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ verifying ? 'Verifying...' : 'Verify Face' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { detectFace, getFaceDescriptor, loadModels, compareFaces } from '@/services/faceRecognitionService'

const props = defineProps({
  registeredDescriptor: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['verified', 'failed', 'cancel'])

const videoElement = ref(null)
const canvasElement = ref(null)
const faceDetected = ref(false)
const detecting = ref(false)
const verifying = ref(false)
const error = ref('')
const verificationAttempts = ref(0)
const showCooldown = ref(false)
const cooldownSeconds = ref(120) // 2 minutes
let stream = null
let detectionInterval = null
let cooldownInterval = null
let autoVerifyTimeout = null
let faceDetectedCount = ref(0) // Count consecutive detections for stability
let currentDescriptor = null

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(async () => {
  try {
    // Load models first
    const loaded = await loadModels()
    if (!loaded) {
      error.value = 'Failed to load face recognition models. Please refresh the page.'
      return
    }

    // Start camera
    stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: 640, 
        height: 480,
        facingMode: 'user'
      }
    })

    if (videoElement.value) {
      videoElement.value.srcObject = stream
    }

    // Start face detection
    startDetection()
  } catch (err) {
    console.error('Error accessing camera:', err)
    error.value = 'Failed to access camera. Please ensure camera permissions are granted.'
  }
})

onUnmounted(() => {
  stopCamera()
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
  if (autoVerifyTimeout) {
    clearTimeout(autoVerifyTimeout)
    autoVerifyTimeout = null
  }
})

const startDetection = () => {
  detectionInterval = setInterval(async () => {
    if (!videoElement.value || detecting.value || verifying.value || showCooldown.value) return

    try {
      detecting.value = true
      const detection = await detectFace(videoElement.value)
      
      if (detection) {
        faceDetected.value = true
        currentDescriptor = getFaceDescriptor(detection)
        faceDetectedCount.value++
        
        // Auto-verify after face is detected for 2 seconds (4 consecutive detections at 500ms interval)
        if (faceDetectedCount.value >= 4 && !verifying.value && !autoVerifyTimeout) {
          autoVerifyTimeout = setTimeout(() => {
            if (currentDescriptor && !verifying.value && !showCooldown.value) {
              handleVerify()
            }
          }, 500) // Small delay to ensure stability
        }
      } else {
        faceDetected.value = false
        currentDescriptor = null
        faceDetectedCount.value = 0
        // Clear auto-verify timeout if face is lost
        if (autoVerifyTimeout) {
          clearTimeout(autoVerifyTimeout)
          autoVerifyTimeout = null
        }
      }
    } catch (err) {
      console.error('Detection error:', err)
      faceDetected.value = false
      faceDetectedCount.value = 0
      if (autoVerifyTimeout) {
        clearTimeout(autoVerifyTimeout)
        autoVerifyTimeout = null
      }
    } finally {
      detecting.value = false
    }
  }, 500) // Check every 500ms
}

const stopCamera = () => {
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }
  
  if (autoVerifyTimeout) {
    clearTimeout(autoVerifyTimeout)
    autoVerifyTimeout = null
  }
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
}

const startCooldown = () => {
  showCooldown.value = true
  cooldownSeconds.value = 120 // 2 minutes

  cooldownInterval = setInterval(() => {
    cooldownSeconds.value--
    if (cooldownSeconds.value <= 0) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
      showCooldown.value = false
      verificationAttempts.value = 0 // Reset attempts after cooldown
      error.value = ''
    }
  }, 1000)
}

const handleVerify = async () => {
  if (!currentDescriptor) {
    error.value = 'Please ensure your face is clearly visible in the camera.'
    return
  }

  if (verificationAttempts.value >= 3) {
    if (!showCooldown.value) {
      startCooldown()
      error.value = 'Maximum verification attempts reached. Please wait 2 minutes before trying again.'
    }
    return
  }

  // Prevent multiple simultaneous verifications
  if (verifying.value) {
    return
  }

  verifying.value = true
  error.value = ''
  faceDetectedCount.value = 0 // Reset count after verification attempt
  if (autoVerifyTimeout) {
    clearTimeout(autoVerifyTimeout)
    autoVerifyTimeout = null
  }

  try {
    // Ensure descriptors are Float32Array for comparison
    const registeredDesc = props.registeredDescriptor instanceof Float32Array 
      ? props.registeredDescriptor 
      : new Float32Array(props.registeredDescriptor)
    const currentDesc = currentDescriptor instanceof Float32Array
      ? currentDescriptor
      : new Float32Array(currentDescriptor)

    // Compare faces
    const match = compareFaces(registeredDesc, currentDesc, 0.6)

    if (match) {
      // Face matches - reset attempts on success
      verificationAttempts.value = 0
      emit('verified')
    } else {
      // Face doesn't match
      verificationAttempts.value++
      if (verificationAttempts.value >= 3) {
        error.value = 'Face verification failed after 3 attempts. Please wait 2 minutes before trying again.'
        startCooldown()
        emit('failed', verificationAttempts.value)
      } else {
        error.value = 'Face does not match. Please try again.'
        // Reset face detection count to allow retry
        faceDetectedCount.value = 0
      }
    }
  } catch (err) {
    console.error('Verification error:', err)
    verificationAttempts.value++
    if (verificationAttempts.value >= 3) {
      error.value = 'Verification failed after 3 attempts. Please wait 2 minutes before trying again.'
      startCooldown()
      emit('failed', verificationAttempts.value)
    } else {
      error.value = 'Failed to verify face. Please try again.'
      // Reset face detection count to allow retry
      faceDetectedCount.value = 0
    }
  } finally {
    verifying.value = false
  }
}

const handleCancel = () => {
  stopCamera()
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
  emit('cancel')
}
</script>

