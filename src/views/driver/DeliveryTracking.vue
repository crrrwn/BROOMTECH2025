<template>
  <div class="h-screen flex flex-col relative overflow-hidden">
    <!-- Map Section - Takes most of the screen -->
    <div class="flex-1 relative" id="deliveryMap">
      <!-- Fullscreen button -->
      <button
        @click="toggleFullscreen"
        class="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        title="Toggle Fullscreen"
      >
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
      
      <!-- Map will be rendered here -->
      <div class="w-full h-full" ref="mapContainer"></div>
      
      <!-- Map Error Display -->
      <div v-if="mapError" class="absolute inset-0 bg-white flex items-center justify-center z-20">
        <div class="text-center p-6 max-w-md">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p class="text-gray-600 mb-4">{{ mapError }}</p>
          <button
            @click="retryMapInitialization"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Driver/Order Details Card - Fixed at bottom -->
    <div class="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 p-6 max-h-[40vh] overflow-y-auto">
      <!-- Driver Information Section -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <!-- Driver Profile Picture -->
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            <span v-if="!driverProfile?.profilePicture">
              {{ driverInitials }}
            </span>
            <img
              v-else
              :src="driverProfile.profilePicture"
              :alt="driverName"
              class="w-full h-full rounded-full object-cover"
            />
          </div>
          
          <!-- Driver Name and Role -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ driverName }}</h3>
            <p class="text-sm text-gray-600">Courier Boy</p>
          </div>
        </div>

        <!-- Contact Icons -->
        <div class="flex items-center gap-3">
          <!-- Order Details/History Icon -->
          <button
            @click="viewOrderDetails"
            class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors"
            title="Order Details"
          >
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>

          <!-- Chat Icon -->
          <button
            @click="openChat"
            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
            title="Chat"
          >
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          <!-- Phone Icon -->
          <button
            @click="callCustomer"
            class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
            title="Call Customer"
          >
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Location Details -->
      <div class="space-y-4 mb-6">
        <!-- Pickup Location -->
        <div class="flex items-start gap-3">
          <div class="w-3 h-3 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Street: {{ pickupAddress }}</p>
          </div>
        </div>

        <!-- Delivery Location -->
        <div class="flex items-start gap-3">
          <div class="w-3 h-3 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Street: {{ deliveryAddress }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          @click="showItemsTotalModal"
          :disabled="!order || order.status === 'delivered'"
          class="w-full border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Set Items Total
        </button>
        <button
          @click="showProofModal"
          :disabled="!order || order.status === 'delivered'"
          class="w-full border border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Upload Proof of Delivery
        </button>
        <button
          @click="finishDelivery"
          class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg shadow-lg"
        >
          Finish
        </button>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Order Details</h2>
          <button @click="showOrderDetailsModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-6" v-if="order">
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Order Summary</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Order ID</p>
                <p class="font-medium">#{{ order.id?.substring(0, 8) || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Status</p>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {{ order.status || 'N/A' }}
                </span>
              </div>
              <div>
                <p class="text-gray-600">Total Amount</p>
                <p class="font-medium text-green-600">₱{{ (order.totalAmount || order.pricing?.total || 0).toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Payment Method</p>
                <p class="font-medium">{{ order.paymentMethod || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Customer Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Name</p>
                <p class="font-medium">{{ order.customerData?.firstName || '' }} {{ order.customerData?.lastName || '' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Phone</p>
                <p class="font-medium">{{ order.customerData?.phone || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Email</p>
                <p class="font-medium">{{ order.customerData?.email || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Location Information</h4>
            <div class="space-y-3">
              <div>
                <p class="text-gray-600 text-sm">Pickup Location</p>
                <p class="font-medium">{{ pickupAddress }}</p>
              </div>
              <div>
                <p class="text-gray-600 text-sm">Delivery Location</p>
                <p class="font-medium">{{ deliveryAddress }}</p>
              </div>
            </div>
          </div>
          <!-- Booking Details Section -->
          <div v-if="order?.formData" class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Booking Details</h4>
            <div class="space-y-2 text-sm">
              <div v-for="detail in getFilteredBookingDetails()" :key="detail.key" class="flex justify-between border-b pb-2">
                <span class="text-gray-600">{{ detail.label }}:</span>
                <span class="font-medium text-right max-w-xs truncate">{{ detail.value }}</span>
              </div>
            </div>
          </div>
          
          <!-- Additional Orders Section -->
          <div v-if="order?.additionalOrders && order.additionalOrders.length > 0" class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 class="font-medium text-gray-900 mb-3">Additional Orders ({{ order.additionalOrders.length }})</h4>
            <div class="space-y-4">
              <div v-for="(additionalOrder, index) in order.additionalOrders" :key="index" class="bg-white p-4 rounded-lg border border-blue-200">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">{{ additionalOrder.serviceName || 'Additional Order' }}</h5>
                    <p class="text-xs text-gray-500 mt-1">
                      Added: {{ additionalOrder.createdAt ? formatAdditionalOrderDate(additionalOrder.createdAt) : 'N/A' }}
                    </p>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="
                    additionalOrder.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                    additionalOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  ">
                    {{ additionalOrder.status || 'pending' }}
                  </span>
                </div>
                
                <div v-if="additionalOrder.pickupAddress || additionalOrder.deliveryAddress" class="mt-2 text-sm">
                  <div v-if="additionalOrder.pickupAddress" class="text-gray-600 mb-1">
                    <span class="font-medium">Pickup:</span> {{ additionalOrder.pickupAddress }}
                  </div>
                  <div v-if="additionalOrder.deliveryAddress" class="text-gray-600">
                    <span class="font-medium">Delivery:</span> {{ additionalOrder.deliveryAddress }}
                  </div>
                </div>
                
                <div v-if="additionalOrder.routeInfo" class="mt-2 text-xs text-gray-500">
                  <span>Distance: {{ additionalOrder.routeInfo.distance }}</span>
                  <span class="ml-3">ETA: {{ additionalOrder.routeInfo.duration }}</span>
                </div>
                
                <div v-if="additionalOrder.pricing || additionalOrder.totalAmount" class="mt-3 pt-3 border-t border-blue-200">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Order Total:</span>
                    <span class="font-medium text-green-600">₱{{ (additionalOrder.totalAmount || additionalOrder.pricing?.total || 55).toFixed(2) }}</span>
                  </div>
                </div>
                
                <!-- Additional Order Form Data -->
                <div v-if="additionalOrder.formData" class="mt-3 pt-3 border-t border-blue-200">
                  <h6 class="text-xs font-medium text-gray-700 mb-2">Order Details:</h6>
                  <div class="space-y-1 text-xs">
                    <div v-for="(value, key) in additionalOrder.formData" :key="key" v-if="value && typeof value === 'string' && value.trim()" class="flex justify-between">
                      <span class="text-gray-600">{{ formatFieldLabel(key) }}:</span>
                      <span class="font-medium text-right max-w-xs truncate">{{ value.length > 50 ? value.substring(0, 50) + '...' : value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Chat Modal -->
    <div v-if="showChatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div class="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ chatPartner?.role === 'user' ? 'U' : 'C' }}
              </span>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Chat with Customer</h2>
              <p class="text-sm text-gray-600">{{ chatPartner?.name || 'Customer' }}</p>
            </div>
          </div>
          <button @click="showChatModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-hidden">
          <ChatWindow
            v-if="chatId && orderId"
            :chat-id="chatId"
            :order-id="orderId"
            :chat-partner="chatPartner"
            :is-driver="true"
            @notification="handleChatNotification"
          />
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p class="text-gray-600">Loading chat...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call Customer Modal -->
    <div v-if="showCallModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Call Customer</h2>
          <p class="text-gray-600 mb-6">Contact Number</p>
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-2xl font-bold text-gray-900">
              {{ order?.customerData?.phone || 'N/A' }}
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="showCallModal = false"
              class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="initiateCall"
              :disabled="!order?.customerData?.phone"
              class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Set Items Total Modal -->
    <div v-if="showItemsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Set Items Total</h2>
          <button @click="showItemsModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="space-y-4" v-if="order">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Items Total (₱)
            </label>
            <input
              v-model.number="itemsTotal"
              type="number"
              min="0"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Base Charge:</span>
              <span class="font-medium">₱{{ (order.pricing?.baseCharge || 0).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Distance Fee:</span>
              <span class="font-medium">₱{{ (order.pricing?.distanceFee || 0).toFixed(2) }}</span>
            </div>
            <div v-if="order.pricing?.badWeatherFee" class="flex justify-between text-sm">
              <span class="text-gray-600">Bad Weather Fee:</span>
              <span class="font-medium">₱{{ (order.pricing.badWeatherFee || 0).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Items Total:</span>
              <span class="font-medium">₱{{ (itemsTotal || 0).toFixed(2) }}</span>
            </div>
            <div class="border-t pt-2 mt-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">₱{{ calculateNewTotal().toFixed(2) }}</span>
              </div>
              <div v-if="order.paymentMethod?.toUpperCase() !== 'COD'" class="flex justify-between text-sm mt-1">
                <span class="text-gray-600">GCash Fee:</span>
                <span class="font-medium">₱{{ calculateGCashFee().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                <span class="text-gray-900">Total:</span>
                <span class="text-green-600">₱{{ (order.totalAmount || calculateNewTotalWithGCash()).toFixed(2) }}</span>
              </div>
              <div v-if="order.totalAmount" class="text-xs text-gray-500 mt-1 text-center">
                (Current total from My Assignments)
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="showItemsModal = false"
              class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveItemsTotal"
              :disabled="savingItems || itemsTotal < 0"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span v-if="savingItems">Saving...</span>
              <span v-else>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Proof of Delivery Modal -->
    <div v-if="showProofOfDeliveryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Upload Proof of Delivery</h2>
          <button @click="showProofOfDeliveryModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div
            @drop.prevent="handleProofDrop"
            @dragover.prevent="dragOverProof = true"
            @dragleave.prevent="dragOverProof = false"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              dragOverProof ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            ]"
          >
            <input
              type="file"
              accept="image/*"
              @change="handleProofFileSelect"
              class="hidden"
              id="proofFileInput"
              ref="proofFileInput"
            />
            <label for="proofFileInput" class="cursor-pointer">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-gray-600 mb-2">
                <span class="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
          <div v-if="proofPreview" class="mt-4">
            <img :src="proofPreview" alt="Proof preview" class="w-full h-48 object-cover rounded-lg border" />
          </div>
          <div class="flex gap-3">
            <button
              @click="showProofOfDeliveryModal = false; proofFile = null; proofPreview = null"
              class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="uploadProofOfDelivery"
              :disabled="!proofFile || uploadingProof"
              class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span v-if="uploadingProof">Uploading...</span>
              <span v-else>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="text-center">
          <div 
            :class="[
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
              notificationType === 'success' ? 'bg-green-100' : 
              notificationType === 'error' ? 'bg-red-100' : 
              'bg-blue-100'
            ]"
          >
            <svg 
              v-if="notificationType === 'success'"
              class="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg 
              v-else-if="notificationType === 'error'"
              class="w-10 h-10 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg 
              v-else
              class="w-10 h-10 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 
            :class="[
              'text-xl font-semibold mb-2',
              notificationType === 'success' ? 'text-green-900' : 
              notificationType === 'error' ? 'text-red-900' : 
              'text-blue-900'
            ]"
          >
            {{ notificationType === 'success' ? 'Success' : notificationType === 'error' ? 'Error' : 'Information' }}
          </h2>
          <p class="text-gray-700 mb-6">{{ notificationMessage }}</p>
          <button
            @click="closeNotificationModal"
            :class="[
              'w-full px-4 py-2 rounded-lg font-medium transition-colors',
              notificationType === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 
              notificationType === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 
              'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId)
    }
  },
  methods: {
    async loadOrderData() {
      try {
        const orderRef = doc(db, 'orders', this.orderId)
        const orderSnap = await getDoc(orderRef)
        
        if (!orderSnap.exists()) {
          this.toast.error('Order not found')
          this.$router.push('/driver/assignments')
          return
        }

        this.order = {
          id: orderSnap.id,
          ...orderSnap.data()
        }

        // Load customer data if needed
        if (this.order.userId) {
          const userRef = doc(db, 'users', this.order.userId)
          const userSnap = await getDoc(userRef)
          if (userSnap.exists()) {
            this.order.customerData = userSnap.data()
          }
        }
      } catch (error) {
        console.error('[v0] Error loading order:', error)
        this.toast.error('Failed to load order data')
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
        
        // Show more detailed error in console for debugging
        if (error.message && error.message.includes('API key')) {
          console.error('[v0] Google Maps API Key Error:', {
            envKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set' : 'Not Set',
            fallbackKey: 'AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o',
            error: error.message
          })
        }
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
        const directionsService = new window.google.maps.DirectionsService()
        
        // Geocode addresses to get coordinates
        const geocoder = new window.google.maps.Geocoder()
        
        const pickupCoords = await this.geocodeAddress(this.pickupAddress)
        const deliveryCoords = await this.geocodeAddress(this.deliveryAddress)

        // Add pickup marker
        if (pickupCoords) {
          const pickupMarker = new window.google.maps.Marker({
            position: pickupCoords,
            map: this.map,
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#F97316" stroke="white" stroke-width="2"/>
                  <text x="20" y="26" font-size="16" font-weight="bold" fill="white" text-anchor="middle">1</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            },
            title: 'Pickup Location'
          })
          this.markers.push(pickupMarker)
        }

        // Add delivery marker
        if (deliveryCoords) {
          const deliveryMarker = new window.google.maps.Marker({
            position: deliveryCoords,
            map: this.map,
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#9CA3AF" stroke="white" stroke-width="2"/>
                  <path d="M20 12 L20 20 L28 20" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20)
            },
            title: 'Delivery Location'
          })
          this.markers.push(deliveryMarker)
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

          // Update map center if needed
          if (this.map) {
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

    async openChat() {
      if (!this.orderId || !this.order) {
        this.toast.error('Order information not available')
        return
      }

      try {
        this.showChatModal = true
        
        // Get or create chat room
        const userId = this.order.userId
        const driverId = this.authStore.user?.uid
        
        if (!userId || !driverId) {
          this.toast.error('User or driver information not available')
          this.showChatModal = false
          return
        }

        // Get or create chat room
        this.chatId = await chatService.createChatRoom(userId, driverId, this.orderId)
        
        // Set chat partner info
        this.chatPartner = {
          id: userId,
          name: this.order.customerData?.firstName && this.order.customerData?.lastName
            ? `${this.order.customerData.firstName} ${this.order.customerData.lastName}`
            : 'Customer',
          role: 'user',
          phone: this.order.customerData?.phone || this.order.customerData?.contact
        }
      } catch (error) {
        console.error('[v0] Error opening chat:', error)
        this.toast.error('Failed to open chat')
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

                // Update local order status
                this.order.status = 'delivered'

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


