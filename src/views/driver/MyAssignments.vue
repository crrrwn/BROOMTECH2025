<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">My Assignments</h1>
        <p class="text-gray-600">View and manage your assigned deliveries</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div :class="[
            'w-3 h-3 rounded-full',
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          ]"></div>
          <span class="text-sm font-medium"
                :class="isOnline ? 'text-green-600' : 'text-gray-500'">
            {{ isOnline ? 'Online' : 'Offline' }}
          </span>
        </div>
        <button
          @click="refreshBookings"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Weather Status Banner for Drivers -->
    <div v-if="isBadWeather && badWeatherFeeEnabled"
         class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-600" fill="currentColor"
               viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a 1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-yellow-800">
            Bad Weather Alert: {{ currentWeather }} - All bookings include ₱5 surcharge
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs: Active and History -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            @click="activeTab = 'active'"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'active' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Active
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'history' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            History
          </button>
        </nav>
      </div>
    </div>

    <!-- Filters (only show for Active tab) -->
    <div v-if="activeTab === 'active'" class="bg-white rounded-lg p-4 shadow-sm border">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.status"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">All Status</option>
            <option value="driver_assigned">Assigned</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="arrived">Arrived</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
          <select v-model="filters.serviceType"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">All Services</option>
            <option value="food-delivery">Food Delivery</option>
            <option value="grocery">Grocery Shopping</option>
            <option value="pickup-drop">Pick-up & Drop</option>
            <option value="bill-payment">Bill Payment</option>
            <option value="medicine">Medicine Delivery</option>
            <option value="gift">Surprise Gift</option>
          </select>
        </div>
        <!-- Add Payment Method filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select v-model="filters.paymentMethod"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">All Methods</option>
            <option value="GCASH">GCash</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Active Bookings List -->
    <div v-if="activeTab === 'active'" class="space-y-4">
      <div v-for="booking in activeBookings"
           :key="booking.id"
           class="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                getServiceColor(booking.serviceType)
              ]">
                <component :is="getServiceIcon(booking.serviceType)"
                           class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ booking.serviceName || booking.serviceTitle }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ booking.customerName }} • {{ formatDate(booking.createdAt) }}
                </p>
              </div>
              <button
                @click="openChat(booking)"
                class="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Chat with customer"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-700">Pickup Location</p>
                <p class="text-sm text-gray-600">
                  {{ booking.pickupAddress || getPickupLocation(booking) }}
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Drop-off Location</p>
                <p class="text-sm text-gray-600">
                  {{ booking.deliveryAddress || getDeliveryLocation(booking) }}
                </p>
              </div>
            </div>
            <!-- Payment Method display badge - now properly shows actual payment method from Firestore -->
            <div class="mb-4 flex items-center gap-2">
              <span :class="getStatusBadgeClass(booking.status)"
                    class="px-3 py-1 text-xs font-medium rounded-full">
                {{ formatStatus(booking.status) }}
              </span>
              <!-- Display payment method from booking data -->
              <span v-if="booking.paymentMethod && booking.paymentMethod.trim()"
                    :class="getPaymentMethodBadge(booking.paymentMethod)"
                    class="px-3 py-1 text-xs font-medium rounded-full">
                {{ formatPaymentMethod(booking.paymentMethod) }}
              </span>
              <!-- Fallback: show placeholder if payment method is missing -->
              <span v-else class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                💳 Payment Pending
              </span>
            </div>
            <div v-if="booking.notes"
                 class="bg-gray-50 rounded-lg p-3 mb-4">
              <p class="text-sm text-gray-700">
                <strong>Notes:</strong> {{ booking.notes }}
              </p>
            </div>
            
            <!-- Additional Orders Section -->
            <div v-if="booking.additionalOrders && booking.additionalOrders.length > 0" class="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
              <h4 class="text-sm font-semibold text-gray-900 mb-2">Additional Orders ({{ booking.additionalOrders.length }})</h4>
              <div class="space-y-2">
                <div v-for="(additionalOrder, index) in booking.additionalOrders" :key="index" class="bg-white p-2 rounded border border-blue-200">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <p class="text-xs font-medium text-gray-900">{{ additionalOrder.serviceName || 'Additional Order' }}</p>
                      <p class="text-xs text-gray-500 mt-1">₱{{ (additionalOrder.totalAmount || additionalOrder.pricing?.total || 55).toFixed(2) }}</p>
                    </div>
                    <span class="px-2 py-0.5 text-xs font-medium rounded-full" :class="
                      additionalOrder.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      additionalOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    ">
                      {{ additionalOrder.status || 'pending' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ml-6 text-right">
            <div class="mb-4">
              <!-- CHANGE: Use totalAmount directly from Firestore if available (saved from Set Items Total), otherwise calculate -->
              <p class="text-2xl font-bold text-primary">
                ₱{{ (booking.totalAmount || calculateFinalAmount(booking)).toFixed(2) }}
              </p>
              <p class="text-sm text-gray-500">Total Earnings</p>
              <!-- CHANGE: Only show GCash fee note if payment method is GCash, not COD -->
              <p v-if="booking.paymentMethod?.toUpperCase() !== 'COD'" class="text-xs text-gray-500 mt-1">
                (includes ₱{{ calculateGCashFee(booking) }} GCash fee)
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">
                (Cash on Delivery - No GCash fee)
              </p>
            </div>
            <div class="space-y-2">
              <button
                v-if="booking.status !== 'delivered'"
                @click="startDelivery(booking)"
                class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                {{ booking.status === 'driver_assigned' ? 'Start Delivery' : 'In Progress' }}
              </button>
              <button
                v-else
                disabled
                class="w-full bg-green-600 text-white px-4 py-2 rounded-lg cursor-not-allowed font-medium"
              >
                DELIVERED
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State for Active -->
    <div v-if="activeTab === 'active' && activeBookings.length === 0"
         class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m9 5a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Active Assignments</h3>
      <p class="text-gray-600">
        {{ isOnline ? 'You will see your assignments here' : 'Go online to receive assignments' }}
      </p>
    </div>

    <!-- History Bookings List -->
    <div v-if="activeTab === 'history'" class="space-y-4">
      <div v-for="booking in historyBookings"
           :key="booking.id"
           class="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                getServiceColor(booking.serviceType)
              ]">
                <component :is="getServiceIcon(booking.serviceType)"
                           class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ booking.serviceName || booking.serviceTitle }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ booking.customerName }} • Delivered {{ formatDate(booking.deliveredAt || booking.createdAt) }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-700">Pickup Location</p>
                <p class="text-sm text-gray-600">
                  {{ booking.pickupAddress || getPickupLocation(booking) }}
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Drop-off Location</p>
                <p class="text-sm text-gray-600">
                  {{ booking.deliveryAddress || getDeliveryLocation(booking) }}
                </p>
              </div>
            </div>
            <div class="mb-4 flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Delivered
              </span>
              <span v-if="booking.paymentMethod && booking.paymentMethod.trim()"
                    :class="getPaymentMethodBadge(booking.paymentMethod)"
                    class="px-3 py-1 text-xs font-medium rounded-full">
                {{ formatPaymentMethod(booking.paymentMethod) }}
              </span>
            </div>
          </div>
          <div class="ml-6 text-right">
            <div class="mb-4">
              <p class="text-2xl font-bold text-primary">
                ₱{{ (booking.totalAmount || calculateFinalAmount(booking)).toFixed(2) }}
              </p>
              <p class="text-sm text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State for History -->
      <div v-if="historyBookings.length === 0"
           class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Delivery History</h3>
        <p class="text-gray-600">
          Completed deliveries will appear here
        </p>
      </div>
    </div>

    <!-- Start Delivery Modal -->
    <div v-if="showStartDeliveryModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="border-b p-6 flex items-center justify-between sticky top-0 bg-white">
          <h2 class="text-xl font-semibold text-gray-900">Start Delivery</h2>
          <button
            @click="showStartDeliveryModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4" v-if="selectedBooking">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Pickup Location</p>
            <p class="font-medium text-gray-900">
              {{ selectedBooking.pickupAddress || getPickupLocation(selectedBooking) }}
            </p>
            <p class="text-sm text-gray-600 mt-3 mb-1">Drop-off Location</p>
            <p class="font-medium text-gray-900">
              {{ selectedBooking.deliveryAddress || getDeliveryLocation(selectedBooking) }}
            </p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p class="text-sm text-gray-600 mb-2">Your Current Location</p>
            <div id="currentLocationDisplay"
                 class="text-sm font-medium text-gray-900">
              <span v-if="currentLocation">
                {{ currentLocation.lat.toFixed(4) }}, {{ currentLocation.lng.toFixed(4) }}
              </span>
              <span v-else class="text-gray-500">Getting location...</span>
            </div>
          </div>
          <button
            @click="showNavigationMap"
            class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Start Navigate</span>
          </button>
          <div class="space-y-2">
            <button
              @click="updateDeliveryStatus(selectedBooking, 'in_transit')"
              class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              In Transit
            </button>
            <button
              @click="updateDeliveryStatus(selectedBooking, 'on_the_way')"
              class="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              On The Way
            </button>
            <button
              @click="updateDeliveryStatus(selectedBooking, 'delivered')"
              class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Delivered
            </button>
          </div>
          <button
            @click="showStartDeliveryModal = false"
            class="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Receipt Preview Modal -->


    <!-- Receipt Preview Modal -->
    <div v-if="showReceiptPreviewModal"
         class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Receipt / Proof Preview</h2>
          <button
            @click="showReceiptPreviewModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 flex items-center justify-center">
          <img v-if="receiptPreviewUrl"
               :src="receiptPreviewUrl"
               alt="Receipt Preview"
               class="max-w-full max-h-[70vh] rounded-lg shadow-lg object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        'food-delivery': 'bg-orange-500',
        'food': 'bg-orange-500',
        'grocery': 'bg-green-500',
        'pickup-drop': 'bg-blue-500',
        'bill-payment': 'bg-purple-500',
        'medicine': 'bg-red-500',
        'gift': 'bg-pink-500'
      }
      return colors[serviceType] || 'bg-gray-500'
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
        'driver_assigned': 'bg-blue-100 text-blue-800',
        'picked_up': 'bg-yellow-100 text-yellow-800',
        'in_transit': 'bg-purple-100 text-purple-800',
        'arrived': 'bg-indigo-100 text-indigo-800',
        'delivered': 'bg-green-100 text-green-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    getPaymentMethodBadge(paymentMethod) {
      if (!paymentMethod) return 'bg-gray-100 text-gray-800'
      const method = paymentMethod.toUpperCase()
      if (method === 'GCASH') {
        return 'bg-blue-100 text-blue-800'
      } else if (method === 'COD') {
        return 'bg-green-100 text-green-800'
      }
      return 'bg-gray-100 text-gray-800'
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
      if (method === 'COD') return '💰 Cash on Delivery'
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
      return (
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
        const locationUrl = `https://maps.google.com/?q=${this.currentLocation.lat},${this.currentLocation.lng}`
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
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(pickupAddress)}&travelmode=driving`
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
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(dropoffAddress)}&waypoints=${encodeURIComponent(pickupAddress)}&travelmode=driving`
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
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(pickupAddress)}&travelmode=driving`
      window.open(mapsUrl, '_blank')
      this.$toast?.success?.('Opening directions in Google Maps')
    },
    startNavigation() {
      if (!this.currentLocation || !this.selectedBooking) return
      const pickupAddress =
        this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
      const dropoffAddress =
        this.selectedBooking.deliveryAddress || this.getDeliveryLocation(this.selectedBooking)
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(dropoffAddress)}&waypoints=${encodeURIComponent(pickupAddress)}&travelmode=driving`
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
