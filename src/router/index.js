import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/firebase/config"
import { doc, onSnapshot, collection, query, where } from "firebase/firestore"

// Layouts
import GuestLayout from "@/layouts/GuestLayout.vue"
import UserLayout from "@/layouts/UserLayout.vue"
import DriverLayout from "@/layouts/DriverLayout.vue"
import AdminLayout from "@/layouts/AdminLayout.vue"

// Guest Pages
import HomePage from "@/views/guest/HomePage.vue"
import LoginPage from "@/views/guest/LoginPage.vue"
import RegisterPage from "@/views/guest/RegisterPage.vue"
import VerifyEmail from "@/views/guest/VerifyEmail.vue"
import VerifyEmailSuccess from "@/views/guest/VerifyEmailSuccess.vue"

// User Pages
import UserDashboard from "@/views/user/Dashboard.vue"
import BookService from "@/views/user/BookService.vue"
import MyOrders from "@/views/user/MyOrders.vue"
import UploadPayment from "@/views/user/UploadPayment.vue"
import UserProfile from "@/views/user/Profile.vue"
import UserChatMessages from "@/views/user/ChatMessages.vue"

// Driver Pages
import DriverDashboard from "@/views/driver/Dashboard.vue"
import MyAssignments from "@/views/driver/MyAssignments.vue"
import UploadProof from "@/views/driver/UploadProof.vue"
import RemitPayment from "@/views/driver/RemitPayment.vue"
import DriverProfile from "@/views/driver/Profile.vue"
import DriverLogin from "@/views/driver/DriverLogin.vue"
import DriverRegister from "@/views/driver/DriverRegister.vue"
import DriverChat from "@/views/driver/Chat.vue"
import DeliveryTracking from "@/views/driver/DeliveryTracking.vue"

// Admin Pages
import AdminDashboard from "@/views/admin/Dashboard.vue"
import ManageOrders from "@/views/admin/ManageOrders.vue"
import ManageDrivers from "@/views/admin/ManageDrivers.vue"
import ManageUsers from "@/views/admin/ManageUsers.vue"
import DriverApplications from "@/views/admin/DriverApplications.vue"
import PricingPanel from "@/views/admin/PricingPanel.vue"
import SystemSettings from "@/views/admin/SystemSettings.vue"
import ChatMonitoring from "@/views/admin/ChatMonitoring.vue"
import AdminLogin from "@/views/admin/AdminLogin.vue"
import AdminRegister from "@/views/admin/AdminRegister.vue"
import ManageRemittances from "@/views/admin/ManageRemittances.vue"

/* -------------------- Routes -------------------- */
const routes = [
  // Guest
  {
    path: "/",
    component: GuestLayout,
    children: [
      { path: "", name: "home", component: HomePage },
      { path: "login", name: "login", component: LoginPage },
      { path: "register", name: "register", component: RegisterPage },
      { path: "verify-email", name: "verify-email", component: VerifyEmail },
      { path: "verify-email-success", name: "verify-email-success", component: VerifyEmailSuccess },
    ],
  },

  // Standalone auth pages for driver/admin
  { path: "/driver/login", name: "driver-login", component: DriverLogin },
  { path: "/driver/register", name: "driver-register", component: DriverRegister },
  { path: "/admin/login", name: "admin-login", component: AdminLogin },
  { path: "/admin/register", name: "admin-register", component: AdminRegister },

  // User
  {
    path: "/user",
    component: UserLayout,
    meta: { requiresAuth: true, role: "user" },
    children: [
      { path: "", name: "user-dashboard", component: UserDashboard },
      { path: "book", name: "book-service", component: BookService },
      { path: "orders", name: "my-orders", component: MyOrders },
      { path: "payment", name: "upload-payment", component: UploadPayment },
      { path: "profile", name: "user-profile", component: UserProfile },
      { path: "chat-messages/:chatId?", name: "user-chat-messages", component: UserChatMessages },
    ],
  },

  // Driver
  {
    path: "/driver",
    component: DriverLayout,
    meta: { requiresAuth: true, role: "driver" },
    children: [
      { path: "", name: "driver-dashboard", component: DriverDashboard },
      { path: "assignments", name: "my-assignments", component: MyAssignments },
      { path: "proof", name: "upload-proof", component: UploadProof },
      { path: "remit", name: "remit-payment", component: RemitPayment },
      { path: "profile", name: "driver-profile", component: DriverProfile },
      { path: "chat", name: "driver-chat", component: DriverChat },
    ],
  },
  // Delivery Tracking - Full screen view without layout
  {
    path: "/driver/tracking/:orderId",
    name: "delivery-tracking",
    component: DeliveryTracking,
    meta: { requiresAuth: true, role: "driver" },
  },

  // Admin
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "", name: "admin-dashboard", component: AdminDashboard },
      { path: "orders", name: "manage-orders", component: ManageOrders },
      { path: "drivers", name: "manage-drivers", component: ManageDrivers },
      { path: "users", name: "manage-users", component: ManageUsers },
      { path: "applications", name: "driver-applications", component: DriverApplications },
      { path: "remittances", name: "manage-remittances", component: ManageRemittances },
      { path: "pricing", name: "pricing-panel", component: PricingPanel },
      { path: "settings", name: "system-settings", component: SystemSettings },
      { path: "chat-monitoring", name: "chat-monitoring", component: ChatMonitoring },
    ],
  },
]

/* -------------------- Realtime Sync (optimized) -------------------- */

// Reuse ONE BroadcastChannel only
const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("broomtech_sync") : null

class RealTimeSync {
  constructor() {
    this.listeners = new Map() // key => unsubscribe[]
    this.dataCache = new Map()
    this.currentKey = null // `${role}_${uid}` currently active
  }

  initializeRoleListeners(userRole, userId, routePath) {
    const key = `${userRole}_${userId}`
    if (this.currentKey === key) {
      // already set for this (uid,role)
      return
    }
    this.clearAllListeners()
    this.currentKey = key

    switch (userRole) {
      case "user":
        this.setupUserListeners(userId)
        break
      case "driver":
        this.setupDriverListeners(userId)
        break
      case "admin":
        // Optional micro-optimization: only set heavy admin listeners when inside /admin
        if (routePath && routePath.startsWith("/admin")) {
          this.setupAdminListeners(userId)
        }
        break
    }
  }

  setupUserListeners(userId) {
    const unsubs = []

    // User orders
    const ordersQ = query(collection(db, "orders"), where("userId", "==", userId))
    unsubs.push(
      onSnapshot(ordersQ, (snap) => {
        const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        this.updateCache("userOrders", orders)
        this.broadcast("userOrders", orders)
      }),
    )

    // User profile
    unsubs.push(
      onSnapshot(doc(db, "users", userId), (docSnap) => {
        if (docSnap.exists()) {
          const profile = { id: docSnap.id, ...docSnap.data() }
          this.updateCache("userProfile", profile)
          this.broadcast("userProfile", profile)
        }
      }),
    )

    this.listeners.set(`user_${userId}`, unsubs)
  }

  setupDriverListeners(userId) {
    const unsubs = []

    // Available (pending) bookings
    const bookingsQ = query(collection(db, "orders"), where("status", "==", "pending"))
    unsubs.push(
      onSnapshot(bookingsQ, (snap) => {
        const bookings = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        this.updateCache("availableBookings", bookings)
        this.broadcast("availableBookings", bookings)
      }),
    )

    // Driver assignments
    const assignQ = query(collection(db, "orders"), where("driverId", "==", userId))
    unsubs.push(
      onSnapshot(assignQ, (snap) => {
        const assignments = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        this.updateCache("driverAssignments", assignments)
        this.broadcast("driverAssignments", assignments)
      }),
    )

    // Driver profile
    unsubs.push(
      onSnapshot(doc(db, "users", userId), (docSnap) => {
        if (docSnap.exists()) {
          const profile = { id: docSnap.id, ...docSnap.data() }
          this.updateCache("driverProfile", profile)
          this.broadcast("driverProfile", profile)
        }
      }),
    )

    this.listeners.set(`driver_${userId}`, unsubs)
  }

  setupAdminListeners(userId) {
    const unsubs = []

    // All orders
    unsubs.push(
      onSnapshot(collection(db, "orders"), (snap) => {
        const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        this.updateCache("allOrders", orders)
        this.broadcast("allOrders", orders)
      }),
    )

    // All users
    unsubs.push(
      onSnapshot(collection(db, "users"), (snap) => {
        const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        this.updateCache("allUsers", users)
        this.broadcast("allUsers", users)
      }),
    )

    // Driver applications (pending)
    const appsQ = query(collection(db, "users"), where("role", "==", "driver"), where("approved", "==", false))
    unsubs.push(
      onSnapshot(appsQ, (snap) => {
        const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        this.updateCache("driverApplications", apps)
        this.broadcast("driverApplications", apps)
      }),
    )

    // NOTE: your rules/docs used `settings/system` not `systemSettings/general`.
    // If you really need realtime settings, align path with rules or handle locally.

    this.listeners.set(`admin_${userId}`, unsubs)
  }

  updateCache(key, data) {
    this.dataCache.set(key, data)
  }

  broadcast(type, data) {
    if (bc) bc.postMessage({ type, data, ts: Date.now() })
    window.dispatchEvent(new CustomEvent("realtimeUpdate", { detail: { type, data } }))
  }

  clearAllListeners() {
    this.listeners.forEach((arr) => arr.forEach((u) => u && u()))
    this.listeners.clear()
    this.dataCache.clear()
    this.currentKey = null
  }
}

const realTimeSync = new RealTimeSync()

/* -------------------- Router -------------------- */

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * Ultra-fast guard - ALL DELAYS REMOVED:
 * - No auth initialization during navigation
 * - No realtime setup during navigation
 * - Pure synchronous checks only
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Auth initialization now happens only in background, never blocks navigation

  // Setup listeners in nextTick to avoid blocking navigation
  if (authStore.isAuthenticated && authStore.userProfile) {
    const uid = authStore.user.uid
    const role = authStore.userProfile.role
    // Don't block navigation - setup listeners after route resolves
    setTimeout(() => {
      realTimeSync.initializeRoleListeners(role, uid, to.path)
    }, 0)
  }

  // Guarded routes - pure synchronous checks only
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      if (to.path.startsWith("/admin")) return next("/admin/login")
      if (to.path.startsWith("/driver")) return next("/driver/login")
      return next("/login")
    }

    // approval gate (non-admin users)
    if (!authStore.isApproved && authStore.userProfile?.role !== "admin") {
      return next("/login")
    }

    // PROFILE COMPLETION CHECK
    if (authStore.needsProfileCompletion && to.name === "book-service") {
      return next("/user/profile?complete=true")
    }

    // role gate
    if (to.meta.role) {
      const role = authStore.userProfile?.role
      if (role !== to.meta.role) {
        if (role === "user") return next("/user")
        if (role === "driver") return next("/driver")
        if (role === "admin") return next("/admin")
        return next("/")
      }
    }
  }

  // Authenticated users shouldn't see guest auth pages
  if (
    authStore.isAuthenticated &&
    ["login", "register", "admin-login", "driver-login", "driver-register", "admin-register"].includes(to.name)
  ) {
    const role = authStore.userProfile?.role
    if (role === "user") return next("/user")
    if (role === "driver") return next("/driver")
    if (role === "admin") return next("/admin")
    return next("/")
  }

  return next()
})

/* Logout listener: clear once */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    realTimeSync.clearAllListeners()
  }
})

/* Cross-tab sync: single channel listener */
if (bc) {
  bc.addEventListener("message", (evt) => {
    const data = evt.data
    if (!data) return
    const { type, data: messageData } = data
    if (!type) return
    realTimeSync.updateCache(type, messageData)
    window.dispatchEvent(new CustomEvent("realtimeUpdate", { detail: { type, data: messageData } }))
  })
}

export { realTimeSync }
export default router
