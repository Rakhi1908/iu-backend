import React, { useState, useEffect } from 'react';
import { FaCar, FaMotorcycle, FaTruck, FaUserAlt, FaRupeeSign, FaChartLine, FaMoon, FaSun, FaSearch, FaStream, FaCommentAlt, FaPaperclip } from 'react-icons/fa';
import { RiRestaurantFill } from 'react-icons/ri';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    todayRides: 0,
    totalDrivers: 0,
    todayIncome: 0,
    completedRides: 0,
    cancelledRides: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Chart data
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [32000, 29000, 42000, 38000, 45000, 52000, 48000],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const serviceDistributionData = {
    labels: ['Uber (Rides)', 'Swiggy (Food)', 'Porter (Delivery)'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(22, 163, 74, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(22, 163, 74, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#adb5bd',
        }
      },
      title: {
        display: true,
        text: 'Weekly Revenue',
        color: '#adb5bd',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#adb5bd',
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.5)',
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.5)',
        }
      }
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#adb5bd',
        }
      },
      title: {
        display: true,
        text: 'Service Distribution',
        color: '#adb5bd',
      },
    },
  };

  useEffect(() => {
    // Simulate API fetch
    const fetchData = () => {
      setTimeout(() => {
        setStats({
          todayRides: 142,
          totalDrivers: 356,
          todayIncome: 45230,
          completedRides: 128,
          cancelledRides: 14
        });

        setRecentRides([
          { id: 1, service: 'Ride', type: 'ride', user: 'Amit Sharma', time: '10:30 AM', status: 'completed', amount: 245 },
          { id: 2, service: 'Food-Delivery', type: 'food', user: 'Priya Patel', time: '11:15 AM', status: 'in-progress', amount: 180 },
          { id: 3, service: 'Courier-Delivery', type: 'delivery', user: 'Rahul Verma', time: '12:45 PM', status: 'pending', amount: 320 },
          { id: 4, service: 'Ride', type: 'ride', user: 'Neha Gupta', time: '1:30 PM', status: 'completed', amount: 195 },
          { id: 5, service: 'Food-Delivery', type: 'food', user: 'Vikram Singh', time: '2:15 PM', status: 'completed', amount: 225 },
        ]);

        setIsLoading(false);
      }, 1500);
    };

    fetchData();
  }, []);

  const getServiceIcon = (service) => {
    switch (service) {
      case 'Rides': return <FaCar className="text-blue-500" />;
      case 'Food-Delivery': return <RiRestaurantFill className="text-orange-500" />;
      case 'Courier-Delivery': return <FaTruck className="text-green-500" />;
      default: return <FaMotorcycle className="text-purple-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredRides = activeTab === 'all' 
    ? recentRides 
    : recentRides.filter(ride => ride.service === activeTab);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* Dashboard Content */}
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">Dashboard Overview</h1>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-32 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg dark:hover:shadow-2xl dark:hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Today's Rides</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{stats.todayRides}</h3>
                </div>
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FaCar className="text-blue-500 dark:text-blue-300 text-lg md:text-xl" />
                </div>
              </div>
              <div className="mt-2 md:mt-4 flex items-center text-xs md:text-sm text-green-600 dark:text-green-400">
                <FaChartLine className="mr-1" />
                <span>12% from yesterday</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg dark:hover:shadow-2xl dark:hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Drivers</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{stats.totalDrivers}</h3>
                </div>
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FaUserAlt className="text-green-500 dark:text-green-300 text-lg md:text-xl" />
                </div>
              </div>
              <div className="mt-2 md:mt-4 flex items-center text-xs md:text-sm text-green-600 dark:text-green-400">
                <FaChartLine className="mr-1" />
                <span>8 new this week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg dark:hover:shadow-2xl dark:hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Today's Income</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">₹{stats.todayIncome.toLocaleString()}</h3>
                </div>
                <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <FaRupeeSign className="text-purple-500 dark:text-purple-300 text-lg md:text-xl" />
                </div>
              </div>
              <div className="mt-2 md:mt-4 flex items-center text-xs md:text-sm text-green-600 dark:text-green-400">
                <FaChartLine className="mr-1" />
                <span>18% from yesterday</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg dark:hover:shadow-2xl dark:hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Completed</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{stats.completedRides}</h3>
                </div>
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FaCar className="text-green-500 dark:text-green-300 text-lg md:text-xl" />
                </div>
              </div>
              <div className="mt-2 md:mt-4 flex items-center text-xs md:text-sm text-green-600 dark:text-green-400">
                <FaChartLine className="mr-1" />
                <span>90% success rate</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg dark:hover:shadow-2xl dark:hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Cancelled</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{stats.cancelledRides}</h3>
                </div>
                <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <FaCar className="text-red-500 dark:text-red-300 text-lg md:text-xl" />
                </div>
              </div>
              <div className="mt-2 md:mt-4 flex items-center text-xs md:text-sm text-red-600 dark:text-red-400">
                <FaChartLine className="mr-1" />
                <span>10% cancellation rate</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-3">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">Recent Activities</h2>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                    activeTab === 'all' 
                      ? 'bg-green-500 text-white dark:bg-green-600' 
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveTab('Ride')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                    activeTab === 'uber' 
                      ? 'bg-blue-500 text-white dark:bg-blue-600' 
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Rides
                </button>
                <button 
                  onClick={() => setActiveTab('Food-Delivery')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                    activeTab === 'swiggy' 
                      ? 'bg-orange-500 text-white dark:bg-orange-600' 
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Food
                </button>
                <button 
                  onClick={() => setActiveTab('Courier-Delivery')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium ${
                    activeTab === 'porter' 
                      ? 'bg-green-600 text-white dark:bg-green-700' 
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-600/20">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {filteredRides.map((ride) => (
                      <tr key={ride.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 hover:rounded-lg">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 flex items-center justify-center">
                              {getServiceIcon(ride.service)}
                            </div>
                            <div className="ml-2 md:ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{ride.service}</div>
                              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 capitalize">{ride.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{ride.user}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{ride.time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ride.status)}`}>
                            {ride.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ₹{ride.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-3 md:mb-4">Daily Revenue</h3>
            <div className="h-64 md:h-80 w-full">
              <Bar data={revenueData} options={revenueOptions} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-3 md:mb-4">Service Distribution</h3>
            <div className="h-64 md:h-80 w-full">
              <Pie data={serviceDistributionData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}