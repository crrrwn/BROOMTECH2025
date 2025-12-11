<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md" @click="showTryAgain && !showCooldown ? handleTryAgain() : null">
    
    <div class="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden transform transition-all">
      
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#3ED400] to-[#A8EB12]"></div>

      <div class="p-8 text-center">
        <h3 class="text-2xl font-black text-gray-800 mb-2">Face Verification</h3>
        <p class="text-sm text-gray-500 mb-6 font-medium">Please look at the camera to verify identity.</p>

        <div class="relative w-full aspect-[4/3] mx-auto mb-6 rounded-3xl overflow-hidden border-4 border-gray-100 shadow-inner bg-gray-900 group">
          
          <video
            ref="videoElement"
            autoplay
            playsinline
            class="w-full h-full object-cover transform scale-x-[-1]"
          ></video>
          <canvas ref="canvasElement" class="hidden"></canvas>
          
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="relative w-64 h-64">
              <div class="absolute inset-0 rounded-full border-[3px] border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
              
              <div 
                class="absolute inset-2 rounded-full border-[3px] transition-all duration-300"
                :class="faceDetected ? (verifying ? 'border-blue-400 shadow-[0_0_30px_#60A5FA] animate-pulse' : 'border-[#3ED400] shadow-[0_0_30px_#3ED400]') : 'border-white/60 border-dashed'"
              ></div>
              
              <div v-if="detecting && !faceDetectedOnce" class="absolute inset-0 rounded-full overflow-hidden opacity-30">
                 <div class="w-full h-2 bg-[#3ED400] absolute top-0 animate-scan shadow-[0_0_15px_#3ED400]"></div>
              </div>

              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/80 rounded-full"></div>
            </div>
          </div>

          <div v-if="!livenessChecked && !faceDetectedOnce && !showTryAgain && detecting" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
            <svg class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            CHECKING LIVENESS
          </div>

          <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-50" enter-to-class="opacity-100 scale-100">
            <div v-if="faceDetectedOnce && !verifying && !showTryAgain" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md text-[#00C851] px-5 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              FACE DETECTED
            </div>
          </transition>

          <div v-if="(verifying) || (detecting && !livenessChecked && !faceDetectedOnce)" class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity">
            <div v-if="verifying">
                <svg class="animate-spin h-10 w-10 text-white mb-3" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-white text-xs font-bold tracking-widest uppercase shadow-black drop-shadow-md">
                  Verifying...
                </p>
            </div>
          </div>
          
          <div v-if="showTryAgain && !showCooldown" class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] cursor-pointer" @click="handleTryAgain">
             <svg class="w-12 h-12 text-white mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
             <p class="text-white text-sm font-bold uppercase tracking-wider">Tap to Retry</p>
          </div>
        </div>

        <div class="min-h-[80px] flex flex-col justify-center mb-4">
          
          <div v-if="verificationAttempts > 0 && verificationAttempts < 3 && !showCooldown" class="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-xs font-medium flex items-center justify-center gap-2 animate-pulse">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Match failed. Attempt {{ verificationAttempts }}/3. Try again.
          </div>

          <div v-if="showCooldown" class="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center shadow-inner">
            <p class="font-bold text-sm mb-1">Too many attempts</p>
            <p class="text-xs opacity-80">Please wait</p>
            <p class="text-2xl font-black mt-1">{{ formatTime(cooldownSeconds) }}</p>
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
            {{ error }}
          </div>

          <div v-if="faceDetectedOnce && !verifying && !showCooldown && !error && !showTryAgain" class="text-blue-500 text-sm font-bold animate-pulse flex justify-center items-center gap-2">
              Verifying automatically...
          </div>
          
           <div v-if="showTryAgain && !showCooldown" class="text-gray-400 text-xs font-medium animate-bounce">
            Tap the screen or click below to retry
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            @click="handleCancel"
            class="flex-1 py-3.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          <button
            v-if="(!faceDetected || showCooldown) && !showTryAgain"
            @click="handleVerify"
            :disabled="!faceDetected || verifying || showCooldown || verificationAttempts >= 3"
            class="flex-1 py-3.5 bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <span v-if="verifying" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ verifying ? 'Verifying...' : 'Verify' }}
          </button>

           <button
            v-if="showTryAgain && !showCooldown"
            @click="handleTryAgain"
            class="flex-1 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            Try Again
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// --- LOGIC MO (EXACTLY AS PROVIDED IN CODE 2) ---
import { ref, onMounted, onUnmounted } from 'vue'
import { detectFace, getFaceDescriptor, loadModels, compareFaces, detectFaceWithLiveness } from '@/services/faceRecognitionService'

const props = defineProps({
  registeredDescriptor: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['verified', 'failed', 'cancel', 'signout'])

const videoElement = ref(null)
const canvasElement = ref(null)
const faceDetected = ref(false)
const detecting = ref(false)
const verifying = ref(false)
const error = ref('')
const verificationAttempts = ref(0)
const showCooldown = ref(false)
const cooldownSeconds = ref(60) // 1 minute
const faceDetectedOnce = ref(false) // Track if face was detected at least once
const showTryAgain = ref(false) // Show try again button
const scanProgress = ref(0) // Progress for scanning circle
let stream = null
let detectionInterval = null
let cooldownInterval = null
let autoVerifyTimeout = null
let currentDescriptor = null
let scanProgressInterval = null
let previousDetections = [] // Store previous detections for liveness check
const livenessChecked = ref(false) // Track if liveness has been verified
const livenessStatus = ref('') // Liveness status message

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
  // Stop detection if face is already detected and verified once
  if (faceDetectedOnce.value && !showTryAgain.value) return

  // Clear any existing interval first
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }

  detectionInterval = setInterval(async () => {
    // Stop detection once face is detected once and we're not in retry mode
    if ((faceDetectedOnce.value && !showTryAgain.value) || !videoElement.value || detecting.value || verifying.value || showCooldown.value) {
      if (faceDetectedOnce.value && !showTryAgain.value && detectionInterval) {
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

      // Use liveness detection
      const result = await detectFaceWithLiveness(videoElement.value, previousDetections)
      const detection = result.detection
      const liveness = result.liveness
      
      if (detection) {
        // Store detection for liveness tracking (keep last 5)
        previousDetections.push(detection)
        if (previousDetections.length > 5) {
          previousDetections.shift()
        }

        // Check liveness first
        if (!livenessChecked.value) {
          livenessStatus.value = liveness.reason
          
          if (!liveness.isLive && previousDetections.length >= 3) {
            // Not a live face - block immediately
            error.value = liveness.reason || 'Liveness check failed. Please use a live camera, not a photo.'
            showTryAgain.value = true
            faceDetected.value = false
            faceDetectedOnce.value = false
            currentDescriptor = null
            previousDetections = [] // Reset
            return
          }
          
          // If we have enough samples and it's live, mark as checked
          if (liveness.isLive && previousDetections.length >= 3) {
            livenessChecked.value = true
            livenessStatus.value = 'Live face verified'
          }
        }

        // Only process if we haven't detected once already (prevent blinking) and liveness is checked
        if (!faceDetectedOnce.value && livenessChecked.value) {
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
          faceDetectedOnce.value = true
          currentDescriptor = getFaceDescriptor(detection)
          showTryAgain.value = false
          
          // Auto-verify after face is detected (wait 2 seconds for stability)
          if (!verifying.value && !autoVerifyTimeout) {
            autoVerifyTimeout = setTimeout(() => {
              if (currentDescriptor && !verifying.value && !showCooldown.value && faceDetected.value) {
                handleVerify()
              }
            }, 2000) // 2 second delay to ensure face is stable
          }
        }
      } else {
        // Only reset if we're not in a retry state and haven't detected once
        if (!showTryAgain.value && !faceDetectedOnce.value) {
          faceDetected.value = false
          currentDescriptor = null
          scanProgress.value = 0
        }
        // Don't clear auto-verify timeout if face is already detected once
        // This prevents blinking when face is temporarily lost
      }
    } catch (err) {
      console.error('Detection error:', err)
      if (!showTryAgain.value) {
        faceDetected.value = false
        scanProgress.value = 0
      }
      if (autoVerifyTimeout) {
        clearTimeout(autoVerifyTimeout)
        autoVerifyTimeout = null
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
  cooldownSeconds.value = 60 // 1 minute
  showTryAgain.value = false

  cooldownInterval = setInterval(() => {
    cooldownSeconds.value--
    if (cooldownSeconds.value <= 0) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
      showCooldown.value = false
      verificationAttempts.value = 0 // Reset attempts after cooldown
      error.value = ''
      faceDetectedOnce.value = false
      faceDetected.value = false
      livenessChecked.value = false // Reset liveness check
      livenessStatus.value = ''
      currentDescriptor = null
      showTryAgain.value = false
      previousDetections = [] // Reset previous detections
      // Restart detection after cooldown
      startDetection()
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
      error.value = 'Maximum verification attempts reached. Please wait 1 minute before trying again.'
    }
    return
  }

  // Prevent multiple simultaneous verifications
  if (verifying.value) {
    return
  }

  verifying.value = true
  error.value = ''
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

    // Compare faces - STRICT MATCHING (lower threshold = stricter)
    // Threshold 0.5 is stricter than 0.6 - requires closer match
    const match = compareFaces(registeredDesc, currentDesc, 0.5)

    if (match) {
      // Face matches - reset attempts on success
      verificationAttempts.value = 0
      emit('verified')
    } else {
      // Face doesn't match - block login immediately
      verificationAttempts.value++
      if (verificationAttempts.value >= 3) {
        error.value = 'Face verification failed after 3 attempts. Access denied. Please log in again.'
        startCooldown()
        emit('failed', verificationAttempts.value)
        // Sign out user immediately since face doesn't match - BLOCK LOGIN
        emit('signout')
      } else {
        error.value = `Face does not match registered face. Attempt ${verificationAttempts.value} of 3. Please try again.`
        showTryAgain.value = true
        faceDetected.value = false
        faceDetectedOnce.value = false // Reset so they can try again
        livenessChecked.value = false // Reset liveness check
        livenessStatus.value = ''
        currentDescriptor = null
        previousDetections = [] // Reset previous detections
        // Don't restart detection automatically - wait for user to click Try Again
      }
    }
  } catch (err) {
    console.error('Verification error:', err)
    verificationAttempts.value++
    if (verificationAttempts.value >= 3) {
      error.value = 'Verification failed after 3 attempts. Access denied. Please log in again.'
      startCooldown()
      emit('failed', verificationAttempts.value)
      // Sign out user on error - BLOCK LOGIN
      emit('signout')
    } else {
      error.value = `Verification failed. Attempt ${verificationAttempts.value} of 3. Please try again.`
      showTryAgain.value = true
      faceDetected.value = false
      faceDetectedOnce.value = false // Reset so they can try again
      livenessChecked.value = false // Reset liveness check
      livenessStatus.value = ''
      currentDescriptor = null
      previousDetections = [] // Reset previous detections
      // Don't restart detection automatically - wait for user to click Try Again
    }
  } finally {
    verifying.value = false
  }
}

const handleTryAgain = () => {
  showTryAgain.value = false
  error.value = ''
  faceDetected.value = false
  faceDetectedOnce.value = false // Reset to allow new detection
  livenessChecked.value = false // Reset liveness check
  livenessStatus.value = ''
  currentDescriptor = null
  previousDetections = [] // Reset previous detections
  if (autoVerifyTimeout) {
    clearTimeout(autoVerifyTimeout)
    autoVerifyTimeout = null
  }
  // Clear any existing detection interval before restarting
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }
  startDetection()
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

<style scoped>
/* COPIED CSS ANIMATION FROM DESIGN A */
@keyframes scan {
  0% { top: 0%; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.animate-scan {
  animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
</style>