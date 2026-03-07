<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <!-- Header -->
      <div class="mb-10">
        <router-link to="/" class="inline-flex items-center text-[#74E600] hover:text-[#3ED400] font-semibold text-sm mb-6 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </router-link>
        <h1 class="text-3xl sm:text-4xl font-bold text-[#05103B] mb-2">Privacy Policy</h1>
        <p class="text-gray-500 text-sm">Last updated: March 2025</p>
        <div class="mt-4 p-4 rounded-xl bg-[#05103B] text-white border-l-4 border-[#74E600]">
          <p class="text-sm font-medium">
            In compliance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, 
            Broooom Delivery Services is committed to protecting your personal information and your right to privacy.
          </p>
        </div>
      </div>

      <!-- Data Privacy Act Section -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-[#05103B] mb-4 flex items-center">
          <span class="w-1 h-6 bg-[#74E600] rounded-full mr-3"></span>
          Data Privacy Act of 2012 (RA 10173)
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Our collection, use, storage, and disclosure of your personal data are governed by the 
          <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and its Implementing Rules and Regulations. 
          We process your data only for lawful purposes, with your consent where required, and in a manner that ensures its security and confidentiality.
        </p>
        <ul class="list-disc list-inside text-gray-600 space-y-2 ml-2">
          <li>We collect only personal information necessary for our delivery and related services.</li>
          <li>We do not sell or share your data to third parties for marketing without your consent.</li>
          <li>You have the right to access, correct, and request deletion of your personal data.</li>
          <li>You may file a complaint with the National Privacy Commission (NPC) if you believe your rights have been violated.</li>
        </ul>
      </section>

      <!-- Information We Collect -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-[#05103B] mb-4 flex items-center">
          <span class="w-1 h-6 bg-[#74E600] rounded-full mr-3"></span>
          Information We Collect
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          We may collect the following personal information in accordance with the Data Privacy Act:
        </p>
        <ul class="list-disc list-inside text-gray-600 space-y-2 ml-2">
          <li>Name, email address, phone number, and delivery address</li>
          <li>Account credentials and profile information</li>
          <li>Transaction and order history</li>
          <li>Payment-related information (processed securely)</li>
          <li>Identification documents (e.g., for driver verification) when applicable</li>
          <li>Device and usage data necessary for service improvement</li>
        </ul>
      </section>

      <!-- How We Use Your Data -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-[#05103B] mb-4 flex items-center">
          <span class="w-1 h-6 bg-[#74E600] rounded-full mr-3"></span>
          How We Use Your Data
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Your personal data is used only for:
        </p>
        <ul class="list-disc list-inside text-gray-600 space-y-2 ml-2">
          <li>Processing and fulfilling your delivery and related service requests</li>
          <li>Communicating with you about your orders and account</li>
          <li>Improving our services and user experience</li>
          <li>Complying with legal and regulatory requirements</li>
          <li>Protecting against fraud and ensuring security</li>
        </ul>
      </section>

      <!-- Your Rights Under the Data Privacy Act -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-[#05103B] mb-4 flex items-center">
          <span class="w-1 h-6 bg-[#74E600] rounded-full mr-3"></span>
          Your Rights Under the Data Privacy Act
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          Under RA 10173, you have the right to:
        </p>
        <ul class="list-disc list-inside text-gray-600 space-y-2 ml-2">
          <li><strong>Be informed</strong> — Know what personal data we collect and how we use it</li>
          <li><strong>Object</strong> — Object to the processing of your personal data in certain cases</li>
          <li><strong>Access</strong> — Request access to your personal data we hold</li>
          <li><strong>Rectify</strong> — Request correction of inaccurate or incomplete data</li>
          <li><strong>Erase or block</strong> — Request deletion or blocking of your data in certain circumstances</li>
          <li><strong>Data portability</strong> — Request a copy of your data in a structured format</li>
          <li><strong>Withdraw consent</strong> — Withdraw consent previously given, where applicable</li>
          <li><strong>Complain</strong> — Lodge a complaint with the National Privacy Commission</li>
        </ul>
        <p class="text-gray-600 leading-relaxed mt-4">
          To exercise these rights, contact us at 
          <a href="mailto:broooomexpressdelivery@gmail.com" class="text-[#74E600] hover:underline font-medium">broooomexpressdelivery@gmail.com</a>.
        </p>
      </section>

      <!-- Data Security & Retention -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-[#05103B] mb-4 flex items-center">
          <span class="w-1 h-6 bg-[#74E600] rounded-full mr-3"></span>
          Data Security & Retention
        </h2>
        <p class="text-gray-600 leading-relaxed">
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We retain your data only for as long as necessary to fulfill the purposes for which it was collected or as required by law.
        </p>
      </section>

      <!-- Contact -->
      <section class="mb-10 p-6 rounded-2xl bg-[#05103B] text-white">
        <h2 class="text-xl font-bold mb-4 flex items-center">
          <span class="w-1 h-6 bg-[#74E600] rounded-full mr-3"></span>
          Contact Us & Data Protection Officer
        </h2>
        <p class="text-gray-300 leading-relaxed mb-4">
          For any questions about this Privacy Policy, your personal data, or to exercise your rights under the Data Privacy Act, please contact us:
        </p>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li><strong class="text-white">Broooom Delivery Services</strong></li>
          <li>Calapan City, Oriental Mindoro, Philippines 5200</li>
          <li>Email: <a href="mailto:broooomexpressdelivery@gmail.com" class="text-[#74E600] hover:underline">broooomexpressdelivery@gmail.com</a></li>
          <li>Phone: 0955 773 9438</li>
        </ul>
        <p class="text-gray-400 text-xs mt-4">
          You may also visit the National Privacy Commission (NPC) at 
          <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" class="text-[#74E600] hover:underline">privacy.gov.ph</a> 
          for more information on your rights under the Data Privacy Act.
        </p>
      </section>

      <!-- Back to Home -->
      <div class="pt-6 border-t border-gray-200">
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 rounded-full bg-[#74E600] text-white font-bold hover:bg-[#63c400] transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy'
}
</script>
