<template>
  <div class="flex flex-col h-full bg-gray-50 rounded-xl sm:rounded-2xl shadow-md overflow-hidden border border-gray-100 font-sans">
    
    <div class="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-[#00C851]/10 to-[#3ED400]/10 border-b border-gray-100 shadow-sm z-10 flex-shrink-0">
      <div class="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
        <div class="relative flex-shrink-0">
          <div class="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-full flex items-center justify-center shadow-md text-white font-bold text-sm sm:text-base md:text-lg border-2 border-white">
            <span v-if="!chatPartner?.avatar">{{ chatPartner?.role === 'driver' ? 'D' : chatPartner?.role === 'user' ? 'U' : 'S' }}</span>
            <img v-else :src="chatPartner.avatar" class="w-full h-full rounded-full object-cover"/>
          </div>
          <div :class="['absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white rounded-full shadow-sm', isOnline ? 'bg-[#3ED400]' : 'bg-gray-300']"></div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 text-sm sm:text-base md:text-lg leading-tight truncate">
            {{ getPartnerDisplayName() }}
          </h3>
          <p class="text-xs font-medium text-gray-500 flex items-center gap-1">
             <span v-if="isOnline" class="w-1.5 h-1.5 rounded-full bg-[#3ED400] animate-pulse"></span>
             {{ isOnline ? 'Active Now' : 'Offline' }}
             <span v-if="getPartnerRole()" class="text-gray-300">•</span>
             <span class="truncate">{{ getPartnerRole() }}</span>
          </p>
        </div>
      </div>
    </div>

    <div 
      ref="messagesContainer" 
      class="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 bg-[#f8fafc] custom-scrollbar"
      style="scroll-behavior: smooth;"
      @scroll="handleScroll"
    >
      <div v-if="loading" class="flex justify-center py-4 sm:py-6">
        <div class="flex items-center space-x-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <div class="w-2 h-2 bg-[#3ED400] rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-[#3ED400] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-[#3ED400] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>

      <div v-for="message in visibleMessages" :key="message.id" class="flex w-full group" :class="getMessageAlignment(message)">
        <div class="flex flex-col max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] relative" :class="message.senderRole === 'admin' ? 'items-center mx-auto' : (message.senderId === currentUserId ? 'items-end' : 'items-start')">
          
          <div 
            class="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 shadow-sm relative text-xs sm:text-sm md:text-base transition-all duration-200"
            :class="getMessageBubbleClass(message)"
          >
            <!-- Admin Badge -->
            <div v-if="message.senderRole === 'admin'" class="flex items-center space-x-2 mb-1">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-200 text-purple-800">
                Admin
              </span>
            </div>
            
            <button
              v-if="message.senderId === currentUserId && !message.deleted"
              @click="showDeleteConfirm(message.id)"
              class="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white hover:scale-110 z-20 shadow-sm border border-red-50"
              title="Delete message"
            >
              <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div v-if="message.messageType === 'image' && message.imageUrl" class="-mx-2 -mt-2 mb-2">
              <img
                :src="message.imageUrl"
                alt="Chat image"
                class="rounded-lg cursor-pointer hover:opacity-95 transition-opacity max-h-48 sm:max-h-56 md:max-h-64 object-cover w-full border border-black/5"
                @click="openImagePreview(message.imageUrl)"
              />
            </div>
            
            <p v-if="message.message" class="leading-relaxed whitespace-pre-wrap break-words">{{ message.message }}</p>
            
            <div class="flex items-center justify-end mt-1 space-x-1 select-none">
              <span class="text-[9px] sm:text-[10px] font-medium opacity-70">
                {{ formatTime(message.timestamp) }}
              </span>
              <div v-if="message.senderId === currentUserId" class="flex ml-1">
                <svg v-if="message.read" class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                <svg v-else class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isTyping" class="flex justify-start animate-in fade-in slide-in-from-bottom-2">
        <div class="bg-white border border-gray-100 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1.5">
          <div class="w-1.5 h-1.5 bg-[#3ED400] rounded-full animate-bounce"></div>
          <div class="w-1.5 h-1.5 bg-[#3ED400] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-1.5 h-1.5 bg-[#3ED400] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>

    <div v-if="!isDriver && quickActions.length > 0" class="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#00C851]/5 to-[#3ED400]/5 border-t border-gray-100 flex flex-wrap gap-1.5 sm:gap-2 justify-center flex-shrink-0">
      <button
        v-for="quickAction in quickActions"
        :key="quickAction.text"
        @click="sendQuickMessage(quickAction.text)"
        class="px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-[#00C851] bg-white border border-[#3ED400] rounded-full hover:bg-gradient-to-r hover:from-[#74E600] hover:to-[#00C851] hover:text-white hover:border-[#00C851] transition-all shadow-sm hover:shadow-md active:scale-95"
      >
        {{ quickAction.text }}
      </button>
    </div>

    <div class="p-3 sm:p-4 bg-white border-t border-gray-100 flex-shrink-0">
      
      <div v-if="uploadingImage" class="mb-2 sm:mb-3 animate-in fade-in">
        <div class="flex justify-between text-xs font-bold text-gray-500 mb-1">
           <span>Uploading Image...</span>
           <span>{{ imageUploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div class="bg-gradient-to-r from-[#74E600] to-[#00C851] h-full rounded-full transition-all duration-300" :style="{ width: imageUploadProgress + '%' }"></div>
        </div>
      </div>

      <div class="flex items-end gap-2 sm:gap-3">
        <div class="flex items-center gap-0.5 sm:gap-1 bg-gray-50 p-1 sm:p-1.5 rounded-xl border border-gray-100 flex-shrink-0">
          <button @click="triggerImageInput" :disabled="uploadingImage" class="p-1.5 sm:p-2 text-gray-400 hover:text-[#00C851] hover:bg-white rounded-lg transition-all" title="Upload from Gallery">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
          
          <button @click="triggerCameraInput" :disabled="uploadingImage" class="p-1.5 sm:p-2 text-gray-400 hover:text-[#00C851] hover:bg-white rounded-lg transition-all" title="Use Camera">
             <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>

        <input ref="imageInput" type="file" accept="image/*" @change="handleImageSelect" class="hidden" />
        <input ref="cameraInput" type="file" accept="image/*" capture="environment" @change="handleImageSelect" class="hidden" />

        <div class="flex-1 relative min-w-0">
          <textarea
            v-model="newMessage"
            @keypress.enter.prevent="sendMessage"
            @input="handleTyping"
            rows="1"
            placeholder="Type a message..."
            class="w-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] outline-none resize-none text-gray-700 placeholder-gray-400 text-xs sm:text-sm max-h-24 custom-scrollbar"
            style="min-height: 40px;"
          ></textarea>
        </div>

        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || sending"
          class="p-2.5 sm:p-3 bg-gradient-to-r from-[#74E600] to-[#00C851] text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95 flex-shrink-0"
        >
          <svg v-if="sending" class="w-5 h-5 sm:w-6 sm:h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <svg v-else class="w-5 h-5 sm:w-6 sm:h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showImagePreview" class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[110] p-4" @click="closeImagePreview">
        <button @click="closeImagePreview" class="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-10">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img :src="previewImageUrl" class="max-w-full max-h-[85vh] rounded-lg shadow-2xl animate-in zoom-in-95" @click.stop />
      </div>
    </transition>

    <div v-if="showDeleteConfirmModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4" @click="closeDeleteConfirm">
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-xs w-full p-4 sm:p-6 animate-in zoom-in-95 border border-gray-100" @click.stop>
        <div class="text-center">
          <div class="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-red-600">
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>
          <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2">Delete Message?</h3>
          <p class="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">This message will be removed for everyone.</p>
          <div class="flex gap-2 sm:gap-3">
            <button @click="closeDeleteConfirm" class="flex-1 py-2 sm:py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors text-sm">Cancel</button>
            <button @click="confirmDelete" class="flex-1 py-2 sm:py-2.5 bg-red-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-red-700 shadow-md transition-colors text-sm">Delete</button>
          </div>
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
    // Initialize real-time message subscription (Firestore onSnapshot)
    this.subscribeToMessages()
    this.markMessagesAsRead()
  },
  beforeUnmount() {
    // Clean up real-time subscription when component unmounts
    chatService.unsubscribe(`messages_${this.chatId}`)
  },
  methods: {
    // Real-time message subscription using Firestore onSnapshot
    // Messages update automatically when new messages are sent
    subscribeToMessages() {
      if (!this.chatId) {
        console.error('[ChatWindow] Cannot subscribe: chatId is missing')
        return
      }
      
      try {
        chatService.subscribeToMessages(this.chatId, (messages) => {
          this.messages = messages
          this.loading = false
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        })
      } catch (error) {
        console.error('[ChatWindow] Error subscribing to messages:', error)
        this.loading = false
        // Emit error notification to parent
        this.$emit('notification', {
          type: 'error',
          message: `Failed to load messages: ${error.message || 'Please try again'}`
        })
      }
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
      if (!this.chatId || !this.currentUserId) {
        return
      }
      try {
        await chatService.markMessagesAsRead(this.chatId, this.currentUserId)
      } catch (error) {
        console.error('Error marking messages as read:', error)
        // Don't show error to user - this is a non-critical operation
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
      if (message.senderRole === 'admin') {
        return 'justify-center'
      }
      return message.senderId === this.currentUserId ? 'justify-end' : 'justify-start'
    },

    getMessageBubbleClass(message) {
      if (message.senderRole === 'admin') {
        return 'bg-purple-100 border border-purple-200 text-purple-900 rounded-xl sm:rounded-2xl'
      } else if (message.senderId === this.currentUserId) {
        return 'bg-gradient-to-r from-[#74E600] to-[#00C851] text-white rounded-xl sm:rounded-2xl rounded-br-none shadow-sm'
      } else {
        return 'bg-white border border-gray-100 text-gray-800 rounded-xl sm:rounded-2xl rounded-bl-none shadow-sm'
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar { 
  width: 6px; 
}
.custom-scrollbar::-webkit-scrollbar-track { 
  background: #f1f1f1; 
  border-radius: 4px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background-color: #cbd5e1; 
  border-radius: 20px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { 
  background-color: #94a3b8; 
}
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>