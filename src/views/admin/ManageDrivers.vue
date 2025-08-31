<template>
  <div class="p-6 space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="ml-3 text-gray-600">Loading drivers from database...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading drivers</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          <button @click="loadDrivers" class="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manage Drivers</h1>
          <p class="text-gray-600">Monitor and manage driver performance</p>
          <p class="text-sm text-gray-500 mt-1">
            {{ drivers.length }} drivers loaded from Firestore (users + drivers)
          </p>
        </div>
        <div class="flex gap-3">
          <button @click="loadDrivers" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Refresh Data
          </button>
          <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Add Driver
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Drivers</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalDrivers }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Online Now</p>
              <p class="text-2xl font-bold text-green-600">{{ onlineDrivers }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Pending Applications</p>
              <p class="text-2xl font-bold text-orange-600">{{ pendingApplications }}</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Avg Rating</p>
              <p class="text-2xl font-bold text-yellow-600">{{ averageRating }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
            <select v-model="filters.vehicleType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">All Vehicles</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select v-model="filters.rating" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">Below 3 Stars</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              v-model="filters.search"
              placeholder="Driver name, phone..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>
        </div>
      </div>

      <!-- Drivers Table -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div v-if="filteredDrivers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            {{ drivers.length === 0 ? 'No drivers registered yet' : 'No drivers found' }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ drivers.length === 0
              ? 'Drivers will appear here once they complete their registration.'
              : 'No drivers match your current filters.'
            }}
          </p>
          <div v-if="drivers.length === 0" class="mt-4">
            <button @click="loadDrivers" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Check for New Registrations
            </button>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="driver in paginatedDrivers" :key="driver.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img class="h-10 w-10 rounded-full" :src="driver.profilePicture || '/placeholder.svg?height=40&width=40'" :alt="(driver.firstName + ' ' + driver.lastName).trim() || driver.email">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ (driver.firstName || '') + ' ' + (driver.lastName || '') || 'Unnamed Driver' }}
                      </div>
                      <div class="text-sm text-gray-500">{{ driver.phone || 'No phone' }}</div>
                      <div class="text-sm text-gray-500">{{ driver.email }}</div>
                      <div v-if="driver.source === 'drivers'" class="text-xs mt-1 text-gray-400">source: drivers</div>
                      <div v-else class="text-xs mt-1 text-gray-400">source: users</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ driver.vehicleType || 'Not specified' }}</div>
                  <div class="text-sm text-gray-500">{{ driver.plateNumber || 'No plate' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(driver.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ driver.status || 'active' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= (driver.rating || 0) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ Number(driver.rating || 0).toFixed(1) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ driver.deliveries || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₱{{ Number(driver.earnings || 0).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button @click="viewDriver(driver)" class="text-blue-600 hover:text-blue-900">View</button>
                  <button @click="trackDriver(driver)" class="text-green-600 hover:text-green-900">Track</button>
                  <button @click="suspendDriver(driver)" class="text-red-600 hover:text-red-900">
                    {{ driver.status === 'suspended' ? 'Unsuspend' : 'Suspend' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredDrivers.length > itemsPerPage" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredDrivers.length) }} of {{ filteredDrivers.length }} results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useToast } from 'vue-toastification'

export default {
  name: 'ManageDrivers',
  setup() {
    const toast = useToast()

    const drivers = ref([])               // unified list (users+drivers)
    const loading = ref(true)
    const error = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const unsubs = ref([])                // multiple realtime listeners

    const filters = ref({
      status: '',
      vehicleType: '',
      rating: '',
      search: ''
    })

    // ---- helpers: normalize records from different collections ----
    const splitName = (full = '') => {
      const parts = full.trim().split(/\s+/)
      const first = parts[0] || ''
      const last = parts.slice(1).join(' ')
      return { firstName: first, lastName: last }
    }

    const toUnifiedDriver = (raw, id, source) => {
      const { firstName, lastName } = {
        firstName: raw.firstName || (raw.fullName ? splitName(raw.fullName).firstName : ''),
        lastName: raw.lastName || (raw.fullName ? splitName(raw.fullName).lastName : ''),
      }

      const motorcycleInfo = raw.driverInfo?.motorcycleInfo || {}
      const vehicleType = raw.vehicleType || motorcycleInfo.type || motorcycleInfo.vehicleType || ''
      const plateNumber = raw.plateNumber || motorcycleInfo.plateNumber || motorcycleInfo.plate || ''

      const applicationStatus = raw.driverInfo?.applicationStatus
      let status = (raw.status || '').toLowerCase()
      if (!status) {
        status = raw.banned ? 'suspended'
          : raw.approved ? 'active'
          : (applicationStatus || 'pending')
      }

      return {
        id,
        source, // 'users' | 'drivers'
        firstName,
        lastName,
        phone: raw.contact || raw.phone || '',
        email: raw.email || '',
        profilePicture: raw.profilePicture || raw.driverInfo?.documents?.profilePicture || '',
        vehicleType,
        plateNumber,
        status: String(status).toLowerCase(),
        rating: Number(raw.rating ?? raw.driverInfo?.rating ?? 0) || 0,
        deliveries: Number(raw.deliveries ?? 0) || 0,
        earnings: Number(raw.earnings ?? 0) || 0,
        approved: !!raw.approved,
        banned: !!raw.banned,
        raw
      }
    }

    // ---- metrics ----
    const totalDrivers = computed(() => drivers.value.length)
    const onlineDrivers = computed(() => drivers.value.filter(d => d.status === 'online').length)
    const pendingApplications = computed(() =>
      drivers.value.filter(d =>
        d.status === 'pending' || (!d.approved && d.status !== 'suspended')
      ).length
    )
    const averageRating = computed(() => {
      if (drivers.value.length === 0) return '0.0'
      const total = drivers.value.reduce((sum, d) => sum + (Number(d.rating) || 0), 0)
      return (total / drivers.value.length).toFixed(1)
    })

    // ---- filters + pagination ----
    const filteredDrivers = computed(() => {
      let filtered = [...drivers.value]

      if (filters.value.status) {
        filtered = filtered.filter(d => (d.status || '').toLowerCase() === filters.value.status.toLowerCase())
      }
      if (filters.value.vehicleType) {
        filtered = filtered.filter(d => (d.vehicleType || '').toLowerCase() === filters.value.vehicleType.toLowerCase())
      }
      if (filters.value.rating) {
        const minRating = parseInt(filters.value.rating)
        filtered = filtered.filter(d => (Number(d.rating) || 0) >= minRating)
      }
      if (filters.value.search) {
        const s = filters.value.search.toLowerCase()
        filtered = filtered.filter(d =>
          `${d.firstName} ${d.lastName}`.toLowerCase().includes(s) ||
          (d.phone || '').toLowerCase().includes(s) ||
          (d.email || '').toLowerCase().includes(s)
        )
      }
      return filtered
    })

    const totalPages = computed(() => Math.ceil(filteredDrivers.value.length / itemsPerPage.value))
    const paginatedDrivers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredDrivers.value.slice(start, end)
    })

    // ---- load data once (both sources) ----
    const loadDrivers = async () => {
      try {
        loading.value = true
        error.value = null

        const usersQuery = query(collection(db, 'users'), where('role', '==', 'driver'))
        const driversCol = collection(db, 'drivers')

        const [usersSnap, driversSnap] = await Promise.all([
          getDocs(usersQuery),
          getDocs(driversCol)
        ])

        const mapById = new Map()

        usersSnap.forEach(d => {
          const unified = toUnifiedDriver(d.data(), d.id, 'users')
          mapById.set(d.id, unified)
        })

        driversSnap.forEach(d => {
          const unified = toUnifiedDriver(d.data(), d.id, 'drivers')
          // prefer 'drivers' collection data if duplicate id exists
          mapById.set(d.id, unified)
        })

        drivers.value = Array.from(mapById.values())

        toast.success(`Loaded ${drivers.value.length} drivers`)
        currentPage.value = 1
      } catch (err) {
        console.error(err)
        error.value = `Failed to load drivers: ${err.message}`
        toast.error('Failed to load drivers from Firestore.')
      } finally {
        loading.value = false
      }
    }

    // ---- realtime listeners for both collections ----
    const setupRealtimeListeners = () => {
      try {
        const usersQuery = query(collection(db, 'users'), where('role', '==', 'driver'))
        const unsubUsers = onSnapshot(usersQuery, (qs) => {
          const existing = new Map(drivers.value.map(d => [d.id, d]))
          qs.forEach(d => {
            existing.set(d.id, toUnifiedDriver(d.data(), d.id, 'users'))
          })
          drivers.value = Array.from(existing.values())
          console.log('[Realtime] users/driver updated:', qs.size)
        }, (err) => console.error('[Realtime users] error:', err))

        const driversCol = collection(db, 'drivers')
        const unsubDrivers = onSnapshot(driversCol, (qs) => {
          const existing = new Map(drivers.value.map(d => [d.id, d]))
          qs.forEach(d => {
            existing.set(d.id, toUnifiedDriver(d.data(), d.id, 'drivers'))
          })
          drivers.value = Array.from(existing.values())
          console.log('[Realtime] drivers collection updated:', qs.size)
        }, (err) => console.error('[Realtime drivers] error:', err))

        unsubs.value.push(unsubUsers, unsubDrivers)
      } catch (err) {
        console.error('[Realtime] setup error:', err)
      }
    }

    // ---- UI helpers & actions ----
    const getStatusClass = (status) => {
      const s = (status || '').toLowerCase()
      const classes = {
        'online': 'bg-green-100 text-green-800',
        'offline': 'bg-gray-100 text-gray-800',
        'active': 'bg-blue-100 text-blue-800',
        'suspended': 'bg-red-100 text-red-800',
        'pending': 'bg-orange-100 text-orange-800'
      }
      return classes[s] || 'bg-gray-100 text-gray-800'
    }

    const viewDriver = (driver) => {
      toast.info(`Viewing details for ${(driver.firstName || '') + ' ' + (driver.lastName || '')}`)
    }

    const trackDriver = (driver) => {
      toast.info(`Tracking ${(driver.firstName || '') + ' ' + (driver.lastName || '')}`)
    }

    const suspendDriver = async (driver) => {
      try {
        const newStatus = driver.status === 'suspended' ? 'active' : 'suspended'
        const col = driver.source === 'drivers' ? 'drivers' : 'users'
        await updateDoc(doc(db, col, driver.id), { status: newStatus })

        // local optimistic update
        const idx = drivers.value.findIndex(d => d.id === driver.id)
        if (idx !== -1) drivers.value[idx].status = newStatus

        toast.success(newStatus === 'suspended' ? 'Driver suspended successfully' : 'Driver unsuspended successfully')
      } catch (err) {
        console.error('Error updating driver status:', err)
        toast.error('Failed to update driver status')
      }
    }

    const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
    const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

    onMounted(() => {
      loadDrivers()
      setupRealtimeListeners()
    })

    onUnmounted(() => {
      unsubs.value.forEach(u => { try { u && u() } catch {} })
      unsubs.value = []
    })

    return {
      drivers,
      loading,
      error,
      filters,
      currentPage,
      itemsPerPage,
      totalDrivers,
      onlineDrivers,
      pendingApplications,
      averageRating,
      filteredDrivers,
      paginatedDrivers,
      totalPages,
      loadDrivers,
      getStatusClass,
      viewDriver,
      trackDriver,
      suspendDriver,
      previousPage,
      nextPage
    }
  }
}
</script>
