<template>
  <div class="p-6 space-y-6">
    <!-- Add profile completion check for Google users -->
    <div v-if="needsProfileCompletion" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Profile Incomplete</h3>
          <p class="mt-1 text-sm text-red-700">
            Please complete your profile information before booking services.
          </p>
          <div class="mt-3">
            <router-link 
              to="/user/profile?complete=true"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Complete Profile
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Book a Service</h1>
      <p class="text-gray-600">Choose your delivery service and get instant quotes</p>
    </div>

    <!-- Service Selection -->
    <div v-if="!needsProfileCompletion" class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Service Type</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="service in services" :key="service.id" 
             @click="selectedService = service"
             :class="selectedService?.id === service.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'"
             class="p-4 border rounded-lg cursor-pointer transition-all">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
              <p class="text-sm font-medium text-green-600">Starting at ₱{{ service.baseRate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Form -->
    <div v-if="selectedService && !needsProfileCompletion" class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
      <form @submit.prevent="submitBooking" class="space-y-4">
        <!-- Pickup Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
          <div class="relative">
            <input type="text" v-model="bookingForm.pickupAddress" 
                   placeholder="Enter pickup address" 
                   class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <button type="button" @click="getCurrentLocation('pickup')" 
                    class="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Delivery Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
          <div class="relative">
            <input type="text" v-model="bookingForm.deliveryAddress" 
                   placeholder="Enter delivery address" 
                   class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <button type="button" @click="getCurrentLocation('delivery')" 
                    class="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
            <input type="text" v-model="bookingForm.contactName" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" v-model="bookingForm.contactPhone" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          </div>
        </div>

        <!-- Delivery Instructions -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
          <textarea v-model="bookingForm.instructions" rows="3" 
                    placeholder="Any special delivery instructions..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
        </div>

        <!-- Scheduled Delivery -->
        <div>
          <label class="flex items-center">
            <input type="checkbox" v-model="bookingForm.isScheduled" 
                   class="rounded border-gray-300 text-green-600 focus:ring-green-500">
            <span class="ml-2 text-sm text-gray-700">Schedule for later</span>
          </label>
        </div>

        <div v-if="bookingForm.isScheduled" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
            <input type="date" v-model="bookingForm.scheduledDate" 
                   :min="new Date().toISOString().split('T')[0]"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
            <select v-model="bookingForm.scheduledTime" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">Select time</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>
        </div>

        <!-- Price Estimate -->
        <div v-if="priceEstimate" class="bg-green-50 p-4 rounded-lg border border-green-200">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-green-700">Estimated Price</p>
              <p class="text-lg font-semibold text-green-900">₱{{ priceEstimate.total }}</p>
            </div>
            <button type="button" @click="calculatePrice" 
                    class="text-sm text-green-600 hover:text-green-800">
              Recalculate
            </button>
          </div>
          <div class="mt-2 text-xs text-green-600 space-y-1">
            <div class="flex justify-between">
              <span>Base rate:</span>
              <span>₱{{ priceEstimate.baseRate }}</span>
            </div>
            <div class="flex justify-between">
              <span>Distance ({{ priceEstimate.distance }}km):</span>
              <span>₱{{ priceEstimate.distanceRate }}</span>
            </div>
            <div v-if="priceEstimate.weatherMultiplier > 1" class="flex justify-between">
              <span>Weather surcharge:</span>
              <span>₱{{ priceEstimate.weatherSurcharge }}</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex space-x-4">
          <button type="button" @click="calculatePrice" 
                  :disabled="!canCalculatePrice"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            Get Price Estimate
          </button>
          <button type="submit" 
                  :disabled="!canSubmitBooking || submitting"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            {{ submitting ? 'Booking...' : 'Book Now' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { googleMapsService } from '@/services/googleMaps'
import { db } from '@/firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'BookService',
  setup() {
    // Use hooks at the top level
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      selectedService: null,
      submitting: false,
      services: [
        {
          id: 1,
          name: 'Grocery Delivery',
          description: 'Fresh groceries delivered to your door',
          baseRate: 50,
          perKm: 15,
          icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L7 13m0 0l2.5 5'
        },
        {
          id: 2,
          name: 'Food Delivery',
          description: 'Hot meals from your favorite restaurants',
          baseRate: 40,
          perKm: 12,
          icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
        },
        {
          id: 3,
          name: 'Medicine Delivery',
          description: 'Prescription and over-the-counter medicines',
          baseRate: 60,
          perKm: 18,
          icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547A1.934 1.934 0 014 17.5v3A1.5 1.5 0 005.5 22h13a1.5 1.5 0 001.5-1.5v-3a1.934 1.934 0 00-.572-1.072z'
        },
        {
          id: 4,
          name: 'Package Delivery',
          description: 'Documents and packages delivered safely',
          baseRate: 45,
          perKm: 14,
          icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
        }
      ],
      bookingForm: {
        pickupAddress: '',
        deliveryAddress: '',
        contactName: '',
        contactPhone: '',
        instructions: '',
        isScheduled: false,
        scheduledDate: '',
        scheduledTime: ''
      },
      priceEstimate: null,
      needsProfileCompletion: false // Assume this is set based on some logic
    }
  },
  computed: {
    canCalculatePrice() {
      return this.selectedService && 
             this.bookingForm.pickupAddress && 
             this.bookingForm.deliveryAddress
    },
    canSubmitBooking() {
      return this.canCalculatePrice && 
             this.bookingForm.contactName && 
             this.bookingForm.contactPhone && 
             this.priceEstimate
    }
  },
  methods: {
    async getCurrentLocation(type) {
      try {
        const location = await googleMapsService.getCurrentLocation()
        // In a real app, you would reverse geocode this to get the address
        const address = `${location.lat}, ${location.lng}`
        
        if (type === 'pickup') {
          this.bookingForm.pickupAddress = address
        } else {
          this.bookingForm.deliveryAddress = address
        }
      } catch (error) {
        console.error('Error getting location:', error)
        alert('Unable to get your current location. Please enter manually.')
      }
    },

    async calculatePrice() {
      if (!this.canCalculatePrice) return

      try {
        // In a real app, you would use Google Maps Distance Matrix API
        // For now, we'll simulate the calculation
        const baseRate = this.selectedService.baseRate
        const perKm = this.selectedService.perKm
        const estimatedDistance = Math.random() * 10 + 2 // 2-12 km
        const weatherMultiplier = Math.random() > 0.7 ? 1.5 : 1 // 30% chance of bad weather
        
        const distanceRate = estimatedDistance * perKm
        const subtotal = baseRate + distanceRate
        const weatherSurcharge = weatherMultiplier > 1 ? subtotal * 0.5 : 0
        const total = subtotal + weatherSurcharge

        this.priceEstimate = {
          baseRate: baseRate.toFixed(2),
          distance: estimatedDistance.toFixed(1),
          distanceRate: distanceRate.toFixed(2),
          weatherMultiplier,
          weatherSurcharge: weatherSurcharge.toFixed(2),
          total: total.toFixed(2)
        }
      } catch (error) {
        console.error('Error calculating price:', error)
        alert('Unable to calculate price. Please try again.')
      }
    },

    async submitBooking() {
      if (!this.canSubmitBooking) return

      this.submitting = true
      try {
        const bookingData = {
          userId: this.authStore.user.uid,
          serviceId: this.selectedService.id,
          serviceName: this.selectedService.name,
          pickupAddress: this.bookingForm.pickupAddress,
          deliveryAddress: this.bookingForm.deliveryAddress,
          contactName: this.bookingForm.contactName,
          contactPhone: this.bookingForm.contactPhone,
          instructions: this.bookingForm.instructions,
          isScheduled: this.bookingForm.isScheduled,
          scheduledDate: this.bookingForm.scheduledDate,
          scheduledTime: this.bookingForm.scheduledTime,
          priceEstimate: this.priceEstimate,
          status: 'pending',
          createdAt: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, 'orders'), bookingData)
        
        alert('Booking submitted successfully!')
        this.$router.push(`/user/orders/${docRef.id}`)
      } catch (error) {
        console.error('Error submitting booking:', error)
        alert('Error submitting booking. Please try again.')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
