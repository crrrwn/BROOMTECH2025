<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Remit Payment to Admin</h1>
      <p class="text-gray-600">Submit your earnings from completed deliveries. 80% credited to your account, 20% to admin revenue.</p>
    </div>

    <!-- Earnings Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <p class="text-sm text-gray-600 mb-2">Total Earnings Today</p>
        <p class="text-3xl font-bold text-primary">₱{{ todayTotalEarnings.toFixed(2) }}</p>
      </div>
      
      <div class="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-200">
        <p class="text-sm text-blue-700 mb-2">Your Share (80%)</p>
        <p class="text-3xl font-bold text-blue-600">₱{{ (todayTotalEarnings * 0.8).toFixed(2) }}</p>
      </div>
      
      <div class="bg-green-50 rounded-lg p-6 shadow-sm border border-green-200">
        <p class="text-sm text-green-700 mb-2">Admin Share (20%)</p>
        <p class="text-3xl font-bold text-green-600">₱{{ (todayTotalEarnings * 0.2).toFixed(2) }}</p>
      </div>
    </div>

    <!-- Today's Completed Deliveries Breakdown -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ filterPeriod === 'today' ? "Today's" : "All" }} Completed Deliveries</h3>
            <p class="text-sm text-gray-600 mt-1">Breakdown of earnings from your deliveries</p>
          </div>
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
        </div>
      </div>

      <div v-if="getFilteredDeliveries().length === 0" class="p-6 text-center">
        <p class="text-gray-500">No completed deliveries found</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Charge</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance Fee</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bad Weather Fee</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GCash Fee</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="delivery in getFilteredDeliveries()" :key="delivery.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ delivery.id.substring(0, 8) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDeliveryDate(delivery.deliveredAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ delivery.customerName || 'Unknown' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ getServiceName(delivery.serviceId || delivery.serviceName) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₱{{ (delivery.pricing?.baseCharge || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                ₱{{ (delivery.pricing?.distanceFee || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                ₱{{ (delivery.pricing?.badWeatherFee || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                ₱{{ (delivery.pricing?.itemsTotal || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                {{ delivery.paymentMethod === 'GCASH' ? '₱' + (delivery.pricing?.gcashFee || 0).toFixed(2) : '₱0.00' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                ₱{{ (delivery.totalAmount || calculateDeliveryTotal(delivery)).toFixed(2) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td colspan="9" class="px-6 py-3 text-right font-semibold text-gray-900">TOTAL:</td>
              <td class="px-6 py-3 text-right font-bold text-lg text-green-600">
                ₱{{ getFilteredDeliveriesTotal().toFixed(2) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Remittance Form -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Remit Earnings</h2>
      
      <div v-if="getFilteredDeliveriesTotal() === 0" class="text-center py-8">
        <p class="text-gray-500 mb-4">No earnings to remit today</p>
        <p class="text-sm text-gray-400">Complete assignments to earn money</p>
      </div>

      <div v-else>
        <form @submit.prevent="submitRemittance" class="space-y-6">
          <!-- Remittance Information -->
          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 class="text-md font-semibold text-yellow-900 mb-3">💰 Remittance Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Remit <span class="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  v-model="remittanceAmount"
                  step="0.01"
                  :min="0"
                  :max="getFilteredDeliveriesTotal()"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                  :placeholder="`Max: ₱${getFilteredDeliveriesTotal().toFixed(2)}`"
                >
                <p class="text-xs text-gray-500 mt-1">You can remit partial or full amount</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span class="text-red-500">*</span>
                </label>
                <select 
                  v-model="paymentMethod"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select payment method</option>
                  <option value="gcash">GCash</option>
                  <option value="paymaya">PayMaya</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="direct_cash">Direct Cash Remittance</option>
                </select>
              </div>
            </div>

            <!-- Breakdown -->
            <div class="mt-4 pt-4 border-t border-yellow-300">
              <div class="flex justify-between mb-2">
                <span class="text-gray-700">Total Remittance:</span>
                <span class="font-semibold">₱{{ parseFloat(remittanceAmount || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-2 bg-blue-100 p-2 rounded">
                <span class="text-gray-700">Your Earnings (80%):</span>
                <span class="font-semibold text-blue-600">₱{{ (parseFloat(remittanceAmount || 0) * 0.8).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between bg-green-100 p-2 rounded">
                <span class="text-gray-700">Admin Revenue (20%):</span>
                <span class="font-semibold text-green-600">₱{{ (parseFloat(remittanceAmount || 0) * 0.2).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Receipt Photo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Payment Receipt/Proof <span class="text-red-500">*</span>
            </label>
            <p class="text-sm text-gray-600 mb-3">
              Upload a screenshot or receipt showing your payment to the admin (GCash screenshot, bank transfer confirmation, etc.)
            </p>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input 
                type="file" 
                ref="paymentReceiptInput"
                @change="handleReceiptUpload"
                accept="image/*"
                class="hidden"
              >
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-gray-600 mb-2">Click to upload payment receipt</p>
              <p class="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              <button 
                type="button"
                @click="$refs.paymentReceiptInput.click()"
                class="mt-3 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Choose Receipt
              </button>
            </div>
            
            <!-- Preview receipt -->
            <div v-if="paymentReceipt" class="mt-4">
              <div class="relative inline-block">
                <img :src="paymentReceipt.preview" alt="Payment Receipt" class="w-32 h-32 object-cover rounded-lg border">
                <button 
                  type="button"
                  @click="removeReceipt"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea 
              id="notes"
              v-model="notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Add any notes about this remittance..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex space-x-4">
            <button 
              type="submit"
              :disabled="!canSubmit"
              class="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {{ isSubmitting ? 'Processing...' : 'Submit Remittance' }}
            </button>
            <button 
              type="button"
              @click="resetForm"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h3 class="font-medium text-blue-900 mb-2">📋 How it Works:</h3>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• View all your completed deliveries with breakdown of charges</li>
        <li>• Enter the amount you want to remit from your total earnings</li>
        <li>• Your share (80%) will be added to your account balance</li>
        <li>• Admin share (20%) will be recorded in admin revenue</li>
        <li>• Upload proof of payment (GCash/PayMaya/Bank transfer screenshot)</li>
        <li>• Once submitted and verified, your earnings will be credited</li>
      </ul>
    </div>

    <!-- Recent Remittances -->
    <div v-if="remittanceHistory.length > 0" class="bg-white rounded-lg shadow-sm border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Remittance History</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Share (80%)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
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
                {{ formatPaymentMethod(remittance.method) }}
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
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ remittance.notes || '-' }}
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
import { collection, query, where, orderBy, getDocs, addDoc, doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore'
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
      remittanceAmount: '',
      paymentMethod: '',
      paymentReceipt: null,
      notes: '',
      todayTotalEarnings: 0,
      completedDeliveries: [],
      remittanceHistory: [],
      isSubmitting: false,
      filterPeriod: 'today',
      unsubscribe: null
    }
  },
  computed: {
    canSubmit() {
      return this.remittanceAmount && 
             parseFloat(this.remittanceAmount) > 0 &&
             parseFloat(this.remittanceAmount) <= this.getFilteredDeliveriesTotal() &&
             this.paymentMethod && 
             this.paymentReceipt
    }
  },
  async mounted() {
    await this.loadRemittanceHistory()
    this.setupCompletedDeliveriesListener()
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    setupCompletedDeliveriesListener() {
      try {
        const user = this.authStore.user
        if (!user) return

        if (this.unsubscribe) {
          this.unsubscribe()
        }

        const ordersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', user.uid),
          where('status', '==', 'delivered'),
          orderBy('deliveredAt', 'desc')
        )

        this.unsubscribe = onSnapshot(ordersQuery, async (snapshot) => {
          const orders = []
          snapshot.forEach(doc => {
            orders.push({
              id: doc.id,
              ...doc.data()
            })
          })

          await this.enrichOrdersWithCustomerData(orders)
          
          this.completedDeliveries = orders
          this.updateTodayEarnings()
        }, (error) => {
          console.error('[v0] Error with completed deliveries listener:', error)
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

    getFilteredDeliveriesTotal() {
      return this.getFilteredDeliveries().reduce((total, delivery) => {
        return total + this.calculateDeliveryTotal(delivery)
      }, 0)
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

    async loadRemittanceHistory() {
      try {
        const user = this.authStore.user
        if (!user) return

        const remittancesQuery = query(
          collection(db, 'remittances'),
          where('driverId', '==', user.uid),
          orderBy('date', 'desc')
        )

        const snapshot = await getDocs(remittancesQuery)
        this.remittanceHistory = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('[v0] Error loading remittance history:', error)
        this.remittanceHistory = []
      }
    },

    handleReceiptUpload(event) {
      const file = event.target.files[0]
      
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          this.toast.error('Receipt is too large. Maximum size is 10MB.')
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          this.paymentReceipt = {
            file: file,
            preview: e.target.result,
            name: file.name
          }
        }
        reader.readAsDataURL(file)
      }
      
      event.target.value = ''
    },

    removeReceipt() {
      this.paymentReceipt = null
    },

    async submitRemittance() {
      try {
        this.isSubmitting = true
        const user = this.authStore.user
        
        if (!user) {
          this.toast.error('User not found. Please log in again.')
          this.isSubmitting = false
          return
        }

        const amount = parseFloat(this.remittanceAmount)
        const driverShare = amount * 0.8
        const adminShare = amount * 0.2

        let receiptUrl = null
        if (this.paymentReceipt && this.paymentReceipt.file) {
          try {
            this.toast.info('Uploading payment receipt...')
            
            const timestamp = Date.now()
            const filename = `${timestamp}_${this.paymentReceipt.name}`
            const fileRef = storageRef(storage, `remittance-receipts/${user.uid}/${filename}`)
            
            const uploadTask = uploadBytesResumable(fileRef, this.paymentReceipt.file)
            
            await new Promise((resolve, reject) => {
              uploadTask.on('state_changed',
                (snapshot) => {
                  const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                  console.log('[v0] Upload progress:', progress + '%')
                },
                (error) => {
                  console.error('[v0] Upload error:', error)
                  reject(error)
                },
                async () => {
                  receiptUrl = await getDownloadURL(uploadTask.snapshot.ref)
                  console.log('[v0] Receipt uploaded successfully')
                  resolve()
                }
              )
            })
          } catch (error) {
            console.error('[v0] Error uploading receipt:', error)
            this.toast.error('Failed to upload receipt. Please check file size and try again.')
            this.isSubmitting = false
            return
          }
        }

        this.toast.info('Submitting remittance...')

        const remittanceData = {
          driverId: user.uid,
          driverName: this.authStore.userProfile?.fullName || 'Driver',
          amount: amount,
          driverShare: driverShare,
          adminShare: adminShare,
          paymentMethod: this.paymentMethod,
          receiptUrl: receiptUrl,
          notes: this.notes,
          date: new Date(),
          status: 'pending',
          createdAt: new Date()
        }

        const remittanceRef = await addDoc(collection(db, 'remittances'), remittanceData)
        console.log('[v0] Remittance created:', remittanceRef.id)

        const driverRef = doc(db, 'drivers', user.uid)
        const today = new Date().toDateString()
        
        await updateDoc(driverRef, {
          totalEarningsToday: this.driverStore.totalEarningsToday + driverShare,
          lastRemitDate: today,
          lastRemitAmount: amount,
          hasRemitted: true,
          [`remittances.${today}`]: {
            amount: amount,
            driverShare: driverShare,
            adminShare: adminShare,
            timestamp: new Date()
          }
        })

        this.toast.success('Remittance submitted successfully! Your earnings will be credited once the admin verifies the payment receipt.')
        
        await this.driverStore.loadEarningsData()
        await this.setupCompletedDeliveriesListener()
        await this.loadRemittanceHistory()
        this.resetForm()

      } catch (error) {
        console.error('[v0] Error submitting remittance:', error)
        this.toast.error('Failed to submit remittance. ' + (error.message || 'Please try again.'))
      } finally {
        this.isSubmitting = false
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
      const methods = {
        'gcash': 'GCash',
        'paymaya': 'PayMaya',
        'bank_transfer': 'Bank Transfer',
        'direct_cash': 'Direct Cash'
      }
      return methods[method] || method
    },

    resetForm() {
      this.remittanceAmount = ''
      this.paymentMethod = ''
      this.paymentReceipt = null
      this.notes = ''
    }
  }
}
</script>
