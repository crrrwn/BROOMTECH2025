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
                <!-- Notifications Icon -->
                <div class="relative">
                  <button
                    @click="showNotifications = !showNotifications"
                    class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span
                      v-if="unreadCount > 0"
                      class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {{ unreadCount > 9 ? '9+' : unreadCount }}
                    </span>
                  </button>
                  
                  <!-- Notifications Modal -->
                  <div
                    v-if="showNotifications"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    @click.self="showNotifications = false"
                  >
                    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
                      <div class="p-4 border-b bg-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
                        <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
                        <div class="flex items-center gap-3">
                          <button
                            v-if="notifications.length > 0 && unreadCount > 0"
                            @click="markAllAsRead"
                            class="text-sm text-primary hover:text-primary-dark font-medium"
                          >
                            Mark all as read
                          </button>
                          <button
                            @click="showNotifications = false"
                            class="text-gray-500 hover:text-gray-700"
                          >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div class="overflow-y-auto flex-1 p-4">
                        <div v-if="loadingNotifications" class="text-center py-8 text-gray-500">
                          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p>Loading notifications...</p>
                        </div>
                        <div v-else-if="notifications.length === 0" class="text-center py-8 text-gray-500">
                          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <p class="text-lg font-medium">No notifications</p>
                          <p class="text-sm mt-2">You're all caught up!</p>
                        </div>
                        <div v-else class="space-y-2">
                          <div
                            v-for="notification in notifications"
                            :key="notification.id"
                            @click="markAsRead(notification)"
                            :class="[
                              'p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors',
                              !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                            ]"
                          >
                            <div class="flex items-start space-x-3">
                              <div class="flex-shrink-0">
                                <div :class="[
                                  'w-3 h-3 rounded-full mt-2',
                                  !notification.read ? 'bg-primary' : 'bg-gray-300'
                                ]"></div>
                              </div>
                              <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900">{{ notification.title || 'Notification' }}</p>
                                <p class="text-sm text-gray-600 mt-1">{{ notification.message || notification.body || '' }}</p>
                                <p class="text-xs text-gray-400 mt-2">{{ formatDate(notification.createdAt) }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
      userLoaded: false,
      availableBookingsCount: 3,
      activeAssignmentsCount: 1,
      isTrackingLocation: false,
      locationWatchId: null,
      currentLocation: null,
      showNotifications: false,
      notifications: [],
      loadingNotifications: false,
      unreadCount: 0,
      notificationsUnsubscribe: null
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
            const userId = this.authStore.user?.uid
            if (!userId) {
              this.$toast.error('User not authenticated')
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
                console.error('[v0] Location tracking error:', error)
                this.$toast.error('Unable to track location: ' + error.message)
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            )
            this.isTrackingLocation = true
            this.$toast.success('Location tracking enabled - Your location will be shared accurately')
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
    }
  }
}
</script>
