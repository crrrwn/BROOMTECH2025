<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <!-- Use translation for title and description -->
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('systemSettings.title') }}</h1>
        <p class="text-gray-600">{{ t('systemSettings.description') }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          @click="saveSettings"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          {{ t('common.save') }}
        </button>
        <button 
          @click="resetSettings"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {{ t('common.reset') }}
        </button>
      </div>
    </div>

    <!-- System Status -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <!-- Use translation for section title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('systemSettings.systemStatus') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <!-- Use translations for toggle labels -->
            <p class="text-sm font-medium text-gray-700">{{ t('systemSettings.badWeatherFee') }}</p>
            <p class="text-xs text-gray-500">Add ₱10 surcharge during bad weather</p>
          </div>
          <button 
            @click="toggleBadWeatherFee"
            :class="[ 
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              systemStatus.badWeatherFee ? 'bg-red-500' : 'bg-gray-300'
            ]"
          >
            <span 
              :class="[ 
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                systemStatus.badWeatherFee ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
      <div class="space-y-6">
        <!-- Change Password -->
        <div class="p-4 border rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 mb-3">Change Password</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                v-model="securitySettings.currentPassword"
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                v-model="securitySettings.newPassword"
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                v-model="securitySettings.confirmPassword"
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Confirm new password"
              />
            </div>
            <button 
              @click="changePassword"
              :disabled="changingPassword"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </div>

        <!-- Delete Admin Account -->
        <div class="p-4 border border-red-200 rounded-lg bg-red-50">
          <h4 class="text-sm font-medium text-red-900 mb-2">Delete Admin Account</h4>
          <p class="text-xs text-red-700 mb-4">
            Warning: This will permanently delete your admin account. After deletion, the admin registration page will be available again for creating a new admin account.
          </p>
          <button 
            @click="showDeleteConfirm = true"
            :disabled="deletingAccount"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ deletingAccount ? 'Deleting...' : 'Delete Admin Account' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-red-900 mb-4">Confirm Account Deletion</h3>
        <p class="text-sm text-gray-700 mb-4">
          Are you sure you want to delete your admin account? This action cannot be undone. 
          After deletion, you will be logged out and the admin registration page will be available again.
        </p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Enter your password to confirm:</label>
          <input 
            v-model="deletePassword"
            type="password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Enter your password"
          />
        </div>
        <div class="flex space-x-3">
          <button 
            @click="deleteAdminAccount"
            :disabled="deletingAccount || !deletePassword"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ deletingAccount ? 'Deleting...' : 'Delete Account' }}
          </button>
          <button 
            @click="showDeleteConfirm = false; deletePassword = ''"
            :disabled="deletingAccount"
            class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('systemSettings.notificationSettings') }}</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ t('systemSettings.orderConfirmation') }}</p>
            <p class="text-xs text-gray-500">{{ t('systemSettings.orderConfirmationDesc') }}</p>
          </div>
          <input 
            v-model="notificationSettings.orderConfirmation"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ t('systemSettings.driverAssignment') }}</p>
            <p class="text-xs text-gray-500">{{ t('systemSettings.driverAssignmentDesc') }}</p>
          </div>
          <input 
            v-model="notificationSettings.driverAssignment"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ t('systemSettings.deliveryUpdates') }}</p>
            <p class="text-xs text-gray-500">{{ t('systemSettings.deliveryUpdatesDesc') }}</p>
          </div>
          <input 
            v-model="notificationSettings.deliveryUpdates"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">{{ t('systemSettings.paymentConfirmations') }}</p>
            <p class="text-xs text-gray-500">{{ t('systemSettings.paymentConfirmationsDesc') }}</p>
          </div>
          <input 
            v-model="notificationSettings.paymentConfirmations"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      </div>
    </div>


    <!-- System Logs -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ t('systemSettings.recentSystemLogs') }}</h3>
        <div class="flex items-center space-x-2">
          <button 
            @click="refreshLogs"
            :disabled="loadingLogs"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
          >
            {{ loadingLogs ? 'Refreshing...' : 'Refresh' }}
          </button>
          <button 
            @click="clearLogs"
            :disabled="loadingLogs || systemLogs.length === 0"
            class="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {{ t('common.clearLogs') }}
          </button>
        </div>
      </div>
      
      <div v-if="loadingLogs" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>

      <div v-else-if="systemLogs.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-gray-500">No system logs available</p>
      </div>

      <div v-else class="space-y-2 max-h-96 overflow-y-auto">
        <div v-for="log in systemLogs" :key="log.id" class="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex items-start space-x-3 flex-1">
            <div :class="[ 
              'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
              log.level === 'error' ? 'bg-red-500' : 
              log.level === 'warning' ? 'bg-yellow-500' : 
              log.level === 'info' ? 'bg-blue-500' : 
              'bg-green-500'
            ]"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ log.message }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <p class="text-xs text-gray-500">{{ log.timestamp }}</p>
                <span v-if="log.userType" :class="[ 
                  'px-2 py-0.5 text-xs font-medium rounded',
                  log.userType === 'user' ? 'bg-blue-100 text-blue-700' : 
                  log.userType === 'driver' ? 'bg-purple-100 text-purple-700' : 
                  log.userType === 'admin' ? 'bg-green-100 text-green-700' : 
                  'bg-gray-100 text-gray-700'
                ]">
                  {{ log.userType.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <span :class="[ 
            'px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2',
            log.level === 'error' ? 'bg-red-100 text-red-800' : 
            log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
            log.level === 'info' ? 'bg-blue-100 text-blue-800' : 
            'bg-green-100 text-green-800'
          ]">
            {{ log.level.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { db, auth } from '@/firebase/config'
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from 'firebase/auth'
import { loggingService } from '@/services/loggingService'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const defaultSystemStatus = {
  badWeatherFee: false
}

const defaultNotificationSettings = {
  orderConfirmation: true,
  driverAssignment: true,
  deliveryUpdates: true,
  paymentConfirmations: true
}

const systemStatus = ref({
  badWeatherFee: false
})

const notificationSettings = ref({
  orderConfirmation: true,
  driverAssignment: true,
  deliveryUpdates: true,
  paymentConfirmations: true
})

const systemLogs = ref([])
const loadingLogs = ref(false)

// Security Settings
const securitySettings = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changingPassword = ref(false)
const showDeleteConfirm = ref(false)
const deletePassword = ref('')
const deletingAccount = ref(false)

const initializeComponent = () => {
  loadSystemSettings()
  loadSystemLogs()
}

onMounted(initializeComponent)

const toggleBadWeatherFee = async () => {
  try {
    systemStatus.value.badWeatherFee = !systemStatus.value.badWeatherFee
    
    const settingsRef = doc(db, 'settings', 'system')
    await updateDoc(settingsRef, {
      badWeatherFee: systemStatus.value.badWeatherFee,
      updatedAt: new Date()
    })
    
    // Log the activity
    await loggingService.logBadWeatherFeeToggle(
      null,
      systemStatus.value.badWeatherFee
    )
    
    toast.success(
      systemStatus.value.badWeatherFee 
        ? t('systemSettings.badWeatherFeeEnabled') 
        : t('systemSettings.badWeatherFeeDisabled')
    )
    
    // Refresh logs to show the new entry
    await loadSystemLogs()
  } catch (error) {
    console.error('Error updating bad weather fee:', error)
    toast.error(t('common.updateFailed'))
    systemStatus.value.badWeatherFee = !systemStatus.value.badWeatherFee
  }
}


const saveSettings = async () => {
  try {
    const systemSettingsRef = doc(db, 'settings', 'system')
    await setDoc(systemSettingsRef, {
      badWeatherFee: systemStatus.value.badWeatherFee,
      updatedAt: new Date()
    }, { merge: true })
    
    const notificationSettingsRef = doc(db, 'settings', 'notifications')
    await setDoc(notificationSettingsRef, {
      ...notificationSettings.value,
      updatedAt: new Date()
    }, { merge: true })
    
    // Log the settings update
    await loggingService.logSystemSettingsUpdate(null, 'all settings')
    
    toast.success(t('common.saveSuccess'))
    
    // Refresh logs to show the new entry
    await loadSystemLogs()
  } catch (error) {
    console.error('Error saving settings:', error)
    toast.error(t('common.saveFailed'))
  }
}

const resetSettings = async () => {
  try {
    // Reset all settings to default values
    systemStatus.value = { ...defaultSystemStatus }
    notificationSettings.value = { ...defaultNotificationSettings }
    
    // Save to Firebase
    const systemSettingsRef = doc(db, 'settings', 'system')
    await setDoc(systemSettingsRef, {
      ...defaultSystemStatus,
      updatedAt: new Date()
    })
    
    const notificationSettingsRef = doc(db, 'settings', 'notifications')
    await setDoc(notificationSettingsRef, {
      ...defaultNotificationSettings,
      updatedAt: new Date()
    })
    
    toast.success(t('common.resetSuccess'))
  } catch (error) {
    console.error('Error resetting settings:', error)
    toast.error(t('common.resetFailed'))
  }
}

const clearLogs = async () => {
  if (!confirm('Are you sure you want to clear all system logs? This action cannot be undone.')) {
    return
  }

  try {
    loadingLogs.value = true
    const success = await loggingService.clearAllLogs()
    
    if (success) {
      systemLogs.value = []
      toast.success(t('common.logsCleared'))
      
      // Log the clearing action
      await loggingService.info(
        'System logs cleared by admin',
        loggingService.USER_TYPES.ADMIN,
        null,
        { action: 'logs_cleared' }
      )
    } else {
      toast.error('Failed to clear logs')
    }
  } catch (error) {
    console.error('Error clearing logs:', error)
    toast.error('Failed to clear logs')
  } finally {
    loadingLogs.value = false
  }
}


const loadSystemSettings = async () => {
  try {
    const settingsRef = doc(db, 'settings', 'system')
    const settingsDoc = await getDoc(settingsRef)
    
    if (settingsDoc.exists()) {
      const settings = settingsDoc.data()
      systemStatus.value.badWeatherFee = settings.badWeatherFee || false
    }
    
    const notificationSettingsRef = doc(db, 'settings', 'notifications')
    const notificationSettingsDoc = await getDoc(notificationSettingsRef)
    
    if (notificationSettingsDoc.exists()) {
      notificationSettings.value = { ...notificationSettingsDoc.data() }
    }
  } catch (error) {
    console.error('Error loading system settings:', error)
    toast.error(t('common.loadFailed'))
  }
}

const loadSystemLogs = async () => {
  try {
    console.log('[v0] Loading system logs...')
    loadingLogs.value = true
    const logs = await loggingService.getRecentLogs(50)
    console.log('[v0] Loaded logs:', logs)
    console.log('[v0] Number of logs:', logs.length)
    systemLogs.value = logs
  } catch (error) {
    console.error('[v0] Error loading system logs:', error)
    console.error('[v0] Error details:', error.message, error.code)
    toast.error('Failed to load system logs: ' + error.message)
  } finally {
    loadingLogs.value = false
  }
}

const refreshLogs = async () => {
  await loadSystemLogs()
  toast.success('Logs refreshed')
}

const changePassword = async () => {
  if (!securitySettings.value.currentPassword || !securitySettings.value.newPassword || !securitySettings.value.confirmPassword) {
    toast.error('Please fill in all password fields')
    return
  }

  if (securitySettings.value.newPassword !== securitySettings.value.confirmPassword) {
    toast.error('New passwords do not match')
    return
  }

  if (securitySettings.value.newPassword.length < 6) {
    toast.error('New password must be at least 6 characters long')
    return
  }

  changingPassword.value = true
  try {
    const user = auth.currentUser
    if (!user || !user.email) {
      toast.error('User not authenticated')
      return
    }

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, securitySettings.value.currentPassword)
    await reauthenticateWithCredential(user, credential)

    // Update password
    await updatePassword(user, securitySettings.value.newPassword)

    // Clear form
    securitySettings.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    toast.success('Password changed successfully')
    
    // Log the activity
    await loggingService.info(
      'Admin password changed',
      loggingService.USER_TYPES.ADMIN,
      user.uid,
      { action: 'password_changed' }
    )

    await loadSystemLogs()
  } catch (error) {
    console.error('Error changing password:', error)
    if (error.code === 'auth/wrong-password') {
      toast.error('Current password is incorrect')
    } else if (error.code === 'auth/weak-password') {
      toast.error('New password is too weak')
    } else {
      toast.error('Failed to change password: ' + error.message)
    }
  } finally {
    changingPassword.value = false
  }
}

const deleteAdminAccount = async () => {
  if (!deletePassword.value) {
    toast.error('Please enter your password to confirm deletion')
    return
  }

  deletingAccount.value = true
  try {
    const user = auth.currentUser
    if (!user || !user.email) {
      toast.error('User not authenticated')
      return
    }

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, deletePassword.value)
    await reauthenticateWithCredential(user, credential)

    // Delete admin document from Firestore
    const adminRef = doc(db, 'admins', user.uid)
    await deleteDoc(adminRef)

    // Reset adminExists flag to allow new admin registration
    const settingsRef = doc(db, 'settings', 'system')
    await updateDoc(settingsRef, {
      adminExists: false,
      updatedAt: new Date()
    })

    // Delete Firebase Auth user
    await deleteUser(user)

    toast.success('Admin account deleted successfully. You will be redirected to the registration page.')
    
    // Log the activity before logout
    try {
      await loggingService.info(
        'Admin account deleted',
        loggingService.USER_TYPES.ADMIN,
        user.uid,
        { action: 'admin_deleted' }
      )
    } catch (logError) {
      console.error('Error logging deletion:', logError)
    }

    // Sign out and redirect
    await authStore.logout()
    router.push('/admin/register')
  } catch (error) {
    console.error('Error deleting admin account:', error)
    if (error.code === 'auth/wrong-password') {
      toast.error('Password is incorrect')
    } else if (error.code === 'auth/requires-recent-login') {
      toast.error('Please log out and log back in before deleting your account')
    } else {
      toast.error('Failed to delete account: ' + error.message)
    }
    showDeleteConfirm.value = false
    deletePassword.value = ''
  } finally {
    deletingAccount.value = false
  }
}
</script>
