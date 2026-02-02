<template>
  <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <!-- Green Banner Header -->
    <div class="bg-gradient-to-r from-[#00C851] via-[#3ED400] to-[#74E600] rounded-xl shadow-lg p-6 sm:p-8 mb-6">
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ t('systemSettings.title') }}</h1>
          <p class="text-white/90 text-sm sm:text-base">{{ t('systemSettings.description') }}</p>
        </div>
        <div class="flex flex-wrap gap-2 sm:gap-3">
          <button 
            @click="saveSettings"
            class="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base border border-white/30 shadow-sm hover:shadow-md"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ t('common.save') }}
          </button>
          <button 
            @click="resetSettings"
            class="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base border border-white/30 shadow-sm hover:shadow-md"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ t('common.reset') }}
          </button>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
        <div class="p-2 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
          <svg class="w-5 h-5 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        {{ t('systemSettings.systemStatus') }}
      </h3>
      <div class="grid grid-cols-1 gap-4 sm:gap-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-gradient-to-br from-[#00C851]/5 to-[#3ED400]/5 rounded-xl border border-[#00C851]/20 hover:border-[#00C851]/30 transition-all duration-200">
          <div class="flex-1 mb-3 sm:mb-0">
            <p class="text-sm sm:text-base font-medium text-gray-900 mb-1">{{ t('systemSettings.badWeatherFee') }}</p>
            <p class="text-xs sm:text-sm text-gray-600">Add ₱10 surcharge during bad weather</p>
          </div>
          <button 
            @click="toggleBadWeatherFee"
            :class="[ 
              'relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-all duration-300 shadow-sm',
              systemStatus.badWeatherFee ? 'bg-gradient-to-r from-[#00C851] to-[#3ED400]' : 'bg-gray-300'
            ]"
          >
            <span 
              :class="[ 
                'inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md',
                systemStatus.badWeatherFee ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
        <div class="p-2 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
          <svg class="w-5 h-5 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        Security Settings
      </h3>
      <div class="space-y-4 sm:space-y-6">
        <!-- Change Password -->
        <div class="p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:border-[#00C851]/30 transition-all duration-200">
          <h4 class="text-sm sm:text-base font-medium text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
            Change Password
          </h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                v-model="securitySettings.currentPassword"
                type="password" 
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                v-model="securitySettings.newPassword"
                type="password" 
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                v-model="securitySettings.confirmPassword"
                type="password" 
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C851] focus:border-[#00C851] transition-all duration-200 text-sm sm:text-base"
                placeholder="Confirm new password"
              />
            </div>
            <button 
              @click="changePassword"
              :disabled="changingPassword"
              class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white rounded-lg hover:from-[#00C851]/90 hover:to-[#3ED400]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-medium"
            >
              <svg v-if="changingPassword" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
          </div>
        </div>

        <!-- Delete Admin Account -->
        <div class="p-4 sm:p-5 border-2 border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 hover:border-red-300 transition-all duration-200">
          <h4 class="text-sm sm:text-base font-medium text-red-900 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Delete Admin Account
          </h4>
          <p class="text-xs sm:text-sm text-red-700 mb-4">
            Warning: This will permanently delete your admin account. After deletion, the admin registration page will be available again for creating a new admin account.
          </p>
          <button 
            @click="showDeleteConfirm = true"
            :disabled="deletingAccount"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            {{ deletingAccount ? 'Deleting...' : 'Delete Admin Account' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showDeleteConfirm = false; deletePassword = ''">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 animate-in fade-in zoom-in">
        <div class="p-6 sm:p-8">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-red-900 mb-3 text-center">Confirm Account Deletion</h3>
          <p class="text-sm sm:text-base text-gray-700 mb-6 text-center">
            Are you sure you want to delete your admin account? This action cannot be undone. 
            After deletion, you will be logged out and the admin registration page will be available again.
          </p>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Enter your password to confirm:</label>
            <input 
              v-model="deletePassword"
              type="password" 
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-sm sm:text-base"
              placeholder="Enter your password"
              @keyup.enter="deleteAdminAccount"
            />
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="deleteAdminAccount"
              :disabled="deletingAccount || !deletePassword"
              class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
            >
              <svg v-if="deletingAccount" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ deletingAccount ? 'Deleting...' : 'Delete Account' }}
            </button>
            <button 
              @click="showDeleteConfirm = false; deletePassword = ''"
              :disabled="deletingAccount"
              class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
        <div class="p-2 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
          <svg class="w-5 h-5 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </div>
        {{ t('systemSettings.notificationSettings') }}
      </h3>
      <div class="space-y-3 sm:space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50/50 to-white hover:border-[#00C851]/30 hover:bg-gradient-to-br hover:from-[#00C851]/5 hover:to-[#3ED400]/5 transition-all duration-200">
          <div class="flex-1 mb-3 sm:mb-0">
            <p class="text-sm sm:text-base font-medium text-gray-900 mb-1">{{ t('systemSettings.orderConfirmation') }}</p>
            <p class="text-xs sm:text-sm text-gray-600">{{ t('systemSettings.orderConfirmationDesc') }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificationSettings.orderConfirmation"
              type="checkbox" 
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00C851] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00C851] peer-checked:to-[#3ED400]"></div>
          </label>
        </div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50/50 to-white hover:border-[#00C851]/30 hover:bg-gradient-to-br hover:from-[#00C851]/5 hover:to-[#3ED400]/5 transition-all duration-200">
          <div class="flex-1 mb-3 sm:mb-0">
            <p class="text-sm sm:text-base font-medium text-gray-900 mb-1">{{ t('systemSettings.driverAssignment') }}</p>
            <p class="text-xs sm:text-sm text-gray-600">{{ t('systemSettings.driverAssignmentDesc') }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificationSettings.driverAssignment"
              type="checkbox" 
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00C851] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00C851] peer-checked:to-[#3ED400]"></div>
          </label>
        </div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50/50 to-white hover:border-[#00C851]/30 hover:bg-gradient-to-br hover:from-[#00C851]/5 hover:to-[#3ED400]/5 transition-all duration-200">
          <div class="flex-1 mb-3 sm:mb-0">
            <p class="text-sm sm:text-base font-medium text-gray-900 mb-1">{{ t('systemSettings.deliveryUpdates') }}</p>
            <p class="text-xs sm:text-sm text-gray-600">{{ t('systemSettings.deliveryUpdatesDesc') }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificationSettings.deliveryUpdates"
              type="checkbox" 
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00C851] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00C851] peer-checked:to-[#3ED400]"></div>
          </label>
        </div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50/50 to-white hover:border-[#00C851]/30 hover:bg-gradient-to-br hover:from-[#00C851]/5 hover:to-[#3ED400]/5 transition-all duration-200">
          <div class="flex-1 mb-3 sm:mb-0">
            <p class="text-sm sm:text-base font-medium text-gray-900 mb-1">{{ t('systemSettings.paymentConfirmations') }}</p>
            <p class="text-xs sm:text-sm text-gray-600">{{ t('systemSettings.paymentConfirmationsDesc') }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificationSettings.paymentConfirmations"
              type="checkbox" 
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00C851] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#00C851] peer-checked:to-[#3ED400]"></div>
          </label>
        </div>
      </div>
    </div>


    <!-- System Logs -->
    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <div class="p-2 bg-gradient-to-br from-[#A8EB12]/20 to-[#74E600]/20 rounded-lg">
            <svg class="w-5 h-5 text-[#00C851]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          {{ t('systemSettings.recentSystemLogs') }}
        </h3>
        <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button 
            @click="refreshLogs"
            :disabled="loadingLogs"
            class="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#00C851] to-[#3ED400] text-white rounded-lg hover:from-[#00C851]/90 hover:to-[#3ED400]/90 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg v-if="loadingLogs" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ loadingLogs ? 'Refreshing...' : 'Refresh' }}
          </button>
          <button 
            @click="clearLogs"
            :disabled="loadingLogs || systemLogs.length === 0"
            class="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            {{ t('common.clearLogs') }}
          </button>
        </div>
      </div>
      
      <div v-if="loadingLogs" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#00C851]"></div>
      </div>

      <div v-else-if="systemLogs.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-sm sm:text-base">No system logs available</p>
      </div>

      <div v-else class="space-y-2 sm:space-y-3 max-h-96 sm:max-h-[500px] overflow-y-auto">
        <div v-for="log in systemLogs" :key="log.id" class="flex flex-col sm:flex-row items-start justify-between p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#00C851]/30 hover:shadow-md transition-all duration-200">
          <div class="flex items-start space-x-3 flex-1 mb-2 sm:mb-0">
            <div :class="[ 
              'w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1.5 flex-shrink-0',
              log.level === 'error' ? 'bg-red-500' : 
              log.level === 'warning' ? 'bg-yellow-500' : 
              log.level === 'info' ? 'bg-blue-500' : 
              'bg-[#00C851]'
            ]"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm sm:text-base text-gray-900 mb-1">{{ log.message }}</p>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <p class="text-xs sm:text-sm text-gray-500">{{ log.timestamp }}</p>
                <span v-if="log.userType" :class="[ 
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  log.userType === 'user' ? 'bg-blue-100 text-blue-700' : 
                  log.userType === 'driver' ? 'bg-purple-100 text-purple-700' : 
                  log.userType === 'admin' ? 'bg-gradient-to-r bg-[#00C851]/10 text-[#00C851] border border-[#00C851]/20' : 
                  'bg-gray-100 text-gray-700'
                ]">
                  {{ log.userType.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <span :class="[ 
            'px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 mt-2 sm:mt-0 sm:ml-2',
            log.level === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
            log.level === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
            log.level === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
            'bg-gradient-to-r bg-[#00C851]/10 text-[#00C851] border border-[#00C851]/20'
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

    // Reset adminExists first (while still admin) so new admin can register later
    const settingsRef = doc(db, 'settings', 'system')
    await updateDoc(settingsRef, {
      adminExists: false,
      updatedAt: new Date()
    })

    // Delete admin document from Firestore (requires rule: allow delete if isOwner(adminId))
    const adminRef = doc(db, 'admins', user.uid)
    await deleteDoc(adminRef)

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
