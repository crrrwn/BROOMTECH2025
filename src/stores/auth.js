import { defineStore } from "pinia"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where, deleteDoc } from "firebase/firestore"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "@/firebase/config"
import { loggingService } from "@/services/loggingService"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    userProfile: null, // { id, role, approved, ... } (from admins/users/drivers)
    loading: true,
    isAuthenticated: false,
  }),

  getters: {
    isUser: (s) => s.userProfile?.role === "user",
    isDriver: (s) => s.userProfile?.role === "driver",
    isAdmin: (s) => s.userProfile?.role === "admin",
    isApproved: (s) => s.userProfile?.approved === true,
    needsApproval: (s) => s.userProfile?.approved === false,
    needsProfileCompletion: (s) =>
      s.userProfile?.isGoogleUser && !s.userProfile?.profileComplete && s.userProfile?.approved,
  },

  actions: {
    // ---------- auth lifecycle ----------
    async initAuth() {
      // Return a promise that resolves when auth state is determined
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.user = user
            await this.fetchUserProfile()
            this.isAuthenticated = true
          } else {
            this.user = null
            this.userProfile = null
            this.isAuthenticated = false
          }
          this.loading = false
          unsubscribe() // one-shot init
          resolve() // Resolve promise when auth state is determined
        })
      })
    },

    // Fetch the profile from admins → drivers → users
    // Priority: admins first, then drivers (to avoid conflicts), then users
    async fetchUserProfile() {
      if (!this.user) return
      try {
        // 1) admins
        let snap = await getDoc(doc(db, "admins", this.user.uid))
        if (snap.exists()) {
          const data = snap.data()
          this.userProfile = { id: snap.id, ...data, role: data.role || "admin" }
          return
        }

        // 2) drivers (check before users to avoid conflicts)
        snap = await getDoc(doc(db, "drivers", this.user.uid))
        if (snap.exists()) {
          const data = snap.data()
          this.userProfile = { id: snap.id, ...data, role: data.role || "driver" }
          return
        }

        // 3) users
        snap = await getDoc(doc(db, "users", this.user.uid))
        if (snap.exists()) {
          const data = snap.data()
          this.userProfile = { id: snap.id, ...data, role: data.role || "user" }
          return
        }

        // If no profile found anywhere
        this.userProfile = null
      } catch (error) {
        console.error("Error fetching user profile:", error)
        this.userProfile = null
      }
    },

    async refreshAndGetProfile() {
      await this.fetchUserProfile()
      return this.userProfile
    },

    // ---------- Admin-only login (bypass approval gate for admins) ----------
    async loginAdmin(email, password) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        this.user = cred.user

        // pull admin profile
        const adminDocRef = doc(db, "admins", cred.user.uid)
        const adminDoc = await getDoc(adminDocRef)
        if (!adminDoc.exists()) {
          await signOut(auth)
          return { success: false, message: "This account is not an administrator. Please use the user or driver login page." }
        }

        const admin = adminDoc.data()
        
        // ROLE CHECK: Ensure this is actually an admin account
        if (admin.role !== "admin") {
          await signOut(auth)
          return { success: false, message: "This account is not an administrator. Please use the appropriate login page." }
        }
        
        if (admin?.banned) {
          await signOut(auth)
          return { success: false, message: "Administrator account is banned." }
        }
        if (admin?.approved === false) {
          await signOut(auth)
          return { success: false, message: "Administrator account is not approved." }
        }

        this.userProfile = { id: adminDoc.id, ...admin }
        this.isAuthenticated = true
        return { success: true, message: "Admin login successful!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // ---------- Regular login (users only - for /login route) ----------
    async login(email, password, expectedRole = "user") {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        this.user = cred.user

        // legacy admin bootstrap (kept from your code)
        if (email === "broomteechservices@gmail.com") {
          const ad = await getDoc(doc(db, "admins", cred.user.uid))
          if (!ad.exists()) {
            await setDoc(doc(db, "admins", cred.user.uid), {
              firstName: "Admin",
              lastName: "User",
              email,
              role: "admin",
              approved: true,
              emailVerified: true,
              createdAt: new Date().toISOString(),
            })
          }
          await this.fetchUserProfile()
          return { success: true, message: "Admin login successful!" }
        }

        // IMPORTANT: always refresh after sign-in
        const profile = await this.refreshAndGetProfile()

        // if no profile found at all
        if (!profile) {
          await signOut(auth)
          return { success: false, message: "Profile not found. Please contact support." }
        }

        // ROLE CHECK: Only allow login if role matches expected role
        if (expectedRole === "user" && profile.role !== "user") {
          await signOut(auth)
          return { 
            success: false, 
            message: `This account is registered as a ${profile.role}. Please use the ${profile.role} login page.` 
          }
        }

        // route logic & approval check
        if (profile.role === "admin") {
          // admins bypass approval gate (approval already enforced on admins collection)
          return { success: true, message: "Admin login successful!" }
        }

        // Check email verification for users (not admins)
        if (profile.role === "user" && !this.user.emailVerified) {
          await signOut(auth)
          return { 
            success: false, 
            message: "Please verify your email address before logging in. Check your inbox for the verification link." 
          }
        }

        // Auto-approve users if email is verified (email verification = approval)
        if (profile.role === "user" && this.user.emailVerified && profile.approved === false) {
          await updateDoc(doc(db, "users", cred.user.uid), {
            approved: true,
            approvedAt: new Date().toISOString(),
            emailVerified: true
          })
          // Refresh profile after update
          profile.approved = true
          this.userProfile = { ...profile, approved: true }
        }

        // users & drivers must be approved
        if (profile.banned === true) {
          await signOut(auth)
          return { success: false, message: "Your account is banned." }
        }

        if (profile.approved !== true && profile.role !== "admin") {
          await signOut(auth)
          return { success: false, message: "Your account is pending admin approval." }
        }

        if (profile.role === "driver") {
          await updateDoc(doc(db, "drivers", cred.user.uid), {
            isOnline: true,
            lastLoginAt: new Date().toISOString(),
          })
        }

        // approved user/driver
        this.isAuthenticated = true
        return { success: true, message: "Login successful!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // ---------- Registration flows ----------
    async register(userData) {
      try {
        const { email, password, role = "user", driverInfo, ...profileData } = userData
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Send email verification
        const actionCodeSettings = {
          url: `${window.location.origin}/verify-email-success`,
          handleCodeInApp: true,
        }
        await sendEmailVerification(user, actionCodeSettings)

        const userProfileData = {
          ...profileData,
          email,
          role,
          approved: role === "driver" ? false : false, // Users need email verification first, then admin approval
          emailVerified: false, // Set to false until user verifies
          banned: false,
          createdAt: new Date().toISOString(),
        }

        if (role === "driver" && driverInfo) {
          userProfileData.driverInfo = {
            ...driverInfo,
            applicationStatus: "pending",
            applicationDate: new Date().toISOString(),
            approvedAt: null,
            approvedBy: null,
          }
        }

        await setDoc(doc(db, "users", user.uid), {
          ...userProfileData,
          verificationSentAt: new Date().toISOString() // Store when verification was sent
        })

        const userName = `${profileData.firstName} ${profileData.lastName}`.trim()
        await loggingService.logUserRegistration(user.uid, userName)

        // Sign out the user after registration
        await signOut(auth)

        const message =
          role === "driver"
            ? "Driver application submitted successfully! Please check your email to verify your account."
            : "Registration successful! Please check your email to verify your account. Once verified, you can log in."

        return { success: true, message }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async loginWithGoogle() {
      try {
        const provider = new GoogleAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        const user = userCredential.user

        const userDocSnap = await getDoc(doc(db, "users", user.uid))
        if (!userDocSnap.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
            email: user.email,
            role: "user",
            approved: false, // Google users also need admin approval
            emailVerified: true, // Google accounts are pre-verified
            banned: false,
            isGoogleUser: true,
            profileComplete: false,
            phone: "",
            address: "",
            barangay: "",
            contact: "",
            middleName: "",
            createdAt: new Date().toISOString(),
          })
        }

        const userProfile = await getDoc(doc(db, "users", user.uid))
        if (!userProfile.exists()) {
          await signOut(auth)
          return { success: false, message: "Profile not found. Please contact support." }
        }

        const profile = { id: userProfile.id, ...userProfile.data() }
        this.user = user
        this.userProfile = profile
        this.isAuthenticated = true

        if (profile.banned === true) {
          await signOut(auth)
          return { success: false, message: "Your account is banned." }
        }

        if (profile.approved !== true) {
          await signOut(auth)
          return { success: false, message: "Your account is pending admin approval." }
        }

        return { success: true, message: "Google login successful!" }
      } catch (error) {
        console.error("Google login error:", error)
        return { success: false, message: error.message }
      }
    },

    async logout() {
      try {
        if (this.userProfile?.role === "driver" && this.user) {
          await updateDoc(doc(db, "drivers", this.user.uid), {
            isOnline: false,
            lastLogoutAt: new Date().toISOString(),
          })
        }

        await signOut(auth)
        this.user = null
        this.userProfile = null
        this.isAuthenticated = false
        return { success: true, message: "Logged out successfully!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email)
        return { success: true, message: "Password reset email sent!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async updateProfile(profileData) {
      if (!this.user) return { success: false, message: "Not authenticated" }
      try {
        const updateData = { ...profileData }
        if (this.userProfile?.isGoogleUser && !this.userProfile?.profileComplete) {
          if (profileData.phone && profileData.address) {
            updateData.profileComplete = true
          }
        }
        // note: self-profile updates live in /users/{uid}
        await updateDoc(doc(db, "users", this.user.uid), updateData)
        await this.fetchUserProfile()
        return { success: true, message: "Profile updated successfully!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },


    // ---------- Admin utilities ----------
    async getAllUsers() {
      try {
        const usersQuery = query(collection(db, "users"), where("role", "not-in", ["admin", "driver"]))
        const querySnapshot = await getDocs(usersQuery)
        const users = []
        querySnapshot.forEach((d) => {
          const userData = d.data()
          users.push({
            id: d.id,
            ...userData,
            name: `${userData.firstName} ${userData.lastName}`.trim(),
            initials: `${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}`.toUpperCase(),
            registeredDate: new Date(userData.createdAt).toLocaleDateString(),
            status: userData.banned ? "banned" : userData.approved ? "approved" : "pending",
            totalOrders: 0,
          })
        })
        return users
      } catch (error) {
        console.error("Error fetching users:", error)
        return []
      }
    },

    async getDriverApplications() {
      try {
        const driversQuery = query(collection(db, "drivers"))
        const querySnapshot = await getDocs(driversQuery)
        const applications = []
        querySnapshot.forEach((d) => {
          const userData = d.data()
          applications.push({
            id: d.id,
            name: userData.fullName || `${userData.firstName} ${userData.lastName}`.trim(),
            email: userData.email,
            contact: userData.contact || userData.phone,
            motorcycleInfo: userData.driverInfo?.motorcycleInfo || {},
            experience: userData.driverInfo?.experience,
            availability: userData.driverInfo?.availability,
            documents: userData.driverInfo?.documents || {},
            applicationDate: new Date(userData.driverInfo?.applicationDate || userData.createdAt).toLocaleDateString(),
            status: userData.driverInfo?.applicationStatus || (userData.approved ? "approved" : "pending"),
            approved: userData.approved,
            initials: (userData.fullName
              ? userData.fullName.split(" ").map((n) => n[0])
              : [userData.firstName?.[0] || "", userData.lastName?.[0] || ""]
            )
              .join("")
              .toUpperCase(),
          })
        })
        return applications
      } catch (error) {
        console.error("Error fetching driver applications:", error)
        return []
      }
    },

    async approveDriver(userId, adminId) {
      try {
        const driverDoc = await getDoc(doc(db, "drivers", userId))
        const driverData = driverDoc.data()
        const driverName = driverData?.fullName || `${driverData?.firstName} ${driverData?.lastName}`.trim()

        await updateDoc(doc(db, "drivers", userId), {
          approved: true,
          "driverInfo.applicationStatus": "approved",
          "driverInfo.approvedAt": new Date().toISOString(),
          "driverInfo.approvedBy": adminId,
          updatedAt: new Date().toISOString(),
        })

        await loggingService.logDriverApproval(userId, driverName, adminId)

        return { success: true, message: "Driver application approved successfully" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async rejectDriver(userId, adminId, reason = "") {
      try {
        const driverDoc = await getDoc(doc(db, "drivers", userId))
        const driverData = driverDoc.data()
        const driverName = driverData?.fullName || `${driverData?.firstName} ${driverData?.lastName}`.trim()

        await updateDoc(doc(db, "drivers", userId), {
          "driverInfo.applicationStatus": "rejected",
          "driverInfo.rejectedAt": new Date().toISOString(),
          "driverInfo.rejectedBy": adminId,
          "driverInfo.rejectionReason": reason,
          updatedAt: new Date().toISOString(),
        })

        await loggingService.logDriverRejection(userId, driverName, adminId)

        return { success: true, message: "Driver application rejected" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async approveUser(userId) {
      try {
        const userDoc = await getDoc(doc(db, "users", userId))
        const userData = userDoc.data()
        const userName = `${userData?.firstName} ${userData?.lastName}`.trim()

        await updateDoc(doc(db, "users", userId), {
          approved: true,
          updatedAt: new Date().toISOString(),
        })

        await loggingService.success(`User approved: ${userName}`, loggingService.USER_TYPES.ADMIN, null, {
          action: "user_approval",
          userId,
          userName,
        })

        return { success: true, message: "User approved successfully!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async rejectUser(userId) {
      try {
        await deleteDoc(doc(db, "users", userId))
        return { success: true, message: "User rejected and removed" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async banUser(userId) {
      try {
        await updateDoc(doc(db, "users", userId), {
          banned: true,
          updatedAt: new Date().toISOString(),
        })
        return { success: true, message: "User banned successfully!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async unbanUser(userId) {
      try {
        await updateDoc(doc(db, "users", userId), {
          banned: false,
          updatedAt: new Date().toISOString(),
        })
        return { success: true, message: "User unbanned successfully!" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    async updateAutoAcceptSetting(enabled) {
      try {
        await setDoc(
          doc(db, "settings", "system"),
          { autoAcceptUsers: enabled, updatedAt: new Date().toISOString() },
          { merge: true },
        )
        return { success: true, message: "Auto-accept setting updated" }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // ---------- First-admin creation ----------
    async registerAdmin(adminData) {
      try {
        const settingsRef = doc(db, "settings", "system")
        const settingsSnap = await getDoc(settingsRef)
        if (settingsSnap.exists() && settingsSnap.data().adminExists === true) {
          return { success: false, message: "An administrator already exists." }
        }

        const { email, password, firstName, lastName } = adminData
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const adminProfileData = {
          firstName,
          lastName,
          email,
          role: "admin",
          approved: true,
          emailVerified: true,
          banned: false,
          createdAt: new Date().toISOString(),
        }
        await setDoc(doc(db, "admins", user.uid), adminProfileData)
        await setDoc(settingsRef, { adminExists: true, updatedAt: new Date().toISOString() }, { merge: true })

        await signOut(auth)
        return { success: true, message: "Administrator account created successfully! You can now login." }
      } catch (error) {
        console.error("Admin registration error:", error)
        try {
          if (error.code === "permission-denied" && auth.currentUser) await deleteUser(auth.currentUser)
        } catch {}
        if (error.code === "auth/email-already-in-use")
          return { success: false, message: "This email address is already registered." }
        if (error.code === "auth/weak-password")
          return { success: false, message: "Password is too weak. Please use a stronger password." }
        if (error.code === "auth/invalid-email") return { success: false, message: "Invalid email address format." }
        if (error.code === "auth/network-request-failed")
          return { success: false, message: "Network error. Please check your internet connection and try again." }
        return {
          success: false,
          message: error.message || "An error occurred during admin registration. Please try again.",
        }
      }
    },

    async checkAdminExists() {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "system"))
        if (settingsSnap.exists() && typeof settingsSnap.data().adminExists === "boolean") {
          return settingsSnap.data().adminExists
        }
        return false
      } catch (err) {
        console.warn("checkAdminExists warning:", err?.code || err?.message || err)
        return false
      }
    },

    // ---------- Driver registration ----------
    async registerDriver(driverData) {
      try {
        const { email, password, documents, ...profileData } = driverData

        if (!documents || !documents.license || !documents.orcr || !documents.selfie || !documents.profilePicture) {
          return { success: false, error: "All required documents must be uploaded" }
        }

        for (const [docType, file] of Object.entries(documents || {})) {
          if (file) {
            if (file.size > 10 * 1024 * 1024) {
              return { success: false, error: `${docType} file is too large. Maximum size is 10MB.` }
            }
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]
            if (!allowedTypes.includes(file.type)) {
              return { success: false, error: `${docType} must be an image (JPG, PNG, WebP) or PDF file.` }
            }
          }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const documentUrls = {}
        for (const [docType, file] of Object.entries(documents || {})) {
          if (file) {
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(2, 15)
            const fileExtension = file.name.split(".").pop()
            const fileName = `${docType}_${timestamp}_${randomString}.${fileExtension}`
            const fileRef = storageRef(storage, `driver-documents/${user.uid}/${fileName}`)
            const metadata = {
              contentType: file.type,
              customMetadata: {
                originalName: file.name,
                uploadedAt: new Date().toISOString(),
                documentType: docType,
              },
            }
            const snapshot = await uploadBytes(fileRef, file, metadata)
            documentUrls[docType] = await getDownloadURL(snapshot.ref)
          }
        }

        const userProfileData = {
          fullName: profileData.fullName,
          contact: profileData.contact,
          email,
          role: "driver",
          approved: false,
          emailVerified: true,
          banned: false,
          createdAt: new Date().toISOString(),
          driverInfo: {
            motorcycleInfo: profileData.motorcycleInfo,
            experience: profileData.experience,
            availability: profileData.availability,
            documents: documentUrls,
            applicationStatus: "pending",
            applicationDate: new Date().toISOString(),
            approvedAt: null,
            approvedBy: null,
          },
        }

        await setDoc(doc(db, "drivers", user.uid), userProfileData)

        await loggingService.logDriverRegistration(user.uid, profileData.fullName)

        return { success: true, message: "Driver application submitted successfully! Please wait for admin approval." }
      } catch (error) {
        if (error.code === "auth/email-already-in-use")
          return { success: false, error: "This email address is already registered." }
        if (error.code === "auth/weak-password")
          return { success: false, error: "Password must be at least 6 characters long." }
        if (error.code === "auth/invalid-email") return { success: false, error: "Please enter a valid email address." }
        if (error.code === "storage/unauthorized")
          return { success: false, error: "File upload permission denied. Please contact support." }
        if (error.code === "storage/canceled")
          return { success: false, error: "File upload was canceled. Please try again." }
        if (error.code === "storage/unknown")
          return { success: false, error: "File upload failed due to server error. Please try again." }
        if (error.code === "permission-denied")
          return { success: false, error: "Database permission denied. Please contact support." }
        if (error.code === "network-request-failed")
          return { success: false, error: "Network error. Please check your connection and try again." }
        return { success: false, error: error.message || "Registration failed. Please try again." }
      }
    },
  },
})
