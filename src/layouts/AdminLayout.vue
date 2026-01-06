<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- Mobile Menu Overlay -->
      <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>
      
      <!-- Sidebar -->
      <div 
        :class="[
          'fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'w-64'
        ]"
      >
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">B</span>
              </div>
              <span class="text-lg sm:text-xl font-bold text-gray-900">BroomTech</span>
            </div>
            <!-- Close button for mobile -->
            <button 
              @click="sidebarOpen = false"
              class="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="mt-4">
            <span class="text-xs sm:text-sm text-gray-500">Admin Portal</span>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="px-4 sm:px-6 pb-4">
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-green-50 p-3 rounded-lg">
              <p class="text-xs text-green-600 font-medium">Active Orders</p>
              <p class="text-lg font-bold text-green-700">{{ activeOrders }}</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-xs text-blue-600 font-medium">Online Drivers</p>
              <p class="text-lg font-bold text-blue-700">{{ onlineDrivers }}</p>
            </div>
          </div>
        </div>
        
        <nav class="mt-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div class="px-4 sm:px-6 py-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
          </div>
          
          <div class="mt-2 space-y-1">
            <router-link 
              to="/admin" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Dashboard
            </router-link>
            
            <router-link 
              to="/admin/orders" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span class="flex-1">Manage Orders</span>
              <span v-if="pendingOrders > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {{ pendingOrders }}
              </span>
            </router-link>
            
            <router-link 
              to="/admin/drivers" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="flex-1">Manage Drivers</span>
            </router-link>
            
            <router-link 
              to="/admin/users" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <span class="flex-1">Manage Users</span>
              <span v-if="pendingUsers > 0" class="ml-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {{ pendingUsers }}
              </span>
            </router-link>
            
            <router-link 
              to="/admin/applications" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="flex-1">Driver Applications</span>
              <span v-if="pendingApplications > 0" class="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {{ pendingApplications }}
              </span>
            </router-link>

            <router-link 
              to="/admin/remittances" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              <span class="flex-1">Manage Remittances</span>
            </router-link>

            <router-link 
              to="/admin/chat-monitoring" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="flex-1">Chat Monitoring</span>
            </router-link>
          </div>
          
          <div class="px-4 sm:px-6 py-2 mt-6">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">System</p>
          </div>
          
          <div class="mt-2 space-y-1">
            <router-link 
              to="/admin/pricing" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              <span class="flex-1">Pricing & Fraud Panel</span>
            </router-link>
            
            <router-link 
              to="/admin/settings" 
              @click="sidebarOpen = false"
              class="flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-primary hover:text-white transition-colors" 
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="flex-1">System Settings</span>
            </router-link>
          </div>
          
          <div class="mt-8 px-4 sm:px-6">
            <button @click="logout" class="flex items-center w-full px-3 py-2 text-sm sm:text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>
      
      <!-- Main content -->
      <div class="flex-1 lg:ml-0">
        <!-- Top bar -->
        <header class="bg-white shadow-sm border-b sticky top-0 z-30">
          <div class="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div class="flex items-center justify-between gap-2 sm:gap-4">
              <!-- Mobile menu button -->
              <button 
                @click="sidebarOpen = !sidebarOpen"
                class="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              
              <h1 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 truncate flex-1">{{ pageTitle }}</h1>
              
              <div class="flex items-center space-x-2 sm:space-x-4">
                <!-- Online Drivers Indicator -->
                <div class="hidden sm:flex items-center space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-xs sm:text-sm font-medium text-blue-900 whitespace-nowrap">{{ onlineDrivers }} Online</span>
                </div>
                
                <!-- Notification Bell -->
                <div class="relative">
                  <button 
                    @click="showNotifications = !showNotifications"
                    class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span v-if="unreadCount > 0" class="absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center text-[10px] sm:text-xs">
                      {{ unreadCount > 9 ? '9+' : unreadCount }}
                    </span>
                  </button>

                  <!-- Notification Dropdown -->
                  <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[80vh] overflow-hidden flex flex-col">
                    <div class="p-3 sm:p-4 border-b flex items-center justify-between">
                      <h3 class="text-sm sm:text-base font-semibold text-gray-900">Notifications</h3>
                      <button 
                        v-if="notifications.length > 0"
                        @click="markAllAsRead"
                        class="text-xs sm:text-sm text-primary hover:text-green-600"
                      >
                        Mark all as read
                      </button>
                    </div>
                    
                    <div class="overflow-y-auto flex-1">
                      <div v-if="loadingNotifications" class="p-4 text-center text-gray-500">
                        Loading notifications...
                      </div>
                      <div v-else-if="notifications.length === 0" class="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                      <div v-else>
                        <div 
                          v-for="notification in notifications" 
                          :key="notification.id"
                          @click="markAsRead(notification)"
                          :class="[
                            'p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors',
                            !notification.read ? 'bg-blue-50' : ''
                          ]"
                        >
                          <div class="flex items-start space-x-3">
                            <div :class="[
                              'w-2 h-2 rounded-full mt-2',
                              !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                            ]"></div>
                            <div class="flex-1">
                              <p class="text-sm text-gray-900">{{ notification.message }}</p>
                              <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.createdAt) }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Admin Profile -->
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-xs sm:text-sm font-medium">A</span>
                  </div>
                  <span class="hidden sm:inline text-sm sm:text-base text-gray-700">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Page content -->
        <main class="p-3 sm:p-4 md:p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  orderBy,
  limit
} from 'firebase/firestore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// Mobile sidebar state
const sidebarOpen = ref(false)

// Admin stats and settings
const activeOrders = ref(0)
const onlineDrivers = ref(0)
const pendingOrders = ref(0)
const pendingUsers = ref(0)
const pendingApplications = ref(0)

const showNotifications = ref(false)
const notifications = ref([])
const loadingNotifications = ref(false)
const unreadCount = ref(0)

const listeners = ref([])

const pageTitle = computed(() => {
  const titles = {
    'admin': 'Dashboard',
    'manage-orders': 'Manage Orders',
    'manage-drivers': 'Manage Drivers',
    'manage-users': 'Manage Users',
    'driver-applications': 'Driver Applications',
    'chat-monitoring': 'Chat Monitoring', // Added chat monitoring title
    'remittances': 'Manage Remittances', // Added remittances title
    'pricing-panel': 'Pricing & Fraud Panel',
    'system-settings': 'System Settings'
  }
  return titles[route.name] || 'Dashboard'
})

// Real-time data fetching functions
const fetchActiveOrders = () => {
  try {
    const activeOrdersQuery = query(
      collection(db, 'orders'),
      where('status', 'in', ['pending', 'confirmed', 'in_transit'])
    )

    const unsubscribe = onSnapshot(activeOrdersQuery, (snapshot) => {
      activeOrders.value = snapshot.size
      console.log('[v0] Active orders updated:', activeOrders.value)
    }, (error) => {
      console.log('[v0] Active orders listener error:', error.message)
      activeOrders.value = 0
    })

    listeners.value.push(unsubscribe)
  } catch (error) {
    console.error('[v0] Error setting up active orders listener:', error)
    activeOrders.value = 0
  }
}

const fetchOnlineDrivers = () => {
  try {
    const onlineDriversQuery = query(
      collection(db, 'drivers'),
      where('approved', '==', true),
      where('isOnline', '==', true)
    )

    const unsubscribe = onSnapshot(onlineDriversQuery, (snapshot) => {
      onlineDrivers.value = snapshot.size
      console.log('[v0] Online drivers updated:', onlineDrivers.value)
    }, (error) => {
      console.log('[v0] Online drivers listener error:', error.message)
      onlineDrivers.value = 0
    })

    listeners.value.push(unsubscribe)
  } catch (error) {
    console.error('[v0] Error setting up online drivers listener:', error)
    onlineDrivers.value = 0
  }
}

const fetchPendingCounts = () => {
  try {
    // Pending orders
    const pendingOrdersQuery = query(
      collection(db, 'orders'),
      where('status', '==', 'pending')
    )

    const unsubscribePendingOrders = onSnapshot(pendingOrdersQuery, (snapshot) => {
      pendingOrders.value = snapshot.size
      console.log('[v0] Pending orders updated:', pendingOrders.value)
    }, (error) => {
      console.log('[v0] Pending orders listener error:', error.message)
      pendingOrders.value = 0
    })

    // Pending users
    const pendingUsersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'user'),
      where('status', '==', 'pending')
    )

    const unsubscribePendingUsers = onSnapshot(pendingUsersQuery, (snapshot) => {
      pendingUsers.value = snapshot.size
      console.log('[v0] Pending users updated:', pendingUsers.value)
    }, (error) => {
      console.log('[v0] Pending users listener error:', error.message)
      pendingUsers.value = 0
    })

    // Pending driver applications
    const pendingApplicationsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'driver'),
      where('status', '==', 'pending')
    )

    const unsubscribePendingApplications = onSnapshot(pendingApplicationsQuery, (snapshot) => {
      pendingApplications.value = snapshot.size
      console.log('[v0] Pending applications updated:', pendingApplications.value)
    }, (error) => {
      console.log('[v0] Pending applications listener error:', error.message)
      pendingApplications.value = 0
    })

    listeners.value.push(unsubscribePendingOrders, unsubscribePendingUsers, unsubscribePendingApplications)
  } catch (error) {
    console.error('[v0] Error setting up pending counts listeners:', error)
    pendingOrders.value = 0
    pendingUsers.value = 0
    pendingApplications.value = 0
  }
}

const fetchNotifications = () => {
  try {
    loadingNotifications.value = true
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientType', '==', 'admin'),
      limit(100)
    )

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const allNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sort manually by createdAt descending
      allNotifications.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime() || a.timestamp?.toDate?.()?.getTime() || 0
        const bTime = b.createdAt?.toDate?.()?.getTime() || b.timestamp?.toDate?.()?.getTime() || 0
        return bTime - aTime
      })
      
      notifications.value = allNotifications.slice(0, 50)
      unreadCount.value = notifications.value.filter(n => !n.read).length
      loadingNotifications.value = false
      console.log('[v0] Admin notifications updated:', notifications.value.length)
    }, (error) => {
      // Suppress index errors - check for various index error patterns
      const errorMsg = error.message || ''
      const isIndexError = errorMsg.includes('index') || 
                          errorMsg.includes('requires an index') ||
                          errorMsg.includes('composite') ||
                          error.code === 'failed-precondition'
      
      if (!isIndexError) {
        console.log('[v0] Notifications listener error:', error.message)
      }
      loadingNotifications.value = false
    })

    listeners.value.push(unsubscribe)
  } catch (error) {
    console.error('[v0] Error setting up notifications listener:', error)
    loadingNotifications.value = false
  }
}

const markAsRead = async (notification) => {
  if (notification.read) return
  
  try {
    await updateDoc(doc(db, 'notifications', notification.id), {
      read: true,
      readAt: new Date()
    })
  } catch (error) {
    console.error('[v0] Error marking notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    const unreadNotifications = notifications.value.filter(n => !n.read)
    const updatePromises = unreadNotifications.map(notification =>
      updateDoc(doc(db, 'notifications', notification.id), {
        read: true,
        readAt: new Date()
      })
    )
    
    await Promise.all(updatePromises)
    toast.success('All notifications marked as read')
  } catch (error) {
    console.error('[v0] Error marking all as read:', error)
    toast.error('Failed to mark notifications as read')
  }
}

const formatDate = (timestamp) => {
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
}

const logout = async () => {
  const result = await authStore.logout()
  if (result.success) {
    toast.success(result.message)
    router.push('/')
  } else {
    toast.error(result.message)
  }
}

onMounted(async () => {
  console.log('[v0] AdminLayout mounted, initializing real-time data...')
  
  fetchActiveOrders()
  fetchOnlineDrivers()
  fetchPendingCounts()
  fetchNotifications()
  
  console.log('[v0] AdminLayout real-time data initialized')
})

onUnmounted(() => {
  listeners.value.forEach(unsubscribe => {
    if (typeof unsubscribe === 'function') {
      unsubscribe()
    }
  })
  listeners.value = []
  console.log('[v0] AdminLayout listeners cleaned up')
})
</script>
