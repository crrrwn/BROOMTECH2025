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
            <router-link
              :to="{ name: 'user-dashboard' }"
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              Dashboard
            </router-link>

            <router-link
              :to="{ name: 'book-service' }"
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Book a Service
            </router-link>

            <router-link
              :to="{ name: 'my-orders' }"
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              </svg>
              My Orders
            </router-link>

            <router-link
              :to="{ name: 'user-profile' }"
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              active-class="bg-primary text-white"
            >
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
              <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>

              <div class="flex items-center space-x-4">
                <div class="relative">
                  <button 
                    @click="toggleNotifications" 
                    class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span 
                      v-if="unreadCount > 0" 
                      class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                    >
                      {{ unreadCount }}
                    </span>
                  </button>

                  <div 
                    v-if="showNotifications" 
                    class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div class="p-4 border-b border-gray-200">
                      <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
                        <button 
                          v-if="notifications.length > 0" 
                          @click="markAllAsRead" 
                          class="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>

                    <div class="max-h-96 overflow-y-auto">
                      <div v-if="notifications.length === 0" class="p-8 text-center">
                        <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p class="text-gray-500 text-sm">No notifications yet</p>
                      </div>

                      <div 
                        v-for="notification in notifications" 
                        :key="notification.id"
                        @click="markAsRead(notification)"
                        :class="[
                          'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
                          !notification.read ? 'bg-blue-50' : ''
                        ]"
                      >
                        <div class="flex items-start space-x-3">
                          <div 
                            :class="[
                              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                              notification.type === 'warning' ? 'bg-yellow-100' :
                              notification.type === 'account_flagged' ? 'bg-orange-100' :
                              notification.type === 'account_banned' ? 'bg-red-100' :
                              notification.type === 'account_unbanned' ? 'bg-green-100' :
                              notification.type === 'account_unflagged' ? 'bg-blue-100' :
                              notification.type === 'new_order' ? 'bg-green-100' :
                              notification.type === 'info' ? 'bg-blue-100' :
                              'bg-gray-100'
                            ]"
                          >
                            <!-- Warning Icon -->
                            <svg 
                              v-if="notification.type === 'warning'"
                              class="w-5 h-5 text-yellow-600"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <!-- Success/Unbanned Icon -->
                            <svg 
                              v-else-if="notification.type === 'account_unbanned' || notification.type === 'new_order'"
                              class="w-5 h-5 text-green-600"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <!-- Error/Banned Icon -->
                            <svg 
                              v-else-if="notification.type === 'account_banned'"
                              class="w-5 h-5 text-red-600"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <!-- Info/Unflagged Icon -->
                            <svg 
                              v-else-if="notification.type === 'account_unflagged' || notification.type === 'info'"
                              class="w-5 h-5 text-blue-600"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <!-- Flagged Icon -->
                            <svg 
                              v-else-if="notification.type === 'account_flagged'"
                              class="w-5 h-5 text-orange-600"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                            </svg>
                            <!-- Default Icon -->
                            <svg 
                              v-else
                              class="w-5 h-5 text-gray-600"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                            <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                            <p class="text-xs text-gray-400 mt-2">{{ formatDate(notification.createdAt) }}</p>
                          </div>
                          <div v-if="!notification.read" class="flex-shrink-0">
                            <span class="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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

    <!-- Added floating chatbot component -->
    <FloatingChatbot />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import FloatingChatbot from '@/components/FloatingChatbot.vue'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export default {
  name: 'UserLayout',
  components: {
    FloatingChatbot
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
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
      return profile ? `${profile.firstName} ${profile.lastName}` : 'User'
    },
    userInitials() {
      const profile = this.authStore.userProfile
      if (!profile) return 'U'
      return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    }
  },
  methods: {
    logout() {
      // Navigate immediately without waiting
      this.$router.push('/')
      
      // Perform logout cleanup in background without blocking
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
      // Filter by userId AND recipientType: 'user' (to get notifications from Driver and Admin)
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
        // Fallback: if query fails (e.g., no index), try without recipientType filter
        console.log('[v0] Notification query with recipientType failed, trying fallback:', error.message)
        const fallbackQ = query(notificationsRef, where('userId', '==', userId))
        this.unsubscribe = onSnapshot(fallbackQ, (snapshot) => {
          this.notifications = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(n => !n.recipientType || n.recipientType === 'user') // Filter in memory
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
        this.$toast.success('All notifications marked as read')
      } catch (error) {
        console.error('[v0] Error marking all as read:', error)
        this.$toast.error('Failed to mark notifications as read')
      }
    },
    
    formatDate(dateInput) {
      if (!dateInput) return 'Invalid Date'
      
      try {
        // Handle Firestore Timestamp
        let date
        if (dateInput && typeof dateInput === 'object' && dateInput.toDate) {
          date = dateInput.toDate()
        } else if (dateInput && typeof dateInput === 'object' && dateInput.seconds) {
          // Firestore Timestamp with seconds property
          date = new Date(dateInput.seconds * 1000)
        } else if (typeof dateInput === 'string') {
          date = new Date(dateInput)
        } else if (dateInput instanceof Date) {
          date = dateInput
        } else {
          return 'Invalid Date'
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return 'Invalid Date'
        }
        
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)
        
        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      } catch (error) {
        console.error('Error formatting date:', error, dateInput)
        return 'Invalid Date'
      }
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
