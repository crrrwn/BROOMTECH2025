<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full space-y-8">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Become a Driver</h2>
          <p class="text-gray-600 mt-2">Apply to join our driver network</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-8">
          <!-- Personal Information -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  id="fullName"
                  v-model="formData.fullName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label for="contact" class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  id="contact"
                  v-model="formData.contact"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your contact number"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Motorcycle Information -->
          <div class="bg-blue-50 p-6 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Motorcycle Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="motorcycleBrand" class="block text-sm font-medium text-gray-700 mb-2">Motorcycle Brand</label>
                <input
                  id="motorcycleBrand"
                  v-model="formData.motorcycleInfo.brand"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Honda, Yamaha, Kawasaki"
                />
              </div>
              <div>
                <label for="motorcycleModel" class="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  id="motorcycleModel"
                  v-model="formData.motorcycleInfo.model"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Click 150i, Mio i125"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label for="plateNumber" class="block text-sm font-medium text-gray-700 mb-2">Plate Number</label>
                <input
                  id="plateNumber"
                  v-model="formData.motorcycleInfo.plateNumber"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter plate number"
                />
              </div>
              <div>
                <label for="year" class="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  id="year"
                  v-model="formData.motorcycleInfo.year"
                  type="number"
                  required
                  min="2000"
                  max="2024"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
          </div>

          <!-- Experience & Availability -->
          <div class="bg-yellow-50 p-6 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Experience & Availability</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">Years of Driving Experience</label>
                <select
                  id="experience"
                  v-model="formData.experience"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                  v-model="formData.availability"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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

          <!-- Document Uploads -->
          <div class="bg-red-50 p-6 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Added file upload fields for required documents -->
              <div>
                <label for="license" class="block text-sm font-medium text-gray-700 mb-2">Driver's License</label>
                <input
                  id="license"
                  type="file"
                  accept="image/*,.pdf"
                  required
                  @change="handleFileUpload($event, 'license')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <p class="text-xs text-gray-500 mt-1">Upload clear photo of your driver's license</p>
              </div>
              <div>
                <label for="orcr" class="block text-sm font-medium text-gray-700 mb-2">OR/CR (Official Receipt/Certificate of Registration)</label>
                <input
                  id="orcr"
                  type="file"
                  accept="image/*,.pdf"
                  required
                  @change="handleFileUpload($event, 'orcr')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <p class="text-xs text-gray-500 mt-1">Upload motorcycle OR/CR documents</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label for="selfie" class="block text-sm font-medium text-gray-700 mb-2">Selfie with License</label>
                <input
                  id="selfie"
                  type="file"
                  accept="image/*"
                  required
                  @change="handleFileUpload($event, 'selfie')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <p class="text-xs text-gray-500 mt-1">Take a selfie holding your driver's license</p>
              </div>
              <div>
                <label for="profilePicture" class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  required
                  @change="handleFileUpload($event, 'profilePicture')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <p class="text-xs text-gray-500 mt-1">Upload a clear profile photo</p>
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="formData.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" class="text-green-600 hover:text-green-500">Terms and Conditions</a> 
              and <a href="#" class="text-green-600 hover:text-green-500">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Application...
            </span>
            <span v-else>Submit Driver Application</span>
          </button>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have a driver account?
              <router-link to="/driver/login" class="text-green-600 hover:text-green-500 font-medium">
                Sign in here
              </router-link>
            </p>
          </div>

          <div class="text-center">
            <router-link to="/register" class="text-sm text-gray-500 hover:text-gray-700">
              ← Register as regular user instead
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'DriverRegister',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    
    const showPassword = ref(false)
    const loading = ref(false)
    
    const formData = reactive({
      fullName: '',
      contact: '',
      email: '',
      password: '',
      motorcycleInfo: {
        brand: '',
        model: '',
        plateNumber: '',
        year: ''
      },
      experience: '',
      availability: '',
      documents: {
        license: null,
        orcr: null,
        selfie: null,
        profilePicture: null
      },
      acceptTerms: false
    })

    const handleFileUpload = (event, documentType) => {
      const file = event.target.files[0]
      if (file) {
        formData.documents[documentType] = file
      }
    }

    const handleRegister = async () => {
      if (!formData.fullName || !formData.contact || !formData.email || !formData.password || 
          !formData.motorcycleInfo.brand || !formData.motorcycleInfo.model || 
          !formData.motorcycleInfo.plateNumber || !formData.motorcycleInfo.year ||
          !formData.experience || !formData.availability) {
        toast.error('Please fill in all required fields')
        return
      }

      if (!formData.documents.license || !formData.documents.orcr || 
          !formData.documents.selfie || !formData.documents.profilePicture) {
        toast.error('Please upload all required documents')
        return
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long')
        return
      }

      if (!formData.acceptTerms) {
        toast.error('Please accept the terms and conditions')
        return
      }

      loading.value = true
      try {
        const result = await authStore.registerDriver({
          fullName: formData.fullName,
          contact: formData.contact,
          email: formData.email,
          password: formData.password,
          motorcycleInfo: formData.motorcycleInfo,
          experience: formData.experience,
          availability: formData.availability,
          documents: formData.documents
        })
        
        if (result.success) {
          toast.success('Driver application submitted successfully! Please wait for admin approval.')
          router.push('/driver/login')
        } else {
          toast.error(result.error || 'Registration failed')
        }
      } catch (error) {
        console.error('Registration error:', error)
        toast.error('An error occurred during registration')
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      showPassword,
      loading,
      handleRegister,
      handleFileUpload
    }
  }
}
</script>
