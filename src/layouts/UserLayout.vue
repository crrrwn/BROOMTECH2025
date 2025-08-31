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
        </div>
        
        <nav class="mt-6">
          <div class="px-6 py-2">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
          </div>
          
          <div class="mt-2 space-y-1">
            <router-link to="/user" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              Dashboard
            </router-link>
            
            <router-link to="/user/book" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Book a Service
            </router-link>
            
            <router-link to="/user/orders" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              My Orders
            </router-link>
            
            <router-link to="/user/payment" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 11-8 0 4 4 0 018 0zM15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Upload Payment
            </router-link>
            
            <router-link to="/user/profile" class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors" active-class="bg-primary text-white">
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
        </nav> <!-- Added missing closing nav tag -->
      </div>
      
      <!-- Main content -->
      <div class="flex-1">
        <!-- Top bar -->
        <header class="bg-white shadow-sm border-b">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
              
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ userInitials }}</span>
                  </div>
                  <span class="text-gray-700">{{ userName }}</span>
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
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const pageTitle = computed(() => {
  const titles = {
    'user-dashboard': 'Dashboard',
    'book-service': 'Book a Service',
    'my-orders': 'My Orders',
    'upload-payment': 'Upload Payment',
    'user-profile': 'Profile'
  }
  return titles[route.name] || 'Dashboard'
})

const userName = computed(() => {
  const profile = authStore.userProfile
  return profile ? `${profile.firstName} ${profile.lastName}` : 'User'
})

const userInitials = computed(() => {
  const profile = authStore.userProfile
  if (!profile) return 'U'
  return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
})

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
