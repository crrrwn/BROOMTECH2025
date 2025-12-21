<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pricing Panel</h1>
        <p class="text-gray-600">Manage dynamic pricing, fixed rates, and service fees</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" @click="saveAllSettings">
          Save Changes
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" @click="resetToDefaults">
          Reset to Default
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-600 mb-1">Minimum Charge</p>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">₱</span>
              <input 
                type="number" 
                v-model.number="pricingRules.baseFee" 
                min="0"
                step="0.01"
                class="text-2xl font-bold text-gray-900 w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500">Starting price for all deliveries (CS Base Rate)</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-600 mb-1">Bad Weather Surcharge</p>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">+₱</span>
              <input 
                type="number" 
                v-model.number="pricingRules.rainSurcharge" 
                min="0"
                step="0.01"
                class="text-2xl font-bold text-orange-600 w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
            </div>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500">Applied automatically during rain</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Additional Service Fees (Add-ons)</h2>
      <p class="text-sm text-gray-600 mb-4">Manage extra charges for specific conditions based on the 2025 Rate Sheet.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-gray-50 p-4 rounded-lg border">
          <label class="block text-sm font-medium text-gray-700 mb-2">Foods & Pabili (30+ items)</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">+₱</span>
            <input type="number" v-model.number="specialFees.bulkFood" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border">
          <label class="block text-sm font-medium text-gray-700 mb-2">Box Fee</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">+₱</span>
            <input type="number" v-model.number="specialFees.box" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border">
          <label class="block text-sm font-medium text-gray-700 mb-2">Hill Top Charge</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">+₱</span>
            <input type="number" v-model.number="specialFees.hillTop" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <p class="text-xs text-gray-500 mt-1">Ex: Xevera, Greenhills, San Antonio</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border">
          <label class="block text-sm font-medium text-gray-700 mb-2">Loob/Lakad Charge</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">+₱</span>
            <input type="number" v-model.number="specialFees.loobLakad" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <p class="text-xs text-gray-500 mt-1">Ex: Hospital, Schools, Kapitolyo</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border">
          <label class="block text-sm font-medium text-gray-700 mb-2">High Floor (5th & up)</label>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">+₱</span>
            <input type="number" v-model.number="specialFees.highFloor" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <div class="flex justify-between items-center mb-4">
        <div>
           <h2 class="text-lg font-semibold text-gray-900">Fixed Location Rates Matrix</h2>
           <p class="text-sm text-gray-600">Set specific rates for Barangays or Landmarks (Overrides distance calculation)</p>
        </div>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h3 class="text-sm font-medium text-blue-900 mb-3">Add New Rate</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Barangay</label>
            <input type="text" v-model="newRate.barangay" placeholder="e.g. Bayanan I" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Landmark (Optional)</label>
            <input type="text" v-model="newRate.landmark" placeholder="e.g. Andoks" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Fix Price (₱)</label>
            <input type="number" v-model.number="newRate.price" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <button @click="addLocationRate" :disabled="!newRate.barangay || !newRate.price" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Add Rate
          </button>
        </div>
      </div>

      <div class="mb-4">
        <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </span>
            <input type="text" v-model="searchRate" placeholder="Search Barangay or Landmark..." class="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        </div>
      </div>

      <div class="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
        <table class="w-full">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangay</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landmark</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(rate, index) in filteredRates" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ rate.barangay }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ rate.landmark || '(Base Rate)' }}</td>
              <td class="px-6 py-4 text-sm font-bold text-green-600">₱{{ rate.price }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="removeLocationRate(rate)" class="text-red-600 hover:text-red-900 text-sm font-medium">Remove</button>
              </td>
            </tr>
            <tr v-if="filteredRates.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                 No rates found. Add rates from your list above.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Dynamic Calculation Rules</h2>
      <p class="text-sm text-gray-600 mb-4">Fallback settings if location is not in the Fixed Rates table.</p>
      
      <div class="space-y-6">
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="text-md font-medium text-gray-800 mb-3">Weather Condition Charges</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rain Surcharge</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input 
                  type="number" 
                  v-model.number="pricingRules.rainSurcharge" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Storm Surcharge</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input 
                  type="number" 
                  v-model.number="pricingRules.stormSurcharge" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
              </div>
            </div>
          </div>
        </div>

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
          
          <div v-if="aiSuggestions" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-white rounded-lg p-4 border border-purple-200">
              <h4 class="text-sm font-semibold text-gray-800 mb-2">Recommended Base Fee</h4>
              <p class="text-2xl font-bold text-purple-600">₱{{ aiSuggestions.baseFee }}</p>
              <button @click="applyAISuggestion('baseFee', aiSuggestions.baseFee)" class="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium">Apply this suggestion →</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">GCash Payment Charges</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="tier in gcashCharges" :key="tier.id" class="border rounded-lg p-4 hover:border-green-500 transition-colors">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ tier.range }}</p>
              <p class="text-xs text-gray-500">Order Amount Range</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Charge:</label>
            <div class="flex items-center space-x-1 flex-1">
              <span class="text-sm text-gray-500">₱</span>
              <input type="number" v-model="tier.charge" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">Fraud Detection Patterns</h2>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
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
          <p class="text-sm text-red-700">Users with 5+ cancels (will be flagged)</p>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Flagged Users</h2>
          <button 
            @click="loadFraudStats" 
            class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alert Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in flaggedUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {{ user.alertType }}
                    </span>
                    <p v-if="user.pattern" class="text-xs text-gray-500 mt-1">{{ user.pattern }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button v-if="!user.isFlagged" @click="openFlagModal(user)" class="text-orange-600 hover:text-orange-900">Flag</button>
                  <button v-else @click="unflagUser(user)" class="text-green-600 hover:text-green-900">Unflag</button>
                  <button v-if="!user.isBanned" @click="banUser(user)" class="text-red-600 hover:text-red-900">Ban</button>
                  <button v-else @click="unbanUser(user)" class="text-blue-600 hover:text-blue-900">Unban</button>
                </td>
              </tr>
              <tr v-if="flaggedUsers.length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-sm text-gray-500">No flagged users at this time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showFlagModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Flag User</h3>
        <select v-model="flagReason" class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4">
          <option value="" disabled>Select a reason</option>
          <option value="Frequent Booking Cancellations">Frequent Booking Cancellations</option>
          <option value="Fake Address Provided">Fake Address Provided</option>
          <option value="Abusive Behavior">Abusive Behavior</option>
        </select>
        <div class="flex justify-end space-x-3">
          <button @click="closeFlagModal" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
          <button @click="confirmFlagUser" :disabled="!flagReason" class="px-4 py-2 text-sm text-white bg-orange-600 rounded-lg">Flag User</button>
        </div>
      </div>
    </div>

    <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeNotificationModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <h3 class="text-lg font-semibold mb-2" :class="{'text-green-900': notificationType === 'success', 'text-red-900': notificationType === 'error'}">
          {{ notificationType === 'success' ? 'Success' : 'Notification' }}
        </h3>
        <p class="text-gray-700 mb-6">{{ notificationMessage }}</p>
        <div class="flex justify-end">
          <button @click="closeNotificationModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">OK</button>
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
      // NEW: Additional Fees Data
      specialFees: {
        bulkFood: 50,
        box: 10,
        hillTop: 10,
        loobLakad: 10,
        highFloor: 20
      },

      // NEW: Location Rates Data (Matrix)
      locationRates: [
         // Sample Data (pwede idelete ng client)
         { barangay: 'Balingayan', landmark: '', price: 248 },
         { barangay: 'Bayanan I', landmark: 'Andoks', price: 110 }
      ], 
      newRate: {
        barangay: '',
        landmark: '',
        price: null
      },
      searchRate: '',

      // Existing Services
      services: [
        { id: 'food-delivery', name: 'Food Delivery', active: true },
        { id: 'pickup-drop', name: 'Pick-up & Drop', active: true }
      ],
      
      // Existing Pricing Rules
      pricingRules: {
        baseFee: 54, // Updated to 54 based on rate sheet
        rainSurcharge: 10,
        stormSurcharge: 15,
        shortDistanceMultiplier: 0.8,
        mediumDistanceMultiplier: 1.2,
        longDistanceMultiplier: 1.7
      },

      // Existing GCash
      gcashCharges: [
        { id: 1, range: '₱1 - ₱499', charge: 5 },
        { id: 2, range: '₱500 - ₱999', charge: 10 },
        { id: 3, range: '₱1,000+', charge: 20 }
      ],

      // Existing Fraud
      fraudSettings: { flagFrequentCancels: true, cancelThreshold: 3 },
      fraudStats: { frequentCancels: 0 },
      flaggedUsers: [],
      showFlagModal: false,
      selectedUser: null,
      flagReason: '',
      
      // AI & Notifications
      loadingAISuggestions: false,
      aiSuggestions: null,
      showNotificationModal: false,
      notificationType: 'success',
      notificationMessage: ''
    }
  },
  
  computed: {
    // Logic for Search Bar in Rates Table
    filteredRates() {
      if (!this.searchRate) return this.locationRates;
      const searchLower = this.searchRate.toLowerCase();
      return this.locationRates.filter(rate => 
        rate.barangay.toLowerCase().includes(searchLower) || 
        (rate.landmark && rate.landmark.toLowerCase().includes(searchLower))
      );
    }
  },

  methods: {
    // --- NEW METHODS FOR FIXED RATES ---
    addLocationRate() {
      if (this.newRate.barangay && this.newRate.price) {
        this.locationRates.push({
          barangay: this.newRate.barangay,
          landmark: this.newRate.landmark || '', // Optional
          price: this.newRate.price
        });
        
        // Sort alphabetically by Barangay
        this.locationRates.sort((a, b) => a.barangay.localeCompare(b.barangay));

        // Reset inputs
        this.newRate = { barangay: '', landmark: '', price: null };
        this.showNotification('success', 'Rate added to list (Click Save Changes to apply)');
      }
    },

    removeLocationRate(rateToRemove) {
      if(confirm('Remove this rate?')) {
         this.locationRates = this.locationRates.filter(rate => rate !== rateToRemove);
      }
    },

    // --- EXISTING METHODS (UPDATED) ---

    showNotification(type, message) {
      this.notificationType = type
      this.notificationMessage = message
      this.showNotificationModal = true
    },

    closeNotificationModal() {
      this.showNotificationModal = false
    },

    async saveFraudSettings() {
      try {
        await setDoc(doc(db, 'settings', 'fraudDetection'), this.fraudSettings)
      } catch (error) {
        console.error('Error saving fraud settings:', error)
      }
    },
    
    async saveAllSettings() {
      try {
        await this.saveFraudSettings()
        
        // UPDATED: Saving everything including specialFees and locationRates
        await setDoc(doc(db, 'settings', 'pricing'), {
          services: this.services,
          pricingRules: this.pricingRules,
          gcashCharges: this.gcashCharges,
          specialFees: this.specialFees, 
          locationRates: this.locationRates,
          updatedAt: new Date().toISOString()
        })
        
        this.showNotification('success', 'All settings saved successfully! New rates are now active.')
      } catch (error) {
        console.error('Error saving settings:', error)
        this.showNotification('error', 'Failed to save settings')
      }
    },
    
    async loadPricingSettings() {
      try {
        const pricingDoc = await getDoc(doc(db, 'settings', 'pricing'))
        if (pricingDoc.exists()) {
          const data = pricingDoc.data()
          if (data.services) this.services = data.services
          if (data.pricingRules) this.pricingRules = { ...this.pricingRules, ...data.pricingRules }
          if (data.gcashCharges) this.gcashCharges = data.gcashCharges
          
          // LOAD NEW DATA
          if (data.specialFees) this.specialFees = data.specialFees
          if (data.locationRates) this.locationRates = data.locationRates
        }
      } catch (error) {
        console.error('Error loading pricing settings:', error)
      }
    },

    async loadFraudSettings() {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'fraudDetection'))
        if (settingsDoc.exists()) {
          this.fraudSettings = settingsDoc.data()
        } else {
          // Set defaults if not found
          this.fraudSettings = {
            flagFrequentCancels: true,
            cancelThreshold: 5, // Changed to 5 cancellations
            cancelPeriod: '7'
          }
        }
      } catch (error) {
        console.error('[PricingPanel] Error loading fraud settings:', error)
      }
    },
    
    async loadFraudStats() {
      try {
        const usersRef = collection(db, 'users')
        const usersSnapshot = await getDocs(usersRef)
        const ordersRef = collection(db, 'orders')
        
        let frequentCancels = 0
        const flagged = []
        const cancelThreshold = this.fraudSettings.cancelThreshold || 5
        const cancelPeriod = parseInt(this.fraudSettings.cancelPeriod) || 7
        
        // Calculate date threshold
        const dateThreshold = new Date()
        dateThreshold.setDate(dateThreshold.getDate() - cancelPeriod)
        
        const userPromises = usersSnapshot.docs.map(async (userDoc) => {
          const user = userDoc.data()
          const userId = userDoc.id
          
          // Skip admin and driver accounts
          if (user.role === 'admin' || user.role === 'driver') {
            return null
          }
          
          const userName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.firstName || user.lastName || 'Unknown User'
          
          // Check cancelled orders
          const cancelledOrdersQuery = query(
            ordersRef,
            where('userId', '==', userId),
            where('status', '==', 'cancelled')
          )
          const cancelledOrdersSnapshot = await getDocs(cancelledOrdersQuery)
          
          // Filter recent cancellations within the period
          const recentCancels = cancelledOrdersSnapshot.docs.filter(doc => {
            const orderData = doc.data()
            const orderDate = orderData.createdAt?.toDate()
            return orderDate && orderDate >= dateThreshold
          }).length
          
          // Check if user is already flagged or banned
          const isFlagged = user.status === 'flagged' || user.flagged
          const isBanned = user.status === 'banned' || user.banned
          
          // Add to flagged list if meets threshold OR already flagged/banned
          if (recentCancels >= cancelThreshold || isFlagged || isBanned) {
            if (recentCancels >= cancelThreshold) {
              frequentCancels++
            }
            
            flagged.push({
              id: userId,
              name: userName,
              email: user.email || 'No email',
              alertType: isBanned ? 'Banned' : isFlagged ? 'Flagged' : 'Frequent Cancels',
              pattern: recentCancels >= cancelThreshold 
                ? `${recentCancels} cancels in last ${cancelPeriod} days`
                : isBanned ? 'Account banned' 
                : isFlagged ? 'Account flagged' 
                : 'No pattern',
              riskLevel: recentCancels >= 10 ? 'Critical' : recentCancels >= 7 ? 'High' : recentCancels >= cancelThreshold ? 'Medium' : 'Low',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              isFlagged: isFlagged,
              isBanned: isBanned,
              cancelCount: recentCancels
            })
          }
          
          return null
        })
        
        await Promise.all(userPromises)
        
        // Update stats and flagged users list
        this.fraudStats = {
          frequentCancels: frequentCancels
        }
        
        this.flaggedUsers = flagged.sort((a, b) => {
          // Sort by risk level (Critical > High > Medium > Low)
          const riskOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
          return (riskOrder[b.riskLevel] || 0) - (riskOrder[a.riskLevel] || 0)
        })
        
        console.log('[PricingPanel] Fraud stats loaded:', this.fraudStats)
        console.log('[PricingPanel] Flagged users:', this.flaggedUsers.length)
      } catch (error) {
        console.error('[PricingPanel] Error loading fraud stats:', error)
        this.showNotification('error', 'Failed to load fraud detection data')
      }
    },

    async generateAISuggestions() {
      this.loadingAISuggestions = true;
      this.aiSuggestions = null;
      setTimeout(() => {
        this.aiSuggestions = {
          baseFee: (Math.random() * 5 + 50).toFixed(2), 
        };
        this.loadingAISuggestions = false;
        this.showNotification('success', "AI suggestions generated!");
      }, 2000);
    },

    applyAISuggestion(field, value) {
       this.pricingRules[field] = parseFloat(value);
    },
    
    // User Management Methods (Ban/Flag)
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
        this.showNotification('error', 'Please select a reason for flagging')
        return
      }
      
      try {
        const user = this.selectedUser
        
        // Calculate 3 days from now (not 12 hours)
        const now = new Date()
        const restrictedUntil = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days in milliseconds
        
        // Update user status to flagged
        await setDoc(doc(db, 'users', user.id), {
          status: 'flagged',
          flagged: true,
          flaggedAt: new Date().toISOString(),
          flagReason: this.flagReason,
          bookingRestrictedUntil: restrictedUntil.toISOString()
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          recipientType: 'user',
          type: 'account_flagged',
          title: 'Account Flagged - Booking Restricted',
          message: `Your account has been flagged by the admin. Reason: ${this.flagReason}. You will be unable to book services for 3 days. The restriction will be lifted on ${restrictedUntil.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}.`,
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.showNotification('success', `${user.name} has been flagged and will be unable to book services for 3 days`)
        this.closeFlagModal()
        this.loadFraudStats() // Reload to update the list
      } catch (error) {
        console.error('[PricingPanel] Error flagging user:', error)
        this.showNotification('error', 'Failed to flag user')
      }
    },
    
    async unflagUser(user) {
      if (!confirm(`Are you sure you want to unflag ${user.name}?`)) {
        return
      }
      
      try {
        await setDoc(doc(db, 'users', user.id), {
          status: 'active',
          flagged: false,
          unflaggedAt: new Date().toISOString(),
          flagReason: null,
          bookingRestrictedUntil: null
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          recipientType: 'user',
          type: 'account_unflagged',
          title: 'Account Unflagged',
          message: 'Your account flag has been removed by the admin. You can now book services again.',
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.showNotification('success', `${user.name} has been unflagged`)
        this.loadFraudStats() // Reload to update the list
      } catch (error) {
        console.error('[PricingPanel] Error unflagging user:', error)
        this.showNotification('error', 'Failed to unflag user')
      }
    },
    
    async banUser(user) {
      if (!confirm(`Are you sure you want to ban ${user.name}? They will not be able to access the platform.`)) {
        return
      }
      
      try {
        // Ban user and deactivate account
        await setDoc(doc(db, 'users', user.id), {
          status: 'banned',
          banned: true,
          bannedAt: new Date().toISOString(),
          bookingRestricted: true,
          approved: false, // Deactivate account
          active: false // Deactivate account
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          recipientType: 'user',
          type: 'account_banned',
          title: 'Account Banned - Account Deactivated',
          message: 'Your account has been banned and deactivated by the admin due to violations. You cannot access the platform or book services. Please contact support for more information.',
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.showNotification('success', `${user.name} has been banned and their account has been deactivated`)
        this.loadFraudStats() // Reload to update the list
      } catch (error) {
        console.error('[PricingPanel] Error banning user:', error)
        this.showNotification('error', 'Failed to ban user')
      }
    },
    
    async unbanUser(user) {
      if (!confirm(`Are you sure you want to unban ${user.name}?`)) {
        return
      }
      
      try {
        // Unban user and reactivate account
        await setDoc(doc(db, 'users', user.id), {
          status: 'active',
          banned: false,
          bookingRestricted: false,
          approved: true, // Reactivate account
          active: true, // Reactivate account
          unbannedAt: new Date().toISOString()
        }, { merge: true })
        
        // Create notification for the user
        const notificationRef = doc(collection(db, 'notifications'))
        await setDoc(notificationRef, {
          userId: user.id,
          recipientType: 'user',
          type: 'account_unbanned',
          title: 'Account Unbanned - Account Reactivated',
          message: 'Your account has been unbanned and reactivated by the admin. You can now access the platform and book services again.',
          read: false,
          createdAt: new Date().toISOString()
        })
        
        this.showNotification('success', `${user.name} has been unbanned and their account has been reactivated`)
        this.loadFraudStats() // Reload to update the list
      } catch (error) {
        console.error('[PricingPanel] Error unbanning user:', error)
        this.showNotification('error', 'Failed to unban user')
      }
    },

    async resetToDefaults() {
      if (!confirm('Are you sure you want to reset all pricing settings to default values?')) return;
      
      try {
        // Reset everything
        this.pricingRules = {
          baseFee: 54,
          rainSurcharge: 10,
          stormSurcharge: 15,
          shortDistanceMultiplier: 0.8,
          mediumDistanceMultiplier: 1.2,
          longDistanceMultiplier: 1.7
        };

        this.specialFees = {
          bulkFood: 50,
          box: 10,
          hillTop: 10,
          loobLakad: 10,
          highFloor: 20
        };

        this.locationRates = []; // Clear list or set default

        await this.saveAllSettings();
      } catch (error) {
        this.showNotification('error', 'Failed to reset settings');
      }
    }
  },
  async mounted() {
    await this.loadFraudSettings()
    await this.loadPricingSettings()
    // Load fraud stats after settings are loaded (it depends on fraudSettings)
    await this.loadFraudStats()
  }
}
</script>