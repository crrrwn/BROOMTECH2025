<template>
  <div class="space-y-6">
    <!-- Status and Earnings Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Online Status Card -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Driver Status</h2>
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-3 h-3 rounded-full',
              driverStore.isOnline ? 'bg-green-500' : 'bg-gray-400'
            ]"></div>
            <span class="text-sm font-medium" :class="driverStore.isOnline ? 'text-green-600' : 'text-gray-500'">
              {{ driverStore.isOnline ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span class="text-gray-700">Go Online to receive bookings</span>
            <button 
              @click="handleToggleStatus"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                driverStore.isOnline ? 'bg-primary' : 'bg-gray-300'
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
          
          <div v-if="driverStore.isOnline" class="text-sm text-gray-600">
            <p>Online since: {{ driverStore.onlineTime }}</p>
            <p>Available for: {{ availableServices.join(', ') }}</p>
          </div>
        </div>
      </div>

      <!-- Today's Earnings -->
      <!-- Show earnings only after remittance, with 80/20 split info -->
      <div :class="[
        'rounded-lg p-6 text-white',
        driverStore.hasRemitted ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'
      ]">
        <h2 class="text-lg font-semibold mb-4">Today's Earnings</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Your Earnings (80%):</span>
            <span class="font-bold text-2xl">₱{{ driverStore.hasRemitted && driverStore.todayEarnings.driverShare ? driverStore.todayEarnings.driverShare : '0.00' }}</span>
          </div>
          <div v-if="driverStore.hasRemitted && driverStore.todayEarnings.total" class="flex justify-between text-green-100 text-sm">
            <span>Total Earned:</span>
            <span>₱{{ driverStore.todayEarnings.total }}</span>
          </div>
          <div v-if="driverStore.hasRemitted && driverStore.todayEarnings.adminShare" class="flex justify-between text-green-100 text-sm">
            <span>Admin Commission (20%):</span>
            <span>₱{{ driverStore.todayEarnings.adminShare }}</span>
          </div>
          <div v-if="!driverStore.hasRemitted" class="text-sm mt-4 p-3 bg-white bg-opacity-20 rounded">
            <p>Earnings will appear after you remit money to the admin.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Earnings -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Weekly Earnings</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">Total (Last 7 Days)</p>
          <p class="text-2xl font-bold text-blue-600">₱{{ driverStore.weeklyEarnings.total || '0.00' }}</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">Your Share (80%)</p>
          <p class="text-2xl font-bold text-green-600">₱{{ driverStore.weeklyEarnings.driverShare || '0.00' }}</p>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">Admin Share (20%)</p>
          <p class="text-2xl font-bold text-purple-600">₱{{ driverStore.weeklyEarnings.adminShare || '0.00' }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link to="/driver/assignments" class="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Available</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.availableBookings }}</p>
          </div>
        </div>
      </router-link>

      <router-link to="/driver/assignments" class="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.activeAssignments }}</p>
          </div>
        </div>
      </router-link>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completed Today</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.completedToday }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { useDriverStore } from '@/stores/driver'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { 
  collection, 
  query, 
  where, 
  onSnapshot
} from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const driverStore = useDriverStore()
    const authStore = useAuthStore()
    const toast = useToast()
    const listeners = ref([])

    return {
      driverStore,
      authStore,
      toast,
      listeners
    }
  },
  data() {
    return {
      availableServices: ['Food Delivery', 'Pick-up & Drop', 'Grocery Shopping'],
      stats: {
        availableBookings: 0,
        activeAssignments: 0,
        completedToday: 0
      }
    }
  },
  methods: {
    async handleToggleStatus() {
      const success = await this.driverStore.toggleOnlineStatus()
      
      if (success) {
        this.toast.success(
          this.driverStore.isOnline 
            ? 'You are now online and available for bookings!' 
            : 'You are now offline'
        )
      } else {
        this.toast.error('Failed to update status. Please try again.')
      }
    },
    setupStatsListener() {
      try {
        const driverId = this.authStore.user?.uid
        if (!driverId) {
          console.error('[v0] No driver ID available')
          return
        }

        // Fetch available bookings (pending orders without driver assigned)
        // Use query without orderBy to avoid index requirement
        const availableQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'pending')
        )

        const unsubscribeAvailable = onSnapshot(availableQuery, (snapshot) => {
          // Count only orders without driverId
          let count = 0
          snapshot.forEach(doc => {
            const data = doc.data()
            if (!data.driverId) {
              count++
            }
          })
          this.stats.availableBookings = count
          console.log('[v0] Available bookings updated:', count)
        }, (error) => {
          // Silently handle all errors - queries work without indexes, errors are expected
          // Don't log to console to keep it clean
          this.stats.availableBookings = 0
        })

        // Fetch active assignments (orders assigned to this driver with active statuses)
        const activeQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId),
          where('status', 'in', ['confirmed', 'driver_assigned', 'in_transit', 'on_the_way'])
        )

        const unsubscribeActive = onSnapshot(activeQuery, (snapshot) => {
          this.stats.activeAssignments = snapshot.size
          console.log('[v0] Active assignments updated:', snapshot.size)
        }, (error) => {
          console.error('[v0] Active assignments listener error:', error)
          this.stats.activeAssignments = 0
        })

        // Fetch completed today (delivered orders for this driver today)
        // Note: Using deliveredAt if available, otherwise createdAt
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayTimestamp = today.getTime()

        const completedQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId),
          where('status', '==', 'delivered')
        )

        const unsubscribeCompleted = onSnapshot(completedQuery, (snapshot) => {
          let count = 0
          snapshot.forEach(doc => {
            const data = doc.data()
            // Check if delivered today
            const deliveredAt = data.deliveredAt?.toDate ? data.deliveredAt.toDate() : 
                               (data.deliveredAt ? new Date(data.deliveredAt) : null)
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : 
                             (data.createdAt ? new Date(data.createdAt) : null)
            
            const orderDate = deliveredAt || createdAt
            if (orderDate && orderDate >= today) {
              count++
            }
          })
          this.stats.completedToday = count
          console.log('[v0] Completed today updated:', count)
        }, (error) => {
          console.error('[v0] Completed today listener error:', error)
          this.stats.completedToday = 0
        })

        this.listeners.push(unsubscribeAvailable, unsubscribeActive, unsubscribeCompleted)
      } catch (error) {
        console.error('[v0] Error setting up stats listener:', error)
      }
    },
  },
  async mounted() {
    // Ensure earnings data is loaded
    await this.driverStore.loadEarningsData()
    this.setupStatsListener()
  },
  unmounted() {
    this.listeners.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    })
    this.listeners = []
  }
}
</script>
