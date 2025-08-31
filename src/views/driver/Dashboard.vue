<template>
  <div class="space-y-6">
    <!-- Status and Earnings Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Online Status Card -->
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Driver Status</h2>
          <div class="flex items-center space-x-2">
            <div :class="[
              'w-3 h-3 rounded-full',
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            ]"></div>
            <span class="text-sm font-medium" :class="isOnline ? 'text-green-600' : 'text-gray-500'">
              {{ isOnline ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span class="text-gray-700">Go Online to receive bookings</span>
            <button 
              @click="toggleOnlineStatus"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                isOnline ? 'bg-primary' : 'bg-gray-300'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  isOnline ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <div v-if="isOnline" class="text-sm text-gray-600">
            <p>Online since: {{ onlineTime }}</p>
            <p>Available for: {{ availableServices.join(', ') }}</p>
          </div>
        </div>
      </div>

      <!-- Today's Earnings -->
      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h2 class="text-lg font-semibold mb-4">Today's Earnings</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Total Earnings:</span>
            <span class="font-bold text-2xl">₱{{ todayEarnings.total }}</span>
          </div>
          <div class="flex justify-between text-green-100">
            <span>Completed Orders:</span>
            <span>{{ todayEarnings.orders }}</span>
          </div>
          <div class="flex justify-between text-green-100">
            <span>Average per Order:</span>
            <span>₱{{ todayEarnings.average }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Available</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.availableBookings }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.activeAssignments }}</p>
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
            <p class="text-sm font-medium text-gray-600">Completed Today</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.completedToday }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Rating</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.rating }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Earnings Chart -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Weekly Earnings</h2>
      <div class="h-64 flex items-end justify-between space-x-2">
        <div v-for="(day, index) in weeklyEarnings" :key="index" class="flex flex-col items-center flex-1">
          <div 
            class="bg-primary rounded-t w-full transition-all duration-300 hover:bg-green-600"
            :style="{ height: `${(day.amount / Math.max(...weeklyEarnings.map(d => d.amount))) * 200}px` }"
          ></div>
          <div class="mt-2 text-center">
            <p class="text-xs text-gray-500">{{ day.day }}</p>
            <p class="text-sm font-medium text-gray-900">₱{{ day.amount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <router-link to="/driver/assignments" class="text-primary hover:text-green-600 text-sm font-medium">
          View All
        </router-link>
      </div>
      
      <div class="space-y-4">
        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-4">
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center',
              activity.type === 'completed' ? 'bg-green-100' :
              activity.type === 'accepted' ? 'bg-blue-100' :
              'bg-yellow-100'
            ]">
              <svg class="w-5 h-5" :class="[
                activity.type === 'completed' ? 'text-green-600' :
                activity.type === 'accepted' ? 'text-blue-600' :
                'text-yellow-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="activity.type === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                <path v-else-if="activity.type === 'accepted'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-900">₱{{ activity.amount }}</p>
            <span :class="[
              'inline-flex px-2 py-1 text-xs font-medium rounded-full',
              activity.type === 'completed' ? 'bg-green-100 text-green-800' :
              activity.type === 'accepted' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            ]">
              {{ activity.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const isOnline = ref(false)
const onlineTime = ref('10:30 AM')
const availableServices = ref(['Food Delivery', 'Pick-up & Drop', 'Grocery Shopping'])

const todayEarnings = ref({
  total: 450,
  orders: 6,
  average: 75
})

const stats = ref({
  availableBookings: 8,
  activeAssignments: 2,
  completedToday: 6,
  rating: 4.8
})

const weeklyEarnings = ref([
  { day: 'Mon', amount: 320 },
  { day: 'Tue', amount: 450 },
  { day: 'Wed', amount: 280 },
  { day: 'Thu', amount: 520 },
  { day: 'Fri', amount: 380 },
  { day: 'Sat', amount: 650 },
  { day: 'Sun', amount: 420 }
])

const recentActivity = ref([
  {
    id: 1,
    title: 'Food Delivery Completed',
    time: '2 hours ago',
    amount: 85,
    status: 'Completed',
    type: 'completed'
  },
  {
    id: 2,
    title: 'Grocery Shopping Accepted',
    time: '3 hours ago',
    amount: 120,
    status: 'In Progress',
    type: 'accepted'
  },
  {
    id: 3,
    title: 'Bill Payment Completed',
    time: '4 hours ago',
    amount: 55,
    status: 'Completed',
    type: 'completed'
  },
  {
    id: 4,
    title: 'Pick-up & Drop Pending',
    time: '5 hours ago',
    amount: 95,
    status: 'Pending',
    type: 'pending'
  }
])

const toggleOnlineStatus = () => {
  isOnline.value = !isOnline.value
  toast.success(isOnline.value ? 'You are now online and available for bookings!' : 'You are now offline')
  
  if (isOnline.value) {
    onlineTime.value = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }
}
</script>
