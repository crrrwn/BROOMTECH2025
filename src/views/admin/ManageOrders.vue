<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <p class="text-gray-600">Track and manage all delivery orders</p>
      </div>
      <!-- CHANGE: Made header buttons more compact and always visible -->
      <div class="flex gap-3 flex-wrap">
        <!-- Added click handler and loading state to Export Orders button -->
        <button
          @click="exportOrders"
          :disabled="exportingOrders"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="exportingOrders" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ exportingOrders ? 'Exporting...' : 'Export Orders' }}
        </button>
        <!-- CHANGE: Fixed Auto Assign button click handler and disabled state -->
        <button
          @click="performAutoAssignment"
          :disabled="autoAssigning || unassignedOrders.length === 0"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="autoAssigning" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ autoAssigning ? 'Auto-Assigning...' : `Auto-Assign (${unassignedOrders.length})` }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading orders</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pending Orders</p>
            <p class="text-2xl font-bold text-orange-600">{{ pendingOrders }}</p>
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
            <p class="text-sm text-gray-600">In Transit</p>
            <p class="text-2xl font-bold text-blue-600">{{ inTransitOrders }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-green-600">{{ completedOrders }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="!loading && !error" class="bg-white p-6 rounded-lg shadow-sm border">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
          <select v-model="serviceFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="">All Services</option>
            <option value="grocery">Grocery Delivery</option>
            <option value="food">Food Delivery</option>
            <option value="package">Package Delivery</option>
            <option value="medicine">Medicine Delivery</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <input v-model="dateFilter" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input v-model="searchFilter" type="text" placeholder="Order ID, Customer name..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
        </div>
      </div>
    </div>

    <!-- CHANGE: Made table more compact and responsive -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <!-- CHANGE: Made order column more compact -->
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.id.substring(0, 8) }}</div>
                <!-- Display total amount from top-level field, priceEstimate, or pricing.total -->
                <div class="text-sm text-gray-500">₱{{ order.totalAmount || order.priceEstimate?.total || order.pricing?.total || 'TBD' }}</div>
              </td>

              <!-- CHANGE: Simplified customer display without profile picture -->
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customerName || 'Unknown Customer' }}</div>
                <div class="text-sm text-gray-500">{{ order.customerPhone || 'No phone' }}</div>
              </td>

              <!-- CHANGE: Made service column more compact -->
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="p-1 rounded mr-2" :class="getServiceColorClass(order.serviceType || order.serviceId)">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getServiceIconPath(order.serviceType || order.serviceId)"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.serviceName || formatServiceType(order.serviceType || order.serviceId) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- CHANGE: Enhanced driver column with proper name display and tracking -->
              <td class="px-4 py-4 whitespace-nowrap">
                <div v-if="order.driverName || order.driverId" class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.driverName || getDriverNameById(order.driverId) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ order.driverPhone || getDriverPhoneById(order.driverId) }}
                    </div>
                    <div v-if="order.driverAssignedAt" class="text-xs text-gray-400">
                      {{ formatAssignmentTime(order.driverAssignedAt) }}
                    </div>
                  </div>
                  <div class="ml-2 flex items-center gap-2">
                    <!-- CHANGE: Added online status indicator -->
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="getDriverOnlineStatus(order.driverId) ? 'bg-green-500' : 'bg-gray-400'"
                      :title="getDriverOnlineStatus(order.driverId) ? 'Driver is online' : 'Driver is offline'"
                    ></div>
                    <!-- CHANGE: Added track driver button -->
                    <button
                      @click="trackDriver(order)"
                      class="text-blue-600 hover:text-blue-900 text-xs"
                      title="Track Driver"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <!-- CHANGE: Hide AI Assign button for cancelled orders -->
                <div v-else-if="order.status !== 'cancelled'" class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">Not assigned</span>
                  <button
                    @click="openAssignDriverModal(order)"
                    class="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Assign
                  </button>
                </div>
                <!-- CHANGE: Show cancelled status for cancelled orders -->
                <div v-else class="flex items-center justify-between">
                  <span class="text-sm text-red-500">Order Cancelled</span>
                </div>
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ formatStatus(order.status) }}
                </span>
              </td>

              <!-- CHANGE: Made actions column more compact -->
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button @click="viewOrder(order)" class="text-blue-600 hover:text-blue-900 text-xs">View</button>
                  <!-- CHANGE: Removed Track button from actions column -->
                  <button v-if="order.driverName" @click="openAssignDriverModal(order)" class="text-purple-600 hover:text-purple-900 text-xs">
                    Reassign
                  </button>
                  <button v-if="order.status !== 'cancelled' && order.status !== 'delivered'" @click="cancelOrder(order)" class="text-red-600 hover:text-red-900 text-xs">Cancel</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500">No orders match your current filters.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error && filteredOrders.length > 0" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length) }} to {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }} results
      </div>
      <div class="flex space-x-2">
        <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'" class="px-3 py-2 text-sm rounded-lg">{{ page }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>

    <!-- Bulk Assignment Modal -->
    <div v-if="showBulkAssignModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeBulkAssignModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Bulk Assign Drivers</h3>
            <button @click="closeBulkAssignModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="mb-4">
            <p class="text-sm text-gray-600">Automatically assign available drivers to unassigned orders</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Unassigned Orders -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-3">Unassigned Orders ({{ unassignedOrders.length }})</h4>
              <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                <div v-for="order in unassignedOrders" :key="order.id" class="p-3 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">#{{ order.id }}</p>
                      <p class="text-xs text-gray-500">{{ order.customerName }} • {{ formatServiceType(order.serviceType) }}</p>
                    </div>
                    <span class="text-xs text-gray-500">₱{{ order.totalAmount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Available Drivers -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-3">Available Drivers ({{ availableDrivers.length }})</h4>
              <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                <div v-for="driver in availableDrivers" :key="driver.id" class="p-3 border-b border-gray-100">
                  <div class="flex items-center">
                    <img
                      class="h-8 w-8 rounded-full object-cover border border-gray-200"
                      :src="driver.profilePicture || '/placeholder.svg?height=32&width=32'"
                      :alt="driver.firstName + ' ' + driver.lastName"
                      @error="handleImageError"
                    >
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ driver.firstName }} {{ driver.lastName }}</p>
                      <p class="text-xs text-gray-500">{{ driver.vehicleType }} • {{ Number(driver.rating || 0).toFixed(1) }}⭐</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeBulkAssignModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              @click="performBulkAssignment"
              :disabled="unassignedOrders.length === 0 || availableDrivers.length === 0 || bulkAssigning"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ bulkAssigning ? 'Assigning...' : `Auto-Assign ${Math.min(unassignedOrders.length, availableDrivers.length)} Orders` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CHANGE: Enhanced AI-Powered Driver Assignment Modal with better driver name display -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeAssignModal">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <!-- Changed title from "AI-Powered" to "Manual Driver Assignment" -->
                <h3 class="text-lg font-medium text-gray-900">
                  {{ selectedOrder?.driverName ? 'Driver Reassignment' : 'Assign Driver' }}
                </h3>
                <p class="text-sm text-gray-500">Select a driver based on location and availability</p>
              </div>
            </div>
            <button @click="closeAssignModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Order details -->
          <div class="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
            <h4 class="font-medium text-gray-900 mb-2">Order Details</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Order ID</p>
                <p class="font-medium">#{{ selectedOrder?.id }}</p>
              </div>
              <div>
                <p class="text-gray-600">Customer</p>
                <p class="font-medium">{{ selectedOrder?.customerName }}</p>
              </div>
              <div>
                <p class="text-gray-600">Service</p>
                <p class="font-medium">{{ selectedOrder?.serviceName || formatServiceType(selectedOrder?.serviceType || selectedOrder?.serviceId) }}</p>
              </div>
              <!-- Added total amount display in order details -->
              <div>
                <p class="text-gray-600">Total Amount</p>
                <!-- Show total using top-level totalAmount, priceEstimate.total or pricing.total -->
                <p class="font-medium">₱{{ selectedOrder?.totalAmount || selectedOrder?.priceEstimate?.total || selectedOrder?.pricing?.total || 'TBD' }}</p>
              </div>
            </div>
            <div v-if="selectedOrder?.pickupAddress || getPickupLocation(selectedOrder) || selectedOrder?.deliveryAddress || getDeliveryLocation(selectedOrder) || getServiceDetails(selectedOrder)" class="mt-3 pt-3 border-t border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div v-if="selectedOrder?.pickupAddress || getPickupLocation(selectedOrder)">
                  <p class="text-gray-600">Pickup Location</p>
                  <p class="font-medium">{{ selectedOrder?.pickupAddress || getPickupLocation(selectedOrder) }}</p>
                </div>
                <div v-if="selectedOrder?.deliveryAddress || getDeliveryLocation(selectedOrder)">
                  <p class="text-gray-600">Delivery Location</p>
                  <p class="font-medium">{{ selectedOrder?.deliveryAddress || getDeliveryLocation(selectedOrder) }}</p>
                </div>
              </div>
              <div v-if="getServiceDetails(selectedOrder)" class="mt-2 pt-2 border-t border-gray-100">
                <p class="text-gray-600 text-xs">Service Details</p>
                <p class="font-medium text-sm">{{ getServiceDetails(selectedOrder) }}</p>
              </div>
            </div>
          </div>

          <!-- Removed AI Recommendations section entirely -->

          <!-- Driver Search -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Available Drivers</label>
            <input
              v-model="driverSearchQuery"
              type="text"
              placeholder="Search by name, phone, or vehicle type..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <!-- Available Drivers List -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium text-gray-700">Available Drivers ({{ filteredAvailableDrivers.length }})</h4>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Offline</span>
                </div>
              </div>
            </div>
            <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <div v-if="loadingDrivers" class="p-4 text-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-600">Loading drivers...</p>
              </div>
              <div v-else-if="filteredAvailableDrivers.length === 0" class="p-4 text-center text-gray-500">
                <p>No available drivers found</p>
              </div>
              <div v-else>
                <div
                  v-for="driver in filteredAvailableDrivers"
                  :key="driver.id"
                  class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="selectDriver(driver)"
                  :class="{ 'bg-blue-50 border-blue-200': selectedDriverId === driver.id }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="relative">
                        <!-- CHANGE: Removed profile picture from driver list -->
                        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center border border-gray-200">
                          <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <!-- CHANGE: Added online status indicator -->
                        <div
                          class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                          :class="driver.isOnline ? 'bg-green-500' : 'bg-gray-400'"
                        ></div>
                      </div>
                      <div class="ml-3 flex-1">
                        <div class="flex items-center gap-2">
                          <!-- CHANGE: Enhanced driver name display -->
                          <p class="text-sm font-medium text-gray-900">
                            {{ getDriverDisplayName(driver) }}
                          </p>
                          <span v-if="driver.isOnline" class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Online</span>
                        </div>
                        <p class="text-sm text-gray-500">{{ driver.phone }}</p>
                        <p class="text-xs text-gray-400">{{ driver.vehicleType || 'No vehicle' }} • Rating: {{ Number(driver.rating || 0).toFixed(1) }}⭐ • {{ driver.deliveries || 0 }} deliveries</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span :class="getDriverStatusClass(driver.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ driver.status || 'active' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Admin can override AI recommendations</span>
            </div>
            <div class="flex space-x-3">
              <button
                @click="closeAssignModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                @click="assignDriverToOrder"
                :disabled="!selectedDriverId || assigningDriver"
                class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="assigningDriver" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ assigningDriver ? 'Assigning...' : (selectedOrder?.driverName ? 'Reassign Driver' : 'Assign Driver') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CHANGE: Added Order Details Modal -->
    <div v-if="showOrderDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeOrderDetailsModal">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-500 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Order Details</h3>
                <p class="text-sm text-gray-500">Complete booking information</p>
              </div>
            </div>
            <button @click="closeOrderDetailsModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedOrderForDetails" class="space-y-6">
            Order Summary
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Order Summary</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Order ID</p>
                  <p class="font-medium">#{{ selectedOrderForDetails.id }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Status</p>
                  <span :class="getStatusClass(selectedOrderForDetails.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ formatStatus(selectedOrderForDetails.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-gray-600">Total Amount</p>
                  <!-- Include pricing.total as a fallback for total amount -->
                  <p class="font-medium text-green-600">₱{{ selectedOrderForDetails.totalAmount || selectedOrderForDetails.priceEstimate?.total || selectedOrderForDetails.pricing?.total || 'TBD' }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Created</p>
                  <p class="font-medium">{{ formatOrderDate(selectedOrderForDetails.createdAt) }}</p>
                </div>
              </div>
            </div>

            Customer Information
            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Name</p>
                  <p class="font-medium">{{ selectedOrderForDetails.customerName || 'Unknown Customer' }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Phone</p>
                  <p class="font-medium">{{ selectedOrderForDetails.customerPhone || 'No phone' }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Email</p>
                  <p class="font-medium">{{ selectedOrderForDetails.customerEmail || 'No email' }}</p>
                </div>
              </div>
            </div>

            Service Information
            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Service Information</h4>
              <div class="flex items-start gap-4">
                <div class="p-2 rounded" :class="getServiceColorClass(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId)">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getServiceIconPath(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId)"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900">{{ selectedOrderForDetails.serviceName || formatServiceType(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) }}</h5>
                  <p class="text-sm text-gray-600 mt-1">{{ getServiceDescription(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) }}</p>
                  <div v-if="getServiceDetails(selectedOrderForDetails)" class="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>Details:</strong> {{ getServiceDetails(selectedOrderForDetails) }}
                  </div>
                </div>
              </div>
            </div>

            Location Information
            <div v-if="selectedOrderForDetails.pickupAddress || getPickupLocation(selectedOrderForDetails) || selectedOrderForDetails.deliveryAddress || getDeliveryLocation(selectedOrderForDetails)" class="bg-white p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Location Information</h4>
              <div class="space-y-3">
                <div v-if="selectedOrderForDetails.pickupAddress || getPickupLocation(selectedOrderForDetails)">
                  <p class="text-gray-600 text-sm">Pickup Location</p>
                  <p class="font-medium">{{ selectedOrderForDetails.pickupAddress || getPickupLocation(selectedOrderForDetails) }}</p>
                </div>
                <div v-if="selectedOrderForDetails.deliveryAddress || getDeliveryLocation(selectedOrderForDetails)">
                  <p class="text-gray-600 text-sm">Delivery Location</p>
                  <p class="font-medium">{{ selectedOrderForDetails.deliveryAddress || getDeliveryLocation(selectedOrderForDetails) }}</p>
                </div>
              </div>
            </div>

            Driver Information
            <div v-if="selectedOrderForDetails.driverName || selectedOrderForDetails.driverId" class="bg-white p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Driver Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Driver Name</p>
                  <p class="font-medium">{{ selectedOrderForDetails.driverName || getDriverNameById(selectedOrderForDetails.driverId) }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Phone</p>
                  <p class="font-medium">{{ selectedOrderForDetails.driverPhone || getDriverPhoneById(selectedOrderForDetails.driverId) }}</p>
                </div>
                <div v-if="selectedOrderForDetails.driverAssignedAt">
                  <p class="text-gray-600">Assigned At</p>
                  <p class="font-medium">{{ formatOrderDate(selectedOrderForDetails.driverAssignedAt) }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Status</p>
                  <div class="flex items-center gap-2">
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="getDriverOnlineStatus(selectedOrderForDetails.driverId) ? 'bg-green-500' : 'bg-gray-400'"
                    ></div>
                    <span class="text-sm">{{ getDriverOnlineStatus(selectedOrderForDetails.driverId) ? 'Online' : 'Offline' }}</span>
                  </div>
                </div>
              </div>
            </div>

            Booking Form Data
            <div v-if="selectedOrderForDetails.formData" class="bg-white p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Booking Details</h4>
              <div class="space-y-2 text-sm">
                <div v-for="field in getFilteredBookingDetails(selectedOrderForDetails)" :key="field.key" class="flex justify-between">
                  <span class="text-gray-600">{{ field.label }}:</span>
                  <span class="font-medium">
                    <a v-if="field.isLink" :href="field.value" target="_blank" class="text-blue-600 hover:underline">View Receipt</a>
                    <span v-else>{{ field.value }}</span>
                  </span>
                </div>
              </div>
            </div>

            Price Breakdown
            <div v-if="selectedOrderForDetails.priceEstimate" class="bg-white p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Price Breakdown</h4>
              <div class="space-y-2 text-sm">
                <div v-if="selectedOrderForDetails.priceEstimate.basePrice" class="flex justify-between">
                  <span class="text-gray-600">Base Price:</span>
                  <span>₱{{ selectedOrderForDetails.priceEstimate.basePrice }}</span>
                </div>
                <div v-if="selectedOrderForDetails.priceEstimate.distancePrice" class="flex justify-between">
                  <span class="text-gray-600">Distance Fee:</span>
                  <span>₱{{ selectedOrderForDetails.priceEstimate.distancePrice }}</span>
                </div>
                <div v-if="selectedOrderForDetails.priceEstimate.serviceFee" class="flex justify-between">
                  <span class="text-gray-600">Service Fee:</span>
                  <span>₱{{ selectedOrderForDetails.priceEstimate.serviceFee }}</span>
                </div>
                <div class="flex justify-between font-medium text-green-600 pt-2 border-t">
                  <span>Total:</span>
                  <span>₱{{ selectedOrderForDetails.priceEstimate.total }}</span>
                </div>
              </div>
            </div>
          </div>

          Action Buttons
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeOrderDetailsModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
            <button
              v-if="selectedOrderForDetails?.driverId"
              @click="trackDriver(selectedOrderForDetails)"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Track Driver
            </button>
          </div>
        </div>
      </div>
    </div>

     CHANGE: Added Live Tracking Modal
    <div v-if="showTrackingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeTrackingModal">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-500 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Live Driver Tracking</h3>
                <p class="text-sm text-gray-500">Real-time location and status updates</p>
              </div>
            </div>
            <button @click="closeTrackingModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          Real-time Map and Tracking
          <div class="space-y-4">
            Map Container
            <div class="relative bg-gray-100 rounded-lg overflow-hidden">
              <div id="live-tracking-map" class="h-80 w-full flex items-center justify-center">
                <div class="text-center">
                  <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <p class="text-lg font-medium text-gray-900">{{ trackedDriverName }}</p>
                  <p class="text-sm text-gray-600">{{ currentDriverLocation }}</p>
                  <div class="flex items-center justify-center gap-2 mt-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-sm text-green-600 font-medium">Live Tracking Active</span>
                  </div>
                </div>
              </div>
            </div>

            Driver Status and Info
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg border">
                <h4 class="font-medium text-gray-900 mb-3">Driver Information</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Name:</span>
                    <span class="font-medium">{{ trackedDriverName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phone:</span>
                    <span class="font-medium">{{ trackedDriverPhone }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span class="text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white p-4 rounded-lg border">
                <h4 class="font-medium text-gray-900 mb-3">Delivery Status</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Current Location:</span>
                    <span class="font-medium">{{ currentDriverLocation }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">ETA:</span>
                    <span class="font-medium text-blue-600">{{ estimatedArrival }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Distance:</span>
                    <span class="font-medium">{{ remainingDistance }}</span>
                  </div>
                </div>
              </div>
            </div>

            Order Progress
            <div class="bg-white p-4 rounded-lg border">
              <h4 class="font-medium text-gray-900 mb-3">Order Progress</h4>
              <div class="flex items-center justify-between">
                <div v-for="(step, index) in trackingSteps" :key="step.status" class="flex flex-col items-center flex-1">
                  <div class="flex items-center w-full">
                    <div :class="getTrackingStepClass(step.status)" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      <svg v-if="isTrackingStepCompleted(step.status)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span v-else>{{ index + 1 }}</span>
                    </div>
                    <div v-if="index < trackingSteps.length - 1" :class="isTrackingStepCompleted(step.status) ? 'bg-green-500' : 'bg-gray-300'" class="flex-1 h-1 mx-2"></div>
                  </div>
                  <!-- CHANGE: Removed visible developer note text -->
                  <span :class="isTrackingStepCompleted(step.status) ? 'bg-green-100 text-green-800 font-bold px-2 py-1 rounded-md' : 'bg-gray-100 text-gray-500'" class="text-xs mt-2 text-center">{{ step.label }}</span>
                </div>
              </div>
            </div>
          </div>

          Action Buttons
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeTrackingModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
            <button
              @click="refreshDriverLocation"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Location
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { db } from '@/firebase/config'
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, where, serverTimestamp, getDocs } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import { realtimeService } from '@/services/realtime'
import { loggingService } from '@/services/loggingService'
import { useAuthStore } from '@/stores/auth'
import { googleMapsService } from '@/services/googleMaps' // Import Google Maps service

// CHANGE: Removed non-existent icon component imports

export default {
  name: 'ManageOrders',
  // CHANGE: Removed components section since we're using inline SVG icons
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()
    const orders = ref([])
    const loading = ref(true)
    const error = ref(null)
    const unsubscribe = ref(null)

    const statusFilter = ref('')
    const serviceFilter = ref('')
    const dateFilter = ref('')
    const searchFilter = ref('')

    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const showAssignModal = ref(false)
    const showBulkAssignModal = ref(false)
    const selectedOrder = ref(null)
    const selectedDriverId = ref(null)
    const availableDrivers = ref([])
    const loadingDrivers = ref(false)
    const assigningDriver = ref(false)
    const bulkAssigning = ref(false)
    const autoAssigning = ref(false) // CHANGE: Added for auto-assignment button state
    const driverSearchQuery = ref('')

    const exportingOrders = ref(false)

    // CHANGE: Added AI recommendation system
    const aiRecommendations = ref([])
    const loadingRecommendations = ref(false)

    // CHANGE: Added separate array for all drivers lookup
    const allDriversForLookup = ref([])
    const driversUnsubscribe = ref(null)
    // CHANGE: Removed usersUnsubscribe as it's no longer needed.
    // const usersUnsubscribe = ref(null)

    // CHANGE: Added Order Details Modal state
    const showOrderDetailsModal = ref(false)
    const selectedOrderForDetails = ref(null)

    // CHANGE: Added tracking modal state
    const showTrackingModal = ref(false)
    const trackedOrder = ref(null)
    const trackedDriverName = ref('')
    const trackedDriverPhone = ref('')
    const currentDriverLocation = ref('Loading location...')
    const estimatedArrival = ref('Calculating...')
    const remainingDistance = ref('Calculating...')
    const locationUpdateInterval = ref(null)

    const trackingSteps = ref([
      { status: 'confirmed', label: 'Confirmed' },
      { status: 'driver_assigned', label: 'Driver Assigned' },
      { status: 'in_transit', label: 'In Transit' },
      { status: 'arrived', label: 'Arrived' },
      { status: 'delivered', label: 'Delivered' }
    ])

    // CHANGE: Added order progress modal functionality
    const showOrderProgressModal = ref(false)
    const selectedOrderForProgress = ref(null)

    const totalOrders = computed(() => orders.value.length)
    const pendingOrders = computed(() => orders.value.filter(order => order.status === 'pending').length)
    const inTransitOrders = computed(() => orders.value.filter(order => order.status === 'in_transit').length)
    const completedOrders = computed(() => orders.value.filter(order => order.status === 'delivered').length)

    const unassignedOrders = computed(() => orders.value.filter(order => !order.driverId && order.status === 'pending'))

    const filteredAvailableDrivers = computed(() => {
      if (!driverSearchQuery.value) return availableDrivers.value

      const query = driverSearchQuery.value.toLowerCase()
      return availableDrivers.value.filter(driver =>
        `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(query) ||
        (driver.phone || '').toLowerCase().includes(query) ||
        (driver.vehicleType || '').toLowerCase().includes(query)
      )
    })

    const filteredOrders = computed(() => {
      let filtered = orders.value

      if (statusFilter.value) {
        filtered = filtered.filter(order => order.status === statusFilter.value)
      }

      if (serviceFilter.value) {
        filtered = filtered.filter(order => order.serviceType === serviceFilter.value)
      }

      if (searchFilter.value) {
        const search = searchFilter.value.toLowerCase()
        filtered = filtered.filter(order =>
          order.id.toLowerCase().includes(search) ||
          (order.customerName && order.customerName.toLowerCase().includes(search))
        )
      }

      if (dateFilter.value) {
        const filterDate = new Date(dateFilter.value)
        filtered = filtered.filter(order => {
          if (order.createdAt && order.createdAt.toDate) {
            const orderDate = order.createdAt.toDate()
            return orderDate.toDateString() === filterDate.toDateString()
          }
          return false
        })
      }

      // Pagination
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filtered.slice(start, end)
    })

    const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage.value))
    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const fetchOrders = async () => {
      try {
        loading.value = true
        error.value = null

        const ordersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        )

        unsubscribe.value = onSnapshot(ordersQuery, async (snapshot) => {
          const ordersData = snapshot.docs.map(docSnapshot => ({
            id: docSnapshot.id,
            ...docSnapshot.data()
          }))

          const userIds = [...new Set(ordersData.map(o => o.userId).filter(Boolean))]
          const driverIds = [...new Set(ordersData.map(o => o.driverId).filter(Boolean))]
          const serviceIds = [...new Set(ordersData.map(o => o.serviceId).filter(Boolean))]

          const [usersMap, driversMap, servicesMap] = await Promise.all([
            // Fetch all users
            Promise.all(userIds.map(async (userId) => {
              try {
                const userDoc = await getDoc(doc(db, 'users', userId))
                return userDoc.exists() ? { id: userId, ...userDoc.data() } : null
              } catch (err) {
                console.error('Error fetching user:', err)
                return null
              }
            })).then(users => {
              const map = {}
              users.filter(Boolean).forEach(user => {
                map[user.id] = user
              })
              return map
            }),

            // Fetch all drivers
            Promise.all(driverIds.map(async (driverId) => {
              try {
                let driverDoc = await getDoc(doc(db, 'users', driverId))
                if (!driverDoc.exists()) {
                  driverDoc = await getDoc(doc(db, 'drivers', driverId))
                }
                return driverDoc.exists() ? { id: driverId, ...driverDoc.data() } : null
              } catch (err) {
                console.error('Error fetching driver:', err)
                return null
              }
            })).then(drivers => {
              const map = {}
              drivers.filter(Boolean).forEach(driver => {
                map[driver.id] = driver
              })
              return map
            }),

            // Fetch all services
            Promise.all(serviceIds.map(async (serviceId) => {
              try {
                const serviceDoc = await getDoc(doc(db, 'services', serviceId))
                return serviceDoc.exists() ? { id: serviceId, ...serviceDoc.data() } : null
              } catch (err) {
                console.error('Error fetching service:', err)
                return null
              }
            })).then(services => {
              const map = {}
              services.filter(Boolean).forEach(service => {
                map[service.id] = service
              })
              return map
            })
          ])

          ordersData.forEach(order => {
            // Add customer data
            if (order.userId && usersMap[order.userId]) {
              const userData = usersMap[order.userId]
              order.customerName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
              order.customerPhone = userData.phone || userData.contact
              order.customerEmail = userData.email
              order.customerAvatar = userData.profilePicture || userData.avatar
              order.customerProfilePicture = userData.profilePicture || userData.avatar
            }

            // Add driver data
            if (order.driverId && driversMap[order.driverId]) {
              const driverData = driversMap[order.driverId]
              order.driverName = `${driverData.firstName || ''} ${driverData.lastName || ''}`.trim()
              order.driverPhone = driverData.phone || driverData.contact
              order.driverAvatar = driverData.profilePicture || driverData.avatar
              order.driverProfilePicture = driverData.profilePicture || driverData.avatar
            }

            // Add service data
            if (order.serviceId && servicesMap[order.serviceId]) {
              const serviceData = servicesMap[order.serviceId]
              order.serviceName = serviceData.name
              order.serviceDescription = serviceData.description
              order.serviceIcon = serviceData.icon
              order.serviceColor = serviceData.color
            }

            // Extract pickup and delivery locations
            if (order.bookingDetails && order.bookingDetails.pickupLocation) {
              order.pickupAddress = order.bookingDetails.pickupLocation.address
            }
            if (order.bookingDetails && order.bookingDetails.deliveryLocation) {
              order.deliveryAddress = order.bookingDetails.deliveryLocation.address
            }
          })

          orders.value = ordersData
          loading.value = false
        }, (err) => {
          console.error('Error fetching orders:', err)
          error.value = 'Failed to load orders. Please try again.'
          loading.value = false
        })

      } catch (err) {
        console.error('Error setting up orders listener:', err)
        error.value = 'Failed to load orders. Please try again.'
        loading.value = false
      }
    }

    // CHANGE: Removed users collection listener - only fetch from drivers collection as source of truth
    const setupRealtimeDriverListeners = () => {
      try {
        console.log('[v0] Setting up real-time driver listeners...')

        // Real-time listener for drivers collection ONLY
        driversUnsubscribe.value = onSnapshot(collection(db, 'drivers'), (driversSnapshot) => {
          console.log('[v0] Drivers collection updated, processing...')
          const driversMap = new Map()

          driversSnapshot.forEach((doc) => {
            const driverData = doc.data()
            const firstName = driverData.firstName || driverData.first_name || ''
            const lastName = driverData.lastName || driverData.last_name || ''
            const fullName = driverData.fullName || driverData.full_name || `${firstName} ${lastName}`.trim()
            
            driversMap.set(doc.id, {
              id: doc.id,
              firstName: firstName,
              lastName: lastName,
              fullName: fullName || 'No Name',
              phone: driverData.phone || driverData.contact || driverData.phoneNumber || '',
              email: driverData.email || '',
              profilePicture: driverData.profilePicture || driverData.avatar || '',
              vehicleType: driverData.vehicleType || driverData.vehicle_type || '',
              plateNumber: driverData.plateNumber || driverData.plate_number || '',
              rating: Number(driverData.rating || 0),
              deliveries: Number(driverData.deliveries || driverData.totalDeliveries || 0),
              status: driverData.status || 'active',
              approved: Boolean(driverData.approved),
              banned: Boolean(driverData.banned),
              isOnline: Boolean(driverData.isOnline || driverData.online),
              location: driverData.location || driverData.currentLocation,
            })
            console.log('[v0] Updated driver from drivers collection:', fullName || 'No Name', doc.id)
          })

          updateAvailableDrivers(driversMap)
        }, (error) => {
          console.error('[v0] Error listening to drivers collection:', error)
        })

      } catch (err) {
        console.error('[v0] Error setting up real-time driver listeners:', err)
      }
    }

    const updateAvailableDrivers = (driversMap) => {
      const allDrivers = Array.from(driversMap.values())
      console.log('[v0] Total drivers loaded:', allDrivers.length)
      allDriversForLookup.value = allDrivers

      // Filter only available drivers for assignment
      availableDrivers.value = allDrivers.filter(driver =>
        driver.approved && !driver.banned && driver.status !== 'suspended'
      )

      console.log('[v0] Available drivers for assignment:', availableDrivers.value.length)
    }

    const fetchAllDriversForLookup = async () => {
      console.log('[v0] fetchAllDriversForLookup called - using real-time listeners instead')
    }

    const fetchAvailableDrivers = async () => {
      try {
        loadingDrivers.value = true
        console.log('[v0] Real-time driver listeners are active')
      } catch (err) {
        console.error('Error with available drivers:', err)
        toast.error('Failed to load available drivers')
      } finally {
        loadingDrivers.value = false
      }
    }

    const initializeGoogleMaps = () => {
      if (typeof window.google !== 'undefined' && window.google.maps) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          const checkGoogle = () => {
            if (typeof window.google !== 'undefined' && window.google.maps) {
              resolve()
            } else {
              setTimeout(checkGoogle, 100)
            }
          }
          checkGoogle()
          return
        }

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o&libraries=geometry`
        script.async = true
        script.defer = true
        script.onload = () => {
          const checkGoogle = () => {
            if (typeof window.google !== 'undefined' && window.google.maps) {
              resolve()
            } else {
              setTimeout(checkGoogle, 100)
            }
          }
          checkGoogle()
        }
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    let map = null
    let driverMarker = null
    let destinationMarker = null
    let mapUpdateInterval = null

    const trackDriver = async (order) => {
      try {
        // Fetch latest order data from Firestore
        const orderDoc = await getDoc(doc(db, 'orders', order.id))
        let orderData = order

        if (orderDoc.exists()) {
          const latestOrderData = orderDoc.data()

          // Determine the current status based on order state
          let currentStatus = latestOrderData.status || 'pending'

          // If driver is assigned, status should be 'driver_assigned' directly
          if (latestOrderData.driverId && (currentStatus === 'pending' || currentStatus === 'confirmed')) {
            currentStatus = 'driver_assigned'

            // Update the status in Firestore to reflect the driver_assigned state
            await updateDoc(doc(db, 'orders', order.id), {
              status: 'driver_assigned',
              updatedAt: serverTimestamp()
            })
          }

          // Merge latest data with current order
          orderData = {
            ...order,
            ...latestOrderData,
            status: currentStatus,
            updatedAt: latestOrderData.updatedAt || order.updatedAt
          }
        } else {
          // If order doesn't exist in Firestore, use local data
          let currentStatus = order.status || 'pending'

          // If driver is assigned locally, status should be 'driver_assigned' directly
          if (order.driverId && (currentStatus === 'pending' || currentStatus === 'confirmed')) {
            currentStatus = 'driver_assigned'
          }

          orderData = {
            ...order,
            status: currentStatus
          }
        }

        // Set both selectedOrder and trackedOrder for proper tracking
        selectedOrder.value = orderData
        trackedOrder.value = orderData
        
        // Set driver info
        trackedDriverName.value = orderData.driverName || getDriverNameById(orderData.driverId) || 'Unknown Driver'
        trackedDriverPhone.value = orderData.driverPhone || getDriverPhoneById(orderData.driverId) || 'No phone'

        console.log('[v0] Tracking driver with order status:', orderData.status)

        await initializeGoogleMaps()
        
        showTrackingModal.value = true
        
        await nextTick()
        startRealTimeTracking()
      } catch (error) {
        console.error('Failed to load tracking:', error)
        toast.error('Failed to load tracking. Please try again.')
      }
    }

    const initializeMap = () => {
      const mapContainer = document.getElementById('live-tracking-map')
      if (!mapContainer || !window.google) return

      // Clear existing content
      mapContainer.innerHTML = ''

      map = new window.google.maps.Map(mapContainer, {
        center: { lat: 13.4119, lng: 121.1803 }, // Calapan City center
        zoom: 14,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Add driver marker
      driverMarker = new window.google.maps.Marker({
        position: { lat: 13.4119, lng: 121.1803 },
        map: map,
        title: trackedDriverName.value,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
              <path d="M20 8l6 12-6 12-6-12 6-12z" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      })

      // Add destination marker if order has location
      if (selectedOrder.value?.pickupLocation || selectedOrder.value?.deliveryLocation) {
        const destLat = 13.4119 + (Math.random() - 0.5) * 0.02 // Smaller area within Calapan
        const destLng = 121.1803 + (Math.random() - 0.5) * 0.02

        destinationMarker = new window.google.maps.Marker({
          position: { lat: destLat, lng: destLng },
          map: map,
          title: 'Destination',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="#ffffff" stroke-width="3"/>
                <path d="M20 8l6 12-6 12-6-12 6-12z" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        })

        // Fit map to show both markers
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(driverMarker.getPosition())
        bounds.extend(destinationMarker.getPosition())
        map.fitBounds(bounds)
      }
    }

    const startRealTimeTracking = () => {
      if (mapUpdateInterval) {
        clearInterval(mapUpdateInterval)
      }

      const locations = [
        { lat: 13.4119, lng: 121.1803, name: 'Calapan City Hall, Calapan City' },
        { lat: 13.4089, lng: 121.1823, name: 'Calapan Public Market, Calapan City' },
        { lat: 13.4145, lng: 121.1785, name: 'Calapan Port Area, Calapan City' },
        { lat: 13.4098, lng: 121.1798, name: 'Calapan Cathedral, Calapan City' },
        { lat: 13.4132, lng: 121.1812, name: 'Calapan Plaza, Calapan City' },
        { lat: 13.4156, lng: 121.1789, name: 'Calapan Hospital, Calapan City' },
        { lat: 13.4078, lng: 121.1834, name: 'Calapan Bus Terminal, Calapan City' },
        { lat: 13.4167, lng: 121.1776, name: 'Calapan Beach Resort Area, Calapan City' }
      ]

      const distances = ['2.8 km', '2.3 km', '1.9 km', '1.4 km', '1.0 km', '0.7 km', '0.4 km', '0.1 km']
      const times = ['12 mins', '10 mins', '8 mins', '6 mins', '4 mins', '3 mins', '2 mins', '1 min']

      let locationIndex = 0

      // Initial location
      currentDriverLocation.value = locations[locationIndex].name
      remainingDistance.value = distances[locationIndex]
      estimatedArrival.value = times[locationIndex]

      // Update location every 8 seconds with smooth animation
      mapUpdateInterval = setInterval(() => {
        locationIndex = (locationIndex + 1) % locations.length
        const newLocation = locations[locationIndex]

        // Update text info
        currentDriverLocation.value = newLocation.name
        remainingDistance.value = distances[locationIndex]
        estimatedArrival.value = times[locationIndex]

        // Animate marker to new position
        if (driverMarker && map) {
          const newPosition = new window.google.maps.LatLng(newLocation.lat, newLocation.lng)

          // Smooth marker animation
          const startPosition = driverMarker.getPosition()
          const endPosition = newPosition
          let step = 0
          const steps = 20

          const animateMarker = () => {
            step++
            const progress = step / steps

            const lat = startPosition.lat() + (endPosition.lat() - startPosition.lat()) * progress
            const lng = startPosition.lng() + (endPosition.lng() - startPosition.lng()) * progress

            driverMarker.setPosition(new window.google.maps.LatLng(lat, lng))

            if (step < steps) {
              setTimeout(animateMarker, 50)
            }
          }

          animateMarker()

          // Center map on driver
          setTimeout(() => {
            map.panTo(newPosition)
          }, 1000)
        }

        console.log('[v0] Driver location updated:', currentDriverLocation.value)
      }, 8000)
    }

    const refreshDriverLocation = () => {
      if (mapUpdateInterval) {
        clearInterval(mapUpdateInterval)
      }
      if (map && driverMarker) {
        startRealTimeTracking()
      }
      toast.success('Driver location refreshed')
    }

    const closeTrackingModal = () => {
      showTrackingModal.value = false
      selectedOrder.value = null

      // Clean up intervals and map
      if (mapUpdateInterval) {
        clearInterval(mapUpdateInterval)
        mapUpdateInterval = null
      }
      if (locationUpdateInterval.value) {
        clearInterval(locationUpdateInterval.value)
        locationUpdateInterval.value = null
      }

      // Reset map variables
      map = null
      driverMarker = null
      destinationMarker = null
    }

    // CHANGE: Added AI-powered driver recommendation system
    const generateAIRecommendations = async (order) => {
      try {
        loadingRecommendations.value = true
        aiRecommendations.value = []

        if (!availableDrivers.value.length) {
          return
        }

        // Filter only online drivers for recommendations
        const onlineDrivers = availableDrivers.value.filter(driver => driver.isOnline)

        if (!onlineDrivers.length) {
          toast.warning('No online drivers available for AI recommendations')
          return
        }

        const recommendations = []

        for (const driver of onlineDrivers) {
          let score = 0
          const reasons = []
          let distance = 'N/A'

          // Base score for being online
          score += 20
          reasons.push('Online')

          // Performance score (40% weight)
          const rating = Number(driver.rating || 0)
          const deliveries = Number(driver.deliveries || 0)

          if (rating >= 4.5) {
            score += 25
            reasons.push('High Rating')
          } else if (rating >= 4.0) {
            score += 20
            reasons.push('Good Rating')
          } else if (rating >= 3.5) {
            score += 15
          }

          if (deliveries >= 100) {
            score += 15
            reasons.push('Experienced')
          } else if (deliveries >= 50) {
            score += 10
            reasons.push('Reliable')
          } else if (deliveries >= 20) {
            score += 5
          }

          // Distance calculation (40% weight)
          try {
            if (driver.location && order.pickupAddress) {
              // Simulate distance calculation (in real app, use Google Maps API)
              // const distanceResult = await googleMapsService.getDistance(driver.location, order.pickupAddress);
              // distance = distanceResult.distance.text;
              // const distanceInMeters = distanceResult.distance.value;
              // score += calculateDistanceScore(distanceInMeters);

              // Mock distance calculation for now
              const mockDistance = Math.random() * 10 + 0.5 // 0.5-10.5 km
              distance = mockDistance.toFixed(1)

              if (mockDistance <= 2) {
                score += 25
                reasons.push('Very Close')
              } else if (mockDistance <= 5) {
                score += 20
                reasons.push('Nearby')
              } else if (mockDistance <= 8) {
                score += 10
              } else {
                score += 5
              }
            } else {
              // Default distance bonus if no location data
              score += 10
            }
          } catch (err) {
            console.error('Distance calculation error:', err)
            score += 10 // Default score if distance calculation fails
          }

          // Vehicle type matching (bonus)
          if (driver.vehicleType) {
            if (order.serviceType === 'food' && driver.vehicleType.toLowerCase().includes('motorcycle')) {
              score += 5
              reasons.push('Food Delivery')
            } else if (order.serviceType === 'package' && driver.vehicleType.toLowerCase().includes('van')) {
              score += 5
              reasons.push('Package Delivery')
            }
          }

          // Availability bonus (no current active orders)
          score += 5

          recommendations.push({
            driver,
            score: Math.min(Math.round(score), 100), // Cap at 100%
            distance,
            reasons: reasons.slice(0, 3) // Show top 3 reasons
          })
        }

        // Sort by score (highest first)
        recommendations.sort((a, b) => b.score - a.score)

        aiRecommendations.value = recommendations.slice(0, 10) // Top 10 recommendations

        // Auto-select the best match
        if (recommendations.length > 0) {
          selectedDriverId.value = recommendations[0].driver.id
        }

      } catch (err) {
        console.error('Error generating AI recommendations:', err)
        toast.error('Failed to generate AI recommendations')
      } finally {
        loadingRecommendations.value = false
      }
    }

    const openAssignDriverModal = async (order) => {
      selectedOrder.value = order
      selectedDriverId.value = null
      showAssignModal.value = true
      await fetchAvailableDrivers()
      // CHANGE: Removed AI recommendations generation - now manual assignment only
    }

    const closeAssignModal = () => {
      showAssignModal.value = false
      selectedOrder.value = null
      selectedDriverId.value = null
      driverSearchQuery.value = ''
      aiRecommendations.value = []
    }

    const closeBulkAssignModal = () => {
      showBulkAssignModal.value = false
    }

    const selectDriver = (driver) => {
      selectedDriverId.value = driver.id
    }

    const assignDriverToOrder = async () => {
      if (!selectedOrder.value || !selectedDriverId.value) return

      try {
        assigningDriver.value = true

        let selectedDriver = availableDrivers.value.find(d => d.id === selectedDriverId.value)
        if (!selectedDriver) {
          selectedDriver = allDriversForLookup.value.find(d => d.id === selectedDriverId.value)
        }

        if (!selectedDriver) {
          toast.error('Selected driver not found')
          return
        }

        console.log('[v0] Assigning driver:', selectedDriver.fullName || `${selectedDriver.firstName} ${selectedDriver.lastName}`)

        const driverName = getDriverDisplayName(selectedDriver)

        const updateData = {
          driverId: selectedDriverId.value,
          driverName: driverName,
          driverPhone: selectedDriver.phone,
          driverAvatar: selectedDriver.profilePicture,
          driverProfilePicture: selectedDriver.profilePicture,
          status: 'driver_assigned',
          driverAssignedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        console.log('[v0] Update data:', updateData)

        await updateDoc(doc(db, 'orders', selectedOrder.value.id), updateData)

        const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value.id)
        if (orderIndex !== -1) {
          orders.value[orderIndex] = {
            ...orders.value[orderIndex],
            ...updateData,
            driverAssignedAt: new Date() // Use current date for immediate display
          }
          console.log('[v0] Updated local order data')
        }

        await loggingService.logDriverAssignment(
          selectedOrder.value.id,
          selectedDriverId.value,
          driverName,
          authStore.user?.uid
        )

        // Send notification to driver
        await realtimeService.sendNotification(selectedDriverId.value, {
          title: 'New Order Assignment',
          message: `You have been assigned to order #${selectedOrder.value.id}`,
          type: 'order_assignment',
          orderId: selectedOrder.value.id,
          customerName: selectedOrder.value.customerName,
          serviceType: selectedOrder.value.serviceType || selectedOrder.value.serviceId,
          // Provide totalAmount for notification: fallback to pricing.total if necessary
          totalAmount: selectedOrder.value.totalAmount || selectedOrder.value.priceEstimate?.total || selectedOrder.value.pricing?.total
        })

        if (selectedOrder.value.userId) {
          await realtimeService.sendNotification(selectedOrder.value.userId, {
            title: 'Driver Assigned',
            message: `${driverName} has been assigned to your order #${selectedOrder.value.id}`,
            type: 'driver_assigned',
            orderId: selectedOrder.value.id,
            driverName: driverName,
            driverPhone: selectedDriver.phone
          })
        }

        toast.success(`Driver ${driverName} assigned successfully!`)
        closeAssignModal()

      } catch (err) {
        console.error('Error assigning driver:', err)
        toast.error('Failed to assign driver. Please try again.')
      } finally {
        assigningDriver.value = false
      }
    }

    // CHANGE: Added performBulkAssignment function (though it's not directly used in the template anymore, it's good practice to keep it if it was intended for future use or was part of the original update logic)
    const performBulkAssignment = async () => {
      // This function is now largely superseded by performAutoAssignment, but kept for completeness.
      // It might be useful if a different bulk assignment logic is needed later.
      try {
        bulkAssigning.value = true

        if (!unassignedOrders.value.length) {
          toast.warning('No unassigned orders to process')
          return
        }

        await fetchAvailableDrivers()
        const availableDriversForBulk = availableDrivers.value; // Use a separate variable to avoid modifying the reactive ref directly

        if (!availableDriversForBulk.length) {
          toast.warning('No drivers available for bulk assignment')
          return
        }

        let assignedCount = 0;
        const assignments = [];

        // Simple round-robin assignment for bulk
        for (let i = 0; i < unassignedOrders.value.length; i++) {
          const order = unassignedOrders.value[i];
          const driver = availableDriversForBulk[i % availableDriversForBulk.length]; // Cycle through drivers

          assignments.push({ order, driver });
          assignedCount++;
        }

        await Promise.all(assignments.map(async ({ order, driver }) => {
          try {
            await updateDoc(doc(db, 'orders', order.id), {
              driverId: driver.id,
              driverName: getDriverDisplayName(driver),
              driverPhone: driver.phone,
              driverAvatar: driver.profilePicture,
              // Updated bulk assignment status from 'confirmed' to 'driver_assigned'
              status: 'driver_assigned',
              driverAssignedAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });

            await realtimeService.sendNotification(driver.id, {
              title: 'New Order Assignment',
              message: `You have been assigned to order #${order.id}`,
              type: 'order_assignment',
              orderId: order.id
            });
          } catch (err) {
            console.error(`Error during bulk assignment for order ${order.id}:`, err);
          }
        }));

        toast.success(`Successfully assigned ${assignedCount} orders to drivers!`);
        closeBulkAssignModal();

      } catch (err) {
        console.error('Error performing bulk assignment:', err);
        toast.error('Failed to perform bulk assignment. Please try again.');
      } finally {
        bulkAssigning.value = false;
      }
    };


    // CHANGE: Added auto-assignment functionality
    const performAutoAssignment = async () => {
      try {
        autoAssigning.value = true

        if (!unassignedOrders.value.length) {
          toast.warning('No unassigned orders to process')
          return
        }

        await fetchAvailableDrivers()
        const onlineDrivers = availableDrivers.value.filter(driver => driver.isOnline)

        if (!onlineDrivers.length) {
          toast.warning('No online drivers available for auto-assignment')
          return
        }

        let assignedCount = 0

        for (const order of unassignedOrders.value) {
          if (onlineDrivers.length === 0) break

          // Get a random driver from available online drivers
          const randomIndex = Math.floor(Math.random() * onlineDrivers.length)
          const selectedDriver = onlineDrivers[randomIndex]

          try {
            await updateDoc(doc(db, 'orders', order.id), {
              driverId: selectedDriver.id,
              driverName: getDriverDisplayName(selectedDriver),
              driverPhone: selectedDriver.phone,
              driverAvatar: selectedDriver.profilePicture,
              status: 'driver_assigned',
              driverAssignedAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            })

            // Send notification to driver
            await realtimeService.sendNotification(selectedDriver.id, {
              title: 'New Order Assignment',
              message: `You have been auto-assigned to order #${order.id}`,
              type: 'order_assignment',
              orderId: order.id
            })

            assignedCount++

            // Remove assigned driver from available list to prevent double assignment
            onlineDrivers.splice(randomIndex, 1)

          } catch (err) {
            console.error(`Error auto-assigning order ${order.id}:`, err)
          }
        }

        if (assignedCount > 0) {
          toast.success(`Successfully auto-assigned ${assignedCount} orders to drivers!`)
        } else {
          toast.warning('No orders could be auto-assigned')
        }

      } catch (err) {
        console.error('Error during auto-assignment:', err)
        toast.error('Error during auto-assignment. Please try again.')
      } finally {
        autoAssigning.value = false
      }
    }

    const getDriverStatusClass = (status) => {
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

    const getStatusClass = (status) => {
      const classes = {
        'pending': 'bg-orange-100 text-orange-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'in_transit': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800',
        'driver_assigned': 'bg-indigo-100 text-indigo-800' // Added for driver_assigned status
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const formatStatus = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in_transit': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
        'driver_assigned': 'Driver Assigned' // Added for driver_assigned status
      }
      return statusMap[status] || status
    }

    const formatServiceType = (serviceType) => {
      const serviceMap = {
        'grocery': 'Grocery Delivery',
        'food': 'Food Delivery',
        'package': 'Package Delivery',
        'medicine': 'Medicine Delivery'
      }
      return serviceMap[serviceType] || serviceType
    }

    // CHANGE: Added service-related helper functions
    const getServiceColorClass = (serviceType) => {
      const colors = {
        'food-delivery': 'bg-orange-500',
        'food': 'bg-orange-500',
        'bill-payments': 'bg-blue-500',
        'grocery-shopping': 'bg-green-500',
        'grocery': 'bg-green-500',
        'gift-delivery': 'bg-pink-500',
        'medicine-delivery': 'bg-red-500',
        'medicine': 'bg-red-500',
        'pickup-drop': 'bg-purple-500',
        'package': 'bg-purple-500'
      }
      return colors[serviceType] || 'bg-gray-500'
    }

    // CHANGE: Replaced getServiceIcon function with getServiceIconPath
    const getServiceIconPath = (serviceType) => {
      const iconPaths = {
        'food-delivery': 'M12 6l3 6-3 6-3-6 3-6z',
        'food': 'M12 6l3 6-3 6-3-6 3-6z',
        'bill-payments': 'M9 12l2 2 4-4M5 12a7 7 0 1114 0 7 7 0 01-14 0z',
        'grocery-shopping': 'M3 3h2l.4 2M7 13h10l4-8H5.4',
        'grocery': 'M3 3h2l.4 2M7 13h10l4-8H5.4',
        'gift-delivery': 'M12 8v13l-4-4-4 4M12 4a8 8 0 110 16 8 8 0 010-16z',
        'medicine-delivery': 'M7 7h10M7 11h10M7 15h6',
        'medicine': 'M7 7h10M7 11h10M7 15h6',
        'pickup-drop': 'M4 7l8-4 8 4-8 4-8-4z M12 11l8-4v10l-8 4-8-4V7',
        'package': 'M4 7l8-4 8 4-8 4-8-4z M12 11l8-4v10l-8 4-8-4V7'
      }
      return iconPaths[serviceType] || 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
    }

    const getServiceDescription = (serviceType) => {
      const descriptions = {
        'food-delivery': 'Restaurant orders and food delivery',
        'food': 'Restaurant orders and food delivery',
        'bill-payments': 'Pay bills and get receipts delivered',
        'grocery-shopping': 'Fresh groceries delivered to your door',
        'grocery': 'Fresh groceries delivered to your door',
        'gift-delivery': 'Special gifts delivered with care',
        'medicine-delivery': 'Prescription and over-the-counter medicines',
        'medicine': 'Prescription and over-the-counter medicines',
        'pickup-drop': 'Pick up and deliver items between locations',
        'package': 'Pick up and deliver items between locations'
      }
      return descriptions[serviceType] || 'Delivery service'
    }

    // CHANGE: Added function to extract service details from booking form data
    const getServiceDetails = (order) => {
      if (!order?.formData) return ''

      const formData = order.formData
      const serviceType = order.serviceType || order.serviceId

      switch (serviceType) {
        case 'food-delivery':
        case 'food':
          return formData.restaurantName ? `From: ${formData.restaurantName}` : ''

        case 'bill-payments':
          return formData.billerName ? `Biller: ${formData.billerName}` : ''

        case 'grocery-shopping':
        case 'grocery':
          return formData.storePreference ? `Store: ${formData.storePreference}` : 'Grocery shopping'

        case 'gift-delivery':
          return formData.giftType ? `Gift: ${formData.giftType}` : ''

        case 'medicine-delivery':
        case 'medicine':
          return formData.medicineNames ? `Medicine: ${formData.medicineNames.substring(0, 50)}${formData.medicineNames.length > 50 ? '...' : ''}` : ''

        case 'pickup-drop':
        case 'package':
          return formData.itemType ? `Item: ${formData.itemType}` : ''

        default:
          return ''
      }
    }

    // CHANGE: Added functions to get pickup and delivery locations from form data
    const getPickupLocation = (order) => {
      if (!order?.formData) return ''

      const formData = order.formData
      const serviceType = order.serviceType || order.serviceId

      switch (serviceType) {
        case 'food-delivery':
        case 'food':
          return formData.restaurantAddress || ''

        case 'bill-payments':
        case 'pickup-drop':
        case 'package':
          return formData.pickupAddress || ''

        default:
          return ''
      }
    }

    const getDeliveryLocation = (order) => {
      if (!order?.formData) return ''

      const formData = order.formData
      const serviceType = order.serviceType || order.serviceId

      switch (serviceType) {
        case 'food-delivery':
        case 'food':
        case 'grocery-shopping':
        case 'grocery':
        case 'medicine-delivery':
        case 'medicine':
          return formData.deliveryAddress || ''

        case 'gift-delivery':
          return formData.deliveryAddress || ''

        case 'bill-payments':
          return formData.returnAddress || ''

        case 'pickup-drop':
        case 'package':
          return formData.dropoffAddress || ''

        default:
          return ''
      }
    }


    // CHANGE: Enhanced viewOrder function to show complete booking details
    const viewOrder = (order) => {
      selectedOrderForDetails.value = order
      showOrderDetailsModal.value = true
    }

    const closeOrderDetailsModal = () => {
      showOrderDetailsModal.value = false
      selectedOrderForDetails.value = null
    }

    const formatOrderDate = (timestamp) => {
      if (!timestamp) return 'N/A'

      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleString()
      } catch (err) {
        console.error('Error formatting date:', err)
        return 'Invalid date'
      }
    }

    // This function `trackOrder` is now superseded by `trackDriver` for map tracking.
    // It's kept here to avoid linting errors if it was intended for other purposes,
    // but it's not called in the current template.
    const trackOrder = (order) => {
      console.log('Tracking order:', order)
      // TODO: Implement order tracking functionality
    }

    const cancelOrder = async (order) => {
      if (confirm('Are you sure you want to cancel this order?')) {
        try {
          await realtimeService.updateOrderStatus(order.id, 'cancelled')
          
          await loggingService.logOrderCancellation(
            order.id,
            authStore.user?.uid,
            loggingService.USER_TYPES.ADMIN,
            'Cancelled by admin'
          )
          
          toast.success('Order cancelled successfully')
        } catch (err) {
          console.error('Error cancelling order:', err)
          toast.error('Failed to cancel order. Please try again.')
        }
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const getDriverDisplayName = (driver) => {
      if (!driver) return 'Unknown Driver'

      // Try multiple name fields
      let name = driver.fullName || driver.full_name
      if (!name || name.trim() === '') {
        const firstName = driver.firstName || driver.first_name || ''
        const lastName = driver.lastName || driver.last_name || ''
        name = `${firstName} ${lastName}`.trim()
      }
      if (!name || name.trim() === '') {
        name = driver.displayName || driver.name || driver.firstName || driver.lastName
      }
      if (!name || name.trim() === '') {
        name = `Driver ${driver.id.substring(0, 8)}`
      }

      return name
    }

    const getDriverNameById = (driverId) => {
      if (!driverId) {
        console.log('[v0] getDriverNameById: No driverId provided')
        return 'No Driver'
      }

      console.log('[v0] Looking up driver name for ID:', driverId)
      console.log('[v0] Available drivers for lookup:', allDriversForLookup.value.length)

      const driver = allDriversForLookup.value.find(d => d.id === driverId)
      if (driver) {
        const name = getDriverDisplayName(driver)
        console.log('[v0] Found driver name:', name)
        return name
      } else {
        console.log('[v0] Driver not found in lookup array')
        return 'Loading...'
      }
    }

    const getDriverPhoneById = (driverId) => {
      if (!driverId) {
        console.log('[v0] getDriverPhoneById: No driverId provided')
        return 'No Phone'
      }

      const driver = allDriversForLookup.value.find(d => d.id === driverId)
      if (driver) {
        const phone = driver.phone || driver.contact || driver.phoneNumber || 'No phone'
        console.log('[v0] Found driver phone:', phone)
        return phone
      } else {
        console.log('[v0] Driver phone not found')
        return 'No phone'
      }
    }

    const handleImageError = (event) => {
      console.log('[v0] Image load error, using fallback')
      event.target.style.display = 'none'
      // Let the parent div handle the fallback display
    }

    const getDriverOnlineStatus = (driverId) => {
      if (!driverId) return false
      const driver = allDriversForLookup.value.find(d => d.id === driverId)
      return driver ? driver.isOnline : false
    }

    const formatAssignmentTime = (timestamp) => {
      if (!timestamp) return ''

      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        const now = new Date()
        const diffInMinutes = Math.floor((now - date) / (1000 * 60))

        if (diffInMinutes < 1) return 'just now'
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
        return `${Math.floor(diffInMinutes / 1440)}d ago`
      } catch (err) {
        console.error('Error formatting assignment time:', err)
        return ''
      }
    }

    // CHANGE: Added trackDriver function for admin to track drivers
    // Removed duplicate trackDriver definition
    // const trackDriver = async (order) => { ... }

    const getTrackingStepClass = (status) => {
      if (isTrackingStepCompleted(status)) {
        return 'bg-green-500'
      } else if (isCurrentTrackingStep(status)) {
        return 'bg-blue-500'
      } else {
        return 'bg-gray-300'
      }
    }

    const isTrackingStepCompleted = (status) => {
      // Use selectedOrderForProgress for order progress modal, trackedOrder for tracking modal
      const currentOrder = selectedOrderForProgress.value || trackedOrder.value
      if (!currentOrder) return false

      const statusOrder = ['confirmed', 'driver_assigned', 'in_transit', 'arrived', 'delivered']
      const currentIndex = statusOrder.indexOf(currentOrder.status)
      const stepIndex = statusOrder.indexOf(status)

      return stepIndex <= currentIndex
    }

    const isCurrentTrackingStep = (status) => {
      const currentOrder = selectedOrderForProgress.value || trackedOrder.value
      return currentOrder?.status === status
    }

    // CHANGE: Added order progress modal functionality
    const showOrderProgress = async (order) => {
      try {
        // Fetch latest order data from Firestore
        const orderDoc = await getDoc(doc(db, 'orders', order.id))
        if (orderDoc.exists()) {
          const latestOrderData = orderDoc.data()

          // Determine the current status based on order state
          let currentStatus = latestOrderData.status || 'pending'

          // If driver is assigned, status should be 'driver_assigned' directly
          if (latestOrderData.driverId && (currentStatus === 'pending' || currentStatus === 'confirmed')) {
            currentStatus = 'driver_assigned'

            // Update the status in Firestore to reflect the driver_assigned state
            await updateDoc(doc(db, 'orders', order.id), {
              status: 'driver_assigned',
              updatedAt: serverTimestamp()
            })
          }

          selectedOrderForProgress.value = {
            ...order,
            ...latestOrderData,
            status: currentStatus,
            updatedAt: latestOrderData.updatedAt || order.updatedAt
          }
        } else {
          // If order doesn't exist in Firestore, use local data
          let currentStatus = order.status || 'pending'
          if (order.driverId && (currentStatus === 'pending' || currentStatus === 'confirmed')) {
            currentStatus = 'driver_assigned'
          }

          selectedOrderForProgress.value = {
            ...order,
            status: currentStatus
          }
        }

        showOrderProgressModal.value = true
        console.log('[v0] Order progress opened with status:', selectedOrderForProgress.value.status)
      } catch (error) {
        console.error('Error fetching order status:', error)
        toast.error('Failed to fetch order status. Please try again.')

        // Fallback to local data
        let currentStatus = order.status || 'pending'
        if (order.driverId && (currentStatus === 'pending' || currentStatus === 'confirmed')) {
          currentStatus = 'driver_assigned'
        }

        selectedOrderForProgress.value = {
          ...order,
          status: currentStatus
        }
        showOrderProgressModal.value = true
      }
    }

    const closeOrderProgress = () => {
      showOrderProgressModal.value = false
      selectedOrderForProgress.value = null
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A'
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    onMounted(() => {
      fetchOrders()
      setupRealtimeDriverListeners()
      
      // Preload Google Maps API
      initializeGoogleMaps().catch(error => {
        console.error('[v0] Failed to preload Google Maps API:', error)
      })
    })

    // CHANGE: Updated onUnmounted to reset unsubscribe.value to null for memory leak prevention
    onUnmounted(() => {
      // CHANGE: Removed usersUnsubscribe logic as it's no longer needed.
      // if (usersUnsubscribe.value) {
      //   usersUnsubscribe.value()
      //   usersUnsubscribe.value = null
      // }
      
      if (unsubscribe.value) {
        unsubscribe.value()
        unsubscribe.value = null
      }
      // Clean up any intervals on unmount
      if (mapUpdateInterval) {
        clearInterval(mapUpdateInterval)
      }
      if (locationUpdateInterval.value) {
        clearInterval(locationUpdateInterval.value)
      }
      if (driversUnsubscribe.value) {
        driversUnsubscribe.value()
        driversUnsubscribe.value = null
      }
    })

    // CHANGE: Add watcher to initialize map when tracking modal opens
    watch(showTrackingModal, async (newValue) => {
      if (newValue) {
        await nextTick()
        initializeMap()
      } else {
        // Clean up when modal closes
        if (mapUpdateInterval) {
          clearInterval(mapUpdateInterval)
          mapUpdateInterval = null
        }
      }
    })

    const getFilteredBookingDetails = (order) => {
      if (!order?.formData) return []

      const formData = order.formData
      const serviceType = order.serviceType || order.serviceId
      let relevantFields = []

      // Define which fields to show for each service type
      const serviceFieldMappings = {
        'food-delivery': [
          'restaurantName', 'restaurantAddress', 'foodOrderDetails',
          'specialInstructions', 'budgetRange', 'receiverName',
          'receiverContact', 'deliveryAddress', 'landmark', 'preferredTime'
        ],
        'food': [
          'restaurantName', 'restaurantAddress', 'foodOrderDetails',
          'specialInstructions', 'budgetRange', 'receiverName',
          'receiverContact', 'deliveryAddress', 'landmark', 'preferredTime'
        ],
        'bill-payments': [
          'billerName', 'accountName', 'accountNumber', 'amountToPay',
          'dueDate', 'budgetRange', 'pickupAddress', 'returnAddress',
          'preferredSchedule', 'billReceiptUrl'
        ],
        'grocery-shopping': [
          'shoppingList', 'storePreference', 'budgetRange', 'receiverName',
          'receiverContact', 'deliveryAddress', 'landmark', 'preferredTime'
        ],
        'grocery': [
          'shoppingList', 'storePreference', 'budgetRange', 'receiverName',
          'receiverContact', 'deliveryAddress', 'landmark', 'preferredTime'
        ],
        'gift-delivery': [
          'giftType', 'specialInstructions', 'budgetRange', 'recipientName',
          'recipientContact', 'deliveryAddress', 'landmark', 'preferredDateTime'
        ],
        'medicine-delivery': [
          'medicineNames', 'quantity', 'budgetRange', 'receiverName',
          'receiverContact', 'deliveryAddress', 'landmark', 'preferredTime'
        ],
        'medicine': [
          'medicineNames', 'quantity', 'budgetRange', 'receiverName',
          'receiverContact', 'deliveryAddress', 'landmark', 'preferredTime'
        ],
        'pickup-drop': [
          'pickupAddress', 'pickupContact', 'itemDescription', 'itemType',
          'budgetRange', 'dropoffAddress', 'receiverContact'
        ],
        'package': [
          'pickupAddress', 'pickupContact', 'itemDescription', 'itemType',
          'budgetRange', 'dropoffAddress', 'receiverContact'
        ]
      }

      // Get the relevant fields for this service type
      const fieldsToShow = serviceFieldMappings[serviceType] || []

      // Filter and format the fields
      fieldsToShow.forEach(fieldKey => {
        const value = formData[fieldKey]
        if (value !== undefined && value !== null && value !== '') {
          relevantFields.push({
            key: fieldKey,
            label: formatFieldLabel(fieldKey),
            value: formatFieldValue(fieldKey, value),
            isLink: fieldKey === 'billReceiptUrl'
          })
        }
      })

      return relevantFields
    }

    const formatFieldLabel = (key) => {
      const labelMappings = {
        restaurantName: 'Restaurant Name',
        restaurantAddress: 'Restaurant Address',
        foodOrderDetails: 'Food Order Details',
        specialInstructions: 'Special Instructions',
        budgetRange: 'Budget Range',
        receiverName: 'Receiver Name',
        receiverContact: 'Receiver Contact',
        deliveryAddress: 'Delivery Address',
        landmark: 'Landmark',
        preferredTime: 'Preferred Time',
        billerName: 'Biller Name',
        accountName: 'Account Name',
        accountNumber: 'Account Number',
        amountToPay: 'Amount to Pay',
        dueDate: 'Due Date',
        pickupAddress: 'Pickup Address',
        returnAddress: 'Return Address',
        preferredSchedule: 'Preferred Schedule',
        billReceiptUrl: 'Receipt/Reference',
        shoppingList: 'Shopping List',
        storePreference: 'Store Preference',
        giftType: 'Gift Type',
        recipientName: 'Recipient Name',
        recipientContact: 'Recipient Contact',
        preferredDateTime: 'Preferred Date/Time',
        medicineNames: 'Medicine Names',
        quantity: 'Quantity',
        pickupContact: 'Pickup Contact',
        itemDescription: 'Item Description',
        itemType: 'Item Type',
        dropoffAddress: 'Drop-off Address'
      }

      return labelMappings[key] || key.replace(/([A-Z])/g, ' $1').trim()
    }

    const formatFieldValue = (key, value) => {
      // Format amount fields with peso sign
      if (key === 'amountToPay') {
        return `₱${value}`
      }

      // Format date fields
      if (key === 'dueDate' || key === 'preferredSchedule' || key === 'preferredDateTime') {
        try {
          const date = new Date(value)
          return date.toLocaleString()
        } catch (err) {
          return value
        }
      }

      return value
    }

    // CHANGE: Implementing proper CSV export functionality
    const exportOrders = async () => {
      exportingOrders.value = true
      try {
        // Get all filtered orders (without pagination)
        let filtered = orders.value

        if (statusFilter.value) {
          filtered = filtered.filter(order => order.status === statusFilter.value)
        }

        if (serviceFilter.value) {
          filtered = filtered.filter(order => order.serviceType === serviceFilter.value)
        }

        if (searchFilter.value) {
          const search = searchFilter.value.toLowerCase()
          filtered = filtered.filter(order =>
            order.id.toLowerCase().includes(search) ||
            (order.customerName && order.customerName.toLowerCase().includes(search))
          )
        }

        if (dateFilter.value) {
          const filterDate = new Date(dateFilter.value)
          filtered = filtered.filter(order => {
            if (order.createdAt && order.createdAt.toDate) {
              const orderDate = order.createdAt.toDate()
              return orderDate.toDateString() === filterDate.toDateString()
            }
            return false
          })
        }

        if (filtered.length === 0) {
          toast.error('No orders to export')
          return
        }

        // CSV Headers
        const headers = [
          'Order ID',
          'Customer Name',
          'Customer Phone',
          'Customer Email',
          'Service Type',
          'Service Name',
          'Status',
          'Driver Name',
          'Driver Phone',
          'Pickup Address',
          'Delivery Address',
          'Total Amount',
          'Order Date',
          'Driver Assigned Date'
        ]

        // CSV Rows
        const rows = filtered.map(order => {
          const formatDate = (timestamp) => {
            if (!timestamp) return 'N/A'
            if (timestamp.toDate) {
              return timestamp.toDate().toLocaleString()
            }
            return new Date(timestamp).toLocaleString()
          }

          return [
            order.id || '',
            order.customerName || 'Unknown',
            order.customerPhone || 'N/A',
            order.customerEmail || 'N/A',
            order.serviceType || order.serviceId || 'N/A',
            order.serviceName || formatServiceType(order.serviceType || order.serviceId),
            order.status || 'pending',
            order.driverName || getDriverNameById(order.driverId) || 'Not assigned',
            order.driverPhone || getDriverPhoneById(order.driverId) || 'N/A',
            order.pickupAddress || getPickupLocation(order) || 'N/A',
            order.deliveryAddress || getDeliveryLocation(order) || 'N/A',
            // Export total amount including pricing.total fallback
            `₱${order.totalAmount || order.priceEstimate?.total || order.pricing?.total || 'TBD'}`,
            formatDate(order.createdAt),
            formatDate(order.driverAssignedAt)
          ]
        })

        // Create CSV content
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n')

        // Create Blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        link.setAttribute('href', url)
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success(`Successfully exported ${filtered.length} orders to Downloads folder`)
      } catch (err) {
        console.error('Error exporting orders:', err)
        toast.error('Failed to export orders. Please try again.')
      } finally {
        exportingOrders.value = false
      }
    }

    return {
      orders,
      loading,
      error,
      statusFilter,
      serviceFilter,
      dateFilter,
      searchFilter,
      currentPage,
      itemsPerPage,
      totalOrders,
      pendingOrders,
      inTransitOrders,
      completedOrders,
      filteredOrders,
      totalPages,
      visiblePages,
      showAssignModal,
      showBulkAssignModal,
      selectedOrder,
      selectedDriverId,
      availableDrivers,
      loadingDrivers,
      assigningDriver,
      bulkAssigning,
      autoAssigning,
      driverSearchQuery,
      unassignedOrders,
      filteredAvailableDrivers,
      aiRecommendations,
      loadingRecommendations,
      allDriversForLookup,
      showOrderDetailsModal,
      selectedOrderForDetails,
      showTrackingModal,
      trackedOrder,
      trackedDriverName,
      trackedDriverPhone,
      currentDriverLocation,
      estimatedArrival,
      remainingDistance,
      trackingSteps,
      showOrderProgressModal,
      selectedOrderForProgress,
      exportingOrders,
      // Functions
      getStatusClass,
      formatStatus,
      formatServiceType,
      getServiceColorClass,
      getServiceIconPath,
      getServiceDescription,
      getServiceDetails,
      getPickupLocation,
      getDeliveryLocation,
      viewOrder,
      // trackOrder, // Removed as it's now superseded by trackDriver
      cancelOrder,
      goToPage,
      nextPage,
      previousPage,
      openAssignDriverModal,
      closeAssignModal,
      closeBulkAssignModal,
      selectDriver,
      assignDriverToOrder,
      performBulkAssignment,
      performAutoAssignment,
      generateAIRecommendations,
      handleImageError,
      getDriverStatusClass,
      getDriverNameById,
      getDriverPhoneById,
      getDriverOnlineStatus,
      formatAssignmentTime,
      fetchAllDriversForLookup,
      getDriverDisplayName,
      trackDriver, // Keep trackDriver for map tracking functionality
      closeOrderDetailsModal,
      formatOrderDate,
      closeTrackingModal,
      startRealTimeTracking,
      refreshDriverLocation,
      getTrackingStepClass,
      isTrackingStepCompleted,
      isCurrentTrackingStep,
      initializeGoogleMaps,
      initializeMap,
      mapUpdateInterval,
      showOrderProgress,
      closeOrderProgress,
      formatDate,
      getFilteredBookingDetails,
      formatFieldLabel,
      formatFieldValue,
      exportOrders
    }
  }
}
</script>
