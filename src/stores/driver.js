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

          // Fetch driver's share rates
          const driverShareRate = driverData.driverShareRate || 0.80
          const adminShareRate = driverData.adminShareRate || 0.20

          // Query approved remittances for today
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const todayString = today.toDateString()

          const remittancesQuery = query(
            collection(db, 'remittances'),
            where('driverId', '==', user.uid),
            where('status', '==', 'approved')
          )

          const remittancesSnapshot = await getDocs(remittancesQuery)
          
          let totalRemittedToday = 0
          let totalDriverShareToday = 0
          let totalAdminShareToday = 0

          remittancesSnapshot.forEach(doc => {
            const remittance = doc.data()
            
            // Check if remittance was approved today
            let approvalDate
            if (remittance.approvedAt) {
              approvalDate = remittance.approvedAt.toDate ? remittance.approvedAt.toDate() : 
                            new Date(remittance.approvedAt)
            } else if (remittance.date) {
              approvalDate = remittance.date.toDate ? remittance.date.toDate() : 
                            new Date(remittance.date)
            } else {
              return
            }
            
            const approvalDateString = approvalDate.toDateString()
            
            if (approvalDateString === todayString) {
              const amount = parseFloat(remittance.amount) || 0
              const adminShare = remittance.adminShare ?? (amount * adminShareRate)
              const driverShare = remittance.driverShare ?? (amount - adminShare) // Driver share = total - admin (e.g. 1450 - 290 = 1160)
              
              totalRemittedToday += amount
              totalDriverShareToday += driverShare
              totalAdminShareToday += adminShare
            }
          })

          this.hasRemitted = totalRemittedToday > 0

          if (this.hasRemitted) {
            this.todayEarnings = {
              total: totalRemittedToday.toFixed(2),
              driverShare: totalDriverShareToday.toFixed(2),
              adminShare: totalAdminShareToday.toFixed(2),
            }
            this.totalEarningsToday = totalRemittedToday

            console.log("[v0] Earnings loaded from approved remittances:", {
              totalRemittedToday,
              totalDriverShareToday,
              totalAdminShareToday,
              driverShareRate,
              adminShareRate,
              todayEarnings: this.todayEarnings
            })
          } else {
            // Reset earnings if no approved remittances today
            this.todayEarnings = {
              total: "0.00",
              driverShare: "0.00",
              adminShare: "0.00",
            }
            this.totalEarningsToday = 0
            
            console.log("[v0] No approved remittances today, earnings reset")
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
        const adminShare = amount * 0.2
        const driverShare = amount - adminShare // Driver share = total - admin (e.g. 1450 - 290 = 1160)

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

      // Query for approved remittances by this driver
      const remittancesQuery = query(
        collection(db, 'remittances'),
        where('driverId', '==', driverId),
        where('status', '==', 'approved')
      )

      this.unsubscribeTodayEarnings = onSnapshot(
        remittancesQuery,
        async (snapshot) => {
          // Handle permission errors gracefully
          if (snapshot.metadata && snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
            // If we only have cached data, it might be a permission issue
            console.warn('[v0] Only cached data available for remittances, checking permissions')
          }
          // Fetch driver's share rates from profile
          let driverShareRate = 0.80 // Default 80%
          let adminShareRate = 0.20  // Default 20%
          
          try {
            const driverRef = doc(db, "drivers", driverId)
            const driverDoc = await getDoc(driverRef)
            if (driverDoc.exists()) {
              const driverData = driverDoc.data()
              driverShareRate = driverData.driverShareRate || 0.80
              adminShareRate = driverData.adminShareRate || 0.20
            }
          } catch (error) {
            console.error("[v0] Error fetching driver share rates:", error)
          }

          let totalRemittedToday = 0
          let totalDriverShareToday = 0
          let totalAdminShareToday = 0

          snapshot.forEach(doc => {
            const remittance = doc.data()
            
            // Check if remittance was approved today
            let approvalDate
            if (remittance.approvedAt) {
              approvalDate = remittance.approvedAt.toDate ? remittance.approvedAt.toDate() : 
                            new Date(remittance.approvedAt)
            } else if (remittance.date) {
              // Fallback to date field if approvedAt doesn't exist
              approvalDate = remittance.date.toDate ? remittance.date.toDate() : 
                            new Date(remittance.date)
            } else {
              // Skip if no date available
              return
            }
            
            // Compare date strings to ensure same day
            const approvalDateString = approvalDate.toDateString()
            
            // Only count remittances approved today (exact same day)
            if (approvalDateString === todayString) {
              const amount = parseFloat(remittance.amount) || 0
              const adminShare = remittance.adminShare ?? (amount * adminShareRate)
              const driverShare = remittance.driverShare ?? (amount - adminShare) // Driver share = total - admin (e.g. 1450 - 290 = 1160)
              
              totalRemittedToday += amount
              totalDriverShareToday += driverShare
              totalAdminShareToday += adminShare
              
              console.log("[v0] Found approved remittance today:", {
                remittanceId: doc.id,
                amount,
                driverShare,
                adminShare,
                approvedAt: approvalDateString,
                today: todayString
              })
            }
          })

          this.todayEarnings = {
            total: totalRemittedToday.toFixed(2),
            driverShare: totalDriverShareToday.toFixed(2),
            adminShare: totalAdminShareToday.toFixed(2),
          }
          this.totalEarningsToday = totalRemittedToday
          
          // Update hasRemitted flag based on whether there are approved remittances today
          this.hasRemitted = totalRemittedToday > 0

          console.log("[v0] Today's earnings from approved remittances:", {
            totalRemittedToday,
            totalDriverShareToday,
            totalAdminShareToday,
            driverShareRate,
            adminShareRate,
            todayEarnings: this.todayEarnings,
            today: todayString,
            remittancesCount: snapshot.size,
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
        
        const adminShare = weeklyTotal * 0.2
        const driverShare = weeklyTotal - adminShare // Driver share = total - admin (e.g. 1450 - 290 = 1160)
        
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
