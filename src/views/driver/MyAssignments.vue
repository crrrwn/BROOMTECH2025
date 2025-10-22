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

    <!-- Filters -->
    <div class="bg-white rounded-lg p-4 shadow-sm border">
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
            <option value="delivered">Delivered</option>
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
      </div>
    </div>

    <!-- Bookings List -->
    <div class="space-y-4">
      <div v-for="booking in filteredBookings"
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
            <div class="mb-4">
              <span :class="getStatusBadgeClass(booking.status)"
                    class="px-3 py-1 text-xs font-medium rounded-full">
                {{ formatStatus(booking.status) }}
              </span>
            </div>
            <div v-if="booking.notes"
                 class="bg-gray-50 rounded-lg p-3 mb-4">
              <p class="text-sm text-gray-700">
                <strong>Notes:</strong> {{ booking.notes }}
              </p>
            </div>
          </div>
          <div class="ml-6 text-right">
            <div class="mb-4">
              <p class="text-2xl font-bold text-primary">
                <!-- Display total earnings from totalAmount, priceEstimate.total, or pricing.total -->
                ₱{{ booking.totalAmount || booking.priceEstimate?.total || booking.pricing?.total || 'TBD' }}
              </p>
              <p class="text-sm text-gray-500">Total Earnings</p>
            </div>
            <div class="space-y-2">
              <button
                @click="startDelivery(booking)"
                class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                {{ booking.status === 'driver_assigned' ? 'Start Delivery' : 'In Progress' }}
              </button>
              <button
                @click="viewDetails(booking)"
                class="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              <button
                @click="showItemsTotalModal(booking)"
                :disabled="booking.status === 'driver_assigned'"
                class="w-full border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Set Items Total
              </button>
              <button
                @click="showProofModal(booking)"
                :disabled="booking.status !== 'in_transit' && booking.status !== 'arrived'"
                class="w-full border border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Upload Proof of Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBookings.length === 0"
         class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m9 5a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Assignments</h3>
      <p class="text-gray-600">
        {{ isOnline ? 'You will see your assignments here' : 'Go online to receive assignments' }}
      </p>
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

    <!-- View Details Modal -->
    <div v-if="showDetailsModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Booking Details</h2>
          <button
            @click="showDetailsModal = false"
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
        <div class="p-6 space-y-6" v-if="selectedBooking">
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Order Summary</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Order ID</p>
                <p class="font-medium">#{{ selectedBooking.id?.substring(0, 8) || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Status</p>
                <span :class="getStatusBadgeClass(selectedBooking.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ formatStatus(selectedBooking.status) }}
                </span>
              </div>
              <div>
                <p class="text-gray-600">Total Amount</p>
                <p class="font-medium text-green-600">
                  ₱{{ selectedBooking.totalAmount || selectedBooking.priceEstimate?.total || 'TBD' }}
                </p>
              </div>
              <div>
                <p class="text-gray-600">Created</p>
                <p class="font-medium">{{ formatDate(selectedBooking.createdAt) }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Customer Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Name</p>
                <p class="font-medium">{{ selectedBooking.customerName || 'Unknown' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Phone</p>
                <p class="font-medium">{{ selectedBooking.customerPhone || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-gray-600">Email</p>
                <p class="font-medium">{{ selectedBooking.customerEmail || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Service Information</h4>
            <div class="flex items-start gap-4">
              <div
                :class="['p-2 rounded', getServiceColor(selectedBooking.serviceType)]">
                <svg class="w-6 h-6 text-white" fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="flex-1">
                <h5 class="font-medium text-gray-900">
                  {{ selectedBooking.serviceName || selectedBooking.serviceTitle }}
                </h5>
                <p class="text-sm text-gray-600 mt-1">
                  {{ getServiceDescription(selectedBooking.serviceType) }}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Location Information</h4>
            <div class="space-y-3">
              <div>
                <p class="text-gray-600 text-sm">Pickup Location</p>
                <p class="font-medium">
                  {{ selectedBooking.pickupAddress || getPickupLocation(selectedBooking) }}
                </p>
              </div>
              <div>
                <p class="text-gray-600 text-sm">Delivery Location</p>
                <p class="font-medium">
                  {{ selectedBooking.deliveryAddress || getDeliveryLocation(selectedBooking) }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="selectedBooking.formData"
               class="bg-white p-4 rounded-lg border">
            <h4 class="font-medium text-gray-900 mb-3">Booking Details</h4>
            <div class="space-y-2 text-sm">
              <div v-for="field in getFilteredBookingDetails(selectedBooking)"
                   :key="field.key"
                   class="flex justify-between">
                <span class="text-gray-600">{{ field.label }}:</span>
                <span class="font-medium">{{ field.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Total Modal -->
    <div v-if="showItemsModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="border-b p-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Set Items Total</h2>
          <button
            @click="showItemsModal = false"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Items Total Amount (₱)
            </label>
            <input v-model.number="itemsTotal"
                   type="number"
                   step="0.01"
                   min="0"
                   placeholder="Enter total amount"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Current Total Breakdown:</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Base Charge:</span>
                <span class="font-medium">
                  ₱{{ selectedBooking.pricing?.baseCharge || '0.00' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Distance Fee:</span>
                <span class="font-medium">
                  ₱{{ selectedBooking.pricing?.distanceFee || '0.00' }}
                </span>
              </div>
              <div v-if="selectedBooking.pricing?.badWeatherFee"
                   class="flex justify-between">
                <span>Bad Weather Surcharge:</span>
                <span class="font-medium">
                  ₱{{ selectedBooking.pricing?.badWeatherFee }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>GCash Fee:</span>
                <span class="font-medium">
                  ₱{{ selectedBooking.pricing?.gcashFee || '0.00' }}
                </span>
              </div>
              <div v-if="itemsTotal > 0"
                   class="flex justify-between border-t pt-1 mt-1">
                <span>Items Total:</span>
                <span class="font-medium text-blue-600">
                  ₱{{ itemsTotal.toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between border-t pt-1 mt-1 font-bold">
                <span>New Total:</span>
                <span class="text-green-600">
                  ₱{{ calculateNewTotal().toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
          <button
            @click="saveItemsTotal"
            :disabled="itemsTotal <= 0 || savingItems"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ savingItems ? 'Saving...' : 'Save Items Total' }}
          </button>
          <button
            @click="showItemsModal = false"
            class="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Proof of Delivery Modal -->
    <div v-if="showProofOfDeliveryModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="border-b p-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Proof of Delivery</h2>
          <button
            @click="showProofOfDeliveryModal = false"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo
            </label>
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer"
              @click="$refs.proofFileInput.click()"
              @dragover.prevent="dragOverProof = true"
              @dragleave.prevent="dragOverProof = false"
              @drop.prevent="handleProofDrop"
              :class="dragOverProof ? 'border-purple-500 bg-purple-50' : ''"
            >
              <input
                ref="proofFileInput"
                type="file"
                accept="image/*"
                @change="handleProofFileSelect"
                class="hidden"
              />
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-2"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4" />
              </svg>
              <p class="text-gray-600">Click to upload or drag and drop</p>
              <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <div v-if="proofPreview" class="relative">
            <img :src="proofPreview"
                 alt="Proof preview"
                 class="w-full rounded-lg border" />
            <button
              @click="proofPreview = null; proofFile = null"
              class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <svg class="w-5 h-5" fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            @click="uploadProofOfDelivery"
            :disabled="!proofFile || uploadingProof"
            class="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ uploadingProof ? 'Uploading...' : 'Submit Proof & Complete Delivery' }}
          </button>
          <button
            @click="showProofOfDeliveryModal = false"
            class="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
import { weatherService } from '@/services/weatherService'
import { db } from '@/firebase/config'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'MyAssignments',
  data() {
    return {
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
      showDetailsModal: false,
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
      itemsTotal: 0,
      savingItems: false,
      showProofOfDeliveryModal: false,
      proofFile: null,
      proofPreview: null,
      uploadingProof: false,
      dragOverProof: false,
      showItemsModal: false
    }
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter(booking => {
        if (this.filters.status && booking.status !== this.filters.status) return false
        if (this.filters.serviceType && booking.serviceType !== this.filters.serviceType) return false
        if (this.filters.distance && booking.distance > parseInt(this.filters.distance)) return false
        if (this.filters.paymentMethod && booking.paymentMethod?.toLowerCase() !== this.filters.paymentMethod) return false
        return true
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
    getServiceIcon(serviceType) {
      return 'svg'
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
      // Determine the pickup location based on available formData fields.
      // Include storeAddress for gift-delivery orders so drivers see where to pick up the gift.
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
      this.$toast.success('Assignments refreshed!')
      this.loadAssignedBookings()
    },
    async startDelivery(booking) {
      this.selectedBooking = booking
      if (booking.status === 'driver_assigned') {
        try {
          const bookingRef = doc(db, 'orders', booking.id)
          await updateDoc(bookingRef, {
            status: 'picked_up',
            driverLocation: this.currentLocation,
            confirmedAt: new Date()
          })
          this.$toast.success('Booking confirmed automatically!')
        } catch (error) {
          console.error('[v0] Error auto-confirming delivery:', error)
        }
      }
      this.getCurrentLocation()
      this.initializeGoogleMapsServices()
      this.showStartDeliveryModal = true
    },
    viewDetails(booking) {
      this.selectedBooking = booking
      this.showDetailsModal = true
    },
    openChat(booking) {
      this.$router.push({
        name: 'DriverChat',
        params: { orderId: booking.id }
      })
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
              if (userDoc) {
                usersMap[userId] = userDoc
              }
            } catch (error) {
              console.error('[v0] Error fetching user data:', error)
            }
          }
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
            return order
          })
        }, (error) => {
          console.error('[v0] Error loading assignments:', error)
          this.$toast.error('Failed to load assignments')
        })
      } catch (error) {
        console.error('[v0] Error setting up listener:', error)
      }
    },
    async getUserData(userId) {
      try {
        const userRef = doc(db, 'users', userId)
        const userSnap = await this.getDoc(userRef)
        if (userSnap.exists()) {
          return userSnap.data()
        }
        return null
      } catch (error) {
        console.error('[v0] Error getting user data:', error)
        return null
      }
    },
    async getDoc(docRef) {
      const { getDoc } = await import('firebase/firestore')
      return getDoc(docRef)
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
            this.$toast.error('Unable to get your current location')
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,geometry,directions`
        script.async = true
        script.defer = true
        script.onerror = () => reject(new Error('Failed to load Google Maps API'))
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    },
    async shareLocation() {
      if (!this.currentLocation) {
        this.$toast.error('Unable to get your location')
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
          this.$toast.success('Location link copied to clipboard!')
        }
      } catch (error) {
        console.error('[v0] Error sharing location:', error)
        this.$toast.error('Failed to share location')
      }
    },
    async navigateToPickup() {
      if (!this.currentLocation || !this.selectedBooking) {
        this.$toast.error('Missing location information')
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
            this.$toast.success('Opening directions in Google Maps')
          } else {
            console.error('[v0] Directions request failed:', status)
            this.$toast.error('Unable to get directions')
          }
        })
      } catch (error) {
        console.error('[v0] Error getting directions:', error)
        this.$toast.error('Failed to get directions')
      }
    },
    async confirmStartDelivery() {
      if (!this.selectedBooking) return
      try {
        const bookingRef = doc(db, 'orders', this.selectedBooking.id)
        await updateDoc(bookingRef, {
          status: 'picked_up',
          driverLocation: this.currentLocation,
          startedAt: new Date()
        })
        this.$toast.success('Delivery started!')
        this.showStartDeliveryModal = false
        this.loadAssignedBookings()
      } catch (error) {
        console.error('[v0] Error starting delivery:', error)
        this.$toast.error('Failed to start delivery')
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
                      timestamp: this.currentLocation.timestamp
                    }
                  })
                } catch (error) {
                  console.error('[v0] Error updating driver location:', error)
                }
              },
              (error) => {
                console.error('[v0] Location tracking error:', error)
                this.$toast.error('Unable to track location')
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            )
            this.isTrackingLocation = true
            this.$toast.success('Location tracking enabled')
          }
        } else {
          if (this.locationWatchId) {
            navigator.geolocation.clearWatch(this.locationWatchId)
            this.locationWatchId = null
          }
          this.isTrackingLocation = false
          this.$toast.success('Location tracking disabled')
        }
      } catch (error) {
        console.error('[v0] Error toggling location tracking:', error)
        this.$toast.error('Failed to toggle location tracking')
      }
    },
    async showNavigationMap() {
      if (!this.currentLocation || !this.selectedBooking) {
        this.$toast.error('Missing location information')
        return
      }
      try {
        const pickupAddress =
          this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
        const dropoffAddress =
          this.selectedBooking.deliveryAddress || this.getDeliveryLocation(this.selectedBooking)
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(dropoffAddress)}&waypoints=${encodeURIComponent(pickupAddress)}&travelmode=driving`
        window.open(mapsUrl, '_blank')
        this.$toast.success('Navigation opened in Google Maps')
        this.showStartDeliveryModal = false
      } catch (error) {
        console.error('[v0] Error opening navigation:', error)
        this.$toast.error('Failed to open navigation')
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
        this.$toast.error('Failed to load map')
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
            this.$toast.error('Unable to calculate route')
          }
        })
      } catch (error) {
        console.error('[v0] Error calculating route:', error)
        this.$toast.error('Failed to calculate route')
      }
    },
    showDirections() {
      if (!this.currentLocation || !this.selectedBooking) return
      const pickupAddress =
        this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(pickupAddress)}&travelmode=driving`
      window.open(mapsUrl, '_blank')
      this.$toast.success('Opening directions in Google Maps')
    },
    startNavigation() {
      if (!this.currentLocation || !this.selectedBooking) return
      const pickupAddress =
        this.selectedBooking.pickupAddress || this.getPickupLocation(this.selectedBooking)
      const dropoffAddress =
        this.selectedBooking.deliveryAddress || this.getDeliveryLocation(this.selectedBooking)
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${encodeURIComponent(dropoffAddress)}&waypoints=${encodeURIComponent(pickupAddress)}&travelmode=driving`
      window.open(mapsUrl, '_blank')
      this.$toast.success('Navigation started in Google Maps')
    },
    showItemsTotalModal(booking) {
      this.selectedBooking = booking
      this.itemsTotal = 0
      this.showItemsModal = true
    },
    showProofModal(booking) {
      this.selectedBooking = booking
      this.proofFile = null
      this.proofPreview = null
      this.showProofOfDeliveryModal = true
    },
    calculateNewTotal() {
      const baseCharge = this.selectedBooking?.pricing?.baseCharge || 0
      const distanceFee = this.selectedBooking?.pricing?.distanceFee || 0
      const badWeatherFee = this.selectedBooking?.pricing?.badWeatherFee || 0
      const gcashFee = this.selectedBooking?.pricing?.gcashFee || 0
      return baseCharge + distanceFee + badWeatherFee + gcashFee + this.itemsTotal
    },
    async saveItemsTotal() {
      if (!this.selectedBooking || this.itemsTotal <= 0) {
        this.$toast.error('Please enter a valid amount')
        return
      }
      this.savingItems = true
      try {
        const bookingRef = doc(db, 'orders', this.selectedBooking.id)
        const newTotal = this.calculateNewTotal()
        await updateDoc(bookingRef, {
          'pricing.itemsTotal': this.itemsTotal,
          'pricing.total': newTotal,
          itemsAddedAt: new Date()
        })
        this.$toast.success('Items total saved successfully!')
        this.showItemsModal = false
        this.loadAssignedBookings()
      } catch (error) {
        console.error('[v0] Error saving items total:', error)
        this.$toast.error('Failed to save items total')
      } finally {
        this.savingItems = false
      }
    },
    handleProofFileSelect(event) {
      const file = event.target.files?.[0]
      if (file) {
        this.proofFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.proofPreview = e.target?.result
        }
        reader.readAsDataURL(file)
      }
    },
    handleProofDrop(event) {
      this.dragOverProof = false
      const file = event.dataTransfer?.files?.[0]
      if (file && file.type.startsWith('image/')) {
        this.proofFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.proofPreview = e.target?.result
        }
        reader.readAsDataURL(file)
      }
    },
    async uploadProofOfDelivery() {
      if (!this.proofFile || !this.selectedBooking) {
        this.$toast.error('Please select a photo')
        return
      }
      this.uploadingProof = true
      try {
        const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
        const storage = getStorage()
        const timestamp = new Date().getTime()
        const filename = `proof_${this.selectedBooking.id}_${timestamp}.jpg`
        const storageRef = ref(storage, `proof-of-delivery/${filename}`)
        await uploadBytes(storageRef, this.proofFile)
        const downloadURL = await getDownloadURL(storageRef)
        const bookingRef = doc(db, 'orders', this.selectedBooking.id)
        await updateDoc(bookingRef, {
          status: 'delivered',
          proofOfDelivery: {
            url: downloadURL,
            uploadedAt: new Date(),
            fileName: filename
          },
          deliveredAt: new Date()
        })
        this.$toast.success('Proof of delivery submitted! Order marked as delivered.')
        this.showProofOfDeliveryModal = false
        this.proofFile = null
        this.proofPreview = null
        this.loadAssignedBookings()
      } catch (error) {
        console.error('[v0] Error uploading proof:', error)
        this.$toast.error('Failed to upload proof of delivery')
      } finally {
        this.uploadingProof = false
      }
    },
    async updateDeliveryStatus(booking, newStatus) {
      if (!booking) return
      try {
        const bookingRef = doc(db, 'orders', booking.id)
        const updateData = {
          status: newStatus,
          driverLocation: this.currentLocation,
          updatedAt: new Date()
        }
        if (newStatus === 'in_transit') {
          updateData.inTransitAt = new Date()
        } else if (newStatus === 'on_the_way') {
          updateData.onTheWayAt = new Date()
        } else if (newStatus === 'delivered') {
          updateData.deliveredAt = new Date()
        }
        await updateDoc(bookingRef, updateData)
        this.$toast.success(`Status updated to ${this.formatStatus(newStatus)}!`)
        this.showStartDeliveryModal = false
        this.loadAssignedBookings()
      } catch (error) {
        console.error('[v0] Error updating delivery status:', error)
        this.$toast.error('Failed to update status')
      }
    }
  },
  mounted() {
    this.checkWeatherStatus()
    this.loadAssignedBookings()
    this.weatherInterval = setInterval(() => this.checkWeatherStatus(), 10 * 60 * 1000)
  },
  beforeUnmount() {
    if (this.weatherInterval) {
      clearInterval(this.weatherInterval)
    }
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.locationWatchId) {
      navigator.geolocation.clearWatch(this.locationWatchId)
    }
  }
}
</script>
