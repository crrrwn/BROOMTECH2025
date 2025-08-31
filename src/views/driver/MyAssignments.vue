<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">My Assignments</h1>
    <p class="text-gray-600 mb-6">Manage your accepted bookings and deliveries</p>
    
    <div class="bg-white rounded-lg p-4 shadow border mb-6">
      <div class="flex gap-2">
        <button 
          v-for="status in statusOptions" 
          :key="status.value"
          @click="currentFilter = status.value"
          class="px-4 py-2 rounded text-sm font-medium"
          :class="currentFilter === status.value ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'"
        >
          {{ status.label }}
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="item in displayedAssignments" :key="item.id" class="bg-white rounded-lg p-6 shadow border">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold">{{ item.title }}</h3>
            <p class="text-gray-500">{{ item.customer }}</p>
          </div>
          <div class="text-right">
            <span class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {{ item.status }}
            </span>
            <p class="text-xl font-bold text-green-600 mt-1">₱{{ item.amount }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm font-medium text-gray-700">Pickup</p>
            <p class="text-sm text-gray-600">{{ item.pickup }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700">Dropoff</p>
            <p class="text-sm text-gray-600">{{ item.dropoff }}</p>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button 
            v-if="item.status === 'Accepted'"
            @click="startDelivery(item)"
            class="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Start Delivery
          </button>
          
          <button 
            v-if="item.status === 'In Transit'"
            @click="markDelivered(item)"
            class="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Mark as Delivered
          </button>
          
          <button 
            @click="contactCustomer(item)"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Contact
          </button>
        </div>
      </div>
    </div>

    <div v-if="displayedAssignments.length === 0" class="text-center py-12">
      <p class="text-gray-500">No assignments found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const currentFilter = ref('all')

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'In Transit', value: 'In Transit' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Completed', value: 'Completed' }
]

const assignmentList = ref([
  {
    id: 1,
    title: 'Food Delivery',
    customer: 'Maria Santos',
    pickup: 'Jollibee, Magsaysay St',
    dropoff: 'Barangay Guinobatan',
    amount: 85,
    status: 'Accepted'
  },
  {
    id: 2,
    title: 'Grocery Shopping',
    customer: 'Juan Dela Cruz',
    pickup: 'SM City Calapan',
    dropoff: 'Barangay Mahal na Pangalan',
    amount: 120,
    status: 'In Transit'
  },
  {
    id: 3,
    title: 'Document Delivery',
    customer: 'Ana Reyes',
    pickup: 'City Hall',
    dropoff: 'Barangay San Vicente',
    amount: 75,
    status: 'Delivered'
  }
])

const displayedAssignments = computed(() => {
  if (currentFilter.value === 'all') {
    return assignmentList.value
  }
  return assignmentList.value.filter(item => item.status === currentFilter.value)
})

function startDelivery(assignment) {
  assignment.status = 'In Transit'
  toast.success('Delivery started!')
}

function markDelivered(assignment) {
  assignment.status = 'Delivered'
  toast.success('Order marked as delivered!')
}

function contactCustomer(assignment) {
  toast.info(`Contacting ${assignment.customer}...`)
}
</script>
