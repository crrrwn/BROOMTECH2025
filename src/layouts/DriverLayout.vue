<template>
  <div class="flex h-screen bg-gray-50 font-sans overflow-hidden">
    
    <transition enter-active-class="transition-opacity ease-linear duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity ease-linear duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false" 
        class="fixed inset-0 bg-black/50 z-20 md:hidden"
      ></div>
    </transition>

    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      
      <div class="h-20 flex items-center px-8 border-b border-gray-50 justify-between">
        <div class="flex items-center">
          <img src="/LOGO.jpg" alt="Broooom Logo" class="w-10 h-10 rounded-xl shadow-lg object-cover" />
          <span class="ml-3 text-xl font-bold text-gray-800 tracking-tight">Broooom</span>
        </div>
        <button @click="isSidebarOpen = false" class="md:hidden text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
        
        <router-link 
          to="/driver" 
          @click="isSidebarOpen = false"
          class="flex items-center px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-xl group" 
          active-class="bg-green-50 text-[#3ED400]"
        >
          <svg class="w-5 h-5 mr-3 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Dashboard
        </router-link>

        <router-link 
          to="/driver/assignments" 
          @click="isSidebarOpen = false"
          class="flex items-center px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-xl group" 
          active-class="bg-green-50 text-[#3ED400]"
        >
          <svg class="w-5 h-5 mr-3 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          Assignments
          <span v-if="activeAssignmentsCount > 0" class="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{{ activeAssignmentsCount }}</span>
        </router-link>

        <router-link 
          to="/driver/remit" 
          @click="isSidebarOpen = false"
          class="flex items-center px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-xl group" 
          active-class="bg-green-50 text-[#3ED400]"
        >
           <svg class="w-5 h-5 mr-3 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
           Remit Payment
        </router-link>

        <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Settings</p>
        
        <router-link 
          to="/driver/profile" 
          @click="isSidebarOpen = false"
          class="flex items-center px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-xl group" 
          active-class="bg-green-50 text-[#3ED400]"
        >
          <svg class="w-5 h-5 mr-3 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          My Profile
        </router-link>

        <button 
          @click="toggleLocationTracking(); isSidebarOpen = false" 
          :class="['w-full flex items-center px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-xl group', isTrackingLocation ? 'text-blue-600 bg-blue-50' : '']"
        >
           <svg class="w-5 h-5 mr-3 group-hover:text-[#3ED400] transition-colors" :class="isTrackingLocation ? 'animate-pulse text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
           {{ isTrackingLocation ? 'Tracking Active' : 'Enable Tracking' }}
        </button>
      </nav>

      <div class="p-4 border-t border-gray-100 bg-gray-50/50">
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <p class="text-xs font-bold text-gray-400 uppercase mb-3">Availability Status</p>
           
           <button 
             @click="handleToggleStatus"
             :disabled="!userLoaded"
             class="relative w-full h-12 rounded-full transition-all duration-300 shadow-inner group overflow-hidden"
             :class="driverStore.isOnline ? 'bg-[#3ED400]' : 'bg-gray-200'"
           >
             <div class="absolute inset-y-0 left-0 px-4 flex items-center text-xs font-bold text-white uppercase tracking-wider" v-if="driverStore.isOnline">Online</div>
             <div class="absolute inset-y-0 right-0 px-4 flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider" v-else>Offline</div>
             
             <div 
                class="absolute top-1 bottom-1 w-10 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center"
                :class="driverStore.isOnline ? 'translate-x-[calc(190px-48px)]' : 'translate-x-1 left-0'"
                style="/* fallback for translate calculation if needed */"
             >
                <div class="w-2 h-2 rounded-full" :class="driverStore.isOnline ? 'bg-[#3ED400]' : 'bg-gray-400'"></div>
             </div>
           </button>
           <p class="text-[10px] text-gray-400 mt-2 font-medium">{{ userLoaded ? (driverStore.isOnline ? 'Visible to customers' : 'Currently offline') : 'Loading...' }}</p>
        </div>
        
        <button @click="confirmLogout" class="w-full mt-4 flex items-center justify-center px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
           <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           Sign Out
        </button>
      </div>

    </aside>

    <div class="flex-1 flex flex-col overflow-hidden relative">
      
      <header class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10 shrink-0">
         
         <div class="md:hidden flex items-center">
            <button @click="isSidebarOpen = true" class="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
               <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <span class="ml-3 font-bold text-lg text-gray-800">BroomTech</span>
         </div>

         <h2 class="hidden md:block text-2xl font-extrabold text-gray-900 tracking-tight">{{ pageTitle }}</h2>

         <div class="flex items-center gap-4">
           
            <div class="relative">
               <button @click="showNotifications = !showNotifications" class="relative p-2.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
               </button>

               <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                  <div v-if="showNotifications" class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden" @click.stop>
                     <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <span class="text-sm font-bold text-gray-700">Notifications</span>
                        <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-xs font-bold text-[#3ED400] hover:text-[#32b000]">Mark all read</button>
                     </div>
                     <div class="max-h-80 overflow-y-auto">
                        <div v-if="loadingNotifications" class="p-6 text-center"><div class="animate-spin w-6 h-6 border-2 border-gray-200 border-t-[#3ED400] rounded-full mx-auto"></div></div>
                        <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                        <div v-else>
                           <div v-for="notif in notifications" :key="notif.id" @click="markAsRead(notif)" :class="['px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3', !notif.read ? 'bg-blue-50/30' : '']">
                              <div :class="['w-2 h-2 rounded-full mt-2 shrink-0', !notif.read ? 'bg-blue-500' : 'bg-gray-200']"></div>
                              <div>
                                 <p class="text-sm font-bold text-gray-800">{{ notif.title || 'Update' }}</p>
                                 <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ notif.message || notif.body }}</p>
                                 <p class="text-[10px] text-gray-400 mt-1">{{ formatDate(notif.createdAt) }}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </transition>
            </div>

            <div class="flex items-center gap-3 pl-4 border-l border-gray-100">
               <div class="text-right hidden sm:block">
                  <p class="text-sm font-bold text-gray-900 leading-tight">{{ driverName }}</p>
                  <p class="text-xs text-gray-500 font-medium">Driver</p>
               </div>
               <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#74E600] to-[#00C851] flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                  {{ driverInitials }}
               </div>
            </div>

         </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50">
         <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
               <component :is="Component" />
            </transition>
         </router-view>
      </main>

    </div>

    <Transition name="fade">
      <div v-if="showLogoutModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center transform transition-all scale-100 border border-gray-100">
          
          <div class="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>

          <h3 class="text-xl font-black text-gray-800 mb-2">End Session?</h3>
          <p class="text-sm text-gray-500 mb-8 font-medium leading-relaxed">
            Are you sure you want to close / end your session?
          </p>
          
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="showLogoutModal = false" 
              class="py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
            >
              No, Cancel
            </button>
            <button 
              @click="executeLogout" 
              class="py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useDriverStore } from '@/stores/driver'
import { db } from '@/firebase/config'
import { doc, updateDoc, collection, query, where, onSnapshot, orderBy, limit, serverTimestamp } from 'firebase/firestore'

export default {
  name: 'DriverLayout',
  setup() {
    const authStore = useAuthStore()
    const driverStore = useDriverStore()
    return { authStore, driverStore }
  },
  data() {
    return {
      // Added for the new design's mobile menu
      isSidebarOpen: false, 
      
      // Existing data from your code
      userLoaded: false,
      availableBookingsCount: 3,
      activeAssignmentsCount: 0,
      isTrackingLocation: false,
      locationWatchId: null,
      currentLocation: null,
      locationPermissionDenied: false, // Track if permission was denied
      showNotifications: false,
      notifications: [],
      loadingNotifications: false,
      unreadCount: 0,
      notificationsUnsubscribe: null,
      assignmentsUnsubscribe: null,
      showLogoutModal: false
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
    this.fetchNotifications()
    this.setupAssignmentsListener()
    
    // Auto-enable location tracking on login (silent mode - no toast)
    // Only if permission wasn't previously denied
    if (this.authStore.user && !this.isTrackingLocation && !this.locationPermissionDenied) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        this.toggleLocationTracking(true) // Pass true for silent mode
      }, 1000)
    }
    
    // Close notifications when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    console.log('[v0] DriverLayout unmounting, cleaning up listeners')
    this.driverStore.cleanup()
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId)
    }
    if (this.notificationsUnsubscribe) {
      this.notificationsUnsubscribe()
    }
    if (this.assignmentsUnsubscribe) {
      this.assignmentsUnsubscribe()
    }
    document.removeEventListener('click', this.handleClickOutside)
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
    
    confirmLogout() {
      this.isSidebarOpen = false
      this.showLogoutModal = true
    },

    executeLogout() {
      this.showLogoutModal = false
      this.$router.push('/')
      
      // Perform cleanup and logout in background without blocking
      this.driverStore.cleanup()
      this.authStore.logout().catch(error => {
        console.error('[v0] Logout error:', error)
      })
    },
    
    async toggleLocationTracking(silent = false) {
      try {
        if (!this.isTrackingLocation) {
          // Start tracking location using Geolocation API
          if (navigator.geolocation) {
            const userId = this.authStore.user?.uid
            if (!userId) {
              if (!silent) this.$toast.error('User not authenticated')
              return
            }

            this.locationWatchId = navigator.geolocation.watchPosition(
              async (position) => {
                this.currentLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  timestamp: new Date()
                }
                console.log('[v0] Location updated:', this.currentLocation)
                
                // Save location to Firestore for accurate tracking
                try {
                  const driverRef = doc(db, 'drivers', userId)
                  await updateDoc(driverRef, {
                    currentLocation: {
                      lat: this.currentLocation.lat,
                      lng: this.currentLocation.lng,
                      accuracy: this.currentLocation.accuracy,
                      timestamp: serverTimestamp(),
                      updatedAt: new Date()
                    },
                    lastLocationUpdate: serverTimestamp()
                  })
                  console.log('[v0] Driver location saved to Firestore')
                } catch (error) {
                  console.error('[v0] Error saving location to Firestore:', error)
                }
              },
              (error) => {
                // Handle different geolocation error codes
                // Code 1: PERMISSION_DENIED - User denied location permission
                // Code 2: POSITION_UNAVAILABLE - Location unavailable
                // Code 3: TIMEOUT - Request timeout (common, expected - don't log as error)
                if (error.code === 3) {
                  // Timeout is expected and common - just log as debug, don't show error
                  console.log('[v0] Location tracking timeout (expected):', error.message)
                  // Silently retry or continue - timeout is not a critical error
                  return
                }
                
                // Only log actual errors (permission denied, position unavailable)
                if (error.code === 1) {
                  // Permission denied - mark it and stop trying
                  this.locationPermissionDenied = true
                  // Don't log warning if silent mode (auto-enable on login)
                  if (!silent) {
                    console.warn('[v0] Location permission denied:', error.message)
                    this.$toast.warning('Location permission denied. Please enable location access in browser settings.')
                  }
                  // Stop watching if permission is denied
                  if (this.locationWatchId) {
                    navigator.geolocation.clearWatch(this.locationWatchId)
                    this.locationWatchId = null
                    this.isTrackingLocation = false
                  }
                } else if (error.code === 2) {
                  console.warn('[v0] Location unavailable:', error.message)
                  if (!silent) this.$toast.warning('Location unavailable. Please check your GPS settings.')
                } else {
                  console.warn('[v0] Location tracking error:', error.message)
                  if (!silent) this.$toast.warning('Location tracking issue: ' + error.message)
                }
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            )
            this.isTrackingLocation = true
            if (!silent) {
              this.$toast.success('Location tracking enabled - Your location will be shared accurately')
            } else {
              console.log('[v0] Location tracking auto-enabled on login')
            }
          } else {
            if (!silent) this.$toast.error('Geolocation not supported on this device')
          }
        } else {
          // Stop tracking location
          if (this.locationWatchId) {
            navigator.geolocation.clearWatch(this.locationWatchId)
            this.locationWatchId = null
          }
          this.isTrackingLocation = false
          if (!silent) {
            this.$toast.success('Location tracking disabled')
          }
        }
      } catch (error) {
        console.error('[v0] Error toggling location tracking:', error)
        if (!silent) this.$toast.error('Failed to toggle location tracking')
      }
    },

    fetchNotifications() {
      try {
        const userId = this.authStore.user?.uid
        if (!userId) return

        this.loadingNotifications = true
        // Query notifications by userId AND recipientType: 'driver' (to get notifications from Admin)
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          where('recipientType', '==', 'driver'),
          limit(50)
        )

        this.notificationsUnsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          let notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          // Sort manually by createdAt (descending)
          notifications.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
            return dateB - dateA
          })
          
          this.notifications = notifications
          this.unreadCount = this.notifications.filter(n => !n.read).length
          this.loadingNotifications = false
          console.log('[v0] Driver notifications updated:', this.notifications.length)
        }, (error) => {
          // Fallback: if query fails (e.g., no index), try without recipientType filter
          console.log('[v0] Notification query with recipientType failed, trying fallback:', error.message)
          const fallbackQuery = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            limit(50)
          )
          this.notificationsUnsubscribe = onSnapshot(fallbackQuery, (snapshot) => {
            let notifications = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(n => !n.recipientType || n.recipientType === 'driver') // Filter in memory
            
            notifications.sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
              return dateB - dateA
            })
            
            this.notifications = notifications
            this.unreadCount = this.notifications.filter(n => !n.read).length
            this.loadingNotifications = false
          }, (fallbackError) => {
            this.loadingNotifications = false
          })
        })
      } catch (error) {
        console.error('[v0] Error setting up notifications listener:', error)
        this.loadingNotifications = false
      }
    },

    async markAsRead(notification) {
      if (notification.read) return
      
      try {
        await updateDoc(doc(db, 'notifications', notification.id), {
          read: true,
          readAt: serverTimestamp()
        })
      } catch (error) {
        console.error('[v0] Error marking notification as read:', error)
      }
    },

    async markAllAsRead() {
      try {
        const unreadNotifications = this.notifications.filter(n => !n.read)
        const updatePromises = unreadNotifications.map(notification =>
          updateDoc(doc(db, 'notifications', notification.id), {
            read: true,
            readAt: serverTimestamp()
          })
        )
        
        await Promise.all(updatePromises)
        this.$toast.success('All notifications marked as read')
      } catch (error) {
        console.error('[v0] Error marking all as read:', error)
        this.$toast.error('Failed to mark notifications as read')
      }
    },

    formatDate(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      return date.toLocaleDateString()
    },

    handleClickOutside(event) {
      const notificationButton = event.target.closest('.relative')
      const notificationDropdown = event.target.closest('.absolute.right-0')
      
      if (!notificationButton && !notificationDropdown) {
        this.showNotifications = false
      }
    },

    setupAssignmentsListener() {
      try {
        const userId = this.authStore.user?.uid
        if (!userId) return

        // Query for orders assigned to this driver by admin
        const assignmentsQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', userId),
          where('status', 'in', ['confirmed', 'driver_assigned', 'in_transit', 'on_the_way', 'assigned'])
        )

        this.assignmentsUnsubscribe = onSnapshot(assignmentsQuery, (snapshot) => {
          // Only show count if there are actual assignments from admin
          this.activeAssignmentsCount = snapshot.size
          console.log('[v0] Active assignments count:', this.activeAssignmentsCount)
        }, (error) => {
          console.error('[v0] Error loading assignments:', error)
          this.activeAssignmentsCount = 0
        })
      } catch (error) {
        console.error('[v0] Error setting up assignments listener:', error)
        this.activeAssignmentsCount = 0
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>