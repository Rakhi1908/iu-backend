// const express = require("express")
// const {
//   getAllDrivers,
//   getDriver,
//   createDriver,
//   updateDriver,
//   updateDriverLocation,
//   deleteDriver,
//   getDriverStats,
//   initializeSampleDrivers,
// } = require("../controllers/driverController")

// const router = express.Router()

// // Driver routes
// router.get("/drivers", getAllDrivers)
// router.get("/drivers/stats", getDriverStats)
// router.get("/drivers/:id", getDriver)
// router.post("/drivers", createDriver)
// router.put("/drivers/:id", updateDriver)
// router.patch("/drivers/:id/location", updateDriverLocation)
// router.delete("/drivers/:id", deleteDriver)

// // Initialize sample data
// router.post("/drivers/init/sample", async (req, res) => {
//   try {
//     await initializeSampleDrivers()
//     res.json({
//       success: true,
//       message: "Sample drivers initialized successfully",
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to initialize sample drivers",
//       error: error.message,
//     })
//   }
// })

// module.exports = router

const express = require("express")
const {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  updateDriverLocation,
  deleteDriver,
  getDriverStats,
  initializeSampleDrivers,
  resetWithIndianNames,
} = require("../controllers/driverController")

const router = express.Router()

// Driver routes
router.get("/drivers", getAllDrivers)
router.get("/drivers/stats", getDriverStats)
router.get("/drivers/:id", getDriver)
router.post("/drivers", createDriver)
router.put("/drivers/:id", updateDriver)
router.patch("/drivers/:id/location", updateDriverLocation)
router.delete("/drivers/:id", deleteDriver)

// Initialize sample data
router.post("/drivers/init/sample", async (req, res) => {
  try {
    await initializeSampleDrivers()
    res.json({
      success: true,
      message: "Sample drivers initialized successfully with Indian names",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to initialize sample drivers",
      error: error.message,
    })
  }
})

// NEW: Reset with Indian names endpoint
router.post("/drivers/reset/indian-names", async (req, res) => {
  try {
    const success = await resetWithIndianNames()
    if (success) {
      res.json({
        success: true,
        message: "Successfully reset all drivers with Indian names!",
      })
    } else {
      throw new Error("Reset operation failed")
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset drivers with Indian names",
      error: error.message,
    })
  }
})

module.exports = router
