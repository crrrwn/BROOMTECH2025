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
                      Order #{{ chat.orderId }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ chat.lastMessage }}
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

    <!-- Quick Actions -->
    <div class="mt-6 bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          @click="sendQuickUpdate('on_way')"
          :disabled="!selectedChatId"
          class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-6 h-6 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <p class="text-sm font-medium">I'm on my way</p>
        </button>
        
        <button
          @click="sendQuickUpdate('arrived')"
          :disabled="!selectedChatId"
          class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <p class="text-sm font-medium">I've arrived</p>
        </button>
        
        <button
          @click="sendQuickUpdate('delay')"
          :disabled="!selectedChatId"
          class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-6 h-6 text-yellow-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm font-medium">Running late</p>
        </button>
        
        <button
          @click="sendQuickUpdate('completed')"
          :disabled="!selectedChatId"
          class="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-6 h-6 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm font-medium">Service completed</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ChatWindow from '@/components/ChatWindow.vue'
import { chatService } from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'
import { db } from '@/firebase/config'
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'

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
      quickMessages: {
        on_way: "I'm on my way to your location. I'll be there shortly!",
        arrived: "I've arrived at your location. Please let me know if you need help finding me.",
        delay: "I'm running a bit late due to traffic. I'll be there in about 10-15 minutes. Thank you for your patience!",
        completed: "Service completed! Thank you for choosing BroomTech. Please let me know if you need anything else."
      }
    }
  },
  computed: {
    currentDriverId() {
      return this.authStore.user?.uid
    }
  },
  async mounted() {
    await this.loadActiveChats()
  },
  beforeUnmount() {
    chatService.unsubscribe(`driver_chats_${this.currentDriverId}`)
  },
  methods: {
    async loadActiveChats() {
      try {
        this.loading = true
        
        // Subscribe to driver's chats
        chatService.subscribeToUserChats(this.currentDriverId, async (chats) => {
          // Enhance chats with customer information
          const enhancedChats = await Promise.all(
            chats.map(async (chat) => {
              try {
                // Get customer info
                const customerDoc = await getDoc(doc(db, 'users', chat.userId))
                const customerData = customerDoc.exists() ? customerDoc.data() : {}
                
                return {
                  ...chat,
                  customerName: customerData.firstName && customerData.lastName 
                    ? `${customerData.firstName} ${customerData.lastName}`
                    : 'Customer',
                  customerPhone: customerData.contact
                }
              } catch (error) {
                console.error('Error loading customer data:', error)
                return { ...chat, customerName: 'Customer' }
              }
            })
          )
          
          this.activeChats = enhancedChats
          
          // Auto-select first chat if none selected
          if (!this.selectedChatId && enhancedChats.length > 0) {
            this.selectChat(enhancedChats[0])
          }
        })
      } catch (error) {
        console.error('Error loading active chats:', error)
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

    async sendQuickUpdate(type) {
      if (!this.selectedChatId) return
      
      const message = this.quickMessages[type]
      if (!message) return
      
      try {
        await chatService.sendMessage(
          this.selectedChatId,
          this.currentDriverId,
          'driver',
          message
        )
        
        this.$toast.success('Quick update sent!')
      } catch (error) {
        console.error('Error sending quick update:', error)
        this.$toast.error('Failed to send update')
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
