<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Upload Proof of Delivery</h1>
      <p class="text-gray-600">Upload photos and details to confirm delivery completion</p>
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
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Proof of Delivery</h2>
      
      <form @submit.prevent="submitProof" class="space-y-6">
        <!-- Photo Upload -->
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
            placeholder="Add any notes about the delivery (optional)"
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
            Submit Proof of Delivery
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
      <h3 class="font-medium text-blue-900 mb-2">Photo Guidelines:</h3>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• Take clear photos of the delivered items</li>
        <li>• Include the delivery location/address if visible</li>
        <li>• Ensure good lighting and focus</li>
        <li>• Multiple angles are recommended</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const selectedOrderId = ref(null)
const uploadedPhotos = ref([])
const deliveryNotes = ref('')
const recipientName = ref('')
const deliveryTime = ref('')

const deliveredOrders = ref([
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
])

const canSubmit = computed(() => {
  return selectedOrderId.value && uploadedPhotos.value.length > 0
})

const handlePhotoUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedPhotos.value.push({
        file: file,
        preview: e.target.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  })
  
  // Reset input
  event.target.value = ''
}

const removePhoto = (index) => {
  uploadedPhotos.value.splice(index, 1)
}

const submitProof = async () => {
  try {
    // In a real app, this would upload photos and submit to server
    const selectedOrder = deliveredOrders.value.find(order => order.id === selectedOrderId.value)
    
    toast.success(`Proof of delivery submitted for ${selectedOrder.title}!`)
    
    // Reset form
    resetForm()
    
    // Navigate back or to assignments page
    // router.push('/driver/assignments')
    
  } catch (error) {
    toast.error('Failed to submit proof of delivery. Please try again.')
  }
}

const resetForm = () => {
  selectedOrderId.value = null
  uploadedPhotos.value = []
  deliveryNotes.value = ''
  recipientName.value = ''
  deliveryTime.value = ''
}

// Set current time as default
const now = new Date()
deliveryTime.value = now.toISOString().slice(0, 16)
</script>
