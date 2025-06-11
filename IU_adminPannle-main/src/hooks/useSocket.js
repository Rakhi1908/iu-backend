"use client"

import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

const SOCKET_URL = "http://localhost:5000"

export const useSocket = () => {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 20000,
    })

    const socket = socketRef.current

    // Connection event handlers
    socket.on("connect", () => {
      console.log("🔌 Connected to server:", socket.id)
      setIsConnected(true)
      setConnectionError(null)

      // Join admin management room
      socket.emit("join-room", "admin-management")
    })

    socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected from server:", reason)
      setIsConnected(false)
    })

    socket.on("connect_error", (error) => {
      console.error("🔌 Connection error:", error)
      setConnectionError(error.message)
      setIsConnected(false)
    })

    socket.on("connected", (data) => {
      console.log("🎉 Welcome message:", data)
    })

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  // Subscribe to events
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  // Unsubscribe from events
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  // Emit events
  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    on,
    off,
    emit,
  }
}

// Custom hook for admin-specific events
export const useAdminSocket = (onAdminEvent) => {
  const { socket, isConnected, connectionError, on, off } = useSocket()

  useEffect(() => {
    if (!socket || !onAdminEvent) return

    // Admin event handlers
    const handleAdminCreated = (data) => {
      console.log("👤 Admin created:", data)
      onAdminEvent("created", data)
    }

    const handleAdminUpdated = (data) => {
      console.log("✏️ Admin updated:", data)
      onAdminEvent("updated", data)
    }

    const handleAdminDeleted = (data) => {
      console.log("🗑️ Admin deleted:", data)
      onAdminEvent("deleted", data)
    }

    const handleAdminStatusChanged = (data) => {
      console.log("🔄 Admin status changed:", data)
      onAdminEvent("status-changed", data)
    }

    // Subscribe to events
    on("admin:created", handleAdminCreated)
    on("admin:updated", handleAdminUpdated)
    on("admin:deleted", handleAdminDeleted)
    on("admin:status-changed", handleAdminStatusChanged)

    // Cleanup
    return () => {
      off("admin:created", handleAdminCreated)
      off("admin:updated", handleAdminUpdated)
      off("admin:deleted", handleAdminDeleted)
      off("admin:status-changed", handleAdminStatusChanged)
    }
  }, [socket, onAdminEvent, on, off])

  return {
    socket,
    isConnected,
    connectionError,
  }
}
