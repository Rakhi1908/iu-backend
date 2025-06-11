const { Server } = require("socket.io")
const Driver = require("../models/driverModel")
const { initializeSampleDrivers } = require("../controllers/driverController")
const {
  simulateMovement,
  simulateBatteryDrain,
  generateETA,
  calculateDistance,
  getRandomDestination,
  getRandomPassenger,
} = require("../utils/locationSimulator")

let io
let updateInterval

const socketHandler = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    // Send initial driver data
    socket.on("getLatestDrivers", async () => {
      try {
        const drivers = await Driver.find().sort({ lastUpdate: -1 })
        socket.emit("driversUpdate", {
          success: true,
          data: drivers,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error fetching drivers for socket:", error)
        socket.emit("error", {
          message: "Failed to fetch driver data",
          error: error.message,
        })
      }
    })

    // Handle driver status updates from client
    socket.on("updateDriverStatus", async (data) => {
      try {
        const { driverId, status } = data
        const driver = await Driver.findByIdAndUpdate(driverId, { status, lastUpdate: new Date() }, { new: true })

        if (driver) {
          // Broadcast the update to all clients
          io.emit("driverStatusChanged", {
            driverId,
            status,
            driver,
            timestamp: new Date().toISOString(),
          })

          socket.emit("statusUpdateSuccess", {
            message: `Driver ${driver.name} status updated to ${status}`,
            driver,
          })
        }
      } catch (error) {
        console.error("Error updating driver status:", error)
        socket.emit("error", {
          message: "Failed to update driver status",
          error: error.message,
        })
      }
    })

    // Handle emergency alerts
    socket.on("emergencyAlert", async (data) => {
      try {
        const { driverId, message } = data
        const driver = await Driver.findByIdAndUpdate(
          driverId,
          { status: "emergency", lastUpdate: new Date() },
          { new: true },
        )

        if (driver) {
          // Broadcast emergency alert to all clients
          io.emit("emergencyAlert", {
            driverId,
            driver,
            message: message || `Emergency alert from ${driver.name}`,
            timestamp: new Date().toISOString(),
            priority: "high",
          })

          console.log(`🚨 Emergency alert from driver ${driver.name} (${driverId})`)
        }
      } catch (error) {
        console.error("Error handling emergency alert:", error)
        socket.emit("error", {
          message: "Failed to process emergency alert",
          error: error.message,
        })
      }
    })

    // Handle location updates from driver apps
    socket.on("updateLocation", async (data) => {
      try {
        const { driverId, lat, lng, speed } = data
        const driver = await Driver.findById(driverId)

        if (driver) {
          await driver.updateLocation(lat, lng, speed)

          // Broadcast location update to all clients
          io.emit("locationUpdate", {
            driverId,
            location: { lat, lng },
            speed,
            timestamp: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Error updating location:", error)
        socket.emit("error", {
          message: "Failed to update location",
          error: error.message,
        })
      }
    })

    // Handle trip assignments
    socket.on("assignTrip", async (data) => {
      try {
        const { driverId, destination, passenger, tripId } = data

        const driver = await Driver.findByIdAndUpdate(
          driverId,
          {
            status: "active",
            destination,
            passenger,
            tripId,
            eta: generateETA(5, 40), // Assume 5km average distance
            lastUpdate: new Date(),
          },
          { new: true },
        )

        if (driver) {
          io.emit("tripAssigned", {
            driverId,
            driver,
            tripDetails: { destination, passenger, tripId },
            timestamp: new Date().toISOString(),
          })

          socket.emit("tripAssignmentSuccess", {
            message: `Trip ${tripId} assigned to ${driver.name}`,
            driver,
          })
        }
      } catch (error) {
        console.error("Error assigning trip:", error)
        socket.emit("error", {
          message: "Failed to assign trip",
          error: error.message,
        })
      }
    })

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`)
    })
  })

  // Initialize sample drivers and start simulation
  initializeAndStartSimulation()

  return io
}

const initializeAndStartSimulation = async () => {
  try {
    // Initialize sample drivers if none exist
    await initializeSampleDrivers()

    // Start real-time simulation
    startLocationSimulation()

    console.log("🎯 Real-time driver simulation started")
  } catch (error) {
    console.error("❌ Error initializing simulation:", error)
  }
}

const startLocationSimulation = () => {
  // Clear any existing interval
  if (updateInterval) {
    clearInterval(updateInterval)
  }

  updateInterval = setInterval(async () => {
    try {
      const drivers = await Driver.find({ isOnline: true })
      const updatedDrivers = []

      for (const driver of drivers) {
        // Simulate movement based on current status
        const { location, speed } = simulateMovement(driver.location, driver.status, driver.speed)

        // Simulate battery drain
        const batteryLevel = simulateBatteryDrain(driver.batteryLevel, driver.status, speed)

        // Update ETA for active drivers
        let eta = driver.eta
        if (driver.status === "active" && driver.destination) {
          // Simulate decreasing ETA
          const currentETA = Number.parseInt(driver.eta?.replace(/\D/g, "") || "0")
          if (currentETA > 1) {
            eta = `${Math.max(1, currentETA - Math.floor(Math.random() * 2))} mins`
          } else {
            // Trip completed - reset driver to idle
            driver.status = "idle"
            driver.destination = null
            driver.passenger = null
            driver.tripId = null
            eta = null
            driver.completedTrips += 1
          }
        }

        // Randomly assign new trips to idle drivers (10% chance per update)
        if (driver.status === "idle" && Math.random() < 0.1) {
          driver.status = "active"
          driver.destination = getRandomDestination()
          driver.passenger = getRandomPassenger()
          driver.tripId = `TRP${Date.now().toString().slice(-6)}`
          eta = generateETA(Math.random() * 10 + 2, speed || 40)
        }

        // Randomly create emergency situations (0.5% chance per update)
        if (driver.status === "active" && Math.random() < 0.005) {
          driver.status = "emergency"

          // Emit emergency alert
          if (io) {
            io.emit("emergencyAlert", {
              driverId: driver._id,
              driver,
              message: `Emergency alert from ${driver.name} - Immediate assistance required`,
              timestamp: new Date().toISOString(),
              priority: "high",
            })
          }
        }

        // Auto-resolve emergency after some time (20% chance per update)
        if (driver.status === "emergency" && Math.random() < 0.2) {
          driver.status = "active"
        }

        // Update driver in database
        const updatedDriver = await Driver.findByIdAndUpdate(
          driver._id,
          {
            location,
            speed,
            batteryLevel,
            eta,
            status: driver.status,
            destination: driver.destination,
            passenger: driver.passenger,
            tripId: driver.tripId,
            completedTrips: driver.completedTrips,
            lastUpdate: new Date(),
          },
          { new: true },
        )

        updatedDrivers.push(updatedDriver)
      }

      // Broadcast updates to all connected clients
      if (io && updatedDrivers.length > 0) {
        io.emit("driversUpdate", {
          success: true,
          data: updatedDrivers,
          timestamp: new Date().toISOString(),
          updateType: "simulation",
        })

        // Send individual location updates for active drivers
        updatedDrivers.forEach((driver) => {
          if (driver.status === "active") {
            io.emit("locationUpdate", {
              driverId: driver._id,
              location: driver.location,
              speed: driver.speed,
              eta: driver.eta,
              timestamp: new Date().toISOString(),
            })
          }
        })
      }
    } catch (error) {
      console.error("❌ Error in location simulation:", error)
    }
  }, 3000) // Update every 3 seconds

  console.log("🔄 Location simulation interval started (3s updates)")
}

// Graceful shutdown
process.on("SIGINT", () => {
  if (updateInterval) {
    clearInterval(updateInterval)
    console.log("🔄 Location simulation stopped")
  }

  if (io) {
    io.close()
    console.log("🔌 Socket.io server closed")
  }
})

module.exports = socketHandler
