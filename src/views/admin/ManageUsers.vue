<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Green Banner Header -->
    <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Manage Users</h1>
          <p class="text-white/90 text-sm sm:text-base">Review and manage user accounts and approvals</p>
        </div>
        <div class="flex gap-2 sm:gap-3 flex-wrap">
          <button 
            @click="exportUsers"
            :disabled="loading"
            class="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base border border-white/30"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Exporting...' : 'Export PDF' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Fraud Detection Alert Banner -->
    <div v-if="flaggedUsersCount > 0" class="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 shadow-md">
      <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
        <div class="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm sm:text-base font-semibold text-red-900">Fraud Detection Alert</h3>
          <p class="text-sm text-red-800 mt-1">
            {{ flaggedUsersCount }} user{{ flaggedUsersCount > 1 ? 's' : '' }} flagged for suspicious behavior. 
            Review flagged users below (marked with warning icons).
          </p>
        </div>
        <button 
          @click="showFlaggedOnly = !showFlaggedOnly"
          class="px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 whitespace-nowrap"
        >
          {{ showFlaggedOnly ? 'Show All' : 'Show Flagged Only' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Total Users</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ userStats.total }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
              <path d="M320 80c57.4 0 104 46.6 104 104s-46.6 104-104 104s-104-46.6-104-104S262.6 80 320 80M96 152c39.8 0 72 32.2 72 72s-32.2 72-72 72s-72-32.2-72-72s32.2-72 72-72M0 480c0-70.7 57.3-128 128-128c12.8 0 25.2 1.9 36.9 5.4C132 394.2 112 442.8 112 496v16c0 11.4 2.4 22.2 6.7 32H32c-17.7 0-32-14.3-32-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32v-16c0-53.2-20-101.8-52.9-138.6c11.7-3.5 24.1-5.4 36.9-5.4c70.7 0 128 57.3 128 128v32c0 17.7-14.3 32-32 32zM472 224c0-39.8 32.2-72 72-72s72 32.2 72 72s-32.2 72-72 72s-72-32.2-72-72M160 496c0-88.4 71.6-160 160-160s160 71.6 160 160v16c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Approved</p>
            <p class="text-xl sm:text-2xl font-bold text-[#74E600]">{{ userStats.approved }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#74E600]/20 to-[#3ED400]/20 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#74E600]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M10.586 2.1a2 2 0 0 1 2.7-.116l.128.117L15.314 4H18a2 2 0 0 1 1.994 1.85L20 6v2.686l1.9 1.9a2 2 0 0 1 .116 2.701l-.117.127l-1.9 1.9V18a2 2 0 0 1-1.85 1.995L18 20h-2.685l-1.9 1.9a2 2 0 0 1-2.701.116l-.127-.116l-1.9-1.9H6a2 2 0 0 1-1.995-1.85L4 18v-2.686l-1.9-1.9a2 2 0 0 1-.116-2.701l.116-.127l1.9-1.9V6a2 2 0 0 1 1.85-1.994L6 4h2.686z" class="duoicon-secondary-layer" opacity="0.3"/>
              <path fill-rule="evenodd" d="m15.079 8.983l-4.244 4.244l-1.768-1.768a1 1 0 1 0-1.414 1.415l2.404 2.404a1.1 1.1 0 0 0 1.556 0l4.88-4.881a1 1 0 0 0-1.414-1.414" class="duoicon-primary-layer"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
            <p class="text-xl sm:text-2xl font-bold text-[#3ED400]">{{ userStats.pending }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#3ED400]/20 to-[#00C851]/20 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3ED400]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m1.675-2.625l.7-.7L17.5 16.8V14h-1v3.2zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v6.25q-.45-.325-.95-.55T19 10.3V5h-2v3H7V5H5v14h5.3q.175.55.4 1.05t.55.95zm7-16q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Banned</p>
            <p class="text-xl sm:text-2xl font-bold text-[#00C851]">{{ userStats.flagged }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#00C851]/20 to-[#3ED400]/20 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Name, email, or contact..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="flagged">Banned</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
          <select v-model="barangayFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
            <option value="">All Barangays</option>
            <option v-for="barangay in barangays" :key="barangay" :value="barangay">
              {{ barangay }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900">User Accounts</h3>
        <button 
          @click="loadUsers"
          :disabled="loading"
          class="text-sm px-4 py-2 bg-[#00C851] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Loading...' : 'Refresh Users' }}
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10">
            <tr>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">User</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
              <th 
                class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-[#00C851]/5 select-none transition-colors duration-200"
                @click="sortByRegistered"
              >
                <div class="flex items-center space-x-1">
                  <span>Registered</span>
                  <div class="flex flex-col">
                    <svg 
                      v-if="sortBy === 'registered' && sortOrder === 'asc'"
                      class="w-3 h-3 text-[#00C851]" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/>
                    </svg>
                    <svg 
                      v-else-if="sortBy === 'registered' && sortOrder === 'desc'"
                      class="w-3 h-3 text-[#00C851]" 
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
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Orders</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cancelled</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading && users.length === 0">
              <td colspan="8" class="px-4 sm:px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C851]"></div>
                  <span>Loading users...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="8" class="px-4 sm:px-6 py-8 text-center text-gray-500">
                No users found
              </td>
            </tr>
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-[#00C851]/5 transition-colors duration-200" :class="{ 'bg-red-50': user.fraudFlags && user.fraudFlags.length > 0 }">
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md" :class="user.profilePictureUrl ? '' : 'bg-gradient-to-br from-[#00C851] to-[#3ED400]'">
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
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.contact }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.barangay }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.registeredDate }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <span class="font-medium text-gray-900">{{ user.totalOrders || 0 }}</span>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <span :class="user.cancelledOrders > 0 ? 'font-medium text-red-600' : 'text-gray-500'">
                  {{ user.cancelledOrders || 0 }}
                </span>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full',
                  user.status === 'approved' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  user.status === 'flagged' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
                ]">
                  {{ user.status === 'flagged' ? 'Banned' : user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                </span>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-if="user.status === 'pending'"
                    @click="approveUser(user)"
                    :disabled="loading"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#74E600] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>
                  <button 
                    v-if="user.status === 'pending'"
                    @click="rejectUser(user)"
                    :disabled="loading"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                  <button 
                    v-if="user.status === 'approved'"
                    @click="flagUser(user)"
                    :disabled="loading"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ban
                  </button>
                  <button 
                    v-if="user.status === 'flagged'"
                    @click="unflagUser(user)"
                    :disabled="loading"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#74E600] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Unban
                  </button>
                  <button 
                    @click="viewUserDetails(user)"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#00C851] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center">
          <span class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} of {{ filteredUsers.length }} users
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#00C851]'
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
                'px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                currentPage === page
                  ? 'bg-[#00C851] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#00C851]'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#00C851]'
            ]"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- View User Details Modal -->
    <div v-if="showUserDetailsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-1.5 sm:p-2" @click.self="closeUserDetailsModal">
      <div class="relative mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[98vh] flex flex-col" @click.stop>
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] p-2 sm:p-3 rounded-t-2xl flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <div class="p-1 bg-white/20 backdrop-blur-sm rounded">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-bold text-white">User Details</h3>
                <p class="text-xs text-white/90 hidden sm:block">Complete user information</p>
              </div>
            </div>
            <button @click="closeUserDetailsModal" class="text-white/90 hover:text-white hover:bg-white/20 rounded p-0.5 transition-all duration-200">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div v-if="selectedUser" class="p-2 sm:p-3 overflow-y-auto flex-1">
          <div v-if="userDetailsSections.length > 1" class="mb-3">
            <!-- Section Tabs -->
            <div class="flex justify-center items-center gap-1 mb-2 flex-wrap">
              <div
                v-for="(section, index) in userDetailsSections"
                :key="section.id"
                @click="goToUserDetailsPage(index)"
                :class="index === userDetailsCurrentPage ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
                class="px-2 py-1 text-xs font-medium rounded-lg cursor-pointer transition-all duration-200"
              >
                {{ section.title }}
              </div>
            </div>
            <!-- Pagination Dots -->
            <div class="flex justify-center items-center gap-1.5 mt-2">
              <div
                v-for="(section, index) in userDetailsSections"
                :key="`dot-${section.id}`"
                @click="goToUserDetailsPage(index)"
                :class="index === userDetailsCurrentPage ? 'bg-[#00C851] w-2.5 h-2.5' : 'bg-gray-300 hover:bg-gray-400'"
                class="w-2 h-2 rounded-full cursor-pointer transition-all duration-200"
                :title="section.title"
              ></div>
            </div>
          </div>

          <div class="min-h-[200px] sm:min-h-[250px]">
            <!-- User Summary Section -->
            <div v-if="userDetailsSections[userDetailsCurrentPage]?.id === 'summary'" class="bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">User Summary</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-xs mb-3">
                <div>
                  <p class="text-gray-600 mb-0.5">User ID</p>
                  <p class="font-medium text-gray-900 break-all min-w-0">#{{ selectedUser.id }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Status</p>
                  <span :class="[
                    'inline-flex px-2 py-0.5 text-xs font-medium rounded-full',
                    selectedUser.status === 'approved' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                    selectedUser.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    selectedUser.status === 'flagged' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  ]">
                    {{ selectedUser.status === 'flagged' ? 'Banned' : selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1) }}
                  </span>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Total Orders</p>
                  <p class="font-medium text-[#00C851]">{{ selectedUser.totalOrders || 0 }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Registered</p>
                  <p class="font-medium text-gray-900">{{ formatRegisteredDate(selectedUser.createdAt) }}</p>
                </div>
              </div>
              <div class="pt-3 border-t border-gray-200">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md" :class="selectedUser.profilePictureUrl ? '' : 'bg-gradient-to-br from-[#00C851] to-[#3ED400]'">
                    <img
                      v-if="selectedUser.profilePictureUrl"
                      :src="selectedUser.profilePictureUrl"
                      :alt="selectedUser.name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white text-xl sm:text-2xl font-medium">{{ selectedUser.initials }}</span>
                  </div>
                  <div class="text-center sm:text-left">
                    <h4 class="text-base sm:text-lg font-bold text-gray-900">{{ selectedUser.name }}</h4>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5">{{ selectedUser.email }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ selectedUser.contact }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Information Section -->
            <div v-if="userDetailsSections[userDetailsCurrentPage]?.id === 'personal'" class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Personal Information</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                <div>
                  <p class="text-gray-600 mb-0.5">Full Name</p>
                  <p class="font-medium text-gray-900">{{ selectedUser.name }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Email</p>
                  <p class="font-medium text-gray-900">{{ selectedUser.email }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Contact Number</p>
                  <p class="font-medium text-gray-900">{{ selectedUser.contact }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Barangay</p>
                  <p class="font-medium text-gray-900">{{ selectedUser.barangay }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Status</p>
                  <span :class="[
                    'inline-flex px-2 py-0.5 text-xs font-medium rounded-full',
                    selectedUser.status === 'approved' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                    selectedUser.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    selectedUser.status === 'flagged' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  ]">
                    {{ selectedUser.status === 'flagged' ? 'Banned' : selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1) }}
                  </span>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Registered Date</p>
                  <p class="font-medium text-gray-900">{{ formatRegisteredDate(selectedUser.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Verification Documents Section -->
            <div v-if="userDetailsSections[userDetailsCurrentPage]?.id === 'verification' && (selectedUser.faceRegistrationImage || selectedUser.validIdUrl)" class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-2 text-xs sm:text-sm">Verification Documents</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <!-- Facial Registration Image -->
                <div v-if="selectedUser.faceRegistrationImage" class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Facial Registration</p>
                  <div class="relative w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200">
                    <img
                      :src="selectedUser.faceRegistrationImage"
                      alt="Facial Registration"
                      class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImageModal(selectedUser.faceRegistrationImage, 'Facial Registration')"
                    />
                    <div class="absolute top-2 right-2 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-xs px-2 py-1 rounded-full shadow-md">
                      ✓ Verified
                    </div>
                  </div>
                  <p v-if="selectedUser.faceRegisteredAt" class="text-xs text-gray-500 mt-1">
                    Registered: {{ formatDate(selectedUser.faceRegisteredAt) }}
                  </p>
                </div>
                <div v-else class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Facial Registration</p>
                  <div class="flex items-center justify-center h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p class="text-xs sm:text-sm text-gray-500">No facial registration</p>
                  </div>
                </div>

                <!-- Valid ID -->
                <div v-if="selectedUser.validIdUrl" class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Valid ID</p>
                  <div class="relative w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200">
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
                      class="flex items-center justify-center w-full h-full text-[#00C851] hover:text-[#3ED400] transition-colors duration-200"
                    >
                      <div class="text-center">
                        <svg class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-xs sm:text-sm">View PDF</p>
                      </div>
                    </a>
                    <div class="absolute top-2 right-2 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-xs px-2 py-1 rounded-full shadow-md">
                      ✓ Verified
                    </div>
                  </div>
                  <p v-if="selectedUser.validIdUploadedAt" class="text-xs text-gray-500 mt-1">
                    Uploaded: {{ formatDate(selectedUser.validIdUploadedAt) }}
                  </p>
                </div>
                <div v-else class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Valid ID</p>
                  <div class="flex items-center justify-center h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p class="text-xs sm:text-sm text-gray-500">No valid ID uploaded</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order History Section -->
            <div v-if="userDetailsSections[userDetailsCurrentPage]?.id === 'orders'" class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Order History ({{ userOrders.length }})</h4>
              <div v-if="loadingUserOrders" class="p-4 sm:p-6 text-center text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00C851]"></div>
                  <span class="text-xs">Loading orders...</span>
                </div>
              </div>
              <div v-else-if="userOrders.length === 0" class="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">
                No orders found
              </div>
              <div v-else class="space-y-2 max-h-64 overflow-y-auto">
                <div v-for="order in userOrders" :key="order.id" class="p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:bg-[#00C851]/5 transition-colors duration-200">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2">
                        <span class="text-xs sm:text-sm font-medium text-gray-900">{{ order.serviceName }}</span>
                        <span :class="[
                          'inline-flex px-2 py-0.5 text-xs font-medium rounded-full',
                          order.status === 'completed' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                          order.status === 'in_transit' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        ]">
                          {{ order.status.replace(/_/g, ' ').toUpperCase() }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-600 mt-0.5">Order #{{ order.id.slice(0, 8) }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ order.createdAt }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm sm:text-base font-semibold text-gray-900">₱{{ order.totalAmount }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fraud Flags Section -->
            <div v-if="userDetailsSections[userDetailsCurrentPage]?.id === 'fraud' && selectedUser.fraudFlags && selectedUser.fraudFlags.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-2 sm:p-3 shadow-md">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Fraud Detection Flags</h4>
              <div class="flex items-start space-x-2">
                <div class="p-1.5 bg-red-100 rounded-lg flex-shrink-0">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <ul class="space-y-1">
                    <li v-for="flag in selectedUser.fraudFlags" :key="flag.type" class="text-xs sm:text-sm text-red-800">
                      • {{ flag.description }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          <!-- Pagination Controls -->
          <div v-if="userDetailsSections.length > 1" class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 flex-shrink-0">
            <button
              @click="previousUserDetailsPage"
              :disabled="userDetailsCurrentPage === 0"
              class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Previous</span>
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-gray-600">{{ userDetailsCurrentPage + 1 }}</span>
              <span class="text-xs text-gray-400">of</span>
              <span class="text-xs font-medium text-gray-600">{{ userDetailsSections.length }}</span>
            </div>
            
            <button
              @click="nextUserDetailsPage"
              :disabled="userDetailsCurrentPage === userDetailsSections.length - 1"
              class="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#00C851] to-[#3ED400] border border-transparent rounded-lg hover:from-[#00C851]/90 hover:to-[#3ED400]/90 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Next</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row justify-end gap-1.5 sm:gap-2 mt-3 flex-shrink-0">
            <button
              @click="closeUserDetailsModal"
              class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Close
            </button>
            <button
              v-if="selectedUser.status === 'approved'"
              @click="flagUserFromModal"
              :disabled="loading"
              class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Ban User
            </button>
            <button
              v-if="selectedUser.status === 'flagged'"
              @click="unflagUserFromModal"
              :disabled="loading"
              class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-[#74E600] rounded-lg hover:bg-[#3ED400] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Unban User
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4 backdrop-blur-sm" @click="closeImageModal">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl" @click.stop>
        <div class="sticky top-0 bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 class="text-xl sm:text-2xl font-bold text-white">{{ imageModalTitle }}</h3>
          <button @click="closeImageModal" class="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-lg hover:bg-white/20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <img :src="imageModalUrl" :alt="imageModalTitle" class="w-full h-auto rounded-xl shadow-md" />
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
    
    // User Details Modal Pagination
    const userDetailsCurrentPage = ref(0)
    
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
        // Reset pagination
        userDetailsCurrentPage.value = 0
        
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

    // User Details Modal Sections
    const userDetailsSections = computed(() => {
      if (!selectedUser.value) return []
      const sections = []
      
      // User Summary - always show
      sections.push({ id: 'summary', title: 'User Summary' })
      
      // Personal Information - always show
      sections.push({ id: 'personal', title: 'Personal Information' })
      
      // Verification Documents - conditional
      if (selectedUser.value.faceRegistrationImage || selectedUser.value.validIdUrl) {
        sections.push({ id: 'verification', title: 'Verification Documents' })
      }
      
      // Order History - always show
      sections.push({ id: 'orders', title: 'Order History' })
      
      // Fraud Flags - conditional
      if (selectedUser.value.fraudFlags && selectedUser.value.fraudFlags.length > 0) {
        sections.push({ id: 'fraud', title: 'Fraud Flags' })
      }
      
      return sections
    })
    
    const nextUserDetailsPage = () => {
      if (userDetailsCurrentPage.value < userDetailsSections.value.length - 1) {
        userDetailsCurrentPage.value++
      }
    }
    
    const previousUserDetailsPage = () => {
      if (userDetailsCurrentPage.value > 0) {
        userDetailsCurrentPage.value--
      }
    }
    
    const goToUserDetailsPage = (index) => {
      if (index >= 0 && index < userDetailsSections.value.length) {
        userDetailsCurrentPage.value = index
      }
    }

    const closeUserDetailsModal = () => {
      showUserDetailsModal.value = false
      selectedUser.value = null
      userOrders.value = []
      userDetailsCurrentPage.value = 0
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
      exportUsers,
      userDetailsCurrentPage,
      userDetailsSections,
      nextUserDetailsPage,
      previousUserDetailsPage,
      goToUserDetailsPage
    }
  }
}
</script>
