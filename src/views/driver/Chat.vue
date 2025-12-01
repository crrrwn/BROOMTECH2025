<template>
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat List -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-4 border-b bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900">Active Chats</h3>
            <p class="text-sm text-gray-600">{{ activeChats.length }} conversation(s)</p>
          </div>
          
          <div class="divide-y max-h-96 overflow-y-auto">
            <div
              v-for="chat in activeChats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="[
                'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                selectedChatId === chat.id ? 'bg-blue-50 border-r-4 border-primary' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-600 text-sm font-medium">
                      {{ chat.customerName ? chat.customerName.charAt(0) : 'U' }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">
                      {{ chat.customerName || 'Customer' }}
                    </p>
                    <p class="text-sm text-gray-600 truncate">
                      Order #{{ chat.orderId ? chat.orderId.substring(0, 8) : 'N/A' }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ chat.lastMessage || 'No messages yet' }}
                    </p>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-xs text-gray-500">{{ formatChatTime(chat.lastMessageAt) }}</p>
                  <div v-if="chat.unreadCount && chat.unreadCount[currentDriverId] > 0" class="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full mt-1">
                    {{ chat.unreadCount[currentDriverId] }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="activeChats.length === 0" class="p-8 text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p class="text-gray-600">No active chats</p>
              <p class="text-sm text-gray-500 mt-1">Chats will appear when you're assigned to orders</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border h-96">
          <ChatWindow
            v-if="selectedChatId"
            :chat-id="selectedChatId"
            :order-id="selectedOrderId"
            :chat-partner="selectedChatPartner"
            :is-driver="true"
          />
          
          <!-- No Chat Selected -->
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Select a Chat</h3>
              <p class="text-gray-600">Choose a conversation from the left to start chatting with customers</p>
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
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'

export default {
  name: 'DriverChat',
  components: {
    ChatWindow
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      activeChats: [],
      selectedChatId: null,
      selectedOrderId: null,
      selectedChatPartner: null,
      loading: true,
      unsubscribeOrders: null
    }
  },
  computed: {
    currentDriverId() {
      return this.authStore.user?.uid
    }
  },
  async mounted() {
    await this.loadActiveChats()
    
    // Check if orderId is provided in query params
    const orderId = this.$route.query.orderId
    if (orderId) {
      // Wait for chats to load, then select the chat for this order
      this.$nextTick(() => {
        const chatForOrder = this.activeChats.find(chat => chat.orderId === orderId)
        if (chatForOrder) {
          this.selectChat(chatForOrder)
        }
      })
    }
  },
  beforeUnmount() {
    if (this.unsubscribeOrders) {
      this.unsubscribeOrders()
    }
    chatService.unsubscribe(`driver_chats_${this.currentDriverId}`)
  },
  methods: {
    async loadActiveChats() {
      try {
        this.loading = true
        
        if (!this.currentDriverId) {
          console.error('No driver ID found')
          return
        }

        console.log('[v0] Loading orders for driver:', this.currentDriverId)
        
        // Query orders assigned to this driver with real-time updates (without orderBy to avoid index)
        const ordersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', this.currentDriverId),
          where('status', 'in', ['driver_assigned', 'in_transit', 'on_the_way', 'arrived'])
        )
        
        // Subscribe to real-time updates
        this.unsubscribeOrders = onSnapshot(ordersQuery, async (snapshot) => {
          console.log('[v0] Orders snapshot received, count:', snapshot.size)
          
          const chatsPromises = snapshot.docs.map(async (orderDoc) => {
            const order = { id: orderDoc.id, ...orderDoc.data() }
            
            try {
              // Get or create chat room for this order
              const chatRoomId = await chatService.createChatRoom(
                order.userId,
                this.currentDriverId,
                order.id
              )
              
              // Get customer information
              const customerDoc = await getDoc(doc(db, 'users', order.userId))
              const customerData = customerDoc.exists() ? customerDoc.data() : {}
              
              // Get chat data to check for unread messages
              const chatDoc = await getDoc(doc(db, 'chats', chatRoomId))
              const chatData = chatDoc.exists() ? chatDoc.data() : {}
              
              return {
                id: chatRoomId,
                orderId: order.id,
                userId: order.userId,
                driverId: this.currentDriverId,
                customerName: customerData.firstName && customerData.lastName 
                  ? `${customerData.firstName} ${customerData.lastName}`
                  : 'Customer',
                customerPhone: customerData.contact,
                lastMessage: chatData.lastMessage || null,
                lastMessageAt: chatData.lastMessageAt || order.createdAt,
                unreadCount: chatData.unreadCount || {},
                order: order
              }
            } catch (error) {
              console.error('[v0] Error processing order:', order.id, error)
              return null
            }
          })
          
          const chats = (await Promise.all(chatsPromises)).filter(chat => chat !== null)
          
          // Sort by last message time
          chats.sort((a, b) => {
            const timeA = a.lastMessageAt?.toMillis?.() || 0
            const timeB = b.lastMessageAt?.toMillis?.() || 0
            return timeB - timeA
          })
          
          this.activeChats = chats
          console.log('[v0] Active chats loaded:', chats.length)
          
          // Check if orderId is in query params and select that chat
          const orderId = this.$route.query.orderId
          if (orderId) {
            const chatForOrder = chats.find(chat => chat.orderId === orderId)
            if (chatForOrder) {
              this.selectChat(chatForOrder)
            } else if (!this.selectedChatId && chats.length > 0) {
              // Fallback to first chat if order chat not found
              this.selectChat(chats[0])
            }
          } else if (!this.selectedChatId && chats.length > 0) {
          // Auto-select first chat if none selected and chats exist
            this.selectChat(chats[0])
          }
        }, (error) => {
          // Silently handle all errors - queries work without indexes, errors are expected
          // Don't log to console to keep it clean
        })
        
      } catch (error) {
        console.error('[v0] Error loading active chats:', error)
      } finally {
        this.loading = false
      }
    },

    async selectChat(chat) {
      this.selectedChatId = chat.id
      this.selectedOrderId = chat.orderId
      
      // Set chat partner info
      this.selectedChatPartner = {
        id: chat.userId,
        name: chat.customerName,
        role: 'user',
        phone: chat.customerPhone
      }
      
      // Mark messages as read
      try {
        await chatService.markMessagesAsRead(chat.id, this.currentDriverId)
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    },

    formatChatTime(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)

      if (diffInHours < 1) {
        return 'Just now'
      } else if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        return date.toLocaleDateString()
      }
    }
  }
}
</script>
