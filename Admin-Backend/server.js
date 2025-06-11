
// const express = require("express")
// const dotenv = require("dotenv")
// const cors = require("cors")
// const connectDB = require("./config/db")
// const adminRoutes = require("./routes/adminRoutes")

// // Load environment variables
// dotenv.config()

// // Connect to MongoDB
// connectDB()

// const app = express()

// // Middleware
// app.use(cors())
// app.use(express.json())

// // Routes
// app.use("/api/admins", adminRoutes)

// // Test route
// app.get("/", (req, res) => {
//   res.send("API is running...")
// })

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   })
// })

// // Error handler
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode
//   res.status(statusCode).json({
//     success: false,
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   })
// })

// // Start server
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
//   console.log(`API available at: http://localhost:${PORT}/api/admins`)
// })


const express = require("express")
const http = require("http")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const adminRoutes = require("./routes/adminRoutes")
const { initializeSocket } = require("./socket/socketManager")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const server = http.createServer(app)

// Initialize Socket.io
const io = initializeSocket(server)

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Make io available to routes
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use("/api/admins", adminRoutes)

// Test route
app.get("/", (req, res) => {
  res.send("API is running with Socket.io...")
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API available at: http://localhost:${PORT}/api/admins`)
  console.log(`Socket.io initialized and ready for real-time updates`)
})
