import React, { useState, useEffect } from 'react';
import { FaCar, FaPlus, FaEdit, FaLink, FaSearch, FaFilter, FaSync, FaUserTie, FaCheckCircle, FaTimesCircle, FaEllipsisH } from 'react-icons/fa';
import { MdDirectionsCar, MdElectricCar, MdTwoWheeler, MdDeliveryDining, MdFastfood } from 'react-icons/md';
import { GiCargoCrate } from 'react-icons/gi';

export default function VehicleManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const vehiclesPerPage = 6;

  // Sample vehicle data with expanded categories
  const vehicles = [
    // Ride vehicles
    {
      id: 'VH1001',
      registration: 'MH01AB1234',
      type: 'car',
      category: 'ride',
      model: 'Toyota Innova',
      year: 2022,
      color: 'White',
      capacity: 7,
      fuelType: 'petrol',
      status: 'active',
      kycStatus: 'verified',
      linkedDriver: 'UID1001',
      driverName: 'Amit Sharma',
      insuranceExpiry: '2024-06-30',
      lastService: '2023-05-15',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'verified' },
        { name: 'Pollution', status: 'pending' }
      ]
    },
    {
      id: 'VH1002',
      registration: 'MH02CD5678',
      type: 'bike',
      category: 'ride',
      model: 'Royal Enfield Classic 350',
      year: 2021,
      color: 'Black',
      capacity: 2,
      fuelType: 'petrol',
      status: 'active',
      kycStatus: 'verified',
      linkedDriver: 'UID1002',
      driverName: 'Rajesh Kumar',
      insuranceExpiry: '2023-12-31',
      lastService: '2023-04-20',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'expired' }
      ]
    },
    {
      id: 'VH1003',
      registration: 'MH03EF9012',
      type: 'ev',
      category: 'ride',
      model: 'Tata Nexon EV',
      year: 2023,
      color: 'Blue',
      capacity: 5,
      fuelType: 'electric',
      status: 'inactive',
      kycStatus: 'pending',
      linkedDriver: null,
      driverName: null,
      insuranceExpiry: '2024-03-15',
      lastService: '2023-06-10',
      documents: [
        { name: 'RC Book', status: 'pending' },
        { name: 'Insurance', status: 'verified' }
      ]
    },
    
    // Food delivery vehicles
    {
      id: 'VH2001',
      registration: 'MH04GH3456',
      type: 'bike',
      category: 'food-delivery',
      model: 'Honda Activa',
      year: 2020,
      color: 'Red',
      capacity: 2,
      fuelType: 'petrol',
      status: 'active',
      kycStatus: 'verified',
      linkedDriver: 'UID2001',
      driverName: 'Sanjay Patel',
      insuranceExpiry: '2023-11-30',
      lastService: '2023-07-05',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'verified' }
      ]
    },
    {
      id: 'VH2002',
      registration: 'MH05IJ6789',
      type: 'bike',
      category: 'food-delivery',
      model: 'TVS Jupiter',
      year: 2021,
      color: 'Grey',
      capacity: 2,
      fuelType: 'petrol',
      status: 'active',
      kycStatus: 'verified',
      linkedDriver: 'UID2002',
      driverName: 'Vijay Mehta',
      insuranceExpiry: '2023-10-15',
      lastService: '2023-08-12',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'verified' }
      ]
    },
    
    // Courier delivery vehicles
    {
      id: 'VH3001',
      registration: 'MH06KL0123',
      type: 'truck',
      category: 'courier-delivery',
      model: 'Tata Ace',
      year: 2019,
      color: 'White',
      capacity: 3,
      fuelType: 'diesel',
      status: 'active',
      kycStatus: 'verified',
      linkedDriver: 'UID3001',
      driverName: 'Ramesh Singh',
      insuranceExpiry: '2023-09-30',
      lastService: '2023-06-25',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'verified' },
        { name: 'Goods Carrier Permit', status: 'verified' }
      ]
    },
    {
      id: 'VH3002',
      registration: 'MH07MN4567',
      type: 'van',
      category: 'courier-delivery',
      model: 'Mahindra Supro',
      year: 2020,
      color: 'Silver',
      capacity: 8,
      fuelType: 'diesel',
      status: 'maintenance',
      kycStatus: 'verified',
      linkedDriver: 'UID3002',
      driverName: 'Suresh Yadav',
      insuranceExpiry: '2023-12-15',
      lastService: '2023-05-18',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'verified' }
      ]
    },
    {
      id: 'VH3003',
      registration: 'MH08OP8901',
      type: 'bike',
      category: 'courier-delivery',
      model: 'Bajaj Pulsar',
      year: 2022,
      color: 'Blue',
      capacity: 2,
      fuelType: 'petrol',
      status: 'active',
      kycStatus: 'verified',
      linkedDriver: 'UID3003',
      driverName: 'Anil Kapoor',
      insuranceExpiry: '2024-01-31',
      lastService: '2023-07-30',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'verified' }
      ]
    },
    {
      id: 'VH1004',
      registration: 'MH04GH3456',
      type: 'car',
      category: 'ride',
      model: 'Maruti Suzuki Ertiga',
      year: 2020,
      color: 'Silver',
      capacity: 7,
      fuelType: 'cng',
      status: 'maintenance',
      kycStatus: 'verified',
      linkedDriver: 'UID1003',
      driverName: 'Vikram Singh',
      insuranceExpiry: '2023-11-30',
      lastService: '2023-07-05',
      documents: [
        { name: 'RC Book', status: 'verified' },
        { name: 'Insurance', status: 'verified' },
        { name: 'Pollution', status: 'verified' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter vehicles based on search, tab, and category
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || vehicle.status === activeTab;
    
    const matchesCategory = activeCategory === 'all' || vehicle.category === activeCategory;
    
    return matchesSearch && matchesTab && matchesCategory;
  });

  // Pagination logic
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'car': return <MdDirectionsCar className="text-blue-500 text-xl" />;
      case 'bike': return <MdTwoWheeler className="text-green-500 text-xl" />;
      case 'ev': return <MdElectricCar className="text-purple-500 text-xl" />;
      case 'truck': return <GiCargoCrate className="text-orange-500 text-xl" />;
      case 'van': return <FaCar className="text-teal-500 text-xl" />;
      default: return <FaCar className="text-gray-500 text-xl" />;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'ride': return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Ride</span>;
      case 'food-delivery': return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Food Delivery</span>;
      case 'courier-delivery': return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Courier</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Unknown</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>;
      case 'inactive': return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Inactive</span>;
      case 'maintenance': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Maintenance</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Unknown</span>;
    }
  };

  const getKycBadge = (status) => {
    switch (status) {
      case 'verified': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Verified</span>;
      case 'pending': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Pending</span>;
      case 'rejected': return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Rejected</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Unknown</span>;
    }
  };

  const handleAddVehicle = () => {
    setShowAddModal(true);
    setEditMode(false);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditMode(true);
    setShowAddModal(true);
  };

  // Skeleton Loading Components
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex gap-1">
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-2 rounded mb-3">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div>
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
          <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
          <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const SkeletonFilter = () => (
    <div className="flex min-h-10 space-x-2 mb-4 overflow-x-auto pb-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <div className="h-[90vh] w-full bg-gray-100 dark:bg-gray-900 flex flex-col overflow-y-scroll">
      {/* Main Content */}
      <div className="flex-1 o flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Fleet Management</h2>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-40 md:w-64 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
              <div className="w-24 h-9 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative sm:block hidden ">
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  className="h-9 w-40 md:w-64 rounded-full border border-gray-400/20 ps-9 text-white dark:bg-gray-700/60 dark:border-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                <FaFilter />
              </button>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                  setActiveCategory('all');
                  setCurrentPage(1);
                }}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <FaSync />
              </button>
              <button 
                onClick={handleAddVehicle}
                className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaPlus /> 
              </button>
            </div>
          )}
        </div>

        {/* Category Filter */}
        {isLoading ? (
          <SkeletonFilter />
        ) : (
          <div className="flex min-h-10 space-x-2 mb-4 overflow-x-auto pb-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              All Categories ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveCategory('ride')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeCategory === 'ride' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              Ride ({vehicles.filter(v => v.category === 'ride').length})
            </button>
            <button
              onClick={() => setActiveCategory('food-delivery')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeCategory === 'food-delivery' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              Food Delivery ({vehicles.filter(v => v.category === 'food-delivery').length})
            </button>
            <button
              onClick={() => setActiveCategory('courier-delivery')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeCategory === 'courier-delivery' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              Courier ({vehicles.filter(v => v.category === 'courier-delivery').length})
            </button>
          </div>
        )}

        {/* Status Filter */}
        {isLoading ? (
          <SkeletonFilter />
        ) : (
          <div className="flex min-h-8 space-x-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeTab === 'all' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              All Status ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeTab === 'active' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              Active ({vehicles.filter(v => v.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeTab === 'inactive' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              Inactive ({vehicles.filter(v => v.status === 'inactive').length})
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${activeTab === 'maintenance' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              Maintenance ({vehicles.filter(v => v.status === 'maintenance').length})
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No vehicles found matching your criteria
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {currentVehicles.map(vehicle => (
                <div 
                  key={vehicle.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {getVehicleIcon(vehicle.type)}
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{vehicle.model}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{vehicle.registration}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getCategoryBadge(vehicle.category)}
                      <div className="flex gap-1">
                        {getStatusBadge(vehicle.status)}
                        {getKycBadge(vehicle.kycStatus)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Year</p>
                      <p className="text-gray-800 dark:text-white">{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Capacity</p>
                      <p className="text-gray-800 dark:text-white">{vehicle.capacity} {vehicle.type === 'bike' ? 'seats' : 'seats'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Fuel Type</p>
                      <p className="text-gray-800 dark:text-white">{vehicle.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Color</p>
                      <p className="text-gray-800 dark:text-white">{vehicle.color}</p>
                    </div>
                  </div>

                  {vehicle.linkedDriver ? (
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded mb-3">
                      <FaUserTie className="text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Linked Driver</p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">{vehicle.driverName} ({vehicle.linkedDriver})</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded mb-3">
                      <FaTimesCircle className="text-yellow-500" />
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">No driver linked</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last Service</p>
                      <p className="text-sm text-gray-800 dark:text-white">{vehicle.lastService}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditVehicle(vehicle)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                        title="Link Driver"
                      >
                        <FaLink />
                      </button>
                      <button 
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        title="More options"
                      >
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredVehicles.length > vehiclesPerPage && (
              <div className="flex justify-center mt-4">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1 
                          ? 'z-10 bg-green-500 border-green-500 text-white' 
                          : 'bg-white border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {editMode ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    defaultValue={selectedVehicle?.registration || ''}
                    placeholder="e.g. MH01AB1234"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                      <option value="ev">Electric Vehicle</option>
                      <option value="truck">Truck</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option value="ride">Ride</option>
                      <option value="food-delivery">Food Delivery</option>
                      <option value="courier-delivery">Courier Delivery</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      defaultValue={selectedVehicle?.model || ''}
                      placeholder="e.g. Toyota Innova"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      defaultValue={selectedVehicle?.year || ''}
                      placeholder="e.g. 2022"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      defaultValue={selectedVehicle?.color || ''}
                      placeholder="e.g. White"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      defaultValue={selectedVehicle?.capacity || ''}
                      placeholder="e.g. 7"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Type</label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="cng">CNG</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                {editMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">KYC Status</label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  {editMode ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}