"use client"

import { useEffect, useState, useCallback } from "react"
import io from "socket.io-client"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(BACKEND_URL, {
      transports: ["websocket"],
      upgrade: true,
    })

    newSocket.on("connect", () => {
      console.log("🔌 Connected to backend:", newSocket.id)
      setIsConnected(true)

      // Request initial driver data
      newSocket.emit("getLatestDrivers")
    })

    newSocket.on("disconnect", () => {
      console.log("🔌 Disconnected from backend")
      setIsConnected(false)
    })

    // Listen for driver updates
    newSocket.on("driversUpdate", (data) => {
      if (data.success) {
        setDrivers(data.data)
        console.log("📍 Drivers updated:", data.data.length)
      }
    })

    // Listen for individual location updates
    newSocket.on("locationUpdate", (data) => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver._id === data.driverId
            ? { ...driver, location: data.location, speed: data.speed, lastUpdate: new Date() }
            : driver,
        ),
      )
    })

    // Listen for emergency alerts
    newSocket.on("emergencyAlert", (data) => {
      console.log("🚨 Emergency Alert:", data)

      const notification = {
        id: Date.now(),
        type: "emergency",
        message: data.message,
        driver: data.driver,
        timestamp: new Date(data.timestamp),
        priority: "high",
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 9)])

      // Update driver status
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => (driver._id === data.driverId ? { ...driver, status: "emergency" } : driver)),
      )
    })

    // Listen for status changes
    newSocket.on("driverStatusChanged", (data) => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver._id === data.driverId ? { ...driver, status: data.status, lastUpdate: new Date() } : driver,
        ),
      )

      const notification = {
        id: Date.now(),
        type: "info",
        message: `Driver ${data.driver.name} status changed to ${data.status}`,
        timestamp: new Date(),
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 9)])
    })

    // Listen for trip assignments
    newSocket.on("tripAssigned", (data) => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver._id === data.driverId
            ? {
                ...driver,
                status: "active",
                destination: data.tripDetails.destination,
                passenger: data.tripDetails.passenger,
                tripId: data.tripDetails.tripId,
              }
            : driver,
        ),
      )

      const notification = {
        id: Date.now(),
        type: "success",
        message: `Trip ${data.tripDetails.tripId} assigned to ${data.driver.name}`,
        timestamp: new Date(),
      }

      setNotifications((prev) => [notification, ...prev.slice(0, 9)])
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.close()
    }
  }, [])

  // Socket methods
  const updateDriverStatus = useCallback(
    (driverId, status) => {
      if (socket) {
        socket.emit("updateDriverStatus", { driverId, status })
      }
    },
    [socket],
  )

  const sendEmergencyAlert = useCallback(
    (driverId, message) => {
      if (socket) {
        socket.emit("emergencyAlert", { driverId, message })
      }
    },
    [socket],
  )

  const updateLocation = useCallback(
    (driverId, lat, lng, speed) => {
      if (socket) {
        socket.emit("updateLocation", { driverId, lat, lng, speed })
      }
    },
    [socket],
  )

  const assignTrip = useCallback(
    (driverId, destination, passenger, tripId) => {
      if (socket) {
        socket.emit("assignTrip", { driverId, destination, passenger, tripId })
      }
    },
    [socket],
  )

  const refreshDrivers = useCallback(() => {
    if (socket) {
      socket.emit("getLatestDrivers")
    }
  }, [socket])

  return {
    socket,
    isConnected,
    drivers,
    notifications,
    updateDriverStatus,
    sendEmergencyAlert,
    updateLocation,
    assignTrip,
    refreshDrivers,
    setNotifications,
  }
}
