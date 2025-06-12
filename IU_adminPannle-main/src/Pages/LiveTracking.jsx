import { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react"
import {
  MapPin,
  Navigation,
  Clock,
  User,
  Phone,
  Car,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell,
  Settings,
  Wifi,
  ZoomIn,
  ZoomOut,
  Navigation2,
  Maximize,
  Minimize,
  Target,
  Activity,
} from "lucide-react"

// Theme Context
const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      if (saved) {
        return saved === "dark"
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

function EnhancedLiveTrackingComponent() {
  const { isDarkMode } = useTheme()

  // Socket and connection state
  const [isConnected, setIsConnected] = useState(true)
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Map state with enhanced controls
  const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 })
  const [mapZoom, setMapZoom] = useState(12)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTrafficLayer, setShowTrafficLayer] = useState(false)
  const [showSatelliteView, setShowSatelliteView] = useState(false)
  const [showDriverRoutes, setShowDriverRoutes] = useState(true)
  const [showDriverNames, setShowDriverNames] = useState(true)
  const [showSpeedIndicators, setShowSpeedIndicators] = useState(true)

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [selectedDriverForAction, setSelectedDriverForAction] = useState(null)

  // Enhanced mock driver data with more realistic distribution
  const mockDriversData = [
    {
      _id: "1",
      name: "Arjun Singh Rajput",
      vehicle: "Nissan Sunny - RJ 06 KL 2345",
      phone: "+91 98765 43210",
      status: "active",
      location: { lat: 24.8607, lng: 67.0011 }, // Gulshan
      destination: "Worli Sea Face",
      passenger: "Deepak Rastogi",
      tripId: "TRP642845",
      speed: 25,
      eta: "25 mins",
      rating: 4.8,
      batteryLevel: 85,
      completedTrips: 157,
      lastUpdate: new Date(),
      route: [
        { lat: 24.8607, lng: 67.0011 },
        { lat: 24.865, lng: 67.01 },
        { lat: 24.87, lng: 67.02 },
      ],
    },
    {
      _id: "2",
      name: "Harsh Prajapati",
      vehicle: "Toyota Corolla - MH 01 AB 1234",
      phone: "+91 98765 43211",
      status: "active",
      location: { lat: 24.9056, lng: 67.0822 }, // North Nazimabad
      destination: "Borivali West",
      passenger: "Deepak Rastogi",
      tripId: "TRP642846",
      speed: 71,
      eta: "410 mins",
      rating: 4.8,
      batteryLevel: 85,
      completedTrips: 157,
      lastUpdate: new Date(),
      route: [
        { lat: 24.9056, lng: 67.0822 },
        { lat: 24.9, lng: 67.075 },
        { lat: 24.895, lng: 67.07 },
      ],
    },
    {
      _id: "3",
      name: "Bhavesh Kumar",
      vehicle: "Honda City - DL 02 CD 5678",
      phone: "+91 98765 43212",
      status: "active",
      location: { lat: 24.8138, lng: 67.0607 }, // Saddar
      destination: "Andheri East",
      passenger: "Rahul Sharma",
      tripId: "TRP642847",
      speed: 45,
      eta: "18 mins",
      rating: 4.6,
      batteryLevel: 92,
      completedTrips: 203,
      lastUpdate: new Date(),
      route: [
        { lat: 24.8138, lng: 67.0607 },
        { lat: 24.82, lng: 67.065 },
        { lat: 24.825, lng: 67.07 },
      ],
    },
    {
      _id: "4",
      name: "Raj Kumar",
      vehicle: "Maruti Swift - UP 32 EF 9012",
      phone: "+91 98765 43213",
      status: "idle",
      location: { lat: 24.848, lng: 67.03 }, // Clifton
      destination: "",
      passenger: "",
      tripId: "",
      speed: 0,
      eta: "",
      rating: 4.2,
      batteryLevel: 67,
      completedTrips: 89,
      lastUpdate: new Date(),
      route: [],
    },
    {
      _id: "5",
      name: "Pooja Kumari",
      vehicle: "Mahindra XUV300 - DL 08 MN 8901",
      phone: "+91 98765 43217",
      status: "active",
      location: { lat: 24.83, lng: 67.08 }, // Korangi
      destination: "Powai",
      passenger: "Amit Patel",
      tripId: "TRP642849",
      speed: 94,
      eta: "28 mins",
      rating: 4.9,
      batteryLevel: 91,
      completedTrips: 245,
      lastUpdate: new Date(),
      route: [
        { lat: 24.83, lng: 67.08 },
        { lat: 24.835, lng: 67.085 },
        { lat: 24.84, lng: 67.09 },
      ],
    },
    {
      _id: "6",
      name: "Deepak Jain",
      vehicle: "Tata Nexon - RJ 14 IJ 7890",
      phone: "+91 98765 43215",
      status: "offline",
      location: { lat: 24.82, lng: 67.02 }, // Kemari
      destination: "",
      passenger: "",
      tripId: "",
      speed: 0,
      eta: "",
      rating: 4.1,
      batteryLevel: 23,
      completedTrips: 67,
      lastUpdate: new Date(Date.now() - 15 * 60000),
      route: [],
    },
    {
      _id: "7",
      name: "Mahi Sharma",
      vehicle: "Ford EcoSport - MH 12 KL 4567",
      phone: "+91 98765 43216",
      status: "emergency",
      location: { lat: 24.89, lng: 67.07 }, // Gulberg
      destination: "Emergency Stop",
      passenger: "Medical Emergency",
      tripId: "EMG001",
      speed: 0,
      eta: "Immediate",
      rating: 4.5,
      batteryLevel: 45,
      completedTrips: 112,
      lastUpdate: new Date(),
      route: [],
    },
    {
      _id: "8",
      name: "Rohit Gupta",
      vehicle: "Kia Seltos - GJ 01 OP 2345",
      phone: "+91 98765 43218",
      status: "idle",
      location: { lat: 24.875, lng: 67.035 }, // Defence
      destination: "",
      passenger: "",
      tripId: "",
      speed: 0,
      eta: "",
      rating: 4.3,
      batteryLevel: 88,
      completedTrips: 156,
      lastUpdate: new Date(),
      route: [],
    },
  ]

  // Initialize data
  useEffect(() => {
    setDrivers(mockDriversData)
    setLoading(false)
    setIsConnected(true)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => ({
          ...driver,
          speed: driver.status === "active" ? Math.max(0, driver.speed + (Math.random() - 0.5) * 10) : 0,
          lastUpdate: new Date(),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Filter drivers
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.includes(searchTerm)
      const matchesStatus = statusFilter === "all" || driver.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [drivers, searchTerm, statusFilter])

  // Statistics
  const stats = useMemo(() => {
    const activeTrips = drivers.filter((d) => d.status === "active").length
    const totalDrivers = drivers.length
    const emergencyCount = drivers.filter((d) => d.status === "emergency").length
    const idleCount = drivers.filter((d) => d.status === "idle").length
    const offlineCount = drivers.filter((d) => d.status === "offline").length

    return { activeTrips, totalDrivers, emergencyCount, idleCount, offlineCount }
  }, [drivers])

  // Enhanced map utility functions
  const latLngToPixel = useCallback(
    (lat, lng, mapWidth, mapHeight) => {
      const bounds = {
        north: 24.95,
        south: 24.75,
        east: 67.15,
        west: 66.85,
      }

      // Apply zoom factor
      const zoomFactor = Math.pow(2, mapZoom - 12)
      const centerLat = mapCenter.lat
      const centerLng = mapCenter.lng

      // Calculate offset from center
      const latOffset = (lat - centerLat) * zoomFactor
      const lngOffset = (lng - centerLng) * zoomFactor

      // Convert to pixel coordinates
      const x = mapWidth / 2 + (lngOffset / (bounds.east - bounds.west)) * mapWidth
      const y = mapHeight / 2 - (latOffset / (bounds.north - bounds.south)) * mapHeight

      return {
        x: Math.max(30, Math.min(mapWidth - 30, x)),
        y: Math.max(30, Math.min(mapHeight - 30, y)),
      }
    },
    [mapZoom, mapCenter],
  )

  // Enhanced map controls
  const handleZoomIn = useCallback(() => {
    setMapZoom((prev) => Math.min(18, prev + 1))
  }, [])

  const handleZoomOut = useCallback(() => {
    setMapZoom((prev) => Math.max(8, prev - 1))
  }, [])

  const handleLocateDrivers = useCallback(() => {
    if (drivers.length > 0) {
      const avgLat = drivers.reduce((sum, driver) => sum + driver.location.lat, 0) / drivers.length
      const avgLng = drivers.reduce((sum, driver) => sum + driver.location.lng, 0) / drivers.length
      setMapCenter({ lat: avgLat, lng: avgLng })
      setMapZoom(12)
    }
  }, [drivers])

  const handleResetView = useCallback(() => {
    setMapCenter({ lat: 24.8607, lng: 67.0011 })
    setMapZoom(12)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const handleDriverClick = useCallback((driver) => {
    setSelectedDriver(driver)
    setMapCenter(driver.location)
  }, [])

  const handleEmergencyResponse = useCallback((driverId) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) => (driver._id === driverId ? { ...driver, status: "active" } : driver)),
    )

    const notification = {
      id: Date.now(),
      message: `Emergency response initiated for driver ID: ${driverId}`,
      type: "info",
      timestamp: new Date(),
    }
    setNotifications((prev) => [notification, ...prev.slice(0, 9)])
  }, [])

  const handleRefresh = useCallback(() => {
    setDrivers(mockDriversData)
    const notification = {
      id: Date.now(),
      message: "Driver data refreshed successfully",
      type: "info",
      timestamp: new Date(),
    }
    setNotifications((prev) => [notification, ...prev.slice(0, 9)])
  }, [])

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-500 dark:text-green-400"
      case "idle":
        return "text-gray-500 dark:text-gray-400"
      case "offline":
        return "text-red-500 dark:text-red-400"
      case "emergency":
        return "text-orange-500 dark:text-orange-400"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
      case "idle":
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
      case "offline":
        return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
      case "emergency":
        return "bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-orange-400"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
    }
  }

  const getDriverMarkerColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500 border-green-600 shadow-green-500/50"
      case "idle":
        return "bg-gray-500 border-gray-600 shadow-gray-500/50"
      case "offline":
        return "bg-red-500 border-red-600 shadow-red-500/50"
      case "emergency":
        return "bg-orange-500 border-orange-600 shadow-orange-500/50"
      default:
        return "bg-gray-500 border-gray-600 shadow-gray-500/50"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading driver data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Tracking</h1>
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                <Wifi className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Real-time tracking • {drivers.length} drivers loaded</p>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isAutoRefresh
                  ? "bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
              <span className="text-sm">Auto Refresh</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div
          className={`grid gap-6 transition-all duration-300 ${isFullscreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"} h-[calc(100vh-200px)]`}
        >
          {/* Enhanced Interactive Map */}
          <div
            className={`${isFullscreen ? "col-span-1" : "lg:col-span-2"} bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden shadow-2xl`}
          >
            {/* Map Header */}
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-xl">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Live MongoDB Updates</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {filteredDrivers.length} drivers • Zoom: {mapZoom}
                </div>
                {stats.emergencyCount > 0 && (
                  <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-sm mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>
                      {stats.emergencyCount} Emergency Alert{stats.emergencyCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Map Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>

              {/* Locate Drivers */}
              <button
                onClick={handleLocateDrivers}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
                title="Center on all drivers"
              >
                <Target className="w-4 h-4" />
              </button>

              {/* Zoom In */}
              <button
                onClick={handleZoomIn}
                disabled={mapZoom >= 18}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Zoom Out */}
              <button
                onClick={handleZoomOut}
                disabled={mapZoom <= 8}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Reset View */}
              <button
                onClick={handleResetView}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
                title="Reset view"
              >
                <Navigation2 className="w-4 h-4" />
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-lg ${
                  showSettingsPanel
                    ? "bg-blue-600 text-white"
                    : "text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600"
                }`}
                title="Map settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Settings Panel */}
            {showSettingsPanel && (
              <div className="absolute top-4 right-20 z-20 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl p-4">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Map Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Satellite View</span>
                    <button
                      onClick={() => setShowSatelliteView(!showSatelliteView)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        showSatelliteView ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          showSatelliteView ? "translate-x-5" : "translate-x-1"
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Traffic Layer</span>
                    <button
                      onClick={() => setShowTrafficLayer(!showTrafficLayer)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        showTrafficLayer ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          showTrafficLayer ? "translate-x-5" : "translate-x-1"
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Driver Routes</span>
                    <button
                      onClick={() => setShowDriverRoutes(!showDriverRoutes)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        showDriverRoutes ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          showDriverRoutes ? "translate-x-5" : "translate-x-1"
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Driver Names</span>
                    <button
                      onClick={() => setShowDriverNames(!showDriverNames)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        showDriverNames ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          showDriverNames ? "translate-x-5" : "translate-x-1"
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Speed Indicators</span>
                    <button
                      onClick={() => setShowSpeedIndicators(!showSpeedIndicators)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        showSpeedIndicators ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          showSpeedIndicators ? "translate-x-5" : "translate-x-1"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Map Container */}
            <div className="w-full h-full relative">
              {/* Enhanced Map Background */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  showSatelliteView
                    ? "bg-gradient-to-br from-green-900 via-blue-900 to-gray-900"
                    : "bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-black"
                }`}
              >
                {/* Enhanced Street Grid */}
                <div className="absolute inset-0 opacity-30">
                  <svg width="100%" height="100%" className="text-gray-400 dark:text-gray-600">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                      <pattern id="majorGrid" width="200" height="200" patternUnits="userSpaceOnUse">
                        <path d="M 200 0 L 0 0 0 200" fill="none" stroke="currentColor" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#majorGrid)" />
                  </svg>
                </div>

                {/* Traffic Layer */}
                {showTrafficLayer && (
                  <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/4 right-1/4 h-1 bg-red-500 opacity-60 rounded-full"></div>
                    <div className="absolute top-2/3 left-1/3 right-1/3 h-1 bg-yellow-500 opacity-60 rounded-full"></div>
                    <div className="absolute left-1/2 top-1/4 bottom-1/4 w-1 bg-green-500 opacity-60 rounded-full"></div>
                  </div>
                )}

                {/* Major Roads */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent opacity-60 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-gray-500 dark:via-gray-400 to-transparent opacity-70 rounded-full"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent opacity-60 rounded-full"></div>
                  <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gradient-to-b from-transparent via-gray-400 dark:via-gray-500 to-transparent opacity-60 rounded-full"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-gradient-to-b from-transparent via-gray-500 dark:via-gray-400 to-transparent opacity-70 rounded-full"></div>
                  <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gradient-to-b from-transparent via-gray-400 dark:via-gray-500 to-transparent opacity-60 rounded-full"></div>
                </div>

                {/* Area Labels */}
                <div className="absolute top-[15%] left-[20%] text-sm text-gray-600 dark:text-gray-300 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Gulshan
                </div>
                <div className="absolute top-[15%] right-[20%] text-sm text-gray-600 dark:text-gray-300 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  DHA
                </div>
                <div className="absolute bottom-[25%] left-[15%] text-sm text-gray-600 dark:text-gray-300 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Saddar
                </div>
                <div className="absolute bottom-[25%] right-[15%] text-sm text-gray-600 dark:text-gray-300 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Clifton
                </div>
                <div className="absolute top-[35%] left-[45%] text-sm text-gray-600 dark:text-gray-300 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Defence
                </div>
                <div className="absolute top-[60%] right-[25%] text-sm text-gray-600 dark:text-gray-300 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Korangi
                </div>
              </div>

              {/* Driver Routes */}
              {showDriverRoutes && (
                <div className="absolute inset-0 z-5">
                  {filteredDrivers
                    .filter((driver) => driver.status === "active" && driver.route && driver.route.length > 1)
                    .map((driver) => {
                      const mapRect = { width: 1000, height: 700 }
                      const routePoints = driver.route.map((point) =>
                        latLngToPixel(point.lat, point.lng, mapRect.width, mapRect.height),
                      )

                      return (
                        <svg key={`route-${driver._id}`} className="absolute inset-0 w-full h-full pointer-events-none">
                          <path
                            d={`M ${routePoints.map((p) => `${(p.x / mapRect.width) * 100}% ${(p.y / mapRect.height) * 100}%`).join(" L ")}`}
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            fill="none"
                            opacity="0.6"
                          />
                        </svg>
                      )
                    })}
                </div>
              )}

              {/* Driver Markers */}
              <div className="absolute inset-0 z-10">
                {filteredDrivers.map((driver) => {
                  const mapRect = { width: 1000, height: 700 }
                  const position = latLngToPixel(
                    driver.location.lat,
                    driver.location.lng,
                    mapRect.width,
                    mapRect.height,
                  )

                  return (
                    <div
                      key={driver._id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                        selectedDriver?._id === driver._id ? "scale-125 z-20" : "hover:scale-110"
                      }`}
                      style={{
                        left: `${(position.x / mapRect.width) * 100}%`,
                        top: `${(position.y / mapRect.height) * 100}%`,
                      }}
                      onClick={() => handleDriverClick(driver)}
                    >
                      <div className="relative">
                        {/* Pulse Animation */}
                        {driver.status === "active" && (
                          <div
                            className={`absolute inset-0 rounded-full animate-ping ${getDriverMarkerColor(driver.status)} opacity-75`}
                          ></div>
                        )}

                        {/* Emergency Pulse */}
                        {driver.status === "emergency" && (
                          <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75"></div>
                        )}

                        {/* Main Marker */}
                        <div
                          className={`relative w-12 h-12 rounded-full border-3 ${getDriverMarkerColor(driver.status)} shadow-xl flex items-center justify-center backdrop-blur-sm`}
                        >
                          <Car className="w-6 h-6 text-white drop-shadow-sm" />

                          {/* Status Indicator */}
                          <div
                            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                              driver.status === "active"
                                ? "bg-green-400 animate-pulse"
                                : driver.status === "emergency"
                                  ? "bg-red-500 animate-pulse"
                                  : driver.status === "offline"
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                            }`}
                          ></div>
                        </div>

                        {/* Driver Info Tooltip */}
                        <div
                          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-200 ${
                            selectedDriver?._id === driver._id ? "opacity-100 visible" : "opacity-0 invisible"
                          }`}
                        >
                          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-xl min-w-64">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{driver.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{driver.vehicle}</div>
                            {driver.status === "active" && (
                              <>
                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                  To: {driver.destination}
                                </div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  Speed: {Math.round(driver.speed)} km/h
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">ETA: {driver.eta}</div>
                              </>
                            )}
                            <div
                              className={`text-xs mt-2 px-3 py-1 rounded-full text-center font-medium ${getStatusBgColor(driver.status)}`}
                            >
                              {driver.status.toUpperCase()}
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95 dark:border-t-gray-800/95"></div>
                        </div>

                        {/* Speed Indicator */}
                        {showSpeedIndicators && driver.status === "active" && (
                          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-lg">
                            {Math.round(driver.speed)} km/h
                          </div>
                        )}

                        {/* Driver Name Label */}
                        {showDriverNames && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white whitespace-nowrap shadow-sm">
                            {driver.name.split(" ")[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Enhanced Map Legend */}
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-xl">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Driver Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.activeTrips}</span>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-500 shadow-sm"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Idle</span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.idleCount}</span>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Offline</span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.offlineCount}</span>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse shadow-sm"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Emergency</span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{stats.emergencyCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Driver List */}
          {!isFullscreen && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Drivers</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">{stats.activeTrips} Active</span>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drivers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="idle">Idle</option>
                    <option value="offline">Offline</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedDriver?._id === driver._id
                        ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-500/10 shadow-md"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm"
                    } ${driver.status === "emergency" ? "ring-2 ring-orange-500 dark:ring-orange-400" : ""}`}
                    onClick={() => handleDriverClick(driver)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">{driver.name}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{driver.rating}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(driver.status)}`}>
                        {driver.status}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Car className="w-3 h-3" />
                        <span>{driver.vehicle}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span>{driver.phone}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Battery: {Math.round(driver.batteryLevel)}%</span>
                        <span>Trips: {driver.completedTrips}</span>
                      </div>

                      {driver.status === "active" && (
                        <>
                          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                            <MapPin className="w-3 h-3" />
                            <span>To: {driver.destination}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                            <Clock className="w-3 h-3" />
                            <span>ETA: {driver.eta}</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            <span>Passenger: {driver.passenger}</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                            <span>Trip: {driver.tripId}</span>
                            <span>Speed: {Math.round(driver.speed)} km/h</span>
                          </div>
                        </>
                      )}

                      {driver.status === "emergency" && (
                        <div className="bg-orange-50 dark:bg-orange-500/20 p-2 rounded mt-2">
                          <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Emergency Alert Active</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEmergencyResponse(driver._id)
                            }}
                            className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded text-xs transition-colors"
                          >
                            Respond to Emergency
                          </button>
                        </div>
                      )}
                    </div>

                    {driver.status === "active" && (
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDriverForAction(driver)
                            setShowTrackModal(true)
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs transition-colors"
                        >
                          Track
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDriverForAction(driver)
                            setShowContactModal(true)
                          }}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-1 px-3 rounded text-xs transition-colors"
                        >
                          Contact
                        </button>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      Last update: {new Date(driver.lastUpdate).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
                <p className="text-gray-900 dark:text-white text-xl font-bold">{stats.activeTrips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
                <p className="text-gray-900 dark:text-white text-xl font-bold">{stats.totalDrivers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Avg ETA</p>
                <p className="text-gray-900 dark:text-white text-xl font-bold">103 min</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Coverage Area</p>
                <p className="text-gray-900 dark:text-white text-xl font-bold">25 km²</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Emergencies</p>
                <p className="text-gray-900 dark:text-white text-xl font-bold">{stats.emergencyCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Modal */}
      {showTrackModal && selectedDriverForAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Track Driver - {selectedDriverForAction.name}
                </h3>
                <button
                  onClick={() => {
                    setShowTrackModal(false)
                    setSelectedDriverForAction(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Real-time updates active</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last update: {new Date(selectedDriverForAction.lastUpdate).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Driver</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedDriverForAction.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedDriverForAction.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedDriverForAction.passenger}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trip ID</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedDriverForAction.tripId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Live Tracking Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-500/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Current Speed</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      {Math.round(selectedDriverForAction.speed)} km/h
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-500/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">ETA</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                      {selectedDriverForAction.eta}
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-500/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Destination</span>
                    </div>
                    <p className="text-lg font-bold text-orange-800 dark:text-orange-300">
                      {selectedDriverForAction.destination}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Navigation className="w-4 h-4" />
                    <span>Share Location</span>
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call Driver</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedDriverForAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Driver</h3>
                <button
                  onClick={() => {
                    setShowContactModal(false)
                    setSelectedDriverForAction(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedDriverForAction.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDriverForAction.vehicle}</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDriverForAction.rating} rating
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    alert(`Calling ${selectedDriverForAction.name} at ${selectedDriverForAction.phone}`)
                    setShowContactModal(false)
                    setSelectedDriverForAction(null)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
                >
                  <Phone className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Call Driver</p>
                    <p className="text-sm opacity-90">{selectedDriverForAction.phone}</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    alert(`Sending message to ${selectedDriverForAction.name}`)
                    setShowContactModal(false)
                    setSelectedDriverForAction(null)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-sm font-bold">💬</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Send Message</p>
                    <p className="text-sm opacity-90">Quick SMS to driver</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    alert(`Emergency contact initiated for ${selectedDriverForAction.name}`)
                    setShowContactModal(false)
                    setSelectedDriverForAction(null)
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Emergency Contact</p>
                    <p className="text-sm opacity-90">Priority communication</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      alert(`Sending location to ${selectedDriverForAction.name}`)
                      setShowContactModal(false)
                      setSelectedDriverForAction(null)
                    }}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Share Location
                  </button>
                  <button
                    onClick={() => {
                      alert(`Requesting ETA update from ${selectedDriverForAction.name}`)
                      setShowContactModal(false)
                      setSelectedDriverForAction(null)
                    }}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    Request ETA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EnhancedLiveTracking() {
  return (
    <ThemeProvider>
      <EnhancedLiveTrackingComponent />
    </ThemeProvider>
  )
}