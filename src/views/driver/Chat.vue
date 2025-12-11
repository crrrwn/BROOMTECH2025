<template>
  <div class="min-h-screen bg-gray-50/50 pb-20 font-sans h-screen flex flex-col">
    <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col gap-6">

      <div class="relative overflow-hidden bg-gradient-to-br from-[#74E600] to-[#00C851] rounded-3xl p-6 md:p-8 shadow-lg text-white shrink-0">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex items-center gap-4">
          <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
             <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </div>
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight">Messages</h1>
            <p class="text-green-50 font-medium">Chat with customers about active orders.</p>
          </div>
        </div>
      </div>

      <div class="flex-1 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex min-h-0">
        
        <div :class="['w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col bg-white', selectedChatId ? 'hidden md:flex' : 'flex']">
           
           <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 class="font-bold text-gray-700 text-sm uppercase tracking-wide">Conversations</h3>
              <span class="bg-[#3ED400] text-white text-[10px] font-bold px-2 py-1 rounded-full">{{ activeChats.length }} Active</span>
           </div>

           <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              
              <div v-if="loading" class="p-4 text-center text-gray-400 text-sm">Loading chats...</div>
              
              <div v-else-if="activeChats.length === 0" class="flex flex-col items-center justify-center h-64 text-center px-6">
                 <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-300">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                 </div>
                 <p class="text-gray-500 font-medium">No active conversations</p>
                 <p class="text-xs text-gray-400 mt-1">Chats appear when you accept an order.</p>
              </div>

              <div 
                v-for="chat in activeChats" 
                :key="chat.id" 
                @click="selectChat(chat)"
                class="relative p-4 rounded-xl cursor-pointer transition-all duration-200 border group hover:bg-gray-50"
                :class="selectedChatId === chat.id ? 'bg-green-50 border-[#3ED400]' : 'bg-white border-transparent hover:border-gray-200'"
              >
                 <div class="flex items-center gap-3">
                    <div class="relative shrink-0">
                       <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg border-2 border-white shadow-sm overflow-hidden">
                          <span v-if="!chat.customerAvatar">{{ chat.customerName ? chat.customerName.charAt(0).toUpperCase() : 'C' }}</span>
                          <img v-else :src="chat.customerAvatar" class="w-full h-full object-cover" />
                       </div>
                    </div>
                    <div class="flex-1 min-w-0">
                       <div class="flex justify-between items-baseline mb-0.5">
                          <h4 class="font-bold text-gray-900 truncate text-sm" :class="{'text-[#3ED400]': selectedChatId === chat.id}">{{ chat.customerName || 'Customer' }}</h4>
                          <span class="text-[10px] text-gray-400 shrink-0">{{ formatChatTime(chat.lastMessageAt) }}</span>
                       </div>
                       <p class="text-xs text-gray-500 truncate pr-2">{{ chat.lastMessage || 'No messages yet' }}</p>
                       <p class="text-[10px] text-gray-400 mt-1 font-mono">Order #{{ chat.orderId ? chat.orderId.substring(0,8).toUpperCase() : 'N/A' }}</p>
                    </div>
                    <div v-if="chat.unreadCount && chat.unreadCount[currentDriverId] > 0" class="shrink-0">
                       <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{{ chat.unreadCount[currentDriverId] }}</span>
                    </div>
                 </div>
              </div>

           </div>
        </div>

        <div :class="['flex-1 flex flex-col bg-white relative', !selectedChatId ? 'hidden md:flex' : 'flex']">
           
           <div v-if="selectedChatId" class="md:hidden px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white shadow-sm z-20">
              <button @click="selectedChatId = null" class="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs border border-white shadow-sm overflow-hidden">
                    <img v-if="selectedChatPartner?.avatar" :src="selectedChatPartner.avatar" class="w-full h-full object-cover"/>
                    <span v-else>{{ selectedChatPartner?.name?.charAt(0) || 'C' }}</span>
                 </div>
                 <h3 class="font-bold text-gray-900 text-sm">{{ selectedChatPartner?.name || 'Customer' }}</h3>
              </div>
           </div>

           <div v-if="!selectedChatId" class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
              <div class="w-32 h-32 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 animate-in zoom-in-95 duration-500">
                 <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Select a Conversation</h2>
              <p class="text-gray-500 max-w-sm">Choose a customer from the sidebar to start chatting about their order.</p>
           </div>

           <div v-else class="flex-1 overflow-hidden relative bg-white">
              <ChatWindow
                 :chat-id="selectedChatId"
                 :order-id="selectedOrderId"
                 :chat-partner="selectedChatPartner"
                 :is-driver="true"
                 class="h-full w-full"
              />
           </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ChatWindow from '@/components/ChatWindow.vue'
import { chatService } from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'
import { db } from '@/firebase/config'
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'

export default {
  name: 'DriverChat',
  components: { ChatWindow },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      activeChats: [],
      selectedChatId: null,
      selectedOrderId: null,
      selectedChatPartner: null,
      loading: true,
      unsubscribeOrders: null
    }
  },
  computed: {
    currentDriverId() { return this.authStore.user?.uid }
  },
  async mounted() {
    await this.loadActiveChats()
    const orderId = this.$route.query.orderId
    if (orderId) {
      this.$nextTick(() => {
        const chat = this.activeChats.find(c => c.orderId === orderId)
        if (chat) this.selectChat(chat)
      })
    }
  },
  beforeUnmount() {
    if (this.unsubscribeOrders) this.unsubscribeOrders()
    // chatService.unsubscribe logic if applicable
  },
  methods: {
    async loadActiveChats() {
      try {
        this.loading = true
        if (!this.currentDriverId) return

        const q = query(
          collection(db, 'orders'),
          where('driverId', '==', this.currentDriverId),
          where('status', 'in', ['driver_assigned', 'in_transit', 'on_the_way', 'arrived'])
        )
        
        this.unsubscribeOrders = onSnapshot(q, async (snapshot) => {
          const chatPromises = snapshot.docs.map(async (orderDoc) => {
             const order = { id: orderDoc.id, ...orderDoc.data() }
             try {
                // Get chat room
                const roomId = await chatService.createChatRoom(order.userId, this.currentDriverId, order.id)
                
                // Get customer details
                const customerDoc = await getDoc(doc(db, 'users', order.userId))
                const customer = customerDoc.exists() ? customerDoc.data() : {}
                
                // Get chat metadata (last message)
                const chatDoc = await getDoc(doc(db, 'chats', roomId))
                const chatMeta = chatDoc.exists() ? chatDoc.data() : {}

                return {
                   id: roomId,
                   orderId: order.id,
                   userId: order.userId,
                   driverId: this.currentDriverId,
                   customerName: customer.firstName ? `${customer.firstName} ${customer.lastName}` : 'Customer',
                   customerPhone: customer.contact,
                   customerAvatar: customer.photoURL || customer.profilePictureUrl || null,
                   lastMessage: chatMeta.lastMessage || null,
                   lastMessageAt: chatMeta.lastMessageAt || order.createdAt,
                   unreadCount: chatMeta.unreadCount || {},
                   order: order
                }
             } catch (e) { return null }
          })
          
          const results = (await Promise.all(chatPromises)).filter(c => c !== null)
          // Sort by last message time
          results.sort((a,b) => {
             const tA = a.lastMessageAt?.toMillis?.() || 0
             const tB = b.lastMessageAt?.toMillis?.() || 0
             return tB - tA
          })
          
          this.activeChats = results
          this.loading = false
        })
      } catch (e) { console.error(e); this.loading = false }
    },
    async selectChat(chat) {
       this.selectedChatId = chat.id
       this.selectedOrderId = chat.orderId
       this.selectedChatPartner = {
          id: chat.userId,
          name: chat.customerName,
          role: 'user',
          phone: chat.customerPhone,
          avatar: chat.customerAvatar
       }
       try { await chatService.markMessagesAsRead(chat.id, this.currentDriverId) } catch(e){}
    },
    formatChatTime(ts) {
       if(!ts) return ''
       const d = ts.toDate ? ts.toDate() : new Date(ts)
       const now = new Date()
       const diff = (now - d) / (1000 * 60 * 60)
       if(diff < 1) return 'Just now'
       if(diff < 24) return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
       return d.toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #d1d5db; }
</style>