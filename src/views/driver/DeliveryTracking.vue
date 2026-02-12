<template>
  <div
    class="h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#A8EB12] via-[#74E600] to-[#00C851]"
  >
    
    <div class="flex-1 relative z-0" id="deliveryMap">
      <button
        @click="toggleFullscreen"
        class="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl hover:bg-white text-gray-700 hover:text-[#008a3a] transition-all transform hover:scale-105 border border-white/60"
        title="Toggle Fullscreen"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
      
      <div class="w-full h-full rounded-b-[2.5rem] md:rounded-b-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)]" ref="mapContainer"></div>
      
      <div v-if="mapError" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
        <div class="text-center p-8 max-w-md bg-white rounded-3xl shadow-2xl border border-red-100">
          <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Map Error</h3>
          <p class="text-gray-500 mb-6 font-medium">{{ mapError }}</p>
          <button
            @click="retryMapInitialization"
            class="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    </div>

    <div
      class="bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.18)] border-t border-white/60 p-6 md:p-7 lg:p-8 max-h-[48vh] md:max-h-[50vh] overflow-y-auto z-10 relative"
    >
      
      <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:mb-7"></div>

      <div class="flex flex-wrap items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
        <div class="flex items-center gap-4 md:gap-5 min-w-0">
          <div class="w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-[#A8EB12] via-[#74E600] to-[#00C851] p-0.5 shadow-lg shadow-green-200/70">
            <div class="w-full h-full bg-white rounded-2xl overflow-hidden flex items-center justify-center text-[#00C851] text-xl font-black border-2 border-white">
              <span v-if="!driverProfile?.profilePicture">
                {{ driverInitials }}
              </span>
              <img
                v-else
                :src="driverProfile.profilePicture"
                :alt="driverName"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div class="min-w-0">
            <h3 class="text-lg md:text-xl font-black text-gray-800 leading-tight truncate">
              {{ driverName }}
            </h3>
            <span
              class="inline-block px-2.5 py-0.5 bg-[#E7FFE0] text-[#2F8F27] text-[10px] font-bold uppercase tracking-wider rounded-full mt-1 border border-[#C9F6B9]"
            >
              Courier
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 md:gap-4">
          <button
            @click="viewOrderDetails"
            class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-[#F3FDF1] text-[#3ED400] hover:bg-[#3ED400] hover:text-white hover:shadow-lg hover:shadow-green-200/70 transition-all flex items-center justify-center group"
            title="Order Details"
          >
            <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>

          <button
            @click="openChat"
            class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-[#E9FFF8] text-[#00C851] hover:bg-[#00C851] hover:text-white hover:shadow-lg hover:shadow-emerald-200/70 transition-all flex items-center justify-center group"
            title="Chat"
          >
            <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>

          <button
            @click="callCustomer"
            class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-[#E3FFE8] text-[#00C851] hover:bg-[#00C851] hover:text-white hover:shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center group"
            title="Call Customer"
          >
            <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </button>
        </div>
      </div>

      <div class="bg-gradient-to-r from-[#F4FFE9] via-white to-[#E8FFE8] p-5 rounded-2xl border border-[#E2FAD6] mb-6">
        <div v-if="order?.formData?.useAddStoreOption && order?.formData?.addStoreItems" class="p-3 bg-green-50 rounded-xl border border-green-200 mb-4">
          <p class="text-[10px] font-black text-green-700 uppercase tracking-wider mb-1">Add Store — What to buy</p>
          <p class="text-sm font-bold text-gray-800 whitespace-pre-wrap">{{ order.formData.addStoreItems }}</p>
        </div>
        <div class="relative pl-4 border-l-2 border-[#B7F08F] space-y-6">
          <div class="relative">
            <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#FFB300] shadow-sm"></div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{{ order?.formData?.useAddStoreOption ? 'Add Store (Pickup)' : 'Pickup' }}</p>
            <p class="text-sm font-bold text-gray-800 leading-snug">{{ pickupAddress }}</p>
          </div>

          <div class="relative">
            <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#00C851] shadow-sm"></div>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Drop-off</p>
            <p class="text-sm font-bold text-gray-800 leading-snug">{{ deliveryAddress }}</p>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mb-3">
        <button
          @click="showItemsTotalModal"
          :disabled="!order || order.status === 'delivered'"
          class="flex-1 py-3 px-2 bg-[#E7FFF5] text-[#00C851] font-semibold text-sm rounded-xl border border-[#C5F7DE] hover:bg-[#D4FFE7] hover:border-[#9CF3C1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Set Total
        </button>
        <button
          @click="showProofModal"
          :disabled="!order || order.status === 'delivered'"
          class="flex-1 py-3 px-2 bg-[#F4FFF0] text-[#3ED400] font-semibold text-sm rounded-xl border border-[#D9F6C8] hover:bg-[#E8FFE1] hover:border-[#B8F29A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload Proof
        </button>
      </div>
      
      <p v-if="!order?.proofOfDelivery?.url" class="text-xs text-amber-600 font-semibold mb-2 text-center">Upload proof of delivery first to finish.</p>
      <button
        @click="finishDelivery"
        :disabled="!order || order.status === 'delivered' || !order?.proofOfDelivery?.url"
        class="w-full py-4 font-black text-base md:text-lg rounded-2xl transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        :class="order?.proofOfDelivery?.url
          ? 'bg-gradient-to-r from-[#74E600] via-[#3ED400] to-[#00C851] text-white shadow-[0_12px_30px_rgba(0,200,81,0.55)] hover:shadow-[0_16px_40px_rgba(0,200,81,0.65)] hover:-translate-y-0.5 active:scale-95'
          : 'bg-gray-300 text-gray-500'"
      >
        FINISH DELIVERY
      </button>
    </div>

    <div
      v-if="showOrderDetailsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 md:bg-black/45 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#DFF7D0] transform transition-all"
      >
        <div
          class="sticky top-0 bg-gradient-to-r from-[#A8EB12] via-[#74E600] to-[#00C851] text-white border-b border-[#C8F6B8]/60 px-6 py-4 flex items-center justify-between z-10"
        >
          <h2 class="text-xl font-black drop-shadow-sm">Order Details</h2>
          <button
            @click="showOrderDetailsModal = false"
            class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6" v-if="order">
          <div class="bg-gradient-to-br from-[#F2FFE5] via-[#E4FFE8] to-[#D9FFE5] p-5 rounded-2xl border border-[#CFF5C2]">
            <h4 class="text-xs font-black text-[#3ED400] uppercase tracking-widest mb-4">Order Summary</h4>
            <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p class="text-gray-500 text-xs">Order ID</p>
                <p class="font-bold text-gray-800 font-mono text-xs">#{{ order.id?.substring(0, 8) || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Status</p>
                <span
                  class="inline-block px-2 py-0.5 bg-[#E7FFF5] text-[#00C851] text-[10px] font-bold uppercase rounded-full mt-0.5"
                >
                  {{ order.status || 'N/A' }}
                </span>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Total Amount</p>
                <p class="font-black text-[#00C851] text-lg">
                  ₱{{ (order.totalAmount || order.pricing?.total || 0).toFixed(2) }}
                </p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Payment</p>
                <p class="font-bold text-gray-800">{{ order.paymentMethod || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Customer</h4>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between border-b border-gray-50 pb-2">
                <span class="text-sm text-gray-500">Name</span>
                <span class="text-sm font-bold text-gray-900">{{ order.customerData?.fullName || (order.customerData?.firstName ? `${order.customerData.firstName} ${order.customerData.lastName}` : 'N/A') }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-50 pb-2">
                <span class="text-sm text-gray-500">Phone</span>
                <a :href="`tel:${order.customerData?.phone || order.customerData?.contact}`" class="text-sm font-bold text-blue-600 hover:underline">
                  {{ order.customerData?.phone || order.customerData?.contact || 'N/A' }}
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Locations</h4>
            <div class="space-y-4">
              <div class="relative pl-3 border-l-2 border-green-400">
                <p class="text-xs text-gray-500">Pickup</p>
                <p class="text-sm font-bold text-gray-900">{{ pickupAddress }}</p>
              </div>
              <div class="relative pl-3 border-l-2 border-gray-400">
                <p class="text-xs text-gray-500">Delivery</p>
                <p class="text-sm font-bold text-gray-900">{{ deliveryAddress }}</p>
              </div>
            </div>
          </div>

          <div v-if="order?.formData?.useAddStoreOption && (order?.formData?.addStoreName || order?.formData?.addStoreItems)" class="bg-green-50 p-5 rounded-2xl border-2 border-green-200 shadow-sm">
            <h4 class="text-xs font-black text-green-700 uppercase tracking-widest mb-3">Add Store Option</h4>
            <p v-if="order.formData.addStoreName" class="font-bold text-gray-900 text-sm">{{ order.formData.addStoreName }}</p>
            <p v-if="order.formData.addStoreAddress" class="text-gray-700 text-sm">{{ order.formData.addStoreAddress }}</p>
            <div v-if="order.formData.addStoreItems" class="mt-3 pt-3 border-t border-green-200">
              <p class="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1">What to buy at store</p>
              <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ order.formData.addStoreItems }}</p>
            </div>
          </div>
          <div v-if="order?.formData" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Details</h4>
            <div class="space-y-3">
              <div v-for="detail in getFilteredBookingDetails()" :key="detail.key" class="flex flex-col gap-1 pb-3 border-b border-gray-50 last:border-0">
                <span class="text-xs font-bold text-gray-500 uppercase">{{ detail.label }}</span>
                <span class="text-sm font-medium text-gray-800">{{ detail.value }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Feedback Section -->
          <div
            v-if="order?.feedback && order.status === 'delivered'"
            class="bg-gradient-to-br from-[#FFF9E2] via-[#FFF1C5] to-[#FFE0A3] p-5 rounded-2xl border border-[#FFE6B8] shadow-sm"
          >
            <h4 class="text-xs font-black text-[#C18A00] uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              Customer Feedback
            </h4>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" 
                       :class="i <= (order.feedback.rating || 0) ? 'text-yellow-400' : 'text-gray-300'" 
                       class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm font-bold text-gray-700">{{ order.feedback.rating || 0 }}.0</span>
                <span class="text-xs text-gray-500">by {{ order.feedback.userName || 'Customer' }}</span>
              </div>
              <p
                v-if="order.feedback.comment"
                class="text-sm text-gray-700 italic bg-white/60 p-3 rounded-lg border border-yellow-100"
              >
                "{{ order.feedback.comment }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showChatModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden border border-[#DFF7D0]"
      >
        <div
          class="px-6 py-4 bg-gradient-to-r from-[#A8EB12] via-[#74E600] to-[#00C851] text-white flex items-center justify-between shadow-sm z-10"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold shadow-md"
            >
              {{ chatPartner?.role === 'user' ? 'U' : 'C' }}
            </div>
            <div>
              <h2 class="text-lg font-black leading-tight drop-shadow-sm">Chat</h2>
              <p class="text-xs font-bold uppercase tracking-wide text-white/80">
                {{ chatPartner?.name || 'Customer' }}
              </p>
            </div>
          </div>
          <button
            @click="showChatModal = false"
            class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex-1 overflow-hidden bg-gray-50 relative">
          <ChatWindow
            v-if="chatId && orderId"
            :chat-id="chatId"
            :order-id="orderId"
            :chat-partner="chatPartner"
            :is-driver="true"
            @notification="handleChatNotification"
            class="h-full"
          />
          <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
            <div
              class="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#00C851] mb-4"
            ></div>
            <p class="font-medium">Connecting...</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCallModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center transform transition-all border border-[#DFF7D0]"
      >
        <div class="w-20 h-20 bg-[#E7FFF5] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg class="w-10 h-10 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-2">Call Customer</h2>
        <div class="bg-[#F6FFF1] py-4 px-6 rounded-2xl mb-8 border border-[#E0F6CF]">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Number</p>
          <p class="text-xl font-bold text-gray-800 font-mono">{{ order?.customerData?.phone || 'N/A' }}</p>
        </div>
        <div class="flex gap-4">
          <button
            @click="showCallModal = false"
            class="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="initiateCall"
            :disabled="!order?.customerData?.phone"
            class="flex-1 py-3 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white font-bold rounded-xl hover:brightness-110 transition-colors shadow-lg disabled:opacity-50"
          >
            Call Now
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showItemsModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-[#DFF7D0]">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-black text-gray-900">Set Items Total</h2>
          <button
            @click="showItemsModal = false"
            class="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
          ><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        
        <div class="space-y-6" v-if="order">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Enter Amount (₱)
            </label>
            <input
              v-model.number="itemsTotal"
              type="number"
              min="0"
              step="0.01"
              class="w-full text-2xl font-bold px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#00C851] outline-none transition-all placeholder-gray-300"
              placeholder="0.00"
            />
          </div>

          <div class="bg-[#F6FFF1] p-5 rounded-2xl border border-[#E0F6CF] space-y-2 text-sm">
            <div class="flex justify-between text-gray-500"><span>Base Charge</span> <span>₱{{ (order.pricing?.baseCharge || 0).toFixed(2) }}</span></div>
            <div class="flex justify-between text-gray-500"><span>Distance Fee</span> <span>₱{{ (order.pricing?.distanceFee || 0).toFixed(2) }}</span></div>
            <div v-if="order.pricing?.badWeatherFee" class="flex justify-between text-yellow-600"><span>Weather Fee</span> <span>₱{{ (order.pricing.badWeatherFee || 0).toFixed(2) }}</span></div>
            <div class="flex justify-between text-[#00C851] font-bold bg-[#E7FFF5] p-2 rounded-lg">
              <span>Items Total</span> <span>₱{{ (itemsTotal || 0).toFixed(2) }}</span>
            </div>
            
            <div class="border-t border-gray-200 my-2 pt-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span> <span>₱{{ calculateNewTotal().toFixed(2) }}</span>
              </div>
              <div
                v-if="order.paymentMethod?.toUpperCase() !== 'COD'"
                class="flex justify-between text-gray-600"
              >
                <span>GCash Fee</span> <span>₱{{ calculateGCashFee().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <span class="font-bold text-gray-800 text-base">TOTAL</span>
                <span class="font-black text-2xl text-[#00C851]">
                  ₱{{ (order.totalAmount || calculateNewTotalWithGCash()).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <button
            @click="saveItemsTotal"
            :disabled="savingItems || itemsTotal < 0"
            class="w-full py-3 bg-gradient-to-r from-[#74E600] via-[#3ED400] to-[#00C851] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {{ savingItems ? 'Saving...' : 'Save & Notify User' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showProofOfDeliveryModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-[#DFF7D0]">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-black text-gray-900">Upload Proof</h2>
          <button
            @click="showProofOfDeliveryModal = false"
            class="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
          ><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>

        <div class="space-y-4">
          <div
            @drop.prevent="handleProofDrop"
            @dragover.prevent="dragOverProof = true"
            @dragleave.prevent="dragOverProof = false"
            :class="[
              'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
              dragOverProof
                ? 'border-[#00C851] bg-[#E7FFF5]'
                : 'border-gray-300 hover:border-[#74E600] hover:bg-gray-50'
            ]"
          >
            <input type="file" accept="image/*" @change="handleProofFileSelect" class="hidden" id="proofFileInput" ref="proofFileInput" />
            <label for="proofFileInput" class="cursor-pointer block">
              <div
                class="w-16 h-16 bg-[#E7FFF5] text-[#00C851] rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              </div>
              <p class="text-gray-600 font-medium">Click to upload or drag image</p>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </label>
          </div>

          <div v-if="proofPreview" class="relative rounded-xl overflow-hidden border border-gray-200">
            <img :src="proofPreview" class="w-full h-48 object-cover" />
            <button @click="proofPreview = null; proofFile = null" class="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>

          <button
            @click="uploadProofOfDelivery"
            :disabled="!proofFile || uploadingProof"
            class="w-full py-3 bg-gradient-to-r from-[#74E600] via-[#3ED400] to-[#00C851] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {{ uploadingProof ? 'Uploading...' : 'Upload & Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showNotificationModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
      @click.self="closeNotificationModal"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 border border-[#DFF7D0]"
        @click.stop
      >
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce"
          :class="notificationType === 'success' ? 'bg-[#E7FFF5] text-[#00C851]' : notificationType === 'error' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'"
        >
          <svg v-if="notificationType === 'success'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
          <svg v-else-if="notificationType === 'error'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        
        <h3 class="text-xl font-black text-gray-900 mb-2">
          {{ notificationType === 'success' ? 'Success!' : notificationType === 'error' ? 'Oops!' : 'Notice' }}
        </h3>
        <p class="text-gray-600 mb-6 font-medium leading-relaxed">{{ notificationMessage }}</p>
        
        <button @click="closeNotificationModal"
                class="w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95"
                :class="notificationType === 'success' 
                  ? 'bg-gradient-to-r from-[#74E600] via-[#3ED400] to-[#00C851] shadow-[0_10px_30px_rgba(0,200,81,0.45)] hover:shadow-[0_14px_36px_rgba(0,200,81,0.6)]' 
                  : notificationType === 'error' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                    : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'">
          Okay, Got it
        </button>
      </div>
    </div>

  </div>
</template>

<script>
// --- LOGIC MO (EXACTLY AS PROVIDED IN CODE 2) ---
import { db, storage } from '@/firebase/config'
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import ChatWindow from '@/components/ChatWindow.vue'
import { chatService } from '@/services/chatService'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { realtimeService } from '@/services/realtime'

export default {
  name: 'DeliveryTracking',
  components: {
    ChatWindow
  },
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    return { authStore, toast }
  },
  data() {
    return {
      orderId: null,
      order: null,
      driverProfile: null,
      map: null,
      markers: [],
      directionsRenderer: null,
      currentLocation: null,
      locationWatchId: null,
      driverMarker: null, // Marker for driver's current location
      isFullscreen: false,
      showOrderDetailsModal: false,
      showChatModal: false,
      showCallModal: false,
      chatId: null,
      chatPartner: null,
      mapError: null,
      showItemsModal: false,
      itemsTotal: 0,
      savingItems: false,
      showProofOfDeliveryModal: false,
      proofFile: null,
      proofPreview: null,
      uploadingProof: false,
      dragOverProof: false,
      showNotificationModal: false,
      notificationType: 'success',
      notificationMessage: ''
    }
  },
  computed: {
    driverName() {
      if (this.driverProfile) {
        return `${this.driverProfile.firstName || ''} ${this.driverProfile.lastName || ''}`.trim() || 'Driver'
      }
      return this.authStore.userProfile?.fullName || 'Driver'
    },
    driverInitials() {
      const name = this.driverName
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    },
    pickupAddress() {
      if (!this.order) return 'Loading...'
      return this.order.pickupAddress || 
             this.order.formData?.pickupAddress || 
             this.order.formData?.restaurantAddress || 
             this.order.formData?.storeAddress || 
             'Address not available'
    },
    deliveryAddress() {
      if (!this.order) return 'Loading...'
      return this.order.deliveryAddress || 
             this.order.formData?.deliveryAddress || 
             this.order.formData?.returnAddress || 
             this.order.formData?.dropoffAddress || 
             'Address not available'
    }
  },
  async mounted() {
    // Get order ID from route params
    this.orderId = this.$route.params.orderId
    
    if (!this.orderId) {
      this.toast.error('No order ID provided')
      this.$router.push('/driver/assignments')
      return
    }

    await this.loadOrderData()
    await this.loadDriverProfile()
    // Initialize map immediately - it will focus on pickup and delivery locations
    this.initializeMap()
    // Start location tracking in background (doesn't block map display)
    this.startLocationTracking()
  },
  beforeUnmount() {
    // Clean up driver marker
    if (this.driverMarker) {
      this.driverMarker.setMap(null)
      this.driverMarker = null
    }
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId)
    }
  },
  methods: {
    async loadOrderData() {
      try {
        if (!this.orderId) {
          console.error('[v0] No order ID provided')
          this.toast.error('Order ID is missing')
          this.$router.push('/driver/assignments')
          return
        }

        const orderRef = doc(db, 'orders', this.orderId)
        const orderSnap = await getDoc(orderRef)
        
        if (!orderSnap.exists()) {
          console.error('[v0] Order not found:', this.orderId)
          this.toast.error('Order not found. It may have been deleted or does not exist.')
          this.$router.push('/driver/assignments')
          return
        }

        const orderData = orderSnap.data()
        
        // Verify that the driver has access to this order
        const driverId = this.authStore.user?.uid
        if (orderData.driverId !== driverId && !this.authStore.isAdmin) {
          console.error('[v0] Driver does not have access to this order:', {
            orderDriverId: orderData.driverId,
            currentDriverId: driverId
          })
          this.toast.error('You do not have permission to view this order')
          this.$router.push('/driver/assignments')
          return
        }

        this.order = {
          id: orderSnap.id,
          ...orderData
        }

        // Load customer data if needed
        if (this.order.userId) {
          try {
            const userRef = doc(db, 'users', this.order.userId)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              const userData = userSnap.data()
              // Map user data with fallbacks for different field names
              this.order.customerData = {
                ...userData,
                // Ensure we have firstName and lastName
                firstName: userData.firstName || userData.first_name || '',
                lastName: userData.lastName || userData.last_name || '',
                // Phone might be in 'phone' or 'contact' field
                phone: userData.phone || userData.contact || userData.phoneNumber || '',
                // Email
                email: userData.email || '',
                // Full name as fallback
                fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.name || ''
              }
            } else {
              console.warn('[v0] User document not found:', this.order.userId)
            }
          } catch (userError) {
            console.warn('[v0] Error loading customer data:', userError)
            // Don't fail the entire load if customer data can't be loaded
          }
        } else {
          console.warn('[v0] No userId in order, cannot load customer data')
        }
      } catch (error) {
        console.error('[v0] Error loading order:', error)
        
        let errorMessage = 'Failed to load order data'
        if (error.code === 'permission-denied') {
          errorMessage = 'You do not have permission to view this order'
        } else if (error.code === 'not-found') {
          errorMessage = 'Order not found. It may have been deleted.'
        } else if (error.message) {
          errorMessage = `Failed to load order: ${error.message}`
        }
        
        this.toast.error(errorMessage)
        this.$router.push('/driver/assignments')
      }
    },

    async loadDriverProfile() {
      try {
        const driverId = this.authStore.user?.uid
        if (!driverId) return

        const driverRef = doc(db, 'drivers', driverId)
        const driverSnap = await getDoc(driverRef)
        
        if (driverSnap.exists()) {
          this.driverProfile = driverSnap.data()
          
          // Get current location from Firestore if available (more accurate)
          if (this.driverProfile.currentLocation) {
            this.currentLocation = {
              lat: this.driverProfile.currentLocation.lat,
              lng: this.driverProfile.currentLocation.lng
            }
            console.log('[v0] Using driver location from Firestore:', this.currentLocation)
          }
        } else {
          // Fallback to user profile
          this.driverProfile = this.authStore.userProfile
        }
      } catch (error) {
        console.error('[v0] Error loading driver profile:', error)
      }
    },

    async initializeMap() {
      try {
        this.mapError = null
        
        // Wait for DOM to be ready (no delay)
        await this.$nextTick()

        // Load Google Maps API if not already loaded
        if (!window.google || !window.google.maps) {
          await this.loadGoogleMapsAPI()
        }
        
        // Verify API is loaded
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API failed to load. Please check your API key configuration.')
        }

        // Initialize map immediately
        const mapElement = this.$refs.mapContainer
        if (!mapElement) {
          console.error('[v0] Map container not found')
          return
        }

        // Force dimensions immediately
        mapElement.style.width = '100%'
        mapElement.style.height = '100%'

        // Default center (will be updated when markers are added to show pickup/delivery)
        const center = { lat: 14.5995, lng: 120.9842 } // Default to Manila

        this.map = new window.google.maps.Map(mapElement, {
          zoom: 13,
          center: center,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })

        // Initialize directions renderer
        this.directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: this.map,
          suppressMarkers: false
        })

        // Set up ResizeObserver to handle container size changes
        if (window.ResizeObserver && mapElement) {
          const resizeObserver = new ResizeObserver(() => {
            if (this.map) {
              window.google.maps.event.trigger(this.map, 'resize')
            }
          })
          resizeObserver.observe(mapElement)
        }

        // Add markers and route immediately (this will set the proper bounds to show pickup/delivery)
        await this.addMarkersAndRoute()
        
        // Trigger resize after markers are added
        this.$nextTick(() => {
          if (this.map) {
            window.google.maps.event.trigger(this.map, 'resize')
          }
        })
      } catch (error) {
        console.error('[v0] Error initializing map:', error)
        const errorMessage = error.message || 'Failed to load map. Please check your Google Maps API key and ensure the Maps JavaScript API is enabled.'
        this.mapError = errorMessage
        this.toast.error(errorMessage)
      }
    },
    
    async retryMapInitialization() {
      this.mapError = null
      // Clear existing map if any
      if (this.map) {
        this.map = null
      }
      // Remove existing script to force reload
      const existingScript = document.getElementById('google-maps-script')
      if (existingScript) {
        existingScript.remove()
      }
      // Reset google object
      if (window.google) {
        delete window.google
      }
      // Retry initialization
      await this.initializeMap()
    },

    async loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve()
          return
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
        if (existingScript) {
          // Wait for it to load
          let attempts = 0
          const maxAttempts = 100 // 10 seconds max
          const checkInterval = setInterval(() => {
            attempts++
            if (window.google && window.google.maps) {
              clearInterval(checkInterval)
              resolve()
            } else if (attempts >= maxAttempts) {
              clearInterval(checkInterval)
              reject(new Error('Google Maps API loading timeout'))
            }
          }, 100)
          return
        }

        // Get API key with fallback
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o'
        
        if (!apiKey) {
          reject(new Error('Google Maps API key is not configured'))
          return
        }

        const script = document.createElement('script')
        script.id = 'google-maps-script'
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`
        script.async = true
        script.defer = true
        
        // Poll for API availability after script loads
        script.onload = () => {
          let attempts = 0
          const maxAttempts = 50 // 5 seconds max
          const checkInterval = setInterval(() => {
            attempts++
            if (window.google && window.google.maps) {
              clearInterval(checkInterval)
              resolve()
            } else if (attempts >= maxAttempts) {
              clearInterval(checkInterval)
              reject(new Error('Google Maps API loaded but not available. Check API key permissions.'))
            }
          }, 100)
        }
        
        script.onerror = () => {
          reject(new Error('Failed to load Google Maps API. Please check your API key, network connection, and ensure the Maps JavaScript API is enabled in Google Cloud Console.'))
        }
        
        document.head.appendChild(script)
      })
    },

    getCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            resolve(this.currentLocation)
          },
          (error) => {
            console.error('[v0] Error getting location:', error)
            // Default to Manila if location access denied
            this.currentLocation = { lat: 14.5995, lng: 120.9842 }
            resolve(this.currentLocation)
          },
          { enableHighAccuracy: true, timeout: 5000 }
        )
      })
    },

    async addMarkersAndRoute() {
      if (!this.map || !this.order) return

      try {
        // Clear existing markers (except driver marker)
        this.markers.forEach(marker => {
          marker.setMap(null)
        })
        this.markers = []
        
        const directionsService = new window.google.maps.DirectionsService()
        
        // Geocode addresses to get coordinates
        const geocoder = new window.google.maps.Geocoder()
        
        const pickupCoords = await this.geocodeAddress(this.pickupAddress)
        const deliveryCoords = await this.geocodeAddress(this.deliveryAddress)

        // Add pickup marker using PIN_LOCATION.png
        if (pickupCoords) {
          const createPickupMarker = (iconUrl, isFallback = false) => {
            const pickupMarker = new window.google.maps.Marker({
              position: pickupCoords,
              map: this.map,
              icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(50, 50),
                anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
              },
              title: 'Pickup Location'
            })
            this.markers.push(pickupMarker)
            
            // If using custom image, verify it loads
            if (!isFallback) {
              const testImage = new Image()
              testImage.onerror = () => {
                console.warn('PIN_LOCATION.png failed to load for pickup, using fallback')
                const index = this.markers.indexOf(pickupMarker)
                if (index > -1) {
                  pickupMarker.setMap(null)
                  this.markers.splice(index, 1)
                  createPickupMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 0C11.193 0 0 11.193 0 25c0 25 25 25 25 25s25 0 25-25C50 11.193 38.807 0 25 0z" fill="#10B981"/>
                      <circle cx="25" cy="25" r="8" fill="#ffffff"/>
                    </svg>
                  `), true)
                }
              }
              testImage.src = iconUrl
            }
          }
          
          createPickupMarker('/PIN_LOCATION.png')
        }

        // Add delivery marker using PIN_LOCATION.png
        if (deliveryCoords) {
          const createDeliveryMarker = (iconUrl, isFallback = false) => {
            const deliveryMarker = new window.google.maps.Marker({
              position: deliveryCoords,
              map: this.map,
              icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(50, 50),
                anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
              },
              title: 'Delivery Location'
            })
            this.markers.push(deliveryMarker)
            
            // If using custom image, verify it loads
            if (!isFallback) {
              const testImage = new Image()
              testImage.onerror = () => {
                console.warn('PIN_LOCATION.png failed to load for delivery, using fallback')
                const index = this.markers.indexOf(deliveryMarker)
                if (index > -1) {
                  deliveryMarker.setMap(null)
                  this.markers.splice(index, 1)
                  createDeliveryMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25 0C11.193 0 0 11.193 0 25c0 25 25 25 25 25s25 0 25-25C50 11.193 38.807 0 25 0z" fill="#10B981"/>
                      <circle cx="25" cy="25" r="8" fill="#ffffff"/>
                    </svg>
                  `), true)
                }
              }
              testImage.src = iconUrl
            }
          }
          
          createDeliveryMarker('/PIN_LOCATION.png')
        }

        // Calculate and display route - same as BookService (pickup to delivery)
        if (pickupCoords && deliveryCoords) {
          // Show route from pickup -> delivery (same route as shown in BookService)
          const request = {
            origin: pickupCoords,
            destination: deliveryCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          }

          directionsService.route(request, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              // Display the route (same as BookService)
              this.directionsRenderer.setOptions({ suppressMarkers: true })
              this.directionsRenderer.setDirections(result)
              
              // Fit map to show pickup and delivery locations with route
              const bounds = new window.google.maps.LatLngBounds()
              
              // Add pickup and delivery locations
              bounds.extend(pickupCoords)
              bounds.extend(deliveryCoords)
              
              // Add route points to bounds
              if (result.routes && result.routes[0] && result.routes[0].legs) {
                result.routes[0].legs.forEach(leg => {
                  bounds.extend(leg.start_location)
                  bounds.extend(leg.end_location)
                })
              }
              
              // Fit bounds with padding to show both locations and route clearly
              this.map.fitBounds(bounds, { padding: 80 })
            } else {
              console.error('[v0] Directions request failed:', status)
              
              // If directions fail, at least show both pickup and delivery markers
              const bounds = new window.google.maps.LatLngBounds()
              bounds.extend(pickupCoords)
              bounds.extend(deliveryCoords)
              this.map.fitBounds(bounds, { padding: 80 })
            }
          })
        } else if (pickupCoords || deliveryCoords) {
          // If only one location is available, center on it
          const availableCoords = pickupCoords || deliveryCoords
          if (availableCoords) {
            this.map.setCenter(availableCoords)
            this.map.setZoom(15)
          }
        }
      } catch (error) {
        console.error('[v0] Error adding markers:', error)
      }
    },

    geocodeAddress(address) {
      return new Promise((resolve) => {
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].geometry.location)
          } else {
            console.error('[v0] Geocoding failed for:', address, status)
            resolve(null)
          }
        })
      })
    },

    startLocationTracking() {
      if (!navigator.geolocation) return

      const driverId = this.authStore.user?.uid
      if (!driverId) return

      this.locationWatchId = navigator.geolocation.watchPosition(
        async (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          }

          // Update driver location in Firestore (drivers collection) for accurate tracking
          try {
            const driverRef = doc(db, 'drivers', driverId)
            await updateDoc(driverRef, {
              currentLocation: {
                lat: this.currentLocation.lat,
                lng: this.currentLocation.lng,
                accuracy: this.currentLocation.accuracy,
                timestamp: serverTimestamp(),
                updatedAt: new Date()
              },
              lastLocationUpdate: serverTimestamp()
            })
            console.log('[v0] Driver location updated in Firestore')
          } catch (error) {
            console.error('[v0] Error updating driver location in Firestore:', error)
          }

          // Also update order with driver location
          try {
            const orderRef = doc(db, 'orders', this.orderId)
            await updateDoc(orderRef, {
              driverLocation: {
                lat: this.currentLocation.lat,
                lng: this.currentLocation.lng,
                timestamp: serverTimestamp()
              }
            })
          } catch (error) {
            console.error('[v0] Error updating driver location in order:', error)
          }

          // Update or create driver marker on map
          if (this.map) {
            if (!this.driverMarker) {
              // Create driver marker using RIDER.png
              const createDriverMarker = (iconUrl, isFallback = false) => {
                this.driverMarker = new window.google.maps.Marker({
                  position: this.currentLocation,
                  map: this.map,
                  title: 'Your Location',
                  icon: {
                    url: iconUrl,
                    scaledSize: new window.google.maps.Size(60, 60),
                    anchor: new window.google.maps.Point(30, 30)
                  },
                  optimized: false
                })
                
                // If using custom image, verify it loads
                if (!isFallback) {
                  const testImage = new Image()
                  testImage.onerror = () => {
                    console.warn('RIDER.png failed to load, using fallback')
                    if (this.driverMarker) {
                      this.driverMarker.setMap(null)
                      this.driverMarker = null
                      createDriverMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="30" cy="30" r="28" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                          <text x="30" y="38" text-anchor="middle" fill="white" font-size="24" font-weight="bold">🚴</text>
                        </svg>
                      `), true)
                    }
                  }
                  testImage.src = iconUrl
                }
              }
              
              createDriverMarker('/RIDER.png')
            } else {
              // Update existing driver marker position
              this.driverMarker.setPosition(this.currentLocation)
            }
            
            // Update map center to follow driver
            this.map.setCenter(this.currentLocation)
          }
        },
        (error) => {
          console.error('[v0] Location tracking error:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    },

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        this.$el.requestFullscreen().then(() => {
          this.isFullscreen = true
        }).catch(err => {
          console.error('[v0] Error entering fullscreen:', err)
        })
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false
        }).catch(err => {
          console.error('[v0] Error exiting fullscreen:', err)
        })
      }
    },

    viewOrderDetails() {
      this.showOrderDetailsModal = true
    },

    // ====== STANDALONE CHAT MODAL (NOT CONNECTED TO DRIVER/CHAT PAGE) ======
    // This opens a standalone chat modal for real-time communication with user
    // Real-time updates are handled by ChatWindow component using Firestore onSnapshot
    async openChat() {
      console.log('[v0] Opening chat modal - orderId:', this.orderId, 'order:', this.order)
      
      if (!this.orderId) {
        console.error('[v0] No orderId available')
        this.toast.error('Order ID is missing')
        return
      }

      if (!this.order) {
        console.error('[v0] Order data not loaded yet')
        this.toast.error('Order information is still loading. Please wait...')
        // Try to reload order data
        await this.loadOrderData()
        if (!this.order) {
          return
        }
      }

      try {
        // Get user and driver IDs
        const userId = this.order.userId
        const driverId = this.authStore.user?.uid
        console.log('[v0] Chat participants - userId:', userId, 'driverId:', driverId)
        
        if (!userId) {
          console.error('[v0] User ID not found in order')
          this.toast.error('Customer information not available in order')
          return
        }
        
        if (!driverId) {
          console.error('[v0] Driver ID not found')
          this.toast.error('Driver information not available')
          return
        }

        // Load customer data if not already loaded
        if (!this.order.customerData && userId) {
          console.log('[v0] Loading customer data for chat...')
          try {
            const userRef = doc(db, 'users', userId)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              this.order.customerData = userSnap.data()
              console.log('[v0] Customer data loaded:', this.order.customerData)
            } else {
              console.warn('[v0] Customer document not found:', userId)
            }
          } catch (userError) {
            console.error('[v0] Error loading customer data:', userError)
            // Continue anyway, we'll use default values
          }
        }

        // Get or create chat room for real-time communication
        console.log('[v0] Creating/getting chat room...')
        this.chatId = await chatService.createChatRoom(userId, driverId, this.orderId)
        console.log('[v0] Chat room ID:', this.chatId)
        
        // Set chat partner info with fallback values
        this.chatPartner = {
          id: userId,
          name: this.order.customerData?.firstName && this.order.customerData?.lastName
            ? `${this.order.customerData.firstName} ${this.order.customerData.lastName}`
            : this.order.customerData?.fullName || 'Customer',
          role: 'user',
          phone: this.order.customerData?.phone || this.order.customerData?.contact || ''
        }
        
        console.log('[v0] Chat partner set:', this.chatPartner)

        // Show standalone chat modal (NOT navigating to Driver/Chat page)
        this.showChatModal = true
        console.log('[v0] Chat modal opened successfully')
      } catch (error) {
        console.error('[v0] Error opening chat:', error)
        console.error('[v0] Error details:', {
          message: error.message,
          stack: error.stack,
          orderId: this.orderId,
          userId: this.order?.userId,
          driverId: this.authStore.user?.uid
        })
        this.toast.error(`Failed to open chat: ${error.message || 'Unknown error'}`)
        this.showChatModal = false
      }
    },

    callCustomer() {
      this.showCallModal = true
    },

    initiateCall() {
      if (this.order?.customerData?.phone) {
        window.location.href = `tel:${this.order.customerData.phone}`
      } else {
        this.toast.error('Customer phone number not available')
      }
    },

    getFilteredBookingDetails() {
      if (!this.order?.formData) return []
      
      const formData = this.order.formData
      const serviceType = this.order.serviceType || this.order.serviceId
      const details = []
      
      // Define which fields to show for each service type
      const serviceFieldMappings = {
        'food-delivery': ['restaurantName', 'restaurantAddress', 'foodOrderDetails', 'specialInstructions', 'budgetRange', 'receiverName', 'receiverContact', 'landmark', 'preferredTime'],
        'food': ['restaurantName', 'restaurantAddress', 'foodOrderDetails', 'specialInstructions', 'budgetRange', 'receiverName', 'receiverContact', 'landmark', 'preferredTime'],
        'bill-payments': ['billerName', 'accountName', 'accountNumber', 'amountToPay', 'dueDate', 'preferredSchedule'],
        'grocery-shopping': ['shoppingList', 'storePreference', 'budgetRange', 'receiverName', 'receiverContact', 'landmark', 'preferredTime'],
        'grocery': ['shoppingList', 'storePreference', 'budgetRange', 'receiverName', 'receiverContact', 'landmark', 'preferredTime'],
        'gift-delivery': ['giftType', 'specialInstructions', 'budgetRange', 'recipientName', 'recipientContact', 'storeName', 'storeAddress', 'preferredDateTime'],
        'medicine-delivery': ['medicineNames', 'quantity', 'budgetRange', 'receiverName', 'receiverContact', 'landmark', 'preferredTime'],
        'medicine': ['medicineNames', 'quantity', 'budgetRange', 'receiverName', 'receiverContact', 'landmark', 'preferredTime'],
        'pickup-drop': ['itemDescription', 'itemType', 'pickupContact', 'preferredPickupDateTime']
      }
      
      const fieldsToShow = serviceFieldMappings[serviceType] || []
      
      fieldsToShow.forEach(key => {
        const value = formData[key]
        if (value && typeof value === 'string' && value.trim().length > 0) {
          details.push({
            key,
            label: this.formatFieldLabel(key),
            value: value.length > 100 ? value.substring(0, 100) + '...' : value
          })
        } else if (value && typeof value === 'number') {
          details.push({
            key,
            label: this.formatFieldLabel(key),
            value: value.toString()
          })
        }
      })
      
      return details
    },

    formatFieldLabel(key) {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim()
        .replace(/Restaurant Name/i, 'Restaurant')
        .replace(/Restaurant Address/i, 'Restaurant Address')
        .replace(/Food Order Details/i, 'Order Details')
        .replace(/Special Instructions/i, 'Special Instructions')
        .replace(/Budget Range/i, 'Budget Range')
        .replace(/Receiver Name/i, 'Receiver Name')
        .replace(/Receiver Contact/i, 'Receiver Contact')
        .replace(/Preferred Time/i, 'Preferred Time')
    },
    
    formatAdditionalOrderDate(dateValue) {
      if (!dateValue) return 'N/A'
      try {
        let date
        if (dateValue.toDate) {
          date = dateValue.toDate()
        } else if (typeof dateValue === 'string') {
          date = new Date(dateValue)
        } else if (dateValue.seconds) {
          date = new Date(dateValue.seconds * 1000)
        } else {
          date = new Date(dateValue)
        }
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.error('Error formatting additional order date:', error)
        return 'N/A'
      }
    },

    async finishDelivery() {
      // Navigate back to assignments or show completion modal
      try {
        const orderRef = doc(db, 'orders', this.orderId)
        await updateDoc(orderRef, {
          status: 'delivered',
          deliveredAt: serverTimestamp()
        })
        this.toast.success('Delivery completed!')
        this.$router.push('/driver/assignments')
      } catch (error) {
        console.error('[v0] Error finishing delivery:', error)
        this.toast.error('Failed to complete delivery')
      }
    },

    showItemsTotalModal() {
      if (!this.order) return
      // Display the current totalAmount from MyAssignments (which includes items total)
      // If totalAmount exists, calculate itemsTotal from it
      if (this.order.totalAmount && this.order.pricing) {
        const baseCharge = this.order.pricing.baseCharge || 0
        const distanceFee = this.order.pricing.distanceFee || 0
        const badWeatherFee = this.order.pricing.badWeatherFee || 0
        const gcashFee = this.order.pricing.gcashFee || 0
        // Calculate itemsTotal from totalAmount
        const calculatedItemsTotal = this.order.totalAmount - baseCharge - distanceFee - badWeatherFee - gcashFee
        this.itemsTotal = calculatedItemsTotal > 0 ? calculatedItemsTotal : (this.order.pricing.itemsTotal || 0)
      } else {
        this.itemsTotal = this.order.pricing?.itemsTotal || 0
      }
      this.showItemsModal = true
    },

    showProofModal() {
      if (!this.order) return
      this.proofFile = null
      this.proofPreview = null
      this.showProofOfDeliveryModal = true
    },

    calculateNewTotal() {
      if (!this.order) return 0
      const baseCharge = this.order.pricing?.baseCharge || 0
      const distanceFee = this.order.pricing?.distanceFee || 0
      const badWeatherFee = this.order.pricing?.badWeatherFee || 0
      const itemsTotal = this.itemsTotal || this.order.pricing?.itemsTotal || 0
      return baseCharge + distanceFee + badWeatherFee + itemsTotal
    },

    calculateGCashFee() {
      if (!this.order || this.order.paymentMethod?.toUpperCase() === 'COD') {
        return 0
      }
      // Fixed ₱5 GCash fee (not 3%)
      return 5
    },

    calculateGCashFeeForAmount(amount) {
      // Fixed ₱5 GCash fee (not 3%)
      return 5
    },

    calculateNewTotalWithGCash() {
      const subtotal = this.calculateNewTotal()
      const gcashFee = this.calculateGCashFee()
      return subtotal + gcashFee
    },

    async saveItemsTotal() {
      if (!this.order) return
      if (this.itemsTotal < 0) {
        this.showNotification('error', 'Items total cannot be negative.')
        return
      }

      this.savingItems = true

      try {
        const newSubtotal = this.calculateNewTotal()
        const gcashFee = this.calculateGCashFee()
        const newTotal = newSubtotal + gcashFee

        const bookingRef = doc(db, 'orders', this.order.id)
        await updateDoc(bookingRef, {
          'pricing.itemsTotal': this.itemsTotal,
          'pricing.total': newTotal,
          'pricing.gcashFee': gcashFee,
          totalAmount: newTotal,
          itemsAddedAt: serverTimestamp()
        })

        // Update local order data
        if (!this.order.pricing) {
          this.order.pricing = {}
        }
        this.order.pricing.itemsTotal = this.itemsTotal
        this.order.pricing.total = newTotal
        this.order.pricing.gcashFee = gcashFee
        this.order.totalAmount = newTotal

        // Send automatic message to chat with total amount
        try {
          const userId = this.order.userId
          const driverId = this.authStore.user?.uid
          
          if (userId && driverId) {
            // Get or create chat room
            const chatRoomId = await chatService.createChatRoom(userId, driverId, this.order.id)
            
            // Get payment method
            const paymentMethod = this.order.formData?.paymentMethod || this.order.paymentMethod || 'COD'
            const paymentMethodLabel = paymentMethod.toUpperCase() === 'GCASH' ? 'GCash' : 'COD'
            
            // Format the message with total amount, payment method, and thank you message
            const message = `💰 Total Amount to Pay: ₱${newTotal.toFixed(2)}\n` +
                          `Payment Method: ${paymentMethodLabel}\n` +
                          `Please prepare the payment. Thank you!`
            
            // Send message as driver
            await chatService.sendMessage(
              chatRoomId,
              driverId,
              'driver',
              message
            )
            
            console.log('[v0] Total amount message sent to chat:', message)
            
            // Send notification to user to check chat message
            try {
              await realtimeService.sendNotification(userId, {
                title: 'Payment Amount Updated',
                message: `Please check your chat message for the updated payment amount (₱${newTotal.toFixed(2)})`,
                type: 'payment_update',
                recipientType: 'user',
                orderId: this.order.id,
                totalAmount: newTotal
              })
              console.log('[v0] Notification sent to user about payment amount')
            } catch (notifError) {
              console.error('[v0] Error sending notification to user:', notifError)
              // Don't show error to driver, just log it
            }
          }
        } catch (chatError) {
          console.error('[v0] Error sending total amount to chat:', chatError)
          // Don't show error to user, just log it
        }

        this.showItemsModal = false
        this.showNotification('success', '✓ Items total saved successfully!')
      } catch (error) {
        console.error('[v0] Error saving items total:', error)
        this.showNotification('error', 'Failed to save items total. Please try again.')
      } finally {
        this.savingItems = false
      }
    },

    handleProofFileSelect(event) {
      const file = event.target.files?.[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          this.showNotification('error', 'File size exceeds 10MB limit.')
          return
        }
        if (!file.type.startsWith('image/')) {
          this.showNotification('error', 'Please upload an image file.')
          return
        }
        this.proofFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.proofPreview = e.target?.result
        }
        reader.readAsDataURL(file)
      }
    },

    handleProofDrop(event) {
      this.dragOverProof = false
      const file = event.dataTransfer?.files?.[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          this.showNotification('error', 'File size exceeds 10MB limit.')
          return
        }
        if (!file.type.startsWith('image/')) {
          this.showNotification('error', 'Please upload an image file.')
          return
        }
        this.proofFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.proofPreview = e.target?.result
        }
        reader.readAsDataURL(file)
      }
    },

    async uploadProofOfDelivery() {
      if (!this.proofFile || !this.order) {
        this.showNotification('error', 'Please select a photo')
        return
      }
      this.uploadingProof = true

      try {
        const driverId = this.authStore.user?.uid
        if (!driverId) {
          this.showNotification('error', 'Missing driver ID')
          this.uploadingProof = false
          return
        }

        const timestamp = Date.now()
        const ext = (this.proofFile.name.split('.').pop() || 'jpg').toLowerCase()
        const filename = `proof_${this.order.id}_${timestamp}.${ext}`

        const filePath = `delivery-proofs/${driverId}/${filename}`
        const fileRef = storageRef(storage, filePath)

        console.log('[v0] Starting upload to:', filePath)
        console.log('[v0] File details:', {
          name: this.proofFile.name,
          size: this.proofFile.size,
          type: this.proofFile.type
        })

        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(fileRef, this.proofFile)

          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('[v0] Upload progress:', progress + '%')
            },
            (error) => {
              console.error('[v0] Upload error:', error)
              console.error('[v0] Error code:', error.code)
              console.error('[v0] Error message:', error.message)
              this.uploadingProof = false
              const errorMessage = error.message || 'Failed to upload proof of delivery. Please try again.'
              this.showNotification('error', errorMessage)
              reject(error)
            },
            async () => {
              try {
                console.log('[v0] Upload completed, getting download URL...')
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                console.log('[v0] Download URL:', downloadURL)

                const bookingRef = doc(db, 'orders', this.order.id)
                await updateDoc(bookingRef, {
                  status: 'delivered',
                  proofOfDelivery: {
                    url: downloadURL,
                    uploadedAt: serverTimestamp(),
                    fileName: filename,
                    path: filePath,
                    driverId
                  },
                  deliveredAt: serverTimestamp()
                })

                console.log('[v0] Order updated successfully')

                // Update local order so UI reflects proof and status
                this.order.status = 'delivered'
                this.order.proofOfDelivery = {
                  url: downloadURL,
                  fileName: filename,
                  path: filePath,
                  driverId,
                  uploadedAt: new Date()
                }

                // Send notification to all admins
                try {
                  await realtimeService.sendNotificationToAdmins({
                    title: 'Order Completed',
                    message: `Order #${this.order.id.substring(0, 8)} has been completed. Proof of delivery uploaded.`,
                    type: 'order_completed',
                    orderId: this.order.id,
                    driverId: driverId,
                    driverName: this.driverName
                  })
                  console.log('[v0] Notification sent to all admins about order completion')
                } catch (notifError) {
                  console.error('[v0] Error sending notifications to admins:', notifError)
                  // Don't block the upload process if notification fails
                }

                this.showProofOfDeliveryModal = false
                this.proofFile = null
                this.proofPreview = null
                this.uploadingProof = false
                
                // Show success notification
                this.showNotification('success', '✓ Proof submitted successfully! Order marked as delivered.')
                
                // Navigate back to assignments after successful upload
                setTimeout(() => {
                  this.$router.push('/driver/assignments')
                }, 2000)
                
                resolve(downloadURL)
              } catch (error) {
                console.error('[v0] Error updating order:', error)
                this.uploadingProof = false
                this.showNotification('error', 'Upload successful but failed to update order. Please contact support.')
                reject(error)
              }
            }
          )
        })
      } catch (error) {
        console.error('[v0] Error in uploadProofOfDelivery:', error)
        this.uploadingProof = false
        const errorMessage = error.message || 'Failed to upload proof of delivery. Please try again.'
        this.showNotification('error', errorMessage)
      }
    },

    showNotification(type, message) {
      this.notificationType = type
      this.notificationMessage = message
      this.showNotificationModal = true
    },

    closeNotificationModal() {
      this.showNotificationModal = false
      this.notificationMessage = ''
    },

    handleChatNotification(notification) {
      this.showNotification(notification.type, notification.message)
    }
  }
}
</script>

<style scoped>
/* Ensure map container takes full height */
#deliveryMap {
  min-height: 0;
  width: 100%;
  height: 100%;
  position: relative;
}

/* Ensure map container div has proper dimensions */
#deliveryMap > div {
  width: 100% !important;
  height: 100% !important;
  min-height: 400px;
}

/* Ensure the ref mapContainer has proper dimensions */
#deliveryMap > div > div {
  width: 100% !important;
  height: 100% !important;
}
</style>
