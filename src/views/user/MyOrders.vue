<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
        <p class="text-gray-600">Track and manage your delivery orders</p>
      </div>
      <router-link :to="{ name: 'book-service' }"
                   class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        New Order
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4">
        <select v-model="selectedStatus" @change="filterOrders"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_transit">In Transit</option>
          <option value="on_the_way">On The Way</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select v-model="selectedService" @change="filterOrders"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="">All Services</option>
          <option value="Food Delivery">Food Delivery</option>
          <option value="Bill Payments">Bill Payments</option>
          <option value="Grocery Shopping">Grocery Shopping</option>
          <option value="Gift Delivery">Gift Delivery</option>
          <option value="Medicine Delivery">Medicine Delivery</option>
          <option value="Pick-up & Drop">Pick-up & Drop</option>
        </select>

        <input type="text" v-model="searchQuery" @input="filterOrders"
               placeholder="Search orders..."
               class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
      </div>
    </div>

    <!-- Orders List -->
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        <div class="inline-flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        <p class="text-gray-600 mt-2">Loading orders...</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p class="text-gray-600">No orders found</p>
        <router-link :to="{ name: 'book-service' }"
                     class="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Create Your First Order
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div v-for="order in filteredOrders" :key="order.id"
             class="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">#{{ order.id }}</h3>
                <span :class="getStatusClass(order.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ formatStatus(order.status) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-600">Service</p>
                  <p class="font-medium text-gray-900">{{ order.serviceName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Total Amount</p>
                  <p class="font-medium text-gray-900">₱{{ order.pricing?.total || order.priceEstimate?.total || '0.00' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">From</p>
                  <!-- Include storeAddress for gift delivery orders as a possible pickup location -->
                  <p class="font-medium text-gray-900 truncate">
                    {{ order.pickupAddress
                       || order.formData?.pickupAddress
                       || order.formData?.restaurantAddress
                       || order.formData?.storeAddress }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">To</p>
                  <p class="font-medium text-gray-900 truncate">
                    {{ order.deliveryAddress || order.formData?.deliveryAddress || order.formData?.returnAddress }}
                  </p>
                </div>
              </div>

              <!-- Show chat button when driverId exists, not just when driver object exists -->
              <div v-if="order.driverId || order.driver" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                <img v-if="order.driver" :src="order.driver.avatar" :alt="order.driver.name" class="w-10 h-10 rounded-full">
                <div v-else class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                  D
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ order.driver?.name || 'Driver Assigned' }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="openAddOrderModal(order)"
                          class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          title="Add another order">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                  <button @click="openChatWithDriver(order)"
                          class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          title="Chat with driver">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Live Tracking for orders with driver assigned -->
              <div v-if="(order.status === 'in_transit' || order.status === 'on_the_way' || order.status === 'confirmed') && (order.driverId || order.driver)" class="mb-4">
                <LiveTracking :order-id="order.id" />
              </div>

              <!-- Order Feedback for delivered orders -->
              <div v-if="order.status === 'delivered' && !order.feedback" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-lg font-semibold text-green-800">Order Completed!</h4>
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p class="text-green-700 mb-3">Your order has been successfully delivered!</p>
              </div>

              <!-- Show existing feedback for delivered orders -->
              <div v-if="order.status === 'delivered' && order.feedback" class="mb-4 p-4 bg-gray-50 border rounded-lg">
                <h4 class="text-lg font-semibold text-gray-800 mb-2">Your Feedback</h4>
                <div class="flex items-center mb-2">
                  <div class="flex items-center">
                    <svg v-for="i in 5" :key="i" 
                         :class="i <= order.feedback.rating ? 'text-yellow-400' : 'text-gray-300'"
                         class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span class="ml-2 text-sm text-gray-600">{{ order.feedback.rating }}/5</span>
                  </div>
                </div>
                <p v-if="order.feedback.comment" class="text-gray-700">{{ order.feedback.comment }}</p>
                <p class="text-xs text-gray-500 mt-2">Submitted {{ formatDate(order.feedback.createdAt) }}</p>
              </div>

              <!-- DETAILS -->
              <div v-if="expandedOrderId === order.id" class="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">📋 Complete Order Details</h4>

                <!-- Customer Information -->
                <div class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">👤 Customer Information</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-if="order.formData?.receiverName">
                      <p class="text-sm text-gray-600">Name</p>
                      <p class="font-medium">{{ order.formData.receiverName }}</p>
                    </div>
                    <div v-if="order.formData?.receiverContact">
                      <p class="text-sm text-gray-600">Contact</p>
                      <p class="font-medium">{{ order.formData.receiverContact }}</p>
                    </div>
                    <div v-if="order.formData?.recipientName">
                      <p class="text-sm text-gray-600">Recipient Name</p>
                      <p class="font-medium">{{ order.formData.recipientName }}</p>
                    </div>
                    <div v-if="order.formData?.recipientContact">
                      <p class="text-sm text-gray-600">Recipient Contact</p>
                      <p class="font-medium">{{ order.formData.recipientContact }}</p>
                    </div>
                  </div>
                </div>

                <!-- Pickup Details -->
                <div class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">📍 Pickup Details</h5>
                  <div class="space-y-3">
                    <div v-if="order.formData?.pickupAddress">
                      <p class="text-sm text-gray-600">Pickup Address</p>
                      <p class="font-medium">{{ order.formData.pickupAddress }}</p>
                    </div>
                    <div v-if="order.formData?.restaurantAddress">
                      <p class="text-sm text-gray-600">Restaurant Address</p>
                      <p class="font-medium">{{ order.formData.restaurantAddress }}</p>
                    </div>
                    <div v-if="order.formData?.pickupContact">
                      <p class="text-sm text-gray-600">Pickup Contact</p>
                      <p class="font-medium">{{ order.formData.pickupContact }}</p>
                    </div>
                    <div v-if="order.formData?.preferredPickupDateTime">
                      <p class="text-sm text-gray-600">Preferred Pickup Time</p>
                      <p class="font-medium">{{ order.formData.preferredPickupDateTime }}</p>
                    </div>
                    <!-- Show store name and store address for gift delivery orders -->
                    <div v-if="order.formData?.storeName">
                      <p class="text-sm text-gray-600">Store Name</p>
                      <p class="font-medium">{{ order.formData.storeName }}</p>
                    </div>
                    <div v-if="order.formData?.storeAddress">
                      <p class="text-sm text-gray-600">Store Address</p>
                      <p class="font-medium">{{ order.formData.storeAddress }}</p>
                    </div>
                  </div>
                </div>

                <!-- Delivery Details -->
                <div class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">🚚 Delivery Details</h5>
                  <div class="space-y-3">
                    <div v-if="order.formData?.deliveryAddress">
                      <p class="text-sm text-gray-600">Delivery Address</p>
                      <p class="font-medium">{{ order.formData.deliveryAddress }}</p>
                    </div>
                    <div v-if="order.formData?.dropoffAddress">
                      <p class="text-sm text-gray-600">Dropoff Address</p>
                      <p class="font-medium">{{ order.formData.dropoffAddress }}</p>
                    </div>
                    <div v-if="order.formData?.returnAddress">
                      <p class="text-sm text-gray-600">Return Address</p>
                      <p class="font-medium">{{ order.formData.returnAddress }}</p>
                    </div>
                    <div v-if="order.formData?.landmark">
                      <p class="text-sm text-gray-600">Landmark</p>
                      <p class="font-medium">{{ order.formData.landmark }}</p>
                    </div>
                    <div v-if="order.formData?.preferredDateTime">
                      <p class="text-sm text-gray-600">Preferred Delivery Time</p>
                      <p class="font-medium">{{ order.formData.preferredDateTime }}</p>
                    </div>
                    <div v-if="order.formData?.preferredTime">
                      <p class="text-sm text-gray-600">Preferred Time</p>
                      <p class="font-medium">{{ order.formData.preferredTime }}</p>
                    </div>
                    <div v-if="order.formData?.dueDate">
                      <p class="text-sm text-gray-600">Due Date</p>
                      <p class="font-medium">{{ order.formData.dueDate }}</p>
                    </div>
                  </div>
                </div>

                <!-- Service Details -->
                <div class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">🛍️ Service Details</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-600">Service Type</p>
                      <p class="font-medium">{{ order.serviceName }}</p>
                    </div>
                    <div v-if="order.formData?.restaurantName">
                      <p class="text-sm text-gray-600">Restaurant</p>
                      <p class="font-medium">{{ order.formData.restaurantName }}</p>
                    </div>
                    <div v-if="order.formData?.foodOrderDetails">
                      <p class="text-sm text-gray-600">Food Order Details</p>
                      <p class="font-medium">{{ order.formData.foodOrderDetails }}</p>
                    </div>
                    <div v-if="order.formData?.itemType">
                      <p class="text-sm text-gray-600">Item Type</p>
                      <p class="font-medium">{{ order.formData.itemType }}</p>
                    </div>
                    <div v-if="order.formData?.itemDescription">
                      <p class="text-sm text-gray-600">Item Description</p>
                      <p class="font-medium">{{ order.formData.itemDescription }}</p>
                    </div>
                    <div v-if="order.formData?.quantity">
                      <p class="text-sm text-gray-600">Quantity</p>
                      <p class="font-medium">{{ order.formData.quantity }}</p>
                    </div>
                    <div v-if="order.formData?.giftType">
                      <p class="text-sm text-gray-600">Gift Type</p>
                      <p class="font-medium">{{ order.formData.giftType }}</p>
                    </div>
                    <div v-if="order.formData?.medicineNames">
                      <p class="text-sm text-gray-600">Medicine Names</p>
                      <p class="font-medium">{{ order.formData.medicineNames }}</p>
                    </div>
                  </div>
                </div>

                <!-- Payment & Shopping Details -->
                <div class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">💳 Payment & Shopping Details</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-if="order.formData?.paymentMethod">
                      <p class="text-sm text-gray-600">Payment Method</p>
                      <p class="font-medium">{{ order.formData.paymentMethod }}</p>
                    </div>
                    <div v-if="order.formData?.budgetRange">
                      <p class="text-sm text-gray-600">Budget Range</p>
                      <p class="font-medium">{{ order.formData.budgetRange }}</p>
                    </div>
                    <div v-if="order.formData?.amountToPay">
                      <p class="text-sm text-gray-600">Amount to Pay</p>
                      <p class="font-medium">₱{{ order.formData.amountToPay }}</p>
                    </div>
                    <div v-if="order.formData?.shoppingList">
                      <p class="text-sm text-gray-600">Shopping List</p>
                      <p class="font-medium whitespace-pre-line">{{ order.formData.shoppingList }}</p>
                    </div>
                    <div v-if="order.formData?.storePreference">
                      <p class="text-sm text-gray-600">Store Preference</p>
                      <p class="font-medium">{{ order.formData.storePreference }}</p>
                    </div>
                    <div v-if="order.formData?.billerName">
                      <p class="text-sm text-gray-600">Biller Name</p>
                      <p class="font-medium">{{ order.formData.billerName }}</p>
                    </div>
                    <div v-if="order.formData?.accountNumber">
                      <p class="text-sm text-gray-600">Account Number</p>
                      <p class="font-medium">{{ order.formData.accountNumber }}</p>
                    </div>
                    <div v-if="order.formData?.accountName">
                      <p class="text-sm text-gray-600">Account Name</p>
                      <p class="font-medium">{{ order.formData.accountName }}</p>
                    </div>
                  </div>
                </div>

                <!-- Attachments -->
                <div v-if="order.formData?.billReceiptUrl || order.formData?.prescriptionUrl"
                     class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">📎 Attachments</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Bill Receipt -->
                    <div v-if="order.formData?.billReceiptUrl">
                      <p class="text-sm text-gray-600 mb-1">Bill Receipt / Reference</p>
                      <div class="space-y-2">
                        <a :href="order.formData.billReceiptUrl" target="_blank" rel="noopener"
                           class="inline-flex items-center text-blue-600 underline">
                          {{ fileNameFromUrl(order.formData.billReceiptUrl) || 'Open file' }}
                        </a>
                        <div v-if="isImageUrl(order.formData.billReceiptUrl)" class="mt-2">
                          <img :src="order.formData.billReceiptUrl" alt="Bill receipt"
                               class="max-w-xs w-full rounded-lg border" />
                        </div>
                      </div>
                    </div>

                    <!-- Prescription -->
                    <div v-if="order.formData?.prescriptionUrl">
                      <p class="text-sm text-gray-600 mb-1">Prescription</p>
                      <div class="space-y-2">
                        <a :href="order.formData.prescriptionUrl" target="_blank" rel="noopener"
                           class="inline-flex items-center text-blue-600 underline">
                          {{ fileNameFromUrl(order.formData.prescriptionUrl) || 'Open file' }}
                        </a>
                        <div v-if="isImageUrl(order.formData.prescriptionUrl)" class="mt-2">
                          <img :src="order.formData.prescriptionUrl" alt="Prescription"
                               class="max-w-xs w-full rounded-lg border" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Information -->
                <div class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">ℹ️ Additional Information</h5>
                  <div class="space-y-3">
                    <div v-if="order.formData?.specialInstructions">
                      <p class="text-sm text-gray-600">Special Instructions</p>
                      <p class="font-medium whitespace-pre-line">{{ order.formData.specialInstructions }}</p>
                    </div>
                    <div v-if="order.formData?.preferredSchedule">
                      <p class="text-sm text-gray-600">Preferred Schedule</p>
                      <p class="font-medium">{{ order.formData.preferredSchedule }}</p>
                    </div>
                  </div>
                </div>

                <!-- Route Info -->
                <div v-if="order.routeInfo" class="mb-6 p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">🗺️ Route Information</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-if="order.routeInfo.distance">
                      <p class="text-sm text-gray-600">Distance</p>
                      <p class="font-medium">{{ order.routeInfo.distance }}</p>
                    </div>
                    <div v-if="order.routeInfo.duration">
                      <p class="text-sm text-gray-600">Estimated Duration</p>
                      <p class="font-medium">{{ order.routeInfo.duration }}</p>
                    </div>
                  </div>
                </div>

                <!-- Price Breakdown -->
                <div v-if="order.pricing || order.priceEstimate" class="p-4 bg-white rounded-lg border">
                  <h5 class="text-md font-semibold text-gray-800 mb-3">💰 Price Breakdown</h5>
                  <div class="space-y-2">
                    <div v-if="order.pricing?.baseCharge || order.priceEstimate?.base" class="flex justify-between">
                      <span class="text-gray-600">Base Charge:</span>
                      <span class="font-medium">₱{{ order.pricing?.baseCharge || order.priceEstimate?.base }}</span>
                    </div>
                    <div v-if="order.pricing?.distanceFee || order.priceEstimate?.distance" class="flex justify-between">
                      <span class="text-gray-600">Distance Fee:</span>
                      <span class="font-medium">₱{{ order.pricing?.distanceFee || order.priceEstimate?.distance }}</span>
                    </div>
                    <div v-if="order.pricing?.badWeatherFee" class="flex justify-between">
                      <span class="text-gray-600">Bad Weather Surcharge:</span>
                      <span class="font-medium">₱{{ order.pricing?.badWeatherFee }}</span>
                    </div>
                    <div v-if="order.pricing?.gcashFee || order.priceEstimate?.urgency" class="flex justify-between">
                      <span class="text-gray-600">GCash Fee:</span>
                      <span class="font-medium">₱{{ order.pricing?.gcashFee || order.priceEstimate?.urgency }}</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₱{{ order.pricing?.total || order.priceEstimate?.total }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Row actions -->
              <div class="flex items-center justify-between text-sm text-gray-600">
                <span>{{ formatDate(order.createdAt) }}</span>
                <div class="flex items-center space-x-3">
                  <button @click="viewOrder(order.id)"
                          class="text-blue-600 hover:text-blue-800 font-medium">
                    {{ expandedOrderId === order.id ? 'Hide Details' : 'View Details' }}
                  </button>

                  <!-- Cancel button with live timer -->
                  <template v-if="order.status === 'pending'">
                    <button
                      v-if="canCancel(order)"
                      @click="showCancelModal(order.id)"
                      class="text-red-600 hover:text-red-800 font-medium disabled:text-gray-400"
                    >
                      Cancel ({{ cancelCountdowns[order.id] ?? 0 }}s)
                    </button>
                    <span v-else class="text-gray-400 cursor-not-allowed select-none">
                      Cancel (expired)
                    </span>
                  </template>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2">
      <button @click="currentPage--" :disabled="currentPage === 1"
              class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
        Previous
      </button>
      <span class="px-3 py-2 text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed">
        Next
      </button>
    </div>

    <!-- Cancel Order Modal - timer now mirrors the button timer -->
    <div v-if="showCancelDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>

        <div class="mb-4 p-3 rounded-lg"
             :class="modalRemaining > 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'">
          <div class="flex items-center justify-between">
            <span class="font-medium" :class="modalRemaining > 0 ? 'text-red-800' : 'text-gray-700'">
              Cancellation Timer:
            </span>
            <span class="font-bold text-xl"
                  :class="modalRemaining > 0 ? 'text-red-600' : 'text-gray-600'">
              {{ modalRemaining }}s
            </span>
          </div>
          <div class="w-full rounded-full h-2 mt-2"
               :class="modalRemaining > 0 ? 'bg-red-200' : 'bg-gray-200'">
            <div class="h-2 rounded-full transition-all duration-300"
                 :class="modalRemaining > 0 ? 'bg-red-600' : 'bg-gray-500'"
                 :style="{ width: `${(modalRemaining / 30) * 100}%` }"></div>
          </div>
          <p v-if="modalRemaining <= 0" class="text-xs text-gray-500 mt-2">
            Cancellation window has expired. You can no longer cancel this order.
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Reason for cancellation <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2 mb-3">
            <label v-for="reason in cancelReasons" :key="reason.value"
                   class="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" :value="reason.value" v-model="selectedCancelReason"
                     class="mr-3 text-red-600 focus:ring-red-500 cursor-pointer">
              <span class="text-sm text-gray-700">{{ reason.label }}</span>
            </label>
          </div>

          <div v-if="selectedCancelReason === 'others'" class="mt-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">Please specify your reason:</label>
            <textarea v-model="customCancelReason"
                      placeholder="Please provide your specific reason for cancelling..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                      rows="3" required></textarea>
          </div>

          <p v-if="!isReasonValid && selectedCancelReason" class="text-red-500 text-sm mt-2">
            Please complete your reason for cancellation
          </p>
        </div>

        <div class="flex space-x-3">
          <button @click="confirmCancelOrder"
                  :disabled="!isReasonValid || cancelling || modalRemaining <= 0"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            <span v-if="cancelling">Cancelling...</span>
            <span v-else-if="modalRemaining <= 0">Time's up</span>
            <span v-else-if="!isReasonValid">Select Reason</span>
            <span v-else>Confirm Cancel</span>
          </button>
          <button @click="closeCancelModal" :disabled="cancelling"
                  class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            Close
          </button>
        </div>

        <p class="text-xs text-gray-500 mt-3 text-center">
          You can only cancel within 30 seconds after placing the order.
        </p>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div v-if="showFeedbackDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Rate Your Experience</h3>
        
        <!-- Rating Stars -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
          <div class="flex items-center space-x-1">
            <button v-for="i in 5" :key="i"
                    @click="feedbackRating = i"
                    :class="i <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'"
                    class="w-8 h-8 hover:text-yellow-400 transition-colors">
              <svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ getRatingText(feedbackRating) }}</p>
        </div>

        <!-- Service Categories -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Rate Service Aspects</label>
          <div class="space-y-3">
            <div v-for="aspect in serviceAspects" :key="aspect.key" class="flex items-center justify-between">
              <span class="text-sm text-gray-700">{{ aspect.label }}</span>
              <div class="flex items-center space-x-1">
                <button v-for="i in 5" :key="i"
                        @click="feedbackAspects[aspect.key] = i"
                        :class="i <= (feedbackAspects[aspect.key] || 0) ? 'text-yellow-400' : 'text-gray-300'"
                        class="w-5 h-5 hover:text-yellow-400 transition-colors">
                  <svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Comment -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Additional Comments (Optional)</label>
          <textarea v-model="feedbackComment"
                    placeholder="Tell us about your experience..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    rows="3"></textarea>
        </div>

        <!-- Quick Feedback Tags -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Quick Tags (Optional)</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="tag in feedbackTags" :key="tag"
                    @click="toggleFeedbackTag(tag)"
                    :class="selectedTags.includes(tag) ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'"
                    class="px-3 py-1 text-sm border rounded-full hover:bg-green-50 transition-colors">
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <button @click="submitFeedback"
                  :disabled="!feedbackRating || submittingFeedback"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            <span v-if="submittingFeedback">Submitting...</span>
            <span v-else>Submit Feedback</span>
          </button>
          <button @click="closeFeedbackModal" :disabled="submittingFeedback"
                  class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Modal -->
    <div v-if="showChatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div class="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">D</span>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Chat with Driver</h2>
              <p class="text-sm text-gray-600">{{ chatPartner?.name || 'Driver' }}</p>
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
            v-if="chatId && chatOrderId"
            :chat-id="chatId"
            :order-id="chatOrderId"
            :chat-partner="chatPartner"
            :is-driver="false"
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

    <!-- Add Order Modal -->
    <div v-if="showAddOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" @click.self="closeAddOrderModal">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 relative" @click.stop>
        <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <h2 class="text-xl font-semibold text-gray-900">Add Another Order</h2>
          <button 
            type="button"
            @click="closeAddOrderModal" 
            class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded p-1 relative z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <form @submit.prevent="submitAdditionalOrder" @submit.stop class="space-y-4">
            <!-- Service Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
              <select 
                v-model="additionalOrderForm.serviceId" 
                required
                @change="onAdditionalServiceChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a service</option>
                <option value="food-delivery">Food Delivery</option>
                <option value="bill-payments">Bill Payments</option>
                <option value="grocery-shopping">Grocery Shopping</option>
                <option value="gift-delivery">Gift Delivery</option>
                <option value="medicine-delivery">Medicine Delivery</option>
                <option value="pickup-drop">Pick-up & Drop</option>
              </select>
            </div>

            <!-- Dynamic Form Fields based on selected service -->
            <div v-if="additionalOrderForm.serviceId" class="space-y-4 border-t pt-4">
              <!-- Food Delivery Fields -->
              <template v-if="additionalOrderForm.serviceId === 'food-delivery'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                    <input type="text" v-model.trim="additionalOrderForm.restaurantName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Restaurant Address *</label>
                    <input 
                      type="text" 
                      v-model.trim="additionalOrderForm.restaurantAddress" 
                      required 
                      ref="additionalRestaurantAddressInput"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Food Order Details *</label>
                  <textarea v-model.trim="additionalOrderForm.foodOrderDetails" rows="3" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                  <select v-model="additionalOrderForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select budget range</option>
                    <option value="P1-P499">₱1 - ₱499</option>
                    <option value="P500-P999">₱500 - ₱999</option>
                    <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                    <option value="P2000+">₱2,000+</option>
                  </select>
                </div>
              </template>

              <!-- Bill Payments Fields -->
              <template v-if="additionalOrderForm.serviceId === 'bill-payments'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Biller Name *</label>
                    <input type="text" v-model.trim="additionalOrderForm.billerName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                    <input type="text" v-model.trim="additionalOrderForm.accountNumber" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Amount to Pay *</label>
                  <input type="number" v-model.number="additionalOrderForm.amountToPay" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                  <select v-model="additionalOrderForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select budget range</option>
                    <option value="P1-P499">₱1 - ₱499</option>
                    <option value="P500-P999">₱500 - ₱999</option>
                    <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                    <option value="P2000+">₱2,000+</option>
                  </select>
                </div>
              </template>

              <!-- Grocery Shopping Fields -->
              <template v-if="additionalOrderForm.serviceId === 'grocery-shopping'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Shopping List *</label>
                  <textarea v-model.trim="additionalOrderForm.shoppingList" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                  <select v-model="additionalOrderForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select budget range</option>
                    <option value="P1-P499">₱1 - ₱499</option>
                    <option value="P500-P999">₱500 - ₱999</option>
                    <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                    <option value="P2000+">₱2,000+</option>
                  </select>
                </div>
              </template>

              <!-- Gift Delivery Fields -->
              <template v-if="additionalOrderForm.serviceId === 'gift-delivery'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Gift Type *</label>
                  <input type="text" v-model.trim="additionalOrderForm.giftType" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
                    <input type="text" v-model.trim="additionalOrderForm.storeName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Store Address *</label>
                    <input 
                      type="text" 
                      v-model.trim="additionalOrderForm.storeAddress" 
                      required 
                      ref="additionalStoreAddressInput"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                  <select v-model="additionalOrderForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select budget range</option>
                    <option value="P1-P499">₱1 - ₱499</option>
                    <option value="P500-P999">₱500 - ₱999</option>
                    <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                    <option value="P2000+">₱2,000+</option>
                  </select>
                </div>
              </template>

              <!-- Medicine Delivery Fields -->
              <template v-if="additionalOrderForm.serviceId === 'medicine-delivery'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Medicine Names *</label>
                  <textarea v-model.trim="additionalOrderForm.medicineNames" rows="3" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                  <input type="text" v-model.trim="additionalOrderForm.quantity" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                  <select v-model="additionalOrderForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select budget range</option>
                    <option value="P1-P499">₱1 - ₱499</option>
                    <option value="P500-P999">₱500 - ₱999</option>
                    <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                    <option value="P2000+">₱2,000+</option>
                  </select>
                </div>
              </template>

              <!-- Pick-up & Drop Fields -->
              <template v-if="additionalOrderForm.serviceId === 'pickup-drop'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pick-up Address *</label>
                    <input 
                      type="text" 
                      v-model.trim="additionalOrderForm.pickupAddress" 
                      required 
                      ref="additionalPickupAddressInput"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Drop-off Address *</label>
                    <input 
                      type="text" 
                      v-model.trim="additionalOrderForm.dropoffAddress" 
                      required 
                      ref="additionalDropoffAddressInput"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Item Description *</label>
                  <textarea v-model.trim="additionalOrderForm.itemDescription" rows="3" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                  <select v-model="additionalOrderForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select budget range</option>
                    <option value="P1-P499">₱1 - ₱499</option>
                    <option value="P500-P999">₱500 - ₱999</option>
                    <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                    <option value="P2000+">₱2,000+</option>
                  </select>
                </div>
              </template>

              <!-- Payment Method -->
              <div class="border-t pt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                <div class="space-y-2">
                  <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <input 
                      type="radio" 
                      v-model="additionalOrderForm.paymentMethod" 
                      value="GCASH"
                      @click.stop
                      class="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer" 
                    />
                    <span class="ml-2 text-sm text-gray-700">GCash</span>
                  </label>
                  <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <input 
                      type="radio" 
                      v-model="additionalOrderForm.paymentMethod" 
                      value="COD"
                      @click.stop
                      class="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer" 
                    />
                    <span class="ml-2 text-sm text-gray-700">Cash on Delivery (COD)</span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-2">Note: Additional orders are fixed at ₱55 regardless of payment method.</p>
              </div>
            </div>

            <div v-if="additionalOrderError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {{ additionalOrderError }}
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                @click="closeAddOrderModal" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                @click="submitAdditionalOrder"
                :disabled="submittingAdditionalOrder || !additionalOrderForm.serviceId"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer relative z-10 font-medium"
              >
                {{ submittingAdditionalOrder ? 'Adding Order...' : 'Add Order' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" @click.self="closeNotificationModal" style="z-index: 9999 !important;">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative" @click.stop style="z-index: 10000 !important;">
        <div class="flex items-center mb-4">
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center mr-4',
            notificationType === 'success' ? 'bg-green-100' : 
            notificationType === 'error' ? 'bg-red-100' : 
            'bg-blue-100'
          ]">
            <svg 
              v-if="notificationType === 'success'"
              class="w-6 h-6 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg 
              v-else-if="notificationType === 'error'"
              class="w-6 h-6 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <svg 
              v-else-if="notificationType === 'warning'"
              class="w-6 h-6 text-yellow-600"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <svg 
              v-else
              class="w-6 h-6 text-blue-600"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 :class="[
            'text-lg font-semibold',
            notificationType === 'success' ? 'text-green-900' : 
            notificationType === 'error' ? 'text-red-900' : 
            'text-blue-900'
          ]">
            {{ notificationType === 'success' ? 'Success' : notificationType === 'error' ? 'Error' : 'Information' }}
          </h3>
        </div>
        <p class="text-gray-700 mb-6">{{ notificationMessage }}</p>
        <div class="flex justify-end">
          <button
            @click="closeNotificationModal"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
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
import { realtimeService } from '@/services/realtime'
import { useAuthStore } from '@/stores/auth'
import { db } from '@/firebase/config'
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import LiveTracking from '@/components/LiveTracking.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import { chatService } from '@/services/chatService'

export default {
  name: 'MyOrders',
  components: {
    LiveTracking,
    ChatWindow
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: true,
      selectedStatus: '',
      selectedService: '',
      searchQuery: '',
      currentPage: 1,
      ordersPerPage: 10,
      expandedOrderId: null,

      // cancel modal state
      showCancelDialog: false,
      cancelOrderId: null,
      selectedCancelReason: '',
      customCancelReason: '',
      cancelReasons: [
        { value: 'changed_mind', label: 'Changed my mind' },
        { value: 'better_price', label: 'Found a better price elsewhere' },
        { value: 'emergency', label: 'Emergency came up' },
        { value: 'wrong_address', label: 'Wrong address provided' },
        { value: 'no_longer_needed', label: 'No longer need the service' },
        { value: 'delivery_time', label: 'Delivery time is too long' },
        { value: 'payment_issues', label: 'Payment issues' },
        { value: 'others', label: 'Others (please specify)' }
      ],
      cancelling: false,

      // ⏱ per-order cancellation timers (seconds remaining)
      cancelCountdowns: {}, // { [orderId]: secondsRemaining }
      timersInterval: null,

      // feedback modal state
      showFeedbackDialog: false,
      feedbackOrderId: null,
      feedbackRating: 0,
      feedbackComment: '',
      feedbackAspects: {},
      selectedTags: [],
      submittingFeedback: false,

      // chat modal state
      showChatModal: false,
      chatOrderId: null,
      chatId: null,
      chatPartner: null,

      // add order modal state
      showAddOrderModal: false,
      addOrderToOrderId: null,
      additionalOrderForm: {
        serviceId: '',
        paymentMethod: 'COD',
        restaurantName: '',
        restaurantAddress: '',
        foodOrderDetails: '',
        budgetRange: '',
        billerName: '',
        accountNumber: '',
        amountToPay: '',
        shoppingList: '',
        giftType: '',
        storeName: '',
        storeAddress: '',
        medicineNames: '',
        quantity: '',
        pickupAddress: '',
        dropoffAddress: '',
        itemDescription: ''
      },
      submittingAdditionalOrder: false,
      additionalOrderError: '',

      // notification modal state
      showNotificationModal: false,
      notificationType: 'success',
      notificationMessage: '',
      serviceAspects: [
        { key: 'timeliness', label: 'Timeliness' },
        { key: 'communication', label: 'Communication' },
        { key: 'professionalism', label: 'Professionalism' },
        { key: 'service_quality', label: 'Service Quality' }
      ],
      feedbackTags: [
        'Fast Delivery', 'Professional Driver', 'Great Communication', 
        'On Time', 'Careful Handling', 'Friendly Service', 
        'Clean Vehicle', 'Easy to Contact'
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.ordersPerPage)
    },
    isReasonValid() {
      if (!this.selectedCancelReason) return false
      if (this.selectedCancelReason === 'others') {
        return this.customCancelReason.trim().length > 0
      }
      return true
    },
    // remaining seconds for the order currently open in the modal
    modalRemaining() {
      return this.cancelOrderId ? (this.cancelCountdowns[this.cancelOrderId] ?? 0) : 0
    }
  },
  async mounted() {
    await this.loadOrders()
    this.loadGoogleMapsAPI()
  },
  beforeUnmount() {
    realtimeService.unsubscribe(`user_orders_${this.authStore.user.uid}`)
    if (this.timersInterval) clearInterval(this.timersInterval)
  },
  methods: {
    // ====== ATTACHMENT HELPERS ======
    isImageUrl(url) {
      if (!url) return false
      const u = url.toLowerCase()
      return u.includes('.png') || u.includes('.jpg') || u.includes('.jpeg') || u.includes('.gif') || u.includes('.webp')
    },
    fileNameFromUrl(url) {
      try {
        const clean = url.split('?')[0]
        return decodeURIComponent(clean.substring(clean.lastIndexOf('/') + 1))
      } catch (e) { return '' }
    },

    // ====== CANCEL TIMER CORE ======
    getCreatedAtMs(order) {
      const ts = order.createdAt
      if (!ts) return null
      try {
        if (typeof ts.toDate === 'function') return ts.toDate().getTime()
        // support string/number fallback
        const d = new Date(ts)
        return isNaN(d.getTime()) ? null : d.getTime()
      } catch {
        return null
      }
    },
    recomputeCountdowns() {
      const now = Date.now()
      const next = {}
      for (const o of this.orders) {
        if (o.status !== 'pending') continue
        const createdMs = this.getCreatedAtMs(o)
        if (!createdMs) continue
        const expireAt = createdMs + 30 * 1000
        const remaining = Math.max(0, Math.floor((expireAt - now) / 1000))
        next[o.id] = remaining
      }
      this.cancelCountdowns = next
    },
    setupCancelTimers() {
      // compute immediately
      this.recomputeCountdowns()
      // start a single 1s interval (idempotent)
      if (this.timersInterval) return
      this.timersInterval = setInterval(() => {
        this.recomputeCountdowns()
      }, 1000)
    },
    canCancel(order) {
      if (order.status !== 'pending') return false
      const remain = this.cancelCountdowns[order.id] ?? 0
      return remain > 0
    },

    // ====== CANCEL MODAL ======
    showCancelModal(orderId) {
      this.cancelOrderId = orderId
      this.showCancelDialog = true
      this.selectedCancelReason = ''
      this.customCancelReason = ''
    },
    closeCancelModal() {
      this.showCancelDialog = false
      this.cancelOrderId = null
      this.selectedCancelReason = ''
      this.customCancelReason = ''
    },
    async confirmCancelOrder() {
      // hard-stop if window expired (security on client)
      if (this.modalRemaining <= 0) {
        alert('Cancellation window has expired.')
        return
      }
      if (!this.isReasonValid) {
        alert('Please select a reason for cancellation')
        return
      }
      this.cancelling = true
      try {
        const reason = this.selectedCancelReason === 'others'
          ? this.customCancelReason.trim()
          : (this.cancelReasons.find(r => r.value === this.selectedCancelReason)?.label || this.selectedCancelReason)

        const orderRef = doc(db, 'orders', this.cancelOrderId)
        await updateDoc(orderRef, {
          status: 'cancelled',
          cancellationReason: reason,
          cancelledAt: serverTimestamp()
        })

        const idx = this.orders.findIndex(o => o.id === this.cancelOrderId)
        if (idx !== -1) {
          this.orders[idx].status = 'cancelled'
          this.orders[idx].cancellationReason = reason
          this.orders[idx].cancelledAt = new Date()
        }
        this.filterOrders()
        alert('Order cancelled successfully!')
        this.closeCancelModal()
      } catch (error) {
        console.error('Error cancelling order:', error)
        let msg = 'Error cancelling order. Please try again.'
        if (error.code === 'permission-denied') msg = 'Permission denied. Please contact support.'
        else if (error.code === 'not-found') msg = 'Order not found.'
        else if (error.code === 'unavailable') msg = 'Service temporarily unavailable. Try again later.'
        alert(msg)
      } finally {
        this.cancelling = false
      }
    },

    // ====== FEEDBACK MODAL ======
    showFeedbackModal(orderId) {
      this.feedbackOrderId = orderId
      this.showFeedbackDialog = true
      this.feedbackRating = 0
      this.feedbackComment = ''
      this.feedbackAspects = {}
      this.selectedTags = []
    },

    closeFeedbackModal() {
      this.showFeedbackDialog = false
      this.feedbackOrderId = null
      this.feedbackRating = 0
      this.feedbackComment = ''
      this.feedbackAspects = {}
      this.selectedTags = []
    },

    toggleFeedbackTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(tag)
      }
    },

    getRatingText(rating) {
      const texts = {
        1: 'Poor',
        2: 'Fair', 
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      }
      return texts[rating] || 'Select a rating'
    },

    async submitFeedback() {
      if (!this.feedbackRating) {
        alert('Please provide a rating')
        return
      }

      this.submittingFeedback = true
      try {
        const feedbackData = {
          rating: this.feedbackRating,
          comment: this.feedbackComment.trim(),
          aspects: this.feedbackAspects,
          tags: this.selectedTags,
          createdAt: serverTimestamp(),
          userId: this.authStore.user.uid
        }

        const orderRef = doc(db, 'orders', this.feedbackOrderId)
        await updateDoc(orderRef, {
          feedback: feedbackData,
          updatedAt: serverTimestamp()
        })

        // Update local order
        const orderIndex = this.orders.findIndex(o => o.id === this.feedbackOrderId)
        if (orderIndex !== -1) {
          this.orders[orderIndex].feedback = {
            ...feedbackData,
            createdAt: new Date()
          }
        }
        this.filterOrders()

        alert('Thank you for your feedback!')
        this.closeFeedbackModal()
      } catch (error) {
        console.error('Error submitting feedback:', error)
        alert('Error submitting feedback. Please try again.')
      } finally {
        this.submittingFeedback = false
      }
    },

    async openChatWithDriver(order) {
      console.log('[v0] Opening chat for order:', order.id, 'driverId:', order.driverId)
      
      if (!order.driverId && !order.driver) {
        this.$toast?.error?.('No driver assigned to this order yet')
        return
      }

      try {
        const driverId = order.driverId || order.driver?.uid
        
        if (!driverId) {
          this.$toast?.error?.('Driver information not available')
          return
        }

        // Create or get chat room with driver
        const chatRoomId = await chatService.createChatRoom(
          this.authStore.user.uid,
          driverId,
          order.id
        )

        console.log('[v0] Chat room created/retrieved:', chatRoomId)

        // Set chat modal state
        this.chatOrderId = order.id
        this.chatId = chatRoomId
        
        // Set chat partner info
        this.chatPartner = {
          id: driverId,
          name: order.driver?.name || 'Driver',
          role: 'driver',
          phone: order.driver?.phone || ''
        }

        // Show chat modal
        this.showChatModal = true
      } catch (error) {
        console.error('[v0] Error opening chat:', error)
        this.$toast?.error?.('Error opening chat. Please try again.')
      }
    },

    // ====== ADD ORDER MODAL ======
    openAddOrderModal(order) {
      if (!order.driverId && !order.driver) {
        this.showNotification('error', 'No driver assigned to this order yet. Please wait for driver assignment.')
        return
      }
      this.addOrderToOrderId = order.id
      this.showAddOrderModal = true
      this.additionalOrderError = ''
      // Reset form
      this.additionalOrderForm = {
        serviceId: '',
        paymentMethod: 'COD',
        restaurantName: '',
        restaurantAddress: '',
        foodOrderDetails: '',
        budgetRange: '',
        billerName: '',
        accountNumber: '',
        amountToPay: '',
        shoppingList: '',
        giftType: '',
        storeName: '',
        storeAddress: '',
        medicineNames: '',
        quantity: '',
        pickupAddress: '',
        dropoffAddress: '',
        itemDescription: ''
      }
      
      // Initialize autocomplete after modal opens
      this.$nextTick(() => {
        if (this.mapsReady) {
          this.initializeAdditionalOrderAutocomplete()
        }
      })
    },

    closeAddOrderModal() {
      console.log('[MyOrders] Closing Add Order Modal')
      
      // Clean up autocomplete instances
      if (this.additionalOrderAutocompleteInstances) {
        Object.values(this.additionalOrderAutocompleteInstances).forEach(ac => {
          if (ac && typeof ac.setPlace === 'function') {
            ac.setPlace(null)
          }
        })
        this.additionalOrderAutocompleteInstances = {}
      }
      
      // Close the modal immediately
      this.showAddOrderModal = false
      this.addOrderToOrderId = null
      this.additionalOrderError = ''
      
      // Reset form
      this.additionalOrderForm = {
        serviceId: '',
        paymentMethod: 'COD',
        restaurantName: '',
        restaurantAddress: '',
        foodOrderDetails: '',
        budgetRange: '',
        billerName: '',
        accountNumber: '',
        amountToPay: '',
        shoppingList: '',
        giftType: '',
        storeName: '',
        storeAddress: '',
        medicineNames: '',
        quantity: '',
        pickupAddress: '',
        dropoffAddress: '',
        itemDescription: ''
      }
    },

    onAdditionalServiceChange() {
      // Reset form fields when service changes
      this.additionalOrderForm = {
        ...this.additionalOrderForm,
        restaurantName: '',
        restaurantAddress: '',
        foodOrderDetails: '',
        billerName: '',
        accountNumber: '',
        amountToPay: '',
        shoppingList: '',
        giftType: '',
        storeName: '',
        storeAddress: '',
        medicineNames: '',
        quantity: '',
        pickupAddress: '',
        dropoffAddress: '',
        itemDescription: ''
      }
    },

    async submitAdditionalOrder() {
      this.additionalOrderError = ''
      
      if (!this.addOrderToOrderId) {
        this.additionalOrderError = 'Order ID is missing'
        this.showNotification('error', 'Order ID is missing. Please try again.')
        return
      }

      if (!this.additionalOrderForm.serviceId) {
        this.additionalOrderError = 'Please select a service type'
        this.showNotification('error', 'Please select a service type')
        return
      }

      // Validate required fields based on service
      const serviceId = this.additionalOrderForm.serviceId
      const form = this.additionalOrderForm

      if (serviceId === 'food-delivery') {
        if (!form.restaurantName || !form.restaurantAddress || !form.foodOrderDetails || !form.budgetRange) {
          this.additionalOrderError = 'Please fill all required fields for Food Delivery'
          this.showNotification('error', 'Please fill all required fields for Food Delivery')
          return
        }
      } else if (serviceId === 'bill-payments') {
        if (!form.billerName || !form.accountNumber || !form.amountToPay || !form.budgetRange) {
          this.additionalOrderError = 'Please fill all required fields for Bill Payments'
          this.showNotification('error', 'Please fill all required fields for Bill Payments')
          return
        }
      } else if (serviceId === 'grocery-shopping') {
        if (!form.shoppingList || !form.budgetRange) {
          this.additionalOrderError = 'Please fill all required fields for Grocery Shopping'
          this.showNotification('error', 'Please fill all required fields for Grocery Shopping')
          return
        }
      } else if (serviceId === 'gift-delivery') {
        if (!form.giftType || !form.storeName || !form.storeAddress || !form.budgetRange) {
          this.additionalOrderError = 'Please fill all required fields for Gift Delivery'
          this.showNotification('error', 'Please fill all required fields for Gift Delivery')
          return
        }
      } else if (serviceId === 'medicine-delivery') {
        if (!form.medicineNames || !form.quantity || !form.budgetRange) {
          this.additionalOrderError = 'Please fill all required fields for Medicine Delivery'
          this.showNotification('error', 'Please fill all required fields for Medicine Delivery')
          return
        }
      } else if (serviceId === 'pickup-drop') {
        if (!form.pickupAddress || !form.dropoffAddress || !form.itemDescription || !form.budgetRange) {
          this.additionalOrderError = 'Please fill all required fields for Pick-up & Drop'
          this.showNotification('error', 'Please fill all required fields for Pick-up & Drop')
          return
        }
      }

      this.submittingAdditionalOrder = true

      try {
        const orderRef = doc(db, 'orders', this.addOrderToOrderId)
        const orderDoc = await getDoc(orderRef)
        
        if (!orderDoc.exists()) {
          this.submittingAdditionalOrder = false
          this.additionalOrderError = 'Order not found'
          this.showNotification('error', 'Order not found. Please try again.')
          return
        }

        const orderData = orderDoc.data()
        
        // Get service name
        const serviceNames = {
          'food-delivery': 'Food Delivery',
          'bill-payments': 'Bill Payments',
          'grocery-shopping': 'Grocery Shopping',
          'gift-delivery': 'Gift Delivery',
          'medicine-delivery': 'Medicine Delivery',
          'pickup-drop': 'Pick-up & Drop'
        }

        // Calculate route and pricing for additional order (similar to BookService)
        let routeInfo = { distance: 'N/A', duration: 'N/A', distanceValue: 0, durationValue: 0 }
        let pricing = { baseCharge: 55, distanceFee: 0, badWeatherFee: 0, gcashFee: 0, subtotal: 55, total: 55 }
        
        // Try to calculate route if addresses are available
        if (this.mapsReady && window.google && window.google.maps) {
          try {
            const directionsService = new window.google.maps.DirectionsService()
            let origin = ''
            let destination = ''
            
            switch (serviceId) {
              case 'food-delivery':
                origin = form.restaurantAddress
                destination = orderData.deliveryAddress || orderData.formData?.deliveryAddress
                break
              case 'bill-payments':
                origin = form.pickupAddress || orderData.pickupAddress
                destination = form.returnAddress || orderData.deliveryAddress
                break
              case 'pickup-drop':
                origin = form.pickupAddress
                destination = form.dropoffAddress
                break
              default:
                origin = orderData.pickupAddress || ''
                destination = orderData.deliveryAddress || orderData.formData?.deliveryAddress || ''
            }
            
            if (origin && destination) {
              await new Promise((resolve) => {
                directionsService.route(
                  {
                    origin,
                    destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    unitSystem: window.google.maps.UnitSystem.METRIC
                  },
                  (response, status) => {
                    if (status === 'OK') {
                      const leg = response.routes[0].legs[0]
                      const distanceInKm = leg.distance.value / 1000
                      const formattedDistance = distanceInKm < 1 
                        ? `${Math.round(leg.distance.value)} m` 
                        : `${distanceInKm.toFixed(2)} km`
                      const durationInMinutes = Math.round(leg.duration.value / 60)
                      const formattedDuration = durationInMinutes < 60
                        ? `${durationInMinutes} min`
                        : `${Math.floor(durationInMinutes / 60)}h ${durationInMinutes % 60} min`
                      
                      routeInfo = {
                        distance: formattedDistance,
                        duration: formattedDuration,
                        distanceValue: leg.distance.value,
                        durationValue: leg.duration.value
                      }
                      
                      // Fixed ₱55 for additional orders (not based on budget range, distance, or payment method)
                      // Always ₱55 regardless of payment method
                      pricing = {
                        baseCharge: 55,
                        distanceFee: 0,
                        badWeatherFee: 0,
                        gcashFee: 0,
                        subtotal: 55,
                        total: 55
                      }
                    }
                    resolve()
                  }
                )
              })
            }
          } catch (error) {
            console.error('Error calculating route for additional order:', error)
          }
        }
        
        // Determine pickup and delivery addresses
        let pickupAddress = ''
        let deliveryAddress = ''
        switch (serviceId) {
          case 'food-delivery':
            pickupAddress = form.restaurantAddress
            deliveryAddress = orderData.deliveryAddress || orderData.formData?.deliveryAddress || ''
            break
          case 'bill-payments':
            pickupAddress = form.pickupAddress || orderData.pickupAddress || ''
            deliveryAddress = form.returnAddress || orderData.deliveryAddress || ''
            break
          case 'pickup-drop':
            pickupAddress = form.pickupAddress
            deliveryAddress = form.dropoffAddress
            break
          default:
            pickupAddress = orderData.pickupAddress || ''
            deliveryAddress = orderData.deliveryAddress || orderData.formData?.deliveryAddress || ''
        }
        
        // Create additional order data (same structure as BookService)
        const additionalOrder = {
          serviceId: serviceId,
          serviceName: serviceNames[serviceId],
          formData: { ...this.additionalOrderForm },
          paymentMethod: this.additionalOrderForm.paymentMethod,
          pickupAddress: pickupAddress,
          deliveryAddress: deliveryAddress,
          routeInfo: routeInfo,
          pricing: pricing,
          totalAmount: pricing.total,
          priceEstimate: { total: pricing.total },
          gcashCharge: 0, // No GCash fee for additional orders (fixed ₱55)
          status: 'pending',
          createdAt: new Date().toISOString(), // Use Date instead of serverTimestamp() to avoid array error
          userId: this.authStore.user.uid
        }

        // Get existing additional orders or create new array
        const existingAdditionalOrders = orderData.additionalOrders || []
        
        // Update order with additional order
        await updateDoc(orderRef, {
          additionalOrders: [...existingAdditionalOrders, additionalOrder],
          updatedAt: new Date().toISOString()
        })

        // Calculate new total (original + additional)
        const originalTotal = orderData.totalAmount || orderData.pricing?.total || 0
        const additionalTotal = additionalOrder.totalAmount || 55
        const newTotal = originalTotal + additionalTotal

        // Ensure pricing object exists before updating
        const updateData = {
          totalAmount: newTotal
        }
        
        // Only update pricing.total if pricing object exists, otherwise create it
        if (orderData.pricing) {
          updateData['pricing.total'] = newTotal
        } else {
          updateData.pricing = {
            ...(orderData.pricing || {}),
            total: newTotal
          }
        }

        // Update total amount
        await updateDoc(orderRef, updateData)

        // Send notifications to Admin and Driver about additional order
        try {
          // Notify Admin
          await realtimeService.sendNotificationToAdmins({
            title: 'Additional Order Added',
            message: `User added an additional ${additionalOrder.serviceName} order to Order #${this.addOrderToOrderId.substring(0, 8)}. New total: ₱${newTotal.toFixed(2)}`,
            type: 'additional_order',
            orderId: this.addOrderToOrderId,
            userId: this.authStore.user.uid,
            serviceName: additionalOrder.serviceName,
            totalAmount: Number(additionalOrder.totalAmount || 55),
            additionalOrderId: additionalOrder.serviceId
          })
          console.log('[MyOrders] Notification sent to admins about additional order')
        } catch (notifErr) {
          console.warn('[MyOrders] Failed to send notification to admins (non-blocking):', notifErr?.message || notifErr)
        }

        // Notify Driver if assigned
        if (orderData.driverId) {
          try {
            await realtimeService.sendNotification(orderData.driverId, {
              title: 'Additional Order Added',
              message: `Customer added an additional ${additionalOrder.serviceName} order to Order #${this.addOrderToOrderId.substring(0, 8)}. New total: ₱${newTotal.toFixed(2)}`,
              type: 'additional_order',
              recipientType: 'driver',
              orderId: this.addOrderToOrderId,
              serviceName: additionalOrder.serviceName,
              totalAmount: Number(additionalOrder.totalAmount || 55)
            })
            console.log('[MyOrders] Notification sent to driver about additional order')
          } catch (notifErr) {
            console.warn('[MyOrders] Failed to send notification to driver (non-blocking):', notifErr?.message || notifErr)
          }
        }

        // Reset submitting state first
        this.submittingAdditionalOrder = false
        
        // Show success notification immediately (it has higher z-index)
        this.showNotification('success', `Additional order added successfully! New total: ₱${newTotal.toFixed(2)}`)
        
        // Close Add Order modal after showing notification
        setTimeout(() => {
          this.closeAddOrderModal()
          // Refresh orders
          this.loadOrders()
        }, 200)
      } catch (error) {
        console.error('Error adding additional order:', error)
        this.additionalOrderError = error.message || 'Failed to add order. Please try again.'
        
        // Reset submitting state
        this.submittingAdditionalOrder = false
        
        // Show error notification
        this.showNotification('error', `Failed to add order: ${error.message || 'Please try again.'}`)
        
        // Don't close modal on error - let user see the error and try again
      }
    },

    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          this.mapsReady = true
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`
        script.async = true
        script.defer = true
        script.onerror = () => reject(new Error('Failed to load Google Maps API'))
        script.onload = () => {
          this.mapsReady = true
          resolve()
        }
        document.head.appendChild(script)
      })
    },
    
    initializeAdditionalOrderAutocomplete() {
      if (!this.mapsReady || !window.google || !window.google.maps || !window.google.maps.places) {
        return
      }
      
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.35, 121.15),
        new window.google.maps.LatLng(13.45, 121.25)
      )
      
      const autocompleteOptions = {
        bounds: calapanBounds,
        componentRestrictions: { country: 'ph' },
        types: ['address']
      }
      
      // Restaurant Address
      if (this.$refs.additionalRestaurantAddressInput) {
        const ac = new window.google.maps.places.Autocomplete(
          this.$refs.additionalRestaurantAddressInput,
          autocompleteOptions
        )
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (place.geometry) {
            if (!calapanBounds.contains(place.geometry.location)) {
              this.showNotification('warning', 'Please select a location within Calapan City area.')
              this.$refs.additionalRestaurantAddressInput.value = ''
              return
            }
            this.additionalOrderForm.restaurantAddress = place.formatted_address
          }
        })
        this.additionalOrderAutocompleteInstances.restaurantAddress = ac
      }
      
      // Store Address
      if (this.$refs.additionalStoreAddressInput) {
        const ac = new window.google.maps.places.Autocomplete(
          this.$refs.additionalStoreAddressInput,
          autocompleteOptions
        )
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (place.geometry) {
            if (!calapanBounds.contains(place.geometry.location)) {
              this.showNotification('warning', 'Please select a location within Calapan City area.')
              this.$refs.additionalStoreAddressInput.value = ''
              return
            }
            this.additionalOrderForm.storeAddress = place.formatted_address
          }
        })
        this.additionalOrderAutocompleteInstances.storeAddress = ac
      }
      
      // Pickup Address
      if (this.$refs.additionalPickupAddressInput) {
        const ac = new window.google.maps.places.Autocomplete(
          this.$refs.additionalPickupAddressInput,
          autocompleteOptions
        )
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (place.geometry) {
            if (!calapanBounds.contains(place.geometry.location)) {
              this.showNotification('warning', 'Please select a location within Calapan City area.')
              this.$refs.additionalPickupAddressInput.value = ''
              return
            }
            this.additionalOrderForm.pickupAddress = place.formatted_address
          }
        })
        this.additionalOrderAutocompleteInstances.pickupAddress = ac
      }
      
      // Dropoff Address
      if (this.$refs.additionalDropoffAddressInput) {
        const ac = new window.google.maps.places.Autocomplete(
          this.$refs.additionalDropoffAddressInput,
          autocompleteOptions
        )
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (place.geometry) {
            if (!calapanBounds.contains(place.geometry.location)) {
              this.showNotification('warning', 'Please select a location within Calapan City area.')
              this.$refs.additionalDropoffAddressInput.value = ''
              return
            }
            this.additionalOrderForm.dropoffAddress = place.formatted_address
          }
        })
        this.additionalOrderAutocompleteInstances.dropoffAddress = ac
      }
    },

    async fetchDriverInfo(order) {
      if (!order.driverId || order.driver) return
      
      try {
        const driverDoc = await getDoc(doc(db, 'users', order.driverId))
        if (driverDoc.exists()) {
          const driverData = driverDoc.data()
          order.driver = {
            uid: order.driverId,
            name: `${driverData.firstName} ${driverData.lastName}`,
            phone: driverData.contact,
            vehicle: driverData.vehicleType || 'Vehicle',
            avatar: driverData.photoURL || `https://ui-avatars.com/api/?name=${driverData.firstName}+${driverData.lastName}`
          }
        }
      } catch (error) {
        console.error('[v0] Error fetching driver info:', error)
      }
    },

    async loadOrders() {
      try {
        realtimeService.subscribeToUserOrders(this.authStore.user.uid, async (orders) => {
          this.orders = orders
          
          // Fetch driver info for orders that have driverId but no driver object
          for (const order of this.orders) {
            if (order.driverId && !order.driver) {
              await this.fetchDriverInfo(order)
            }
          }
          
          this.filterOrders()
          this.loading = false
          this.setupCancelTimers()
        })
      } catch (error) {
        console.error('Error loading orders:', error)
        this.loading = false
      }
    },

    callDriver(phone) {
      if (phone) window.open(`tel:${phone}`)
    },

    filterOrders() {
      let filtered = [...this.orders]
      if (this.selectedStatus) {
        filtered = filtered.filter(o => o.status === this.selectedStatus)
      }
      if (this.selectedService) {
        filtered = filtered.filter(o => o.serviceName === this.selectedService)
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        filtered = filtered.filter(o =>
          o.id.toLowerCase().includes(q) ||
          (o.serviceName || '').toLowerCase().includes(q) ||
          (o.pickupAddress || o.formData?.pickupAddress || '').toLowerCase().includes(q) ||
          (o.deliveryAddress || o.formData?.deliveryAddress || '').toLowerCase().includes(q)
        )
      }
      this.filteredOrders = filtered
      this.currentPage = 1
      // we keep timers running globally; counts recomputed each tick
    },

    getStatusClass(status) {
      const m = {
        pending: 'bg-orange-100 text-orange-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_transit: 'bg-purple-100 text-purple-800',
        on_the_way: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      }
      return m[status] || 'bg-gray-100 text-gray-800'
    },
    formatStatus(s) {
      const m = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        in_transit: 'In Transit',
        on_the_way: 'On The Way',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
      return m[s] || s
    },
    formatDate(ts) {
      if (!ts) return ''
      const d = ts.toDate ? ts.toDate() : new Date(ts)
      return d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    },
    viewOrder(id) {
      this.expandedOrderId = this.expandedOrderId === id ? null : id
    },

    handleChatNotification(notification) {
      this.showNotification(notification.type, notification.message)
    },

    showNotification(type, message) {
      console.log('[MyOrders] showNotification called:', type, message)
      this.notificationType = type
      this.notificationMessage = message
      
      // Show notification modal immediately - no delay
      this.showNotificationModal = true
      console.log('[MyOrders] Notification modal state:', this.showNotificationModal)
      
      // Force Vue to update DOM immediately
      this.$forceUpdate()
      
      // Double check after nextTick to ensure it's visible
      this.$nextTick(() => {
        if (!this.showNotificationModal) {
          this.showNotificationModal = true
          this.$forceUpdate()
        }
      })
    },

    closeNotificationModal() {
      this.showNotificationModal = false
      this.notificationMessage = ''
    }
  }
}
</script>
