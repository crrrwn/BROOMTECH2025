<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pricing Panel</h1>
        <p class="text-gray-600">Manage dynamic pricing and service rates</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Save Changes
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Reset to Default
        </button>
      </div>
    </div>

    <!-- Current Pricing Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Base Rate</p>
            <p class="text-2xl font-bold text-gray-900">₱50.00</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Per KM Rate</p>
            <p class="text-2xl font-bold text-gray-900">₱15.00</p>
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
            <p class="text-sm text-gray-600">Weather Multiplier</p>
            <p class="text-2xl font-bold text-orange-600">1.5x</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

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
              <label class="text-sm text-gray-600">Base Rate</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input type="number" v-model="service.baseRate" class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-sm text-gray-600">Per KM</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input type="number" v-model="service.perKm" class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-sm text-gray-600">Min Charge</label>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">₱</span>
                <input type="number" v-model="service.minCharge" class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Pricing Rules -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Dynamic Pricing Rules</h2>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Peak Hours Multiplier</label>
            <div class="flex items-center space-x-2">
              <input type="number" step="0.1" v-model="pricingRules.peakHours" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <span class="text-sm text-gray-500">x</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">7AM-9AM, 5PM-8PM</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bad Weather Multiplier</label>
            <div class="flex items-center space-x-2">
              <input type="number" step="0.1" v-model="pricingRules.badWeather" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <span class="text-sm text-gray-500">x</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Rain, Storm conditions</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">High Demand Multiplier</label>
            <div class="flex items-center space-x-2">
              <input type="number" step="0.1" v-model="pricingRules.highDemand" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <span class="text-sm text-gray-500">x</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">When demand > supply</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fraud Detection Settings -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Fraud Detection & Security</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="flex items-center">
              <input type="checkbox" v-model="fraudSettings.enableGeoFencing" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
              <span class="ml-2 text-sm text-gray-700">Enable Geo-fencing</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">Restrict deliveries to approved areas</p>
          </div>
          <div>
            <label class="flex items-center">
              <input type="checkbox" v-model="fraudSettings.requirePhotoProof" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
              <span class="ml-2 text-sm text-gray-700">Require Photo Proof</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">Mandatory delivery photos</p>
          </div>
          <div>
            <label class="flex items-center">
              <input type="checkbox" v-model="fraudSettings.enableRealTimeTracking" class="rounded border-gray-300 text-green-600 focus:ring-green-500">
              <span class="ml-2 text-sm text-gray-700">Real-time GPS Tracking</span>
            </label>
            <p class="text-xs text-gray-500 mt-1">Continuous location monitoring</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Distance Deviation (km)</label>
            <input type="number" v-model="fraudSettings.maxDistanceDeviation" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <p class="text-xs text-gray-500 mt-1">Alert if route deviates beyond this distance</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Suspicious Activity Threshold</label>
            <select v-model="fraudSettings.suspiciousThreshold" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="low">Low Sensitivity</option>
              <option value="medium">Medium Sensitivity</option>
              <option value="high">High Sensitivity</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Promo Codes -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Promo Codes</h2>
        <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Add Promo Code
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="promo in promoCodes" :key="promo.id">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ promo.code }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ promo.discount }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ promo.used }}/{{ promo.limit }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ promo.expires }}</td>
              <td class="px-4 py-3">
                <span :class="promo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ promo.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm font-medium space-x-2">
                <button class="text-blue-600 hover:text-blue-900">Edit</button>
                <button class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PricingPanel',
  data() {
    return {
      services: [
        {
          id: 1,
          name: 'Grocery Delivery',
          active: true,
          baseRate: 50,
          perKm: 15,
          minCharge: 80
        },
        {
          id: 2,
          name: 'Food Delivery',
          active: true,
          baseRate: 40,
          perKm: 12,
          minCharge: 60
        },
        {
          id: 3,
          name: 'Medicine Delivery',
          active: true,
          baseRate: 60,
          perKm: 18,
          minCharge: 100
        },
        {
          id: 4,
          name: 'Package Delivery',
          active: true,
          baseRate: 45,
          perKm: 14,
          minCharge: 70
        }
      ],
      pricingRules: {
        peakHours: 1.3,
        badWeather: 1.5,
        highDemand: 1.8
      },
      fraudSettings: {
        enableGeoFencing: true,
        requirePhotoProof: true,
        enableRealTimeTracking: true,
        maxDistanceDeviation: 2,
        suspiciousThreshold: 'medium'
      },
      promoCodes: [
        {
          id: 1,
          code: 'WELCOME20',
          discount: '20%',
          used: 45,
          limit: 100,
          expires: '2024-12-31',
          active: true
        },
        {
          id: 2,
          code: 'FIRSTRIDE',
          discount: '₱50',
          used: 23,
          limit: 50,
          expires: '2024-11-30',
          active: true
        },
        {
          id: 3,
          code: 'STUDENT15',
          discount: '15%',
          used: 12,
          limit: 200,
          expires: '2024-12-15',
          active: false
        }
      ]
    }
  }
}
</script>
