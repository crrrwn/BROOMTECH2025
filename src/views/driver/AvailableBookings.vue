<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Available Bookings</h1>
        <p class="text-gray-600">Accept bookings that match your availability</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div :class="[
            'w-3 h-3 rounded-full',
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          ]"></div>
          <span class="text-sm font-medium" :class="isOnline ? 'text-green-600' : 'text-gray-500'">
            {{ isOnline ? 'Online' : 'Offline' }}
          </span>
        </div>
        <button 
          @click="refreshBookings"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Weather Status Banner for Drivers -->
    <div v-if="isBadWeather && badWeatherFeeEnabled" class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-yellow-800">
            Bad Weather Alert: {{ currentWeather }} - All bookings include ₱5 surcharge
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg p-4 shadow-sm border">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
          <select v-model="filters.serviceType" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">All Services</option>
            <option value="food-delivery">Food Delivery</option>
            <option value="grocery">Grocery Shopping</option>
            <option value="pickup-drop">Pick-up & Drop</option>
            <option value="bill-payment">Bill Payment</option>
            <option value="medicine">Medicine Delivery</option>
            <option value="gift">Surprise Gift</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Distance</label>
          <select v-model="filters.distance" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Any Distance</option>
            <option value="1">Within 1km</option>
            <option value="3">Within 3km</option>
            <option value="5">Within 5km</option>
            <option value="10">Within 10km</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select v-model="filters.paymentMethod" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Any Payment</option>
            <option value="gcash">GCash</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bookings List -->
    <div class="space-y-4">
      <div v-for="booking in filteredBookings" :key="booking.id" class="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                getServiceColor(booking.serviceType)
              ]">
                <component :is="getServiceIcon(booking.serviceType)" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ booking.serviceTitle }}</h3>
                <p class="text-sm text-gray-500">{{ booking.customerName }} • {{ booking.timeAgo }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-700">Pickup Location</p>
                <p class="text-sm text-gray-600">{{ booking.pickupAddress }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Drop-off Location</p>
                <p class="text-sm text-gray-600">{{ booking.dropoffAddress }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ booking.distance }}km</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ booking.estimatedTime }} mins</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span>{{ booking.paymentMethod }}</span>
              </div>
            </div>
            
            <div v-if="booking.notes" class="bg-gray-50 rounded-lg p-3 mb-4">
              <p class="text-sm text-gray-700"><strong>Notes:</strong> {{ booking.notes }}</p>
            </div>
          </div>
          
          <div class="ml-6 text-right">
            <div class="mb-4">
              <p class="text-2xl font-bold text-primary">₱{{ booking.totalAmount }}</p>
              <p class="text-sm text-gray-500">Total Earnings</p>
            </div>
            
            <div class="space-y-2">
              <button 
                @click="acceptBooking(booking)"
                class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Accept Booking
              </button>
              <button 
                @click="viewDetails(booking)"
                class="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBookings.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m9 5a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Available Bookings</h3>
      <p class="text-gray-600">{{ isOnline ? 'Check back later for new bookings' : 'Go online to see available bookings' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { weatherService } from '@/services/weatherService'

const toast = useToast()

const isOnline = ref(true)
const isBadWeather = ref(false)
const currentWeather = ref('')
const badWeatherFeeEnabled = ref(false)

const filters = ref({
  serviceType: '',
  distance: '',
  paymentMethod: ''
})

const bookings = ref([
  {
    id: 1,
    serviceType: 'food-delivery',
    serviceTitle: 'Food Delivery',
    customerName: 'Maria Santos',
    timeAgo: '5 minutes ago',
    pickupAddress: 'Jollibee, Magsaysay St, Calapan City',
    dropoffAddress: 'Barangay Guinobatan, Calapan City',
    distance: 2.5,
    estimatedTime: 15,
    paymentMethod: 'GCash',
    totalAmount: 85,
    notes: 'Please call when you arrive. 2x Chickenjoy, 1x Rice, 1x Coke'
  },
  {
    id: 2,
    serviceType: 'grocery',
    serviceTitle: 'Grocery Shopping',
    customerName: 'Juan Dela Cruz',
    timeAgo: '8 minutes ago',
    pickupAddress: 'SM City Calapan',
    dropoffAddress: 'Barangay Mahal na Pangalan, Calapan City',
    distance: 4.2,
    estimatedTime: 25,
    paymentMethod: 'COD',
    totalAmount: 120,
    notes: 'Budget: ₱1000-₱1500. Shopping list: Rice, Vegetables, Meat, Milk'
  },
  {
    id: 3,
    serviceType: 'pickup-drop',
    serviceTitle: 'Document Delivery',
    customerName: 'Ana Reyes',
    timeAgo: '12 minutes ago',
    pickupAddress: 'City Hall, Calapan City',
    dropoffAddress: 'Barangay San Vicente, Calapan City',
    distance: 1.8,
    estimatedTime: 12,
    paymentMethod: 'GCash',
    totalAmount: 75,
    notes: 'Important documents - handle with care'
  },
  {
    id: 4,
    serviceType: 'medicine',
    serviceTitle: 'Medicine Delivery',
    customerName: 'Roberto Garcia',
    timeAgo: '15 minutes ago',
    pickupAddress: 'Mercury Drug, J.P. Rizal St',
    dropoffAddress: 'Barangay Ibaba East, Calapan City',
    distance: 3.1,
    estimatedTime: 18,
    paymentMethod: 'COD',
    totalAmount: 95,
    notes: 'Prescription medicine for elderly patient'
  }
])

const filteredBookings = computed(() => {
  return bookings.value.filter(booking => {
    if (filters.value.serviceType && booking.serviceType !== filters.value.serviceType) return false
    if (filters.value.distance && booking.distance > parseInt(filters.value.distance)) return false
    if (filters.value.paymentMethod && booking.paymentMethod.toLowerCase() !== filters.value.paymentMethod) return false
    return true
  })
})

const getServiceColor = (serviceType) => {
  const colors = {
    'food-delivery': 'bg-orange-500',
    'grocery': 'bg-green-500',
    'pickup-drop': 'bg-blue-500',
    'bill-payment': 'bg-purple-500',
    'medicine': 'bg-red-500',
    'gift': 'bg-pink-500'
  }
  return colors[serviceType] || 'bg-gray-500'
}

const getServiceIcon = (serviceType) => {
  // Return SVG component based on service type
  return 'svg'
}

const refreshBookings = () => {
  toast.success('Bookings refreshed!')
  // In real app, this would fetch new bookings from the server
}

const acceptBooking = (booking) => {
  toast.success(`Booking accepted! You can now start the delivery.`)
  // Remove from available bookings and add to assignments
  bookings.value = bookings.value.filter(b => b.id !== booking.id)
}

const viewDetails = (booking) => {
  // Show detailed modal or navigate to details page
  toast.info('Opening booking details...')
}

const checkWeatherStatus = async () => {
  try {
    const weatherData = await weatherService.checkWeather()
    isBadWeather.value = weatherData.isBadWeather
    currentWeather.value = weatherData.description
    badWeatherFeeEnabled.value = await weatherService.isBadWeatherFeeEnabled()
  } catch (error) {
    console.error('[v0] Error checking weather:', error)
  }
}

let weatherInterval

onMounted(() => {
  checkWeatherStatus()
  weatherInterval = setInterval(checkWeatherStatus, 10 * 60 * 1000)
})

onUnmounted(() => {
  clearInterval(weatherInterval)
})
</script>
