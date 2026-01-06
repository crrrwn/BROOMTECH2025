import { db } from "@/firebase/config"
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore"
import { loggingService } from "./loggingService"

// Real-time service for live updates
export class RealtimeService {
  constructor() {
    this.listeners = new Map()
  }

  // Subscribe to order updates
  subscribeToOrder(orderId, callback) {
    const orderRef = doc(db, "orders", orderId)

    const unsubscribe = onSnapshot(
      orderRef,
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() })
        }
      },
      (error) => {
        console.error("Order subscription error:", error)
      },
    )

    this.listeners.set(`order_${orderId}`, unsubscribe)
    return unsubscribe
  }

  // Subscribe to driver location updates
  subscribeToDriverLocation(driverId, callback) {
    const locationRef = doc(db, "driver_locations", driverId)

    const unsubscribe = onSnapshot(
      locationRef,
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() })
        }
      },
      (error) => {
        console.error("Driver location subscription error:", error)
      },
    )

    this.listeners.set(`driver_location_${driverId}`, unsubscribe)
    return unsubscribe
  }

  // Subscribe to available bookings for drivers
  subscribeToAvailableBookings(callback) {
    const bookingsQuery = query(
      collection(db, "orders"),
      where("status", "==", "pending"),
      where("driverId", "==", null),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookings = []
        snapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() })
        })
        callback(bookings)
      },
      (error) => {
        console.error("Available bookings subscription error:", error)
      },
    )

    this.listeners.set("available_bookings", unsubscribe)
    return unsubscribe
  }

  // Subscribe to user orders
  subscribeToUserOrders(userId, callback) {
    // Try with orderBy first (requires index)
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orders = []
        snapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() })
        })
        // Sort client-side as fallback
        orders.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || a.createdAt?.seconds * 1000 || 0
          const bTime = b.createdAt?.toDate?.()?.getTime() || b.createdAt?.seconds * 1000 || 0
          return bTime - aTime
        })
        callback(orders)
      },
      (error) => {
        // If index error, fallback to query without orderBy
        if (error.code === 'failed-precondition' && error.message?.includes('index')) {
          console.warn("Firestore index missing. Using fallback query. Please create the index. Error:", error.message)
          // Unsubscribe from the failed query first
          if (unsubscribe) {
            unsubscribe()
          }
          // Set up fallback query
          const fallbackQuery = query(collection(db, "orders"), where("userId", "==", userId))
          const fallbackUnsubscribe = onSnapshot(
            fallbackQuery,
            (snapshot) => {
              const orders = []
              snapshot.forEach((doc) => {
                orders.push({ id: doc.id, ...doc.data() })
              })
              // Sort client-side
              orders.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.()?.getTime() || a.createdAt?.seconds * 1000 || 0
                const bTime = b.createdAt?.toDate?.()?.getTime() || b.createdAt?.seconds * 1000 || 0
                return bTime - aTime
              })
              callback(orders)
            },
            (fallbackError) => {
              console.error("User orders subscription error (fallback):", fallbackError)
              callback([]) // Return empty array on error
            },
          )
          this.listeners.set(`user_orders_${userId}`, fallbackUnsubscribe)
        } else {
          console.error("User orders subscription error:", error)
          callback([]) // Return empty array on error
        }
      },
    )

    this.listeners.set(`user_orders_${userId}`, unsubscribe)
    return unsubscribe
  }

  // Subscribe to driver assignments
  subscribeToDriverAssignments(driverId, callback) {
    const assignmentsQuery = query(
      collection(db, "orders"),
      where("driverId", "==", driverId),
      where("status", "in", ["confirmed", "in_transit", "arrived"]),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(
      assignmentsQuery,
      (snapshot) => {
        const assignments = []
        snapshot.forEach((doc) => {
          assignments.push({ id: doc.id, ...doc.data() })
        })
        callback(assignments)
      },
      (error) => {
        console.error("Driver assignments subscription error:", error)
      },
    )

    this.listeners.set(`driver_assignments_${driverId}`, unsubscribe)
    return unsubscribe
  }

  // Update driver location
  async updateDriverLocation(driverId, location) {
    try {
      const locationRef = doc(db, "driver_locations", driverId)
      await updateDoc(locationRef, {
        ...location,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating driver location:", error)
      throw error
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, additionalData = {}) {
    try {
      const orderRef = doc(db, "orders", orderId)

      const orderDoc = await getDoc(orderRef)
      const oldStatus = orderDoc.exists() ? orderDoc.data().status : "unknown"

      await updateDoc(orderRef, {
        status,
        ...additionalData,
        updatedAt: serverTimestamp(),
      })

      const orderData = orderDoc.data()
      await loggingService.logOrderStatusChange(
        orderId,
        oldStatus,
        status,
        orderData?.userId || orderData?.driverId || null,
        orderData?.driverId ? loggingService.USER_TYPES.DRIVER : loggingService.USER_TYPES.USER,
      )
    } catch (error) {
      console.error("Error updating order status:", error)
      throw error
    }
  }

  // Send real-time notification
  // userId: specific user ID (for user/driver notifications) or null (for admin notifications)
  // notification: { title, message, type, recipientType: 'user'|'driver'|'admin', ... }
  async sendNotification(userId, notification) {
    try {
      const notificationData = {
        userId: userId || null,
        recipientType: notification.recipientType || (userId ? 'user' : 'admin'), // Auto-detect if not provided
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
      }
      
      await addDoc(collection(db, "notifications"), notificationData)
    } catch (error) {
      console.error("Error sending notification:", error)
      throw error
    }
  }
  
  // Send notification to all admins
  async sendNotificationToAdmins(notification) {
    try {
      await addDoc(collection(db, "notifications"), {
        userId: null,
        recipientType: 'admin',
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error sending notification to admins:", error)
      throw error
    }
  }

  // Subscribe to notifications
  subscribeToNotifications(userId, callback) {
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notifications = []
        snapshot.forEach((doc) => {
          notifications.push({ id: doc.id, ...doc.data() })
        })
        callback(notifications)
      },
      (error) => {
        console.error("Notifications subscription error:", error)
      },
    )

    this.listeners.set(`notifications_${userId}`, unsubscribe)
    return unsubscribe
  }

  // Unsubscribe from specific listener
  unsubscribe(key) {
    const unsubscribe = this.listeners.get(key)
    if (unsubscribe) {
      unsubscribe()
      this.listeners.delete(key)
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

export const realtimeService = new RealtimeService()
