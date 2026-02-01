<template>
  <div class="fixed bottom-4 right-4 z-[9999] font-sans antialiased">

    <transition name="scale-fade">
      <button
        v-if="!isOpen"
        @click="toggleChat"
        class="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg shadow-[#3ED400]/30 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
        style="background: linear-gradient(135deg, #3ED400, #00C851);"
      >
        <span class="absolute inline-flex h-full w-full rounded-full bg-[#74E600] opacity-75 animate-ping group-hover:animate-none"></span>
        
        <svg class="relative w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </button>
    </transition>

    <transition name="slide-up">
      <div
        v-if="isOpen"
        class="flex flex-col overflow-hidden bg-white shadow-2xl border border-gray-100 rounded-xl
               w-[calc(100vw-2rem)] sm:w-[320px] 
               h-[450px] sm:h-[480px] max-h-[80vh]"
      >
        <div class="px-4 py-3 flex-shrink-0 relative overflow-hidden" style="background: linear-gradient(135deg, #00C851, #3ED400);">
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-sm tracking-wide leading-tight">BroomBot</h3>
                <div class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#A8EB12] animate-pulse"></span>
                    <p class="text-[10px] text-green-50 font-medium">Online</p>
                </div>
              </div>
            </div>
            <button 
                @click="toggleChat" 
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar relative text-sm">
          
          <div v-if="!selectedTopic" class="p-3 h-full flex flex-col">
            <div class="mb-3 text-center pt-2">
              <p class="text-gray-800 font-semibold text-sm">How can we help?</p>
              <p class="text-[11px] text-gray-500">Select a topic below</p>
            </div>

            <div class="space-y-2">
              <button
                @click="selectTopic('Order Status')"
                class="group w-full p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow hover:border-[#3ED400] transition-all duration-200 text-left flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-md flex items-center justify-center bg-[#A8EB12]/20 text-[#00C851] group-hover:bg-[#3ED400] group-hover:text-white transition-colors text-sm">
                     <span>📦</span>
                  </div>
                  <div>
                      <span class="block font-semibold text-gray-700 text-xs group-hover:text-[#00C851] transition-colors">Order Status</span>
                      <span class="text-[10px] text-gray-400">Track delivery</span>
                  </div>
                </div>
                <svg class="w-3 h-3 text-gray-300 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                @click="selectTopic('Book Service')"
                class="group w-full p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow hover:border-[#3ED400] transition-all duration-200 text-left flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-md flex items-center justify-center bg-[#A8EB12]/20 text-[#00C851] group-hover:bg-[#3ED400] group-hover:text-white transition-colors text-sm">
                    <span>📝</span>
                  </div>
                  <div>
                      <span class="block font-semibold text-gray-700 text-xs group-hover:text-[#00C851] transition-colors">Book Service</span>
                      <span class="text-[10px] text-gray-400">New booking</span>
                  </div>
                </div>
                <svg class="w-3 h-3 text-gray-300 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                @click="selectTopic('Pricing')"
                class="group w-full p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow hover:border-[#3ED400] transition-all duration-200 text-left flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-md flex items-center justify-center bg-[#A8EB12]/20 text-[#00C851] group-hover:bg-[#3ED400] group-hover:text-white transition-colors text-sm">
                    <span>💰</span>
                  </div>
                  <div>
                      <span class="block font-semibold text-gray-700 text-xs group-hover:text-[#00C851] transition-colors">Pricing</span>
                      <span class="text-[10px] text-gray-400">Fees & charges</span>
                  </div>
                </div>
                <svg class="w-3 h-3 text-gray-300 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <div class="mt-auto text-center pt-2">
                <p class="text-[9px] text-gray-400">Powered by BroomBot</p>
            </div>
          </div>

          <div v-else class="flex flex-col h-full bg-white">
            <div class="px-3 py-2 border-b border-gray-100 bg-gray-50 flex items-center sticky top-0 z-10">
                <button
                @click="goBack"
                class="flex items-center text-xs font-medium text-gray-500 hover:text-[#00C851] transition-colors px-1 py-1 rounded hover:bg-white"
                >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back
                </button>
            </div>

            <div class="p-3 overflow-y-auto">
                <div class="flex gap-2 mb-2">
                    <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] shadow-sm mt-1" style="background: #3ED400;">
                       🤖
                    </div>
                    <div class="flex flex-col space-y-1 max-w-[95%]">
                        <div class="bg-gray-100 rounded-xl rounded-tl-none px-3 py-2 text-xs text-gray-700 shadow-sm border border-gray-200">
                             <h4 class="font-bold text-[#00C851] mb-1.5 flex items-center gap-1.5 border-b border-gray-200 pb-1.5">
                                <span class="text-sm">{{ getTopicIcon(selectedTopic) }}</span>
                                <span>{{ selectedTopic }}</span>
                            </h4>
                            <div class="whitespace-pre-line leading-relaxed text-gray-600 text-[11px] sm:text-xs">
                                {{ getTopicContent(selectedTopic) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// Logic remains unchanged
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
   • Confirmed - Order confirmed
   • Driver Assigned - Driver assigned
   • In Transit - Driver heading to pickup
   • On The Way - Delivering to you
   • Delivered - Success
   • Cancelled - Order cancelled

4. Click on an order to see full details including:
   • Order info & service type
   • Pickup/Delivery addresses
   • Driver info & Tracking map
   • Payment details

5. Features:
   • Chat with driver
   • Cancel (within 30s)
   • Real-time tracking`,

        'Book Service': `How to Book:

1. Go to 'Book Service' in dashboard
2. Select service:
   • Food, Bills, Grocery, Gift, Medicine, Pick-up & Drop

3. Fill required fields (*)
4. Enter addresses (Calapan City only)
5. Review map & fees
6. Choose payment:
   • COD or GCash
7. Submit!

💡 Tips:
• Fees calculated by distance
• Extra fees for hilltop/high floors`,

        'Pricing': `💰 Delivery Fees:

• Base (First 3km): ₱54
• Distance Fee: ₱15/km after 3km
• Bad Weather: +₱10

📍 Extra Fees:
• Hilltop/Loob: ₱10
• High Floor (5th+): ₱20
• Box/Package: ₱10
• Bulk Food (30+): ₱50

Example (5km):
₱54 (Base) + ₱30 (2km x ₱15) = ₱84`
      }
      return content[topic] || 'Content not available.'
    }
  }
}
</script>

<style scoped>
/* Custom Scrollbar for sleek look */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Updated Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(15px) scale(0.95);
  opacity: 0;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.2s ease;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>