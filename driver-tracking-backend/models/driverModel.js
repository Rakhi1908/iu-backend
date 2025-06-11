const mongoose = require("mongoose")

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "idle", "offline", "emergency"],
      default: "idle",
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    destination: {
      type: String,
      default: null,
    },
    eta: {
      type: String,
      default: null,
    },
    tripId: {
      type: String,
      default: null,
    },
    passenger: {
      type: String,
      default: null,
    },
    speed: {
      type: Number,
      default: 0,
      min: 0,
    },
    batteryLevel: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    completedTrips: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for geospatial queries
driverSchema.index({ location: "2dsphere" })

// Update lastUpdate before saving
driverSchema.pre("save", function (next) {
  this.lastUpdate = new Date()
  next()
})

// Instance method to update location
driverSchema.methods.updateLocation = function (lat, lng, speed = null) {
  this.location = { lat, lng }
  if (speed !== null) {
    this.speed = speed
  }
  this.lastUpdate = new Date()
  return this.save()
}

// Static method to find drivers by status
driverSchema.statics.findByStatus = function (status) {
  return this.find({ status })
}

// Static method to find nearby drivers
driverSchema.statics.findNearby = function (lat, lng, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: maxDistance,
      },
    },
  })
}

module.exports = mongoose.model("Driver", driverSchema)
