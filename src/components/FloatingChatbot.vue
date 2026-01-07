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
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="w-80 h-[500px] bg-white rounded-lg shadow-2xl border overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300"
    >
      <!-- Header -->
      <div class="p-4 bg-green-600 text-white flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-sm">BroomBot</h3>
              <p class="text-xs opacity-90">Automated FAQ Assistant</p>
            </div>
          </div>
          <button @click="toggleChat" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto">
        <!-- Topic Selection View -->
        <div v-if="!selectedTopic" class="p-4">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-1">Hi! I'm BroomBot, your automated FAQ assistant.</p>
            <p class="text-xs text-gray-500">Select a topic to get instant answers:</p>
          </div>
          <div class="flex flex-col gap-2">
            <button
              @click="selectTopic('Order Status')"
              class="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors font-medium text-left flex items-center justify-between"
            >
              <span class="flex items-center gap-2">
                <span>📦</span>
                <span>Order Status</span>
              </span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button
              @click="selectTopic('Book Service')"
              class="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors font-medium text-left flex items-center justify-between"
            >
              <span class="flex items-center gap-2">
                <span>📝</span>
                <span>Book Service</span>
              </span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            <button
              @click="selectTopic('Pricing')"
              class="w-full px-4 py-3 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors font-medium text-left flex items-center justify-between"
            >
              <span class="flex items-center gap-2">
                <span>💰</span>
                <span>Pricing</span>
              </span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- FAQ Content View -->
        <div v-else class="p-4">
          <button
            @click="goBack"
            class="mb-3 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Topics
          </button>
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>{{ getTopicIcon(selectedTopic) }}</span>
              <span>{{ selectedTopic }}</span>
            </h4>
            <div class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {{ getTopicContent(selectedTopic) }}
            </div>
          </div>
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
      selectedTopic: null
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      // Reset selected topic when closing
      if (!this.isOpen) {
        this.selectedTopic = null
      }
    },

    selectTopic(topic) {
      this.selectedTopic = topic
    },

    goBack() {
      this.selectedTopic = null
    },

    getTopicIcon(topic) {
      const icons = {
        'Order Status': '📦',
        'Book Service': '📝',
        'Pricing': '💰'
      }
      return icons[topic] || '📋'
    },

    getTopicContent(topic) {
      const content = {
        'Order Status': `To check your order status:

1. Go to 'My Orders' in your dashboard
2. You'll see all your orders with their current status
3. Statuses include:
   • Pending - Waiting for driver assignment
   • Confirmed - Order confirmed, waiting for driver
   • Driver Assigned - A driver has been assigned to your order
   • In Transit - Driver is on the way to pickup location
   • On The Way - Driver is delivering to your address
   • Delivered - Order completed successfully
   • Cancelled - Order was cancelled

4. Click on an order to see full details including:
   • Order information and service type
   • Pickup and delivery addresses
   • Driver information (when assigned)
   • Real-time tracking map
   • Payment details

5. Features available:
   • Chat with your assigned driver
   • Cancel order (within 30 seconds of booking)
   • Track delivery in real-time
   • Give feedback after delivery

💬 You can contact your assigned driver directly through the chat feature for updates or special instructions!`,

        'Book Service': `How to Book a Service:

📝 General Booking Steps:

1. Go to 'Book Service' in your dashboard
2. Select the service type you need:
   • Food Delivery - Restaurant orders and food delivery
   • Bill Payments - Pay your bills and get receipts delivered
   • Grocery Shopping - Fresh groceries delivered to your door
   • Gift Delivery - Special gifts delivered with care
   • Medicine Delivery - Prescription and over-the-counter medicines
   • Pick-up & Drop - Pick up and deliver items between locations

3. Fill in all required fields (marked with *)
4. Enter addresses - make sure they're within Calapan City, Oriental Mindoro
5. Review the map route and estimated delivery fee
6. Choose payment method:
   • Cash on Delivery (COD)
   • GCash (with additional charges based on amount)
7. Submit your booking!

✅ You'll receive a confirmation and can track your order in 'My Orders'.

💡 Tips:
• Make sure all addresses are within Calapan City, Oriental Mindoro
• The delivery fee is calculated automatically based on distance and location
• Additional fees may apply for hilltop areas, high floors, or special locations
• You can see the exact fee breakdown before confirming your booking`,

        'Pricing': `💰 Delivery Fee Structure:

• Base Charge (First 3km): ₱54
• Distance Fee (After 3km): ₱15 per additional kilometer
• Bad Weather Surcharge: ₱10 (applies during heavy rain/storm)

📍 Additional Fees (Auto-detected):
• Hilltop Areas (Xevera, Greenhills, etc.): ₱10
• Loob/Lakad Areas (Hospitals, Schools, etc.): ₱10
• High Floor (5th floor and above): ₱20
• Box/Package Delivery: ₱10
• Bulk Food Orders (30+ items): ₱50

💡 The exact fee is calculated based on your route and shown before booking. You can see the estimated delivery fee on the map after entering addresses!

📊 Example:
• 2km distance: ₱54 (base charge)
• 5km distance: ₱54 (base) + ₱30 (2km × ₱15) = ₱84
• 10km distance: ₱54 (base) + ₱105 (7km × ₱15) = ₱159

💳 Payment Methods:
• Cash on Delivery (COD)
• GCash (with additional charges based on amount)

All fees are displayed transparently before you confirm your booking.`
      }
      return content[topic] || 'Content not available.'
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
