<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Green Banner Header -->
    <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Manage Remittances</h1>
          <p class="text-white/90 text-sm sm:text-base">View and manage driver remittance submissions, approve or reject payments with ease</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>

    <!-- Stats Cards -->
    <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Total Remittances</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ getFilteredRemittances().length }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 48 48" class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8 30.7V5.5h32v25.2M24 42.5L8 30.7m16 11.8l16-11.8m0 0L24 18.9M40 6.5L30 14m-10 1.35l-4.687 3.516M20 15.35l2.813-2.11" stroke-width="1.9"/>
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M22.813 13.24c2.812-2.109 5.312-1.74 7.187.76M8 6.5l12 8.85m4 3.55l-5.921 4.332m-2.767-4.366c-2.96 2.166-.194 6.532 2.766 4.366M20 33.65l4.688 3.516M16 36.6l5.921 4.332m2.767-3.767c2.96 2.166.194 5.932-2.766 3.766M24 30.7l4.688 3.516M20 33.65l5.921 4.332m2.767-3.767c2.96 2.166.194 5.932-2.766 3.766M28 27.75l4.688 3.516M24 30.7l5.921 4.332m2.767-3.767c2.96 2.166.194 5.932-2.766 3.766M32 24.8l4.688 3.516M28 27.75l5.921 4.332m2.767-3.767c2.96 2.166.194 5.932-2.766 3.766" stroke-width="1.9"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Pending Review</p>
            <p class="text-xl sm:text-2xl font-bold text-[#74E600]">{{ getFilteredRemittances().filter(r => r.status === 'pending').length }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#74E600]/20 to-[#3ED400]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6 text-[#74E600]">
              <path fill="currentColor" d="M6 14h3.075l4.975-5q.225-.225.338-.513t.112-.562t-.112-.537t-.313-.488l-.925-.95q-.225-.225-.5-.337t-.575-.113q-.275 0-.55.113t-.5.337L6 10.925zm6.05-5.1l-.95-.925l.975-.975l.925.95zM11.2 14H18v-2h-4.8zM2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Approved</p>
            <p class="text-xl sm:text-2xl font-bold text-[#3ED400]">{{ getFilteredRemittances().filter(r => r.status === 'approved').length }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#3ED400]/20 to-[#00C851]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" class="w-5 h-5 sm:w-6 sm:h-6 text-[#3ED400]">
              <path fill="currentColor" fill-rule="evenodd" d="M10.586 2.1a2 2 0 0 1 2.7-.116l.128.117L15.314 4H18a2 2 0 0 1 1.994 1.85L20 6v2.686l1.9 1.9a2 2 0 0 1 .116 2.701l-.117.127l-1.9 1.9V18a2 2 0 0 1-1.85 1.995L18 20h-2.685l-1.9 1.9a2 2 0 0 1-2.701.116l-.127-.116l-1.9-1.9H6a2 2 0 0 1-1.995-1.85L4 18v-2.686l-1.9-1.9a2 2 0 0 1-.116-2.701l.116-.127l1.9-1.9V6a2 2 0 0 1 1.85-1.994L6 4h2.686z" class="duoicon-secondary-layer" opacity="0.3"/>
              <path fill="currentColor" fill-rule="evenodd" d="m15.079 8.983l-4.244 4.244l-1.768-1.768a1 1 0 1 0-1.414 1.415l2.404 2.404a1.1 1.1 0 0 0 1.556 0l4.88-4.881a1 1 0 0 0-1.414-1.414" class="duoicon-primary-layer"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Rejected</p>
            <p class="text-xl sm:text-2xl font-bold text-[#00C851]">{{ getFilteredRemittances().filter(r => r.status === 'rejected').length }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#00C851]/20 to-[#3ED400]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 20 20" class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]">
              <path fill="currentColor" d="M18 5.75a.75.75 0 0 0-.75-.75H2.75a.75.75 0 1 0 0 1.5h14.5a.75.75 0 0 0 .75-.75m0 3a.75.75 0 0 0-.75-.75H2.75a.75.75 0 1 0 0 1.5h9.456A5.5 5.5 0 0 1 14.5 9a5.5 5.5 0 0 1 2.294.5h.456a.75.75 0 0 0 .75-.75M9.09 15.5H2.75a.75.75 0 0 1 0-1.5h6.272a5.6 5.6 0 0 0 .069 1.5m.285-3H2.75a.75.75 0 0 1 0-1.5h7.507a5.5 5.5 0 0 0-.882 1.5m9.625 2a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4.5.707l1.146 1.147a.5.5 0 0 0 .708-.708L15.207 14.5l1.147-1.146a.5.5 0 0 0-.708-.708L14.5 13.793l-1.146-1.147a.5.5 0 0 0-.708.708l1.147 1.146l-1.147 1.146a.5.5 0 0 0 .708.708z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div v-if="!loading" class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by driver name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select v-model="methodFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
            <option value="">All Methods</option>
            <option value="gcash">GCash</option>
            <option value="paymaya">PayMaya</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="direct_cash">Direct Cash</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Remittances Table -->
    <div v-if="!loading" class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Remittances List</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10">
            <tr>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Driver</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Driver Share</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Admin Share</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Payment Method</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Receipt</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="getPaginatedRemittances().length === 0">
              <td colspan="9" class="px-4 sm:px-6 py-8 text-center text-gray-500">
                {{ searchQuery || statusFilter || methodFilter ? 'No remittances match your filters' : 'No remittances found' }}
              </td>
            </tr>
            <tr v-for="remittance in getPaginatedRemittances()" :key="remittance.id" class="hover:bg-[#00C851]/5 transition-colors duration-200">
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-[#00C851] to-[#3ED400]">
                    <span class="text-white text-sm font-medium">{{ remittance.driverName ? remittance.driverName.charAt(0).toUpperCase() : 'D' }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ remittance.driverName }}</div>
                  </div>
                </div>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₱{{ remittance.amount.toFixed(2) }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                ₱{{ remittance.driverShare.toFixed(2) }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium text-[#00C851]">
                ₱{{ remittance.adminShare.toFixed(2) }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatPaymentMethod(remittance.paymentMethod) }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm">
                <button 
                  v-if="remittance.proofUrl || remittance.receiptUrl"
                  @click="viewReceipt(remittance)"
                  class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#00C851] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200"
                >
                  View Proof
                </button>
                <span v-else class="text-gray-400 text-xs">No proof</span>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(remittance.date) }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full',
                  remittance.status === 'approved' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                  remittance.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  'bg-red-100 text-red-800 border border-red-200'
                ]">
                  {{ remittance.status.charAt(0).toUpperCase() + remittance.status.slice(1) }}
                </span>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-if="remittance.status === 'pending'"
                    @click="approveRemittance(remittance)"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#74E600] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200"
                  >
                    Approve
                  </button>
                  <button 
                    v-if="remittance.status === 'pending'"
                    @click="rejectRemittance(remittance)"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <!-- Pagination Controls -->
      <div v-if="getTotalPages() > 1" class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center">
          <span class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, getFilteredRemittances().length) }} of {{ getFilteredRemittances().length }} remittances
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
              v-for="page in getTotalPages()"
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
            :disabled="currentPage === getTotalPages()"
            :class="[
              'px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              currentPage === getTotalPages()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-[#00C851]'
            ]"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Proof of Payment Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-1.5 sm:p-2" @click.self="showReceiptModal = false">
      <div class="relative mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[98vh] flex flex-col" @click.stop>
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] p-2 sm:p-3 rounded-t-2xl flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <div class="p-1 bg-white/20 backdrop-blur-sm rounded">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-bold text-white">Payment Receipt</h3>
                <p class="text-xs text-white/90 hidden sm:block">View payment proof and details</p>
              </div>
            </div>
            <button @click="showReceiptModal = false" class="text-white/90 hover:text-white hover:bg-white/20 rounded p-0.5 transition-all duration-200">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Modal Content -->
        <div class="p-2 sm:p-3 overflow-y-auto flex-1">
          <div v-if="selectedReceipt" class="space-y-4">
            <!-- Remittance Info -->
            <div class="bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Remittance Information</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-xs">
                <div>
                  <p class="text-gray-600 mb-0.5">Driver Name</p>
                  <p class="font-medium text-gray-900">{{ selectedReceipt.driverName }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Amount</p>
                  <p class="font-medium text-gray-900">₱{{ selectedReceipt.amount.toFixed(2) }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Payment Method</p>
                  <p class="font-medium text-gray-900">{{ formatPaymentMethod(selectedReceipt.paymentMethod) }}</p>
                </div>
                <div>
                  <p class="text-gray-600 mb-0.5">Date</p>
                  <p class="font-medium text-gray-900">{{ formatDate(selectedReceipt.date) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Receipt/Proof Display -->
            <div class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Payment Proof</h4>
              
              <div v-if="selectedReceipt.isPDF || (selectedReceipt.proofUrl && selectedReceipt.proofUrl.includes('.pdf')) || (selectedReceipt.receiptUrl && selectedReceipt.receiptUrl.includes('.pdf'))" 
                   class="flex items-center justify-center h-48 sm:h-64 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div class="text-center">
                  <svg class="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
                  </svg>
                  <p class="text-gray-600 mb-2 font-bold text-xs sm:text-sm">PDF Document</p>
                  <a :href="selectedReceipt.proofUrl || selectedReceipt.receiptUrl" 
                     target="_blank" 
                     class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#00C851] text-white rounded-lg hover:bg-[#3ED400] transition-all font-bold shadow-sm text-xs sm:text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download PDF
                  </a>
                </div>
              </div>
              <img v-else 
                   :src="selectedReceipt.proofUrl || selectedReceipt.receiptUrl" 
                   :alt="`Proof of payment from ${selectedReceipt.driverName}`" 
                   class="w-full h-auto rounded-xl border-2 border-gray-200 shadow-lg">
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="flex flex-col sm:flex-row justify-end gap-1.5 sm:gap-2 p-2 sm:p-3 border-t border-gray-200 flex-shrink-0">
          <button
            @click="showReceiptModal = false"
            class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Approval/Rejection Notification Modal -->
    <div v-if="showNotificationModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-1.5 sm:p-2" @click.self="closeNotificationModal">
      <div class="relative mx-auto w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200" @click.stop>
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-center mb-4 sm:mb-6">
            <div :class="[
              'w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg',
              notificationType === 'approved' ? 'bg-green-100' : 'bg-red-100'
            ]">
              <svg v-if="notificationType === 'approved'" class="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h3 :class="[
            'text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-3',
            notificationType === 'approved' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ notificationType === 'approved' ? 'Remittance Approved' : 'Remittance Rejected' }}
          </h3>
          <p class="text-gray-600 text-center mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
            {{ notificationMessage }}
          </p>
          <button 
            @click="closeNotificationModal"
            :class="[
              'w-full py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base',
              notificationType === 'approved' 
                ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white hover:from-[#3ED400] hover:to-[#74E600]' 
                : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
            ]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { collection, query, getDocs, doc, updateDoc, setDoc, orderBy, limit, onSnapshot, where, getDoc, serverTimestamp } from 'firebase/firestore'
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
      notificationMessage: '',
      // Pagination
      currentPage: 1,
      itemsPerPage: 5
    }
  },
  watch: {
    statusFilter() {
      this.currentPage = 1
    },
    methodFilter() {
      this.currentPage = 1
    },
    searchQuery() {
      this.currentPage = 1
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
    async setupRemittancesListener() {
      try {
        if (this.unsubscribe) {
          this.unsubscribe()
        }

        // First, try to get remittances with getDocs to check if collection exists and has data
        try {
          const remittancesRef = collection(db, 'remittances')
          const initialSnapshot = await getDocs(query(remittancesRef, limit(1)))
          console.log('[v0] Remittances collection check:', initialSnapshot.size, 'documents found')
        } catch (error) {
          console.error('[v0] Error checking remittances collection:', error)
          // Continue anyway, might be permission issue but listener might still work
        }

        // Query without orderBy to avoid index requirement, then sort manually
        const remittancesQuery = query(
          collection(db, 'remittances'),
          limit(100)
        )
        
        this.unsubscribe = onSnapshot(
          remittancesQuery, 
          (snapshot) => {
            try {
              if (snapshot.empty) {
                console.log('[v0] No remittances found in collection')
                this.remittances = []
                this.loading = false
                return
              }

              this.remittances = snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                  id: doc.id,
                  ...data
                }
              })
              
              // Sort by date descending manually
              this.remittances.sort((a, b) => {
                const dateA = a.date?.toDate ? a.date.toDate() : (a.date ? new Date(a.date) : (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0)))
                const dateB = b.date?.toDate ? b.date.toDate() : (b.date ? new Date(b.date) : (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0)))
                return dateB - dateA
              })
              
              console.log('[v0] Remittances loaded successfully:', this.remittances.length)
              this.loading = false
            } catch (error) {
              console.error('[v0] Error processing remittances snapshot:', error)
              this.toast.error('Error processing remittances data')
              this.loading = false
            }
          }, 
          (error) => {
            console.error('[v0] Error with remittances listener:', error)
            console.error('[v0] Error code:', error.code)
            console.error('[v0] Error message:', error.message)
            
            // Provide more specific error messages
            let errorMessage = 'Error loading remittances'
            if (error.code === 'permission-denied') {
              errorMessage = 'Permission denied. Please check Firestore security rules for remittances collection.'
            } else if (error.code === 'unavailable') {
              errorMessage = 'Firestore service is temporarily unavailable. Please try again later.'
            } else if (error.message && error.message.includes('index')) {
              errorMessage = 'Database index required. Please check Firestore console for index creation link.'
            }
            
            this.toast.error(errorMessage)
            this.loading = false
          }
        )
      } catch (error) {
        console.error('[v0] Error setting up listener:', error)
        console.error('[v0] Error details:', error.code, error.message)
        this.toast.error('Error setting up remittances listener: ' + (error.message || 'Unknown error'))
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
    
    getPaginatedRemittances() {
      const filtered = this.getFilteredRemittances()
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },
    
    getTotalPages() {
      return Math.ceil(this.getFilteredRemittances().length / this.itemsPerPage)
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page
      }
    },
    
    nextPage() {
      if (this.currentPage < this.getTotalPages()) {
        this.currentPage++
      }
    },
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
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
        // Get driver's share rates from profile or remittance data
        const driverRef = doc(db, 'drivers', remittance.driverId)
        const driverDoc = await getDoc(driverRef)
        const driverShareRate = driverDoc.exists() 
          ? (driverDoc.data().driverShareRate || (remittance.driverShareRate || 0.80))
          : (remittance.driverShareRate || 0.80)
        const adminShareRate = driverDoc.exists()
          ? (driverDoc.data().adminShareRate || (remittance.adminShareRate || 0.20))
          : (remittance.adminShareRate || 0.20)
        
        // Admin share = 20% of amount; driver share = amount - admin share (e.g. 1450 - 290 = 1160)
        const exactAdminShare = remittance.adminShare || (remittance.amount * adminShareRate)
        const exactDriverShare = remittance.driverShare ?? (remittance.amount - exactAdminShare)
        
        // Update remittance status to approved with exact amounts
        await updateDoc(doc(db, 'remittances', remittance.id), {
          status: 'approved',
          approvedAt: serverTimestamp(), // Use serverTimestamp for consistency
          driverShareRate: driverShareRate, // Store rates for reference
          adminShareRate: adminShareRate,
          adminShare: exactAdminShare, // Store exact admin share amount
          driverShare: exactDriverShare // Store exact driver share amount
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
            
            // Only count remittances approved today — driver share = amount - admin share (e.g. 1450 - 290 = 1160)
            if (approvalDateString === today) {
              const amt = data.amount || 0
              const adminShare = data.adminShare != null ? Number(data.adminShare) : (amt * (data.adminShareRate || 0.20))
              const driverShare = data.driverShare != null && data.driverShare !== undefined
                ? Number(data.driverShare) || 0
                : (amt - adminShare)
              totalApprovedToday += driverShare
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
            
            const driverSharePercent = Math.round(driverShareRate * 100)
            console.log('[v0] Driver earnings updated after approval:', {
              driverId: remittance.driverId,
              driverName: remittance.driverName,
              totalDriverShareToday: totalApprovedToday,
              driverShareRate: driverShareRate,
              driverSharePercent: driverSharePercent,
              today
            })
          } else {
            // Create driver document if it doesn't exist
            await setDoc(driverRef, {
              totalEarningsToday: totalApprovedToday,
              lastRemitDate: today,
              hasRemitted: true,
              isOnline: false,
              driverShareRate: driverShareRate,
              adminShareRate: adminShareRate
            })
          }
        } catch (error) {
          console.error('[v0] Error updating driver earnings after approval:', error)
          // Don't fail the approval if earnings update fails
        }
        
        // Show notification modal
        const driverSharePercent = Math.round(driverShareRate * 100)
        const actualDriverShare = remittance.driverShare ?? (remittance.amount - (remittance.adminShare || remittance.amount * adminShareRate))
        this.notificationType = 'approved'
        this.notificationMessage = `Remittance of ₱${remittance.amount.toFixed(2)} from ${remittance.driverName} has been approved successfully. Driver's ${driverSharePercent}% share (₱${actualDriverShare.toFixed(2)}) has been credited to their account.`
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

