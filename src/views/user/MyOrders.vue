<template>
  <div class="min-h-screen w-full bg-gray-50/50 overflow-x-hidden font-sans pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">

      <div class="relative overflow-hidden bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg text-white transform transition hover:scale-[1.005] duration-500">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex justify-between items-end md:items-center flex-col md:flex-row gap-4">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-fit p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">My Orders</h1>
            </div>
            <p class="text-[#e6ffcc] text-base font-medium ml-1">Track and manage your delivery requests.</p>
          </div>
          
          <router-link :to="{ name: 'book-service' }"
            class="group flex items-center px-6 py-3 bg-white text-[#00C851] font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-0.5"
          >
            <span class="mr-2">New Order</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </router-link>
        </div>
      </div>

      <div class="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/50">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1 min-w-[200px]">
            <select v-model="selectedStatus" @change="filterOrders"
                    class="w-full pl-4 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white border-2 hover:border-gray-200 focus:border-[#3ED400] rounded-xl focus:ring-0 font-medium text-gray-700 transition-all appearance-none cursor-pointer">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="on_the_way">On The Way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div class="relative flex-1 min-w-[200px]">
            <select v-model="selectedService" @change="filterOrders"
                    class="w-full pl-4 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white border-2 hover:border-gray-200 focus:border-[#3ED400] rounded-xl focus:ring-0 font-medium text-gray-700 transition-all appearance-none cursor-pointer">
              <option value="">All Services</option>
              <option value="Food Delivery">Food Delivery</option>
              <option value="Bill Payments">Bill Payments</option>
              <option value="Grocery Shopping">Grocery Shopping</option>
              <option value="Gift Delivery">Gift Delivery</option>
              <option value="Medicine Delivery">Medicine Delivery</option>
              <option value="Pick-up & Drop">Pick-up & Drop</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div class="relative flex-[2]">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="text" v-model="searchQuery" @input="filterOrders"
                   placeholder="Search by ID, Service, or Address..."
                   class="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white border-2 hover:border-gray-200 focus:border-[#3ED400] rounded-xl focus:ring-0 font-medium transition-all placeholder-gray-400">
          </div>
        </div>
      </div>

      <div class="space-y-6">
        
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="relative w-20 h-20">
            <div class="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div class="absolute top-0 left-0 w-full h-full border-4 border-[#3ED400] rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p class="text-gray-500 mt-6 font-bold animate-pulse">Loading orders...</p>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">No orders found</h3>
          <p class="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
          <router-link :to="{ name: 'book-service' }"
                       class="px-8 py-3 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white font-bold rounded-xl shadow-lg hover:shadow-green-200/50 hover:-translate-y-1 transition-all">
            Create Your First Order
          </router-link>
        </div>

        <div v-else class="grid gap-6">
          <div v-for="order in filteredOrders" :key="order.id"
               class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            
            <div class="h-2 w-full bg-gradient-to-r from-[#3ED400] to-[#A8EB12]"></div>

            <div class="p-6 md:p-8">
              <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <span class="px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-gray-500 uppercase tracking-widest border border-gray-200">
                      #{{ order.id.slice(0, 8) }}
                    </span>
                    <span :class="getStatusClass(order.status)"
                          class="px-4 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-sm border border-opacity-20">
                      {{ formatStatus(order.status) }}
                    </span>
                  </div>
                  <h3 class="text-2xl font-black text-gray-800">{{ order.serviceName }}</h3>
                  <p class="text-sm text-gray-500 font-medium flex items-center mt-1">
                    <svg class="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p class="text-3xl font-black text-[#3ED400]">₱{{ order.pricing?.total || order.priceEstimate?.total || '0.00' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/80 rounded-2xl border border-gray-100 mb-6">
                <div class="relative pl-4 border-l-2 border-green-200">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-100 border-4 border-white shadow-sm"></div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">From</p>
                  <p class="font-bold text-gray-800 line-clamp-2">
                    {{ order.pickupAddress || order.formData?.pickupAddress || order.formData?.restaurantAddress || order.formData?.storeAddress }}
                  </p>
                </div>
                <div class="relative pl-4 border-l-2 border-red-200">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-100 border-4 border-white shadow-sm"></div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To</p>
                  <p class="font-bold text-gray-800 line-clamp-2">
                    {{ order.deliveryAddress || order.formData?.deliveryAddress || order.formData?.returnAddress }}
                  </p>
                </div>
              </div>

              <div v-if="order.driverId || order.driver" class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-2xl border border-blue-100 mb-6">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <img v-if="order.driver?.avatar" :src="order.driver.avatar" :alt="order.driver.name" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md">
                    <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-md">
                      D
                    </div>
                    <div class="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-blue-500 uppercase tracking-wide">Your Driver</p>
                    <p class="font-bold text-gray-900 text-lg">{{ order.driver?.name || 'Driver Assigned' }}</p>
                  </div>
                </div>
                <button 
                  @click.stop="openChatWithDriver(order)"
                  :disabled="!order.driverId && !order.driver"
                  class="p-3 bg-white text-blue-600 rounded-xl shadow-sm hover:shadow-md border border-blue-100 hover:bg-blue-50 transition-all group-hover:scale-105"
                  title="Chat with driver">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </button>
              </div>

              <div v-if="(order.status === 'in_transit' || order.status === 'on_the_way' || order.status === 'confirmed') && (order.driverId || order.driver)" class="mb-6 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                <LiveTracking :order-id="order.id" />
              </div>

              <div v-if="order.status === 'delivered'" class="mb-6">
                <div v-if="!order.feedback" class="p-5 bg-green-50 rounded-2xl border border-green-200 flex items-center justify-between">
                  <div>
                    <h4 class="font-bold text-green-800 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Order Completed
                    </h4>
                    <p class="text-sm text-green-700 mt-1">Please rate your experience.</p>
                  </div>
                  <button @click="showFeedbackModal(order.id)" class="px-4 py-2 bg-white text-green-700 text-sm font-bold rounded-lg shadow-sm border border-green-200 hover:bg-green-100 transition-colors">
                    Rate Now
                  </button>
                </div>
                <div v-else class="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Your Feedback</h4>
                    <span class="text-xs font-bold text-gray-400">{{ formatDate(order.feedback.createdAt) }}</span>
                  </div>
                  <div class="flex items-center gap-1 mb-2">
                    <svg v-for="i in 5" :key="i" :class="i <= order.feedback.rating ? 'text-yellow-400' : 'text-gray-300'" class="w-5 h-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span class="ml-2 font-bold text-gray-700">{{ order.feedback.rating }}.0</span>
                  </div>
                  <p v-if="order.feedback.comment" class="text-gray-600 text-sm italic">"{{ order.feedback.comment }}"</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
                <button @click="viewOrder(order.id)"
                        class="text-sm font-bold text-gray-500 hover:text-[#3ED400] transition-colors flex items-center group/btn">
                  {{ expandedOrderId === order.id ? 'Hide Details' : 'View Full Details' }}
                  <svg class="w-4 h-4 ml-1 transform transition-transform group-hover/btn:translate-x-1" :class="{'rotate-180': expandedOrderId === order.id}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                <div class="flex items-center space-x-3">
                  <template v-if="order.status === 'pending'">
                    <button
                      v-if="canCancel(order)"
                      @click="showCancelModal(order.id)"
                      class="px-4 py-2 text-sm font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      Cancel ({{ cancelCountdowns[order.id] ?? 0 }}s)
                    </button>
                    <span v-else class="text-xs font-bold text-gray-300 uppercase tracking-widest select-none">
                      Cancellation Expired
                    </span>
                  </template>
                </div>
              </div>

              <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
                <div v-if="expandedOrderId === order.id" class="mt-6 pt-6 border-t-2 border-dashed border-gray-100">
                  <h4 class="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                    <span class="w-1.5 h-6 bg-[#3ED400] rounded-full"></span>
                    Order Breakdown
                  </h4>

                  <div class="grid md:grid-cols-2 gap-6">
                    
                    <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Contact Info</h5>
                      <div class="space-y-3 text-sm">
                        <div v-if="order.formData?.receiverName" class="flex justify-between"><span class="text-gray-500">Receiver</span> <span class="font-bold text-gray-800">{{ order.formData.receiverName }}</span></div>
                        <div v-if="order.formData?.receiverContact" class="flex justify-between"><span class="text-gray-500">Contact</span> <span class="font-bold text-gray-800">{{ order.formData.receiverContact }}</span></div>
                        <div v-if="order.formData?.recipientName" class="flex justify-between"><span class="text-gray-500">Recipient</span> <span class="font-bold text-gray-800">{{ order.formData.recipientName }}</span></div>
                      </div>
                    </div>

                    <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pickup Logistics</h5>
                      <div class="space-y-3 text-sm">
                        <div v-if="order.formData?.pickupAddress || order.formData?.restaurantAddress" class="flex flex-col gap-1">
                          <span class="text-gray-500 text-xs">Address</span>
                          <span class="font-bold text-gray-800">{{ order.formData.pickupAddress || order.formData.restaurantAddress }}</span>
                        </div>
                        <div v-if="order.formData?.restaurantName || order.formData?.storeName" class="flex justify-between mt-2">
                          <span class="text-gray-500">Establishment</span>
                          <span class="font-bold text-gray-800">{{ order.formData.restaurantName || order.formData.storeName }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Details</h5>
                      <div class="space-y-3 text-sm">
                        <div v-if="order.formData?.foodOrderDetails || order.formData?.shoppingList || order.formData?.itemDescription" class="flex flex-col gap-1">
                          <span class="text-gray-500 text-xs">Items/Order</span>
                          <span class="font-medium text-gray-800 whitespace-pre-line bg-white p-3 rounded-lg border border-gray-200">
                            {{ order.formData.foodOrderDetails || order.formData.shoppingList || order.formData.itemDescription }}
                          </span>
                        </div>
                        <div v-if="order.formData?.specialInstructions" class="flex flex-col gap-1 mt-2">
                          <span class="text-gray-500 text-xs">Instructions</span>
                          <span class="font-medium text-gray-800 italic">"{{ order.formData.specialInstructions }}"</span>
                        </div>
                      </div>
                    </div>

                    <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pricing Breakdown</h5>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between text-gray-500">
                          <span>Base Charge</span>
                          <span>₱{{ order.pricing?.baseCharge || order.priceEstimate?.base || 0 }}</span>
                        </div>
                        <div class="flex justify-between text-gray-500">
                          <span>Distance Fee</span>
                          <span>₱{{ order.pricing?.distanceFee || order.priceEstimate?.distance || 0 }}</span>
                        </div>
                        <div v-if="order.pricing?.badWeatherFee" class="flex justify-between text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          <span>Weather Fee</span>
                          <span>₱{{ order.pricing?.badWeatherFee }}</span>
                        </div>
                        <div v-if="order.pricing?.gcashFee" class="flex justify-between text-blue-500">
                          <span>GCash Fee</span>
                          <span>₱{{ order.pricing?.gcashFee }}</span>
                        </div>
                        <div class="border-t border-dashed border-gray-200 my-2"></div>
                        <div class="flex justify-between items-center">
                          <span class="font-bold text-gray-800">Total</span>
                          <span class="text-xl font-black text-[#3ED400]">₱{{ order.pricing?.total || order.priceEstimate?.total }}</span>
                        </div>
                        <div v-if="order.formData?.paymentMethod" class="mt-2 text-right">
                          <span class="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 border border-gray-200">
                            {{ order.formData.paymentMethod }}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div v-if="order.formData?.billReceiptUrl || order.formData?.prescriptionUrl" class="mt-6">
                    <h5 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Attachments</h5>
                    <div class="flex gap-4 overflow-x-auto pb-2">
                      <a v-if="order.formData.billReceiptUrl" :href="order.formData.billReceiptUrl" target="_blank" 
                         class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#3ED400] transition-colors shadow-sm min-w-[200px]">
                        <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-bold text-gray-500 uppercase">Receipt</p>
                          <p class="text-sm font-bold text-gray-800 truncate">View File</p>
                        </div>
                      </a>
                      
                      <a v-if="order.formData.prescriptionUrl" :href="order.formData.prescriptionUrl" target="_blank"
                         class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#3ED400] transition-colors shadow-sm min-w-[200px]">
                        <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-bold text-gray-500 uppercase">Prescription</p>
                          <p class="text-sm font-bold text-gray-800 truncate">View File</p>
                        </div>
                      </a>
                    </div>
                  </div>

                </div>
              </transition>

            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="flex items-center gap-2 p-2 bg-white rounded-xl shadow-md border border-gray-100">
          <button @click="currentPage--" :disabled="currentPage === 1"
                  class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <span class="px-4 py-1 text-sm font-bold text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
                  class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

    </div>

    <div v-if="showCancelDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform transition-all border border-gray-100">
        <h3 class="text-xl font-black text-gray-900 mb-4">Cancel Order</h3>

        <div class="mb-6 p-4 rounded-2xl border transition-colors"
             :class="modalRemaining > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider" :class="modalRemaining > 0 ? 'text-red-600' : 'text-gray-500'">
              Time Remaining
            </span>
            <span class="font-black text-2xl tabular-nums"
                  :class="modalRemaining > 0 ? 'text-red-500' : 'text-gray-400'">
              {{ modalRemaining }}s
            </span>
          </div>
          <div class="w-full rounded-full h-2 bg-gray-200 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300 ease-linear"
                 :class="modalRemaining > 0 ? 'bg-red-500' : 'bg-gray-400'"
                 :style="{ width: `${(modalRemaining / 30) * 100}%` }"></div>
          </div>
          <p v-if="modalRemaining <= 0" class="text-xs font-bold text-gray-400 mt-2 text-center">
            Cancellation window expired.
          </p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-3">Reason for cancellation <span class="text-red-500">*</span></label>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            <label v-for="reason in cancelReasons" :key="reason.value"
                   class="flex items-center p-3 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                   :class="selectedCancelReason === reason.value ? 'border-red-500 bg-red-50' : 'border-gray-200'">
              <input type="radio" :value="reason.value" v-model="selectedCancelReason"
                     class="mr-3 text-red-600 focus:ring-red-500 cursor-pointer h-4 w-4 border-gray-300">
              <span class="text-sm font-medium text-gray-700">{{ reason.label }}</span>
            </label>
          </div>

          <div v-if="selectedCancelReason === 'others'" class="mt-3">
            <textarea v-model="customCancelReason"
                      placeholder="Please specify..."
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm resize-none bg-gray-50 focus:bg-white"
                      rows="3"></textarea>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="closeCancelModal" 
                  class="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Keep Order
          </button>
          <button @click="confirmCancelOrder"
                  :disabled="!isReasonValid || cancelling || modalRemaining <= 0"
                  class="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200">
            {{ cancelling ? 'Cancelling...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showFeedbackDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform transition-all border border-gray-100">
        <div class="text-center mb-6">
          <h3 class="text-2xl font-black text-gray-900">Rate Experience</h3>
          <p class="text-sm text-gray-500">How was your delivery?</p>
        </div>
        
        <div class="flex flex-col items-center mb-8">
          <div class="flex items-center space-x-2 mb-2">
            <button v-for="i in 5" :key="i"
                    @click="feedbackRating = i"
                    class="transition-transform hover:scale-110 focus:outline-none">
              <svg :class="i <= feedbackRating ? 'text-yellow-400 fill-current' : 'text-gray-200'"
                   class="w-10 h-10 drop-shadow-sm transition-colors" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </button>
          </div>
          <span class="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{{ getRatingText(feedbackRating) }}</span>
        </div>

        <div class="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
          <div v-for="aspect in serviceAspects" :key="aspect.key" class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">{{ aspect.label }}</span>
            <div class="flex space-x-1">
              <button v-for="i in 5" :key="i"
                      @click="feedbackAspects[aspect.key] = i"
                      class="focus:outline-none">
                <div class="w-2 h-6 rounded-full transition-colors"
                     :class="i <= (feedbackAspects[aspect.key] || 0) ? 'bg-yellow-400' : 'bg-gray-200'"></div>
              </button>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex flex-wrap gap-2 justify-center">
            <button v-for="tag in feedbackTags" :key="tag"
                    @click="toggleFeedbackTag(tag)"
                    class="px-3 py-1 text-xs font-bold rounded-lg border transition-all"
                    :class="selectedTags.includes(tag) ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200 hover:border-green-200'">
              {{ tag }}
            </button>
          </div>
        </div>

        <textarea v-model="feedbackComment"
                  placeholder="Tell us more (optional)..."
                  class="w-full px-4 py-3 mb-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all text-sm resize-none bg-gray-50 focus:bg-white"
                  rows="3"></textarea>

        <div class="flex gap-3">
          <button @click="closeFeedbackModal" 
                  class="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button @click="submitFeedback"
                  :disabled="!feedbackRating || submittingFeedback"
                  class="flex-1 py-3 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white font-bold rounded-xl shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all">
            {{ submittingFeedback ? 'Sending...' : 'Submit' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showChatModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden border border-gray-100">
        <div class="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              D
            </div>
            <div>
              <h2 class="text-lg font-black text-gray-800 leading-tight">Chat with Driver</h2>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">{{ chatPartner?.name || 'Driver' }}</p>
            </div>
          </div>
          <button @click="showChatModal = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="flex-1 overflow-hidden bg-gray-50 relative">
          <ChatWindow
            v-if="chatId && chatOrderId"
            :chat-id="chatId"
            :order-id="chatOrderId"
            :chat-partner="chatPartner"
            :is-driver="false"
            @notification="handleChatNotification"
            class="h-full"
          />
          <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500 mb-4"></div>
            <p class="font-medium">Connecting...</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showNotificationModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" @click.self="closeNotificationModal">
      <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 border border-gray-100" @click.stop>
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce"
             :class="notificationType === 'success' ? 'bg-green-100 text-green-500' : notificationType === 'error' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'">
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
                :class="notificationType === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : notificationType === 'error' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'">
          Okay, Got it
        </button>
      </div>
    </div>

  </div>
</template>

<script>
// --- LOGIC MO (EXACTLY AS PROVIDED) ---
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

      // add order modal state - REMOVED

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
        this.showNotification('error', 'Cancellation window has expired. You can no longer cancel this order.')
        return
      }
      if (!this.isReasonValid) {
        this.showNotification('error', 'Please select a reason for cancellation')
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
        this.showNotification('success', 'Order cancelled successfully!')
        this.closeCancelModal()
      } catch (error) {
        console.error('Error cancelling order:', error)
        let msg = 'Error cancelling order. Please try again.'
        if (error.code === 'permission-denied') msg = 'Permission denied. Please contact support.'
        else if (error.code === 'not-found') msg = 'Order not found.'
        else if (error.code === 'unavailable') msg = 'Service temporarily unavailable. Try again later.'
        this.showNotification('error', msg)
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

    // ====== STANDALONE CHAT MODAL (NOT CONNECTED TO CHATMESSAGES PAGE) ======
    // This opens a standalone chat modal for real-time communication with driver
    // Real-time updates are handled by ChatWindow component using Firestore onSnapshot
    async openChatWithDriver(order) {
      console.log('[v0] Opening standalone chat modal for order:', order?.id, 'driverId:', order?.driverId, 'driver:', order?.driver)
      
      // Validate order
      if (!order || !order.id) {
        console.error('[v0] Invalid order object')
        this.showNotification('error', 'Order information is invalid')
        return
      }

      // Check if driver is assigned
      if (!order.driverId && !order.driver) {
        console.warn('[v0] No driver assigned to order:', order.id)
        this.showNotification('error', 'No driver assigned to this order yet')
        return
      }

      // Check if user is authenticated
      if (!this.authStore.user || !this.authStore.user.uid) {
        console.error('[v0] User not authenticated')
        this.showNotification('error', 'Please log in to chat with driver')
        return
      }

      try {
        // Get driver ID from order
        const driverId = order.driverId || order.driver?.uid || order.driver?.id
        
        if (!driverId) {
          console.error('[v0] Driver ID not found in order:', order)
          this.showNotification('error', 'Driver information not available')
          return
        }

        console.log('[v0] Creating/getting chat room - userId:', this.authStore.user.uid, 'driverId:', driverId, 'orderId:', order.id)

        // Create or get chat room with driver (real-time enabled)
        const chatRoomId = await chatService.createChatRoom(
          this.authStore.user.uid,
          driverId,
          order.id
        )

        console.log('[v0] Chat room created/retrieved:', chatRoomId)

        if (!chatRoomId) {
          throw new Error('Failed to create chat room')
        }

        // Set chat modal state for standalone modal
        this.chatOrderId = order.id
        this.chatId = chatRoomId
        
        // Set chat partner info with fallback values
        this.chatPartner = {
          id: driverId,
          name: order.driver?.name || order.driver?.firstName || 'Driver',
          role: 'driver',
          phone: order.driver?.phone || order.driver?.contact || ''
        }

        console.log('[v0] Chat partner set:', this.chatPartner)

        // Show standalone chat modal (NOT navigating to ChatMessages page)
        this.showChatModal = true
        console.log('[v0] Chat modal opened successfully')
      } catch (error) {
        console.error('[v0] Error opening chat:', error)
        console.error('[v0] Error details:', {
          message: error.message,
          stack: error.stack,
          orderId: order?.id,
          driverId: order?.driverId,
          userId: this.authStore.user?.uid
        })
        this.showNotification('error', `Error opening chat: ${error.message || 'Please try again'}`)
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
        pending: 'bg-orange-100 text-orange-700 border-orange-200',
        confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
        in_transit: 'bg-purple-100 text-purple-700 border-purple-200',
        on_the_way: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        delivered: 'bg-green-100 text-green-700 border-green-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200'
      }
      return m[status] || 'bg-gray-100 text-gray-700 border-gray-200'
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>