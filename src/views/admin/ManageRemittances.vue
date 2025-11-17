<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Manage Remittances</h1>
      <p class="text-gray-600">View and manage driver remittance submissions</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg p-4 shadow-sm border">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select v-model="methodFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Methods</option>
            <option value="gcash">GCash</option>
            <option value="paymaya">PayMaya</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="direct_cash">Direct Cash</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Driver</label>
          <input v-model="searchQuery" type="text" placeholder="Driver name..." class="w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>
      </div>
    </div>

    <!-- Remittances Table -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver Share</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Share</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="remittance in getFilteredRemittances()" :key="remittance.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ remittance.driverName }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">₱{{ remittance.amount.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-blue-600 font-medium">₱{{ remittance.driverShare.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-green-600 font-medium">₱{{ remittance.adminShare.toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatPaymentMethod(remittance.paymentMethod) }}</td>
              <td class="px-6 py-4 text-sm">
                <button 
                  v-if="remittance.receiptUrl"
                  @click="viewReceipt(remittance)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Receipt
                </button>
                <span v-else class="text-gray-400">No receipt</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(remittance.date) }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  remittance.status === 'approved' ? 'bg-green-100 text-green-800' :
                  remittance.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]">
                  {{ remittance.status.charAt(0).toUpperCase() + remittance.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button 
                  v-if="remittance.status === 'pending'"
                  @click="approveRemittance(remittance)"
                  class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                >
                  Approve
                </button>
                <button 
                  v-if="remittance.status === 'pending'"
                  @click="rejectRemittance(remittance)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Payment Receipt</h2>
          <button @click="showReceiptModal = false" class="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <img v-if="selectedReceipt" :src="selectedReceipt.receiptUrl" :alt="selectedReceipt.driverName" class="w-full h-auto rounded-lg">
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, query, getDocs, doc, updateDoc, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { useToast } from 'vue-toastification'

export default {
  name: 'ManageRemittances',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      remittances: [],
      statusFilter: '',
      methodFilter: '',
      searchQuery: '',
      showReceiptModal: false,
      selectedReceipt: null,
      loading: true,
      unsubscribe: null
    }
  },
  async mounted() {
    this.setupRemittancesListener()
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    setupRemittancesListener() {
      try {
        if (this.unsubscribe) {
          this.unsubscribe()
        }

        const remittancesQuery = query(
          collection(db, 'remittances'),
          orderBy('date', 'desc'),
          limit(100)
        )
        
        this.unsubscribe = onSnapshot(remittancesQuery, (snapshot) => {
          this.remittances = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          console.log('[v0] Remittances loaded (real-time):', this.remittances.length)
          this.loading = false
        }, (error) => {
          console.error('[v0] Error with remittances listener:', error)
          this.toast.error('Error loading remittances')
          this.loading = false
        })
      } catch (error) {
        console.error('[v0] Error setting up listener:', error)
        this.toast.error('Error setting up remittances listener')
        this.loading = false
      }
    },

    getFilteredRemittances() {
      return this.remittances.filter(remittance => {
        const matchesStatus = !this.statusFilter || remittance.status === this.statusFilter
        const matchesMethod = !this.methodFilter || remittance.paymentMethod === this.methodFilter
        const matchesSearch = !this.searchQuery || remittance.driverName.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        return matchesStatus && matchesMethod && matchesSearch
      })
    },

    viewReceipt(remittance) {
      this.selectedReceipt = remittance
      this.showReceiptModal = true
    },

    async approveRemittance(remittance) {
      try {
        await updateDoc(doc(db, 'remittances', remittance.id), {
          status: 'approved'
        })
        
        this.toast.success('Remittance approved successfully!')
        console.log('[v0] Remittance approved:', remittance.id)
      } catch (error) {
        console.error('[v0] Error approving remittance:', error)
        this.toast.error('Error approving remittance')
      }
    },

    async rejectRemittance(remittance) {
      try {
        await updateDoc(doc(db, 'remittances', remittance.id), {
          status: 'rejected'
        })
        
        this.toast.success('Remittance rejected!')
        console.log('[v0] Remittance rejected:', remittance.id)
      } catch (error) {
        console.error('[v0] Error rejecting remittance:', error)
        this.toast.error('Error rejecting remittance')
      }
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
    }
  }
}
</script>
