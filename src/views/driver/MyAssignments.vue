<template>
  <div class="min-h-screen w-full bg-gray-50/50 overflow-x-hidden font-sans pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">

      <div class="relative overflow-hidden bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg text-white transform transition hover:scale-[1.005] duration-500">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-fit p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              </div>
              <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">My Assignments</h1>
            </div>
            <p class="text-[#e6ffcc] text-base font-medium ml-1">Manage your deliveries and tasks.</p>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-sm">
              <div :class="['w-3 h-3 rounded-full shadow-inner', isOnline ? 'bg-[#3ED400] shadow-[0_0_8px_#3ED400]' : 'bg-gray-400']"></div>
              <span class="text-sm font-bold tracking-wide">{{ isOnline ? 'ONLINE' : 'OFFLINE' }}</span>
            </div>

            <button @click="refreshBookings" 
                    class="p-2 bg-white text-[#00C851] rounded-xl hover:bg-gray-50 transition-colors shadow-lg group">
              <svg class="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="isBadWeather && badWeatherFeeEnabled" class="bg-yellow-50/90 backdrop-blur-sm border-l-4 border-yellow-500 p-4 rounded-xl shadow-sm flex items-start gap-3">
        <div class="flex-shrink-0 p-1 bg-yellow-100 rounded-full">
          <svg class="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a 1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        </div>
        <div>
          <p class="text-sm font-bold text-yellow-800">Bad Weather Alert</p>
          <p class="text-xs text-yellow-700 mt-0.5">
            Current condition: {{ currentWeather }}. All bookings include a ₱10 surcharge.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        
        <div class="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-sm w-full md:w-fit flex self-center md:self-start">
          <button @click="activeTab = 'active'"
                  :class="['flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300', activeTab === 'active' ? 'bg-gradient-to-r from-[#74E600] to-[#00C851] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']">
            Active Tasks
          </button>
          <button @click="activeTab = 'history'"
                  :class="['flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300', activeTab === 'history' ? 'bg-gradient-to-r from-[#74E600] to-[#00C851] text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']">
            History
          </button>
        </div>

        <div v-if="activeTab === 'active'" class="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
            <div class="relative">
              <select v-model="filters.status" class="w-full pl-4 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white border-2 hover:border-gray-200 focus:border-[#3ED400] rounded-xl focus:ring-0 font-medium text-gray-700 transition-all appearance-none cursor-pointer">
                <option value="">All Status</option>
                <option value="driver_assigned">Assigned</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="arrived">Arrived</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Service</label>
            <div class="relative">
              <select v-model="filters.serviceType" class="w-full pl-4 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white border-2 hover:border-gray-200 focus:border-[#3ED400] rounded-xl focus:ring-0 font-medium text-gray-700 transition-all appearance-none cursor-pointer">
                <option value="">All Services</option>
                <option value="food-delivery">Food Delivery</option>
                <option value="grocery">Grocery Shopping</option>
                <option value="pickup-drop">Pick-up & Drop</option>
                <option value="bill-payment">Bill Payment</option>
                <option value="medicine">Medicine Delivery</option>
                <option value="gift">Surprise Gift</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Payment</label>
            <div class="relative">
              <select v-model="filters.paymentMethod" class="w-full pl-4 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white border-2 hover:border-gray-200 focus:border-[#3ED400] rounded-xl focus:ring-0 font-medium text-gray-700 transition-all appearance-none cursor-pointer">
                <option value="">All Methods</option>
                <option value="GCASH">GCash</option>
                <option value="COD">Cash on Delivery</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        
        <template v-if="activeTab === 'active'">
          <div v-if="activeBookings.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800">No Active Assignments</h3>
            <p class="text-gray-500 mt-2 text-sm">{{ isOnline ? 'Waiting for new tasks...' : 'Go online to receive tasks.' }}</p>
          </div>

          <div v-for="booking in activeBookings" :key="booking.id" 
               class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 group relative">
            
            <div class="h-1.5 w-full bg-gradient-to-r from-[#3ED400] to-[#A8EB12]"></div>

            <div class="p-6 md:p-8">
              <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div class="flex items-center gap-4">
                <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white transform group-hover:scale-110 transition-transform', getServiceColor(booking.serviceType)]">
                  <component :is="getServiceIcon(booking.serviceType)" class="w-7 h-7" />
                </div>
                <div>
                  <h3 class="text-xl font-black text-gray-800 leading-tight">
                    {{ booking.serviceName || booking.serviceTitle }}
                  </h3>
                  <p class="text-sm text-gray-500 font-medium flex items-center mt-1">
                    <span class="font-bold text-gray-700 mr-1">{{ booking.customerName }}</span> • {{ formatDate(booking.createdAt) }}
                  </p>
                </div>
              </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div class="relative pl-4 border-l-2 border-green-300">
                  <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-green-500"></div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                  <p class="text-sm font-bold text-gray-800 line-clamp-2">
                    {{ booking.pickupAddress || getPickupLocation(booking) }}
                  </p>
                </div>
                <div class="relative pl-4 border-l-2 border-red-300">
                  <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-red-500"></div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Drop-off</p>
                  <p class="text-sm font-bold text-gray-800 line-clamp-2">
                    {{ booking.deliveryAddress || getDeliveryLocation(booking) }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2 mb-6">
                <span :class="[getStatusBadgeClass(booking.status), 'px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-lg border border-opacity-20']">
                  {{ formatStatus(booking.status) }}
                </span>
                <span v-if="booking.paymentMethod && booking.paymentMethod.trim()"
                      :class="[getPaymentMethodBadge(booking.paymentMethod), 'px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-lg border border-opacity-20']">
                  {{ formatPaymentMethod(booking.paymentMethod) }}
                </span>
                <span v-else class="px-3 py-1 text-xs font-extrabold uppercase tracking-wide rounded-lg bg-gray-100 text-gray-600 border border-gray-200">
                  Payment Pending
                </span>
              </div>

              <div v-if="booking.notes" class="mb-6 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-xl border border-yellow-100 italic">
                <span class="font-bold not-italic">Note:</span> {{ booking.notes }}
              </div>

              <div v-if="booking.additionalOrders && booking.additionalOrders.length > 0" class="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <h4 class="text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">Additional Orders ({{ booking.additionalOrders.length }})</h4>
                <div class="space-y-2">
                  <div v-for="(additionalOrder, index) in booking.additionalOrders" :key="index" class="bg-white p-3 rounded-xl border border-blue-100 shadow-sm flex justify-between items-center">
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ additionalOrder.serviceName || 'Additional Order' }}</p>
                      <p class="text-xs text-gray-500 font-medium">₱{{ (additionalOrder.totalAmount || additionalOrder.pricing?.total || 55).toFixed(2) }}</p>
                    </div>
                    <span :class="['px-2 py-1 text-[10px] font-bold uppercase rounded-lg', additionalOrder.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700']">
                      {{ additionalOrder.status || 'pending' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-t border-gray-100 pt-6">
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Earnings</p>
                  <p class="text-3xl font-black text-[#3ED400]">
                    ₱{{ (booking.totalAmount || calculateFinalAmount(booking)).toFixed(2) }}
                  </p>
                  <p v-if="booking.paymentMethod?.toUpperCase() !== 'COD'" class="text-[10px] font-bold text-gray-400 mt-1">
                    (includes ₱{{ calculateGCashFee(booking) }} GCash fee)
                  </p>
                  <p v-else class="text-[10px] font-bold text-gray-400 mt-1">
                    (Cash on Delivery)
                  </p>
                </div>

                <div class="w-full md:w-auto">
                  <button v-if="booking.status !== 'delivered'"
                          @click="startDelivery(booking)"
                          class="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white font-bold rounded-xl shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all">
                    {{ booking.status === 'driver_assigned' ? 'Start Delivery' : 'View In Progress' }}
                  </button>
                  <button v-else disabled
                          class="w-full md:w-auto px-8 py-3 bg-gray-100 text-green-600 font-bold rounded-xl border border-green-200 cursor-not-allowed">
                    DELIVERED
                  </button>
                </div>
              </div>

            </div>
          </div>
        </template>

        <template v-if="activeTab === 'history'">
          <div v-if="historyBookings.length === 0" class="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="text-xl font-bold text-gray-800">No History Yet</h3>
            <p class="text-gray-500 mt-2 text-sm">Completed deliveries will appear here.</p>
          </div>

          <div v-for="booking in historyBookings" :key="booking.id"
               class="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors opacity-80 hover:opacity-100">
            <div class="flex flex-col md:flex-row justify-between gap-4">
              <div class="flex items-start gap-4">
                <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm', getServiceColor(booking.serviceType)]">
                  <component :is="getServiceIcon(booking.serviceType)" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900">{{ booking.serviceName || booking.serviceTitle }}</h3>
                  <p class="text-xs text-gray-500 font-medium mt-1">
                    {{ booking.customerName }} • Delivered {{ formatDate(booking.deliveredAt || booking.createdAt) }}
                  </p>
                  
                  <div class="mt-3 flex gap-2">
                    <span class="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-md">Delivered</span>
                    <span v-if="booking.paymentMethod" :class="[getPaymentMethodBadge(booking.paymentMethod), 'px-2 py-1 text-[10px] font-bold uppercase rounded-md']">
                      {{ formatPaymentMethod(booking.paymentMethod) }}
                    </span>
                  </div>
                  
                  <!-- Customer Feedback -->
                  <div v-if="booking.feedback" class="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="flex text-yellow-400">
                        <svg v-for="i in 5" :key="i" 
                             :class="i <= (booking.feedback.rating || 0) ? 'text-yellow-400' : 'text-gray-300'" 
                             class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span class="text-xs font-bold text-gray-700">{{ booking.feedback.rating || 0 }}.0</span>
                      <span class="text-xs text-gray-500">by {{ booking.feedback.userName || 'Customer' }}</span>
                    </div>
                    <p v-if="booking.feedback.comment" class="text-xs text-gray-600 italic">"{{ booking.feedback.comment }}"</p>
                  </div>
                </div>
              </div>
              
              <div class="text-right">
                <p class="text-xl font-black text-gray-800">₱{{ (booking.totalAmount || calculateFinalAmount(booking)).toFixed(2) }}</p>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Earnings</p>
              </div>
            </div>
          </div>
        </template>

      </div>

    </div>

    <div v-if="showStartDeliveryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 transform transition-all">
        <div class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 class="text-2xl font-black text-gray-900">Start Delivery</h2>
          <button @click="showStartDeliveryModal = false" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-6 space-y-6" v-if="selectedBooking">
          <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
            <div v-if="selectedBooking.formData?.useAddStoreOption" class="p-3 bg-green-50 rounded-xl border-2 border-green-200 mb-4">
              <p class="text-xs font-black text-green-700 uppercase tracking-wider mb-2">Add Store Option</p>
              <p v-if="selectedBooking.formData?.addStoreName" class="font-bold text-gray-900 text-sm">{{ selectedBooking.formData.addStoreName }}</p>
              <p class="text-gray-800 text-sm">{{ selectedBooking.pickupAddress || getPickupLocation(selectedBooking) }}</p>
              <div v-if="selectedBooking.formData?.addStoreItems" class="mt-2 pt-2 border-t border-green-200">
                <p class="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-0.5">What to buy at store</p>
                <p class="text-gray-800 text-sm whitespace-pre-wrap">{{ selectedBooking.formData.addStoreItems }}</p>
              </div>
            </div>
            <div class="relative pl-6 border-l-2 border-gray-300 space-y-6">
              <div class="relative">
                <div class="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{{ selectedBooking.formData?.useAddStoreOption ? 'Add Store (Pickup)' : 'Pickup Location' }}</p>
                <p class="font-bold text-gray-900">{{ selectedBooking.pickupAddress || getPickupLocation(selectedBooking) }}</p>
              </div>
              <div class="relative">
                <div class="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-red-500 ring-4 ring-white"></div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Drop-off Location</p>
                <p class="font-bold text-gray-900">{{ selectedBooking.deliveryAddress || getDeliveryLocation(selectedBooking) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">Current Location</p>
              <div id="currentLocationDisplay" class="text-sm font-bold text-gray-800">
                <span v-if="currentLocation">{{ currentLocation.lat.toFixed(4) }}, {{ currentLocation.lng.toFixed(4) }}</span>
                <span v-else class="text-gray-400 italic">Acquiring location...</span>
              </div>
            </div>
            <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
          </div>

          <button @click="showNavigationMap"
                  class="w-full py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold flex items-center justify-center gap-2 shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            Start Navigation
          </button>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            <button @click="updateDeliveryStatus(selectedBooking, 'in_transit')"
                    class="py-3 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-colors">
              In Transit
            </button>
            <button @click="updateDeliveryStatus(selectedBooking, 'on_the_way')"
                    class="py-3 bg-purple-100 text-purple-700 font-bold rounded-xl hover:bg-purple-200 transition-colors">
              On The Way
            </button>
            <button @click="updateDeliveryStatus(selectedBooking, 'delivered')"
                    class="py-3 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200 transition-colors">
              Delivered
            </button>
          </div>

          <button @click="showStartDeliveryModal = false" class="w-full py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>

    <div v-if="showReceiptPreviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md">
      <div class="bg-transparent max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
        <div class="w-full flex justify-between items-center mb-4 px-4">
          <h2 class="text-white text-lg font-bold">Proof of Delivery</h2>
          <button @click="showReceiptPreviewModal = false" class="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <img v-if="receiptPreviewUrl" :src="receiptPreviewUrl" alt="Receipt" class="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain bg-white/10" />
      </div>
    </div>

  </div>
</template>

<script>
// --- LOGIC MO (WALANG BINAGO) ---
import { weatherService } from '@/services/weatherService'
import { db } from '@/firebase/config'
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'MyAssignments',
  data() {
    return {
      activeTab: 'active',
      isOnline: true,
      isBadWeather: false,
      currentWeather: '',
      badWeatherFeeEnabled: false,
      filters: {
        status: '',
        serviceType: '',
        distance: '',
        paymentMethod: ''
      },
      bookings: [],
      showStartDeliveryModal: false,
      showMapModal: false,
      selectedBooking: null,
      weatherInterval: null,
      unsubscribe: null,
      currentLocation: null,
      directionsService: null,
      distanceMatrixService: null,
      map: null,
      directionsRenderer: null,
      routeDetails: null,
      isTrackingLocation: false,
      locationWatchId: null,
      showReceiptPreviewModal: false,
      receiptPreviewUrl: null
    }
  },
  computed: {
    activeBookings() {
      return this.bookings.filter(booking => {
        // Only show non-delivered orders in active tab
        if (booking.status === 'delivered') return false
        if (this.filters.status && booking.status !== this.filters.status) return false
        if (this.filters.serviceType && booking.serviceType !== this.filters.serviceType) return false
        if (this.filters.distance && booking.distance > parseInt(this.filters.distance)) return false
        if (this.filters.paymentMethod && booking.paymentMethod?.toUpperCase() !== this.filters.paymentMethod.toUpperCase()) return false
        return true
      })
    },
    historyBookings() {
      return this.bookings.filter(booking => {
        // Only show delivered orders in history tab
        if (booking.status !== 'delivered') return false
        if (this.filters.serviceType && booking.serviceType !== this.filters.serviceType) return false
        if (this.filters.paymentMethod && booking.paymentMethod?.toUpperCase() !== this.filters.paymentMethod.toUpperCase()) return false
        return true
      }).sort((a, b) => {
        // Sort by delivered date, most recent first
        const dateA = a.deliveredAt?.toDate ? a.deliveredAt.toDate() : (a.deliveredAt ? new Date(a.deliveredAt) : new Date(0))
        const dateB = b.deliveredAt?.toDate ? b.deliveredAt.toDate() : (b.deliveredAt ? new Date(b.deliveredAt) : new Date(0))
        return dateB - dateA
      })
    }
  },
  methods: {
    getServiceColor(serviceType) {
      const colors = {
        'food-delivery': 'bg-orange-500 shadow-orange-200',
        'food': 'bg-orange-500 shadow-orange-200',
        'grocery': 'bg-green-500 shadow-green-200',
        'pickup-drop': 'bg-blue-500 shadow-blue-200',
        'bill-payment': 'bg-purple-500 shadow-purple-200',
        'medicine': 'bg-red-500 shadow-red-200',
        'gift': 'bg-pink-500 shadow-pink-200'
      }
      return colors[serviceType] || 'bg-gray-500 shadow-gray-200'
    },
    getServiceIcon() {
      return 'svg'
    },
    calculateFinalAmount(booking) {
      const baseAmount = booking.totalAmount || booking.priceEstimate?.total || booking.pricing?.total || 0
      const itemsTotal = booking.pricing?.itemsTotal || 0
      const subtotal = baseAmount + itemsTotal
      const gcashFee = this.calculateGCashFeeForAmount(subtotal)
      const finalAmount = subtotal + gcashFee
      return finalAmount.toFixed(2)
    },
    calculateGCashFee(booking) {
      if (booking.paymentMethod?.toUpperCase() === 'COD') {
        return 0
      }
      
      const baseAmount = booking.totalAmount || booking.priceEstimate?.total || booking.pricing?.total || 0
      if (baseAmount <= 0) return 0
      if (baseAmount <= 499) return 5
      if (baseAmount <= 999) return 10
      if (baseAmount < 1500) return 20
      if (baseAmount < 2000) return 30
      return 40
    },
    calculateGCashFeeForAmount(amount) {
      if (this.selectedBooking?.paymentMethod?.toUpperCase() === 'COD') {
        return 0
      }
      if (amount <= 0) return 0
      if (amount <= 499) return 5
      if (amount <= 999) return 10
      if (amount < 1500) return 20
      if (amount < 2000) return 30
      return 40
    },
    getStatusBadgeClass(status) {
      const classes = {
        'driver_assigned': 'bg-blue-100 text-blue-700 border-blue-200',
        'picked_up': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'in_transit': 'bg-purple-100 text-purple-700 border-purple-200',
        'arrived': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        'delivered': 'bg-green-100 text-green-700 border-green-200'
      }
      return classes[status] || 'bg-gray-100 text-gray-700 border-gray-200'
    },
    getPaymentMethodBadge(paymentMethod) {
      if (!paymentMethod) return 'bg-gray-100 text-gray-700 border-gray-200'
      const method = paymentMethod.toUpperCase()
      if (method === 'GCASH') {
        return 'bg-blue-100 text-blue-700 border-blue-200'
      } else if (method === 'COD') {
        return 'bg-green-100 text-green-700 border-green-200'
      }
      return 'bg-gray-100 text-gray-700 border-gray-200'
    },
    formatStatus(status) {
      const statusMap = {
        'driver_assigned': 'Assigned',
        'picked_up': 'Picked Up',
        'in_transit': 'In Transit',
        'arrived': 'Arrived',
        'delivered': 'Delivered'
      }
      return statusMap[status] || status
    },
    formatPaymentMethod(paymentMethod) {
      if (!paymentMethod) return 'Unknown'
      const method = paymentMethod.toUpperCase()
      if (method === 'GCASH') return '💳 GCash'
      if (method === 'COD') return '💰 COD'
      return paymentMethod
    },
    formatDate(timestamp) {
      if (!timestamp) return 'N/A'
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    getServiceDescription(serviceType) {
      const descriptions = {
        'food-delivery': 'Food delivery service',
        'food': 'Food delivery service',
        'grocery': 'Grocery shopping service',
        'pickup-drop': 'Pick-up and drop-off service',
        'bill-payment': 'Bill payment service',
        'medicine': 'Medicine delivery service',
        'gift': 'Gift delivery service'
      }
      return descriptions[serviceType] || 'Delivery service'
    },
    getPickupLocation(booking) {
      if (!booking?.formData) return booking.pickupAddress || 'N/A'
      const formData = booking.formData
      if (formData.useAddStoreOption && formData.addStoreAddress) return formData.addStoreAddress
      return (
        booking.pickupAddress ||
        formData.pickupAddress ||
        formData.restaurantAddress ||
        formData.storeAddress ||
        'N/A'
      )
    },
    getDeliveryLocation(booking) {
      if (!booking?.formData) return booking.deliveryAddress || 'N/A'
      const formData = booking.formData
      return formData.deliveryAddress || formData.returnAddress || formData.dropoffAddress || 'N/A'
    },
    getFilteredBookingDetails(booking) {
      if (!booking?.formData) return []
      const formData = booking.formData
      const details = []
      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.length > 0) {
          details.push({
            key,
            label: this.formatFieldLabel(key),
            value: value.substring(0, 100)
          })
        }
      })
      return details.slice(0, 8)
    },
    formatFieldLabel(key) {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim()
    },
    refreshBookings() {
      this.$toast?.success?.('Assignments refreshed!')
      this.loadAssignedBookings()
    },
    async startDelivery(booking) {
      if (!booking || !booking.id) {
        console.error('[v0] Invalid booking object:', booking)
        this.$toast?.error?.('Invalid order. Please try again.')
        return
      }

      this.selectedBooking = booking
      
      if (booking.status === 'driver_assigned') {
        try {
          const bookingRef = doc(db, 'orders', booking.id)
          await updateDoc(bookingRef, {
            status: 'in_transit',
            driverLocation: this.currentLocation,
            inTransitAt: serverTimestamp()
          })
          this.$toast?.success?.('Delivery started!')
        } catch (error) {
          console.error('[v0] Error starting delivery:', error)
          this.$toast?.error?.('Failed to start delivery. Please try again.')
          return
        }
      }
      
      // Navigate to delivery tracking page
      try {
        await this.$router.push(`/driver/tracking/${booking.id}`)
      } catch (routerError) {
        console.error('[v0] Error navigating to tracking page:', routerError)
        this.$toast?.error?.('Failed to open tracking page. Please try again.')
      }
    },
    openChat() {
      this.$router.push('/driver/chat')
    },
    async checkWeatherStatus() {
      try {
        const weatherData = await weatherService.checkWeather()
        this.isBadWeather = weatherData.isBadWeather
        this.currentWeather = weatherData.description
        this.badWeatherFeeEnabled = await weatherService.isBadWeatherFeeEnabled()
      } catch (error) {
        console.error('[v0] Error checking weather:', error)
      }
    },
    loadAssignedBookings() {
      const authStore = useAuthStore()
      const driverId = authStore.user?.uid
      if (!driverId) {
        console.error('[v0] Driver ID not found')
        return
      }

      // ensure single active listener
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }

      try {
        const q = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId)
        )
        this.unsubscribe = onSnapshot(q, async (snapshot) => {
          const usersMap = {}
          const userIds = new Set()
          snapshot.docs.forEach(docu => {
            if (docu.data().userId) {
              userIds.add(docu.data().userId)
            }
          })
          for (const userId of userIds) {
            try {
              const userDoc = await this.getUserData(userId)
              if (userDoc) usersMap[userId] = userDoc
            } catch (error) {
              console.error('[v0] Error fetching user data:', error)
            }
          }
          // Extract payment method from different possible locations in the booking object
          this.bookings = snapshot.docs.map(docu => {
            const order = {
              id: docu.id,
              ...docu.data()
            }
            if (order.userId && usersMap[order.userId]) {
              const userData = usersMap[order.userId]
              order.customerName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
              order.customerPhone = userData.phone || userData.contact
              order.customerEmail = userData.email
              order.customerAvatar = userData.profilePicture || userData.avatar
            }
            // Extract payment method from different possible locations in the booking object
            if (!order.paymentMethod) {
              // Try to get it from formData if it exists
              if (order.formData?.paymentMethod) {
                order.paymentMethod = order.formData.paymentMethod
              } else {
                // Check for a default payment method if none is found
                // This might need adjustment based on how payment methods are handled in your system
                // For now, defaulting to 'COD' if no other payment method is specified
                order.paymentMethod = 'COD'
              }
            }
            return order
          })
        }, (error) => {
          console.error('[v0] Error loading assignments:', error)
          this.$toast?.error?.('Failed to load assignments')
        })
      } catch (error) {
        console.error('[v0] Error setting up listener:', error)
      }
    },
    async getUserData(userId) {
      try {
        const userRef = doc(db, 'users', userId)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) return userSnap.data()
        return null
      } catch (error) {
        console.error('[v0] Error getting user data:', error)
        return null
      }
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          },
          (error) => {
            console.error('[v0] Error getting location:', error)
            this.$toast?.error?.('Unable to get your current location')
          }
        )
      }
    },
    async initializeGoogleMapsServices() {
      try {
        if (!window.google || !window.google.maps) {
          await this.loadGoogleMapsAPI()
        }
        this.directionsService = new window.google.maps.DirectionsService()
        this.distanceMatrixService = new window.google.maps.DistanceMatrixService()
      } catch (error) {
        console.error('[v0] Error initializing Google Maps services:', error)
      }
    },
    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,geometry,directions&loading=async`
        script.async = true
        script.defer = true
        script.onerror = () => reject(new Error('Failed to load Google Maps API'))
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    },
    async shareLocation() {
      if (!this.currentLocation) {
        this.$toast?.error?.('Unable to get your location')
        return
      }
      try {
        const locationUrl = `https://maps.google.com/?q=$${this.currentLocation.lat},${this.currentLocation.lng}`
        if (navigator.share) {
          await navigator.share({
            title: 'My Current Location',
            text: 'Here is my current location for your delivery',
            url: locationUrl
          })
        } else {
          await navigator.clipboard.writeText(locationUrl)
          this.$toast?.success?.('Location link copied to clipboard!')
        }
      } catch (error) {
        console.error('[v0] Error sharing location:', error)
        this.$toast?.error?.('Failed to share location')
      }
    },
    async navigateToPickup() {
      if (!this.currentLocation || !this.selectedBooking) {
        this.$toast?.error?.('Missing location information')
        return
      }
      try {
        const pickupAddress =
          this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
        const directionsRequest = {
          origin: new window.google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng),
          destination: pickupAddress,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        }
        this.directionsService.route(directionsRequest, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=$${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(pickupAddress)}&travelmode=driving`
            window.open(mapsUrl, '_blank')
            this.$toast?.success?.('Opening directions in Google Maps')
          } else {
            console.error('[v0] Directions request failed:', status)
            this.$toast?.error?.('Unable to get directions')
          }
        })
      } catch (error) {
        console.error('[v0] Error getting directions:', error)
        this.$toast?.error?.('Failed to get directions')
      }
    },
    async confirmStartDelivery() {
      if (!this.selectedBooking) return
      try {
        const bookingRef = doc(db, 'orders', this.selectedBooking.id)
        await updateDoc(bookingRef, {
          status: 'in_transit',
          driverLocation: this.currentLocation,
          inTransitAt: serverTimestamp()
        })
        this.$toast?.success?.('Delivery started!')
        this.showStartDeliveryModal = false
      } catch (error) {
        console.error('[v0] Error starting delivery:', error)
        this.$toast?.error?.('Failed to start delivery')
      }
    },
    async useMyLocation() {
      if (!this.selectedBooking) return
      try {
        if (!this.isTrackingLocation) {
          if (navigator.geolocation) {
            this.locationWatchId = navigator.geolocation.watchPosition(
              async (position) => {
                this.currentLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  timestamp: new Date()
                }
                try {
                  const bookingRef = doc(db, 'orders', this.selectedBooking.id)
                  await updateDoc(bookingRef, {
                    driverLocation: {
                      lat: this.currentLocation.lat,
                      lng: this.currentLocation.lng,
                      timestamp: serverTimestamp()
                    }
                  })
                } catch (error) {
                  console.error('[v0] Error updating driver location:', error)
                }
              },
              (error) => {
                console.error('[v0] Location tracking error:', error)
                this.$toast?.error?.('Unable to track location')
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            )
            this.isTrackingLocation = true
            this.$toast?.success?.('Location tracking enabled')
          }
        } else {
          if (this.locationWatchId) {
            navigator.geolocation.clearWatch(this.locationWatchId)
            this.locationWatchId = null
          }
          this.isTrackingLocation = false
          this.$toast?.success?.('Location tracking disabled')
        }
      } catch (error) {
        console.error('[v0] Error toggling location tracking:', error)
        this.$toast?.error?.('Failed to toggle location tracking')
      }
    },
    async showNavigationMap() {
      if (!this.currentLocation || !this.selectedBooking) {
        this.$toast?.error?.('Missing location information')
        return
      }
      try {
        const pickupAddress =
          this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
        const dropoffAddress =
          this.selectedBooking.deliveryAddress || this.getDeliveryLocation(this.selectedBooking)
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=$${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(dropoffAddress)}&waypoints=${encodeURIComponent(pickupAddress)}&travelmode=driving`
        window.open(mapsUrl, '_blank')
        this.$toast?.success?.('Navigation opened in Google Maps')
        this.showStartDeliveryModal = false
      } catch (error) {
        console.error('[v0] Error opening navigation:', error)
        this.$toast?.error?.('Failed to open navigation')
      }
    },
    async initializeNavigationMap() {
      try {
        if (!window.google || !window.google.maps) {
          await this.loadGoogleMapsAPI()
        }
        const mapElement = document.getElementById('navigationMap')
        if (!mapElement) return
        this.map = new window.google.maps.Map(mapElement, {
          zoom: 13,
          center: { lat: this.currentLocation.lat, lng: this.currentLocation.lng },
          mapTypeId: 'roadmap'
        })
        this.directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: this.map,
          suppressMarkers: false
        })
        await this.calculateAndDisplayRoute()
      } catch (error) {
        console.error('[v0] Error initializing navigation map:', error)
        this.$toast?.error?.('Failed to load map')
      }
    },
    async calculateAndDisplayRoute() {
      try {
        const pickupAddress =
          this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
        const dropoffAddress =
          this.selectedBooking.deliveryAddress || this.getDeliveryLocation(this.selectedBooking)
        const request = {
          origin: new window.google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng),
          destination: dropoffAddress,
          waypoints: [
            {
              location: pickupAddress,
              stopover: true
            }
          ],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        }
        this.directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            this.directionsRenderer.setDirections(result)
            const route = result.routes[0]
            const leg = route.legs[0]
            this.routeDetails = {
              distance: leg.distance.text,
              duration: leg.duration.text,
              steps: leg.steps
            }
          } else {
            console.error('[v0] Directions request failed:', status)
            this.$toast?.error?.('Unable to calculate route')
          }
        })
      } catch (error) {
        console.error('[v0] Error calculating route:', error)
        this.$toast?.error?.('Failed to calculate route')
      }
    },
    showDirections() {
      if (!this.currentLocation || !this.selectedBooking) return
      const pickupAddress =
        this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=$${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(pickupAddress)}&travelmode=driving`
      window.open(mapsUrl, '_blank')
      this.$toast?.success?.('Opening directions in Google Maps')
    },
    startNavigation() {
      if (!this.currentLocation || !this.selectedBooking) return
      const pickupAddress =
        this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
      const dropoffAddress =
        this.selectedBooking.deliveryAddress || this.getDeliveryLocation(this.selectedBooking)
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=$${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(dropoffAddress)}&waypoints=${encodeURIComponent(pickupAddress)}&travelmode=driving`
      window.open(mapsUrl, '_blank')
      this.$toast?.success?.('Navigation started in Google Maps')
    },
    async updateDeliveryStatus(booking, newStatus) {
      if (!booking) return
      try {
        const bookingRef = doc(db, 'orders', booking.id)
        const updateData = {
          status: newStatus,
          driverLocation: this.currentLocation,
          updatedAt: serverTimestamp()
        }
        if (newStatus === 'in_transit') {
          updateData.inTransitAt = serverTimestamp()
        } else if (newStatus === 'on_the_way') {
          updateData.onTheWayAt = serverTimestamp()
        } else if (newStatus === 'delivered') {
          updateData.deliveredAt = serverTimestamp()
        }
        await updateDoc(bookingRef, updateData)
        this.$toast?.success?.(`Status updated to ${this.formatStatus(newStatus)}!`)
        this.showStartDeliveryModal = false
      } catch (error) {
        console.error('[v0] Error updating delivery status:', error)
        this.$toast?.error?.('Failed to update status')
      }
    },
    isImageUrl(url) {
      if (!url) return false
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('firebasestorage')
    },
    openReceiptPreview(url) {
      this.receiptPreviewUrl = url
      this.showReceiptPreviewModal = true
    },
  },
  mounted() {
    this.checkWeatherStatus()
    this.loadAssignedBookings()
    this.weatherInterval = setInterval(() => this.checkWeatherStatus(), 10 * 60 * 1000)
  },
  beforeUnmount() {
    if (this.weatherInterval) clearInterval(this.weatherInterval)
    if (this.unsubscribe) this.unsubscribe()
    if (this.locationWatchId) navigator.geolocation.clearWatch(this.locationWatchId)
  }
}
</script>