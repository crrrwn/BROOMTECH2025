<template>
  <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b bg-gray-50">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Live Tracking</h3>
          <p class="text-sm text-gray-600">Order #{{ order?.id }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="ml-2 text-sm text-gray-600">Live</span>
          </div>
          <button @click="refreshTracking" class="p-2 text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="relative">
      <div id="tracking-map" ref="mapContainer" class="h-64 w-full bg-gray-100 flex items-center justify-center">
        <!-- Map will be rendered here by Google Maps API -->
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>

    <!-- Order Status -->
    <div class="p-4 space-y-4">
      <!-- Status Timeline -->
      <div class="flex items-center justify-between">
        <div v-for="(step, index) in statusSteps" :key="step.status" class="flex flex-col items-center flex-1">
          <div class="flex items-center w-full">
            <div :class="getStepClass(step.status)" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium">
              <svg v-if="isStepCompleted(step.status)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div v-if="index < statusSteps.length - 1" :class="isStepCompleted(step.status) ? 'bg-green-500' : 'bg-gray-300'" class="flex-1 h-1 mx-2"></div>
          </div>
          <span class="text-xs text-gray-600 mt-2 text-center">{{ step.label }}</span>
          <span v-if="step.time" class="text-xs text-gray-400">{{ formatTime(step.time) }}</span>
        </div>
      </div>

      <!-- Driver Info -->
      <div v-if="order?.driver" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-3">
          <img :src="order.driver.avatar || '/placeholder.svg?height=40&width=40'" :alt="order.driver.name" class="w-10 h-10 rounded-full">
          <div>
            <p class="font-medium text-gray-900">{{ order.driver.name }}</p>
            <p class="text-sm text-gray-600">{{ order.driver.vehicle }} • {{ order.driver.plateNumber }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <!-- Phone button now shows phone number in tooltip/modal -->
          <button @click="showPhoneNumber" class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 relative group">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <!-- Tooltip showing phone number -->
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {{ order.driver.phone }}
            </div>
          </button>
          <!-- Message button opens chat with driver -->
          <button @click="openChat" class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Delivery Details -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-600">Estimated Arrival</p>
          <p class="font-medium text-gray-900">{{ estimatedArrival }}</p>
        </div>
        <div>
          <p class="text-gray-600">Distance Remaining</p>
          <p class="font-medium text-gray-900">{{ remainingDistance }}</p>
        </div>
      </div>
    </div>

    <!-- Phone Number Modal -->
    <div v-if="showPhoneModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Driver Contact</h3>
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-2">Driver Name</p>
          <p class="font-medium text-gray-900 mb-4">{{ order?.driver?.name }}</p>
          <p class="text-sm text-gray-600 mb-2">Phone Number</p>
          <p class="font-mono text-lg font-semibold text-green-600">{{ order?.driver?.phone }}</p>
        </div>
        <div class="flex space-x-3">
          <button @click="callDriver" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Call Driver
          </button>
          <button @click="showPhoneModal = false" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { realtimeService } from '@/services/realtime'
import { chatService } from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LiveTracking',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      order: null,
      loading: false,
      driverLocation: 'Updating...',
      statusSteps: [
        { status: 'confirmed', label: 'Confirmed', time: null },
        { status: 'driver_assigned', label: 'Driver Assigned', time: null },
        { status: 'in_transit', label: 'In Transit', time: null },
        { status: 'on_the_way', label: 'On The Way', time: null },
        { status: 'arrived', label: 'Arrived', time: null },
        { status: 'delivered', label: 'Delivered', time: null }
      ],
      estimatedArrival: '15 mins',
      remainingDistance: '2.3 km',
      map: null,
      driverMarker: null,
      destinationMarker: null,
      showPhoneModal: false,
      locationUpdateInterval: null
    }
  },
  async mounted() {
    await this.initializeTracking()
    this.subscribeToOrderUpdates()
  },
  beforeUnmount() {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval)
    }
    realtimeService.unsubscribe(`order_${this.orderId}`)
    if (this.order?.driverId) {
      realtimeService.unsubscribe(`driver_location_${this.order.driverId}`)
    }
  },
  methods: {
    async initializeTracking() {
      try {
        this.loading = true
        
        // Initialize map
        await this.initializeMap()
        
        // Fetch initial order data
        await new Promise(resolve => setTimeout(resolve, 500))
        this.updateStatusSteps()
        this.startLocationUpdates()

        this.loading = false
      } catch (error) {
        console.error('Error initializing tracking:', error)
        this.loading = false
      }
    },

    async initializeMap() {
      try {
        // Wait for Google Maps API to load
        if (!window.google) {
          console.warn('Google Maps API not loaded yet')
          return
        }

        const mapContainer = this.$refs.mapContainer
        if (!mapContainer) return

        // Default center (Calapan City)
        const defaultCenter = { lat: 13.2088, lng: 121.1857 }

        this.map = new window.google.maps.Map(mapContainer, {
          zoom: 15,
          center: defaultCenter,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        })

        // Add destination marker
        if (this.order?.deliveryAddress) {
          this.destinationMarker = new window.google.maps.Marker({
            position: this.order.deliveryAddress.coordinates || defaultCenter,
            map: this.map,
            title: 'Delivery Location',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          })
        }

        // Add driver marker (will update with real location)
        this.driverMarker = new window.google.maps.Marker({
          position: defaultCenter,
          map: this.map,
          title: 'Driver Location',
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        })
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    },

    startLocationUpdates() {
      if (this.order?.driverId) {
        realtimeService.subscribeToDriverLocation(this.order.driverId, (location) => {
          if (location && location.latitude && location.longitude) {
            const driverPos = {
              lat: location.latitude,
              lng: location.longitude
            }
            
            // Update marker position
            if (this.driverMarker) {
              this.driverMarker.setPosition(driverPos)
            }

            // Center map on driver
            if (this.map) {
              this.map.setCenter(driverPos)
            }

            // Update location text
            this.driverLocation = location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
          }
        })
      }

      // Fallback: simulate location updates if real data not available
      this.locationUpdateInterval = setInterval(() => {
        const locations = [
          'Quezon City, Metro Manila',
          'EDSA Cubao, Quezon City',
          'Ortigas Center, Pasig City',
          'Makati CBD, Makati City'
        ]
        this.driverLocation = locations[Math.floor(Math.random() * locations.length)]
        
        const distances = ['2.3 km', '1.8 km', '1.2 km', '0.5 km']
        const times = ['15 mins', '12 mins', '8 mins', '3 mins']
        this.remainingDistance = distances[Math.floor(Math.random() * distances.length)]
        this.estimatedArrival = times[Math.floor(Math.random() * times.length)]
      }, 5000)
    },

    subscribeToOrderUpdates() {
      realtimeService.subscribeToOrder(this.orderId, (order) => {
        this.order = order
        this.updateStatusSteps()
      })
    },

    updateStatusSteps() {
      if (!this.order) return

      const statusTimes = {
        confirmed: this.order.confirmedAt,
        driver_assigned: this.order.driverAssignedAt,
        in_transit: this.order.inTransitAt,
        on_the_way: this.order.onTheWayAt,
        arrived: this.order.arrivedAt,
        delivered: this.order.deliveredAt
      }

      this.statusSteps = this.statusSteps.map(step => ({
        ...step,
        time: statusTimes[step.status]
      }))
    },

    getStepClass(status) {
      if (this.isStepCompleted(status)) {
        return 'bg-green-500'
      } else if (this.isCurrentStep(status)) {
        return 'bg-blue-500'
      } else {
        return 'bg-gray-300'
      }
    },

    isStepCompleted(status) {
      if (!this.order) return false
      
      const statusOrder = ['confirmed', 'driver_assigned', 'in_transit', 'on_the_way', 'arrived', 'delivered']
      const currentIndex = statusOrder.indexOf(this.order.status)
      const stepIndex = statusOrder.indexOf(status)
      
      return stepIndex <= currentIndex
    },

    isCurrentStep(status) {
      return this.order?.status === status
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return d.toLocaleTimeString()
    },

    refreshTracking() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },

    showPhoneNumber() {
      this.showPhoneModal = true
    },

    callDriver() {
      if (this.order?.driver?.phone) {
        window.open(`tel:${this.order.driver.phone}`)
      }
    },

    async openChat() {
      try {
        if (!this.order?.driverId) {
          alert('Driver information not available')
          return
        }

        // Create or get existing chat room
        const chatId = await chatService.createChatRoom(
          this.authStore.user.uid,
          this.order.driverId,
          this.orderId
        )

        // Navigate to chat
        this.$router.push({
          name: 'user-chat-messages',
          params: { chatId }
        })
      } catch (error) {
        console.error('Error opening chat:', error)
        alert('Failed to open chat. Please try again.')
      }
    }
  }
}
</script>
