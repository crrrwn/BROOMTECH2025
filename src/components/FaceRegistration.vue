<template>
  <div class="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6" @click="showTryAgain && !showCooldown ? handleTryAgain() : null">
    <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 transform transition-all duration-300 scale-100" style="box-shadow: 0 20px 60px rgba(0, 200, 81, 0.15);">
      <!-- Header -->
      <div class="mb-4 sm:mb-6">
        <h3 class="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] bg-clip-text text-transparent">
          Face Registration
        </h3>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
          Please position your face in front of the camera. Make sure you have good lighting and your face is clearly visible.
        </p>
      </div>

      <!-- Camera Container -->
      <div class="relative mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg" style="aspect-ratio: 4/3; background: linear-gradient(135deg, #00C851 0%, #3ED400 50%, #74E600 100%);">
        <video
          ref="videoElement"
          autoplay
          playsinline
          class="w-full h-full object-cover"
          style="transform: scaleX(-1);"
        ></video>
        <canvas ref="canvasElement" class="hidden"></canvas>
        
        <!-- Circular Overlay (like GCash) -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="relative w-48 h-48 sm:w-64 sm:h-64">
            <!-- Outer circle guide with glow -->
            <div class="absolute inset-0 rounded-full border-4 border-white/60 shadow-lg" style="box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);"></div>
            <!-- Inner circle for face alignment with animated border -->
            <div 
              class="absolute inset-4 rounded-full transition-all duration-500 shadow-lg"
              :class="faceDetected ? 'border-[#74E600]' : 'border-white/40'"
              :style="`border: 3px solid ${faceDetected ? '#74E600' : 'rgba(255, 255, 255, 0.4)'}; ${faceDetected ? 'box-shadow: 0 0 30px rgba(116, 230, 0, 0.6), 0 0 60px rgba(116, 230, 0, 0.3);' : ''}`"
            ></div>
            <!-- Animated center dot -->
            <div 
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
              :class="faceDetected ? 'bg-[#74E600] shadow-lg' : 'bg-white'"
              :style="faceDetected ? 'box-shadow: 0 0 15px rgba(116, 230, 0, 0.8), 0 0 30px rgba(116, 230, 0, 0.4);' : ''"
            ></div>
          </div>
        </div>

        <!-- Liveness check status -->
        <div v-if="!livenessChecked && !faceDetectedOnce && !showTryAgain" class="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#3ED400] to-[#74E600] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-sm animate-pulse" style="box-shadow: 0 4px 15px rgba(62, 212, 0, 0.5);">
          <span class="flex items-center gap-2">
            <span>🔍</span>
            <span>Checking liveness...</span>
          </span>
        </div>

        <!-- Face detection status - only show once, don't blink -->
        <div v-if="faceDetectedOnce && !registering && !showTryAgain" class="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2" style="box-shadow: 0 4px 20px rgba(0, 200, 81, 0.6); animation: slideDown 0.3s ease-out;">
          <span class="text-base sm:text-lg">✓</span>
          <span>Face Detected</span>
        </div>

        <!-- Face Scan Progress Ring -->
        <div v-if="detecting" class="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl">
          <div class="relative w-48 h-48 sm:w-64 sm:h-64">
            <!-- Scanning Circle Progress Ring -->
            <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                stroke-width="4"
              />
              <!-- Progress circle with gradient -->
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="283"
                :stroke-dashoffset="283 - (scanProgress * 283 / 100)"
                class="transition-all duration-300"
                style="filter: drop-shadow(0 0 8px rgba(116, 230, 0, 0.6));"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#A8EB12;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#74E600;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#3ED400;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
            <!-- Center text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div class="relative w-10 h-10 sm:w-12 sm:h-12 mb-2">
                <svg class="absolute inset-0 w-full h-full animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="stroke: #74E600;"></path>
                </svg>
              </div>
              <p class="text-xs sm:text-sm font-semibold">Scanning Face...</p>
              <p class="text-[10px] sm:text-xs mt-1 opacity-90 font-bold" style="color: #74E600;">{{ Math.round(scanProgress) }}%</p>
            </div>
          </div>
        </div>

        <!-- Registration Loading Circle -->
        <div v-if="registering" class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl sm:rounded-2xl">
          <div class="text-white text-center">
            <div class="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
              <!-- Spinning circle ring -->
              <svg class="absolute inset-0 w-full h-full transform -rotate-90 animate-spin" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#registerGradient)"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-dasharray="283"
                  stroke-dashoffset="70"
                  style="filter: drop-shadow(0 0 10px rgba(116, 230, 0, 0.8));"
                />
              </svg>
              <defs>
                <linearGradient id="registerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#A8EB12;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#00C851;stop-opacity:1" />
                </linearGradient>
              </defs>
              <!-- Center icon -->
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="h-8 w-8 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: #74E600;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p class="text-xs sm:text-sm font-semibold">Registering Face...</p>
          </div>
        </div>
      </div>

      <!-- Attempts counter -->
      <div v-if="registrationAttempts > 0 && registrationAttempts < 3 && !showCooldown" class="mb-4 p-3 sm:p-4 bg-gradient-to-r from-[#A8EB12]/10 to-[#74E600]/10 border-2 border-[#74E600]/30 rounded-xl sm:rounded-2xl backdrop-blur-sm">
        <p class="mb-3 text-sm sm:text-base font-medium text-gray-700">Registration failed. Attempt <span class="font-bold" style="color: #3ED400;">{{ registrationAttempts }}</span> of 3. Please try again.</p>
        <button
          @click="handleTryAgain"
          class="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:from-[#3ED400] hover:to-[#00C851] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          style="box-shadow: 0 4px 15px rgba(116, 230, 0, 0.4);"
        >
          Try Again
        </button>
      </div>

      <!-- Face detection failed message -->
      <div v-if="error && error.includes('Failed to register') && registrationAttempts < 3 && !showCooldown" class="mb-4 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300/50 rounded-xl sm:rounded-2xl backdrop-blur-sm">
        <p class="mb-3 text-sm sm:text-base font-medium text-red-700">Face detection failed. Attempt <span class="font-bold text-red-800">{{ registrationAttempts }}</span> of 3. Please try again.</p>
        <button
          @click="handleTryAgain"
          class="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>

      <!-- Cooldown countdown -->
      <div v-if="showCooldown" class="mb-4 p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300/50 rounded-xl sm:rounded-2xl text-center backdrop-blur-sm">
        <p class="font-bold text-base sm:text-lg mb-2 text-orange-800">Too many failed attempts</p>
        <p class="text-sm sm:text-base text-orange-700">Please wait <span class="font-bold text-lg sm:text-xl" style="color: #00C851;">{{ formatTime(cooldownSeconds) }}</span> before trying again.</p>
      </div>

      <!-- Error message -->
      <div v-if="error && !error.includes('Failed to register') && registrationAttempts < 3 && !showCooldown" class="mb-4 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-xl sm:rounded-2xl backdrop-blur-sm">
        <p class="text-sm sm:text-base text-red-700 font-medium">{{ error }}</p>
      </div>

      <!-- Auto-registration status -->
      <div v-if="faceDetected && !registering && !showCooldown" class="mb-4 p-3 sm:p-4 bg-gradient-to-r from-[#A8EB12]/20 via-[#74E600]/20 to-[#3ED400]/20 border-2 border-[#74E600]/40 rounded-xl sm:rounded-2xl text-center backdrop-blur-sm animate-pulse">
        <p class="font-semibold text-sm sm:text-base" style="color: #00C851;">
          <span class="inline-block mr-2">✨</span>
          Face detected! Registration will start automatically...
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 sm:space-x-4">
        <button
          @click="handleCancel"
          class="px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
      
      <!-- Tap to retry hint -->
      <div v-if="showTryAgain && !showCooldown" class="mt-4 sm:mt-5 text-center">
        <p class="text-xs sm:text-sm text-gray-600 mb-2 font-medium">
          <span class="inline-block animate-bounce mr-2">👆</span>
          Tap anywhere on the screen to retry
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { detectFace, getFaceDescriptor, loadModels, detectFaceWithLiveness } from '@/services/faceRecognitionService'

const emit = defineEmits(['registered', 'failed', 'cancel'])

const videoElement = ref(null)
const canvasElement = ref(null)
const faceDetected = ref(false)
const detecting = ref(false)
const registering = ref(false)
const error = ref('')
const registrationAttempts = ref(0)
const showCooldown = ref(false)
const cooldownSeconds = ref(60) // 1 minute
const faceDetectedOnce = ref(false) // Track if face was detected at least once
const showTryAgain = ref(false) // Show try again button
let detectionStartTime = null // Track when detection started
const maxDetectionTime = 30000 // 30 seconds max to detect face
let detectionTimeout = null // Timeout for face detection
const scanProgress = ref(0) // Progress for scanning circle
let stream = null
let detectionInterval = null
let cooldownInterval = null
let autoRegisterTimeout = null
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:onMounted:start',message:'FaceRegistration component mounted',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B'})}).catch(()=>{});
  // #endregion
  try {
    // Load models first
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:onMounted:beforeLoadModels',message:'About to load face models',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const loaded = await loadModels()
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:onMounted:afterLoadModels',message:'Face models load result',data:{loaded},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (!loaded) {
      error.value = 'Failed to load face recognition models. Please refresh the page.'
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:onMounted:modelsLoadFailed',message:'Models failed to load',data:{loaded},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return
    }

    // Start camera
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:onMounted:beforeGetUserMedia',message:'About to request camera access',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: 640, 
        height: 480,
        facingMode: 'user'
      }
    })
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:onMounted:afterGetUserMedia',message:'Camera access granted',data:{hasStream:!!stream},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (videoElement.value) {
      videoElement.value.srcObject = stream
    }

    // Start face detection
    startDetection()
  } catch (err) {
    console.error('Error accessing camera:', err)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:onMounted:error',message:'Error in onMounted',data:{errorName:err.name,errorMessage:err.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B'})}).catch(()=>{});
    // #endregion
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
  // Stop detection if face is already detected and registered once
  if (faceDetectedOnce.value && !showTryAgain.value) return

  // Clear any existing interval first
  if (detectionInterval) {
    clearInterval(detectionInterval)
    detectionInterval = null
  }
  
  // Clear any existing timeout
  if (detectionTimeout) {
    clearTimeout(detectionTimeout)
    detectionTimeout = null
  }
  
  // Reset detection start time
  detectionStartTime = Date.now()
  
  // Set timeout for face detection - if no face detected in 30 seconds, show error
  detectionTimeout = setTimeout(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:detectionTimeout',message:'Detection timeout reached (30s)',data:{faceDetected:faceDetected.value,showCooldown:showCooldown.value,livenessChecked:livenessChecked.value,registrationAttempts:registrationAttempts.value},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (!faceDetected.value && !showCooldown.value) {
      registrationAttempts.value++
      if (registrationAttempts.value >= 3) {
        startCooldown()
        error.value = 'Face detection failed after multiple attempts. Please wait 1 minute before trying again.'
        emit('failed', registrationAttempts.value)
      } else {
        error.value = `Face detection failed. Attempt ${registrationAttempts.value} of 3. Please try again.`
        showTryAgain.value = true
      }
      // Stop detection
      if (detectionInterval) {
        clearInterval(detectionInterval)
        detectionInterval = null
      }
      if (scanProgressInterval) {
        clearInterval(scanProgressInterval)
        scanProgressInterval = null
      }
    }
  }, maxDetectionTime)

  detectionInterval = setInterval(async () => {
    // Stop detection once face is detected once and we're not in retry mode
    if ((faceDetectedOnce.value && !showTryAgain.value) || !videoElement.value || detecting.value || registering.value || showCooldown.value) {
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
          
          if (!liveness.isLive && previousDetections.length >= 2) {
            // Not a live face - block immediately
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:livenessCheckFailed',message:'Liveness check FAILED',data:{isLive:liveness.isLive,reason:liveness.reason,previousDetectionsCount:previousDetections.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            error.value = liveness.reason || 'Liveness check failed. Please use a live camera, not a photo.'
            showTryAgain.value = true
            faceDetected.value = false
            faceDetectedOnce.value = false
            currentDescriptor = null
            previousDetections = [] // Reset
            return
          }
          
          // If we have enough samples and it's live, mark as checked (reduced from 3 to 2 for faster scanning)
          if (liveness.isLive && previousDetections.length >= 2) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:livenessCheckPassed',message:'Liveness check PASSED',data:{isLive:liveness.isLive,reason:liveness.reason},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
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
          // Clear detection timeout on successful detection
          if (detectionTimeout) {
            clearTimeout(detectionTimeout)
            detectionTimeout = null
          }
          
          // Auto-register after face is detected (immediate for faster scanning)
          if (!registering.value && !autoRegisterTimeout) {
            autoRegisterTimeout = setTimeout(() => {
              if (currentDescriptor && !registering.value && !showCooldown.value && faceDetected.value) {
                handleRegister()
              }
            }, 300) // 300ms delay for faster scanning
          }
        }
      } else {
        // Face not detected - increment failure counter only if we've been trying for a while
        if (!showTryAgain.value && !faceDetectedOnce.value) {
          faceDetected.value = false
          currentDescriptor = null
          scanProgress.value = 0
          // Only count failures if we haven't detected a face yet
          // This prevents counting temporary face losses
        }
        // Clear auto-register timeout if face is lost
        if (autoRegisterTimeout) {
          clearTimeout(autoRegisterTimeout)
          autoRegisterTimeout = null
        }
      }
    } catch (err) {
      console.error('Detection error:', err)
      if (!showTryAgain.value) {
        faceDetected.value = false
        scanProgress.value = 0
      }
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
  }, 150) // Check every 150ms for faster scanning
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
  
  if (detectionTimeout) {
    clearTimeout(detectionTimeout)
    detectionTimeout = null
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
      registrationAttempts.value = 0 // Reset attempts after cooldown
      error.value = ''
      faceDetectedOnce.value = false
      faceDetected.value = false
      livenessChecked.value = false // Reset liveness check
      livenessStatus.value = ''
      currentDescriptor = null
      previousDetections = [] // Reset previous detections
      if (detectionTimeout) {
        clearTimeout(detectionTimeout)
        detectionTimeout = null
      }
      // Restart detection after cooldown
      startDetection()
    }
  }, 1000)
}

const handleRegister = async () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:handleRegister:start',message:'handleRegister called',data:{hasDescriptor:!!currentDescriptor,registrationAttempts:registrationAttempts.value,registering:registering.value},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  if (!currentDescriptor) {
    error.value = 'Please ensure your face is clearly visible in the camera.'
    return
  }

  if (registrationAttempts.value >= 3) {
    if (!showCooldown.value) {
      startCooldown()
      error.value = 'Maximum registration attempts reached. Please wait 1 minute before trying again.'
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
    // Capture face image from canvas
    let faceImageUrl = null
    if (canvasElement.value && videoElement.value) {
      const canvas = canvasElement.value
      const video = videoElement.value
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.scale(-1, 1) // Mirror the image
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
      faceImageUrl = canvas.toDataURL('image/jpeg', 0.9)
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:handleRegister:emitting',message:'Emitting registered event',data:{descriptorLength:currentDescriptor?.length,hasFaceImage:!!faceImageUrl},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    // Emit the descriptor and face image to parent component
    emit('registered', { descriptor: currentDescriptor, faceImage: faceImageUrl })
    // Reset attempts on success
    registrationAttempts.value = 0
  } catch (err) {
    console.error('Registration error:', err)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/aa4d712d-7c8c-4968-903e-1afa9f9920b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FaceRegistration.vue:handleRegister:error',message:'Registration error',data:{errorName:err.name,errorMessage:err.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    registrationAttempts.value++
    
    if (registrationAttempts.value >= 3) {
      error.value = 'Registration failed after 3 attempts. Please wait 1 minute before trying again.'
      startCooldown()
      // Emit failed event with attempt count
      emit('failed', registrationAttempts.value)
    } else {
      error.value = `Failed to register face. Attempt ${registrationAttempts.value} of 3. Please try again.`
      showTryAgain.value = true
      // Emit failed event for each failed attempt
      emit('failed', registrationAttempts.value)
      // Don't restart detection automatically - wait for user to click Try Again
      faceDetected.value = false
      currentDescriptor = null
    }
  } finally {
    registering.value = false
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
  if (autoRegisterTimeout) {
    clearTimeout(autoRegisterTimeout)
    autoRegisterTimeout = null
  }
  if (detectionTimeout) {
    clearTimeout(detectionTimeout)
    detectionTimeout = null
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
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(116, 230, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(116, 230, 0, 0.8);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .fixed {
    padding: 0.75rem;
  }
  
  .rounded-2xl {
    border-radius: 1rem;
  }
  
  .rounded-3xl {
    border-radius: 1.25rem;
  }
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth scale animations */
.scale-100 {
  transform: scale(1);
}

/* Enhanced shadow effects */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Responsive text sizes */
@media (max-width: 480px) {
  h3 {
    font-size: 1.5rem;
  }
  
  p {
    font-size: 0.875rem;
  }
}

/* Smooth gradient transitions */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Ensure video element maintains aspect ratio */
video {
  min-height: 100%;
  min-width: 100%;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Pulse animation for status indicators */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Bounce animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>

