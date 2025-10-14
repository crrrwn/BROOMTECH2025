<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Manage Users</h1>
        <p class="text-gray-600">Review and manage user accounts and approvals</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Auto-Accept Users</span>
          <button 
            @click="toggleAutoAccept"
            :disabled="loading"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              autoAcceptEnabled ? 'bg-primary' : 'bg-gray-300',
              loading ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                autoAcceptEnabled ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Fraud Detection Alert Banner -->
    <div v-if="flaggedUsersCount > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <div class="p-2 bg-red-100 rounded-lg">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-900">Fraud Detection Alert</h3>
          <p class="text-sm text-red-800 mt-1">
            {{ flaggedUsersCount }} user{{ flaggedUsersCount > 1 ? 's' : '' }} flagged for suspicious behavior. 
            Review flagged users below (marked with warning icons).
          </p>
        </div>
        <button 
          @click="showFlaggedOnly = !showFlaggedOnly"
          class="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {{ showFlaggedOnly ? 'Show All' : 'Show Flagged Only' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900">{{ userStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Approved</p>
            <p class="text-2xl font-semibold text-gray-900">{{ userStats.approved }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 00-18 0 9 9 0 0018 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-semibold text-gray-900">{{ userStats.pending }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Banned</p>
            <p class="text-2xl font-semibold text-gray-900">{{ userStats.flagged }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg p-4 shadow-sm border">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users by name, email, or contact..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="flagged">Banned</option>
          </select>
        </div>
        
        <div>
          <select v-model="barangayFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">All Barangays</option>
            <option v-for="barangay in barangays" :key="barangay" :value="barangay">
              {{ barangay }}
            </option>
          </select>
        </div>
        
        <button 
          @click="exportUsers"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">User Accounts</h3>
        <button 
          @click="loadUsers"
          :disabled="loading"
          class="mt-2 text-sm text-primary hover:text-green-600 disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : 'Refresh Users' }}
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading && users.length === 0">
              <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                Loading users...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50" :class="{ 'bg-red-50': user.fraudFlags && user.fraudFlags.length > 0 }">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ user.initials }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.contact }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.barangay }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.registeredDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-medium">{{ user.totalOrders || 0 }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.cancelledOrders > 0 ? 'font-medium text-red-600' : 'text-gray-500'">
                  {{ user.cancelledOrders || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  user.status === 'approved' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  user.status === 'flagged' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ user.status === 'flagged' ? 'Banned' : user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  v-if="user.status === 'pending'"
                  @click="approveUser(user)"
                  :disabled="loading"
                  class="text-green-600 hover:text-green-800 disabled:opacity-50"
                >
                  Approve
                </button>
                <button 
                  v-if="user.status === 'pending'"
                  @click="rejectUser(user)"
                  :disabled="loading"
                  class="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Reject
                </button>
                <button 
                  v-if="user.status === 'approved'"
                  @click="flagUser(user)"
                  :disabled="loading"
                  class="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Ban
                </button>
                <button 
                  v-if="user.status === 'flagged'"
                  @click="unflagUser(user)"
                  :disabled="loading"
                  class="text-green-600 hover:text-green-800 disabled:opacity-50"
                >
                  Unban
                </button>
                <button 
                  @click="viewUserDetails(user)"
                  class="text-primary hover:text-green-600"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View User Details Modal -->
    <div v-if="showUserDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">User Details</h3>
          <button @click="closeUserDetailsModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div v-if="selectedUser" class="p-6 space-y-6">
          <!-- Fraud Flags section -->
          <div v-if="selectedUser.fraudFlags && selectedUser.fraudFlags.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-red-900 mb-2">Fraud Detection Flags</h4>
                <ul class="space-y-1">
                  <li v-for="flag in selectedUser.fraudFlags" :key="flag.type" class="text-sm text-red-800">
                    • {{ flag.description }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- User Information -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Full Name</p>
                <p class="text-base font-medium text-gray-900">{{ selectedUser.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="text-base font-medium text-gray-900">{{ selectedUser.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Contact Number</p>
                <p class="text-base font-medium text-gray-900">{{ selectedUser.contact }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Barangay</p>
                <p class="text-base font-medium text-gray-900">{{ selectedUser.barangay }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Status</p>
                <span :class="[
                  'inline-flex px-3 py-1 text-sm font-medium rounded-full',
                  selectedUser.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedUser.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedUser.status === 'flagged' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ selectedUser.status === 'flagged' ? 'Banned' : selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600">Registered Date</p>
                <p class="text-base font-medium text-gray-900">{{ selectedUser.registeredDate }}</p>
              </div>
            </div>
          </div>

          <!-- Order History -->
          <div class="bg-white rounded-lg border">
            <div class="px-6 py-4 border-b">
              <h4 class="text-lg font-semibold text-gray-900">Order History ({{ userOrders.length }})</h4>
            </div>
            <div v-if="loadingUserOrders" class="p-6 text-center text-gray-500">
              Loading orders...
            </div>
            <div v-else-if="userOrders.length === 0" class="p-6 text-center text-gray-500">
              No orders found
            </div>
            <div v-else class="divide-y">
              <div v-for="order in userOrders" :key="order.id" class="p-4 hover:bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-medium text-gray-900">{{ order.serviceName }}</span>
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      ]">
                        {{ order.status.replace(/_/g, ' ').toUpperCase() }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Order #{{ order.id.slice(0, 8) }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ order.createdAt }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-gray-900">₱{{ order.totalAmount }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              v-if="selectedUser.status === 'approved'"
              @click="flagUserFromModal"
              :disabled="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Ban User
            </button>
            <button
              v-if="selectedUser.status === 'flagged'"
              @click="unflagUserFromModal"
              :disabled="loading"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Unban User
            </button>
            <button
              @click="closeUserDetailsModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { collection, query, where, getDocs, getCountFromServer, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { loggingService } from '@/services/loggingService'

export default {
  name: 'ManageUsers',
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()

    const autoAcceptEnabled = ref(false)
    const loading = ref(false)
    const searchQuery = ref('')
    const statusFilter = ref('')
    const barangayFilter = ref('')
    const users = ref([])
    
    const showUserDetailsModal = ref(false)
    const selectedUser = ref(null)
    const userOrders = ref([])
    const loadingUserOrders = ref(false)
    
    const fraudSettings = ref(null)
    const showFlaggedOnly = ref(false)

    const barangays = ref([
      'Balingayan',
      'Balite',
      'Baruyan',
      'Batino',
      'Bayanan I',
      'Bayanan II',
      'Biga',
      'Bondoc',
      'Bucayao',
      'Buhuan',
      'Bulusan',
      'Calero',
      'Camansihan',
      'Camilmil',
      'Canubing I',
      'Canubing II',
      'Comunal',
      'Guinobatan',
      'Gulod',
      'Gutad',
      'Ibaba East',
      'Ibaba West',
      'Ilaya',
      'Lalud',
      'Lazareto',
      'Libis',
      'Lumangbayan',
      'Mahal na Pangalan',
      'Maidlang',
      'Malad',
      'Malamig',
      'Managpi',
      'Masipit',
      'Nag-iba I',
      'Nag-iba II',
      'Navotas',
      'Pachoca',
      'Palhi',
      'Panggalaan',
      'Parang',
      'Patas',
      'Personas',
      'Puting Tubig',
      'Salong',
      'San Antonio',
      'San Vicente Central',
      'San Vicente East',
      'San Vicente North',
      'San Vicente South',
      'San Vicente West',
      'Sapul',
      'Silonay',
      'Sta. Cruz',
      'Sta. Isabel',
      'Sta. Maria Village',
      'Sta. Rita',
      'Sto. Nino',
      'Suqui',
      'Tawagan',
      'Tawiran',
      'Tibag',
      'Wawa'
    ])

    const handleRealtimeUpdate = (event) => {
      console.log('[v0] Real-time update received:', event.detail)
      const { type, data } = event.detail
      if (type === 'allUsers') {
        users.value = data.filter(user => user.role !== 'admin' && user.role !== 'driver').map(userData => ({
          id: userData.id,
          ...userData,
          name: `${userData.firstName} ${userData.lastName}`.trim(),
          initials: `${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}`.toUpperCase(),
          registeredDate: new Date(userData.createdAt).toLocaleDateString(),
          status: userData.status === 'banned' || userData.banned ? 'flagged' : 
                  userData.status === 'flagged' ? 'flagged' :
                  userData.approved ? 'approved' : 'pending',
          totalOrders: 0,
          cancelledOrders: 0
        }))
        console.log('[v0] Users updated from real-time:', users.value.length)
      }
    }

    const userStats = computed(() => {
      const total = users.value.length
      const approved = users.value.filter(u => u.status === 'approved').length
      const pending = users.value.filter(u => u.status === 'pending').length
      const flagged = users.value.filter(u => u.status === 'flagged').length
      
      return { total, approved, pending, flagged }
    })

    const flaggedUsersCount = computed(() => {
      return users.value.filter(user => user.fraudFlags && user.fraudFlags.length > 0).length
    })

    const filteredUsers = computed(() => {
      let filtered = users.value.filter(user => {
        const matchesSearch = !searchQuery.value || 
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.contact?.includes(searchQuery.value)
        
        const matchesStatus = !statusFilter.value || user.status === statusFilter.value
        const matchesBarangay = !barangayFilter.value || user.barangay === barangayFilter.value
        
        return matchesSearch && matchesStatus && matchesBarangay
      })
      
      if (showFlaggedOnly.value) {
        filtered = filtered.filter(user => user.fraudFlags && user.fraudFlags.length > 0)
      }
      
      return filtered
    })

    const loadUsers = async () => {
      loading.value = true
      try {
        const fetchedUsers = await authStore.getAllUsers()
        users.value = fetchedUsers.map(userData => ({
          ...userData,
          status: userData.status === 'banned' || userData.banned ? 'flagged' : 
                  userData.status === 'flagged' ? 'flagged' :
                  userData.approved ? 'approved' : 'pending',
          totalOrders: 0,
          cancelledOrders: 0
        }))
        
        await loadFraudSettings()
        fetchOrderCounts()
        await checkFraudFlags()
        
        if (fetchedUsers.length === 0) {
          toast.info('No users found in the database')
        }
      } catch (error) {
        console.error('[v0] Error loading users:', error)
        toast.error('Failed to load users: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    const fetchOrderCounts = async () => {
      try {
        const ordersRef = collection(db, 'orders')
        
        const orderCountPromises = users.value.map(async (user) => {
          const totalQuery = query(ordersRef, where('userId', '==', user.id))
          const totalSnapshot = await getCountFromServer(totalQuery)
          
          const cancelledQuery = query(
            ordersRef, 
            where('userId', '==', user.id),
            where('status', '==', 'cancelled')
          )
          const cancelledSnapshot = await getCountFromServer(cancelledQuery)
          
          return { 
            userId: user.id, 
            totalCount: totalSnapshot.data().count,
            cancelledCount: cancelledSnapshot.data().count
          }
        })
        
        const orderCounts = await Promise.all(orderCountPromises)
        
        orderCounts.forEach(({ userId, totalCount, cancelledCount }) => {
          const user = users.value.find(u => u.id === userId)
          if (user) {
            user.totalOrders = totalCount
            user.cancelledOrders = cancelledCount
          }
        })
      } catch (error) {
        console.error('[v0] Error fetching order counts:', error)
      }
    }

    const approveUser = async (user) => {
      loading.value = true
      try {
        const result = await authStore.approveUser(user.id)
        if (result.success) {
          user.status = 'approved'
          await loggingService.success(
            `User approved: ${user.name}`,
            loggingService.USER_TYPES.ADMIN,
            authStore.user?.uid,
            { action: 'user_approval', userId: user.id, userName: user.name }
          )
          toast.success(`${user.name} has been approved`)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to approve user')
      } finally {
        loading.value = false
      }
    }

    const rejectUser = async (user) => {
      loading.value = true
      try {
        const result = await authStore.rejectUser(user.id)
        if (result.success) {
          user.status = 'pending'
          await loggingService.warning(
            `User rejected and removed: ${user.name}`,
            loggingService.USER_TYPES.ADMIN,
            authStore.user?.uid,
            { action: 'user_rejection', userId: user.id, userName: user.name }
          )
          toast.success(`${user.name} has been rejected and removed`)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to reject user')
      } finally {
        loading.value = false
      }
    }

    const flagUser = async (user) => {
      loading.value = true
      try {
        console.log('[v0] Banning user:', user.id, user.name)
        
        const userRef = doc(db, 'users', user.id)
        await updateDoc(userRef, {
          status: 'banned',
          banned: true,
          bannedAt: new Date().toISOString(),
          bannedBy: authStore.user?.uid
        })
        
        console.log('[v0] User banned successfully in Firestore')
        
        user.status = 'flagged'
        
        await loggingService.warning(
          `User banned: ${user.name}`,
          loggingService.USER_TYPES.ADMIN,
          authStore.user?.uid,
          { action: 'user_ban', userId: user.id, userName: user.name }
        )
        
        toast.success(`${user.name} has been banned`)
        
        await loadUsers()
      } catch (error) {
        console.error('[v0] Error banning user:', error)
        console.error('[v0] Error code:', error.code)
        console.error('[v0] Error message:', error.message)
        toast.error(`Failed to ban user: ${error.message}`)
      } finally {
        loading.value = false
      }
    }

    const unflagUser = async (user) => {
      loading.value = true
      try {
        console.log('[v0] Unbanning user:', user.id, user.name)
        
        const userRef = doc(db, 'users', user.id)
        await updateDoc(userRef, {
          status: 'active',
          banned: false,
          unbannedAt: new Date().toISOString(),
          unbannedBy: authStore.user?.uid
        })
        
        console.log('[v0] User unbanned successfully in Firestore')
        
        user.status = 'approved'
        
        await loggingService.success(
          `User unbanned: ${user.name}`,
          loggingService.USER_TYPES.ADMIN,
          authStore.user?.uid,
          { action: 'user_unban', userId: user.id, userName: user.name }
        )
        
        toast.success(`${user.name} has been unbanned`)
        
        await loadUsers()
      } catch (error) {
        console.error('[v0] Error unbanning user:', error)
        console.error('[v0] Error code:', error.code)
        console.error('[v0] Error message:', error.message)
        toast.error(`Failed to unban user: ${error.message}`)
      } finally {
        loading.value = false
      }
    }

    const viewUserDetails = async (user) => {
      selectedUser.value = user
      showUserDetailsModal.value = true
      await fetchUserOrders(user.id)
    }

    const fetchUserOrders = async (userId) => {
      loadingUserOrders.value = true
      try {
        const ordersRef = collection(db, 'orders')
        const q = query(ordersRef, where('userId', '==', userId))
        const snapshot = await getDocs(q)
        
        userOrders.value = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : 'N/A',
            totalAmount: data.totalAmount || 0
          }
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } catch (error) {
        console.error('[v0] Error fetching user orders:', error)
        toast.error('Failed to load user orders')
      } finally {
        loadingUserOrders.value = false
      }
    }

    const closeUserDetailsModal = () => {
      showUserDetailsModal.value = false
      selectedUser.value = null
      userOrders.value = []
    }

    const flagUserFromModal = async () => {
      if (!selectedUser.value) return
      await flagUser(selectedUser.value)
      closeUserDetailsModal()
    }

    const unflagUserFromModal = async () => {
      if (!selectedUser.value) return
      await unflagUser(selectedUser.value)
      closeUserDetailsModal()
    }

    const toggleAutoAccept = async () => {
      loading.value = true
      try {
        const newValue = !autoAcceptEnabled.value
        const result = await authStore.updateAutoAcceptSetting(newValue)
        
        if (result.success) {
          autoAcceptEnabled.value = newValue
          toast.success(
            newValue 
              ? 'Auto-Accept Users enabled - new verified users will be automatically approved' 
              : 'Auto-Accept Users disabled - manual approval required'
          )
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to update auto-accept setting')
      } finally {
        loading.value = false
      }
    }

    const exportUsers = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Contact,Barangay,Status,Registered,Total Orders,Cancelled Orders\n"
        + users.value.map(user => 
            `"${user.name}","${user.email}","${user.contact}","${user.barangay}","${user.status}","${user.registeredDate}","${user.totalOrders}","${user.cancelledOrders}"`
          ).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('User data exported to CSV')
    }

    const loadFraudSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'fraudDetection'))
        if (settingsDoc.exists()) {
          fraudSettings.value = settingsDoc.data()
        } else {
          fraudSettings.value = {
            flagFrequentCancels: true,
            cancelThreshold: 3,
            cancelPeriod: 7,
            flagFakeAddresses: true,
            fakeAddressThreshold: 2,
            flagAbusiveBehavior: true,
            abusiveThreshold: 2
          }
        }
      } catch (error) {
        console.error('[v0] Error loading fraud settings:', error)
      }
    }

    const checkFraudFlags = async () => {
      if (!fraudSettings.value) return

      try {
        const ordersRef = collection(db, 'orders')
        
        for (const user of users.value) {
          const flags = []
          
          if (fraudSettings.value.flagFrequentCancels) {
            const cancelPeriod = parseInt(fraudSettings.value.cancelPeriod) || 7
            const dateThreshold = new Date()
            dateThreshold.setDate(dateThreshold.getDate() - cancelPeriod)
            
            const cancelQuery = query(
              ordersRef,
              where('userId', '==', user.id),
              where('status', '==', 'cancelled')
            )
            const cancelSnapshot = await getDocs(cancelQuery)
            const recentCancels = cancelSnapshot.docs.filter(doc => {
              const orderDate = doc.data().createdAt?.toDate()
              return orderDate && orderDate >= dateThreshold
            }).length
            
            if (recentCancels >= fraudSettings.value.cancelThreshold) {
              flags.push({
                type: 'frequent_cancels',
                description: `${recentCancels} cancellations in last ${cancelPeriod} days`
              })
              
              await sendFraudNotification(user.id, 'frequent_cancels', `Your account has been flagged for ${recentCancels} cancellations in the last ${cancelPeriod} days. Please contact support if you believe this is an error.`)
            }
          }
          
          if (fraudSettings.value.flagFakeAddresses) {
            const failedQuery = query(
              ordersRef,
              where('userId', '==', user.id),
              where('status', '==', 'failed')
            )
            const failedSnapshot = await getDocs(failedQuery)
            const failedCount = failedSnapshot.size
            
            if (failedCount >= fraudSettings.value.fakeAddressThreshold) {
              flags.push({
                type: 'fake_address',
                description: `${failedCount} failed deliveries (possible fake address)`
              })
              
              await sendFraudNotification(user.id, 'fake_address', `Your account has been flagged for ${failedCount} failed deliveries. Please verify your delivery addresses are correct.`)
            }
          }
          
          if (fraudSettings.value.flagAbusiveBehavior) {
            const complaintsRef = collection(db, 'complaints')
            const complaintQuery = query(
              complaintsRef,
              where('userId', '==', user.id),
              where('type', '==', 'abusive_behavior')
            )
            const complaintSnapshot = await getDocs(complaintQuery)
            const complaintCount = complaintSnapshot.size
            
            if (complaintCount >= fraudSettings.value.abusiveThreshold) {
              flags.push({
                type: 'abusive_behavior',
                description: `${complaintCount} reports of abusive behavior`
              })
              
              await sendFraudNotification(user.id, 'abusive_behavior', `Your account has been flagged for ${complaintCount} reports of abusive behavior. This may result in account suspension.`)
            }
          }
          
          user.fraudFlags = flags
        }
        
        const flaggedCount = users.value.filter(u => u.fraudFlags && u.fraudFlags.length > 0).length
        if (flaggedCount > 0) {
          toast.warning(`Fraud Detection: ${flaggedCount} user${flaggedCount > 1 ? 's' : ''} flagged for suspicious behavior`, {
            timeout: 10000
          })
        }
      } catch (error) {
        console.error('[v0] Error checking fraud flags:', error)
      }
    }

    const sendFraudNotification = async (userId, type, message) => {
      try {
        const notificationsRef = collection(db, 'notifications')
        await setDoc(doc(notificationsRef), {
          userId,
          type: 'fraud_alert',
          fraudType: type,
          message,
          read: false,
          createdAt: new Date(),
          severity: 'high'
        })
      } catch (error) {
        console.error('[v0] Error sending fraud notification:', error)
      }
    }

    onMounted(async () => {
      console.log('[v0] ManageUsers component mounted')
      window.addEventListener('realtimeUpdate', handleRealtimeUpdate)
      
      try {
        await Promise.all([
          loadUsers(),
          loadAutoAcceptSetting()
        ])
        console.log('[v0] ManageUsers initialization complete')
      } catch (error) {
        console.error('[v0] Error during ManageUsers initialization:', error)
        toast.error('Failed to initialize user management')
      }
    })

    onUnmounted(() => {
      window.removeEventListener('realtimeUpdate', handleRealtimeUpdate)
    })

    const loadAutoAcceptSetting = async () => {
      try {
        console.log('[v0] Loading auto-accept setting...')
        autoAcceptEnabled.value = await authStore.getAutoAcceptSetting()
        console.log('[v0] Auto-accept setting loaded:', autoAcceptEnabled.value)
      } catch (error) {
        console.error('[v0] Error loading auto-accept setting:', error)
      }
    }

    return {
      autoAcceptEnabled,
      loading,
      searchQuery,
      statusFilter,
      barangayFilter,
      users,
      barangays,
      userStats,
      filteredUsers,
      showUserDetailsModal,
      selectedUser,
      userOrders,
      loadingUserOrders,
      flaggedUsersCount,
      showFlaggedOnly,
      loadUsers,
      toggleAutoAccept,
      approveUser,
      rejectUser,
      flagUser,
      unflagUser,
      viewUserDetails,
      closeUserDetailsModal,
      flagUserFromModal,
      unflagUserFromModal,
      exportUsers
    }
  }
}
</script>
