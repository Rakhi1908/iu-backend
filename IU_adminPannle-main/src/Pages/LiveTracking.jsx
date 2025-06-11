"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
} from "lucide-react"

// Mock theme context since we don't have the actual one
const useTheme = () => ({ isDarkMode: false })

export default function LiveTracking() {
  const { isDarkMode } = useTheme()
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Ahmed Khan",
      phone: "+92 300 1234567",
      vehicle: "Toyota Corolla - ABC 123",
      status: "active",
      location: { lat: 24.8607, lng: 67.0011 },
      destination: "Gulshan-e-Iqbal",
      eta: "15 mins",
      tripId: "TRP001",
      passenger: "Sarah Ali",
      speed: 45,
      batteryLevel: 85,
      lastUpdate: new Date(),
      rating: 4.8,
      completedTrips: 156,
    },
    {
      id: 2,
      name: "Hassan Ali",
      phone: "+92 301 9876543",
      vehicle: "Honda City - XYZ 789",
      status: "active",
      location: { lat: 24.8615, lng: 67.0025 },
      destination: "DHA Phase 2",
      eta: "8 mins",
      tripId: "TRP002",
      passenger: "Omar Sheikh",
      speed: 32,
      batteryLevel: 92,
      lastUpdate: new Date(),
      rating: 4.6,
      completedTrips: 203,
    },
    {
      id: 3,
      name: "Fatima Noor",
      phone: "+92 302 5555555",
      vehicle: "Suzuki Alto - DEF 456",
      status: "idle",
      location: { lat: 24.859, lng: 67.004 },
      destination: null,
      eta: null,
      tripId: null,
      passenger: null,
      speed: 0,
      batteryLevel: 78,
      lastUpdate: new Date(),
      rating: 4.9,
      completedTrips: 89,
    },
    {
      id: 4,
      name: "Ali Raza",
      phone: "+92 303 7777777",
      vehicle: "Honda Civic - GHI 789",
      status: "emergency",
      location: { lat: 24.858, lng: 67.003 },
      destination: "Clifton",
      eta: "20 mins",
      tripId: "TRP003",
      passenger: "Ayesha Khan",
      speed: 0,
      batteryLevel: 45,
      lastUpdate: new Date(),
      rating: 4.7,
      completedTrips: 134,
    },
  ])

  const [selectedDriver, setSelectedDriver] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedDriverForAction, setSelectedDriverForAction] = useState(null)

  // Enhanced real-time simulation with more realistic updates
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          const newDriver = {
            ...driver,
            location: {
              lat: driver.location.lat + (Math.random() - 0.5) * 0.001,
              lng: driver.location.lng + (Math.random() - 0.5) * 0.001,
            },
            lastUpdate: new Date(),
          }

          // Simulate speed changes for active drivers
          if (driver.status === "active") {
            newDriver.speed = Math.max(0, driver.speed + (Math.random() - 0.5) * 10)
          }

          // Simulate battery drain
          if (driver.status === "active") {
            newDriver.batteryLevel = Math.max(0, driver.batteryLevel - Math.random() * 0.5)
          }

          // Check for low battery and create notification
          if (newDriver.batteryLevel < 20 && driver.batteryLevel >= 20) {
            const notification = {
              id: Date.now(),
              message: `${driver.name}'s device battery is low (${Math.round(newDriver.batteryLevel)}%)`,
              type: "warning",
              timestamp: new Date(),
            }
            setNotifications((prev) => [notification, ...prev.slice(0, 9)])
          }

          return newDriver
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoRefresh])

  // Filter drivers based on search and status
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

  // Statistics calculations
  const stats = useMemo(() => {
    const activeTrips = drivers.filter((d) => d.status === "active").length
    const totalDrivers = drivers.length
    const emergencyCount = drivers.filter((d) => d.status === "emergency").length
    const etaValues = drivers.filter((d) => d.eta).map((d) => Number.parseInt(d.eta.replace(/\D/g, "")) || 0)
    const avgETA = etaValues.length > 0 ? etaValues.reduce((acc, eta) => acc + eta, 0) / etaValues.length : 0

    return { activeTrips, totalDrivers, emergencyCount, avgETA }
  }, [drivers])

  const handleDriverClick = useCallback((driver) => {
    setSelectedDriver(driver)
    setMapCenter(driver.location)
  }, [])

  const handleEmergencyResponse = useCallback((driverId) => {
    setDrivers((prev) => prev.map((driver) => (driver.id === driverId ? { ...driver, status: "active" } : driver)))

    const notification = {
      id: Date.now(),
      message: `Emergency response initiated for driver ID: ${driverId}`,
      type: "info",
      timestamp: new Date(),
    }
    setNotifications((prev) => [notification, ...prev.slice(0, 9)])
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Header with Controls */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Live Tracking</h2>
            <p className="text-gray-600 dark:text-gray-400">Real-time tracking of drivers and ongoing trips</p>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                isAutoRefresh
                  ? "bg-green-100 dark:bg-green-700 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400"
                  : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
              <span className="text-sm">Auto Refresh</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3">
                          <div className="flex items-start space-x-2">
                            {notification.type === "warning" && (
                              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                            )}
                            {notification.type === "error" && <XCircle className="w-4 h-4 text-red-500 mt-0.5" />}
                            {notification.type === "info" && <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />}
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 dark:text-white">{notification.message}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Enhanced Map Area */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Tracking Active</span>
                </div>
                {stats.emergencyCount > 0 && (
                  <div className="flex items-center space-x-2 text-orange-500 dark:text-orange-400 text-sm mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>
                      {stats.emergencyCount} Emergency Alert{stats.emergencyCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Map */}
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative z-10">
              {/* Grid pattern to simulate map */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-6 h-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-gray-400 dark:border-gray-600"></div>
                  ))}
                </div>
              </div>

              {/* Driver markers */}
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    selectedDriver?.id === driver.id ? "scale-125" : "hover:scale-110"
                  }`}
                  style={{
                    left: `${((driver.location.lng - 67.0) * 10000) % 100}%`,
                    top: `${((driver.location.lat - 24.86) * 10000) % 100}%`,
                  }}
                  onClick={() => handleDriverClick(driver)}
                >
                  <div className={`relative ${getStatusColor(driver.status)}`}>
                    <Car className="w-6 h-6" />
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                        driver.status === "active"
                          ? "bg-green-500 dark:bg-green-400 animate-pulse"
                          : driver.status === "emergency"
                            ? "bg-orange-500 dark:bg-orange-400 animate-pulse"
                            : driver.status === "offline"
                              ? "bg-red-500"
                              : "bg-gray-500"
                      }`}
                    ></div>

                    {/* Speed indicator for active drivers */}
                    {driver.status === "active" && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-1 rounded whitespace-nowrap">
                        {Math.round(driver.speed)} km/h
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Enhanced Map controls */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
                  <Navigation className="w-4 h-4" />
                </button>
                <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
                  +
                </button>
                <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
                  -
                </button>
                <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Driver List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Drivers</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-500 dark:text-green-400 text-sm">{stats.activeTrips} Active</span>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  key={driver.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedDriver?.id === driver.id
                      ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-400/10"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  } ${driver.status === "emergency" ? "ring-2 ring-orange-500 dark:ring-orange-400" : ""}`}
                  onClick={() => handleDriverClick(driver)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-800 dark:text-white font-medium">{driver.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{driver.rating}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(driver.status)}`}>
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

                    {/* Enhanced driver info */}
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
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded mt-2">
                        <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Emergency Alert Active</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEmergencyResponse(driver.id)
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
                        className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-1 px-3 rounded text-xs transition-colors"
                      >
                        Track
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDriverForAction(driver)
                          setShowContactModal(true)
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded text-xs transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  )}

                  {/* Last update timestamp */}
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    Last update: {driver.lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Trip Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.activeTrips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.totalDrivers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Avg ETA</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">{Math.round(stats.avgETA) || 0} min</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Coverage Area</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">25 km²</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Emergencies</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.emergencyCount}</p>
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
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Track Driver - {selectedDriverForAction.name}
                </h3>
                <button
                  onClick={() => {
                    setShowTrackModal(false)
                    setSelectedDriverForAction(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Driver Info Card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Driver</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.passenger}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Trip ID</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.tripId}</p>
                  </div>
                </div>
              </div>

              {/* Live Tracking Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Live Tracking Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Current Speed</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      {Math.round(selectedDriverForAction.speed)} km/h
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">ETA</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                      {selectedDriverForAction.eta}
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Destination</span>
                    </div>
                    <p className="text-lg font-bold text-orange-800 dark:text-orange-300">
                      {selectedDriverForAction.destination}
                    </p>
                  </div>
                </div>

                {/* Route Progress */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Route Progress</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Picked up passenger</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(Date.now() - 10 * 60000).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">En route to destination</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Current location</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination arrival</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Expected in {selectedDriverForAction.eta}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
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
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contact Driver</h3>
                <button
                  onClick={() => {
                    setShowContactModal(false)
                    setSelectedDriverForAction(null)
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Driver Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDriverForAction.vehicle}</p>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDriverForAction.rating} rating
                  </span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Simulate phone call
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
                    // Simulate SMS
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
                    // Simulate emergency contact
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

              {/* Quick Actions */}
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
