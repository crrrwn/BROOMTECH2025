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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Banned</p>
            <p class="text-2xl font-semibold text-gray-900">{{ userStats.banned }}</p>
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
            <option value="banned">Banned</option>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading && users.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                Loading users...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.totalOrders }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  user.status === 'approved' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  user.status === 'banned' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
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
                  @click="banUser(user)"
                  :disabled="loading"
                  class="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Ban
                </button>
                <button 
                  v-if="user.status === 'banned'"
                  @click="unbanUser(user)"
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
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

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

    const barangays = ref([
      'Balingayan', 'Balite', 'Baruyan', 'Batino', 'Bayanan I', 'Bayanan II',
      'Guinobatan', 'Gulod', 'Ibaba East', 'Ibaba West', 'Mahal na Pangalan',
      'San Vicente Central', 'Sta. Cruz', 'Sto. Niño'
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
          status: userData.banned ? "banned" : userData.approved ? "approved" : "pending",
          totalOrders: 0,
        }))
        console.log('[v0] Users updated from real-time:', users.value.length)
      }
    }

    const userStats = computed(() => {
      const total = users.value.length
      const approved = users.value.filter(u => u.status === 'approved').length
      const pending = users.value.filter(u => u.status === 'pending').length
      const banned = users.value.filter(u => u.status === 'banned').length
      
      return { total, approved, pending, banned }
    })

    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        const matchesSearch = !searchQuery.value || 
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.contact?.includes(searchQuery.value)
        
        const matchesStatus = !statusFilter.value || user.status === statusFilter.value
        const matchesBarangay = !barangayFilter.value || user.barangay === barangayFilter.value
        
        return matchesSearch && matchesStatus && matchesBarangay
      })
    })

    const loadUsers = async () => {
      loading.value = true
      console.log('[v0] Loading users from Firebase...')
      try {
        const fetchedUsers = await authStore.getAllUsers()
        console.log('[v0] Fetched users from Firebase:', fetchedUsers.length, fetchedUsers)
        users.value = fetchedUsers
        
        if (fetchedUsers.length === 0) {
          console.log('[v0] No users found in Firebase database')
          toast.info('No users found in the database')
        } else {
          console.log('[v0] Successfully loaded users:', fetchedUsers.length)
        }
      } catch (error) {
        console.error('[v0] Error loading users:', error)
        toast.error('Failed to load users: ' + error.message)
      } finally {
        loading.value = false
      }
    }

    const loadAutoAcceptSetting = async () => {
      try {
        console.log('[v0] Loading auto-accept setting...')
        autoAcceptEnabled.value = await authStore.getAutoAcceptSetting()
        console.log('[v0] Auto-accept setting loaded:', autoAcceptEnabled.value)
      } catch (error) {
        console.error('[v0] Error loading auto-accept setting:', error)
      }
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

    const approveUser = async (user) => {
      loading.value = true
      try {
        const result = await authStore.approveUser(user.id)
        if (result.success) {
          user.status = 'approved'
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

    const banUser = async (user) => {
      loading.value = true
      try {
        const result = await authStore.banUser(user.id)
        if (result.success) {
          user.status = 'banned'
          toast.success(`${user.name} has been banned`)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to ban user')
      } finally {
        loading.value = false
      }
    }

    const unbanUser = async (user) => {
      loading.value = true
      try {
        const result = await authStore.unbanUser(user.id)
        if (result.success) {
          user.status = 'approved'
          toast.success(`${user.name} has been unbanned`)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to unban user')
      } finally {
        loading.value = false
      }
    }

    const viewUserDetails = (user) => {
      toast.info(`Viewing details for ${user.name}`)
      // TODO: Implement user details modal or page
    }

    const exportUsers = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Contact,Barangay,Status,Registered\n"
        + users.value.map(user => 
            `"${user.name}","${user.email}","${user.contact}","${user.barangay}","${user.status}","${user.registeredDate}"`
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
      loadUsers,
      toggleAutoAccept,
      approveUser,
      rejectUser,
      banUser,
      unbanUser,
      viewUserDetails,
      exportUsers
    }
  }
}
</script>
