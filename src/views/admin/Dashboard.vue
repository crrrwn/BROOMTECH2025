<template>
  <div class="space-y-6">
     Loading State 
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else>
       Overview Stats 
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

        <!-- Updated to show 20% commission (admin's share) -->
        <div class="bg-white rounded-lg p-6 shadow-sm border">
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
        <div class="bg-white rounded-lg p-6 shadow-sm border">
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

       Quick Actions & Alerts 
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         Pending Approvals 
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

         System Status 
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

       Charts Section 
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         Added revenue filter dropdown 
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Daily Revenue</h3>
            <select 
              v-model="revenueFilter" 
              @change="updateRevenueChart"
              class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="today">Today</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div v-for="(day, index) in revenueChart" :key="index" class="flex flex-col items-center flex-1">
              <div 
                class="bg-primary rounded-t w-full transition-all duration-300 hover:bg-green-600 relative group"
                :style="{ height: `${(day.amount / Math.max(...revenueChart.map(d => d.amount), 1)) * 200}px` }"
              >
                <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₱{{ day.amount.toLocaleString() }}
                </div>
              </div>
              <div class="mt-2 text-center">
                <p class="text-xs text-gray-500">{{ day.day }}</p>
              </div>
            </div>
          </div>
        </div>

         Fixed service distribution to properly fetch and display order counts 
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
                  <router-link :to="`/admin/orders`" class="text-primary hover:text-green-600 mr-3">View</router-link>
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
    const revenueFilter = ref('last7days')
    
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
      badWeatherFee: false,
      autoAcceptUsers: true
    })

    const recentActivity = ref([])
    const revenueChart = ref([])
    const serviceDistribution = ref([])
    const liveOrders = ref([])
    const listeners = ref([])
    const allOrders = ref([])

    const setupSystemSettingsListener = () => {
      try {
        const settingsRef = doc(db, 'settings', 'system')
        
        const unsubscribe = onSnapshot(settingsRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const settings = docSnapshot.data()
            systemStatus.value.badWeatherFee = settings.badWeatherFee || false
            systemStatus.value.autoAcceptUsers = settings.autoAcceptUsers !== false
          } else {
            await setDoc(settingsRef, {
              badWeatherFee: false,
              autoAcceptUsers: true,
              createdAt: new Date()
            })
            systemStatus.value.badWeatherFee = false
            systemStatus.value.autoAcceptUsers = true
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
          console.log('[v0] Orders snapshot size:', snapshot.size)
          
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

          const serviceNameMap = {
            'food-delivery': 'Food Delivery',
            'Food Delivery': 'Food Delivery',
            'bill-payments': 'Bill Payments',
            'Bill Payments': 'Bill Payments',
            'pickup-drop': 'Pick-up & Drop',
            'Pick-up & Drop': 'Pick-up & Drop',
            'gift-delivery': 'Gift Delivery',
            'Gift Delivery': 'Gift Delivery',
            'medicine-delivery': 'Medicine Delivery',
            'Medicine Delivery': 'Medicine Delivery',
            'grocery-shopping': 'Grocery Shopping',
            'Grocery Shopping': 'Grocery Shopping'
          }

          const serviceCounts = {
            'Food Delivery': 0,
            'Bill Payments': 0,
            'Pick-up & Drop': 0,
            'Gift Delivery': 0,
            'Medicine Delivery': 0,
            'Grocery Shopping': 0
          }

          snapshot.forEach(doc => {
            const order = doc.data()
            const orderDate = order.createdAt?.toDate()

            // Today's revenue
            if (orderDate >= today && order.status === 'delivered') {
              todayRevenue += order.totalAmount || 0
            }

            const serviceId = order.service || order.serviceType || 'unknown'
            console.log('[v0] Order service:', serviceId)
            
            const serviceName = serviceNameMap[serviceId] || serviceId
            
            if (serviceCounts.hasOwnProperty(serviceName)) {
              serviceCounts[serviceName]++
            } else {
              console.log('[v0] Unknown service type:', serviceId, '- mapped to:', serviceName)
            }
          })

          console.log('[v0] Service counts:', serviceCounts)

          stats.value.revenueToday = todayRevenue
          stats.value.adminRevenueToday = Math.round(todayRevenue * 0.20)

          const totalServices = Object.values(serviceCounts).reduce((a, b) => a + b, 0)
          console.log('[v0] Total services:', totalServices)
          
          const serviceColors = {
            'Food Delivery': 'bg-blue-500',
            'Bill Payments': 'bg-green-500',
            'Pick-up & Drop': 'bg-yellow-500',
            'Gift Delivery': 'bg-purple-500',
            'Medicine Delivery': 'bg-red-500',
            'Grocery Shopping': 'bg-indigo-500'
          }

          serviceDistribution.value = Object.entries(serviceCounts)
            .map(([name, count]) => ({
              name,
              count,
              percentage: totalServices > 0 ? Math.round((count / totalServices) * 100) : 0,
              color: serviceColors[name] || 'bg-gray-500'
            }))

          console.log('[v0] Service distribution:', serviceDistribution.value)

          updateRevenueChart()

        }, (error) => {
          console.log('[v0] Orders listener error:', error.message)
          stats.value.totalOrders = 0
          stats.value.revenueToday = 0
          stats.value.adminRevenueToday = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up orders listener:', error)
      }
    }

    const updateRevenueChart = () => {
      const filter = revenueFilter.value
      const now = new Date()
      let chartData = []

      if (filter === 'today') {
        // Show hourly data for today
        for (let i = 0; i < 24; i++) {
          chartData.push({
            day: `${i}:00`,
            amount: 0
          })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        allOrders.value.forEach(order => {
          const orderDate = order.createdAt?.toDate()
          if (orderDate >= today && order.status === 'delivered') {
            const hour = orderDate.getHours()
            chartData[hour].amount += (order.totalAmount || 0) * 0.20
          }
        })
      } else if (filter === 'last7days') {
        // Show last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)
          chartData.push({
            date: date,
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
            amount: 0
          })
        }

        allOrders.value.forEach(order => {
          const orderDate = order.createdAt?.toDate()
          if (orderDate && order.status === 'delivered') {
            for (let dayData of chartData) {
              const nextDay = new Date(dayData.date)
              nextDay.setDate(nextDay.getDate() + 1)
              if (orderDate >= dayData.date && orderDate < nextDay) {
                dayData.amount += (order.totalAmount || 0) * 0.20
                break
              }
            }
          }
        })
      } else if (filter === 'last30days') {
        // Show last 30 days (grouped by 5 days)
        for (let i = 29; i >= 0; i -= 5) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)
          chartData.push({
            date: date,
            day: `${date.getMonth() + 1}/${date.getDate()}`,
            amount: 0,
            endDate: new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000)
          })
        }

        allOrders.value.forEach(order => {
          const orderDate = order.createdAt?.toDate()
          if (orderDate && order.status === 'delivered') {
            for (let dayData of chartData) {
              if (orderDate >= dayData.date && orderDate < dayData.endDate) {
                dayData.amount += (order.totalAmount || 0) * 0.20
                break
              }
            }
          }
        })
      } else if (filter === 'thisMonth') {
        // Show this month by weeks
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        
        let currentWeek = 1
        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 7)) {
          const weekEnd = new Date(d)
          weekEnd.setDate(weekEnd.getDate() + 7)
          chartData.push({
            date: new Date(d),
            day: `Week ${currentWeek}`,
            amount: 0,
            endDate: weekEnd > lastDay ? lastDay : weekEnd
          })
          currentWeek++
        }

        allOrders.value.forEach(order => {
          const orderDate = order.createdAt?.toDate()
          if (orderDate && order.status === 'delivered') {
            for (let dayData of chartData) {
              if (orderDate >= dayData.date && orderDate < dayData.endDate) {
                dayData.amount += (order.totalAmount || 0) * 0.20
                break
              }
            }
          }
        })
      } else if (filter === 'lastMonth') {
        // Show last month by weeks
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
        
        let currentWeek = 1
        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 7)) {
          const weekEnd = new Date(d)
          weekEnd.setDate(weekEnd.getDate() + 7)
          chartData.push({
            date: new Date(d),
            day: `Week ${currentWeek}`,
            amount: 0,
            endDate: weekEnd > lastDay ? lastDay : weekEnd
          })
          currentWeek++
        }

        allOrders.value.forEach(order => {
          const orderDate = order.createdAt?.toDate()
          if (orderDate && order.status === 'delivered') {
            for (let dayData of chartData) {
              if (orderDate >= dayData.date && orderDate < dayData.endDate) {
                dayData.amount += (order.totalAmount || 0) * 0.20
                break
              }
            }
          }
        })
      }

      revenueChart.value = chartData
    }

    const setupRecentActivityListener = () => {
      try {
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(4)
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
            const serviceName = serviceNameMap[order.service] || order.service || 'service'
            activities.push({
              id: doc.id,
              type: 'order',
              message: `New ${serviceName} order from ${order.customerName || 'customer'}`,
              time: formatTimeAgo(order.createdAt?.toDate())
            })
          })
          recentActivity.value = activities
        }, (error) => {
          console.log('[v0] Recent activity listener error:', error.message)
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
          where('status', 'in', ['pending', 'confirmed', 'in-transit']),
          orderBy('createdAt', 'desc'),
          limit(10)
        )

        const unsubscribe = onSnapshot(liveOrdersQuery, (snapshot) => {
          const orders = []
          const serviceNameMap = {
            'food-delivery': 'Food Delivery',
            'bill-payments': 'Bill Payments',
            'pickup-drop': 'Pick-up & Drop',
            'gift-delivery': 'Gift Delivery',
            'medicine-delivery': 'Medicine Delivery',
            'grocery-shopping': 'Grocery Shopping'
          }

          snapshot.forEach(doc => {
            const order = doc.data()
            const serviceId = order.service || order.serviceType || 'unknown'
            const serviceName = serviceNameMap[serviceId] || serviceId

            orders.push({
              id: doc.id,
              customerName: order.customerName || 'Unknown',
              service: serviceName,
              driverName: order.driverName || null,
              driverId: order.driverId || null,
              status: order.status,
              totalAmount: order.totalAmount || 0
            })
          })
          liveOrders.value = orders
        }, (error) => {
          console.log('[v0] Live orders listener error:', error.message)
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
        setupSystemSettingsListener()
        setupPendingUsersListener()
        setupPendingDriversListener()
        setupUsersListener()
        setupDriversListener()
        setupOrdersListener()
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
      revenueChart,
      revenueFilter,
      serviceDistribution,
      liveOrders,
      toggleWeatherFee,
      toggleAutoAccept,
      updateRevenueChart,
      formatStatus
    }
  }
}
</script>
