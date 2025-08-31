// Google Maps service for location tracking and routing
import { Loader } from "@googlemaps/js-api-loader"

export class GoogleMapsService {
  constructor() {
    this.map = null
    this.directionsService = null
    this.directionsRenderer = null
    this.markers = []
    this.watchId = null
    this.isLoaded = false
    this.loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["places", "geometry"],
    })
  }

  async ensureLoaded() {
    if (!this.isLoaded) {
      await this.loader.load()
      this.isLoaded = true
    }
  }

  // Initialize Google Maps
  async initMap(elementId, options = {}) {
    await this.ensureLoaded()

    const defaultOptions = {
      zoom: 13,
      center: { lat: 14.5995, lng: 120.9842 }, // Manila, Philippines
      mapTypeId: "roadmap",
    }

    const mapOptions = { ...defaultOptions, ...options }

    this.map = new window.google.maps.Map(document.getElementById(elementId), mapOptions)
    this.directionsService = new window.google.maps.DirectionsService()
    this.directionsRenderer = new window.google.maps.DirectionsRenderer({
      draggable: true,
      panel: document.getElementById("directionsPanel"),
    })
    this.directionsRenderer.setMap(this.map)

    return this.map
  }

  // Get current location
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          resolve(location)
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }

  // Watch location changes
  watchLocation(callback) {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported")
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        }
        callback(location)
      },
      (error) => console.error("Location watch error:", error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000,
      },
    )

    return this.watchId
  }

  // Stop watching location
  stopWatchingLocation() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  // Add marker to map
  async addMarker(position, options = {}) {
    await this.ensureLoaded()

    const marker = new window.google.maps.Marker({
      position,
      map: this.map,
      ...options,
    })

    this.markers.push(marker)
    return marker
  }

  // Calculate route between two points
  async calculateRoute(origin, destination, waypoints = []) {
    await this.ensureLoaded()

    return new Promise((resolve, reject) => {
      const request = {
        origin,
        destination,
        waypoints: waypoints.map((point) => ({ location: point, stopover: true })),
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }

      this.directionsService.route(request, (result, status) => {
        if (status === "OK") {
          this.directionsRenderer.setDirections(result)
          resolve(result)
        } else {
          reject(new Error(`Directions request failed: ${status}`))
        }
      })
    })
  }

  // Calculate distance and duration
  async calculateDistance(origin, destination) {
    await this.ensureLoaded()

    return new Promise((resolve, reject) => {
      const service = new window.google.maps.DistanceMatrixService()

      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === "OK") {
            const result = response.rows[0].elements[0]
            resolve({
              distance: result.distance,
              duration: result.duration,
              status: result.status,
            })
          } else {
            reject(new Error(`Distance calculation failed: ${status}`))
          }
        },
      )
    })
  }

  // Clear all markers
  clearMarkers() {
    this.markers.forEach((marker) => marker.setMap(null))
    this.markers = []
  }

  // Update marker position
  updateMarkerPosition(marker, position) {
    marker.setPosition(position)
  }

  // Fit map to show all markers
  async fitBounds() {
    if (this.markers.length === 0) return

    await this.ensureLoaded()

    const bounds = new window.google.maps.LatLngBounds()
    this.markers.forEach((marker) => bounds.extend(marker.getPosition()))
    this.map.fitBounds(bounds)
  }
}

export const googleMapsService = new GoogleMapsService()
