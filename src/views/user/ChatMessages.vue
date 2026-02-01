<template>
  <div class="min-h-screen w-full bg-gray-50/50 overflow-x-hidden font-sans pb-6 sm:pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      <!-- Header -->
      <div class="relative overflow-hidden bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg text-white">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-fit p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">Chat Messages</h1>
          </div>
          <p class="text-sm sm:text-base text-white/90 ml-1">{{ activeOrders.length }} active order(s) with drivers</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Orders List with Assigned Drivers -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-3 sm:p-4 border-b bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10">
              <h3 class="text-base sm:text-lg font-bold text-gray-900">My Orders</h3>
              <p class="text-xs sm:text-sm text-gray-600 mt-0.5">{{ activeOrders.length }} order(s) with drivers</p>
            </div>
            
            <div class="divide-y max-h-[600px] overflow-y-auto custom-scrollbar">
              <!-- Display all active orders with assigned drivers -->
              <div
                v-for="order in activeOrders"
                :key="order.id"
                @click="selectOrder(order)"
                :class="[
                  'p-3 sm:p-4 cursor-pointer transition-all duration-200',
                  selectedOrderId === order.id 
                    ? 'bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 border-r-4 border-[#00C851]' 
                    : 'hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center justify-between gap-2 sm:gap-3">
                  <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div class="relative flex-shrink-0">
                      <div class="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm border-2 border-white">
                        {{ order.driverName ? order.driverName.charAt(0).toUpperCase() : 'D' }}
                      </div>
                      <div v-if="order.driverOnline" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3ED400] rounded-full border-2 border-white"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {{ order.driverName || 'Driver' }}
                      </p>
                      <p class="text-xs sm:text-sm text-gray-600 truncate">
                        Order #{{ order.id.substring(0, 8) }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        <span :class="getStatusColor(order.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                          {{ formatStatus(order.status) }}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0 flex flex-col items-end gap-1">
                    <div v-if="order.unreadCount > 0" class="inline-flex items-center justify-center w-5 h-5 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-xs font-bold rounded-full shadow-sm">
                      {{ order.unreadCount }}
                    </div>
                    <div v-if="order.driverOnline" class="flex items-center gap-1">
                      <span class="w-2 h-2 bg-[#3ED400] rounded-full animate-pulse"></span>
                      <span class="text-xs text-gray-500 hidden sm:inline">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-if="activeOrders.length === 0 && !loading" class="p-6 sm:p-8 text-center">
                <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <p class="text-sm sm:text-base font-bold text-gray-800 mb-1">No active orders</p>
                <p class="text-xs sm:text-sm text-gray-500 mb-4">Orders with assigned drivers will appear here</p>
                <router-link
                  :to="{ name: 'book-service' }"
                  class="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#00C851] to-[#3ED400] rounded-lg hover:from-[#00C851]/90 hover:to-[#3ED400]/90 transition-all shadow-md hover:shadow-lg"
                >
                  Book a Service
                </router-link>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="p-6 sm:p-8 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C851] mx-auto"></div>
                <p class="text-sm text-gray-600 mt-3 font-medium">Loading orders...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden h-[600px] sm:h-[700px] flex flex-col">
            <!-- Show chat header with order and driver info -->
            <div v-if="selectedOrderId && currentOrder" class="p-3 sm:p-4 border-b bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 flex-shrink-0">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex-1 min-w-0">
                  <h3 class="text-base sm:text-lg font-bold text-gray-900 truncate">Chat with {{ chatPartner?.name || 'Driver' }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 mt-0.5">Order #{{ currentOrder.id.substring(0, 8) }} - {{ formatStatus(currentOrder.status) }}</p>
                </div>
                <div v-if="chatPartner?.phone" class="text-right flex-shrink-0">
                  <p class="text-xs sm:text-sm text-gray-600 font-medium">{{ chatPartner.phone }}</p>
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-hidden">
              <ChatWindow
                v-if="chatId && selectedOrderId"
                :chat-id="chatId"
                :order-id="selectedOrderId"
                :chat-partner="chatPartner"
                class="h-full"
              />
              
              <!-- No Chat Selected -->
              <div v-else class="flex items-center justify-center h-full p-4 sm:p-6">
                <div class="text-center">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2">Select an Order</h3>
                  <p class="text-xs sm:text-sm text-gray-600">Choose an order from the left to chat with your driver</p>
                </div>
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
        pending: 'bg-orange-100 text-orange-800',
        confirmed: 'bg-blue-100 text-blue-800',
        driver_assigned: 'bg-gradient-to-r from-[#A8EB12]/20 to-[#74E600]/20 text-[#00C851] border border-[#3ED400]/30',
        in_transit: 'bg-gradient-to-r from-[#74E600]/20 to-[#3ED400]/20 text-[#00C851] border border-[#3ED400]/30',
        on_the_way: 'bg-gradient-to-r from-[#3ED400]/20 to-[#00C851]/20 text-[#00C851] border border-[#3ED400]/30',
        arrived: 'bg-gradient-to-r from-[#00C851]/20 to-[#3ED400]/20 text-[#00C851] border border-[#3ED400]/30',
        delivered: 'bg-gradient-to-r from-[#00C851]/20 to-[#3ED400]/20 text-[#00C851] border border-[#3ED400]/30',
        cancelled: 'bg-red-100 text-red-800'
      }
      return colorMap[status] || 'bg-gray-100 text-gray-800'
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
