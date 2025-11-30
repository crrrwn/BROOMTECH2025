<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b bg-gray-50">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">
            {{ chatPartner?.role === 'driver' ? 'D' : chatPartner?.role === 'user' ? 'U' : 'S' }}
          </span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">
            {{ getPartnerDisplayName() }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ getPartnerRole() }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <div :class="[
          'w-3 h-3 rounded-full',
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        ]"></div>
        <span class="text-sm text-gray-600">{{ isOnline ? 'Online' : 'Offline' }}</span>
      </div>
    </div>

    <!-- Messages Container -->
    <div 
      ref="messagesContainer" 
      class="flex-1 overflow-y-auto p-4 space-y-4"
      style="max-height: 400px; scroll-behavior: smooth;"
      @scroll="handleScroll"
    >
      <div v-if="loading" class="flex justify-center py-4">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>

      <!-- Messages -->
      <div v-for="message in visibleMessages" :key="message.id" class="flex" :class="getMessageAlignment(message)">
        <div class="max-w-xs lg:max-w-md">
          <!-- Message Bubble -->
          <div :class="getMessageBubbleClass(message)" class="px-4 py-2 rounded-lg relative group">
            <!-- Delete Button (only for own messages that are not deleted) -->
            <button
              v-if="message.senderId === currentUserId && !message.deleted"
              @click="showDeleteConfirm(message.id)"
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              title="Delete message"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <!-- Image Message -->
            <div v-if="message.messageType === 'image' && message.imageUrl" class="mb-2">
              <img
                :src="message.imageUrl"
                alt="Chat image"
                class="max-w-full h-auto rounded-lg cursor-pointer"
                @click="openImagePreview(message.imageUrl)"
              />
            </div>
            
            <!-- Text Message -->
            <p v-if="message.message" class="text-sm">{{ message.message }}</p>
            
            <!-- Message Status -->
            <div class="flex items-center justify-end mt-1 space-x-1">
              <span class="text-xs" :class="message.senderId === currentUserId ? 'text-white opacity-80' : 'text-gray-500'">
                {{ formatTime(message.timestamp) }}
              </span>
              <div v-if="message.senderId === currentUserId" class="flex">
                <svg v-if="message.read" class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex">
        <div class="max-w-xs lg:max-w-md">
          <div class="bg-gray-100 px-4 py-2 rounded-lg">
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="p-4 border-t bg-gray-50">
      <div class="flex items-center space-x-2">
        <!-- Image Upload Button (Gallery) -->
        <button
          @click="triggerImageInput"
          :disabled="uploadingImage"
          class="px-3 py-2 text-gray-600 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload image from gallery"
        >
          <svg v-if="uploadingImage" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        <!-- Camera Capture Button -->
        <button
          @click="triggerCameraInput"
          :disabled="uploadingImage"
          class="px-3 py-2 text-gray-600 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Capture photo with camera"
        >
          <svg v-if="uploadingImage" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <!-- Hidden file input for gallery (no capture attribute) -->
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          @change="handleImageSelect"
          class="hidden"
        />
        
        <!-- Hidden file input for camera (with capture to open device camera directly) -->
        <input
          ref="cameraInput"
          type="file"
          accept="image/*"
          capture="environment"
          @change="handleImageSelect"
          class="hidden"
        />
        
        <div class="flex-1">
          <input
            v-model="newMessage"
            @keypress.enter="sendMessage"
            @input="handleTyping"
            type="text"
            placeholder="Type your message..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || sending"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="sending" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
      
      <!-- Image Upload Progress -->
      <div v-if="uploadingImage" class="mt-2">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary h-2 rounded-full transition-all duration-300"
            :style="{ width: imageUploadProgress + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Uploading image... {{ imageUploadProgress }}%</p>
      </div>
      
      <!-- Quick Actions for different user types -->
      <div v-if="!isDriver" class="flex flex-wrap gap-2 mt-3">
        <button
          v-for="quickAction in quickActions"
          :key="quickAction.text"
          @click="sendQuickMessage(quickAction.text)"
          class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          {{ quickAction.text }}
        </button>
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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeDeleteConfirm"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Message</h3>
        </div>
        <p class="text-gray-700 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeDeleteConfirm"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chatService } from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'
import { storage } from '@/firebase/config'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default {
  name: 'ChatWindow',
  props: {
    chatId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    chatPartner: {
      type: Object,
      default: () => ({})
    },
    isDriver: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      loading: false,
      sending: false,
      isTyping: false,
      isOnline: true,
      typingTimeout: null,
      uploadingImage: false,
      imageUploadProgress: 0,
      showImagePreview: false,
      previewImageUrl: '',
      showDeleteConfirmModal: false,
      messageToDelete: null,
      quickActions: [
        { text: 'Where is my driver?' },
        { text: 'How much will this cost?' },
        { text: 'When will you arrive?' },
        { text: 'I need help' }
      ]
    }
  },
  computed: {
    currentUserId() {
      return this.authStore.user?.uid
    },
    // Filter out deleted messages for users/drivers (admin will see all)
    visibleMessages() {
      return this.messages.filter(message => !message.deleted)
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    }
  },
  async mounted() {
    this.subscribeToMessages()
    this.markMessagesAsRead()
  },
  beforeUnmount() {
    chatService.unsubscribe(`messages_${this.chatId}`)
  },
  methods: {
    subscribeToMessages() {
      chatService.subscribeToMessages(this.chatId, (messages) => {
        this.messages = messages
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      })
    },

    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return

      this.sending = true
      try {
        const senderRole = this.isDriver ? 'driver' : 'user'
        await chatService.sendMessage(
          this.chatId,
          this.currentUserId,
          senderRole,
          this.newMessage.trim()
        )
        this.newMessage = ''
      } catch (error) {
        console.error('Error sending message:', error)
        this.$toast?.error('Failed to send message')
      } finally {
        this.sending = false
      }
    },

    async sendQuickMessage(message) {
      this.newMessage = message
      await this.sendMessage()
    },

    async markMessagesAsRead() {
      try {
        await chatService.markMessagesAsRead(this.chatId, this.currentUserId)
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    },

    handleTyping() {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout)
      }

      this.typingTimeout = setTimeout(() => {
        // Stop typing indicator
      }, 1000)
    },

    handleScroll() {
      // Handle scroll events (for loading more messages, etc.)
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    getMessageAlignment(message) {
      return message.senderId === this.currentUserId ? 'justify-end' : 'justify-start'
    },

    getMessageBubbleClass(message) {
      if (message.senderId === this.currentUserId) {
        return 'bg-primary text-white'
      } else {
        return 'bg-gray-100 text-gray-900'
      }
    },

    getPartnerDisplayName() {
      if (this.chatPartner?.name) {
        return this.chatPartner.name
      }
      return this.isDriver ? 'Customer' : 'Driver'
    },

    getPartnerRole() {
      if (this.isDriver) {
        return 'Customer'
      }
      return this.chatPartner?.role === 'driver' ? 'Your Driver' : 'Driver'
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },

    triggerImageInput() {
      this.$refs.imageInput?.click()
    },

    triggerCameraInput() {
      // Open device camera directly
      const cameraInput = this.$refs.cameraInput
      if (cameraInput) {
        // Ensure capture attribute is set to 'environment' (back camera)
        // This will open the device camera directly on mobile devices
        cameraInput.setAttribute('capture', 'environment')
        cameraInput.setAttribute('accept', 'image/*')
        // Trigger click to open camera app directly
        cameraInput.click()
      }
    },

    async handleImageSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.$toast?.error('Please select an image file')
        return
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        this.$toast?.error('Image size must be less than 10MB')
        return
      }

      try {
        this.uploadingImage = true
        this.imageUploadProgress = 0

        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop() || 'jpg'
        const fileName = `chat_image_${timestamp}_${randomString}.${fileExtension}`
        // Upload path: chat-images/{chatId}/{userId}/{fileName} to match storage rules
        const fileRef = storageRef(storage, `chat-images/${this.chatId}/${this.currentUserId}/${fileName}`)

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
            this.$toast?.error('Failed to upload image. Please try again.')
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              
              // Send image message
              const senderRole = this.isDriver ? 'driver' : 'user'
              await chatService.sendImageMessage(
                this.chatId,
                this.currentUserId,
                senderRole,
                downloadURL
              )
              
              this.uploadingImage = false
              this.imageUploadProgress = 0
              
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
              this.$toast?.error('Failed to send image. Please try again.')
            }
          }
        )
      } catch (error) {
        console.error('Error handling image:', error)
        this.uploadingImage = false
        this.imageUploadProgress = 0
        this.$toast?.error('Failed to process image. Please try again.')
      }
    },

    openImagePreview(imageUrl) {
      this.previewImageUrl = imageUrl
      this.showImagePreview = true
    },

    closeImagePreview() {
      this.showImagePreview = false
      this.previewImageUrl = ''
    },

    showDeleteConfirm(messageId) {
      this.messageToDelete = messageId
      this.showDeleteConfirmModal = true
    },

    closeDeleteConfirm() {
      this.showDeleteConfirmModal = false
      this.messageToDelete = null
    },

    async confirmDelete() {
      if (!this.messageToDelete) {
        this.closeDeleteConfirm()
        return
      }

      const messageId = this.messageToDelete
      this.closeDeleteConfirm()

      try {
        await chatService.deleteMessage(this.chatId, messageId, this.currentUserId)
        // Emit notification event for parent component to handle
        this.$emit('notification', {
          type: 'success',
          message: 'Message deleted successfully'
        })
        // Fallback to toast if parent doesn't handle it
        if (this.$toast) {
          this.$toast.success('Message deleted')
        }
      } catch (error) {
        console.error('Error deleting message:', error)
        // Emit notification event for parent component to handle
        this.$emit('notification', {
          type: 'error',
          message: error.message || 'Failed to delete message'
        })
        // Fallback to toast if parent doesn't handle it
        if (this.$toast) {
          this.$toast.error(error.message || 'Failed to delete message')
        }
      }
    }
  }
}
</script>
