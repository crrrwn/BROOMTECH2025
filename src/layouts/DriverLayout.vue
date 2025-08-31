<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg">
        <div class="p-6">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">B</span>
            </div>
            <span class="text-xl font-bold text-gray-900">BroomTech</span>
          </div>
          <div class="mt-4">
            <span class="text-sm text-gray-500">Driver Portal</span>
          </div>
        </div>
        
        <!-- Online/Offline Toggle -->
        <div class="px-6 pb-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-700">Status</span>
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
          <p class="text-xs text-gray-500 mt-1">
            {{ isOnline ? 'You are online and available for bookings' : 'You are offline' }}
          </p>
        </div>
        
        <nav class="mt-2">
          <div class="px-6 py-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          </div>
          
          <div class="mt-2 space-y-1">
            <router-link to="/driver" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              Dashboard
            </router-link>
            
            <router-link to="/driver/bookings" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Available Bookings
              <span v-if="availableBookingsCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {{ availableBookingsCount }}
              </span>
            </router-link>
            
            <router-link to="/driver/assignments" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              My Assignments
              <span v-if="activeAssignmentsCount > 0" class="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1">
                {{ activeAssignmentsCount }}
              </span>
            </router-link>
            
            <router-link to="/driver/proof" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 11-8 0 4 4 0 018 0zM15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Upload Proof
            </router-link>
            
            <router-link to="/driver/profile" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </router-link>
          </div>
          
          <div class="mt-8 px-6">
            <button @click="logout" class="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>
      
      <!-- Main content -->
      <div class="flex-1">
        <!-- Top bar -->
        <header class="bg-white shadow-sm border-b">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
                <div class="flex items-center space-x-2">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  ]"></div>
                  <span class="text-sm text-gray-600">{{ isOnline ? 'Online' : 'Offline' }}</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="text-sm text-gray-500">Today's Earnings</p>
                  <p class="text-lg font-semibold text-primary">₱{{ todayEarnings }}</p>
                </div>
                
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ driverInitials }}</span>
                  </div>
                  <span class="text-gray-700">{{ driverName }}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Page content -->
        <main class="p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// Driver status and stats
const isOnline = ref(false)
const availableBookingsCount = ref(3)
const activeAssignmentsCount = ref(1)
const todayEarnings = ref(450)

const pageTitle = computed(() => {
  const titles = {
    'driver-dashboard': 'Dashboard',
    'available-bookings': 'Available Bookings',
    'my-assignments': 'My Assignments',
    'upload-proof': 'Upload Proof',
    'driver-profile': 'Profile'
  }
  return titles[route.name] || 'Dashboard'
})

const driverName = computed(() => {
  const profile = authStore.userProfile
  return profile ? `${profile.firstName} ${profile.lastName}` : 'Driver'
})

const driverInitials = computed(() => {
  const profile = authStore.userProfile
  if (!profile) return 'D'
  return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
})

const toggleOnlineStatus = () => {
  isOnline.value = !isOnline.value
  toast.success(isOnline.value ? 'You are now online!' : 'You are now offline')
}

const logout = async () => {
  const result = await authStore.logout()
  if (result.success) {
    toast.success(result.message)
    router.push('/')
  } else {
    toast.error(result.message)
  }
}
</script>
