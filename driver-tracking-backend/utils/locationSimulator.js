// // Karachi city bounds for realistic simulation
// const KARACHI_BOUNDS = {
//   north: 24.9265,
//   south: 24.7453,
//   east: 67.1577,
//   west: 66.975,
// }

// // Generate random location within Karachi bounds
// const generateRandomLocation = () => {
//   const lat = KARACHI_BOUNDS.south + Math.random() * (KARACHI_BOUNDS.north - KARACHI_BOUNDS.south)
//   const lng = KARACHI_BOUNDS.west + Math.random() * (KARACHI_BOUNDS.east - KARACHI_BOUNDS.west)

//   return { lat, lng }
// }

// // Simulate realistic movement for a driver
// const simulateMovement = (currentLocation, status, speed = 0) => {
//   const newLocation = { ...currentLocation }
//   let newSpeed = speed

//   switch (status) {
//     case "active":
//       // Active drivers move more significantly
//       const movementRange = 0.002 // Larger movement for active drivers
//       newLocation.lat += (Math.random() - 0.5) * movementRange
//       newLocation.lng += (Math.random() - 0.5) * movementRange

//       // Simulate speed changes (20-80 km/h for active drivers)
//       newSpeed = Math.max(20, Math.min(80, speed + (Math.random() - 0.5) * 15))
//       break

//     case "idle":
//       // Idle drivers have minimal movement (parked but may adjust position)
//       const idleRange = 0.0005
//       newLocation.lat += (Math.random() - 0.5) * idleRange
//       newLocation.lng += (Math.random() - 0.5) * idleRange
//       newSpeed = Math.max(0, Math.min(5, speed + (Math.random() - 0.5) * 2))
//       break

//     case "emergency":
//       // Emergency drivers may be stationary or moving erratically
//       if (Math.random() > 0.7) {
//         // 30% chance of movement during emergency
//         const emergencyRange = 0.001
//         newLocation.lat += (Math.random() - 0.5) * emergencyRange
//         newLocation.lng += (Math.random() - 0.5) * emergencyRange
//       }
//       newSpeed = Math.max(0, Math.min(10, speed + (Math.random() - 0.5) * 5))
//       break

//     case "offline":
//       // Offline drivers don't move
//       newSpeed = 0
//       break

//     default:
//       // Default minimal movement
//       const defaultRange = 0.0003
//       newLocation.lat += (Math.random() - 0.5) * defaultRange
//       newLocation.lng += (Math.random() - 0.5) * defaultRange
//       break
//   }

//   // Ensure location stays within Karachi bounds
//   newLocation.lat = Math.max(KARACHI_BOUNDS.south, Math.min(KARACHI_BOUNDS.north, newLocation.lat))
//   newLocation.lng = Math.max(KARACHI_BOUNDS.west, Math.min(KARACHI_BOUNDS.east, newLocation.lng))

//   return {
//     location: newLocation,
//     speed: Math.round(newSpeed),
//   }
// }

// // Calculate distance between two points (in kilometers)
// const calculateDistance = (lat1, lng1, lat2, lng2) => {
//   const R = 6371 // Earth's radius in kilometers
//   const dLat = ((lat2 - lat1) * Math.PI) / 180
//   const dLng = ((lng2 - lng1) * Math.PI) / 180

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//   const distance = R * c

//   return distance
// }

// // Generate realistic ETA based on distance and traffic
// const generateETA = (distance, currentSpeed = 40) => {
//   if (distance <= 0) return "0 mins"

//   // Account for traffic (reduce effective speed)
//   const trafficFactor = 0.6 + Math.random() * 0.4 // 60-100% of normal speed
//   const effectiveSpeed = currentSpeed * trafficFactor

//   const timeInHours = distance / effectiveSpeed
//   const timeInMinutes = Math.round(timeInHours * 60)

//   if (timeInMinutes < 60) {
//     return `${timeInMinutes} mins`
//   } else {
//     const hours = Math.floor(timeInMinutes / 60)
//     const minutes = timeInMinutes % 60
//     return `${hours}h ${minutes}m`
//   }
// }

// // Simulate battery drain based on activity
// const simulateBatteryDrain = (currentBattery, status, speed) => {
//   let drainRate = 0.1 // Base drain rate per update cycle

//   switch (status) {
//     case "active":
//       drainRate = 0.3 + (speed / 100) * 0.2 // Higher drain when active and fast
//       break
//     case "idle":
//       drainRate = 0.05 // Minimal drain when idle
//       break
//     case "emergency":
//       drainRate = 0.5 // High drain during emergency (GPS, calls, etc.)
//       break
//     case "offline":
//       drainRate = 0 // No drain when offline
//       break
//   }

//   const newBattery = Math.max(0, currentBattery - drainRate)
//   return Math.round(newBattery)
// }

// // Generate random destinations in Karachi
// const getRandomDestination = () => {
//   const destinations = [
//     "Gulshan-e-Iqbal",
//     "DHA Phase 2",
//     "Clifton",
//     "Saddar",
//     "North Nazimabad",
//     "Korangi",
//     "Malir",
//     "Lyari",
//     "Orangi Town",
//     "Landhi",
//     "Shah Faisal Colony",
//     "Gulistan-e-Jauhar",
//     "Federal B Area",
//     "Nazimabad",
//     "Tariq Road",
//     "II Chundrigar Road",
//     "Boat Basin",
//     "Defence",
//     "Pechs",
//     "Bahadurabad",
//   ]

//   return destinations[Math.floor(Math.random() * destinations.length)]
// }

// // Generate random passenger names
// const getRandomPassenger = () => {
//   const names = [
//     "Sarah Ali",
//     "Omar Sheikh",
//     "Ayesha Khan",
//     "Hassan Ahmed",
//     "Fatima Noor",
//     "Ali Raza",
//     "Zainab Malik",
//     "Ahmed Hassan",
//     "Mariam Sheikh",
//     "Usman Ali",
//     "Khadija Ahmed",
//     "Bilal Khan",
//     "Aisha Malik",
//     "Hamza Sheikh",
//     "Zara Ali",
//     "Imran Ahmed",
//     "Sana Khan",
//     "Tariq Ali",
//     "Nadia Sheikh",
//     "Faisal Ahmed",
//   ]

//   return names[Math.floor(Math.random() * names.length)]
// }

// module.exports = {
//   generateRandomLocation,
//   simulateMovement,
//   calculateDistance,
//   generateETA,
//   simulateBatteryDrain,
//   getRandomDestination,
//   getRandomPassenger,
//   KARACHI_BOUNDS,
// }


// City bounds for realistic simulation (can be any city)
const CITY_BOUNDS = {
  north: 24.9265,
  south: 24.7453,
  east: 67.1577,
  west: 66.975,
}

// Generate random location within city bounds
const generateRandomLocation = () => {
  const lat = CITY_BOUNDS.south + Math.random() * (CITY_BOUNDS.north - CITY_BOUNDS.south)
  const lng = CITY_BOUNDS.west + Math.random() * (CITY_BOUNDS.east - CITY_BOUNDS.west)

  return { lat, lng }
}

// Simulate realistic movement for a driver
const simulateMovement = (currentLocation, status, speed = 0) => {
  const newLocation = { ...currentLocation }
  let newSpeed = speed

  switch (status) {
    case "active":
      // Active drivers move more significantly
      const movementRange = 0.002 // Larger movement for active drivers
      newLocation.lat += (Math.random() - 0.5) * movementRange
      newLocation.lng += (Math.random() - 0.5) * movementRange

      // Simulate speed changes (20-80 km/h for active drivers)
      newSpeed = Math.max(20, Math.min(80, speed + (Math.random() - 0.5) * 15))
      break

    case "idle":
      // Idle drivers have minimal movement (parked but may adjust position)
      const idleRange = 0.0005
      newLocation.lat += (Math.random() - 0.5) * idleRange
      newLocation.lng += (Math.random() - 0.5) * idleRange
      newSpeed = Math.max(0, Math.min(5, speed + (Math.random() - 0.5) * 2))
      break

    case "emergency":
      // Emergency drivers may be stationary or moving erratically
      if (Math.random() > 0.7) {
        // 30% chance of movement during emergency
        const emergencyRange = 0.001
        newLocation.lat += (Math.random() - 0.5) * emergencyRange
        newLocation.lng += (Math.random() - 0.5) * emergencyRange
      }
      newSpeed = Math.max(0, Math.min(10, speed + (Math.random() - 0.5) * 5))
      break

    case "offline":
      // Offline drivers don't move
      newSpeed = 0
      break

    default:
      // Default minimal movement
      const defaultRange = 0.0003
      newLocation.lat += (Math.random() - 0.5) * defaultRange
      newLocation.lng += (Math.random() - 0.5) * defaultRange
      break
  }

  // Ensure location stays within city bounds
  newLocation.lat = Math.max(CITY_BOUNDS.south, Math.min(CITY_BOUNDS.north, newLocation.lat))
  newLocation.lng = Math.max(CITY_BOUNDS.west, Math.min(CITY_BOUNDS.east, newLocation.lng))

  return {
    location: newLocation,
    speed: Math.round(newSpeed),
  }
}

// Calculate distance between two points (in kilometers)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

// Generate realistic ETA based on distance and traffic
const generateETA = (distance, currentSpeed = 40) => {
  if (distance <= 0) return "0 mins"

  // Account for traffic (reduce effective speed)
  const trafficFactor = 0.6 + Math.random() * 0.4 // 60-100% of normal speed
  const effectiveSpeed = currentSpeed * trafficFactor

  const timeInHours = distance / effectiveSpeed
  const timeInMinutes = Math.round(timeInHours * 60)

  if (timeInMinutes < 60) {
    return `${timeInMinutes} mins`
  } else {
    const hours = Math.floor(timeInMinutes / 60)
    const minutes = timeInMinutes % 60
    return `${hours}h ${minutes}m`
  }
}

// Simulate battery drain based on activity
const simulateBatteryDrain = (currentBattery, status, speed) => {
  let drainRate = 0.1 // Base drain rate per update cycle

  switch (status) {
    case "active":
      drainRate = 0.3 + (speed / 100) * 0.2 // Higher drain when active and fast
      break
    case "idle":
      drainRate = 0.05 // Minimal drain when idle
      break
    case "emergency":
      drainRate = 0.5 // High drain during emergency (GPS, calls, etc.)
      break
    case "offline":
      drainRate = 0 // No drain when offline
      break
  }

  const newBattery = Math.max(0, currentBattery - drainRate)
  return Math.round(newBattery)
}

// Generate random Indian destinations
const getRandomDestination = () => {
  const destinations = [
    "Andheri East",
    "Bandra West",
    "Powai",
    "Malad West",
    "Thane East",
    "Goregaon East",
    "Borivali West",
    "Kandivali East",
    "Jogeshwari West",
    "Vile Parle East",
    "Santacruz West",
    "Khar Road",
    "Dadar Central",
    "Lower Parel",
    "Worli Sea Face",
    "Colaba Market",
    "Fort District",
    "Churchgate Station",
    "Marine Drive",
    "Nariman Point",
    "BKC Bandra",
    "Phoenix Mall",
    "Palladium Mall",
    "Linking Road",
    "Hill Road Bandra",
  ]

  return destinations[Math.floor(Math.random() * destinations.length)]
}

// Generate random Indian passenger names
const getRandomPassenger = () => {
  const names = [
    "Priya Sharma",
    "Rahul Gupta",
    "Sneha Patel",
    "Amit Verma",
    "Kavya Joshi",
    "Ravi Agarwal",
    "Pooja Singh",
    "Vikash Kumar",
    "Anjali Mehta",
    "Sunil Yadav",
    "Neha Kapoor",
    "Rohit Malhotra",
    "Divya Reddy",
    "Arjun Nair",
    "Shreya Iyer",
    "Karan Chopra",
    "Meera Jain",
    "Varun Sinha",
    "Aarti Bansal",
    "Nikhil Pandey",
    "Ritika Saxena",
    "Gaurav Tiwari",
    "Swati Mishra",
    "Akash Bhatt",
    "Preeti Agrawal",
    "Manish Goyal",
    "Shweta Khanna",
    "Deepak Rastogi",
    "Nidhi Arora",
    "Sanjay Dubey",
    "Pallavi Jha",
    "Rajesh Soni",
    "Sunita Gupta",
    "Vishal Shah",
    "Rekha Bajaj",
    "Ashish Mittal",
    "Sapna Goel",
    "Manoj Khurana",
    "Seema Bhatia",
    "Ankit Sachdeva",
  ]

  return names[Math.floor(Math.random() * names.length)]
}

module.exports = {
  generateRandomLocation,
  simulateMovement,
  calculateDistance,
  generateETA,
  simulateBatteryDrain,
  getRandomDestination,
  getRandomPassenger,
  CITY_BOUNDS,
}
