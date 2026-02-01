<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Manage Orders</h1>
          <p class="text-white/90 text-sm sm:text-base">Track and manage all delivery orders</p>
        </div>
        <div class="flex gap-2 sm:gap-3 flex-wrap">
          <button
            @click="exportOrders"
            :disabled="exportingOrders"
            class="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base border border-white/30"
          >
            <svg v-if="exportingOrders" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ exportingOrders ? 'Exporting...' : 'Export Orders' }}
          </button>
        <button
            @click="performAutoAssignment"
            :disabled="autoAssigning || unassignedOrders.length === 0"
            class="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base border border-white/30"
          >
            <svg v-if="autoAssigning" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ autoAssigning ? 'Auto-Assigning...' : `Auto-Assign (${unassignedOrders.length})` }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>

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

    <div v-if="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Total Orders</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]">
              <path fill="currentColor" d="M4 20V7.1L2.05 2.85L3.85 2L6.2 7.05h11.6L20.15 2l1.8.85L20 7.1V20zm6-7h4q.425 0 .713-.288T15 12t-.288-.712T14 11h-4q-.425 0-.712.288T9 12t.288.713T10 13"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Pending Orders</p>
            <p class="text-xl sm:text-2xl font-bold text-[#74E600]">{{ pendingOrders }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#74E600]/20 to-[#3ED400]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6 text-[#74E600]">
              <path fill="currentColor" d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.7 6.7 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2m-6 2c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">In Transit</p>
            <p class="text-xl sm:text-2xl font-bold text-[#3ED400]">{{ inTransitOrders }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#3ED400]/20 to-[#00C851]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" class="w-5 h-5 sm:w-6 sm:h-6 text-[#3ED400]">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M27.594 5.595a9.033 9.033 0 0 0-9.033 9.033c0 7.07 6.897 15.576 8.704 17.665a.56.56 0 0 0 .785.055l.055-.055c1.783-2.097 8.523-10.596 8.523-17.665a9.033 9.033 0 0 0-9.034-9.033m0 12.855a4.434 4.434 0 1 1 4.435-4.435v.011a4.434 4.434 0 0 1-4.435 4.424" stroke-width="1.9"/>
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m36.454 16.678l1.175-.08L42.5 40.607l-10.124 1.798l-15.915-1.682L5.5 42.405l2.958-24.647l8.989-1.16l1.289.064m-1.289-.064l-.642 24.162m15.571 1.645l-1.71-13.423" stroke-width="1.9"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
            <p class="text-xl sm:text-2xl font-bold text-[#00C851]">{{ completedOrders }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#00C851]/20 to-[#3ED400]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 2048 2048" class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]">
              <path fill="currentColor" d="M1024 0q141 0 272 36t244 104t207 160t161 207t103 245t37 272q0 141-36 272t-104 244t-160 207t-207 161t-245 103t-272 37q-141 0-272-36t-244-104t-207-160t-161-207t-103-245t-37-272q0-141 36-272t104-244t160-207t207-161T752 37t272-37m603 685l-136-136l-659 659l-275-275l-136 136l411 411z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !error" class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
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
          <select v-model="serviceFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
            <option value="">All Services</option>
            <option value="grocery">Grocery Delivery</option>
            <option value="food">Food Delivery</option>
            <option value="package">Package Delivery</option>
            <option value="medicine">Medicine Delivery</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <input v-model="dateFilter" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input v-model="searchFilter" type="text" placeholder="Order ID, Customer name..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
        </div>
      </div>
    </div>

    <div v-if="!loading && !error" class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-full">
          <thead class="bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10">
            <tr>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Service</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Driver</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-[#00C851]/5 transition-colors duration-200">
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.id.substring(0, 8) }}</div>
                <div class="text-sm text-gray-500">₱{{ calculateTotalWithItems(order) }}</div>
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customerName || 'Unknown Customer' }}</div>
                <div class="text-sm text-gray-500">{{ order.customerPhone || 'No phone' }}</div>
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="p-1 rounded mr-2 flex items-center justify-center w-6 h-6" :class="getServiceColorClass(order.serviceType || order.serviceId)">
                    <svg v-if="(order.serviceType || order.serviceId) === 'medicine-delivery'" class="w-4 h-4 text-white" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><mask :id="'medMask-' + order.id"><g fill="none"><rect width="38" height="26" x="5" y="16" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="3"/><path fill="#fff" d="M19 8h10V4H19zm11 1v7h4V9zm-12 7V9h-4v7zm11-8a1 1 0 0 1 1 1h4a5 5 0 0 0-5-5zM19 4a5 5 0 0 0-5 5h4a1 1 0 0 1 1-1z"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M18 29h12m-6-6v12"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" :mask="'url(#medMask-' + order.id + ')'"/></svg>
                    <svg v-else-if="(order.serviceType || order.serviceId) === 'food-delivery' || (order.serviceType || order.serviceId) === 'food'" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26c1.44 1.42 2.43 2.89 2.43 5.29zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-8-15.03-8-15.03 0zM1.02 17h15v2h-15z"/></svg>
                    <svg v-else-if="(order.serviceType || order.serviceId) === 'bill-payments'" class="w-4 h-4 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5zm8 16h12m-12 8h12M18 14h12"/></svg>
                    <svg v-else-if="(order.serviceType || order.serviceId) === 'grocery-shopping' || (order.serviceType || order.serviceId) === 'grocery'" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M2 4h1l3.6 7.59l-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 20.01 4H5.21l-.67-1.43a.99.99 0 0 0-.9-.57H2c-.55 0-1 .45-1 1s.45 1 1 1m15 14c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2"/></svg>
                    <svg v-else-if="(order.serviceType || order.serviceId) === 'gift-delivery'" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M9.06 1.93C7.17 1.92 5.33 3.74 6.17 6H3a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h9V8h2v3h9a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-3.17C19 2.73 14.6.42 12.57 3.24L12 4l-.57-.78c-.63-.89-1.5-1.28-2.37-1.29M9 4c.89 0 1.34 1.08.71 1.71S8 5.89 8 5a1 1 0 0 1 1-1m6 0c.89 0 1.34 1.08.71 1.71S14 5.89 14 5a1 1 0 0 1 1-1M2 12v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8h-9v8h-2v-8z"/></svg>
                    <svg v-else class="w-4 h-4 text-white" viewBox="0 0 256 256" fill="currentColor"><path d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.35 44l-29.78 16.29l-80.35-44Zm0 88L47.65 76l33.91-18.57l80.35 44Zm88 55.85l-80 43.79v-85.81l32-17.51V152a8 8 0 0 0 16 0v-44.44l32-17.51v85.76Z"/></svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.serviceName || formatServiceType(order.serviceType || order.serviceId) }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <div v-if="order.driverName || order.driverId" class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.driverName || getDriverNameById(order.driverId) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ order.driverPhone || getDriverPhoneById(order.driverId) }}
                    </div>
                  </div>
                  <div class="ml-2 flex items-center gap-2">
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="getDriverOnlineStatus(order.driverId) ? 'bg-green-500' : 'bg-gray-400'"
                      :title="getDriverOnlineStatus(order.driverId) ? 'Driver is online' : 'Driver is offline'"
                    ></div>
                    <button
                      @click="trackDriver(order)"
                      class="px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-[#00C851] to-[#3ED400] rounded-lg hover:from-[#00C851]/90 hover:to-[#3ED400]/90 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                      title="Track Driver"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="hidden sm:inline">Track</span>
                    </button>
                  </div>
                </div>
                <div v-else-if="order.status !== 'cancelled'" class="flex items-center justify-between">
                  <span class="text-xs sm:text-sm text-gray-500">Not assigned</span>
                  <button
                    @click="openAssignDriverModal(order)"
                    class="px-2.5 py-1 text-xs font-medium text-white bg-gradient-to-r from-[#74E600] to-[#3ED400] rounded-lg hover:from-[#74E600]/90 hover:to-[#3ED400]/90 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Assign
                  </button>
                </div>
                <div v-else class="flex items-center justify-between">
                  <span class="text-sm text-red-500">Order Cancelled</span>
                </div>
              </td>

              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ formatStatus(order.status) }}
                </span>
              </td>

              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <button @click="viewOrder(order)" class="px-2 sm:px-2.5 py-1 text-xs font-medium text-white bg-gradient-to-r from-[#00C851] to-[#3ED400] rounded hover:from-[#00C851]/90 hover:to-[#3ED400]/90 transition-all duration-200 shadow-sm">
                    View
                  </button>
                  <button v-if="!order.driverId && !order.driverName && order.status !== 'delivered' && order.status !== 'cancelled'" @click="openAssignDriverModal(order)" class="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#74E600] to-[#3ED400] rounded-lg hover:from-[#74E600]/90 hover:to-[#3ED400]/90 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Assign
                  </button>
                  <button v-if="order.status !== 'cancelled' && order.status !== 'delivered'" @click="cancelOrder(order)" class="px-2 sm:px-2.5 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-all duration-200 shadow-sm">
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500">No orders match your current filters.</p>
      </div>
    </div>

    <div v-if="!loading && !error && filteredOrders.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-xs sm:text-sm text-gray-700">
        Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length) }} to {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }} results
      </div>
      <div class="flex flex-wrap gap-2">
        <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">Previous</button>
        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white shadow-md' : 'bg-white border border-gray-300 hover:bg-gray-50'" class="px-3 py-2 text-sm rounded-lg transition-all duration-200">{{ page }}</button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">Next</button>
      </div>
    </div>

    <div v-if="showBulkAssignModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" @click="closeBulkAssignModal">
      <div class="relative mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-2 border-[#00C851]/30 max-h-[98vh] flex flex-col overflow-hidden" @click.stop>
        <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] p-4 sm:p-6 rounded-t-2xl shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-white/25 backdrop-blur-sm rounded-lg shadow-sm">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white drop-shadow-sm">Bulk Assign Drivers</h3>
            </div>
            <button @click="closeBulkAssignModal" class="text-white/90 hover:text-white hover:bg-white/25 rounded-lg p-1.5 transition-all duration-200 shadow-sm hover:shadow-md">
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-b from-gray-50/50 to-white">
          <div class="mb-4 sm:mb-6 p-3 bg-gradient-to-r from-[#A8EB12]/10 to-[#74E600]/10 rounded-xl border-2 border-[#00C851]/20">
            <p class="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Automatically assign available drivers to unassigned orders
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h4 class="text-sm sm:text-base font-bold text-gray-900">Unassigned Orders ({{ unassignedOrders.length }})</h4>
              </div>
              <div class="max-h-64 overflow-y-auto border-2 border-[#00C851]/20 rounded-xl bg-white shadow-inner">
                <div v-for="order in unassignedOrders" :key="order.id" class="p-3 border-b border-gray-200 hover:bg-gradient-to-r hover:from-[#A8EB12]/10 hover:to-[#74E600]/10 transition-all duration-200">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-bold text-[#00C851]">#{{ order.id?.substring(0, 8) }}</p>
                      <p class="text-xs text-gray-600 mt-1">{{ order.customerName }} • {{ formatServiceType(order.serviceType) }}</p>
                    </div>
                    <span class="text-xs font-bold text-[#00C851] ml-2">₱{{ order.totalAmount }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1 bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h4 class="text-sm sm:text-base font-bold text-gray-900">Available Drivers ({{ filteredAvailableDrivers.length }})</h4>
              </div>
              <div class="max-h-64 overflow-y-auto border-2 border-[#00C851]/20 rounded-xl bg-white shadow-inner">
                <div v-for="driver in filteredAvailableDrivers" :key="driver.id" class="p-3 border-b border-gray-200 hover:bg-gradient-to-r hover:from-[#A8EB12]/10 hover:to-[#74E600]/10 transition-all duration-200">
                  <div class="flex items-center">
                    <div class="relative">
                      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[#74E600] to-[#3ED400] flex items-center justify-center border-2 border-white shadow-md">
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00C851] rounded-full border-2 border-white"></div>
                    </div>
                    <div class="ml-3 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="text-sm font-bold text-gray-900">{{ driver.firstName }} {{ driver.lastName }}</p>
                        <span 
                          v-if="isDriverCurrentlyScheduled(driver)"
                          class="px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white shadow-sm"
                          title="Currently on scheduled duty"
                        >
                          On Duty
                        </span>
                      </div>
                      <p class="text-xs text-gray-600 mt-0.5">{{ driver.vehicleType }} • {{ Number(driver.rating || 0).toFixed(1) }}⭐</p>
                      <!-- Schedule Display -->
                      <div v-if="getFormattedSchedule(driver)" class="mt-1.5 space-y-1">
                        <div 
                          v-for="(scheduleItem, index) in getFormattedSchedule(driver)" 
                          :key="index"
                          class="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded border border-[#00C851]/10"
                        >
                          <span class="font-semibold text-[#00C851]">{{ scheduleItem.days }}:</span>
                          <span class="ml-1">{{ scheduleItem.time }}</span>
                        </div>
                      </div>
                      <div v-else class="mt-1 text-xs text-gray-400 italic">
                        No schedule set
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t-2 border-[#00C851]/20">
            <button
              @click="closeBulkAssignModal"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              @click="performBulkAssignment"
              :disabled="unassignedOrders.length === 0 || filteredAvailableDrivers.length === 0 || bulkAssigning"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] border-2 border-transparent rounded-lg hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <svg v-if="bulkAssigning" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              {{ bulkAssigning ? 'Assigning...' : `Auto-Assign ${Math.min(unassignedOrders.length, filteredAvailableDrivers.length)} Orders` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAssignModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-1.5 sm:p-2" @click="closeAssignModal">
      <div class="relative mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-2 border-[#00C851]/30 max-h-[98vh] flex flex-col overflow-hidden" @click.stop>
        <!-- Enhanced Header with gradient -->
        <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] p-3 sm:p-4 rounded-t-2xl flex-shrink-0 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-white/25 backdrop-blur-sm rounded-lg shadow-sm">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-white drop-shadow-sm">
                  {{ selectedOrder?.driverName ? 'Driver Reassignment' : 'Assign Driver' }}
                </h3>
                <p class="text-xs sm:text-sm text-white/95 hidden sm:block mt-0.5">Select a driver based on location and availability</p>
              </div>
            </div>
            <button @click="closeAssignModal" class="text-white/90 hover:text-white hover:bg-white/25 rounded-lg p-1.5 transition-all duration-200 shadow-sm hover:shadow-md">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-3 sm:p-4 overflow-y-auto flex-1 bg-gradient-to-b from-gray-50/50 to-white">
          <!-- Enhanced Order details card -->
          <div class="mb-4 p-3 sm:p-4 bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 rounded-xl border-2 border-[#00C851]/20 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="flex items-center gap-2 mb-3">
              <div class="p-1.5 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 text-sm sm:text-base">Order Details</h4>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div class="bg-white/60 p-2 rounded-lg border border-[#00C851]/10">
                <p class="text-gray-600 mb-1 font-medium">Order ID</p>
                <p class="font-bold text-[#00C851]">#{{ selectedOrder?.id?.substring(0, 8) }}</p>
              </div>
              <div class="bg-white/60 p-2 rounded-lg border border-[#00C851]/10">
                <p class="text-gray-600 mb-1 font-medium">Customer</p>
                <p class="font-semibold text-gray-900">{{ selectedOrder?.customerName }}</p>
              </div>
              <div class="bg-white/60 p-2 rounded-lg border border-[#00C851]/10">
                <p class="text-gray-600 mb-1 font-medium">Service</p>
                <p class="font-semibold text-gray-900">{{ selectedOrder?.serviceName || formatServiceType(selectedOrder?.serviceType || selectedOrder?.serviceId) }}</p>
              </div>
              <div class="bg-white/60 p-2 rounded-lg border border-[#00C851]/10">
                <p class="text-gray-600 mb-1 font-medium">Total Amount</p>
                <p class="font-bold text-[#00C851]">₱{{ calculateTotalWithItems(selectedOrder) }}</p>
              </div>
            </div>
            <div v-if="selectedOrder?.pickupAddress || getPickupLocation(selectedOrder) || selectedOrder?.deliveryAddress || getDeliveryLocation(selectedOrder) || getServiceDetails(selectedOrder)" class="mt-3 pt-3 border-t-2 border-[#00C851]/20">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div v-if="selectedOrder?.pickupAddress || getPickupLocation(selectedOrder)" class="bg-white/60 p-2 rounded-lg border border-[#74E600]/20">
                  <p class="text-gray-600 mb-1 font-medium flex items-center gap-1">
                    <svg class="w-3 h-3 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Pickup Location
                  </p>
                  <p class="font-semibold text-gray-900">{{ selectedOrder?.pickupAddress || getPickupLocation(selectedOrder) }}</p>
                </div>
                <div v-if="selectedOrder?.deliveryAddress || getDeliveryLocation(selectedOrder)" class="bg-white/60 p-2 rounded-lg border border-[#3ED400]/20">
                  <p class="text-gray-600 mb-1 font-medium flex items-center gap-1">
                    <svg class="w-3 h-3 text-[#3ED400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Delivery Location
                  </p>
                  <p class="font-semibold text-gray-900">{{ selectedOrder?.deliveryAddress || getDeliveryLocation(selectedOrder) }}</p>
                </div>
              </div>
              <div v-if="getServiceDetails(selectedOrder)" class="mt-2 pt-2 border-t border-[#00C851]/10">
                <p class="text-gray-600 text-xs mb-1 font-medium">Service Details</p>
                <p class="font-semibold text-sm text-gray-900 bg-white/60 p-2 rounded-lg border border-[#00C851]/10">{{ getServiceDetails(selectedOrder) }}</p>
              </div>
            </div>
            
            <div v-if="selectedOrder?.feedback && selectedOrder?.status === 'delivered'" class="mt-3 pt-3 border-t-2 border-[#00C851]/20">
              <h4 class="font-semibold text-gray-900 mb-2 text-xs sm:text-sm flex items-center gap-1.5">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Customer Feedback
              </h4>
              <div class="bg-yellow-50 p-3 rounded-xl border-2 border-yellow-200 shadow-sm">
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" 
                         :class="i <= (selectedOrder.feedback.rating || 0) ? 'text-yellow-400' : 'text-gray-300'" 
                         class="w-4 h-4 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-bold text-gray-700">{{ selectedOrder.feedback.rating || 0 }}.0</span>
                  <span class="text-xs text-gray-500">by {{ selectedOrder.feedback.userName || 'Customer' }}</span>
                </div>
                <p v-if="selectedOrder.feedback.comment" class="text-xs sm:text-sm text-gray-700 italic bg-white/80 p-2 rounded-lg border border-yellow-100">
                  "{{ selectedOrder.feedback.comment }}"
                </p>
              </div>
            </div>
          </div>

          <!-- Enhanced Search Input -->
          <div class="mb-4">
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Search Available Drivers
            </label>
            <input
              v-model="driverSearchQuery"
              type="text"
              placeholder="Search by name, phone, or vehicle type..."
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851]/50 focus:border-[#00C851] transition-all duration-200 shadow-sm focus:shadow-md bg-white"
            >
          </div>

          <!-- Enhanced Drivers List -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                <div class="p-1 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                Available Drivers ({{ filteredAvailableDrivers.length }})
              </h4>
              <div class="flex items-center gap-3 text-xs">
                <div class="flex items-center gap-1.5 px-2 py-1 bg-[#00C851]/10 rounded-full border border-[#00C851]/20">
                  <div class="w-2.5 h-2.5 bg-[#00C851] rounded-full animate-pulse"></div>
                  <span class="font-medium text-[#00C851]">Online</span>
                </div>
                <div class="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full border border-gray-300">
                  <div class="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                  <span class="font-medium text-gray-600">Offline</span>
                </div>
              </div>
            </div>
            <div class="max-h-48 sm:max-h-64 overflow-y-auto border-2 border-[#00C851]/20 rounded-xl bg-white shadow-inner">
              <div v-if="loadingDrivers" class="p-6 text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-3 border-[#00C851] border-t-transparent mx-auto"></div>
                <p class="mt-3 text-sm text-gray-600 font-medium">Loading drivers...</p>
              </div>
              <div v-else-if="filteredAvailableDrivers.length === 0" class="p-6 text-center">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-sm text-gray-500 font-medium">No available drivers found</p>
              </div>
              <div v-else>
                <div
                  v-for="driver in filteredAvailableDrivers"
                  :key="driver.id"
                  class="p-3 sm:p-3.5 border-b border-gray-200 hover:bg-gradient-to-r hover:from-[#A8EB12]/10 hover:to-[#74E600]/10 cursor-pointer transition-all duration-200"
                  @click="selectDriver(driver)"
                  :class="{ 
                    'bg-gradient-to-r from-[#00C851]/15 to-[#3ED400]/15 border-l-4 border-[#00C851] shadow-md': selectedDriverId === driver.id,
                    'hover:border-l-2 hover:border-[#74E600]': selectedDriverId !== driver.id
                  }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="relative">
                        <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#74E600] to-[#3ED400] flex items-center justify-center border-2 border-white shadow-md">
                          <svg class="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <div
                          class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                          :class="driver.isOnline ? 'bg-[#00C851] animate-pulse' : 'bg-gray-400'"
                        ></div>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span 
                            v-if="isDriverCurrentlyScheduled(driver)"
                            class="px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white shadow-sm"
                            title="Currently on scheduled duty"
                          >
                            On Duty
                          </span>
                          <p class="text-sm sm:text-base font-bold text-gray-900">
                            {{ getDriverDisplayName(driver) }}
                          </p>
                        </div>
                        <p class="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                          {{ driver.phone }}
                        </p>
                        <div v-if="getFormattedSchedule(driver)" class="mt-1.5 space-y-1">
                          <div 
                            v-for="(scheduleItem, index) in getFormattedSchedule(driver)" 
                            :key="index"
                            class="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded border border-[#00C851]/10"
                          >
                            <span class="font-semibold text-[#00C851]">{{ scheduleItem.days }}:</span>
                            <span class="ml-1">{{ scheduleItem.time }}</span>
                          </div>
                        </div>
                        <div v-else class="mt-1 text-xs text-gray-400 italic">
                          No schedule set
                        </div>
                      </div>
                    </div>
                    <div class="text-right ml-3">
                      <span 
                        :class="driver.isOnline ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white shadow-md' : 'bg-gray-200 text-gray-700'" 
                        class="px-2.5 py-1 text-xs font-bold rounded-full border border-transparent"
                      >
                        {{ driver.isOnline ? 'Online' : 'Offline' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-5 pt-4 border-t-2 border-[#00C851]/20 flex-shrink-0">
            <button
              @click="closeAssignModal"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </button>
            <button
              @click="assignDriverToOrder"
              :disabled="!selectedDriverId || assigningDriver"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] border-2 border-transparent rounded-lg hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <svg v-if="assigningDriver" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              {{ assigningDriver ? 'Assigning...' : (selectedOrder?.driverName ? 'Reassign Driver' : 'Assign Driver') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showOrderDetailsModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-1.5 sm:p-2" @click="closeOrderDetailsModal">
      <div class="relative mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-2 border-[#00C851]/30 max-h-[98vh] flex flex-col overflow-hidden" @click.stop>
        <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] p-3 sm:p-4 rounded-t-2xl flex-shrink-0 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-white/25 backdrop-blur-sm rounded-lg shadow-sm">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-white drop-shadow-sm">Order Details</h3>
                <p class="text-xs sm:text-sm text-white/95 hidden sm:block mt-0.5">Complete booking information</p>
              </div>
            </div>
            <button @click="closeOrderDetailsModal" class="text-white/90 hover:text-white hover:bg-white/25 rounded-lg p-1.5 transition-all duration-200 shadow-sm hover:shadow-md">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-3 sm:p-4 overflow-y-auto flex-1 bg-gradient-to-b from-gray-50/50 to-white">
          <div v-if="selectedOrderForDetails && orderDetailsSections.length > 1" class="mb-4">
            <!-- Section Tabs -->
            <div class="flex justify-center items-center gap-1.5 mb-3 flex-wrap">
              <div
                v-for="(section, index) in orderDetailsSections"
                :key="section.id"
                @click="goToOrderDetailsPage(index)"
                :class="index === orderDetailsCurrentPage ? 'bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 border border-gray-300'"
                class="px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 border-2"
              >
                {{ section.title }}
              </div>
            </div>
            <!-- Pagination Dots -->
            <div class="flex justify-center items-center gap-2 mt-2">
              <div
                v-for="(section, index) in orderDetailsSections"
                :key="`dot-${section.id}`"
                @click="goToOrderDetailsPage(index)"
                :class="index === orderDetailsCurrentPage ? 'bg-[#00C851] w-3 h-3 shadow-md' : 'bg-gray-300 hover:bg-gray-400'"
                class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-200 border-2 border-white"
                :title="section.title"
              ></div>
            </div>
          </div>

          <div v-if="selectedOrderForDetails" class="min-h-[200px] sm:min-h-[250px]">
            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'summary'" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Order Summary</h4>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div class="bg-white/70 p-2 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Order ID</p>
                  <p class="font-bold text-[#00C851]">#{{ selectedOrderForDetails.id?.substring(0, 8) }}</p>
                </div>
                <div class="bg-white/70 p-2 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Status</p>
                  <span :class="getStatusClass(selectedOrderForDetails.status)" class="px-2 py-1 text-xs font-bold rounded-full">
                    {{ formatStatus(selectedOrderForDetails.status) }}
                  </span>
                </div>
                <div class="bg-white/70 p-2 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Total Amount</p>
                  <p class="font-bold text-[#00C851]">₱{{ calculateTotalWithItems(selectedOrderForDetails) }}</p>
                </div>
                <div class="bg-white/70 p-2 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Created</p>
                  <p class="font-semibold text-gray-900">{{ formatOrderDate(selectedOrderForDetails.createdAt) }}</p>
                </div>
              </div>
              <div v-if="selectedOrderForDetails.pricing?.itemsTotal" class="mt-3 pt-3 border-t-2 border-[#00C851]/20">
                <div class="bg-white/70 p-2 rounded-lg border border-[#3ED400]/20">
                  <p class="text-gray-600 text-xs mb-1 font-medium">Items Total (Set by Driver)</p>
                  <p class="font-bold text-[#3ED400] text-sm">₱{{ selectedOrderForDetails.pricing.itemsTotal.toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'customer'" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Customer Information</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Name</p>
                  <p class="font-bold text-gray-900">{{ selectedOrderForDetails.customerName || 'Unknown Customer' }}</p>
                </div>
                <div class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Phone</p>
                  <p class="font-bold text-gray-900">{{ selectedOrderForDetails.customerPhone || 'No phone' }}</p>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'service'" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Service Information</h4>
              </div>
              <div class="flex items-start gap-1.5 sm:gap-2">
                <div class="p-1 sm:p-1.5 rounded flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7" :class="getServiceColorClass(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId)">
                  <svg v-if="(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) === 'medicine-delivery'" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><mask :id="'medMaskDetails-' + (selectedOrderForDetails?.id || 'default')"><g fill="none"><rect width="38" height="26" x="5" y="16" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="3"/><path fill="#fff" d="M19 8h10V4H19zm11 1v7h4V9zm-12 7V9h-4v7zm11-8a1 1 0 0 1 1 1h4a5 5 0 0 0-5-5zM19 4a5 5 0 0 0-5 5h4a1 1 0 0 1 1-1z"/><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M18 29h12m-6-6v12"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" :mask="'url(#medMaskDetails-' + (selectedOrderForDetails?.id || 'default') + ')'"/></svg>
                  <svg v-else-if="(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) === 'food-delivery' || (selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) === 'food'" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26c1.44 1.42 2.43 2.89 2.43 5.29zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-8-15.03-8-15.03 0zM1.02 17h15v2h-15z"/></svg>
                  <svg v-else-if="(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) === 'bill-payments'" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v38l-7-5l-7 5l-7-5l-7 5zm8 16h12m-12 8h12M18 14h12"/></svg>
                  <svg v-else-if="(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) === 'grocery-shopping' || (selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) === 'grocery'" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M2 4h1l3.6 7.59l-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0 0 20.01 4H5.21l-.67-1.43a.99.99 0 0 0-.9-.57H2c-.55 0-1 .45-1 1s.45 1 1 1m15 14c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2"/></svg>
                  <svg v-else-if="(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) === 'gift-delivery'" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M9.06 1.93C7.17 1.92 5.33 3.74 6.17 6H3a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h9V8h2v3h9a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-3.17C19 2.73 14.6.42 12.57 3.24L12 4l-.57-.78c-.63-.89-1.5-1.28-2.37-1.29M9 4c.89 0 1.34 1.08.71 1.71S8 5.89 8 5a1 1 0 0 1 1-1m6 0c.89 0 1.34 1.08.71 1.71S14 5.89 14 5a1 1 0 0 1 1-1M2 12v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8h-9v8h-2v-8z"/></svg>
                  <svg v-else class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 256 256" fill="currentColor"><path d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.35 44l-29.78 16.29l-80.35-44Zm0 88L47.65 76l33.91-18.57l80.35 44Zm88 55.85l-80 43.79v-85.81l32-17.51V152a8 8 0 0 0 16 0v-44.44l32-17.51v85.76Z"/></svg>
                </div>
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900 text-xs">{{ selectedOrderForDetails.serviceName || formatServiceType(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) }}</h5>
                  <p class="text-xs text-gray-600 mt-0.5">{{ getServiceDescription(selectedOrderForDetails.serviceType || selectedOrderForDetails.serviceId) }}</p>
                  <div v-if="getServiceDetails(selectedOrderForDetails)" class="mt-1 p-1.5 bg-gray-50 rounded text-xs">
                    <strong>Details:</strong> {{ getServiceDetails(selectedOrderForDetails) }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'location' && (selectedOrderForDetails.pickupAddress || getPickupLocation(selectedOrderForDetails) || selectedOrderForDetails.deliveryAddress || getDeliveryLocation(selectedOrderForDetails))" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Location Information</h4>
              </div>
              <div class="space-y-2 sm:space-y-3">
                <div v-if="selectedOrderForDetails.pickupAddress || getPickupLocation(selectedOrderForDetails)" class="bg-white/70 p-2.5 rounded-lg border border-[#74E600]/20">
                  <p class="text-gray-600 text-xs sm:text-sm mb-1 font-medium flex items-center gap-1">
                    <svg class="w-3 h-3 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Pickup Location
                  </p>
                  <p class="font-bold text-gray-900 text-xs sm:text-sm">{{ selectedOrderForDetails.pickupAddress || getPickupLocation(selectedOrderForDetails) }}</p>
                </div>
                <div v-if="selectedOrderForDetails.deliveryAddress || getDeliveryLocation(selectedOrderForDetails)" class="bg-white/70 p-2.5 rounded-lg border border-[#3ED400]/20">
                  <p class="text-gray-600 text-xs sm:text-sm mb-1 font-medium flex items-center gap-1">
                    <svg class="w-3 h-3 text-[#3ED400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Delivery Location
                  </p>
                  <p class="font-bold text-gray-900 text-xs sm:text-sm">{{ selectedOrderForDetails.deliveryAddress || getDeliveryLocation(selectedOrderForDetails) }}</p>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'driver' && (selectedOrderForDetails.driverName || selectedOrderForDetails.driverId)" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Driver Information</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Driver Name</p>
                  <p class="font-bold text-gray-900">{{ selectedOrderForDetails.driverName || getDriverNameById(selectedOrderForDetails.driverId) }}</p>
                </div>
                <div class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Phone</p>
                  <p class="font-bold text-gray-900">{{ selectedOrderForDetails.driverPhone || getDriverPhoneById(selectedOrderForDetails.driverId) }}</p>
                </div>
                <div v-if="selectedOrderForDetails.driverAssignedAt" class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Assigned At</p>
                  <p class="font-semibold text-gray-900">{{ formatOrderDate(selectedOrderForDetails.driverAssignedAt) }}</p>
                </div>
                <div class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10">
                  <p class="text-gray-600 mb-1 font-medium">Status</p>
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 rounded-full animate-pulse"
                      :class="getDriverOnlineStatus(selectedOrderForDetails.driverId) ? 'bg-[#00C851]' : 'bg-gray-400'"
                    ></div>
                    <span class="text-sm font-bold" :class="getDriverOnlineStatus(selectedOrderForDetails.driverId) ? 'text-[#00C851]' : 'text-gray-600'">{{ getDriverOnlineStatus(selectedOrderForDetails.driverId) ? 'Online' : 'Offline' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'booking' && selectedOrderForDetails.formData" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Booking Details</h4>
              </div>
              <div class="space-y-2 text-xs sm:text-sm">
                <div v-for="field in getFilteredBookingDetails(selectedOrderForDetails)" :key="field.key" class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-medium">{{ field.label }}:</span>
                  <span class="font-bold text-gray-900 text-right max-w-[60%]">
                    <a v-if="field.isLink" :href="field.value" target="_blank" class="text-[#00C851] hover:underline hover:text-[#3ED400]">View Receipt</a>
                    <span v-else>{{ field.value }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'pricing' && selectedOrderForDetails.pricing" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Price Breakdown</h4>
              </div>
              <div class="space-y-2 text-xs sm:text-sm">
                <div v-if="selectedOrderForDetails.pricing.baseCharge" class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Base Charge:</span>
                  <span class="font-bold text-gray-900">₱{{ selectedOrderForDetails.pricing.baseCharge.toFixed(2) }}</span>
                </div>
                <div v-if="selectedOrderForDetails.pricing.distanceFee" class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Distance Fee:</span>
                  <span class="font-bold text-gray-900">₱{{ selectedOrderForDetails.pricing.distanceFee.toFixed(2) }}</span>
                </div>
                <div v-if="selectedOrderForDetails.pricing.badWeatherFee" class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Bad Weather Fee:</span>
                  <span class="font-bold text-gray-900">₱{{ selectedOrderForDetails.pricing.badWeatherFee.toFixed(2) }}</span>
                </div>
                <div v-if="selectedOrderForDetails.pricing.itemsTotal" class="bg-white/70 p-2.5 rounded-lg border-2 border-[#3ED400]/30 flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Items Total:</span>
                  <span class="font-bold text-[#3ED400]">₱{{ selectedOrderForDetails.pricing.itemsTotal.toFixed(2) }}</span>
                </div>
                <div v-if="selectedOrderForDetails.paymentMethod === 'GCASH' && selectedOrderForDetails.pricing.gcashFee" class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-medium">GCash Fee:</span>
                  <span class="font-bold text-gray-900">₱{{ selectedOrderForDetails.pricing.gcashFee.toFixed(2) }}</span>
                </div>
                <div v-else-if="selectedOrderForDetails.paymentMethod === 'COD'" class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-medium">GCash Fee:</span>
                  <span class="text-gray-500 font-semibold">No charge (Cash on Delivery)</span>
                </div>
                <div class="bg-gradient-to-r from-[#00C851]/20 to-[#3ED400]/20 p-3 rounded-lg border-2 border-[#00C851] flex justify-between items-center mt-3">
                  <span class="font-bold text-gray-900 text-sm sm:text-base">Total:</span>
                  <span class="font-bold text-[#00C851] text-base sm:text-lg">₱{{ calculateTotalWithItems(selectedOrderForDetails) }}</span>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'proof' && selectedOrderForDetails.proofOfDelivery?.url" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-3 sm:p-4 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-3">
                <div class="p-1.5 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">Proof of Delivery</h4>
              </div>
              <div class="space-y-3">
                <div class="bg-white/70 p-2.5 rounded-lg border border-[#00C851]/10">
                  <p class="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Uploaded by Driver</p>
                  <div v-if="selectedOrderForDetails.proofOfDelivery.uploadedAt" class="text-xs sm:text-sm text-gray-700 font-semibold">
                    {{ formatOrderDate(selectedOrderForDetails.proofOfDelivery.uploadedAt) }}
                  </div>
                </div>
                <div class="relative bg-white/70 p-2 rounded-lg border-2 border-[#00C851]/20">
                  <img
                    :src="selectedOrderForDetails.proofOfDelivery.url"
                    alt="Proof of Delivery"
                    class="rounded-lg border-2 border-[#00C851]/10 shadow-md max-h-48 sm:max-h-64 w-full object-contain cursor-pointer hover:opacity-90 transition-opacity hover:shadow-lg"
                    @click="openProofPreview(selectedOrderForDetails.proofOfDelivery.url)"
                  />
                </div>
                <a
                  :href="selectedOrderForDetails.proofOfDelivery.url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] text-white text-xs sm:text-sm font-bold rounded-lg hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  View Full Resolution
                </a>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'summary' && selectedOrderForDetails.additionalOrders && selectedOrderForDetails.additionalOrders.length > 0" class="mt-2 bg-gradient-to-br from-[#74E600]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#74E600]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Additional Orders</h4>
              <div class="space-y-2 sm:space-y-3">
                <div v-for="(additionalOrder, index) in selectedOrderForDetails.additionalOrders" :key="index" class="bg-blue-50 p-2.5 sm:p-3 rounded-lg border border-blue-200">
                  <div class="flex justify-between items-start mb-1.5">
                    <div>
                      <h5 class="font-medium text-gray-900 text-xs sm:text-sm">{{ additionalOrder.serviceName || 'Additional Order' }}</h5>
                      <p class="text-xs text-gray-500 mt-0.5">
                        Added: {{ additionalOrder.createdAt ? formatOrderDate(additionalOrder.createdAt) : 'N/A' }}
                      </p>
                    </div>
                    <span class="px-1.5 py-0.5 text-xs font-medium rounded-full" :class="
                      additionalOrder.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      additionalOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    ">
                      {{ additionalOrder.status || 'pending' }}
                    </span>
                  </div>
                  
                  <div v-if="additionalOrder.pickupAddress || additionalOrder.deliveryAddress" class="mt-1.5 text-xs">
                    <div v-if="additionalOrder.pickupAddress" class="text-gray-600">
                      <span class="font-medium">Pickup:</span> {{ additionalOrder.pickupAddress }}
                    </div>
                    <div v-if="additionalOrder.deliveryAddress" class="text-gray-600 mt-0.5">
                      <span class="font-medium">Delivery:</span> {{ additionalOrder.deliveryAddress }}
                    </div>
                  </div>
                  
                  <div v-if="additionalOrder.routeInfo" class="mt-1.5 text-xs text-gray-500">
                    <span>Distance: {{ additionalOrder.routeInfo.distance }}</span>
                    <span class="ml-2 sm:ml-3">ETA: {{ additionalOrder.routeInfo.duration }}</span>
                  </div>
                  
                  <div v-if="additionalOrder.pricing" class="mt-2 pt-2 border-t border-blue-200">
                    <div class="flex justify-between text-xs sm:text-sm">
                      <span class="text-gray-600">Order Total:</span>
                      <span class="font-medium text-green-600">₱{{ (additionalOrder.totalAmount || additionalOrder.pricing.total || 0).toFixed(2) }}</span>
                    </div>
                  </div>
                  
                  <div v-if="additionalOrder.formData" class="mt-1.5 text-xs text-gray-600">
                    <div v-for="(value, key) in additionalOrder.formData" :key="key" v-if="value && typeof value === 'string' && value.trim()" class="mt-0.5">
                      <span class="font-medium">{{ key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() }}:</span>
                      {{ value.length > 50 ? value.substring(0, 50) + '...' : value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="orderDetailsSections[orderDetailsCurrentPage]?.id === 'summary' && selectedOrderForDetails?.feedback && selectedOrderForDetails?.status === 'delivered'" class="mt-2 bg-gradient-to-br from-[#A8EB12]/10 to-[#74E600]/10 p-2 sm:p-3 rounded-xl border border-[#A8EB12]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm flex items-center gap-1">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Customer Feedback
              </h4>
              <div class="space-y-1">
                <div class="flex items-center gap-1 sm:gap-1.5">
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" 
                         :class="i <= (selectedOrderForDetails.feedback.rating || 0) ? 'text-yellow-400' : 'text-gray-300'" 
                         class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-xs font-bold text-gray-700">{{ selectedOrderForDetails.feedback.rating || 0 }}.0</span>
                  <span class="text-xs text-gray-500">by {{ selectedOrderForDetails.feedback.userName || 'Customer' }}</span>
                </div>
                <p v-if="selectedOrderForDetails.feedback.comment" class="text-xs text-gray-700 italic bg-white/60 p-1.5 rounded-lg border border-yellow-100">
                  "{{ selectedOrderForDetails.feedback.comment }}"
                </p>
              </div>
            </div>

          </div>

          <div v-if="orderDetailsSections.length > 1" class="flex items-center justify-between mt-4 pt-4 border-t-2 border-[#00C851]/20 flex-shrink-0">
            <button
              @click="previousOrderDetailsPage"
              :disabled="orderDetailsCurrentPage === 0"
              class="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Previous</span>
            </button>
            
            <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 rounded-lg border border-[#00C851]/20">
              <span class="text-xs font-bold text-[#00C851]">{{ orderDetailsCurrentPage + 1 }}</span>
              <span class="text-xs text-gray-400">of</span>
              <span class="text-xs font-bold text-[#00C851]">{{ orderDetailsSections.length }}</span>
            </div>
            
            <button
              @click="nextOrderDetailsPage"
              :disabled="orderDetailsCurrentPage === orderDetailsSections.length - 1"
              class="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] border-2 border-transparent rounded-lg hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transform hover:scale-[1.02]"
            >
              <span>Next</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 pt-4 border-t-2 border-[#00C851]/20 flex-shrink-0">
            <button
              @click="closeOrderDetailsModal"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Close
            </button>
            <button
              v-if="selectedOrderForDetails?.driverId"
              @click="trackDriver(selectedOrderForDetails)"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] border-2 border-transparent rounded-lg hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Track Driver
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTrackingModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-1.5 sm:p-2" @click="closeTrackingModal">
      <div class="relative mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-2 border-[#00C851]/30 max-h-[98vh] flex flex-col overflow-hidden" @click.stop>
        <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] p-3 sm:p-4 rounded-t-2xl flex-shrink-0 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 bg-white/25 backdrop-blur-sm rounded-lg shadow-sm">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-white drop-shadow-sm">Live Driver Tracking</h3>
                <p class="text-xs sm:text-sm text-white/95 hidden sm:block mt-0.5">Real-time location and status updates</p>
              </div>
            </div>
            <button @click="closeTrackingModal" class="text-white/90 hover:text-white hover:bg-white/25 rounded-lg p-1.5 transition-all duration-200 shadow-sm hover:shadow-md">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-3 sm:p-4 overflow-y-auto flex-1 bg-gradient-to-b from-gray-50/50 to-white">
          <!-- Pagination Tabs -->
          <div v-if="trackingSections.length > 1" class="mb-4">
            <!-- Section Tabs -->
            <div class="flex justify-center items-center gap-1.5 mb-3 flex-wrap">
              <div
                v-for="(section, index) in trackingSections"
                :key="section.id"
                @click="goToTrackingPage(index)"
                :class="index === trackingCurrentPage ? 'bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] text-white shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 border border-gray-300'"
                class="px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 border-2"
              >
                {{ section.title }}
              </div>
            </div>
            <!-- Pagination Dots -->
            <div class="flex justify-center items-center gap-2 mt-2">
              <div
                v-for="(section, index) in trackingSections"
                :key="`dot-${section.id}`"
                @click="goToTrackingPage(index)"
                :class="index === trackingCurrentPage ? 'bg-[#00C851] w-3 h-3 shadow-md' : 'bg-gray-300 hover:bg-gray-400'"
                class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-200 border-2 border-white"
                :title="section.title"
              ></div>
            </div>
          </div>

          <!-- Page Content -->
          <div class="min-h-[300px] sm:min-h-[350px]">
            <!-- Page 1: Live Driver Tracking Map -->
            <div v-if="trackingSections[trackingCurrentPage]?.id === 'map'" class="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden border-2 border-[#00C851]/20 shadow-lg">
              <div id="live-tracking-map" class="h-80 w-full flex items-center justify-center">
                <div class="text-center">
                  <div class="w-24 h-24 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-xl border-4 border-white">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <p class="text-lg sm:text-xl font-bold text-gray-900 mb-1">{{ trackedDriverName }}</p>
                  <p class="text-sm sm:text-base text-gray-600 mb-3">{{ currentDriverLocation }}</p>
                  <div class="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 rounded-full border border-[#00C851]/20 inline-flex">
                    <div class="w-3 h-3 bg-[#00C851] rounded-full animate-pulse"></div>
                    <span class="text-sm sm:text-base text-[#00C851] font-bold">Live Tracking Active</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page 2: Driver Information -->
            <div v-if="trackingSections[trackingCurrentPage]?.id === 'driver'" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-4 sm:p-5 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <div class="p-2 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-base sm:text-lg">Driver Information</h4>
              </div>
              <div class="space-y-3 text-sm sm:text-base">
                <div class="bg-white/70 p-3 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-semibold">Name:</span>
                  <span class="font-bold text-gray-900">{{ trackedDriverName }}</span>
                </div>
                <div class="bg-white/70 p-3 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-semibold">Phone:</span>
                  <span class="font-bold text-gray-900">{{ trackedDriverPhone }}</span>
                </div>
                <div class="bg-white/70 p-3 rounded-lg border-2 border-[#00C851]/20 flex justify-between items-center">
                  <span class="text-gray-600 font-semibold">Status:</span>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-[#00C851] rounded-full animate-pulse"></div>
                    <span class="text-[#00C851] font-bold">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page 3: Delivery Status -->
            <div v-if="trackingSections[trackingCurrentPage]?.id === 'delivery'" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-4 sm:p-5 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <div class="p-2 bg-gradient-to-br from-[#74E600] to-[#3ED400] rounded-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-base sm:text-lg">Delivery Status</h4>
              </div>
              <div class="space-y-3 text-sm sm:text-base">
                <div class="bg-white/70 p-3 rounded-lg border border-[#00C851]/10">
                  <span class="text-gray-600 font-semibold block mb-1">Current Location:</span>
                  <span class="font-bold text-gray-900">{{ currentDriverLocation }}</span>
                </div>
                <div v-if="trackedOrder || selectedOrder" class="space-y-3">
                  <div v-if="(trackedOrder || selectedOrder)?.pickupAddress || getPickupLocation(trackedOrder || selectedOrder)" class="bg-white/70 p-3 rounded-lg border-2 border-[#74E600]/30">
                    <span class="text-gray-600 font-semibold block mb-1 flex items-center gap-1">
                      <svg class="w-4 h-4 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Pickup:
                    </span>
                    <span class="font-bold text-[#74E600]">{{ (trackedOrder || selectedOrder)?.pickupAddress || getPickupLocation(trackedOrder || selectedOrder) }}</span>
                  </div>
                  <div v-if="(trackedOrder || selectedOrder)?.deliveryAddress || getDeliveryLocation(trackedOrder || selectedOrder)" class="bg-white/70 p-3 rounded-lg border-2 border-[#3ED400]/30">
                    <span class="text-gray-600 font-semibold block mb-1 flex items-center gap-1">
                      <svg class="w-4 h-4 text-[#3ED400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Drop-off:
                    </span>
                    <span class="font-bold text-[#3ED400]">{{ (trackedOrder || selectedOrder)?.deliveryAddress || getDeliveryLocation(trackedOrder || selectedOrder) }}</span>
                  </div>
                </div>
                <div class="bg-white/70 p-3 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-semibold">ETA:</span>
                  <span class="font-bold text-[#00C851]">{{ estimatedArrival }}</span>
                </div>
                <div class="bg-white/70 p-3 rounded-lg border border-[#00C851]/10 flex justify-between items-center">
                  <span class="text-gray-600 font-semibold">Distance:</span>
                  <span class="font-bold text-gray-900">{{ remainingDistance }}</span>
                </div>
              </div>
            </div>

            <!-- Page 4: Order Progress -->
            <div v-if="trackingSections[trackingCurrentPage]?.id === 'progress'" class="bg-gradient-to-br from-[#A8EB12]/10 via-[#74E600]/10 to-[#3ED400]/10 p-4 sm:p-5 rounded-xl border-2 border-[#00C851]/20 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <div class="p-2 bg-gradient-to-br from-[#00C851] to-[#3ED400] rounded-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="font-bold text-gray-900 text-base sm:text-lg">Order Progress</h4>
              </div>
              <div class="flex items-center justify-between">
                <div v-for="(step, index) in trackingSteps" :key="step.status" class="flex flex-col items-center flex-1">
                  <div class="flex items-center w-full">
                    <div :class="getTrackingStepClass(step.status)" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-lg border-2 border-white">
                      <svg v-if="isTrackingStepCompleted(step.status)" class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span v-else>{{ index + 1 }}</span>
                    </div>
                    <div v-if="index < trackingSteps.length - 1" :class="isTrackingStepCompleted(step.status) ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400]' : 'bg-gray-300'" class="flex-1 h-2 mx-2 rounded-full"></div>
                  </div>
                  <span :class="isTrackingStepCompleted(step.status) ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white font-bold px-3 py-1.5 rounded-lg shadow-md mt-3' : 'bg-gray-100 text-gray-500 font-semibold px-2 py-1 rounded-md'" class="text-xs sm:text-sm mt-3 text-center">{{ step.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div v-if="trackingSections.length > 1" class="flex items-center justify-between mt-4 pt-4 border-t-2 border-[#00C851]/20 flex-shrink-0">
            <button
              @click="previousTrackingPage"
              :disabled="trackingCurrentPage === 0"
              class="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Previous</span>
            </button>
            
            <div class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 rounded-lg border border-[#00C851]/20">
              <span class="text-xs sm:text-sm font-bold text-[#00C851]">{{ trackingCurrentPage + 1 }}</span>
              <span class="text-xs text-gray-400">of</span>
              <span class="text-xs sm:text-sm font-bold text-[#00C851]">{{ trackingSections.length }}</span>
            </div>
            
            <button
              @click="nextTrackingPage"
              :disabled="trackingCurrentPage === trackingSections.length - 1"
              class="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] border-2 border-transparent rounded-lg hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transform hover:scale-[1.02]"
            >
              <span>Next</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 pt-4 border-t-2 border-[#00C851]/20 flex-shrink-0">
            <button
              @click="closeTrackingModal"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Close
            </button>
            <button
              @click="refreshDriverLocation"
              class="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] border-2 border-transparent rounded-lg hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Location
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#00C851]/30 overflow-hidden" @click.stop>
        <div :class="[
          'bg-gradient-to-r p-4 sm:p-5',
          notificationType === 'success' ? 'from-[#00C851] via-[#3ED400] to-[#74E600]' : 
          notificationType === 'error' ? 'from-red-500 to-red-600' : 
          notificationType === 'warning' ? 'from-yellow-500 to-yellow-600' :
          'from-blue-500 to-blue-600'
        ]">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50',
              notificationType === 'success' ? 'bg-white/25 backdrop-blur-sm' : 
              notificationType === 'error' ? 'bg-white/25 backdrop-blur-sm' : 
              notificationType === 'warning' ? 'bg-white/25 backdrop-blur-sm' :
              'bg-white/25 backdrop-blur-sm'
            ]">
              <svg 
                v-if="notificationType === 'success'"
                class="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg 
                v-else-if="notificationType === 'error'"
                class="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <svg 
                v-else-if="notificationType === 'warning'"
                class="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <svg 
                v-else
                class="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
              {{ notificationType === 'success' ? 'Success' : notificationType === 'error' ? 'Error' : notificationType === 'warning' ? 'Warning' : 'Information' }}
            </h3>
          </div>
        </div>
        <div class="p-5 sm:p-6 bg-gradient-to-b from-gray-50/50 to-white">
          <p class="text-gray-700 mb-6 text-sm sm:text-base font-medium leading-relaxed">{{ notificationMessage }}</p>
          <div class="flex justify-end">
            <button
              @click="closeNotificationModal"
              :class="[
                'px-5 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]',
                notificationType === 'success' ? 'bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] text-white hover:from-[#00C851]/90 hover:via-[#3ED400]/90 hover:to-[#74E600]/90' : 
                notificationType === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' : 
                notificationType === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700' :
                'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              ]"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase/config'
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, where, serverTimestamp, getDocs } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import { realtimeService } from '@/services/realtime'
import { loggingService } from '@/services/loggingService'
import { useAuthStore } from '@/stores/auth'
import { googleMapsService } from '@/services/googleMaps' // Import Google Maps service
import jsPDF from 'jspdf'
// Import autoTable plugin - for jspdf-autotable v5+
import { applyPlugin, autoTable } from 'jspdf-autotable'

// Apply plugin to jsPDF prototype (required for v5+)
// This extends jsPDF with the autoTable method
applyPlugin(jsPDF)

// CHANGE: Removed non-existent icon component imports

export default {
  name: 'ManageOrders',
  // CHANGE: Removed components section since we're using inline SVG icons
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()
    const route = useRoute()
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

    // Notification modal state
    const showNotificationModal = ref(false)
    const notificationType = ref('success') // 'success', 'error', 'warning', 'info'
    const notificationMessage = ref('')

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
    const driverLocationUnsubscribe = ref(null)
    const pickupMarker = ref(null)
    const dropoffMarker = ref(null)
    const directionsService = ref(null)
    const directionsRenderer = ref(null)
    const trackingCurrentPage = ref(0)

    const trackingSteps = ref([
      { status: 'confirmed', label: 'Confirmed' },
      { status: 'driver_assigned', label: 'Driver Assigned' },
      { status: 'in_transit', label: 'In Transit' },
      { status: 'delivered', label: 'Delivered' }
    ])

    const trackingSections = computed(() => [
      { id: 'map', title: 'Live Tracking' },
      { id: 'driver', title: 'Driver Info' },
      { id: 'delivery', title: 'Delivery Status' },
      { id: 'progress', title: 'Order Progress' }
    ])

    const nextTrackingPage = () => {
      if (trackingCurrentPage.value < trackingSections.value.length - 1) {
        trackingCurrentPage.value++
      }
    }

    const previousTrackingPage = () => {
      if (trackingCurrentPage.value > 0) {
        trackingCurrentPage.value--
      }
    }

    const goToTrackingPage = (index) => {
      if (index >= 0 && index < trackingSections.value.length) {
        trackingCurrentPage.value = index
      }
    }

    // CHANGE: Added order progress modal functionality
    const showOrderProgressModal = ref(false)
    const selectedOrderForProgress = ref(null)

    const totalOrders = computed(() => orders.value.length)
    const pendingOrders = computed(() => orders.value.filter(order => order.status === 'pending').length)
    const inTransitOrders = computed(() => orders.value.filter(order => order.status === 'in_transit').length)
    const completedOrders = computed(() => orders.value.filter(order => order.status === 'delivered').length)

    const unassignedOrders = computed(() => orders.value.filter(order => !order.driverId && order.status !== 'cancelled'))

    // Helper function to check if driver is currently scheduled
    const isDriverCurrentlyScheduled = (driver) => {
      const schedule = driver.raw?.schedule || driver.schedule
      if (!schedule || Object.keys(schedule).length === 0) return false

      const now = new Date()
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

      const daySchedule = schedule[currentDay]
      if (!daySchedule || !daySchedule.enabled) return false

      const startTime = daySchedule.startTime || '00:00'
      const endTime = daySchedule.endTime || '23:59'

      // Compare times as strings (works for HH:MM format)
      return currentTime >= startTime && currentTime <= endTime
    }

    // Format schedule for display
    const getFormattedSchedule = (driver) => {
      const schedule = driver.raw?.schedule || driver.schedule
      if (!schedule || Object.keys(schedule).length === 0) {
        return null
      }

      const dayLabels = {
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun'
      }

      const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      
      // Group days by time slots
      const timeGroups = {}
      dayOrder.forEach(day => {
        if (schedule[day]?.enabled) {
          const timeKey = `${schedule[day].startTime || '08:00'}-${schedule[day].endTime || '17:00'}`
          if (!timeGroups[timeKey]) {
            timeGroups[timeKey] = []
          }
          timeGroups[timeKey].push(day)
        }
      })

      // Format each time group
      const formatted = []
      Object.keys(timeGroups).forEach(timeKey => {
        const days = timeGroups[timeKey]
        if (days.length === 0) return

        // Sort days by order
        days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))

        // Group consecutive days
        let dayRange = ''
        let startDay = days[0]
        let endDay = days[0]

        for (let i = 1; i < days.length; i++) {
          const currentIndex = dayOrder.indexOf(days[i])
          const prevIndex = dayOrder.indexOf(days[i - 1])
          
          if (currentIndex === prevIndex + 1) {
            // Consecutive day
            endDay = days[i]
          } else {
            // Not consecutive, output previous range
            if (startDay === endDay) {
              dayRange += (dayRange ? ', ' : '') + dayLabels[startDay]
            } else {
              dayRange += (dayRange ? ', ' : '') + `${dayLabels[startDay]}-${dayLabels[endDay]}`
            }
            startDay = days[i]
            endDay = days[i]
          }
        }

        // Output final range
        if (startDay === endDay) {
          dayRange += (dayRange ? ', ' : '') + dayLabels[startDay]
        } else {
          dayRange += (dayRange ? ', ' : '') + `${dayLabels[startDay]}-${dayLabels[endDay]}`
        }

        formatted.push({
          days: dayRange,
          time: timeKey
        })
      })

      return formatted.length > 0 ? formatted : null
    }

    // Helper function to get schedule priority (lower number = higher priority)
    const getSchedulePriority = (driver) => {
      const schedule = driver.raw?.schedule || driver.schedule
      if (!schedule || Object.keys(schedule).length === 0) return 999 // No schedule = lowest priority

      const now = new Date()
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      const currentTime = now.toTimeString().slice(0, 5)

      const daySchedule = schedule[currentDay]
      if (!daySchedule || !daySchedule.enabled) return 500 // Scheduled but not today = medium priority

      const startTime = daySchedule.startTime || '00:00'
      const endTime = daySchedule.endTime || '23:59'

      if (currentTime >= startTime && currentTime <= endTime) {
        return 0 // Currently on duty = highest priority
      } else if (currentTime < startTime) {
        // Before shift starts - calculate minutes until shift
        const [currentH, currentM] = currentTime.split(':').map(Number)
        const [startH, startM] = startTime.split(':').map(Number)
        const minutesUntilShift = (startH * 60 + startM) - (currentH * 60 + currentM)
        return Math.min(100 + minutesUntilShift, 499) // Soon to start = high priority
      } else {
        return 500 // Shift already ended = medium priority
      }
    }

    const filteredAvailableDrivers = computed(() => {
      // Filter only online drivers
      let onlineDrivers = availableDrivers.value.filter(driver => driver.isOnline)
      
      // Apply search filter if exists
      if (driverSearchQuery.value) {
        const query = driverSearchQuery.value.toLowerCase()
        onlineDrivers = onlineDrivers.filter(driver =>
          `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(query) ||
          (driver.phone || '').toLowerCase().includes(query) ||
          (driver.vehicleType || '').toLowerCase().includes(query)
        )
      }

      // Sort by schedule priority (scheduled drivers first)
      return onlineDrivers.sort((a, b) => {
        const priorityA = getSchedulePriority(a)
        const priorityB = getSchedulePriority(b)
        return priorityA - priorityB
      })
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
                // Suppress permission errors - services may not be accessible
                if (!err.message.includes('permission') && !err.message.includes('insufficient')) {
                  console.error('Error fetching service:', err)
                }
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
              schedule: driverData.schedule || null,
              raw: {
                ...driverData,
                schedule: driverData.schedule || null
              }
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o&libraries=geometry&loading=async`
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
        // Map initialization will be handled by the watch function
      } catch (error) {
        console.error('Failed to load tracking:', error)
        toast.error('Failed to load tracking. Please try again.')
      }
    }

    const geocodeAddress = (address) => {
      return new Promise((resolve, reject) => {
        if (!window.google || !window.google.maps) {
          reject(new Error('Google Maps API not loaded'))
          return
        }

        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            })
          } else {
            reject(new Error(`Geocoding failed: ${status}`))
          }
        })
      })
    }

    const initializeMap = async () => {
      // Wait a bit for the modal to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const mapContainer = document.getElementById('live-tracking-map')
      if (!mapContainer || !window.google) {
        console.warn('Map container or Google Maps not available')
        return
      }

      // Clear existing content
      mapContainer.innerHTML = ''

      // Initialize map with default center
      const defaultCenter = { lat: 14.5995, lng: 120.9842 } // Manila default
      map = new window.google.maps.Map(mapContainer, {
        center: defaultCenter,
        zoom: 13,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Initialize directions service and renderer
      directionsService.value = new window.google.maps.DirectionsService()
      directionsRenderer.value = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true // We'll use custom markers
      })

      const order = trackedOrder.value || selectedOrder.value
      if (!order) return

      // Get pickup and drop-off locations
      const pickupAddress = order.pickupAddress || getPickupLocation(order)
      const dropoffAddress = order.deliveryAddress || getDeliveryLocation(order)

      const bounds = new window.google.maps.LatLngBounds()
      let pickupCoords = null
      let dropoffCoords = null

      try {
        // Geocode pickup location
        if (pickupAddress) {
          try {
            pickupCoords = await geocodeAddress(pickupAddress)
            bounds.extend(pickupCoords)

            // Add pickup marker using pin_location.png image
            const createPickupPinMarker = (iconUrl, isFallback = false) => {
              pickupMarker.value = new window.google.maps.Marker({
                position: pickupCoords,
                map: map,
                title: 'Pickup Location',
                icon: {
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(50, 50),
                  anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
                }
              })
              
              // If using custom image, verify it loads
              if (!isFallback) {
                const testImage = new Image()
                testImage.onerror = () => {
                  console.warn('pin_location.png failed to load for pickup, removing marker to recreate with fallback')
                  if (pickupMarker.value) {
                    pickupMarker.value.setMap(null)
                    pickupMarker.value = null
                    createPickupPinMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 0C11.193 0 0 11.193 0 25c0 25 25 25 25 25s25 0 25-25C50 11.193 38.807 0 25 0z" fill="#10B981"/>
                        <circle cx="25" cy="25" r="8" fill="#ffffff"/>
                      </svg>
                    `), true)
                  }
                }
                testImage.src = iconUrl
              }
            }
            
            // Try to use PIN_LOCATION.png for pickup location
            createPickupPinMarker('/PIN_LOCATION.png')
          } catch (error) {
            console.error('Error geocoding pickup address:', error)
          }
        }

        // Geocode drop-off location
        if (dropoffAddress) {
          try {
            dropoffCoords = await geocodeAddress(dropoffAddress)
            bounds.extend(dropoffCoords)

            // Create marker with pin_location.png, with fallback if image doesn't load
            const createPinMarker = (iconUrl, isFallback = false) => {
              dropoffMarker.value = new window.google.maps.Marker({
                position: dropoffCoords,
                map: map,
                title: 'Drop-off Location',
                icon: {
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(50, 50),
                  anchor: new window.google.maps.Point(25, 50) // Anchor at bottom center of pin
                }
              })
              
              // If using custom image, verify it loads
              if (!isFallback) {
                const testImage = new Image()
                testImage.onerror = () => {
                  console.warn('pin_location.png failed to load, removing marker to recreate with fallback')
                  if (dropoffMarker.value) {
                    dropoffMarker.value.setMap(null)
                    dropoffMarker.value = null
                    createPinMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 0C11.193 0 0 11.193 0 25c0 25 25 25 25 25s25 0 25-25C50 11.193 38.807 0 25 0z" fill="#10B981"/>
                        <circle cx="25" cy="25" r="8" fill="#ffffff"/>
                      </svg>
                    `), true)
                  }
                }
                testImage.src = iconUrl
              }
            }
            
            // Try to use PIN_LOCATION.png first
            createPinMarker('/PIN_LOCATION.png')
          } catch (error) {
            console.error('Error geocoding drop-off address:', error)
          }
        }

        // Show route between pickup and drop-off (same route as BookService)
        if (pickupCoords && dropoffCoords && directionsService.value && directionsRenderer.value) {
          directionsService.value.route({
            origin: pickupCoords,
            destination: dropoffCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          }, (result, status) => {
            if (status === 'OK') {
              // Display the route (same as BookService)
              directionsRenderer.value.setOptions({ suppressMarkers: true })
              directionsRenderer.value.setDirections(result)
              
              // Update bounds to include route points
              if (result.routes && result.routes[0] && result.routes[0].legs) {
                result.routes[0].legs.forEach(leg => {
                  bounds.extend(leg.start_location)
                  bounds.extend(leg.end_location)
                })
              }
            } else {
              console.error('Directions request failed:', status)
            }
          })
        }

        // Fit map to show all markers
        if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
          // If bounds are the same, just center on the location
          if (pickupCoords) {
            map.setCenter(pickupCoords)
            map.setZoom(15)
          } else if (dropoffCoords) {
            map.setCenter(dropoffCoords)
            map.setZoom(15)
          }
        } else {
          map.fitBounds(bounds)
          // Add padding
          const padding = 50
          map.fitBounds(bounds, { padding })
        }
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371 // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLng = (lng2 - lng1) * Math.PI / 180
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }

    const formatDistance = (km) => {
      if (km < 1) {
        return `${Math.round(km * 1000)}m`
      }
      return `${km.toFixed(1)}km`
    }

    const formatTime = (km) => {
      // Assuming average speed of 30 km/h
      const hours = km / 30
      const minutes = Math.round(hours * 60)
      if (minutes < 60) {
        return `${minutes} min${minutes !== 1 ? 's' : ''}`
      }
      const hrs = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hrs}h ${mins}m`
    }

    const startRealTimeTracking = () => {
      // Clean up existing listener
      if (driverLocationUnsubscribe.value) {
        driverLocationUnsubscribe.value()
        driverLocationUnsubscribe.value = null
      }

      if (mapUpdateInterval) {
        clearInterval(mapUpdateInterval)
        mapUpdateInterval = null
      }

      const order = trackedOrder.value || selectedOrder.value
      if (!order || !order.driverId) {
        currentDriverLocation.value = 'No driver assigned'
        return
      }

      // Get drop-off address for distance calculation
      const dropoffAddress = order.deliveryAddress || getDeliveryLocation(order)

      // Listen to driver's real-time location from Firestore
      const driverRef = doc(db, 'drivers', order.driverId)
      
      driverLocationUnsubscribe.value = onSnapshot(driverRef, async (driverSnap) => {
        if (!driverSnap.exists()) {
          currentDriverLocation.value = 'Driver not found'
          return
        }

        const driverData = driverSnap.data()
        const driverLocation = driverData.currentLocation

        if (!driverLocation || !driverLocation.lat || !driverLocation.lng) {
          currentDriverLocation.value = 'Driver location not available'
          return
        }

        // Update driver marker position
        const driverPosition = {
          lat: driverLocation.lat,
          lng: driverLocation.lng
        }

        if (!driverMarker) {
          // Create marker with rider.png, with fallback if image doesn't load
          const createDriverMarker = (iconUrl, isFallback = false) => {
            driverMarker = new window.google.maps.Marker({
              position: driverPosition,
              map: map,
              title: trackedDriverName.value,
              icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(60, 60),
                anchor: new window.google.maps.Point(30, 30)
              },
              optimized: false
            })
            
            // If using custom image, verify it loads
            if (!isFallback) {
              const testImage = new Image()
              testImage.onerror = () => {
                console.warn('rider.png failed to load, removing marker to recreate with fallback')
                if (driverMarker) {
                  driverMarker.setMap(null)
                  driverMarker = null
                  createDriverMarker('data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="30" cy="30" r="28" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                      <text x="30" y="38" text-anchor="middle" fill="white" font-size="24" font-weight="bold">🚴</text>
                    </svg>
                  `), true)
                }
              }
              testImage.src = iconUrl
            }
          }
          
          // Try to use RIDER.png first
          createDriverMarker('/RIDER.png')
        } else {
          // Smoothly animate marker to new position for visible movement
          const startPosition = driverMarker.getPosition()
          if (!startPosition) {
            // If no position, just set it directly
            driverMarker.setPosition(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
          } else {
            const endPosition = new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng)
            
            // Calculate distance to determine animation steps
            const distance = Math.sqrt(
              Math.pow(endPosition.lat() - startPosition.lat(), 2) + 
              Math.pow(endPosition.lng() - startPosition.lng(), 2)
            )
            
            // More steps for longer distances to show smooth movement
            const steps = Math.max(15, Math.min(30, Math.ceil(distance * 1000)))
            
            let step = 0
            const animateMarker = () => {
              step++
              const progress = step / steps
              // Use easing function for smoother animation
              const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2

              const lat = startPosition.lat() + (endPosition.lat() - startPosition.lat()) * easedProgress
              const lng = startPosition.lng() + (endPosition.lng() - startPosition.lng()) * easedProgress

              driverMarker.setPosition(new window.google.maps.LatLng(lat, lng))

              if (step < steps) {
                setTimeout(animateMarker, 30) // Faster update for smoother movement
              }
            }
            animateMarker()
          }
        }

        // Update location text (try to reverse geocode)
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: driverPosition }, (results, status) => {
            if (status === 'OK' && results[0]) {
              currentDriverLocation.value = results[0].formatted_address
            } else {
              currentDriverLocation.value = `${driverPosition.lat.toFixed(6)}, ${driverPosition.lng.toFixed(6)}`
            }
          })
        } else {
          currentDriverLocation.value = `${driverPosition.lat.toFixed(6)}, ${driverPosition.lng.toFixed(6)}`
        }

        // Calculate distance and ETA to drop-off location
        if (dropoffMarker.value) {
          const dropoffPos = dropoffMarker.value.getPosition()
          const distance = calculateDistance(
            driverPosition.lat,
            driverPosition.lng,
            dropoffPos.lat(),
            dropoffPos.lng()
          )
          remainingDistance.value = formatDistance(distance)
          estimatedArrival.value = formatTime(distance)
        }

        // Pan map to follow driver movement (real-time tracking)
        if (map) {
          // Smoothly pan to driver location to show movement
          map.panTo(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
          
          // Update map bounds to include driver, pickup, and drop-off locations
          if (pickupMarker.value && dropoffMarker.value) {
            const bounds = new window.google.maps.LatLngBounds()
            
            // Add pickup location
            const pickupPos = pickupMarker.value.getPosition()
            if (pickupPos) bounds.extend(pickupPos)
            
            // Add drop-off location
            const dropoffPos = dropoffMarker.value.getPosition()
            if (dropoffPos) bounds.extend(dropoffPos)
            
            // Add driver location
            bounds.extend(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
            
            // Fit bounds to show all locations (with padding) - but don't force it, let panTo handle movement
            // Only fit bounds if driver is far from viewport
            const mapCenter = map.getCenter()
            if (mapCenter) {
              const distanceFromCenter = Math.sqrt(
                Math.pow(driverPosition.lat - mapCenter.lat(), 2) + 
                Math.pow(driverPosition.lng - mapCenter.lng(), 2)
              )
              
              // If driver is far from center, fit bounds to show everything
              if (distanceFromCenter > 0.01) {
                map.fitBounds(bounds, { padding: 100 })
              }
            }
          } else {
            // If markers not available, just pan to driver
            map.panTo(new window.google.maps.LatLng(driverPosition.lat, driverPosition.lng))
          }
        }
      }, (error) => {
        console.error('Error listening to driver location:', error)
        currentDriverLocation.value = 'Error loading driver location'
      })
    }

    const refreshDriverLocation = () => {
      // Restart tracking to get latest location
      startRealTimeTracking()
      showNotification('success', 'Driver location refreshed')
    }

    const closeTrackingModal = () => {
      showTrackingModal.value = false
      selectedOrder.value = null
      trackingCurrentPage.value = 0

      // Clean up intervals and listeners
      if (mapUpdateInterval) {
        clearInterval(mapUpdateInterval)
        mapUpdateInterval = null
      }
      if (locationUpdateInterval.value) {
        clearInterval(locationUpdateInterval.value)
        locationUpdateInterval.value = null
      }
      if (driverLocationUnsubscribe.value) {
        driverLocationUnsubscribe.value()
        driverLocationUnsubscribe.value = null
      }

      // Reset map variables
      map = null
      driverMarker = null
      destinationMarker = null
      pickupMarker.value = null
      dropoffMarker.value = null
      directionsService.value = null
      directionsRenderer.value = null
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
          showNotification('error', 'Selected driver not found')
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
          message: `You have a new order/booking assigned. Please check your My Assignment page. Order #${selectedOrder.value.id}`,
          type: 'order_assignment',
          recipientType: 'driver',
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
            recipientType: 'user',
            orderId: selectedOrder.value.id,
            driverName: driverName,
            driverPhone: selectedDriver.phone
          })
        }

        showNotification('success', `Driver ${driverName} assigned successfully!`)
        closeAssignModal()

      } catch (err) {
        console.error('Error assigning driver:', err)
        showNotification('error', 'Failed to assign driver. Please try again.')
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
        // Filter only online drivers for bulk assignment
        const availableDriversForBulk = availableDrivers.value.filter(driver => driver.isOnline)

        if (!availableDriversForBulk.length) {
          toast.warning('No online drivers available for bulk assignment')
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
              message: `You have a new order/booking assigned. Please check your My Assignment page. Order #${order.id}`,
              type: 'order_assignment',
              recipientType: 'driver',
              orderId: order.id
            });
          } catch (err) {
            console.error(`Error during bulk assignment for order ${order.id}:`, err);
          }
        }));

        showNotification('success', `Successfully assigned ${assignedCount} orders to drivers!`)
        closeBulkAssignModal()

      } catch (err) {
        console.error('Error performing bulk assignment:', err)
        showNotification('error', 'Failed to perform bulk assignment. Please try again.')
      } finally {
        bulkAssigning.value = false;
      }
    };


    // CHANGE: Added auto-assignment functionality
    const performAutoAssignment = async () => {
      try {
        autoAssigning.value = true

        if (!unassignedOrders.value.length) {
          showNotification('warning', 'No unassigned orders to process')
          return
        }

        await fetchAvailableDrivers()
        const onlineDrivers = availableDrivers.value.filter(driver => driver.isOnline)

        if (!onlineDrivers.length) {
          showNotification('warning', 'No online drivers available for auto-assignment')
          return
        }

        let assignedCount = 0
        let driverIndex = 0 // Round-robin index for rotating assignment

        for (const order of unassignedOrders.value) {
          if (onlineDrivers.length === 0) break

          // Round-robin assignment: cycle through online drivers evenly
          const selectedDriver = onlineDrivers[driverIndex % onlineDrivers.length]
          driverIndex++

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
              message: `You have a new order/booking assigned. Please check your My Assignment page. Order #${order.id}`,
              type: 'order_assignment',
              recipientType: 'driver',
              orderId: order.id
            })

            assignedCount++

          } catch (err) {
            console.error(`Error auto-assigning order ${order.id}:`, err)
          }
        }

        if (assignedCount > 0) {
          showNotification('success', `Successfully auto-assigned ${assignedCount} orders to drivers!`)
        } else {
          showNotification('warning', 'No orders could be auto-assigned')
        }

      } catch (err) {
        console.error('Error during auto-assignment:', err)
        showNotification('error', 'Error during auto-assignment. Please try again.')
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
      if (!serviceType) return 'N/A'
      const serviceMap = {
        'grocery': 'Grocery Delivery',
        'grocery-shopping': 'Grocery Shopping',
        'food': 'Food Delivery',
        'food-delivery': 'Food Delivery',
        'package': 'Package Delivery',
        'pickup-drop': 'Pick-up & Drop',
        'medicine': 'Medicine Delivery',
        'medicine-delivery': 'Medicine Delivery',
        'bill-payments': 'Bill Payments',
        'gift-delivery': 'Gift Delivery'
      }
      return serviceMap[serviceType] || serviceType || 'N/A'
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
    // Order Details Modal Pagination
    const orderDetailsCurrentPage = ref(0)
    
    const orderDetailsSections = computed(() => {
      if (!selectedOrderForDetails.value) return []
      const sections = []
      
      // Order Summary - always show
      sections.push({ id: 'summary', title: 'Order Summary' })
      
      // Customer Information - always show
      sections.push({ id: 'customer', title: 'Customer Information' })
      
      // Service Information - always show
      sections.push({ id: 'service', title: 'Service Information' })
      
      // Location Information - conditional
      if (selectedOrderForDetails.value.pickupAddress || getPickupLocation(selectedOrderForDetails.value) || selectedOrderForDetails.value.deliveryAddress || getDeliveryLocation(selectedOrderForDetails.value)) {
        sections.push({ id: 'location', title: 'Location Information' })
      }
      
      // Driver Information - conditional
      if (selectedOrderForDetails.value.driverName || selectedOrderForDetails.value.driverId) {
        sections.push({ id: 'driver', title: 'Driver Information' })
      }
      
      // Booking Details - conditional
      if (selectedOrderForDetails.value.formData) {
        sections.push({ id: 'booking', title: 'Booking Details' })
      }
      
      // Price Breakdown - conditional
      if (selectedOrderForDetails.value.pricing) {
        sections.push({ id: 'pricing', title: 'Price Breakdown' })
      }
      
      // Proof of Delivery - conditional
      if (selectedOrderForDetails.value.proofOfDelivery?.url) {
        sections.push({ id: 'proof', title: 'Proof of Delivery' })
      }
      
      return sections
    })
    
    const nextOrderDetailsPage = () => {
      if (orderDetailsCurrentPage.value < orderDetailsSections.value.length - 1) {
        orderDetailsCurrentPage.value++
      }
    }
    
    const previousOrderDetailsPage = () => {
      if (orderDetailsCurrentPage.value > 0) {
        orderDetailsCurrentPage.value--
      }
    }
    
    const goToOrderDetailsPage = (index) => {
      if (index >= 0 && index < orderDetailsSections.value.length) {
        orderDetailsCurrentPage.value = index
      }
    }
    
    const closeOrderDetailsModal = () => {
      showOrderDetailsModal.value = false
      selectedOrderForDetails.value = null
      orderDetailsCurrentPage.value = 0
    }
    
    const viewOrder = (order) => {
      selectedOrderForDetails.value = order
      orderDetailsCurrentPage.value = 0
      showOrderDetailsModal.value = true
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

      const statusOrder = ['confirmed', 'driver_assigned', 'in_transit', 'delivered']
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

    // CHANGE: Added new computed method to calculate total with driver's items total
    const calculateTotalWithItems = (order) => {
      if (!order) return 'TBD'
      
      // CHANGE: Use the exact totalAmount from Firestore (saved from Set Items Total in MyAssignments)
      // This is the NEW TOTAL that includes all charges (base + distance + weather + items + GCash fee if applicable)
      if (order.totalAmount) {
        return parseFloat(order.totalAmount).toFixed(2)
      }
      
      // Fallback calculation if totalAmount is missing
      const baseTotal = order.priceEstimate?.total || order.pricing?.total || 0
      const itemsTotal = order.pricing?.itemsTotal || 0
      const gcashFee = order.pricing?.gcashFee || 0
      
      return (baseTotal + itemsTotal + gcashFee).toFixed(2)
    }

    // CHANGE: Implement opening proof of delivery image in a modal or new tab
    const openProofPreview = (url) => {
      window.open(url, '_blank') // Open in new tab
      // Alternatively, implement a modal for preview
    }

    // Check for orderId in route query and open order details
    const checkRouteOrderId = () => {
      const orderId = route.query.orderId
      if (orderId && orders.value.length > 0) {
        nextTick(() => {
          const order = orders.value.find(o => o.id === orderId)
          if (order) {
            viewOrder(order)
          }
        })
      }
    }

    // Watch for orders to load, then check route
    watch(orders, () => {
      if (orders.value.length > 0) {
        checkRouteOrderId()
      }
    }, { immediate: false })

    onMounted(() => {
      fetchOrders()
      setupRealtimeDriverListeners()
      
      // Preload Google Maps API
      initializeGoogleMaps().catch(error => {
        console.error('[v0] Failed to preload Google Maps API:', error)
      })
      
      // Check route after a delay to allow orders to load
      setTimeout(() => {
        checkRouteOrderId()
      }, 1000)
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
        // Wait for modal to be fully rendered
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))
        await initializeMap()
        // Start real-time tracking after map is initialized
        startRealTimeTracking()
      } else {
        // Clean up when modal closes
        if (mapUpdateInterval) {
          clearInterval(mapUpdateInterval)
          mapUpdateInterval = null
        }
        if (driverLocationUnsubscribe.value) {
          driverLocationUnsubscribe.value()
          driverLocationUnsubscribe.value = null
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

    // CHANGE: Implementing PDF export functionality with user information
    const exportOrders = async () => {
      exportingOrders.value = true
      try {
        console.log('[Export] Starting export process...')
        
        // Get all filtered orders (without pagination)
        let filtered = orders.value
        console.log('[Export] Total orders:', filtered.length)

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
          showNotification('error', 'No orders to export')
          exportingOrders.value = false
          return
        }

        console.log('[Export] Filtered orders:', filtered.length)

        // Fetch user information for all orders
        const userIds = [...new Set(filtered.map(o => o.userId).filter(Boolean))]
        const usersMap = {}
        
        console.log('[Export] Fetching user data for', userIds.length, 'users')
        await Promise.all(userIds.map(async (userId) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId))
            if (userDoc.exists()) {
              usersMap[userId] = userDoc.data()
            }
          } catch (error) {
            console.error(`[Export] Error fetching user ${userId}:`, error)
          }
        }))

        console.log('[Export] User data loaded:', Object.keys(usersMap).length)

        // Helper function to format dates
        const formatDate = (timestamp) => {
          if (!timestamp) return 'N/A'
          try {
            if (timestamp.toDate) {
              return timestamp.toDate().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
            return new Date(timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          } catch (e) {
            return 'Invalid date'
          }
        }

        // Create PDF
        console.log('[Export] Creating PDF document...')
        const pdfDoc = new jsPDF('landscape', 'mm', 'a4')
        
        // Landscape A4 dimensions: 297mm x 210mm
        // With margins, available width is approximately 280mm
        
        // Add title
        pdfDoc.setFontSize(16)
        pdfDoc.text('Orders Export Report', 10, 12)
        
        // Add export date
        pdfDoc.setFontSize(9)
        pdfDoc.setTextColor(100, 100, 100)
        pdfDoc.text(`Exported on: ${new Date().toLocaleString('en-US')}`, 10, 18)
        pdfDoc.text(`Total Orders: ${filtered.length}`, 10, 23)
        
        // Reset text color
        pdfDoc.setTextColor(0, 0, 0)
        
        // Prepare table data
        console.log('[Export] Preparing table data...')
        const tableData = filtered.map((order) => {
          try {
            const userData = order.userId && usersMap[order.userId] ? usersMap[order.userId] : null
            
            // Safely get values with fallbacks
            const customerName = order.customerName || (userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown' : 'Unknown')
            const customerPhone = order.customerPhone || userData?.phone || userData?.contact || 'N/A'
            const customerEmail = order.customerEmail || userData?.email || 'N/A'
            const userName = userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'N/A' : 'N/A'
            const userEmail = userData?.email || 'N/A'
            const userPhone = userData?.phone || userData?.contact || 'N/A'
            const userAddress = userData?.address || userData?.barangay || 'N/A'
            const serviceType = formatServiceType(order.serviceType || order.serviceId) || 'N/A'
            const status = order.status || 'pending'
            const driverName = order.driverName || getDriverNameById(order.driverId) || 'Not assigned'
            const driverPhone = order.driverPhone || getDriverPhoneById(order.driverId) || 'N/A'
            const pickupAddr = order.pickupAddress || getPickupLocation(order) || 'N/A'
            const deliveryAddr = order.deliveryAddress || getDeliveryLocation(order) || 'N/A'
            const totalAmount = `₱${order.totalAmount || order.priceEstimate?.total || order.pricing?.total || 'TBD'}`
            
            return [
              String(order.id || 'N/A'),
              String(customerName),
              String(customerPhone),
              String(customerEmail),
              String(userName),
              String(userEmail),
              String(userPhone),
              String(userAddress),
              String(serviceType),
              String(status),
              String(driverName),
              String(driverPhone),
              String(pickupAddr),
              String(deliveryAddr),
              String(totalAmount),
              formatDate(order.createdAt),
              formatDate(order.driverAssignedAt)
            ]
          } catch (e) {
            console.error(`[Export] Error processing order ${order?.id || 'unknown'}:`, e)
            // Return a row with error indicators
            return [
              String(order?.id || 'N/A'),
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error',
              'Error'
            ]
          }
        })

        console.log('[Export] Table data prepared:', tableData.length, 'rows')

        // Add table using autoTable (plugin applied via applyPlugin)
        console.log('[Export] Adding table to PDF...')
        
        const tableOptions = {
          startY: 28,
          head: [[
            'Order ID',
            'Customer',
            'Cust Phone',
            'Cust Email',
            'User',
            'User Email',
            'User Phone',
            'User Addr',
            'Service',
            'Status',
            'Driver',
            'Drv Phone',
            'Pickup',
            'Delivery',
            'Amount',
            'Order Date',
            'Assigned'
          ]],
          body: tableData,
          styles: { 
            fontSize: 5.5, 
            cellPadding: 1,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          headStyles: { 
            fillColor: [34, 197, 94], 
            textColor: 255, 
            fontStyle: 'bold',
            fontSize: 6
          },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 28, left: 10, right: 10 },
          // Landscape A4: 297mm width, with 10mm margins = 277mm available
          // Distribute width proportionally across 17 columns
          // Average: 277/17 = ~16.3mm per column, but we'll adjust for content
          tableWidth: 277,
          columnStyles: {
            0: { cellWidth: 14, fontSize: 5, overflow: 'linebreak' }, // Order ID
            1: { cellWidth: 16, fontSize: 5, overflow: 'linebreak' }, // Customer Name
            2: { cellWidth: 14, fontSize: 5, overflow: 'linebreak' }, // Customer Phone
            3: { cellWidth: 18, fontSize: 5, overflow: 'linebreak' }, // Customer Email
            4: { cellWidth: 16, fontSize: 5, overflow: 'linebreak' }, // User Name
            5: { cellWidth: 18, fontSize: 5, overflow: 'linebreak' }, // User Email
            6: { cellWidth: 14, fontSize: 5, overflow: 'linebreak' }, // User Phone
            7: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // User Address
            8: { cellWidth: 15, fontSize: 5, overflow: 'linebreak' }, // Service Type
            9: { cellWidth: 12, fontSize: 5, overflow: 'linebreak' }, // Status
            10: { cellWidth: 16, fontSize: 5, overflow: 'linebreak' }, // Driver Name
            11: { cellWidth: 14, fontSize: 5, overflow: 'linebreak' }, // Driver Phone
            12: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Pickup Address
            13: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Delivery Address
            14: { cellWidth: 15, fontSize: 5, overflow: 'linebreak' }, // Total Amount
            15: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }, // Order Date
            16: { cellWidth: 20, fontSize: 5, overflow: 'linebreak' }  // Assigned Date
          },
          // Enable horizontal page breaks if needed
          showHead: 'everyPage',
          showFoot: 'everyPage'
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
        const fileName = `orders_export_${new Date().toISOString().split('T')[0]}.pdf`
        pdfDoc.save(fileName)

        console.log('[Export] Export completed successfully')
        showNotification('success', `Successfully exported ${filtered.length} orders as PDF`)
      } catch (err) {
        console.error('[Export] Error exporting orders:', err)
        console.error('[Export] Error details:', err.message, err.stack)
        showNotification('error', `Failed to export orders: ${err.message || 'Please try again.'}`)
      } finally {
        exportingOrders.value = false
      }
    }

    const showNotification = (type, message) => {
      notificationType.value = type
      notificationMessage.value = message
      showNotificationModal.value = true
    }

    const closeNotificationModal = () => {
      showNotificationModal.value = false
      notificationMessage.value = ''
    }

    // ** END OF SETUP FUNCTION **
    return {
      // Refs and computed properties
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
      filteredOrders, // Computed: currently paginated orders
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
      orderDetailsCurrentPage,
      orderDetailsSections,
      showTrackingModal,
      trackedOrder,
      trackedDriverName,
      trackedDriverPhone,
      currentDriverLocation,
      estimatedArrival,
      remainingDistance,
      trackingSteps,
      trackingCurrentPage,
      trackingSections,
      showOrderProgressModal,
      selectedOrderForProgress,
      exportingOrders,
      showNotificationModal,
      notificationType,
      notificationMessage,

      // Methods
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
      isDriverCurrentlyScheduled,
      getSchedulePriority,
      getFormattedSchedule,
      showNotification,
      closeNotificationModal,
      trackDriver, // Keep trackDriver for map tracking functionality
      closeOrderDetailsModal,
      nextOrderDetailsPage,
      previousOrderDetailsPage,
      goToOrderDetailsPage,
      formatOrderDate,
      closeTrackingModal,
      startRealTimeTracking,
      refreshDriverLocation,
      getTrackingStepClass,
      nextTrackingPage,
      previousTrackingPage,
      goToTrackingPage,
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
      exportOrders,
      calculateTotalWithItems,
      // New methods for Order Details Modal
      openProofPreview,
      // Expose methods from data() in the original setup function if needed
      // e.g., if you had methods defined in data() earlier.
      // For this specific merge, most logic is in setup.
    }
  }
}
</script>

