import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { 
  FiCalendar, FiDollarSign, FiDownload, FiFilter, 
  FiRefreshCw, FiTrendingUp, FiTrendingDown 
} from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const PRIMARY_COLOR = '#10B981'; // Green-500 from your header
const PRIMARY_GRADIENT = 'from-green-400 to-green-600';
const SECONDARY_COLOR = '#3B82F6'; // Blue-500
const DANGER_COLOR = '#EF4444'; // Red-500

export default function ReportsEarning() {
  const [timeRange, setTimeRange] = useState('week');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('earnings');
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [driverFilter, setDriverFilter] = useState('all');

  // Mock data - replace with API calls in a real application
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setChartData(generateChartData(timeRange));
      setSummaryData(generateSummaryData(timeRange));
      setIsLoading(false);
    }, 800);
  }, [timeRange, startDate, endDate, driverFilter]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Adjust dates based on range
    const now = new Date();
    setEndDate(now);
    
    if (range === 'day') {
      setStartDate(now);
    } else if (range === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      setStartDate(weekAgo);
    } else if (range === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      setStartDate(monthAgo);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setChartData(generateChartData(timeRange));
      setSummaryData(generateSummaryData(timeRange));
      setIsLoading(false);
    }, 500);
  };

  const handleExport = () => {
    // In a real app, this would generate a CSV/PDF
    alert(`Exporting data from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
  };

  // Mock data generators - replace with real API calls
  const generateChartData = (range) => {
    const data = [];
    const days = range === 'day' ? 24 : range === 'week' ? 7 : 30;
    
    for (let i = 0; i < days; i++) {
      const baseValue = Math.random() * 1000 + 500;
      const rides = Math.floor(Math.random() * 30 + 10);
      const earnings = Math.floor(baseValue * (driverFilter === 'all' ? 1 : 0.7));
      const cancellations = Math.floor(Math.random() * 5);
      
      if (range === 'day') {
        data.push({
          name: `${i}:00`,
          earnings,
          rides,
          cancellations,
          hour: i
        });
      } else {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        data.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          earnings,
          rides,
          cancellations,
          date: date.toISOString().split('T')[0]
        });
      }
    }
    return data;
  };

  const generateSummaryData = () => {
    const totalEarnings = chartData.reduce((sum, item) => sum + item.earnings, 0);
    const totalRides = chartData.reduce((sum, item) => sum + item.rides, 0);
    const cancellationRate = chartData.reduce((sum, item) => sum + item.cancellations, 0) / totalRides * 100 || 0;
    
    const drivers = [
      { id: 'driver1', name: 'John Doe', earnings: Math.floor(totalEarnings * 0.4), rides: Math.floor(totalRides * 0.4) },
      { id: 'driver2', name: 'Jane Smith', earnings: Math.floor(totalEarnings * 0.3), rides: Math.floor(totalRides * 0.3) },
      { id: 'driver3', name: 'Mike Johnson', earnings: Math.floor(totalEarnings * 0.2), rides: Math.floor(totalRides * 0.2) },
      { id: 'driver4', name: 'Sarah Williams', earnings: Math.floor(totalEarnings * 0.1), rides: Math.floor(totalRides * 0.1) },
    ];
    
    return {
      totalEarnings,
      totalRides,
      cancellationRate: cancellationRate.toFixed(1),
      averageEarningPerRide: (totalEarnings / totalRides).toFixed(2),
      drivers
    };
  };

  return (
 <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Reports & Earnings</h1>
        
        {/* Filters and Controls - Updated colors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTimeRangeChange('day')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === 'day' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => handleTimeRangeChange('week')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === 'week' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => handleTimeRangeChange('month')}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === 'month' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                This Month
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700">
                <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="bg-transparent text-sm w-24 dark:text-white"
                />
                <span className="mx-1 text-gray-500 dark:text-gray-400">to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="bg-transparent text-sm w-24 dark:text-white"
                />
              </div>
              
              <select
                value={driverFilter}
                onChange={(e) => setDriverFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-sm dark:text-white"
              >
                <option value="all">All Drivers</option>
                <option value="driver1">John Doe</option>
                <option value="driver2">Jane Smith</option>
                <option value="driver3">Mike Johnson</option>
              </select>
              
              <button
                onClick={handleRefresh}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                disabled={isLoading}
              >
                <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white text-sm hover:from-green-600 hover:to-green-700"
              >
                <FiDownload className="mr-1" /> Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs - Updated colors */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'earnings' 
                ? 'text-green-500 border-b-2 border-green-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('rides')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'rides' 
                ? 'text-green-500 border-b-2 border-green-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Rides
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'drivers' 
                ? 'text-green-500 border-b-2 border-green-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Drivers
          </button>
        </div>
        
        {/* Summary Cards - Updated colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">${summaryData.totalEarnings?.toLocaleString() || '0'}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-300">
                <FiDollarSign size={20} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <FiTrendingUp className="text-green-500 mr-1" />
              <span className="text-green-500">12.5%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Rides</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{summaryData.totalRides?.toLocaleString() || '0'}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                <FiTrendingUp size={20} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <FiTrendingUp className="text-green-500 mr-1" />
              <span className="text-green-500">8.3%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Avg. per Ride</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">${summaryData.averageEarningPerRide || '0.00'}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-300">
                <FiDollarSign size={20} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <FiTrendingDown className="text-red-500 mr-1" />
              <span className="text-red-500">2.1%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Cancellation Rate</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{summaryData.cancellationRate || '0'}%</p>
              </div>
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300">
                <FiTrendingDown size={20} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <FiTrendingDown className="text-red-500 mr-1" />
              <span className="text-red-500">1.8%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
            </div>
          </div>
        </div>
        
        {/* Main Content - Charts */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Earnings Overview</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" strokeOpacity={0.1} />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            borderColor: '#374151',
                            borderRadius: '0.5rem',
                            color: '#F9FAFB'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorEarnings)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Earnings by Hour</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.slice(0, timeRange === 'day' ? 24 : 7)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="earnings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg  shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Earnings vs Rides</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="earnings" stroke="#3B82F6" strokeWidth={2} dot={false} />
                          <Line yAxisId="right" type="monotone" dataKey="rides" stroke="#10B981" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'rides' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Rides Overview</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rides" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="cancellations" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Cancellation Rate</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="cancellations" stroke="#EF4444" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'drivers' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Driver Earnings Distribution</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={summaryData.drivers || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="earnings"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {summaryData.drivers?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Driver Performance</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50  dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rides</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. per Ride</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                        {summaryData.drivers?.map((driver) => (
                          <tr key={driver.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">{driver.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.rides}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${driver.earnings.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(driver.earnings / driver.rides).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}