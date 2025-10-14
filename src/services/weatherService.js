import { db } from "@/firebase/config"
import { doc, getDoc } from "firebase/firestore"

class WeatherService {
  constructor() {
    this.apiKey = null
    this.lastWeatherCheck = null
    this.cachedWeatherData = null
    this.cacheTimeout = 10 * 60 * 1000 // 10 minutes
  }

  async loadApiKey() {
    try {
      const appSettingsDoc = await getDoc(doc(db, "settings", "application"))
      if (appSettingsDoc.exists()) {
        const settings = appSettingsDoc.data()
        this.apiKey = settings.googleCloudApiKey || "AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o"
      } else {
        this.apiKey = "AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o"
      }
      console.log("[v0] Weather service API key loaded")
    } catch (error) {
      console.error("[v0] Error loading API key:", error)
      this.apiKey = "AIzaSyDAY9tsXQublAc2y54vPqMy2bZuXYY6I5o"
    }
  }

  async checkWeather(lat = 13.4119, lon = 121.1803) {
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
      // Use Open-Meteo API (free, no key required) for weather data
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia/Manila`,
      )

      if (!response.ok) {
        console.error("[v0] Weather API error:", response.status)
        return { isBadWeather: false, description: "Unknown", weatherCode: 0 }
      }

      const data = await response.json()
      const weatherCode = data.current_weather.weathercode

      // Weather codes: https://open-meteo.com/en/docs
      // 51-67: Rain, 71-77: Snow, 80-99: Rain showers/thunderstorms
      const badWeatherCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]
      const isBadWeather = badWeatherCodes.includes(weatherCode)

      // Map weather code to description
      const weatherDescriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      }

      const description = weatherDescriptions[weatherCode] || "Unknown"

      const weatherData = {
        isBadWeather,
        description,
        weatherCode,
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
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
