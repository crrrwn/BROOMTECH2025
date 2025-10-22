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
            <span class="font-bold text-2xl">₱{{ driverStore.hasRemitted ? driverStore.todayEarnings.driverShare : '0.00' }}</span>
          </div>
          <div v-if="driverStore.hasRemitted" class="flex justify-between text-green-100 text-sm">
            <span>Total Earned:</span>
            <span>₱{{ driverStore.todayEarnings.total }}</span>
          </div>
          <div v-if="driverStore.hasRemitted" class="flex justify-between text-green-100 text-sm">
            <span>Admin Commission (20%):</span>
            <span>₱{{ driverStore.todayEarnings.adminShare }}</span>
          </div>
          <div v-if="!driverStore.hasRemitted" class="text-sm mt-4 p-3 bg-white bg-opacity-20 rounded">
            <p>Earnings will appear after you remit money to the admin.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border">
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
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
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
      </div>

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

    <!-- Weekly Earnings Chart -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Weekly Earnings</h2>
      <!-- Show message when no data, otherwise show chart -->
      <div v-if="weeklyEarnings.length === 0" class="h-64 flex items-center justify-center text-gray-500">
        <p>No earnings data available yet</p>
      </div>
      <div v-else class="h-64 flex items-end justify-between space-x-2">
        <div v-for="(day, index) in weeklyEarnings" :key="index" class="flex flex-col items-center flex-1">
          <div 
            class="bg-primary rounded-t w-full transition-all duration-300 hover:bg-green-600"
            :style="{ height: `${(day.amount / Math.max(...weeklyEarnings.map(d => d.amount), 1)) * 200}px` }"
          ></div>
          <div class="mt-2 text-center">
            <p class="text-xs text-gray-500">{{ day.day }}</p>
            <p class="text-sm font-medium text-gray-900">₱{{ day.amount.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <router-link to="/driver/assignments" class="text-primary hover:text-green-600 text-sm font-medium">
          View All
        </router-link>
      </div>
      
      <!-- Show message when no data, otherwise show activity list -->
      <div v-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
        <p>No recent activity yet</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-4">
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              activity.type === 'completed' ? 'bg-green-100' :
              activity.type === 'accepted' ? 'bg-blue-100' :
              'bg-yellow-100'
            ]">
              <svg class="w-5 h-5" :class="[
                activity.type === 'completed' ? 'text-green-600' :
                activity.type === 'accepted' ? 'text-blue-600' :
                'text-yellow-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="activity.type === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                <path v-else-if="activity.type === 'accepted'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-900">₱{{ activity.amount.toFixed(2) }}</p>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-medium rounded-full',
              activity.type === 'completed' ? 'bg-green-100 text-green-800' :
              activity.type === 'accepted' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            ]">
              {{ activity.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDriverStore } from '@/stores/driver'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
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
      },
      weeklyEarnings: [],
      recentActivity: []
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
        const driverId = this.authStore.user.uid
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Fetch available bookings (pending orders)
        const availableQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        )

        const unsubscribeAvailable = onSnapshot(availableQuery, (snapshot) => {
          this.stats.availableBookings = snapshot.size
        }, (error) => {
          console.log('[v0] Available bookings listener error:', error.message)
          this.stats.availableBookings = 0
        })

        // Fetch active assignments (confirmed or in-transit orders for this driver)
        const activeQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId),
          where('status', 'in', ['confirmed', 'in-transit'])
        )

        const unsubscribeActive = onSnapshot(activeQuery, (snapshot) => {
          this.stats.activeAssignments = snapshot.size
        }, (error) => {
          console.log('[v0] Active assignments listener error:', error.message)
          this.stats.activeAssignments = 0
        })

        // Fetch completed today (delivered orders for this driver today)
        const completedQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId),
          where('status', '==', 'delivered'),
          where('createdAt', '>=', today)
        )

        const unsubscribeCompleted = onSnapshot(completedQuery, (snapshot) => {
          this.stats.completedToday = snapshot.size
        }, (error) => {
          console.log('[v0] Completed today listener error:', error.message)
          this.stats.completedToday = 0
        })

        this.listeners.push(unsubscribeAvailable, unsubscribeActive, unsubscribeCompleted)
      } catch (error) {
        console.error('[v0] Error setting up stats listener:', error)
      }
    },
    setupWeeklyEarningsListener() {
      try {
        const driverId = this.authStore.user.uid
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

        const earningsQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId),
          where('status', '==', 'delivered'),
          where('createdAt', '>=', sevenDaysAgo),
          orderBy('createdAt', 'desc')
        )

        const unsubscribe = onSnapshot(earningsQuery, (snapshot) => {
          const earningsByDay = {}
          
          // Initialize last 7 days
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dayKey = date.toISOString().split('T')[0]
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
            earningsByDay[dayKey] = { day: dayName, amount: 0 }
          }

          // Calculate earnings for each day
          snapshot.forEach(doc => {
            const order = doc.data()
            const orderDate = order.createdAt?.toDate()
            if (orderDate) {
              const dayKey = orderDate.toISOString().split('T')[0]
              if (earningsByDay[dayKey]) {
                earningsByDay[dayKey].amount += order.totalAmount || 0
              }
            }
          })

          this.weeklyEarnings = Object.values(earningsByDay)
        }, (error) => {
          console.log('[v0] Weekly earnings listener error:', error.message)
          this.weeklyEarnings = []
        })

        this.listeners.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up weekly earnings listener:', error)
        this.weeklyEarnings = []
      }
    },
    setupRecentActivityListener() {
      try {
        const driverId = this.authStore.user.uid
        
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId),
          orderBy('createdAt', 'desc'),
          limit(5)
        )

        const unsubscribe = onSnapshot(recentOrdersQuery, (snapshot) => {
          const activities = []
          
          snapshot.forEach(doc => {
            const order = doc.data()
            const serviceNameMap = {
              'food-delivery': 'Food Delivery',
              'bill-payments': 'Bill Payments',
              'pickup-drop': 'Pick-up & Drop',
              'gift-delivery': 'Gift Delivery',
              'medicine-delivery': 'Medicine Delivery',
              'grocery-shopping': 'Grocery Shopping'
            }
            
            const serviceName = serviceNameMap[order.service] || order.service || 'Service'
            const statusMap = {
              'pending': 'Pending',
              'confirmed': 'Confirmed',
              'in-transit': 'In Transit',
              'delivered': 'Completed',
              'cancelled': 'Cancelled'
            }

            activities.push({
              id: doc.id,
              title: `${serviceName} Order`,
              time: this.formatTimeAgo(order.createdAt?.toDate()),
              amount: order.totalAmount || 0,
              status: statusMap[order.status] || order.status,
              type: order.status === 'delivered' ? 'completed' : 
                    order.status === 'confirmed' ? 'accepted' : 'pending'
            })
          })

          this.recentActivity = activities
        }, (error) => {
          console.log('[v0] Recent activity listener error:', error.message)
          this.recentActivity = []
        })

        this.listeners.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up recent activity listener:', error)
        this.recentActivity = []
      }
    },
    formatTimeAgo(date) {
      if (!date) return 'Unknown'
      
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins} minutes ago`
      
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours} hours ago`
      
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} days ago`
    }
  },
  mounted() {
    this.setupStatsListener()
    this.setupWeeklyEarningsListener()
    this.setupRecentActivityListener()
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
