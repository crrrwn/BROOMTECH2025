<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">Chat Monitoring</h2>
          <p class="text-gray-600 mt-1">Monitor all conversations between users and drivers</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="bg-white rounded-lg border px-4 py-2">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-gray-700">{{ activeChats.length }} Active Chats</span>
            </div>
          </div>
          <button
            @click="refreshChats"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat List -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-4 border-b bg-gray-50">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">All Conversations</h3>
              <div class="flex items-center space-x-2">
                <select
                  v-model="filterStatus"
                  @change="filterChats"
                  class="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Chats</option>
                  <option value="active">Active</option>
                  <option value="urgent">Urgent</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="divide-y max-h-96 overflow-y-auto">
            <div
              v-for="chat in filteredChats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="[
                'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                selectedChatId === chat.id ? 'bg-blue-50 border-r-4 border-primary' : '',
                chat.isUrgent ? 'border-l-4 border-red-500' : ''
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3 flex-1 min-w-0">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="text-gray-600 text-sm font-medium">
                        {{ chat.customerName ? chat.customerName.charAt(0) : 'U' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <p class="font-medium text-gray-900 truncate">
                        {{ chat.customerName || 'Customer' }}
                      </p>
                      <span v-if="chat.isUrgent" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Urgent
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 truncate">
                      Driver: {{ chat.driverName || 'Unassigned' }}
                    </p>
                    <p class="text-sm text-gray-600 truncate">
                      Order #{{ chat.orderId }}
                    </p>
                    <p class="text-xs text-gray-500 truncate mt-1">
                      {{ chat.lastMessage }}
                    </p>
                  </div>
                </div>
                <div class="text-right flex-shrink-0 ml-2">
                  <p class="text-xs text-gray-500">{{ formatChatTime(chat.lastMessageAt) }}</p>
                  <div class="flex items-center justify-end mt-1 space-x-1">
                    <div v-if="getTotalUnreadCount(chat) > 0" class="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                      {{ getTotalUnreadCount(chat) }}
                    </div>
                    <div :class="[
                      'w-2 h-2 rounded-full',
                      getActivityStatus(chat) === 'active' ? 'bg-green-500' : 
                      getActivityStatus(chat) === 'recent' ? 'bg-yellow-500' : 'bg-gray-400'
                    ]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="filteredChats.length === 0" class="p-8 text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p class="text-gray-600">No conversations found</p>
              <p class="text-sm text-gray-500 mt-1">Chats will appear here when users and drivers communicate</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Viewer -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border">
          <div v-if="selectedChat" class="flex flex-col" style="height: 600px;">
            <!-- Chat Header -->
            <div class="p-4 border-b bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">
                      {{ selectedChat.customerName ? selectedChat.customerName.charAt(0) : 'U' }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">
                      {{ selectedChat.customerName || 'Customer' }} ↔ {{ selectedChat.driverName || 'Driver' }}
                    </h3>
                    <p class="text-sm text-gray-600">Order #{{ selectedChat.orderId }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="markAsUrgent(selectedChat)"
                    :class="[
                      'px-3 py-1 text-sm rounded-lg border',
                      selectedChat.isUrgent 
                        ? 'bg-red-100 text-red-700 border-red-300' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ selectedChat.isUrgent ? 'Urgent' : 'Mark Urgent' }}
                  </button>
                  <button
                    @click="exportChat(selectedChat)"
                    class="px-3 py-1 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Display -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4" style="scroll-behavior: smooth;" ref="messagesContainer">
              <div v-for="message in selectedChatMessages" :key="message.id" class="flex" :class="getMessageAlignment(message)">
                <div class="max-w-xs lg:max-w-md">
                  <div :class="getMessageBubbleClass(message)" class="px-4 py-2 rounded-lg">
                    <!-- Sender Info -->
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-xs font-medium">
                        {{ getSenderName(message) }}
                      </span>
                      <span v-if="message.senderRole === 'bot'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Bot
                      </span>
                      <span v-if="message.senderRole === 'admin'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    </div>
                    
                    <!-- Deleted Message Indicator -->
                    <div v-if="message.deleted" class="mb-2 flex items-center space-x-2">
                      <span class="text-xs text-red-600 font-medium">[DELETED]</span>
                      <span class="text-xs text-gray-500">
                        Deleted at: {{ formatTime(message.deletedAt) }}
                      </span>
                    </div>
                    
                    <!-- Image Message - Show even if deleted (for admin monitoring) -->
                    <div v-if="message.messageType === 'image' && message.imageUrl" class="mb-2">
                      <div v-if="message.deleted" class="mb-1 flex items-center space-x-2">
                        <span class="text-xs text-red-600 font-medium">[DELETED PHOTO]</span>
                        <span class="text-xs text-gray-500">
                          Deleted by: {{ getSenderName(message) }}
                        </span>
                      </div>
                      <div :class="message.deleted ? 'opacity-50 border-2 border-red-300' : ''">
                        <img
                          :src="message.imageUrl"
                          :alt="message.deleted ? 'Deleted chat image' : 'Chat image'"
                          class="max-w-full h-auto rounded-lg cursor-pointer"
                          @click="openImagePreview(message.imageUrl)"
                        />
                      </div>
                    </div>
                    
                    <!-- Text Message (show original even if deleted) -->
                    <div v-if="editingMessageId === message.id" class="mb-2">
                      <textarea
                        v-model="editingMessageText"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows="2"
                        @keypress.enter.ctrl="saveEditMessage"
                        @keypress.escape="cancelEditMessage"
                      ></textarea>
                      <div class="flex items-center space-x-2 mt-2">
                        <button @click="saveEditMessage" class="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark">
                          Save
                        </button>
                        <button @click="cancelEditMessage" class="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                          Cancel
                        </button>
                      </div>
                    </div>
                    <p v-else-if="message.message" :class="message.deleted ? 'text-sm line-through opacity-50' : 'text-sm'">
                      {{ message.edited ? '(edited) ' : '' }}{{ message.message }}
                    </p>
                    
                    <div class="flex items-center justify-between mt-1">
                      <div class="flex items-center space-x-2">
                        <!-- Admin Edit/Delete Buttons -->
                        <div v-if="message.senderRole === 'admin' && !message.deleted && !editingMessageId" class="flex items-center space-x-1">
                          <button
                            @click="startEditMessage(message)"
                            class="text-xs text-gray-500 hover:text-primary px-1"
                            title="Edit message"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            @click="deleteAdminMessage(message.id)"
                            class="text-xs text-gray-500 hover:text-red-600 px-1"
                            title="Delete message"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <span class="text-xs" :class="message.senderRole === 'driver' ? 'text-white opacity-80' : 'text-gray-500'">
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Chat Input -->
            <div v-if="selectedChat" class="p-4 border-t bg-gray-50">
              <!-- Saved Replies Section -->
              <div v-if="showSavedReplies" class="mb-3 p-3 bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-semibold text-gray-700">Saved Replies</h4>
                  <button @click="showSavedReplies = false" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="space-y-2">
                  <div v-for="(reply, index) in savedReplies" :key="index" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <p class="text-sm text-gray-700 flex-1">{{ reply }}</p>
                    <div class="flex items-center space-x-1">
                      <button @click="useSavedReply(reply)" class="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded">
                        Use
                      </button>
                      <button @click="deleteSavedReply(index)" class="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div v-if="savedReplies.length === 0" class="text-sm text-gray-500 text-center py-2">
                    No saved replies yet
                  </div>
                </div>
              </div>

              <!-- Upload Progress -->
              <div v-if="uploadingImage" class="mb-3">
                <div class="flex justify-between text-xs font-medium text-gray-600 mb-1">
                  <span>Uploading Image...</span>
                  <span>{{ imageUploadProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full transition-all" :style="{ width: imageUploadProgress + '%' }"></div>
                </div>
              </div>

              <!-- Chat Input Controls -->
              <div class="flex items-end gap-2">
                <div class="flex items-center gap-1 bg-white p-1.5 rounded-lg border border-gray-200">
                  <button @click="triggerImageInput" :disabled="uploadingImage" class="p-2 text-gray-400 hover:text-primary rounded transition-all" title="Upload from Gallery">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button @click="triggerCameraInput" :disabled="uploadingImage" class="p-2 text-gray-400 hover:text-primary rounded transition-all" title="Use Camera">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button @click="showSavedReplies = !showSavedReplies" class="p-2 text-gray-400 hover:text-primary rounded transition-all" title="Saved Replies">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button v-if="newMessage && newMessage.trim()" @click="saveCurrentReply" class="p-2 text-gray-400 hover:text-primary rounded transition-all" title="Save as Reply">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>

                <input ref="imageInput" type="file" accept="image/*" @change="handleImageSelect" class="hidden" />
                <input ref="cameraInput" type="file" accept="image/*" capture="environment" @change="handleImageSelect" class="hidden" />

                <div class="flex-1 relative">
                  <textarea
                    v-model="newMessage"
                    @keypress.enter.prevent="sendAdminMessage"
                    rows="1"
                    placeholder="Type a message as admin..."
                    class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none text-sm"
                    style="min-height: 40px; max-height: 120px;"
                  ></textarea>
                </div>

                <button
                  @click="sendAdminMessage"
                  :disabled="!newMessage.trim() || sendingMessage || uploadingImage"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <svg v-if="sendingMessage" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- No Chat Selected -->
          <div v-else class="flex items-center justify-center h-96">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
              <p class="text-gray-600">Choose a chat from the left to monitor the conversation</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showImagePreview"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="closeImagePreview"
    >
      <div class="max-w-4xl max-h-[90vh] relative" @click.stop>
        <button
          @click="closeImagePreview"
          class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
        >
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="previewImageUrl"
          alt="Preview"
          class="max-w-full max-h-[90vh] rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { chatService } from '@/services/chatService'
import { db, storage } from '@/firebase/config'
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, deleteDoc, onSnapshot } from 'firebase/firestore'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'AdminChatMonitoring',
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    return { authStore, toast }
  },
  data() {
    return {
      allChats: [],
      filteredChats: [],
      selectedChat: null,
      selectedChatId: null,
      selectedChatMessages: [],
      filterStatus: 'all',
      loading: true,
      showImagePreview: false,
      previewImageUrl: '',
      // Admin chat input
      newMessage: '',
      sendingMessage: false,
      uploadingImage: false,
      imageUploadProgress: 0,
      showSavedReplies: false,
      savedReplies: [],
      // Edit message
      editingMessageId: null,
      editingMessageText: '',
      // Chat updates subscription
      chatUpdateUnsubscribe: null
    }
  },
  computed: {
    activeChats() {
      return this.allChats.filter(chat => this.getActivityStatus(chat) === 'active')
    },
    urgentChats() {
      return this.allChats.filter(chat => chat.isUrgent)
    }
  },
  async mounted() {
    await this.loadAllChats()
    await this.loadSavedReplies()
  },
  beforeUnmount() {
    chatService.unsubscribe('admin_all_chats')
    if (this.selectedChatId) {
      chatService.unsubscribe(`messages_${this.selectedChatId}`)
    }
    if (this.chatUpdateUnsubscribe) {
      this.chatUpdateUnsubscribe()
    }
  },
  methods: {
    async loadAllChats() {
      try {
        this.loading = true
        
        // Subscribe to all chats for admin monitoring
        chatService.subscribeToAllChats(async (chats) => {
          // Enhance chats with user and driver information
          const enhancedChats = await Promise.all(
            chats.map(async (chat) => {
              try {
                // Get customer info
                const customerDoc = await getDoc(doc(db, 'users', chat.userId))
                const customerData = customerDoc.exists() ? customerDoc.data() : {}
                
                // Get driver info
                let driverData = {}
                if (chat.driverId) {
                  const driverDoc = await getDoc(doc(db, 'users', chat.driverId))
                  driverData = driverDoc.exists() ? driverDoc.data() : {}
                }
                
                return {
                  ...chat,
                  customerName: customerData.firstName && customerData.lastName 
                    ? `${customerData.firstName} ${customerData.lastName}`
                    : 'Customer',
                  driverName: driverData.firstName && driverData.lastName 
                    ? `${driverData.firstName} ${driverData.lastName}`
                    : null,
                  isUrgent: chat.isUrgent || false
                }
              } catch (error) {
                console.error('Error loading chat participants:', error)
                return { ...chat, customerName: 'Customer', driverName: null }
              }
            })
          )
          
          this.allChats = enhancedChats
          this.filterChats()
        })
      } catch (error) {
        console.error('Error loading chats:', error)
      } finally {
        this.loading = false
      }
    },

    filterChats() {
      switch (this.filterStatus) {
        case 'active':
          this.filteredChats = this.allChats.filter(chat => this.getActivityStatus(chat) === 'active')
          break
        case 'urgent':
          this.filteredChats = this.allChats.filter(chat => chat.isUrgent)
          break
        case 'resolved':
          this.filteredChats = this.allChats.filter(chat => this.getActivityStatus(chat) === 'inactive')
          break
        default:
          this.filteredChats = [...this.allChats]
      }
    },

    async selectChat(chat) {
      this.selectedChat = chat
      this.selectedChatId = chat.id
      
      // Unsubscribe from previous chat messages
      if (this.selectedChatId) {
        chatService.unsubscribe(`messages_${this.selectedChatId}`)
      }
      
      // Mark messages as read for both user and driver when admin views the chat
      try {
        const adminId = this.authStore.user?.uid
        if (adminId && chat.userId && chat.driverId) {
          // Mark as read for user
          await chatService.markMessagesAsRead(chat.id, chat.userId)
          // Mark as read for driver
          await chatService.markMessagesAsRead(chat.id, chat.driverId)
          
          // Update local chat unread count to 0
          const chatIndex = this.allChats.findIndex(c => c.id === chat.id)
          if (chatIndex !== -1) {
            this.allChats[chatIndex].unreadCount = {
              [chat.userId]: 0,
              [chat.driverId]: 0
            }
            // Update selectedChat as well
            chat.unreadCount = {
              [chat.userId]: 0,
              [chat.driverId]: 0
            }
          }
        }
      } catch (error) {
        console.error('Error marking messages as read:', error)
        // Don't show error to user - this is a background operation
      }
      
      // Subscribe to selected chat messages
      chatService.subscribeToMessages(chat.id, (messages) => {
        this.selectedChatMessages = messages
      })
      
      // Also subscribe to chat updates to get real-time unread count changes
      this.subscribeToChatUpdates(chat.id)
    },

    subscribeToChatUpdates(chatId) {
      // Unsubscribe from previous chat updates if any
      if (this.chatUpdateUnsubscribe) {
        this.chatUpdateUnsubscribe()
      }
      
      // Subscribe to chat document updates for unread count
      const chatRef = doc(db, 'chats', chatId)
      const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data()
          // Update unread count in local chat list
          const chatIndex = this.allChats.findIndex(c => c.id === chatId)
          if (chatIndex !== -1) {
            this.allChats[chatIndex].unreadCount = chatData.unreadCount || {}
          }
          // Update selected chat if it's the current one
          if (this.selectedChat && this.selectedChat.id === chatId) {
            this.selectedChat.unreadCount = chatData.unreadCount || {}
          }
        }
      }, (error) => {
        console.error('Error subscribing to chat updates:', error)
      })
      
      this.chatUpdateUnsubscribe = unsubscribe
    },

    async markAsUrgent(chat) {
      try {
        const chatRef = doc(db, 'chats', chat.id)
        const newUrgentStatus = !chat.isUrgent
        
        await updateDoc(chatRef, {
          isUrgent: newUrgentStatus,
          updatedAt: new Date()
        })
        
        // Update local state
        chat.isUrgent = newUrgentStatus
        
        this.toast.success(
          newUrgentStatus ? 'Chat marked as urgent' : 'Chat unmarked as urgent'
        )
      } catch (error) {
        console.error('Error updating chat urgency:', error)
        this.toast.error('Failed to update chat status')
      }
    },

    exportChat(chat) {
      // Export chat functionality
      const chatData = {
        chatId: chat.id,
        orderId: chat.orderId,
        customer: chat.customerName,
        driver: chat.driverName,
        messages: this.selectedChatMessages,
        exportedAt: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(chatData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `chat-${chat.orderId}-${Date.now()}.json`
      link.click()
      
      this.toast.success('Chat exported successfully')
    },

    refreshChats() {
      this.loadAllChats()
      this.toast.success('Chats refreshed')
    },

    getActivityStatus(chat) {
      if (!chat.lastMessageAt) return 'inactive'
      
      const now = new Date()
      const lastMessage = chat.lastMessageAt.toDate ? chat.lastMessageAt.toDate() : new Date(chat.lastMessageAt)
      const diffInMinutes = (now - lastMessage) / (1000 * 60)
      
      if (diffInMinutes < 5) return 'active'
      if (diffInMinutes < 30) return 'recent'
      return 'inactive'
    },

    getTotalUnreadCount(chat) {
      if (!chat.unreadCount) return 0
      return Object.values(chat.unreadCount).reduce((total, count) => total + count, 0)
    },

    getMessageAlignment(message) {
      if (message.senderRole === 'admin') {
        return 'justify-center'
      }
      return message.senderRole === 'user' ? 'justify-start' : 'justify-end'
    },

    getMessageBubbleClass(message) {
      if (message.senderRole === 'bot') {
        return 'bg-blue-50 text-blue-900 border border-blue-200'
      } else if (message.senderRole === 'admin') {
        return 'bg-purple-100 text-purple-900 border border-purple-200'
      } else if (message.senderRole === 'user') {
        return 'bg-gray-100 text-gray-900'
      } else {
        return 'bg-primary text-white'
      }
    },

    getSenderName(message) {
      if (message.senderRole === 'bot') return 'BroomTech Bot'
      if (message.senderRole === 'admin') return 'Admin'
      if (message.senderRole === 'user') return this.selectedChat?.customerName || 'Customer'
      if (message.senderRole === 'driver') return this.selectedChat?.driverName || 'Driver'
      return 'Unknown'
    },

    formatChatTime(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)

      if (diffInHours < 1) {
        return 'Just now'
      } else if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        return date.toLocaleDateString()
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },

    openImagePreview(imageUrl) {
      this.previewImageUrl = imageUrl
      this.showImagePreview = true
    },

    closeImagePreview() {
      this.showImagePreview = false
      this.previewImageUrl = ''
    },

    // Admin chat methods
    async sendAdminMessage() {
      if (!this.newMessage || !this.newMessage.trim() || this.sendingMessage || !this.selectedChat) return

      this.sendingMessage = true
      try {
        const adminId = this.authStore.user?.uid || 'admin'
        await chatService.sendMessage(
          this.selectedChat.id,
          adminId,
          'admin',
          this.newMessage.trim()
        )
        this.newMessage = ''
        this.scrollToBottom()
      } catch (error) {
        console.error('Error sending admin message:', error)
        this.toast.error('Failed to send message')
      } finally {
        this.sendingMessage = false
      }
    },

    triggerImageInput() {
      this.$refs.imageInput?.click()
    },

    triggerCameraInput() {
      this.$refs.cameraInput?.click()
    },

    async handleImageSelect(event) {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        this.toast.error('Please select an image file')
        return
      }

      try {
        this.uploadingImage = true
        this.imageUploadProgress = 0

        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop() || 'jpg'
        const fileName = `admin_chat_image_${timestamp}_${randomString}.${fileExtension}`
        const adminId = this.authStore.user?.uid || 'admin'
        const fileRef = storageRef(storage, `chat-images/${this.selectedChat.id}/${adminId}/${fileName}`)

        const uploadTask = uploadBytesResumable(fileRef, file)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.imageUploadProgress = Math.round(progress)
          },
          (error) => {
            console.error('Error uploading image:', error)
            this.uploadingImage = false
            this.imageUploadProgress = 0
            this.toast.error('Failed to upload image. Please try again.')
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              
              const adminId = this.authStore.user?.uid || 'admin'
              await chatService.sendImageMessage(
                this.selectedChat.id,
                adminId,
                'admin',
                downloadURL
              )
              
              this.uploadingImage = false
              this.imageUploadProgress = 0
              this.scrollToBottom()
              
              // Reset file inputs
              if (this.$refs.imageInput) {
                this.$refs.imageInput.value = ''
              }
              if (this.$refs.cameraInput) {
                this.$refs.cameraInput.value = ''
              }
            } catch (error) {
              console.error('Error sending image message:', error)
              this.uploadingImage = false
              this.imageUploadProgress = 0
              this.toast.error('Failed to send image. Please try again.')
            }
          }
        )
      } catch (error) {
        console.error('Error handling image:', error)
        this.uploadingImage = false
        this.imageUploadProgress = 0
        this.toast.error('Failed to process image. Please try again.')
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messagesContainer) {
          this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
        }
      })
    },

    // Saved replies methods
    async loadSavedReplies() {
      try {
        const adminId = this.authStore.user?.uid
        if (!adminId) {
          // Fallback to localStorage
          this.loadSavedRepliesFromLocalStorage()
          return
        }

        // Try to load from Firestore first
        const savedRepliesRef = collection(db, 'savedReplies')
        const q = query(savedRepliesRef, where('adminId', '==', adminId))
        const snapshot = await getDocs(q)
        this.savedReplies = snapshot.docs.map(doc => doc.data().text)
        
        // Also save to localStorage as backup
        if (this.savedReplies.length > 0) {
          localStorage.setItem(`savedReplies_${adminId}`, JSON.stringify(this.savedReplies))
        }
      } catch (error) {
        // Silently fallback to localStorage if Firestore fails (permission denied is expected)
        // Don't log permission errors - they're expected and we have localStorage fallback
        if (error.code !== 'permission-denied') {
          console.error('Error loading saved replies:', error)
        }
        // Fallback to localStorage if Firestore fails
        this.loadSavedRepliesFromLocalStorage()
      }
    },

    loadSavedRepliesFromLocalStorage() {
      try {
        const adminId = this.authStore.user?.uid
        if (adminId) {
          const saved = localStorage.getItem(`savedReplies_${adminId}`)
          if (saved) {
            this.savedReplies = JSON.parse(saved)
          } else {
            this.savedReplies = []
          }
        } else {
          this.savedReplies = []
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        this.savedReplies = []
      }
    },

    useSavedReply(reply) {
      this.newMessage = reply
      this.showSavedReplies = false
    },

    async saveCurrentReply() {
      if (!this.newMessage || !this.newMessage.trim()) {
        this.toast.error('Please enter a message to save')
        return
      }

      const replyText = this.newMessage.trim()
      const adminId = this.authStore.user?.uid
      
      if (!adminId) {
        this.toast.error('Admin ID not found')
        return
      }

      // Always save to localStorage as primary storage
      try {
        this.savedReplies.push(replyText)
        localStorage.setItem(`savedReplies_${adminId}`, JSON.stringify(this.savedReplies))
      } catch (localError) {
        console.error('Error saving to localStorage:', localError)
      }

      // Try to save to Firestore as backup (optional)
      try {
        const savedRepliesRef = collection(db, 'savedReplies')
        await addDoc(savedRepliesRef, {
          adminId: adminId,
          text: replyText,
          createdAt: new Date()
        })
        // Success - saved to both localStorage and Firestore
        this.toast.success('Reply saved successfully')
      } catch (error) {
        // Firestore save failed, but localStorage save succeeded
        console.error('Error saving reply to Firestore:', error)
        // Still show success since we saved to localStorage
        if (error.code !== 'permission-denied') {
          this.toast.success('Reply saved locally')
        } else {
          // Silent fail for permission denied - localStorage is working
          this.toast.success('Reply saved')
        }
      }
    },

    async deleteSavedReply(index) {
      const adminId = this.authStore.user?.uid
      if (!adminId) {
        this.toast.error('Admin ID not found')
        return
      }

      const replyText = this.savedReplies[index]
      
      // Always delete from localStorage
      try {
        this.savedReplies.splice(index, 1)
        localStorage.setItem(`savedReplies_${adminId}`, JSON.stringify(this.savedReplies))
        this.toast.success('Reply deleted')
      } catch (localError) {
        console.error('Error deleting from localStorage:', localError)
        this.toast.error('Failed to delete reply')
        return
      }

      // Try to delete from Firestore (optional)
      try {
        const savedRepliesRef = collection(db, 'savedReplies')
        const q = query(
          savedRepliesRef,
          where('adminId', '==', adminId),
          where('text', '==', replyText)
        )
        const snapshot = await getDocs(q)
        
        if (!snapshot.empty) {
          await deleteDoc(snapshot.docs[0].ref)
        }
      } catch (error) {
        // Firestore delete failed, but localStorage delete succeeded
        console.error('Error deleting reply from Firestore:', error)
        // Don't show error - localStorage delete already succeeded
      }
    },

    // Edit and delete admin messages
    startEditMessage(message) {
      this.editingMessageId = message.id
      this.editingMessageText = message.message || ''
    },

    cancelEditMessage() {
      this.editingMessageId = null
      this.editingMessageText = ''
    },

    async saveEditMessage() {
      if (!this.editingMessageId || !this.editingMessageText || !this.editingMessageText.trim()) {
        this.toast.error('Message cannot be empty')
        return
      }

      try {
        const adminId = this.authStore.user?.uid
        if (!adminId || !this.selectedChat) {
          this.toast.error('Unable to edit message')
          return
        }

        await chatService.editMessage(
          this.selectedChat.id,
          this.editingMessageId,
          adminId,
          this.editingMessageText.trim()
        )

        this.editingMessageId = null
        this.editingMessageText = ''
        this.toast.success('Message updated')
      } catch (error) {
        console.error('Error editing message:', error)
        this.toast.error('Failed to edit message: ' + (error.message || 'Unknown error'))
      }
    },

    async deleteAdminMessage(messageId) {
      if (!confirm('Are you sure you want to delete this message?')) {
        return
      }

      try {
        const adminId = this.authStore.user?.uid
        if (!adminId || !this.selectedChat) {
          this.toast.error('Unable to delete message')
          return
        }

        await chatService.deleteMessage(this.selectedChat.id, messageId, adminId)
        this.toast.success('Message deleted')
      } catch (error) {
        console.error('Error deleting message:', error)
        this.toast.error('Failed to delete message: ' + (error.message || 'Unknown error'))
      }
    }
  }
}
</script>
