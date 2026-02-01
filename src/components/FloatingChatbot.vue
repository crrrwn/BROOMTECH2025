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
        <div class="px-4 py-3.5 flex-shrink-0 relative overflow-hidden" style="background: linear-gradient(135deg, #00C851, #3ED400);">
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-sm tracking-wide leading-tight">BroooomBot</h3>
                <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="w-2 h-2 rounded-full bg-[#A8EB12] animate-pulse shadow-sm shadow-[#A8EB12]/50"></span>
                    <p class="text-[10px] text-green-50 font-semibold">Online</p>
                </div>
              </div>
            </div>
            <button 
                @click="toggleChat" 
                class="text-white/90 hover:text-white hover:bg-white/25 rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar relative text-sm">
          
          <div v-if="!selectedTopic" class="p-4 h-full flex flex-col">
            <div class="mb-4 text-center pt-1">
              <p class="text-gray-800 font-bold text-sm mb-1">How can we help?</p>
              <p class="text-[11px] text-gray-500 font-medium">Select a topic below</p>
            </div>

            <div class="space-y-2.5 flex-1">
              <button
                @click="selectTopic('Order Status')"
                class="group w-full p-3.5 bg-white border-2 border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#3ED400] hover:-translate-y-0.5 transition-all duration-300 text-left flex items-center justify-between active:scale-[0.98]"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#A8EB12]/20 to-[#3ED400]/10 text-[#00C851] group-hover:from-[#3ED400] group-hover:to-[#00C851] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                     </svg>
                  </div>
                  <div>
                      <span class="block font-bold text-gray-800 text-xs group-hover:text-[#00C851] transition-colors">Order Status</span>
                      <span class="text-[10px] text-gray-500 font-medium">Track delivery</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                @click="selectTopic('Book Service')"
                class="group w-full p-3.5 bg-white border-2 border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#3ED400] hover:-translate-y-0.5 transition-all duration-300 text-left flex items-center justify-between active:scale-[0.98]"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#A8EB12]/20 to-[#3ED400]/10 text-[#00C851] group-hover:from-[#3ED400] group-hover:to-[#00C851] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div>
                      <span class="block font-bold text-gray-800 text-xs group-hover:text-[#00C851] transition-colors">Book Service</span>
                      <span class="text-[10px] text-gray-500 font-medium">New booking</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                @click="selectTopic('Pricing')"
                class="group w-full p-3.5 bg-white border-2 border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#3ED400] hover:-translate-y-0.5 transition-all duration-300 text-left flex items-center justify-between active:scale-[0.98]"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#A8EB12]/20 to-[#3ED400]/10 text-[#00C851] group-hover:from-[#3ED400] group-hover:to-[#00C851] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <span class="text-lg font-bold">₱</span>
                  </div>
                  <div>
                      <span class="block font-bold text-gray-800 text-xs group-hover:text-[#00C851] transition-colors">Pricing</span>
                      <span class="text-[10px] text-gray-500 font-medium">Fees & charges</span>
                  </div>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-[#3ED400] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <div class="mt-auto text-center pt-3 border-t border-gray-100">
                <p class="text-[9px] text-gray-400 font-medium">Powered by BroomBot</p>
            </div>
          </div>

          <div v-else class="flex flex-col h-full bg-white">
            <div class="px-4 py-2.5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center sticky top-0 z-10 shadow-sm">
                <button
                @click="goBack"
                class="flex items-center text-xs font-semibold text-gray-600 hover:text-[#00C851] transition-all duration-200 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-sm active:scale-95"
                >
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back
                </button>
            </div>

            <div class="p-4 overflow-y-auto">
                <div class="flex gap-3 mb-2">
                    <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-md mt-0.5" style="background: linear-gradient(135deg, #3ED400, #00C851);">
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                       </svg>
                    </div>
                    <div class="flex flex-col space-y-1 max-w-[90%]">
                        <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl rounded-tl-none px-4 py-3 text-xs text-gray-700 shadow-md border border-gray-200/50">
                             <h4 class="font-bold text-[#00C851] mb-2 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <span class="text-sm">
                                  <svg v-if="selectedTopic === 'Order Status'" class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                  </svg>
                                  <svg v-else-if="selectedTopic === 'Book Service'" class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                  </svg>
                                  <span v-else-if="selectedTopic === 'Pricing'" class="text-base font-bold">₱</span>
                                </span>
                                <span class="text-sm">{{ selectedTopic }}</span>
                            </h4>
                            <div class="whitespace-pre-line leading-relaxed text-gray-700 text-[11px] sm:text-xs font-medium">
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

Tips:
• Fees calculated by distance
• Extra fees for hilltop/high floors`,

        'Pricing': `Delivery Fees:

• Base (First 3km): ₱54
• Distance Fee: ₱15/km after 3km
• Bad Weather: +₱10

Extra Fees:
• Hilltop/Loob: ₱10
• High Floor (5th+): ₱20
• Box/Package: ₱10
• Bulk Food (30+): ₱50`
      }
      return content[topic] || 'Content not available.'
    }
  }
}
</script>

<style scoped>
/* Custom Scrollbar for sleek look */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3ED400, #00C851);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #00C851, #3ED400);
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