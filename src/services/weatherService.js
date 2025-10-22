import { db } from "@/firebase/config"
import { doc, getDoc } from "firebase/firestore"

class WeatherService {
  constructor() {
    this.apiKey = null
    this.lastWeatherCheck = null
    this.cachedWeatherData = null
    this.cacheTimeout = 10 * 60 * 1000 // 10 minutes
    this.defaultLat = 13.4125
    this.defaultLon = 121.18
  }

  async loadApiKey() {
    try {
      const appSettingsDoc = await getDoc(doc(db, "settings", "application"))
      if (appSettingsDoc.exists()) {
        const settings = appSettingsDoc.data()
        this.apiKey = settings.openWeatherApiKey || "692a28a1caecfaeca464d1003c39806c"
        this.defaultLat = settings.defaultLat || 13.4125
        this.defaultLon = settings.defaultLon || 121.18
      } else {
        this.apiKey = "692a28a1caecfaeca464d1003c39806c"
      }
      console.log("[v0] Weather service API key loaded")
    } catch (error) {
      console.error("[v0] Error loading API key:", error)
      this.apiKey = "692a28a1caecfaeca464d1003c39806c"
    }
  }

  async checkWeather(lat = null, lon = null) {
    // Use default coordinates if not provided
    const latitude = lat || this.defaultLat
    const longitude = lon || this.defaultLon

    // Return cached data if still valid
    if (this.cachedWeatherData && this.lastWeatherCheck) {
      const timeSinceLastCheck = Date.now() - this.lastWeatherCheck
      if (timeSinceLastCheck < this.cacheTimeout) {
        console.log("[v0] Using cached weather data")
        return this.cachedWeatherData
      }
    }

    if (!this.apiKey) {
      await this.loadApiKey()
    }

    try {
      // Use OpenWeather API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`,
      )

      if (!response.ok) {
        console.error("[v0] Weather API error:", response.status)
        return { isBadWeather: false, description: "Unknown", weatherCode: 0 }
      }

      const data = await response.json()
      const weatherMain = data.weather[0].main
      const weatherDescription = data.weather[0].description
      const weatherCode = data.weather[0].id

      // OpenWeather codes for bad weather
      // 2xx: Thunderstorm, 3xx: Drizzle, 5xx: Rain, 6xx: Snow
      const badWeatherCodes = [
        // Thunderstorm
        200, 201, 202, 210, 211, 212, 221, 230, 231, 232,
        // Drizzle
        300, 301, 302, 310, 311, 312, 313, 314, 321,
        // Rain
        500, 501, 502, 503, 504, 511, 520, 521, 522, 531,
        // Snow
        600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622,
      ]

      const isBadWeather = badWeatherCodes.includes(weatherCode)

      const weatherData = {
        isBadWeather,
        description: weatherDescription,
        weatherCode,
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        timestamp: Date.now(),
      }

      // Cache the result
      this.cachedWeatherData = weatherData
      this.lastWeatherCheck = Date.now()

      console.log("[v0] Weather check:", weatherData)
      return weatherData
    } catch (error) {
      console.error("[v0] Error checking weather:", error)
      return { isBadWeather: false, description: "Unknown", weatherCode: 0 }
    }
  }

  async isBadWeatherFeeEnabled() {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "system"))
      if (settingsDoc.exists()) {
        const data = settingsDoc.data()
        return data.badWeatherFee || false
      }
      return false
    } catch (error) {
      console.error("[v0] Error checking bad weather fee setting:", error)
      return false
    }
  }

  clearCache() {
    this.cachedWeatherData = null
    this.lastWeatherCheck = null
  }
}

export const weatherService = new WeatherService()
