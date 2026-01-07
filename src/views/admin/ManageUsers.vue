<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Manage Users</h1>
        <p class="text-gray-600">Review and manage user accounts and approvals</p>
      </div>
      <div class="flex items-center space-x-4">
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
          Export PDF
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
              <th 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                @click="sortByRegistered"
              >
                <div class="flex items-center space-x-1">
                  <span>Registered</span>
                  <div class="flex flex-col">
                    <svg 
                      v-if="sortBy === 'registered' && sortOrder === 'asc'"
                      class="w-3 h-3 text-primary" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/>
                    </svg>
                    <svg 
                      v-else-if="sortBy === 'registered' && sortOrder === 'desc'"
                      class="w-3 h-3 text-primary" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                    <svg 
                      v-else
                      class="w-3 h-3 text-gray-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"/>
                    </svg>
                  </div>
                </div>
              </th>
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
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50" :class="{ 'bg-red-50': user.fraudFlags && user.fraudFlags.length > 0 }">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" :class="user.profilePictureUrl ? '' : 'bg-primary'">
                    <img
                      v-if="user.profilePictureUrl"
                      :src="user.profilePictureUrl"
                      :alt="user.name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white text-sm font-medium">{{ user.initials }}</span>
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
      
      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }} users
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Previous
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 text-sm font-medium rounded-md',
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md',
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            Next
          </button>
        </div>
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
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" :class="selectedUser.profilePictureUrl ? '' : 'bg-primary'">
                <img
                  v-if="selectedUser.profilePictureUrl"
                  :src="selectedUser.profilePictureUrl"
                  :alt="selectedUser.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-white text-2xl font-medium">{{ selectedUser.initials }}</span>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">{{ selectedUser.name }}</h4>
                <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
              </div>
            </div>

            <!-- Facial Registration & Valid ID Section -->
            <div v-if="selectedUser.faceRegistrationImage || selectedUser.validIdUrl" class="mb-6 bg-white rounded-lg p-4 border border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Verification Documents</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Facial Registration Image -->
                <div v-if="selectedUser.faceRegistrationImage">
                  <p class="text-sm font-medium text-gray-700 mb-2">Facial Registration</p>
                  <div class="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      :src="selectedUser.faceRegistrationImage"
                      alt="Facial Registration"
                      class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImageModal(selectedUser.faceRegistrationImage, 'Facial Registration')"
                    />
                    <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Verified
                    </div>
                  </div>
                  <p v-if="selectedUser.faceRegisteredAt" class="text-xs text-gray-500 mt-1">
                    Registered: {{ formatDate(selectedUser.faceRegisteredAt) }}
                  </p>
                </div>
                <div v-else class="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <p class="text-sm text-gray-500">No facial registration</p>
                </div>

                <!-- Valid ID -->
                <div v-if="selectedUser.validIdUrl">
                  <p class="text-sm font-medium text-gray-700 mb-2">Valid ID</p>
                  <div class="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      v-if="selectedUser.validIdUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)"
                      :src="selectedUser.validIdUrl"
                      alt="Valid ID"
                      class="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImageModal(selectedUser.validIdUrl, 'Valid ID')"
                    />
                    <a
                      v-else
                      :href="selectedUser.validIdUrl"
                      target="_blank"
                      class="flex items-center justify-center w-full h-full text-blue-600 hover:text-blue-800"
                    >
                      <div class="text-center">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-sm">View PDF</p>
                      </div>
                    </a>
                    <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Verified
                    </div>
                  </div>
                  <p v-if="selectedUser.validIdUploadedAt" class="text-xs text-gray-500 mt-1">
                    Uploaded: {{ formatDate(selectedUser.validIdUploadedAt) }}
                  </p>
                </div>
                <div v-else class="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <p class="text-sm text-gray-500">No valid ID uploaded</p>
                </div>
              </div>
            </div>

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
                <p class="text-base font-medium text-gray-900">{{ formatRegisteredDate(selectedUser.createdAt) }}</p>
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

    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4" @click="closeImageModal">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" @click.stop>
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">{{ imageModalTitle }}</h3>
          <button @click="closeImageModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <img :src="imageModalUrl" :alt="imageModalTitle" class="w-full h-auto rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { collection, query, where, getDocs, getCountFromServer, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { loggingService } from '@/services/loggingService'
import jsPDF from 'jspdf'
import { applyPlugin, autoTable } from 'jspdf-autotable'

applyPlugin(jsPDF)

export default {
  name: 'ManageUsers',
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()

    const loading = ref(false)
    const searchQuery = ref('')
    const statusFilter = ref('')
    const barangayFilter = ref('')
    const users = ref([])
    
    const showUserDetailsModal = ref(false)
    const selectedUser = ref(null)
    const userOrders = ref([])
    const loadingUserOrders = ref(false)
    
    // Image modal state
    const showImageModal = ref(false)
    const imageModalUrl = ref('')
    const imageModalTitle = ref('')
    
    // Sorting state
    const sortBy = ref('registered') // Default sort by registered date
    const sortOrder = ref('desc') // Default descending order (newest first)
    
    const fraudSettings = ref(null)
    const showFlaggedOnly = ref(false)
    
    // Pagination
    const currentPage = ref(1)
    const itemsPerPage = ref(5)

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
          profilePictureUrl: userData.profilePictureUrl || userData.photoURL || '',
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
      
      // Sort by registered date
      if (sortBy.value === 'registered') {
        filtered = filtered.sort((a, b) => {
          // Get actual date values for comparison
          const getDateValue = (user) => {
            if (!user.createdAt) return 0
            // Handle Firestore Timestamp
            if (user.createdAt && typeof user.createdAt === 'object' && user.createdAt.toDate) {
              return user.createdAt.toDate().getTime()
            }
            // Handle ISO string
            if (typeof user.createdAt === 'string') {
              return new Date(user.createdAt).getTime()
            }
            // Handle Date object
            if (user.createdAt instanceof Date) {
              return user.createdAt.getTime()
            }
            // Handle timestamp number
            if (typeof user.createdAt === 'number') {
              return user.createdAt
            }
            return 0
          }
          
          const dateA = getDateValue(a)
          const dateB = getDateValue(b)
          
          if (sortOrder.value === 'asc') {
            return dateA - dateB // Ascending: oldest first
          } else {
            return dateB - dateA // Descending: newest first
          }
        })
      }
      
      return filtered
    })
    
    // Pagination computed properties
    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
    })
    
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredUsers.value.slice(start, end)
    })
    
    // Pagination methods
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
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
    
    // Reset to page 1 when filters change
    watch([searchQuery, statusFilter, barangayFilter, showFlaggedOnly], () => {
      currentPage.value = 1
    })

    const loadUsers = async () => {
      loading.value = true
      try {
        const fetchedUsers = await authStore.getAllUsers()
        users.value = fetchedUsers.map(userData => ({
          ...userData,
          name: `${userData.firstName} ${userData.lastName}`.trim(),
          initials: `${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}`.toUpperCase(),
          profilePictureUrl: userData.profilePictureUrl || userData.photoURL || '',
          registeredDate: formatRegisteredDate(userData.createdAt),
          status: userData.status === 'banned' || userData.banned ? 'flagged' : 
                  userData.status === 'flagged' ? 'flagged' :
                  userData.approved ? 'approved' : 'pending',
          totalOrders: 0,
          cancelledOrders: 0,
          faceRegistrationImage: userData.faceRegistrationImage || null,
          faceRegisteredAt: userData.faceRegisteredAt || null,
          validIdUrl: userData.validIdUrl || null,
          validIdUploadedAt: userData.validIdUploadedAt || null
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
      try {
        // Fetch fresh user data from Firestore to ensure we have all fields including faceRegistrationImage
        const userDoc = await getDoc(doc(db, 'users', user.id))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          selectedUser.value = {
            ...user,
            ...userData,
            registeredDate: formatRegisteredDate(userData.createdAt),
            faceRegistrationImage: userData.faceRegistrationImage || null,
            faceRegisteredAt: userData.faceRegisteredAt || null,
            validIdUrl: userData.validIdUrl || null,
            validIdUploadedAt: userData.validIdUploadedAt || null
          }
        } else {
          selectedUser.value = {
            ...user,
            registeredDate: formatRegisteredDate(user.createdAt)
          }
        }
        showUserDetailsModal.value = true
        await fetchUserOrders(user.id)
      } catch (error) {
        console.error('[v0] Error fetching user details:', error)
        // Fallback to using the user object from the list
        selectedUser.value = {
          ...user,
          registeredDate: formatRegisteredDate(user.createdAt)
        }
        showUserDetailsModal.value = true
        await fetchUserOrders(user.id)
      }
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

    const openImageModal = (imageUrl, title) => {
      imageModalUrl.value = imageUrl
      imageModalTitle.value = title
      showImageModal.value = true
    }

    const closeImageModal = () => {
      showImageModal.value = false
      imageModalUrl.value = ''
      imageModalTitle.value = ''
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString.toDate()
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return dateString
      }
    }

    const formatRegisteredDate = (dateValue) => {
      if (!dateValue) return 'N/A'
      try {
        let date
        // Handle Firestore Timestamp
        if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
          date = dateValue.toDate()
        }
        // Handle ISO string
        else if (typeof dateValue === 'string') {
          date = new Date(dateValue)
        }
        // Handle Date object
        else if (dateValue instanceof Date) {
          date = dateValue
        }
        // Handle timestamp number
        else if (typeof dateValue === 'number') {
          date = new Date(dateValue)
        }
        else {
          return 'N/A'
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return 'N/A'
        }

        // Format as: "Jan 15, 2024"
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        console.error('[v0] Error formatting registered date:', error, dateValue)
        return 'N/A'
      }
    }

    const sortByRegistered = () => {
      if (sortBy.value === 'registered') {
        // Toggle sort order
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        // Set to registered and default to descending (newest first)
        sortBy.value = 'registered'
        sortOrder.value = 'desc'
      }
      // Reset to first page when sorting
      currentPage.value = 1
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

    const exportUsers = async () => {
      try {
        console.log('[Export] Creating PDF document...')
        
        // Create PDF document in landscape orientation
        const pdfDoc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        })
        
        // Add title
        pdfDoc.setFontSize(18)
        pdfDoc.setFont('helvetica', 'bold')
        pdfDoc.text('Users Report', 14, 15)
        
        // Add export date
        pdfDoc.setFontSize(10)
        pdfDoc.setFont('helvetica', 'normal')
        pdfDoc.setTextColor(100, 100, 100)
        pdfDoc.text(`Exported on: ${new Date().toLocaleString('en-US')}`, 14, 22)
        pdfDoc.text(`Total Users: ${users.value.length}`, 14, 27)
        
        // Reset text color
        pdfDoc.setTextColor(0, 0, 0)
        
        // Prepare table data
        console.log('[Export] Preparing table data...')
        const tableData = users.value.map((user) => {
          try {
            return [
              String(user.name || 'N/A'),
              String(user.email || 'N/A'),
              String(user.contact || 'N/A'),
              String(user.barangay || 'N/A'),
              String(user.status || 'N/A'),
              String(user.registeredDate || 'N/A'),
              String(user.totalOrders || 0),
              String(user.cancelledOrders || 0)
            ]
          } catch (e) {
            console.error(`[Export] Error processing user ${user?.id || 'unknown'}:`, e)
            return ['Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error', 'Error']
          }
        })

        console.log('[Export] Table data prepared:', tableData.length, 'rows')

        // Add table
        console.log('[Export] Adding table to PDF...')
        
        const tableOptions = {
          startY: 32,
          head: [[
            'Name',
            'Email',
            'Contact',
            'Barangay',
            'Status',
            'Registered',
            'Total Orders',
            'Cancelled Orders'
          ]],
          body: tableData,
          styles: { 
            fontSize: 7, 
            cellPadding: 2,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          headStyles: { 
            fillColor: [34, 197, 94], 
            textColor: 255, 
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center'
          },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 32, left: 10, right: 10 },
          tableWidth: 277,
          columnStyles: {
            0: { cellWidth: 35, fontSize: 7, overflow: 'linebreak' }, // Name
            1: { cellWidth: 40, fontSize: 6, overflow: 'linebreak' }, // Email
            2: { cellWidth: 25, fontSize: 7, overflow: 'linebreak' }, // Contact
            3: { cellWidth: 30, fontSize: 7, overflow: 'linebreak' }, // Barangay
            4: { cellWidth: 20, fontSize: 7, overflow: 'linebreak' }, // Status
            5: { cellWidth: 30, fontSize: 6, overflow: 'linebreak' }, // Registered
            6: { cellWidth: 25, fontSize: 7, overflow: 'linebreak' }, // Total Orders
            7: { cellWidth: 25, fontSize: 7, overflow: 'linebreak' }  // Cancelled Orders
          }
        }
        
        // Use autoTable
        if (typeof pdfDoc.autoTable === 'function') {
          console.log('[Export] Using pdfDoc.autoTable method')
          pdfDoc.autoTable(tableOptions)
        } else if (typeof autoTable === 'function') {
          console.log('[Export] Using autoTable standalone function')
          autoTable(pdfDoc, tableOptions)
        } else {
          throw new Error('PDF table plugin not loaded. Please refresh the page and try again.')
        }
        
        console.log('[Export] Table added successfully')
        
        // Save PDF directly using jsPDF's save method (ensures proper PDF format)
        // Ensure file extension is .pdf
        const dateStr = new Date().toISOString().split('T')[0]
        const fileName = `users_export_${dateStr}.pdf`
        
        // Use jsPDF's save method which handles PDF MIME type correctly
        pdfDoc.save(fileName, { returnPromise: false })
        
        console.log('[Export] PDF saved:', fileName)
        toast.success('User data exported to PDF successfully')
      } catch (error) {
        console.error('[Export] Error exporting users:', error)
        toast.error(`Failed to export users: ${error.message || 'Please try again.'}`)
      }
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
        await loadUsers()
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
      loading,
      searchQuery,
      statusFilter,
      barangayFilter,
      users,
      barangays,
      userStats,
      filteredUsers,
      paginatedUsers,
      currentPage,
      itemsPerPage,
      totalPages,
      goToPage,
      nextPage,
      previousPage,
      showUserDetailsModal,
      selectedUser,
      userOrders,
      loadingUserOrders,
      flaggedUsersCount,
      showFlaggedOnly,
      loadUsers,
      approveUser,
      rejectUser,
      flagUser,
      unflagUser,
      viewUserDetails,
      closeUserDetailsModal,
      flagUserFromModal,
      unflagUserFromModal,
      showImageModal,
      imageModalUrl,
      imageModalTitle,
      openImageModal,
      closeImageModal,
      formatDate,
      formatRegisteredDate,
      sortBy,
      sortOrder,
      sortByRegistered,
      exportUsers
    }
  }
}
</script>
