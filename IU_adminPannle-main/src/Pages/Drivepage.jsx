"use client"

import { useState, useEffect } from "react"
import { User, Shield, Users, Plus, Search, Filter, Car, CheckCircle, ChevronUp, ChevronDown } from "lucide-react"

export default function DriverManagementDashboard() {
  const [activeTab, setActiveTab] = useState("drivers")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "9876543210",
      kycStatus: "Pending",
      joinDate: "2025-06-05",
      vehicleType: "Bike",
      licensePlate: "MH01AB1234",
      licensePhoto: null,
      panCardPhoto: null
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "8765432109",
      kycStatus: "Pending",
      joinDate: "2025-06-05",
      vehicleType: "Scooter",
      licensePlate: "MH02CD5678",
      licensePhoto: null,
      panCardPhoto: null
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "7654321098",
      kycStatus: "Verified",
      joinDate: "2025-06-04",
      vehicleType: "Auto Rickshaw",
      licensePlate: "MH03EF9012",
      licensePhoto: null,
      panCardPhoto: null
    },
    {
      id: 4,
      name: "Neha Verma",
      email: "neha.verma@example.com",
      phone: "9543210987",
      kycStatus: "Pending",
      joinDate: "2025-06-03",
      vehicleType: "Car",
      licensePlate: "MH04GH3456",
      licensePhoto: null,
      panCardPhoto: null
    },
    {
      id: 5,
      name: "Sunil Joshi",
      email: "sunil.joshi@example.com",
      phone: "9123456780",
      kycStatus: "Rejected",
      joinDate: "2025-06-02",
      vehicleType: "E-Rickshaw",
      licensePlate: "MH05IJ7890",
      licensePhoto: null,
      panCardPhoto: null
    },
  ])
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    vehicleType: "",
    licensePlate: ""
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [editDriver, setEditDriver] = useState(null)
  const [licensePhoto, setLicensePhoto] = useState(null)
  const [panCardPhoto, setPanCardPhoto] = useState(null)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [kycVerificationMessage, setKycVerificationMessage] = useState("")
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterKycStatus, setFilterKycStatus] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  
  // Filtered and sorted drivers
  const [filteredDrivers, setFilteredDrivers] = useState([])

  useEffect(() => {
    // Apply search, filter and sort whenever drivers, searchTerm, filterKycStatus or sortConfig changes
    let result = [...drivers];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(driver => 
        driver.name.toLowerCase().includes(term) || 
        driver.email.toLowerCase().includes(term) || 
        driver.phone.includes(term) ||
        driver.vehicleType.toLowerCase().includes(term) ||
        driver.licensePlate.toLowerCase().includes(term)
      );
    }

    // Apply KYC status filter
    if (filterKycStatus !== "all") {
      result = result.filter(driver => driver.kycStatus.toLowerCase() === filterKycStatus.toLowerCase());
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredDrivers(result);
  }, [drivers, searchTerm, filterKycStatus, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />
  }

  const openModal = (type) => {
    setModalType(type)
    setShowModal(true)
    setFormData({ 
      name: "", 
      email: "", 
      phone: "",
      vehicleType: "",
      licensePlate: ""
    })
    setErrors({})
    setSuccessMessage("")
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType("")
    setErrors({})
    setSuccessMessage("")
    setLicensePhoto(null)
    setPanCardPhoto(null)
  }

  const handleDeleteDriver = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this driver?")
    if (confirmed) {
      const updatedDrivers = drivers.filter((driver) => driver.id !== id)
      setDrivers(updatedDrivers)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Driver name is required."
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits."
    if (!formData.email.includes("@") || !formData.email.includes(".")) newErrors.email = "Invalid email format."
    if (!formData.vehicleType.trim()) newErrors.vehicleType = "Vehicle type is required."
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "License plate is required."
    return newErrors
  }

  const handleConfirm = () => {
    if (modalType === "onboard") {
      const validationErrors = validateForm()
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      const newDriver = {
        id: drivers.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        kycStatus: "Pending",
        joinDate: new Date().toISOString().split("T")[0],
        vehicleType: formData.vehicleType,
        licensePlate: formData.licensePlate,
        licensePhoto: licensePhoto,
        panCardPhoto: panCardPhoto
      }

      setDrivers([...drivers, newDriver])
      setSuccessMessage("Driver onboarded successfully!")
      setFormData({ 
        name: "", 
        email: "", 
        phone: "",
        vehicleType: "",
        licensePlate: ""
      })
      setErrors({})

      setTimeout(() => {
        setSuccessMessage("")
        closeModal()
      }, 1500)
    } else if (modalType === "kyc") {
      if (licensePhoto && panCardPhoto) {
        setDrivers((prev) =>
          prev.map((driver) => (driver.kycStatus === "Pending" ? { ...driver, kycStatus: "Verified" } : driver)),
        )
      }
      closeModal()
    } else if (modalType === "manage" && editDriver) {
      setDrivers((prev) => prev.map((driver) => (driver.id === editDriver.id ? editDriver : driver)))
      setEditDriver(null)
      closeModal()
    }
  }

  const handleVerifyKyc = (driverId, action) => {
    let newStatus = ""
    let message = ""
    
    if (action === "verify") {
      newStatus = "Verified"
      message = "KYC verified successfully!"
    } else if (action === "reject") {
      newStatus = "Rejected"
      message = "KYC rejected successfully!"
    } else if (action === "reset") {
      newStatus = "Pending"
      message = "KYC status reset to pending!"
    }

    const updatedDrivers = drivers.map((driver) => {
      if (driver.id === driverId) {
        return { ...driver, kycStatus: newStatus }
      }
      return driver
    })

    setDrivers(updatedDrivers)
    setKycVerificationMessage(message)

    setTimeout(() => {
      setKycVerificationMessage("")
    }, 3000)
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "text-green-500 dark:text-green-400"
      case "pending":
        return "text-yellow-500 dark:text-yellow-400"
      case "rejected":
        return "text-red-500 dark:text-red-400"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  const getStatusActions = (status, driverId) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleVerifyKyc(driverId, "verify")}
              className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 text-sm flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Verify
            </button>
            <button
              onClick={() => handleVerifyKyc(driverId, "reject")}
              className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm flex items-center"
            >
              Reject
            </button>
          </div>
        )
      case "verified":
      case "rejected":
        return (
          <button
            onClick={() => handleVerifyKyc(driverId, "reset")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm flex items-center"
          >
            Reset
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Driver Management Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage drivers and their vehicle information</p>
        </div>

        {/* Success Messages */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {successMessage}
          </div>
        )}
        
        {kycVerificationMessage && (
          <div className="fixed top-4 right-4 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {kycVerificationMessage}
          </div>
        )}

        <div className="flex space-x-1 mb-8 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("drivers")}
            className={`px-6 py-3 rounded-md font-medium ${activeTab === "drivers" ? "bg-green-600 dark:bg-green-700 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700"}`}
          >
            <User className="inline w-4 h-4 mr-2" />
            Driver Management
          </button>
        </div>

        {/* Driver Management */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => openModal("onboard")}
              className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg flex items-center font-medium text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Onboard New Driver
            </button>
            <button
              onClick={() => openModal("kyc")}
              className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Bulk KYC Verification
            </button>
            <button
              onClick={() => openModal("manage")}
              className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Profiles
            </button>
          </div>

          {/* Driver Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search drivers by name, email, phone, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={filterKycStatus}
                  onChange={(e) => setFilterKycStatus(e.target.value)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg appearance-none pr-8"
                >
                  <option value="all">All KYC Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSearchTerm("")
                  setFilterKycStatus("all")
                  setSortConfig({ key: null, direction: 'ascending' })
                }}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-300"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Drivers Count */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredDrivers.length} of {drivers.length} drivers
          </div>

          {/* Drivers Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm dark:shadow-none">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">Driver List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center">
                        Name {getSortIcon("name")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium">Contact</th>
                    <th 
                      className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium cursor-pointer"
                      onClick={() => requestSort("kycStatus")}
                    >
                      <div className="flex items-center">
                        KYC Status {getSortIcon("kycStatus")}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium cursor-pointer"
                      onClick={() => requestSort("joinDate")}
                    >
                      <div className="flex items-center">
                        Join Date {getSortIcon("joinDate")}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium cursor-pointer"
                      onClick={() => requestSort("vehicleType")}
                    >
                      <div className="flex items-center">
                        Vehicle {getSortIcon("vehicleType")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map((driver) => (
                      <tr
                        key={driver.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{driver.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">ID: {driver.id}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                          <div>{driver.email}</div>
                          <div>{driver.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`font-medium ${getStatusColor(driver.kycStatus)}`}>
                              {driver.kycStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{driver.joinDate}</td>
                        <td className="px-6 py-4">
                          <div className="text-green-600 dark:text-green-400">
                            {driver.vehicleType || "—"}
                            {driver.licensePlate && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {driver.licensePlate}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusActions(driver.kycStatus, driver.id)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No drivers found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Section */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                  {modalType === "onboard" && "Onboard New Driver"}
                  {modalType === "kyc" && "Bulk KYC Verification"}
                  {modalType === "manage" && "Manage Driver Profiles"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4">
                {/* Onboard New Driver */}
                {modalType === "onboard" && (
                  <>
                    <input
                      type="text"
                      placeholder="Driver Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.name && <p className="text-red-500 dark:text-red-400 text-sm">{errors.name}</p>}

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.email && <p className="text-red-500 dark:text-red-400 text-sm">{errors.email}</p>}

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.phone && <p className="text-red-500 dark:text-red-400 text-sm">{errors.phone}</p>}

                    <input
                      type="text"
                      placeholder="Vehicle Type (e.g., Car, Bike)"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.vehicleType && <p className="text-red-500 dark:text-red-400 text-sm">{errors.vehicleType}</p>}

                    <input
                      type="text"
                      placeholder="License Plate Number"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.licensePlate && <p className="text-red-500 dark:text-red-400 text-sm">{errors.licensePlate}</p>}

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Upload Driver's License
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLicensePhoto(e.target.files[0])}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Upload PAN Card
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPanCardPhoto(e.target.files[0])}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {/* KYC Upload */}
                {modalType === "kyc" && (
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload documents for all drivers with pending KYC status
                    </p>
                    
                    {/* Driver's License Photo */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Upload Driver's License Photos (ZIP)
                      </label>
                      <input
                        type="file"
                        accept=".zip"
                        onChange={(e) => setLicensePhoto(e.target.files[0])}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* PAN Card */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Upload PAN Cards (ZIP)
                      </label>
                      <input
                        type="file"
                        accept=".zip"
                        onChange={(e) => setPanCardPhoto(e.target.files[0])}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Manage Profiles */}
                {modalType === "manage" && (
                  <>
                    {editDriver ? (
                      <>
                        <input
                          type="text"
                          placeholder="Driver Name"
                          value={editDriver.name}
                          onChange={(e) => setEditDriver({ ...editDriver, name: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={editDriver.email}
                          onChange={(e) => setEditDriver({ ...editDriver, email: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={editDriver.phone}
                          onChange={(e) => setEditDriver({ ...editDriver, phone: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Vehicle Type"
                          value={editDriver.vehicleType}
                          onChange={(e) => setEditDriver({ ...editDriver, vehicleType: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="License Plate"
                          value={editDriver.licensePlate}
                          onChange={(e) => setEditDriver({ ...editDriver, licensePlate: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </>
                    ) : (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {drivers.map((driver) => (
                          <div
                            key={driver.id}
                            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                          >
                            <div>
                              <div className="text-gray-900 dark:text-white font-medium">{driver.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {driver.email} | {driver.phone}
                              </div>
                              <div className="text-sm text-green-600 dark:text-green-400">
                                {driver.vehicleType} ({driver.licensePlate})
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditDriver(driver)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDriver(driver.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-3 rounded-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-4 py-3 rounded-lg font-medium text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
