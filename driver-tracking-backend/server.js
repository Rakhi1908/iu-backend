const express = require("express")
const http = require("http")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const driverRoutes = require("./routes/driverRoutes")
const socketHandler = require("./socket/socketHandler")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const server = http.createServer(app)

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Routes
app.use("/api", driverRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Driver Tracking Backend is running",
    timestamp: new Date().toISOString(),
  })
})

// Initialize Socket.io
socketHandler(server)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
  console.log(`🔌 Socket.io ready for connections`)
})
