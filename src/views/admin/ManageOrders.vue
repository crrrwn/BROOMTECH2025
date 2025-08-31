<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <p class="text-gray-600">Track and manage all delivery orders</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Export Orders
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Assign Driver
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading orders</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pending Orders</p>
            <p class="text-2xl font-bold text-orange-600">{{ pendingOrders }}</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">In Transit</p>
            <p class="text-2xl font-bold text-blue-600">{{ inTransitOrders }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-green-600">{{ completedOrders }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="!loading && !error" class="bg-white p-6 rounded-lg shadow-sm border">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
          <select v-model="serviceFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">All Services</option>
            <option value="grocery">Grocery Delivery</option>
            <option value="food">Food Delivery</option>
            <option value="package">Package Delivery</option>
            <option value="medicine">Medicine Delivery</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <input v-model="dateFilter" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input v-model="searchFilter" type="text" placeholder="Order ID, Customer name..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ order.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img class="h-8 w-8 rounded-full" :src="order.customerAvatar || '/placeholder.svg?height=32&width=32'" :alt="order.customerName">
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ order.customerName || 'Unknown Customer' }}</div>
                    <div class="text-sm text-gray-500">{{ order.customerPhone || 'No phone' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatServiceType(order.serviceType) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="order.driverName" class="flex items-center">
                  <img class="h-8 w-8 rounded-full" :src="order.driverAvatar || '/placeholder.svg?height=32&width=32'" :alt="order.driverName">
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ order.driverName }}</div>
                    <div class="text-sm text-gray-500">{{ order.driverPhone || 'No phone' }}</div>
                  </div>
                </div>
                <span v-else class="text-sm text-gray-500">Not assigned</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₱{{ order.totalAmount || '0.00' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ formatStatus(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="viewOrder(order)" class="text-blue-600 hover:text-blue-900">View</button>
                <button @click="trackOrder(order)" class="text-green-600 hover:text-green-900">Track</button>
                <button v-if="order.status !== 'cancelled' && order.status !== 'delivered'" @click="cancelOrder(order)" class="text-red-600 hover:text-red-900">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500">No orders match your current filters.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error && filteredOrders.length > 0" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length) }} to {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }} results
      </div>
      <div class="flex space-x-2">
        <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'" class="px-3 py-2 text-sm rounded-lg">{{ page }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { realtimeService } from '@/services/realtime'

export default {
  name: 'ManageOrders',
  setup() {
    const orders = ref([])
    const loading = ref(true)
    const error = ref(null)
    const unsubscribe = ref(null)
    
    const statusFilter = ref('')
    const serviceFilter = ref('')
    const dateFilter = ref('')
    const searchFilter = ref('')
    
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const totalOrders = computed(() => orders.value.length)
    const pendingOrders = computed(() => orders.value.filter(order => order.status === 'pending').length)
    const inTransitOrders = computed(() => orders.value.filter(order => order.status === 'in_transit').length)
    const completedOrders = computed(() => orders.value.filter(order => order.status === 'delivered').length)

    const filteredOrders = computed(() => {
      let filtered = orders.value

      if (statusFilter.value) {
        filtered = filtered.filter(order => order.status === statusFilter.value)
      }

      if (serviceFilter.value) {
        filtered = filtered.filter(order => order.serviceType === serviceFilter.value)
      }

      if (searchFilter.value) {
        const search = searchFilter.value.toLowerCase()
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(search) ||
          (order.customerName && order.customerName.toLowerCase().includes(search))
        )
      }

      if (dateFilter.value) {
        const filterDate = new Date(dateFilter.value)
        filtered = filtered.filter(order => {
          if (order.createdAt && order.createdAt.toDate) {
            const orderDate = order.createdAt.toDate()
            return orderDate.toDateString() === filterDate.toDateString()
          }
          return false
        })
      }

      // Pagination
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filtered.slice(start, end)
    })

    const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage.value))
    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const fetchOrders = async () => {
      try {
        loading.value = true
        error.value = null

        const ordersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        )

        unsubscribe.value = onSnapshot(ordersQuery, async (snapshot) => {
          const ordersData = []
          
          for (const docSnapshot of snapshot.docs) {
            const orderData = { id: docSnapshot.id, ...docSnapshot.data() }
            
            // Fetch customer details
            if (orderData.userId) {
              try {
                const userDoc = await getDoc(doc(db, 'users', orderData.userId))
                if (userDoc.exists()) {
                  const userData = userDoc.data()
                  orderData.customerName = `${userData.firstName} ${userData.lastName}`
                  orderData.customerPhone = userData.phone
                  orderData.customerAvatar = userData.avatar
                }
              } catch (err) {
                console.error('Error fetching customer data:', err)
              }
            }

            // Fetch driver details
            if (orderData.driverId) {
              try {
                const driverDoc = await getDoc(doc(db, 'users', orderData.driverId))
                if (driverDoc.exists()) {
                  const driverData = driverDoc.data()
                  orderData.driverName = `${driverData.firstName} ${driverData.lastName}`
                  orderData.driverPhone = driverData.phone
                  orderData.driverAvatar = driverData.avatar
                }
              } catch (err) {
                console.error('Error fetching driver data:', err)
              }
            }

            ordersData.push(orderData)
          }
          
          orders.value = ordersData
          loading.value = false
        }, (err) => {
          console.error('Error fetching orders:', err)
          error.value = 'Failed to load orders. Please try again.'
          loading.value = false
        })

      } catch (err) {
        console.error('Error setting up orders listener:', err)
        error.value = 'Failed to load orders. Please try again.'
        loading.value = false
      }
    }

    const getStatusClass = (status) => {
      const classes = {
        'pending': 'bg-orange-100 text-orange-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'in_transit': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
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

    const formatServiceType = (serviceType) => {
      const serviceMap = {
        'grocery': 'Grocery Delivery',
        'food': 'Food Delivery',
        'package': 'Package Delivery',
        'medicine': 'Medicine Delivery'
      }
      return serviceMap[serviceType] || serviceType
    }

    const viewOrder = (order) => {
      console.log('Viewing order:', order)
      // TODO: Implement order details modal or navigation
    }

    const trackOrder = (order) => {
      console.log('Tracking order:', order)
      // TODO: Implement order tracking functionality
    }

    const cancelOrder = async (order) => {
      if (confirm('Are you sure you want to cancel this order?')) {
        try {
          await realtimeService.updateOrderStatus(order.id, 'cancelled')
        } catch (err) {
          console.error('Error cancelling order:', err)
          alert('Failed to cancel order. Please try again.')
        }
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    onMounted(() => {
      fetchOrders()
    })

    onUnmounted(() => {
      if (unsubscribe.value) {
        unsubscribe.value()
      }
    })

    return {
      orders,
      loading,
      error,
      statusFilter,
      serviceFilter,
      dateFilter,
      searchFilter,
      currentPage,
      itemsPerPage,
      totalOrders,
      pendingOrders,
      inTransitOrders,
      completedOrders,
      filteredOrders,
      totalPages,
      visiblePages,
      getStatusClass,
      formatStatus,
      formatServiceType,
      viewOrder,
      trackOrder,
      cancelOrder,
      goToPage,
      nextPage,
      previousPage
    }
  }
}
</script>
