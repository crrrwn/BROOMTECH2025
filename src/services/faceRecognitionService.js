import * as faceapi from 'face-api.js'

// Load models from CDN - using jsdelivr CDN for face-api.js models
// Alternative: Download models and place in public/models folder, then use '/models'
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'

let modelsLoaded = false
let loadingPromise = null

/** Detect if running on mobile (needed for camera constraints and detector options) */
export const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent)

/** Check if video element has valid dimensions and is ready (required on mobile) */
export const isVideoReady = (video) => {
  if (!video || !video.srcObject) return false
  return (
    video.readyState >= 2 &&
    typeof video.videoWidth === 'number' &&
    typeof video.videoHeight === 'number' &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  )
}

export const loadModels = async () => {
  if (modelsLoaded) return true
  
  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = (async () => {
    try {
      // Load models with error handling
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).catch(err => {
          console.error('Error loading tinyFaceDetector:', err)
          throw err
        }),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL).catch(err => {
          console.error('Error loading faceLandmark68Net:', err)
          throw err
        }),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL).catch(err => {
          console.error('Error loading faceRecognitionNet:', err)
          throw err
        })
      ])
      
      modelsLoaded = true
      loadingPromise = null
      return true
    } catch (error) {
      console.error('Error loading face-api models:', error)
      loadingPromise = null
      // Try alternative CDN if first one fails
      try {
        const ALT_MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/'
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(ALT_MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(ALT_MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(ALT_MODEL_URL)
        ])
        modelsLoaded = true
        loadingPromise = null
        return true
      } catch (altError) {
        console.error('Error loading from alternative CDN:', altError)
        loadingPromise = null
        return false
      }
    }
  })()

  return loadingPromise
}

export const detectFace = async (videoElement) => {
  if (!modelsLoaded) {
    const loaded = await loadModels()
    if (!loaded) {
      throw new Error('Failed to load face recognition models')
    }
  }

  const detection = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  return detection
}

export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
  if (!descriptor1 || !descriptor2) return false
  
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2)
  return distance < threshold
}

export const getFaceDescriptor = (detection) => {
  if (!detection || !detection.descriptor) return null
  return Array.from(detection.descriptor)
}

// Liveness detection - check if face is moving (prevents photo attacks)
// Real faces have slight movements, photos are static
export const checkLiveness = (currentDetection, previousDetections = []) => {
  if (!currentDetection || !currentDetection.landmarks) {
    return { isLive: false, reason: 'No face detected' }
  }

  // Get face bounding box center
  const currentBox = currentDetection.detection.box
  const currentCenter = {
    x: currentBox.x + currentBox.width / 2,
    y: currentBox.y + currentBox.height / 2
  }

  // Need at least 3 previous detections to check movement
  if (previousDetections.length < 3) {
    return { isLive: true, reason: 'Collecting samples' } // Still collecting, assume live
  }

  // Check if face position has changed (real faces move slightly)
  let totalMovement = 0
  for (let i = 0; i < previousDetections.length; i++) {
    const prevBox = previousDetections[i].detection.box
    const prevCenter = {
      x: prevBox.x + prevBox.width / 2,
      y: prevBox.y + prevBox.height / 2
    }
    
    const movement = Math.sqrt(
      Math.pow(currentCenter.x - prevCenter.x, 2) + 
      Math.pow(currentCenter.y - prevCenter.y, 2)
    )
    totalMovement += movement
  }

  const avgMovement = totalMovement / previousDetections.length
  const boxSize = Math.max(currentBox.width, currentBox.height)
  const movementRatio = avgMovement / boxSize

  // Real faces typically have 1-5% movement, photos have <0.5%
  // Also check if face size changes (real faces move closer/farther)
  let sizeVariation = 0
  for (let i = 0; i < previousDetections.length; i++) {
    const prevBox = previousDetections[i].detection.box
    const prevSize = Math.max(prevBox.width, prevBox.height)
    const currentSize = Math.max(currentBox.width, currentBox.height)
    sizeVariation += Math.abs(currentSize - prevSize) / prevSize
  }
  const avgSizeVariation = sizeVariation / previousDetections.length

  // Check landmarks for subtle changes (eye positions, etc.)
  const currentLandmarks = currentDetection.landmarks.positions
  let landmarkMovement = 0
  if (previousDetections.length > 0 && previousDetections[0].landmarks) {
    const prevLandmarks = previousDetections[0].landmarks.positions
    for (let i = 0; i < Math.min(currentLandmarks.length, prevLandmarks.length); i++) {
      const dx = currentLandmarks[i].x - prevLandmarks[i].x
      const dy = currentLandmarks[i].y - prevLandmarks[i].y
      landmarkMovement += Math.sqrt(dx * dx + dy * dy)
    }
    landmarkMovement = landmarkMovement / currentLandmarks.length
  }

  // Liveness criteria:
  // 1. Face position should have some movement (movementRatio > 0.3%)
  // 2. Face size should vary slightly (avgSizeVariation > 0.2%)
  // 3. Landmarks should show some movement (landmarkMovement > 1 pixel average)
  const isLive = movementRatio > 0.003 || avgSizeVariation > 0.002 || landmarkMovement > 1

  if (!isLive) {
    return { 
      isLive: false, 
      reason: 'No movement detected. Please ensure you are using a live camera, not a photo.',
      movementRatio,
      sizeVariation: avgSizeVariation,
      landmarkMovement
    }
  }

  return { 
    isLive: true, 
    reason: 'Live face detected',
    movementRatio,
    sizeVariation: avgSizeVariation,
    landmarkMovement
  }
}

// Enhanced face detection with liveness check
export const detectFaceWithLiveness = async (videoElement, previousDetections = []) => {
  if (!modelsLoaded) {
    const loaded = await loadModels()
    if (!loaded) {
      throw new Error('Failed to load face recognition models')
    }
  }
  if (!isVideoReady(videoElement)) {
    return { detection: null, liveness: { isLive: false, reason: 'Camera not ready' } }
  }

  const detection = await faceapi
    .detectSingleFace(videoElement, getDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (!detection) {
    return { detection: null, liveness: { isLive: false, reason: 'No face detected' } }
  }

  // Check liveness
  const liveness = checkLiveness(detection, previousDetections)

  return { detection, liveness }
}

