// "use client"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import {
//   MapPin,
//   Navigation,
//   Clock,
//   User,
//   Phone,
//   Car,
//   Filter,
//   Search,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   Bell,
//   Settings,
// } from "lucide-react"

// // Mock theme context since we don't have the actual one
// const useTheme = () => ({ isDarkMode: false })

// export default function LiveTracking() {
//   const { isDarkMode } = useTheme()
//   const [drivers, setDrivers] = useState([
//     {
//       id: 1,
//       name: "Ahmed Khan",
//       phone: "+92 300 1234567",
//       vehicle: "Toyota Corolla - ABC 123",
//       status: "active",
//       location: { lat: 24.8607, lng: 67.0011 },
//       destination: "Gulshan-e-Iqbal",
//       eta: "15 mins",
//       tripId: "TRP001",
//       passenger: "Sarah Ali",
//       speed: 45,
//       batteryLevel: 85,
//       lastUpdate: new Date(),
//       rating: 4.8,
//       completedTrips: 156,
//     },
//     {
//       id: 2,
//       name: "Hassan Ali",
//       phone: "+92 301 9876543",
//       vehicle: "Honda City - XYZ 789",
//       status: "active",
//       location: { lat: 24.8615, lng: 67.0025 },
//       destination: "DHA Phase 2",
//       eta: "8 mins",
//       tripId: "TRP002",
//       passenger: "Omar Sheikh",
//       speed: 32,
//       batteryLevel: 92,
//       lastUpdate: new Date(),
//       rating: 4.6,
//       completedTrips: 203,
//     },
//     {
//       id: 3,
//       name: "Fatima Noor",
//       phone: "+92 302 5555555",
//       vehicle: "Suzuki Alto - DEF 456",
//       status: "idle",
//       location: { lat: 24.859, lng: 67.004 },
//       destination: null,
//       eta: null,
//       tripId: null,
//       passenger: null,
//       speed: 0,
//       batteryLevel: 78,
//       lastUpdate: new Date(),
//       rating: 4.9,
//       completedTrips: 89,
//     },
//     {
//       id: 4,
//       name: "Ali Raza",
//       phone: "+92 303 7777777",
//       vehicle: "Honda Civic - GHI 789",
//       status: "emergency",
//       location: { lat: 24.858, lng: 67.003 },
//       destination: "Clifton",
//       eta: "20 mins",
//       tripId: "TRP003",
//       passenger: "Ayesha Khan",
//       speed: 0,
//       batteryLevel: 45,
//       lastUpdate: new Date(),
//       rating: 4.7,
//       completedTrips: 134,
//     },
//   ])

//   const [selectedDriver, setSelectedDriver] = useState(null)
//   const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 })
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [isAutoRefresh, setIsAutoRefresh] = useState(true)
//   const [notifications, setNotifications] = useState([])
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [showTrackModal, setShowTrackModal] = useState(false)
//   const [showContactModal, setShowContactModal] = useState(false)
//   const [selectedDriverForAction, setSelectedDriverForAction] = useState(null)

//   // Enhanced real-time simulation with more realistic updates
//   useEffect(() => {
//     if (!isAutoRefresh) return

//     const interval = setInterval(() => {
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) => {
//           const newDriver = {
//             ...driver,
//             location: {
//               lat: driver.location.lat + (Math.random() - 0.5) * 0.001,
//               lng: driver.location.lng + (Math.random() - 0.5) * 0.001,
//             },
//             lastUpdate: new Date(),
//           }

//           // Simulate speed changes for active drivers
//           if (driver.status === "active") {
//             newDriver.speed = Math.max(0, driver.speed + (Math.random() - 0.5) * 10)
//           }

//           // Simulate battery drain
//           if (driver.status === "active") {
//             newDriver.batteryLevel = Math.max(0, driver.batteryLevel - Math.random() * 0.5)
//           }

//           // Check for low battery and create notification
//           if (newDriver.batteryLevel < 20 && driver.batteryLevel >= 20) {
//             const notification = {
//               id: Date.now(),
//               message: `${driver.name}'s device battery is low (${Math.round(newDriver.batteryLevel)}%)`,
//               type: "warning",
//               timestamp: new Date(),
//             }
//             setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//           }

//           return newDriver
//         }),
//       )
//     }, 3000)

//     return () => clearInterval(interval)
//   }, [isAutoRefresh])

//   // Filter drivers based on search and status
//   const filteredDrivers = useMemo(() => {
//     return drivers.filter((driver) => {
//       const matchesSearch =
//         driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.phone.includes(searchTerm)
//       const matchesStatus = statusFilter === "all" || driver.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//   }, [drivers, searchTerm, statusFilter])

//   // Statistics calculations
//   const stats = useMemo(() => {
//     const activeTrips = drivers.filter((d) => d.status === "active").length
//     const totalDrivers = drivers.length
//     const emergencyCount = drivers.filter((d) => d.status === "emergency").length
//     const etaValues = drivers.filter((d) => d.eta).map((d) => Number.parseInt(d.eta.replace(/\D/g, "")) || 0)
//     const avgETA = etaValues.length > 0 ? etaValues.reduce((acc, eta) => acc + eta, 0) / etaValues.length : 0

//     return { activeTrips, totalDrivers, emergencyCount, avgETA }
//   }, [drivers])

//   const handleDriverClick = useCallback((driver) => {
//     setSelectedDriver(driver)
//     setMapCenter(driver.location)
//   }, [])

//   const handleEmergencyResponse = useCallback((driverId) => {
//     setDrivers((prev) => prev.map((driver) => (driver.id === driverId ? { ...driver, status: "active" } : driver)))

//     const notification = {
//       id: Date.now(),
//       message: `Emergency response initiated for driver ID: ${driverId}`,
//       type: "info",
//       timestamp: new Date(),
//     }
//     setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//   }, [])

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "text-green-500 dark:text-green-400"
//       case "idle":
//         return "text-gray-500 dark:text-gray-400"
//       case "offline":
//         return "text-red-500 dark:text-red-400"
//       case "emergency":
//         return "text-orange-500 dark:text-orange-400"
//       default:
//         return "text-gray-500 dark:text-gray-400"
//     }
//   }

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
//       case "idle":
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//       case "offline":
//         return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
//       case "emergency":
//         return "bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-orange-400"
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
//       {/* Enhanced Header with Controls */}
//       <div className="p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Live Tracking</h2>
//             <p className="text-gray-600 dark:text-gray-400">Real-time tracking of drivers and ongoing trips</p>
//           </div>

//           <div className="flex items-center space-x-3 mt-4 sm:mt-0">
//             {/* Auto-refresh toggle */}
//             <button
//               onClick={() => setIsAutoRefresh(!isAutoRefresh)}
//               className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
//                 isAutoRefresh
//                   ? "bg-green-100 dark:bg-green-700 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400"
//                   : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
//               }`}
//             >
//               <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
//               <span className="text-sm">Auto Refresh</span>
//             </button>

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                 {notifications.length > 0 && (
//                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
//                   <div className="p-3 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
//                   </div>
//                   {notifications.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
//                   ) : (
//                     <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {notifications.map((notification) => (
//                         <div key={notification.id} className="p-3">
//                           <div className="flex items-start space-x-2">
//                             {notification.type === "warning" && (
//                               <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
//                             )}
//                             {notification.type === "error" && <XCircle className="w-4 h-4 text-red-500 mt-0.5" />}
//                             {notification.type === "info" && <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />}
//                             <div className="flex-1">
//                               <p className="text-sm text-gray-800 dark:text-white">{notification.message}</p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                 {notification.timestamp.toLocaleTimeString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
//           {/* Enhanced Map Area */}
//           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
//             <div className="absolute top-4 left-4 z-10">
//               <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm">
//                   <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
//                   <span>Live Tracking Active</span>
//                 </div>
//                 {stats.emergencyCount > 0 && (
//                   <div className="flex items-center space-x-2 text-orange-500 dark:text-orange-400 text-sm mt-1">
//                     <AlertTriangle className="w-3 h-3" />
//                     <span>
//                       {stats.emergencyCount} Emergency Alert{stats.emergencyCount > 1 ? "s" : ""}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Simulated Map */}
//             <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative z-10">
//               {/* Grid pattern to simulate map */}
//               <div className="absolute inset-0 opacity-10">
//                 <div className="grid grid-cols-8 grid-rows-6 h-full">
//                   {Array.from({ length: 48 }).map((_, i) => (
//                     <div key={i} className="border border-gray-400 dark:border-gray-600"></div>
//                   ))}
//                 </div>
//               </div>

//               {/* Driver markers */}
//               {filteredDrivers.map((driver) => (
//                 <div
//                   key={driver.id}
//                   className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
//                     selectedDriver?.id === driver.id ? "scale-125" : "hover:scale-110"
//                   }`}
//                   style={{
//                     left: `${((driver.location.lng - 67.0) * 10000) % 100}%`,
//                     top: `${((driver.location.lat - 24.86) * 10000) % 100}%`,
//                   }}
//                   onClick={() => handleDriverClick(driver)}
//                 >
//                   <div className={`relative ${getStatusColor(driver.status)}`}>
//                     <Car className="w-6 h-6" />
//                     <div
//                       className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
//                         driver.status === "active"
//                           ? "bg-green-500 dark:bg-green-400 animate-pulse"
//                           : driver.status === "emergency"
//                             ? "bg-orange-500 dark:bg-orange-400 animate-pulse"
//                             : driver.status === "offline"
//                               ? "bg-red-500"
//                               : "bg-gray-500"
//                       }`}
//                     ></div>

//                     {/* Speed indicator for active drivers */}
//                     {driver.status === "active" && (
//                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-1 rounded whitespace-nowrap">
//                         {Math.round(driver.speed)} km/h
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Enhanced Map controls */}
//               <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   <Navigation className="w-4 h-4" />
//                 </button>
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   +
//                 </button>
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   -
//                 </button>
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   <Settings className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Enhanced Driver List */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Drivers</h3>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-green-500 dark:text-green-400 text-sm">{stats.activeTrips} Active</span>
//               </div>
//             </div>

//             {/* Search and Filter */}
//             <div className="space-y-3 mb-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search drivers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="idle">Idle</option>
//                   <option value="offline">Offline</option>
//                   <option value="emergency">Emergency</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
//               {filteredDrivers.map((driver) => (
//                 <div
//                   key={driver.id}
//                   className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
//                     selectedDriver?.id === driver.id
//                       ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-400/10"
//                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
//                   } ${driver.status === "emergency" ? "ring-2 ring-orange-500 dark:ring-orange-400" : ""}`}
//                   onClick={() => handleDriverClick(driver)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center space-x-2">
//                       <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                       <span className="text-gray-800 dark:text-white font-medium">{driver.name}</span>
//                       <div className="flex items-center space-x-1">
//                         <span className="text-yellow-500">★</span>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">{driver.rating}</span>
//                       </div>
//                     </div>
//                     <div className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(driver.status)}`}>
//                       {driver.status}
//                     </div>
//                   </div>

//                   <div className="space-y-1 text-sm">
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Car className="w-3 h-3" />
//                       <span>{driver.vehicle}</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Phone className="w-3 h-3" />
//                       <span>{driver.phone}</span>
//                     </div>

//                     {/* Enhanced driver info */}
//                     <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//                       <span>Battery: {Math.round(driver.batteryLevel)}%</span>
//                       <span>Trips: {driver.completedTrips}</span>
//                     </div>

//                     {driver.status === "active" && (
//                       <>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <MapPin className="w-3 h-3" />
//                           <span>To: {driver.destination}</span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <Clock className="w-3 h-3" />
//                           <span>ETA: {driver.eta}</span>
//                         </div>
//                         <div className="text-gray-600 dark:text-gray-400">
//                           <span>Passenger: {driver.passenger}</span>
//                         </div>
//                         <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
//                           <span>Trip: {driver.tripId}</span>
//                           <span>Speed: {Math.round(driver.speed)} km/h</span>
//                         </div>
//                       </>
//                     )}

//                     {driver.status === "emergency" && (
//                       <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded mt-2">
//                         <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-sm">
//                           <AlertTriangle className="w-4 h-4" />
//                           <span>Emergency Alert Active</span>
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleEmergencyResponse(driver.id)
//                           }}
//                           className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded text-xs transition-colors"
//                         >
//                           Respond to Emergency
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {driver.status === "active" && (
//                     <div className="mt-3 flex space-x-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setSelectedDriverForAction(driver)
//                           setShowTrackModal(true)
//                         }}
//                         className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-1 px-3 rounded text-xs transition-colors"
//                       >
//                         Track
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setSelectedDriverForAction(driver)
//                           setShowContactModal(true)
//                         }}
//                         className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded text-xs transition-colors"
//                       >
//                         Contact
//                       </button>
//                     </div>
//                   )}

//                   {/* Last update timestamp */}
//                   <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
//                     Last update: {driver.lastUpdate.toLocaleTimeString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Trip Statistics */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <Car className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.activeTrips}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <User className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.totalDrivers}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <Clock className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Avg ETA</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{Math.round(stats.avgETA) || 0} min</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <MapPin className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Coverage Area</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">25 km²</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Emergencies</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.emergencyCount}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Track Modal */}
//       {showTrackModal && selectedDriverForAction && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">
//                   Track Driver - {selectedDriverForAction.name}
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowTrackModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <XCircle className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Driver Info Card */}
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Driver</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.vehicle}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.passenger}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Trip ID</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.tripId}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Live Tracking Info */}
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="font-semibold">Live Tracking Active</span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                       <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Current Speed</span>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
//                       {Math.round(selectedDriverForAction.speed)} km/h
//                     </p>
//                   </div>

//                   <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
//                       <span className="text-sm font-semibold text-green-600 dark:text-green-400">ETA</span>
//                     </div>
//                     <p className="text-2xl font-bold text-green-800 dark:text-green-300">
//                       {selectedDriverForAction.eta}
//                     </p>
//                   </div>

//                   <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//                       <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Destination</span>
//                     </div>
//                     <p className="text-lg font-bold text-orange-800 dark:text-orange-300">
//                       {selectedDriverForAction.destination}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Route Progress */}
//                 <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
//                   <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Route Progress</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-800 dark:text-white">Picked up passenger</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           {new Date(Date.now() - 10 * 60000).toLocaleTimeString()}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-800 dark:text-white">En route to destination</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Current location</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination arrival</p>
//                         <p className="text-xs text-gray-400 dark:text-gray-500">
//                           Expected in {selectedDriverForAction.eta}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-3 pt-4">
//                   <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
//                     <Navigation className="w-4 h-4" />
//                     <span>Share Location</span>
//                   </button>
//                   <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
//                     <Phone className="w-4 h-4" />
//                     <span>Call Driver</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Contact Modal */}
//       {showContactModal && selectedDriverForAction && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contact Driver</h3>
//                 <button
//                   onClick={() => {
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <XCircle className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Driver Info */}
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <User className="w-8 h-8 text-green-600 dark:text-green-400" />
//                 </div>
//                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDriverForAction.vehicle}</p>
//                 <div className="flex items-center justify-center space-x-1 mt-1">
//                   <span className="text-yellow-500">★</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {selectedDriverForAction.rating} rating
//                   </span>
//                 </div>
//               </div>

//               {/* Contact Options */}
//               <div className="space-y-3">
//                 <button
//                   onClick={() => {
//                     // Simulate phone call
//                     alert(`Calling ${selectedDriverForAction.name} at ${selectedDriverForAction.phone}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <Phone className="w-5 h-5" />
//                   <div className="text-left">
//                     <p className="font-semibold">Call Driver</p>
//                     <p className="text-sm opacity-90">{selectedDriverForAction.phone}</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => {
//                     // Simulate SMS
//                     alert(`Sending message to ${selectedDriverForAction.name}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <div className="w-5 h-5 flex items-center justify-center">
//                     <span className="text-sm font-bold">💬</span>
//                   </div>
//                   <div className="text-left">
//                     <p className="font-semibold">Send Message</p>
//                     <p className="text-sm opacity-90">Quick SMS to driver</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => {
//                     // Simulate emergency contact
//                     alert(`Emergency contact initiated for ${selectedDriverForAction.name}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <AlertTriangle className="w-5 h-5" />
//                   <div className="text-left">
//                     <p className="font-semibold">Emergency Contact</p>
//                     <p className="text-sm opacity-90">Priority communication</p>
//                   </div>
//                 </button>
//               </div>

//               {/* Quick Actions */}
//               <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Actions</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => {
//                       alert(`Sending location to ${selectedDriverForAction.name}`)
//                       setShowContactModal(false)
//                       setSelectedDriverForAction(null)
//                     }}
//                     className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
//                   >
//                     Share Location
//                   </button>
//                   <button
//                     onClick={() => {
//                       alert(`Requesting ETA update from ${selectedDriverForAction.name}`)
//                       setShowContactModal(false)
//                       setSelectedDriverForAction(null)
//                     }}
//                     className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
//                   >
//                     Request ETA
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// -------------------------Add Driver -------------------------

// "use client"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import {
//   MapPin,
//   Clock,
//   User,
//   Phone,
//   Car,
//   Filter,
//   Search,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   Bell,
//   Wifi,
//   WifiOff,
//   Plus,
//   Trash2,
// } from "lucide-react"
// import { useSocket } from "../hooks/livetrackingSocket"
// import { apiService } from "../services/api"

// export default function LiveTrackingIntegrated() {
//   const {
//     socket,
//     isConnected,
//     drivers,
//     notifications,
//     updateDriverStatus,
//     sendEmergencyAlert,
//     assignTrip,
//     refreshDrivers,
//     setNotifications,
//   } = useSocket()

//   const [selectedDriver, setSelectedDriver] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [showTrackModal, setShowTrackModal] = useState(false)
//   const [showContactModal, setShowContactModal] = useState(false)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [selectedDriverForAction, setSelectedDriverForAction] = useState(null)
//   const [stats, setStats] = useState({})
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   // Fetch driver statistics
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await apiService.getDriverStats()
//         setStats(response.data)
//       } catch (error) {
//         console.error("Error fetching stats:", error)
//       }
//     }

//     fetchStats()
//     const interval = setInterval(fetchStats, 30000) // Update every 30 seconds

//     return () => clearInterval(interval)
//   }, [])

//   // Filter drivers based on search and status
//   const filteredDrivers = useMemo(() => {
//     return drivers.filter((driver) => {
//       const matchesSearch =
//         driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.phone.includes(searchTerm)
//       const matchesStatus = statusFilter === "all" || driver.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//   }, [drivers, searchTerm, statusFilter])

//   const handleDriverClick = useCallback((driver) => {
//     setSelectedDriver(driver)
//   }, [])

//   const handleStatusChange = useCallback(
//     async (driverId, newStatus) => {
//       try {
//         setLoading(true)
//         updateDriverStatus(driverId, newStatus)

//         // Also update via REST API for persistence
//         await apiService.updateDriver(driverId, { status: newStatus })

//         setError(null)
//       } catch (error) {
//         setError("Failed to update driver status")
//         console.error("Error updating status:", error)
//       } finally {
//         setLoading(false)
//       }
//     },
//     [updateDriverStatus],
//   )

//   const handleEmergencyResponse = useCallback(
//     async (driverId) => {
//       try {
//         setLoading(true)
//         updateDriverStatus(driverId, "active")

//         const notification = {
//           id: Date.now(),
//           message: `Emergency response initiated for driver ID: ${driverId}`,
//           type: "success",
//           timestamp: new Date(),
//         }
//         setNotifications((prev) => [notification, ...prev.slice(0, 9)])

//         setError(null)
//       } catch (error) {
//         setError("Failed to respond to emergency")
//         console.error("Error responding to emergency:", error)
//       } finally {
//         setLoading(false)
//       }
//     },
//     [updateDriverStatus, setNotifications],
//   )

//   const handleCreateDriver = async (driverData) => {
//     try {
//       setLoading(true)
//       await apiService.createDriver(driverData)
//       refreshDrivers()
//       setShowCreateModal(false)

//       const notification = {
//         id: Date.now(),
//         message: `New driver ${driverData.name} added successfully`,
//         type: "success",
//         timestamp: new Date(),
//       }
//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])

//       setError(null)
//     } catch (error) {
//       setError("Failed to create driver")
//       console.error("Error creating driver:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteDriver = async (driverId) => {
//     if (!window.confirm("Are you sure you want to delete this driver?")) return

//     try {
//       setLoading(true)
//       await apiService.deleteDriver(driverId)
//       refreshDrivers()

//       const notification = {
//         id: Date.now(),
//         message: `Driver deleted successfully`,
//         type: "info",
//         timestamp: new Date(),
//       }
//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])

//       setError(null)
//     } catch (error) {
//       setError("Failed to delete driver")
//       console.error("Error deleting driver:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAssignTrip = useCallback(
//     (driverId) => {
//       const destinations = ["Gulshan-e-Iqbal", "DHA Phase 2", "Clifton", "Saddar", "North Nazimabad"]
//       const passengers = ["Sarah Ali", "Omar Sheikh", "Ayesha Khan", "Hassan Ahmed"]

//       const destination = destinations[Math.floor(Math.random() * destinations.length)]
//       const passenger = passengers[Math.floor(Math.random() * passengers.length)]
//       const tripId = `TRP${Date.now().toString().slice(-6)}`

//       assignTrip(driverId, destination, passenger, tripId)
//     },
//     [assignTrip],
//   )

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "text-green-500 dark:text-green-400"
//       case "idle":
//         return "text-gray-500 dark:text-gray-400"
//       case "offline":
//         return "text-red-500 dark:text-red-400"
//       case "emergency":
//         return "text-orange-500 dark:text-orange-400"
//       default:
//         return "text-gray-500 dark:text-gray-400"
//     }
//   }

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
//       case "idle":
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//       case "offline":
//         return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
//       case "emergency":
//         return "bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-orange-400"
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
//       {/* Enhanced Header with Connection Status */}
//       <div className="p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <div className="flex items-center space-x-3 mb-2">
//               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Live Tracking</h2>
//               <div
//                 className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
//                   isConnected
//                     ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
//                     : "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
//                 }`}
//               >
//                 {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
//                 <span>{isConnected ? "Connected" : "Disconnected"}</span>
//               </div>
//             </div>
//             <p className="text-gray-600 dark:text-gray-400">
//               Real-time tracking with Socket.io • {drivers.length} drivers online
//             </p>
//           </div>

//           <div className="flex items-center space-x-3 mt-4 sm:mt-0">
//             {/* Add Driver Button */}
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//             >
//               <Plus className="w-4 h-4" />
//               <span>Add Driver</span>
//             </button>

//             {/* Refresh Button */}
//             <button
//               onClick={refreshDrivers}
//               disabled={loading}
//               className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//               <span className="text-sm">Refresh</span>
//             </button>

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                 {notifications.length > 0 && (
//                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
//                   <div className="p-3 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="font-semibold text-gray-800 dark:text-white">Real-time Notifications</h3>
//                   </div>
//                   {notifications.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
//                   ) : (
//                     <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {notifications.map((notification) => (
//                         <div key={notification.id} className="p-3">
//                           <div className="flex items-start space-x-2">
//                             {notification.type === "emergency" && (
//                               <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
//                             )}
//                             {notification.type === "success" && (
//                               <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
//                             )}
//                             {notification.type === "info" && <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />}
//                             <div className="flex-1">
//                               <p className="text-sm text-gray-800 dark:text-white">{notification.message}</p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                 {notification.timestamp.toLocaleTimeString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <XCircle className="w-5 h-5 text-red-500" />
//               <span className="text-red-700 dark:text-red-400">{error}</span>
//               <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
//                 <XCircle className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
//           {/* Enhanced Map Area */}
//           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
//             <div className="absolute top-4 left-4 z-10">
//               <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm">
//                   <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
//                   <span>Socket.io Live Updates</span>
//                 </div>
//                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   {drivers.filter((d) => d.status === "active").length} active • {drivers.length} total
//                 </div>
//               </div>
//             </div>

//             {/* Simulated Map */}
//             <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
//               {/* Grid pattern */}
//               <div className="absolute inset-0 opacity-10">
//                 <div className="grid grid-cols-8 grid-rows-6 h-full">
//                   {Array.from({ length: 48 }).map((_, i) => (
//                     <div key={i} className="border border-gray-400 dark:border-gray-600"></div>
//                   ))}
//                 </div>
//               </div>

//               {/* Driver markers */}
//               {filteredDrivers.map((driver) => (
//                 <div
//                   key={driver._id}
//                   className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
//                     selectedDriver?._id === driver._id ? "scale-125" : "hover:scale-110"
//                   }`}
//                   style={{
//                     left: `${((driver.location.lng - 67.0) * 10000) % 100}%`,
//                     top: `${((driver.location.lat - 24.86) * 10000) % 100}%`,
//                   }}
//                   onClick={() => handleDriverClick(driver)}
//                 >
//                   <div className={`relative ${getStatusColor(driver.status)}`}>
//                     <Car className="w-6 h-6" />
//                     <div
//                       className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
//                         driver.status === "active"
//                           ? "bg-green-500 dark:bg-green-400 animate-pulse"
//                           : driver.status === "emergency"
//                             ? "bg-red-500 dark:bg-red-400 animate-pulse"
//                             : driver.status === "offline"
//                               ? "bg-red-500"
//                               : "bg-gray-500"
//                       }`}
//                     ></div>

//                     {driver.status === "active" && (
//                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-1 rounded whitespace-nowrap">
//                         {Math.round(driver.speed)} km/h
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Enhanced Driver List */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Drivers</h3>
//               <div className="flex items-center space-x-2">
//                 <div
//                   className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                 ></div>
//                 <span className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
//                   {isConnected ? "Live" : "Offline"}
//                 </span>
//               </div>
//             </div>

//             {/* Search and Filter */}
//             <div className="space-y-3 mb-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search drivers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="idle">Idle</option>
//                   <option value="offline">Offline</option>
//                   <option value="emergency">Emergency</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
//               {filteredDrivers.map((driver) => (
//                 <div
//                   key={driver._id}
//                   className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
//                     selectedDriver?._id === driver._id
//                       ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-400/10"
//                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
//                   } ${driver.status === "emergency" ? "ring-2 ring-red-500 dark:ring-red-400" : ""}`}
//                   onClick={() => handleDriverClick(driver)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center space-x-2">
//                       <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                       <span className="text-gray-800 dark:text-white font-medium">{driver.name}</span>
//                       <div className="flex items-center space-x-1">
//                         <span className="text-yellow-500">★</span>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">{driver.rating}</span>
//                       </div>
//                     </div>
//                     <div className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(driver.status)}`}>
//                       {driver.status}
//                     </div>
//                   </div>

//                   <div className="space-y-1 text-sm">
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Car className="w-3 h-3" />
//                       <span>{driver.vehicle}</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Phone className="w-3 h-3" />
//                       <span>{driver.phone}</span>
//                     </div>

//                     <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//                       <span>Battery: {Math.round(driver.batteryLevel)}%</span>
//                       <span>Trips: {driver.completedTrips}</span>
//                     </div>

//                     {driver.status === "active" && (
//                       <>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <MapPin className="w-3 h-3" />
//                           <span>To: {driver.destination}</span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <Clock className="w-3 h-3" />
//                           <span>ETA: {driver.eta}</span>
//                         </div>
//                         <div className="text-gray-600 dark:text-gray-400">
//                           <span>Passenger: {driver.passenger}</span>
//                         </div>
//                         <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
//                           <span>Trip: {driver.tripId}</span>
//                           <span>Speed: {Math.round(driver.speed)} km/h</span>
//                         </div>
//                       </>
//                     )}

//                     {driver.status === "emergency" && (
//                       <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded mt-2">
//                         <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
//                           <AlertTriangle className="w-4 h-4" />
//                           <span>Emergency Alert Active</span>
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleEmergencyResponse(driver._id)
//                           }}
//                           disabled={loading}
//                           className="mt-2 w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-1 px-3 rounded text-xs transition-colors"
//                         >
//                           {loading ? "Responding..." : "Respond to Emergency"}
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="mt-3 flex space-x-2">
//                     {driver.status === "idle" && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           handleAssignTrip(driver._id)
//                         }}
//                         disabled={loading}
//                         className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-1 px-3 rounded text-xs transition-colors"
//                       >
//                         Assign Trip
//                       </button>
//                     )}

//                     <select
//                       value={driver.status}
//                       onChange={(e) => {
//                         e.stopPropagation()
//                         handleStatusChange(driver._id, e.target.value)
//                       }}
//                       disabled={loading}
//                       className="flex-1 py-1 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
//                     >
//                       <option value="active">Active</option>
//                       <option value="idle">Idle</option>
//                       <option value="offline">Offline</option>
//                       <option value="emergency">Emergency</option>
//                     </select>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         handleDeleteDriver(driver._id)
//                       }}
//                       disabled={loading}
//                       className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>

//                   {/* Last update timestamp */}
//                   <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
//                     Last update: {new Date(driver.lastUpdate).toLocaleTimeString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Statistics */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <Car className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">
//                   {stats.activeDrivers || drivers.filter((d) => d.status === "active").length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <User className="w-5 h-5 text-blue-500 dark:text-blue-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">
//                   {stats.totalDrivers || drivers.length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Emergencies</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">
//                   {stats.emergencyDrivers || drivers.filter((d) => d.status === "emergency").length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <CheckCircle className="w-5 h-5 text-purple-500 dark:text-purple-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Total Trips</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">
//                   {stats.totalTrips || drivers.reduce((sum, d) => sum + d.completedTrips, 0)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <div
//                 className={`w-5 h-5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//               ></div>
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Connection</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{isConnected ? "Live" : "Offline"}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Create Driver Modal */}
//       {showCreateModal && (
//         <CreateDriverModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateDriver} loading={loading} />
//       )}
//     </div>
//   )
// }

// // Create Driver Modal Component
// const CreateDriverModal = ({ onClose, onSubmit, loading }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     vehicle: "",
//     status: "idle",
//     location: { lat: 24.8607, lng: 67.0011 },
//     rating: 4.5,
//     completedTrips: 0,
//     batteryLevel: 100,
//   })

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     onSubmit(formData)
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add New Driver</h3>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               <XCircle className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Name</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter driver name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
//               <input
//                 type="tel"
//                 required
//                 value={formData.phone}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="+92 300 1234567"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Details</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.vehicle}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, vehicle: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Toyota Corolla - ABC 123"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Status</label>
//               <select
//                 value={formData.status}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="idle">Idle</option>
//                 <option value="active">Active</option>
//                 <option value="offline">Offline</option>
//               </select>
//             </div>

//             <div className="flex space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
//               >
//                 {loading ? "Creating..." : "Create Driver"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// ----------------------------------------perfect code ------------------------------------------------------

// "use client"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import {
//   MapPin,
//   Navigation,
//   Clock,
//   User,
//   Phone,
//   Car,
//   Filter,
//   Search,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   Bell,
//   Settings,
//   Wifi,
//   WifiOff,
// } from "lucide-react"
// import io from "socket.io-client"

// // Backend configuration
// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// // Mock theme context since we don't have the actual one
// const useTheme = () => ({ isDarkMode: false })

// export default function LiveTracking() {
//   const { isDarkMode } = useTheme()

//   // Socket and connection state
//   const [socket, setSocket] = useState(null)
//   const [isConnected, setIsConnected] = useState(false)

//   // Driver data from MongoDB
//   const [drivers, setDrivers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // UI state
//   const [selectedDriver, setSelectedDriver] = useState(null)
//   const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 })
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [isAutoRefresh, setIsAutoRefresh] = useState(true)
//   const [notifications, setNotifications] = useState([])
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [showTrackModal, setShowTrackModal] = useState(false)
//   const [showContactModal, setShowContactModal] = useState(false)
//   const [selectedDriverForAction, setSelectedDriverForAction] = useState(null)

//   // Initialize Socket.io connection
//   useEffect(() => {
//     const newSocket = io(BACKEND_URL, {
//       transports: ["websocket"],
//       upgrade: true,
//     })

//     newSocket.on("connect", () => {
//       console.log("🔌 Connected to backend:", newSocket.id)
//       setIsConnected(true)
//       setError(null)

//       // Request initial driver data
//       newSocket.emit("getLatestDrivers")
//     })

//     newSocket.on("disconnect", () => {
//       console.log("🔌 Disconnected from backend")
//       setIsConnected(false)
//     })

//     newSocket.on("connect_error", (error) => {
//       console.error("❌ Connection error:", error)
//       setError("Failed to connect to backend server")
//       setIsConnected(false)
//     })

//     // Listen for driver updates from MongoDB
//     newSocket.on("driversUpdate", (data) => {
//       if (data.success && data.data) {
//         console.log("📍 Drivers updated from MongoDB:", data.data.length)
//         setDrivers(data.data)
//         setLoading(false)

//         // Update selected driver if it exists
//         if (selectedDriver) {
//           const updatedSelectedDriver = data.data.find((d) => d._id === selectedDriver._id)
//           if (updatedSelectedDriver) {
//             setSelectedDriver(updatedSelectedDriver)
//           }
//         }

//         // Update selected driver for action if it exists
//         if (selectedDriverForAction) {
//           const updatedActionDriver = data.data.find((d) => d._id === selectedDriverForAction._id)
//           if (updatedActionDriver) {
//             setSelectedDriverForAction(updatedActionDriver)
//           }
//         }
//       }
//     })

//     // Listen for individual location updates
//     newSocket.on("locationUpdate", (data) => {
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? {
//                 ...driver,
//                 location: data.location,
//                 speed: data.speed,
//                 lastUpdate: new Date(data.timestamp),
//               }
//             : driver,
//         ),
//       )

//       // Update modals if they're open
//       if (selectedDriverForAction && selectedDriverForAction._id === data.driverId) {
//         setSelectedDriverForAction((prev) => ({
//           ...prev,
//           location: data.location,
//           speed: data.speed,
//           lastUpdate: new Date(data.timestamp),
//         }))
//       }
//     })

//     // Listen for emergency alerts
//     newSocket.on("emergencyAlert", (data) => {
//       console.log("🚨 Emergency Alert:", data)

//       const notification = {
//         id: Date.now(),
//         type: "warning",
//         message: data.message,
//         timestamp: new Date(data.timestamp),
//       }

//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])

//       // Update driver status
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? { ...driver, status: "emergency", lastUpdate: new Date(data.timestamp) }
//             : driver,
//         ),
//       )
//     })

//     // Listen for status changes
//     newSocket.on("driverStatusChanged", (data) => {
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? { ...driver, status: data.status, lastUpdate: new Date(data.timestamp) }
//             : driver,
//         ),
//       )

//       const notification = {
//         id: Date.now(),
//         type: "info",
//         message: `Driver ${data.driver.name} status changed to ${data.status}`,
//         timestamp: new Date(data.timestamp),
//       }

//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//     })

//     // Listen for trip assignments
//     newSocket.on("tripAssigned", (data) => {
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? {
//                 ...driver,
//                 status: "active",
//                 destination: data.tripDetails.destination,
//                 passenger: data.tripDetails.passenger,
//                 tripId: data.tripDetails.tripId,
//                 lastUpdate: new Date(data.timestamp),
//               }
//             : driver,
//         ),
//       )

//       const notification = {
//         id: Date.now(),
//         type: "info",
//         message: `Trip ${data.tripDetails.tripId} assigned to ${data.driver.name}`,
//         timestamp: new Date(data.timestamp),
//       }

//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//     })

//     setSocket(newSocket)

//     // Cleanup on unmount
//     return () => {
//       newSocket.close()
//     }
//   }, [])

//   // Fetch initial data from REST API as fallback
//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`${API_URL}/drivers`)
//         const data = await response.json()

//         if (data.success) {
//           setDrivers(data.data)
//           console.log("📊 Fetched drivers from REST API:", data.data.length)
//         } else {
//           throw new Error(data.message || "Failed to fetch drivers")
//         }
//       } catch (error) {
//         console.error("❌ Error fetching drivers:", error)
//         setError("Failed to load driver data")
//       } finally {
//         setLoading(false)
//       }
//     }

//     // Only fetch if socket is not connected
//     if (!isConnected) {
//       fetchDrivers()
//     }
//   }, [isConnected])

//   // Auto-refresh data every 30 seconds as backup
//   useEffect(() => {
//     if (!isAutoRefresh || !socket) return

//     const interval = setInterval(() => {
//       if (socket && isConnected) {
//         socket.emit("getLatestDrivers")
//       }
//     }, 30000) // 30 seconds

//     return () => clearInterval(interval)
//   }, [isAutoRefresh, socket, isConnected])

//   // Filter drivers based on search and status
//   const filteredDrivers = useMemo(() => {
//     return drivers.filter((driver) => {
//       const matchesSearch =
//         driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.phone.includes(searchTerm)
//       const matchesStatus = statusFilter === "all" || driver.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//   }, [drivers, searchTerm, statusFilter])

//   // Statistics calculations
//   const stats = useMemo(() => {
//     const activeTrips = drivers.filter((d) => d.status === "active").length
//     const totalDrivers = drivers.length
//     const emergencyCount = drivers.filter((d) => d.status === "emergency").length
//     const etaValues = drivers.filter((d) => d.eta).map((d) => Number.parseInt(d.eta.replace(/\D/g, "")) || 0)
//     const avgETA = etaValues.length > 0 ? etaValues.reduce((acc, eta) => acc + eta, 0) / etaValues.length : 0

//     return { activeTrips, totalDrivers, emergencyCount, avgETA }
//   }, [drivers])

//   const handleDriverClick = useCallback((driver) => {
//     setSelectedDriver(driver)
//     setMapCenter(driver.location)
//   }, [])

//   const handleEmergencyResponse = useCallback(
//     (driverId) => {
//       if (socket && isConnected) {
//         socket.emit("updateDriverStatus", { driverId, status: "active" })
//       }

//       const notification = {
//         id: Date.now(),
//         message: `Emergency response initiated for driver ID: ${driverId}`,
//         type: "info",
//         timestamp: new Date(),
//       }
//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//     },
//     [socket, isConnected],
//   )

//   const handleRefresh = useCallback(() => {
//     if (socket && isConnected) {
//       socket.emit("getLatestDrivers")
//     } else {
//       // Fallback to REST API
//       window.location.reload()
//     }
//   }, [socket, isConnected])

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "text-green-500 dark:text-green-400"
//       case "idle":
//         return "text-gray-500 dark:text-gray-400"
//       case "offline":
//         return "text-red-500 dark:text-red-400"
//       case "emergency":
//         return "text-orange-500 dark:text-orange-400"
//       default:
//         return "text-gray-500 dark:text-gray-400"
//     }
//   }

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
//       case "idle":
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//       case "offline":
//         return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
//       case "emergency":
//         return "bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-orange-400"
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600 dark:text-gray-400">Loading driver data from MongoDB...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
//       {/* Enhanced Header with Controls */}
//       <div className="p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <div className="flex items-center space-x-3 mb-2">
//               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Live Tracking</h2>
//               <div
//                 className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
//                   isConnected
//                     ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
//                     : "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
//                 }`}
//               >
//                 {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
//                 <span>{isConnected ? "Live" : "Offline"}</span>
//               </div>
//             </div>
//             <p className="text-gray-600 dark:text-gray-400">
//               Real-time tracking from MongoDB • {drivers.length} drivers loaded
//             </p>
//           </div>

//           <div className="flex items-center space-x-3 mt-4 sm:mt-0">
//             {/* Auto-refresh toggle */}
//             <button
//               onClick={() => setIsAutoRefresh(!isAutoRefresh)}
//               className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
//                 isAutoRefresh
//                   ? "bg-green-100 dark:bg-green-700 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400"
//                   : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
//               }`}
//             >
//               <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
//               <span className="text-sm">Auto Refresh</span>
//             </button>

//             {/* Manual Refresh */}
//             <button
//               onClick={handleRefresh}
//               className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" />
//               <span className="text-sm">Refresh</span>
//             </button>

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                 {notifications.length > 0 && (
//                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
//                   <div className="p-3 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="font-semibold text-gray-800 dark:text-white">Real-time Notifications</h3>
//                   </div>
//                   {notifications.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
//                   ) : (
//                     <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {notifications.map((notification) => (
//                         <div key={notification.id} className="p-3">
//                           <div className="flex items-start space-x-2">
//                             {notification.type === "warning" && (
//                               <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
//                             )}
//                             {notification.type === "error" && <XCircle className="w-4 h-4 text-red-500 mt-0.5" />}
//                             {notification.type === "info" && <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />}
//                             <div className="flex-1">
//                               <p className="text-sm text-gray-800 dark:text-white">{notification.message}</p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                 {notification.timestamp.toLocaleTimeString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <XCircle className="w-5 h-5 text-red-500" />
//               <span className="text-red-700 dark:text-red-400">{error}</span>
//               <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
//                 <XCircle className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
//           {/* Enhanced Map Area */}
//           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
//             <div className="absolute top-4 left-4 z-10">
//               <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm">
//                   <div
//                     className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                   ></div>
//                   <span>{isConnected ? "Live MongoDB Updates" : "MongoDB Offline"}</span>
//                 </div>
//                 {stats.emergencyCount > 0 && (
//                   <div className="flex items-center space-x-2 text-orange-500 dark:text-orange-400 text-sm mt-1">
//                     <AlertTriangle className="w-3 h-3" />
//                     <span>
//                       {stats.emergencyCount} Emergency Alert{stats.emergencyCount > 1 ? "s" : ""}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Simulated Map */}
//             <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative z-10">
//               {/* Grid pattern to simulate map */}
//               <div className="absolute inset-0 opacity-10">
//                 <div className="grid grid-cols-8 grid-rows-6 h-full">
//                   {Array.from({ length: 48 }).map((_, i) => (
//                     <div key={i} className="border border-gray-400 dark:border-gray-600"></div>
//                   ))}
//                 </div>
//               </div>

//               {/* Driver markers */}
//               {filteredDrivers.map((driver) => (
//                 <div
//                   key={driver._id}
//                   className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
//                     selectedDriver?._id === driver._id ? "scale-125" : "hover:scale-110"
//                   }`}
//                   style={{
//                     left: `${((driver.location.lng - 67.0) * 10000) % 100}%`,
//                     top: `${((driver.location.lat - 24.86) * 10000) % 100}%`,
//                   }}
//                   onClick={() => handleDriverClick(driver)}
//                 >
//                   <div className={`relative ${getStatusColor(driver.status)}`}>
//                     <Car className="w-6 h-6" />
//                     <div
//                       className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
//                         driver.status === "active"
//                           ? "bg-green-500 dark:bg-green-400 animate-pulse"
//                           : driver.status === "emergency"
//                             ? "bg-orange-500 dark:bg-orange-400 animate-pulse"
//                             : driver.status === "offline"
//                               ? "bg-red-500"
//                               : "bg-gray-500"
//                       }`}
//                     ></div>

//                     {/* Speed indicator for active drivers */}
//                     {driver.status === "active" && (
//                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-1 rounded whitespace-nowrap">
//                         {Math.round(driver.speed)} km/h
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Enhanced Map controls */}
//               <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   <Navigation className="w-4 h-4" />
//                 </button>
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   +
//                 </button>
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   -
//                 </button>
//                 <button className="bg-white/90 dark:bg-gray-900/90 p-2 rounded text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition-colors border border-gray-200 dark:border-gray-700">
//                   <Settings className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Enhanced Driver List */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Drivers</h3>
//               <div className="flex items-center space-x-2">
//                 <div
//                   className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                 ></div>
//                 <span className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
//                   {stats.activeTrips} Active
//                 </span>
//               </div>
//             </div>

//             {/* Search and Filter */}
//             <div className="space-y-3 mb-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search drivers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="idle">Idle</option>
//                   <option value="offline">Offline</option>
//                   <option value="emergency">Emergency</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
//               {filteredDrivers.map((driver) => (
//                 <div
//                   key={driver._id}
//                   className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
//                     selectedDriver?._id === driver._id
//                       ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-400/10"
//                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
//                   } ${driver.status === "emergency" ? "ring-2 ring-orange-500 dark:ring-orange-400" : ""}`}
//                   onClick={() => handleDriverClick(driver)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center space-x-2">
//                       <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                       <span className="text-gray-800 dark:text-white font-medium">{driver.name}</span>
//                       <div className="flex items-center space-x-1">
//                         <span className="text-yellow-500">★</span>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">{driver.rating}</span>
//                       </div>
//                     </div>
//                     <div className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(driver.status)}`}>
//                       {driver.status}
//                     </div>
//                   </div>

//                   <div className="space-y-1 text-sm">
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Car className="w-3 h-3" />
//                       <span>{driver.vehicle}</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Phone className="w-3 h-3" />
//                       <span>{driver.phone}</span>
//                     </div>

//                     {/* Enhanced driver info */}
//                     <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//                       <span>Battery: {Math.round(driver.batteryLevel)}%</span>
//                       <span>Trips: {driver.completedTrips}</span>
//                     </div>

//                     {driver.status === "active" && (
//                       <>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <MapPin className="w-3 h-3" />
//                           <span>To: {driver.destination}</span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <Clock className="w-3 h-3" />
//                           <span>ETA: {driver.eta}</span>
//                         </div>
//                         <div className="text-gray-600 dark:text-gray-400">
//                           <span>Passenger: {driver.passenger}</span>
//                         </div>
//                         <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
//                           <span>Trip: {driver.tripId}</span>
//                           <span>Speed: {Math.round(driver.speed)} km/h</span>
//                         </div>
//                       </>
//                     )}

//                     {driver.status === "emergency" && (
//                       <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded mt-2">
//                         <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-sm">
//                           <AlertTriangle className="w-4 h-4" />
//                           <span>Emergency Alert Active</span>
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleEmergencyResponse(driver._id)
//                           }}
//                           className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded text-xs transition-colors"
//                         >
//                           Respond to Emergency
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {driver.status === "active" && (
//                     <div className="mt-3 flex space-x-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setSelectedDriverForAction(driver)
//                           setShowTrackModal(true)
//                         }}
//                         className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-1 px-3 rounded text-xs transition-colors"
//                       >
//                         Track
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setSelectedDriverForAction(driver)
//                           setShowContactModal(true)
//                         }}
//                         className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded text-xs transition-colors"
//                       >
//                         Contact
//                       </button>
//                     </div>
//                   )}

//                   {/* Last update timestamp */}
//                   <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
//                     Last update: {new Date(driver.lastUpdate).toLocaleTimeString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Trip Statistics */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <Car className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.activeTrips}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <User className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.totalDrivers}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <Clock className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Avg ETA</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{Math.round(stats.avgETA) || 0} min</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <MapPin className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Coverage Area</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">25 km²</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Emergencies</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.emergencyCount}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Track Modal with Real-time Updates */}
//       {showTrackModal && selectedDriverForAction && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">
//                   Track Driver - {selectedDriverForAction.name}
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowTrackModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <XCircle className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Real-time Connection Status */}
//               <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 <div className="flex items-center space-x-2">
//                   <div
//                     className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                   ></div>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {isConnected ? "Real-time updates active" : "Offline mode"}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     Last update: {new Date(selectedDriverForAction.lastUpdate).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>

//               {/* Driver Info Card */}
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Driver</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.vehicle}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.passenger}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Trip ID</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.tripId}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Live Tracking Info */}
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="font-semibold">Live Tracking Active</span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                       <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Current Speed</span>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
//                       {Math.round(selectedDriverForAction.speed)} km/h
//                     </p>
//                   </div>

//                   <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
//                       <span className="text-sm font-semibold text-green-600 dark:text-green-400">ETA</span>
//                     </div>
//                     <p className="text-2xl font-bold text-green-800 dark:text-green-300">
//                       {selectedDriverForAction.eta}
//                     </p>
//                   </div>

//                   <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//                       <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Destination</span>
//                     </div>
//                     <p className="text-lg font-bold text-orange-800 dark:text-orange-300">
//                       {selectedDriverForAction.destination}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Route Progress */}
//                 <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
//                   <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Route Progress</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-800 dark:text-white">Picked up passenger</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           {new Date(Date.now() - 10 * 60000).toLocaleTimeString()}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-800 dark:text-white">En route to destination</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Current location</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination arrival</p>
//                         <p className="text-xs text-gray-400 dark:text-gray-500">
//                           Expected in {selectedDriverForAction.eta}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-3 pt-4">
//                   <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
//                     <Navigation className="w-4 h-4" />
//                     <span>Share Location</span>
//                   </button>
//                   <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
//                     <Phone className="w-4 h-4" />
//                     <span>Call Driver</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Contact Modal with Real-time Updates */}
//       {showContactModal && selectedDriverForAction && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contact Driver</h3>
//                 <button
//                   onClick={() => {
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <XCircle className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Real-time Status */}
//               <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <div
//                       className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                     ></div>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Status: {selectedDriverForAction.status}
//                     </span>
//                   </div>
//                   <span className="text-xs text-gray-500">
//                     {new Date(selectedDriverForAction.lastUpdate).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>

//               {/* Driver Info */}
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <User className="w-8 h-8 text-green-600 dark:text-green-400" />
//                 </div>
//                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDriverForAction.vehicle}</p>
//                 <div className="flex items-center justify-center space-x-1 mt-1">
//                   <span className="text-yellow-500">★</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {selectedDriverForAction.rating} rating
//                   </span>
//                 </div>
//               </div>

//               {/* Contact Options */}
//               <div className="space-y-3">
//                 <button
//                   onClick={() => {
//                     // Simulate phone call
//                     alert(`Calling ${selectedDriverForAction.name} at ${selectedDriverForAction.phone}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <Phone className="w-5 h-5" />
//                   <div className="text-left">
//                     <p className="font-semibold">Call Driver</p>
//                     <p className="text-sm opacity-90">{selectedDriverForAction.phone}</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => {
//                     // Simulate SMS
//                     alert(`Sending message to ${selectedDriverForAction.name}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <div className="w-5 h-5 flex items-center justify-center">
//                     <span className="text-sm font-bold">💬</span>
//                   </div>
//                   <div className="text-left">
//                     <p className="font-semibold">Send Message</p>
//                     <p className="text-sm opacity-90">Quick SMS to driver</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => {
//                     // Simulate emergency contact
//                     alert(`Emergency contact initiated for ${selectedDriverForAction.name}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <AlertTriangle className="w-5 h-5" />
//                   <div className="text-left">
//                     <p className="font-semibold">Emergency Contact</p>
//                     <p className="text-sm opacity-90">Priority communication</p>
//                   </div>
//                 </button>
//               </div>

//               {/* Quick Actions */}
//               <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Actions</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => {
//                       alert(`Sending location to ${selectedDriverForAction.name}`)
//                       setShowContactModal(false)
//                       setSelectedDriverForAction(null)
//                     }}
//                     className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
//                   >
//                     Share Location
//                   </button>
//                   <button
//                     onClick={() => {
//                       alert(`Requesting ETA update from ${selectedDriverForAction.name}`)
//                       setShowContactModal(false)
//                       setSelectedDriverForAction(null)
//                     }}
//                     className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
//                   >
//                     Request ETA
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// ------------------------------------tiyal code --------------------------------------------

// "use client"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import {
//   MapPin,
//   Navigation,
//   Clock,
//   User,
//   Phone,
//   Car,
//   Filter,
//   Search,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   Bell,
//   Settings,
//   Wifi,
//   WifiOff,
//   Locate,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react"
// import io from "socket.io-client"

// // Backend configuration
// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// // Mock theme context since we don't have the actual one
// const useTheme = () => ({ isDarkMode: false })

// export default function LiveTracking() {
//   const { isDarkMode } = useTheme()

//   // Socket and connection state
//   const [socket, setSocket] = useState(null)
//   const [isConnected, setIsConnected] = useState(false)

//   // Driver data from MongoDB
//   const [drivers, setDrivers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Map state
//   const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 })
//   const [mapZoom, setMapZoom] = useState(12)
//   const [selectedDriver, setSelectedDriver] = useState(null)

//   // UI state
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [isAutoRefresh, setIsAutoRefresh] = useState(true)
//   const [notifications, setNotifications] = useState([])
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [showTrackModal, setShowTrackModal] = useState(false)
//   const [showContactModal, setShowContactModal] = useState(false)
//   const [selectedDriverForAction, setSelectedDriverForAction] = useState(null)

//   // Initialize Socket.io connection
//   useEffect(() => {
//     const newSocket = io(BACKEND_URL, {
//       transports: ["websocket"],
//       upgrade: true,
//     })

//     newSocket.on("connect", () => {
//       console.log("🔌 Connected to backend:", newSocket.id)
//       setIsConnected(true)
//       setError(null)

//       // Request initial driver data
//       newSocket.emit("getLatestDrivers")
//     })

//     newSocket.on("disconnect", () => {
//       console.log("🔌 Disconnected from backend")
//       setIsConnected(false)
//     })

//     newSocket.on("connect_error", (error) => {
//       console.error("❌ Connection error:", error)
//       setError("Failed to connect to backend server")
//       setIsConnected(false)
//     })

//     // Listen for driver updates from MongoDB
//     newSocket.on("driversUpdate", (data) => {
//       if (data.success && data.data) {
//         console.log("📍 Drivers updated from MongoDB:", data.data.length)
//         setDrivers(data.data)
//         setLoading(false)

//         // Update selected driver if it exists
//         if (selectedDriver) {
//           const updatedSelectedDriver = data.data.find((d) => d._id === selectedDriver._id)
//           if (updatedSelectedDriver) {
//             setSelectedDriver(updatedSelectedDriver)
//           }
//         }

//         // Update selected driver for action if it exists
//         if (selectedDriverForAction) {
//           const updatedActionDriver = data.data.find((d) => d._id === selectedDriverForAction._id)
//           if (updatedActionDriver) {
//             setSelectedDriverForAction(updatedActionDriver)
//           }
//         }
//       }
//     })

//     // Listen for individual location updates
//     newSocket.on("locationUpdate", (data) => {
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? {
//                 ...driver,
//                 location: data.location,
//                 speed: data.speed,
//                 lastUpdate: new Date(data.timestamp),
//               }
//             : driver,
//         ),
//       )

//       // Update modals if they're open
//       if (selectedDriverForAction && selectedDriverForAction._id === data.driverId) {
//         setSelectedDriverForAction((prev) => ({
//           ...prev,
//           location: data.location,
//           speed: data.speed,
//           lastUpdate: new Date(data.timestamp),
//         }))
//       }
//     })

//     // Listen for emergency alerts
//     newSocket.on("emergencyAlert", (data) => {
//       console.log("🚨 Emergency Alert:", data)

//       const notification = {
//         id: Date.now(),
//         type: "warning",
//         message: data.message,
//         timestamp: new Date(data.timestamp),
//       }

//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])

//       // Update driver status
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? { ...driver, status: "emergency", lastUpdate: new Date(data.timestamp) }
//             : driver,
//         ),
//       )
//     })

//     // Listen for status changes
//     newSocket.on("driverStatusChanged", (data) => {
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? { ...driver, status: data.status, lastUpdate: new Date(data.timestamp) }
//             : driver,
//         ),
//       )

//       const notification = {
//         id: Date.now(),
//         type: "info",
//         message: `Driver ${data.driver.name} status changed to ${data.status}`,
//         timestamp: new Date(data.timestamp),
//       }

//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//     })

//     // Listen for trip assignments
//     newSocket.on("tripAssigned", (data) => {
//       setDrivers((prevDrivers) =>
//         prevDrivers.map((driver) =>
//           driver._id === data.driverId
//             ? {
//                 ...driver,
//                 status: "active",
//                 destination: data.tripDetails.destination,
//                 passenger: data.tripDetails.passenger,
//                 tripId: data.tripDetails.tripId,
//                 lastUpdate: new Date(data.timestamp),
//               }
//             : driver,
//         ),
//       )

//       const notification = {
//         id: Date.now(),
//         type: "info",
//         message: `Trip ${data.tripDetails.tripId} assigned to ${data.driver.name}`,
//         timestamp: new Date(data.timestamp),
//       }

//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//     })

//     setSocket(newSocket)

//     // Cleanup on unmount
//     return () => {
//       newSocket.close()
//     }
//   }, [])

//   // Fetch initial data from REST API as fallback
//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`${API_URL}/drivers`)
//         const data = await response.json()

//         if (data.success) {
//           setDrivers(data.data)
//           console.log("📊 Fetched drivers from REST API:", data.data.length)
//         } else {
//           throw new Error(data.message || "Failed to fetch drivers")
//         }
//       } catch (error) {
//         console.error("❌ Error fetching drivers:", error)
//         setError("Failed to load driver data")
//       } finally {
//         setLoading(false)
//       }
//     }

//     // Only fetch if socket is not connected
//     if (!isConnected) {
//       fetchDrivers()
//     }
//   }, [isConnected])

//   // Auto-refresh data every 30 seconds as backup
//   useEffect(() => {
//     if (!isAutoRefresh || !socket) return

//     const interval = setInterval(() => {
//       if (socket && isConnected) {
//         socket.emit("getLatestDrivers")
//       }
//     }, 30000) // 30 seconds

//     return () => clearInterval(interval)
//   }, [isAutoRefresh, socket, isConnected])

//   // Filter drivers based on search and status
//   const filteredDrivers = useMemo(() => {
//     return drivers.filter((driver) => {
//       const matchesSearch =
//         driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         driver.phone.includes(searchTerm)
//       const matchesStatus = statusFilter === "all" || driver.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//   }, [drivers, searchTerm, statusFilter])

//   // Statistics calculations
//   const stats = useMemo(() => {
//     const activeTrips = drivers.filter((d) => d.status === "active").length
//     const totalDrivers = drivers.length
//     const emergencyCount = drivers.filter((d) => d.status === "emergency").length
//     const etaValues = drivers.filter((d) => d.eta).map((d) => Number.parseInt(d.eta.replace(/\D/g, "")) || 0)
//     const avgETA = etaValues.length > 0 ? etaValues.reduce((acc, eta) => acc + eta, 0) / etaValues.length : 0

//     return { activeTrips, totalDrivers, emergencyCount, avgETA }
//   }, [drivers])

//   // Map utility functions
//   const latLngToPixel = useCallback(
//     (lat, lng, mapWidth, mapHeight) => {
//       // Karachi bounds
//       const bounds = {
//         north: 24.95,
//         south: 24.75,
//         east: 67.2,
//         west: 66.9,
//       }

//       // Calculate relative position within bounds
//       const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * mapWidth
//       const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * mapHeight

//       return {
//         x: Math.max(20, Math.min(mapWidth - 20, x)),
//         y: Math.max(20, Math.min(mapHeight - 20, y)),
//       }
//     },
//     [mapZoom],
//   )

//   const handleDriverClick = useCallback((driver) => {
//     setSelectedDriver(driver)
//     setMapCenter(driver.location)
//   }, [])

//   const handleEmergencyResponse = useCallback(
//     (driverId) => {
//       if (socket && isConnected) {
//         socket.emit("updateDriverStatus", { driverId, status: "active" })
//       }

//       const notification = {
//         id: Date.now(),
//         message: `Emergency response initiated for driver ID: ${driverId}`,
//         type: "info",
//         timestamp: new Date(),
//       }
//       setNotifications((prev) => [notification, ...prev.slice(0, 9)])
//     },
//     [socket, isConnected],
//   )

//   const handleRefresh = useCallback(() => {
//     if (socket && isConnected) {
//       socket.emit("getLatestDrivers")
//     } else {
//       // Fallback to REST API
//       window.location.reload()
//     }
//   }, [socket, isConnected])

//   const handleMapZoom = useCallback((direction) => {
//     setMapZoom((prev) => {
//       if (direction === "in") {
//         return Math.min(18, prev + 1)
//       } else {
//         return Math.max(8, prev - 1)
//       }
//     })
//   }, [])

//   const centerMapOnDrivers = useCallback(() => {
//     if (drivers.length > 0) {
//       const avgLat = drivers.reduce((sum, driver) => sum + driver.location.lat, 0) / drivers.length
//       const avgLng = drivers.reduce((sum, driver) => sum + driver.location.lng, 0) / drivers.length
//       setMapCenter({ lat: avgLat, lng: avgLng })
//     }
//   }, [drivers])

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "text-green-500 dark:text-green-400"
//       case "idle":
//         return "text-gray-500 dark:text-gray-400"
//       case "offline":
//         return "text-red-500 dark:text-red-400"
//       case "emergency":
//         return "text-orange-500 dark:text-orange-400"
//       default:
//         return "text-gray-500 dark:text-gray-400"
//     }
//   }

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
//       case "idle":
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//       case "offline":
//         return "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
//       case "emergency":
//         return "bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-orange-400"
//       default:
//         return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//     }
//   }

//   const getDriverMarkerColor = (status) => {
//     switch (status) {
//       case "active":
//         return "bg-green-500 border-green-600"
//       case "idle":
//         return "bg-gray-500 border-gray-600"
//       case "offline":
//         return "bg-red-500 border-red-600"
//       case "emergency":
//         return "bg-orange-500 border-orange-600"
//       default:
//         return "bg-gray-500 border-gray-600"
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600 dark:text-gray-400">Loading driver data from MongoDB...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
//       {/* Enhanced Header with Controls */}
//       <div className="p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <div className="flex items-center space-x-3 mb-2">
//               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Live Tracking</h2>
//               <div
//                 className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
//                   isConnected
//                     ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
//                     : "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
//                 }`}
//               >
//                 {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
//                 <span>{isConnected ? "Live" : "Offline"}</span>
//               </div>
//             </div>
//             <p className="text-gray-600 dark:text-gray-400">
//               Real-time tracking  • {drivers.length} drivers loaded
//             </p>
//           </div>

//           <div className="flex items-center space-x-3 mt-4 sm:mt-0">
//             {/* Auto-refresh toggle */}
//             <button
//               onClick={() => setIsAutoRefresh(!isAutoRefresh)}
//               className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
//                 isAutoRefresh
//                   ? "bg-green-100 dark:bg-green-700 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400"
//                   : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
//               }`}
//             >
//               <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? "animate-spin" : ""}`} />
//               <span className="text-sm">Auto Refresh</span>
//             </button>

//             {/* Manual Refresh */}
//             <button
//               onClick={handleRefresh}
//               className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" />
//               <span className="text-sm">Refresh</span>
//             </button>

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                 {notifications.length > 0 && (
//                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
//                   <div className="p-3 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="font-semibold text-gray-800 dark:text-white">Real-time Notifications</h3>
//                   </div>
//                   {notifications.length === 0 ? (
//                     <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
//                   ) : (
//                     <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {notifications.map((notification) => (
//                         <div key={notification.id} className="p-3">
//                           <div className="flex items-start space-x-2">
//                             {notification.type === "warning" && (
//                               <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
//                             )}
//                             {notification.type === "error" && <XCircle className="w-4 h-4 text-red-500 mt-0.5" />}
//                             {notification.type === "info" && <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />}
//                             <div className="flex-1">
//                               <p className="text-sm text-gray-800 dark:text-white">{notification.message}</p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                 {notification.timestamp.toLocaleTimeString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <XCircle className="w-5 h-5 text-red-500" />
//               <span className="text-red-700 dark:text-red-400">{error}</span>
//               <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
//                 <XCircle className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
//           {/* Enhanced Interactive Map */}
//           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
//             {/* Map Header */}
//             <div className="absolute top-4 left-4 z-20">
//               <div className="bg-white/95 dark:bg-gray-900/95 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-lg">
//                 <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm">
//                   <div
//                     className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                   ></div>
//                   <span>{isConnected ? "Live MongoDB Updates" : "MongoDB Offline"}</span>
//                 </div>
//                 <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   {filteredDrivers.length} drivers • Zoom: {mapZoom}
//                 </div>
//                 {stats.emergencyCount > 0 && (
//                   <div className="flex items-center space-x-2 text-orange-500 dark:text-orange-400 text-sm mt-1">
//                     <AlertTriangle className="w-3 h-3" />
//                     <span>
//                       {stats.emergencyCount} Emergency Alert{stats.emergencyCount > 1 ? "s" : ""}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Map Controls */}
//             <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
//               <button
//                 onClick={centerMapOnDrivers}
//                 className="bg-white/95 dark:bg-gray-900/95 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
//                 title="Center on all drivers"
//               >
//                 <Locate className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => handleMapZoom("in")}
//                 className="bg-white/95 dark:bg-gray-900/95 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
//                 title="Zoom in"
//               >
//                 <ZoomIn className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => handleMapZoom("out")}
//                 className="bg-white/95 dark:bg-gray-900/95 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
//                 title="Zoom out"
//               >
//                 <ZoomOut className="w-4 h-4" />
//               </button>
//               <button className="bg-white/95 dark:bg-gray-900/95 p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg">
//                 <Settings className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Enhanced Map Container */}
//             <div className="w-full h-full relative">
//               {/* Map Background */}
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
//                 {/* Street Grid Pattern */}
//                 <div className="absolute inset-0 opacity-20">
//                   <svg width="100%" height="100%" className="text-gray-400">
//                     <defs>
//                       <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
//                         <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
//                       </pattern>
//                     </defs>
//                     <rect width="100%" height="100%" fill="url(#grid)" />
//                   </svg>
//                 </div>

//                 {/* Major Roads */}
//                 <div className="absolute inset-0">
//                   <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
//                   <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
//                   <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
//                   <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
//                 </div>

//                 {/* Area Labels */}
//                 <div className="absolute top-1/4 left-1/4 text-xs text-gray-500 dark:text-gray-400 font-semibold bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
//                   Gulshan
//                 </div>
//                 <div className="absolute top-1/4 right-1/4 text-xs text-gray-500 dark:text-gray-400 font-semibold bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
//                   DHA
//                 </div>
//                 <div className="absolute bottom-1/4 left-1/4 text-xs text-gray-500 dark:text-gray-400 font-semibold bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
//                   Saddar
//                 </div>
//                 <div className="absolute bottom-1/4 right-1/4 text-xs text-gray-500 dark:text-gray-400 font-semibold bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
//                   Clifton
//                 </div>
//               </div>

//               {/* Driver Markers */}
//               <div className="absolute inset-0 z-10">
//                 {filteredDrivers.map((driver) => {
//                   const mapRect = { width: 800, height: 600 } // Approximate map dimensions
//                   const position = latLngToPixel(
//                     driver.location.lat,
//                     driver.location.lng,
//                     mapRect.width,
//                     mapRect.height,
//                   )

//                   return (
//                     <div
//                       key={driver._id}
//                       className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
//                         selectedDriver?._id === driver._id ? "scale-125 z-20" : "hover:scale-110"
//                       }`}
//                       style={{
//                         left: `${(position.x / mapRect.width) * 100}%`,
//                         top: `${(position.y / mapRect.height) * 100}%`,
//                       }}
//                       onClick={() => handleDriverClick(driver)}
//                     >
//                       {/* Driver Marker */}
//                       <div className="relative">
//                         {/* Pulse Animation for Active Drivers */}
//                         {driver.status === "active" && (
//                           <div
//                             className={`absolute inset-0 rounded-full animate-ping ${getDriverMarkerColor(
//                               driver.status,
//                             )} opacity-75`}
//                           ></div>
//                         )}

//                         {/* Emergency Pulse */}
//                         {driver.status === "emergency" && (
//                           <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75"></div>
//                         )}

//                         {/* Main Marker */}
//                         <div
//                           className={`relative w-8 h-8 rounded-full border-2 ${getDriverMarkerColor(
//                             driver.status,
//                           )} shadow-lg flex items-center justify-center`}
//                         >
//                           <Car className="w-4 h-4 text-white" />

//                           {/* Status Indicator */}
//                           <div
//                             className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
//                               driver.status === "active"
//                                 ? "bg-green-400 animate-pulse"
//                                 : driver.status === "emergency"
//                                   ? "bg-red-500 animate-pulse"
//                                   : driver.status === "offline"
//                                     ? "bg-red-500"
//                                     : "bg-gray-400"
//                             }`}
//                           ></div>
//                         </div>

//                         {/* Driver Info Tooltip */}
//                         <div
//                           className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-200 ${
//                             selectedDriver?._id === driver._id ? "opacity-100 visible" : "opacity-0 invisible"
//                           }`}
//                         >
//                           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg min-w-48">
//                             <div className="text-sm font-semibold text-gray-800 dark:text-white">{driver.name}</div>
//                             <div className="text-xs text-gray-600 dark:text-gray-400">{driver.vehicle}</div>
//                             {driver.status === "active" && (
//                               <>
//                                 <div className="text-xs text-green-600 dark:text-green-400 mt-1">
//                                   To: {driver.destination}
//                                 </div>
//                                 <div className="text-xs text-blue-600 dark:text-blue-400">
//                                   Speed: {Math.round(driver.speed)} km/h
//                                 </div>
//                               </>
//                             )}
//                             <div className={`text-xs mt-1 px-2 py-1 rounded ${getStatusBgColor(driver.status)}`}>
//                               {driver.status}
//                             </div>
//                           </div>
//                           {/* Tooltip Arrow */}
//                           <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
//                         </div>

//                         {/* Speed Indicator for Active Drivers */}
//                         {driver.status === "active" && (
//                           <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
//                             {Math.round(driver.speed)} km/h
//                           </div>
//                         )}

//                         {/* Driver Name Label */}
//                         <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/90 dark:bg-gray-800/90 text-xs px-2 py-1 rounded border text-gray-800 dark:text-white whitespace-nowrap">
//                           {driver.name}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>

//               {/* Map Legend */}
//               <div className="absolute bottom-4 left-4 z-20">
//                 <div className="bg-white/95 dark:bg-gray-900/95 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-lg">
//                   <h4 className="text-xs font-semibold text-gray-800 dark:text-white mb-2">Driver Status</h4>
//                   <div className="space-y-1">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                       <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 rounded-full bg-gray-500"></div>
//                       <span className="text-xs text-gray-600 dark:text-gray-400">Idle</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                       <span className="text-xs text-gray-600 dark:text-gray-400">Offline</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
//                       <span className="text-xs text-gray-600 dark:text-gray-400">Emergency</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Enhanced Driver List */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Drivers</h3>
//               <div className="flex items-center space-x-2">
//                 <div
//                   className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                 ></div>
//                 <span className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
//                   {stats.activeTrips} Active
//                 </span>
//               </div>
//             </div>

//             {/* Search and Filter */}
//             <div className="space-y-3 mb-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search drivers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="flex-1 py-2 px-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="idle">Idle</option>
//                   <option value="offline">Offline</option>
//                   <option value="emergency">Emergency</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
//               {filteredDrivers.map((driver) => (
//                 <div
//                   key={driver._id}
//                   className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
//                     selectedDriver?._id === driver._id
//                       ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-400/10"
//                       : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
//                   } ${driver.status === "emergency" ? "ring-2 ring-orange-500 dark:ring-orange-400" : ""}`}
//                   onClick={() => handleDriverClick(driver)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center space-x-2">
//                       <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                       <span className="text-gray-800 dark:text-white font-medium">{driver.name}</span>
//                       <div className="flex items-center space-x-1">
//                         <span className="text-yellow-500">★</span>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">{driver.rating}</span>
//                       </div>
//                     </div>
//                     <div className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(driver.status)}`}>
//                       {driver.status}
//                     </div>
//                   </div>

//                   <div className="space-y-1 text-sm">
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Car className="w-3 h-3" />
//                       <span>{driver.vehicle}</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
//                       <Phone className="w-3 h-3" />
//                       <span>{driver.phone}</span>
//                     </div>

//                     {/* Enhanced driver info */}
//                     <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//                       <span>Battery: {Math.round(driver.batteryLevel)}%</span>
//                       <span>Trips: {driver.completedTrips}</span>
//                     </div>

//                     {driver.status === "active" && (
//                       <>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <MapPin className="w-3 h-3" />
//                           <span>To: {driver.destination}</span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                           <Clock className="w-3 h-3" />
//                           <span>ETA: {driver.eta}</span>
//                         </div>
//                         <div className="text-gray-600 dark:text-gray-400">
//                           <span>Passenger: {driver.passenger}</span>
//                         </div>
//                         <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
//                           <span>Trip: {driver.tripId}</span>
//                           <span>Speed: {Math.round(driver.speed)} km/h</span>
//                         </div>
//                       </>
//                     )}

//                     {driver.status === "emergency" && (
//                       <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded mt-2">
//                         <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 text-sm">
//                           <AlertTriangle className="w-4 h-4" />
//                           <span>Emergency Alert Active</span>
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleEmergencyResponse(driver._id)
//                           }}
//                           className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded text-xs transition-colors"
//                         >
//                           Respond to Emergency
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {driver.status === "active" && (
//                     <div className="mt-3 flex space-x-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setSelectedDriverForAction(driver)
//                           setShowTrackModal(true)
//                         }}
//                         className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-1 px-3 rounded text-xs transition-colors"
//                       >
//                         Track
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setSelectedDriverForAction(driver)
//                           setShowContactModal(true)
//                         }}
//                         className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded text-xs transition-colors"
//                       >
//                         Contact
//                       </button>
//                     </div>
//                   )}

//                   {/* Last update timestamp */}
//                   <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
//                     Last update: {new Date(driver.lastUpdate).toLocaleTimeString()}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Trip Statistics */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <Car className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.activeTrips}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <User className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.totalDrivers}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <Clock className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Avg ETA</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{Math.round(stats.avgETA) || 0} min</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <MapPin className="w-5 h-5 text-green-500 dark:text-green-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Coverage Area</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">25 km²</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center space-x-2">
//               <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
//               <div>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">Emergencies</p>
//                 <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.emergencyCount}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Track Modal with Real-time Updates */}
//       {showTrackModal && selectedDriverForAction && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">
//                   Track Driver - {selectedDriverForAction.name}
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowTrackModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <XCircle className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Real-time Connection Status */}
//               <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 <div className="flex items-center space-x-2">
//                   <div
//                     className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                   ></div>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {isConnected ? "Real-time updates active" : "Offline mode"}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     Last update: {new Date(selectedDriverForAction.lastUpdate).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>

//               {/* Driver Info Card */}
//               <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Driver</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.vehicle}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.passenger}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Trip ID</p>
//                     <p className="font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.tripId}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Live Tracking Info */}
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
//                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="font-semibold">Live Tracking Active</span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                       <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Current Speed</span>
//                     </div>
//                     <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
//                       {Math.round(selectedDriverForAction.speed)} km/h
//                     </p>
//                   </div>

//                   <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
//                       <span className="text-sm font-semibold text-green-600 dark:text-green-400">ETA</span>
//                     </div>
//                     <p className="text-2xl font-bold text-green-800 dark:text-green-300">
//                       {selectedDriverForAction.eta}
//                     </p>
//                   </div>

//                   <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//                       <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Destination</span>
//                     </div>
//                     <p className="text-lg font-bold text-orange-800 dark:text-orange-300">
//                       {selectedDriverForAction.destination}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Route Progress */}
//                 <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
//                   <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Route Progress</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-800 dark:text-white">Picked up passenger</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           {new Date(Date.now() - 10 * 60000).toLocaleTimeString()}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-800 dark:text-white">En route to destination</p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">Current location</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination arrival</p>
//                         <p className="text-xs text-gray-400 dark:text-gray-500">
//                           Expected in {selectedDriverForAction.eta}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-3 pt-4">
//                   <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
//                     <Navigation className="w-4 h-4" />
//                     <span>Share Location</span>
//                   </button>
//                   <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
//                     <Phone className="w-4 h-4" />
//                     <span>Call Driver</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Contact Modal with Real-time Updates */}
//       {showContactModal && selectedDriverForAction && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-800 dark:text-white">Contact Driver</h3>
//                 <button
//                   onClick={() => {
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <XCircle className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               {/* Real-time Status */}
//               <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <div
//                       className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//                     ></div>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Status: {selectedDriverForAction.status}
//                     </span>
//                   </div>
//                   <span className="text-xs text-gray-500">
//                     {new Date(selectedDriverForAction.lastUpdate).toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>

//               {/* Driver Info */}
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <User className="w-8 h-8 text-green-600 dark:text-green-400" />
//                 </div>
//                 <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedDriverForAction.name}</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDriverForAction.vehicle}</p>
//                 <div className="flex items-center justify-center space-x-1 mt-1">
//                   <span className="text-yellow-500">★</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {selectedDriverForAction.rating} rating
//                   </span>
//                 </div>
//               </div>

//               {/* Contact Options */}
//               <div className="space-y-3">
//                 <button
//                   onClick={() => {
//                     // Simulate phone call
//                     alert(`Calling ${selectedDriverForAction.name} at ${selectedDriverForAction.phone}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <Phone className="w-5 h-5" />
//                   <div className="text-left">
//                     <p className="font-semibold">Call Driver</p>
//                     <p className="text-sm opacity-90">{selectedDriverForAction.phone}</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => {
//                     // Simulate SMS
//                     alert(`Sending message to ${selectedDriverForAction.name}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <div className="w-5 h-5 flex items-center justify-center">
//                     <span className="text-sm font-bold">💬</span>
//                   </div>
//                   <div className="text-left">
//                     <p className="font-semibold">Send Message</p>
//                     <p className="text-sm opacity-90">Quick SMS to driver</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => {
//                     // Simulate emergency contact
//                     alert(`Emergency contact initiated for ${selectedDriverForAction.name}`)
//                     setShowContactModal(false)
//                     setSelectedDriverForAction(null)
//                   }}
//                   className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3"
//                 >
//                   <AlertTriangle className="w-5 h-5" />
//                   <div className="text-left">
//                     <p className="font-semibold">Emergency Contact</p>
//                     <p className="text-sm opacity-90">Priority communication</p>
//                   </div>
//                 </button>
//               </div>

//               {/* Quick Actions */}
//               <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Actions</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => {
//                       alert(`Sending location to ${selectedDriverForAction.name}`)
//                       setShowContactModal(false)
//                       setSelectedDriverForAction(null)
//                     }}
//                     className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
//                   >
//                     Share Location
//                   </button>
//                   <button
//                     onClick={() => {
//                       alert(`Requesting ETA update from ${selectedDriverForAction.name}`)
//                       setShowContactModal(false)
//                       setSelectedDriverForAction(null)
//                     }}
//                     className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition-colors text-sm"
//                   >
//                     Request ETA
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


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
  Wifi,
  WifiOff,
  Locate,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

// Backend configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Mock theme context since we don't have the actual one
const useTheme = () => ({ isDarkMode: false })

export default function LiveTracking() {
  const { isDarkMode } = useTheme()

  // Socket and connection state
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  // Driver data from MongoDB
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 })
  const [mapZoom, setMapZoom] = useState(12)
  const [selectedDriver, setSelectedDriver] = useState(null)

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedDriverForAction, setSelectedDriverForAction] = useState(null)

  // Enhanced mock driver data with distributed locations across Karachi
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
    },
    {
      _id: "5",
      name: "Rohit Gupta",
      vehicle: "Hyundai Verna - KA 05 GH 3456",
      phone: "+91 98765 43214",
      status: "active",
      location: { lat: 24.87, lng: 67.05 }, // DHA Phase 1
      destination: "Bandra West",
      passenger: "Priya Singh",
      tripId: "TRP642848",
      speed: 38,
      eta: "32 mins",
      rating: 4.7,
      batteryLevel: 78,
      completedTrips: 134,
      lastUpdate: new Date(),
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
    },
    {
      _id: "8",
      name: "Pooja Kumari",
      vehicle: "Mahindra XUV300 - DL 08 MN 8901",
      phone: "+91 98765 43217",
      status: "active",
      location: { lat: 24.83, lng: 67.08 }, // Korangi
      destination: "Powai",
      passenger: "Amit Patel",
      tripId: "TRP642849",
      speed: 52,
      eta: "28 mins",
      rating: 4.9,
      batteryLevel: 91,
      completedTrips: 245,
      lastUpdate: new Date(),
    },
    {
      _id: "9",
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
    },
  ]

  // Initialize Socket.io connection
  useEffect(() => {
    // For demo purposes, use mock data
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

  // Improved map utility functions with better distribution
  const latLngToPixel = useCallback(
    (lat, lng, mapWidth, mapHeight) => {
      // Karachi bounds - more accurate boundaries
      const bounds = {
        north: 24.95,
        south: 24.75,
        east: 67.15,
        west: 66.85,
      }

      // Calculate relative position within bounds with better scaling
      const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * (mapWidth - 60) + 30
      const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * (mapHeight - 60) + 30

      return {
        x: Math.max(30, Math.min(mapWidth - 30, x)),
        y: Math.max(30, Math.min(mapHeight - 30, y)),
      }
    },
    [mapZoom],
  )

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
    // Simulate refresh
    setDrivers(mockDriversData)
  }, [])

  const handleMapZoom = useCallback((direction) => {
    setMapZoom((prev) => {
      if (direction === "in") {
        return Math.min(18, prev + 1)
      } else {
        return Math.max(8, prev - 1)
      }
    })
  }, [])

  const centerMapOnDrivers = useCallback(() => {
    if (drivers.length > 0) {
      const avgLat = drivers.reduce((sum, driver) => sum + driver.location.lat, 0) / drivers.length
      const avgLng = drivers.reduce((sum, driver) => sum + driver.location.lng, 0) / drivers.length
      setMapCenter({ lat: avgLat, lng: avgLng })
    }
  }, [drivers])

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
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading driver data from MongoDB...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Header with Controls */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Live Tracking</h2>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  isConnected
                    ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
                }`}
              >
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isConnected ? "Live" : "Offline"}</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Real-time tracking • {drivers.length} drivers loaded</p>
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

            {/* Manual Refresh */}
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
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
                    <h3 className="font-semibold text-gray-800 dark:text-white">Real-time Notifications</h3>
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

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Enhanced Interactive Map with Better Distribution */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden shadow-lg">
            {/* Map Header */}
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  ></div>
                  <span>{isConnected ? "Live MongoDB Updates" : "MongoDB Offline"}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {filteredDrivers.length} drivers • Zoom: {mapZoom}
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

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
              <button
                onClick={centerMapOnDrivers}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
                title="Center on all drivers"
              >
                <Locate className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMapZoom("in")}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMapZoom("out")}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-2 rounded-lg text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-lg">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Enhanced Map Container with Better Visual Design */}
            <div className="w-full h-full relative">
              {/* Improved Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                {/* Enhanced Street Grid Pattern */}
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

                {/* Major Roads with Better Styling */}
                <div className="absolute inset-0">
                  {/* Horizontal Roads */}
                  <div className="absolute top-1/4 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-gray-600 opacity-60 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-gray-500 to-transparent dark:via-gray-500 opacity-70 rounded-full"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-gray-600 opacity-60 rounded-full"></div>

                  {/* Vertical Roads */}
                  <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gradient-to-b from-transparent via-gray-400 to-transparent dark:via-gray-600 opacity-60 rounded-full"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-gradient-to-b from-transparent via-gray-500 to-transparent dark:via-gray-500 opacity-70 rounded-full"></div>
                  <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gradient-to-b from-transparent via-gray-400 to-transparent dark:via-gray-600 opacity-60 rounded-full"></div>
                </div>

                {/* Enhanced Area Labels with Better Positioning */}
                <div className="absolute top-[15%] left-[20%] text-sm text-gray-600 dark:text-gray-400 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Gulshan
                </div>
                <div className="absolute top-[15%] right-[20%] text-sm text-gray-600 dark:text-gray-400 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  DHA
                </div>
                <div className="absolute bottom-[25%] left-[15%] text-sm text-gray-600 dark:text-gray-400 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Saddar
                </div>
                <div className="absolute bottom-[25%] right-[15%] text-sm text-gray-600 dark:text-gray-400 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Clifton
                </div>
                <div className="absolute top-[35%] left-[45%] text-sm text-gray-600 dark:text-gray-400 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Defence
                </div>
                <div className="absolute top-[60%] right-[25%] text-sm text-gray-600 dark:text-gray-400 font-semibold bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  Korangi
                </div>
              </div>

              {/* Driver Markers with Improved Distribution */}
              <div className="absolute inset-0 z-10">
                {filteredDrivers.map((driver) => {
                  const mapRect = { width: 1000, height: 700 } // Better map dimensions
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
                      {/* Driver Marker with Enhanced Styling */}
                      <div className="relative">
                        {/* Pulse Animation for Active Drivers */}
                        {driver.status === "active" && (
                          <div
                            className={`absolute inset-0 rounded-full animate-ping ${getDriverMarkerColor(
                              driver.status,
                            )} opacity-75`}
                          ></div>
                        )}

                        {/* Emergency Pulse */}
                        {driver.status === "emergency" && (
                          <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75"></div>
                        )}

                        {/* Main Marker with Enhanced Shadow */}
                        <div
                          className={`relative w-10 h-10 rounded-full border-3 ${getDriverMarkerColor(
                            driver.status,
                          )} shadow-lg flex items-center justify-center backdrop-blur-sm`}
                        >
                          <Car className="w-5 h-5 text-white drop-shadow-sm" />

                          {/* Status Indicator */}
                          <div
                            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              driver.status === "active"
                                ? "bg-green-400 animate-pulse"
                                : driver.status === "emergency"
                                  ? "bg-red-500 animate-pulse"
                                  : driver.status === "offline"
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                            } shadow-sm`}
                          ></div>
                        </div>

                        {/* Driver Info Tooltip */}
                        <div
                          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-200 ${
                            selectedDriver?._id === driver._id ? "opacity-100 visible" : "opacity-0 invisible"
                          }`}
                        >
                          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-xl min-w-52">
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{driver.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{driver.vehicle}</div>
                            {driver.status === "active" && (
                              <>
                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                  To: {driver.destination}
                                </div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  Speed: {Math.round(driver.speed)} km/h
                                </div>
                              </>
                            )}
                            <div
                              className={`text-xs mt-2 px-2 py-1 rounded-full text-center ${getStatusBgColor(driver.status)}`}
                            >
                              {driver.status.toUpperCase()}
                            </div>
                          </div>
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95 dark:border-t-gray-800/95"></div>
                        </div>

                        {/* Speed Indicator for Active Drivers */}
                        {driver.status === "active" && (
                          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-lg">
                            {Math.round(driver.speed)} km/h
                          </div>
                        )}

                        {/* Driver Name Label */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white whitespace-nowrap shadow-sm">
                          {driver.name.split(" ")[0]}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Enhanced Map Legend */}
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Driver Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active ({drivers.filter((d) => d.status === "active").length})
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-gray-500 shadow-sm"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Idle ({drivers.filter((d) => d.status === "idle").length})
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Offline ({drivers.filter((d) => d.status === "offline").length})
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse shadow-sm"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Emergency ({drivers.filter((d) => d.status === "emergency").length})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Driver List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Drivers</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                ></div>
                <span className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
                  {stats.activeTrips} Active
                </span>
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
                  key={driver._id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedDriver?._id === driver._id
                      ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-400/10 shadow-md"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm"
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
                    Last update: {new Date(driver.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Trip Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.activeTrips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">{stats.totalDrivers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Avg ETA</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">{Math.round(stats.avgETA) || 103} min</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-500 dark:text-green-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Coverage Area</p>
                <p className="text-gray-800 dark:text-white text-xl font-bold">25 km²</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
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

      {/* Track Modal with Real-time Updates */}
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

              {/* Real-time Connection Status */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isConnected ? "Real-time updates active" : "Offline mode"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Last update: {new Date(selectedDriverForAction.lastUpdate).toLocaleTimeString()}
                  </span>
                </div>
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

      {/* Contact Modal with Real-time Updates */}
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

              {/* Real-time Status */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status: {selectedDriverForAction.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedDriverForAction.lastUpdate).toLocaleTimeString()}
                  </span>
                </div>
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
