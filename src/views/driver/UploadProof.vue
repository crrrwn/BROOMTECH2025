<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Upload Proof & Payment</h1>
      <p class="text-gray-600">Upload delivery proof and handle payment confirmation</p>
    </div>

    <!-- Order Selection -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Order</h2>
      <div class="space-y-3">
        <div v-for="order in deliveredOrders" :key="order.id" class="flex items-center space-x-3">
          <input 
            type="radio" 
            :id="`order-${order.id}`" 
            :value="order.id" 
            v-model="selectedOrderId"
            class="w-4 h-4 text-primary focus:ring-primary border-gray-300"
          >
          <label :for="`order-${order.id}`" class="flex-1 cursor-pointer">
            <div class="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <p class="font-medium text-gray-900">{{ order.title }}</p>
                <p class="text-sm text-gray-500">{{ order.customer }} • {{ order.dropoff }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary">₱{{ order.amount }}</p>
                <p class="text-xs text-gray-500">{{ order.deliveredTime }}</p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Upload Form -->
    <div v-if="selectedOrderId" class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Delivery & Payment Proof</h2>
      
      <form @submit.prevent="submitProof" class="space-y-6">
        <!-- Payment Information -->
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 class="text-md font-semibold text-blue-900 mb-3">💰 Payment Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Total Amount Paid <span class="text-red-500">*</span>
              </label>
              <input 
                type="number"
                v-model="paymentAmount"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter total amount paid by customer"
              >
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
                <option value="cash">Cash on Delivery</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Payment Receipt Photo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Payment Receipt Photo <span class="text-red-500">*</span>
          </label>
          <p class="text-sm text-gray-600 mb-3">
            Take a photo of the customer's payment receipt (GCash screenshot, cash receipt, etc.)
          </p>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input 
              type="file" 
              ref="paymentPhotoInput"
              @change="handlePaymentPhotoUpload"
              accept="image/*"
              class="hidden"
            >
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-gray-600 mb-2">Click to upload payment receipt photo</p>
            <p class="text-sm text-gray-500">PNG, JPG up to 10MB</p>
            <button 
              type="button"
              @click="$refs.paymentPhotoInput.click()"
              class="mt-3 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Choose Payment Photo
            </button>
          </div>
          
          <!-- Preview payment photo -->
          <div v-if="paymentPhoto" class="mt-4">
            <div class="relative inline-block">
              <img :src="paymentPhoto.preview" alt="Payment Receipt" class="w-32 h-32 object-cover rounded-lg border">
              <button 
                type="button"
                @click="removePaymentPhoto"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Delivery Photos -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Delivery Photos <span class="text-red-500">*</span>
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input 
              type="file" 
              ref="photoInput"
              @change="handlePhotoUpload"
              multiple 
              accept="image/*"
              class="hidden"
            >
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-gray-600 mb-2">Click to upload delivery photos</p>
            <p class="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
            <button 
              type="button"
              @click="$refs.photoInput.click()"
              class="mt-3 bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Choose Photos
            </button>
          </div>
          
          <!-- Preview uploaded photos -->
          <div v-if="uploadedPhotos.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(photo, index) in uploadedPhotos" :key="index" class="relative">
              <img :src="photo.preview" :alt="`Photo ${index + 1}`" class="w-full h-24 object-cover rounded-lg">
              <button 
                type="button"
                @click="removePhoto(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Delivery Notes -->
        <div>
          <label for="deliveryNotes" class="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes
          </label>
          <textarea 
            id="deliveryNotes"
            v-model="deliveryNotes"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Add any notes about the delivery and payment process..."
          ></textarea>
        </div>

        <!-- Recipient Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="recipientName" class="block text-sm font-medium text-gray-700 mb-2">
              Received By
            </label>
            <input 
              type="text"
              id="recipientName"
              v-model="recipientName"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Name of person who received"
            >
          </div>
          
          <div>
            <label for="deliveryTime" class="block text-sm font-medium text-gray-700 mb-2">
              Delivery Time
            </label>
            <input 
              type="datetime-local"
              id="deliveryTime"
              v-model="deliveryTime"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            >
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex space-x-4">
          <button 
            type="submit"
            :disabled="!canSubmit"
            class="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Submit Delivery & Payment Proof
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

    <!-- Instructions -->
    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h3 class="font-medium text-blue-900 mb-2">Instructions:</h3>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• Take a clear photo of the customer's payment receipt (GCash screenshot, etc.)</li>
        <li>• Set the correct total amount that the customer paid</li>
        <li>• Take photos of the delivered items at the delivery location</li>
        <li>• Ensure good lighting and focus for all photos</li>
        <li>• Once submitted, the order will automatically be marked as paid</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadProof',
  data() {
    return {
      selectedOrderId: null,
      uploadedPhotos: [],
      deliveryNotes: '',
      recipientName: '',
      deliveryTime: '',
      paymentAmount: '',
      paymentMethod: '',
      paymentPhoto: null,
      deliveredOrders: [
        {
          id: 1,
          title: 'Food Delivery',
          customer: 'Maria Santos',
          dropoff: 'Barangay Guinobatan, Calapan City',
          amount: 85,
          deliveredTime: '2 hours ago'
        },
        {
          id: 2,
          title: 'Grocery Shopping',
          customer: 'Juan Dela Cruz',
          dropoff: 'Barangay Mahal na Pangalan, Calapan City',
          amount: 120,
          deliveredTime: '3 hours ago'
        },
        {
          id: 3,
          title: 'Document Delivery',
          customer: 'Ana Reyes',
          dropoff: 'Barangay San Vicente, Calapan City',
          amount: 75,
          deliveredTime: '4 hours ago'
        }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.selectedOrderId && 
             this.uploadedPhotos.length > 0 && 
             this.paymentPhoto && 
             this.paymentAmount && 
             this.paymentMethod
    }
  },
  mounted() {
    // Set current time as default
    const now = new Date()
    this.deliveryTime = now.toISOString().slice(0, 16)
  },
  methods: {
    handlePaymentPhotoUpload(event) {
      const file = event.target.files[0]
      
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('Payment photo is too large. Maximum size is 10MB.')
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          this.paymentPhoto = {
            file: file,
            preview: e.target.result,
            name: file.name
          }
        }
        reader.readAsDataURL(file)
      }
      
      event.target.value = ''
    },

    removePaymentPhoto() {
      this.paymentPhoto = null
    },

    handlePhotoUpload(event) {
      const files = Array.from(event.target.files)
      
      files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`)
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          this.uploadedPhotos.push({
            file: file,
            preview: e.target.result,
            name: file.name
          })
        }
        reader.readAsDataURL(file)
      })
      
      event.target.value = ''
    },

    removePhoto(index) {
      this.uploadedPhotos.splice(index, 1)
    },

    async submitProof() {
      try {
        const selectedOrder = this.deliveredOrders.find(order => order.id === this.selectedOrderId)
        
        const proofData = {
          orderId: this.selectedOrderId,
          deliveryPhotos: this.uploadedPhotos,
          paymentPhoto: this.paymentPhoto,
          paymentAmount: parseFloat(this.paymentAmount),
          paymentMethod: this.paymentMethod,
          deliveryNotes: this.deliveryNotes,
          recipientName: this.recipientName,
          deliveryTime: this.deliveryTime,
          submittedAt: new Date().toISOString()
        }
        
        alert(`Delivery and payment proof submitted for ${selectedOrder.title}! Order automatically marked as paid.`)
        
        this.resetForm()
        
      } catch (error) {
        alert('Failed to submit proof. Please try again.')
      }
    },

    resetForm() {
      this.selectedOrderId = null
      this.uploadedPhotos = []
      this.paymentPhoto = null
      this.paymentAmount = ''
      this.paymentMethod = ''
      this.deliveryNotes = ''
      this.recipientName = ''
      this.deliveryTime = ''
      
      // Reset current time
      const now = new Date()
      this.deliveryTime = now.toISOString().slice(0, 16)
    }
  }
}
</script>
