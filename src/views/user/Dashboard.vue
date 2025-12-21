<template>
  <div class="min-h-screen bg-gradient-to-br from-[#A8EBI2] via-[#74E600] to-[#3ED400] p-4 md:p-6">
    <!-- Updated welcome section with new gradient colors -->
    <div class="bg-gradient-to-r from-[#3ED400] to-[#00C851] rounded-2xl p-6 md:p-8 text-white mb-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-white/20">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">Welcome back, {{ userName }}!</h1>
          <p class="text-green-100 text-lg animate-fade-in-delay">Ready to place your next order? We're here to help.</p>
        </div>
        <div class="hidden md:block">
          <div class="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center animate-pulse backdrop-blur-sm">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Updated stats cards with gradient backgrounds using color palette -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-white to-[#A8EBI2]/20 rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
        <div class="flex items-center">
          <div class="w-14 h-14 bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Orders</p>
            <p class="text-3xl font-bold text-gray-900 group-hover:text-[#00C851] transition-colors duration-300">{{ stats.totalOrders }}</p>
            <p v-if="stats.totalOrders === 0" class="text-xs text-gray-500 mt-1">No orders yet</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-[#74E600]/20 rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
        <div class="flex items-center">
          <div class="w-14 h-14 bg-gradient-to-br from-[#3ED400] to-[#00C851] rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Completed</p>
            <p class="text-3xl font-bold text-gray-900 group-hover:text-[#00C851] transition-colors duration-300">{{ stats.completedOrders }}</p>
            <p v-if="stats.completedOrders === 0" class="text-xs text-gray-500 mt-1">None completed</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-yellow-200/30 rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
        <div class="flex items-center">
          <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pending</p>
            <p class="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{{ stats.pendingOrders }}</p>
            <p v-if="stats.pendingOrders === 0" class="text-xs text-gray-500 mt-1">None pending</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-white to-[#00C851]/20 rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group backdrop-blur-sm">
        <div class="flex items-center">
          <div class="w-14 h-14 bg-gradient-to-br from-[#00C851] to-emerald-700 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Total Spent</p>
            <p class="text-3xl font-bold text-gray-900 group-hover:text-[#00C851] transition-colors duration-300">₱{{ stats.totalSpent.toFixed(2) }}</p>
            <p v-if="stats.totalSpent === 0" class="text-xs text-gray-500 mt-1">No spending yet</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Updated recent orders section with gradient styling -->
    <div class="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/40">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          <div class="w-8 h-8 bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          Recent Orders
        </h2>
        <router-link to="/user/orders" class="text-[#00C851] hover:text-[#3ED400] text-sm font-bold px-4 py-2 bg-gradient-to-r from-[#A8EBI2]/30 to-[#74E600]/20 rounded-lg hover:from-[#74E600]/30 hover:to-[#3ED400]/20 transition-all duration-300 border border-white/30">
          View All
        </router-link>
      </div>
      
      <div v-if="recentOrders.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gradient-to-br from-[#A8EBI2]/50 to-[#74E600]/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <svg class="w-12 h-12 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <p class="text-gray-700 mb-6 text-lg font-medium">No orders yet</p>
        <router-link 
          to="/user/book" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#3ED400] to-[#00C851] text-white rounded-xl hover:from-[#74E600] hover:to-[#3ED400] transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Your First Order
        </router-link>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="order in recentOrders" :key="order.id" class="group flex items-center justify-between p-6 bg-gradient-to-r from-white/60 to-[#A8EBI2]/20 rounded-2xl hover:from-[#A8EBI2]/30 hover:to-[#74E600]/20 transition-all duration-300 hover:shadow-xl border border-white/40 hover:border-[#74E600]/30 backdrop-blur-sm">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 bg-gradient-to-br from-[#3ED400] to-[#00C851] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <p class="font-bold text-gray-900 text-lg group-hover:text-[#00C851] transition-colors duration-300">{{ order.service }}</p>
              <p class="text-sm text-gray-600">{{ order.date }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-gray-900 text-xl mb-2">₱{{ order.amount }}</p>
            <span :class="[
              'inline-flex px-3 py-1 text-xs font-bold rounded-full',
              order.status === 'Delivered' ? 'bg-gradient-to-r from-[#74E600]/20 to-[#3ED400]/20 text-[#00C851] border border-[#3ED400]/30' :
              order.status === 'In Transit' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' :
              order.status === 'Pending' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300' :
              'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
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

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-delay {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in-delay 0.8s ease-out;
}

/* Smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}

/* Custom hover effects for better performance */
.group:hover .group-hover\:rotate-6 {
  transform: rotate(6deg);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>
