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
              <h3 class="font-semibold text-sm">Booking Assistant</h3>
              <p class="text-xs opacity-90">I can help you book services</p>
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
            @click="sendQuickMessage('How do I book a food delivery?')"
            class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
          >
            🍔 Food Delivery
          </button>
          <button
            @click="sendQuickMessage('How do I book bill payments?')"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
          >
            💳 Bill Payments
          </button>
          <button
            @click="sendQuickMessage('How do I book grocery shopping?')"
            class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
          >
            🛒 Grocery Shopping
          </button>
          <button
            @click="sendQuickMessage('What services do you offer?')"
            class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors"
          >
            📋 All Services
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
                👋 Hi! I'm your booking assistant. I can help you:
              </p>
              <ul class="text-xs text-green-700 mt-2 ml-4 list-disc space-y-1">
                <li>Book food delivery, bill payments, grocery shopping, and more</li>
                <li>Understand how each service works</li>
                <li>Check pricing and delivery fees</li>
                <li>Navigate the booking process</li>
              </ul>
              <p class="text-sm text-green-800 mt-2">What would you like to book today?</p>
            </div>
            <p class="text-xs text-gray-500 mt-1">Booking Assistant • now</p>
          </div>
        </div>

        <!-- Chat Messages -->
        <div v-for="message in messages" :key="message.id" class="flex" :class="message.isUser ? 'justify-end' : 'justify-start'">
          <div class="max-w-xs">
            <div class="rounded-lg px-3 py-2 text-sm" :class="message.isUser ? 'bg-green-600 text-white' : 'bg-green-50 text-green-800 border border-green-200'">
              <p>{{ message.text }}</p>
            </div>
            <p class="text-xs text-gray-500 mt-1" :class="message.isUser ? 'text-right' : 'text-left'">
              {{ message.isUser ? 'You' : 'Assistant' }} • {{ formatTime(message.timestamp) }}
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
            <p class="text-xs text-gray-500 mt-1">Assistant is typing...</p>
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
      
      // Food Delivery
      if (message.includes('food') && (message.includes('delivery') || message.includes('book'))) {
        return "🍔 To book Food Delivery:\n1. Go to 'Book Service' → Select 'Food Delivery'\n2. Enter restaurant name and address (e.g., Jollibee, McDonald's)\n3. Enter delivery address and recipient details\n4. Add food order details and special instructions\n5. Review the route on the map and estimated delivery fee\n6. Submit your booking!\n\n💡 Tip: Make sure both addresses are within Calapan City!"
      }
      
      // Bill Payments
      if (message.includes('bill') && (message.includes('payment') || message.includes('pay'))) {
        return "💳 To book Bill Payments:\n1. Go to 'Book Service' → Select 'Bill Payments'\n2. Enter biller name (e.g., MERALCO, GLOBE, PLDT)\n3. Fill in account name, account number, and amount\n4. Upload receipt/reference (required)\n5. Enter pickup and return addresses\n6. Review and submit!\n\n📋 Note: Receipt upload is required for bill payment services."
      }
      
      // Grocery Shopping
      if (message.includes('grocery') || (message.includes('shopping') && message.includes('book'))) {
        return "🛒 To book Grocery Shopping:\n1. Go to 'Book Service' → Select 'Grocery Shopping'\n2. Enter your shopping list\n3. Select store preference (optional)\n4. Enter delivery address\n5. Add preferred delivery time (optional)\n6. Review estimated fee and submit!\n\n💡 Our driver will shop for you and deliver to your address."
      }
      
      // Gift Delivery
      if (message.includes('gift') || (message.includes('delivery') && message.includes('gift'))) {
        return "🎁 To book Gift Delivery:\n1. Go to 'Book Service' → Select 'Gift Delivery'\n2. Enter gift type (e.g., Flowers, Cake, Jewelry)\n3. Enter recipient name and contact\n4. Enter store name and address (where to buy)\n5. Enter delivery address\n6. Select preferred date & time\n7. Review and submit!\n\n💝 Perfect for birthdays, anniversaries, and special occasions!"
      }
      
      // Medicine Delivery
      if (message.includes('medicine') || message.includes('prescription')) {
        return "💊 To book Medicine Delivery:\n1. Go to 'Book Service' → Select 'Medicine Delivery'\n2. Enter medicine names\n3. Upload prescription (if required)\n4. Enter quantity needed\n5. Enter delivery address\n6. Review and submit!\n\n⚠️ Important: Please ensure prescription is valid and medicines are available."
      }
      
      // Pickup & Drop
      if (message.includes('pickup') || message.includes('drop') || message.includes('pick-up')) {
        return "📦 To book Pickup & Drop:\n1. Go to 'Book Service' → Select 'Pickup & Drop'\n2. Enter pickup address and contact\n3. Enter item description and type\n4. Enter dropoff address\n5. Select preferred pickup date & time\n6. Review route and estimated fee\n7. Submit your booking!\n\n🚗 Great for sending packages, documents, or items within Calapan City!"
      }
      
      // All Services
      if (message.includes('service') && (message.includes('all') || message.includes('offer') || message.includes('available'))) {
        return "📋 We offer these services:\n\n🍔 Food Delivery - Order from restaurants\n💳 Bill Payments - Pay bills and get receipts\n🛒 Grocery Shopping - Shop for you and deliver\n🎁 Gift Delivery - Send gifts to loved ones\n💊 Medicine Delivery - Get medicines delivered\n📦 Pickup & Drop - Send packages and items\n\nAll services are available within Calapan City only. Go to 'Book Service' to get started!"
      }
      
      // Pricing
      if (message.includes('price') || message.includes('rate') || message.includes('cost') || message.includes('fee')) {
        return "💰 Delivery Fee Structure:\n\n• Base Charge (First 3km): ₱10\n• Distance Fee (After 3km): ₱2 per km\n• Bad Weather Surcharge: May apply during heavy rain\n\n💡 The exact fee is calculated based on your route and shown before booking. You can see the estimated delivery fee on the map after entering addresses!"
      }
      
      // How to book / booking process
      if (message.includes('how') && (message.includes('book') || message.includes('order'))) {
        return "📝 General Booking Steps:\n\n1. Go to 'Book Service' in your dashboard\n2. Select the service type you need\n3. Fill in all required fields (marked with *)\n4. Enter addresses - make sure they're within Calapan City\n5. Review the map route and estimated delivery fee\n6. Choose payment method (COD, GCash, etc.)\n7. Submit your booking!\n\n✅ You'll receive a confirmation and can track your order in 'My Orders'."
      }
      
      // Address / Location
      if (message.includes('address') || message.includes('location') || message.includes('calapan')) {
        return "📍 Important Location Info:\n\n• All services are available ONLY within Calapan City\n• When entering addresses, make sure they're in Calapan City, Oriental Mindoro\n• The map will show if your address is valid\n• You can use 'Use Current Location' button if you're in Calapan City\n• Addresses outside Calapan City cannot be booked"
      }
      
      // Payment methods
      if (message.includes('payment') || message.includes('pay') || message.includes('method')) {
        return "💳 Payment Methods Available:\n\n• Cash on Delivery (COD) - Pay when service is completed\n• GCash - Digital payment via GCash\n• Other digital wallets\n\n💡 Payment method is selected during booking. COD is available for most services!"
      }
      
      // Order status / tracking
      if (message.includes('order') && (message.includes('status') || message.includes('track'))) {
        return "📦 To check your order status:\n\n1. Go to 'My Orders' in your dashboard\n2. You'll see all your orders with their current status\n3. Statuses include: Pending, Confirmed, In Transit, On The Way, Delivered, Cancelled\n4. Click on an order to see full details\n5. You can chat with your driver, cancel (within 30 seconds), or give feedback\n\n💬 You can also contact your assigned driver directly!"
      }
      
      // Default responses
      const defaultResponses = [
        "I'm here to help you book services! What would you like to book? You can ask about:\n• Food Delivery\n• Bill Payments\n• Grocery Shopping\n• Gift Delivery\n• Medicine Delivery\n• Pickup & Drop",
        "Need help booking a service? Just tell me which service you're interested in, and I'll guide you through the process!",
        "I can help you with booking any of our services. What would you like to know more about?"
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
