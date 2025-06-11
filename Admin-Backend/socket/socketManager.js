const socketIo = require("socket.io")

let io

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  })

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`)

    // Join admin management room
    socket.join("admin-management")
    console.log(`📋 Socket ${socket.id} joined admin-management room`)

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`🔌 User disconnected: ${socket.id}`)
    })

    // Handle custom room joining
    socket.on("join-room", (room) => {
      socket.join(room)
      console.log(`🏠 Socket ${socket.id} joined room: ${room}`)
    })

    // Send welcome message
    socket.emit("connected", {
      message: "Connected to admin management system",
      timestamp: new Date().toISOString(),
    })
  })

  return io
}

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!")
  }
  return io
}

// Emit events to specific rooms
const emitToRoom = (room, event, data) => {
  if (io) {
    console.log(`📡 Emitting ${event} to room ${room}:`, data)
    io.to(room).emit(event, data)
  }
}

// Emit admin-specific events
const emitAdminEvent = (event, data) => {
  emitToRoom("admin-management", event, {
    ...data,
    timestamp: new Date().toISOString(),
  })
}

module.exports = {
  initializeSocket,
  getIO,
  emitToRoom,
  emitAdminEvent,
}
