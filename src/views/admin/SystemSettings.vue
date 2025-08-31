<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">System Settings</h1>
        <p class="text-gray-600">Configure system-wide settings and preferences</p>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          @click="saveSettings"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Changes
        </button>
        <button 
          @click="resetSettings"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>

    <!-- System Status -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">Maintenance Mode</p>
            <p class="text-xs text-gray-500">System will be unavailable to users</p>
          </div>
          <button 
            @click="toggleMaintenanceMode"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              systemStatus.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                systemStatus.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">Auto-Accept Orders</p>
            <p class="text-xs text-gray-500">Automatically assign orders to drivers</p>
          </div>
          <button 
            @click="toggleAutoAcceptOrders"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              systemStatus.autoAcceptOrders ? 'bg-primary' : 'bg-gray-300'
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                systemStatus.autoAcceptOrders ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">SMS Notifications</p>
            <p class="text-xs text-gray-500">Send SMS updates to users</p>
          </div>
          <button 
            @click="toggleSMSNotifications"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              systemStatus.smsNotifications ? 'bg-primary' : 'bg-gray-300'
            ]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                systemStatus.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Application Settings -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Application Settings</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
          <input 
            v-model="appSettings.name"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
          <input 
            v-model="appSettings.supportEmail"
            type="email" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
          <input 
            v-model="appSettings.supportPhone"
            type="tel" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
          <select 
            v-model="appSettings.currency"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="PHP">Philippine Peso (₱)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
          <select 
            v-model="appSettings.timezone"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
            <option value="UTC">UTC (GMT+0)</option>
            <option value="America/New_York">America/New_York (GMT-5)</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select 
            v-model="appSettings.language"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="en">English</option>
            <option value="fil">Filipino</option>
            <option value="tl">Tagalog</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">Order Confirmation</p>
            <p class="text-xs text-gray-500">Send notifications when orders are confirmed</p>
          </div>
          <input 
            v-model="notificationSettings.orderConfirmation"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">Driver Assignment</p>
            <p class="text-xs text-gray-500">Notify users when driver is assigned</p>
          </div>
          <input 
            v-model="notificationSettings.driverAssignment"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">Delivery Updates</p>
            <p class="text-xs text-gray-500">Send real-time delivery status updates</p>
          </div>
          <input 
            v-model="notificationSettings.deliveryUpdates"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">Payment Confirmations</p>
            <p class="text-xs text-gray-500">Notify when payments are processed</p>
          </div>
          <input 
            v-model="notificationSettings.paymentConfirmations"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input 
            v-model="securitySettings.sessionTimeout"
            type="number" 
            min="5"
            max="480"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input 
            v-model="securitySettings.maxLoginAttempts"
            type="number" 
            min="3"
            max="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
          <input 
            v-model="securitySettings.passwordMinLength"
            type="number" 
            min="6"
            max="20"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Account Lockout Duration (minutes)</label>
          <input 
            v-model="securitySettings.lockoutDuration"
            type="number" 
            min="5"
            max="1440"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      <div class="mt-6 space-y-4">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
            <p class="text-xs text-gray-500">Require 2FA for admin accounts</p>
          </div>
          <input 
            v-model="securitySettings.require2FA"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p class="text-sm font-medium text-gray-700">IP Whitelist</p>
            <p class="text-xs text-gray-500">Restrict admin access to specific IP addresses</p>
          </div>
          <input 
            v-model="securitySettings.enableIPWhitelist"
            type="checkbox" 
            class="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      </div>
    </div>

    <!-- API Configuration -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Google Maps API Key</label>
          <input 
            v-model="apiSettings.googleMapsKey"
            type="password" 
            placeholder="Enter API key..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">SMS Provider API Key</label>
          <input 
            v-model="apiSettings.smsProviderKey"
            type="password" 
            placeholder="Enter API key..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Gateway Key</label>
          <input 
            v-model="apiSettings.paymentGatewayKey"
            type="password" 
            placeholder="Enter API key..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Firebase Config</label>
          <textarea 
            v-model="apiSettings.firebaseConfig"
            rows="3"
            placeholder="Enter Firebase configuration..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- System Logs -->
    <div class="bg-white rounded-lg p-6 shadow-sm border">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Recent System Logs</h3>
        <button 
          @click="clearLogs"
          class="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Clear Logs
        </button>
      </div>
      
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div v-for="log in systemLogs" :key="log.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div :class="[
              'w-2 h-2 rounded-full',
              log.level === 'error' ? 'bg-red-500' :
              log.level === 'warning' ? 'bg-yellow-500' :
              log.level === 'info' ? 'bg-blue-500' :
              'bg-green-500'
            ]"></div>
            <div>
              <p class="text-sm text-gray-900">{{ log.message }}</p>
              <p class="text-xs text-gray-500">{{ log.timestamp }}</p>
            </div>
          </div>
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
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
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const systemStatus = ref({
  maintenanceMode: false,
  autoAcceptOrders: true,
  smsNotifications: true
})

const appSettings = ref({
  name: 'BroomTech Delivery',
  supportEmail: 'support@broomtech.com',
  supportPhone: '+63 912 345 6789',
  currency: 'PHP',
  timezone: 'Asia/Manila',
  language: 'en'
})

const notificationSettings = ref({
  orderConfirmation: true,
  driverAssignment: true,
  deliveryUpdates: true,
  paymentConfirmations: true
})

const securitySettings = ref({
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  lockoutDuration: 30,
  require2FA: false,
  enableIPWhitelist: false
})

const apiSettings = ref({
  googleMapsKey: '',
  smsProviderKey: '',
  paymentGatewayKey: '',
  firebaseConfig: ''
})

const systemLogs = ref([
  {
    id: 1,
    level: 'info',
    message: 'System settings updated by admin',
    timestamp: '2024-01-25 10:30:15'
  },
  {
    id: 2,
    level: 'warning',
    message: 'High number of pending orders detected',
    timestamp: '2024-01-25 10:25:42'
  },
  {
    id: 3,
    level: 'error',
    message: 'SMS service connection failed',
    timestamp: '2024-01-25 10:20:18'
  },
  {
    id: 4,
    level: 'success',
    message: 'Database backup completed successfully',
    timestamp: '2024-01-25 10:15:33'
  }
])

const toggleMaintenanceMode = () => {
  systemStatus.value.maintenanceMode = !systemStatus.value.maintenanceMode
  toast.success(
    systemStatus.value.maintenanceMode 
      ? 'Maintenance mode enabled - system is now offline for users' 
      : 'Maintenance mode disabled - system is now online'
  )
}

const toggleAutoAcceptOrders = () => {
  systemStatus.value.autoAcceptOrders = !systemStatus.value.autoAcceptOrders
  toast.success(
    systemStatus.value.autoAcceptOrders 
      ? 'Auto-accept orders enabled' 
      : 'Auto-accept orders disabled'
  )
}

const toggleSMSNotifications = () => {
  systemStatus.value.smsNotifications = !systemStatus.value.smsNotifications
  toast.success(
    systemStatus.value.smsNotifications 
      ? 'SMS notifications enabled' 
      : 'SMS notifications disabled'
  )
}

const saveSettings = () => {
  // In real app, this would save to database
  toast.success('System settings saved successfully')
}

const resetSettings = () => {
  // In real app, this would reset to default values
  toast.info('Settings reset to default values')
}

const clearLogs = () => {
  systemLogs.value = []
  toast.success('System logs cleared')
}
</script>
