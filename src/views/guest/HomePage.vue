<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary to-green-600 text-white">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Fast & Reliable Delivery
            <span class="block text-green-200">in Calapan City</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            From food delivery to bill payments, we've got you covered. 
            Experience seamless service with real-time tracking.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <!-- Added click handler for register button -->
            <router-link 
              to="/login" 
              @click="handleNavigation('/login')"
              class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              @click="handleNavigation('/register')"
              class="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services-section" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of delivery services to make your life easier
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in services" :key="service.id" class="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <component :is="service.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ service.name }}</h3>
            <p class="text-gray-600 mb-4">{{ service.description }}</p>
            <p class="text-primary font-semibold">Starting at ₱{{ service.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <!-- Added About section from AboutPage -->
    <section id="about-section" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About BroomTech</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn more about our mission and what makes us different
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 class="text-2xl font-semibold mb-4">Our Story</h3>
            <p class="text-gray-600 mb-4">
              BroomTech was founded with a simple mission: to make professional cleaning services 
              accessible and convenient for everyone. We connect customers with trusted, verified 
              cleaning professionals in their area.
            </p>
            <p class="text-gray-600">
              Our platform ensures quality service delivery while providing fair opportunities 
              for cleaning professionals to grow their business.
            </p>
          </div>
          <div class="bg-green-50 p-6 rounded-lg">
            <h4 class="text-xl font-semibold mb-3">Why Choose Us?</h4>
            <ul class="space-y-2">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Verified and trusted cleaners
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Flexible scheduling
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Competitive pricing
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Quality guarantee
              </li>
            </ul>
          </div>
        </div>

        <!-- Added Our Values section from AboutPage -->
        <div class="text-center">
          <h3 class="text-2xl font-semibold mb-6">Our Values</h3>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h4 class="text-lg font-semibold mb-2">Quality</h4>
              <p class="text-gray-600">We maintain high standards in every service we provide.</p>
            </div>
            <div class="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h4 class="text-lg font-semibold mb-2">Trust</h4>
              <p class="text-gray-600">Building lasting relationships through reliable service.</p>
            </div>
            <div class="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h4 class="text-lg font-semibold mb-2">Innovation</h4>
              <p class="text-gray-600">Using technology to improve the cleaning experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose BroomTech?</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best delivery experience in Calapan City
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p class="text-gray-600">Quick and efficient delivery within Calapan City with real-time tracking</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p class="text-gray-600">Your items are safe with our trusted drivers and secure payment system</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 01-18 0 9 9 0 018.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p class="text-gray-600">Round-the-clock customer support to assist you whenever you need help</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="bg-gray-50 rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">{{ testimonial.initials }}</span>
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900">{{ testimonial.name }}</h4>
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">"{{ testimonial.comment }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
          Join thousands of satisfied customers in Calapan City. Sign up today and experience the convenience.
        </p>
        <!-- Added click handler for CTA register button -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/login" 
            @click="handleNavigation('/login')"
            class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
          >
            Login to Account
          </router-link>
          <router-link 
            to="/register" 
            @click="handleNavigation('/register')"
            class="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Create Your Account
          </router-link>
        </div>
      </div>
    </section>

    <!-- Added floating scroll buttons -->
    <!-- Scroll to Top Button -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-20 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300"
      aria-label="Scroll to top"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
      </svg>
    </button>

    <!-- Scroll to Bottom Button -->
    <button
      v-show="showScrollBottom"
      @click="scrollToBottom"
      class="fixed bottom-20 right-6 z-40 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
      aria-label="Scroll to bottom"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Floating Chatbot -->
    <FloatingChatbot />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import FloatingChatbot from '@/components/FloatingChatbot.vue'

export default {
  name: 'HomePage',
  components: {
    FloatingChatbot
  },
  setup() {
    const router = useRouter()
    
    const showScrollTop = ref(false)
    const showScrollBottom = ref(true)

    const handleNavigation = (path) => {
      console.log('[v0] HomePage navigating to:', path)
      
      // Force navigation using router.push as fallback
      router.push(path).catch(err => {
        console.error('[v0] HomePage navigation error:', err)
      })
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const scrollToBottom = () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      })
    }

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show scroll to top button when scrolled down 300px
      showScrollTop.value = scrollTop > 300

      // Hide scroll to bottom button when near bottom (within 100px)
      showScrollBottom.value = scrollTop < documentHeight - windowHeight - 100
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initial check
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    const services = ref([
      {
        id: 1,
        name: 'Food Delivery',
        description: 'Order from your favorite restaurants and get it delivered hot and fresh',
        price: '55',
        icon: 'svg'
      },
      {
        id: 2,
        name: 'Bill Payments',
        description: 'Pay your bills hassle-free with our secure payment service',
        price: '55',
        icon: 'svg'
      },
      {
        id: 3,
        name: 'Pick-up & Drop',
        description: 'Need something picked up or delivered? We\'ve got you covered',
        price: '55',
        icon: 'svg'
      },
      {
        id: 4,
        name: 'Grocery Shopping',
        description: 'Let us do your grocery shopping and deliver it to your doorstep',
        price: '55',
        icon: 'svg'
      },
      {
        id: 5,
        name: 'Medicine Delivery',
        description: 'Get your prescriptions delivered safely and on time',
        price: '55',
        icon: 'svg'
      },
      {
        id: 6,
        name: 'Surprise Gifts',
        description: 'Send surprise gifts to your loved ones with our special delivery service',
        price: '55',
        icon: 'svg'
      }
    ])

    const testimonials = ref([
      {
        id: 1,
        name: 'Maria Santos',
        initials: 'MS',
        comment: 'BroomTech has made my life so much easier! Fast delivery and excellent service every time.'
      },
      {
        id: 2,
        name: 'Juan Dela Cruz',
        initials: 'JD',
        comment: 'I love the real-time tracking feature. I always know exactly when my order will arrive.'
      },
      {
        id: 3,
        name: 'Ana Reyes',
        initials: 'AR',
        comment: 'The drivers are always professional and my orders arrive in perfect condition.'
      }
    ])

    return {
      handleNavigation,
      services,
      testimonials,
      showScrollTop,
      showScrollBottom,
      scrollToTop,
      scrollToBottom
    }
  }
}
</script>
