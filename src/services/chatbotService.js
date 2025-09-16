export class ChatbotService {
  constructor() {
    this.responses = {
      greeting: [
        "Hello! I'm here to help you with your BroomTech service.",
        "Hi there! How can I assist you today?",
        "Welcome to BroomTech! I'm your virtual assistant.",
      ],
      orderStatus: [
        "Let me check your order status for you.",
        "I can help you track your current order.",
        "Your order information is being retrieved...",
      ],
      driverInfo: [
        "I'll get your driver's information right away.",
        "Let me find details about your assigned driver.",
        "Checking driver details for your order...",
      ],
      payment: [
        "For payment inquiries, your driver will handle the payment process.",
        "Payment will be processed by your assigned driver upon completion.",
        "Your driver will collect payment and upload proof of payment.",
      ],
      support: [
        "I'm connecting you with our support team.",
        "Let me get a human agent to help you with this.",
        "Transferring you to our customer support...",
      ],
      default: [
        "I understand you need help. Let me connect you with your driver or our support team.",
        "I'm here to help! Could you please be more specific about what you need?",
        "I'm not sure about that, but I can connect you with someone who can help.",
      ],
    }

    this.keywords = {
      greeting: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
      orderStatus: ["status", "order", "tracking", "where", "when", "eta", "time"],
      driverInfo: ["driver", "who", "contact", "phone", "name"],
      payment: ["payment", "pay", "cost", "price", "money", "bill", "receipt"],
      support: ["help", "problem", "issue", "complaint", "support", "agent", "human"],
    }
  }

  // Analyze message and return appropriate response
  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase()

    // Check for keywords in message
    for (const [category, keywords] of Object.entries(this.keywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return this.getRandomResponse(category)
      }
    }

    return this.getRandomResponse("default")
  }

  // Get random response from category
  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.default
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // Generate contextual response based on order data
  generateContextualResponse(message, orderData) {
    const lowerMessage = message.toLowerCase()

    if (this.keywords.orderStatus.some((keyword) => lowerMessage.includes(keyword))) {
      if (orderData) {
        return `Your order #${orderData.id} is currently ${orderData.status}. ${this.getStatusMessage(orderData.status)}`
      }
    }

    if (this.keywords.driverInfo.some((keyword) => lowerMessage.includes(keyword))) {
      if (orderData?.driver) {
        return `Your driver is ${orderData.driver.name}. You can contact them directly through this chat or call ${orderData.driver.phone}.`
      } else {
        return "A driver hasn't been assigned to your order yet. I'll notify you once a driver is assigned."
      }
    }

    return this.analyzeMessage(message)
  }

  // Get status-specific message
  getStatusMessage(status) {
    const statusMessages = {
      pending: "We are looking for an available driver for you.",
      confirmed: "Your order has been confirmed and a driver will be assigned soon.",
      driver_assigned: "A driver has been assigned and is on their way to you.",
      in_transit: "Your driver is currently on the way to your location.",
      arrived: "Your driver has arrived at your location.",
      completed: "Your service has been completed. Thank you for using BroomTech!",
    }

    return statusMessages[status] || "Your order is being processed."
  }

  // Check if message needs human intervention
  needsHumanIntervention(message) {
    const urgentKeywords = ["emergency", "urgent", "complaint", "refund", "cancel", "problem", "issue"]
    return urgentKeywords.some((keyword) => message.toLowerCase().includes(keyword))
  }
}

export const chatbotService = new ChatbotService()
