import * as faceapi from 'face-api.js'

// Load models from CDN - using jsdelivr CDN for face-api.js models
// Alternative: Download models and place in public/models folder, then use '/models'
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'

let modelsLoaded = false
let loadingPromise = null

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

