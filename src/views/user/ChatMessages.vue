<template>
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Orders List with Assigned Drivers -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-4 border-b bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900">My Orders</h3>
            <p class="text-sm text-gray-600">{{ activeOrders.length }} order(s) with drivers</p>
          </div>
          
          <div class="divide-y max-h-96 overflow-y-auto">
            <!-- Display all active orders with assigned drivers -->
            <div
              v-for="order in activeOrders"
              :key="order.id"
              @click="selectOrder(order)"
              :class="[
                'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                selectedOrderId === order.id ? 'bg-blue-50 border-r-4 border-primary' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-600 text-sm font-medium">
                      {{ order.driverName ? order.driverName.charAt(0) : 'D' }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">
                      {{ order.driverName || 'Driver' }}
                    </p>
                    <p class="text-sm text-gray-600 truncate">
                      Order #{{ order.id.substring(0, 8) }}
                    </p>
                    <p class="text-xs text-gray-500">
                      <span :class="getStatusColor(order.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ formatStatus(order.status) }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <div v-if="order.unreadCount > 0" class="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                    {{ order.unreadCount }}
                  </div>
                  <div v-if="order.driverOnline" class="flex items-center mt-1">
                    <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    <span class="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="activeOrders.length === 0 && !loading" class="p-8 text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p class="text-gray-600">No active orders</p>
              <p class="text-sm text-gray-500 mt-1">Orders with assigned drivers will appear here</p>
              <router-link
                :to="{ name: 'book-service' }"
                class="inline-flex items-center px-4 py-2 mt-4 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Book a Service
              </router-link>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="p-8 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p class="text-gray-600 mt-2">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border">
          <!-- Show chat header with order and driver info -->
          <div v-if="selectedOrderId && currentOrder" class="p-4 border-b bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Chat with {{ chatPartner?.name || 'Driver' }}</h3>
                <p class="text-sm text-gray-600">Order #{{ currentOrder.id.substring(0, 8) }} - {{ formatStatus(currentOrder.status) }}</p>
              </div>
              <div v-if="chatPartner?.phone" class="text-right">
                <p class="text-sm text-gray-600">{{ chatPartner.phone }}</p>
              </div>
            </div>
          </div>

          <div class="h-96">
            <ChatWindow
              v-if="chatId && selectedOrderId"
              :chat-id="chatId"
              :order-id="selectedOrderId"
              :chat-partner="chatPartner"
            />
            
            <!-- No Chat Selected -->
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Select an Order</h3>
                <p class="text-gray-600">Choose an order from the left to chat with your driver</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatWindow from '@/components/ChatWindow.vue'
import { chatService } from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'
import { db } from '@/firebase/config'
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'

export default {
  name: 'UserChatMessages',
  components: {
    ChatWindow
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      activeOrders: [],
      selectedOrderId: null,
      chatId: null,
      currentOrder: null,
      chatPartner: null,
      loading: true,
      unsubscribeOrders: null
    }
  },
  computed: {
    currentUserId() {
      return this.authStore.user?.uid
    }
  },
  async mounted() {
    console.log('[v0] ChatMessages mounted, current user:', this.currentUserId)
    
    await this.loadActiveOrders()
    
    if (this.$route.params.chatId) {
      await this.loadSpecificChat(this.$route.params.chatId)
    }
  },
  beforeUnmount() {
    if (this.unsubscribeOrders) {
      this.unsubscribeOrders()
    }
  },
  methods: {
    async loadActiveOrders() {
      try {
        console.log('[v0] Setting up real-time listener for orders, user:', this.currentUserId)
        this.loading = true
        
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', this.currentUserId),
          orderBy('createdAt', 'desc')
        )

        this.unsubscribeOrders = onSnapshot(ordersQuery, async (snapshot) => {
          console.log('[v0] Orders snapshot received, size:', snapshot.size)
          
          const orders = []
          for (const orderDoc of snapshot.docs) {
            const orderData = orderDoc.data()
            
            // Only include orders with assigned drivers and active statuses
            if (orderData.driverId && ['confirmed', 'driver_assigned', 'in_transit', 'on_the_way', 'arrived'].includes(orderData.status)) {
              console.log('[v0] Processing order:', orderDoc.id, 'status:', orderData.status, 'driverId:', orderData.driverId)
              
              // Get driver info
              const driverDoc = await getDoc(doc(db, 'users', orderData.driverId))
              let driverName = 'Driver'
              let driverPhone = ''
              let driverOnline = false
              
              if (driverDoc.exists()) {
                const driverData = driverDoc.data()
                driverName = `${driverData.firstName || ''} ${driverData.lastName || ''}`.trim()
                driverPhone = driverData.contact || driverData.phone || ''
                driverOnline = driverData.isOnline || false
                console.log('[v0] Driver info:', driverName, driverPhone)
              }
              
              // Get or create chat room
              const chatRoomId = await chatService.createChatRoom(
                this.currentUserId,
                orderData.driverId,
                orderDoc.id
              )
              
              console.log('[v0] Chat room ID:', chatRoomId)
              
              orders.push({
                id: orderDoc.id,
                ...orderData,
                driverName,
                driverPhone,
                driverOnline,
                chatId: chatRoomId,
                unreadCount: 0
              })
            }
          }
          
          this.activeOrders = orders
          console.log('[v0] Active orders with drivers:', this.activeOrders.length)
          
          // Auto-select first order if none selected
          if (!this.selectedOrderId && orders.length > 0) {
            await this.selectOrder(orders[0])
          }
          
          this.loading = false
        }, (error) => {
          console.error('[v0] Error in orders listener:', error)
          this.loading = false
        })
      } catch (error) {
        console.error('[v0] Error setting up orders listener:', error)
        this.loading = false
      }
    },

    async selectOrder(order) {
      try {
        console.log('[v0] Selecting order:', order.id)
        this.selectedOrderId = order.id
        this.currentOrder = order
        this.chatId = order.chatId
        
        // Set chat partner info
        this.chatPartner = {
          id: order.driverId,
          name: order.driverName,
          role: 'driver',
          phone: order.driverPhone
        }
        
        console.log('[v0] Chat partner:', this.chatPartner)
        
        // Mark messages as read
        if (this.chatId) {
          await chatService.markMessagesAsRead(this.chatId, this.currentUserId)
        }
      } catch (error) {
        console.error('[v0] Error selecting order:', error)
      }
    },

    async loadSpecificChat(chatId) {
      try {
        console.log('[v0] Loading specific chat:', chatId)
        
        // Get chat details
        const chatDoc = await getDoc(doc(db, 'chats', chatId))
        if (!chatDoc.exists()) {
          console.error('[v0] Chat not found:', chatId)
          return
        }

        const chatData = chatDoc.data()
        const orderId = chatData.orderId

        // Find the order in activeOrders
        const order = this.activeOrders.find(o => o.id === orderId)
        if (order) {
          await this.selectOrder(order)
        }
      } catch (error) {
        console.error('[v0] Error loading specific chat:', error)
      }
    },

    formatStatus(status) {
      const statusMap = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        driver_assigned: 'Driver Assigned',
        in_transit: 'In Transit',
        on_the_way: 'On The Way',
        arrived: 'Arrived',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
      return statusMap[status] || status
    },

    getStatusColor(status) {
      const colorMap = {
        pending: 'bg-gray-100 text-gray-800',
        confirmed: 'bg-blue-100 text-blue-800',
        driver_assigned: 'bg-purple-100 text-purple-800',
        in_transit: 'bg-yellow-100 text-yellow-800',
        on_the_way: 'bg-indigo-100 text-indigo-800',
        arrived: 'bg-green-100 text-green-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      }
      return colorMap[status] || 'bg-gray-100 text-gray-800'
    }
  }
}
</script>
