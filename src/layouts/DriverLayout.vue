<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg">
        <div class="p-6">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">B</span>
            </div>
            <span class="text-xl font-bold text-gray-900">BroomTech</span>
          </div>
          <div class="mt-4">
            <span class="text-sm text-gray-500">Driver Portal</span>
          </div>
        </div>
        
        <!-- Online/Offline Toggle -->
        <div class="px-6 pb-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-700">Status</span>
            <button 
              @click="handleToggleStatus"
              :disabled="!userLoaded"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                driverStore.isOnline ? 'bg-primary' : 'bg-gray-300',
                !userLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  driverStore.isOnline ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ userLoaded ? (driverStore.isOnline ? 'You are online and available for bookings' : 'You are offline') : 'Loading status...' }}
          </p>
        </div>
        
        <nav class="mt-2">
          <div class="px-6 py-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          </div>
          
          <div class="mt-2 space-y-1">
            <button
              @click="toggleLocationTracking"
              class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors text-left"
              :class="isTrackingLocation ? 'bg-blue-100 text-blue-700' : ''"
              title="Toggle location tracking"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ isTrackingLocation ? 'Tracking Active' : 'Use My Location' }}</span>
            </button>
            
            <router-link to="/driver" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              Dashboard
            </router-link>
            
            <router-link to="/driver/assignments" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              My Assignments
              <span v-if="activeAssignmentsCount > 0" class="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1">
                {{ activeAssignmentsCount }}
              </span>
            </router-link>
            
            <router-link to="/driver/chat" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Chat with Customers
            </router-link>
            
            <!-- Updated menu item from "Upload Proof & Payment" to "Remit Payment" -->
            <router-link to="/driver/remit" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              Remit Payment
            </router-link>
            
            <router-link to="/driver/profile" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </router-link>
          </div>
          
          <div class="mt-8 px-6">
            <button @click="logout" class="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>
      
      <!-- Main content -->
      <div class="flex-1">
        <!-- Top bar -->
        <header class="bg-white shadow-sm border-b">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
                <div class="flex items-center space-x-2">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    driverStore.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  ]"></div>
                  <span class="text-sm text-gray-600">{{ driverStore.isOnline ? 'Online' : 'Offline' }}</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="text-sm text-gray-500">Today's Earnings</p>
                  <p class="text-lg font-semibold text-primary">₱{{ driverStore.hasRemitted ? driverStore.todayEarnings.driverShare : '0.00' }}</p>
                  <p v-if="!driverStore.hasRemitted" class="text-xs text-gray-400">Pending remittance</p>
                </div>
                
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ driverInitials }}</span>
                  </div>
                  <span class="text-gray-700">{{ driverName }}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Page content -->
        <main class="p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useDriverStore } from '@/stores/driver'

export default {
  name: 'DriverLayout',
  setup() {
    const authStore = useAuthStore()
    const driverStore = useDriverStore()
    return { authStore, driverStore }
  },
  data() {
    return {
      userLoaded: false,
      availableBookingsCount: 3,
      activeAssignmentsCount: 1,
      isTrackingLocation: false,
      locationWatchId: null,
      currentLocation: null
    }
  },
  computed: {
    pageTitle() {
      const titles = {
        'driver-dashboard': 'Dashboard',
        'available-bookings': 'Available Bookings',
        'my-assignments': 'My Assignments',
        'driver-chat': 'Chat with Customers',
        'remit': 'Remit Payment',
        'driver-profile': 'Profile'
      }
      return titles[this.$route.name] || 'Dashboard'
    },
    driverName() {
      const profile = this.authStore.userProfile
      if (!profile) return 'Driver'
      
      if (profile.fullName) {
        return profile.fullName
      }
      return `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Driver'
    },
    driverInitials() {
      const profile = this.authStore.userProfile
      if (!profile) return 'D'
      
      if (profile.fullName) {
        return profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      }
      return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'D'
    }
  },
  async mounted() {
    console.log('[v0] DriverLayout mounted')
    await this.loadDriverStatus()
  },
  beforeUnmount() {
    console.log('[v0] DriverLayout unmounting, cleaning up listeners')
    this.driverStore.cleanup()
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId)
    }
  },
  methods: {
    async loadDriverStatus() {
      try {
        const user = this.authStore.user
        if (!user) {
          console.log('[v0] No user found, redirecting to login')
          this.$router.push('/driver/login')
          return
        }

        console.log('[v0] Loading driver profile for user:', user.uid)
        
        await this.authStore.fetchUserProfile()
        
        const profile = this.authStore.userProfile
        console.log('[v0] Driver profile loaded:', profile)
        
        if (!profile) {
          console.log('[v0] No profile found, redirecting to login')
          this.$router.push('/driver/login')
          return
        }

        if (profile.role !== 'driver') {
          console.log('[v0] User is not a driver, role:', profile.role)
          this.$toast.error('Access denied. This account is not registered as a driver.')
          this.$router.push('/login')
          return
        }

        this.userLoaded = true
        
        this.driverStore.initializeStatusListener(user.uid)
        
        console.log('[v0] Driver status listener initialized')
        
      } catch (error) {
        console.error('[v0] Error loading driver status:', error)
        this.$toast.error('Error loading driver profile')
        this.userLoaded = true
      }
    },

    async handleToggleStatus() {
      if (!this.userLoaded) {
        console.log('[v0] User not loaded yet, cannot toggle status')
        return
      }

      const success = await this.driverStore.toggleOnlineStatus()
      
      if (success) {
        this.$toast.success(
          this.driverStore.isOnline 
            ? 'You are now online and available for bookings!' 
            : 'You are now offline'
        )
      } else {
        this.$toast.error('Failed to update status. Please try again.')
      }
    },
    
    logout() {
      this.$router.push('/')
      
      // Perform cleanup and logout in background without blocking
      this.driverStore.cleanup()
      this.authStore.logout().catch(error => {
        console.error('[v0] Logout error:', error)
      })
    },
    
    async toggleLocationTracking() {
      try {
        if (!this.isTrackingLocation) {
          // Start tracking location using Geolocation API
          if (navigator.geolocation) {
            this.locationWatchId = navigator.geolocation.watchPosition(
              (position) => {
                this.currentLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  timestamp: new Date()
                }
                console.log('[v0] Location updated:', this.currentLocation)
              },
              (error) => {
                console.error('[v0] Location tracking error:', error)
                this.$toast.error('Unable to track location: ' + error.message)
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            )
            this.isTrackingLocation = true
            this.$toast.success('Location tracking enabled')
          } else {
            this.$toast.error('Geolocation not supported on this device')
          }
        } else {
          // Stop tracking location
          if (this.locationWatchId) {
            navigator.geolocation.clearWatch(this.locationWatchId)
            this.locationWatchId = null
          }
          this.isTrackingLocation = false
          this.$toast.success('Location tracking disabled')
        }
      } catch (error) {
        console.error('[v0] Error toggling location tracking:', error)
        this.$toast.error('Failed to toggle location tracking')
      }
    }
  }
}
</script>
