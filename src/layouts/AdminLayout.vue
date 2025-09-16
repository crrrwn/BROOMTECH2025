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
            <span class="text-sm text-gray-500">Admin Portal</span>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="px-6 pb-4">
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
        
        <nav class="mt-2">
          <div class="px-6 py-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
          </div>
          
          <div class="mt-2 space-y-1">
            <router-link to="/admin" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Dashboard
            </router-link>
            
            <router-link to="/admin/orders" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2z"></path>
              </svg>
              Manage Orders
              <span v-if="pendingOrders > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {{ pendingOrders }}
              </span>
            </router-link>
            
            <router-link to="/admin/drivers" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Manage Drivers
            </router-link>
            
            <router-link to="/admin/users" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              Manage Users
              <span v-if="pendingUsers > 0" class="ml-auto bg-yellow-500 text-white text-xs rounded-full px-2 py-1">
                {{ pendingUsers }}
              </span>
            </router-link>
            
            <router-link to="/admin/applications" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Driver Applications
              <span v-if="pendingApplications > 0" class="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {{ pendingApplications }}
              </span>
            </router-link>

            <!-- Added chat monitoring for admin oversight -->
            <router-link to="/admin/chat-monitoring" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Chat Monitoring
            </router-link>
          </div>
          
          <div class="px-6 py-2 mt-6">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">System</p>
          </div>
          
          <div class="mt-2 space-y-1">
            <router-link to="/admin/pricing" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              Pricing & Fraud Panel
            </router-link>
            
            <router-link to="/admin/settings" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              System Settings
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
              <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
              
              <div class="flex items-center space-x-6">
                <!-- Weather Fee Toggle -->
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-600">Bad Weather Fee</span>
                  <button 
                    @click="toggleWeatherFee"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      weatherFeeEnabled ? 'bg-red-500' : 'bg-gray-300'
                    ]"
                  >
                    <span 
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        weatherFeeEnabled ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
                
                <!-- Auto Accept Users Toggle -->
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-600">Auto-Accept Users</span>
                  <button 
                    @click="toggleAutoAccept"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      autoAcceptEnabled ? 'bg-primary' : 'bg-gray-300'
                    ]"
                  >
                    <span 
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        autoAcceptEnabled ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
                
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">A</span>
                  </div>
                  <span class="text-gray-700">Admin</span>
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
  setDoc
} from 'firebase/firestore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// Admin stats and settings
const activeOrders = ref(0)
const onlineDrivers = ref(0)
const pendingOrders = ref(0)
const pendingUsers = ref(0)
const pendingApplications = ref(0)
const weatherFeeEnabled = ref(false)
const autoAcceptEnabled = ref(true)

const listeners = ref([])

const pageTitle = computed(() => {
  const titles = {
    'admin': 'Dashboard',
    'manage-orders': 'Manage Orders',
    'manage-drivers': 'Manage Drivers',
    'manage-users': 'Manage Users',
    'driver-applications': 'Driver Applications',
    'chat-monitoring': 'Chat Monitoring', // Added chat monitoring title
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
      collection(db, 'users'),
      where('role', '==', 'driver'),
      where('status', '==', 'approved'),
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

const fetchSystemSettings = async () => {
  try {
    console.log('[v0] Fetching system settings...')
    
    const settingsRef = doc(db, 'settings', 'system')
    const settingsDoc = await getDoc(settingsRef)
    
    if (settingsDoc.exists()) {
      const settings = settingsDoc.data()
      weatherFeeEnabled.value = settings.badWeatherFee || false
      autoAcceptEnabled.value = settings.autoAcceptUsers !== false
    } else {
      console.log('[v0] Settings document does not exist, creating default settings')
      await setDoc(settingsRef, {
        badWeatherFee: false,
        autoAcceptUsers: true,
        createdAt: new Date()
      })
      weatherFeeEnabled.value = false
      autoAcceptEnabled.value = true
    }
    
    console.log('[v0] System settings loaded:', { weatherFeeEnabled: weatherFeeEnabled.value, autoAcceptEnabled: autoAcceptEnabled.value })
  } catch (error) {
    console.error('[v0] Error fetching system settings:', error)
    weatherFeeEnabled.value = false
    autoAcceptEnabled.value = true
  }
}

const toggleWeatherFee = async () => {
  try {
    weatherFeeEnabled.value = !weatherFeeEnabled.value
    
    const settingsRef = doc(db, 'settings', 'system')
    await updateDoc(settingsRef, {
      badWeatherFee: weatherFeeEnabled.value,
      updatedAt: new Date()
    })
    
    toast.success(
      weatherFeeEnabled.value 
        ? 'Bad Weather Fee enabled (+₱5)' 
        : 'Bad Weather Fee disabled'
    )
  } catch (error) {
    console.error('[v0] Error updating weather fee setting:', error)
    toast.error('Failed to update weather fee setting')
    weatherFeeEnabled.value = !weatherFeeEnabled.value
  }
}

const toggleAutoAccept = async () => {
  try {
    autoAcceptEnabled.value = !autoAcceptEnabled.value
    
    const settingsRef = doc(db, 'settings', 'system')
    await updateDoc(settingsRef, {
      autoAcceptUsers: autoAcceptEnabled.value,
      updatedAt: new Date()
    })
    
    toast.success(
      autoAcceptEnabled.value 
        ? 'Auto-Accept Users enabled' 
        : 'Auto-Accept Users disabled'
    )
  } catch (error) {
    console.error('[v0] Error updating auto-accept setting:', error)
    toast.error('Failed to update auto-accept setting')
    autoAcceptEnabled.value = !autoAcceptEnabled.value
  }
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
  
  await fetchSystemSettings()
  fetchActiveOrders()
  fetchOnlineDrivers()
  fetchPendingCounts()
  
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
