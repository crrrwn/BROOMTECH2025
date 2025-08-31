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
      <div id="tracking-map" class="h-64 w-full bg-gray-100"></div>
      
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
          <img :src="order.driver.avatar" :alt="order.driver.name" class="w-10 h-10 rounded-full">
          <div>
            <p class="font-medium text-gray-900">{{ order.driver.name }}</p>
            <p class="text-sm text-gray-600">{{ order.driver.vehicle }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button @click="callDriver" class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </button>
          <button @click="messageDriver" class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
import { googleMapsService } from '@/services/googleMaps'
import { realtimeService } from '@/services/realtime'
import { google } from 'google-maps'

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
      order: null,
      loading: true,
      map: null,
      driverMarker: null,
      destinationMarker: null,
      statusSteps: [
        { status: 'confirmed', label: 'Confirmed', time: null },
        { status: 'driver_assigned', label: 'Driver Assigned', time: null },
        { status: 'in_transit', label: 'In Transit', time: null },
        { status: 'arrived', label: 'Arrived', time: null },
        { status: 'delivered', label: 'Delivered', time: null }
      ],
      estimatedArrival: 'Calculating...',
      remainingDistance: 'Calculating...'
    }
  },
  async mounted() {
    await this.initializeTracking()
    this.subscribeToOrderUpdates()
  },
  beforeUnmount() {
    realtimeService.unsubscribe(`order_${this.orderId}`)
    if (this.order?.driverId) {
      realtimeService.unsubscribe(`driver_location_${this.order.driverId}`)
    }
    googleMapsService.stopWatchingLocation()
  },
  methods: {
    async initializeTracking() {
      try {
        this.loading = true
        
        // Initialize Google Maps
        this.map = await googleMapsService.initMap('tracking-map', {
          zoom: 15
        })

        this.loading = false
      } catch (error) {
        console.error('Error initializing tracking:', error)
        this.loading = false
      }
    },

    subscribeToOrderUpdates() {
      // Subscribe to order updates
      realtimeService.subscribeToOrder(this.orderId, (order) => {
        this.order = order
        this.updateStatusSteps()
        
        if (order.driverId && !realtimeService.listeners.has(`driver_location_${order.driverId}`)) {
          this.subscribeToDriverLocation(order.driverId)
        }
        
        this.updateMapMarkers()
      })
    },

    subscribeToDriverLocation(driverId) {
      realtimeService.subscribeToDriverLocation(driverId, (location) => {
        this.updateDriverPosition(location)
        this.calculateETA()
      })
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

    updateMapMarkers() {
      if (!this.map || !this.order) return

      // Clear existing markers
      googleMapsService.clearMarkers()

      // Add destination marker
      if (this.order.deliveryAddress?.coordinates) {
        this.destinationMarker = googleMapsService.addMarker(
          this.order.deliveryAddress.coordinates,
          {
            title: 'Delivery Location',
            icon: {
              url: '/placeholder.svg?height=32&width=32',
              scaledSize: new google.maps.Size(32, 32)
            }
          }
        )
      }

      // Fit bounds to show all markers
      googleMapsService.fitBounds()
    },

    updateDriverPosition(location) {
      if (!this.map) return

      const position = { lat: location.lat, lng: location.lng }

      if (this.driverMarker) {
        googleMapsService.updateMarkerPosition(this.driverMarker, position)
      } else {
        this.driverMarker = googleMapsService.addMarker(position, {
          title: 'Driver Location',
          icon: {
            url: '/placeholder.svg?height=32&width=32',
            scaledSize: new google.maps.Size(32, 32)
          }
        })
      }

      // Update route if both driver and destination are available
      if (this.destinationMarker) {
        this.updateRoute(position, this.order.deliveryAddress.coordinates)
      }
    },

    async updateRoute(origin, destination) {
      try {
        const result = await googleMapsService.calculateRoute(origin, destination)
        const route = result.routes[0]
        const leg = route.legs[0]
        
        this.remainingDistance = leg.distance.text
        this.estimatedArrival = leg.duration.text
      } catch (error) {
        console.error('Error calculating route:', error)
      }
    },

    async calculateETA() {
      if (!this.order?.deliveryAddress?.coordinates || !this.driverMarker) return

      try {
        const driverPosition = this.driverMarker.getPosition()
        const result = await googleMapsService.calculateDistance(
          driverPosition,
          this.order.deliveryAddress.coordinates
        )

        this.remainingDistance = result.distance.text
        this.estimatedArrival = result.duration.text
      } catch (error) {
        console.error('Error calculating ETA:', error)
      }
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
      return new Date(timestamp.toDate()).toLocaleTimeString()
    },

    refreshTracking() {
      this.calculateETA()
    },

    callDriver() {
      if (this.order?.driver?.phone) {
        window.open(`tel:${this.order.driver.phone}`)
      }
    },

    messageDriver() {
      // Implement messaging functionality
      console.log('Message driver')
    }
  }
}
</script>
