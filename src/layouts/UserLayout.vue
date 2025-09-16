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

            <!-- Removed chatbot navigation link, kept only chat messages -->
            <router-link
              :to="{ name: 'user-chat-messages' }"
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              active-class="bg-primary text-white"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Chat Messages
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

export default {
  name: 'UserLayout',
  components: {
    FloatingChatbot
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  computed: {
    pageTitle() {
      const titles = {
        'user-dashboard': 'Dashboard',
        'book-service': 'Book a Service',
        'my-orders': 'My Orders',
        'user-profile': 'Profile',
        'user-chat-messages': 'Chat Messages'
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
    async logout() {
      const result = await this.authStore.logout()
      if (result.success) {
        this.$toast.success(result.message)
        this.$router.push('/')
      } else {
        this.$toast.error(result.message)
      }
    }
  }
}
</script>
