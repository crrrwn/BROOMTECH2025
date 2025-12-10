<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">Chat Monitoring</h2>
          <p class="text-gray-600 mt-1">Monitor all conversations between users and drivers</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="bg-white rounded-lg border px-4 py-2">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-gray-700">{{ activeChats.length }} Active Chats</span>
            </div>
          </div>
          <button
            @click="refreshChats"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat List -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-4 border-b bg-gray-50">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">All Conversations</h3>
              <div class="flex items-center space-x-2">
                <select
                  v-model="filterStatus"
                  @change="filterChats"
                  class="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Chats</option>
                  <option value="active">Active</option>
                  <option value="urgent">Urgent</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="divide-y max-h-96 overflow-y-auto">
            <div
              v-for="chat in filteredChats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="[
                'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                selectedChatId === chat.id ? 'bg-blue-50 border-r-4 border-primary' : '',
                chat.isUrgent ? 'border-l-4 border-red-500' : ''
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1 min-w-0">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-gray-600 text-sm font-medium">
                        {{ chat.customerName ? chat.customerName.charAt(0) : 'U' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <p class="font-medium text-gray-900 truncate">
                        {{ chat.customerName || 'Customer' }}
                      </p>
                      <span v-if="chat.isUrgent" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Urgent
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 truncate">
                      Driver: {{ chat.driverName || 'Unassigned' }}
                    </p>
                    <p class="text-sm text-gray-600 truncate">
                      Order #{{ chat.orderId }}
                    </p>
                    <p class="text-xs text-gray-500 truncate mt-1">
                      {{ chat.lastMessage }}
                    </p>
                  </div>
                </div>
                <div class="text-right flex-shrink-0 ml-2">
                  <p class="text-xs text-gray-500">{{ formatChatTime(chat.lastMessageAt) }}</p>
                  <div class="flex items-center justify-end mt-1 space-x-1">
                    <div v-if="getTotalUnreadCount(chat) > 0" class="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                      {{ getTotalUnreadCount(chat) }}
                    </div>
                    <div :class="[
                      'w-2 h-2 rounded-full',
                      getActivityStatus(chat) === 'active' ? 'bg-green-500' : 
                      getActivityStatus(chat) === 'recent' ? 'bg-yellow-500' : 'bg-gray-400'
                    ]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="filteredChats.length === 0" class="p-8 text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p class="text-gray-600">No conversations found</p>
              <p class="text-sm text-gray-500 mt-1">Chats will appear here when users and drivers communicate</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Viewer -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border">
          <div v-if="selectedChat" class="h-96">
            <!-- Chat Header -->
            <div class="p-4 border-b bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">
                      {{ selectedChat.customerName ? selectedChat.customerName.charAt(0) : 'U' }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">
                      {{ selectedChat.customerName || 'Customer' }} ↔ {{ selectedChat.driverName || 'Driver' }}
                    </h3>
                    <p class="text-sm text-gray-600">Order #{{ selectedChat.orderId }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="markAsUrgent(selectedChat)"
                    :class="[
                      'px-3 py-1 text-sm rounded-lg border',
                      selectedChat.isUrgent 
                        ? 'bg-red-100 text-red-700 border-red-300' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ selectedChat.isUrgent ? 'Urgent' : 'Mark Urgent' }}
                  </button>
                  <button
                    @click="exportChat(selectedChat)"
                    class="px-3 py-1 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Display -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4 h-80" style="scroll-behavior: smooth;">
              <div v-for="message in selectedChatMessages" :key="message.id" class="flex" :class="getMessageAlignment(message)">
                <div class="max-w-xs lg:max-w-md">
                  <div :class="getMessageBubbleClass(message)" class="px-4 py-2 rounded-lg">
                    <!-- Sender Info -->
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-xs font-medium">
                        {{ getSenderName(message) }}
                      </span>
                      <span v-if="message.senderRole === 'bot'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Bot
                      </span>
                    </div>
                    
                    <!-- Deleted Message Indicator -->
                    <div v-if="message.deleted" class="mb-2 flex items-center space-x-2">
                      <span class="text-xs text-red-600 font-medium">[DELETED]</span>
                      <span class="text-xs text-gray-500">
                        Deleted at: {{ formatTime(message.deletedAt) }}
                      </span>
                    </div>
                    
                    <!-- Image Message - Show even if deleted (for admin monitoring) -->
                    <div v-if="message.messageType === 'image' && message.imageUrl" class="mb-2">
                      <div v-if="message.deleted" class="mb-1 flex items-center space-x-2">
                        <span class="text-xs text-red-600 font-medium">[DELETED PHOTO]</span>
                        <span class="text-xs text-gray-500">
                          Deleted by: {{ getSenderName(message) }}
                        </span>
                      </div>
                      <div :class="message.deleted ? 'opacity-50 border-2 border-red-300' : ''">
                        <img
                          :src="message.imageUrl"
                          :alt="message.deleted ? 'Deleted chat image' : 'Chat image'"
                          class="max-w-full h-auto rounded-lg cursor-pointer"
                          @click="openImagePreview(message.imageUrl)"
                        />
                      </div>
                    </div>
                    
                    <!-- Text Message (show original even if deleted) -->
                    <p v-if="message.message" :class="message.deleted ? 'text-sm line-through opacity-50' : 'text-sm'">
                      {{ message.message }}
                    </p>
                    
                    <div class="flex items-center justify-end mt-1">
                      <span class="text-xs" :class="message.senderRole === 'driver' ? 'text-white opacity-80' : 'text-gray-500'">
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Chat Selected -->
          <div v-else class="flex items-center justify-center h-96">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
              <p class="text-gray-600">Choose a chat from the left to monitor the conversation</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showImagePreview"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="closeImagePreview"
    >
      <div class="max-w-4xl max-h-[90vh] relative" @click.stop>
        <button
          @click="closeImagePreview"
          class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
        >
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="previewImageUrl"
          alt="Preview"
          class="max-w-full max-h-[90vh] rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { chatService } from '@/services/chatService'
import { db } from '@/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default {
  name: 'AdminChatMonitoring',
  data() {
    return {
      allChats: [],
      filteredChats: [],
      selectedChat: null,
      selectedChatId: null,
      selectedChatMessages: [],
      filterStatus: 'all',
      loading: true,
      showImagePreview: false,
      previewImageUrl: ''
    }
  },
  computed: {
    activeChats() {
      return this.allChats.filter(chat => this.getActivityStatus(chat) === 'active')
    },
    urgentChats() {
      return this.allChats.filter(chat => chat.isUrgent)
    }
  },
  async mounted() {
    await this.loadAllChats()
  },
  beforeUnmount() {
    chatService.unsubscribe('admin_all_chats')
    if (this.selectedChatId) {
      chatService.unsubscribe(`messages_${this.selectedChatId}`)
    }
  },
  methods: {
    async loadAllChats() {
      try {
        this.loading = true
        
        // Subscribe to all chats for admin monitoring
        chatService.subscribeToAllChats(async (chats) => {
          // Enhance chats with user and driver information
          const enhancedChats = await Promise.all(
            chats.map(async (chat) => {
              try {
                // Get customer info
                const customerDoc = await getDoc(doc(db, 'users', chat.userId))
                const customerData = customerDoc.exists() ? customerDoc.data() : {}
                
                // Get driver info
                let driverData = {}
                if (chat.driverId) {
                  const driverDoc = await getDoc(doc(db, 'users', chat.driverId))
                  driverData = driverDoc.exists() ? driverDoc.data() : {}
                }
                
                return {
                  ...chat,
                  customerName: customerData.firstName && customerData.lastName 
                    ? `${customerData.firstName} ${customerData.lastName}`
                    : 'Customer',
                  driverName: driverData.firstName && driverData.lastName 
                    ? `${driverData.firstName} ${driverData.lastName}`
                    : null,
                  isUrgent: chat.isUrgent || false
                }
              } catch (error) {
                console.error('Error loading chat participants:', error)
                return { ...chat, customerName: 'Customer', driverName: null }
              }
            })
          )
          
          this.allChats = enhancedChats
          this.filterChats()
        })
      } catch (error) {
        console.error('Error loading chats:', error)
      } finally {
        this.loading = false
      }
    },

    filterChats() {
      switch (this.filterStatus) {
        case 'active':
          this.filteredChats = this.allChats.filter(chat => this.getActivityStatus(chat) === 'active')
          break
        case 'urgent':
          this.filteredChats = this.allChats.filter(chat => chat.isUrgent)
          break
        case 'resolved':
          this.filteredChats = this.allChats.filter(chat => this.getActivityStatus(chat) === 'inactive')
          break
        default:
          this.filteredChats = [...this.allChats]
      }
    },

    async selectChat(chat) {
      this.selectedChat = chat
      this.selectedChatId = chat.id
      
      // Unsubscribe from previous chat messages
      if (this.selectedChatId) {
        chatService.unsubscribe(`messages_${this.selectedChatId}`)
      }
      
      // Subscribe to selected chat messages
      chatService.subscribeToMessages(chat.id, (messages) => {
        this.selectedChatMessages = messages
      })
    },

    async markAsUrgent(chat) {
      try {
        const chatRef = doc(db, 'chats', chat.id)
        const newUrgentStatus = !chat.isUrgent
        
        await updateDoc(chatRef, {
          isUrgent: newUrgentStatus,
          updatedAt: new Date()
        })
        
        // Update local state
        chat.isUrgent = newUrgentStatus
        
        this.$toast.success(
          newUrgentStatus ? 'Chat marked as urgent' : 'Chat unmarked as urgent'
        )
      } catch (error) {
        console.error('Error updating chat urgency:', error)
        this.$toast.error('Failed to update chat status')
      }
    },

    exportChat(chat) {
      // Export chat functionality
      const chatData = {
        chatId: chat.id,
        orderId: chat.orderId,
        customer: chat.customerName,
        driver: chat.driverName,
        messages: this.selectedChatMessages,
        exportedAt: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(chatData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `chat-${chat.orderId}-${Date.now()}.json`
      link.click()
      
      this.$toast.success('Chat exported successfully')
    },

    refreshChats() {
      this.loadAllChats()
      this.$toast.success('Chats refreshed')
    },

    getActivityStatus(chat) {
      if (!chat.lastMessageAt) return 'inactive'
      
      const now = new Date()
      const lastMessage = chat.lastMessageAt.toDate ? chat.lastMessageAt.toDate() : new Date(chat.lastMessageAt)
      const diffInMinutes = (now - lastMessage) / (1000 * 60)
      
      if (diffInMinutes < 5) return 'active'
      if (diffInMinutes < 30) return 'recent'
      return 'inactive'
    },

    getTotalUnreadCount(chat) {
      if (!chat.unreadCount) return 0
      return Object.values(chat.unreadCount).reduce((total, count) => total + count, 0)
    },

    getMessageAlignment(message) {
      return message.senderRole === 'user' ? 'justify-start' : 'justify-end'
    },

    getMessageBubbleClass(message) {
      if (message.senderRole === 'bot') {
        return 'bg-blue-50 text-blue-900 border border-blue-200'
      } else if (message.senderRole === 'user') {
        return 'bg-gray-100 text-gray-900'
      } else {
        return 'bg-primary text-white'
      }
    },

    getSenderName(message) {
      if (message.senderRole === 'bot') return 'BroomTech Bot'
      if (message.senderRole === 'user') return this.selectedChat?.customerName || 'Customer'
      if (message.senderRole === 'driver') return this.selectedChat?.driverName || 'Driver'
      return 'Unknown'
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
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },

    openImagePreview(imageUrl) {
      this.previewImageUrl = imageUrl
      this.showImagePreview = true
    },

    closeImagePreview() {
      this.showImagePreview = false
      this.previewImageUrl = ''
    }
  }
}
</script>
