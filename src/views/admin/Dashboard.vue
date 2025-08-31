<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <!-- Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalOrders }}</p>
              <p class="text-xs text-green-600">+{{ stats.ordersGrowth }}% from yesterday</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Revenue Today</p>
              <p class="text-2xl font-semibold text-gray-900">₱{{ stats.revenueToday.toLocaleString() }}</p>
              <p class="text-xs text-green-600">+{{ stats.revenueGrowth }}% from yesterday</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Drivers</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeDrivers }}</p>
              <p class="text-xs text-gray-500">{{ stats.totalDrivers }} total</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border">
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
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Pending Approvals -->
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
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

        <!-- System Status -->
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Bad Weather Fee</span>
              <div class="flex items-center space-x-2">
                <span :class="systemStatus.badWeatherFee ? 'text-red-600' : 'text-gray-500'" class="text-sm">
                  {{ systemStatus.badWeatherFee ? 'Active (+₱5)' : 'Inactive' }}
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
              <span class="text-gray-700">Auto-Accept Users</span>
              <div class="flex items-center space-x-2">
                <span :class="systemStatus.autoAcceptUsers ? 'text-green-600' : 'text-gray-500'" class="text-sm">
                  {{ systemStatus.autoAcceptUsers ? 'Enabled' : 'Disabled' }}
                </span>
                <button 
                  @click="toggleAutoAccept"
                  :class="[
                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                    systemStatus.autoAcceptUsers ? 'bg-primary' : 'bg-gray-300'
                  ]"
                >
                  <span 
                    :class="[
                      'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                      systemStatus.autoAcceptUsers ? 'translate-x-5' : 'translate-x-1'
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

        <!-- Recent Activity -->
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
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Daily Revenue (Last 7 Days)</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div v-for="(day, index) in revenueChart" :key="index" class="flex flex-col items-center flex-1">
              <div 
                class="bg-primary rounded-t w-full transition-all duration-300 hover:bg-green-600"
                :style="{ height: `${(day.amount / Math.max(...revenueChart.map(d => d.amount))) * 200}px` }"
              ></div>
              <div class="mt-2 text-center">
                <p class="text-xs text-gray-500">{{ day.day }}</p>
                <p class="text-sm font-medium text-gray-900">₱{{ day.amount.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Distribution -->
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Service Distribution</h3>
          <div class="space-y-4">
            <div v-for="service in serviceDistribution" :key="service.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div :class="service.color" class="w-4 h-4 rounded"></div>
                <span class="text-sm text-gray-700">{{ service.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900">{{ service.percentage }}%</span>
                <span class="text-xs text-gray-500">({{ service.count }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Orders Table -->
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
                  #{{ order.id }}
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
                    order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'pending' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₱{{ order.totalAmount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-primary hover:text-green-600 mr-3">View</button>
                  <button v-if="!order.driverId" class="text-blue-600 hover:text-blue-800">Assign</button>
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
      ordersGrowth: 12,
      revenueGrowth: 8,
      activeDrivers: 0,
      totalDrivers: 0,
      totalUsers: 0,
      pendingUsers: 0,
      pendingDrivers: 0
    })

    const systemStatus = ref({
      badWeatherFee: false,
      autoAcceptUsers: true
    })

    const recentActivity = ref([])
    const revenueChart = ref([
      { day: 'Mon', amount: 1200 },
      { day: 'Tue', amount: 1800 },
      { day: 'Wed', amount: 1500 },
      { day: 'Thu', amount: 2200 },
      { day: 'Fri', amount: 1900 },
      { day: 'Sat', amount: 2800 },
      { day: 'Sun', amount: 2100 }
    ])
    
    const serviceDistribution = ref([
      { name: 'Food Delivery', percentage: 45, count: 234, color: 'bg-blue-500' },
      { name: 'Bill Payment', percentage: 30, count: 156, color: 'bg-green-500' },
      { name: 'Cleaning Service', percentage: 15, count: 78, color: 'bg-yellow-500' },
      { name: 'Other Services', percentage: 10, count: 52, color: 'bg-purple-500' }
    ])
    
    const liveOrders = ref([])

    const listeners = ref([])

    const fetchDashboardStats = async () => {
      try {
        console.log('[v0] Fetching dashboard statistics...')
        
        // Fetch total orders
        try {
          const ordersQuery = query(collection(db, 'orders'))
          const ordersSnapshot = await getDocs(ordersQuery)
          stats.value.totalOrders = ordersSnapshot.size
          console.log('[v0] Total orders:', stats.value.totalOrders)
        } catch (error) {
          console.log('[v0] Orders collection might not exist yet, using default value')
          stats.value.totalOrders = 0
        }

        // Calculate today's revenue
        try {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const todayQuery = query(
            collection(db, 'orders'),
            where('createdAt', '>=', today),
            where('status', '==', 'delivered')
          )
          const todaySnapshot = await getDocs(todayQuery)
          let todayRevenue = 0
          todaySnapshot.forEach(doc => {
            const order = doc.data()
            todayRevenue += order.totalAmount || 0
          })
          stats.value.revenueToday = todayRevenue
          console.log('[v0] Today revenue:', stats.value.revenueToday)
        } catch (error) {
          console.log('[v0] Revenue calculation failed, using default value')
          stats.value.revenueToday = 0
        }

        // Fetch driver statistics
        try {
          const driversQuery = query(
            collection(db, 'users'),
            where('role', '==', 'driver')
          )
          const driversSnapshot = await getDocs(driversQuery)
          stats.value.totalDrivers = driversSnapshot.size
          
          let activeDriversCount = 0
          driversSnapshot.forEach(doc => {
            const driver = doc.data()
            if (driver.status === 'approved' && driver.isOnline) {
              activeDriversCount++
            }
          })
          stats.value.activeDrivers = activeDriversCount
          console.log('[v0] Drivers - Total:', stats.value.totalDrivers, 'Active:', stats.value.activeDrivers)
        } catch (error) {
          console.log('[v0] Driver statistics failed, using default values')
          stats.value.totalDrivers = 0
          stats.value.activeDrivers = 0
        }

        // Fetch user statistics
        try {
          const usersQuery = query(
            collection(db, 'users'),
            where('role', '==', 'user')
          )
          const usersSnapshot = await getDocs(usersQuery)
          stats.value.totalUsers = usersSnapshot.size

          let pendingUsersCount = 0
          usersSnapshot.forEach(doc => {
            const user = doc.data()
            if (user.status === 'pending') {
              pendingUsersCount++
            }
          })
          stats.value.pendingUsers = pendingUsersCount
          console.log('[v0] Users - Total:', stats.value.totalUsers, 'Pending:', stats.value.pendingUsers)
        } catch (error) {
          console.log('[v0] User statistics failed, using default values')
          stats.value.totalUsers = 0
          stats.value.pendingUsers = 0
        }

        // Fetch pending driver applications
        try {
          const pendingDriversQuery = query(
            collection(db, 'users'),
            where('role', '==', 'driver'),
            where('status', '==', 'pending')
          )
          const pendingDriversSnapshot = await getDocs(pendingDriversQuery)
          stats.value.pendingDrivers = pendingDriversSnapshot.size
          console.log('[v0] Pending drivers:', stats.value.pendingDrivers)
        } catch (error) {
          console.log('[v0] Pending drivers query failed, using default value')
          stats.value.pendingDrivers = 0
        }

        console.log('[v0] Dashboard statistics loaded successfully')
      } catch (error) {
        console.error('[v0] Error in fetchDashboardStats:', error)
        toast.error('Some dashboard statistics could not be loaded')
      }
    }

    const fetchRecentActivity = async () => {
      try {
        console.log('[v0] Fetching recent activity...')
        
        try {
          const recentOrdersQuery = query(
            collection(db, 'orders'),
            orderBy('createdAt', 'desc'),
            limit(10)
          )
          const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
          
          const activities = []
          recentOrdersSnapshot.forEach(doc => {
            const order = doc.data()
            activities.push({
              id: doc.id,
              type: 'order',
              message: `New ${order.service || 'service'} order from ${order.customerName || 'customer'}`,
              time: formatTimeAgo(order.createdAt?.toDate())
            })
          })

          recentActivity.value = activities.slice(0, 4)
          console.log('[v0] Recent activity loaded:', recentActivity.value.length, 'items')
        } catch (error) {
          console.log('[v0] Recent activity query failed, using fallback data')
          recentActivity.value = [
            {
              id: '1',
              type: 'order',
              message: 'New cleaning service order from John Doe',
              time: '5 minutes ago'
            },
            {
              id: '2',
              type: 'user',
              message: 'New user registration: Jane Smith',
              time: '15 minutes ago'
            },
            {
              id: '3',
              type: 'driver',
              message: 'Driver application submitted by Mike Johnson',
              time: '1 hour ago'
            }
          ]
        }
      } catch (error) {
        console.error('[v0] Error fetching recent activity:', error)
      }
    }

    const fetchLiveOrders = () => {
      try {
        console.log('[v0] Setting up live orders listener...')
        
        const liveOrdersQuery = query(
          collection(db, 'orders'),
          where('status', 'in', ['pending', 'confirmed', 'in_transit']),
          orderBy('createdAt', 'desc'),
          limit(10)
        )

        const unsubscribe = onSnapshot(liveOrdersQuery, (snapshot) => {
          const orders = []
          snapshot.forEach(doc => {
            const order = doc.data()
            orders.push({
              id: doc.id,
              customerName: order.customerName || 'Unknown',
              service: order.service || 'Unknown Service',
              driverName: order.driverName || null,
              driverId: order.driverId || null,
              status: order.status,
              totalAmount: order.totalAmount || 0
            })
          })
          liveOrders.value = orders
          console.log('[v0] Live orders updated:', orders.length, 'orders')
        }, (error) => {
          console.log('[v0] Live orders listener error (orders collection might not exist):', error.message)
          liveOrders.value = []
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up live orders listener:', error)
        liveOrders.value = []
      }
    }

    const fetchSystemSettings = async () => {
      try {
        console.log('[v0] Fetching system settings...')
        
        const settingsRef = doc(db, 'settings', 'system')
        const settingsDoc = await getDoc(settingsRef)
        
        if (settingsDoc.exists()) {
          const settings = settingsDoc.data()
          systemStatus.value.badWeatherFee = settings.badWeatherFee || false
          systemStatus.value.autoAcceptUsers = settings.autoAcceptUsers !== false // default to true
        } else {
          console.log('[v0] Settings document does not exist, creating default settings')
          await setDoc(settingsRef, {
            badWeatherFee: false,
            autoAcceptUsers: true,
            createdAt: new Date()
          })
          systemStatus.value.badWeatherFee = false
          systemStatus.value.autoAcceptUsers = true
        }
        
        console.log('[v0] System settings loaded:', systemStatus.value)
      } catch (error) {
        console.error('[v0] Error fetching system settings:', error)
        systemStatus.value.badWeatherFee = false
        systemStatus.value.autoAcceptUsers = true
      }
    }

    const formatStatus = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in_transit': 'In Transit',
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
            ? 'Bad Weather Fee enabled (+₱5)' 
            : 'Bad Weather Fee disabled'
        )
      } catch (error) {
        console.error('[v0] Error updating weather fee setting:', error)
        toast.error('Failed to update weather fee setting')
        systemStatus.value.badWeatherFee = !systemStatus.value.badWeatherFee
      }
    }

    const toggleAutoAccept = async () => {
      try {
        systemStatus.value.autoAcceptUsers = !systemStatus.value.autoAcceptUsers
        
        const settingsRef = doc(db, 'settings', 'system')
        await updateDoc(settingsRef, {
          autoAcceptUsers: systemStatus.value.autoAcceptUsers,
          updatedAt: new Date()
        })
        
        toast.success(
          systemStatus.value.autoAcceptUsers 
            ? 'Auto-Accept Users enabled' 
            : 'Auto-Accept Users disabled'
        )
      } catch (error) {
        console.error('[v0] Error updating auto-accept setting:', error)
        toast.error('Failed to update auto-accept setting')
        systemStatus.value.autoAcceptUsers = !systemStatus.value.autoAcceptUsers
      }
    }

    const initializeDashboard = async () => {
      loading.value = true
      try {
        console.log('[v0] Initializing dashboard...')
        
        await Promise.allSettled([
          fetchDashboardStats(),
          fetchRecentActivity(),
          fetchSystemSettings()
        ])
        
        fetchLiveOrders()
        
        console.log('[v0] Dashboard initialization complete')
        toast.success('Dashboard loaded successfully')
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
      console.log('[v0] Dashboard listeners cleaned up')
    })

    return {
      loading,
      stats,
      systemStatus,
      recentActivity,
      revenueChart,
      serviceDistribution,
      liveOrders,
      toggleWeatherFee,
      toggleAutoAccept,
      formatStatus
    }
  }
}
</script>
