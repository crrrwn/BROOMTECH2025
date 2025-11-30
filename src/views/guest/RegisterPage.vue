<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">B</span>
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-primary hover:text-green-600">
            Sign in here
          </router-link>
        </p>
      </div>
      
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name <span class="text-red-500">*</span></label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                pattern="[A-Za-z\s\-]+"
                @blur="validateField('firstName')"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="First name"
              />
              <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name <span class="text-red-500">*</span></label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                pattern="[A-Za-z\s\-]+"
                @blur="validateField('lastName')"
                :class="[
                  'mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Last name"
              />
              <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>
          
          <div>
            <label for="middleName" class="block text-sm font-medium text-gray-700">Middle Name (Optional)</label>
            <input
              id="middleName"
              v-model="form.middleName"
              type="text"
              pattern="[A-Za-z\s\-]*"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Middle name"
            />
          </div>

          <!-- Contact -->
          <div>
            <label for="contact" class="block text-sm font-medium text-gray-700">Contact Number <span class="text-red-500">*</span></label>
            <input
              id="contact"
              v-model="form.contact"
              type="tel"
              required
              pattern="^(09|\+639)\d{9}$"
              @blur="validateField('contact')"
              :class="[
                'mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                errors.contact ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="09XXXXXXXXX or +639XXXXXXXXX"
            />
            <p v-if="errors.contact" class="mt-1 text-xs text-red-600">{{ errors.contact }}</p>
            <p v-else class="mt-1 text-xs text-gray-500">Format: 09XXXXXXXXX or +639XXXXXXXXX</p>
          </div>

          <!-- Address -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Home Street Address <span class="text-red-500">*</span></label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              required
              minlength="10"
              @blur="validateField('address')"
              :class="[
                'mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                errors.address ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Enter your complete address"
            />
            <p v-if="errors.address" class="mt-1 text-xs text-red-600">{{ errors.address }}</p>
          </div>

          <!-- Barangay -->
          <div>
            <label for="barangay" class="block text-sm font-medium text-gray-700">Barangay <span class="text-red-500">*</span></label>
            <select
              id="barangay"
              v-model="form.barangay"
              required
              @blur="validateField('barangay')"
              :class="[
                'mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                errors.barangay ? 'border-red-500' : 'border-gray-300'
              ]"
            >
              <option value="">Select Barangay</option>
              <option v-for="barangay in barangays" :key="barangay" :value="barangay">
                {{ barangay }}
              </option>
            </select>
            <p v-if="errors.barangay" class="mt-1 text-xs text-red-600">{{ errors.barangay }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address <span class="text-red-500">*</span></label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              @blur="validateField('email')"
              :class="[
                'mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                errors.email ? 'border-red-500' : 'border-gray-300'
              ]"
              placeholder="Enter your email"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password <span class="text-red-500">*</span></label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                @input="checkPasswordStrength"
                @blur="validateField('password')"
                :class="[
                  'block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                  errors.password ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
            
            <!-- Password Strength Meter -->
            <div class="mt-2">
              <div class="flex space-x-1">
                <div v-for="i in 4" :key="i" :class="[
                  'h-1 flex-1 rounded',
                  passwordStrength >= i ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                ]"></div>
              </div>
              <p class="text-xs mt-1" :class="getStrengthTextColor(passwordStrength)">
                {{ getStrengthText(passwordStrength) }}
              </p>
            </div>
            
            <div class="mt-2 text-xs text-gray-500">
              <p>Password must contain:</p>
              <ul class="list-disc list-inside space-y-1">
                <li :class="passwordChecks.length ? 'text-green-600' : 'text-gray-500'">8-12 characters</li>
                <li :class="passwordChecks.uppercase ? 'text-green-600' : 'text-gray-500'">One uppercase letter</li>
                <li :class="passwordChecks.lowercase ? 'text-green-600' : 'text-gray-500'">One lowercase letter</li>
                <li :class="passwordChecks.number ? 'text-green-600' : 'text-gray-500'">One number</li>
                <li :class="passwordChecks.special ? 'text-green-600' : 'text-gray-500'">One special character</li>
              </ul>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password <span class="text-red-500">*</span></label>
            <div class="mt-1 relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                @blur="validateField('confirmPassword')"
                :class="[
                  'block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                ]"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-600">{{ errors.confirmPassword }}</p>
            <p v-else-if="form.confirmPassword && form.password !== form.confirmPassword" class="mt-1 text-xs text-red-600">
              Passwords do not match
            </p>
          </div>

          <!-- Terms and Conditions Checkbox -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="acceptTerms"
                v-model="form.acceptTerms"
                type="checkbox"
                required
                class="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="acceptTerms" class="font-medium text-gray-700">
                I agree to the 
                <a href="#" class="text-primary hover:text-green-600 underline" @click.prevent>Terms of Service</a>
                and 
                <a href="#" class="text-primary hover:text-green-600 underline" @click.prevent>Privacy Policy</a>
              </label>
            </div>
          </div>
          <p v-if="form.acceptTerms === false && form.confirmPassword" class="text-xs text-red-600">
            You must agree to the terms and conditions
          </p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleRegister"
              :disabled="loading"
              class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const form = ref({
      firstName: '',
      lastName: '',
      middleName: '',
      contact: '',
      address: '',
      barangay: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })

    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const passwordStrength = ref(0)
    const passwordChecks = ref({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    })
    const errors = ref({
      firstName: '',
      lastName: '',
      contact: '',
      address: '',
      barangay: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const barangays = ref([
      'Balingayan', 'Balite', 'Baruyan', 'Batino', 'Bayanan I', 'Bayanan II', 'Biga', 'Bondoc', 'Bucayao', 'Buhuan', 'Bulusan',
      'Calero', 'Camansihan', 'Camilmil', 'Canubing I', 'Canubing II', 'Comunal',
      'Guinobatan', 'Gulod', 'Gutad',
      'Ibaba East', 'Ibaba West', 'Ilaya',
      'Lalud', 'Lazareto', 'Libis', 'Lumangbayan',
      'Mahal na Pangalan', 'Maidlang', 'Malad', 'Malamig', 'Managpi', 'Masipit', 'Nag-iba I', 'Nag-iba II', 'Navotas',
      'Pachoca', 'Palhi', 'Panggalaan', 'Parang', 'Patas', 'Personas', 'Puting Tubig',
      'Salong', 'San Antonio', 'San Vicente Central', 'San Vicente East', 'San Vicente North', 'San Vicente South', 'San Vicente West', 'Sapul', 'Silonay', 'Sta. Cruz', 'Sta. Isabel', 'Sta. Maria Village', 'Sta. Rita', 'Sto. Niño', 'Suqui',
      'Tawagan', 'Tawiran', 'Tibag',
      'Wawa'
    ])

    const isFormValid = computed(() => {
      return form.value.firstName &&
             form.value.lastName &&
             form.value.contact &&
             form.value.address &&
             form.value.barangay &&
             form.value.email &&
             form.value.password &&
             form.value.confirmPassword &&
             form.value.password === form.value.confirmPassword &&
             passwordStrength.value >= 3 &&
             form.value.acceptTerms === true
    })

    const checkPasswordStrength = () => {
      const password = form.value.password
      
      passwordChecks.value = {
        length: password.length >= 8 && password.length <= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      }
      
      const checks = Object.values(passwordChecks.value)
      passwordStrength.value = checks.filter(Boolean).length
    }

    const getStrengthColor = (strength) => {
      if (strength <= 1) return 'bg-red-500'
      if (strength <= 2) return 'bg-yellow-500'
      if (strength <= 3) return 'bg-blue-500'
      return 'bg-green-500'
    }

    const getStrengthTextColor = (strength) => {
      if (strength <= 1) return 'text-red-600'
      if (strength <= 2) return 'text-yellow-600'
      if (strength <= 3) return 'text-blue-600'
      return 'text-green-600'
    }

    const getStrengthText = (strength) => {
      if (strength <= 1) return 'Weak password'
      if (strength <= 2) return 'Fair password'
      if (strength <= 3) return 'Good password'
      return 'Strong password'
    }

    const validateField = (fieldName) => {
      const field = form.value[fieldName]
      errors.value[fieldName] = ''

      switch (fieldName) {
        case 'firstName':
          if (!field) {
            errors.value.firstName = 'First name is required'
          } else if (!/^[A-Za-z\s\-]+$/.test(field)) {
            errors.value.firstName = 'First name should only contain letters, spaces, and hyphens'
          }
          break
        case 'lastName':
          if (!field) {
            errors.value.lastName = 'Last name is required'
          } else if (!/^[A-Za-z\s\-]+$/.test(field)) {
            errors.value.lastName = 'Last name should only contain letters, spaces, and hyphens'
          }
          break
        case 'contact':
          if (!field) {
            errors.value.contact = 'Contact number is required'
          } else if (!/^(09|\+639)\d{9}$/.test(field)) {
            errors.value.contact = 'Please enter a valid contact number (09XXXXXXXXX or +639XXXXXXXXX)'
          }
          break
        case 'address':
          if (!field) {
            errors.value.address = 'Home street address is required'
          } else if (field.length < 10) {
            errors.value.address = 'Address must be at least 10 characters long'
          }
          break
        case 'barangay':
          if (!field) {
            errors.value.barangay = 'Please select a barangay'
          }
          break
        case 'email':
          if (!field) {
            errors.value.email = 'Email address is required'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field)) {
            errors.value.email = 'Please enter a valid email address'
          }
          break
        case 'password':
          if (!field) {
            errors.value.password = 'Password is required'
          } else if (passwordStrength.value < 3) {
            errors.value.password = 'Password must meet all requirements'
          }
          break
        case 'confirmPassword':
          if (!field) {
            errors.value.confirmPassword = 'Please confirm your password'
          } else if (form.value.password !== field) {
            errors.value.confirmPassword = 'Passwords do not match'
          }
          break
      }
    }

    const handleRegister = async () => {
      // Validate all fields
      validateField('firstName')
      validateField('lastName')
      validateField('contact')
      validateField('address')
      validateField('barangay')
      validateField('email')
      validateField('password')
      validateField('confirmPassword')

      if (!isFormValid.value) {
        if (!form.value.acceptTerms) {
          toast.error('Please accept the Terms of Service and Privacy Policy')
        } else {
          toast.error('Please fill in all required fields correctly')
        }
        return
      }
      
      loading.value = true
      
      try {
        const result = await authStore.register(form.value)
        
        if (result.success) {
          // Redirect to verify email page with email
          router.push({
            path: '/verify-email',
            query: { email: form.value.email }
          })
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('An error occurred during registration')
      } finally {
        loading.value = false
      }
    }

    const handleGoogleRegister = async () => {
      loading.value = true
      
      try {
        const result = await authStore.loginWithGoogle()
        
        if (result.success) {
          toast.success('Account created successfully!')
          toast.info('Your account is pending admin approval.')
          router.push('/login')
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('An error occurred during Google registration')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      showPassword,
      showConfirmPassword,
      passwordStrength,
      passwordChecks,
      barangays,
      errors,
      isFormValid,
      checkPasswordStrength,
      getStrengthColor,
      getStrengthTextColor,
      getStrengthText,
      validateField,
      handleRegister,
      handleGoogleRegister
    }
  }
}
</script>
