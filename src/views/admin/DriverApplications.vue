<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Green Banner Header -->
    <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Rider Application</h1>
          <p class="text-white/90 text-sm sm:text-base">Review and manage driver applications</p>
        </div>
        <div class="flex gap-2 sm:gap-3 flex-wrap">
          <button 
            @click="fetchApplications"
            :disabled="loading"
            class="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base border border-white/30"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Total Applications</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ applicationStats.total }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#00C851]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 3v2h22V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2m3 1a.987.987 0 0 1-.993-.992A1 1 0 0 1 4 2a1.013 1.013 0 0 1 1.006 1.008A1 1 0 0 1 4 4m3 0a1 1 0 1 1 1-1a1.004 1.004 0 0 1-1 1M1 6v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6Zm20 14H3V8h18Z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Pending Review</p>
            <p class="text-xl sm:text-2xl font-bold text-[#3ED400]">{{ applicationStats.pending }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#3ED400]/20 to-[#00C851]/20 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3ED400]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 13.5q.625 0 1.063-.437T8.5 12t-.437-1.062T7 10.5t-1.062.438T5.5 12t.438 1.063T7 13.5m5 0q.625 0 1.063-.437T13.5 12t-.437-1.062T12 10.5t-1.062.438T10.5 12t.438 1.063T12 13.5m5 0q.625 0 1.063-.437T18.5 12t-.437-1.062T17 10.5t-1.062.438T15.5 12t.438 1.063T17 13.5M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Approved</p>
            <p class="text-xl sm:text-2xl font-bold text-[#74E600]">{{ applicationStats.approved }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-[#74E600]/20 to-[#3ED400]/20 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#74E600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-600 mb-1">Rejected</p>
            <p class="text-xl sm:text-2xl font-bold text-red-600">{{ applicationStats.rejected }}</p>
          </div>
          <div class="p-2 sm:p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-lg">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <select v-model="experienceFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200">
            <option value="">All Experience</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Driver Applications</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10">
            <tr>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Applicant</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Motorcycle Info</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Experience</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Applied</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th class="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading && applications.length === 0">
              <td colspan="7" class="px-4 sm:px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C851]"></div>
                  <span>Loading applications...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredApplications.length === 0">
              <td colspan="7" class="px-4 sm:px-6 py-8 text-center text-gray-500">
                No applications found
              </td>
            </tr>
            <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-[#00C851]/5 transition-colors duration-200">
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-[#00C851] to-[#3ED400]">
                    <span class="text-white text-sm font-medium">{{ application.initials }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ application.name }}</div>
                    <div class="text-sm text-gray-500">{{ application.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ application.contact }}</div>
                <div class="text-gray-500 text-xs">{{ application.availability }}</div>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ application.motorcycleInfo?.brand }} {{ application.motorcycleInfo?.model }}</div>
                <div class="text-gray-500 text-xs">{{ application.motorcycleInfo?.plateNumber }} ({{ application.motorcycleInfo?.year }})</div>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.experience }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.applicationDate }}
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full',
                  application.status === 'approved' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
                ]">
                  {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
                </span>
              </td>
              <td class="px-3 sm:px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="viewApplication(application)"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#00C851] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200"
                  >
                    View
                  </button>
                  <button 
                    v-if="application.status === 'pending'"
                    @click="approveApplication(application)"
                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#74E600] text-white rounded-lg hover:bg-[#3ED400] transition-all duration-200"
                  >
                    Approve
                  </button>
                  <button 
                    v-if="application.status === 'pending'"
                    @click="rejectApplication(application)"
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
    </div>

    <!-- Application Details Modal -->
    <div v-if="selectedApplication" class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-1.5 sm:p-2" @click.self="closeApplicationModal">
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
                <h3 class="text-sm sm:text-base font-bold text-white">Application Details</h3>
                <p class="text-xs text-white/90 hidden sm:block">Complete application information</p>
              </div>
            </div>
            <button @click="closeApplicationModal" class="text-white/90 hover:text-white hover:bg-white/20 rounded p-0.5 transition-all duration-200">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div v-if="selectedApplication" class="p-2 sm:p-3 overflow-y-auto flex-1">
          <div v-if="applicationDetailsSections.length > 1" class="mb-3">
            <!-- Section Tabs -->
            <div class="flex justify-center items-center gap-1 mb-2 flex-wrap">
              <div
                v-for="(section, index) in applicationDetailsSections"
                :key="section.id"
                @click="goToApplicationDetailsPage(index)"
                :class="index === applicationDetailsCurrentPage ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
                class="px-2 py-1 text-xs font-medium rounded-lg cursor-pointer transition-all duration-200"
              >
                {{ section.title }}
              </div>
            </div>
            <!-- Pagination Dots -->
            <div class="flex justify-center items-center gap-1.5 mt-2">
              <div
                v-for="(section, index) in applicationDetailsSections"
                :key="`dot-${section.id}`"
                @click="goToApplicationDetailsPage(index)"
                :class="index === applicationDetailsCurrentPage ? 'bg-[#00C851] w-2.5 h-2.5' : 'bg-gray-300 hover:bg-gray-400'"
                class="w-2 h-2 rounded-full cursor-pointer transition-all duration-200"
                :title="section.title"
              ></div>
            </div>
          </div>

          <div class="min-h-[200px] sm:min-h-[250px]">
            <!-- Application Summary Section -->
            <div v-if="applicationDetailsSections[applicationDetailsCurrentPage]?.id === 'summary'" class="bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Application Summary</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-xs mb-3">
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Application ID</p>
                  <p class="font-medium text-gray-900 truncate" :title="'#' + selectedApplication.id">#{{ selectedApplication.id?.substring(0, 8) || 'N/A' }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Status</p>
                  <span :class="[
                    'inline-flex px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
                    selectedApplication.status === 'approved' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                    selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  ]">
                    {{ selectedApplication.status?.charAt(0).toUpperCase() + selectedApplication.status?.slice(1) || 'Pending' }}
                  </span>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Experience</p>
                  <p class="font-medium text-[#00C851]">{{ selectedApplication.experience || 'N/A' }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Applied</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.applicationDate">{{ selectedApplication.applicationDate || 'N/A' }}</p>
                </div>
              </div>
              <div class="pt-3 border-t border-gray-200">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br from-[#00C851] to-[#3ED400]">
                    <span class="text-white text-xl sm:text-2xl font-medium">{{ selectedApplication.initials || 'NA' }}</span>
                  </div>
                  <div class="text-center sm:text-left min-w-0 flex-1">
                    <h4 class="text-base sm:text-lg font-bold text-gray-900 truncate" :title="selectedApplication.name">{{ selectedApplication.name }}</h4>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5 truncate" :title="selectedApplication.email">{{ selectedApplication.email }}</p>
                    <p class="text-xs text-gray-500 mt-0.5 truncate" :title="selectedApplication.contact">{{ selectedApplication.contact }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Information Section -->
            <div v-if="applicationDetailsSections[applicationDetailsCurrentPage]?.id === 'personal'" class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Personal Information</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Full Name</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.name">{{ selectedApplication.name }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Email</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.email">{{ selectedApplication.email }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Contact Number</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.contact">{{ selectedApplication.contact }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Application Date</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.applicationDate">{{ selectedApplication.applicationDate }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Status</p>
                  <span :class="[
                    'inline-flex px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
                    selectedApplication.status === 'approved' ? 'bg-[#74E600]/20 text-[#00C851] border border-[#74E600]/30' :
                    selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  ]">
                    {{ selectedApplication.status?.charAt(0).toUpperCase() + selectedApplication.status?.slice(1) || 'Pending' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Motorcycle Information Section -->
            <div v-if="applicationDetailsSections[applicationDetailsCurrentPage]?.id === 'motorcycle'" class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Motorcycle Information</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Brand</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.motorcycleInfo?.brand || 'N/A'">{{ selectedApplication.motorcycleInfo?.brand || 'N/A' }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Model</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.motorcycleInfo?.model || 'N/A'">{{ selectedApplication.motorcycleInfo?.model || 'N/A' }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Plate Number</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.motorcycleInfo?.plateNumber || 'N/A'">{{ selectedApplication.motorcycleInfo?.plateNumber || 'N/A' }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Year</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.motorcycleInfo?.year || 'N/A'">{{ selectedApplication.motorcycleInfo?.year || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Experience & Availability Section -->
            <div v-if="applicationDetailsSections[applicationDetailsCurrentPage]?.id === 'experience'" class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-1.5 text-xs sm:text-sm">Experience & Availability</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Driving Experience</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.experience || 'N/A'">{{ selectedApplication.experience || 'N/A' }}</p>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-600 mb-0.5">Availability</p>
                  <p class="font-medium text-gray-900 truncate" :title="selectedApplication.availability || 'N/A'">{{ selectedApplication.availability || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Documents Section -->
            <div v-if="applicationDetailsSections[applicationDetailsCurrentPage]?.id === 'documents'" class="bg-gradient-to-br from-[#00C851]/10 to-[#3ED400]/10 p-2 sm:p-3 rounded-xl border border-[#00C851]/20">
              <h4 class="font-medium text-gray-900 mb-2 text-xs sm:text-sm">Required Documents</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <!-- Driver's License -->
                <div v-if="selectedApplication.documents?.license" class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Driver's License</p>
                  <div class="relative w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200">
                    <img
                      :src="selectedApplication.documents.license"
                      alt="Driver's License"
                      class="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      @click="viewDocument(selectedApplication.documents.license)"
                    />
                    <div class="absolute top-2 right-2 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-xs px-2 py-1 rounded-full shadow-md">
                      ✓ Uploaded
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Driver's License</p>
                  <div class="flex items-center justify-center h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p class="text-xs sm:text-sm text-gray-500">Not uploaded</p>
                  </div>
                </div>

                <!-- OR/CR -->
                <div v-if="selectedApplication.documents?.orcr" class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">OR/CR</p>
                  <div class="relative w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200">
                    <img
                      :src="selectedApplication.documents.orcr"
                      alt="OR/CR"
                      class="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      @click="viewDocument(selectedApplication.documents.orcr)"
                    />
                    <div class="absolute top-2 right-2 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-xs px-2 py-1 rounded-full shadow-md">
                      ✓ Uploaded
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">OR/CR</p>
                  <div class="flex items-center justify-center h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p class="text-xs sm:text-sm text-gray-500">Not uploaded</p>
                  </div>
                </div>

                <!-- Selfie with License -->
                <div v-if="selectedApplication.documents?.selfie" class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Selfie with License</p>
                  <div class="relative w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200">
                    <img
                      :src="selectedApplication.documents.selfie"
                      alt="Selfie with License"
                      class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      @click="viewDocument(selectedApplication.documents.selfie)"
                    />
                    <div class="absolute top-2 right-2 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-xs px-2 py-1 rounded-full shadow-md">
                      ✓ Uploaded
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Selfie with License</p>
                  <div class="flex items-center justify-center h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p class="text-xs sm:text-sm text-gray-500">Not uploaded</p>
                  </div>
                </div>

                <!-- Profile Picture -->
                <div v-if="selectedApplication.documents?.profilePicture" class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Profile Picture</p>
                  <div class="relative w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200">
                    <img
                      :src="selectedApplication.documents.profilePicture"
                      alt="Profile Picture"
                      class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      @click="viewDocument(selectedApplication.documents.profilePicture)"
                    />
                    <div class="absolute top-2 right-2 bg-gradient-to-r from-[#74E600] to-[#3ED400] text-white text-xs px-2 py-1 rounded-full shadow-md">
                      ✓ Uploaded
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col">
                  <p class="text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Profile Picture</p>
                  <div class="flex items-center justify-center h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <p class="text-xs sm:text-sm text-gray-500">Not uploaded</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Pagination Controls -->
          <div v-if="applicationDetailsSections.length > 1" class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 flex-shrink-0">
            <button
              @click="previousApplicationDetailsPage"
              :disabled="applicationDetailsCurrentPage === 0"
              class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Previous</span>
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-gray-600">{{ applicationDetailsCurrentPage + 1 }}</span>
              <span class="text-xs text-gray-400">of</span>
              <span class="text-xs font-medium text-gray-600">{{ applicationDetailsSections.length }}</span>
            </div>
            
            <button
              @click="nextApplicationDetailsPage"
              :disabled="applicationDetailsCurrentPage === applicationDetailsSections.length - 1"
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
              @click="closeApplicationModal"
              class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              Close
            </button>
            <button
              v-if="selectedApplication.status === 'pending'"
              @click="approveApplication(selectedApplication)"
              :disabled="loading"
              class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-[#74E600] rounded-lg hover:bg-[#3ED400] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Approve Application
            </button>
            <button
              v-if="selectedApplication.status === 'pending'"
              @click="rejectApplication(selectedApplication)"
              :disabled="loading"
              class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'DriverApplications',
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()
    
    const searchQuery = ref('')
    const statusFilter = ref('')
    const experienceFilter = ref('')
    const selectedApplication = ref(null)
    const loading = ref(true)
    
    const applications = ref([])
    
    // Application Details Modal Pagination
    const applicationDetailsCurrentPage = ref(0)
    
    const applicationStats = computed(() => {
      const total = applications.value.length
      const pending = applications.value.filter(app => app.status === 'pending').length
      const approved = applications.value.filter(app => app.status === 'approved').length
      const rejected = applications.value.filter(app => app.status === 'rejected').length
      
      return { total, pending, approved, rejected }
    })

    const filteredApplications = computed(() => {
      return applications.value.filter(application => {
        const matchesSearch = !searchQuery.value || 
          application.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          application.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          application.contact.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        const matchesStatus = !statusFilter.value || application.status === statusFilter.value
        const matchesExperience = !experienceFilter.value || application.experience === experienceFilter.value
        
        return matchesSearch && matchesStatus && matchesExperience
      })
    })

    const fetchApplications = async () => {
      try {
        loading.value = true
        const driverApplications = await authStore.getDriverApplications()
        applications.value = driverApplications
      } catch (error) {
        console.error('Error fetching driver applications:', error)
        toast.error('Failed to load driver applications')
      } finally {
        loading.value = false
      }
    }

    // Application Details Modal Sections
    const applicationDetailsSections = computed(() => {
      if (!selectedApplication.value) return []
      const sections = []
      
      // Application Summary - always show
      sections.push({ id: 'summary', title: 'Summary' })
      
      // Personal Information - always show
      sections.push({ id: 'personal', title: 'Personal Info' })
      
      // Motorcycle Information - always show
      sections.push({ id: 'motorcycle', title: 'Motorcycle' })
      
      // Experience & Availability - always show
      sections.push({ id: 'experience', title: 'Experience' })
      
      // Documents - always show
      sections.push({ id: 'documents', title: 'Documents' })
      
      return sections
    })
    
    const nextApplicationDetailsPage = () => {
      if (applicationDetailsCurrentPage.value < applicationDetailsSections.value.length - 1) {
        applicationDetailsCurrentPage.value++
      }
    }
    
    const previousApplicationDetailsPage = () => {
      if (applicationDetailsCurrentPage.value > 0) {
        applicationDetailsCurrentPage.value--
      }
    }
    
    const goToApplicationDetailsPage = (index) => {
      if (index >= 0 && index < applicationDetailsSections.value.length) {
        applicationDetailsCurrentPage.value = index
      }
    }
    
    const closeApplicationModal = () => {
      selectedApplication.value = null
      applicationDetailsCurrentPage.value = 0
    }
    
    const viewApplication = (application) => {
      // Reset pagination
      applicationDetailsCurrentPage.value = 0
      selectedApplication.value = application
    }

    const approveApplication = async (application) => {
      try {
        const result = await authStore.approveDriver(application.id, authStore.user.uid)
        if (result.success) {
          application.status = 'approved'
          application.approved = true
          closeApplicationModal()
          toast.success(`${application.name}'s application has been approved`)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error approving application:', error)
        toast.error('Failed to approve application')
      }
    }

    const rejectApplication = async (application) => {
      try {
        const result = await authStore.rejectDriver(application.id, authStore.user.uid, 'Application rejected by admin')
        if (result.success) {
          application.status = 'rejected'
          closeApplicationModal()
          toast.success(`${application.name}'s application has been rejected`)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error rejecting application:', error)
        toast.error('Failed to reject application')
      }
    }

    const viewDocument = (documentUrl) => {
      if (documentUrl) {
        window.open(documentUrl, '_blank')
      }
    }

    onMounted(() => {
      fetchApplications()
    })

    return {
      searchQuery,
      statusFilter,
      experienceFilter,
      selectedApplication,
      loading,
      applications,
      applicationStats,
      filteredApplications,
      applicationDetailsCurrentPage,
      applicationDetailsSections,
      viewApplication,
      approveApplication,
      rejectApplication,
      viewDocument,
      closeApplicationModal,
      nextApplicationDetailsPage,
      previousApplicationDetailsPage,
      goToApplicationDetailsPage
    }
  }
}
</script>
