<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b bg-gray-50">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">
            {{ chatPartner?.role === 'driver' ? 'D' : chatPartner?.role === 'user' ? 'U' : 'S' }}
          </span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">
            {{ getPartnerDisplayName() }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ getPartnerRole() }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <div :class="[
          'w-3 h-3 rounded-full',
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        ]"></div>
        <span class="text-sm text-gray-600">{{ isOnline ? 'Online' : 'Offline' }}</span>
      </div>
    </div>

    <!-- Messages Container -->
    <div 
      ref="messagesContainer" 
      class="flex-1 overflow-y-auto p-4 space-y-4"
      @scroll="handleScroll"
    >
      <div v-if="loading" class="flex justify-center py-4">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>

      <!-- Messages -->
      <div v-for="message in messages" :key="message.id" class="flex" :class="getMessageAlignment(message)">
        <div class="max-w-xs lg:max-w-md">
          <!-- Message Bubble -->
          <div :class="getMessageBubbleClass(message)" class="px-4 py-2 rounded-lg">
            <!-- Bot/System Message Icon -->
            <div v-if="message.senderRole === 'bot'" class="flex items-center space-x-2 mb-2">
              <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
              </div>
              <span class="text-xs text-blue-600 font-medium">BroomTech Bot</span>
            </div>

            <p class="text-sm">{{ message.message }}</p>
            
            <!-- Message Status -->
            <div class="flex items-center justify-end mt-1 space-x-1">
              <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
              <div v-if="message.senderId === currentUserId" class="flex">
                <svg v-if="message.read" class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex">
        <div class="max-w-xs lg:max-w-md">
          <div class="bg-gray-100 px-4 py-2 rounded-lg">
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="p-4 border-t bg-gray-50">
      <div class="flex items-center space-x-2">
        <div class="flex-1">
          <input
            v-model="newMessage"
            @keypress.enter="sendMessage"
            @input="handleTyping"
            type="text"
            placeholder="Type your message..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || sending"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="sending" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
      
      <!-- Quick Actions for different user types -->
      <div v-if="!isDriver" class="flex flex-wrap gap-2 mt-3">
        <button
          v-for="quickAction in quickActions"
          :key="quickAction.text"
          @click="sendQuickMessage(quickAction.text)"
          class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          {{ quickAction.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { chatService } from '@/services/chatService'
import { chatbotService } from '@/services/chatbotService'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ChatWindow',
  props: {
    chatId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    chatPartner: {
      type: Object,
      default: () => ({})
    },
    isDriver: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      loading: false,
      sending: false,
      isTyping: false,
      isOnline: true,
      typingTimeout: null,
      quickActions: [
        { text: 'Where is my driver?' },
        { text: 'How much will this cost?' },
        { text: 'When will you arrive?' },
        { text: 'I need help' }
      ]
    }
  },
  computed: {
    currentUserId() {
      return this.authStore.user?.uid
    }
  },
  async mounted() {
    await this.initializeChat()
    this.subscribeToMessages()
    this.markMessagesAsRead()
  },
  beforeUnmount() {
    chatService.unsubscribe(`messages_${this.chatId}`)
  },
  methods: {
    async initializeChat() {
      this.loading = true
      try {
        // Send welcome bot message if this is a new chat and user is not a driver
        if (this.messages.length === 0 && !this.isDriver) {
          await chatService.sendBotMessage(
            this.chatId,
            "Hello! I'm your BroomTech assistant. I can help you with order updates, driver information, and general questions. Your driver will also be available to chat with you directly."
          )
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      } finally {
        this.loading = false
      }
    },

    subscribeToMessages() {
      chatService.subscribeToMessages(this.chatId, (messages) => {
        this.messages = messages
        this.$nextTick(() => {
          this.scrollToBottom()
        })
        
        // Auto-respond with bot for certain messages (only for user messages, not driver)
        if (!this.isDriver) {
          const lastMessage = messages[messages.length - 1]
          if (lastMessage && lastMessage.senderId === this.currentUserId && lastMessage.senderRole === 'user') {
            this.handleBotResponse(lastMessage.message)
          }
        }
      })
    },

    async handleBotResponse(userMessage) {
      // Check if message needs bot response
      if (chatbotService.needsHumanIntervention(userMessage)) {
        setTimeout(async () => {
          await chatService.sendBotMessage(
            this.chatId,
            "I understand this is important. I'm notifying your driver and our support team to assist you right away."
          )
        }, 1000)
        return
      }

      // Generate contextual bot response
      const orderData = { id: this.orderId, status: 'confirmed' } // This should come from props or API
      const botResponse = chatbotService.generateContextualResponse(userMessage, orderData)
      
      // Send bot response after a short delay to simulate typing
      setTimeout(async () => {
        await chatService.sendBotMessage(this.chatId, botResponse)
      }, 1500)
    },

    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return

      this.sending = true
      try {
        const senderRole = this.isDriver ? 'driver' : 'user'
        await chatService.sendMessage(
          this.chatId,
          this.currentUserId,
          senderRole,
          this.newMessage.trim()
        )
        this.newMessage = ''
      } catch (error) {
        console.error('Error sending message:', error)
        this.$toast.error('Failed to send message')
      } finally {
        this.sending = false
      }
    },

    async sendQuickMessage(message) {
      this.newMessage = message
      await this.sendMessage()
    },

    async markMessagesAsRead() {
      try {
        await chatService.markMessagesAsRead(this.chatId, this.currentUserId)
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    },

    handleTyping() {
      // Clear existing timeout
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout)
      }

      // Set typing indicator (in a real app, you'd send this to other participants)
      this.typingTimeout = setTimeout(() => {
        // Stop typing indicator
      }, 1000)
    },

    handleScroll() {
      // Handle scroll events (for loading more messages, etc.)
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    getMessageAlignment(message) {
      return message.senderId === this.currentUserId ? 'justify-end' : 'justify-start'
    },

    getMessageBubbleClass(message) {
      if (message.senderRole === 'bot') {
        return 'bg-blue-50 text-blue-900 border border-blue-200'
      } else if (message.senderId === this.currentUserId) {
        return 'bg-primary text-white'
      } else {
        return 'bg-gray-100 text-gray-900'
      }
    },

    getPartnerDisplayName() {
      if (this.chatPartner?.name) {
        return this.chatPartner.name
      }
      return this.isDriver ? 'Customer' : 'BroomTech Support'
    },

    getPartnerRole() {
      if (this.isDriver) {
        return 'Customer'
      }
      return this.chatPartner?.role === 'driver' ? 'Your Driver' : 'Customer Support'
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>
