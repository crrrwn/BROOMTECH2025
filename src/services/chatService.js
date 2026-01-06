import { db, auth } from "@/firebase/config"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  getDocs,
  limit,
} from 'firebase/firestore'

export class ChatService {
  constructor() {
    this.listeners = new Map()
  }

  // Create or get existing chat room between user and driver
  async createChatRoom(userId, driverId, orderId) {
    try {
      console.log('[ChatService] Creating/getting chat room:', { userId, driverId, orderId })
      
      // Validate inputs
      if (!userId || !driverId || !orderId) {
        throw new Error('Missing required parameters: userId, driverId, or orderId')
      }

      // Check if chat room already exists for this order
      // Query based on current authenticated user's role to ensure permission
      // Get current user ID to determine which query to use
      const currentUserId = auth.currentUser?.uid
      
      let existingChats
      try {
        // Determine which query to use based on current user's role
        // If current user is the userId, query by userId
        // If current user is the driverId, query by driverId
        let chatQuery
        if (currentUserId === userId) {
          // Current user is the customer - query by userId
          chatQuery = query(collection(db, "chats"), where("orderId", "==", orderId), where("userId", "==", userId))
        } else if (currentUserId === driverId) {
          // Current user is the driver - query by driverId
          chatQuery = query(collection(db, "chats"), where("orderId", "==", orderId), where("driverId", "==", driverId))
        } else {
          // Fallback: try both queries
          const userChatQuery = query(collection(db, "chats"), where("orderId", "==", orderId), where("userId", "==", userId))
          const driverChatQuery = query(collection(db, "chats"), where("orderId", "==", orderId), where("driverId", "==", driverId))
          const [userChats, driverChats] = await Promise.all([getDocs(userChatQuery), getDocs(driverChatQuery)])
          // Merge results and remove duplicates
          const allDocs = [...userChats.docs, ...driverChats.docs]
          const uniqueDocs = Array.from(new Map(allDocs.map(doc => [doc.id, doc])).values())
          existingChats = { docs: uniqueDocs, empty: uniqueDocs.length === 0 }
        }
        
        if (chatQuery) {
          existingChats = await getDocs(chatQuery)
        }
      } catch (queryError) {
        // If query fails due to permissions, proceed to create new chat
        // This can happen if no chat exists yet or if user doesn't have read permission
        existingChats = { docs: [], empty: true }
      }

      if (!existingChats.empty) {
        const existingChat = existingChats.docs[0]
        const chatData = existingChat.data()
        
        // Ensure participants object exists and includes both users
        // If participants is missing or incomplete, update it
        if (!chatData.participants || 
            !chatData.participants[userId] || 
            !chatData.participants[driverId]) {
          console.log('[ChatService] Updating participants for existing chat:', existingChat.id)
          const participantsUpdate = {
            [userId]: true,
            [driverId]: true
          }
          const chatRef = doc(db, "chats", existingChat.id)
          try {
            await updateDoc(chatRef, {
              participants: participantsUpdate
            })
          } catch (updateError) {
            // If update fails due to permissions, log but continue
            // The chat might still be usable if userId/driverId are set correctly
            console.warn('[ChatService] Failed to update participants, but chat may still work:', updateError.message)
          }
        }
        
        console.log('[ChatService] Using existing chat room:', existingChat.id)
        return existingChat.id
      }

      // Create new chat room
      // IMPORTANT: participants must be an object/map (not array) to match Firestore rules
      // Rules check: resource.data.participants[request.auth.uid] != null
      const chatData = {
        userId,
        driverId,
        orderId,
        participants: {
          [userId]: true,
          [driverId]: true
        },
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageAt: null,
        unreadCount: {
          [userId]: 0,
          [driverId]: 0,
        },
      }

      console.log('[ChatService] Creating new chat room with data:', chatData)
      
      let chatRef
      try {
        chatRef = await addDoc(collection(db, "chats"), chatData)
        console.log('[ChatService] Chat room created successfully:', chatRef.id)
      } catch (createError) {
        throw new Error(`Failed to create chat room: ${createError.message || createError.code || 'Unknown error'}`)
      }
      
      // Verify the chat document is accessible by trying to read it
      try {
        const verifyRef = doc(db, "chats", chatRef.id)
        const verifyDoc = await getDoc(verifyRef)
        if (!verifyDoc.exists()) {
          throw new Error('Chat document was created but cannot be read')
        }
      } catch (verifyError) {
        // Log warning but still return the chatId - it might work after propagation delay
        console.warn('[ChatService] Chat created but verification failed (may be propagation delay):', verifyError.message)
      }
      
      return chatRef.id
    } catch (error) {
      console.error("[ChatService] Error creating chat room:", error)
      console.error("[ChatService] Error details:", {
        code: error.code,
        message: error.message,
        userId,
        driverId,
        orderId
      })
      throw error
    }
  }

  // Send message in chat room
  async sendMessage(chatId, senderId, senderRole, message, messageType = "text") {
    try {
      console.log('[ChatService] Sending message:', { chatId, senderId, senderRole, messageType })
      
      // Verify chat exists and sender is a participant
      const chatRef = doc(db, "chats", chatId)
      const chatDoc = await getDoc(chatRef)
      
      if (!chatDoc.exists()) {
        throw new Error('Chat room does not exist')
      }
      
      const chatData = chatDoc.data()
      if (!chatData.participants || !chatData.participants[senderId]) {
        // Update participants if missing
        console.log('[ChatService] Updating participants for chat:', chatId)
        await updateDoc(chatRef, {
          participants: {
            ...(chatData.participants || {}),
            [senderId]: true
          }
        })
      }
      
      const messageData = {
        chatId,
        senderId,
        senderRole, // 'user', 'driver', 'admin', or 'bot'
        message,
        messageType, // 'text', 'image', 'system'
        timestamp: serverTimestamp(),
        read: false,
      }

      // Add message to messages subcollection
      console.log('[ChatService] Adding message to subcollection')
      await addDoc(collection(db, "chats", chatId, "messages"), messageData)

      // Update chat room with last message info (use existing chatDoc from above)
      if (chatDoc.exists()) {
        const chatData = chatDoc.data()
        // participants is now an object, find the other participant
        const otherParticipant = Object.keys(chatData.participants || {}).find((p) => p !== senderId)

        const lastMessageText = messageType === 'image' ? '📷 Image' : message

        await updateDoc(chatRef, {
          lastMessage: lastMessageText,
          lastMessageAt: serverTimestamp(),
          [`unreadCount.${otherParticipant}`]: (chatData.unreadCount?.[otherParticipant] || 0) + 1,
        })
      }

      return true
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  // Send image message in chat room
  async sendImageMessage(chatId, senderId, senderRole, imageUrl) {
    try {
      console.log('[ChatService] Sending image message:', { chatId, senderId, senderRole })
      
      // Verify chat exists and sender is a participant
      const chatRef = doc(db, "chats", chatId)
      const chatDoc = await getDoc(chatRef)
      
      if (!chatDoc.exists()) {
        throw new Error('Chat room does not exist')
      }
      
      const chatData = chatDoc.data()
      if (!chatData.participants || !chatData.participants[senderId]) {
        // Update participants if missing
        console.log('[ChatService] Updating participants for chat:', chatId)
        await updateDoc(chatRef, {
          participants: {
            ...(chatData.participants || {}),
            [senderId]: true
          }
        })
      }
      
      const messageData = {
        chatId,
        senderId,
        senderRole, // 'user', 'driver', 'admin', or 'bot'
        message: '', // Empty for image messages
        messageType: 'image',
        imageUrl,
        timestamp: serverTimestamp(),
        read: false,
      }

      // Add message to messages subcollection
      console.log('[ChatService] Adding image message to subcollection')
      await addDoc(collection(db, "chats", chatId, "messages"), messageData)

      // Update chat room with last message info (use existing chatDoc from above)
      if (chatDoc.exists()) {
        const chatData = chatDoc.data()
        // participants is now an object, find the other participant
        const otherParticipant = Object.keys(chatData.participants || {}).find((p) => p !== senderId)

        await updateDoc(chatRef, {
          lastMessage: '📷 Image',
          lastMessageAt: serverTimestamp(),
          [`unreadCount.${otherParticipant}`]: (chatData.unreadCount?.[otherParticipant] || 0) + 1,
        })
      }

      return true
    } catch (error) {
      console.error("Error sending image message:", error)
      throw error
    }
  }

  // Subscribe to chat messages - REAL-TIME using Firestore onSnapshot
  // This provides instant updates when new messages are sent/received
  // Used by standalone chat modals in MyOrders and DeliveryTracking
  subscribeToMessages(chatId, callback) {
    console.log("[v0] Setting up REAL-TIME message subscription for chat:", chatId)

    const messagesQuery = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"))

    // onSnapshot provides real-time updates - automatically triggers when messages change
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages = []
        snapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() })
        })

        console.log("[v0] REAL-TIME: Messages updated in chat", chatId, "- Total messages:", messages.length)

        // Callback is triggered automatically on any message change (real-time)
        callback(messages)
      },
      (error) => {
        console.error("Messages subscription error:", error)
        // Call callback with empty array to indicate error, but don't throw
        // This allows the UI to handle the error gracefully
        if (error.code === 'permission-denied' || error.code === 'missing-or-insufficient-permissions') {
          console.error(`[ChatService] Permission denied for chat ${chatId}. User may not have access to this chat.`)
        }
        // Still call callback with empty array so UI can show appropriate message
        callback([])
      },
    )

    this.listeners.set(`messages_${chatId}`, unsubscribe)
    return unsubscribe
  }

  // Subscribe to user's chat rooms
  // Since participants is now an object, we query by userId OR driverId
  subscribeToUserChats(userId, callback) {
    let allChats = []
    let userChatsLoaded = false
    let driverChatsLoaded = false

    // Helper to merge and deduplicate chats
    const mergeAndCallback = () => {
      if (userChatsLoaded && driverChatsLoaded) {
        // Remove duplicates based on chat ID
        const uniqueChats = Array.from(
          new Map(allChats.map(chat => [chat.id, chat])).values()
        )
        // Sort by lastMessageAt
        uniqueChats.sort((a, b) => {
          const aTime = a.lastMessageAt?.toDate?.() || new Date(0)
          const bTime = b.lastMessageAt?.toDate?.() || new Date(0)
          return bTime - aTime
        })
        callback(uniqueChats)
      }
    }

    // Query chats where user is the customer
    const userChatsQuery = query(
      collection(db, "chats"),
      where("userId", "==", userId),
      orderBy("lastMessageAt", "desc"),
    )

    const unsubscribeUser = onSnapshot(
      userChatsQuery,
      (snapshot) => {
        const chats = []
        snapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() })
        })
        allChats = allChats.filter(c => c.userId !== userId).concat(chats)
        userChatsLoaded = true
        mergeAndCallback()
      },
      (error) => {
        console.error("User chats subscription error:", error)
        userChatsLoaded = true
        mergeAndCallback()
      },
    )

    // Query chats where user is the driver
    const driverChatsQuery = query(
      collection(db, "chats"),
      where("driverId", "==", userId),
      orderBy("lastMessageAt", "desc"),
    )

    const unsubscribeDriver = onSnapshot(
      driverChatsQuery,
      (snapshot) => {
        const chats = []
        snapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() })
        })
        allChats = allChats.filter(c => c.driverId !== userId).concat(chats)
        driverChatsLoaded = true
        mergeAndCallback()
      },
      (error) => {
        console.error("Driver chats subscription error:", error)
        driverChatsLoaded = true
        mergeAndCallback()
      },
    )

    // Return combined unsubscribe function
    const unsubscribe = () => {
      unsubscribeUser()
      unsubscribeDriver()
    }

    this.listeners.set(`user_chats_${userId}`, unsubscribe)
    return unsubscribe
  }

  // Subscribe to all chats for admin monitoring
  subscribeToAllChats(callback) {
    const chatsQuery = query(collection(db, "chats"), orderBy("lastMessageAt", "desc"))

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const chats = []
        snapshot.forEach((doc) => {
          chats.push({ id: doc.id, ...doc.data() })
        })
        callback(chats)
      },
      (error) => {
        console.error("All chats subscription error:", error)
      },
    )

    this.listeners.set("admin_all_chats", unsubscribe)
    return unsubscribe
  }

  // Mark messages as read
  async markMessagesAsRead(chatId, userId) {
    try {
      const chatRef = doc(db, "chats", chatId)
      await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0,
      })
    } catch (error) {
      console.error("Error marking messages as read:", error)
      throw error
    }
  }

  // Get chat room by order ID
  async getChatByOrderId(orderId) {
    try {
      const chatQuery = query(collection(db, "chats"), where("orderId", "==", orderId), limit(1))

      const chatSnapshot = await getDocs(chatQuery)

      if (!chatSnapshot.empty) {
        const chatDoc = chatSnapshot.docs[0]
        return { id: chatDoc.id, ...chatDoc.data() }
      }

      return null
    } catch (error) {
      console.error("Error getting chat by order ID:", error)
      throw error
    }
  }

  // Send automated bot message
  async sendBotMessage(chatId, message, messageType = "system") {
    try {
      await this.sendMessage(chatId, "bot", "bot", message, messageType)
    } catch (error) {
      console.error("Error sending bot message:", error)
      throw error
    }
  }

  // Unsubscribe from specific listener
  unsubscribe(key) {
    const unsubscribe = this.listeners.get(key)
    if (unsubscribe) {
      unsubscribe()
      this.listeners.delete(key)
    }
  }

  // Edit message
  async editMessage(chatId, messageId, userId, newMessage) {
    try {
      const messageRef = doc(db, "chats", chatId, "messages", messageId)
      const messageDoc = await getDoc(messageRef)
      
      if (!messageDoc.exists()) {
        throw new Error("Message not found")
      }
      
      const messageData = messageDoc.data()
      
      // Note: Firestore rules will enforce permissions
      // Admins can edit any message, senders can edit their own messages
      
      // Update message - preserve important fields
      const updateData = {
        message: newMessage,
        edited: true,
        editedAt: serverTimestamp()
      }
      
      // Preserve senderId, senderRole, and deleted status
      if (messageData.senderId) {
        updateData.senderId = messageData.senderId
      }
      if (messageData.senderRole) {
        updateData.senderRole = messageData.senderRole
      }
      if (messageData.deleted !== undefined) {
        updateData.deleted = messageData.deleted
      }
      
      await updateDoc(messageRef, updateData)
      
      return true
    } catch (error) {
      console.error("Error editing message:", error)
      throw error
    }
  }

  // Delete message (mark as deleted, don't actually delete from Firestore)
  async deleteMessage(chatId, messageId, userId) {
    try {
      const messageRef = doc(db, "chats", chatId, "messages", messageId)
      const messageDoc = await getDoc(messageRef)
      
      if (!messageDoc.exists()) {
        throw new Error("Message not found")
      }
      
      const messageData = messageDoc.data()
      
      // Only allow deletion if user is the sender
      if (messageData.senderId !== userId) {
        throw new Error("You can only delete your own messages")
      }
      
      // Mark message as deleted instead of actually deleting it
      await updateDoc(messageRef, {
        deleted: true,
        deletedAt: serverTimestamp(),
        deletedBy: userId
      })
      
      return true
    } catch (error) {
      console.error("Error deleting message:", error)
      throw error
    }
  }

  // Unsubscribe from all listeners
  unsubscribeAll() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe()
    })
    this.listeners.clear()
  }
}

export const chatService = new ChatService()
