<template>
  <!-- Floating Chatbot Widget -->
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Toggle Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center group"
    >
      <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <!-- Notification Badge -->
      <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <span class="text-xs text-white font-bold">!</span>
      </div>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="w-80 h-96 bg-white rounded-lg shadow-2xl border overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
    >
      <!-- Header -->
      <div class="p-4 bg-green-600 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-sm">BroomBot</h3>
              <p class="text-xs opacity-90">Online now</p>
            </div>
          </div>
          <button @click="toggleChat" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="p-3 bg-gray-50 border-b">
        <div class="flex flex-wrap gap-2">
          <button
            @click="sendQuickMessage('Check my order status')"
            class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
          >
            📦 Order Status
          </button>
          <button
            @click="sendQuickMessage('I need help booking a service')"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
          >
            📅 Book Service
          </button>
          <button
            @click="sendQuickMessage('What are your service rates?')"
            class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
          >
            💰 Pricing
          </button>
          <button
            @click="sendQuickMessage('I need technical support')"
            class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors"
          >
            🛠️ Support
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 h-64 overflow-y-auto p-3 space-y-3" ref="messagesContainer">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="flex justify-start">
          <div class="max-w-xs">
            <div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <p class="text-sm text-green-800">
                👋 Hi! I'm BroomBot, your BroomTech assistant. How can I help you today?
              </p>
            </div>
            <p class="text-xs text-gray-500 mt-1">BroomBot • now</p>
          </div>
        </div>

        <!-- Chat Messages -->
        <div v-for="message in messages" :key="message.id" class="flex" :class="message.isUser ? 'justify-end' : 'justify-start'">
          <div class="max-w-xs">
            <div class="rounded-lg px-3 py-2 text-sm" :class="message.isUser ? 'bg-green-600 text-white' : 'bg-green-50 text-green-800 border border-green-200'">
              <p>{{ message.text }}</p>
            </div>
            <p class="text-xs text-gray-500 mt-1" :class="message.isUser ? 'text-right' : 'text-left'">
              {{ message.isUser ? 'You' : 'BroomBot' }} • {{ formatTime(message.timestamp) }}
            </p>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="max-w-xs">
            <div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">BroomBot is typing...</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t p-3">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            @keypress.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            class="flex-1 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :disabled="isTyping"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || isTyping"
            class="w-8 h-8 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingChatbot',
  data() {
    return {
      isOpen: false,
      messages: [],
      newMessage: '',
      isTyping: false
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
    },

    sendQuickMessage(message) {
      this.newMessage = message
      this.sendMessage()
    },

    async sendMessage() {
      if (!this.newMessage.trim()) return

      const userMessage = {
        id: Date.now(),
        text: this.newMessage,
        isUser: true,
        timestamp: new Date()
      }

      this.messages.push(userMessage)
      const messageText = this.newMessage
      this.newMessage = ''
      this.scrollToBottom()

      // Simulate bot typing
      this.isTyping = true
      
      // Simulate API call delay
      setTimeout(() => {
        const botResponse = this.generateBotResponse(messageText)
        this.messages.push({
          id: Date.now() + 1,
          text: botResponse,
          isUser: false,
          timestamp: new Date()
        })
        this.isTyping = false
        this.scrollToBottom()
      }, 1500)
    },

    generateBotResponse(userMessage) {
      const message = userMessage.toLowerCase()
      
      if (message.includes('order') && message.includes('status')) {
        return "I can help you check your order status! Please provide your order number, or you can view all your orders in the 'My Orders' section of your dashboard."
      }
      
      if (message.includes('help') || message.includes('support') || message.includes('technical')) {
        return "I'm here to help! For technical support, you can contact our team at support@broomtech.com or call us at (02) 8123-4567. Our support hours are 8AM-8PM daily."
      }
      
      if (message.includes('price') || message.includes('rate') || message.includes('cost') || message.includes('pricing')) {
        return "Our BroomTech service rates: Basic cleaning starts at ₱500, Deep cleaning at ₱800, Premium service at ₱1,200. Rates may vary by location and service complexity."
      }
      
      if (message.includes('book') || message.includes('schedule') || message.includes('service')) {
        return "You can book a BroomTech service by going to 'Book Service' in your dashboard. Choose your service type, select date & time, and confirm your booking!"
      }

      if (message.includes('driver') || message.includes('cleaner')) {
        return "Our professional cleaners are background-checked and trained. You can track your assigned cleaner and communicate through the app once your booking is confirmed."
      }

      if (message.includes('payment') || message.includes('pay')) {
        return "We accept various payment methods: GCash, PayMaya, Credit/Debit cards, and Cash on Delivery. Payment is processed securely through our platform."
      }

      if (message.includes('cancel') || message.includes('reschedule')) {
        return "You can cancel or reschedule your booking up to 2 hours before the scheduled time through your 'My Orders' section. Cancellation fees may apply for last-minute changes."
      }
      
      // Default responses
      const defaultResponses = [
        "Thank you for contacting BroomTech! How can I assist you with your cleaning services today?",
        "I'm here to help with your BroomTech needs! Could you please provide more details about what you need assistance with?",
        "That's a great question! Let me help you find the information you need about our cleaning services."
      ]
      
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    },

    formatTime(timestamp) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    }
  }
}
</script>

<style scoped>
@keyframes slide-in-from-bottom-4 {
  from {
    transform: translateY(1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-in {
  animation-fill-mode: both;
}

.slide-in-from-bottom-4 {
  animation-name: slide-in-from-bottom-4;
}
</style>
