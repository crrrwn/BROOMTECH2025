<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Upload Payment</h1>
      <p class="text-gray-600">Upload proof of payment for your completed orders</p>
    </div>

    <!-- Order Selection -->
    <div class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Order</h2>
      <select v-model="selectedOrderId" @change="loadOrderDetails"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
        <option value="">Select an order to upload payment</option>
        <option v-for="order in deliveredOrders" :key="order.id" :value="order.id">
          #{{ order.id }} - {{ order.serviceName }} - ₱{{ order.priceEstimate?.total }}
        </option>
      </select>
    </div>

    <!-- Order Details -->
    <div v-if="selectedOrder" class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">Service</p>
          <p class="font-medium text-gray-900">{{ selectedOrder.serviceName }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Total Amount</p>
          <p class="font-medium text-gray-900">₱{{ selectedOrder.priceEstimate?.total }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Order Date</p>
          <p class="font-medium text-gray-900">{{ formatDate(selectedOrder.createdAt) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Status</p>
          <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            {{ formatStatus(selectedOrder.status) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Payment Upload Form -->
    <div v-if="selectedOrder" class="bg-white p-6 rounded-lg shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Upload Payment Proof</h2>
      <form @submit.prevent="uploadPayment" class="space-y-4">
        <!-- Payment Method -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select v-model="paymentForm.method" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">Select payment method</option>
            <option value="gcash">GCash</option>
            <option value="paymaya">PayMaya</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash Payment</option>
          </select>
        </div>

        <!-- Reference Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
          <input type="text" v-model="paymentForm.referenceNumber" 
                 placeholder="Enter transaction reference number"
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
        </div>

        <!-- Payment Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
          <input type="number" v-model="paymentForm.amount" step="0.01" required
                 :placeholder="selectedOrder.priceEstimate?.total"
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Upload Receipt/Screenshot</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" 
                         @change="handleFileUpload" accept="image/*,.pdf">
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
          <div v-if="selectedFile" class="mt-2 p-2 bg-green-50 rounded-lg">
            <p class="text-sm text-green-800">Selected: {{ selectedFile.name }}</p>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea v-model="paymentForm.notes" rows="3" 
                    placeholder="Any additional information about the payment..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex space-x-4">
          <button type="button" @click="clearForm" 
                  class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Clear
          </button>
          <button type="submit" :disabled="uploading || !selectedFile" 
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            {{ uploading ? 'Uploading...' : 'Upload Payment' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { db } from '@/firebase/config'
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export default {
  name: 'UploadPayment',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      deliveredOrders: [],
      selectedOrderId: '',
      selectedOrder: null,
      selectedFile: null,
      uploading: false,
      paymentForm: {
        method: '',
        referenceNumber: '',
        amount: '',
        notes: ''
      }
    }
  },
  async mounted() {
    await this.loadDeliveredOrders()
    
    // Check if order ID is passed via route params
    if (this.$route.params.orderId) {
      this.selectedOrderId = this.$route.params.orderId
      this.loadOrderDetails()
    }
  },
  methods: {
    async loadDeliveredOrders() {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', this.authStore.user.uid),
          where('status', '==', 'delivered')
        )
        
        const querySnapshot = await getDocs(q)
        this.deliveredOrders = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(order => !order.paymentProof) // Only orders without payment proof
      } catch (error) {
        console.error('Error loading delivered orders:', error)
      }
    },

    loadOrderDetails() {
      if (this.selectedOrderId) {
        this.selectedOrder = this.deliveredOrders.find(order => order.id === this.selectedOrderId)
        if (this.selectedOrder) {
          this.paymentForm.amount = this.selectedOrder.priceEstimate?.total || ''
        }
      } else {
        this.selectedOrder = null
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB')
          return
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
          alert('Only JPG, PNG, and PDF files are allowed')
          return
        }
        
        this.selectedFile = file
      }
    },

    async uploadPayment() {
      if (!this.selectedFile || !this.selectedOrder) return

      this.uploading = true
      try {
        // In a real app, you would upload the file to Firebase Storage
        // For now, we'll simulate the upload and store the payment info
        
        const paymentData = {
          method: this.paymentForm.method,
          referenceNumber: this.paymentForm.referenceNumber,
          amount: parseFloat(this.paymentForm.amount),
          notes: this.paymentForm.notes,
          fileName: this.selectedFile.name,
          fileSize: this.selectedFile.size,
          uploadedAt: serverTimestamp(),
          status: 'pending_verification'
        }

        // Update the order with payment proof
        const orderRef = doc(db, 'orders', this.selectedOrder.id)
        await updateDoc(orderRef, {
          paymentProof: paymentData,
          updatedAt: serverTimestamp()
        })

        alert('Payment proof uploaded successfully! It will be verified within 24 hours.')
        
        // Clear form and redirect
        this.clearForm()
        this.$router.push('/user/orders')
        
      } catch (error) {
        console.error('Error uploading payment:', error)
        alert('Error uploading payment proof. Please try again.')
      } finally {
        this.uploading = false
      }
    },

    clearForm() {
      this.selectedOrderId = ''
      this.selectedOrder = null
      this.selectedFile = null
      this.paymentForm = {
        method: '',
        referenceNumber: '',
        amount: '',
        notes: ''
      }
      
      // Clear file input
      const fileInput = document.getElementById('file-upload')
      if (fileInput) fileInput.value = ''
    },

    formatDate(timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatStatus(status) {
      const statusMap = {
        'delivered': 'Delivered',
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in_transit': 'In Transit',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    }
  }
}
</script>
