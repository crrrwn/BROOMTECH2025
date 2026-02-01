<template>
  <div class="min-h-screen relative flex items-center justify-center py-4 sm:py-5 md:py-6 px-3 sm:px-4 md:px-5 lg:px-6 bg-gradient-to-br from-[#A8EB12]/20 via-[#74E600]/15 to-[#3ED400]/25 overflow-hidden font-sans">
    
    <!-- Enhanced Animated Background Blobs -->
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-[#A8EB12] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-pulse"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-[#3ED400] rounded-full mix-blend-multiply filter blur-[90px] opacity-50 animate-pulse" style="animation-delay: 1s;"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-[#74E600] rounded-full mix-blend-multiply filter blur-[70px] opacity-45 animate-pulse" style="animation-delay: 0.5s;"></div>
    <div class="absolute top-1/4 right-1/4 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-[#00C851] rounded-full mix-blend-multiply filter blur-[70px] opacity-35 animate-pulse" style="animation-delay: 1.5s;"></div>

    <!-- Enhanced Register Card -->
    <div class="relative w-full max-w-[320px] sm:max-w-sm md:max-w-md bg-white/95 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] border border-white/80 p-5 sm:p-6 md:p-7 z-10 transition-all duration-300 hover:shadow-[0_35px_70px_rgba(62,212,0,0.25)] hover:scale-[1.01]">
      
      <div class="text-center space-y-4 sm:space-y-5 mb-5 sm:mb-6">
        <div class="flex justify-center relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-[#3ED400] to-[#00C851] rounded-full blur-xl opacity-25 animate-pulse"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-[#74E600] to-[#A8EB12] rounded-full blur-lg opacity-15 animate-pulse" style="animation-delay: 0.3s;"></div>
          
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-[4px] sm:border-[5px] border-white shadow-2xl overflow-hidden bg-white transform group-hover:scale-105 transition-all duration-500 p-1.5 sm:p-2">
             <img 
              src="/LOGO.jpg" 
              alt="BROOOOM Delivery Services Logo"
              class="w-full h-full object-cover rounded-full"
              @error="handleImageError"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent tracking-tight">Create Account</h2>
          <p class="text-xs sm:text-sm text-gray-600 font-medium">
            Already have an account?
            <router-link to="/login" class="text-[#00C851] font-bold hover:text-[#3ED400] hover:underline transition-all duration-200 inline-flex items-center gap-1">
              Sign in here
              <svg class="w-3 h-3 inline-block transition-transform duration-200 hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </p>
        </div>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-4 sm:space-y-5">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div class="group relative">
            <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">First Name <span class="text-red-500">*</span></label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                autocomplete="given-name"
                required
                pattern="[A-Za-z\s\-]+"
                @blur="validateField('firstName')"
                :class="[
                  'w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300',
                  errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
                ]"
                placeholder="First name"
              />
            </div>
            <p v-if="errors.firstName" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.firstName }}</p>
          </div>

          <div class="group relative">
            <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Last Name <span class="text-red-500">*</span></label>
            <div class="relative flex items-center">
              <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                autocomplete="family-name"
                required
                pattern="[A-Za-z\s\-]+"
                @blur="validateField('lastName')"
                :class="[
                  'w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300',
                  errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
                ]"
                placeholder="Last name"
              />
            </div>
            <p v-if="errors.lastName" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.lastName }}</p>
          </div>
        </div>
          
        <div class="group relative">
          <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Middle Name (Optional)</label>
          <div class="relative flex items-center">
             <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </div>
            <input
              id="middleName"
              v-model="form.middleName"
              type="text"
              autocomplete="additional-name"
              pattern="[A-Za-z\s\-]*"
              class="w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#3ED400] focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300"
              placeholder="Middle name"
            />
          </div>
        </div>

        <div class="group relative">
          <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Contact Number <span class="text-red-500">*</span></label>
          <div class="relative flex items-center">
            <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <input
              id="contact"
              v-model="form.contact"
              type="tel"
              autocomplete="tel"
              required
              pattern="^(09|\+639)\d{9}$"
              @blur="validateField('contact')"
              :class="[
                'w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300',
                errors.contact ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
              ]"
              placeholder="09XXXXXXXXX"
            />
          </div>
          <p v-if="errors.contact" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.contact }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
           <div class="group relative">
            <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Street Address <span class="text-red-500">*</span></label>
            <div class="relative flex items-center">
               <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               </div>
              <input
                id="address"
                v-model="form.address"
                type="text"
                autocomplete="street-address"
                required
                minlength="10"
                @blur="validateField('address')"
                :class="[
                  'w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300',
                  errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
                ]"
                placeholder="House No., Street"
              />
            </div>
            <p v-if="errors.address" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.address }}</p>
          </div>
          <div class="group relative">
            <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Barangay <span class="text-red-500">*</span></label>
            <div class="relative flex items-center">
               <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
               </div>
              <select
                id="barangay"
                v-model="form.barangay"
                required
                @blur="validateField('barangay')"
                :class="[
                  'w-full pl-10 sm:pl-11 pr-8 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300 appearance-none cursor-pointer',
                  errors.barangay ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
                ]"
              >
                <option value="" disabled>Select</option>
                <option v-for="barangay in barangays" :key="barangay" :value="barangay">
                  {{ barangay }}
                </option>
              </select>
               <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
               </div>
            </div>
            <p v-if="errors.barangay" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.barangay }}</p>
          </div>
        </div>

        <div class="group relative">
          <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Email address <span class="text-red-500">*</span></label>
          <div class="relative flex items-center">
             <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
               <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
             </div>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              @blur="validateField('email')"
              :class="[
                'w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300',
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
              ]"
              placeholder="Enter your email"
            />
          </div>
          <p v-if="errors.email" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.email }}</p>
        </div>

        <div class="group relative">
          <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Password <span class="text-red-500">*</span></label>
          <div class="relative flex items-center">
             <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
               <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              @input="checkPasswordStrength"
              @blur="validateField('password')"
              :class="[
                'w-full pl-10 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300',
                errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
              ]"
              placeholder="Create strong password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-0 pr-3 sm:pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#00C851] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C851]/30 rounded-lg p-1"
            >
              <svg v-if="showPassword" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
            </button>
          </div>
          <p v-if="errors.password" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.password }}</p>
          
          <div class="mt-2 px-3">
            <div class="flex space-x-1 h-1 overflow-hidden rounded-full bg-gray-200">
              <div v-for="i in 4" :key="i" :class="[
                'flex-1 transition-all duration-500 ease-out',
                passwordStrength >= i ? getStrengthColor(passwordStrength) : 'bg-transparent'
              ]"></div>
            </div>
            <div class="flex justify-between items-start mt-1">
               <p class="text-[10px] font-semibold" :class="getStrengthTextColor(passwordStrength)">
                 {{ getStrengthText(passwordStrength) }}
               </p>
               <ul class="text-[9px] text-gray-500 space-y-0 text-right leading-tight">
                 <li :class="passwordChecks.length ? 'text-green-600 font-bold' : ''">8-12 chars</li>
                 <li :class="passwordChecks.uppercase ? 'text-green-600 font-bold' : ''">1 Uppercase</li>
                 <li :class="passwordChecks.lowercase ? 'text-green-600 font-bold' : ''">1 Lowercase</li>
                 <li :class="passwordChecks.number ? 'text-green-600 font-bold' : ''">1 Number</li>
                 <li :class="passwordChecks.special ? 'text-green-600 font-bold' : ''">1 Special</li>
               </ul>
            </div>
          </div>
        </div>

        <div class="group relative">
          <label class="ml-3 block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 transition-colors duration-300 group-focus-within:text-[#3ED400]">Confirm Password <span class="text-red-500">*</span></label>
          <div class="relative flex items-center">
             <div class="absolute left-0 pl-3 pointer-events-none text-gray-400 group-focus-within:text-[#3ED400] transition-all duration-300 group-focus-within:scale-110">
               <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              @blur="validateField('confirmPassword')"
              :class="[
                'w-full pl-10 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm bg-gradient-to-br from-gray-50/80 to-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#3ED400]/20 focus:shadow-[0_0_0_4px_rgba(62,212,0,0.1)] transition-all duration-300 shadow-sm hover:border-gray-300',
                errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#3ED400]'
              ]"
              placeholder="Confirm password"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-0 pr-3 sm:pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#00C851] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C851]/30 rounded-lg p-1"
            >
               <svg v-if="showConfirmPassword" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
               <svg v-else class="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">{{ errors.confirmPassword }}</p>
          <p v-else-if="form.confirmPassword && form.password !== form.confirmPassword" class="ml-3 mt-1 text-[10px] text-red-500 font-medium">
            Passwords do not match
          </p>
        </div>

        <div class="flex items-start px-1 sm:px-2 py-1">
          <div class="flex items-center h-4">
            <input
              id="acceptTerms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="w-4 h-4 text-[#3ED400] focus:ring-2 focus:ring-[#3ED400]/50 border-2 border-gray-300 rounded-md cursor-pointer transition-all duration-200 checked:bg-[#3ED400] checked:border-[#3ED400] hover:border-[#3ED400]"
            />
          </div>
          <div class="ml-2 text-xs sm:text-sm">
            <label for="acceptTerms" class="font-semibold text-gray-700 cursor-pointer select-none transition-colors hover:text-[#3ED400]">
              I agree to the 
              <a href="#" class="text-[#00C851] hover:text-[#3ED400] underline font-bold transition-all" @click.prevent>Terms of Service</a>
              and 
              <a href="#" class="text-[#00C851] hover:text-[#3ED400] underline font-bold transition-all" @click.prevent>Privacy Policy</a>
            </label>
            <p v-if="form.acceptTerms === false && form.confirmPassword" class="mt-0.5 text-[10px] text-red-500">
              Required
            </p>
          </div>
        </div>

        <div class="pt-1">
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-black tracking-wide rounded-xl text-white bg-gradient-to-r from-[#3ED400] via-[#74E600] to-[#00C851] hover:from-[#74E600] hover:via-[#3ED400] hover:to-[#00C851] focus:outline-none focus:ring-4 focus:ring-[#3ED400]/40 shadow-[0_8px_20px_rgba(62,212,0,0.35)] hover:shadow-[0_12px_30px_rgba(62,212,0,0.5)] transform transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-[0_8px_20px_rgba(62,212,0,0.35)] overflow-hidden"
          >
            <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-4">
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span class="relative z-10">{{ loading ? 'Creating...' : 'Create Account' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const form = ref({
      firstName: '',
      lastName: '',
      middleName: '',
      contact: '',
      address: '',
      barangay: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })

    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const passwordStrength = ref(0)
    const passwordChecks = ref({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    })
    const errors = ref({
      firstName: '',
      lastName: '',
      contact: '',
      address: '',
      barangay: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const barangays = ref([
      'Balingayan', 'Balite', 'Baruyan', 'Batino', 'Bayanan I', 'Bayanan II', 'Biga', 'Bondoc', 'Bucayao', 'Buhuan', 'Bulusan',
      'Calero', 'Camansihan', 'Camilmil', 'Canubing I', 'Canubing II', 'Comunal',
      'Guinobatan', 'Gulod', 'Gutad',
      'Ibaba East', 'Ibaba West', 'Ilaya',
      'Lalud', 'Lazareto', 'Libis', 'Lumangbayan',
      'Mahal na Pangalan', 'Maidlang', 'Malad', 'Malamig', 'Managpi', 'Masipit', 'Nag-iba I', 'Nag-iba II', 'Navotas',
      'Pachoca', 'Palhi', 'Panggalaan', 'Parang', 'Patas', 'Personas', 'Puting Tubig',
      'Salong', 'San Antonio', 'San Vicente Central', 'San Vicente East', 'San Vicente North', 'San Vicente South', 'San Vicente West', 'Sapul', 'Silonay', 'Sta. Cruz', 'Sta. Isabel', 'Sta. Maria Village', 'Sta. Rita', 'Sto. Niño', 'Suqui',
      'Tawagan', 'Tawiran', 'Tibag',
      'Wawa'
    ])

    const isFormValid = computed(() => {
      return form.value.firstName &&
             form.value.lastName &&
             form.value.contact &&
             form.value.address &&
             form.value.barangay &&
             form.value.email &&
             form.value.password &&
             form.value.confirmPassword &&
             form.value.password === form.value.confirmPassword &&
             passwordStrength.value >= 3 &&
             form.value.acceptTerms === true
    })

    const checkPasswordStrength = () => {
      const password = form.value.password
      
      passwordChecks.value = {
        length: password.length >= 8 && password.length <= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      }
      
      const checks = Object.values(passwordChecks.value)
      passwordStrength.value = checks.filter(Boolean).length
    }

    const getStrengthColor = (strength) => {
      if (strength <= 1) return 'bg-red-500'
      if (strength <= 2) return 'bg-yellow-500'
      if (strength <= 3) return 'bg-blue-500'
      return 'bg-green-500'
    }

    const getStrengthTextColor = (strength) => {
      if (strength <= 1) return 'text-red-600'
      if (strength <= 2) return 'text-yellow-600'
      if (strength <= 3) return 'text-blue-600'
      return 'text-green-600'
    }

    const getStrengthText = (strength) => {
      if (strength <= 1) return 'Weak'
      if (strength <= 2) return 'Fair'
      if (strength <= 3) return 'Good'
      return 'Strong'
    }

    const validateField = (fieldName) => {
      const field = form.value[fieldName]
      errors.value[fieldName] = ''

      switch (fieldName) {
        case 'firstName':
          if (!field) {
            errors.value.firstName = 'First name is required'
          } else if (!/^[A-Za-z\s\-]+$/.test(field)) {
            errors.value.firstName = 'First name should only contain letters, spaces, and hyphens'
          }
          break
        case 'lastName':
          if (!field) {
            errors.value.lastName = 'Last name is required'
          } else if (!/^[A-Za-z\s\-]+$/.test(field)) {
            errors.value.lastName = 'Last name should only contain letters, spaces, and hyphens'
          }
          break
        case 'contact':
          if (!field) {
            errors.value.contact = 'Contact number is required'
          } else if (!/^(09|\+639)\d{9}$/.test(field)) {
            errors.value.contact = 'Please enter a valid contact number (09XXXXXXXXX or +639XXXXXXXXX)'
          }
          break
        case 'address':
          if (!field) {
            errors.value.address = 'Home street address is required'
          } else if (field.length < 10) {
            errors.value.address = 'Address must be at least 10 characters long'
          }
          break
        case 'barangay':
          if (!field) {
            errors.value.barangay = 'Please select a barangay'
          }
          break
        case 'email':
          if (!field) {
            errors.value.email = 'Email address is required'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field)) {
            errors.value.email = 'Please enter a valid email address'
          }
          break
        case 'password':
          if (!field) {
            errors.value.password = 'Password is required'
          } else if (passwordStrength.value < 3) {
            errors.value.password = 'Password must meet all requirements'
          }
          break
        case 'confirmPassword':
          if (!field) {
            errors.value.confirmPassword = 'Please confirm your password'
          } else if (form.value.password !== field) {
            errors.value.confirmPassword = 'Passwords do not match'
          }
          break
      }
    }

    const handleRegister = async () => {
      // Validate all fields
      validateField('firstName')
      validateField('lastName')
      validateField('contact')
      validateField('address')
      validateField('barangay')
      validateField('email')
      validateField('password')
      validateField('confirmPassword')

      if (!isFormValid.value) {
        if (!form.value.acceptTerms) {
          toast.error('Please accept the Terms of Service and Privacy Policy')
        } else {
          toast.error('Please fill in all required fields correctly')
        }
        return
      }
      
      loading.value = true
      
      try {
        const result = await authStore.register(form.value)
        
        if (result.success) {
          // Redirect to verify email page with email
          router.push({
            path: '/verify-email',
            query: { email: form.value.email }
          })
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('An error occurred during registration')
      } finally {
        loading.value = false
      }
    }

    const handleGoogleRegister = async () => {
      loading.value = true
      
      try {
        const result = await authStore.loginWithGoogle()
        
        if (result.success) {
          toast.success('Account created successfully!')
          toast.info('Your account is pending admin approval.')
          router.push('/login')
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('An error occurred during Google registration')
      } finally {
        loading.value = false
      }
    }

    const handleImageError = (event) => {
      // Hide image on error (403, etc.)
      event.target.style.display = 'none'
    }

    return {
      form,
      loading,
      showPassword,
      showConfirmPassword,
      passwordStrength,
      passwordChecks,
      barangays,
      errors,
      isFormValid,
      checkPasswordStrength,
      getStrengthColor,
      getStrengthTextColor,
      getStrengthText,
      validateField,
      handleRegister,
      handleGoogleRegister,
      handleImageError
    }
  }
}
</script>