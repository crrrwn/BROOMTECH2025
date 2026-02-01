<template>
  <div class="p-4 sm:p-6">
    <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p class="text-white/90 text-sm sm:text-base">Monitor and manage your delivery platform</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C851]"></div>
    </div>

    <div v-else class="space-y-6 sm:space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Orders</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
              <p class="text-xs sm:text-sm text-[#74E600] font-medium mt-1">+{{ stats.ordersGrowth }}% from yesterday</p>
            </div>
            <div class="p-2 sm:p-3 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 20V7.1L2.05 2.85L3.85 2L6.2 7.05h11.6L20.15 2l1.8.85L20 7.1V20zm6-7h4q.425 0 .713-.288T15 12t-.288-.712T14 11h-4q-.425 0-.712.288T9 12t.288.713T10 13"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Revenue Today (Admin Share)</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#00C851]">₱{{ stats.adminRevenueToday.toLocaleString() }}</p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">From approved remittances only</p>
            </div>
            <div class="p-2 sm:p-3 bg-gradient-to-br from-[#74E600]/20 to-[#3ED400]/20 rounded-lg flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#74E600]" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <path d="M8 19V5h3.5a4.5 4.5 0 1 1 0 9H8m10-6H6m12 3H6"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Riders</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3ED400]">{{ stats.activeDrivers }}</p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ stats.totalDrivers }} total drivers</p>
            </div>
            <div class="p-2 sm:p-3 bg-gradient-to-br from-[#3ED400]/20 to-[#00C851]/20 rounded-lg flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3ED400]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 3H2c-1.09.04-1.96.91-2 2v14c.04 1.09.91 1.96 2 2h20c1.09-.04 1.96-.91 2-2V5a2.074 2.074 0 0 0-2-2m0 16H2V5h20zm-8-2v-1.25c0-1.66-3.34-2.5-5-2.5s-5 .84-5 2.5V17zM9 7a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 9 12a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 9 7m5 0v1h6V7zm0 2v1h6V9zm0 2v1h4v-1z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
              <p class="text-xs sm:text-sm text-[#A8EB12] font-medium mt-1">{{ stats.pendingUsers }} pending approval</p>
            </div>
            <div class="p-2 sm:p-3 bg-gradient-to-br from-[#00C851]/20 to-[#3ED400]/20 rounded-lg flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]" fill="currentColor" viewBox="0 0 640 640">
                <path d="M320 80c57.4 0 104 46.6 104 104s-46.6 104-104 104s-104-46.6-104-104S262.6 80 320 80M96 152c39.8 0 72 32.2 72 72s-32.2 72-72 72s-72-32.2-72-72s32.2-72 72-72M0 480c0-70.7 57.3-128 128-128c12.8 0 25.2 1.9 36.9 5.4C132 394.2 112 442.8 112 496v16c0 11.4 2.4 22.2 6.7 32H32c-17.7 0-32-14.3-32-32zm521.3 64c4.3-9.8 6.7-20.6 6.7-32v-16c0-53.2-20-101.8-52.9-138.6c11.7-3.5 24.1-5.4 36.9-5.4c70.7 0 128 57.3 128 128v32c0 17.7-14.3 32-32 32zM472 224c0-39.8 32.2-72 72-72s72 32.2 72 72s-32.2 72-72 72s-72-32.2-72-72M160 496c0-88.4 71.6-160 160-160s160 71.6 160 160v16c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <div class="p-1.5 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
              <svg class="w-4 h-4 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            Pending Approvals
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#A8EB12]/10 to-[#74E600]/10 rounded-lg border border-[#A8EB12]/20 hover:from-[#A8EB12]/20 hover:to-[#74E600]/20 transition-all duration-200">
              <div>
                <p class="font-semibold text-gray-900 text-sm sm:text-base">New Users</p>
                <p class="text-xs sm:text-sm text-gray-600 mt-0.5">{{ stats.pendingUsers }} waiting for approval</p>
              </div>
              <router-link to="/admin/users" class="text-[#00C851] hover:text-[#3ED400] transition-colors duration-200">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
            
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#74E600]/10 to-[#3ED400]/10 rounded-lg border border-[#74E600]/20 hover:from-[#74E600]/20 hover:to-[#3ED400]/20 transition-all duration-200">
              <div>
                <p class="font-semibold text-gray-900 text-sm sm:text-base">Driver Applications</p>
                <p class="text-xs sm:text-sm text-gray-600 mt-0.5">{{ stats.pendingDrivers }} applications to review</p>
              </div>
              <router-link to="/admin/applications" class="text-[#00C851] hover:text-[#3ED400] transition-colors duration-200">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <div class="p-1.5 bg-gradient-to-br from-[#3ED400]/20 to-[#00C851]/20 rounded-lg">
              <svg class="w-4 h-4 text-[#3ED400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            System Status
          </h3>
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="p-1.5 bg-white rounded-lg">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                  </svg>
                </div>
                <span class="text-sm sm:text-base font-medium text-gray-700">Bad Weather Fee</span>
              </div>
              <div class="flex items-center space-x-2 sm:space-x-3">
                <span :class="systemStatus.badWeatherFee ? 'text-[#00C851]' : 'text-gray-500'" class="text-xs sm:text-sm font-medium">
                  {{ systemStatus.badWeatherFee ? 'Active (+₱10)' : 'Inactive' }}
                </span>
                <button 
                  @click="toggleWeatherFee"
                  :class="[
                    'relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C851] focus:ring-offset-2',
                    systemStatus.badWeatherFee ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400]' : 'bg-gray-300'
                  ]"
                >
                  <span 
                    :class="[
                      'inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm',
                      systemStatus.badWeatherFee ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 rounded-lg border border-[#00C851]/20">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="p-1.5 bg-white rounded-lg">
                  <svg class="w-4 h-4 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <span class="text-sm sm:text-base font-medium text-gray-700">AI Fraud Detection</span>
              </div>
              <span class="text-[#00C851] text-xs sm:text-sm font-semibold bg-white px-2 sm:px-3 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 overflow-hidden mt-6 sm:mt-8">
        <div class="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <div class="p-2 bg-gradient-to-br from-[#74E600]/20 to-[#3ED400]/20 rounded-lg">
              <svg class="w-5 h-5 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            Recent Activity
          </h3>
        </div>
        <div class="space-y-2 sm:space-y-3">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#74E600]/30 hover:shadow-md hover:bg-gradient-to-r hover:from-[#74E600]/5 hover:to-[#3ED400]/5 transition-all duration-300 group">
            <div :class="[
              'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300',
              activity.type === 'order' ? 'bg-gradient-to-br from-[#A8EB12] to-[#74E600]' :
              activity.type === 'user' ? 'bg-gradient-to-br from-[#74E600] to-[#3ED400]' :
              activity.type === 'driver' ? 'bg-gradient-to-br from-[#3ED400] to-[#00C851]' :
              'bg-gray-200'
            ]">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm sm:text-base text-gray-900 font-semibold group-hover:text-[#00C851] transition-colors duration-300">{{ activity.message }}</p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ activity.time }}
              </p>
            </div>
          </div>
          <div v-if="recentActivity.length === 0" class="text-center py-12">
            <div class="flex flex-col items-center gap-3">
              <div class="p-4 bg-gray-100 rounded-full">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-sm text-gray-500 font-medium">No recent activity</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mt-6 sm:mt-8">
        <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-[#00C851]/5 via-[#3ED400]/5 to-[#74E600]/5">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <div class="p-2 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg shadow-sm">
                <svg class="w-5 h-5 text-white" viewBox="0 0 48 48" fill="currentColor">
                  <defs><mask id="SVGBCyq8bMu"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M33.05 7H38a2 2 0 0 1 2 2v33a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h7v3h14V7z"/><path stroke="#fff" stroke-linecap="round" d="M17 4h14v6H17z"/><path stroke="#000" stroke-linecap="round" d="m27 19l-8 8.001h10.004l-8.004 8"/></g></mask></defs>
                  <path d="M0 0h48v48H0z" mask="url(#SVGBCyq8bMu)"/>
                </svg>
              </div>
              Live Orders
            </h3>
            <router-link to="/admin/orders" class="text-[#00C851] hover:text-[#3ED400] text-sm sm:text-base font-semibold transition-all duration-200 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#00C851]/10">
              View All Orders
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-[#00C851]/8 to-[#3ED400]/8">
              <tr>
                <th class="px-3 sm:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                <th class="px-3 sm:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                <th class="px-3 sm:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Service</th>
                <th class="px-3 sm:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Driver</th>
                <th class="px-3 sm:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th class="px-3 sm:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                <th class="px-3 sm:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="liveOrders.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="p-4 bg-gray-100 rounded-full">
                      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <p class="text-sm text-gray-500 font-medium">No active orders</p>
                  </div>
                </td>
              </tr>
              <tr v-for="order in liveOrders" :key="order.id" class="hover:bg-gradient-to-r hover:from-[#00C851]/8 hover:to-[#3ED400]/8 transition-all duration-300 border-b border-gray-100 last:border-0">
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">#{{ order.id.substring(0, 8) }}</span>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ order.customerName }}
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                  <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                    <svg v-if="getServiceIcon(order.serviceId) === 'medicine'" class="w-3.5 h-3.5 text-[#00C851]" viewBox="0 0 48 48" fill="currentColor">
                      <defs><mask :id="'medMask-' + order.id"><g fill="none"><rect width="38" height="26" x="5" y="16" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="3"/><path fill="#fff" d="M19 8h10V4H19zm11 1v7h4V9zm-12 7V9h-4v7zm11-8a1 1 0 0 1 1 1h4a5 5 0 0 0-5-5zM19 4a5 5 0 0 0-5 5h4a1 1 0 0 1 1-1z"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M18 29h12m-6-6v12"/></g></mask></defs>
                      <path d="M0 0h48v48H0z" :mask="'url(#medMask-' + order.id + ')'"/>
                    </svg>
                    <svg v-else-if="getServiceIcon(order.serviceId) === 'food'" class="w-3.5 h-3.5 text-[#00C851]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26c1.44 1.42 2.43 2.89 2.43 5.29zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-8-15.03-8-15.03 0zM1.02 17h15v2h-15z"/>
                    </svg>
                    <svg v-else-if="getServiceIcon(order.serviceId) === 'bill'" class="w-3.5 h-3.5 text-[#00C851]" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5zm8 16h12m-12 8h12M18 14h12"/>
                    </svg>
                    <svg v-else-if="getServiceIcon(order.serviceId) === 'grocery'" class="w-3.5 h-3.5 text-[#00C851]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M2 4h1l3.6 7.59l-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 20.01 4H5.21l-.67-1.43a.99.99 0 0 0-.9-.57H2c-.55 0-1 .45-1 1s.45 1 1 1m15 14c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2"/>
                    </svg>
                    <svg v-else-if="getServiceIcon(order.serviceId) === 'gift'" class="w-3.5 h-3.5 text-[#00C851]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.06 1.93C7.17 1.92 5.33 3.74 6.17 6H3a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h9V8h2v3h9a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-3.17C19 2.73 14.6.42 12.57 3.24L12 4l-.57-.78c-.63-.89-1.5-1.28-2.37-1.29M9 4c.89 0 1.34 1.08.71 1.71S8 5.89 8 5a1 1 0 0 1 1-1m6 0c.89 0 1.34 1.08.71 1.71S14 5.89 14 5a1 1 0 0 1 1-1M2 12v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8h-9v8h-2v-8z"/>
                    </svg>
                    <svg v-else class="w-3.5 h-3.5 text-[#00C851]" viewBox="0 0 256 256" fill="currentColor">
                      <path d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.35 44l-29.78 16.29l-80.35-44Zm0 88L47.65 76l33.91-18.57l80.35 44Zm88 55.85l-80 43.79v-85.81l32-17.51V152a8 8 0 0 0 16 0v-44.44l32-17.51v85.76Z"/>
                    </svg>
                    {{ order.service }}
                  </span>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-medium',
                    order.driverName ? 'text-gray-900 bg-gray-50' : 'text-orange-700 bg-orange-50'
                  ]">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    {{ order.driverName || 'Unassigned' }}
                  </span>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-sm',
                    order.status === 'delivered' ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white' :
                    order.status === 'in-transit' ? 'bg-gradient-to-r from-[#3ED400] to-[#74E600] text-white' :
                    order.status === 'confirmed' ? 'bg-gradient-to-r from-[#74E600] to-[#A8EB12] text-white' :
                    order.status === 'pending' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  ]">
                    {{ formatStatus(order.status) }}
                  </span>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-bold text-[#00C851]">₱{{ order.totalAmount.toLocaleString() }}</span>
                </td>
                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/admin/orders?orderId=${order.id}`" class="inline-flex items-center gap-1.5 text-[#00C851] hover:text-[#3ED400] transition-all duration-200 font-semibold hover:underline">
                    View
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore'

export default {
  name: 'Dashboard',
  setup() {
    const toast = useToast()
    
    const loading = ref(true)
    
    const stats = ref({
      totalOrders: 0,
      revenueToday: 0,
      adminRevenueToday: 0,
      ordersGrowth: 12,
      revenueGrowth: 8,
      activeDrivers: 0,
      totalDrivers: 0,
      totalUsers: 0,
      pendingUsers: 0,
      pendingDrivers: 0
    })

    const systemStatus = ref({
      badWeatherFee: false
    })

    const recentActivity = ref([])
    const liveOrders = ref([])
    const listeners = ref([])
    const allOrders = ref([])
    const remittancesAdminShare = ref(0) // Admin share from approved remittances

    const setupSystemSettingsListener = () => {
      try {
        const settingsRef = doc(db, 'settings', 'system')
        
        const unsubscribe = onSnapshot(settingsRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const settings = docSnapshot.data()
            systemStatus.value.badWeatherFee = settings.badWeatherFee || false
          } else {
            await setDoc(settingsRef, {
              badWeatherFee: false,
              createdAt: new Date()
            })
            systemStatus.value.badWeatherFee = false
          }
        }, (error) => {
          console.error('[v0] System settings listener error:', error)
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up system settings listener:', error)
      }
    }

    const setupPendingUsersListener = () => {
      try {
        const pendingUsersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'user'),
          where('status', '==', 'pending')
        )

        const unsubscribe = onSnapshot(pendingUsersQuery, (snapshot) => {
          stats.value.pendingUsers = snapshot.size
        }, (error) => {
          console.log('[v0] Pending users listener error:', error.message)
          stats.value.pendingUsers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up pending users listener:', error)
      }
    }

    const setupPendingDriversListener = () => {
      try {
        const pendingDriversQuery = query(
          collection(db, 'users'),
          where('role', '==', 'driver'),
          where('status', '==', 'pending')
        )

        const unsubscribe = onSnapshot(pendingDriversQuery, (snapshot) => {
          stats.value.pendingDrivers = snapshot.size
        }, (error) => {
          console.log('[v0] Pending drivers listener error:', error.message)
          stats.value.pendingDrivers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up pending drivers listener:', error)
      }
    }

    const setupUsersListener = () => {
      try {
        const usersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'user')
        )

        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
          stats.value.totalUsers = snapshot.size
        }, (error) => {
          console.log('[v0] Users listener error:', error.message)
          stats.value.totalUsers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up users listener:', error)
      }
    }

    const setupDriversListener = () => {
      try {
        const driversQuery = query(
          collection(db, 'users'),
          where('role', '==', 'driver')
        )

        const unsubscribe = onSnapshot(driversQuery, (snapshot) => {
          stats.value.totalDrivers = snapshot.size
          
          let activeDriversCount = 0
          snapshot.forEach(doc => {
            const driver = doc.data()
            if (driver.status === 'approved' && driver.isOnline) {
              activeDriversCount++
            }
          })
          stats.value.activeDrivers = activeDriversCount
        }, (error) => {
          console.log('[v0] Drivers listener error:', error.message)
          stats.value.totalDrivers = 0
          stats.value.activeDrivers = 0
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up drivers listener:', error)
      }
    }

    const setupOrdersListener = () => {
      try {
        const ordersQuery = query(collection(db, 'orders'))

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
          stats.value.totalOrders = snapshot.size

          const orders = []
          snapshot.forEach(doc => {
            orders.push({
              id: doc.id,
              ...doc.data()
            })
          })
          allOrders.value = orders

          // Calculate today's revenue (20% commission)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          let todayRevenue = 0

          snapshot.forEach(doc => {
            const order = doc.data()
            const orderDate = order.createdAt?.toDate()

            // Today's revenue
            if (orderDate >= today && order.status === 'delivered') {
              todayRevenue += order.totalAmount || 0
            }
          })

          stats.value.revenueToday = todayRevenue
          // Admin revenue is ONLY from approved remittances (exact admin share amount)
          stats.value.adminRevenueToday = remittancesAdminShare.value


        }, (error) => {
          console.log('[v0] Orders listener error:', error.message)
          stats.value.totalOrders = 0
          stats.value.revenueToday = 0
          stats.value.adminRevenueToday = remittancesAdminShare.value // Keep remittances share even if orders fail
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up orders listener:', error)
      }
    }

    const setupRemittancesListener = () => {
      try {
        const remittancesQuery = query(
          collection(db, 'remittances'),
          where('status', '==', 'approved')
        )

        const unsubscribe = onSnapshot(remittancesQuery, (snapshot) => {
          const today = new Date()
          const todayString = today.toDateString() // Get today's date string for comparison
          
          let totalAdminShareToday = 0

          snapshot.forEach(doc => {
            const remittance = doc.data()
            
            // Check if remittance was approved today - ONLY count if approvedAt exists and is today
            let approvalDate = null
            
            // Priority: Use approvedAt field (set when admin approves)
            if (remittance.approvedAt) {
              approvalDate = remittance.approvedAt.toDate ? remittance.approvedAt.toDate() : new Date(remittance.approvedAt)
            } else {
              // Skip if no approvedAt - this means it wasn't approved by admin yet
              return
            }
            
            // Only count remittances approved TODAY (same day)
            const approvalDateString = approvalDate.toDateString()
            if (approvalDateString === todayString) {
              // Use exact adminShare amount from remittance (must exist when approved)
              const adminShare = Number(remittance.adminShare) || 0
              totalAdminShareToday += adminShare
              
              console.log('[v0] Found approved remittance today:', {
                remittanceId: doc.id,
                amount: remittance.amount,
                adminShare: adminShare,
                approvedAt: approvalDateString,
                today: todayString
              })
            }
          })

          remittancesAdminShare.value = Math.round(totalAdminShareToday)
          
          // Admin revenue is ONLY the exact admin share from approved remittances today
          stats.value.adminRevenueToday = remittancesAdminShare.value
          
          console.log('[v0] Remittances admin share updated (only approved today):', remittancesAdminShare.value)
        }, (error) => {
          console.log('[v0] Remittances listener error:', error.message)
          remittancesAdminShare.value = 0
          // Recalculate admin revenue without remittances
          const todayRevenue = stats.value.revenueToday
          stats.value.adminRevenueToday = Math.round(todayRevenue * 0.20)
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up remittances listener:', error)
      }
    }

    const setupRecentActivityListener = () => {
      try {
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          limit(100)
        )

        const unsubscribe = onSnapshot(recentOrdersQuery, async (snapshot) => {
          const activities = []
          const userIds = new Set()
          
          // Collect all user IDs
          snapshot.forEach(doc => {
            const order = doc.data()
            if (order.userId) {
              userIds.add(order.userId)
            }
          })
          
          // Fetch user data
          const usersMap = {}
          await Promise.all(Array.from(userIds).map(async (userId) => {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                usersMap[userId] = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown User'
              }
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error)
            }
          }))
          
          snapshot.forEach(doc => {
            const order = doc.data()
            const serviceNameMap = {
              'food-delivery': 'Food Delivery',
              'bill-payments': 'Bill Payments',
              'pickup-drop': 'Pick-up & Drop',
              'gift-delivery': 'Gift Delivery',
              'medicine-delivery': 'Medicine Delivery',
              'grocery-shopping': 'Grocery Shopping',
              'food': 'Food Delivery',
              'package': 'Package Delivery',
              'medicine': 'Medicine Delivery',
              'grocery': 'Grocery Shopping'
            }
            const serviceName = serviceNameMap[order.service || order.serviceType] || order.service || order.serviceType || 'service'
            const userName = order.customerName || usersMap[order.userId] || 'Unknown User'
            activities.push({
              id: doc.id,
              type: 'order',
              message: `New ${serviceName} order from ${userName}`,
              time: formatTimeAgo(order.createdAt?.toDate())
            })
          })
          // Sort manually by createdAt descending
          activities.sort((a, b) => {
            const aTime = snapshot.docs.find(d => d.id === a.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            const bTime = snapshot.docs.find(d => d.id === b.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            return bTime - aTime
          })
          recentActivity.value = activities.slice(0, 4)
        }, (error) => {
          // Suppress index errors
          if (!error.message.includes('index') && !error.message.includes('requires an index')) {
            console.log('[v0] Recent activity listener error:', error.message)
          }
          recentActivity.value = []
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up recent activity listener:', error)
      }
    }

    const setupLiveOrdersListener = () => {
      try {
        const liveOrdersQuery = query(
          collection(db, 'orders'),
          where('status', 'in', ['pending', 'confirmed', 'in-transit', 'driver_assigned']),
          limit(100)
        )

        const unsubscribe = onSnapshot(liveOrdersQuery, async (snapshot) => {
          const orders = []
          const userIds = new Set()
          
          // Collect all user IDs
          snapshot.forEach(doc => {
            const order = doc.data()
            if (order.userId) {
              userIds.add(order.userId)
            }
          })
          
          // Fetch user data
          const usersMap = {}
          await Promise.all(Array.from(userIds).map(async (userId) => {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                usersMap[userId] = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'Unknown User'
              }
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error)
            }
          }))
          
          const serviceNameMap = {
            'food-delivery': 'Food Delivery',
            'bill-payments': 'Bill Payments',
            'pickup-drop': 'Pick-up & Drop',
            'gift-delivery': 'Gift Delivery',
            'medicine-delivery': 'Medicine Delivery',
            'grocery-shopping': 'Grocery Shopping',
            'food': 'Food Delivery',
            'package': 'Package Delivery',
            'medicine': 'Medicine Delivery',
            'grocery': 'Grocery Shopping'
          }

          snapshot.forEach(doc => {
            const order = doc.data()
            const serviceId = order.service || order.serviceType || order.serviceId || 'unknown'
            const serviceName = serviceNameMap[serviceId] || serviceId || 'Unknown Service'
            const customerName = order.customerName || usersMap[order.userId] || 'Unknown User'

            orders.push({
              id: doc.id,
              customerName: customerName,
              service: serviceName,
              serviceId: serviceId,
              driverName: order.driverName || null,
              driverId: order.driverId || null,
              status: order.status,
              totalAmount: order.totalAmount || order.pricing?.total || order.priceEstimate?.total || 0
            })
          })
          // Sort manually by createdAt descending
          orders.sort((a, b) => {
            const aTime = snapshot.docs.find(d => d.id === a.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            const bTime = snapshot.docs.find(d => d.id === b.id)?.data()?.createdAt?.toDate()?.getTime() || 0
            return bTime - aTime
          })
          liveOrders.value = orders.slice(0, 10)
        }, (error) => {
          // Suppress index errors
          if (!error.message.includes('index') && !error.message.includes('requires an index')) {
            console.log('[v0] Live orders listener error:', error.message)
          }
          liveOrders.value = []
        })

        listeners.value.push(unsubscribe)
      } catch (error) {
        console.error('[v0] Error setting up live orders listener:', error)
        liveOrders.value = []
      }
    }

    const formatStatus = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
      }
      return statusMap[status] || status
    }

    const getServiceIcon = (serviceId) => {
      const iconMap = {
        'medicine-delivery': 'medicine',
        'food-delivery': 'food',
        'bill-payments': 'bill',
        'grocery-shopping': 'grocery',
        'gift-delivery': 'gift',
        'pickup-drop': 'package',
        'medicine': 'medicine',
        'food': 'food',
        'package': 'package',
        'grocery': 'grocery'
      }
      return iconMap[serviceId] || 'package'
    }

    const formatTimeAgo = (date) => {
      if (!date) return 'Unknown'
      
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins} minutes ago`
      
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours} hours ago`
      
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} days ago`
    }

    const toggleWeatherFee = async () => {
      try {
        systemStatus.value.badWeatherFee = !systemStatus.value.badWeatherFee
        
        const settingsRef = doc(db, 'settings', 'system')
        await updateDoc(settingsRef, {
          badWeatherFee: systemStatus.value.badWeatherFee,
          updatedAt: new Date()
        })
        
        toast.success(
          systemStatus.value.badWeatherFee 
            ? 'Bad Weather Fee enabled (+₱10)' 
            : 'Bad Weather Fee disabled'
        )
      } catch (error) {
        console.error('[v0] Error updating weather fee setting:', error)
        toast.error('Failed to update weather fee setting')
        systemStatus.value.badWeatherFee = !systemStatus.value.badWeatherFee
      }
    }


    const initializeDashboard = async () => {
      loading.value = true
      try {
        setupSystemSettingsListener()
        setupPendingUsersListener()
        setupPendingDriversListener()
        setupUsersListener()
        setupDriversListener()
        setupOrdersListener()
        setupRemittancesListener()
        setupRecentActivityListener()
        setupLiveOrdersListener()
        
        toast.success('Dashboard loaded with real-time updates')
      } catch (error) {
        console.error('[v0] Error initializing dashboard:', error)
        toast.error('Dashboard loaded with some limitations')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      initializeDashboard()
    })

    onUnmounted(() => {
      listeners.value.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
      listeners.value = []
    })

    return {
      loading,
      stats,
      systemStatus,
      recentActivity,
      liveOrders,
      toggleWeatherFee,
      formatStatus,
      getServiceIcon
    }
  }
}
</script>
