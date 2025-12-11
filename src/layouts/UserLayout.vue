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
            src="https://scontent.fmnl7-2.fna.fbcdn.net/v/t1.15752-9/514071591_1252432816270252_1243204019946633211_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEne1_QgvnzPimBbfxq_loR-tDfpI8SJXz60N-kjxIlfByb9W5QUiBtwAWWz58nuc7ZAQLaDdcR5XLMXSyYpi5e&_nc_ohc=Z2MtLp4I_nIQ7kNvwGjEqRH&_nc_oc=AdlW1joxM16GAk8osLpxm86ruX_2cZ8qFxvWkKoFoGQW5UcUL3PiO6FB5KEvFBr0z1o&_nc_zt=23&_nc_ht=scontent.fmnl7-2.fna&oh=03_Q7cD4AE-HhtPzzzdURQul2Z4mlCen24maOimsa0KoTIw7wwBlQ&oe=695A82D2" 
            alt="BroomTech Logo"
            class="w-10 h-10 rounded-full object-cover shadow-lg shadow-green-200 border-2 border-[#3ED400]"
          />
          <div>
            <span class="text-xl font-bold text-gray-800 tracking-tight block leading-none">BroomTech</span>
            <span class="text-[10px] text-[#74E600] font-bold tracking-widest uppercase">User Panel</span>
          </div>
        </div>
        <button @click="isSidebarOpen = false" class="md:hidden ml-auto text-gray-400 hover:text-red-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-2">
        
        <div class="px-4 mb-2">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</p>
        </div>

        <router-link 
          :to="{ name: 'user-dashboard' }" 
          class="nav-item" 
          active-class="active-nav"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Dashboard
        </router-link>

        <router-link 
          :to="{ name: 'book-service' }" 
          class="nav-item" 
          active-class="active-nav"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Book a Service
        </router-link>

        <router-link 
          :to="{ name: 'my-orders' }" 
          class="nav-item" 
          active-class="active-nav"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          My Orders
        </router-link>
        
        <router-link 
          :to="{ name: 'user-profile' }" 
          class="nav-item" 
          active-class="active-nav"
          @click="closeSidebar"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Profile
        </router-link>

      </nav>

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

          <div class="flex items-center space-x-4">
            
            <div class="relative">
              <button 
                @click="toggleNotifications" 
                class="relative p-2 text-gray-500 hover:text-[#74E600] hover:bg-green-50 rounded-xl transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>

              <div v-if="showNotifications" class="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                <div class="p-4 border-b bg-gray-50/50 flex items-center justify-between">
                  <h3 class="font-bold text-gray-800">Notifications</h3>
                  <button v-if="notifications.length > 0" @click="markAllAsRead" class="text-xs font-bold text-[#74E600] hover:text-[#00C851]">Mark all read</button>
                </div>
                
                <div class="max-h-[20rem] overflow-y-auto custom-scrollbar">
                  <div v-if="notifications.length === 0" class="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                  <div v-else>
                    <div 
                      v-for="notification in notifications" 
                      :key="notification.id"
                      @click="markAsRead(notification)"
                      :class="['p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors flex gap-3', !notification.read ? 'bg-[#A8EB12]/10' : '']"
                    >
                      <div :class="['w-2 h-2 rounded-full mt-2 shrink-0', !notification.read ? 'bg-[#74E600]' : 'bg-gray-300']"></div>
                      <div>
                        <p class="text-sm font-medium text-gray-800 leading-snug">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-bold text-gray-800 leading-none">{{ userName }}</p>
                <p class="text-xs text-gray-400 mt-1 font-medium">User</p>
              </div>
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md bg-gradient-to-br from-[#74E600] to-[#3ED400] border-2 border-white ring-1 ring-gray-100">
                {{ userInitials }}
              </div>
            </div>

          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <router-view />
      </main>

    </div>

    <FloatingChatbot />

    <Transition name="fade">
      <div v-if="showLogoutModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
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
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import FloatingChatbot from '@/components/FloatingChatbot.vue'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useToast } from 'vue-toastification'

export default {
  name: 'UserLayout',
  components: {
    FloatingChatbot
  },
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    const isSidebarOpen = ref(false)
    const showLogoutModal = ref(false)
    
    return { authStore, toast, isSidebarOpen, showLogoutModal }
  },
  data() {
    return {
      showNotifications: false,
      notifications: [],
      unreadCount: 0,
      unsubscribe: null
    }
  },
  computed: {
    pageTitle() {
      const titles = {
        'user-dashboard': 'Dashboard',
        'book-service': 'Book a Service',
        'my-orders': 'My Orders',
        'user-profile': 'Profile'
      }
      return titles[this.$route.name] || 'Dashboard'
    },
    userName() {
      const profile = this.authStore.userProfile
      return profile ? `${profile.firstName} ${profile.lastName}` : 'Guest User'
    },
    userInitials() {
      const profile = this.authStore.userProfile
      if (!profile) return 'U'
      return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    }
  },
  methods: {
    closeSidebar() {
      this.isSidebarOpen = false
    },

    confirmLogout() {
      this.isSidebarOpen = false
      this.showLogoutModal = true
    },

    executeLogout() {
      this.showLogoutModal = false
      this.$router.push('/')
      this.authStore.logout().catch(error => {
        console.error('[v0] Logout error:', error)
      })
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    
    loadNotifications() {
      const userId = this.authStore.user?.uid
      if (!userId) return
      
      const notificationsRef = collection(db, 'notifications')
      const q = query(
        notificationsRef, 
        where('userId', '==', userId),
        where('recipientType', '==', 'user')
      )
      
      this.unsubscribe = onSnapshot(q, (snapshot) => {
        this.notifications = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
            return dateB - dateA
          })
        
        this.unreadCount = this.notifications.filter(n => !n.read).length
      }, (error) => {
        console.log('[v0] Notification query failed, trying fallback:', error.message)
        const fallbackQ = query(notificationsRef, where('userId', '==', userId))
        this.unsubscribe = onSnapshot(fallbackQ, (snapshot) => {
          this.notifications = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(n => !n.recipientType || n.recipientType === 'user') 
            .sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
              return dateB - dateA
            })
          
          this.unreadCount = this.notifications.filter(n => !n.read).length
        })
      })
    },
    
    async markAsRead(notification) {
      if (notification.read) return
      try {
        await updateDoc(doc(db, 'notifications', notification.id), {
          read: true
        })
      } catch (error) {
        console.error('[v0] Error marking notification as read:', error)
      }
    },
    
    async markAllAsRead() {
      try {
        const unreadNotifications = this.notifications.filter(n => !n.read)
        await Promise.all(
          unreadNotifications.map(notification =>
            updateDoc(doc(db, 'notifications', notification.id), {
              read: true
            })
          )
        )
        this.toast.success('All notifications marked as read')
      } catch (error) {
        console.error('[v0] Error marking all as read:', error)
        this.toast.error('Failed to mark notifications as read')
      }
    },
    
    formatDate(dateString) {
      const date = dateString?.toDate ? dateString.toDate() : new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  },
  mounted() {
    this.loadNotifications()
    document.addEventListener('click', (e) => {
      if (this.showNotifications && !e.target.closest('.relative')) {
        this.showNotifications = false
      }
    })
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.font-poppins { font-family: 'Poppins', sans-serif; }

/* Nav Item Styles */
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.85rem 1.25rem;
  color: #6b7280; /* Gray 500 */
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.nav-item:hover {
  background-color: rgba(116, 230, 0, 0.1);
  color: #74E600; /* Brand Green */
}

.active-nav {
  background-color: #74E600 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(116, 230, 0, 0.3);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>