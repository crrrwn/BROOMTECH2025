import { defineStore } from "pinia"
import { doc, updateDoc, getDoc, onSnapshot, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/firebase/config"
import { useAuthStore } from "./auth"

export const useDriverStore = defineStore("driver", {
  state: () => ({
    isOnline: false,
    onlineTime: null,
    hasRemitted: false,
    todayEarnings: {
      total: 0,
      driverShare: "0.00",
      adminShare: "0.00",
    },
    weeklyEarnings: {
      total: 0,
      driverShare: "0.00",
      adminShare: "0.00",
    },
    totalEarningsToday: 0,
    unsubscribeStatus: null, // Firebase listener unsubscribe function
    unsubscribeTodayEarnings: null, // Listener for today's approved remittances
  }),

  actions: {
    initializeStatusListener(userId) {
      if (!userId) return

      console.log("[v0] Initializing driver status listener for:", userId)

      // Unsubscribe from previous listener if exists
      if (this.unsubscribeStatus) {
        this.unsubscribeStatus()
      }

      const driverRef = doc(db, "drivers", userId)

      // Set up real-time listener
      this.unsubscribeStatus = onSnapshot(
        driverRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const driverData = snapshot.data()
            console.log("[v0] Driver data updated:", driverData)

            // Update online status
            this.isOnline = driverData.isOnline === true

            // Update online time if just went online
            if (this.isOnline && !this.onlineTime) {
              this.onlineTime = new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            }

            // Note: Today's earnings are calculated from approved remittances
            // This is handled by setupTodayEarningsListener()
            
            // Calculate weekly earnings when driver data updates
            this.calculateWeeklyEarnings(userId).catch(err => {
              console.error("[v0] Error calculating weekly earnings in listener:", err)
            })
          }
        },
        (error) => {
          console.error("[v0] Error listening to driver status:", error)
        },
      )
      
      // Setup listener for today's earnings from approved remittances
      this.setupTodayEarningsListener(userId)
    },

    async toggleOnlineStatus() {
      const authStore = useAuthStore()
      const user = authStore.user

      if (!user) {
        console.log("[v0] No user found, cannot toggle status")
        return false
      }

      try {
        const newStatus = !this.isOnline
        console.log("[v0] Toggling driver status from", this.isOnline, "to", newStatus)

        const driverRef = doc(db, "drivers", user.uid)
        await updateDoc(driverRef, {
          isOnline: newStatus,
          lastStatusUpdate: new Date(),
          status: newStatus ? "online" : "offline",
        })

        // Update local state
        this.isOnline = newStatus

        // Set online time if going online
        if (newStatus) {
          this.onlineTime = new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        } else {
          this.onlineTime = null
        }

        console.log("[v0] Driver status updated successfully:", newStatus)
        return true
      } catch (error) {
        console.error("[v0] Error updating driver status:", error)
        return false
      }
    },

    async loadEarningsData() {
      const authStore = useAuthStore()
      const user = authStore.user

      if (!user) return

      try {
        const driverRef = doc(db, "drivers", user.uid)
        const driverSnap = await getDoc(driverRef)

        if (driverSnap.exists()) {
          const driverData = driverSnap.data()

          const today = new Date().toDateString()
          let lastRemitDate = driverData.lastRemitDate

          // Normalize lastRemitDate - handle both string and Timestamp/Date formats
          if (lastRemitDate) {
            if (lastRemitDate.toDate) {
              // Firestore Timestamp
              lastRemitDate = lastRemitDate.toDate().toDateString()
            } else if (lastRemitDate instanceof Date) {
              // Date object
              lastRemitDate = lastRemitDate.toDateString()
            } else if (typeof lastRemitDate === 'string') {
              // Already a string, trim and use as is
              lastRemitDate = lastRemitDate.trim()
            }
          }

          // Check hasRemitted from Firestore first, then fallback to date comparison
          const normalizedToday = today.trim()
          const normalizedLastRemit = lastRemitDate ? lastRemitDate.trim() : ''
          const dateMatches = normalizedLastRemit === normalizedToday
          
          // Use Firestore hasRemitted if available, otherwise use date comparison
          this.hasRemitted = driverData.hasRemitted === true || (driverData.hasRemitted !== false && dateMatches)

          console.log("[v0] Earnings data loaded:", {
            today: normalizedToday,
            lastRemitDate: normalizedLastRemit,
            dateMatches,
            firestoreHasRemitted: driverData.hasRemitted,
            hasRemitted: this.hasRemitted,
            totalEarningsToday: driverData.totalEarningsToday,
            totalEarningsTodayType: typeof driverData.totalEarningsToday
          })

          if (this.hasRemitted && driverData.totalEarningsToday) {
            const totalEarned = parseFloat(driverData.totalEarningsToday) || 0
            const driverShare = totalEarned * 0.8
            const adminShare = totalEarned * 0.2

            this.todayEarnings = {
              total: totalEarned.toFixed(2),
              driverShare: driverShare.toFixed(2),
              adminShare: adminShare.toFixed(2),
            }
            this.totalEarningsToday = totalEarned

            console.log("[v0] Earnings calculated:", this.todayEarnings)
          } else {
            // Reset earnings if not remitted today or no earnings
            this.todayEarnings = {
              total: "0.00",
              driverShare: "0.00",
              adminShare: "0.00",
            }
            this.totalEarningsToday = 0
            
            console.log("[v0] No remittance today or no earnings, earnings reset", {
            hasRemitted: this.hasRemitted,
              totalEarningsToday: driverData.totalEarningsToday
            })
          }
          
          // Calculate weekly earnings
          await this.calculateWeeklyEarnings(user.uid)
          
          // Setup listener for today's earnings from approved remittances
          this.setupTodayEarningsListener(user.uid)
        }
      } catch (error) {
        console.error("[v0] Error loading earnings data:", error)
      }
    },

    async remitPayment(amount, paymentMethod, receiptFile) {
      const authStore = useAuthStore()
      const user = authStore.user

      if (!user) {
        console.log("[v0] No user found for remittance")
        return false
      }

      try {
        const driverShare = amount * 0.8
        const adminShare = amount * 0.2

        // Update driver record with remittance
        const driverRef = doc(db, "drivers", user.uid)
        const today = new Date().toDateString()

        await updateDoc(driverRef, {
          totalEarningsToday: this.totalEarningsToday + driverShare,
          lastRemitDate: today,
          hasRemitted: true,
        })

        // Update admin revenue
        const adminRef = doc(db, "settings", "admin")
        await updateDoc(adminRef, {
          totalAdminRevenue: adminShare,
        }).catch(async () => {
          // Create if doesn't exist
          await setDoc(adminRef, {
            totalAdminRevenue: adminShare,
          })
        })

        console.log("[v0] Remittance processed successfully")
        return true
      } catch (error) {
        console.error("[v0] Error processing remittance:", error)
        return false
      }
    },

    setupTodayEarningsListener(driverId) {
      if (!driverId) return

      // Unsubscribe from previous listener if exists
      if (this.unsubscribeTodayEarnings) {
        this.unsubscribeTodayEarnings()
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayString = today.toDateString()

      // Query for delivered orders by this driver today
      const ordersQuery = query(
        collection(db, 'orders'),
        where('driverId', '==', driverId),
        where('status', '==', 'delivered')
      )

      this.unsubscribeTodayEarnings = onSnapshot(
        ordersQuery,
        (snapshot) => {
          let totalEarnedToday = 0

          snapshot.forEach(doc => {
            const order = doc.data()
            
            // Check if order was delivered today
            let deliveryDate
            if (order.deliveredAt) {
              deliveryDate = order.deliveredAt.toDate ? order.deliveredAt.toDate() : 
                            new Date(order.deliveredAt)
            } else if (order.createdAt) {
              // Fallback to createdAt if deliveredAt doesn't exist
              deliveryDate = order.createdAt.toDate ? order.createdAt.toDate() : 
                            new Date(order.createdAt)
            } else {
              // Skip if no date available
              return
            }
            
            // Compare date strings to ensure same day
            const deliveryDateString = deliveryDate.toDateString()
            
            // Only count orders delivered today (exact same day)
            if (deliveryDateString === todayString) {
              const amount = parseFloat(order.totalAmount) || parseFloat(order.amount) || 0
              totalEarnedToday += amount
              
              console.log("[v0] Found delivered order today:", {
                orderId: doc.id,
                amount,
                deliveredAt: deliveryDateString,
                today: todayString
              })
            }
          })

          // Calculate 80/20 split
          const driverShare = totalEarnedToday * 0.8
          const adminShare = totalEarnedToday * 0.2

          this.todayEarnings = {
            total: totalEarnedToday.toFixed(2),
            driverShare: driverShare.toFixed(2),
            adminShare: adminShare.toFixed(2),
          }
          this.totalEarningsToday = totalEarnedToday
          
          // Update hasRemitted flag based on whether there are delivered orders today
          this.hasRemitted = totalEarnedToday > 0

          console.log("[v0] Today's earnings from delivered orders:", {
            totalEarnedToday,
            driverShare,
            adminShare,
            todayEarnings: this.todayEarnings,
            today: todayString,
            ordersCount: snapshot.size,
            hasRemitted: this.hasRemitted
          })
        },
        (error) => {
          console.error("[v0] Error listening to today's earnings:", error)
          // Reset on error
          this.todayEarnings = {
            total: "0.00",
            driverShare: "0.00",
            adminShare: "0.00",
          }
          this.totalEarningsToday = 0
          this.hasRemitted = false
        }
      )
    },

    async calculateWeeklyEarnings(driverId) {
      try {
        const today = new Date()
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        weekAgo.setHours(0, 0, 0, 0)
        
        // Get all approved remittances from the last 7 days
        const remittancesQuery = query(
          collection(db, 'remittances'),
          where('driverId', '==', driverId),
          where('status', '==', 'approved')
        )
        
        const snapshot = await getDocs(remittancesQuery)
        let weeklyTotal = 0
        
        snapshot.forEach(doc => {
          const data = doc.data()
          // Check if remittance was approved in the last 7 days
          let approvalDate
          if (data.approvedAt) {
            approvalDate = data.approvedAt.toDate ? data.approvedAt.toDate() : new Date(data.approvedAt)
          } else if (data.date) {
            approvalDate = data.date.toDate ? data.date.toDate() : new Date(data.date)
          } else if (data.createdAt) {
            approvalDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
          } else {
            return // Skip if no date
          }
          
          if (approvalDate >= weekAgo) {
            weeklyTotal += parseFloat(data.amount) || 0
          }
        })
        
        const driverShare = weeklyTotal * 0.8
        const adminShare = weeklyTotal * 0.2
        
        this.weeklyEarnings = {
          total: weeklyTotal.toFixed(2),
          driverShare: driverShare.toFixed(2),
          adminShare: adminShare.toFixed(2),
        }
        
        console.log("[v0] Weekly earnings calculated:", this.weeklyEarnings)
      } catch (error) {
        console.error("[v0] Error calculating weekly earnings:", error)
        this.weeklyEarnings = {
          total: "0.00",
          driverShare: "0.00",
          adminShare: "0.00",
        }
      }
    },

    cleanup() {
      if (this.unsubscribeStatus) {
        console.log("[v0] Cleaning up driver status listener")
        this.unsubscribeStatus()
        this.unsubscribeStatus = null
      }
      if (this.unsubscribeTodayEarnings) {
        console.log("[v0] Cleaning up today's earnings listener")
        this.unsubscribeTodayEarnings()
        this.unsubscribeTodayEarnings = null
      }
    },
  },
})
