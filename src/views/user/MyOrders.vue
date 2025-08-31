<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
        <p class="text-gray-600">Track and manage your delivery orders</p>
      </div>
      <router-link to="/user/book-service" 
                   class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        New Order
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4">
        <select v-model="selectedStatus" @change="filterOrders" 
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select v-model="selectedService" @change="filterOrders"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">All Services</option>
          <option value="Grocery Delivery">Grocery</option>
          <option value="Food Delivery">Food</option>
          <option value="Medicine Delivery">Medicine</option>
          <option value="Package Delivery">Package</option>
        </select>

        <input type="text" v-model="searchQuery" @input="filterOrders" 
               placeholder="Search orders..." 
               class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
      </div>
    </div>

    <!-- Orders List -->
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        <div class="inline-flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        <p class="text-gray-600 mt-2">Loading orders...</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p class="text-gray-600">No orders found</p>
        <router-link to="/user/book-service" 
                     class="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Create Your First Order
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div v-for="order in filteredOrders" :key="order.id" 
             class="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">#{{ order.id }}</h3>
                <span :class="getStatusClass(order.status)" 
                      class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ formatStatus(order.status) }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-600">Service</p>
                  <p class="font-medium text-gray-900">{{ order.serviceName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Total Amount</p>
                  <p class="font-medium text-gray-900">₱{{ order.priceEstimate?.total || '0.00' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">From</p>
                  <p class="font-medium text-gray-900 truncate">{{ order.pickupAddress }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">To</p>
                  <p class="font-medium text-gray-900 truncate">{{ order.deliveryAddress }}</p>
                </div>
              </div>

              <div v-if="order.driver" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                <img :src="order.driver.avatar" :alt="order.driver.name" 
                     class="w-10 h-10 rounded-full">
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ order.driver.name }}</p>
                  <p class="text-sm text-gray-600">{{ order.driver.vehicle }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="callDriver(order.driver.phone)" 
                          class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-600">
                <span>{{ formatDate(order.createdAt) }}</span>
                <div class="flex space-x-3">
                  <button @click="viewOrder(order.id)" 
                          class="text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                  <button v-if="order.status === 'pending'" 
                          @click="cancelOrder(order.id)" 
                          class="text-red-600 hover:text-red-800 font-medium">
                    Cancel
                  </button>
                  <button v-if="order.status === 'delivered' && !order.paymentProof" 
                          @click="uploadPayment(order.id)" 
                          class="text-green-600 hover:text-green-800 font-medium">
                    Upload Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2">
      <button @click="currentPage--" :disabled="currentPage === 1" 
              class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
        Previous
      </button>
      <span class="px-3 py-2 text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button @click="currentPage++" :disabled="currentPage === totalPages" 
              class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { realtimeService } from '@/services/realtime'
import { useAuthStore } from '@/stores/auth'
import { db } from '@/firebase/config'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export default {
  name: 'MyOrders',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: true,
      selectedStatus: '',
      selectedService: '',
      searchQuery: '',
      currentPage: 1,
      ordersPerPage: 10
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.ordersPerPage)
    }
  },
  async mounted() {
    await this.loadOrders()
  },
  beforeUnmount() {
    realtimeService.unsubscribe(`user_orders_${this.authStore.user.uid}`)
  },
  methods: {
    async loadOrders() {
      try {
        // Subscribe to real-time order updates
        realtimeService.subscribeToUserOrders(this.authStore.user.uid, (orders) => {
          this.orders = orders
          this.filterOrders()
          this.loading = false
        })
      } catch (error) {
        console.error('Error loading orders:', error)
        this.loading = false
      }
    },

    filterOrders() {
      let filtered = [...this.orders]

      if (this.selectedStatus) {
        filtered = filtered.filter(order => order.status === this.selectedStatus)
      }

      if (this.selectedService) {
        filtered = filtered.filter(order => order.serviceName === this.selectedService)
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.serviceName.toLowerCase().includes(query) ||
          order.pickupAddress.toLowerCase().includes(query) ||
          order.deliveryAddress.toLowerCase().includes(query)
        )
      }

      this.filteredOrders = filtered
      this.currentPage = 1
    },

    getStatusClass(status) {
      const classes = {
        'pending': 'bg-orange-100 text-orange-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'in_transit': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
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
    },

    formatDate(timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    viewOrder(orderId) {
      this.$router.push(`/user/orders/${orderId}`)
    },

    async cancelOrder(orderId) {
      if (!confirm('Are you sure you want to cancel this order?')) return

      try {
        await realtimeService.updateOrderStatus(orderId, 'cancelled')
        alert('Order cancelled successfully')
      } catch (error) {
        console.error('Error cancelling order:', error)
        alert('Error cancelling order. Please try again.')
      }
    },

    uploadPayment(orderId) {
      this.$router.push(`/user/upload-payment/${orderId}`)
    },

    callDriver(phone) {
      if (phone) {
        window.open(`tel:${phone}`)
      }
    }
  }
}
</script>
