<template>
  <div class="space-y-6">
     Welcome Section 
    <div class="bg-gradient-to-r from-blue-500 to-green-600 rounded-xl p-6 text-white">
      <h1 class="text-2xl font-bold mb-2">Welcome back, {{ userName }}!</h1>
      <p class="text-green-100">Ready to place your next order? We're here to help.</p>
    </div>

     Quick Stats 
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
            <p v-if="stats.totalOrders === 0" class="text-xs text-gray-500 mt-1">No orders yet</p>
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
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.completedOrders }}</p>
            <p v-if="stats.completedOrders === 0" class="text-xs text-gray-500 mt-1">None completed</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.pendingOrders }}</p>
            <p v-if="stats.pendingOrders === 0" class="text-xs text-gray-500 mt-1">None pending</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Spent</p>
            <p class="text-2xl font-semibold text-gray-900">₱{{ stats.totalSpent.toFixed(2) }}</p>
            <p v-if="stats.totalSpent === 0" class="text-xs text-gray-500 mt-1">No spending yet</p>
          </div>
        </div>
      </div>
    </div>

     Quick Actions 
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link 
          to="/user/book" 
          class="flex flex-col items-center p-4 bg-primary bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
        >
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900">Book Service</span>
        </router-link>

        <router-link 
          to="/user/orders" 
          class="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900">View Orders</span>
        </router-link>

        <router-link 
          to="/user/payment" 
          class="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 11-8 0 4 4 0 018 0zM15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900">Upload Payment</span>
        </router-link>

        <router-link 
          to="/user/profile" 
          class="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900">Profile</span>
        </router-link>
      </div>
    </div>

     Recent Orders 
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <router-link to="/user/orders" class="text-primary hover:text-green-600 text-sm font-medium">
          View All
        </router-link>
      </div>
      
      <div v-if="recentOrders.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p class="text-gray-600 mb-4">No orders yet</p>
        <router-link 
          to="/user/book" 
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Your First Order
        </router-link>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ order.service }}</p>
              <p class="text-sm text-gray-500">{{ order.date }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-900">₱{{ order.amount }}</p>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-medium rounded-full',
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            ]">
              {{ order.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { realtimeService } from '@/services/realtime'

export default {
  name: 'UserDashboard',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      stats: {
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalSpent: 0
      },
      recentOrders: [],
      unsubscribeFunction: null
    }
  },
  computed: {
    userName() {
      const profile = this.authStore.userProfile
      return profile ? profile.firstName : 'User'
    }
  },
  async mounted() {
    const userUid = this.authStore.user?.uid
    if (userUid) {
      this.unsubscribeFunction = realtimeService.subscribeToUserOrders(userUid, (orders) => {
        this.calculateStats(orders)
      })
    }
  },
  beforeUnmount() {
    if (this.unsubscribeFunction) {
      this.unsubscribeFunction()
    }
  },
  methods: {
    calculateStats(orders) {
      const totalOrders = orders.length
      const completedOrders = orders.filter(order => order.status === 'delivered').length
      const pendingOrders = orders.filter(order => ['pending', 'confirmed', 'in_transit'].includes(order.status)).length
      const totalSpent = orders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + (order.priceEstimate?.total || 0), 0)

      this.stats = {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalSpent
      }

      // Get recent orders (last 4 orders)
      this.recentOrders = orders
        .sort((a, b) => new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate()))
        .slice(0, 4)
        .map(order => ({
          id: order.id,
          service: order.serviceName,
          date: this.formatDate(order.createdAt),
          amount: order.priceEstimate?.total || 0,
          status: this.formatStatus(order.status)
        }))
    },

    formatDate(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp.toDate())
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'Today'
      if (diffDays === 2) return 'Yesterday'
      if (diffDays <= 7) return `${diffDays - 1} days ago`
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    },

    formatStatus(status) {
      const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in_transit': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    }
  }
}
</script>
