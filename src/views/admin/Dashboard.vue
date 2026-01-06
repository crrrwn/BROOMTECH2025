<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <!-- Overview Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div class="flex items-center">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-3 sm:ml-4 min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-xl sm:text-2xl font-semibold text-gray-900">{{ stats.totalOrders }}</p>
              <p class="text-xs text-green-600">+{{ stats.ordersGrowth }}% from yesterday</p>
            </div>
          </div>
        </div>

        <!-- Updated to show 20% commission (admin's share) -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Revenue Today (20%)</p>
              <p class="text-2xl font-semibold text-gray-900">₱{{ stats.adminRevenueToday.toLocaleString() }}</p>
              <p class="text-xs text-gray-500">Total: ₱{{ stats.revenueToday.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Changed "Active Drivers" to "Online Drivers" -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Online Drivers</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeDrivers }}</p>
              <p class="text-xs text-gray-500">{{ stats.totalDrivers }} total drivers</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
              <p class="text-xs text-blue-600">{{ stats.pendingUsers }} pending approval</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Alerts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Pending Approvals -->
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Pending Approvals</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">New Users</p>
                <p class="text-sm text-gray-600">{{ stats.pendingUsers }} waiting for approval</p>
              </div>
              <router-link to="/admin/users" class="text-primary hover:text-green-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Driver Applications</p>
                <p class="text-sm text-gray-600">{{ stats.pendingDrivers }} applications to review</p>
              </div>
              <router-link to="/admin/applications" class="text-primary hover:text-green-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

         System Status 
        <div class="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Bad Weather Fee</span>
              <div class="flex items-center space-x-2">
                <span :class="systemStatus.badWeatherFee ? 'text-red-600' : 'text-gray-500'" class="text-sm">
                  {{ systemStatus.badWeatherFee ? 'Active (+₱10)' : 'Inactive' }}
                </span>
                <button 
                  @click="toggleWeatherFee"
                  :class="[
                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                    systemStatus.badWeatherFee ? 'bg-red-500' : 'bg-gray-300'
                  ]"
                >
                  <span 
                    :class="[
                      'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                      systemStatus.badWeatherFee ? 'translate-x-5' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-700">AI Fraud Detection</span>
              <span class="text-green-600 text-sm">Active</span>
            </div>
          </div>
        </div>
      </div>

       Recent Activity 
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-3">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              activity.type === 'order' ? 'bg-blue-100' :
              activity.type === 'user' ? 'bg-green-100' :
              activity.type === 'driver' ? 'bg-yellow-100' :
              'bg-gray-100'
            ]">
              <svg class="w-4 h-4" :class="[
                activity.type === 'order' ? 'text-blue-600' :
                activity.type === 'user' ? 'text-green-600' :
                activity.type === 'driver' ? 'text-yellow-600' :
                'text-gray-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>


       Live Orders 
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Live Orders</h3>
            <router-link to="/admin/orders" class="text-primary hover:text-green-600 text-sm font-medium">
              View All Orders
            </router-link>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="liveOrders.length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">No active orders</td>
              </tr>
              <tr v-for="order in liveOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order.id.substring(0, 8) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ order.customerName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ order.service }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ order.driverName || 'Unassigned' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'pending' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{{ order.totalAmount.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/admin/orders?orderId=${order.id}`" class="text-primary hover:text-green-600 mr-3">View</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore'

export default {
  name: 'Dashboard',
  setup() {
    const toast = useToast()
    
    const loading = ref(true)
    
    const stats = ref({
      totalOrders: 0,
      revenueToday: 0,
      adminRevenueToday: 0,
      ordersGrowth: 12,
      revenueGrowth: 8,
      activeDrivers: 0,
      totalDrivers: 0,
      totalUsers: 0,
      pendingUsers: 0,
      pendingDrivers: 0
    })

    const systemStatus = ref({
      badWeatherFee: false
    })

    const recentActivity = ref([])
    const liveOrders = ref([])
    const listeners = ref([])
    const allOrders = ref([])
    const remittancesAdminShare = ref(0) // Admin share from approved remittances

    const setupSystemSettingsListener = () => {
      try {
        const settingsRef = doc(db, 'settings', 'system')
        
        const unsubscribe = onSnapshot(settingsRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const settings = docSnapshot.data()
            systemStatus.value.badWeatherFee = settings.badWeatherFee || false
          } else {
            await setDoc(settingsRef, {
              badWeatherFee: false,
              createdAt: new Date()
            })
            systemStatus.value.badWeatherFee = false
          }
        }, (error) => {
          console.error('[v0] System settings listener error:', error)
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up system settings listener:', error)
      }
    }

    const setupPendingUsersListener = () => {
      try {
        const pendingUsersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'user'),
          where('status', '==', 'pending')
        )

        const unsubscribe = onSnapshot(pendingUsersQuery, (snapshot) => {
          stats.value.pendingUsers = snapshot.size
        }, (error) => {
          console.log('[v0] Pending users listener error:', error.message)
          stats.value.pendingUsers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up pending users listener:', error)
      }
    }

    const setupPendingDriversListener = () => {
      try {
        const pendingDriversQuery = query(
          collection(db, 'users'),
          where('role', '==', 'driver'),
          where('status', '==', 'pending')
        )

        const unsubscribe = onSnapshot(pendingDriversQuery, (snapshot) => {
          stats.value.pendingDrivers = snapshot.size
        }, (error) => {
          console.log('[v0] Pending drivers listener error:', error.message)
          stats.value.pendingDrivers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up pending drivers listener:', error)
      }
    }

    const setupUsersListener = () => {
      try {
        const usersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'user')
        )

        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
          stats.value.totalUsers = snapshot.size
        }, (error) => {
          console.log('[v0] Users listener error:', error.message)
          stats.value.totalUsers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up users listener:', error)
      }
    }

    const setupDriversListener = () => {
      try {
        const driversQuery = query(
          collection(db, 'users'),
          where('role', '==', 'driver')
        )

        const unsubscribe = onSnapshot(driversQuery, (snapshot) => {
          stats.value.totalDrivers = snapshot.size
          
          let activeDriversCount = 0
          snapshot.forEach(doc => {
            const driver = doc.data()
            if (driver.status === 'approved' && driver.isOnline) {
              activeDriversCount++
            }
          })
          stats.value.activeDrivers = activeDriversCount
        }, (error) => {
          console.log('[v0] Drivers listener error:', error.message)
          stats.value.totalDrivers = 0
          stats.value.activeDrivers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up drivers listener:', error)
      }
    }

    const setupOrdersListener = () => {
      try {
        const ordersQuery = query(collection(db, 'orders'))

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
          stats.value.totalOrders = snapshot.size

          const orders = []
          snapshot.forEach(doc => {
            orders.push({
              id: doc.id,
              ...doc.data()
            })
          })
          allOrders.value = orders

          // Calculate today's revenue (20% commission)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          let todayRevenue = 0

          snapshot.forEach(doc => {
            const order = doc.data()
            const orderDate = order.createdAt?.toDate()

            // Today's revenue
            if (orderDate >= today && order.status === 'delivered') {
              todayRevenue += order.totalAmount || 0
            }
          })

          stats.value.revenueToday = todayRevenue
          // Calculate admin revenue: 20% of orders + admin share from approved remittances
          stats.value.adminRevenueToday = Math.round(todayRevenue * 0.20) + remittancesAdminShare.value


        }, (error) => {
          console.log('[v0] Orders listener error:', error.message)
          stats.value.totalOrders = 0
          stats.value.revenueToday = 0
          stats.value.adminRevenueToday = remittancesAdminShare.value // Keep remittances share even if orders fail
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up orders listener:', error)
      }
    }

    const setupRemittancesListener = () => {
      try {
        const remittancesQuery = query(
          collection(db, 'remittances'),
          where('status', '==', 'approved')
        )

        const unsubscribe = onSnapshot(remittancesQuery, (snapshot) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          let totalAdminShareToday = 0

          snapshot.forEach(doc => {
            const remittance = doc.data()
            
            // Check if remittance was approved today
            let approvalDate
            if (remittance.approvedAt) {
              approvalDate = remittance.approvedAt.toDate ? remittance.approvedAt.toDate() : new Date(remittance.approvedAt)
            } else if (remittance.date) {
              approvalDate = remittance.date.toDate ? remittance.date.toDate() : new Date(remittance.date)
            } else if (remittance.createdAt) {
              approvalDate = remittance.createdAt.toDate ? remittance.createdAt.toDate() : new Date(remittance.createdAt)
            } else {
              return // Skip if no date
            }
            
            // Only count remittances approved today
            if (approvalDate >= today) {
              // Use adminShare if available, otherwise calculate 20% of amount
              const adminShare = remittance.adminShare || (remittance.amount * 0.2)
              totalAdminShareToday += Number(adminShare) || 0
            }
          })

          remittancesAdminShare.value = Math.round(totalAdminShareToday)
          
          // Update admin revenue to include remittances
          const todayRevenue = stats.value.revenueToday
          stats.value.adminRevenueToday = Math.round(todayRevenue * 0.20) + remittancesAdminShare.value
          
          console.log('[v0] Remittances admin share updated:', remittancesAdminShare.value)
        }, (error) => {
          console.log('[v0] Remittances listener error:', error.message)
          remittancesAdminShare.value = 0
          // Recalculate admin revenue without remittances
          const todayRevenue = stats.value.revenueToday
          stats.value.adminRevenueToday = Math.round(todayRevenue * 0.20)
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up remittances listener:', error)
      }
    }

    const setupRecentActivityListener = () => {
      try {
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          limit(100)
        )

        const unsubscribe = onSnapshot(recentOrdersQuery, async (snapshot) => {
          const activities = []
          const userIds = new Set()
          
          // Collect all user IDs
          snapshot.forEach(doc => {
            const order = doc.data()
            if (order.userId) {
              userIds.add(order.userId)
            }
          })
          
          // Fetch user data
          const usersMap = {}
          await Promise.all(Array.from(userIds).map(async (userId) => {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                usersMap[userId] = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown User'
              }
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error)
            }
          }))
          
          snapshot.forEach(doc => {
            const order = doc.data()
            const serviceNameMap = {
              'food-delivery': 'Food Delivery',
              'bill-payments': 'Bill Payments',
              'pickup-drop': 'Pick-up & Drop',
              'gift-delivery': 'Gift Delivery',
              'medicine-delivery': 'Medicine Delivery',
              'grocery-shopping': 'Grocery Shopping',
              'food': 'Food Delivery',
              'package': 'Package Delivery',
              'medicine': 'Medicine Delivery',
              'grocery': 'Grocery Shopping'
            }
            const serviceName = serviceNameMap[order.service || order.serviceType] || order.service || order.serviceType || 'service'
            const userName = order.customerName || usersMap[order.userId] || 'Unknown User'
            activities.push({
              id: doc.id,
              type: 'order',
              message: `New ${serviceName} order from ${userName}`,
              time: formatTimeAgo(order.createdAt?.toDate())
            })
          })
          // Sort manually by createdAt descending
          activities.sort((a, b) => {
            const aTime = snapshot.docs.find(d => d.id === a.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            const bTime = snapshot.docs.find(d => d.id === b.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            return bTime - aTime
          })
          recentActivity.value = activities.slice(0, 4)
        }, (error) => {
          // Suppress index errors
          if (!error.message.includes('index') && !error.message.includes('requires an index')) {
            console.log('[v0] Recent activity listener error:', error.message)
          }
          recentActivity.value = []
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up recent activity listener:', error)
      }
    }

    const setupLiveOrdersListener = () => {
      try {
        const liveOrdersQuery = query(
          collection(db, 'orders'),
          where('status', 'in', ['pending', 'confirmed', 'in-transit', 'driver_assigned']),
          limit(100)
        )

        const unsubscribe = onSnapshot(liveOrdersQuery, async (snapshot) => {
          const orders = []
          const userIds = new Set()
          
          // Collect all user IDs
          snapshot.forEach(doc => {
            const order = doc.data()
            if (order.userId) {
              userIds.add(order.userId)
            }
          })
          
          // Fetch user data
          const usersMap = {}
          await Promise.all(Array.from(userIds).map(async (userId) => {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                usersMap[userId] = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown User'
              }
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error)
            }
          }))
          
          const serviceNameMap = {
            'food-delivery': 'Food Delivery',
            'bill-payments': 'Bill Payments',
            'pickup-drop': 'Pick-up & Drop',
            'gift-delivery': 'Gift Delivery',
            'medicine-delivery': 'Medicine Delivery',
            'grocery-shopping': 'Grocery Shopping',
            'food': 'Food Delivery',
            'package': 'Package Delivery',
            'medicine': 'Medicine Delivery',
            'grocery': 'Grocery Shopping'
          }

          snapshot.forEach(doc => {
            const order = doc.data()
            const serviceId = order.service || order.serviceType || order.serviceId || 'unknown'
            const serviceName = serviceNameMap[serviceId] || serviceId || 'Unknown Service'
            const customerName = order.customerName || usersMap[order.userId] || 'Unknown User'

            orders.push({
              id: doc.id,
              customerName: customerName,
              service: serviceName,
              driverName: order.driverName || null,
              driverId: order.driverId || null,
              status: order.status,
              totalAmount: order.totalAmount || order.pricing?.total || order.priceEstimate?.total || 0
            })
          })
          // Sort manually by createdAt descending
          orders.sort((a, b) => {
            const aTime = snapshot.docs.find(d => d.id === a.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            const bTime = snapshot.docs.find(d => d.id === b.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            return bTime - aTime
          })
          liveOrders.value = orders.slice(0, 10)
        }, (error) => {
          // Suppress index errors
          if (!error.message.includes('index') && !error.message.includes('requires an index')) {
            console.log('[v0] Live orders listener error:', error.message)
          }
          liveOrders.value = []
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up live orders listener:', error)
        liveOrders.value = []
      }
    }

    const formatStatus = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    }

    const formatTimeAgo = (date) => {
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

    const toggleWeatherFee = async () => {
      try {
        systemStatus.value.badWeatherFee = !systemStatus.value.badWeatherFee
        
        const settingsRef = doc(db, 'settings', 'system')
        await updateDoc(settingsRef, {
          badWeatherFee: systemStatus.value.badWeatherFee,
          updatedAt: new Date()
        })
        
        toast.success(
          systemStatus.value.badWeatherFee 
            ? 'Bad Weather Fee enabled (+₱10)' 
            : 'Bad Weather Fee disabled'
        )
      } catch (error) {
        console.error('[v0] Error updating weather fee setting:', error)
        toast.error('Failed to update weather fee setting')
        systemStatus.value.badWeatherFee = !systemStatus.value.badWeatherFee
      }
    }


    const initializeDashboard = async () => {
      loading.value = true
      try {
        setupSystemSettingsListener()
        setupPendingUsersListener()
        setupPendingDriversListener()
        setupUsersListener()
        setupDriversListener()
        setupOrdersListener()
        setupRemittancesListener()
        setupRecentActivityListener()
        setupLiveOrdersListener()
        
        toast.success('Dashboard loaded with real-time updates')
      } catch (error) {
        console.error('[v0] Error initializing dashboard:', error)
        toast.error('Dashboard loaded with some limitations')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      initializeDashboard()
    })

    onUnmounted(() => {
      listeners.value.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
      listeners.value = []
    })

    return {
      loading,
      stats,
      systemStatus,
      recentActivity,
      liveOrders,
      toggleWeatherFee,
      formatStatus
    }
  }
}
</script>
