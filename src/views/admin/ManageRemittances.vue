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
                  v-if="remittance.proofUrl || remittance.receiptUrl"
                  @click="viewReceipt(remittance)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Proof
                </button>
                <span v-else class="text-gray-400">No proof</span>
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

    <!-- Proof of Payment Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Proof of Payment</h2>
          <button @click="showReceiptModal = false" class="text-gray-500 hover:text-gray-700 text-2xl font-light">×</button>
        </div>
        <div v-if="selectedReceipt" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-600 mb-1">Driver: <span class="font-medium text-gray-900">{{ selectedReceipt.driverName }}</span></p>
            <p class="text-sm text-gray-600 mb-1">Amount: <span class="font-medium text-gray-900">₱{{ selectedReceipt.amount.toFixed(2) }}</span></p>
            <p class="text-sm text-gray-600">Payment Method: <span class="font-medium text-gray-900">{{ formatPaymentMethod(selectedReceipt.paymentMethod) }}</span></p>
          </div>
          
          <div v-if="selectedReceipt.isPDF || (selectedReceipt.proofUrl && selectedReceipt.proofUrl.includes('.pdf')) || (selectedReceipt.receiptUrl && selectedReceipt.receiptUrl.includes('.pdf'))" 
               class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div class="text-center">
              <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
              </svg>
              <p class="text-gray-600 mb-2">PDF Document</p>
              <a :href="selectedReceipt.proofUrl || selectedReceipt.receiptUrl" 
                 target="_blank" 
                 class="text-primary hover:text-green-600 font-medium inline-block">
                Download PDF
              </a>
            </div>
          </div>
          <img v-else 
               :src="selectedReceipt.proofUrl || selectedReceipt.receiptUrl" 
               :alt="`Proof of payment from ${selectedReceipt.driverName}`" 
               class="w-full h-auto rounded-lg border border-gray-200">
        </div>
      </div>
    </div>

    <!-- Approval/Rejection Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex items-center justify-center mb-4">
          <div :class="[
            'w-16 h-16 rounded-full flex items-center justify-center',
            notificationType === 'approved' ? 'bg-green-100' : 'bg-red-100'
          ]">
            <svg v-if="notificationType === 'approved'" class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h3 :class="[
          'text-xl font-semibold text-center mb-2',
          notificationType === 'approved' ? 'text-green-600' : 'text-red-600'
        ]">
          {{ notificationType === 'approved' ? 'Remittance Approved' : 'Remittance Rejected' }}
        </h3>
        <p class="text-gray-600 text-center mb-6">
          {{ notificationMessage }}
        </p>
        <button 
          @click="closeNotificationModal"
          :class="[
            'w-full py-2 rounded-lg font-medium transition-colors',
            notificationType === 'approved' 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-red-500 text-white hover:bg-red-600'
          ]"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, query, getDocs, doc, updateDoc, setDoc, orderBy, limit, onSnapshot, where, getDoc } from 'firebase/firestore'
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
      unsubscribe: null,
      showNotificationModal: false,
      notificationType: 'approved', // 'approved' or 'rejected'
      notificationMessage: ''
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
      // Check if proofUrl or receiptUrl exists
      const proofUrl = remittance.proofUrl || remittance.receiptUrl
      if (!proofUrl) {
        this.toast.error('No proof of payment available')
        return
      }
      
      // Check if it's a PDF
      const isPDF = proofUrl.includes('.pdf') || proofUrl.includes('application/pdf')
      
      this.selectedReceipt = {
        ...remittance,
        proofUrl: proofUrl,
        receiptUrl: proofUrl,
        isPDF: isPDF
      }
      this.showReceiptModal = true
    },

    async approveRemittance(remittance) {
      try {
        // Update remittance status to approved
        await updateDoc(doc(db, 'remittances', remittance.id), {
          status: 'approved',
          approvedAt: new Date()
        })
        
        // Update related orders to 'approved' status
        if (remittance.orderIds && Array.isArray(remittance.orderIds)) {
          for (const orderId of remittance.orderIds) {
            try {
              await updateDoc(doc(db, 'orders', orderId), {
                remitStatus: 'approved'
              })
            } catch (error) {
              console.error('[v0] Error updating order status:', orderId, error)
            }
          }
        }
        
        // Update driver's earnings - calculate total of all approved remittances approved today
        try {
          const today = new Date().toDateString()
          const driverRef = doc(db, 'drivers', remittance.driverId)
          const driverDoc = await getDoc(driverRef)
          
          // Get all approved remittances for this driver
          const approvedRemittancesQuery = query(
            collection(db, 'remittances'),
            where('driverId', '==', remittance.driverId),
            where('status', '==', 'approved')
          )
          
          const approvedSnapshot = await getDocs(approvedRemittancesQuery)
          let totalApprovedToday = 0
          
          approvedSnapshot.forEach(doc => {
            const data = doc.data()
            // Check if remittance was approved today (use approvedAt if available, otherwise use date)
            let approvalDate
            if (data.approvedAt) {
              approvalDate = data.approvedAt.toDate ? data.approvedAt.toDate() : new Date(data.approvedAt)
            } else if (data.date) {
              approvalDate = data.date.toDate ? data.date.toDate() : new Date(data.date)
            } else if (data.createdAt) {
              approvalDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
            } else {
              return // Skip if no date
            }
            
            const approvalDateString = approvalDate.toDateString()
            
            // Only count remittances approved today
            if (approvalDateString === today) {
              totalApprovedToday += data.amount || 0
            }
          })
          
          // Update driver document with total approved earnings for today
          if (driverDoc.exists()) {
            const currentData = driverDoc.data()
            const currentLastRemitDate = currentData.lastRemitDate
            
            // Normalize current lastRemitDate for comparison
            let normalizedCurrentDate = ''
            if (currentLastRemitDate) {
              if (currentLastRemitDate.toDate) {
                normalizedCurrentDate = currentLastRemitDate.toDate().toDateString().trim()
              } else if (currentLastRemitDate instanceof Date) {
                normalizedCurrentDate = currentLastRemitDate.toDateString().trim()
              } else if (typeof currentLastRemitDate === 'string') {
                normalizedCurrentDate = currentLastRemitDate.trim()
              }
            }
            
            // Only update if this is the first approval today, or if we need to update the total
            if (normalizedCurrentDate !== today.trim()) {
              // First approval today - set new total
              await updateDoc(driverRef, {
                totalEarningsToday: totalApprovedToday,
                lastRemitDate: today,
                hasRemitted: true
              })
            } else {
              // Already approved today - update total
              await updateDoc(driverRef, {
                totalEarningsToday: totalApprovedToday
              })
            }
            
            console.log('[v0] Driver earnings updated after approval:', {
              driverId: remittance.driverId,
              driverName: remittance.driverName,
              totalApprovedToday,
              driverShare: (totalApprovedToday * 0.8).toFixed(2),
              today
            })
          } else {
            // Create driver document if it doesn't exist
            await setDoc(driverRef, {
              totalEarningsToday: totalApprovedToday,
              lastRemitDate: today,
              hasRemitted: true,
              isOnline: false
            })
          }
        } catch (error) {
          console.error('[v0] Error updating driver earnings after approval:', error)
          // Don't fail the approval if earnings update fails
        }
        
        // Show notification modal
        this.notificationType = 'approved'
        this.notificationMessage = `Remittance of ₱${remittance.amount.toFixed(2)} from ${remittance.driverName} has been approved successfully. Driver's 80% share (₱${(remittance.driverShare || remittance.amount * 0.8).toFixed(2)}) has been credited to their account.`
        this.showNotificationModal = true
        
        console.log('[v0] Remittance approved:', remittance.id)
      } catch (error) {
        console.error('[v0] Error approving remittance:', error)
        this.toast.error('Error approving remittance')
      }
    },

    async rejectRemittance(remittance) {
      try {
        await updateDoc(doc(db, 'remittances', remittance.id), {
          status: 'rejected',
          rejectedAt: new Date()
        })
        
        // Update related orders to remove remit status
        if (remittance.orderIds && Array.isArray(remittance.orderIds)) {
          for (const orderId of remittance.orderIds) {
            try {
              await updateDoc(doc(db, 'orders', orderId), {
                remitStatus: null
              })
            } catch (error) {
              console.error('[v0] Error updating order status:', orderId, error)
            }
          }
        }
        
        // Show notification modal
        this.notificationType = 'rejected'
        this.notificationMessage = `Remittance of ₱${remittance.amount.toFixed(2)} from ${remittance.driverName} has been rejected.`
        this.showNotificationModal = true
        
        console.log('[v0] Remittance rejected:', remittance.id)
      } catch (error) {
        console.error('[v0] Error rejecting remittance:', error)
        this.toast.error('Error rejecting remittance')
      }
    },

    closeNotificationModal() {
      this.showNotificationModal = false
      this.notificationType = 'approved'
      this.notificationMessage = ''
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
