<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Remit Payment to Admin</h1>
      <p class="text-gray-600">Submit your earnings from completed deliveries. 80% credited to your account, 20% to admin revenue.</p>
    </div>

    <!-- Tabs: Remit and History -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            @click="activeTab = 'remit'"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'remit' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Remit
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

    <!-- Remit Tab Content -->
    <div v-if="activeTab === 'remit'">
    <!-- Filter Buttons -->
    <div class="flex gap-2">
      <button 
        @click="filterPeriod = 'today'"
        :class="filterPeriod === 'today' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        Today
      </button>
      <button 
        @click="filterPeriod = 'all'"
        :class="filterPeriod === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        All Time
      </button>
    </div>

    <!-- Group deliveries by date with remit button for each group -->
    <div v-if="getFilteredDeliveries().length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">No completed deliveries found</p>
    </div>

    <!-- Grouped date cards with remit button -->
    <div v-else class="space-y-4">
      <div v-for="dateGroup in groupedDeliveries" :key="dateGroup.date" class="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
        <!-- Date header with order count -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ dateGroup.label }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ dateGroup.deliveries.length }} order(s) · {{ dateGroup.remitStatus }}</p>
          </div>
          <!-- REMIT button for the date group -->
          <button
            v-if="dateGroup.remitStatus !== 'Remitted' && dateGroup.remitStatus !== 'Approved'"
            @click="openRemitModal(dateGroup)"
            class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
          >
            REMIT
          </button>
          <span v-else :class="[
            'px-4 py-2 rounded-lg text-sm font-medium',
            dateGroup.remitStatus === 'Remitted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          ]">
            {{ dateGroup.remitStatus }}
          </span>
        </div>

        <!-- Orders in this date group -->
        <div class="space-y-3">
          <div 
            v-for="delivery in dateGroup.deliveries"
            :key="delivery.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            @click="openOrderModal(delivery)"
          >
            <div class="flex items-center gap-3 flex-1">
              <div class="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM5 16a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">#{{ delivery.id.substring(0, 8).toUpperCase() }}</p>
                <p class="text-xs text-gray-600">{{ getPaymentMethodLabel(delivery.paymentMethod || delivery.formData?.paymentMethod) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">₱{{ (delivery.totalAmount || calculateDeliveryTotal(delivery)).toFixed(2) }}</p>
              <span :class="[
                'inline-flex text-xs font-medium mt-1',
                delivery.remitStatus === 'remitted' ? 'text-yellow-600' : delivery.remitStatus === 'approved' ? 'text-green-600' : 'text-gray-600'
              ]">
                {{ delivery.remitStatus || 'Pending' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Total for this day -->
        <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p class="text-sm font-medium text-gray-700">Daily Total:</p>
          <p class="text-lg font-bold text-primary">₱{{ dateGroup.totalAmount.toFixed(2) }}</p>
        </div>
      </div>
      </div>

      <!-- Instructions -->
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 class="font-medium text-blue-900 mb-2">📋 How it Works:</h3>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• View your completed deliveries grouped by date</li>
          <li>• Click REMIT button to submit all earnings for that date</li>
          <li>• Select payment method (GCash or Cash) and upload proof of payment</li>
          <li>• Modal shows breakdown of total to remit (80% yours, 20% admin)</li>
          <li>• Once submitted, orders marked as "Remitted"</li>
          <li>• Admin reviews and approves - then orders marked as "Approved"</li>
          <li>• Your earnings credited once admin approves</li>
        </ul>
      </div>
    </div>

    <!-- Updated Remit Modal with proof of payment upload and payment method selection -->
    <div v-if="showRemitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">Remit Earnings</h2>
            <p class="text-sm text-gray-600 mt-1">{{ selectedDateGroup?.label }}</p>
          </div>
          <button @click="closeRemitModal" class="text-gray-500 hover:text-gray-700 text-2xl font-light">×</button>
        </div>

        <div v-if="selectedDateGroup" class="space-y-6">
          <!-- Order count -->
          <div class="pb-4 border-b border-gray-200">
            <p class="text-sm text-gray-600 mb-1">Orders to Remit</p>
            <p class="text-lg font-semibold text-gray-900">{{ selectedDateGroup.deliveries.length }} order(s)</p>
          </div>

          <!-- Pricing Breakdown -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 class="font-semibold text-gray-900">Earnings Breakdown</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Earnings:</span>
                <span class="font-medium text-gray-900">₱{{ selectedDateGroup.totalAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Your Share (80%):</span>
                <span class="font-medium text-blue-600">₱{{ (selectedDateGroup.totalAmount * 0.8).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Admin Share (20%):</span>
                <span class="font-medium text-green-600">₱{{ (selectedDateGroup.totalAmount * 0.2).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Total Amount -->
          <div class="bg-primary bg-opacity-10 rounded-lg p-4 border border-primary">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Total to Remit</span>
              <span class="text-3xl font-bold text-primary">₱{{ selectedDateGroup.totalAmount.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Added Payment Method Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Payment Method</label>
            <select v-model="remitFormData.paymentMethod" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">-- Select Payment Method --</option>
              <option value="GCASH">GCash</option>
              <option value="CASH">Cash</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Select how you want to receive the payment</p>
          </div>

          <!-- Added Proof of Payment Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Proof of Payment</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer" @click="$refs.fileInput.click()">
              <input
                ref="fileInput"
                type="file"
                accept="image/*,.pdf"
                @change="handleFileUpload"
                class="hidden"
              />
              <svg v-if="!remitFormData.proofFile" class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
              <p v-if="remitFormData.proofFile" class="text-sm font-medium text-green-600">✓ {{ remitFormData.proofFile.name }}</p>
              <p v-else class="text-sm text-gray-600">Click to upload receipt or proof of payment</p>
              <p class="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 mt-6">
            <button 
              @click="submitDateGroupRemittance"
              :disabled="!remitFormData.paymentMethod || !remitFormData.proofFile"
              :class="!remitFormData.paymentMethod || !remitFormData.proofFile ? 'opacity-50 cursor-not-allowed' : ''"
              class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:hover:bg-primary"
            >
              Confirm & Submit
            </button>
            <button @click="closeRemitModal" class="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
        <!-- Modal header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Order Details</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl font-light">×</button>
        </div>

        <div v-if="selectedOrder" class="space-y-6">
          <!-- Order ID -->
          <div class="pb-4 border-b border-gray-200">
            <p class="text-sm text-gray-600 mb-1">Order ID</p>
            <p class="text-lg font-semibold text-gray-900">#{{ selectedOrder.id.substring(0, 8).toUpperCase() }}</p>
          </div>

          <!-- Payment Method -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-1">Payment Method</p>
              <p class="text-base font-medium text-gray-900">{{ getPaymentMethodLabel(selectedOrder.paymentMethod || selectedOrder.formData?.paymentMethod) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Delivery Date</p>
              <p class="text-base font-medium text-gray-900">{{ formatDeliveryDate(selectedOrder.deliveredAt) }}</p>
            </div>
          </div>

          <!-- Customer & Service Info -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-1">Customer Name</p>
              <p class="text-base font-medium text-gray-900">{{ selectedOrder.customerName || 'Unknown' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Service</p>
              <p class="text-base font-medium text-gray-900">{{ getServiceName(selectedOrder.serviceId || selectedOrder.serviceName) }}</p>
            </div>
          </div>

          <!-- Pricing Breakdown -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 class="font-semibold text-gray-900">Pricing Breakdown</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Base Charge</span>
                <span class="font-medium text-gray-900">₱{{ (selectedOrder.pricing?.baseCharge || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Distance Fee</span>
                <span class="font-medium text-blue-600">₱{{ (selectedOrder.pricing?.distanceFee || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Bad Weather Fee</span>
                <span class="font-medium text-orange-600">₱{{ (selectedOrder.pricing?.badWeatherFee || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Items Total</span>
                <span class="font-medium text-blue-600">₱{{ (selectedOrder.pricing?.itemsTotal || 0).toFixed(2) }}</span>
              </div>
              <div v-if="selectedOrder.paymentMethod?.toUpperCase() === 'GCASH'" class="flex justify-between">
                <span class="text-gray-600">GCash Fee</span>
                <span class="font-medium text-orange-600">₱{{ (selectedOrder.pricing?.gcashFee || 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Total Amount -->
          <div class="bg-primary bg-opacity-10 rounded-lg p-4 border border-primary">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Total Amount to Remit</span>
              <span class="text-3xl font-bold text-primary">₱{{ (selectedOrder.totalAmount || calculateDeliveryTotal(selectedOrder)).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Close Button -->
          <button @click="closeModal" class="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium mt-6">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Proof of Payment Preview Modal -->
    <div v-if="showProofModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">Proof of Payment</h2>
          <button @click="closeProofModal" class="text-gray-500 hover:text-gray-700 text-2xl font-light">×</button>
        </div>

        <div v-if="selectedProof" class="space-y-4">
          <div v-if="selectedProof.isPDF" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-center">
              <svg class="w-12 h-12 text-red-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
              </svg>
              <p class="text-gray-600">PDF Document</p>
              <a :href="selectedProof.url" target="_blank" class="text-primary hover:text-green-600 font-medium mt-2 inline-block">
                Download PDF
              </a>
            </div>
          </div>
          <img v-else :src="selectedProof.url" :alt="selectedProof.name" class="w-full rounded-lg border border-gray-200" />
          
          <div class="pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600">File Name: {{ selectedProof.name }}</p>
            <p class="text-sm text-gray-600">Date: {{ selectedProof.date }}</p>
          </div>

          <button @click="closeProofModal" class="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- History Tab Content -->
    <div v-if="activeTab === 'history'" class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Remittance History</h2>
      
      <div v-if="remittanceHistory.length === 0" class="text-center py-8">
        <p class="text-gray-500 mb-2">No remittances submitted yet</p>
        <p class="text-sm text-gray-400">Click REMIT on any date to submit earnings</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Share (80%)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="remittance in remittanceHistory" :key="remittance.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(remittance.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₱{{ remittance.amount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                ₱{{ (remittance.amount * 0.8).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatPaymentMethod(remittance.paymentMethod) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  remittance.status === 'approved' ? 'bg-green-100 text-green-800' :
                  remittance.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  remittance.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ remittance.status ? remittance.status.charAt(0).toUpperCase() + remittance.status.slice(1) : 'Unknown' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  v-if="remittance.proofUrl || remittance.receiptUrl"
                  @click="viewProof(remittance.proofUrl || remittance.receiptUrl, remittance.date)"
                  class="text-primary hover:text-green-600 font-medium text-sm"
                >
                  View
                </button>
                <span v-else class="text-gray-400 text-sm">N/A</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useDriverStore } from '@/stores/driver'
import { useAuthStore } from '@/stores/auth'
import { db, storage } from '@/firebase/config'
import { collection, query, where, orderBy, getDocs, addDoc, doc, updateDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useToast } from 'vue-toastification'

export default {
  name: 'RemitPayment',
  setup() {
    const driverStore = useDriverStore()
    const authStore = useAuthStore()
    const toast = useToast()
    return { driverStore, authStore, toast }
  },
  data() {
    return {
      todayTotalEarnings: 0,
      completedDeliveries: [],
      remittanceHistory: [],
      filterPeriod: 'today',
      activeTab: 'remit',
      unsubscribe: null,
      remittanceHistoryUnsubscribe: null,
      showModal: false,
      selectedOrder: null,
      showRemitModal: false,
      selectedDateGroup: null,
      remitFormData: {
        paymentMethod: '',
        proofFile: null
      },
      isUploading: false,
      showProofModal: false,
      selectedProof: null
    }
  },
  computed: {
    groupedDeliveries() {
      const deliveries = this.getFilteredDeliveries()
      const grouped = {}
      
      deliveries.forEach(delivery => {
        const date = delivery.deliveredAt?.toDate?.()
        const dateKey = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            date: dateKey,
            label: this.getDateLabel(date),
            deliveries: [],
            totalAmount: 0,
            remitStatus: 'Pending'
          }
        }
        grouped[dateKey].deliveries.push(delivery)
        grouped[dateKey].totalAmount += this.calculateDeliveryTotal(delivery)
      })

      Object.values(grouped).forEach(group => {
        if (group.deliveries.length > 0) {
          const allRemitted = group.deliveries.every(d => d.remitStatus === 'remitted')
          const allApproved = group.deliveries.every(d => d.remitStatus === 'approved')
          
          if (allApproved) {
            group.remitStatus = 'Approved'
          } else if (allRemitted) {
            group.remitStatus = 'Remitted'
          } else {
            group.remitStatus = 'Pending'
          }
        }
      })
      
      return Object.values(grouped).sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
      })
    }
  },
  async mounted() {
    this.setupRemittanceHistoryListener()
    this.setupCompletedDeliveriesListener()
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.remittanceHistoryUnsubscribe) {
      this.remittanceHistoryUnsubscribe()
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
          this.toast.error('File size must not exceed 5MB')
          return
        }
        this.remitFormData.proofFile = file
      }
    },

    getDateLabel(date) {
      if (!date) return 'Unknown Date'
      
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
      
      if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Today'
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Yesterday'
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    },

    openOrderModal(delivery) {
      this.selectedOrder = delivery
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.selectedOrder = null
    },

    openRemitModal(dateGroup) {
      this.selectedDateGroup = dateGroup
      this.remitFormData = {
        paymentMethod: '',
        proofFile: null
      }
      this.showRemitModal = true
    },

    closeRemitModal() {
      this.showRemitModal = false
      this.selectedDateGroup = null
      this.remitFormData = {
        paymentMethod: '',
        proofFile: null
      }
      this.isUploading = false
    },

    viewProof(proofUrl, date) {
      const isPDF = proofUrl.toLowerCase().includes('.pdf')
      const fileName = proofUrl.split('/').pop().split('?')[0]
      
      this.selectedProof = {
        url: proofUrl,
        name: fileName,
        date: this.formatDate(date),
        isPDF: isPDF
      }
      this.showProofModal = true
    },

    closeProofModal() {
      this.showProofModal = false
      this.selectedProof = null
    },

    async submitDateGroupRemittance() {
      try {
        const user = this.authStore.user
        if (!user || !this.selectedDateGroup) return

        if (!this.remitFormData.paymentMethod) {
          this.toast.error('Please select a payment method')
          return
        }

        if (!this.remitFormData.proofFile) {
          this.toast.error('Please upload proof of payment')
          return
        }

        this.isUploading = true
        this.toast.info('Uploading proof of payment...')

        const timestamp = Date.now()
        const fileName = `${timestamp}_${this.remitFormData.proofFile.name}`
        const filePath = `remittance-receipts/${user.uid}/${fileName}`
        const fileRef = storageRef(storage, filePath)

        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(fileRef, this.remitFormData.proofFile)

          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log('[v0] Upload progress:', progress)
            },
            (error) => {
              console.error('[v0] Upload error:', error)
              this.isUploading = false
              this.toast.error('Failed to upload proof of payment: ' + error.message)
              reject(error)
            },
            async () => {
              try {
                const proofUrl = await getDownloadURL(fileRef)
                console.log('[v0] Proof uploaded successfully:', proofUrl)

                const amount = this.selectedDateGroup.totalAmount
                const driverShare = amount * 0.8
                const adminShare = amount * 0.2

                const remittanceData = {
                  driverId: user.uid,
                  driverName: this.authStore.userProfile?.fullName || 'Driver',
                  amount: amount,
                  driverShare: driverShare,
                  adminShare: adminShare,
                  paymentMethod: this.remitFormData.paymentMethod.toUpperCase(),
                  proofUrl: proofUrl,
                  notes: `Earnings remitted for ${this.selectedDateGroup.label} (${this.selectedDateGroup.deliveries.length} order(s))`,
                  date: new Date(),
                  status: 'pending',
                  createdAt: new Date(),
                  orderIds: this.selectedDateGroup.deliveries.map(d => d.id)
                }

                // Create remittance record
                const remittanceRef = await addDoc(collection(db, 'remittances'), remittanceData)
                console.log('[v0] Remittance created:', remittanceRef.id)

                // Mark all orders as remitted
                for (const delivery of this.selectedDateGroup.deliveries) {
                  await updateDoc(doc(db, 'orders', delivery.id), {
                    remitStatus: 'remitted',
                    remittanceId: remittanceRef.id,
                    remittedAt: new Date()
                  })
                }

                // Update driver's today earnings in Firestore (store total amount, not driver share)
                try {
                  const driverRef = doc(db, 'drivers', user.uid)
                  // Use toDateString() to ensure consistent string format
                  const today = new Date().toDateString()
                  const driverDoc = await getDoc(driverRef)
                  
                  if (driverDoc.exists()) {
                    const driverData = driverDoc.data()
                    // Store total amount (100%), driver store will calculate 80% share
                    const currentTotal = driverData.totalEarningsToday || 0
                    const newTotal = currentTotal + amount // Add full amount, not driverShare
                    
                    // Ensure lastRemitDate is stored as a string for consistent comparison
                    await updateDoc(driverRef, {
                      totalEarningsToday: newTotal,
                      lastRemitDate: today, // Store as string
                      hasRemitted: true
                    })
                    
                    console.log('[v0] Driver earnings updated in Firestore:', {
                      currentTotal,
                      amount,
                      newTotal,
                      today,
                      lastRemitDate: today,
                      driverId: user.uid
                    })
                    
                    // Small delay to ensure Firestore update is processed
                    await new Promise(resolve => setTimeout(resolve, 500))
                    
                    // Force reload earnings data in driver store
                    await this.driverStore.loadEarningsData()
                    
                    console.log('[v0] Driver store earnings after reload:', {
                      hasRemitted: this.driverStore.hasRemitted,
                      todayEarnings: this.driverStore.todayEarnings
                    })
                  } else {
                    // Create driver document if it doesn't exist
                    await setDoc(driverRef, {
                      totalEarningsToday: amount,
                      lastRemitDate: today, // Store as string
                      hasRemitted: true,
                      isOnline: false
                    })
                    
                    // Small delay to ensure Firestore update is processed
                    await new Promise(resolve => setTimeout(resolve, 500))
                    
                    // Force reload earnings data in driver store
                    await this.driverStore.loadEarningsData()
                    
                    console.log('[v0] Driver document created and earnings loaded')
                  }
                } catch (error) {
                  console.error('[v0] Error updating driver earnings:', error)
                  this.toast.error('Failed to update earnings display. Please refresh the page.')
                }

                this.isUploading = false
                this.toast.success('Remittance submitted! Waiting for admin approval...')
                
                this.closeRemitModal()
                await this.setupCompletedDeliveriesListener()
                // Remittance history will update automatically via real-time listener
                resolve()
              } catch (error) {
                console.error('[v0] Error after upload:', error)
                this.isUploading = false
                this.toast.error('Error creating remittance: ' + error.message)
                reject(error)
              }
            }
          )
        })

      } catch (error) {
        console.error('[v0] Error submitting remittance:', error)
        this.isUploading = false
        this.toast.error('Failed to submit remittance. ' + (error.message || 'Please try again.'))
      }
    },

    getPaymentMethodLabel(method) {
      if (!method) return 'Unknown'
      
      // Normalize the method string - convert to uppercase and handle common variations
      const normalizedMethod = String(method).toUpperCase().trim().replace(/\s+/g, ' ')
      
      // Payment method mappings - exact matches first
      const methods = {
        'GCASH': 'GCash',
        'PAYMAYA': 'PayMaya',
        'PAY MAYA': 'PayMaya',
        'CASH_ON_DELIVERY': 'Cash on Delivery',
        'CASH-ON-DELIVERY': 'Cash on Delivery',
        'CASH ON DELIVERY': 'Cash on Delivery',
        'COD': 'Cash on Delivery',
        'BANK_TRANSFER': 'Bank Transfer',
        'BANK TRANSFER': 'Bank Transfer',
        'BANKTRANSFER': 'Bank Transfer',
        'CASH': 'Cash',
        'CASH PAYMENT': 'Cash',
        'CASHPAYMENT': 'Cash'
      }
      
      // Try exact match first (handles most cases)
      if (methods[normalizedMethod]) {
        return methods[normalizedMethod]
      }
      
      // Try match with underscores/dashes normalized
      const normalizedUnderscore = normalizedMethod.replace(/[-_]/g, '_')
      const normalizedDash = normalizedMethod.replace(/[-_]/g, '-')
      const normalizedSpace = normalizedMethod.replace(/[-_]/g, ' ')
      
      if (methods[normalizedUnderscore]) return methods[normalizedUnderscore]
      if (methods[normalizedDash]) return methods[normalizedDash]
      if (methods[normalizedSpace]) return methods[normalizedSpace]
      
      // Check for partial matches (e.g., "GCASH" in "GCASH_PAYMENT")
      const methodKeys = Object.keys(methods)
      for (const key of methodKeys) {
        const keyUpper = key.toUpperCase().replace(/\s+/g, '')
        if (normalizedMethod.includes(keyUpper) || keyUpper.includes(normalizedMethod.replace(/\s+/g, ''))) {
          return methods[key]
        }
      }
      
      // If no match, try to format the method nicely
      const formatted = String(method)
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      
      return formatted || 'Unknown'
    },

    setupCompletedDeliveriesListener() {
      try {
        const user = this.authStore.user
        if (!user) return

        if (this.unsubscribe) {
          this.unsubscribe()
        }

        // Use query without orderBy to avoid index requirement
        const ordersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', user.uid),
          where('status', '==', 'delivered')
        )

        this.unsubscribe = onSnapshot(ordersQuery, async (snapshot) => {
          const orders = []
          snapshot.forEach(doc => {
            const data = doc.data()
            orders.push({
              id: doc.id,
              ...data,
              // Ensure paymentMethod is extracted from formData if not directly available
              paymentMethod: data.paymentMethod || data.formData?.paymentMethod || data.method || null
            })
            })

          // Sort manually by deliveredAt (descending)
          orders.sort((a, b) => {
            const dateA = a.deliveredAt?.toDate ? a.deliveredAt.toDate() : (a.deliveredAt ? new Date(a.deliveredAt) : new Date(0))
            const dateB = b.deliveredAt?.toDate ? b.deliveredAt.toDate() : (b.deliveredAt ? new Date(b.deliveredAt) : new Date(0))
            return dateB - dateA
          })

          await this.enrichOrdersWithCustomerData(orders)
          
          this.completedDeliveries = orders
          this.updateTodayEarnings()
        }, (error) => {
          // Silently handle all errors - queries work without indexes, errors are expected
          // Don't log to console to keep it clean
        })
      } catch (error) {
        console.error('[v0] Error setting up listener:', error)
      }
    },

    async enrichOrdersWithCustomerData(orders) {
      try {
        const userIds = [...new Set(orders.map(o => o.userId).filter(Boolean))]
        
        if (userIds.length === 0) return

        const usersMap = {}
        const userDocPromises = userIds.map(userId =>
          getDoc(doc(db, 'users', userId))
            .then(docSnap => {
              if (docSnap.exists()) {
                usersMap[userId] = docSnap.data()
              }
              return usersMap
            })
            .catch(err => {
              console.error('[v0] Error fetching user:', userId, err)
              return usersMap
            })
        )

        await Promise.all(userDocPromises)

        orders.forEach(order => {
          if (order.userId && usersMap[order.userId]) {
            const userData = usersMap[order.userId]
            order.customerName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown'
          } else {
            order.customerName = order.customerName || 'Unknown'
          }
        })
      } catch (error) {
        console.error('[v0] Error enriching orders:', error)
      }
    },

    getFilteredDeliveries() {
      if (this.filterPeriod === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        return this.completedDeliveries.filter(delivery => {
          const deliveredDate = delivery.deliveredAt?.toDate?.()
          return deliveredDate >= today
        })
      }
      return this.completedDeliveries
    },

    updateTodayEarnings() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let totalEarnings = 0
      this.completedDeliveries.forEach(delivery => {
        const deliveredDate = delivery.deliveredAt?.toDate?.()
        if (deliveredDate >= today) {
          totalEarnings += this.calculateDeliveryTotal(delivery)
        }
      })
      
      this.todayTotalEarnings = totalEarnings
    },

    calculateDeliveryTotal(delivery) {
      const baseCharge = delivery.pricing?.baseCharge || 0
      const distanceFee = delivery.pricing?.distanceFee || 0
      const badWeatherFee = delivery.pricing?.badWeatherFee || 0
      const itemsTotal = delivery.pricing?.itemsTotal || 0
      
      const gcashFee = delivery.paymentMethod?.toUpperCase() === 'GCASH' ? (delivery.pricing?.gcashFee || 0) : 0
      
      const total = baseCharge + distanceFee + badWeatherFee + itemsTotal + gcashFee
      
      return total
    },

    getServiceName(serviceId) {
      const serviceNames = {
        'food-delivery': 'Food Delivery',
        'bill-payments': 'Bill Payment',
        'grocery-shopping': 'Grocery Shopping',
        'pickup-drop': 'Pick-up & Drop',
        'gift-delivery': 'Gift Delivery',
        'medicine-delivery': 'Medicine Delivery'
      }
      return serviceNames[serviceId] || serviceId || 'Delivery'
    },

    formatDeliveryDate(date) {
      if (!date) return 'Unknown'
      const d = date.toDate ? date.toDate() : new Date(date)
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    },

    setupRemittanceHistoryListener() {
      try {
        const user = this.authStore.user
        if (!user) return

        // Use query without orderBy to avoid index requirement
        const remittancesQuery = query(
          collection(db, 'remittances'),
          where('driverId', '==', user.uid)
        )

        this.remittanceHistoryUnsubscribe = onSnapshot(remittancesQuery, (snapshot) => {
          this.remittanceHistory = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
          id: doc.id,
              ...data,
              // Ensure paymentMethod is available (fallback to method if needed)
              paymentMethod: data.paymentMethod || data.method || 'Unknown'
            }
          })
          
          // Sort by date manually (descending - most recent first)
          this.remittanceHistory.sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || a.createdAt || 0)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || b.createdAt || 0)
            return dateB - dateA
          })
          
          console.log('[v0] Remittance history loaded (real-time):', this.remittanceHistory.length)
        }, (error) => {
          // Silently handle all errors - queries work without indexes, errors are expected
          // Don't log to console to keep it clean
          this.remittanceHistory = []
        })
      } catch (error) {
        console.error('[v0] Error setting up remittance history listener:', error)
        this.remittanceHistory = []
      }
    },

    loadRemittanceHistoryFallback() {
      try {
        const user = this.authStore.user
        if (!user) return

        // Cleanup previous listener if exists
        if (this.remittanceHistoryUnsubscribe) {
          this.remittanceHistoryUnsubscribe()
        }

        // Set up listener without orderBy
        const remittancesQuery = query(
          collection(db, 'remittances'),
          where('driverId', '==', user.uid)
        )

        this.remittanceHistoryUnsubscribe = onSnapshot(remittancesQuery, (snapshot) => {
          this.remittanceHistory = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              // Ensure paymentMethod is available (fallback to method if needed)
              paymentMethod: data.paymentMethod || data.method || 'Unknown'
            }
          })
          
          // Sort by date manually
          this.remittanceHistory.sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date || a.createdAt || 0)
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date || b.createdAt || 0)
            return dateB - dateA
          })
          
          console.log('[v0] Remittance history loaded (fallback - real-time):', this.remittanceHistory.length)
        }, (error) => {
          console.error('[v0] Error with remittance history listener (fallback):', error)
          this.remittanceHistory = []
        })
      } catch (error) {
        console.error('[v0] Error loading remittance history (fallback):', error)
        this.remittanceHistory = []
      }
    },

    formatDate(date) {
      if (!date) return 'Unknown'
      const d = date.toDate ? date.toDate() : new Date(date)
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatPaymentMethod(method) {
      if (!method) return 'Unknown'
      const methodUpper = method.toUpperCase()
      const methods = {
        'GCASH': 'GCash',
        'PAYMAYA': 'PayMaya',
        'BANK_TRANSFER': 'Bank Transfer',
        'DIRECT_CASH': 'Direct Cash',
        'SYSTEM_AUTO': 'System Auto',
        'CASH': 'Cash',
        'CASH_ON_DELIVERY': 'Cash on Delivery'
      }
      return methods[methodUpper] || method || 'Unknown'
    }
  }
}
</script>
