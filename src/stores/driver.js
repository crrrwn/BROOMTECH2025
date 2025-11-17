import { defineStore } from "pinia"
import { doc, updateDoc, getDoc, onSnapshot, setDoc } from "firebase/firestore"
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
    totalEarningsToday: 0,
    unsubscribeStatus: null, // Firebase listener unsubscribe function
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

            // Update earnings data
            const today = new Date().toDateString()
            const lastRemitDate = driverData.lastRemitDate

            this.hasRemitted = lastRemitDate === today

            if (this.hasRemitted) {
              const totalEarned = driverData.totalEarningsToday || 0
              const driverShare = totalEarned * 0.8
              const adminShare = totalEarned * 0.2

              this.todayEarnings = {
                total: totalEarned.toFixed(2),
                driverShare: driverShare.toFixed(2),
                adminShare: adminShare.toFixed(2),
              }
              this.totalEarningsToday = totalEarned
            }
          }
        },
        (error) => {
          console.error("[v0] Error listening to driver status:", error)
        },
      )
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
          const lastRemitDate = driverData.lastRemitDate

          this.hasRemitted = lastRemitDate === today

          if (this.hasRemitted) {
            const totalEarned = driverData.totalEarningsToday || 0
            const driverShare = totalEarned * 0.8
            const adminShare = totalEarned * 0.2

            this.todayEarnings = {
              total: totalEarned.toFixed(2),
              driverShare: driverShare.toFixed(2),
              adminShare: adminShare.toFixed(2),
            }
            this.totalEarningsToday = totalEarned
          }

          console.log("[v0] Earnings data loaded:", {
            hasRemitted: this.hasRemitted,
            todayEarnings: this.todayEarnings,
          })
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

    cleanup() {
      if (this.unsubscribeStatus) {
        console.log("[v0] Cleaning up driver status listener")
        this.unsubscribeStatus()
        this.unsubscribeStatus = null
      }
    },
  },
})
