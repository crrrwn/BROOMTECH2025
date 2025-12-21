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
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414 1.414L8.707 7.293z" clip-rule="evenodd" />
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
          <button @click="openAddDriverModal" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Add Driver
          </button>
          <button @click="exportReport" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
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
              <p class="text-sm text-gray-600">Total Earnings</p>
              <p class="text-2xl font-bold text-purple-600">₱{{ totalEarnings }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                <!-- Removed Rating column header -->
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
                  <div class="text-sm text-gray-900">{{ driver.raw?.driverInfo?.motorcycleInfo?.brand || 'Brand not specified' }}</div>
                  <div class="text-sm text-gray-500">{{ driver.raw?.driverInfo?.motorcycleInfo?.model || 'Model N/A' }}</div>
                  <div class="text-xs text-gray-400">{{ driver.plateNumber || 'No plate' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <!-- Added real-time online status indicator -->
                    <div class="flex items-center space-x-1">
                      <div :class="[ 'w-2 h-2 rounded-full', driver.raw?.isOnline ? 'bg-green-500' : 'bg-gray-400' ]"></div>
                      <span :class="[ 'text-xs font-medium', driver.raw?.isOnline ? 'text-green-600' : 'text-gray-500' ]">
                        {{ driver.raw?.isOnline ? 'ONLINE' : 'OFFLINE' }}
                      </span>
                    </div>
                    <span :class="getStatusClass(driver.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ driver.status || 'active' }}
                    </span>
                  </div>
                </td>
                <!-- Removed Rating column data cell -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ driver.deliveries || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₱{{ Number(driver.earnings || 0).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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

    <!-- View Driver Details Modal -->
    <div v-if="selectedDriver" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Driver Details</h3>
            <p class="text-sm text-gray-500">Complete driver information and documents</p>
          </div>
          <button @click="selectedDriver = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Personal Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.firstName }} {{ selectedDriver.lastName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.phone || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <span :class="getStatusClass(selectedDriver.status)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedDriver.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Motorcycle Information -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Motorcycle Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Brand</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.raw?.driverInfo?.motorcycleInfo?.brand || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Model</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.raw?.driverInfo?.motorcycleInfo?.model || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Plate Number</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.plateNumber || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Year</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.raw?.driverInfo?.motorcycleInfo?.year || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Experience & Availability -->
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Experience & Availability</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Driving Experience</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.raw?.driverInfo?.experience || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Availability</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.raw?.driverInfo?.availability || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Total Deliveries</label>
                <p class="text-sm text-gray-900">{{ selectedDriver.deliveries }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Total Earnings</label>
                <p class="text-sm text-gray-900">₱{{ selectedDriver.earnings.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Required Documents</h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="border rounded-lg p-3 bg-white">
                <p class="text-sm font-medium text-gray-900">Driver's License</p>
                <button 
                  v-if="selectedDriver.raw?.driverInfo?.documents?.license"
                  @click="viewDocument(selectedDriver.raw.driverInfo.documents.license)"
                  class="text-primary hover:text-green-600 text-sm mt-1"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500 mt-1">Not uploaded</p>
              </div>
              <div class="border rounded-lg p-3 bg-white">
                <p class="text-sm font-medium text-gray-900">OR/CR</p>
                <button 
                  v-if="selectedDriver.raw?.driverInfo?.documents?.orcr"
                  @click="viewDocument(selectedDriver.raw.driverInfo.documents.orcr)"
                  class="text-primary hover:text-green-600 text-sm mt-1"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500 mt-1">Not uploaded</p>
              </div>
              <div class="border rounded-lg p-3 bg-white">
                <p class="text-sm font-medium text-gray-900">Selfie with License</p>
                <button 
                  v-if="selectedDriver.raw?.driverInfo?.documents?.selfie"
                  @click="viewDocument(selectedDriver.raw.driverInfo.documents.selfie)"
                  class="text-primary hover:text-green-600 text-sm mt-1"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500 mt-1">Not uploaded</p>
              </div>
              <div class="border rounded-lg p-3 bg-white">
                <p class="text-sm font-medium text-gray-900">Profile Picture</p>
                <button 
                  v-if="selectedDriver.raw?.driverInfo?.documents?.profilePicture"
                  @click="viewDocument(selectedDriver.raw.driverInfo.documents.profilePicture)"
                  class="text-primary hover:text-green-600 text-sm mt-1"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500 mt-1">Not uploaded</p>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="selectedDriver = null" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Close
          </button>
          <button @click="trackDriverFromModal" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Track Driver
          </button>
          <button @click="confirmSuspendDriver" :class="selectedDriver.status === 'suspended' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'" class="px-4 py-2 text-white rounded-lg">
            {{ selectedDriver.status === 'suspended' ? 'Unsuspend' : 'Suspend' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Track Driver Modal -->
    <div v-if="showTrackingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Live Driver Tracking</h3>
            <p class="text-sm text-gray-500">Real-time location monitoring with Google Maps</p>
          </div>
          <button @click="closeTrackingModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- Driver Info -->
          <div class="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img :src="trackedDriver?.profilePicture || '/placeholder.svg?height=50&width=50'" class="w-12 h-12 rounded-full" :alt="trackedDriver?.firstName">
              <div>
                <p class="font-medium text-gray-900">{{ trackedDriver?.firstName }} {{ trackedDriver?.lastName }}</p>
                <p class="text-sm text-gray-500">{{ trackedDriver?.phone }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div :class="trackedDriver?.raw?.isOnline ? 'bg-green-500' : 'bg-gray-400'" class="w-3 h-3 rounded-full animate-pulse"></div>
              <span :class="trackedDriver?.raw?.isOnline ? 'text-green-600' : 'text-gray-500'" class="text-sm font-medium">
                {{ trackedDriver?.raw?.isOnline ? 'ONLINE' : 'OFFLINE' }}
              </span>
            </div>
          </div>

          <!-- Replaced Leaflet with Google Maps -->
          <div id="driver-tracking-map" class="rounded-lg h-96 w-full border border-gray-300"></div>

          <!-- Location Info -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600">Current Location</p>
              <p class="font-medium text-gray-900 text-sm">{{ currentDriverLocation }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ driverLatLng.lat.toFixed(6) }}, {{ driverLatLng.lng.toFixed(6) }}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600">Distance to Destination</p>
              <p class="font-medium text-gray-900">{{ distanceToDestination }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ estimatedArrival }}</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-gray-600">Last Updated</p>
              <p class="font-medium text-gray-900">{{ lastLocationUpdate }}</p>
            </div>
          </div>

          <!-- Active Order Info (if driver has active order) -->
          <div v-if="activeOrder" class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 class="font-medium text-gray-900 mb-2">Active Order</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-gray-600">Order ID</p>
                <p class="font-medium">{{ activeOrder.id }}</p>
              </div>
              <div>
                <p class="text-gray-600">Service Type</p>
                <p class="font-medium">{{ activeOrder.serviceType }}</p>
              </div>
              <div>
                <p class="text-gray-600">Pickup Location</p>
                <p class="font-medium text-xs">{{ activeOrder.pickupAddress }}</p>
              </div>
              <div>
                <p class="text-gray-600">Delivery Location</p>
                <p class="font-medium text-xs">{{ activeOrder.deliveryAddress }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="closeTrackingModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Close
          </button>
          <button @click="refreshDriverLocation" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Refresh Location</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Suspend Confirmation Modal -->
    <div v-if="showSuspendModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ driverToSuspend?.status === 'suspended' ? 'Unsuspend Driver' : 'Suspend Driver' }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ driverToSuspend?.status === 'suspended' 
            ? `Are you sure you want to unsuspend ${driverToSuspend?.firstName} ${driverToSuspend?.lastName}? They will be able to accept orders again.`
            : `Please provide a reason for suspending ${driverToSuspend?.firstName} ${driverToSuspend?.lastName}.`
          }}
        </p>
        <div v-if="driverToSuspend?.status !== 'suspended'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Suspension *</label>
          <textarea
            v-model="suspendReason"
            rows="4"
            required
            placeholder="Enter the reason for suspending this driver..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button @click="closeSuspendModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button 
            @click="executeSuspend" 
            :disabled="driverToSuspend?.status !== 'suspended' && !suspendReason.trim()"
            :class="driverToSuspend?.status === 'suspended' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'" 
            class="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ driverToSuspend?.status === 'suspended' ? 'Unsuspend' : 'Suspend' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Driver Modal -->
    <div v-if="showAddDriverModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-lg max-w-4xl w-full my-8">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Add New Driver</h3>
            <p class="text-sm text-gray-500">Enter driver information and upload required documents</p>
          </div>
          <button @click="closeAddDriverModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitAddDriver" class="p-6 space-y-6">
           Personal Information 
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input v-model="newDriver.firstName" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input v-model="newDriver.lastName" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input v-model="newDriver.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input v-model="newDriver.password" type="password" required minlength="6" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input v-model="newDriver.contact" type="tel" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
          </div>

           Motorcycle Information 
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Motorcycle Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <input v-model="newDriver.motorcycleInfo.brand" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input v-model="newDriver.motorcycleInfo.model" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
                <input v-model="newDriver.motorcycleInfo.plateNumber" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <input v-model="newDriver.motorcycleInfo.year" type="number" required min="1990" max="2025" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              </div>
            </div>
          </div>

           Experience & Availability 
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Experience & Availability</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Driving Experience *</label>
                <select v-model="newDriver.experience" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">Select experience</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
                <select v-model="newDriver.availability" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">Select availability</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Weekends only">Weekends only</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

           Documents Upload 
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Required Documents</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Driver's License *</label>
                <input @change="handleFileUpload($event, 'license')" type="file" accept="image/*" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <p v-if="uploadProgress.license" class="text-xs text-green-600 mt-1">Uploading: {{ uploadProgress.license }}%</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">OR/CR *</label>
                <input @change="handleFileUpload($event, 'orcr')" type="file" accept="image/*" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <p v-if="uploadProgress.orcr" class="text-xs text-green-600 mt-1">Uploading: {{ uploadProgress.orcr }}%</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Selfie with License *</label>
                <input @change="handleFileUpload($event, 'selfie')" type="file" accept="image/*" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <p v-if="uploadProgress.selfie" class="text-xs text-green-600 mt-1">Uploading: {{ uploadProgress.selfie }}%</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Profile Picture *</label>
                <input @change="handleFileUpload($event, 'profilePicture')" type="file" accept="image/*" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <p v-if="uploadProgress.profilePicture" class="text-xs text-green-600 mt-1">Uploading: {{ uploadProgress.profilePicture }}%</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="closeAddDriverModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Adding Driver...' : 'Add Driver' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, addDoc, setDoc } from 'firebase/firestore'
import jsPDF from 'jspdf'
import { applyPlugin, autoTable } from 'jspdf-autotable'

// Apply plugin to jsPDF prototype (required for v5+)
applyPlugin(jsPDF)
import { db, auth, storage } from '@/firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useToast } from 'vue-toastification'
import { loggingService } from '@/services/loggingService'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ManageDrivers',
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()

    const drivers = ref([])
    const loading = ref(true)
    const error = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(5)
    const unsubs = ref([])

    const selectedDriver = ref(null)
    const showTrackingModal = ref(false)
    const trackedDriver = ref(null)
    const currentDriverLocation = ref('Loading location...')
    const lastLocationUpdate = ref('Just now')
    const showSuspendModal = ref(false)
    const driverToSuspend = ref(null)
    const suspendReason = ref('')
    const locationUpdateInterval = ref(null)
    const driverMap = ref(null)
    const driverMarker = ref(null)
    const destinationMarker = ref(null)
    const directionsRenderer = ref(null)
    const driverLatLng = ref({ lat: 13.4127, lng: 121.1794 })
    const distanceToDestination = ref('N/A')
    const estimatedArrival = ref('N/A')
    const activeOrder = ref(null)

    const showAddDriverModal = ref(false)
    const isSubmitting = ref(false)
    const newDriver = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      contact: '',
      motorcycleInfo: {
        brand: '',
        model: '',
        plateNumber: '',
        year: ''
      },
      experience: '',
      availability: '',
      documents: {
        license: '',
        orcr: '',
        selfie: '',
        profilePicture: ''
      }
    })
    const uploadProgress = ref({
      license: 0,
      orcr: 0,
      selfie: 0,
      profilePicture: 0
    })

    const filters = ref({
      status: '',
      vehicleType: '',
      search: ''
    })

    // helpers: normalize records from different collections
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
        source,
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

    // metrics
    const totalDrivers = computed(() => drivers.value.length)
    const onlineDrivers = computed(() => 
      drivers.value.filter(d => 
        d.status === 'online' || d.raw?.isOnline === true
      ).length
    )
    const pendingApplications = computed(() =>
      drivers.value.filter(d =>
        d.status === 'pending' || (!d.approved && d.status !== 'suspended')
      ).length
    )
    const totalEarnings = computed(() => {
      const total = drivers.value.reduce((sum, d) => sum + (Number(d.earnings) || 0), 0)
      return total.toLocaleString()
    })

    // filters + pagination
    const filteredDrivers = computed(() => {
      let filtered = [...drivers.value]

      if (filters.value.status) {
        filtered = filtered.filter(d => (d.status || '').toLowerCase() === filters.value.status.toLowerCase())
      }
      if (filters.value.vehicleType) {
        filtered = filtered.filter(d => (d.vehicleType || '').toLowerCase() === filters.value.vehicleType.toLowerCase())
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

    // Fetch driver earnings from orders
    const fetchDriverEarnings = async (driverId) => {
      try {
        // Query all delivered orders for this driver
        const ordersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driverId),
          where('status', '==', 'delivered')
        )
        
        const ordersSnap = await getDocs(ordersQuery)
        let totalEarnings = 0
        
        ordersSnap.forEach(orderDoc => {
          const order = orderDoc.data()
          // Get earnings from order - prioritize driverShare, then calculate 80% of total
          let earnings = 0
          
          // First try to get driverShare if it exists
          if (order.driverShare !== undefined && order.driverShare !== null) {
            earnings = Number(order.driverShare) || 0
          } else if (order.pricing?.driverShare !== undefined && order.pricing?.driverShare !== null) {
            earnings = Number(order.pricing.driverShare) || 0
          } else {
            // Calculate 80% of total amount (driver's share)
            const totalAmount = Number(order.totalAmount) || 
                               Number(order.pricing?.total) || 
                               Number(order.priceEstimate?.total) || 
                               0
            earnings = totalAmount * 0.8 // Driver gets 80% of the order total
          }
          
          totalEarnings += earnings
        })
        
        return totalEarnings
      } catch (error) {
        console.error(`[ManageDrivers] Error fetching earnings for driver ${driverId}:`, error)
        return 0
      }
    }

    // load data once (both sources)
    const loadDrivers = async () => {
      try {
        loading.value = true
        error.value = null

        const driversCol = collection(db, 'drivers')
        const driversSnap = await getDocs(driversCol)

        const mapById = new Map()

        driversSnap.forEach(d => {
          const unified = toUnifiedDriver(d.data(), d.id, 'drivers')
          mapById.set(d.id, unified)
        })

        drivers.value = Array.from(mapById.values())

        // Fetch earnings for each driver from orders
        console.log('[ManageDrivers] Fetching earnings for drivers...')
        const earningsPromises = drivers.value.map(async (driver) => {
          const earnings = await fetchDriverEarnings(driver.id)
          // Update driver earnings
          driver.earnings = earnings
          return driver
        })
        
        await Promise.all(earningsPromises)
        console.log('[ManageDrivers] Earnings fetched for all drivers')

        toast.success(`Loaded ${drivers.value.length} drivers with earnings`)
        currentPage.value = 1
      } catch (err) {
        console.error(err)
        error.value = `Failed to load drivers: ${err.message}`
        toast.error('Failed to load drivers from Firestore.')
      } finally {
        loading.value = false
      }
    }

    // realtime listeners for both collections
    const setupRealtimeListeners = () => {
      try {
        const driversCol = collection(db, 'drivers')
        const unsubDrivers = onSnapshot(driversCol, async (qs) => {
          const existing = new Map(drivers.value.map(d => [d.id, d]))
          qs.forEach(d => {
            existing.set(d.id, toUnifiedDriver(d.data(), d.id, 'drivers'))
          })
          drivers.value = Array.from(existing.values())
          
          // Update earnings when drivers are updated (debounced to avoid too many calls)
          if (drivers.value.length > 0) {
            const earningsPromises = drivers.value.map(async (driver) => {
              const earnings = await fetchDriverEarnings(driver.id)
              driver.earnings = earnings
              return driver
            })
            await Promise.all(earningsPromises)
          }
        }, (err) => console.error('[Realtime drivers] error:', err))

        unsubs.value.push(unsubDrivers)
      } catch (err) {
        console.error('[Realtime] setup error:', err)
      }
    }

    // UI helpers & actions
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
      selectedDriver.value = driver
    }

    const viewDocument = (documentUrl) => {
      if (documentUrl) {
        window.open(documentUrl, '_blank')
      } else {
        toast.error('Document not available')
      }
    }

    const openAddDriverModal = () => {
      showAddDriverModal.value = true
    }

    const closeAddDriverModal = () => {
      showAddDriverModal.value = false
      resetNewDriverForm()
    }

    const resetNewDriverForm = () => {
      newDriver.value = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contact: '',
        motorcycleInfo: {
          brand: '',
          model: '',
          plateNumber: '',
          year: ''
        },
        experience: '',
        availability: '',
        documents: {
          license: '',
          orcr: '',
          selfie: '',
          profilePicture: ''
        }
      }
      uploadProgress.value = {
        license: 0,
        orcr: 0,
        selfie: 0,
        profilePicture: 0
      }
    }

    const handleFileUpload = async (event, docType) => {
      const file = event.target.files[0]
      if (!file) return

      console.log('[v0] Starting file upload for:', docType, 'File:', file.name, 'Size:', file.size)

      try {
        const fileRef = storageRef(storage, `driver-documents/${Date.now()}_${file.name}`)
        console.log('[v0] Storage reference created:', fileRef.fullPath)
        
        const uploadTask = uploadBytesResumable(fileRef, file)

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            uploadProgress.value[docType] = Math.round(progress)
            console.log('[v0] Upload progress for', docType, ':', Math.round(progress), '%')
          },
          (error) => {
            console.error('[v0] Upload error for', docType, ':', error)
            console.error('[v0] Error code:', error.code)
            console.error('[v0] Error message:', error.message)
            console.error('[v0] Full error:', JSON.stringify(error, null, 2))
            
            // Show more specific error message
            if (error.code === 'storage/unauthorized') {
              toast.error(`Permission denied: Please check Firebase Storage rules for ${docType}`)
            } else if (error.code === 'storage/canceled') {
              toast.error(`Upload canceled for ${docType}`)
            } else {
              toast.error(`Failed to upload ${docType}: ${error.message}`)
            }
            uploadProgress.value[docType] = 0
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            newDriver.value.documents[docType] = downloadURL
            console.log('[v0] Upload successful for', docType, ':', downloadURL)
            toast.success(`${docType} uploaded successfully`)
          }
        )
      } catch (err) {
        console.error('[v0] File upload error for', docType, ':', err)
        console.error('[v0] Error details:', err.code, err.message)
        toast.error(`Failed to upload ${docType}: ${err.message}`)
      }
    }

    const submitAddDriver = async () => {
      try {
        isSubmitting.value = true

        // Validate all documents are uploaded
        const requiredDocs = ['license', 'orcr', 'selfie', 'profilePicture']
        for (const doc of requiredDocs) {
          if (!newDriver.value.documents[doc]) {
            toast.error(`Please upload ${doc}`)
            isSubmitting.value = false
            return
          }
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          newDriver.value.email,
          newDriver.value.password
        )
        const userId = userCredential.user.uid

        // Create driver document in Firestore
        const driverData = {
          firstName: newDriver.value.firstName,
          lastName: newDriver.value.lastName,
          fullName: `${newDriver.value.firstName} ${newDriver.value.lastName}`,
          email: newDriver.value.email,
          contact: newDriver.value.contact,
          phone: newDriver.value.contact,
          role: 'driver',
          profilePicture: newDriver.value.documents.profilePicture,
          status: 'active',
          approved: true,
          banned: false,
          rating: 0,
          deliveries: 0,
          earnings: 0,
          isOnline: false,
          driverInfo: {
            motorcycleInfo: {
              brand: newDriver.value.motorcycleInfo.brand,
              model: newDriver.value.motorcycleInfo.model,
              plateNumber: newDriver.value.motorcycleInfo.plateNumber,
              year: newDriver.value.motorcycleInfo.year
            },
            experience: newDriver.value.experience,
            availability: newDriver.value.availability,
            documents: {
              license: newDriver.value.documents.license,
              orcr: newDriver.value.documents.orcr,
              selfie: newDriver.value.documents.selfie,
              profilePicture: newDriver.value.documents.profilePicture
            },
            applicationStatus: 'approved',
            rating: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Add to both collections
        await setDoc(doc(db, 'users', userId), driverData)
        await setDoc(doc(db, 'drivers', userId), driverData)

        await loggingService.success(
          `New driver added by admin: ${driverData.fullName}`,
          loggingService.USER_TYPES.ADMIN,
          authStore.user?.uid,
          { action: 'driver_added', driverId: userId, driverName: driverData.fullName }
        )

        toast.success('Driver added successfully!')
        closeAddDriverModal()
        await loadDrivers()
      } catch (err) {
        console.error('Error adding driver:', err)
        toast.error(`Failed to add driver: ${err.message}`)
      } finally {
        isSubmitting.value = false
      }
    }

    const exportReport = async () => {
      try {
        // Ensure earnings are up to date before exporting
        console.log('[Export] Fetching latest earnings for all drivers...')
        const earningsPromises = drivers.value.map(async (driver) => {
          const earnings = await fetchDriverEarnings(driver.id)
          driver.earnings = earnings
          return driver
        })
        await Promise.all(earningsPromises)
        console.log('[Export] Earnings updated')

        // Helper function to format dates
        const formatDate = (dateValue) => {
          if (!dateValue) return 'N/A'
          try {
            if (typeof dateValue === 'string') {
              return new Date(dateValue).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            }
            if (dateValue.toDate) {
              return dateValue.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            }
            return new Date(dateValue).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          } catch (e) {
            return 'Invalid date'
          }
        }

        // Create PDF
        console.log('[Export] Creating PDF document...')
        const pdfDoc = new jsPDF('landscape', 'mm', 'a4')
        
        // Add title
        pdfDoc.setFontSize(18)
        pdfDoc.text('Drivers Report', 14, 15)
        
        // Add export date
        pdfDoc.setFontSize(10)
        pdfDoc.setTextColor(100, 100, 100)
        pdfDoc.text(`Exported on: ${new Date().toLocaleString('en-US')}`, 14, 22)
        pdfDoc.text(`Total Drivers: ${drivers.value.length}`, 14, 27)
        
        // Reset text color
        pdfDoc.setTextColor(0, 0, 0)
        
        // Prepare table data
        console.log('[Export] Preparing table data...')
        const tableData = drivers.value.map((driver) => {
          try {
            return [
              String(driver.id || 'N/A'),
              String(`${driver.firstName || ''} ${driver.lastName || ''}`.trim() || 'Unnamed Driver'),
              String(driver.email || 'N/A'),
              String(driver.phone || 'N/A'),
              String(driver.raw?.driverInfo?.motorcycleInfo?.brand || 'N/A'),
              String(driver.raw?.driverInfo?.motorcycleInfo?.model || 'N/A'),
              String(driver.plateNumber || 'N/A'),
              String(driver.status || 'N/A'),
              String(driver.deliveries || 0),
              `₱${Number(driver.earnings || 0).toLocaleString()}`,
              String(driver.raw?.driverInfo?.experience || 'N/A'),
              String(driver.raw?.driverInfo?.availability || 'N/A'),
              formatDate(driver.raw?.createdAt)
            ]
          } catch (e) {
            console.error(`[Export] Error processing driver ${driver?.id || 'unknown'}:`, e)
            return ['Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error']
          }
        })

        console.log('[Export] Table data prepared:', tableData.length, 'rows')

        // Add table
        console.log('[Export] Adding table to PDF...')
        
        const tableOptions = {
          startY: 32,
          head: [[
            'Driver ID',
            'Name',
            'Email',
            'Phone',
            'Vehicle Brand',
            'Vehicle Model',
            'Plate Number',
            'Status',
            'Deliveries',
            'Earnings',
            'Experience',
            'Availability',
            'Created At'
          ]],
          body: tableData,
          styles: { 
            fontSize: 6, 
            cellPadding: 1,
            overflow: 'linebreak'
          },
          headStyles: { 
            fillColor: [34, 197, 94], 
            textColor: 255, 
            fontStyle: 'bold',
            fontSize: 7
          },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 32, left: 10, right: 10 },
          tableWidth: 277,
          columnStyles: {
            0: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Driver ID
            1: { cellWidth: 25, fontSize: 6, overflow: 'linebreak' }, // Name
            2: { cellWidth: 30, fontSize: 5, overflow: 'linebreak' }, // Email
            3: { cellWidth: 18, fontSize: 5, overflow: 'linebreak' }, // Phone
            4: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Vehicle Brand
            5: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Vehicle Model
            6: { cellWidth: 18, fontSize: 5, overflow: 'linebreak' }, // Plate Number
            7: { cellWidth: 15, fontSize: 5, overflow: 'linebreak' }, // Status
            8: { cellWidth: 15, fontSize: 5, overflow: 'linebreak' }, // Deliveries
            9: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Earnings
            10: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Experience
            11: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Availability
            12: { cellWidth: 24, fontSize: 5, overflow: 'linebreak' }  // Created At
          }
        }
        
        // Try method approach first (after applyPlugin)
        if (typeof pdfDoc.autoTable === 'function') {
          console.log('[Export] Using pdfDoc.autoTable method')
          pdfDoc.autoTable(tableOptions)
        } else if (typeof autoTable === 'function') {
          // Fallback: use standalone function
          console.log('[Export] Using autoTable standalone function')
          autoTable(pdfDoc, tableOptions)
        } else {
          throw new Error('PDF table plugin not loaded. Please refresh the page and try again.')
        }
        
        console.log('[Export] Table added successfully')

        // Save PDF
        console.log('[Export] Saving PDF...')
        const fileName = `drivers_report_${new Date().toISOString().split('T')[0]}.pdf`
        pdfDoc.save(fileName)

        console.log('[Export] Export completed successfully')
        toast.success(`Successfully exported ${drivers.value.length} drivers as PDF`)
      } catch (err) {
        console.error('[Export] Error exporting drivers:', err)
        toast.error(`Failed to export driver report: ${err.message || 'Please try again.'}`)
      }
    }


    watch(showTrackingModal, async (newVal) => {
      if (newVal && trackedDriver.value) {
        // Wait for DOM to update
        await nextTick()
        // Initialize Google Maps
        await initializeGoogleMap()
      }
    })

    const initializeGoogleMap = async () => {
      if (driverMap.value) {
        console.log('[v0] Map already initialized, skipping...')
        return
      }

      // Load Google Maps API if not already loaded
      if (!window.google || !window.google.maps) {
        console.log('[v0] Loading Google Maps API...')
        await loadGoogleMapsAPI()
      }

      const mapElement = document.getElementById('driver-tracking-map')
      if (!mapElement) {
        console.error('[v0] Map element not found')
        return
      }

      console.log('[v0] Initializing Google Map...')

      // Initialize Google Map centered on Calapan City
      driverMap.value = new window.google.maps.Map(mapElement, {
        center: { lat: driverLatLng.value.lat, lng: driverLatLng.value.lng },
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Create custom driver marker icon
      const driverIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
            <g transform="translate(10, 10)">
              <path d="M4 8a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V8z" fill="#ffffff"/>
              <circle cx="7" cy="15" r="1.5" fill="#10B981"/>
              <circle cx="13" cy="15" r="1.5" fill="#10B981"/>
            </g>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
      }

      // Add driver marker
      driverMarker.value = new window.google.maps.Marker({
        position: { lat: driverLatLng.value.lat, lng: driverLatLng.value.lng },
        map: driverMap.value,
        title: `${trackedDriver.value?.firstName} ${trackedDriver.value?.lastName}`,
        icon: driverIcon,
        animation: window.google.maps.Animation.DROP
      })

      console.log('[v0] Map initialized successfully')

      startLocationTracking()

      if (activeOrder.value) {
        await showRouteToDestination()
      }
    }

    const loadGoogleMapsAPI = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve()
          return
        }

        const script = document.createElement('script')
        // Replace with your actual Google Maps API key
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&loading=async`
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Google Maps API'))
        document.head.appendChild(script)
      })
    }

    const showRouteToDestination = async () => {
      if (!activeOrder.value || !window.google || !window.google.maps) return

      try {
        const directionsService = new window.google.maps.DirectionsService()
        
        // Initialize directions renderer if not exists
        if (!directionsRenderer.value) {
          directionsRenderer.value = new window.google.maps.DirectionsRenderer({
            map: driverMap.value,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#10B981',
              strokeWeight: 5,
              strokeOpacity: 0.8
            }
          })
        }

        // Get route from driver's current location to delivery address
        const request = {
          origin: { lat: driverLatLng.value.lat, lng: driverLatLng.value.lng },
          destination: activeOrder.value.deliveryAddress || activeOrder.value.pickupAddress,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        }

        directionsService.route(request, (result, status) => {
          if (status === 'OK') {
            directionsRenderer.value.setDirections(result)
            
            const route = result.routes[0].legs[0]
            distanceToDestination.value = route.distance.text
            estimatedArrival.value = route.duration.text
            
            console.log('[v0] Route calculated:', route.distance.text, route.duration.text)
          } else {
            console.error('[v0] Directions request failed:', status)
            // Fallback to Distance Matrix API
            calculateDistanceMatrix()
          }
        })
      } catch (err) {
        console.error('[v0] Error showing route:', err)
      }
    }

    const calculateDistanceMatrix = async () => {
      if (!activeOrder.value || !window.google || !window.google.maps) return

      try {
        const service = new window.google.maps.DistanceMatrixService()
        
        const request = {
          origins: [{ lat: driverLatLng.value.lat, lng: driverLatLng.value.lng }],
          destinations: [activeOrder.value.deliveryAddress || activeOrder.value.pickupAddress],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC
        }

        service.getDistanceMatrix(request, (response, status) => {
          if (status === 'OK') {
            const result = response.rows[0].elements[0]
            if (result.status === 'OK') {
              distanceToDestination.value = result.distance.text
              estimatedArrival.value = result.duration.text
              console.log('[v0] Distance calculated:', result.distance.text, result.duration.text)
            }
          } else {
            console.error('[v0] Distance Matrix request failed:', status)
          }
        })
      } catch (err) {
        console.error('[v0] Error calculating distance:', err)
      }
    }

    const startLocationTracking = () => {
      // Calapan City area coordinates - dummy data for simulation
      const locations = [
        { name: 'Calapan City Center', lat: 13.4127, lng: 121.1794 },
        { name: 'Barangay Ibaba East', lat: 13.4089, lng: 121.1823 },
        { name: 'Barangay Masipit', lat: 13.4156, lng: 121.1756 },
        { name: 'Barangay Guinobatan', lat: 13.4201, lng: 121.1812 },
        { name: 'Barangay Canubing I', lat: 13.4078, lng: 121.1745 },
        { name: 'Barangay San Antonio', lat: 13.4145, lng: 121.1889 }
      ]
      
      let locationIndex = 0
      currentDriverLocation.value = locations[locationIndex].name
      driverLatLng.value = { lat: locations[locationIndex].lat, lng: locations[locationIndex].lng }
      lastLocationUpdate.value = 'Just now'

      if (locationUpdateInterval.value) {
        clearInterval(locationUpdateInterval.value)
      }

      locationUpdateInterval.value = setInterval(() => {
        locationIndex = (locationIndex + 1) % locations.length
        const newLocation = locations[locationIndex]
        
        currentDriverLocation.value = newLocation.name
        driverLatLng.value = { lat: newLocation.lat, lng: newLocation.lng }
        lastLocationUpdate.value = 'Just now'

        if (driverMarker.value && driverMap.value) {
          const newPos = new window.google.maps.LatLng(newLocation.lat, newLocation.lng)
          driverMarker.value.setPosition(newPos)
          driverMap.value.panTo(newPos)
          
          if (activeOrder.value) {
            showRouteToDestination()
          }
        }

        console.log('[v0] Driver location updated:', currentDriverLocation.value)
      }, 8000) // Update every 8 seconds
    }

    const refreshDriverLocation = () => {
      lastLocationUpdate.value = 'Refreshing...'
      // In a real app, you'd fetch the latest location from your backend/database here.
      // For this simulation, we'll just simulate a refresh.
      setTimeout(() => {
        lastLocationUpdate.value = 'Just now'
        if (driverMap.value && driverMarker.value) {
          driverMap.value.panTo(driverMarker.value.getPosition())
          if (activeOrder.value) {
            showRouteToDestination()
          }
        }
        toast.success('Location refreshed')
      }, 500)
    }

    const closeTrackingModal = () => {
      showTrackingModal.value = false
      trackedDriver.value = null
      activeOrder.value = null
      distanceToDestination.value = 'N/A'
      estimatedArrival.value = 'N/A'
      
      if (locationUpdateInterval.value) {
        clearInterval(locationUpdateInterval.value)
        locationUpdateInterval.value = null
      }
      
      if (directionsRenderer.value) {
        directionsRenderer.value.setMap(null)
        directionsRenderer.value = null
      }
      if (driverMarker.value) {
        driverMarker.value.setMap(null)
        driverMarker.value = null
      }
      if (destinationMarker.value) {
        destinationMarker.value.setMap(null)
        destinationMarker.value = null
      }
      driverMap.value = null
    }

    const suspendDriver = (driver) => {
      driverToSuspend.value = driver
      suspendReason.value = ''
      showSuspendModal.value = true
    }

    const closeSuspendModal = () => {
      showSuspendModal.value = false
      driverToSuspend.value = null
      suspendReason.value = ''
    }

    const confirmSuspendDriver = () => {
      if (selectedDriver.value) {
        driverToSuspend.value = selectedDriver.value
        showSuspendModal.value = true
      }
    }

    const executeSuspend = async () => {
      if (!driverToSuspend.value) return

      // Validate reason is provided for suspension
      if (driverToSuspend.value.status !== 'suspended' && !suspendReason.value.trim()) {
        toast.error('Please provide a reason for suspension')
        return
      }

      try {
        const driver = driverToSuspend.value
        const newStatus = driver.status === 'suspended' ? 'active' : 'suspended'
        const col = driver.source === 'drivers' ? 'drivers' : 'users'
        
        const updateData = { 
          status: newStatus,
          updatedAt: new Date().toISOString()
        }

        // Add suspension reason if suspending
        if (newStatus === 'suspended') {
          updateData.suspensionReason = suspendReason.value.trim()
          updateData.suspendedAt = new Date().toISOString()
        } else {
          // Clear suspension reason when unsuspending
          updateData.suspensionReason = null
          updateData.suspendedAt = null
        }
        
        await updateDoc(doc(db, col, driver.id), updateData)

        const idx = drivers.value.findIndex(d => d.id === driver.id)
        if (idx !== -1) {
          drivers.value[idx].status = newStatus
        }

        if (selectedDriver.value?.id === driver.id) {
          selectedDriver.value.status = newStatus
        }

        const driverName = `${driver.firstName} ${driver.lastName}`.trim()
        if (newStatus === 'suspended') {
          await loggingService.warning(
            `Driver suspended: ${driverName}`,
            loggingService.USER_TYPES.ADMIN,
            authStore.user?.uid,
            { action: 'driver_suspend', driverId: driver.id, driverName }
          )
        } else {
          await loggingService.success(
            `Driver unsuspended: ${driverName}`,
            loggingService.USER_TYPES.ADMIN,
            authStore.user?.uid,
            { action: 'driver_unsuspend', driverId: driver.id, driverName }
          )
        }

        toast.success(newStatus === 'suspended' ? 'Driver suspended successfully' : 'Driver unsuspended successfully')
        closeSuspendModal()
      } catch (err) {
        console.error('Error updating driver status:', err)
        toast.error('Failed to update driver status')
      }
    }

    const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
    const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

    const trackDriver = async (driver) => {
      trackedDriver.value = driver
      showTrackingModal.value = true
      
      try {
        // Query orders collection for active orders assigned to this driver
        const ordersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', driver.id),
          where('status', 'in', ['driver_assigned', 'picked_up', 'in_transit'])
        )
        
        const ordersSnapshot = await getDocs(ordersQuery)
        
        if (!ordersSnapshot.empty) {
          // Get the first active order
          const orderDoc = ordersSnapshot.docs[0]
          activeOrder.value = {
            id: orderDoc.id,
            ...orderDoc.data()
          }
          console.log('[v0] Found active order for driver:', activeOrder.value)
        } else {
          activeOrder.value = null
          distanceToDestination.value = 'No active order'
          estimatedArrival.value = 'N/A'
          console.log('[v0] No active order found for driver')
        }
      } catch (err) {
        console.error('[v0] Error fetching driver active order:', err)
        activeOrder.value = null
        distanceToDestination.value = 'Error loading'
        estimatedArrival.value = 'N/A'
      }
    }

    const trackDriverFromModal = async () => {
      if (selectedDriver.value) {
        trackedDriver.value = selectedDriver.value
        showTrackingModal.value = true
        
        try {
          const ordersQuery = query(
            collection(db, 'orders'),
            where('driverId', '==', selectedDriver.value.id),
            where('status', 'in', ['driver_assigned', 'picked_up', 'in_transit'])
          )
          
          const ordersSnapshot = await getDocs(ordersQuery)
          
          if (!ordersSnapshot.empty) {
            const orderDoc = ordersSnapshot.docs[0]
            activeOrder.value = {
              id: orderDoc.id,
              ...orderDoc.data()
            }
            console.log('[v0] Found active order for driver:', activeOrder.value)
          } else {
            activeOrder.value = null
            distanceToDestination.value = 'No active order'
            estimatedArrival.value = 'N/A'
            console.log('[v0] No active order found for driver')
          }
        } catch (err) {
          console.error('[v0] Error fetching driver active order:', err)
          activeOrder.value = null
          distanceToDestination.value = 'Error loading'
          estimatedArrival.value = 'N/A'
        }
      }
    }

    onMounted(async () => {
      loadDrivers()
      setupRealtimeListeners()

      try {
        console.log('[v0] Preloading Google Maps API...')
        await loadGoogleMapsAPI()
        console.log('[v0] Google Maps API preloaded successfully')
      } catch (err) {
        console.error('[v0] Failed to preload Google Maps API:', err)
      }
    })

    onUnmounted(() => {
      unsubs.value.forEach(u => { try { u && u() } catch {} })
      unsubs.value = []
      if (locationUpdateInterval.value) {
        clearInterval(locationUpdateInterval.value)
      }
      // Clean up map instance if it exists
      if (driverMap.value) {
        // If using Google Maps, the map object itself doesn't need explicit removal usually
        // unless you are removing the DOM element.
        driverMap.value = null
        driverMarker.value = null
      }
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
      totalEarnings, // Changed from averageRating
      filteredDrivers,
      paginatedDrivers,
      totalPages,
      loadDrivers,
      getStatusClass,
      viewDocument,
      trackDriverFromModal,
      suspendDriver,
      confirmSuspendDriver,
      executeSuspend,
      closeSuspendModal,
      previousPage,
      nextPage,
      selectedDriver,
      showTrackingModal,
      trackedDriver,
      currentDriverLocation,
      lastLocationUpdate,
      showSuspendModal,
      driverToSuspend,
      refreshDriverLocation,
      closeTrackingModal,
      driverLatLng, // for template access
      distanceToDestination, // for template access
      estimatedArrival, // for template access
      activeOrder, // for template access
      
      showAddDriverModal,
      openAddDriverModal,
      closeAddDriverModal,
      newDriver,
      isSubmitting,
      uploadProgress,
      handleFileUpload,
      submitAddDriver,
      
      // Export Report
      exportReport
    }
  }
}
</script>
