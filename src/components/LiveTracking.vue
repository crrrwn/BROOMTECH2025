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
import { db } from '@/firebase/config'
import { doc, onSnapshot } from 'firebase/firestore'

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
        { status: 'delivered', label: 'Delivered', time: null }
      ],
      estimatedArrival: '15 mins',
      remainingDistance: '2.3 km',
      map: null,
      driverMarker: null,
      destinationMarker: null,
      pickupMarker: null,
      directionsService: null,
      directionsRenderer: null,
      showPhoneModal: false,
      locationUpdateInterval: null,
      driverLocationUnsubscribe: null,
      mapsReady: false
    }
  },
  async mounted() {
    await this.loadGoogleMapsAPI()
    this.subscribeToOrderUpdates()
  },
  beforeUnmount() {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval)
    }
    if (this.driverLocationUnsubscribe) {
      this.driverLocationUnsubscribe()
      this.driverLocationUnsubscribe = null
    }
    realtimeService.unsubscribe(`order_${this.orderId}`)
  },
  watch: {
    order(newOrder) {
      if (newOrder) {
        this.$nextTick(() => {
          this.initializeMap()
        })
      }
    },
    mapsReady(ready) {
      if (ready && this.order) {
        this.$nextTick(() => {
          this.initializeMap()
        })
      }
    }
  },
  methods: {
    loadGoogleMapsAPI() {
      return new Promise((resolve) => {
        if (window.google && window.google.maps) {
          this.mapsReady = true
          resolve()
          return
        }
        if (document.getElementById('live-tracking-gmaps-script')) {
          // Wait for script to load
          const checkInterval = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkInterval)
              this.mapsReady = true
              resolve()
            }
          }, 100)
          return
        }

        const script = document.createElement('script')
        script.id = 'live-tracking-gmaps-script'
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o&libraries=places,geometry&loading=async`
        script.async = true
        script.defer = true
        script.onload = () => {
          this.mapsReady = true
          resolve()
        }
        script.onerror = () => {
          console.error('Failed to load Google Maps API')
          resolve()
        }
        document.head.appendChild(script)
      })
    },

    getPickupLocation(order) {
      if (!order) return ''
      const formData = order.formData || {}
      const serviceType = order.serviceType || order.serviceId || ''
      
      switch (serviceType) {
        case 'food-delivery':
        case 'food':
          return formData.restaurantAddress || order.pickupAddress || ''
        case 'bill-payments':
        case 'pickup-drop':
          return formData.pickupAddress || order.pickupAddress || ''
        case 'gift-delivery':
          return formData.storeAddress || order.pickupAddress || ''
        default:
          return order.pickupAddress || ''
      }
    },

    getDeliveryLocation(order) {
      if (!order) return ''
      const formData = order.formData || {}
      const serviceType = order.serviceType || order.serviceId || ''
      
      switch (serviceType) {
        case 'food-delivery':
        case 'food':
        case 'grocery-shopping':
        case 'grocery':
        case 'medicine-delivery':
        case 'medicine':
        case 'gift-delivery':
          return formData.deliveryAddress || order.deliveryAddress || ''
        case 'bill-payments':
          return formData.returnAddress || order.deliveryAddress || ''
        case 'pickup-drop':
          return formData.dropoffAddress || order.deliveryAddress || ''
        default:
          return order.deliveryAddress || ''
      }
    },

    async initializeMap() {
      if (!this.mapsReady || !window.google || !this.order) return
      
      try {
        const mapContainer = this.$refs.mapContainer
        if (!mapContainer) return

        // Clear existing map if any
        if (this.map) {
          // Clean up existing markers and renderers
          if (this.pickupMarker) this.pickupMarker.setMap(null)
          if (this.destinationMarker) this.destinationMarker.setMap(null)
          if (this.driverMarker) this.driverMarker.setMap(null)
        }

        // Default center (Calapan City)
        const defaultCenter = { lat: 13.4119, lng: 121.1803 }

        this.map = new window.google.maps.Map(mapContainer, {
          zoom: 13,
          center: defaultCenter,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        })

        // Initialize directions service and renderer
        this.directionsService = new window.google.maps.DirectionsService()
        this.directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: this.map,
          suppressMarkers: true // We'll use custom markers
        })

        // Get pickup and delivery addresses
        const pickupAddress = this.getPickupLocation(this.order)
        const deliveryAddress = this.getDeliveryLocation(this.order)

        // Add markers and route
        await this.addMarkersAndRoute(pickupAddress, deliveryAddress)
        
        // Start tracking driver location
        this.startDriverLocationTracking()
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    },

    async addMarkersAndRoute(pickupAddress, deliveryAddress) {
      if (!this.map || !pickupAddress || !deliveryAddress) return

      try {
        const geocoder = new window.google.maps.Geocoder()
        
        // Geocode pickup address
        const pickupCoords = await this.geocodeAddress(geocoder, pickupAddress)
        // Geocode delivery address
        const deliveryCoords = await this.geocodeAddress(geocoder, deliveryAddress)

        const bounds = new window.google.maps.LatLngBounds()

        // Add pickup marker (green P)
        if (pickupCoords) {
          bounds.extend(pickupCoords)
          this.pickupMarker = new window.google.maps.Marker({
            position: pickupCoords,
            map: this.map,
            title: 'Pickup Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                  <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">P</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }
          })
        }

        // Add delivery marker (red D)
        if (deliveryCoords) {
          bounds.extend(deliveryCoords)
          this.destinationMarker = new window.google.maps.Marker({
            position: deliveryCoords,
            map: this.map,
            title: 'Delivery Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#ffffff" stroke-width="3"/>
                  <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">D</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }
          })
        }

        // Show route between pickup and delivery (same as BookService)
        if (pickupCoords && deliveryCoords && this.directionsService && this.directionsRenderer) {
          this.directionsService.route({
            origin: pickupCoords,
            destination: deliveryCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          }, (result, status) => {
            if (status === 'OK') {
              this.directionsRenderer.setDirections(result)
              
              // Update bounds to include route points
              if (result.routes && result.routes[0] && result.routes[0].legs) {
                result.routes[0].legs.forEach(leg => {
                  bounds.extend(leg.start_location)
                  bounds.extend(leg.end_location)
                })
              }
              
              // Fit bounds to show all locations
              if (!bounds.isEmpty()) {
                this.map.fitBounds(bounds, { padding: 80 })
              }
            } else {
              console.error('Directions request failed:', status)
              // If directions fail, at least show both markers
              if (!bounds.isEmpty()) {
                this.map.fitBounds(bounds, { padding: 80 })
              }
            }
          })
        } else if (!bounds.isEmpty()) {
          // If no route, at least show markers
          this.map.fitBounds(bounds, { padding: 80 })
        }
      } catch (error) {
        console.error('Error adding markers and route:', error)
      }
    },

    geocodeAddress(geocoder, address) {
      return new Promise((resolve) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].geometry.location)
          } else {
            console.error('Geocoding failed for:', address, status)
            resolve(null)
          }
        })
      })
    },

    startDriverLocationTracking() {
      if (!this.order?.driverId || !this.map) return

      // Clean up existing listener
      if (this.driverLocationUnsubscribe) {
        this.driverLocationUnsubscribe()
        this.driverLocationUnsubscribe = null
      }

      // Listen to driver's location from drivers collection (currentLocation field)
      const driverRef = doc(db, 'drivers', this.order.driverId)
      
      this.driverLocationUnsubscribe = onSnapshot(driverRef, (driverSnap) => {
        if (!driverSnap.exists()) {
          return
        }

        const driverData = driverSnap.data()
        const driverLocation = driverData.currentLocation

        if (!driverLocation || !driverLocation.lat || !driverLocation.lng) {
          return
        }

        const driverPosition = {
          lat: driverLocation.lat,
          lng: driverLocation.lng
        }

        // Create or update driver marker
        if (!this.driverMarker) {
          this.driverMarker = new window.google.maps.Marker({
            position: driverPosition,
            map: this.map,
            title: 'Driver Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
                  <path d="M20 8l6 12-6 12-6-12 6-12z" fill="#ffffff"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            }
          })
        } else {
          // Smoothly animate marker to new position
          const startPosition = this.driverMarker.getPosition()
          if (startPosition) {
            const endPosition = new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng)
            
            let step = 0
            const steps = 10
            const animateMarker = () => {
              step++
              const progress = step / steps

              const lat = startPosition.lat() + (endPosition.lat() - startPosition.lat()) * progress
              const lng = startPosition.lng() + (endPosition.lng() - startPosition.lng()) * progress

              this.driverMarker.setPosition(new window.google.maps.LatLng(lat, lng))

              if (step < steps) {
                setTimeout(animateMarker, 50)
              }
            }
            animateMarker()
          } else {
            this.driverMarker.setPosition(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
          }
        }

        // Update location text (reverse geocode)
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: driverPosition }, (results, status) => {
            if (status === 'OK' && results[0]) {
              this.driverLocation = results[0].formatted_address
            } else {
              this.driverLocation = `${driverPosition.lat.toFixed(6)}, ${driverPosition.lng.toFixed(6)}`
            }
          })
        } else {
          this.driverLocation = `${driverPosition.lat.toFixed(6)}, ${driverPosition.lng.toFixed(6)}`
        }

        // Calculate distance and ETA to delivery location
        if (this.destinationMarker) {
          const dropoffPos = this.destinationMarker.getPosition()
          if (dropoffPos) {
            const distance = this.calculateDistance(
              driverPosition.lat,
              driverPosition.lng,
              dropoffPos.lat(),
              dropoffPos.lng()
            )
            this.remainingDistance = this.formatDistance(distance)
            this.estimatedArrival = this.formatTime(distance)
          }
        }

        // Update map bounds to include driver, pickup, and delivery
        if (this.pickupMarker && this.destinationMarker) {
          const bounds = new window.google.maps.LatLngBounds()
          
          const pickupPos = this.pickupMarker.getPosition()
          if (pickupPos) bounds.extend(pickupPos)
          
          const dropoffPos = this.destinationMarker.getPosition()
          if (dropoffPos) bounds.extend(dropoffPos)
          
          bounds.extend(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
          
          this.map.fitBounds(bounds, { padding: 100 })
        } else {
          // If markers not available, just pan to driver
          setTimeout(() => {
            if (this.map) {
              this.map.panTo(driverPosition)
            }
          }, 500)
        }
      }, (error) => {
        console.error('Error listening to driver location:', error)
      })
    },

    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371 // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLng = (lng2 - lng1) * Math.PI / 180
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },

    formatDistance(km) {
      if (km < 1) {
        return `${Math.round(km * 1000)}m`
      }
      return `${km.toFixed(1)}km`
    },

    formatTime(km) {
      // Assuming average speed of 30 km/h
      const hours = km / 30
      const minutes = Math.round(hours * 60)
      if (minutes < 60) {
        return `${minutes} min${minutes !== 1 ? 's' : ''}`
      }
      const hrs = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hrs}h ${mins}m`
    },

    subscribeToOrderUpdates() {
      realtimeService.subscribeToOrder(this.orderId, (order) => {
        this.order = order
        this.updateStatusSteps()
        // Re-initialize map when order data is available
        if (this.mapsReady && this.order) {
          this.$nextTick(() => {
            this.initializeMap()
          })
        }
      })
    },

    updateStatusSteps() {
      if (!this.order) return

      const statusTimes = {
        confirmed: this.order.confirmedAt,
        driver_assigned: this.order.driverAssignedAt,
        in_transit: this.order.inTransitAt,
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
      
      const statusOrder = ['confirmed', 'driver_assigned', 'in_transit', 'delivered']
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
