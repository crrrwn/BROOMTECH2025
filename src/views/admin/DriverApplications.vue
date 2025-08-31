<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Driver Applications</h1>
        <p class="text-gray-600">Review and manage driver applications</p>
      </div>
      <div class="flex items-center space-x-4">
        <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          Export Applications
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Applications</p>
            <p class="text-2xl font-semibold text-gray-900">{{ applicationStats.total }}</p>
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
            <p class="text-sm font-medium text-gray-600">Pending Review</p>
            <p class="text-2xl font-semibold text-gray-900">{{ applicationStats.pending }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ applicationStats.approved }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Rejected</p>
            <p class="text-2xl font-semibold text-gray-900">{{ applicationStats.rejected }}</p>
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
            placeholder="Search by name, email, or contact..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <select v-model="experienceFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary">
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
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Driver Applications</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorcycle Info</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Updated table rows to display real Firebase data with new fields -->
            <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ application.initials }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ application.name }}</div>
                    <div class="text-sm text-gray-500">{{ application.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ application.contact }}</div>
                <div class="text-gray-500">{{ application.availability }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ application.motorcycleInfo?.brand }} {{ application.motorcycleInfo?.model }}</div>
                <div class="text-gray-500">{{ application.motorcycleInfo?.plateNumber }} ({{ application.motorcycleInfo?.year }})</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.experience }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.applicationDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  application.status === 'approved' ? 'bg-green-100 text-green-800' :
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="viewApplication(application)"
                  class="text-primary hover:text-green-600"
                >
                  View
                </button>
                <button 
                  v-if="application.status === 'pending'"
                  @click="approveApplication(application)"
                  class="text-green-600 hover:text-green-800"
                >
                  Approve
                </button>
                <button 
                  v-if="application.status === 'pending'"
                  @click="rejectApplication(application)"
                  class="text-red-600 hover:text-red-800"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Application Details Modal -->
    <div v-if="selectedApplication" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Driver Application Details</h3>
          <button @click="selectedApplication = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Updated modal content to show all new driver application fields -->
          <!-- Personal Information -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.contact }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Application Date</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.applicationDate }}</p>
              </div>
            </div>
          </div>

          <!-- Motorcycle Information -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Motorcycle Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Brand</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.motorcycleInfo?.brand || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Model</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.motorcycleInfo?.model || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Plate Number</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.motorcycleInfo?.plateNumber || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Year</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.motorcycleInfo?.year || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Experience & Availability -->
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="text-md font-medium text-gray-900 mb-3">Experience & Availability</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Driving Experience</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.experience || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Availability</label>
                <p class="text-sm text-gray-900">{{ selectedApplication.availability || 'N/A' }}</p>
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
                  v-if="selectedApplication.documents?.license"
                  @click="viewDocument(selectedApplication.documents.license)"
                  class="text-primary hover:text-green-600 text-sm"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500">Not uploaded</p>
              </div>
              <div class="border rounded-lg p-3 bg-white">
                <p class="text-sm font-medium text-gray-900">OR/CR</p>
                <button 
                  v-if="selectedApplication.documents?.orcr"
                  @click="viewDocument(selectedApplication.documents.orcr)"
                  class="text-primary hover:text-green-600 text-sm"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500">Not uploaded</p>
              </div>
              <div class="border rounded-lg p-3 bg-white">
                <p class="text-sm font-medium text-gray-900">Selfie with License</p>
                <button 
                  v-if="selectedApplication.documents?.selfie"
                  @click="viewDocument(selectedApplication.documents.selfie)"
                  class="text-primary hover:text-green-600 text-sm"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500">Not uploaded</p>
              </div>
              <div class="border rounded-lg p-3 bg-white">
                <p class="text-sm font-medium text-gray-900">Profile Picture</p>
                <button 
                  v-if="selectedApplication.documents?.profilePicture"
                  @click="viewDocument(selectedApplication.documents.profilePicture)"
                  class="text-primary hover:text-green-600 text-sm"
                >
                  View Document
                </button>
                <p v-else class="text-sm text-gray-500">Not uploaded</p>
              </div>
            </div>
          </div>
          
          <div v-if="selectedApplication.status === 'pending'" class="flex space-x-3 pt-4">
            <button 
              @click="approveApplication(selectedApplication)"
              class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve Application
            </button>
            <button 
              @click="rejectApplication(selectedApplication)"
              class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
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

    const viewApplication = (application) => {
      selectedApplication.value = application
    }

    const approveApplication = async (application) => {
      try {
        const result = await authStore.approveDriver(application.id, authStore.user.uid)
        if (result.success) {
          application.status = 'approved'
          application.approved = true
          selectedApplication.value = null
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
          selectedApplication.value = null
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
      viewApplication,
      approveApplication,
      rejectApplication,
      viewDocument
    }
  }
}
</script>
