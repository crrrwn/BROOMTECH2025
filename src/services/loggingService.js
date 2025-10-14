import { db } from "@/firebase/config"
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore"

class LoggingService {
  constructor() {
    this.logsCollection = "system_logs"
  }

  // Log levels
  LEVELS = {
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
  }

  // User types
  USER_TYPES = {
    USER: "user",
    DRIVER: "driver",
    ADMIN: "admin",
    SYSTEM: "system",
  }

  /**
   * Create a system log entry
   * @param {string} level - Log level (info, success, warning, error)
   * @param {string} message - Log message
   * @param {string} userType - Type of user (user, driver, admin, system)
   * @param {string} userId - ID of the user performing the action
   * @param {object} metadata - Additional metadata
   */
  async log(level, message, userType = this.USER_TYPES.SYSTEM, userId = null, metadata = {}) {
    try {
      await addDoc(collection(db, this.logsCollection), {
        level,
        message,
        userType,
        userId,
        metadata,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(), // For immediate display before server timestamp
      })
    } catch (error) {
      console.error("[LoggingService] Error creating log:", error)
    }
  }

  // Convenience methods for different log levels
  async info(message, userType, userId, metadata) {
    return this.log(this.LEVELS.INFO, message, userType, userId, metadata)
  }

  async success(message, userType, userId, metadata) {
    return this.log(this.LEVELS.SUCCESS, message, userType, userId, metadata)
  }

  async warning(message, userType, userId, metadata) {
    return this.log(this.LEVELS.WARNING, message, userType, userId, metadata)
  }

  async error(message, userType, userId, metadata) {
    return this.log(this.LEVELS.ERROR, message, userType, userId, metadata)
  }

  /**
   * Get recent system logs
   * @param {number} limitCount - Number of logs to retrieve
   * @returns {Promise<Array>} Array of log entries
   */
  async getRecentLogs(limitCount = 50) {
    try {
      console.log("[v0] Fetching recent logs from Firestore...")
      const logsQuery = query(collection(db, this.logsCollection), orderBy("timestamp", "desc"), limit(limitCount))

      console.log("[v0] Executing query...")
      const snapshot = await getDocs(logsQuery)
      console.log("[v0] Query executed. Snapshot size:", snapshot.size)

      const logs = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        console.log("[v0] Log entry:", doc.id, data)
        logs.push({
          id: doc.id,
          ...data,
          timestamp: this.formatTimestamp(data.timestamp || data.createdAt),
        })
      })

      console.log("[v0] Total logs fetched:", logs.length)
      return logs
    } catch (error) {
      console.error("[v0] Error fetching logs:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)
      throw error // Re-throw error so caller can handle it
    }
  }

  /**
   * Clear all system logs
   */
  async clearAllLogs() {
    try {
      const logsQuery = query(collection(db, this.logsCollection))
      const snapshot = await getDocs(logsQuery)

      const deletePromises = []
      snapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref))
      })

      await Promise.all(deletePromises)
      return true
    } catch (error) {
      console.error("[LoggingService] Error clearing logs:", error)
      return false
    }
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp) {
    if (!timestamp) return new Date().toLocaleString()

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    } catch (error) {
      return new Date().toLocaleString()
    }
  }

  // Activity-specific logging methods
  async logUserRegistration(userId, userName) {
    return this.success(`New user registered: ${userName}`, this.USER_TYPES.USER, userId, {
      action: "user_registration",
      userName,
    })
  }

  async logDriverRegistration(driverId, driverName) {
    return this.info(`New driver application submitted: ${driverName}`, this.USER_TYPES.DRIVER, driverId, {
      action: "driver_registration",
      driverName,
    })
  }

  async logDriverApproval(driverId, driverName, adminId) {
    return this.success(`Driver approved: ${driverName}`, this.USER_TYPES.ADMIN, adminId, {
      action: "driver_approval",
      driverId,
      driverName,
    })
  }

  async logDriverRejection(driverId, driverName, adminId) {
    return this.warning(`Driver application rejected: ${driverName}`, this.USER_TYPES.ADMIN, adminId, {
      action: "driver_rejection",
      driverId,
      driverName,
    })
  }

  async logOrderCreated(orderId, userId, userName, serviceType, amount) {
    return this.info(`New order created by ${userName}: ${serviceType} - ₱${amount}`, this.USER_TYPES.USER, userId, {
      action: "order_created",
      orderId,
      serviceType,
      amount,
    })
  }

  async logOrderStatusChange(orderId, oldStatus, newStatus, userId, userType) {
    return this.info(`Order #${orderId} status changed: ${oldStatus} → ${newStatus}`, userType, userId, {
      action: "order_status_change",
      orderId,
      oldStatus,
      newStatus,
    })
  }

  async logDriverAssignment(orderId, driverId, driverName, adminId) {
    return this.success(`Driver ${driverName} assigned to order #${orderId}`, this.USER_TYPES.ADMIN, adminId, {
      action: "driver_assignment",
      orderId,
      driverId,
      driverName,
    })
  }

  async logOrderCancellation(orderId, userId, userType, reason) {
    return this.warning(`Order #${orderId} cancelled${reason ? `: ${reason}` : ""}`, userType, userId, {
      action: "order_cancellation",
      orderId,
      reason,
    })
  }

  async logDeliveryStarted(orderId, driverId, driverName) {
    return this.info(`Driver ${driverName} started delivery for order #${orderId}`, this.USER_TYPES.DRIVER, driverId, {
      action: "delivery_started",
      orderId,
      driverName,
    })
  }

  async logDeliveryCompleted(orderId, driverId, driverName) {
    return this.success(
      `Driver ${driverName} completed delivery for order #${orderId}`,
      this.USER_TYPES.DRIVER,
      driverId,
      { action: "delivery_completed", orderId, driverName },
    )
  }

  async logSystemSettingsUpdate(adminId, settingType) {
    return this.info(`System settings updated: ${settingType}`, this.USER_TYPES.ADMIN, adminId, {
      action: "settings_update",
      settingType,
    })
  }

  async logAutoAcceptToggle(adminId, enabled, type) {
    return this.info(`Auto-accept ${type} ${enabled ? "enabled" : "disabled"}`, this.USER_TYPES.ADMIN, adminId, {
      action: "auto_accept_toggle",
      type,
      enabled,
    })
  }

  async logBadWeatherFeeToggle(adminId, enabled) {
    return this.info(`Bad weather fee ${enabled ? "enabled" : "disabled"}`, this.USER_TYPES.ADMIN, adminId, {
      action: "bad_weather_fee_toggle",
      enabled,
    })
  }
}

export const loggingService = new LoggingService()
