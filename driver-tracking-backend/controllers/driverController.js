// const Driver = require("../models/driverModel")
// const locationSimulator = require("../utils/locationSimulator")

// // Get all drivers
// const getAllDrivers = async (req, res) => {
//   try {
//     const { status, search } = req.query
//     const query = {}

//     // Filter by status if provided
//     if (status && status !== "all") {
//       query.status = status
//     }

//     // Search functionality
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//         { vehicle: { $regex: search, $options: "i" } },
//       ]
//     }

//     const drivers = await Driver.find(query).sort({ lastUpdate: -1 })

//     res.json({
//       success: true,
//       count: drivers.length,
//       data: drivers,
//     })
//   } catch (error) {
//     console.error("Error fetching drivers:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch drivers",
//       error: error.message,
//     })
//   }
// }

// // Get single driver
// const getDriver = async (req, res) => {
//   try {
//     const driver = await Driver.findById(req.params.id)

//     if (!driver) {
//       return res.status(404).json({
//         success: false,
//         message: "Driver not found",
//       })
//     }

//     res.json({
//       success: true,
//       data: driver,
//     })
//   } catch (error) {
//     console.error("Error fetching driver:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch driver",
//       error: error.message,
//     })
//   }
// }

// // Create new driver
// const createDriver = async (req, res) => {
//   try {
//     const driver = new Driver(req.body)
//     await driver.save()

//     res.status(201).json({
//       success: true,
//       message: "Driver created successfully",
//       data: driver,
//     })
//   } catch (error) {
//     console.error("Error creating driver:", error)
//     res.status(400).json({
//       success: false,
//       message: "Failed to create driver",
//       error: error.message,
//     })
//   }
// }

// // Update driver
// const updateDriver = async (req, res) => {
//   try {
//     const driver = await Driver.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, lastUpdate: new Date() },
//       { new: true, runValidators: true },
//     )

//     if (!driver) {
//       return res.status(404).json({
//         success: false,
//         message: "Driver not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Driver updated successfully",
//       data: driver,
//     })
//   } catch (error) {
//     console.error("Error updating driver:", error)
//     res.status(400).json({
//       success: false,
//       message: "Failed to update driver",
//       error: error.message,
//     })
//   }
// }

// // Update driver location
// const updateDriverLocation = async (req, res) => {
//   try {
//     const { lat, lng, speed } = req.body

//     const driver = await Driver.findById(req.params.id)
//     if (!driver) {
//       return res.status(404).json({
//         success: false,
//         message: "Driver not found",
//       })
//     }

//     await driver.updateLocation(lat, lng, speed)

//     res.json({
//       success: true,
//       message: "Driver location updated successfully",
//       data: driver,
//     })
//   } catch (error) {
//     console.error("Error updating driver location:", error)
//     res.status(400).json({
//       success: false,
//       message: "Failed to update driver location",
//       error: error.message,
//     })
//   }
// }

// // Delete driver
// const deleteDriver = async (req, res) => {
//   try {
//     const driver = await Driver.findByIdAndDelete(req.params.id)

//     if (!driver) {
//       return res.status(404).json({
//         success: false,
//         message: "Driver not found",
//       })
//     }

//     res.json({
//       success: true,
//       message: "Driver deleted successfully",
//     })
//   } catch (error) {
//     console.error("Error deleting driver:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete driver",
//       error: error.message,
//     })
//   }
// }

// // Get driver statistics
// const getDriverStats = async (req, res) => {
//   try {
//     const stats = await Driver.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalDrivers: { $sum: 1 },
//           activeDrivers: {
//             $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
//           },
//           idleDrivers: {
//             $sum: { $cond: [{ $eq: ["$status", "idle"] }, 1, 0] },
//           },
//           emergencyDrivers: {
//             $sum: { $cond: [{ $eq: ["$status", "emergency"] }, 1, 0] },
//           },
//           offlineDrivers: {
//             $sum: { $cond: [{ $eq: ["$status", "offline"] }, 1, 0] },
//           },
//           avgRating: { $avg: "$rating" },
//           totalTrips: { $sum: "$completedTrips" },
//           avgBatteryLevel: { $avg: "$batteryLevel" },
//         },
//       },
//     ])

//     res.json({
//       success: true,
//       data: stats[0] || {
//         totalDrivers: 0,
//         activeDrivers: 0,
//         idleDrivers: 0,
//         emergencyDrivers: 0,
//         offlineDrivers: 0,
//         avgRating: 0,
//         totalTrips: 0,
//         avgBatteryLevel: 0,
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching driver stats:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch driver statistics",
//       error: error.message,
//     })
//   }
// }

// // Initialize sample drivers
// const initializeSampleDrivers = async () => {
//   try {
//     const count = await Driver.countDocuments()

//     if (count === 0) {
//       const sampleDrivers = [
//         {
//           name: "Harsh Prajapati",
//           phone: "+92 300 1234567",
//           vehicle: "Toyota Corolla - ABC 123",
//           status: "active",
//           location: { lat: 24.8607, lng: 67.0011 },
//           destination: "Gulshan-e-Iqbal",
//           eta: "15 mins",
//           tripId: "TRP001",
//           passenger: "Sarah Ali",
//           speed: 45,
//           batteryLevel: 85,
//           rating: 4.8,
//           completedTrips: 156,
//           isOnline: true,
//         },
//         {
//           name: "Bhavash",
//           phone: "+92 301 9876543",
//           vehicle: "Honda City - XYZ 789",
//           status: "active",
//           location: { lat: 24.8615, lng: 67.0025 },
//           destination: "DHA Phase 2",
//           eta: "8 mins",
//           tripId: "TRP002",
//           passenger: "Omar Sheikh",
//           speed: 32,
//           batteryLevel: 92,
//           rating: 4.6,
//           completedTrips: 203,
//           isOnline: true,
//         },
//         {
//           name: "Nayan Ladumore",
//           phone: "+92 302 5555555",
//           vehicle: "Suzuki Alto - DEF 456",
//           status: "idle",
//           location: { lat: 24.859, lng: 67.004 },
//           speed: 0,
//           batteryLevel: 78,
//           rating: 4.9,
//           completedTrips: 89,
//           isOnline: true,
//         },
//         {
//           name: "Mahi Panchal",
//           phone: "+92 303 7777777",
//           vehicle: "Honda Civic - GHI 789",
//           status: "emergency",
//           location: { lat: 24.858, lng: 67.003 },
//           destination: "Clifton",
//           eta: "20 mins",
//           tripId: "TRP003",
//           passenger: "Ayesha Khan",
//           speed: 0,
//           batteryLevel: 45,
//           rating: 4.7,
//           completedTrips: 134,
//           isOnline: true,
//         },
//       ]

//       await Driver.insertMany(sampleDrivers)
//       console.log("✅ Sample drivers initialized")
//     }
//   } catch (error) {
//     console.error("❌ Error initializing sample drivers:", error)
//   }
// }

// module.exports = {
//   getAllDrivers,
//   getDriver,
//   createDriver,
//   updateDriver,
//   updateDriverLocation,
//   deleteDriver,
//   getDriverStats,
//   initializeSampleDrivers,
// }


const Driver = require("../models/driverModel")
const locationSimulator = require("../utils/locationSimulator")

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const { status, search } = req.query
    const query = {}

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { vehicle: { $regex: search, $options: "i" } },
      ]
    }

    const drivers = await Driver.find(query).sort({ lastUpdate: -1 })

    res.json({
      success: true,
      count: drivers.length,
      data: drivers,
    })
  } catch (error) {
    console.error("Error fetching drivers:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch drivers",
      error: error.message,
    })
  }
}

// Get single driver
const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      })
    }

    res.json({
      success: true,
      data: driver,
    })
  } catch (error) {
    console.error("Error fetching driver:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver",
      error: error.message,
    })
  }
}

// Create new driver
const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body)
    await driver.save()

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      data: driver,
    })
  } catch (error) {
    console.error("Error creating driver:", error)
    res.status(400).json({
      success: false,
      message: "Failed to create driver",
      error: error.message,
    })
  }
}

// Update driver
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdate: new Date() },
      { new: true, runValidators: true },
    )

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      })
    }

    res.json({
      success: true,
      message: "Driver updated successfully",
      data: driver,
    })
  } catch (error) {
    console.error("Error updating driver:", error)
    res.status(400).json({
      success: false,
      message: "Failed to update driver",
      error: error.message,
    })
  }
}

// Update driver location
const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng, speed } = req.body

    const driver = await Driver.findById(req.params.id)
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      })
    }

    await driver.updateLocation(lat, lng, speed)

    res.json({
      success: true,
      message: "Driver location updated successfully",
      data: driver,
    })
  } catch (error) {
    console.error("Error updating driver location:", error)
    res.status(400).json({
      success: false,
      message: "Failed to update driver location",
      error: error.message,
    })
  }
}

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id)

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      })
    }

    res.json({
      success: true,
      message: "Driver deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting driver:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete driver",
      error: error.message,
    })
  }
}

// Get driver statistics
const getDriverStats = async (req, res) => {
  try {
    const stats = await Driver.aggregate([
      {
        $group: {
          _id: null,
          totalDrivers: { $sum: 1 },
          activeDrivers: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          idleDrivers: {
            $sum: { $cond: [{ $eq: ["$status", "idle"] }, 1, 0] },
          },
          emergencyDrivers: {
            $sum: { $cond: [{ $eq: ["$status", "emergency"] }, 1, 0] },
          },
          offlineDrivers: {
            $sum: { $cond: [{ $eq: ["$status", "offline"] }, 1, 0] },
          },
          avgRating: { $avg: "$rating" },
          totalTrips: { $sum: "$completedTrips" },
          avgBatteryLevel: { $avg: "$batteryLevel" },
        },
      },
    ])

    res.json({
      success: true,
      data: stats[0] || {
        totalDrivers: 0,
        activeDrivers: 0,
        idleDrivers: 0,
        emergencyDrivers: 0,
        offlineDrivers: 0,
        avgRating: 0,
        totalTrips: 0,
        avgBatteryLevel: 0,
      },
    })
  } catch (error) {
    console.error("Error fetching driver stats:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver statistics",
      error: error.message,
    })
  }
}

// Reset and initialize with Indian names - FORCE UPDATE
const resetWithIndianNames = async () => {
  try {
    // Delete all existing drivers
    await Driver.deleteMany({})
    console.log("🗑️ Cleared existing drivers")

    // Create new drivers with Indian names
    const indianDrivers = [
      {
        name: "Harsh Prajapati",
        phone: "+91 98765 43210",
        vehicle: "Toyota Corolla - MH 01 AB 1234",
        status: "active",
        location: { lat: 24.8607, lng: 67.0011 },
        destination: "Andheri East",
        eta: "15 mins",
        tripId: "TRP001",
        passenger: "Priya Sharma",
        speed: 45,
        batteryLevel: 85,
        rating: 4.8,
        completedTrips: 156,
        isOnline: true,
      },
      {
        name: "Bhavesh Kumar",
        phone: "+91 98765 43211",
        vehicle: "Honda City - DL 02 CD 5678",
        status: "active",
        location: { lat: 24.8615, lng: 67.0025 },
        destination: "Bandra West",
        eta: "8 mins",
        tripId: "TRP002",
        passenger: "Rahul Gupta",
        speed: 32,
        batteryLevel: 92,
        rating: 4.6,
        completedTrips: 203,
        isOnline: true,
      },
      {
        name: "Nayan Ladumore",
        phone: "+91 98765 43212",
        vehicle: "Suzuki Alto - GJ 03 EF 9012",
        status: "idle",
        location: { lat: 24.859, lng: 67.004 },
        speed: 0,
        batteryLevel: 78,
        rating: 4.9,
        completedTrips: 89,
        isOnline: true,
      },
      {
        name: "Mahi Panchal",
        phone: "+91 98765 43213",
        vehicle: "Honda Civic - KA 04 GH 3456",
        status: "emergency",
        location: { lat: 24.858, lng: 67.003 },
        destination: "Powai",
        eta: "20 mins",
        tripId: "TRP003",
        passenger: "Sneha Patel",
        speed: 0,
        batteryLevel: 45,
        rating: 4.7,
        completedTrips: 134,
        isOnline: true,
      },
      {
        name: "Raj Kumar Singh",
        phone: "+91 98765 43214",
        vehicle: "Hyundai Elantra - UP 05 IJ 7890",
        status: "idle",
        location: { lat: 24.862, lng: 67.008 },
        speed: 0,
        batteryLevel: 95,
        rating: 4.5,
        completedTrips: 67,
        isOnline: true,
      },
      {
        name: "Arjun Singh Rajput",
        phone: "+91 98765 43215",
        vehicle: "Nissan Sunny - RJ 06 KL 2345",
        status: "active",
        location: { lat: 24.857, lng: 67.012 },
        destination: "Malad West",
        eta: "12 mins",
        tripId: "TRP004",
        passenger: "Amit Verma",
        speed: 38,
        batteryLevel: 72,
        rating: 4.4,
        completedTrips: 98,
        isOnline: true,
      },
      {
        name: "Vikram Yadav",
        phone: "+91 98765 43216",
        vehicle: "Maruti Swift - TN 07 MN 6789",
        status: "active",
        location: { lat: 24.863, lng: 67.015 },
        destination: "Thane East",
        eta: "18 mins",
        tripId: "TRP005",
        passenger: "Kavya Joshi",
        speed: 42,
        batteryLevel: 88,
        rating: 4.3,
        completedTrips: 112,
        isOnline: true,
      },
      {
        name: "Rohit Sharma",
        phone: "+91 98765 43217",
        vehicle: "Tata Nexon - WB 08 OP 0123",
        status: "idle",
        location: { lat: 24.856, lng: 67.018 },
        speed: 0,
        batteryLevel: 91,
        rating: 4.6,
        completedTrips: 145,
        isOnline: true,
      },
      {
        name: "Deepak Jain",
        phone: "+91 98765 43218",
        vehicle: "Mahindra XUV300 - AP 09 QR 4567",
        status: "active",
        location: { lat: 24.864, lng: 67.021 },
        destination: "Goregaon East",
        eta: "25 mins",
        tripId: "TRP006",
        passenger: "Ravi Agarwal",
        speed: 35,
        batteryLevel: 76,
        rating: 4.2,
        completedTrips: 87,
        isOnline: true,
      },
      {
        name: "Suresh Patil",
        phone: "+91 98765 43219",
        vehicle: "Ford EcoSport - HR 10 ST 8901",
        status: "offline",
        location: { lat: 24.855, lng: 67.024 },
        speed: 0,
        batteryLevel: 23,
        rating: 4.1,
        completedTrips: 234,
        isOnline: false,
      },
    ]

    await Driver.insertMany(indianDrivers)
    console.log("✅ Successfully created drivers with Indian names!")
    return true
  } catch (error) {
    console.error("❌ Error resetting drivers:", error)
    return false
  }
}

// Initialize sample drivers with proper Indian names
const initializeSampleDrivers = async () => {
  try {
    // Always reset with Indian names for now
    await resetWithIndianNames()
  } catch (error) {
    console.error("❌ Error initializing sample drivers:", error)
  }
}

module.exports = {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  updateDriverLocation,
  deleteDriver,
  getDriverStats,
  initializeSampleDrivers,
  resetWithIndianNames, // Export the reset function
}
