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

    try {
      // Use Open-Meteo API
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code,rain,wind_speed_10m,wind_gusts_10m&current=rain,weather_code,wind_speed_10m,wind_gusts_10m&timezone=Asia%2FSingapore`
      
      const response = await fetch(apiUrl)

      if (!response.ok) {
        console.error("[v0] Weather API error:", response.status)
        return { isBadWeather: false, description: "Unknown", weatherCode: 0 }
      }

      const data = await response.json()
      
      // Extract current weather data
      const current = data.current || {}
      const weatherCode = current.weather_code || 0
      const rain = current.rain || 0
      const windSpeed = current.wind_speed_10m || 0
      const windGusts = current.wind_gusts_10m || 0

      // WMO Weather codes for bad weather:
      // 61-67: Rain
      // 71-77: Snow  
      // 80-82: Rain showers
      // 95-99: Thunderstorm
      const badWeatherCodes = [
        // Rain
        61, 63, 65, 66, 67,
        // Snow
        71, 73, 75, 77,
        // Rain showers
        80, 81, 82,
        // Thunderstorm
        95, 96, 99
      ]

      // Check if bad weather based on weather code, rain amount, or high winds
      const isBadWeather = badWeatherCodes.includes(weatherCode) || 
                          rain > 0.5 || // More than 0.5mm of rain
                          windSpeed > 15 || // Wind speed > 15 m/s
                          windGusts > 20 // Wind gusts > 20 m/s

      // Get weather description based on code
      const weatherDescriptions = {
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      }

      const description = weatherDescriptions[weatherCode] || 
                         (rain > 0 ? 'Rainy' : 'Clear') ||
                         (windSpeed > 15 ? 'Windy' : 'Normal')

      const weatherData = {
        isBadWeather,
        description,
        weatherCode,
        rain: rain,
        windSpeed: windSpeed,
        windGusts: windGusts,
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
