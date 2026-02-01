<template>
  <div class="h-screen bg-gray-50 font-poppins flex overflow-hidden">
    
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
    ></div>

    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-100',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="h-20 flex items-center px-8 border-b border-gray-100">
        <div class="flex items-center space-x-3">
          <img 
            src="/LOGO.jpg" 
            alt="BroomTech Logo"
            class="w-10 h-10 rounded-full object-cover shadow-lg shadow-green-200 border-2 border-[#3ED400]"
          />
          <div>
            <span class="text-xl font-bold text-gray-800 tracking-tight block leading-none">Broooom</span>
            <span class="text-[10px] text-[#00C851] font-bold tracking-widest uppercase">Admin Portal</span>
          </div>
        </div>
        <button @click="isSidebarOpen = false" class="md:hidden ml-auto text-gray-400 hover:text-red-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div class="px-6 pt-6 pb-2">
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-2xl border border-green-100 bg-[#A8EB12]/10">
            <p class="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#74E600]">Active Orders</p>
            <p class="text-2xl font-extrabold text-gray-800">{{ activeOrders }}</p>
          </div>
          <div class="p-3 rounded-2xl border border-green-100 bg-[#3ED400]/10">
            <p class="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#00C851]">Online Riders</p>
            <p class="text-2xl font-extrabold text-gray-800">{{ onlineDrivers }}</p>
          </div>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-6">
        <div>
          <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Management</p>
          <div class="space-y-1">
            <router-link to="/admin" class="nav-item" active-class="active-nav">
              <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1m0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1m10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1M13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1"/>
              </svg>
              Dashboard
            </router-link>
            
            <router-link to="/admin/orders" class="nav-item" active-class="active-nav">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              Manage Orders
              <span v-if="pendingOrders > 0" class="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5 shadow-sm shadow-red-200">
                {{ pendingOrders }}
              </span>
            </router-link>
            
            <router-link to="/admin/drivers" class="nav-item" active-class="active-nav">
              <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1536" fill="currentColor">
                 <path d="M896 1084q0 55-31.5 93.5T789 1216H363q-44 0-75.5-38.5T256 1084q0-54 7.5-100.5t24.5-90t51-68.5t81-25q64 64 156 64t156-64q47 0 81 25t51 68.5t24.5 90T896 1084M768 640q0 80-56 136t-136 56t-136-56t-56-136t56-136t136-56t136 56t56 136m1024 416v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704q14 0 23 9t9 23m-384-256v64q0 14-9 23t-23 9h-320q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h320q14 0 23 9t9 23m384 0v64q0 14-9 23t-23 9h-192q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h192q14 0 23 9t9 23m0-256v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704q14 0 23 9t9 23m128 832V256H128v1120q0 13 9.5 22.5t22.5 9.5h1728q13 0 22.5-9.5t9.5-22.5m128-1216v1216q0 66-47 113t-113 47H160q-66 0-113-47T0 1376V160Q0 94 47 47T160 0h1728q66 0 113 47t47 113"/>
              </svg>
              Manage Riders
            </router-link>
            
            <router-link to="/admin/users" class="nav-item" active-class="active-nav">
               <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.987 18.73a2 2 0 0 1-.34.85a1.9 1.9 0 0 1-1.56.8h-1.651a.74.74 0 0 1-.6-.31a.76.76 0 0 1-.11-.67c.37-1.18.29-2.51-3.061-4.64a.77.77 0 0 1-.32-.85a.76.76 0 0 1 .72-.54a7.61 7.61 0 0 1 6.792 4.39a2 2 0 0 1 .13.97M19.486 7.7a4.43 4.43 0 0 1-4.421 4.42a.76.76 0 0 1-.65-1.13a6.16 6.16 0 0 0 0-6.53a.75.75 0 0 1 .61-1.18a4.3 4.3 0 0 1 3.13 1.34a4.46 4.46 0 0 1 1.291 3.12z"/>
                  <path d="M16.675 18.7a2.65 2.65 0 0 1-1.26 2.48c-.418.257-.9.392-1.39.39H4.652a2.63 2.63 0 0 1-1.39-.39A2.62 2.62 0 0 1 2.01 18.7a2.6 2.6 0 0 1 .5-1.35a8.8 8.8 0 0 1 6.812-3.51a8.78 8.78 0 0 1 6.842 3.5a2.7 2.7 0 0 1 .51 1.36M14.245 7.32a4.92 4.92 0 0 1-4.902 4.91a4.903 4.903 0 0 1-4.797-5.858a4.9 4.9 0 0 1 6.678-3.57a4.9 4.9 0 0 1 3.03 4.518z"/>
               </svg>
              Manage Users
              <span v-if="pendingUsers > 0" class="ml-auto bg-yellow-400 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                {{ pendingUsers }}
              </span>
            </router-link>
            
            <router-link to="/admin/applications" class="nav-item" active-class="active-nav">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Applications
              <span v-if="pendingApplications > 0" class="ml-auto bg-[#3ED400] text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                {{ pendingApplications }}
              </span>
            </router-link>

            <router-link to="/admin/remittances" class="nav-item" active-class="active-nav">
               <svg class="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
                  <path d="M208 96c-17.7 0-32 14.3-32 32v64h-24c-13.3 0-24 10.7-24 24s10.7 24 24 24h24v32h-24c-13.3 0-24 10.7-24 24s10.7 24 24 24h24v192c0 17.7 14.3 32 32 32s32-14.3 32-32v-96h96c65.6 0 122-39.5 146.7-96H520c13.3 0 24-10.7 24-24s-10.7-24-24-24h-24.8c.5-5.3.8-10.6.8-16s-.3-10.7-.8-16H520c13.3 0 24-10.7 24-24s-10.7-24-24-24h-37.3C458 135.5 401.6 96 336 96zm199.6 96H240v-32h96c28.4 0 54 12.4 71.6 32M240 240h190.7c.9 5.2 1.3 10.5 1.3 16s-.5 10.8-1.3 16H240zm167.6 80c-17.6 19.6-43.1 32-71.6 32h-96v-32z"/>
               </svg>
              Remittances
            </router-link>

            <router-link to="/admin/chat-monitoring" class="nav-item" active-class="active-nav">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Chat Monitoring
            </router-link>
          </div>
        </div>
        
        <div>
          <p class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">System</p>
          <div class="space-y-1">
            <router-link to="/admin/pricing" class="nav-item" active-class="active-nav">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              Pricing & Fraud
            </router-link>
            
            <router-link to="/admin/settings" class="nav-item" active-class="active-nav">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Settings
            </router-link>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-gray-100">
        <button @click="confirmLogout" class="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group">
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </aside>
    
    <div class="flex-1 flex flex-col min-w-0 md:ml-72 transition-all duration-300">
      
      <header class="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
        <div class="px-4 sm:px-6 py-4 h-20 flex items-center justify-between">
          
          <div class="flex items-center gap-4">
            <button 
              @click="isSidebarOpen = !isSidebarOpen"
              class="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">{{ pageTitle }}</h1>
          </div>
          
          <div class="flex items-center space-x-2 sm:space-x-6">
            <div class="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-[#A8EB12]/20 rounded-lg border border-[#A8EB12]/30">
              <div class="w-2 h-2 rounded-full animate-pulse bg-[#3ED400]"></div>
              <span class="text-xs font-bold text-[#00C851]">System Active</span>
            </div>
            
            <div class="relative">
              <button 
                @click="showNotifications = !showNotifications"
                class="relative p-2 text-gray-500 hover:text-[#3ED400] hover:bg-green-50 rounded-xl transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>

              <div v-if="showNotifications" class="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                <div class="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                  <h3 class="font-bold text-gray-800">Notifications</h3>
                  <button v-if="notifications.length > 0" @click="markAllAsRead" class="text-xs font-bold text-[#3ED400] hover:text-[#00C851]">Mark all read</button>
                </div>
                <div class="max-h-[20rem] overflow-y-auto custom-scrollbar">
                  <div v-if="loadingNotifications" class="p-8 text-center text-gray-400 text-sm">Loading...</div>
                  <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                  <div v-else>
                    <div 
                      v-for="notification in notifications" 
                      :key="notification.id"
                      @click="markAsRead(notification)"
                      :class="['p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors flex gap-3', !notification.read ? 'bg-[#A8EB12]/10' : '']"
                    >
                      <div :class="['w-2 h-2 rounded-full mt-2 shrink-0', !notification.read ? 'bg-[#3ED400]' : 'bg-gray-300']"></div>
                      <div>
                        <p class="text-sm font-medium text-gray-800 leading-snug">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 pl-2 sm:pl-4 border-l border-gray-200">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold text-gray-800 leading-none">Admin</p>
                <p class="text-xs text-gray-400 mt-1 font-medium">Broooom Admin</p>
              </div>
              <img 
                src="/LOGO.jpg" 
                alt="Admin Profile"
                class="w-10 h-10 rounded-full object-cover shadow-md border-2 border-white bg-[#74E600]"
              />
            </div>
          </div>
        </div>
      </header>
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <router-view />
      </main>

    </div>

    <!-- Logout Confirmation Modal -->
    <Transition name="fade">
      <div v-if="showLogoutModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="showLogoutModal = false">
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center transform transition-all scale-100 border border-gray-100">
          
          <div class="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>

          <h3 class="text-xl font-black text-gray-800 mb-2">End Session?</h3>
          <p class="text-sm text-gray-500 mb-8 font-medium leading-relaxed">
            Are you sure you want to close / end your session?
          </p>
          
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="showLogoutModal = false" 
              class="py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
            >
              No, Cancel
            </button>
            <button 
              @click="executeLogout" 
              class="py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  
  <component is="style">
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    .font-poppins { font-family: 'Poppins', sans-serif; }
    
    /* Nav Item Styles */
    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #6b7280;
      font-weight: 600;
      font-size: 0.875rem;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      margin-bottom: 0.25rem;
    }
    
    .nav-item:hover {
      background-color: rgba(116, 230, 0, 0.1);
      color: #3ED400;
    }
    
    .active-nav {
      background-color: #3ED400 !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(62, 212, 0, 0.25);
    }
    
    /* Custom Scrollbar */
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
    
    /* Transitions */
    .fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }
  </component>
</template>

<script setup>
// ... (SAME SCRIPT LOGIC AS BEFORE - NO CHANGES NEEDED HERE) ...
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  orderBy,
  limit
} from 'firebase/firestore'

const isSidebarOpen = ref(false)
const showLogoutModal = ref(false)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const activeOrders = ref(0)
const onlineDrivers = ref(0)
const pendingOrders = ref(0)
const pendingUsers = ref(0)
const pendingApplications = ref(0)

const showNotifications = ref(false)
const notifications = ref([])
const loadingNotifications = ref(false)
const unreadCount = ref(0)

const listeners = ref([])

const pageTitle = computed(() => {
  const titles = {
    'admin': 'Dashboard',
    'manage-orders': 'Manage Orders',
    'manage-drivers': 'Manage Drivers',
    'manage-users': 'Manage Users',
    'driver-applications': 'Driver Applications',
    'chat-monitoring': 'Chat Monitoring', 
    'remittances': 'Manage Remittances', 
    'pricing-panel': 'Pricing & Fraud Panel',
    'system-settings': 'System Settings'
  }
  return titles[route.name] || 'Dashboard'
})

// Data fetching functions
const fetchActiveOrders = () => {
  try {
    const activeOrdersQuery = query(collection(db, 'orders'), where('status', 'in', ['pending', 'confirmed', 'in_transit']))
    const unsubscribe = onSnapshot(activeOrdersQuery, (snapshot) => activeOrders.value = snapshot.size, () => activeOrders.value = 0)
    listeners.value.push(unsubscribe)
  } catch (error) { activeOrders.value = 0 }
}

const fetchOnlineDrivers = () => {
  try {
    const onlineDriversQuery = query(collection(db, 'drivers'), where('approved', '==', true), where('isOnline', '==', true))
    const unsubscribe = onSnapshot(onlineDriversQuery, (snapshot) => onlineDrivers.value = snapshot.size, () => onlineDrivers.value = 0)
    listeners.value.push(unsubscribe)
  } catch (error) { onlineDrivers.value = 0 }
}

const fetchPendingCounts = () => {
  try {
    const pendingOrdersQuery = query(collection(db, 'orders'), where('status', '==', 'pending'))
    const unsubscribePendingOrders = onSnapshot(pendingOrdersQuery, (snapshot) => pendingOrders.value = snapshot.size)
    
    const pendingUsersQuery = query(collection(db, 'users'), where('role', '==', 'user'), where('status', '==', 'pending'))
    const unsubscribePendingUsers = onSnapshot(pendingUsersQuery, (snapshot) => pendingUsers.value = snapshot.size)
    
    const pendingApplicationsQuery = query(collection(db, 'users'), where('role', '==', 'driver'), where('status', '==', 'pending'))
    const unsubscribePendingApplications = onSnapshot(pendingApplicationsQuery, (snapshot) => pendingApplications.value = snapshot.size)

    listeners.value.push(unsubscribePendingOrders, unsubscribePendingUsers, unsubscribePendingApplications)
  } catch (error) {}
}

const fetchNotifications = () => {
  try {
    loadingNotifications.value = true
    const notificationsQuery = query(collection(db, 'notifications'), where('recipientType', '==', 'admin'), limit(50))
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const allNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      allNotifications.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
      notifications.value = allNotifications
      unreadCount.value = notifications.value.filter(n => !n.read).length
      loadingNotifications.value = false
    }, () => loadingNotifications.value = false)
    listeners.value.push(unsubscribe)
  } catch (error) { loadingNotifications.value = false }
}

const markAsRead = async (notification) => {
  if (notification.read) return
  try { await updateDoc(doc(db, 'notifications', notification.id), { read: true, readAt: new Date() }) } catch (error) {}
}

const markAllAsRead = async () => {
  try {
    const unread = notifications.value.filter(n => !n.read)
    await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true, readAt: new Date() })))
    toast.success('Marked all as read')
  } catch (error) { toast.error('Failed to update') }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const diff = (new Date() - date) / 60000
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${Math.floor(diff)}m ago`
  if (diff < 1440) return `${Math.floor(diff/60)}h ago`
  return date.toLocaleDateString()
}

const confirmLogout = () => {
  isSidebarOpen.value = false
  showLogoutModal.value = true
}

const executeLogout = async () => {
  showLogoutModal.value = false
  const result = await authStore.logout()
  if (result.success) { 
    toast.success(result.message)
    router.push('/') 
  } else { 
    toast.error(result.message) 
  }
}

onMounted(() => {
  fetchActiveOrders(); fetchOnlineDrivers(); fetchPendingCounts(); fetchNotifications()
})

onUnmounted(() => {
  listeners.value.forEach(u => u && u())
  listeners.value = []
})
</script>