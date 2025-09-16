<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b bg-gray-50">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Chat Messages</h2>
            <p class="text-gray-600 mt-1">Communicate with your driver in real-time</p>
          </div>
          <div v-if="currentOrder" class="text-right">
            <p class="text-sm text-gray-600">Order #{{ currentOrder.id }}</p>
            <p class="text-sm font-medium text-primary">{{ currentOrder.status }}</p>
          </div>
        </div>
      </div>

      <!-- Chat Interface -->
      <div class="h-96">
        <ChatWindow
          v-if="chatId"
          :chat-id="chatId"
          :order-id="orderId"
          :chat-partner="chatPartner"
        />
        
        <!-- No Active Chat -->
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Active Chat</h3>
            <p class="text-gray-600 mb-4">You don't have any active orders with chat available.</p>
            <router-link
              :to="{ name: 'book-service' }"
              class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Book a Service
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat History -->
    <div v-if="chatHistory.length > 0" class="mt-6 bg-white rounded-lg shadow-sm border">
      <div class="p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Recent Chats</h3>
      </div>
      <div class="divide-y">
        <div
          v-for="chat in chatHistory"
          :key="chat.id"
          @click="openChat(chat)"
          class="p-4 hover:bg-gray-50 cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-gray-600 text-sm font-medium">
                  {{ chat.driverName ? chat.driverName.charAt(0) : 'D' }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">Order #{{ chat.orderId }}</p>
                <p class="text-sm text-gray-600">{{ chat.lastMessage }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ formatChatTime(chat.lastMessageAt) }}</p>
              <div v-if="chat.unreadCount && chat.unreadCount[currentUserId] > 0" class="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full mt-1">
                {{ chat.unreadCount[currentUserId] }}
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
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

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
      chatId: null,
      orderId: null,
      currentOrder: null,
      chatPartner: null,
      chatHistory: [],
      loading: true
    }
  },
  computed: {
    currentUserId() {
      return this.authStore.user?.uid
    }
  },
  async mounted() {
    await this.loadActiveChat()
    this.loadChatHistory()
  },
  beforeUnmount() {
    chatService.unsubscribe(`user_chats_${this.currentUserId}`)
  },
  methods: {
    async loadActiveChat() {
      try {
        this.loading = true
        
        // Get user's most recent active order
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', this.currentUserId),
          where('status', 'in', ['confirmed', 'driver_assigned', 'in_transit', 'arrived']),
          orderBy('createdAt', 'desc'),
          limit(1)
        )

        const ordersSnapshot = await getDocs(ordersQuery)
        
        if (!ordersSnapshot.empty) {
          const orderDoc = ordersSnapshot.docs[0]
          this.currentOrder = { id: orderDoc.id, ...orderDoc.data() }
          this.orderId = orderDoc.id

          // Get or create chat for this order
          if (this.currentOrder.driverId) {
            this.chatId = await chatService.createChatRoom(
              this.currentUserId,
              this.currentOrder.driverId,
              this.orderId
            )

            // Get driver info
            const driverDoc = await getDoc(doc(db, 'users', this.currentOrder.driverId))
            if (driverDoc.exists()) {
              const driverData = driverDoc.data()
              this.chatPartner = {
                id: this.currentOrder.driverId,
                name: `${driverData.firstName} ${driverData.lastName}`,
                role: 'driver',
                phone: driverData.contact
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading active chat:', error)
      } finally {
        this.loading = false
      }
    },

    loadChatHistory() {
      chatService.subscribeToUserChats(this.currentUserId, (chats) => {
        this.chatHistory = chats.filter(chat => chat.id !== this.chatId)
      })
    },

    openChat(chat) {
      this.chatId = chat.id
      this.orderId = chat.orderId
      // Load chat partner info and current order
      this.loadChatDetails(chat)
    },

    async loadChatDetails(chat) {
      try {
        // Get order details
        const orderDoc = await getDoc(doc(db, 'orders', chat.orderId))
        if (orderDoc.exists()) {
          this.currentOrder = { id: orderDoc.id, ...orderDoc.data() }
        }

        // Get driver details
        if (chat.driverId) {
          const driverDoc = await getDoc(doc(db, 'users', chat.driverId))
          if (driverDoc.exists()) {
            const driverData = driverDoc.data()
            this.chatPartner = {
              id: chat.driverId,
              name: `${driverData.firstName} ${driverData.lastName}`,
              role: 'driver',
              phone: driverData.contact
            }
          }
        }
      } catch (error) {
        console.error('Error loading chat details:', error)
      }
    },

    formatChatTime(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        return date.toLocaleDateString()
      }
    }
  }
}
</script>
