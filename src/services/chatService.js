import { db } from "@/firebase/config"
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
} from "firebase/firestore"

export class ChatService {
  constructor() {
    this.listeners = new Map()
  }

  // Create or get existing chat room between user and driver
  async createChatRoom(userId, driverId, orderId) {
    try {
      // Check if chat room already exists for this order
      const existingChatQuery = query(collection(db, "chats"), where("orderId", "==", orderId))

      const existingChats = await getDocs(existingChatQuery)

      if (!existingChats.empty) {
        return existingChats.docs[0].id
      }

      // Create new chat room
      const chatData = {
        userId,
        driverId,
        orderId,
        participants: [userId, driverId],
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageAt: null,
        unreadCount: {
          [userId]: 0,
          [driverId]: 0,
        },
      }

      const chatRef = await addDoc(collection(db, "chats"), chatData)
      return chatRef.id
    } catch (error) {
      console.error("Error creating chat room:", error)
      throw error
    }
  }

  // Send message in chat room
  async sendMessage(chatId, senderId, senderRole, message, messageType = "text") {
    try {
      const messageData = {
        chatId,
        senderId,
        senderRole, // 'user', 'driver', or 'bot'
        message,
        messageType, // 'text', 'image', 'system'
        timestamp: serverTimestamp(),
        read: false,
      }

      // Add message to messages subcollection
      await addDoc(collection(db, "chats", chatId, "messages"), messageData)

      // Update chat room with last message info
      const chatRef = doc(db, "chats", chatId)
      const chatDoc = await getDoc(chatRef)

      if (chatDoc.exists()) {
        const chatData = chatDoc.data()
        const otherParticipant = chatData.participants.find((p) => p !== senderId)

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
      const messageData = {
        chatId,
        senderId,
        senderRole, // 'user', 'driver', or 'bot'
        message: '', // Empty for image messages
        messageType: 'image',
        imageUrl,
        timestamp: serverTimestamp(),
        read: false,
      }

      // Add message to messages subcollection
      await addDoc(collection(db, "chats", chatId, "messages"), messageData)

      // Update chat room with last message info
      const chatRef = doc(db, "chats", chatId)
      const chatDoc = await getDoc(chatRef)

      if (chatDoc.exists()) {
        const chatData = chatDoc.data()
        const otherParticipant = chatData.participants.find((p) => p !== senderId)

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

  // Subscribe to chat messages
  subscribeToMessages(chatId, callback) {
    console.log("[v0] Setting up message subscription for chat:", chatId)

    const messagesQuery = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages = []
        snapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() })
        })

        console.log("[v0] Messages updated in chat", chatId, "- Total messages:", messages.length)

        callback(messages)
      },
      (error) => {
        console.error("Messages subscription error:", error)
      },
    )

    this.listeners.set(`messages_${chatId}`, unsubscribe)
    return unsubscribe
  }

  // Subscribe to user's chat rooms
  subscribeToUserChats(userId, callback) {
    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId),
      orderBy("lastMessageAt", "desc"),
    )

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
        console.error("User chats subscription error:", error)
      },
    )

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
