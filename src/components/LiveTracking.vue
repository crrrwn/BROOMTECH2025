<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-full">
    <!-- Header -->
    <div class="p-4 sm:p-5 md:p-6 border-b bg-gradient-to-r from-[#A8EB12] via-[#74E600] to-[#3ED400]">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div class="flex-1">
          <h3 class="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Live Tracking</h3>
          <p class="text-sm sm:text-base text-white/90 mt-1 font-medium">Order #{{ order?.id }}</p>
        </div>
        <div class="flex items-center space-x-3 w-full sm:w-auto">
          <div class="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div class="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-lg"></div>
            <span class="ml-2 text-sm font-semibold text-white">Live</span>
          </div>
          <button @click="refreshTracking" class="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="relative w-full">
      <div id="tracking-map" ref="mapContainer" class="h-64 sm:h-80 md:h-96 lg:h-[450px] w-full bg-gradient-to-br from-[#A8EB12]/10 to-[#00C851]/10 flex items-center justify-center">
        <!-- Map will be rendered here by Google Maps API -->
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
        <div class="flex flex-col items-center space-y-4">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-[#74E600] rounded-full animate-bounce shadow-lg"></div>
            <div class="w-4 h-4 bg-[#3ED400] rounded-full animate-bounce shadow-lg" style="animation-delay: 0.1s"></div>
            <div class="w-4 h-4 bg-[#00C851] rounded-full animate-bounce shadow-lg" style="animation-delay: 0.2s"></div>
          </div>
          <p class="text-sm font-medium text-gray-700">Updating location...</p>
        </div>
      </div>
    </div>

    <!-- Order Status -->
    <div class="p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6">
      <!-- Status Timeline -->
      <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
        <h4 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Order Status</h4>
        <div class="flex items-center justify-between relative status-timeline">
          <div v-for="(step, index) in statusSteps" :key="step.status" class="flex flex-col items-center flex-1 relative z-10">
            <div class="flex items-center w-full mb-2">
              <div :class="getStepClass(step.status)" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-300 transform hover:scale-110 relative z-20">
                <svg v-if="isStepCompleted(step.status)" class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span v-else class="text-xs sm:text-sm">{{ index + 1 }}</span>
              </div>
              <div v-if="index < statusSteps.length - 1" :class="getStepLineClass(step.status)" class="flex-1 h-1.5 mx-2 sm:mx-3 rounded-full transition-all duration-500"></div>
            </div>
            <span class="text-xs sm:text-sm font-medium text-gray-700 mt-2 text-center px-1">{{ step.label }}</span>
            <span v-if="step.time" class="text-xs text-[#00C851] font-semibold mt-1">{{ formatTime(step.time) }}</span>
          </div>
        </div>
      </div>

      <!-- Driver Info -->
      <div v-if="order?.driver" class="bg-gradient-to-r from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 rounded-xl p-4 sm:p-5 border-2 border-[#74E600]/20 shadow-md">
        <h4 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Driver Information</h4>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center space-x-3 sm:space-x-4 flex-1">
            <div class="relative">
              <img :src="order.driver.avatar || '/placeholder.svg?height=40&width=40'" :alt="order.driver.name" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-[#74E600] shadow-lg object-cover">
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00C851] rounded-full border-2 border-white"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-900 text-base sm:text-lg truncate">{{ order.driver.name }}</p>
              <p class="text-sm sm:text-base text-gray-600 mt-1">{{ order.driver.vehicle }} • {{ order.driver.plateNumber }}</p>
            </div>
          </div>
          <div class="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
            <!-- Phone button -->
            <button @click="showPhoneNumber" class="flex-1 sm:flex-none px-4 sm:px-3 py-2.5 sm:py-2.5 bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white rounded-lg hover:from-[#00C851] hover:to-[#3ED400] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative group">
              <svg class="w-5 h-5 sm:w-4 sm:h-4 mx-auto sm:mx-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span class="sm:hidden ml-2 text-sm font-semibold">Call</span>
            </button>
            <!-- Message button -->
            <button @click="openChat" class="flex-1 sm:flex-none px-4 sm:px-3 py-2.5 sm:py-2.5 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white rounded-lg hover:from-[#3ED400] hover:to-[#74E600] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
              <svg class="w-5 h-5 sm:w-4 sm:h-4 mx-auto sm:mx-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="sm:hidden ml-2 text-sm font-semibold">Message</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Delivery Details -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-[#A8EB12]/10 to-[#74E600]/10 rounded-xl p-4 sm:p-5 border border-[#74E600]/20 shadow-sm">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-5 h-5 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Estimated Arrival</p>
          </div>
          <p class="text-xl sm:text-2xl font-bold text-[#00C851]">{{ estimatedArrival }}</p>
        </div>
        <div class="bg-gradient-to-br from-[#3ED400]/10 to-[#00C851]/10 rounded-xl p-4 sm:p-5 border border-[#3ED400]/20 shadow-sm">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-5 h-5 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Distance Remaining</p>
          </div>
          <p class="text-xl sm:text-2xl font-bold text-[#00C851]">{{ remainingDistance }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Phone Number Modal -->
    <transition name="modal">
      <div v-if="showPhoneModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showPhoneModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-[#A8EB12] via-[#74E600] to-[#3ED400] p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white">Driver Contact</h3>
              </div>
              <button @click="showPhoneModal = false" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6">
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-[#74E600]/20">
              <div class="space-y-4">
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Driver Name</p>
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-full flex items-center justify-center text-white font-bold">
                      {{ order?.driver?.name?.charAt(0) || 'D' }}
                    </div>
                    <p class="text-lg font-bold text-gray-900">{{ order?.driver?.name }}</p>
                  </div>
                </div>
                <div class="pt-4 border-t border-gray-200">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</p>
                  <div class="flex items-center space-x-3">
                    <div class="flex-1 bg-white rounded-lg p-3 border-2 border-[#00C851]/30">
                      <p class="font-mono text-xl font-bold text-[#00C851] text-center">{{ order?.driver?.phone }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button @click="callDriver" class="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white rounded-xl hover:from-[#00C851] hover:to-[#3ED400] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>Call Driver</span>
              </button>
              <button @click="showPhoneModal = false" class="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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

        // Add pickup marker using pin_location.png image
        if (pickupCoords) {
          bounds.extend(pickupCoords)
          
          // Create marker with pin_location.png, with fallback if image doesn't load
          const createPickupPinMarker = (iconUrl, isFallback = false) => {
            this.pickupMarker = new window.google.maps.Marker({
              position: pickupCoords,
              map: this.map,
              title: 'Pickup Location',
              icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(50, 50),
                anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
              }
            })
            
            // If using custom image, verify it loads
            if (!isFallback) {
              const testImage = new Image()
              testImage.onerror = () => {
                console.warn('pin_location.png failed to load for pickup, removing marker to recreate with fallback')
                if (this.pickupMarker) {
                  this.pickupMarker.setMap(null)
                  this.pickupMarker = null
                  createPickupPinMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 0C11.193 0 0 11.193 0 25c0 25 25 25 25 25s25 0 25-25C50 11.193 38.807 0 25 0z" fill="#10B981"/>
                      <circle cx="25" cy="25" r="8" fill="#ffffff"/>
                    </svg>
                  `), true)
                }
              }
              testImage.src = iconUrl
            }
          }
          
          // Try to use PIN_LOCATION.png for pickup location
          createPickupPinMarker('/PIN_LOCATION.png')
        }

        // Add delivery marker using pin_location.png image
        if (deliveryCoords) {
          bounds.extend(deliveryCoords)
          
          // Create marker with pin_location.png, with fallback if image doesn't load
          const createPinMarker = (iconUrl, isFallback = false) => {
            this.destinationMarker = new window.google.maps.Marker({
              position: deliveryCoords,
              map: this.map,
              title: 'Delivery Location',
              icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(50, 50),
                anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
              }
            })
            
            // If using custom image, verify it loads
            if (!isFallback) {
              const testImage = new Image()
              testImage.onerror = () => {
                console.warn('pin_location.png failed to load, removing marker to recreate with fallback')
                if (this.destinationMarker) {
                  this.destinationMarker.setMap(null)
                  this.destinationMarker = null
                  createPinMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 0C11.193 0 0 11.193 0 25c0 25 25 25 25 25s25 0 25-25C50 11.193 38.807 0 25 0z" fill="#10B981"/>
                      <circle cx="25" cy="25" r="8" fill="#ffffff"/>
                    </svg>
                  `), true)
                }
              }
              testImage.src = iconUrl
            }
          }
          
          // Try to use PIN_LOCATION.png first
          createPinMarker('/PIN_LOCATION.png')
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

        // Create or update driver marker using rider.png image
        if (!this.driverMarker) {
          // Create marker with rider.png, with fallback if image doesn't load
          const createDriverMarker = (iconUrl, isFallback = false) => {
            this.driverMarker = new window.google.maps.Marker({
              position: driverPosition,
              map: this.map,
              title: 'Driver Location',
              icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(60, 60),
                anchor: new window.google.maps.Point(30, 30)
              },
              optimized: false
            })
            
            // If using custom image, verify it loads
            if (!isFallback) {
              const testImage = new Image()
              testImage.onerror = () => {
                console.warn('rider.png failed to load, removing marker to recreate with fallback')
                if (this.driverMarker) {
                  this.driverMarker.setMap(null)
                  this.driverMarker = null
                  createDriverMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="30" cy="30" r="28" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                      <text x="30" y="38" text-anchor="middle" fill="white" font-size="24" font-weight="bold">🚴</text>
                    </svg>
                  `), true)
                }
              }
              testImage.src = iconUrl
            }
          }
          
          // Try to use RIDER.png first
          createDriverMarker('/RIDER.png')
        } else {
          // Optimized smooth animation - reduced steps for better performance
          const startPosition = this.driverMarker.getPosition()
          if (startPosition) {
            const endPosition = new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng)
            
            // Calculate distance to determine animation steps
            const distance = Math.sqrt(
              Math.pow(endPosition.lat() - startPosition.lat(), 2) + 
              Math.pow(endPosition.lng() - startPosition.lng(), 2)
            )
            
            // Optimized: fewer steps for better performance, still smooth
            const steps = Math.max(10, Math.min(20, Math.ceil(distance * 500)))
            
            let step = 0
            const animateMarker = () => {
              step++
              const progress = step / steps
              // Use easing function for smoother animation
              const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2

              const lat = startPosition.lat() + (endPosition.lat() - startPosition.lat()) * easedProgress
              const lng = startPosition.lng() + (endPosition.lng() - startPosition.lng()) * easedProgress

              this.driverMarker.setPosition(new window.google.maps.LatLng(lat, lng))

              if (step < steps) {
                requestAnimationFrame(() => {
                  setTimeout(animateMarker, 16) // ~60fps for smooth movement
                })
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

        // Optimized pan map to follow driver movement (real-time tracking)
        if (this.map) {
          // Use requestAnimationFrame for smooth panning
          requestAnimationFrame(() => {
            // Smoothly pan to driver location to show movement
            this.map.panTo(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
            
            // Update map bounds to include driver, pickup, and delivery (throttled)
            if (this.pickupMarker && this.destinationMarker) {
              const bounds = new window.google.maps.LatLngBounds()
              
              const pickupPos = this.pickupMarker.getPosition()
              if (pickupPos) bounds.extend(pickupPos)
              
              const dropoffPos = this.destinationMarker.getPosition()
              if (dropoffPos) bounds.extend(dropoffPos)
              
              bounds.extend(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
              
              // Fit bounds to show all locations - but don't force it, let panTo handle movement
              // Only fit bounds if driver is far from viewport (optimized threshold)
              const mapCenter = this.map.getCenter()
              if (mapCenter) {
                const distanceFromCenter = Math.sqrt(
                  Math.pow(driverPosition.lat - mapCenter.lat(), 2) + 
                  Math.pow(driverPosition.lng - mapCenter.lng(), 2)
                )
                
                // If driver is far from center, fit bounds to show everything
                if (distanceFromCenter > 0.015) {
                  this.map.fitBounds(bounds, { padding: 80 })
                }
              }
            } else {
              // If markers not available, just pan to driver
              this.map.panTo(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
            }
          })
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
        return 'bg-gradient-to-br from-[#3ED400] to-[#00C851]'
      } else if (this.isCurrentStep(status)) {
        return 'bg-gradient-to-br from-[#74E600] to-[#3ED400] animate-pulse'
      } else {
        return 'bg-gray-300'
      }
    },

    getStepLineClass(status) {
      if (this.isStepCompleted(status)) {
        return 'bg-gradient-to-r from-[#3ED400] to-[#00C851]'
      } else if (this.isCurrentStep(status)) {
        return 'bg-gradient-to-r from-[#74E600] to-[#3ED400]'
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
      // Optimized refresh - no artificial delays
      this.loading = true
      // Re-initialize map immediately for real-time updates
      if (this.mapsReady && this.order) {
        this.$nextTick(() => {
          this.initializeMap()
          this.loading = false
        })
      } else {
        this.loading = false
      }
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

<style scoped>
/* Modal Transition Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}

/* Smooth animations for status steps */
@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  #tracking-map {
    height: 16rem !important;
  }
  
  .status-timeline {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  #tracking-map {
    height: 24rem !important;
  }
}

/* Performance optimizations */
* {
  will-change: auto;
}

.animate-pulse {
  animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Touch-friendly buttons on mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px; /* iOS recommended touch target */
  }
}

/* Prevent layout shift */
#tracking-map {
  min-height: 16rem;
}
</style>
