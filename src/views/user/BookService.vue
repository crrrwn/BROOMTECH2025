<template>
  <div class="p-6 space-y-6">
    <!-- Profile completion notice -->
    <div v-if="needsProfileCompletion" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Profile Incomplete</h3>
          <p class="mt-1 text-sm text-red-700">Please complete your profile information before booking services.</p>
          <div class="mt-3">
            <router-link
              to="/user/profile?complete=true"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Complete Profile
            </router-link>
          </div>
        </div>
      </div>
    </div>

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
    <div v-if="!needsProfileCompletion" class="bg-white p-6 rounded-lg shadow-sm border">
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Form -->
    <div v-if="selectedService && !needsProfileCompletion" class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>

      <!-- Map & route -->
      <div class="mb-6">
        <h3 class="text-md font-medium text-gray-800 mb-3">Route & Distance</h3>
        <div class="bg-gray-100 rounded-lg p-4">
          <div id="map" class="w-full h-64 rounded-lg mb-3"></div>
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
              <input type="text" v-model.trim="bookingForm.restaurantName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Restaurant Address *</label>
              <input
                type="text"
                v-model.trim="bookingForm.restaurantAddress"
                required
                ref="restaurantAddressInput"
                @input="onAddressManualInput"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
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
              <input type="text" v-model.trim="bookingForm.billerName" required placeholder="e.g., MERALCO, GLOBE, PLDT" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
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
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { weatherService } from '@/services/weatherService'
import { loggingService } from '@/services/loggingService'

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

      isBadWeather: false,
      currentWeather: '',
      badWeatherFeeEnabled: false,
      weatherCheckInterval: null,

      pricingSettings: {
        services: [],
        pricingRules: { peakHours: 1.3, badWeather: 5, highDemand: 1.8 },
        gcashCharges: []
      },
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

      needsProfileCompletion: false
    }
  },
  computed: {
    canSubmitBooking() {
      if (!this.selectedService) return false
      const hasPaymentMethod = !!this.bookingForm.paymentMethod
      const hasRequiredFields = this.checkRequiredFields()
      const noBlockingUpload = !(this.selectedService.id === 'bill-payments' && this.uploadingBillReceipt)
      return hasPaymentMethod && hasRequiredFields && noBlockingUpload
    }
  },
  async mounted() {
    await this.checkProfileCompletion()

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
    if (this.weatherCheckInterval) {
      clearInterval(this.weatherCheckInterval)
    }
  },
  methods: {
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

    async checkProfileCompletion() {
      try {
        const user = this.authStore?.user
        const userProfile = this.authStore?.userProfile

        if (!user || !userProfile) {
          this.needsProfileCompletion = true
          return
        }

        // Check if required profile fields are filled
        const hasRequiredFields = userProfile.firstName &&
                                 userProfile.lastName &&
                                 userProfile.phone &&
                                 userProfile.address

        this.needsProfileCompletion = !hasRequiredFields
        console.log('[v1] Profile completion check:', {
          hasRequiredFields,
          needsProfileCompletion: this.needsProfileCompletion
        })
      } catch (error) {
        console.error('[v1] Error checking profile completion:', error)
        this.needsProfileCompletion = false
      }
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

      // Base charge: 55 pesos for first 3km
      const baseCharge = 55

      // Distance fee: 10 pesos per km after 3km
      const distanceFee = distanceInKm > 3 ? (distanceInKm - 3) * 10 : 0

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
      this.resetBookingForm()
      this.routeInfo = { distance: 'N/A', duration: 'N/A', distanceValue: 0, durationValue: 0 }
      this.calculatedPrice = { baseCharge: 55, distanceFee: 0, timeFee: 0, badWeatherFee: 0, gcashFee: 0, subtotal: 55, total: 55 }

      if (this.directionsRenderer) {
        this.directionsRenderer.setDirections({ routes: [] })
      }

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
    },

    onAddressManualInput() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.updateRoute(), 350)
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o&libraries=places,geometry&v=weekly`
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

      const calapanCenter = { lat: 13.4119, lng: 121.1803 }

      this.map = new window.google.maps.Map(mapElement, {
        center: calapanCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        restriction: {
          latLngBounds: { north: 13.5, south: 13.3, east: 121.3, west: 121.0 },
          strictBounds: false
        }
      })

      this.directionsService = new window.google.maps.DirectionsService()
      this.directionsRenderer = new window.google.maps.DirectionsRenderer({ draggable: false, suppressMarkers: true })
      this.directionsRenderer.setMap(this.map)

      this.geocoder = new window.google.maps.Geocoder()
      this.distanceService = new window.google.maps.DistanceMatrixService()
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
        'storePreferenceInput'
      ]

      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0000),
        new window.google.maps.LatLng(13.5000, 121.3000)
      )

      refs.forEach((refKey) => {
        const input = this.$refs[refKey]
        if (!input) return

        const isStorePreference = refKey === 'storePreferenceInput'
        const acOptions = {
          componentRestrictions: { country: 'ph' },
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
          bounds: calapanBounds,
          strictBounds: false,
          types: isStorePreference ? ['establishment'] : ['establishment', 'geocode']
        }

        const ac = new window.google.maps.places.Autocomplete(input, acOptions)

        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (!place.geometry) return

          if (!calapanBounds.contains(place.geometry.location)) {
            alert('Please select a location within Calapan City area.')
            input.value = ''
            return
          }

          const addr = place.formatted_address
          input.value = addr

          if (refKey === 'storePreferenceInput') {
            this.bookingForm.storePreference = place.name || addr
            return
          }

          if (refKey === 'restaurantAddressInput') this.bookingForm.restaurantAddress = addr
          else if (refKey === 'deliveryAddressInput') this.bookingForm.deliveryAddress = addr
          else if (refKey === 'pickupAddressInput') this.bookingForm.pickupAddress = addr
          else if (refKey === 'returnAddressInput') this.bookingForm.returnAddress = addr
          else if (refKey === 'dropoffAddressInput') this.bookingForm.dropoffAddress = addr
          else if (refKey === 'storeAddressInput') this.bookingForm.storeAddress = addr

          this.addAddressMarker(place.geometry.location, addr, refKey)
          this.updateRoute()
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
        alert("Error: Your browser doesn't support geolocation.")
        return
      }

      const options = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position = { lat: pos.coords.latitude, lng: pos.coords.longitude }
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

          alert(errorMsg)
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
        case 'gift-delivery':
        case 'medicine-delivery':
          if (this.currentLocationMarker) origin = this.currentLocationMarker.getPosition()
          destination = this.bookingForm.deliveryAddress
          break
        case 'pickup-drop':
          origin = this.bookingForm.pickupAddress
          destination = this.bookingForm.dropoffAddress
          break
      }

      if (!origin || !destination) return

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
            this.directionsRenderer.setOptions({ suppressMarkers: true })
            this.directionsRenderer.setDirections(response)
            const leg = response.routes[0].legs[0]
            this.routeInfo = {
              distance: leg.distance.text,
              duration: leg.duration.text,
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
        alert('Invalid file type. Please upload JPG, PNG, or PDF.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Max 5MB only.')
        return
      }

      this.bookingForm.billReceiptFile = file
      const user = this.authStore?.user
      if (!user?.uid) {
        alert('Please log in to upload a receipt.')
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
              if (err.code === 'storage/unauthenticated') {
                alert('Please log in before uploading a receipt.')
              } else if (err.code === 'storage/unauthorized') {
                alert('Upload blocked by Storage Rules. Please check your Firebase Storage rules.')
              } else if (err.code === 'storage/canceled') {
                alert('Upload cancelled.')
              } else {
                alert('Upload failed. Please try again.')
              }
              reject(err)
            },
            async () => {
              this.uploadingBillReceipt = false
              const url = await getDownloadURL(task.snapshot.ref)
              this.bookingForm.billReceiptUrl = url
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
        if (this.needsProfileCompletion) {
          this.formError = 'Please complete your profile first.'
          return
        }

        const user = this.authStore?.user
        const userProfile = this.authStore?.userProfile
        if (!user?.uid) {
          this.formError = 'You must be logged in to submit a booking.'
          alert(this.formError)
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

        alert(`Booking submitted successfully! Estimated Total: ₱${this.calculatedPrice.total}`)
        this.$router.push('/user/orders')
      } catch (err) {
        console.error('[v1 🔥] submitBooking error:', { code: err?.code, message: err?.message, err })
        if (err?.code === 'permission-denied') {
          this.formError = 'Booking failed: Firestore rules blocked this write.'
        } else if (err?.code === 'invalid-argument') {
          this.formError = 'Invalid data in booking form. Please review your inputs.'
        } else {
          this.formError = 'Error submitting booking. Please try again.'
        }
        alert(this.formError)
      } finally {
        this.submitting = false
      }
    },

    async loadPricingSettings() {
      try {
        const docRef = doc(db, 'settings', 'pricing')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.pricingSettings = docSnap.data()
          console.log('[v1] Pricing settings loaded:', this.pricingSettings)
        } else {
          console.warn('[v1] No pricing settings found, using defaults')
        }
      } catch (error) {
        console.error('[v1] Error loading pricing settings:', error)
      }
    },

  },
  watch: {
    async selectedService(newService) {
      if (!newService || this.needsProfileCompletion) return
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
