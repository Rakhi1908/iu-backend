# Live Driver Tracking System - Backend

A complete Node.js backend for real-time driver tracking with Socket.io and MongoDB.

## 🚀 Features

- **Real-time Location Updates**: Live GPS tracking simulation with Socket.io
- **MongoDB Integration**: Persistent storage for driver data
- **RESTful API**: Complete CRUD operations for drivers
- **Emergency Alerts**: Real-time emergency notification system
- **Battery Simulation**: Realistic battery drain simulation
- **Trip Management**: Automatic trip assignment and completion
- **Statistics Dashboard**: Real-time analytics and metrics

## 📁 Project Structure

\`\`\`
backend/
├── config/
│   └── db.js                # MongoDB connection logic
├── controllers/
│   └── driverController.js  # Business logic for drivers
├── models/
│   └── driverModel.js       # Mongoose schema for drivers
├── routes/
│   └── driverRoutes.js      # REST API endpoints
├── utils/
│   └── locationSimulator.js # GPS simulation utilities
├── socket/
│   └── socketHandler.js     # Socket.io real-time logic
├── server.js                # Main application entry point
├── package.json             # Dependencies and scripts
└── .env.example             # Environment variables template
\`\`\`

## 🛠️ Installation & Setup

1. **Clone and Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   \`\`\`

3. **Start MongoDB**
   \`\`\`bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env file
   \`\`\`

4. **Run the Server**
   \`\`\`bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

## 🔌 API Endpoints

### Drivers
- `GET /api/drivers` - Get all drivers (with search & filter)
- `GET /api/drivers/:id` - Get single driver
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `PATCH /api/drivers/:id/location` - Update driver location
- `DELETE /api/drivers/:id` - Delete driver

### Statistics
- `GET /api/drivers/stats` - Get driver statistics

### Utilities
- `POST /api/drivers/init/sample` - Initialize sample drivers

## 🔄 Socket.io Events

### Client → Server
- `getLatestDrivers` - Request current driver data
- `updateDriverStatus` - Update driver status
- `emergencyAlert` - Send emergency alert
- `updateLocation` - Update driver location
- `assignTrip` - Assign trip to driver

### Server → Client
- `driversUpdate` - Broadcast driver updates
- `locationUpdate` - Real-time location updates
- `emergencyAlert` - Emergency notifications
- `driverStatusChanged` - Status change notifications
- `tripAssigned` - Trip assignment notifications

## 🎯 Real-time Features

### Location Simulation
- Realistic GPS coordinate changes every 3 seconds
- Movement patterns based on driver status (active/idle/emergency)
- Speed simulation with traffic considerations
- Boundary checking within Karachi city limits

### Battery Management
- Realistic battery drain based on activity
- Emergency alerts for low battery (< 20%)
- Different drain rates for different statuses

### Trip Management
- Automatic trip assignment to idle drivers
- ETA calculation and updates
- Trip completion simulation
- Random passenger and destination assignment

### Emergency System
- Random emergency generation (0.5% chance)
- Automatic emergency resolution
- Real-time emergency broadcasts
- Priority alert system

## 🗄️ Database Schema

### Driver Model
\`\`\`javascript
{
  name: String,           // Driver name
  phone: String,          // Contact number
  vehicle: String,        // Vehicle details
  status: String,         // active/idle/offline/emergency
  location: {             // GPS coordinates
    lat: Number,
    lng: Number
  },
  destination: String,    // Current destination
  eta: String,           // Estimated time of arrival
  tripId: String,        // Current trip ID
  passenger: String,     // Current passenger
  speed: Number,         // Current speed (km/h)
  batteryLevel: Number,  // Device battery (0-100)
  rating: Number,        // Driver rating (1-5)
  completedTrips: Number,// Total completed trips
  lastUpdate: Date,      // Last update timestamp
  isOnline: Boolean      // Online status
}
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/driver-tracking
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### MongoDB Setup
- Local: Install MongoDB and run `mongod`
- Cloud: Use MongoDB Atlas and update connection string
- The app will auto-create collections and sample data

## 🚦 Usage with Frontend

1. Start the backend server (port 5000)
2. Start your React frontend (port 3000)
3. The frontend will automatically connect via Socket.io
4. Real-time updates will begin immediately

## 📊 Monitoring

- Health check: `GET /health`
- Console logs show connection status
- Real-time statistics via Socket.io
- MongoDB connection monitoring

## 🛡️ Error Handling

- Comprehensive try-catch blocks
- Socket.io error events
- Database connection error handling
- Graceful shutdown on SIGINT

## 🔄 Development

\`\`\`bash
# Install nodemon for development
npm install -D nodemon

# Run in development mode
npm run dev

# The server will auto-restart on file changes
\`\`\`

## 📝 Notes

- Sample drivers are auto-initialized on first run
- Location simulation runs every 3 seconds
- Emergency alerts are randomly generated for testing
- All coordinates are within Karachi city bounds
- Battery levels decrease realistically over time

## 🤝 Integration

This backend is designed to work seamlessly with the provided React frontend. The Socket.io events and REST API endpoints match exactly with the frontend expectations.

Ready to run with `npm start`! 🚀
