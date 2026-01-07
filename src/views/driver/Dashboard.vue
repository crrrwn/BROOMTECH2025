<template>
  <div class="min-h-screen bg-gray-50/50 pb-24 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">

      <div class="bg-white rounded-[2rem] p-5 md:p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div class="relative z-10 text-center md:text-left w-full md:w-auto">
          <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Driver Dashboard</h1>
          <p class="text-gray-500 mt-1 font-medium text-sm md:text-base">
            Status: 
            <span :class="driverStore.isOnline ? 'text-[#3ED400]' : 'text-gray-400'" class="font-bold transition-colors duration-300">
              {{ driverStore.isOnline ? 'ONLINE' : 'OFFLINE' }}
            </span>
          </p>
          <div v-if="driverStore.isOnline" class="mt-2 inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
             <span class="w-2 h-2 bg-[#3ED400] rounded-full mr-2 animate-pulse"></span>
             Active Now
          </div>
        </div>

        <button 
          @click="handleToggleStatus"
          class="relative w-full md:w-72 p-2 rounded-full transition-all duration-500 ease-in-out shadow-inner group z-10 active:scale-95"
          :class="driverStore.isOnline ? 'bg-gradient-to-r from-[#74E600] to-[#00C851]' : 'bg-gray-200'"
        >
          <div class="flex items-center justify-between px-6 relative z-10 h-12 md:h-14">
            <span class="text-sm font-bold uppercase tracking-wider transition-opacity duration-300" :class="driverStore.isOnline ? 'text-white opacity-100' : 'text-gray-400 opacity-50'">Online</span>
            <span class="text-sm font-bold uppercase tracking-wider transition-opacity duration-300" :class="!driverStore.isOnline ? 'text-gray-600 opacity-100' : 'text-white/50 opacity-0'">Offline</span>
          </div>
          <div 
            class="absolute top-2 bottom-2 w-[calc(50%-8px)] bg-white rounded-full shadow-lg transform transition-transform duration-500 ease-in-out flex items-center justify-center"
            :class="driverStore.isOnline ? 'translate-x-[100%] left-1' : 'translate-x-0 left-2'"
          >
             <svg v-if="driverStore.isOnline" class="w-6 h-6 text-[#3ED400]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
          </div>
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 md:gap-6">
        
        <div class="relative overflow-hidden rounded-[2rem] shadow-lg transition-all duration-300 group hover:shadow-xl min-h-[220px]">
           <div :class="['absolute inset-0 z-0 transition-colors duration-500', driverStore.hasRemitted ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]' : 'bg-gray-800']"></div>
           <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>

           <div class="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full">
              <div class="flex justify-between items-start mb-6">
                 <div>
                    <h2 class="text-gray-400 font-medium text-xs md:text-sm uppercase tracking-wider mb-1">Today's Income</h2>
                    <p v-if="!driverStore.hasRemitted" class="text-yellow-400 text-[10px] md:text-xs font-bold flex items-center mt-1 bg-yellow-400/10 px-2 py-1 rounded w-fit">
                       Remittance Required
                    </p>
                 </div>
                 <div class="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <svg class="w-6 h-6 text-[#3ED400]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
              </div>

              <div v-if="driverStore.hasRemitted">
                 <h3 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight">₱{{ driverStore.todayEarnings.driverShare || '0.00' }}</h3>
                 <div class="mt-6 flex gap-4 text-sm text-gray-400 border-t border-gray-700 pt-4">
                    <div class="flex flex-col">
                       <span class="text-[10px] md:text-xs uppercase tracking-wide">Total</span>
                       <span class="text-gray-200 font-bold">₱{{ driverStore.todayEarnings.total || '0.00' }}</span>
                    </div>
                    <div class="w-px bg-gray-700 h-8"></div>
                    <div class="flex flex-col">
                       <span class="text-[10px] md:text-xs uppercase tracking-wide">Admin Fee</span>
                       <span class="text-gray-200 font-bold">₱{{ driverStore.todayEarnings.adminShare || '0.00' }}</span>
                    </div>
                 </div>
              </div>

              <div v-else class="flex flex-col items-center justify-center py-4 text-center">
                 <svg class="w-10 h-10 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                 <p class="text-gray-400 text-xs md:text-sm">Remit pending balance to unlock view.</p>
              </div>
           </div>
        </div>


      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        <router-link to="/driver/assignments" class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div class="flex justify-between items-start relative z-10">
             <div>
                <p class="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">Available</p>
                <h3 class="text-3xl md:text-4xl font-extrabold text-blue-600 mt-2">{{ stats.availableBookings }}</h3>
             </div>
             <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
          </div>
          <p class="text-[10px] md:text-xs text-gray-400 mt-4 font-medium group-hover:text-blue-500 transition-colors">Tap to view requests →</p>
        </router-link>

        <router-link to="/driver/assignments" class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-yellow-200 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
          <div class="flex justify-between items-start relative z-10">
             <div>
                <p class="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">Ongoing</p>
                <h3 class="text-3xl md:text-4xl font-extrabold text-yellow-500 mt-2">{{ stats.activeAssignments }}</h3>
             </div>
             <div class="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
          </div>
          <p class="text-[10px] md:text-xs text-gray-400 mt-4 font-medium group-hover:text-yellow-600 transition-colors">Current deliveries →</p>
        </router-link>

        <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group relative overflow-hidden">
          <div class="flex justify-between items-start relative z-10">
             <div>
                <p class="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">Completed</p>
                <h3 class="text-3xl md:text-4xl font-extrabold text-[#3ED400] mt-2">{{ stats.completedToday }}</h3>
             </div>
             <div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-[#3ED400] group-hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
          </div>
          <p class="text-[10px] md:text-xs text-gray-400 mt-4 font-medium group-hover:text-green-600 transition-colors">Jobs done today</p>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useDriverStore } from '@/stores/driver'
import { useToast } from 'vue-toastification'
import { db } from '@/firebase/config'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const driverStore = useDriverStore()
    const authStore = useAuthStore()
    const toast = useToast()
    const listeners = ref([])
    return { driverStore, authStore, toast, listeners }
  },
  data() {
    return {
      availableServices: ['Food Delivery', 'Pick-up & Drop', 'Grocery Shopping'],
      stats: { availableBookings: 0, activeAssignments: 0, completedToday: 0 }
    }
  },
  methods: {
    async handleToggleStatus() {
      const success = await this.driverStore.toggleOnlineStatus()
      if (success) {
        this.toast.success(this.driverStore.isOnline ? 'You are now Online!' : 'You are now Offline')
      } else {
        this.toast.error('Failed to update status.')
      }
    },
    setupStatsListener() {
      try {
        const driverId = this.authStore.user?.uid
        if (!driverId) return

        // 1. Available Bookings
        const availableQuery = query(collection(db, 'orders'), where('status', '==', 'pending'))
        const unsubAvail = onSnapshot(availableQuery, (snap) => {
          let count = 0; snap.forEach(doc => { if (!doc.data().driverId) count++ });
          this.stats.availableBookings = count
        }, () => this.stats.availableBookings = 0)

        // 2. Active Assignments
        const activeQuery = query(collection(db, 'orders'), where('driverId', '==', driverId), where('status', 'in', ['confirmed', 'driver_assigned', 'in_transit', 'on_the_way']))
        const unsubActive = onSnapshot(activeQuery, (snap) => this.stats.activeAssignments = snap.size, () => this.stats.activeAssignments = 0)

        // 3. Completed Today
        const today = new Date(); today.setHours(0,0,0,0);
        const completedQuery = query(collection(db, 'orders'), where('driverId', '==', driverId), where('status', '==', 'delivered'))
        const unsubComplete = onSnapshot(completedQuery, (snap) => {
          let count = 0
          snap.forEach(doc => {
             const d = doc.data()
             const date = d.deliveredAt?.toDate ? d.deliveredAt.toDate() : (d.deliveredAt ? new Date(d.deliveredAt) : null) || (d.createdAt?.toDate ? d.createdAt.toDate() : null)
             if (date && date >= today) count++
          })
          this.stats.completedToday = count
        }, () => this.stats.completedToday = 0)

        this.listeners.push(unsubAvail, unsubActive, unsubComplete)
      } catch (e) { console.error(e) }
    }
  },
  async mounted() {
    await this.driverStore.loadEarningsData()
    this.setupStatsListener()
  },
  unmounted() {
    this.listeners.forEach(unsub => unsub && unsub())
    this.listeners = []
  }
}
</script>