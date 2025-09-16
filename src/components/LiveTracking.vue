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
      <div id="tracking-map" class="h-64 w-full bg-gray-100 flex items-center justify-center">
        <!-- Replaced Google Maps with a mock map interface for now -->
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-600">Driver Location</p>
          <p class="text-xs text-gray-400">{{ driverLocation || 'Updating...' }}</p>
        </div>
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
          <button @click="callDriver" class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </button>
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
  </div>
</template>

<script>
import { realtimeService } from '@/services/realtime'
import { chatService } from '@/services/chatService'

export default {
  name: 'LiveTracking',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      order: {
        id: 'ORD-2024-001',
        status: 'in_transit',
        driver: {
          name: 'Juan Dela Cruz',
          avatar: '/placeholder.svg?height=40&width=40',
          vehicle: 'Honda Click 150',
          plateNumber: 'ABC-1234',
          phone: '+639123456789'
        },
        deliveryAddress: {
          street: '123 Main St',
          city: 'Manila',
          coordinates: { lat: 14.5995, lng: 120.9842 }
        },
        confirmedAt: new Date(),
        driverAssignedAt: new Date(),
        inTransitAt: new Date()
      },
      loading: false,
      driverLocation: 'Quezon City, Metro Manila',
      statusSteps: [
        { status: 'confirmed', label: 'Confirmed', time: null },
        { status: 'driver_assigned', label: 'Driver Assigned', time: null },
        { status: 'in_transit', label: 'In Transit', time: null },
        { status: 'arrived', label: 'Arrived', time: null },
        { status: 'delivered', label: 'Delivered', time: null }
      ],
      estimatedArrival: '15 mins',
      remainingDistance: '2.3 km'
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
  },
  methods: {
    async initializeTracking() {
      try {
        this.loading = true
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.updateStatusSteps()
        this.startLocationUpdates()

        this.loading = false
      } catch (error) {
        console.error('Error initializing tracking:', error)
        this.loading = false
      }
    },

    startLocationUpdates() {
      this.locationUpdateInterval = setInterval(() => {
        const locations = [
          'Quezon City, Metro Manila',
          'EDSA Cubao, Quezon City',
          'Ortigas Center, Pasig City',
          'Makati CBD, Makati City'
        ]
        this.driverLocation = locations[Math.floor(Math.random() * locations.length)]
        
        // Update ETA and distance
        const distances = ['2.3 km', '1.8 km', '1.2 km', '0.5 km']
        const times = ['15 mins', '12 mins', '8 mins', '3 mins']
        this.remainingDistance = distances[Math.floor(Math.random() * distances.length)]
        this.estimatedArrival = times[Math.floor(Math.random() * times.length)]
      }, 5000)
    },

    subscribeToOrderUpdates() {
      console.log('Subscribed to order updates for:', this.orderId)
    },

    updateStatusSteps() {
      if (!this.order) return

      const statusTimes = {
        confirmed: this.order.confirmedAt,
        driver_assigned: this.order.driverAssignedAt,
        in_transit: this.order.inTransitAt,
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
      
      const statusOrder = ['confirmed', 'driver_assigned', 'in_transit', 'arrived', 'delivered']
      const currentIndex = statusOrder.indexOf(this.order.status)
      const stepIndex = statusOrder.indexOf(status)
      
      return stepIndex <= currentIndex
    },

    isCurrentStep(status) {
      return this.order?.status === status
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleTimeString()
    },

    refreshTracking() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.startLocationUpdates()
      }, 1000)
    },

    callDriver() {
      if (this.order?.driver?.phone) {
        window.open(`tel:${this.order.driver.phone}`)
      }
    },

    async openChat() {
      try {
        this.$router.push({ name: 'user-chat-messages' })
      } catch (error) {
        console.error('Error opening chat:', error)
      }
    }
  }
}
</script>
