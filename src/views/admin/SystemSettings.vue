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
            <p class="text-xs text-gray-500">{{ t('systemSettings.badWeatherFeeDesc') }}</p>
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

    <!-- Application Settings -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <!-- Use translation for section title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('systemSettings.applicationSettings') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <!-- Use translation for label -->
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('systemSettings.name') }}</label>
          <input 
            v-model="appSettings.name"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <!-- Use translation for label -->
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('systemSettings.supportPhone') }}</label>
          <input 
            v-model="appSettings.supportPhone"
            type="tel" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <!-- Use translation for label -->
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('systemSettings.defaultCurrency') }}</label>
          <input 
            type="text"
            value="Philippine Peso (₱)"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>
        
        <div>
          <!-- Use translation for label -->
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('systemSettings.language') }}</label>
          <select 
            v-model="appSettings.language"
            @change="updateLanguage"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="en">{{ t('systemSettings.languageEnglish') }}</option>
            <option value="tl">{{ t('systemSettings.languageTagalog') }}</option>
          </select>
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
import { db } from '@/firebase/config'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { loggingService } from '@/services/loggingService'

const toast = useToast()
const { t, locale } = useI18n()

const defaultSystemStatus = {
  badWeatherFee: false
}

const defaultAppSettings = {
  name: 'BroomTech Delivery',
  supportPhone: '+63 912 345 6789',
  currency: 'PHP',
  language: 'en'
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

const appSettings = ref({
  name: 'BroomTech Delivery',
  supportPhone: '+63 912 345 6789',
  currency: 'PHP',
  language: 'en'
})

const notificationSettings = ref({
  orderConfirmation: true,
  driverAssignment: true,
  deliveryUpdates: true,
  paymentConfirmations: true
})

const systemLogs = ref([])
const loadingLogs = ref(false)

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
    
    const appSettingsRef = doc(db, 'settings', 'application')
    await setDoc(appSettingsRef, {
      name: appSettings.value.name,
      supportPhone: appSettings.value.supportPhone,
      currency: 'PHP',
      language: appSettings.value.language,
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
    appSettings.value = { ...defaultAppSettings }
    notificationSettings.value = { ...defaultNotificationSettings }
    
    // Update language
    locale.value = defaultAppSettings.language
    
    // Save to Firebase
    const systemSettingsRef = doc(db, 'settings', 'system')
    await setDoc(systemSettingsRef, {
      ...defaultSystemStatus,
      updatedAt: new Date()
    })
    
    const appSettingsRef = doc(db, 'settings', 'application')
    await setDoc(appSettingsRef, {
      ...defaultAppSettings,
      currency: 'PHP',
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

const updateLanguage = async () => {
  try {
    locale.value = appSettings.value.language
    
    const settingsRef = doc(db, 'settings', 'application')
    await setDoc(settingsRef, {
      language: appSettings.value.language,
      updatedAt: new Date()
    }, { merge: true })
    
    const languageNames = {
      en: 'English',
      tl: 'Tagalog'
    }
    
    toast.success(t('systemSettings.languageUpdated', { language: languageNames[appSettings.value.language] }))
  } catch (error) {
    console.error('Error updating language:', error)
    toast.error(t('common.updateFailed'))
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
    
    const appSettingsRef = doc(db, 'settings', 'application')
    const appSettingsDoc = await getDoc(appSettingsRef)
    
    if (appSettingsDoc.exists()) {
      const settings = appSettingsDoc.data()
      appSettings.value.name = settings.name || 'BroomTech Delivery'
      appSettings.value.supportPhone = settings.supportPhone || '+63 912 345 6789'
      appSettings.value.language = settings.language || 'en'
      locale.value = appSettings.value.language
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
</script>
