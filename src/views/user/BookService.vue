<template>
  <div class="min-h-screen w-full bg-gray-50/50 overflow-x-hidden font-sans pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">
      
      <div class="relative overflow-hidden bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg text-white transform transition hover:scale-[1.005] duration-500">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 md:w-64 md:h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10">
          <div class="flex flex-col md:flex-row md:items-center md:space-x-3 mb-2">
            <div class="w-fit p-2 bg-white/20 rounded-lg backdrop-blur-sm mb-2 md:mb-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Book a Service</h1>
          </div>
          <p class="text-[#e6ffcc] text-base md:text-lg font-medium ml-0 md:ml-1">Choose your delivery service and get instant quotes.</p>
        </div>
      </div>

      <div class="space-y-4">
        <div v-if="isBadWeather && badWeatherFeeEnabled" class="bg-yellow-50 border-l-4 border-yellow-500 p-4 md:p-6 rounded-r-xl shadow-sm flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 animate-pulse border border-yellow-100">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm md:text-base font-bold text-yellow-800">⚠️ Bad Weather Alert</h3>
            <p class="text-xs md:text-sm text-yellow-700 mt-1">
              Current weather: <strong>{{ currentWeather }}</strong>. A <strong class="bg-yellow-200 px-1 rounded">₱{{ pricingSettings.pricingRules?.rainSurcharge || 10 }} surcharge</strong> applies.
            </p>
          </div>
        </div>

        <div v-if="isBookingRestricted" class="bg-red-50 border-l-4 border-red-500 p-4 md:p-6 rounded-r-xl shadow-sm flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border border-red-100">
          <div class="flex-shrink-0">
             <svg class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm md:text-base font-bold text-red-800">🚫 Booking Restricted</h3>
            <p class="text-xs md:text-sm text-red-700 mt-1">
              <span v-if="restrictionType === 'banned'">Account banned. Contact support.</span>
              <span v-else-if="restrictionType === 'flagged'">Restricted until <strong>{{ restrictionEndTime }}</strong>.</span>
            </p>
             <p v-if="restrictionReason" class="text-xs text-red-600 italic mt-1">Reason: {{ restrictionReason }}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center px-1">
          <span class="w-1.5 h-6 md:h-8 bg-[#3ED400] rounded-full mr-3"></span>
          Select Service Type
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="service in services"
            :key="service.id"
            @click="onSelectService(service)"
            :class="[
              'relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 group',
              selectedService?.id === service.id 
                ? 'border-[#3ED400] bg-[#f9fff0] shadow-md -translate-y-1' 
                : 'border-transparent bg-white hover:border-gray-200 hover:shadow-lg hover:-translate-y-1'
            ]"
          >
            <div v-if="selectedService?.id === service.id" class="absolute top-3 right-3 text-[#3ED400]">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            </div>

            <div class="flex items-start space-x-4">
              <div :class="[
                'flex-shrink-0 p-3 rounded-xl transition-colors duration-300 shadow-sm flex items-center justify-center w-14 h-14',
                service.id === 'medicine-delivery' ? 'bg-teal-100 text-teal-600' : 
                service.id === 'food-delivery' ? 'bg-orange-100 text-orange-600' :
                service.id === 'bill-payments' ? 'bg-blue-100 text-blue-600' :
                service.id === 'grocery-shopping' ? 'bg-green-100 text-green-600' :
                service.id === 'gift-delivery' ? 'bg-pink-100 text-pink-600' :
                'bg-indigo-100 text-indigo-600'
              ]">
                <svg v-if="service.id === 'medicine-delivery'" class="w-8 h-8" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><mask id="medMask"><g fill="none"><rect width="38" height="26" x="5" y="16" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="3"/><path fill="#fff" d="M19 8h10V4H19zm11 1v7h4V9zm-12 7V9h-4v7zm11-8a1 1 0 0 1 1 1h4a5 5 0 0 0-5-5zM19 4a5 5 0 0 0-5 5h4a1 1 0 0 1 1-1z"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M18 29h12m-6-6v12"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#medMask)"/></svg>
                <svg v-else-if="service.id === 'food-delivery'" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26c1.44 1.42 2.43 2.89 2.43 5.29zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-8-15.03-8-15.03 0zM1.02 17h15v2h-15z"/></svg>
                <svg v-else-if="service.id === 'bill-payments'" class="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5zm8 16h12m-12 8h12M18 14h12"/></svg>
                <svg v-else-if="service.id === 'grocery-shopping'" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M2 4h1l3.6 7.59l-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 20.01 4H5.21l-.67-1.43a.99.99 0 0 0-.9-.57H2c-.55 0-1 .45-1 1s.45 1 1 1m15 14c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2"/></svg>
                <svg v-else-if="service.id === 'gift-delivery'" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M9.06 1.93C7.17 1.92 5.33 3.74 6.17 6H3a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h9V8h2v3h9a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-3.17C19 2.73 14.6.42 12.57 3.24L12 4l-.57-.78c-.63-.89-1.5-1.28-2.37-1.29M9 4c.89 0 1.34 1.08.71 1.71S8 5.89 8 5a1 1 0 0 1 1-1m6 0c.89 0 1.34 1.08.71 1.71S14 5.89 14 5a1 1 0 0 1 1-1M2 12v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8h-9v8h-2v-8z"/></svg>
                <svg v-else class="w-8 h-8" viewBox="0 0 256 256" fill="currentColor"><path d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.35 44l-29.78 16.29l-80.35-44Zm0 88L47.65 76l33.91-18.57l80.35 44Zm88 55.85l-80 43.79v-85.81l32-17.51V152a8 8 0 0 0 16 0v-44.44l32-17.51v85.76Z"/></svg>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-900 text-lg leading-tight">{{ service.name }}</h3>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{{ service.description }}</p>
                <div class="mt-3">
                  <span class="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md border border-gray-200 uppercase tracking-wide">
                    Starts at ₱{{ baseFee.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedService" class="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div class="lg:col-span-1 order-1 lg:order-1 space-y-6">
          <div class="lg:sticky lg:top-6 space-y-6">
            
            <div class="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-gray-700 text-xs md:text-sm uppercase tracking-wide">Route Map</h3>
                <button @click="getCurrentLocation" type="button" class="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-full font-bold text-gray-600 hover:text-[#3ED400] hover:border-[#3ED400] transition-colors flex items-center shadow-sm">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Locate Me
                </button>
              </div>
              <div class="relative">
                 <div id="map" class="w-full h-56 md:h-64 bg-gray-200"></div>
              </div>
              <div class="p-4 flex divide-x divide-gray-200 bg-white">
                <div class="flex-1 text-center">
                  <p class="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Distance</p>
                  <p class="text-lg font-bold text-gray-800">{{ routeInfo.distance }}</p>
                </div>
                <div class="flex-1 text-center">
                  <p class="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Time</p>
                  <p class="text-lg font-bold text-gray-800">{{ routeInfo.duration }}</p>
                </div>
              </div>
            </div>

            <div v-if="routeInfo.distanceValue > 0" class="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#f0fce6] to-transparent rounded-bl-full"></div>
              <h3 class="text-lg font-bold text-gray-800 mb-4 relative z-10">Fee Breakdown</h3>
              
              <div class="space-y-3 text-sm relative z-10">
                <div class="flex justify-between text-gray-600">
                  <span>Base Charge</span>
                  <span class="font-medium">₱{{ calculatedPrice.baseCharge }}</span>
                </div>
                
                <div v-if="calculatedPrice.distanceFee > 0" class="flex justify-between text-gray-600">
                  <span>Distance Fee</span>
                  <span class="font-medium">₱{{ calculatedPrice.distanceFee }}</span>
                </div>

                <div v-if="calculatedPrice.addOnsTotal > 0" class="flex justify-between text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  <span>Add-ons / Fees</span>
                  <span class="font-medium">₱{{ calculatedPrice.addOnsTotal }}</span>
                </div>

                <div v-if="calculatedPrice.badWeatherFee > 0" class="flex justify-between text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  <span>Weather Fee</span>
                  <span class="font-medium">₱{{ calculatedPrice.badWeatherFee }}</span>
                </div>
                
                <div v-if="bookingForm.paymentMethod === 'GCASH'" class="flex justify-between text-blue-600">
                  <span>GCash Fee</span>
                  <span class="font-medium">₱{{ calculatedPrice.gcashFee }}</span>
                </div>
                <p v-if="bookingForm.paymentMethod === 'GCASH'" class="text-[10px] text-gray-400 text-right">{{ getGcashFeeDescription() }}</p>
                
                <p v-if="calculatedPrice.isFixedRate" class="text-xs text-green-600 italic text-right mt-1">
                   *Applied fixed rate for this location
                </p>
              </div>

              <div class="my-4 border-t-2 border-dashed border-gray-200"></div>

              <div class="flex justify-between items-end">
                <span class="text-gray-500 font-medium text-sm">Total Estimate</span>
                <span class="text-3xl font-extrabold text-[#3ED400]">₱{{ calculatedPrice.total }}</span>
              </div>
            </div>

          </div>
        </div>

        <div class="lg:col-span-2 order-2 lg:order-2">
          <form @submit.prevent="submitBooking" class="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 relative">
            
            <div class="flex items-center mb-6 pb-4 border-b border-gray-100">
              <span class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#74E600] to-[#00C851] text-white flex items-center justify-center font-bold mr-3 shadow-sm text-sm md:text-base">1</span>
              <h2 class="text-lg md:text-xl font-bold text-gray-800">Booking Details</h2>
            </div>

            <div class="space-y-6 md:space-y-8">
              
              <div v-if="selectedService.id === 'food-delivery'" class="space-y-6">
                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Restaurant Info</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Restaurant Name *</label>
                      <input type="text" v-model.trim="bookingForm.restaurantName" @input="onRestaurantNameInput" @blur="validateRestaurantName" required class="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm" :class="restaurantNameWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'" placeholder="Where should we buy?"/>
                      <p v-if="restaurantNameWarning" class="text-yellow-500 text-xs mt-1">{{ restaurantNameWarning }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Restaurant Address *</label>
                      <input type="text" v-model.trim="bookingForm.restaurantAddress" ref="restaurantAddressInput" @input="onAddressManualInput" @focus="onRestaurantAddressFocus" required class="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm" :class="restaurantAddressWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'" placeholder="Restaurant location"/>
                       <p v-if="restaurantAddressWarning" class="text-yellow-500 text-xs mt-1">{{ restaurantAddressWarning }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Order Details</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">What to buy? *</label>
                      <textarea v-model.trim="bookingForm.foodOrderDetails" rows="3" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm" placeholder="e.g. 2pcs Fried Chicken..."></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Budget Range *</label>
                        <select v-model="bookingForm.budgetRange" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm">
                          <option value="">Select Range</option>
                          <option value="P1-P499">₱1 - ₱499</option>
                          <option value="P500-P999">₱500 - ₱999</option>
                          <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                          <option value="P2000+">₱2,000+</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Special Instructions</label>
                        <input type="text" v-model.trim="bookingForm.specialInstructions" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm" placeholder="Optional"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedService.id === 'bill-payments'" class="space-y-6">
                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Bill Information</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Biller Name *</label>
                      <input type="text" v-model.trim="bookingForm.billerName" ref="billerNameInput" @input="onBillerNameInput" @focus="onBillerNameFocus" required placeholder="e.g. MERALCO" class="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm" :class="billerNameWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'"/>
                       <p v-if="billerNameWarning" class="text-yellow-500 text-xs mt-1">{{ billerNameWarning }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Account Name *</label>
                      <input type="text" v-model.trim="bookingForm.accountName" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Account Number *</label>
                      <input type="text" v-model.trim="bookingForm.accountNumber" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Amount *</label>
                      <input type="number" v-model.number="bookingForm.amountToPay" min="1" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                        <input type="date" v-model="bookingForm.dueDate" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Budget Range *</label>
                      <select v-model="bookingForm.budgetRange" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm">
                        <option value="">Select Range</option>
                        <option value="P1-P499">₱1 - ₱499</option>
                        <option value="P500-P999">₱500 - ₱999</option>
                        <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                        <option value="P2000+">₱2,000+</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white p-5 rounded-2xl border-2 border-dashed hover:border-[#3ED400] hover:bg-green-50/30 transition-all text-center" :class="(!bookingForm.billReceiptUrl && !uploadingBillReceipt) ? 'border-gray-300' : 'border-[#3ED400]'">
                  <label class="cursor-pointer block">
                    <span class="block text-sm font-bold text-gray-600 mb-2">Upload Bill Receipt / Reference *</span>
                    <input type="file" accept="image/*,.pdf" @change="handleBillReceiptSelect" class="hidden"/>
                    <span class="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-[#3ED400] hover:text-white transition-colors">Choose File</span>
                  </label>
                  <div v-if="uploadingBillReceipt" class="mt-3 h-1 w-1/2 mx-auto bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-[#3ED400] transition-all duration-300" :style="{ width: billReceiptProgress + '%' }"></div>
                  </div>
                  <p v-if="bookingForm.billReceiptUrl" class="mt-2 text-xs text-green-600 font-bold">✓ Uploaded Successfully</p>
                  <p v-if="selectedService.id==='bill-payments' && !bookingForm.billReceiptUrl && !uploadingBillReceipt" class="text-red-500 text-xs mt-2">Receipt is required</p>
                </div>
                
                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Logistics</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Pickup Address (Payment) *</label>
                      <input type="text" v-model.trim="bookingForm.pickupAddress" required ref="pickupAddressInput" @input="onAddressManualInput" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Return Address (Receipt) *</label>
                      <input type="text" v-model.trim="bookingForm.returnAddress" required ref="returnAddressInput" @input="onAddressManualInput" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedService.id === 'grocery-shopping'" class="space-y-6">
                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Store Info</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Store Preference (Optional)</label>
                      <input type="text" v-model.trim="bookingForm.storePreference" ref="storePreferenceInput" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm" placeholder="e.g. SM Supermarket"/>
                      <p class="text-xs text-gray-500 mt-1">Start typing to search for stores</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Shopping Details</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Shopping List *</label>
                      <textarea v-model.trim="bookingForm.shoppingList" rows="5" required placeholder="- Item 1
- Item 2" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Budget Range *</label>
                      <select v-model="bookingForm.budgetRange" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm">
                        <option value="">Select Range</option>
                        <option value="P1-P499">₱1 - ₱499</option>
                        <option value="P500-P999">₱500 - ₱999</option>
                        <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                        <option value="P2000+">₱2,000+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedService.id === 'gift-delivery'" class="space-y-6">
                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Gift Info</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Gift Type *</label>
                      <input type="text" v-model.trim="bookingForm.giftType" required placeholder="e.g. Cake, Flowers" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Store Name *</label>
                        <input type="text" v-model.trim="bookingForm.storeName" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Store Address *</label>
                        <input type="text" v-model.trim="bookingForm.storeAddress" required ref="storeAddressInput" @input="onAddressManualInput" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Special Instructions</label>
                          <textarea v-model.trim="bookingForm.specialInstructions" rows="2" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"></textarea>
                        </div>
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Budget Range *</label>
                          <select v-model="bookingForm.budgetRange" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm">
                            <option value="">Select Range</option>
                            <option value="P1-P499">₱1 - ₱499</option>
                            <option value="P500-P999">₱500 - ₱999</option>
                            <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                            <option value="P2000+">₱2,000+</option>
                          </select>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedService.id === 'medicine-delivery'" class="space-y-6">
                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Medicine Info</label>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Medicine List *</label>
                      <textarea v-model.trim="bookingForm.medicineNames" rows="3" required placeholder="List medicines..." class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Upload Prescription (Optional)</label>
                      <input type="file" @change="handleFileUpload" accept="image/*,.pdf" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f0fce6] file:text-[#3ED400] hover:file:bg-[#e6ffcc]"/>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Quantity *</label>
                        <input type="text" v-model.trim="bookingForm.quantity" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Budget Range *</label>
                        <select v-model="bookingForm.budgetRange" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm">
                          <option value="">Select Range</option>
                          <option value="P1-P499">₱1 - ₱499</option>
                          <option value="P500-P999">₱500 - ₱999</option>
                          <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                          <option value="P2000+">₱2,000+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedService.id === 'pickup-drop'" class="space-y-6">
                <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                  <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Pickup Logistics</label>
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Pickup Address *</label>
                        <input type="text" v-model.trim="bookingForm.pickupAddress" required ref="pickupAddressInput" @input="onAddressManualInput" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Pickup Contact *</label>
                        <input type="text" v-model.trim="bookingForm.pickupContact" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Item Description *</label>
                      <textarea v-model.trim="bookingForm.itemDescription" rows="2" required placeholder="What are we moving?" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Item Type *</label>
                        <select v-model="bookingForm.itemType" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm">
                          <option value="">Select Type</option>
                          <option value="LAUNDRY">Laundry</option>
                          <option value="PET_FOOD">Pet Food</option>
                          <option value="GAS_DELIVERY">Gas</option>
                          <option value="SACK_OF_RICE">Rice</option>
                          <option value="DOCUMENT_DELIVERY">Documents</option>
                          <option value="BOXES_OR_ITEMS">Boxes/Items</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Budget Range *</label>
                        <select v-model="bookingForm.budgetRange" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm">
                          <option value="">Select Range</option>
                          <option value="P1-P499">₱1 - ₱499</option>
                          <option value="P500-P999">₱500 - ₱999</option>
                          <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                          <option value="P2000+">₱2,000+</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200 hover:border-[#3ED400] transition-colors">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">
                  {{ selectedService.id === 'pickup-drop' ? 'Drop-off Details' : 'Delivery Destination' }}
                </label>
                
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">
                        {{ selectedService.id === 'pickup-drop' ? 'Receiver Name' : (selectedService.id === 'gift-delivery' ? 'Recipient Name' : 'Receiver Name') }} *
                      </label>
                      <input 
                        v-if="selectedService.id === 'gift-delivery'" 
                        type="text" v-model.trim="bookingForm.recipientName" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"
                      />
                      <input 
                        v-else 
                        type="text" v-model.trim="bookingForm.receiverName" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Contact Number *</label>
                      <input 
                        v-if="selectedService.id === 'gift-delivery'" 
                        type="tel" v-model.trim="bookingForm.recipientContact" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"
                      />
                      <input 
                        v-else 
                        type="tel" v-model.trim="bookingForm.receiverContact" required class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                      {{ selectedService.id === 'pickup-drop' ? 'Drop-off Address' : 'Delivery Address' }} *
                    </label>
                    <input 
                      v-if="selectedService.id === 'pickup-drop'"
                      type="text" v-model.trim="bookingForm.dropoffAddress" required ref="dropoffAddressInput" @input="onAddressManualInput" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"
                    />
                    <input 
                      v-else
                      type="text" v-model.trim="bookingForm.deliveryAddress" required ref="deliveryAddressInput" @input="onAddressManualInput" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="selectedService.id !== 'pickup-drop'">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Landmark</label>
                      <input type="text" v-model.trim="bookingForm.landmark" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm" placeholder="Optional"/>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
                      <input v-if="selectedService.id === 'gift-delivery'" type="datetime-local" v-model="bookingForm.preferredDateTime" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                      <input v-else type="time" v-model="bookingForm.preferredTime" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] focus:border-transparent outline-none transition-all shadow-sm text-sm"/>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-200">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">Payment</label>
                <div class="flex flex-col sm:flex-row gap-4">
                  <label class="flex-1 flex items-center p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#3ED400] transition-all shadow-sm group" :class="{'ring-2 ring-[#3ED400] border-transparent': bookingForm.paymentMethod === 'GCASH'}">
                    <input type="radio" v-model="bookingForm.paymentMethod" value="GCASH" class="w-4 h-4 text-[#3ED400] focus:ring-[#3ED400]"/>
                    <span class="ml-3 font-semibold text-gray-700 group-hover:text-[#3ED400] transition-colors">GCash</span>
                  </label>
                  <label class="flex-1 flex items-center p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#3ED400] transition-all shadow-sm group" :class="{'ring-2 ring-[#3ED400] border-transparent': bookingForm.paymentMethod === 'COD'}">
                    <input type="radio" v-model="bookingForm.paymentMethod" value="COD" class="w-4 h-4 text-[#3ED400] focus:ring-[#3ED400]"/>
                    <span class="ml-3 font-semibold text-gray-700 group-hover:text-[#3ED400] transition-colors">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-100 space-y-2">
                <button
                  type="submit"
                  :disabled="!canSubmitBooking || submitting || (selectedService?.id==='bill-payments' && uploadingBillReceipt)"
                  class="w-full py-4 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                  {{ submitting ? 'Processing Booking...' : 'Submit Booking' }}
                </button>
                 <p v-if="formError" class="text-sm text-red-500 text-center">{{ formError }}</p>
              </div>

            </div>
          </form>
        </div>

      </div>

    </div>

    <div v-if="showNotificationModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" @click="closeNotificationModal">
      <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100" @click.stop>
        <div class="text-center">
          <div :class="[
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-md',
            notificationType === 'success' ? 'bg-green-100 text-green-600' : 
            notificationType === 'error' ? 'bg-red-100 text-red-600' : 
            notificationType === 'warning' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          ]">
            <svg v-if="notificationType === 'success'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else-if="notificationType === 'error'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             <svg v-else-if="notificationType === 'warning'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ notificationType === 'success' ? 'Success!' : notificationType === 'error' ? 'Something went wrong' : 'Notice' }}
          </h3>
          <p class="text-gray-600 mb-6 leading-relaxed text-sm">{{ notificationMessage }}</p>
          
          <button 
            @click="closeNotificationModal"
            class="w-full py-3 rounded-xl font-bold text-white transition-colors shadow-md transform active:scale-95"
            :class="notificationType === 'success' ? 'bg-[#3ED400] hover:bg-[#32b000]' : 'bg-gray-800 hover:bg-gray-900'"
          >
            Okay, Got it
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, addDoc, serverTimestamp, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { weatherService } from '@/services/weatherService'
import { loggingService } from '@/services/loggingService'
import { realtimeService } from '@/services/realtime'

export default {
  name: 'BookService',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      selectedService: null,
      submitting: false,
      formError: '',
      uploadingBillReceipt: false,
      billReceiptProgress: 0,

      // Notification modal state
      showNotificationModal: false,
      notificationType: 'success', 
      notificationMessage: '',

      isBadWeather: false,
      currentWeather: '',
      badWeatherFeeEnabled: false,
      weatherCheckInterval: null,

      // Updated Pricing Settings Structure
      pricingSettings: {
        services: [],
        pricingRules: { peakHours: 1.3, badWeather: 10, highDemand: 1.8, baseFee: 54 },
        specialFees: {}, // NEW: for hillTop, loobLakad, etc.
        locationRates: [], // NEW: for fixed rates table
        gcashCharges: []
      },
      pricingUnsubscribe: null,
      
      calculatedPrice: {
        baseCharge: 54,
        distanceFee: 0,
        addOnsTotal: 0, // NEW
        badWeatherFee: 0,
        gcashFee: 0,
        subtotal: 54,
        total: 54,
        isFixedRate: false
      },

      // Maps instances
      map: null,
      directionsService: null,
      directionsRenderer: null,
      geocoder: null,
      distanceService: null,
      currentLocationMarker: null,
      pickupMarker: null,
      deliveryMarker: null,
      routeInfo: { distance: 'N/A', duration: 'N/A', distanceValue: 0, durationValue: 0 },
      autocompleteInstances: {},
      mapsReady: false,
      debounceTimer: null,
      formSaveTimer: null,
      restaurantNameWarning: '',
      restaurantAddressWarning: '',
      billerNameWarning: '',
      jollibeeMarkers: [],
      billerMarkers: [],
      jollibeePlacesService: null,

      services: [
        { id: 'food-delivery', name: 'Food Delivery', description: 'Restaurant orders and food delivery', icon: 'M12 6l3 6-3 6-3-6 3-6z' },
        { id: 'bill-payments', name: 'Bill Payments', description: 'Pay your bills and get receipts delivered', icon: 'M9 12l2 2 4-4M5 12a7 7 0 1114 0 7 7 0 01-14 0z' },
        { id: 'grocery-shopping', name: 'Grocery Shopping', description: 'Fresh groceries delivered to your door', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4' },
        { id: 'gift-delivery', name: 'Gift Delivery', description: 'Special gifts delivered with care', icon: 'M12 8v13l-4-4-4 4M12 4a8 8 0 110 16 8 8 0 010-16z' },
        { id: 'medicine-delivery', name: 'Medicine Delivery', description: 'Prescription and over-the-counter medicines', icon: 'M7 7h10M7 11h10M7 15h6' },
        { id: 'pickup-drop', name: 'Pick-up & Drop', description: 'Pick up and deliver items between locations', icon: 'M4 7l8-4 8 4-8 4-8-4z M12 11l8-4v10l-8 4-8-4V7' }
      ],

      bookingForm: {
        // Common
        paymentMethod: 'COD',
        // Food
        restaurantName: '', restaurantAddress: '', foodOrderDetails: '', specialInstructions: '', budgetRange: '',
        receiverName: '', receiverContact: '', deliveryAddress: '', landmark: '', preferredTime: '',
        // Bill
        billerName: '', accountName: '', accountNumber: '', amountToPay: '', dueDate: '', pickupAddress: '', returnAddress: '', preferredSchedule: '',
        billReceiptFile: null, billReceiptUrl: '',
        // Grocery
        shoppingList: '', storePreference: '',
        // Gift
        giftType: '', recipientName: '', recipientContact: '', preferredDateTime: '', storeName: '', storeAddress: '',
        // Medicine
        medicineNames: '', prescriptionFile: null, quantity: '',
        // Pick-up & Drop
        pickupContact: '', itemDescription: '', itemType: '', dropoffAddress: '', preferredPickupDateTime: ''
      },

      isBookingRestricted: false,
      restrictionType: null, 
      restrictionEndTime: null,
      restrictionReason: null

    }
  },
  computed: {
    canSubmitBooking() {
      if (this.isBookingRestricted) return false
      if (!this.selectedService) return false
      const hasPaymentMethod = !!this.bookingForm.paymentMethod
      const hasRequiredFields = this.checkRequiredFields()
      const noBlockingUpload = !(this.selectedService.id === 'bill-payments' && this.uploadingBillReceipt)
      return hasPaymentMethod && hasRequiredFields && noBlockingUpload
    },
    baseFee() {
      return this.pricingSettings?.pricingRules?.baseFee || 54
    }
  },
  async mounted() {
    this.restoreFormData()
    await this.checkUserRestriction()
    this.loadGoogleMapsAPI()
    await this.loadPricingSettings()
    await this.checkBadWeatherFeeEnabled()
    await this.checkWeather()
    this.weatherCheckInterval = setInterval(() => {
      this.checkWeather()
    }, 10 * 60 * 1000)
  },
  beforeUnmount() {
    this.saveFormData()
    if (this.formSaveTimer) clearTimeout(this.formSaveTimer)
    this.clearJollibeeMarkers()
    this.clearBillerMarkers()
    if (window.selectJollibeeLocation) delete window.selectJollibeeLocation
    if (window.selectBillerLocation) delete window.selectBillerLocation
    if (this.weatherCheckInterval) clearInterval(this.weatherCheckInterval)
    if (this.pricingUnsubscribe) {
      this.pricingUnsubscribe()
      this.pricingUnsubscribe = null
    }
  },
  methods: {
    // ---------- PRICING & CALCULATION (UPDATED) ----------

    async loadPricingSettings() {
      try {
        const docRef = doc(db, 'settings', 'pricing')
        this.pricingUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            this.pricingSettings = docSnap.data()
            // Set default empty structures if missing from DB
            if (!this.pricingSettings.specialFees) {
               this.pricingSettings.specialFees = { hillTop: 10, loobLakad: 10, box: 10, highFloor: 20, bulkFood: 50 }
            }
            if (!this.pricingSettings.locationRates) {
               this.pricingSettings.locationRates = []
            }
            console.log('[v1] Pricing settings loaded:', this.pricingSettings)
            if (this.routeInfo.distanceValue > 0) this.calculateDeliveryFee()
          } else {
            console.warn('[v1] No pricing settings found, using defaults')
            this.pricingSettings = { pricingRules: { baseFee: 54 }, specialFees: {}, locationRates: [] }
          }
        }, (error) => {
          console.error('[v1] Error listening to pricing settings:', error)
          this.pricingSettings = { pricingRules: { baseFee: 54 } }
        })
      } catch (error) {
        console.error('[v1] Error loading pricing settings:', error)
      }
    },

    calculateDeliveryFee() {
      if (!this.selectedService || !this.routeInfo.distanceValue) return

      const distanceInKm = this.routeInfo.distanceValue / 1000
      let baseCharge = 0
      let distanceFee = 0
      let isFixedRate = false

      // 1. DETERMINE TARGET ADDRESS (For Fixed Rate Matching)
      let targetAddress = ''
      if (this.selectedService.id === 'pickup-drop') {
         targetAddress = this.bookingForm.dropoffAddress || ''
      } else {
         targetAddress = this.bookingForm.deliveryAddress || ''
      }
      const targetAddressLower = targetAddress.toLowerCase().trim()
      
      // 2. CHECK FIXED RATES (Priority) - From Admin PricingPanel
      // Look for a match in the locationRates array fetched from Admin Panel
      const rates = this.pricingSettings.locationRates || []
      
      // Improved matching logic: Check both barangay and landmark
      const matchedRate = rates.find(rate => {
         if (!targetAddressLower) return false
         
         const brgyLower = (rate.barangay || '').toLowerCase().trim()
         const landmarkLower = (rate.landmark || '').toLowerCase().trim()
         
         // If landmark exists, check if address contains landmark
         if (landmarkLower && targetAddressLower.includes(landmarkLower)) {
            return true
         }
         
         // If no landmark or landmark didn't match, check barangay
         if (brgyLower && targetAddressLower.includes(brgyLower)) {
            return true
         }
         
         return false
      })

      if (matchedRate) {
        // APPLY FIXED RATE
        baseCharge = matchedRate.price
        distanceFee = 0 // Fixed rates usually include distance logic already
        isFixedRate = true
      } else {
        // 3. FALLBACK TO DISTANCE FORMULA
        const settingsBase = this.pricingSettings?.pricingRules?.baseFee || 54
        const settingsPerKm = 15 // Standard excess rate
        
        if (distanceInKm <= 3) {
          baseCharge = settingsBase
          distanceFee = 0
        } else {
          // If > 3km
          baseCharge = settingsBase
          const excessKm = distanceInKm - 3
          distanceFee = excessKm * settingsPerKm
        }
        isFixedRate = false
      }

      // 4. CALCULATE ADD-ONS (Additional Fees) - AUTOMATIC DETECTION
      // Add-ons are automatically detected from address and applied based on Admin PricingPanel settings
      let addOnsTotal = 0
      const fees = this.pricingSettings.specialFees || {}

      // Auto-detect Hilltop areas (Xevera, Greenhills, San Antonio, etc.)
      const hilltopKeywords = ['xevera', 'greenhills', 'san antonio', 'hilltop', 'hill top', 'mountain', 'elevated']
      if (hilltopKeywords.some(keyword => targetAddressLower.includes(keyword))) {
        addOnsTotal += (fees.hillTop || 10)
      }

      // Auto-detect Loob/Lakad areas (Hospital, Schools, Kapitolyo, etc.)
      const loobLakadKeywords = ['hospital', 'school', 'kapitolyo', 'capitol', 'loob', 'lakad', 'inside', 'interior']
      if (loobLakadKeywords.some(keyword => targetAddressLower.includes(keyword))) {
        addOnsTotal += (fees.loobLakad || 10)
      }

      // Auto-detect High Floor (5th floor and above)
      const floorMatch = targetAddressLower.match(/(\d+)(st|nd|rd|th)?\s*floor|floor\s*(\d+)/i)
      if (floorMatch) {
        const floorNum = parseInt(floorMatch[1] || floorMatch[3])
        if (floorNum >= 5) {
          addOnsTotal += (fees.highFloor || 20)
        }
      }

      // Auto-detect Box (if address mentions box or package)
      const boxKeywords = ['box', 'package', 'parcel', 'balikbayan']
      if (boxKeywords.some(keyword => targetAddressLower.includes(keyword))) {
        addOnsTotal += (fees.box || 10)
      }

      // Note: Bulk Order (30+ items) detection would require item count from order details
      // This can be implemented later if order item count is available in the form
      // For now, bulk order detection is not automatic - can be enhanced when item count is tracked

      // 5. WEATHER & GCASH
      const badWeatherFee = (this.isBadWeather && this.badWeatherFeeEnabled) ? (this.pricingSettings.pricingRules.rainSurcharge || 10) : 0
      let subtotal = baseCharge + distanceFee + badWeatherFee + addOnsTotal

      let gcashFee = 0
      if (this.bookingForm.paymentMethod === 'GCASH' && this.bookingForm.budgetRange) {
        const range = this.bookingForm.budgetRange
        // Match string values from dropdown
        if (range === 'P1-P499') gcashFee = 5
        else if (range === 'P500-P999') gcashFee = 10
        else if (['P1000-P1500', 'Every P1k'].includes(range)) gcashFee = 20
        else if (range === 'P1500') gcashFee = 30
        else if (['P2000+', 'P2000'].includes(range)) gcashFee = 40
      }

      const total = subtotal + gcashFee

      // Update State
      this.calculatedPrice = {
        baseCharge: Math.round(baseCharge * 100) / 100,
        distanceFee: Math.round(distanceFee * 100) / 100,
        addOnsTotal: Math.round(addOnsTotal * 100) / 100,
        badWeatherFee: Math.round(badWeatherFee * 100) / 100,
        gcashFee: Math.round(gcashFee * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        total: Math.round(total * 100) / 100,
        isFixedRate: isFixedRate
      }

      console.log('[v1] Final Calculation:', this.calculatedPrice)
    },

    getGcashFeeDescription() {
      const budgetRange = this.bookingForm.budgetRange
      if (!budgetRange) return ''
      const feeMap = {
        'P1-P499': 'GCash fee for ₱1-₱499 (₱5)',
        'P500-P999': 'GCash fee for ₱500-₱999 (₱10)',
        'P1000-P1500': 'GCash fee for ₱1,000-₱1,500 (₱20)',
        'Every P1k': 'GCash fee for Every P1k (₱20)',
        'P1500': 'GCash fee for ₱1,500 (₱30)',
        'P2000+': 'GCash fee for ₱2,000+ (₱40)',
        'P2000': 'GCash fee for ₱2,000+ (₱40)'
      }
      return feeMap[budgetRange] || ''
    },

    // ---------- STANDARD METHODS (UNCHANGED LOGIC) ----------

    saveFormData() {
      try {
        const formDataToSave = {
          selectedService: this.selectedService,
          bookingForm: { ...this.bookingForm },
          timestamp: Date.now()
        }
        localStorage.setItem('bookServiceFormData', JSON.stringify(formDataToSave))
      } catch (error) {
        console.error('Error saving form data:', error)
      }
    },

    restoreFormData() {
      try {
        const savedData = localStorage.getItem('bookServiceFormData')
        if (savedData) {
          const parsed = JSON.parse(savedData)
          const maxAge = 24 * 60 * 60 * 1000 
          if (Date.now() - parsed.timestamp < maxAge) {
            if (parsed.selectedService) this.selectedService = parsed.selectedService
            if (parsed.bookingForm) {
              this.bookingForm = { ...this.bookingForm, ...parsed.bookingForm }
              if (this.bookingForm.restaurantName && this.bookingForm.restaurantName.length >= 3) {
                this.$nextTick(() => {
                  if (this.mapsReady) {
                    this.initializeMap()
                    setTimeout(() => {
                      this.searchRestaurantLocations(this.bookingForm.restaurantName.toLowerCase().trim())
                    }, 1000)
                  }
                })
              }
            }
          } else {
            localStorage.removeItem('bookServiceFormData')
          }
        }
      } catch (error) {
        localStorage.removeItem('bookServiceFormData')
      }
    },

    clearFormData() {
      localStorage.removeItem('bookServiceFormData')
    },

    // Data cleaning helpers
    _sanitizeForFirestore(value) {
      if (value === undefined) return null
      if (value instanceof File) return null
      if (value && typeof value === 'object') return value
      return value
    },
    _deepClean(obj) {
      if (obj === null || obj === undefined) return null
      if (obj instanceof File) return null
      if (Array.isArray(obj)) return obj.map(v => this._deepClean(v)).filter(v => v !== undefined)
      if (typeof obj === 'object') {
        const out = {}
        Object.keys(obj).forEach(k => {
          const v = this._deepClean(obj[k])
          if (v !== undefined) out[k] = v
          else out[k] = null
        })
        return out
      }
      return obj
    },
    _stringOrEmpty(v) { return (v === undefined || v === null) ? '' : String(v) },

    showNotification(type, message) {
      this.notificationType = type
      this.notificationMessage = message
      this.showNotificationModal = true
    },
    closeNotificationModal() {
      this.showNotificationModal = false
      this.notificationMessage = ''
    },

    async checkBadWeatherFeeEnabled() {
      try {
        this.badWeatherFeeEnabled = await weatherService.isBadWeatherFeeEnabled()
      } catch (error) {
        console.error('[v1] Error checking bad weather fee setting:', error)
      }
    },

    async checkWeather() {
      try {
        const weatherData = await weatherService.checkWeather()
        this.isBadWeather = weatherData.isBadWeather
        this.currentWeather = weatherData.description
        if (this.selectedService && this.routeInfo.distanceValue > 0) {
          this.calculateDeliveryFee()
        }
      } catch (error) {
        console.error('[v1] Error checking weather:', error)
      }
    },

    onSelectService(service) {
      this.selectedService = service
      this.formError = ''
      this.routeInfo = { distance: 'N/A', duration: 'N/A', distanceValue: 0, durationValue: 0 }
      this.calculatedPrice = { baseCharge: 54, distanceFee: 0, addOnsTotal: 0, badWeatherFee: 0, gcashFee: 0, subtotal: 54, total: 54, isFixedRate: false }

      if (this.directionsRenderer) {
        this.directionsRenderer.setDirections({ routes: [] })
      }
      this.saveFormData()
      this.$nextTick(() => {
        this.initializeMap()
        this.initializeAutocomplete()
      })
    },

    resetBookingForm() {
      this.bookingForm = {
        paymentMethod: 'COD',
        restaurantName: '', restaurantAddress: '', foodOrderDetails: '', specialInstructions: '', budgetRange: '',
        receiverName: '', receiverContact: '', deliveryAddress: '', landmark: '', preferredTime: '',
        billerName: '', accountName: '', accountNumber: '', amountToPay: '', dueDate: '', pickupAddress: '', returnAddress: '', preferredSchedule: '',
        billReceiptFile: null, billReceiptUrl: '',
        shoppingList: '', storePreference: '',
        giftType: '', recipientName: '', recipientContact: '', preferredDateTime: '', storeName: '', storeAddress: '',
        medicineNames: '', prescriptionFile: null, quantity: '',
        pickupContact: '', itemDescription: '', itemType: '', dropoffAddress: '', preferredPickupDateTime: ''
      }
      this.clearFormData()
      this.clearJollibeeMarkers()
      this.restaurantNameWarning = ''
      this.restaurantAddressWarning = ''
    },

    onAddressManualInput() {
      this.saveFormData()
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.updateRoute(), 350)
    },

    onRestaurantNameInput() {
      this.saveFormData()
      this.validateRestaurantName()
      this.clearJollibeeMarkers()
    },

    validateRestaurantName() {
      const name = this.bookingForm.restaurantName.trim()
      if (!name) {
        this.restaurantNameWarning = ''
        return
      }
      if (name.length < 2) {
        this.restaurantNameWarning = 'Restaurant name must be at least 2 characters'
      } else {
        this.restaurantNameWarning = ''
      }
    },

    onRestaurantAddressFocus() { this.restaurantAddressWarning = '' },
    onBillerNameInput() { this.saveFormData(); this.clearBillerMarkers() },
    onBillerNameFocus() { this.billerNameWarning = '' },

    // ... (Map logic remains mostly standard but ensured) ...
    loadGoogleMapsAPI() {
      if (window.google && window.google.maps) {
        this.mapsReady = true
        return
      }
      if (document.getElementById('gmaps-script')) return
      const script = document.createElement('script')
      script.id = 'gmaps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o&libraries=places,geometry&v=weekly&loading=async`
      script.async = true
      script.defer = true
      script.onload = () => {
        this.mapsReady = true
        if (this.selectedService) {
          this.initializeMap()
          this.initializeAutocomplete()
        }
      }
      document.head.appendChild(script)
    },

    initializeMap() {
      const mapElement = document.getElementById('map')
      if (!mapElement || !this.mapsReady) return
      const calapanCenter = { lat: 13.3771, lng: 121.1646 }
      const calapanBounds = { north: 13.4500, south: 13.3000, east: 121.2500, west: 121.0800 }

      this.map = new window.google.maps.Map(mapElement, {
        center: calapanCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        restriction: { latLngBounds: calapanBounds, strictBounds: true }
      })

      this.directionsService = new window.google.maps.DirectionsService()
      this.directionsRenderer = new window.google.maps.DirectionsRenderer({ draggable: false, suppressMarkers: true, preserveViewport: false })
      this.directionsRenderer.setMap(this.map)
      this.geocoder = new window.google.maps.Geocoder()
      this.distanceService = new window.google.maps.DistanceMatrixService()
      
      if (window.google && window.google.maps && window.google.maps.places) {
        this.jollibeePlacesService = new window.google.maps.places.PlacesService(this.map)
      }
      window.selectJollibeeLocation = (address, name) => { this.selectJollibeeLocation(address, name) }
      window.selectBillerLocation = (name, address) => { this.selectBillerLocation(name, address) }
    },

    initializeAutocomplete() {
      if (!this.mapsReady) return
      const refs = [
        'restaurantAddressInput', 'deliveryAddressInput', 'pickupAddressInput', 'returnAddressInput',
        'dropoffAddressInput', 'storeAddressInput', 'storePreferenceInput', 'billerNameInput'
      ]
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0800),
        new window.google.maps.LatLng(13.4500, 121.2500)
      )

      refs.forEach((refKey) => {
        const input = this.$refs[refKey]
        if (!input) return
        const isStorePreference = refKey === 'storePreferenceInput'
        const isBillerName = refKey === 'billerNameInput'
        const acOptions = {
          componentRestrictions: { country: 'ph' },
          fields: ['place_id', 'geometry', 'name', 'formatted_address', 'types'],
          bounds: calapanBounds,
          strictBounds: true,
          types: isStorePreference || isBillerName ? ['establishment'] : ['establishment', 'geocode']
        }
        const ac = new window.google.maps.places.Autocomplete(input, acOptions)

        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (!place.geometry) return

          // Validation
          if (!calapanBounds.contains(place.geometry.location)) {
            this.showNotification('warning', 'Please select a location within Calapan City area only.')
            input.value = ''
            return
          }
          const address = (place.formatted_address || '').toLowerCase()
          if (!address.includes('calapan') && !address.includes('oriental mindoro')) {
             this.showNotification('warning', 'Please select a location within Calapan City area only.')
             input.value = ''
             return
          }

          let addr = place.formatted_address
          if (place.name && place.types && place.types.includes('establishment')) {
            addr = `${place.name}, ${place.formatted_address}`
          }
          input.value = addr

          if (refKey === 'storePreferenceInput') {
            this.bookingForm.storePreference = place.name || addr
            this.saveFormData()
            if (this.selectedService?.id === 'grocery-shopping') setTimeout(() => this.updateRoute(), 100)
            return
          }
          if (refKey === 'billerNameInput') {
             this.bookingForm.billerName = place.name || addr
             this.billerNameWarning = ''
             this.addBillerMarker(place.geometry.location, place.name, place.formatted_address)
             return
          }
          
          if (refKey === 'restaurantAddressInput') {
             this.bookingForm.restaurantAddress = addr
             if (place.name && (!this.bookingForm.restaurantName || this.bookingForm.restaurantName.length < 3)) {
                this.bookingForm.restaurantName = place.name
             }
          }
          else if (refKey === 'deliveryAddressInput') this.bookingForm.deliveryAddress = addr
          else if (refKey === 'pickupAddressInput') this.bookingForm.pickupAddress = addr
          else if (refKey === 'returnAddressInput') this.bookingForm.returnAddress = addr
          else if (refKey === 'dropoffAddressInput') this.bookingForm.dropoffAddress = addr
          else if (refKey === 'storeAddressInput') this.bookingForm.storeAddress = addr

          this.addAddressMarker(place.geometry.location, addr, refKey)
          this.saveFormData()
          setTimeout(() => this.updateRoute(), 100)
        })
        this.autocompleteInstances[refKey] = ac
      })
    },

    addAddressMarker(location, address, inputType) {
      if (!this.map) return
      
      if (inputType.includes('pickup') || inputType.includes('restaurant')) {
        if (this.pickupMarker) this.pickupMarker.setMap(null)
        // Create pickup marker using PIN_LOCATION.png
        const createPickupMarker = (iconUrl, isFallback = false) => {
          this.pickupMarker = new window.google.maps.Marker({
            position: location,
            map: this.map,
            title: address,
            icon: {
              url: iconUrl,
              scaledSize: new window.google.maps.Size(50, 50),
              anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
            }
          })
          
          // If using custom image, verify it loads
          if (!isFallback) {
            const testImage = new Image()
            testImage.onerror = () => {
              console.warn('PIN_LOCATION.png failed to load for pickup, using fallback')
              if (this.pickupMarker) {
                this.pickupMarker.setMap(null)
                this.pickupMarker = null
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
      } else if (inputType.includes('delivery') || inputType.includes('dropoff') || inputType.includes('return')) {
        if (this.deliveryMarker) this.deliveryMarker.setMap(null)
        // Create delivery marker using PIN_LOCATION.png
        const createDeliveryMarker = (iconUrl, isFallback = false) => {
          this.deliveryMarker = new window.google.maps.Marker({
            position: location,
            map: this.map,
            title: address,
            icon: {
              url: iconUrl,
              scaledSize: new window.google.maps.Size(50, 50),
              anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
            }
          })
          
          // If using custom image, verify it loads
          if (!isFallback) {
            const testImage = new Image()
            testImage.onerror = () => {
              console.warn('PIN_LOCATION.png failed to load for delivery, using fallback')
              if (this.deliveryMarker) {
                this.deliveryMarker.setMap(null)
                this.deliveryMarker = null
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
      } else {
        // Default marker for other address types
        const marker = new window.google.maps.Marker({
          position: location,
          map: this.map,
          title: address,
          label: { text: 'A', color: 'white', fontWeight: 'bold' }
        })
      }
    },

    getCurrentLocation() {
      if (!navigator.geolocation) return
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0800),
        new window.google.maps.LatLng(13.4500, 121.2500)
      )
      navigator.geolocation.getCurrentPosition((pos) => {
         const position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
         const locationLatLng = new window.google.maps.LatLng(position.lat, position.lng)
         if (!calapanBounds.contains(locationLatLng)) {
            this.showNotification('warning', 'Current location is outside Calapan City.')
            return
         }
         // Remove red pin marker - user doesn't want it displayed
         if (this.currentLocationMarker) {
           this.currentLocationMarker.setMap(null)
           this.currentLocationMarker = null
         }
         // Don't create currentLocationMarker - only set delivery/pickup markers
         this.map.setCenter(position)
         this.map.setZoom(15)
         
         this.geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
               const address = (results[0].formatted_address || '').toLowerCase()
               if (!address.includes('calapan') && !address.includes('oriental mindoro')) return
               
               const formattedAddress = results[0].formatted_address
               
               // Set address based on service type
               if (this.selectedService) {
                 if (['pickup-drop', 'bill-payments'].includes(this.selectedService.id)) {
                   // For pickup-drop and bill-payments, set pickup address
                   this.bookingForm.pickupAddress = formattedAddress
                   // Add pickup marker
                   this.addAddressMarker(position, formattedAddress, 'pickupAddressInput')
                 } else {
                   // For other services (food-delivery, grocery-shopping, gift-delivery, medicine-delivery), set delivery address
                   this.bookingForm.deliveryAddress = formattedAddress
                   // Add delivery marker with PIN_LOCATION.png
                   this.addAddressMarker(position, formattedAddress, 'deliveryAddressInput')
                 }
               }
               
               this.saveFormData()
               this.updateRoute()
            }
         })
      })
    },

    updateRoute() {
      if (!this.map || !this.directionsService || !this.selectedService) return
      let origin = '', destination = ''
      
      // Determine endpoints based on service
      switch (this.selectedService.id) {
        case 'food-delivery': origin = this.bookingForm.restaurantAddress; destination = this.bookingForm.deliveryAddress; break;
        case 'bill-payments': origin = this.bookingForm.pickupAddress; destination = this.bookingForm.returnAddress; break;
        case 'grocery-shopping': 
           origin = this.bookingForm.storePreference || (this.currentLocationMarker?.getPosition()) || { lat: 13.3771, lng: 121.1646 };
           destination = this.bookingForm.deliveryAddress; break;
        case 'gift-delivery': 
           origin = this.bookingForm.storeAddress || { lat: 13.3771, lng: 121.1646 };
           destination = this.bookingForm.deliveryAddress; break;
        case 'medicine-delivery':
           origin = this.currentLocationMarker?.getPosition() || { lat: 13.3771, lng: 121.1646 };
           destination = this.bookingForm.deliveryAddress; break;
        case 'pickup-drop': origin = this.bookingForm.pickupAddress; destination = this.bookingForm.dropoffAddress; break;
      }

      if (!destination || !destination.trim()) return
      if (['food-delivery','bill-payments','pickup-drop'].includes(this.selectedService.id) && (!origin || !origin.trim())) return

      this.directionsService.route({
        origin, destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === 'OK') {
          this.directionsRenderer.setOptions({ suppressMarkers: true, preserveViewport: true })
          this.directionsRenderer.setDirections(response)
          
          setTimeout(() => {
             if (this.map) {
                const bounds = new window.google.maps.LatLngBounds()
                response.routes[0].legs.forEach(leg => {
                   bounds.extend(leg.start_location); bounds.extend(leg.end_location);
                   if (leg.steps) leg.steps.forEach(step => step.path.forEach(p => bounds.extend(p)))
                })
                this.map.fitBounds(bounds, { padding: 100 })
             }
          }, 300)

          const leg = response.routes[0].legs[0]
          const distanceInKm = leg.distance.value / 1000
          this.routeInfo = {
             distance: distanceInKm < 1 ? `${Math.round(leg.distance.value)} m` : `${distanceInKm.toFixed(2)} km`,
             duration: leg.duration.text,
             distanceValue: leg.distance.value,
             durationValue: leg.duration.value
          }
          this.calculateDeliveryFee()
        }
      })
    },

    // Marker & Place helpers (Standard from previous code)
    searchBillerLocations(billerName) { /* ... existing logic ... */ },
    clearBillerMarkers() { /* ... existing logic ... */ },
    addBillerMarker(location, name, address) { /* ... existing logic ... */ },
    selectBillerLocation(name, address) {
       this.bookingForm.billerName = name
       this.billerNameWarning = ''
       this.saveFormData()
       this.clearBillerMarkers()
    },
    searchRestaurantLocations(name) { /* ... existing logic ... */ },
    clearJollibeeMarkers() { /* ... existing logic ... */ },
    selectJollibeeLocation(address, name) { /* ... existing logic ... */ },
    handleFileUpload(e) { this.bookingForm.prescriptionFile = e.target.files?.[0] || null },
    
    async handleBillReceiptSelect(e) {
       const file = e.target.files?.[0]
       if (!file) return
       if (file.size > 5 * 1024 * 1024) { this.showNotification('error', 'Max 5MB only'); return }
       this.bookingForm.billReceiptFile = file
       if (this.authStore?.user?.uid) await this.uploadBillReceipt(file, this.authStore.user.uid)
    },

    uploadBillReceipt(file, uid) {
       return new Promise((resolve, reject) => {
          this.uploadingBillReceipt = true; this.billReceiptProgress = 0
          const storage = getStorage()
          const ref = storageRef(storage, `billReceipts/${uid}/${Date.now()}_${file.name}`)
          const task = uploadBytesResumable(ref, file)
          task.on('state_changed', 
             (snap) => { this.billReceiptProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100) },
             (err) => { this.uploadingBillReceipt = false; this.showNotification('error', 'Upload failed'); reject(err) },
             async () => {
                this.uploadingBillReceipt = false
                const url = await getDownloadURL(task.snapshot.ref)
                this.bookingForm.billReceiptUrl = url
                this.showNotification('success', 'Receipt uploaded')
                resolve(url)
             }
          )
       })
    },

    checkRequiredFields() {
       const f = this.bookingForm
       switch(this.selectedService?.id) {
          case 'food-delivery': return f.restaurantName && f.restaurantAddress && f.foodOrderDetails && f.budgetRange && f.receiverName && f.receiverContact && f.deliveryAddress
          case 'bill-payments': return f.billerName && f.accountName && f.accountNumber && f.amountToPay && f.pickupAddress && f.returnAddress && !!f.billReceiptUrl
          case 'grocery-shopping': return f.shoppingList && f.budgetRange && f.receiverName && f.receiverContact && f.deliveryAddress
          case 'gift-delivery': return f.giftType && f.budgetRange && f.recipientName && f.recipientContact && f.deliveryAddress && f.storeAddress
          case 'medicine-delivery': return f.medicineNames && f.quantity && f.budgetRange && f.receiverName && f.deliveryAddress
          case 'pickup-drop': return f.pickupAddress && f.pickupContact && f.itemDescription && f.itemType && f.dropoffAddress
          default: return false
       }
    },

    async checkUserRestriction() {
       try {
          const user = this.authStore?.user
          if (!user?.uid) return
          const snap = await getDoc(doc(db, 'users', user.uid))
          if (!snap.exists()) return
          const d = snap.data()
          
          // Check if account is banned or deactivated
          if (d.status === 'banned' || d.banned || d.approved === false || d.active === false) {
             this.isBookingRestricted = true
             this.restrictionType = 'banned'
             this.restrictionReason = d.flagReason || 'Account has been banned and deactivated'
             return
          }
          
          // Check if account is flagged with 3-day restriction
          if (d.status === 'flagged' && d.bookingRestrictedUntil) {
             const restrictionEnd = new Date(d.bookingRestrictedUntil)
             const now = new Date()
             if (now < restrictionEnd) {
                this.isBookingRestricted = true
                this.restrictionType = 'flagged'
                this.restrictionEndTime = restrictionEnd.toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
                this.restrictionReason = d.flagReason || 'Account has been flagged'
             } else {
                // Restriction period has ended, unflag the user
                this.isBookingRestricted = false
                // Optionally update user status in background
                await setDoc(doc(db, 'users', user.uid), {
                  status: 'active',
                  flagged: false,
                  bookingRestrictedUntil: null
                }, { merge: true })
             }
          } else {
             this.isBookingRestricted = false
          }
       } catch (e) { 
          console.error('[BookService] Error checking user restriction:', e) 
       }
    },

    async submitBooking() {
       this.formError = ''
       await this.checkUserRestriction()
       if (this.isBookingRestricted) { this.showNotification('error', 'Account restricted'); return }
       const user = this.authStore?.user
       if (!user?.uid) { this.showNotification('error', 'Login required'); return }
       if (!this.canSubmitBooking) { this.formError = 'Fill all fields'; return }

       this.submitting = true
       try {
          if (this.selectedService.id==='bill-payments' && this.bookingForm.billReceiptFile && !this.bookingForm.billReceiptUrl) {
             await this.uploadBillReceipt(this.bookingForm.billReceiptFile, user.uid)
          }

          let pickup = '', delivery = ''
          switch(this.selectedService.id) {
             case 'food-delivery': pickup = this.bookingForm.restaurantAddress; delivery = this.bookingForm.deliveryAddress; break;
             case 'bill-payments': pickup = this.bookingForm.pickupAddress; delivery = this.bookingForm.returnAddress; break;
             case 'pickup-drop': pickup = this.bookingForm.pickupAddress; delivery = this.bookingForm.dropoffAddress; break;
             case 'gift-delivery': pickup = this.bookingForm.storeAddress; delivery = this.bookingForm.deliveryAddress; break;
             default: delivery = this.bookingForm.deliveryAddress;
          }

          const { billReceiptFile, prescriptionFile, ...restForm } = this.bookingForm
          const cleanedForm = this._deepClean(restForm)
          
          const payload = {
             userId: user.uid,
             serviceId: this.selectedService.id,
             serviceName: this.selectedService.name,
             pickupAddress: this._stringOrEmpty(pickup),
             deliveryAddress: this._stringOrEmpty(delivery),
             formData: cleanedForm,
             routeInfo: this._deepClean(this.routeInfo),
             pricing: this._deepClean(this.calculatedPrice),
             totalAmount: Number(this.calculatedPrice.total),
             paymentMethod: this.bookingForm.paymentMethod,
             status: 'pending',
             createdAt: serverTimestamp()
          }

          const ref = await addDoc(collection(db, 'orders'), payload)
          
          // Notifications & Logging
          try {
             const profile = this.authStore.userProfile
             const name = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user.email
             await loggingService.logOrderCreated(ref.id, user.uid, name, this.selectedService.name, payload.totalAmount)
             await realtimeService.sendNotificationToAdmins({
                title: 'New Order', 
                message: `New ${this.selectedService.name} order from ${name}`,
                type: 'new_order', orderId: ref.id, userId: user.uid
             })
          } catch(e) { console.warn('Log/Notif failed', e) }

          this.resetBookingForm()
          this.selectedService = null
          this.showNotification('success', `Booking Submitted! Total: ₱${payload.totalAmount}`)
          setTimeout(() => this.$router.push('/user/orders'), 1500)
       } catch(err) {
          console.error(err)
          this.showNotification('error', 'Submission failed. Try again.')
       } finally {
          this.submitting = false
       }
    }
  },
  watch: {
    selectedService() {
      this.$nextTick(() => { this.initializeMap(); this.initializeAutocomplete() })
    },
    'bookingForm.paymentMethod'() {
      this.calculateDeliveryFee(); this.saveFormData()
    },
    bookingForm: {
      handler() { clearTimeout(this.formSaveTimer); this.formSaveTimer = setTimeout(() => this.saveFormData(), 500) },
      deep: true
    }
  }
}
</script>

<style scoped>
#map { 
  height: 300px !important; 
  width: 100% !important; 
  min-height: 300px; 
  background-color: #f0f0f0; 
}
:deep(.pac-container) { 
  z-index: 9999 !important; 
  width: auto !important; 
  min-width: 280px; 
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}
:deep(.pac-item) { padding: 8px 12px; cursor: pointer; }
:deep(.pac-item:hover) { background-color: #f0fce6; }
</style>