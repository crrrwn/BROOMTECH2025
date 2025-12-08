<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Face Registration</h3>
      <p class="text-gray-600 mb-4">
        Please position your face in front of the camera. Make sure you have good lighting and your face is clearly visible.
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
        
        <!-- Circular Overlay (like GCash) -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="relative w-64 h-64">
            <!-- Outer circle guide -->
            <div class="absolute inset-0 rounded-full border-4 border-white opacity-50"></div>
            <!-- Inner circle for face alignment -->
            <div class="absolute inset-4 rounded-full border-2 border-green-400" :class="faceDetected ? 'border-green-500' : 'border-gray-400'"></div>
            <!-- Center dot -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        <!-- Face detection status -->
        <div v-if="faceDetected && !detecting && !registering" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          ✓ Face Detected
        </div>

        <!-- Face Scan Progress Ring -->
        <div v-if="detecting" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="relative w-64 h-64">
            <!-- Scanning Circle Progress Ring -->
            <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                stroke-width="4"
              />
              <!-- Progress circle -->
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgb(59, 130, 246)"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="283"
                :stroke-dashoffset="283 - (scanProgress * 283 / 100)"
                class="transition-all duration-300"
              />
            </svg>
            <!-- Center text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
              <svg class="animate-spin h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-sm font-semibold">Scanning Face...</p>
              <p class="text-xs mt-1 opacity-75">{{ Math.round(scanProgress) }}%</p>
            </div>
          </div>
        </div>

        <!-- Registration Loading Circle -->
        <div v-if="registering" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
          <div class="text-white text-center">
            <div class="relative w-32 h-32 mx-auto mb-4">
              <!-- Spinning circle ring -->
              <svg class="absolute inset-0 w-full h-full transform -rotate-90 animate-spin" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgb(59, 130, 246)"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-dasharray="283"
                  stroke-dashoffset="70"
                />
              </svg>
              <!-- Center icon -->
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p class="text-sm font-semibold">Registering Face...</p>
          </div>
        </div>
      </div>

      <!-- Attempts counter -->
      <div v-if="registrationAttempts > 0 && registrationAttempts < 3" class="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        Registration failed. Attempt {{ registrationAttempts }} of 3. Please try again.
      </div>

      <!-- Cooldown countdown -->
      <div v-if="showCooldown" class="mb-4 p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded text-center">
        <p class="font-semibold mb-2">Too many failed attempts</p>
        <p class="text-lg">Please wait <span class="font-bold">{{ formatTime(cooldownSeconds) }}</span> before trying again.</p>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Auto-registration status -->
      <div v-if="faceDetected && !registering && !showCooldown" class="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-center">
        <p class="font-semibold">Face detected! Registration will start automatically...</p>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <!-- Keep button as fallback but hide it when auto-registering -->
        <button
          v-if="!faceDetected || showCooldown"
          @click="handleRegister"
          :disabled="!faceDetected || registering || showCooldown || registrationAttempts >= 3"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ registering ? 'Registering...' : 'Register Face' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { detectFace, getFaceDescriptor, loadModels } from '@/services/faceRecognitionService'

const emit = defineEmits(['registered', 'failed', 'cancel'])

const videoElement = ref(null)
const canvasElement = ref(null)
const faceDetected = ref(false)
const detecting = ref(false)
const registering = ref(false)
const error = ref('')
const registrationAttempts = ref(0)
const showCooldown = ref(false)
const cooldownSeconds = ref(120) // 2 minutes
const scanProgress = ref(0) // Progress for scanning circle
let stream = null
let detectionInterval = null
let cooldownInterval = null
let autoRegisterTimeout = null
let currentDescriptor = null
let scanProgressInterval = null

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
  if (autoRegisterTimeout) {
    clearTimeout(autoRegisterTimeout)
    autoRegisterTimeout = null
  }
})

const startDetection = () => {
  // Stop detection if face is already detected
  if (faceDetected.value) return

  detectionInterval = setInterval(async () => {
    // Stop detection once face is detected
    if (faceDetected.value || !videoElement.value || detecting.value || registering.value || showCooldown.value) {
      if (faceDetected.value && detectionInterval) {
        clearInterval(detectionInterval)
        detectionInterval = null
        if (scanProgressInterval) {
          clearInterval(scanProgressInterval)
          scanProgressInterval = null
        }
        scanProgress.value = 0
      }
      return
    }

    try {
      detecting.value = true
      scanProgress.value = 0
      
      // Start progress animation
      if (scanProgressInterval) {
        clearInterval(scanProgressInterval)
      }
      scanProgressInterval = setInterval(() => {
        if (scanProgress.value < 100) {
          scanProgress.value += 2
        } else {
          clearInterval(scanProgressInterval)
          scanProgressInterval = null
        }
      }, 30)

      const detection = await detectFace(videoElement.value)
      
      if (detection) {
        // Stop detection interval - face detected, only detect once
        if (detectionInterval) {
          clearInterval(detectionInterval)
          detectionInterval = null
        }
        if (scanProgressInterval) {
          clearInterval(scanProgressInterval)
          scanProgressInterval = null
        }
        scanProgress.value = 100
        
        faceDetected.value = true
        currentDescriptor = getFaceDescriptor(detection)
        
        // Auto-register after face is detected (wait 2 seconds for stability)
        if (!registering.value && !autoRegisterTimeout) {
          autoRegisterTimeout = setTimeout(() => {
            if (currentDescriptor && !registering.value && !showCooldown.value && faceDetected.value) {
              handleRegister()
            }
          }, 2000) // 2 second delay to ensure face is stable
        }
      } else {
        faceDetected.value = false
        currentDescriptor = null
        scanProgress.value = 0
        // Clear auto-register timeout if face is lost
        if (autoRegisterTimeout) {
          clearTimeout(autoRegisterTimeout)
          autoRegisterTimeout = null
        }
      }
    } catch (err) {
      console.error('Detection error:', err)
      faceDetected.value = false
      scanProgress.value = 0
      if (autoRegisterTimeout) {
        clearTimeout(autoRegisterTimeout)
        autoRegisterTimeout = null
      }
    } finally {
      detecting.value = false
      if (scanProgressInterval) {
        clearInterval(scanProgressInterval)
        scanProgressInterval = null
      }
    }
  }, 500) // Check every 500ms
}

const stopCamera = () => {
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }
  
  if (scanProgressInterval) {
    clearInterval(scanProgressInterval)
    scanProgressInterval = null
  }
  
  if (autoRegisterTimeout) {
    clearTimeout(autoRegisterTimeout)
    autoRegisterTimeout = null
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
      registrationAttempts.value = 0 // Reset attempts after cooldown
      error.value = ''
    }
  }, 1000)
}

const handleRegister = async () => {
  if (!currentDescriptor) {
    error.value = 'Please ensure your face is clearly visible in the camera.'
    return
  }

  if (registrationAttempts.value >= 3) {
    if (!showCooldown.value) {
      startCooldown()
      error.value = 'Maximum registration attempts reached. Please wait 2 minutes before trying again.'
    }
    return
  }

  // Prevent multiple simultaneous registrations
  if (registering.value) {
    return
  }

  registering.value = true
  error.value = ''
  if (autoRegisterTimeout) {
    clearTimeout(autoRegisterTimeout)
    autoRegisterTimeout = null
  }

  try {
    // Emit the descriptor to parent component
    emit('registered', currentDescriptor)
    // Reset attempts on success
    registrationAttempts.value = 0
  } catch (err) {
    console.error('Registration error:', err)
    registrationAttempts.value++
    
    if (registrationAttempts.value >= 3) {
      error.value = 'Registration failed after 3 attempts. Please wait 2 minutes before trying again.'
      startCooldown()
      // Emit failed event with attempt count
      emit('failed', registrationAttempts.value)
    } else {
      error.value = 'Failed to register face. Please try again.'
      // Emit failed event for each failed attempt
      emit('failed', registrationAttempts.value)
      // Restart detection for retry
      faceDetected.value = false
      currentDescriptor = null
      startDetection()
    }
  } finally {
    registering.value = false
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

