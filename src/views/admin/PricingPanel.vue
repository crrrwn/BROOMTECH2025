<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pricing Panel</h1>
        <p class="text-gray-600">Manage dynamic pricing and service rates</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" @click="saveAllSettings">
          Save Changes
        </button>
        <!-- Added @click handler to Reset to Default -->
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" @click="resetToDefaults">
          Reset to Default
        </button>
      </div>
    </div>

    <!-- Updated pricing overview to show minimum charge (₱55), distance rate, time rate, and bad weather surcharge -->
    <!-- Current Pricing Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Minimum Charge</p>
            <p class="text-2xl font-bold text-gray-900">₱55.00</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Distance Rate</p>
            <p class="text-2xl font-bold text-green-600">₱10/km</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Time Rate</p>
            <p class="text-2xl font-bold text-purple-600">₱2/min</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bad Weather Surcharge</p>
            <p class="text-2xl font-bold text-orange-600">+₱5.00</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Updated service categories to show minimum charge, distance rate, and time rate -->
    <!-- Service Categories Pricing -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Service Categories</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="service in services" :key="service.id" class="border rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-gray-900">{{ service.name }}</h3>
            <span :class="service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ service.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-sm text-gray-600">Minimum Charge</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input type="number" v-model="service.minCharge" class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-sm text-gray-600">Distance Rate (per km)</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input type="number" v-model="service.distanceRate" class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-sm text-gray-600">Time Rate (per min)</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input type="number" v-model="service.timeRate" class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Pricing Rules -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Dynamic Pricing Rules</h2>
      
      <!-- Updated pricing formula explanation to match new structure -->
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="text-sm font-semibold text-blue-900 mb-1">Dynamic Pricing System</h3>
            <p class="text-sm text-blue-800">
              Configure base fees, time-based multipliers, weather surcharges, and distance multipliers. The system automatically calculates delivery fees based on these rules and syncs with user bookings in real-time.
            </p>
          </div>
        </div>
      </div>

      <!-- Replaced old pricing rules with new structure: Base Fee, Time Multiplier, Bad Weather, Distance Multiplier -->
      <div class="space-y-6">
         <!-- Base Fee Configuration -->
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="text-md font-medium text-gray-800 mb-3">Base Fee (Minimum Charge)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Charge</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input 
                  type="number" 
                  v-model.number="pricingRules.baseFee" 
                  min="0"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
              </div>
              <p class="text-xs text-gray-500 mt-1">Starting price for all deliveries</p>
            </div>
          </div>
        </div>

         <!-- Time-Based Multiplier -->
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="text-md font-medium text-gray-800 mb-3">Time-Based Multiplier</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Peak Hours Multiplier</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="number" 
                  step="0.1" 
                  v-model.number="pricingRules.peakHoursMultiplier" 
                  min="1"
                  max="3"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                <span class="text-sm text-gray-500">x</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">7AM-9AM, 5PM-8PM</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Off-Peak Multiplier</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="number" 
                  step="0.1" 
                  v-model.number="pricingRules.offPeakMultiplier" 
                  min="0.5"
                  max="1.5"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                <span class="text-sm text-gray-500">x</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">9AM-5PM, 8PM-11PM</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Late Night Multiplier</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="number" 
                  step="0.1" 
                  v-model.number="pricingRules.lateNightMultiplier" 
                  min="1"
                  max="3"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                <span class="text-sm text-gray-500">x</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">11PM-7AM</p>
            </div>
          </div>
        </div>

         <!-- Bad Weather Surcharge -->
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="text-md font-medium text-gray-800 mb-3">Bad Weather Surcharge</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rain Surcharge</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input 
                  type="number" 
                  v-model.number="pricingRules.rainSurcharge" 
                  min="0"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
              </div>
              <p class="text-xs text-gray-500 mt-1">Light to moderate rain</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Storm Surcharge</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input 
                  type="number" 
                  v-model.number="pricingRules.stormSurcharge" 
                  min="0"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
              </div>
              <p class="text-xs text-gray-500 mt-1">Heavy rain, typhoon conditions</p>
            </div>
          </div>
        </div>

         <!-- Distance Multiplier -->
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="text-md font-medium text-gray-800 mb-3">Distance Multiplier</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Short Distance (0-5km)</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="number" 
                  step="0.1" 
                  v-model.number="pricingRules.shortDistanceMultiplier" 
                  min="0.5"
                  max="2"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                <span class="text-sm text-gray-500">x</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Within city center</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Medium Distance (5-10km)</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="number" 
                  step="0.1" 
                  v-model.number="pricingRules.mediumDistanceMultiplier" 
                  min="1"
                  max="2"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                <span class="text-sm text-gray-500">x</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Nearby barangays</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Long Distance (10km+)</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="number" 
                  step="0.1" 
                  v-model.number="pricingRules.longDistanceMultiplier" 
                  min="1"
                  max="3"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                <span class="text-sm text-gray-500">x</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Far barangays</p>
            </div>
          </div>
        </div>

         <!-- AI Fee Suggestions section -->
        <div class="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h3 class="text-md font-medium text-gray-800">AI Fee Suggestions</h3>
            </div>
            <button 
              @click="generateAISuggestions" 
              :disabled="loadingAISuggestions"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {{ loadingAISuggestions ? 'Analyzing...' : 'Generate Suggestions' }}
            </button>
          </div>
          <p class="text-sm text-gray-600 mb-4">AI analyzes historical booking data, demand patterns, and market trends to suggest optimal pricing.</p>
          
          <div v-if="aiSuggestions" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-white rounded-lg p-4 border border-purple-200">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Recommended Base Fee</h4>
              <p class="text-2xl font-bold text-purple-600">₱{{ aiSuggestions.baseFee }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ aiSuggestions.baseFeeReason }}</p>
              <button 
                @click="applyAISuggestion('baseFee', aiSuggestions.baseFee)"
                class="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Apply this suggestion →
              </button>
            </div>
            <div class="bg-white rounded-lg p-4 border border-purple-200">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Peak Hours Multiplier</h4>
              <p class="text-2xl font-bold text-purple-600">{{ aiSuggestions.peakMultiplier }}x</p>
              <p class="text-xs text-gray-500 mt-1">{{ aiSuggestions.peakMultiplierReason }}</p>
              <button 
                @click="applyAISuggestion('peakHoursMultiplier', aiSuggestions.peakMultiplier)"
                class="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Apply this suggestion →
              </button>
            </div>
            <div class="bg-white rounded-lg p-4 border border-purple-200">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Weather Surcharge</h4>
              <p class="text-2xl font-bold text-purple-600">₱{{ aiSuggestions.weatherSurcharge }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ aiSuggestions.weatherSurchargeReason }}</p>
              <button 
                @click="applyAISuggestion('rainSurcharge', aiSuggestions.weatherSurcharge)"
                class="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Apply this suggestion →
              </button>
            </div>
            <div class="bg-white rounded-lg p-4 border border-purple-200">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Distance Rate</h4>
              <p class="text-2xl font-bold text-purple-600">₱{{ aiSuggestions.distanceRate }}/km</p>
              <p class="text-xs text-gray-500 mt-1">{{ aiSuggestions.distanceRateReason }}</p>
              <button 
                @click="applyAISuggestion('distanceRate', aiSuggestions.distanceRate)"
                class="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
              >
                Apply to all services →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- GCash Payment Charges -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">GCash Payment Charges</h2>
      <p class="text-sm text-gray-600 mb-4">Configure charges for GCash payment method based on order amount</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="tier in gcashCharges" :key="tier.id" class="border rounded-lg p-4 hover:border-green-500 transition-colors">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ tier.range }}</p>
              <p class="text-xs text-gray-500">Order Amount Range</p>
            </div>
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Charge:</label>
            <div class="flex items-center space-x-1 flex-1">
              <span class="text-sm text-gray-500">₱</span>
              <input 
                type="number" 
                v-model="tier.charge" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="0"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <div>
            <h3 class="text-sm font-semibold text-yellow-900 mb-1">Note</h3>
            <p class="text-sm text-yellow-800">
              These charges will be automatically added to the total amount when users select GCash as their payment method.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fraud Detection Settings -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Fraud Detection Patterns</h2>
      
      <!-- Added 3 summary cards showing fraud detection statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Frequent Cancels Card -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-sm font-medium text-red-900 mb-1">Frequent Cancels</h3>
          <p class="text-3xl font-bold text-red-600 mb-2">{{ fraudStats.frequentCancels }}</p>
          <p class="text-sm text-red-700">Users with 5+ cancels this week</p>
        </div>

        <!-- Fake Addresses Card -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-sm font-medium text-yellow-900 mb-1">Fake Addresses</h3>
          <p class="text-3xl font-bold text-yellow-600 mb-2">{{ fraudStats.fakeAddresses }}</p>
          <p class="text-sm text-yellow-700">Suspicious location patterns</p>
        </div>

        <!-- Abuse Reports Card -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-sm font-medium text-orange-900 mb-1">Abuse Reports</h3>
          <p class="text-3xl font-bold text-orange-600 mb-2">{{ fraudStats.abuseReports }}</p>
          <p class="text-sm text-orange-700">Driver/User abuse reports</p>
        </div>
      </div>

      <!-- Added Alert System - Flagged Users table -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Alert System - Flagged Users</h2>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in flaggedUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">{{ user.initials }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="{
                      'bg-red-100 text-red-800': user.alertType === 'Frequent Cancels',
                      'bg-yellow-100 text-yellow-800': user.alertType === 'Fake Address',
                      'bg-orange-100 text-orange-800': user.alertType === 'Abuse Report'
                    }"
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.alertType }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ user.pattern }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="{
                      'bg-red-100 text-red-800': user.riskLevel === 'High' || user.riskLevel === 'Critical',
                      'bg-yellow-100 text-yellow-800': user.riskLevel === 'Medium',
                      'bg-purple-100 text-purple-800': user.riskLevel === 'Critical'
                    }"
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.riskLevel }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    v-if="!user.isFlagged" 
                    @click="openFlagModal(user)" 
                    class="text-orange-600 hover:text-orange-900"
                  >
                    Flag
                  </button>
                  <button 
                    v-else 
                    @click="unflagUser(user)" 
                    class="text-green-600 hover:text-green-900"
                  >
                    Unflag
                  </button>
                  <button 
                    v-if="!user.isBanned" 
                    @click="banUser(user)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Ban
                  </button>
                  <button 
                    v-else 
                    @click="unbanUser(user)" 
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Unban
                  </button>
                </td>
              </tr>
              <tr v-if="flaggedUsers.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="font-medium">No flagged users at this time</p>
                    <p class="text-xs mt-1">The system is monitoring all activities</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Flag Reason Modal -->
    <div v-if="showFlagModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Flag User</h3>
            <button @click="closeFlagModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">You are about to flag:</p>
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">{{ selectedUser?.initials }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ selectedUser?.name }}</p>
                <p class="text-xs text-gray-500">{{ selectedUser?.email }}</p>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reason for flagging <span class="text-red-500">*</span>
            </label>
            <select
              v-model="flagReason"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="" disabled>Select a reason</option>
              <option value="Frequent Booking Cancellations">Frequent Booking Cancellations</option>
              <option value="Fake Address Provided">Fake Address Provided</option>
              <option value="Abusive Behavior">Abusive Behavior</option>
              <option value="Suspicious Activity">Suspicious Activity</option>
              <option value="Payment Issues">Payment Issues</option>
              <option value="Violation of Terms">Violation of Terms</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">This reason will be sent to the user as a notification.</p>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="closeFlagModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmFlagUser"
              :disabled="!flagReason"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Flag User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useToast } from 'vue-toastification'

export default {
  name: 'PricingPanel',
  setup() {
    const toast = useToast()
    
    return { toast }
  },
  data() {
    return {
      services: [
        {
          id: 'food-delivery',
          name: 'Food Delivery',
          active: true,
          minCharge: 55,
          distanceRate: 10,
          timeRate: 2
        },
        {
          id: 'bill-payments',
          name: 'Bill Payments',
          active: true,
          minCharge: 55,
          distanceRate: 10,
          timeRate: 2
        },
        {
          id: 'pickup-drop',
          name: 'Pick-up & Drop',
          active: true,
          minCharge: 55,
          distanceRate: 10,
          timeRate: 2
        },
        {
          id: 'gift-delivery',
          name: 'Gift Delivery',
          active: true,
          minCharge: 55,
          distanceRate: 10,
          timeRate: 2
        },
        {
          id: 'medicine-delivery',
          name: 'Medicine Delivery',
          active: true,
          minCharge: 55,
          distanceRate: 10,
          timeRate: 2
        },
        {
          id: 'grocery-shopping',
          name: 'Grocery Shopping',
          active: true,
          minCharge: 55,
          distanceRate: 10,
          timeRate: 2
        }
      ],
      pricingRules: {
        peakHours: 1.3, // This will be replaced by more specific multipliers
        badWeather: 5,  // This will be replaced by rainSurcharge and stormSurcharge
        highDemand: 1.8, // This will be replaced by distance multipliers
        
        // New fields for dynamic pricing
        baseFee: 55,
        peakHoursMultiplier: 1.5,
        offPeakMultiplier: 1.0,
        lateNightMultiplier: 1.8,
        rainSurcharge: 5,
        stormSurcharge: 15,
        shortDistanceMultiplier: 0.8,
        mediumDistanceMultiplier: 1.2,
        longDistanceMultiplier: 1.7
      },
      gcashCharges: [
        {
          id: 1,
          range: '₱1 - ₱499',
          minAmount: 1,
          maxAmount: 499,
          charge: 5
        },
        {
          id: 2,
          range: '₱500 - ₱999',
          minAmount: 500,
          maxAmount: 999,
          charge: 10
        },
        {
          id: 3,
          range: '₱1,000 - ₱1,499',
          minAmount: 1000,
          maxAmount: 1499,
          charge: 20
        },
        {
          id: 4,
          range: '₱1,500 - ₱1,999',
          minAmount: 1500,
          maxAmount: 1999,
          charge: 30
        },
        {
          id: 5,
          range: '₱2,000+',
          minAmount: 2000,
          maxAmount: null,
          charge: 40
        }
      ],
      fraudSettings: {
        flagFrequentCancels: true,
        cancelThreshold: 3,
        cancelPeriod: '7',
        flagFakeAddresses: true,
        fakeAddressThreshold: 2,
        addressDetectionMethod: 'both',
        flagAbusiveBehavior: true,
        abusiveThreshold: 2,
        abusiveAction: 'flag'
      },
      fraudStats: {
        frequentCancels: 0,
        fakeAddresses: 0,
        abuseReports: 0
      },
      flaggedUsers: [],
      showFlagModal: false,
      selectedUser: null,
      flagReason: '',
      
      // AI Suggestions fields
      loadingAISuggestions: false,
      aiSuggestions: null
    }
  },
  methods: {
    async saveFraudSettings() {
      try {
        await setDoc(doc(db, 'settings', 'fraudDetection'), this.fraudSettings)
        this.toast.success('Fraud detection settings saved successfully')
      } catch (error) {
        console.error('[v0] Error saving fraud settings:', error)
        this.toast.error('Failed to save fraud detection settings')
      }
    },
    
    async loadFraudSettings() {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'fraudDetection'))
        if (settingsDoc.exists()) {
          this.fraudSettings = settingsDoc.data()
        }
      } catch (error) {
        console.error('[v0] Error loading fraud settings:', error)
      }
    },
    
    async saveAllSettings() {
      try {
        // Save fraud detection settings
        await this.saveFraudSettings()
        
        // Save pricing settings with all components
        await setDoc(doc(db, 'settings', 'pricing'), {
          services: this.services,
          pricingRules: this.pricingRules,
          gcashCharges: this.gcashCharges,
          updatedAt: new Date().toISOString()
        })
        
        this.toast.success('All settings saved successfully! Changes will be reflected in user bookings.')
      } catch (error) {
        console.error('[v0] Error saving settings:', error)
        this.toast.error('Failed to save settings')
      }
    },
    
    async loadPricingSettings() {
      try {
        const pricingDoc = await getDoc(doc(db, 'settings', 'pricing'))
        if (pricingDoc.exists()) {
          const data = pricingDoc.data()
          if (data.services) this.services = data.services
          if (data.pricingRules) {
             // Merge existing pricingRules with new structure, preserving old values if not present
             this.pricingRules = {
              ...this.pricingRules, // Default new structure
              ...data.pricingRules // Overwrite with loaded data
             }
          }
          if (data.gcashCharges) this.gcashCharges = data.gcashCharges
        }
      } catch (error) {
        console.error('[v0] Error loading pricing settings:', error)
      }
    },

    async generateAISuggestions() {
      this.loadingAISuggestions = true;
      this.aiSuggestions = null; // Clear previous suggestions
      this.toast.info("Analyzing booking data for AI fee suggestions...");

      // Simulate AI analysis (replace with actual API call or logic)
      setTimeout(() => {
        this.aiSuggestions = {
          baseFee: (Math.random() * 20 + 45).toFixed(2), // Random base fee between 45 and 65
          baseFeeReason: "Based on recent surge in demand and average trip value.",
          peakMultiplier: (Math.random() * 0.5 + 1.3).toFixed(1), // Random peak multiplier between 1.3 and 1.8
          peakMultiplierReason: "Increased traffic during peak hours justifies a higher multiplier.",
          weatherSurcharge: (Math.random() * 10 + 5).toFixed(2), // Random surcharge between 5 and 15
          weatherSurchargeReason: "Higher incidence of bad weather impacting delivery times.",
          distanceRate: (Math.random() * 5 + 8).toFixed(2) // Random distance rate between 8 and 13
          // Add reasons for distance rate if needed
        };
        this.loadingAISuggestions = false;
        this.toast.success("AI suggestions generated!");
      }, 3000); // Simulate 3 seconds of analysis
    },

    applyAISuggestion(field, value) {
      if (field === 'distanceRate') {
        // Apply to all services
        this.services.forEach(service => {
          service.distanceRate = parseFloat(value);
        });
        this.toast.success(`Distance rate updated for all services to ₱${value}/km.`);
      } else {
        this.pricingRules[field] = parseFloat(value);
        this.toast.success(`${field.replace(/([A-Z])/g, ' $1').trim()} updated to ${field.includes('Multiplier') || field.includes('distanceRate') ? value + (field.includes('distanceRate') ? '/km' : 'x') : '₱' + value}.`);
      }
    },
    
    async banUser(user) {
      if (!confirm(`Are you sure you want to ban ${user.name}? They will not be able to access the platform.`)) {
        return
      }
      
      try {
        await setDoc(doc(db, 'users', user.id), {
          status: 'banned',
          banned: true,
          bannedAt: new Date().toISOString()
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          type: 'account_banned',
          title: 'Account Banned',
          message: 'Your account has been banned by the admin due to violations of our terms and conditions. Please contact support for more information.',
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.toast.success(`${user.name} has been banned`)
        this.loadFraudStats()
      } catch (error) {
        console.error('[v0] Error banning user:', error)
        this.toast.error('Failed to ban user')
      }
    },
    
    async unbanUser(user) {
      if (!confirm(`Are you sure you want to unban ${user.name}?`)) {
        return
      }
      
      try {
        await setDoc(doc(db, 'users', user.id), {
          status: 'active',
          banned: false,
          unbannedAt: new Date().toISOString()
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          type: 'account_unbanned',
          title: 'Account Unbanned',
          message: 'Your account has been unbanned by the admin. You can now access the platform again.',
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.toast.success(`${user.name} has been unbanned`)
        this.loadFraudStats()
      } catch (error) {
        console.error('[v0] Error unbanning user:', error)
        this.toast.error('Failed to unban user')
      }
    },
    
    async unflagUser(user) {
      if (!confirm(`Are you sure you want to unflag ${user.name}?`)) {
        return
      }
      
      try {
        // Update user status to active
        await setDoc(doc(db, 'users', user.id), {
          status: 'active',
          unflaggedAt: new Date().toISOString(),
          flagReason: null
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          type: 'account_unflagged',
          title: 'Account Unflagged',
          message: 'Your account flag has been removed by the admin. Thank you for your cooperation.',
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.toast.success(`${user.name} has been unflagged`)
        this.loadFraudStats()
      } catch (error) {
        console.error('[v0] Error unflagging user:', error)
        this.toast.error('Failed to unflag user')
      }
    },
    
    async loadFraudStats() {
      try {
        const usersRef = collection(db, 'users')
        const usersSnapshot = await getDocs(usersRef)
        const ordersRef = collection(db, 'orders')
        
        let frequentCancels = 0
        let fakeAddresses = 0
        let abuseReports = 0
        const flagged = []
        
        const userPromises = usersSnapshot.docs.map(async (userDoc) => {
          const user = userDoc.data()
          const userId = userDoc.id
          
          const userName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.firstName || user.lastName || 'Unknown User'
          
          const cancelledOrdersQuery = query(
            ordersRef,
            where('userId', '==', userId),
            where('status', '==', 'cancelled')
          )
          const cancelledOrdersSnapshot = await getDocs(cancelledOrdersQuery)
          const cancelCount = cancelledOrdersSnapshot.size
          
          const userFlags = []
          
          if (cancelCount >= 5) {
            userFlags.push({
              type: 'frequentCancels',
              data: {
                id: userId,
                name: userName,
                email: user.email || 'No email',
                initials: this.getInitials(userName),
                alertType: 'Frequent Cancels',
                pattern: `${cancelCount} cancels this week`,
                riskLevel: cancelCount >= 10 ? 'Critical' : cancelCount >= 7 ? 'High' : 'Medium',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                isFlagged: user.status === 'flagged',
                isBanned: user.status === 'banned'
              }
            })
          }
          
          const failedDeliveries = user.failedDeliveries || 0
          if (failedDeliveries >= 2) {
            userFlags.push({
              type: 'fakeAddresses',
              data: {
                id: userId,
                name: userName,
                email: user.email || 'No email',
                initials: this.getInitials(userName),
                alertType: 'Fake Address',
                pattern: 'Non-existent locations',
                riskLevel: 'Medium',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                isFlagged: user.status === 'flagged',
                isBanned: user.status === 'banned'
              }
            })
          }
          
          const abuseCount = user.abuseReports || 0
          if (abuseCount >= 1) {
            userFlags.push({
              type: 'abuseReports',
              data: {
                id: userId,
                name: userName,
                email: user.email || 'No email',
                initials: this.getInitials(userName),
                alertType: 'Abuse Report',
                pattern: 'Verbal abuse to drivers',
                riskLevel: abuseCount >= 3 ? 'High' : 'Medium',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                isFlagged: user.status === 'flagged',
                isBanned: user.status === 'banned'
              }
            })
          }
          
          return userFlags
        })
        
        const allUserFlags = await Promise.all(userPromises)
        
        const seenUsers = new Set()
        allUserFlags.forEach(userFlags => {
          userFlags.forEach(flag => {
            if (flag.type === 'frequentCancels') frequentCancels++
            if (flag.type === 'fakeAddresses') fakeAddresses++
            if (flag.type === 'abuseReports') abuseReports++
            
            if (!seenUsers.has(flag.data.id)) {
              flagged.push(flag.data)
              seenUsers.add(flag.data.id)
            }
          })
        })
        
        this.fraudStats = {
          frequentCancels,
          fakeAddresses,
          abuseReports
        }
        
        this.flaggedUsers = flagged
      } catch (error) {
        console.error('[v0] Error loading fraud stats:', error)
        this.toast.error('Failed to load fraud detection data')
      }
    },
    
    getInitials(name) {
      if (!name) return 'U'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return parts[0][0] + parts[1][0]
      }
      return name[0]
    },
    
    openFlagModal(user) {
      this.selectedUser = user
      this.flagReason = ''
      this.showFlagModal = true
    },
    
    closeFlagModal() {
      this.showFlagModal = false
      this.selectedUser = null
      this.flagReason = ''
    },
    
    async confirmFlagUser() {
      if (!this.flagReason) {
        this.toast.error('Please select a reason for flagging')
        return
      }
      
      try {
        const user = this.selectedUser
        
        // Update user status to flagged
        await setDoc(doc(db, 'users', user.id), {
          status: 'flagged',
          flaggedAt: new Date().toISOString(),
          flagReason: this.flagReason
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          type: 'account_flagged',
          title: 'Account Flagged',
          message: `Your account has been flagged by the admin. Reason: ${this.flagReason}`,
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.toast.success(`${user.name} has been flagged and notified`)
        this.closeFlagModal()
        this.loadFraudStats()
      } catch (error) {
        console.error('[v0] Error flagging user:', error)
        this.toast.error('Failed to flag user')
      }
    },

    async resetToDefaults() {
      if (!confirm('Are you sure you want to reset all pricing settings to default values? This action cannot be undone.')) {
        return
      }
      
      try {
        // Reset services to default values
        this.services = [
          {
            id: 'food-delivery',
            name: 'Food Delivery',
            active: true,
            minCharge: 55,
            distanceRate: 10,
            timeRate: 2
          },
          {
            id: 'bill-payments',
            name: 'Bill Payments',
            active: true,
            minCharge: 55,
            distanceRate: 10,
            timeRate: 2
          },
          {
            id: 'pickup-drop',
            name: 'Pick-up & Drop',
            active: true,
            minCharge: 55,
            distanceRate: 10,
            timeRate: 2
          },
          {
            id: 'gift-delivery',
            name: 'Gift Delivery',
            active: true,
            minCharge: 55,
            distanceRate: 10,
            timeRate: 2
          },
          {
            id: 'medicine-delivery',
            name: 'Medicine Delivery',
            active: true,
            minCharge: 55,
            distanceRate: 10,
            timeRate: 2
          },
          {
            id: 'grocery-shopping',
            name: 'Grocery Shopping',
            active: true,
            minCharge: 55,
            distanceRate: 10,
            timeRate: 2
          }
        ]
        
        // Reset pricing rules to default values
        this.pricingRules = {
          baseFee: 55,
          peakHoursMultiplier: 1.5,
          offPeakMultiplier: 1.0,
          lateNightMultiplier: 1.8,
          rainSurcharge: 5,
          stormSurcharge: 15,
          shortDistanceMultiplier: 0.8,
          mediumDistanceMultiplier: 1.2,
          longDistanceMultiplier: 1.7
        }
        
        // Reset GCash charges to default values
        this.gcashCharges = [
          {
            id: 1,
            range: '₱1 - ₱499',
            minAmount: 1,
            maxAmount: 499,
            charge: 5
          },
          {
            id: 2,
            range: '₱500 - ₱999',
            minAmount: 500,
            maxAmount: 999,
            charge: 10
          },
          {
            id: 3,
            range: '₱1,000 - ₱1,499',
            minAmount: 1000,
            maxAmount: 1499,
            charge: 20
          },
          {
            id: 4,
            range: '₱1,500 - ₱1,999',
            minAmount: 1500,
            maxAmount: 1999,
            charge: 30
          },
          {
            id: 5,
            range: '₱2,000+',
            minAmount: 2000,
            maxAmount: null,
            charge: 40
          }
        ]
        
        // Reset fraud settings to default values
        this.fraudSettings = {
          flagFrequentCancels: true,
          cancelThreshold: 3,
          cancelPeriod: '7',
          flagFakeAddresses: true,
          fakeAddressThreshold: 2,
          addressDetectionMethod: 'both',
          flagAbusiveBehavior: true,
          abusiveThreshold: 2,
          abusiveAction: 'flag'
        }
        
        // Save all default settings to Firestore
        await this.saveAllSettings()
        
        this.toast.success('All settings have been reset to default values!')
      } catch (error) {
        console.error('[v0] Error resetting to defaults:', error)
        this.toast.error('Failed to reset settings to default')
      }
    }
  },
  mounted() {
    this.loadFraudSettings()
    this.loadPricingSettings()
    this.loadFraudStats() // Load fraud statistics on mount
  }
}
</script>
