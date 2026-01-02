<template>
  <!-- Notification Modal - Outside main modal to ensure proper z-index -->
  <div v-if="showNotificationModal" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" @click.self="closeNotificationModal">
    <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 border border-gray-100" @click.stop>
      <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
           :class="notificationType === 'success' ? 'bg-green-100 text-green-500' : notificationType === 'error' ? 'bg-red-100 text-red-500' : notificationType === 'warning' ? 'bg-yellow-100 text-yellow-500' : 'bg-blue-100 text-blue-500'">
        <svg v-if="notificationType === 'success'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        <svg v-else-if="notificationType === 'error'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
        <svg v-else-if="notificationType === 'warning'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      
      <h3 class="text-xl font-black text-gray-900 mb-2">
        {{ notificationType === 'success' ? 'Success!' : notificationType === 'error' ? 'Error!' : notificationType === 'warning' ? 'Warning!' : 'Notice' }}
      </h3>
      <p class="text-gray-600 mb-6 font-medium leading-relaxed">{{ notificationMessage }}</p>
      
      <button @click="closeNotificationModal"
              :class="[
                'w-full py-3 rounded-xl font-bold transition-colors cursor-pointer',
                notificationType === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 
                notificationType === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 
                notificationType === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                'bg-blue-600 text-white hover:bg-blue-700'
              ]">
        OK
      </button>
    </div>
  </div>

  <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="closeModal">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 relative z-0" @click.stop>
      <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#74E600] to-[#00C851] relative z-10">
        <div class="text-white">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Another Order
          </h2>
          <p class="text-sm text-[#e6ffcc] mt-1">Assign to your current driver: <strong>{{ driverName }}</strong></p>
        </div>
        <button @click.stop="closeModal" type="button" data-close-btn class="relative z-20 text-white hover:bg-white/20 p-2 rounded-lg transition cursor-pointer pointer-events-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto relative">
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4">Select Service Type</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="service in services"
              :key="service.id"
              type="button"
              :data-service-id="service.id"
              @click.stop="selectService(service.id)"
              :class="[
                'p-4 rounded-xl border-2 transition-all text-left relative z-0 cursor-pointer',
                selectedServiceType === service.id
                  ? 'border-[#3ED400] bg-[#f9fff0]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              ]"
            >
              <p class="font-bold text-sm text-gray-800">{{ service.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ service.description }}</p>
            </button>
          </div>
        </div>

        <form v-if="selectedServiceType" data-order-form @submit.prevent="submitAddOrder" class="space-y-6">
          <template v-if="selectedServiceType === 'food-delivery'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name *</label>
                <input v-model.trim="formData.restaurantName" type="text" placeholder="e.g., Jollibee" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Restaurant Address *</label>
                <input ref="restaurantAddressInput" v-model.trim="formData.restaurantAddress" type="text" placeholder="Location of the restaurant" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">What to Buy? *</label>
                <textarea v-model.trim="formData.foodOrderDetails" placeholder="e.g., 2pcs Fried Chicken, 1 Family Bundle..." rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Budget Range *</label>
                  <select v-model="formData.budgetRange" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required>
                    <option value="">Select Range</option>
                    <option value="P1-P499">₱1 - ₱499</option>
                    <option value="P500-P999">₱500 - ₱999</option>
                    <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                    <option value="P2000+">₱2,000+</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
                  <input v-model.trim="formData.specialInstructions" type="text" placeholder="No onions, extra sauce" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <input ref="deliveryAddressInput" v-model.trim="formData.deliveryAddress" type="text" placeholder="Where should the order be delivered?" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
            </div>
          </template>

          <template v-else-if="selectedServiceType === 'bill-payments'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Biller Name *</label>
                <input ref="billerNameInput" v-model.trim="formData.billerName" type="text" placeholder="e.g., Meralco" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Account Number *</label>
                <input v-model.trim="formData.accountNumber" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Amount to Pay *</label>
                  <input v-model.trim="formData.amountToPay" type="number" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input v-model="formData.dueDate" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Pickup Address *</label>
                <input ref="pickupAddressInput" v-model.trim="formData.pickupAddress" type="text" placeholder="Where to pickup the bill?" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Return/Delivery Address *</label>
                <input ref="returnAddressInput" v-model.trim="formData.returnAddress" type="text" placeholder="Where should the payment slip be delivered?" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              
              <!-- Bill Receipt Upload -->
              <div class="bg-white p-5 rounded-2xl border-2 border-dashed hover:border-[#3ED400] hover:bg-green-50/30 transition-all text-center" :class="(!formData.billReceiptUrl && !uploadingBillReceipt) ? 'border-gray-300' : 'border-[#3ED400]'">
                <label class="cursor-pointer block">
                  <span class="block text-sm font-bold text-gray-600 mb-2">Upload Bill Receipt / Reference *</span>
                  <input type="file" accept="image/*,.pdf" @change="handleBillReceiptSelect" class="hidden"/>
                  <span class="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-[#3ED400] hover:text-white transition-colors">Choose File</span>
                </label>
                <div v-if="uploadingBillReceipt" class="mt-3 h-1 w-1/2 mx-auto bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-[#3ED400] transition-all duration-300" :style="{ width: billReceiptProgress + '%' }"></div>
                </div>
                <p v-if="formData.billReceiptUrl" class="mt-2 text-xs text-green-600 font-bold">✓ Uploaded Successfully</p>
                <p v-if="selectedServiceType === 'bill-payments' && !formData.billReceiptUrl && !uploadingBillReceipt" class="text-red-500 text-xs mt-2">Receipt is required</p>
              </div>
            </div>
          </template>

          <template v-else-if="selectedServiceType === 'grocery-shopping'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Store Name *</label>
                <input ref="storePreferenceInput" v-model.trim="formData.storePreference" type="text" placeholder="e.g., SM Hypermarket" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Shopping List *</label>
                <textarea v-model.trim="formData.shoppingList" placeholder="Items to buy" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Budget Range *</label>
                <select v-model="formData.budgetRange" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required>
                  <option value="">Select Range</option>
                  <option value="P1-P499">₱1 - ₱499</option>
                  <option value="P500-P999">₱500 - ₱999</option>
                  <option value="P1000-P1500">₱1,000 - ₱1,500</option>
                  <option value="P2000+">₱2,000+</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <input ref="deliveryAddressInput" v-model.trim="formData.deliveryAddress" type="text" placeholder="Delivery location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
            </div>
          </template>

          <template v-else-if="selectedServiceType === 'gift-delivery'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Gift Type *</label>
                <input v-model.trim="formData.giftType" type="text" placeholder="e.g., Flowers, Cake, etc." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Store Name *</label>
                <input ref="storeNameInput" v-model.trim="formData.storeName" type="text" placeholder="Where to buy the gift" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Store Address</label>
                <input ref="storeAddressInput" v-model.trim="formData.storeAddress" type="text" placeholder="Store location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Receiver Name *</label>
                <input v-model.trim="formData.receiverName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Receiver Contact *</label>
                <input v-model.trim="formData.receiverContact" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <input ref="deliveryAddressInput" v-model.trim="formData.deliveryAddress" type="text" placeholder="Gift delivery location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
            </div>
          </template>

          <template v-else-if="selectedServiceType === 'medicine-delivery'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Medicine Names *</label>
                <textarea v-model.trim="formData.medicineNames" placeholder="List of medicines needed" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                <input v-model.trim="formData.quantity" type="text" placeholder="Quantity of each" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <input ref="deliveryAddressInput" v-model.trim="formData.deliveryAddress" type="text" placeholder="Medicine delivery location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
            </div>
          </template>

          <template v-else-if="selectedServiceType === 'pickup-drop'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Item Description *</label>
                <textarea v-model.trim="formData.itemDescription" placeholder="What item to pickup?" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Pickup Address *</label>
                <input ref="pickupAddressInput" v-model.trim="formData.pickupAddress" type="text" placeholder="Where to pick up" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
                <input ref="dropoffAddressInput" v-model.trim="formData.dropoffAddress" type="text" placeholder="Where to drop off" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required />
              </div>
            </div>
          </template>

          <div class="border-t pt-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Payment Method *</label>
            <select v-model="formData.paymentMethod" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3ED400] outline-none" required>
              <option value="">Select Payment Method</option>
              <option value="GCASH">GCash</option>
              <option value="COD">Cash on Delivery (COD)</option>
            </select>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800">Estimated Cost (Fixed Rate):</span>
              <span class="text-2xl font-extrabold text-[#3ED400]">₱{{ estimatedCost }}</span>
            </div>
            <p class="text-xs text-gray-600 mt-2">Based on fixed rates from admin pricing panel. Final cost will be confirmed by your driver.</p>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button type="button" @click="closeModal" class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition">
              Cancel
            </button>
            <button type="submit" :disabled="submitting || !selectedServiceType || (selectedServiceType === 'bill-payments' && !formData.billReceiptUrl)" class="flex-1 px-4 py-3 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition">
              {{ submitting ? 'Adding Order...' : 'Add Order to Driver' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc, arrayUnion, increment, serverTimestamp, getDoc } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AddAnotherOrderModal',
  props: {
    showModal: { type: Boolean, default: false },
    orderId: { type: String, default: '' },
    driverId: { type: String, default: '' },
    driverName: { type: String, default: 'Driver' }
  },
  emits: ['close', 'order-added'],
  data() {
    return {
      selectedServiceType: '',
      submitting: false,
      estimatedCost: '54.00',
      mapsReady: false,
      autocompleteInstances: {},
      uploadingBillReceipt: false,
      billReceiptProgress: 0,
      showNotificationModal: false,
      notificationType: 'success',
      notificationMessage: '',
      services: [
        { id: 'food-delivery', name: 'Food Delivery', description: 'Order from a restaurant' },
        { id: 'bill-payments', name: 'Bill Payments', description: 'Pay bills' },
        { id: 'grocery-shopping', name: 'Grocery Shopping', description: 'Shop for groceries' },
        { id: 'gift-delivery', name: 'Gift Delivery', description: 'Deliver gifts' },
        { id: 'medicine-delivery', name: 'Medicine Delivery', description: 'Buy medicines' },
        { id: 'pickup-drop', name: 'Pick-up & Drop', description: 'Pickup and delivery' }
      ],
      formData: {
        restaurantName: '',
        restaurantAddress: '',
        foodOrderDetails: '',
        specialInstructions: '',
        budgetRange: '',
        billerName: '',
        accountName: '',
        accountNumber: '',
        amountToPay: '',
        dueDate: '',
        pickupAddress: '',
        returnAddress: '',
        shoppingList: '',
        storePreference: '',
        giftType: '',
        storeName: '',
        storeAddress: '',
        medicineNames: '',
        prescriptionFile: null,
        quantity: '',
        itemDescription: '',
        itemType: '',
        dropoffAddress: '',
        receiverName: '',
        receiverContact: '',
        deliveryAddress: '',
        landmark: '',
        preferredTime: '',
        paymentMethod: 'COD',
        billReceiptUrl: '',
        billReceiptFile: null
      }
    }
  },
  setup() {
    const authStore = useAuthStore()
    const user = authStore.user
    return { user }
  },
  watch: {
    showModal(newVal) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7ded834a-4328-423f-b9a0-78cdb4c22692',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AddAnotherOrderModal.vue:watch:showModal',message:'Modal visibility changed',data:{showModal:newVal,selectedServiceType:this.selectedServiceType},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      if (newVal) {
        this.$nextTick(() => {
          this.loadGoogleMapsAPI()
        })
      } else {
        // Clean up autocomplete instances
        Object.values(this.autocompleteInstances).forEach(instance => {
          if (instance && instance.set('place', null)) {
            // Clear autocomplete
          }
        })
        this.autocompleteInstances = {}
      }
    },
    selectedServiceType(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          // Ensure maps are loaded first
          if (!this.mapsReady) {
            this.loadGoogleMapsAPI()
          }
          // Initialize autocomplete after a short delay to ensure DOM is ready
          setTimeout(() => {
            this.initializeAutocomplete()
            this.fetchPricing()
          }, 300)
        })
      }
    }
  },
  methods: {
    closeModal() {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7ded834a-4328-423f-b9a0-78cdb4c22692',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AddAnotherOrderModal.vue:closeModal',message:'X button clicked',data:{showModal:this.showModal,selectedServiceType:this.selectedServiceType},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      this.$emit('close')
    },
    selectService(serviceId) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7ded834a-4328-423f-b9a0-78cdb4c22692',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AddAnotherOrderModal.vue:selectService',message:'Service button clicked',data:{serviceId,previousServiceType:this.selectedServiceType,showModal:this.showModal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      // Allow changing service type
      this.selectedServiceType = serviceId
      this.$nextTick(() => {
        // #region agent log
        const serviceBtn = document.querySelector(`[data-service-id="${serviceId}"]`)
        const xBtn = document.querySelector('[data-close-btn]')
        const form = document.querySelector('[data-order-form]')
        const computedStyle = serviceBtn ? window.getComputedStyle(serviceBtn) : null
        fetch('http://127.0.0.1:7242/ingest/7ded834a-4328-423f-b9a0-78cdb4c22692',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AddAnotherOrderModal.vue:selectService:after',message:'DOM state after service selection',data:{serviceBtnExists:!!serviceBtn,xBtnExists:!!xBtn,formExists:!!form,pointerEvents:computedStyle?.pointerEvents,zIndex:computedStyle?.zIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Initialize autocomplete when service type changes
        if (this.mapsReady) {
          setTimeout(() => {
            this.initializeAutocomplete()
            this.fetchPricing()
          }, 100)
        } else {
          this.loadGoogleMapsAPI()
        }
      })
    },
    loadGoogleMapsAPI() {
      // Check if already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        this.mapsReady = true
        if (this.selectedServiceType) {
          this.$nextTick(() => {
            this.initializeAutocomplete()
            this.fetchPricing()
          })
        }
        return
      }
      
      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        // Wait for existing script to load
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            clearInterval(checkInterval)
            this.mapsReady = true
            if (this.selectedServiceType) {
              this.$nextTick(() => {
                this.initializeAutocomplete()
                this.fetchPricing()
              })
            }
          }
        }, 100)
        // Timeout after 10 seconds
        setTimeout(() => clearInterval(checkInterval), 10000)
        return
      }
      
      const script = document.createElement('script')
      script.id = 'gmaps-script-add-order'
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o&libraries=places&v=weekly&loading=async`
      script.async = true
      script.defer = true
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        // Retry after 2 seconds
        setTimeout(() => {
          const retryScript = document.getElementById('gmaps-script-add-order')
          if (retryScript) {
            retryScript.remove()
          }
          this.loadGoogleMapsAPI()
        }, 2000)
      }
      
      script.onload = () => {
        // Double check that Google Maps is actually loaded
        const checkGoogle = () => {
          if (window.google && window.google.maps && window.google.maps.places) {
            this.mapsReady = true
            if (this.selectedServiceType) {
              this.$nextTick(() => {
                this.initializeAutocomplete()
                this.fetchPricing()
              })
            }
          } else {
            // Retry check after 100ms
            setTimeout(checkGoogle, 100)
          }
        }
        checkGoogle()
      }
      
      document.head.appendChild(script)
    },
    initializeAutocomplete() {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7ded834a-4328-423f-b9a0-78cdb4c22692',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AddAnotherOrderModal.vue:initializeAutocomplete',message:'Autocomplete initialization start',data:{mapsReady:this.mapsReady,hasGoogle:!!window.google,hasPlaces:!!(window.google?.maps?.places),selectedServiceType:this.selectedServiceType},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      if (!this.mapsReady || !window.google || !window.google.maps || !window.google.maps.places) {
        // Retry if API not ready yet
        if (this.showModal && this.selectedServiceType) {
          setTimeout(() => this.initializeAutocomplete(), 500)
        }
        return
      }
      
      const calapanBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(13.3000, 121.0800),
        new window.google.maps.LatLng(13.4500, 121.2500)
      )

      // Map of ref keys to formData keys
      const addressFields = {
        'restaurantAddressInput': { formKey: 'restaurantAddress', type: ['establishment', 'geocode'] },
        'deliveryAddressInput': { formKey: 'deliveryAddress', type: ['establishment', 'geocode'] },
        'pickupAddressInput': { formKey: 'pickupAddress', type: ['establishment', 'geocode'] },
        'returnAddressInput': { formKey: 'returnAddress', type: ['establishment', 'geocode'] },
        'storePreferenceInput': { formKey: 'storePreference', type: ['establishment'] },
        'billerNameInput': { formKey: 'billerName', type: ['establishment'] },
        'storeNameInput': { formKey: 'storeName', type: ['establishment'] },
        'storeAddressInput': { formKey: 'storeAddress', type: ['establishment', 'geocode'] },
        'dropoffAddressInput': { formKey: 'dropoffAddress', type: ['establishment', 'geocode'] }
      }

      Object.keys(addressFields).forEach(refKey => {
        const input = this.$refs[refKey]
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/7ded834a-4328-423f-b9a0-78cdb4c22692',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AddAnotherOrderModal.vue:initializeAutocomplete:field',message:'Checking address field',data:{refKey,inputExists:!!input},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        if (!input) {
          // Input not available yet, might need to wait
          return
        }

        // Remove existing autocomplete if any
        if (this.autocompleteInstances[refKey]) {
          window.google.maps.event.clearInstanceListeners(this.autocompleteInstances[refKey])
          delete this.autocompleteInstances[refKey]
        }

        const fieldConfig = addressFields[refKey]
        const acOptions = {
          componentRestrictions: { country: 'ph' },
          fields: ['place_id', 'geometry', 'name', 'formatted_address', 'types'],
          bounds: calapanBounds,
          strictBounds: true,
          types: fieldConfig.type
        }

        try {
          const ac = new window.google.maps.places.Autocomplete(input, acOptions)
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/7ded834a-4328-423f-b9a0-78cdb4c22692',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AddAnotherOrderModal.vue:initializeAutocomplete:created',message:'Autocomplete created for field',data:{refKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          // #endregion

          ac.addListener('place_changed', () => {
            const place = ac.getPlace()
            if (!place.geometry) return

            // Validation
            if (!calapanBounds.contains(place.geometry.location)) {
              this.showNotification('warning', 'Please select a location within Calapan City area only.')
              input.value = ''
              return
            }
            const address = (place.formatted_address || '').toLowerCase()
            if (!address.includes('calapan') && !address.includes('oriental mindoro')) {
              this.showNotification('warning', 'Please select a location within Calapan City area only.')
              input.value = ''
              return
            }

            let addr = place.formatted_address
            if (place.name && place.types && place.types.includes('establishment')) {
              addr = `${place.name}, ${place.formatted_address}`
            }
            input.value = addr
            this.formData[fieldConfig.formKey] = addr

            // Special handling for restaurant name
            if (refKey === 'restaurantAddressInput' && place.name && (!this.formData.restaurantName || this.formData.restaurantName.length < 3)) {
              this.formData.restaurantName = place.name
            }
            
            // Update pricing when address changes
            this.fetchPricing()
          })

          this.autocompleteInstances[refKey] = ac
        } catch (error) {
          console.error(`Error initializing autocomplete for ${refKey}:`, error)
        }
      })
      
      // Retry for any missing inputs after a short delay
      this.$nextTick(() => {
        const missingFields = Object.keys(addressFields).filter(refKey => {
          return !this.autocompleteInstances[refKey] && this.$refs[refKey]
        })
        if (missingFields.length > 0 && this.showModal && this.selectedServiceType) {
          setTimeout(() => this.initializeAutocomplete(), 300)
        }
      })
    },
    async fetchPricing() {
      try {
        const pricingDoc = await getDoc(doc(db, 'settings', 'pricing'))
        if (pricingDoc.exists()) {
          const data = pricingDoc.data()
          const pricingRules = data.pricingRules || {}
          const locationRates = data.locationRates || []
          
          // Use base fee as default
          let basePrice = pricingRules.baseFee || 54
          
          // Try to match location rates if we have addresses
          const deliveryAddr = this.formData.deliveryAddress || this.formData.returnAddress || this.formData.dropoffAddress
          if (deliveryAddr && locationRates.length > 0) {
            const addrLower = deliveryAddr.toLowerCase()
            const matchedRate = locationRates.find(rate => {
              const barangayMatch = rate.barangay && addrLower.includes(rate.barangay.toLowerCase())
              const landmarkMatch = rate.landmark && addrLower.includes(rate.landmark.toLowerCase())
              return barangayMatch || landmarkMatch
            })
            
            if (matchedRate) {
              basePrice = matchedRate.price
            }
          }
          
          this.estimatedCost = basePrice.toFixed(2)
        }
      } catch (error) {
        console.error('Error fetching pricing:', error)
        // Keep default estimated cost
      }
    },
    showNotification(type, message) {
      this.notificationType = type
      this.notificationMessage = message
      this.showNotificationModal = true
    },
    closeNotificationModal() {
      this.showNotificationModal = false
      this.notificationMessage = ''
    },
    async handleBillReceiptSelect(e) {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('warning', 'Max 5MB only')
        return
      }
      this.formData.billReceiptFile = file
      if (this.user?.uid) {
        await this.uploadBillReceipt(file, this.user.uid)
      }
    },
    uploadBillReceipt(file, uid) {
      return new Promise((resolve, reject) => {
        this.uploadingBillReceipt = true
        this.billReceiptProgress = 0
        const storage = getStorage()
        const ref = storageRef(storage, `billReceipts/${uid}/${Date.now()}_${file.name}`)
        const task = uploadBytesResumable(ref, file)
        task.on('state_changed',
          (snap) => {
            this.billReceiptProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          },
          (err) => {
            this.uploadingBillReceipt = false
            this.showNotification('error', 'Upload failed. Please try again.')
            reject(err)
          },
          async () => {
            this.uploadingBillReceipt = false
            const url = await getDownloadURL(task.snapshot.ref)
            this.formData.billReceiptUrl = url
            this.showNotification('success', 'Receipt uploaded successfully!')
            resolve(url)
          }
        )
      })
    },
    async submitAddOrder() {
      if (!this.selectedServiceType || !this.formData.paymentMethod) {
        this.showNotification('warning', 'Please fill all required fields')
        return
      }

      if (this.selectedServiceType === 'bill-payments' && !this.formData.billReceiptUrl) {
        this.showNotification('warning', 'Please upload a bill receipt')
        return
      }

      this.submitting = true
      try {
        // First, check if order exists and get current data
        const orderRef = doc(db, 'orders', this.orderId)
        const orderSnap = await getDoc(orderRef)
        
        if (!orderSnap.exists()) {
          this.showNotification('error', 'Order not found. Please refresh and try again.')
          this.submitting = false
          return
        }

        const orderData = orderSnap.data()
        const serviceName = this.services.find(s => s.id === this.selectedServiceType)?.name || 'Unknown Service'
        const addOnCost = parseFloat(this.estimatedCost)

        if (isNaN(addOnCost) || addOnCost <= 0) {
          this.showNotification('error', 'Invalid estimated cost. Please try again.')
          this.submitting = false
          return
        }

        // Clean formData to remove File objects (Firestore doesn't support File objects)
        const cleanedDetails = { ...this.formData }
        // Remove File objects - only keep the URL for bill receipts
        delete cleanedDetails.billReceiptFile
        delete cleanedDetails.prescriptionFile
        // Remove any other File objects that might exist
        Object.keys(cleanedDetails).forEach(key => {
          if (cleanedDetails[key] instanceof File) {
            delete cleanedDetails[key]
          }
        })

        // Create the object for the inner array
        // Note: Cannot use serverTimestamp() inside arrayUnion(), so we use a Date object instead
        const newOrderObject = {
          id: Date.now().toString(),
          serviceId: this.selectedServiceType,
          serviceName: serviceName,
          details: cleanedDetails,
          pricing: {
            baseCharge: addOnCost,
            total: addOnCost
          },
          status: 'pending',
          createdAt: new Date(),
          addedBy: 'user'
        }

        // Prepare update data
        const updateData = {
          additionalOrders: arrayUnion(newOrderObject),
          updatedAt: serverTimestamp()
        }

        // Only increment if pricing.total exists, otherwise set it
        const currentTotal = orderData.pricing?.total || orderData.totalAmount || 0
        const newTotal = currentTotal + addOnCost
        
        if (orderData.pricing) {
          updateData['pricing.total'] = newTotal
        } else {
          updateData.pricing = {
            ...(orderData.pricing || {}),
            total: newTotal
          }
        }
        
        // Update totalAmount
        updateData.totalAmount = newTotal

        // Update existing document: Push to array AND increment total price
        await updateDoc(orderRef, updateData)
        
        this.$emit('order-added', this.orderId)
        this.showNotification('success', 'Order added successfully to current booking!')
        
        // Reset form
        setTimeout(() => {
          this.selectedServiceType = ''
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = ''
          })
          this.formData.paymentMethod = 'COD'
          this.estimatedCost = '54.00'
          this.closeModal()
        }, 1500)

      } catch (error) {
        console.error('Error adding order:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          orderId: this.orderId
        })
        
        let errorMessage = 'Failed to add order. Please try again.'
        if (error.message) {
          if (error.message.includes('permission')) {
            errorMessage = 'Permission denied. Please check your access.'
          } else if (error.message.includes('not found')) {
            errorMessage = 'Order not found. Please refresh the page.'
          } else {
            errorMessage = `Error: ${error.message}`
          }
        }
        
        this.showNotification('error', errorMessage)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
/* Ensure Google Places Autocomplete dropdown appears above modal */
:deep(.pac-container) {
  z-index: 9999 !important;
  width: auto !important;
  min-width: 280px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

:deep(.pac-item) {
  padding: 8px 12px;
  cursor: pointer;
}

:deep(.pac-item:hover) {
  background-color: #f0fce6;
}

:deep(.pac-item-selected) {
  background-color: #f0fce6;
}

/* Ensure service buttons and form elements are clickable */
button[type="button"] {
  pointer-events: auto;
  cursor: pointer;
}
</style>
