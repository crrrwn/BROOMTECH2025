<template>
  <div class="min-h-screen bg-gray-50/50 pb-24 font-sans">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Earnings & Remittance</h1>
          <p class="text-gray-500 mt-1">Manage your income. Keep {{ driverSharePercent }}%, remit {{ adminSharePercent }}% to admin.</p>
        </div>
        <div class="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 shadow-sm">
           Driver Share: {{ driverSharePercent }}% • Admin Fee: {{ adminSharePercent }}%
        </div>
      </div>

      <div class="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm inline-flex w-full md:w-auto">
        <button 
          @click="activeTab = 'remit'"
          :class="['flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300', activeTab === 'remit' ? 'bg-[#3ED400] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']"
        >
          To Remit
        </button>
        <button 
          @click="activeTab = 'history'"
          :class="['flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300', activeTab === 'history' ? 'bg-[#3ED400] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']"
        >
          History
        </button>
      </div>

      <div class="space-y-6">
        
        <div v-if="activeTab === 'remit'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button @click="filterPeriod = 'today'" :class="['px-4 py-2 rounded-xl text-sm font-bold border transition-colors whitespace-nowrap', filterPeriod === 'today' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300']">Today</button>
            <button @click="filterPeriod = 'all'" :class="['px-4 py-2 rounded-xl text-sm font-bold border transition-colors whitespace-nowrap', filterPeriod === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300']">All Time</button>
          </div>

          <div v-if="groupedDeliveriesToRemit.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-gray-500 font-medium">{{ groupedDeliveries.length > 0 ? 'No pending remittances. Check History for remitted items.' : 'No completed deliveries to remit yet.' }}</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="dateGroup in groupedDeliveriesToRemit" :key="dateGroup.date" class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              
              <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
                <div>
                  <h3 class="text-lg font-extrabold text-gray-900">{{ dateGroup.label }}</h3>
                  <p class="text-sm text-gray-500">{{ dateGroup.deliveries.length }} completed orders</p>
                </div>
                
                <div v-if="dateGroup.remitStatus !== 'Remitted' && dateGroup.remitStatus !== 'Approved'">
                   <button @click="openRemitModal(dateGroup)" class="px-6 py-2.5 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95">
                     Remit ₱{{ (dateGroup.totalAmount * adminShareRate).toFixed(2) }}
                   </button>
                </div>
                <div v-else>
                   <span :class="['px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border', dateGroup.remitStatus === 'Remitted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200']">
                      {{ dateGroup.remitStatus }}
                   </span>
                </div>
              </div>

              <div class="divide-y divide-gray-100">
                <div 
                  v-for="delivery in dateGroup.deliveries" 
                  :key="delivery.id" 
                  class="p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                  @click="openOrderModal(delivery)"
                >
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                       </div>
                       <div>
                          <p class="text-sm font-bold text-gray-900 group-hover:text-[#3ED400] transition-colors">#{{ delivery.id.slice(0,8).toUpperCase() }}</p>
                          <p class="text-xs text-gray-500">{{ getPaymentMethodLabel(delivery.paymentMethod) }}</p>
                       </div>
                    </div>
                    <div class="text-right">
                       <p class="font-bold text-gray-900">₱{{ (delivery.totalAmount || calculateDeliveryTotal(delivery)).toFixed(2) }}</p>
                       <p class="text-[10px] uppercase font-bold tracking-wider" :class="delivery.remitStatus === 'remitted' ? 'text-yellow-500' : delivery.remitStatus === 'approved' ? 'text-green-500' : 'text-gray-400'">
                          {{ delivery.remitStatus || 'Pending' }}
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center px-6">
                 <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Total</span>
                 <span class="text-xl font-extrabold text-gray-900">₱{{ dateGroup.totalAmount.toFixed(2) }}</span>
              </div>

            </div>
          </div>
        </div>

        <div v-if="activeTab === 'history'" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           <div v-if="remittanceHistory.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p class="text-gray-400 font-medium">No remittance history found.</p>
           </div>

           <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table class="min-w-full divide-y divide-gray-100">
                 <thead class="bg-gray-50">
                    <tr>
                       <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                       <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                       <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-blue-600">You ({{ driverSharePercent }}%)</th>
                       <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                       <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                       <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Proof</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-100">
                    <tr v-for="remittance in remittanceHistory" :key="remittance.id" class="hover:bg-gray-50/50 transition-colors">
                       <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ formatDate(remittance.date) }}</td>
                       <td class="px-6 py-4 text-sm font-bold text-gray-900">₱{{ remittance.amount.toFixed(2) }}</td>
                       <td class="px-6 py-4 text-sm font-bold text-blue-600">₱{{ (remittance.driverShare != null ? remittance.driverShare : (remittance.amount - (remittance.amount * (remittance.adminShareRate ?? 0.20)))).toFixed(2) }}</td>
                       <td class="px-6 py-4 text-sm text-gray-500">{{ formatPaymentMethod(remittance.paymentMethod) }}</td>
                       <td class="px-6 py-4">
                          <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', remittance.status === 'approved' ? 'bg-green-100 text-green-700' : remittance.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700']">
                             {{ remittance.status || 'Pending' }}
                          </span>
                       </td>
                       <td class="px-6 py-4 text-right">
                          <button v-if="remittance.proofUrl" @click="viewProof(remittance.proofUrl, remittance.date)" class="text-[#3ED400] hover:text-[#32b000] font-bold text-xs underline">View</button>
                          <span v-else class="text-gray-300 text-xs">--</span>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>

    <div v-if="showRemitModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div class="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        <div class="flex justify-between items-center mb-8">
           <div>
              <h2 class="text-2xl font-extrabold text-gray-900">Remit Earnings</h2>
              <p class="text-sm text-gray-500 font-medium">{{ selectedDateGroup?.label }}</p>
           </div>
           <button @click="closeRemitModal" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>

        <div v-if="selectedDateGroup" class="space-y-6">
           
           <div class="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <div class="flex justify-between items-center border-b border-gray-200 pb-4">
                 <span class="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Collection</span>
                 <span class="text-2xl font-extrabold text-gray-900">₱{{ selectedDateGroup.totalAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                 <span class="text-gray-500">Your Income ({{ driverSharePercent }}%)</span>
                 <span class="font-bold text-blue-600">₱{{ (selectedDateGroup.totalAmount - (selectedDateGroup.totalAmount * adminShareRate)).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                 <span class="text-gray-500">Admin Commission ({{ adminSharePercent }}%)</span>
                 <span class="font-bold text-green-600">₱{{ (selectedDateGroup.totalAmount * adminShareRate).toFixed(2) }}</span>
              </div>
              <div class="pt-2">
                 <div class="bg-[#3ED400]/10 p-3 rounded-xl border border-[#3ED400]/20 flex justify-between items-center">
                    <span class="text-xs font-bold text-[#3ED400] uppercase">Amount to Remit</span>
                    <span class="text-lg font-extrabold text-[#3ED400]">₱{{ (selectedDateGroup.totalAmount * adminShareRate).toFixed(2) }}</span>
                 </div>
              </div>
           </div>

           <div class="space-y-4">
              <div>
                 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Method</label>
                 <div class="relative">
                    <select v-model="remitFormData.paymentMethod" class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3ED400] outline-none text-sm font-bold text-gray-700 appearance-none cursor-pointer">
                       <option value="">Select Method</option>
                       <option value="GCASH">GCash</option>
                       <option value="CASH">Cash Remittance</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div>
                 </div>
              </div>

              <div>
                 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Proof of Payment</label>
                 <div class="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-[#3ED400] hover:bg-green-50/30 transition-all cursor-pointer text-center group" @click="$refs.fileInput.click()">
                    <input ref="fileInput" type="file" accept="image/*,.pdf" @change="handleFileUpload" class="hidden" />
                    
                    <div v-if="remitFormData.proofFile" class="flex flex-col items-center">
                       <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                       <p class="text-sm font-bold text-gray-900 truncate max-w-full">{{ remitFormData.proofFile.name }}</p>
                       <p class="text-xs text-green-600 mt-1">Ready to upload</p>
                    </div>

                    <div v-else class="flex flex-col items-center">
                       <div class="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#3ED400] group-hover:text-white transition-colors">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                       </div>
                       <p class="text-sm font-bold text-gray-600">Click to Upload Receipt</p>
                       <p class="text-xs text-gray-400 mt-1">Images or PDF (Max 5MB)</p>
                    </div>
                 </div>
              </div>
           </div>

           <div class="flex gap-4 pt-4">
              <button @click="closeRemitModal" class="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
              <button 
                 @click="submitDateGroupRemittance" 
                 :disabled="!remitFormData.paymentMethod || !remitFormData.proofFile || isUploading"
                 class="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#74E600] to-[#00C851] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                 <svg v-if="isUploading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 {{ isUploading ? 'Submitting...' : 'Submit Remittance' }}
              </button>
           </div>

        </div>
      </div>
    </div>

    <div v-if="showProofModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="closeProofModal">
       <div class="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95" @click.stop>
          <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <h3 class="font-bold text-gray-900">Proof of Payment</h3>
             <button @click="closeProofModal" class="p-2 bg-white rounded-full text-gray-500 hover:text-gray-900 shadow-sm"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>
          <div class="p-4 bg-gray-900 flex-1 overflow-auto flex items-center justify-center">
             <img v-if="selectedProof && !selectedProof.isPDF" :src="selectedProof.url" class="max-w-full max-h-full rounded shadow-lg"/>
             <div v-else-if="selectedProof?.isPDF" class="text-center text-white">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path></svg>
                <p class="mb-4">PDF Document</p>
                <a :href="selectedProof.url" target="_blank" class="px-6 py-2 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100">Download to View</a>
             </div>
          </div>
       </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="closeModal">
       <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95" @click.stop>
          <div class="text-center mb-6">
             <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div>
             <h3 class="text-xl font-bold text-gray-900">Order #{{ selectedOrder?.id.slice(0,8).toUpperCase() }}</h3>
             <p class="text-gray-500 text-sm mt-1">{{ formatDate(selectedOrder?.deliveredAt) }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl space-y-3 mb-6">
             <div class="flex justify-between text-sm"><span class="text-gray-500">Service</span> <span class="font-bold text-gray-900">{{ selectedOrder?.serviceName || 'Delivery' }}</span></div>
             <div class="flex justify-between text-sm"><span class="text-gray-500">Total</span> <span class="font-bold text-[#3ED400]">₱{{ (selectedOrder?.totalAmount || 0).toFixed(2) }}</span></div>
             <div class="flex justify-between text-sm"><span class="text-gray-500">Status</span> <span class="uppercase font-bold text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">{{ selectedOrder?.remitStatus || 'PENDING' }}</span></div>
          </div>
          <button @click="closeModal" class="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Close</button>
       </div>
    </div>

  </div>
</template>

<script>
// Logic remains unchanged to ensure stability
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
      remitFormData: { paymentMethod: '', proofFile: null },
      isUploading: false,
      showProofModal: false,
      selectedProof: null,
      driverShareRate: 0.80, // Default to 80%
      adminShareRate: 0.20   // Default to 20%
    }
  },
  computed: {
    driverSharePercent() {
      return Math.round(this.driverShareRate * 100)
    },
    adminSharePercent() {
      return Math.round(this.adminShareRate * 100)
    },
    groupedDeliveries() {
      const deliveries = this.getFilteredDeliveries()
      const grouped = {}
      deliveries.forEach(delivery => {
        const date = delivery.deliveredAt?.toDate?.()
        const dateKey = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'
        if (!grouped[dateKey]) {
          grouped[dateKey] = { date: dateKey, label: this.getDateLabel(date), deliveries: [], totalAmount: 0, remitStatus: 'Pending' }
        }
        grouped[dateKey].deliveries.push(delivery)
        grouped[dateKey].totalAmount += this.calculateDeliveryTotal(delivery)
      })
      Object.values(grouped).forEach(group => {
        if (group.deliveries.length > 0) {
          const allRemitted = group.deliveries.every(d => d.remitStatus === 'remitted')
          const allApproved = group.deliveries.every(d => d.remitStatus === 'approved')
          if (allApproved) group.remitStatus = 'Approved'; else if (allRemitted) group.remitStatus = 'Remitted'; else group.remitStatus = 'Pending'
        }
      })
      return Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    // Only show date groups that are not yet remitted — remitted ones appear in History
    groupedDeliveriesToRemit() {
      return this.groupedDeliveries.filter(g => g.remitStatus === 'Pending')
    }
  },
  async mounted() {
    await this.loadDriverShareRates()
    this.setupRemittanceHistoryListener()
    this.setupCompletedDeliveriesListener()
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe()
    if (this.remittanceHistoryUnsubscribe) this.remittanceHistoryUnsubscribe()
  },
  methods: {
    async loadDriverShareRates() {
      try {
        const user = this.authStore.user
        if (!user) return
        const driverRef = doc(db, 'drivers', user.uid)
        const driverDoc = await getDoc(driverRef)
        if (driverDoc.exists()) {
          const data = driverDoc.data()
          this.driverShareRate = data.driverShareRate || 0.80
          this.adminShareRate = data.adminShareRate || 0.20
        }
      } catch (error) {
        console.error('Error loading driver share rates:', error)
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { this.toast.error('Max 5MB'); return }
        this.remitFormData.proofFile = file
      }
    },
    getDateLabel(date) {
      if (!date) return 'Unknown Date'
      const today = new Date(); const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const y = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      if (d.getTime() === t.getTime()) return 'Today';
      if (d.getTime() === y.getTime()) return 'Yesterday';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    openOrderModal(delivery) { this.selectedOrder = delivery; this.showModal = true; },
    closeModal() { this.showModal = false; this.selectedOrder = null; },
    openRemitModal(dateGroup) { this.selectedDateGroup = dateGroup; this.remitFormData = { paymentMethod: '', proofFile: null }; this.showRemitModal = true; },
    closeRemitModal() { this.showRemitModal = false; this.selectedDateGroup = null; this.isUploading = false; },
    viewProof(proofUrl, date) {
      const isPDF = proofUrl.toLowerCase().includes('.pdf'); const name = proofUrl.split('/').pop().split('?')[0];
      this.selectedProof = { url: proofUrl, name, date: this.formatDate(date), isPDF };
      this.showProofModal = true;
    },
    closeProofModal() { this.showProofModal = false; this.selectedProof = null; },
    async submitDateGroupRemittance() {
      try {
        const user = this.authStore.user; if (!user || !this.selectedDateGroup) return;
        this.isUploading = true;
        const timestamp = Date.now(); const fileName = `${timestamp}_${this.remitFormData.proofFile.name}`;
        const fileRef = storageRef(storage, `remittance-receipts/${user.uid}/${fileName}`);
        const uploadTask = uploadBytesResumable(fileRef, this.remitFormData.proofFile);
        uploadTask.on('state_changed', null, (err) => { this.isUploading = false; this.toast.error('Upload failed'); }, async () => {
             const proofUrl = await getDownloadURL(uploadTask.snapshot.ref);
             const amount = this.selectedDateGroup.totalAmount;
             
             // Get driver's share rates from profile (default to 80/20 if not set)
             const driverRef = doc(db, 'drivers', user.uid);
             const driverDoc = await getDoc(driverRef);
             const driverShareRate = driverDoc.exists() ? (driverDoc.data().driverShareRate || 0.80) : 0.80;
             const adminShareRate = driverDoc.exists() ? (driverDoc.data().adminShareRate || 0.20) : 0.20;
             const adminShare = amount * adminShareRate;
             const driverShare = amount - adminShare; // Driver share = total - admin (e.g. 1450 - 290 = 1160)
             const remittanceData = {
                driverId: user.uid, driverName: this.authStore.userProfile?.fullName || 'Driver',
                amount, 
                driverShare, 
                adminShare,
                driverShareRate: driverShareRate, // Store rates for reference
                adminShareRate: adminShareRate,
                paymentMethod: this.remitFormData.paymentMethod, proofUrl,
                notes: `Earnings for ${this.selectedDateGroup.label}`, date: new Date(), status: 'pending', createdAt: new Date(),
                orderIds: this.selectedDateGroup.deliveries.map(d => d.id)
             };
             const ref = await addDoc(collection(db, 'remittances'), remittanceData);
             for(const d of this.selectedDateGroup.deliveries) {
                 await updateDoc(doc(db, 'orders', d.id), { remitStatus: 'remitted', remittanceId: ref.id, remittedAt: new Date() });
             }
             // Update driver doc — only their share (total - admin); admin gets 20% only
             const newTotal = (driverDoc.exists() ? driverDoc.data().totalEarningsToday || 0 : 0) + driverShare
             await setDoc(driverRef, { totalEarningsToday: newTotal, lastRemitDate: new Date().toDateString(), hasRemitted: true }, { merge: true });
             await this.driverStore.loadEarningsData();
             this.isUploading = false;
             this.toast.success('Remittance Submitted!');
             this.closeRemitModal();
        });
      } catch(e) { this.isUploading = false; this.toast.error('Error submitting'); }
    },
    getPaymentMethodLabel(m) { return m || 'Unknown' },
    setupCompletedDeliveriesListener() {
        const user = this.authStore.user; if(!user) return;
        if(this.unsubscribe) this.unsubscribe();
        const q = query(collection(db, 'orders'), where('driverId','==',user.uid), where('status','==','delivered'));
        this.unsubscribe = onSnapshot(q, (snap) => {
            const orders = snap.docs.map(d => ({id:d.id, ...d.data(), paymentMethod: d.data().paymentMethod || d.data().formData?.paymentMethod || 'COD' }));
            orders.sort((a,b) => (b.deliveredAt?.toDate?.() || 0) - (a.deliveredAt?.toDate?.() || 0));
            this.completedDeliveries = orders;
        });
    },
    getFilteredDeliveries() {
        // Exclude orders already remitted or approved by admin — those belong in History only
        const pendingOnly = this.completedDeliveries.filter(d => {
            const status = (d.remitStatus || '').toLowerCase()
            return status !== 'remitted' && status !== 'approved'
        })
        if (this.filterPeriod === 'today') {
            const today = new Date(); today.setHours(0,0,0,0);
            return pendingOnly.filter(d => (d.deliveredAt?.toDate?.() || new Date(0)) >= today);
        }
        return pendingOnly;
    },
    calculateDeliveryTotal(d) {
        const p = d.pricing || {};
        return (p.baseCharge || 0) + (p.distanceFee || 0) + (p.badWeatherFee || 0) + (p.itemsTotal || 0) + (d.paymentMethod === 'GCASH' ? (p.gcashFee || 0) : 0);
    },
    formatDate(d) { if(!d) return ''; const date = d.toDate ? d.toDate() : new Date(d); return date.toLocaleDateString(); },
    formatPaymentMethod(m) { return m === 'GCASH' ? 'GCash' : (m === 'COD' ? 'Cash' : m); },
    setupRemittanceHistoryListener() {
        const user = this.authStore.user; if(!user) return;
        const q = query(collection(db, 'remittances'), where('driverId','==',user.uid));
        this.remittanceHistoryUnsubscribe = onSnapshot(q, (snap) => {
             this.remittanceHistory = snap.docs.map(d => ({id:d.id, ...d.data()})).sort((a,b) => (b.date?.toDate?.() || 0) - (a.date?.toDate?.() || 0));
        });
    }
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>