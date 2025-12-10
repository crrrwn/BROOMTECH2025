<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Book a Service</h1>
      <p class="text-gray-600">Choose your delivery service and get instant quotes</p>
    </div>

    <!-- Bad Weather Warning Banner -->
    <div v-if="isBadWeather && badWeatherFeeEnabled" class="bg-yellow-100 border-l-4 border-yellow-500 p-6 shadow-lg">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-bold text-yellow-800 mb-2">⚠️ Bad Weather Alert</h3>
          <p class="text-base text-yellow-800">
            Due to current weather conditions (<strong>{{ currentWeather }}</strong>), a <strong class="text-xl">₱5 surcharge</strong> will be automatically added to your delivery fee for safety and driver compensation.
          </p>
        </div>
      </div>
    </div>

    <!-- Service Selection -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Service Type</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="service in services"
          :key="service.id"
          @click="onSelectService(service)"
          :class="selectedService?.id === service.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'"
          class="p-4 border rounded-lg cursor-pointer transition-all"
          role="button"
          tabindex="0"
          @keydown.enter.prevent="onSelectService(service)"
          @keydown.space.prevent="onSelectService(service)"
        >
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ service.name }}</h3>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
              <p class="text-sm font-semibold text-green-600 mt-1">Starting at ₱{{ baseFee.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Form -->
    <div v-if="selectedService" class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>

      <!-- Map & route -->
      <div class="mb-6">
        <h3 class="text-md font-medium text-gray-800 mb-3">Route & Distance</h3>
        <div class="bg-gray-100 rounded-lg p-4">
          <div id="map" class="w-full h-96 rounded-lg mb-3 overflow-hidden" style="min-height: 384px; position: relative;"></div>
          <div class="flex justify-between items-center text-sm">
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">Distance: <strong>{{ routeInfo.distance }}</strong></span>
              <span class="text-gray-600">ETA: <strong>{{ routeInfo.duration }}</strong></span>
            </div>
            <button
              @click="getCurrentLocation"
              class="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              type="button"
            >
              Use Current Location
            </button>
          </div>
        </div>
      </div>

      <!-- Dynamically display calculated price -->
      <div v-if="selectedService && routeInfo.distanceValue > 0" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 class="text-md font-medium text-green-800 mb-3">Estimated Delivery Fee</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Base Charge (First 3km):<span class="font-medium ml-1">₱{{ calculatedPrice.baseCharge }}</span></p>
            <p class="text-sm text-gray-600">Distance Fee (After 3km):<span class="font-medium ml-1">₱{{ calculatedPrice.distanceFee }}</span></p>
            <p class="text-sm text-gray-600">Bad Weather Surcharge:<span class="font-medium ml-1">₱{{ calculatedPrice.badWeatherFee }}</span></p>
          </div>
          <div>
            <p v-if="bookingForm.paymentMethod === 'GCASH'" class="text-sm text-gray-600">GCash Fee:<span class="font-medium ml-1">₱{{ calculatedPrice.gcashFee }}</span></p>
            <p v-if="bookingForm.paymentMethod === 'GCASH'" class="text-xs text-gray-500 mt-1">{{ getGcashFeeDescription() }}</p>
            <hr class="my-2">
            <p class="text-lg font-bold text-gray-800">Subtotal:<span class="ml-2">₱{{ calculatedPrice.subtotal }}</span></p>
            <p class="text-xl font-extrabold text-green-700">Estimated Total:<span class="ml-2">₱{{ calculatedPrice.total }}</span></p>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitBooking" class="space-y-6">
        <!-- FOOD DELIVERY -->
        <div v-if="selectedService.id === 'food-delivery'" class="space-y-4">
          <h3 class="text-md font-medium text-gray-800 border-b pb-2">Restaurant / Order Info</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Restaurant/Store Name *</label>
              <input 
                type="text" 
                v-model.trim="bookingForm.restaurantName" 
                required 
                @input="onRestaurantNameInput"
                @blur="validateRestaurantName"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500',
                  restaurantNameWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                ]"
              />
              <p v-if="restaurantNameWarning" class="text-xs text-yellow-600 mt-1 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ restaurantNameWarning }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Restaurant Address *</label>
              <input
                type="text"
                v-model.trim="bookingForm.restaurantAddress"
                required
                ref="restaurantAddressInput"
                @input="onAddressManualInput"
                @focus="onRestaurantAddressFocus"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500',
                  restaurantAddressWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                ]"
              />
              <p v-if="restaurantAddressWarning" class="text-xs text-yellow-600 mt-1 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ restaurantAddressWarning }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Food Order Details *</label>
            <textarea v-model.trim="bookingForm.foodOrderDetails" rows="3" required placeholder="List what you want to order..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
            <textarea v-model.trim="bookingForm.specialInstructions" rows="2" placeholder="Any special instructions..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
            <select v-model="bookingForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">Select budget range</option>
              <option value="P1-P499">₱1 - ₱499</option>
              <option value="P500-P999">₱500 - ₱999</option>
              <option value="P1000-P1500">₱1,000 - ₱1,500</option>
              <option value="P2000+">₱2,000+</option>
            </select>
          </div>

          <h3 class="text-md font-medium text-gray-800 border-b pb-2 mt-6">Delivery To</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Receiver Full Name *</label>
              <input type="text" v-model.trim="bookingForm.receiverName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Receiver Contact Number *</label>
              <input type="tel" v-model.trim="bookingForm.receiverContact" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
            <input
              type="text"
              v-model.trim="bookingForm.deliveryAddress"
              required
              ref="deliveryAddressInput"
              @input="onAddressManualInput"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Landmark / Notes (Optional)</label>
              <input type="text" v-model.trim="bookingForm.landmark" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Delivery Time (Optional)</label>
              <input type="time" v-model="bookingForm.preferredTime" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>
        </div>

        <!-- BILL PAYMENTS -->
        <div v-if="selectedService.id === 'bill-payments'" class="space-y-4">
          <h3 class="text-md font-medium text-gray-800 border-b pb-2">Biller Details</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Biller Name *</label>
              <input 
                type="text" 
                v-model.trim="bookingForm.billerName" 
                required 
                ref="billerNameInput"
                @input="onBillerNameInput"
                @focus="onBillerNameFocus"
                placeholder="e.g., MERALCO, GLOBE, PLDT" 
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500',
                  billerNameWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                ]"
              />
              <p v-if="billerNameWarning" class="text-xs text-yellow-600 mt-1 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ billerNameWarning }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
              <input type="text" v-model.trim="bookingForm.accountName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
              <input type="text" v-model.trim="bookingForm.accountNumber" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount to Pay *</label>
              <input type="number" v-model.number="bookingForm.amountToPay" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Due Date (Optional)</label>
              <input type="date" v-model="bookingForm.dueDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
              <select v-model="bookingForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Select budget range</option>
                <option value="P1-P499">₱1 - ₱499</option>
                <option value="P500-P999">₱500 - ₱999</option>
                <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                <option value="P2000+">₱2,000+</option>
              </select>
            </div>
          </div>

          <!-- Receipt / Reference Upload (REQUIRED) -->
          <div class="grid grid-cols-1 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Receipt / Reference (image/PDF) *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                @change="handleBillReceiptSelect"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p class="text-xs text-gray-500 mt-1">Max 5MB · Allowed: JPG/PNG/PDF</p>

              <div v-if="uploadingBillReceipt" class="text-xs text-gray-600 mt-1">
                Uploading... {{ billReceiptProgress }}%
              </div>

              <div v-if="bookingForm.billReceiptUrl" class="text-xs text-green-600 mt-1">
                Uploaded ✓
                <a :href="bookingForm.billReceiptUrl" target="_blank" class="underline">View file</a>
              </div>

              <p v-if="selectedService.id==='bill-payments' && !bookingForm.billReceiptUrl && !uploadingBillReceipt" class="text-xs text-red-600 mt-1">
                Receipt/reference is required.
              </p>
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-800 border-b pb-2 mt-6">Pickup & Delivery</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pickup Address *</label>
              <input type="text" v-model.trim="bookingForm.pickupAddress" required ref="pickupAddressInput" @input="onAddressManualInput" placeholder="Where to collect payment/bill" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Return Address *</label>
              <input type="text" v-model.trim="bookingForm.returnAddress" required ref="returnAddressInput" @input="onAddressManualInput" placeholder="Where to return receipt" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Schedule (Optional)</label>
            <input type="datetime-local" v-model="bookingForm.preferredSchedule" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
          </div>
        </div>

        <!-- GROCERY SHOPPING -->
        <div v-if="selectedService.id === 'grocery-shopping'" class="space-y-4">
          <h3 class="text-md font-medium text-gray-800 border-b pb-2">Shopping List</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">List of Items to Buy *</label>
            <textarea v-model.trim="bookingForm.shoppingList" rows="4" required placeholder="List all items you need..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Store Preference (Optional)</label>
              <input
                type="text"
                v-model.trim="bookingForm.storePreference"
                ref="storePreferenceInput"
                placeholder="e.g., SM, Robinson's, Mercury Drug"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p class="text-xs text-gray-500 mt-1">Start typing to search for stores</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
              <select v-model="bookingForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Select budget range</option>
                <option value="P1-P499">₱1 - ₱499</option>
                <option value="P500-P999">₱500 - ₱999</option>
                <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                <option value="P2000+">₱2,000+</option>
              </select>
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-800 border-b pb-2 mt-6">Delivery To</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Receiver Full Name *</label>
              <input type="text" v-model.trim="bookingForm.receiverName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Receiver Contact Number *</label>
              <input type="tel" v-model.trim="bookingForm.receiverContact" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
            <input type="text" v-model.trim="bookingForm.deliveryAddress" required ref="deliveryAddressInput" @input="onAddressManualInput" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
              <input type="text" v-model.trim="bookingForm.landmark" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Delivery Time (Optional)</label>
              <input type="time" v-model="bookingForm.preferredTime" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>
        </div>

        <!-- GIFT DELIVERY -->
        <div v-if="selectedService.id === 'gift-delivery'" class="space-y-4">
          <h3 class="text-md font-medium text-gray-800 border-b pb-2">Gift Details</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type of Gift / Item *</label>
            <input type="text" v-model.trim="bookingForm.giftType" required placeholder="e.g., Flowers, Cake, Jewelry" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
              <input type="text" v-model.trim="bookingForm.storeName" required placeholder="e.g., Flower Shop, Bakery" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Store Address *</label>
              <input
                type="text"
                v-model.trim="bookingForm.storeAddress"
                required
                ref="storeAddressInput"
                @input="onAddressManualInput"
                placeholder="Store location"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
              <textarea v-model.trim="bookingForm.specialInstructions" rows="3" placeholder="e.g., Wrap with ribbon, Include card" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
              <select v-model="bookingForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Select budget range</option>
                <option value="P1-P499">₱1 - ₱499</option>
                <option value="P500-P999">₱500 - ₱999</option>
                <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                <option value="P2000+">₱2,000+</option>
              </select>
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-800 border-b pb-2 mt-6">Receiver Info</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Full Name *</label>
              <input type="text" v-model.trim="bookingForm.recipientName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Contact Number *</label>
              <input type="tel" v-model.trim="bookingForm.recipientContact" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
            <input type="text" v-model.trim="bookingForm.deliveryAddress" required ref="deliveryAddressInput" @input="onAddressManualInput" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
              <input type="text" v-model.trim="bookingForm.landmark" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Delivery Date/Time (Optional)</label>
              <input type="datetime-local" v-model="bookingForm.preferredDateTime" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>
        </div>

        <!-- MEDICINE DELIVERY -->
        <div v-if="selectedService.id === 'medicine-delivery'" class="space-y-4">
          <h3 class="text-md font-medium text-gray-800 border-b pb-2">Medicine Details</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Medicine Name(s) *</label>
            <textarea v-model.trim="bookingForm.medicineNames" rows="3" required placeholder="List all medicines needed..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prescription Upload (Optional)</label>
              <input type="file" @change="handleFileUpload" accept="image/*,.pdf" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
              <p class="text-xs text-gray-500 mt-1">Upload if prescription is required</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
              <input type="text" v-model.trim="bookingForm.quantity" required placeholder="e.g., 1 box, 2 bottles" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
            <select v-model="bookingForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">Select budget range</option>
              <option value="P1-P499">₱1 - ₱499</option>
              <option value="P500-P999">₱500 - ₱999</option>
              <option value="P1000-P1500">₱1,000 - ₱1,500</option>
              <option value="P2000+">₱2,000+</option>
            </select>
          </div>

          <h3 class="text-md font-medium text-gray-800 border-b pb-2 mt-6">Delivery To</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Receiver Full Name *</label>
              <input type="text" v-model.trim="bookingForm.receiverName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Receiver Contact Number *</label>
              <input type="tel" v-model.trim="bookingForm.receiverContact" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
            <input type="text" v-model.trim="bookingForm.deliveryAddress" required ref="deliveryAddressInput" @input="onAddressManualInput" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
              <input type="text" v-model.trim="bookingForm.landmark" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Delivery Time (Optional)</label>
              <input type="time" v-model="bookingForm.preferredTime" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>
        </div>

        <!-- PICK-UP & DROP -->
        <div v-if="selectedService.id === 'pickup-drop'" class="space-y-4">
          <h3 class="text-md font-medium text-gray-800 border-b pb-2">Pick-up Info</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pick-up Address *</label>
              <input type="text" v-model.trim="bookingForm.pickupAddress" required ref="pickupAddressInput" @input="onAddressManualInput" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Person & Number (Pick-up) *</label>
              <input type="text" v-model.trim="bookingForm.pickupContact" required placeholder="Name - Phone Number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-800 border-b pb-2 mt-6">Item Details</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Item Description *</label>
            <textarea v-model.trim="bookingForm.itemDescription" rows="3" required placeholder="Describe the item(s) to be picked up..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Item Type *</label>
              <select v-model="bookingForm.itemType" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Select item type</option>
                <option value="LAUNDRY">Laundry</option>
                <option value="PET_FOOD">Pet Food</option>
                <option value="GAS_DELIVERY">Gas Delivery</option>
                <option value="SACK_OF_RICE">Sack of Rice Delivery</option>
                <option value="DOCUMENT_DELIVERY">Document Delivery</option>
                <option value="SHOPPING_DELIVERY">Shopping Delivery</option>
                <option value="BOXES_OR_ITEMS">Boxes or Items Delivery</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
              <select v-model="bookingForm.budgetRange" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Select budget range</option>
                <option value="P1-P499">₱1 - ₱499</option>
                <option value="P500-P999">₱500 - ₱999</option>
                <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                <option value="P2000+">₱2,000+</option>
              </select>
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-800 border-b pb-2 mt-6">Drop-off Info</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Drop-off Address *</label>
              <input type="text" v-model.trim="bookingForm.dropoffAddress" required ref="dropoffAddressInput" @input="onAddressManualInput" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text sm font-medium text-gray-700 mb-2">Receiver Name & Contact *</label>
              <input type="text" v-model.trim="bookingForm.receiverContact" required placeholder="Name - Phone Number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-md font-medium text-gray-800 mb-3">Payment Method</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" v-model="bookingForm.paymentMethod" value="GCASH" class="text-green-600 focus:ring-green-500" />
              <span class="ml-2 text-sm text-gray-700">GCash</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="bookingForm.paymentMethod" value="COD" class="text-green-600 focus:ring-green-500" />
              <span class="ml-2 text-sm text-gray-700">Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex flex-col gap-2">
          <button
            type="submit"
            :disabled="!canSubmitBooking || submitting || (selectedService?.id==='bill-payments' && uploadingBillReceipt)"
            class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {{ submitting ? 'Booking...' : 'Submit Booking' }}
          </button>
          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        </div>
      </form>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeNotificationModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <div class="flex items-center mb-4">
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center mr-4',
            notificationType === 'success' ? 'bg-green-100' : 
            notificationType === 'error' ? 'bg-red-100' : 
            notificationType === 'warning' ? 'bg-yellow-100' :
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
            notificationType === 'warning' ? 'text-yellow-900' :
            'text-blue-900'
          ]">
            {{ notificationType === 'success' ? 'Success' : notificationType === 'error' ? 'Error' : notificationType === 'warning' ? 'Warning' : 'Information' }}
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
              notificationType === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
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
import { db } from '@/firebase/config'
import { collection, addDoc, serverTimestamp, doc, getDoc, onSnapshot } from 'firebase/firestore'
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
      notificationType: 'success', // 'success', 'error', 'warning', 'info'
      notificationMessage: '',

      isBadWeather: false,
      currentWeather: '',
      badWeatherFeeEnabled: false,
      weatherCheckInterval: null,

      pricingSettings: {
        services: [],
        pricingRules: { peakHours: 1.3, badWeather: 5, highDemand: 1.8, baseFee: 55 },
        gcashCharges: []
      },
      pricingUnsubscribe: null,
      calculatedPrice: {
        baseCharge: 55,
        distanceFee: 0,
        timeFee: 0,
        badWeatherFee: 0,
        gcashFee: 0,
        subtotal: 55,
        total: 55
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

    }
  },
  computed: {
    canSubmitBooking() {
      if (!this.selectedService) return false
      const hasPaymentMethod = !!this.bookingForm.paymentMethod
      const hasRequiredFields = this.checkRequiredFields()
      const noBlockingUpload = !(this.selectedService.id === 'bill-payments' && this.uploadingBillReceipt)
      return hasPaymentMethod && hasRequiredFields && noBlockingUpload
    },
    baseFee() {
      // Get base fee from pricing settings, fallback to default
      return this.pricingSettings?.pricingRules?.baseFee || 55
    }
  },
  async mounted() {
    // Restore form data from localStorage
    this.restoreFormData()
    
    this.loadGoogleMapsAPI()
    await this.loadPricingSettings()
    await this.checkBadWeatherFeeEnabled()
    await this.checkWeather()
    // Check weather every 10 minutes
    this.weatherCheckInterval = setInterval(() => {
      this.checkWeather()
    }, 10 * 60 * 1000)
  },
  beforeUnmount() {
    // Save form data to localStorage before leaving
    this.saveFormData()
    
    // Clean up timers
    if (this.formSaveTimer) {
      clearTimeout(this.formSaveTimer)
    }
    
    // Clean up Jollibee markers
    this.clearJollibeeMarkers()
    
    // Clean up biller markers
    this.clearBillerMarkers()
    
    // Clean up global functions
    if (window.selectJollibeeLocation) {
      delete window.selectJollibeeLocation
    }
    if (window.selectBillerLocation) {
      delete window.selectBillerLocation
    }
    
    if (this.weatherCheckInterval) {
      clearInterval(this.weatherCheckInterval)
    }
    // Clean up pricing listener
    if (this.pricingUnsubscribe) {
      this.pricingUnsubscribe()
      this.pricingUnsubscribe = null
    }
  },
  methods: {
    // ---------- Form Persistence ----------
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
          // Only restore if data is less than 24 hours old
          const maxAge = 24 * 60 * 60 * 1000 // 24 hours
          if (Date.now() - parsed.timestamp < maxAge) {
            if (parsed.selectedService) {
              this.selectedService = parsed.selectedService
            }
            if (parsed.bookingForm) {
              // Merge saved form data with current form
              this.bookingForm = { ...this.bookingForm, ...parsed.bookingForm }
              
              // If restaurant name exists, trigger search after map loads
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
            // Clear old data
            localStorage.removeItem('bookServiceFormData')
          }
        }
      } catch (error) {
        console.error('Error restoring form data:', error)
        localStorage.removeItem('bookServiceFormData')
      }
    },

    clearFormData() {
      localStorage.removeItem('bookServiceFormData')
    },

    // ---------- helpers to sanitize data for Firestore ----------
    _sanitizeForFirestore(value) {
      // remove undefined, convert to null; strip File objects
      if (value === undefined) return null
      if (value instanceof File) return null
      if (value && typeof value === 'object') {
        // shallow clone; deep handled in deepClean
        return value
      }
      return value
    },
    _deepClean(obj) {
      if (obj === null || obj === undefined) return null
      if (obj instanceof File) return null
      if (Array.isArray(obj)) {
        return obj.map(v => this._deepClean(v)).filter(v => v !== undefined)
      }
      if (typeof obj === 'object') {
        const out = {}
        Object.keys(obj).forEach(k => {
          const v = this._deepClean(obj[k])
          if (v === undefined) {
            out[k] = null
          } else {
            out[k] = v
          }
        })
        return out
      }
      return obj
    },
    _stringOrEmpty(v) {
      if (v === undefined || v === null) return ''
      return String(v)
    },
    // ------------------------------------------------------------

    // Notification modal methods
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
        console.log('[v1] Bad Weather Fee enabled:', this.badWeatherFeeEnabled)
      } catch (error) {
        console.error('[v1] Error checking bad weather fee setting:', error)
      }
    },

    async checkWeather() {
      try {
        const weatherData = await weatherService.checkWeather()
        this.isBadWeather = weatherData.isBadWeather
        this.currentWeather = weatherData.description

        console.log('[v1] Weather check:', {
          isBadWeather: this.isBadWeather,
          description: this.currentWeather
        })

        // Recalculate delivery fee if weather changed
        if (this.selectedService && this.routeInfo.distanceValue > 0) {
          this.calculateDeliveryFee()
        }
      } catch (error) {
        console.error('[v1] Error checking weather:', error)
      }
    },

    // Method to get minimum rate for a specific service
    getServiceMinRate(serviceId) {
      const servicePricing = this.pricingSettings.services?.find(s => s.id === serviceId)
      return servicePricing?.minCharge || 55
    },

    calculateDeliveryFee() {
      if (!this.selectedService || !this.routeInfo.distanceValue) {
        return
      }

      const distanceInKm = this.routeInfo.distanceValue / 1000

      // Get admin's pricing settings
      // Check if there's a service-specific pricing
      const servicePricing = this.pricingSettings?.services?.find(s => s.id === this.selectedService.id)
      const adminBaseFee = servicePricing?.minCharge || this.pricingSettings?.pricingRules?.baseFee || 55
      const adminDistanceRate = servicePricing?.distanceRate || this.pricingSettings?.pricingRules?.distanceRate || 10
      
      let baseCharge = 0
      let distanceFee = 0

      // New pricing logic:
      // 1-3km: 10 pesos total
      // >3km: Use admin's fixed rate (baseFee + distanceRate per km after 3km)
      if (distanceInKm <= 3) {
        baseCharge = 10
        distanceFee = 0
      } else {
        // Use admin's fixed rate for distances > 3km
        baseCharge = adminBaseFee
        distanceFee = (distanceInKm - 3) * adminDistanceRate
      }

      const badWeatherFee = (this.isBadWeather && this.badWeatherFeeEnabled) ? 5 : 0

      // Subtotal (base charge + distance fee + bad weather fee)
      let subtotal = baseCharge + distanceFee + badWeatherFee

      let gcashFee = 0
      if (this.bookingForm.paymentMethod === 'GCASH' && this.bookingForm.budgetRange) {
        switch (this.bookingForm.budgetRange) {
          case 'P1-P499':
            gcashFee = 5
            break
          case 'P500-P999':
            gcashFee = 10
            break
          case 'P1000-P1500':
          case 'Every P1k':
            gcashFee = 20
            break
          case 'P1500':
            gcashFee = 30
            break
          case 'P2000+':
          case 'P2000':
            gcashFee = 40
            break
          default:
            gcashFee = 0
        }
      } else {
        gcashFee = 0
      }

      // Total
      const total = subtotal + gcashFee

      this.calculatedPrice = {
        baseCharge: Math.round(baseCharge * 100) / 100,
        distanceFee: Math.round(distanceFee * 100) / 100,
        badWeatherFee: Math.round(badWeatherFee * 100) / 100,
        gcashFee: Math.round(gcashFee * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        total: Math.round(total * 100) / 100
      }

      console.log('[v1] Calculated price:', this.calculatedPrice)
    },

    onSelectService(service) {
      console.log('[v1] Service selected:', service.name)

      this.selectedService = service
      this.formError = ''
      // Don't reset form if user is switching services - preserve data
      // Only reset if explicitly needed
      this.routeInfo = { distance: 'N/A', duration: 'N/A', distanceValue: 0, durationValue: 0 }
      this.calculatedPrice = { baseCharge: 55, distanceFee: 0, timeFee: 0, badWeatherFee: 0, gcashFee: 0, subtotal: 55, total: 55 }

      if (this.directionsRenderer) {
        this.directionsRenderer.setDirections({ routes: [] })
      }

      // Save form data when service changes
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
      // Save form data on input
      this.saveFormData()
      
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.updateRoute(), 350)
    },

    onRestaurantNameInput() {
      this.saveFormData()
      this.validateRestaurantName()
      
      // REMOVED: Automatic map search when typing restaurant name
      // Markers will only appear when user selects/enters an address
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

    onRestaurantAddressFocus() {
      // Tip removed - markers only appear when address is selected/entered
      this.restaurantAddressWarning = ''
    },

    onBillerNameInput() {
      this.saveFormData()
      
      // REMOVED: Automatic map search when typing biller name
      // Markers will only appear when user selects/enters an address
      this.clearBillerMarkers()
    },

    onBillerNameFocus() {
      // Tip removed - markers only appear when address is selected/entered
      this.billerNameWarning = ''
    },

    searchBillerLocations(billerName) {
      if (!this.jollibeePlacesService || !this.map) return

      // Clear existing biller markers
      this.clearBillerMarkers()

      // Calapan City bounds (tighter bounds around exact coordinates)
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0800), // South-West
        new window.google.maps.LatLng(13.4500, 121.2500)  // North-East
      )

      // Search for biller in Calapan City
      const request = {
        query: `${billerName} Calapan City, Oriental Mindoro`,
        fields: ['name', 'geometry', 'formatted_address', 'place_id'],
        locationBias: calapanBounds
      }

      this.jollibeePlacesService.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // STRICT FILTER: Only include Calapan City locations
          const calapanResults = results.filter(place => {
            if (!place.geometry || !place.geometry.location) return false
            
            const address = (place.formatted_address || '').toLowerCase()
            const location = place.geometry.location
            
            // Must contain 'calapan' in address AND be within bounds
            const isInCalapan = address.includes('calapan') || 
                               address.includes('calapan city') ||
                               address.includes('oriental mindoro')
            
            const isWithinBounds = calapanBounds.contains(location)
            
            return isInCalapan && isWithinBounds
          })

          calapanResults.forEach((place) => {
            if (place.geometry && place.geometry.location) {
              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: this.map,
                title: place.name,
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                },
                animation: window.google.maps.Animation.DROP
              })

              // Escape HTML for safety
              const safeName = place.name.replace(/'/g, "\\'")
              const safeAddress = place.formatted_address.replace(/'/g, "\\'")

              // Add info window
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px; min-width: 200px;">
                    <strong style="color: #3b82f6;">${place.name}</strong><br>
                    <small style="color: #666;">${place.formatted_address}</small><br>
                    <button onclick="window.selectBillerLocation('${safeName}', '${safeAddress}')" 
                            style="margin-top: 8px; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                      Select This Location
                    </button>
                  </div>
                `
              })

              marker.addListener('click', () => {
                // Close all other info windows
                this.billerMarkers.forEach(m => {
                  if (m.infoWindow) m.infoWindow.close()
                })
                infoWindow.open(this.map, marker)
              })

              this.billerMarkers.push({ marker, infoWindow, place })
            }
          })

          // Fit map to show all biller locations
          if (calapanResults.length > 0) {
            const bounds = new window.google.maps.LatLngBounds()
            calapanResults.forEach(place => {
              if (place.geometry && place.geometry.location) {
                bounds.extend(place.geometry.location)
              }
            })
            this.map.fitBounds(bounds, { padding: 50 })
          }
        } else {
          console.warn('Biller search failed:', status)
        }
      })
    },

    clearBillerMarkers() {
      this.billerMarkers.forEach(({ marker, infoWindow }) => {
        marker.setMap(null)
        if (infoWindow) infoWindow.close()
      })
      this.billerMarkers = []
    },

    addBillerMarker(location, name, address) {
      if (!this.map) return

      // Clear existing biller marker
      this.clearBillerMarkers()

      const marker = new window.google.maps.Marker({
        position: location,
        map: this.map,
        title: name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        label: { text: 'B', color: 'white', fontWeight: 'bold' }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>${name}</strong><br>
            <small>${address}</small>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker)
      })

      this.billerMarkers.push({ marker, infoWindow, place: { name, formatted_address: address } })
      
      // Center map on biller location
      this.map.setCenter(location)
      this.map.setZoom(15)
    },

    selectBillerLocation(name, address) {
      this.bookingForm.billerName = name
      this.billerNameWarning = ''
      this.saveFormData()
      
      // Close all info windows
      this.billerMarkers.forEach(m => {
        if (m.infoWindow) m.infoWindow.close()
      })
    },

    searchRestaurantLocations(restaurantName) {
      if (!this.jollibeePlacesService || !this.map) return

      // Clear existing markers
      this.clearJollibeeMarkers()

      // Calapan City exact coordinates and bounds
      const calapanCenter = { lat: 13.3771, lng: 121.1646 }
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0800), // South-West
        new window.google.maps.LatLng(13.4500, 121.2500)  // North-East
      )

      // STRICT: Search for restaurant ONLY in Calapan City
      const request = {
        query: `${restaurantName} Calapan City, Oriental Mindoro, Philippines`,
        fields: ['name', 'geometry', 'formatted_address', 'place_id'],
        locationBias: calapanBounds,
        bounds: calapanBounds // Add bounds to restrict search area
      }

      this.jollibeePlacesService.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // STRICT FILTER: Only include Calapan City locations
          const calapanResults = results.filter(place => {
            if (!place.geometry || !place.geometry.location) return false
            
            const address = (place.formatted_address || '').toLowerCase()
            const location = place.geometry.location
            
            // Must contain 'calapan' in address AND be within bounds
            const isInCalapan = address.includes('calapan') || 
                               address.includes('calapan city') ||
                               address.includes('oriental mindoro')
            
            const isWithinBounds = calapanBounds.contains(location)
            
            return isInCalapan && isWithinBounds
          })

          calapanResults.forEach((place) => {
            if (place.geometry && place.geometry.location) {
              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: this.map,
                title: place.name,
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                },
                animation: window.google.maps.Animation.DROP
              })

              // Escape HTML in address and name for safety
              const safeName = place.name.replace(/'/g, "\\'")
              const safeAddress = place.formatted_address.replace(/'/g, "\\'")

              // Add info window
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px; min-width: 200px;">
                    <strong style="color: #10b981;">${place.name}</strong><br>
                    <small style="color: #666;">${place.formatted_address}</small><br>
                    <button onclick="window.selectJollibeeLocation('${safeAddress}', '${safeName}')" 
                            style="margin-top: 8px; padding: 6px 12px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                      Select This Location
                    </button>
                  </div>
                `
              })

              marker.addListener('click', () => {
                // Close all other info windows
                this.jollibeeMarkers.forEach(m => {
                  if (m.infoWindow) m.infoWindow.close()
                })
                infoWindow.open(this.map, marker)
              })

              this.jollibeeMarkers.push({ marker, infoWindow, place })
            }
          })

          // Fit map to show all Jollibee locations
          if (calapanResults.length > 0) {
            const bounds = new window.google.maps.LatLngBounds()
            calapanResults.forEach(place => {
              if (place.geometry && place.geometry.location) {
                bounds.extend(place.geometry.location)
              }
            })
            // Add padding to bounds
            this.map.fitBounds(bounds, { padding: 50 })
          } else {
            // If no results, clear warning
            this.restaurantAddressWarning = ''
          }
        } else {
          console.warn('Restaurant search failed:', status)
        }
      })
    },

    searchJollibeeLocations() {
      // Alias for backward compatibility
      this.searchRestaurantLocations('jollibee')
    },

    clearJollibeeMarkers() {
      this.jollibeeMarkers.forEach(({ marker, infoWindow }) => {
        marker.setMap(null)
        if (infoWindow) infoWindow.close()
      })
      this.jollibeeMarkers = []
    },

    selectJollibeeLocation(address, name) {
      // Set address with restaurant name included
      this.bookingForm.restaurantAddress = address
      
      // Update restaurant name if it's empty or matches the search
      const currentName = this.bookingForm.restaurantName.toLowerCase().trim()
      const selectedName = name.toLowerCase().trim()
      if (!this.bookingForm.restaurantName || currentName.length < 3 || selectedName.includes(currentName) || currentName.includes(selectedName.split(' ')[0])) {
        this.bookingForm.restaurantName = name
      }
      
      this.restaurantAddressWarning = ''
      this.restaurantNameWarning = ''
      this.saveFormData()
      
      // Add marker for selected location
      if (this.map && this.jollibeeMarkers.length > 0) {
        const selectedPlace = this.jollibeeMarkers.find(m => {
          const placeAddr = m.place.formatted_address || ''
          return placeAddr === address || address.includes(placeAddr) || placeAddr.includes(address)
        })
        if (selectedPlace) {
          // Highlight selected marker
          selectedPlace.marker.setIcon({
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          })
        }
      }
      
      this.updateRoute()
      
      // Close all info windows
      this.jollibeeMarkers.forEach(m => {
        if (m.infoWindow) m.infoWindow.close()
      })
    },

    loadGoogleMapsAPI() {
      if (window.google && window.google.maps) {
        this.mapsReady = true
        return
      }
      if (document.getElementById('gmaps-script')) return

      const script = document.createElement('script')
      script.id = 'gmaps-script'
      // ⚠️ Restrict your key in GCP
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
      script.onerror = () => console.error('Failed to load Google Maps API')
      document.head.appendChild(script)
    },

    initializeMap() {
      const mapElement = document.getElementById('map')
      if (!mapElement || !this.mapsReady) return

      // Calapan City exact coordinates
      const calapanCenter = { lat: 13.3771, lng: 121.1646 }

      // Tighter bounds around Calapan City (approximately 10km radius)
      const calapanBounds = {
        north: 13.4500,
        south: 13.3000,
        east: 121.2500,
        west: 121.0800
      }

      this.map = new window.google.maps.Map(mapElement, {
        center: calapanCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        restriction: {
          latLngBounds: calapanBounds,
          strictBounds: true // STRICT: Prevent panning outside Calapan City
        }
      })

      this.directionsService = new window.google.maps.DirectionsService()
      // Add padding to prevent route from being cut off
      this.directionsRenderer = new window.google.maps.DirectionsRenderer({ 
        draggable: false, 
        suppressMarkers: true,
        preserveViewport: false,
        panel: null
      })
      this.directionsRenderer.setMap(this.map)

      this.geocoder = new window.google.maps.Geocoder()
      this.distanceService = new window.google.maps.DistanceMatrixService()
      
      // Initialize Places Service for Jollibee search
      if (window.google && window.google.maps && window.google.maps.places) {
        this.jollibeePlacesService = new window.google.maps.places.PlacesService(this.map)
      }
      
      // Make selectJollibeeLocation available globally for info window buttons
      window.selectJollibeeLocation = (address, name) => {
        this.selectJollibeeLocation(address, name)
      }
      
      // Make selectBillerLocation available globally for info window buttons
      window.selectBillerLocation = (name, address) => {
        this.selectBillerLocation(name, address)
      }
    },

    initializeAutocomplete() {
      if (!this.mapsReady) return

      const refs = [
        'restaurantAddressInput',
        'deliveryAddressInput',
        'pickupAddressInput',
        'returnAddressInput',
        'dropoffAddressInput',
        'storeAddressInput',
        'storePreferenceInput',
        'billerNameInput'
      ]

      // Calapan City bounds (tighter bounds around exact coordinates: lat: 13.3771, lng: 121.1646)
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0800), // South-West
        new window.google.maps.LatLng(13.4500, 121.2500)  // North-East
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
          strictBounds: true, // STRICT: Only show results within Calapan City bounds
          types: isStorePreference ? ['establishment'] : isBillerName ? ['establishment'] : ['establishment', 'geocode']
        }

        const ac = new window.google.maps.places.Autocomplete(input, acOptions)

        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (!place.geometry) return

          // STRICT: Validate location is within Calapan City bounds
          if (!calapanBounds.contains(place.geometry.location)) {
            this.showNotification('warning', 'Please select a location within Calapan City area only.')
            input.value = ''
            return
          }
          
          // Additional validation: Check if address contains Calapan
          const address = (place.formatted_address || '').toLowerCase()
          if (!address.includes('calapan') && !address.includes('oriental mindoro')) {
            this.showNotification('warning', 'Please select a location within Calapan City, Oriental Mindoro only.')
            input.value = ''
            return
          }

          // Include place name in address if it's an establishment
          let addr = place.formatted_address
          if (place.name && place.types && place.types.includes('establishment')) {
            // Include the establishment name in the address
            addr = `${place.name}, ${place.formatted_address}`
          }
          
          input.value = addr

          if (refKey === 'storePreferenceInput') {
            this.bookingForm.storePreference = place.name || addr
            this.saveFormData()
            // Update route for grocery shopping when store is selected
            if (this.selectedService && this.selectedService.id === 'grocery-shopping') {
              setTimeout(() => {
                this.updateRoute()
              }, 100)
            }
            return
          }

          if (refKey === 'billerNameInput') {
            this.bookingForm.billerName = place.name || addr
            this.billerNameWarning = ''
            // Show biller location on map
            this.addBillerMarker(place.geometry.location, place.name, place.formatted_address)
            return
          }

          if (refKey === 'restaurantAddressInput') {
            this.bookingForm.restaurantAddress = addr
            // Also update restaurant name if it's empty or if the place name matches common restaurant names
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
          // Update route after a short delay to ensure map is ready
          setTimeout(() => {
            this.updateRoute()
          }, 100)
        })

        this.autocompleteInstances[refKey] = ac
      })
    },

    addAddressMarker(location, address, inputType) {
      if (!this.map) return

      let markerLabel = 'A'

      if (inputType.includes('pickup') || inputType.includes('restaurant')) {
        markerLabel = 'P'
        if (this.pickupMarker) this.pickupMarker.setMap(null)
      } else if (inputType.includes('delivery') || inputType.includes('dropoff') || inputType.includes('return')) {
        markerLabel = 'D'
        if (this.deliveryMarker) this.deliveryMarker.setMap(null)
      }

      const marker = new window.google.maps.Marker({
        position: location,
        map: this.map,
        title: address,
        label: { text: markerLabel, color: 'white', fontWeight: 'bold' }
      })

      if (inputType.includes('pickup') || inputType.includes('restaurant')) this.pickupMarker = marker
      else if (inputType.includes('delivery') || inputType.includes('dropoff') || inputType.includes('return')) this.deliveryMarker = marker
    },

    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.showNotification('error', "Error: Your browser doesn't support geolocation.")
        return
      }

      const options = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }

      // Calapan City bounds for validation
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0800), // South-West
        new window.google.maps.LatLng(13.4500, 121.2500)  // North-East
      )

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          
          // STRICT: Validate location is within Calapan City bounds
          const locationLatLng = new window.google.maps.LatLng(position.lat, position.lng)
          if (!calapanBounds.contains(locationLatLng)) {
            this.showNotification('warning', 'Your current location is outside Calapan City. Please type an address within Calapan City instead.')
            return
          }

          if (this.currentLocationMarker) this.currentLocationMarker.setMap(null)

          this.currentLocationMarker = new window.google.maps.Marker({
            position,
            map: this.map,
            title: 'Your Current Location'
          })

          if (this.map) {
            this.map.setCenter(position)
            this.map.setZoom(15)
          }

          if (!this.geocoder) return
          this.geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              // Additional validation: Check if address contains Calapan
              const address = (results[0].formatted_address || '').toLowerCase()
              if (!address.includes('calapan') && !address.includes('oriental mindoro')) {
                this.showNotification('warning', 'Your current location is outside Calapan City. Please type an address within Calapan City instead.')
                return
              }
              
              if (this.selectedService && (this.selectedService.id === 'pickup-drop' || this.selectedService.id === 'bill-payments')) {
                this.bookingForm.pickupAddress = results[0].formatted_address
              }
              this.updateRoute()
            }
          })
        },
        (error) => {
          let errorMsg = 'Error: The Geolocation service failed.'

          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Geolocation permission denied. Please enable location access in your browser settings.'
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Your location is currently unavailable. Please try again or enter address manually.'
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Location request timed out. Please try again or enter address manually.'
          }

          this.showNotification('error', errorMsg)
          console.error('[v1] Geolocation error:', error.code, error.message)
        },
        options
      )
    },

    updateRoute() {
      if (!this.map || !this.directionsService || !this.selectedService) return

      let origin = ''
      let destination = ''

      switch (this.selectedService.id) {
        case 'food-delivery':
          origin = this.bookingForm.restaurantAddress
          destination = this.bookingForm.deliveryAddress
          break
        case 'bill-payments':
          origin = this.bookingForm.pickupAddress
          destination = this.bookingForm.returnAddress
          break
        case 'grocery-shopping':
          // For grocery shopping, use store preference if available, otherwise use current location
          if (this.bookingForm.storePreference && this.bookingForm.storePreference.trim()) {
            origin = this.bookingForm.storePreference
          } else if (this.currentLocationMarker) {
            origin = this.currentLocationMarker.getPosition()
          } else {
            // Use a default Calapan City center if no location is set
            origin = { lat: 13.3771, lng: 121.1646 }
          }
          destination = this.bookingForm.deliveryAddress
          break
        case 'gift-delivery':
          // For gift delivery, use store address as origin
          origin = this.bookingForm.storeAddress || (this.currentLocationMarker ? this.currentLocationMarker.getPosition() : { lat: 13.3771, lng: 121.1646 })
          destination = this.bookingForm.deliveryAddress
          break
        case 'medicine-delivery':
          // For medicine delivery, use current location or default
          if (this.currentLocationMarker) {
            origin = this.currentLocationMarker.getPosition()
          } else {
            origin = { lat: 13.3771, lng: 121.1646 }
          }
          destination = this.bookingForm.deliveryAddress
          break
        case 'pickup-drop':
          origin = this.bookingForm.pickupAddress
          destination = this.bookingForm.dropoffAddress
          break
      }

      // Validate destination exists (required for all services)
      if (!destination || !destination.trim()) return
      
      // For services that require origin address, validate it exists
      if (this.selectedService.id === 'food-delivery' || this.selectedService.id === 'bill-payments' || this.selectedService.id === 'pickup-drop') {
        if (!origin || !origin.trim()) return
      }
      
      // For services with optional origin (grocery, gift, medicine), ensure we have a valid origin
      if (this.selectedService.id === 'grocery-shopping' || this.selectedService.id === 'gift-delivery' || this.selectedService.id === 'medicine-delivery') {
        // If origin is not set or is an object (lat/lng), it's valid
        // If origin is a string but empty, use default
        if (typeof origin === 'string' && !origin.trim()) {
          origin = { lat: 13.3771, lng: 121.1646 } // Calapan City center
        } else if (!origin) {
          origin = { lat: 13.3771, lng: 121.1646 } // Calapan City center
        }
      }

      this.directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
        (response, status) => {
          if (status === 'OK') {
            // Set preserveViewport to true initially, then manually fit bounds
            // This prevents the renderer from auto-fitting and cutting off the route
            this.directionsRenderer.setOptions({ 
              suppressMarkers: true,
              preserveViewport: true // Set to true first to prevent auto-fit
            })
            this.directionsRenderer.setDirections(response)
            
            // Force map to resize and fit the ENTIRE route properly (including all points along the path)
            setTimeout(() => {
              if (this.map) {
                const bounds = new window.google.maps.LatLngBounds()
                
                // Include ALL points along the route path, not just start and end
                response.routes[0].legs.forEach(leg => {
                  // Add start and end locations
                  bounds.extend(leg.start_location)
                  bounds.extend(leg.end_location)
                  
                  // Add ALL steps along the route to ensure complete blue line is visible
                  if (leg.steps) {
                    leg.steps.forEach(step => {
                      if (step.path) {
                        step.path.forEach(point => {
                          bounds.extend(point)
                        })
                      }
                      // Also include step start and end locations
                      if (step.start_location) bounds.extend(step.start_location)
                      if (step.end_location) bounds.extend(step.end_location)
                    })
                  }
                })
                
                // Add generous padding to ensure full blue route line is visible (not cut off)
                // Use larger padding values to prevent any part of the route from being cut off
                this.map.fitBounds(bounds, { 
                  padding: { top: 100, right: 100, bottom: 100, left: 100 }
                })
                
                // Force a resize event to ensure map renders correctly
                setTimeout(() => {
                  if (window.google && window.google.maps && window.google.maps.event) {
                    window.google.maps.event.trigger(this.map, 'resize')
                  }
                }, 50)
              }
            }, 300) // Increased timeout to ensure route is fully rendered before fitting bounds
            
            const leg = response.routes[0].legs[0]
            // Format distance in km
            const distanceInKm = leg.distance.value / 1000
            const formattedDistance = distanceInKm < 1 
              ? `${Math.round(leg.distance.value)} m` 
              : `${distanceInKm.toFixed(2)} km`
            
            // Format duration
            const durationInMinutes = Math.round(leg.duration.value / 60)
            const formattedDuration = durationInMinutes < 60
              ? `${durationInMinutes} min`
              : `${Math.floor(durationInMinutes / 60)}h ${durationInMinutes % 60} min`
            
            this.routeInfo = {
              distance: formattedDistance,
              duration: formattedDuration,
              distanceValue: leg.distance.value, // in meters
              durationValue: leg.duration.value  // in seconds
            }
            // Calculate delivery fee after route is updated
            this.calculateDeliveryFee()
          } else {
            console.error('[v1] Directions request failed:', status)
            this.routeInfo = { distance: 'N/A', duration: 'N/A', distanceValue: 0, durationValue: 0 }
            this.calculatedPrice = { baseCharge: 55, distanceFee: 0, timeFee: 0, badWeatherFee: 0, gcashFee: 0, subtotal: 55, total: 55 }
          }
        }
      )
    },

    handleFileUpload(e) {
      const file = e.target.files?.[0]
      this.bookingForm.prescriptionFile = file || null
    },

    async handleBillReceiptSelect(e) {
      const file = e.target.files?.[0]
      if (!file) return

      const okTypes = ['image/jpeg','image/png','application/pdf']
      if (!okTypes.includes(file.type)) {
        this.showNotification('error', 'Invalid file type. Please upload JPG, PNG, or PDF.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('error', 'File too large. Max 5MB only.')
        return
      }

      this.bookingForm.billReceiptFile = file
      const user = this.authStore?.user
      if (!user?.uid) {
        this.showNotification('error', 'Please log in to upload a receipt.')
        return
      }
      await this.uploadBillReceipt(file, user.uid)
    },

    uploadBillReceipt(file, uid) {
      return new Promise((resolve, reject) => {
        try {
          const storage = getStorage()
          const path = `billReceipts/${uid}/${Date.now()}_${file.name}`
          const ref = storageRef(storage, path)
          const metadata = { contentType: file.type }

          this.uploadingBillReceipt = true
          this.billReceiptProgress = 0

          const task = uploadBytesResumable(ref, file, metadata)

          task.on(
            'state_changed',
            (snap) => {
              const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
              this.billReceiptProgress = pct
            },
            (err) => {
              this.uploadingBillReceipt = false
              console.error('[v1] upload error:', err.code, err.message)
              let errorMessage = 'Upload failed. Please try again.'
              
              if (err.code === 'storage/unauthenticated') {
                errorMessage = 'Please log in before uploading a receipt.'
                this.showNotification('error', errorMessage)
              } else if (err.code === 'storage/unauthorized') {
                errorMessage = 'Upload blocked by Storage Rules. Please check your Firebase Storage rules. Make sure the storage rules allow authenticated users to upload files to billReceipts/{userId}/ folder.'
                this.showNotification('error', errorMessage)
              } else if (err.code === 'storage/canceled') {
                errorMessage = 'Upload cancelled.'
                this.showNotification('warning', errorMessage)
              } else if (err.code === 'storage/quota-exceeded') {
                errorMessage = 'Storage quota exceeded. Please contact support.'
                this.showNotification('error', errorMessage)
              } else if (err.code === 'storage/unavailable') {
                errorMessage = 'Storage service is temporarily unavailable. Please try again later.'
                this.showNotification('error', errorMessage)
              } else {
                this.showNotification('error', errorMessage)
              }
              reject(err)
            },
            async () => {
              this.uploadingBillReceipt = false
              const url = await getDownloadURL(task.snapshot.ref)
              this.bookingForm.billReceiptUrl = url
              this.showNotification('success', 'Receipt uploaded successfully!')
              resolve(url)
            }
          )
        } catch (err) {
          this.uploadingBillReceipt = false
          console.error('[v1] upload exception:', err)
          reject(err)
        }
      })
    },

    checkRequiredFields() {
      if (!this.selectedService) return false
      const f = this.bookingForm
      switch (this.selectedService.id) {
        case 'food-delivery':
          return f.restaurantName && f.restaurantAddress && f.foodOrderDetails && f.budgetRange && f.receiverName && f.receiverContact && f.deliveryAddress
        case 'bill-payments':
          return f.billerName && f.accountName && f.accountNumber && f.amountToPay && f.budgetRange && f.pickupAddress && f.returnAddress && !!f.billReceiptUrl
        case 'grocery-shopping':
          return f.shoppingList && f.budgetRange && f.receiverName && f.receiverContact && f.deliveryAddress
        case 'gift-delivery':
          return f.giftType && f.budgetRange && f.recipientName && f.recipientContact && f.deliveryAddress && f.storeAddress
        case 'medicine-delivery':
          return f.medicineNames && f.quantity && f.budgetRange && f.receiverName && f.receiverContact && f.deliveryAddress
        case 'pickup-drop':
          return f.pickupAddress && f.pickupContact && f.itemDescription && f.itemType && f.budgetRange && f.dropoffAddress
        default:
          return false
      }
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

    async submitBooking() {
      try {
        this.formError = ''

        const user = this.authStore?.user
        const userProfile = this.authStore?.userProfile
        if (!user?.uid) {
          this.formError = 'You must be logged in to submit a booking.'
          this.showNotification('error', this.formError)
          return
        }

        const requiredFieldsCheck = this.checkRequiredFields()
        console.debug('[v1] Booking validation check:', {
          selectedService: this.selectedService?.id,
          requiredFieldsCheck,
          paymentMethod: this.bookingForm.paymentMethod,
          canSubmitBooking: this.canSubmitBooking
        })

        if (!this.canSubmitBooking) {
          this.formError = 'Please fill all required fields.'
          return
        }

        this.submitting = true

        // Upload pending receipt if needed
        if (this.selectedService?.id === 'bill-payments' && this.bookingForm.billReceiptFile && !this.bookingForm.billReceiptUrl) {
          await this.uploadBillReceipt(this.bookingForm.billReceiptFile, user.uid)
          if (!this.bookingForm.billReceiptUrl) {
            throw new Error('Receipt upload failed')
          }
        }

        // Determine top-level pickup and delivery addresses
        let topLevelPickup = ''
        let topLevelDelivery = ''
        switch (this.selectedService.id) {
          case 'food-delivery':
            topLevelPickup = this.bookingForm.restaurantAddress
            topLevelDelivery = this.bookingForm.deliveryAddress
            break
          case 'bill-payments':
            topLevelPickup = this.bookingForm.pickupAddress
            topLevelDelivery = this.bookingForm.returnAddress
            break
          case 'grocery-shopping':
            topLevelPickup = ''
            topLevelDelivery = this.bookingForm.deliveryAddress
            break
          case 'gift-delivery':
            topLevelPickup = this.bookingForm.storeAddress
            topLevelDelivery = this.bookingForm.deliveryAddress
            break
          case 'medicine-delivery':
            topLevelPickup = ''
            topLevelDelivery = this.bookingForm.deliveryAddress
            break
          case 'pickup-drop':
            topLevelPickup = this.bookingForm.pickupAddress
            topLevelDelivery = this.bookingForm.dropoffAddress
            break
          default:
            topLevelPickup = ''
            topLevelDelivery = this.bookingForm.deliveryAddress || ''
        }

        // Clean formData: remove undefined & File objects safely
        const { billReceiptFile, prescriptionFile, ...restForm } = this.bookingForm
        const cleanedForm = this._deepClean(restForm)

        const payload = {
          userId: user.uid,
          serviceId: this.selectedService.id,
          serviceName: this.selectedService.name,
          // Always send strings, never undefined
          pickupAddress: this._stringOrEmpty(topLevelPickup),
          deliveryAddress: this._stringOrEmpty(topLevelDelivery),
          formData: cleanedForm,
          routeInfo: this._deepClean(this.routeInfo),
          pricing: this._deepClean(this.calculatedPrice),
          totalAmount: Number(this.calculatedPrice?.total || 0),
          priceEstimate: { total: Number(this.calculatedPrice?.total || 0) },
          paymentMethod: this.bookingForm.paymentMethod,
          gcashCharge: this.bookingForm.paymentMethod === 'GCASH' ? Number(this.calculatedPrice?.gcashFee || 0) : 0,
          status: 'pending',
          createdAt: serverTimestamp()
        }

        console.debug('[v1 ✅] Clean payload ready for Firestore:', payload)

        const orderRef = await addDoc(collection(db, 'orders'), payload)
        console.debug('[v1 ✅] Firestore write success. Order ID:', orderRef.id)

        // Safe logging (non-blocking)
        try {
          const userName = (userProfile?.firstName || userProfile?.lastName)
            ? `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim()
            : (user.email || 'Unknown User')
          await loggingService.logOrderCreated(
            orderRef.id,
            user.uid,
            userName,
            this.selectedService.name,
            Number(this.calculatedPrice?.total || 0)
          )
        } catch (logErr) {
          console.warn('[v1 ⚠️] loggingService.logOrderCreated failed (non-blocking):', logErr?.message || logErr)
        }

        // Send notification to Admin about new order
        try {
          await realtimeService.sendNotificationToAdmins({
            title: 'New Order Received',
            message: `New ${this.selectedService.name} order #${orderRef.id.substring(0, 8)} from ${userProfile?.firstName || 'User'} ${userProfile?.lastName || ''}`.trim(),
            type: 'new_order',
            orderId: orderRef.id,
            userId: user.uid,
            serviceName: this.selectedService.name,
            totalAmount: Number(this.calculatedPrice?.total || 0)
          })
          console.log('[v1] Notification sent to admins about new order')
        } catch (notifErr) {
          console.warn('[v1 ⚠️] Failed to send notification to admins (non-blocking):', notifErr?.message || notifErr)
        }

        // Clear form data after successful submission
        this.resetBookingForm()
        this.selectedService = null
        this.routeInfo = { distance: '', duration: '', distanceValue: 0, durationValue: 0 }
        this.calculatedPrice = { baseCharge: 55, distanceFee: 0, timeFee: 0, badWeatherFee: 0, gcashFee: 0, subtotal: 55, total: 55 }
        
        // Clear map directions
        if (this.directionsRenderer) {
          this.directionsRenderer.setDirections({ routes: [] })
        }
        
        this.showNotification('success', `Booking submitted successfully! Estimated Total: ₱${this.calculatedPrice.total}`)
        setTimeout(() => {
          this.$router.push('/user/orders')
        }, 1500)
      } catch (err) {
        console.error('[v1 🔥] submitBooking error:', { code: err?.code, message: err?.message, err })
        if (err?.code === 'permission-denied') {
          this.formError = 'Booking failed: Firestore rules blocked this write.'
        } else if (err?.code === 'invalid-argument') {
          this.formError = 'Invalid data in booking form. Please review your inputs.'
        } else {
          this.formError = 'Error submitting booking. Please try again.'
        }
        this.showNotification('error', this.formError)
      } finally {
        this.submitting = false
      }
    },

    async loadPricingSettings() {
      try {
        const docRef = doc(db, 'settings', 'pricing')
        
        // Set up real-time listener for pricing changes
        this.pricingUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            this.pricingSettings = docSnap.data()
            console.log('[v1] Pricing settings updated:', this.pricingSettings)
          } else {
            console.warn('[v1] No pricing settings found, using defaults')
            // Set default pricing
            this.pricingSettings = {
              pricingRules: { baseFee: 55 }
            }
          }
        }, (error) => {
          console.error('[v1] Error listening to pricing settings:', error)
          // Set default pricing on error
          this.pricingSettings = {
            pricingRules: { baseFee: 55 }
          }
        })
      } catch (error) {
        console.error('[v1] Error loading pricing settings:', error)
        // Set default pricing on error
        this.pricingSettings = {
          pricingRules: { baseFee: 55 }
        }
      }
    },

  },
  watch: {
    async selectedService(newService) {
      if (!newService) return
      await this.$nextTick()
      this.initializeMap()
      await this.$nextTick()
      this.initializeAutocomplete()
    },
    mapsReady(ready) {
      if (ready && this.selectedService) {
        this.$nextTick(async () => {
          this.initializeMap()
          await this.$nextTick()
          this.initializeAutocomplete()
        })
      }
    },
    'bookingForm.paymentMethod'() {
      this.calculateDeliveryFee()
      this.saveFormData()
    },
    // Auto-save form data when bookingForm changes
    bookingForm: {
      handler() {
        // Debounce save to avoid too many localStorage writes
        clearTimeout(this.formSaveTimer)
        this.formSaveTimer = setTimeout(() => {
          this.saveFormData()
        }, 500)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#map { height: 300px !important; width: 100% !important; min-height: 300px; background-color: #f0f0f0; }
.map-container { position: relative; overflow: hidden; }
/* Ensure the Places Autocomplete dropdown isn't hidden behind anything */
:deep(.pac-container) { z-index: 9999 !important; width: auto !important; min-width: 280px; }
</style>
