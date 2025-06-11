import React, { useState, useEffect } from 'react';
import {
  FiDownload, FiPrinter, FiMail, FiSearch, FiFilter,
  FiChevronLeft, FiChevronRight, FiPlus, FiEdit, FiTrash2
} from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import format from 'date-fns/format';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

export default function BillingPage() {
  // State for invoices data
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    date: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending',
    description: ''
  });

  // Generate mock invoices data
  useEffect(() => {
    setIsLoading(true);
    const mockInvoices = generateMockInvoices(50);
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
    setIsLoading(false);
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = [...invoices];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(invoice => 
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(invoice => invoice.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter.startDate && dateFilter.endDate) {
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= dateFilter.startDate && invoiceDate <= dateFilter.endDate;
      });
    }
    
    setFilteredInvoices(result);
    setCurrentPage(0); // Reset to first page when filters change
  }, [searchTerm, statusFilter, dateFilter, invoices]);

  // Generate mock invoices
  const generateMockInvoices = (count) => {
    const statuses = ['paid', 'pending', 'overdue', 'cancelled'];
    const customers = [
      'John Smith', 'Emma Johnson', 'Michael Williams', 'Sophia Brown',
      'James Jones', 'Olivia Garcia', 'Robert Miller', 'Ava Davis'
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `INV-${1000 + i}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      amount: (Math.random() * 1000 + 50).toFixed(2),
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `Ride services for ${customers[Math.floor(Math.random() * customers.length)]}`
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  // Open modal for creating new invoice
  const handleNewInvoice = () => {
    setIsEditing(false);
    setCurrentInvoice(null);
    setFormData({
      customerName: '',
      amount: '',
      date: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      description: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing invoice
  const handleEditInvoice = (invoice) => {
    setIsEditing(true);
    setCurrentInvoice(invoice);
    setFormData({
      customerName: invoice.customerName,
      amount: invoice.amount,
      date: new Date(invoice.date),
      dueDate: new Date(invoice.dueDate),
      status: invoice.status,
      description: invoice.description || ''
    });
    setIsModalOpen(true);
  };

  // Save invoice (create or update)
  const handleSaveInvoice = () => {
    if (isEditing) {
      // Update existing invoice
      const updatedInvoices = invoices.map(inv => 
        inv.id === currentInvoice.id ? { ...inv, ...formData } : inv
      );
      setInvoices(updatedInvoices);
    } else {
      // Create new invoice
      const newInvoice = {
        id: `INV-${1000 + invoices.length}`,
        ...formData
      };
      setInvoices([newInvoice, ...invoices]);
    }
    setIsModalOpen(false);
  };

  // Delete invoice
  const handleDeleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    }
  };

  // Download invoice as PDF
const downloadPdf = (invoice) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('INVOICE', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.id}`, 20, 40);
  doc.text(`Date: ${format(new Date(invoice.date), 'MM/dd/yyyy')}`, 20, 50);
  doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'MM/dd/yyyy')}`, 20, 60);
  doc.text(`Bill To: ${invoice.customerName}`, 120, 40);

  doc.autoTable({
    startY: 80,
    head: [['Description', 'Amount']],
    body: [
      [invoice.description, `$${invoice.amount}`],
      ['', ''],
      ['Total', `$${invoice.amount}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  });

  doc.save(`invoice_${invoice.id}.pdf`);
};

  // Get status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Calculate pagination
  const pageCount = Math.ceil(filteredInvoices.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredInvoices.slice(offset, offset + itemsPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Billing & Invoices</h1>
        
        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={dateFilter.startDate}
                  onChange={(date) => setDateFilter({...dateFilter, startDate: date})}
                  selectsStart
                  startDate={dateFilter.startDate}
                  endDate={dateFilter.endDate}
                  placeholderText="Start Date"
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <DatePicker
                  selected={dateFilter.endDate}
                  onChange={(date) => setDateFilter({...dateFilter, endDate: date})}
                  selectsEnd
                  startDate={dateFilter.startDate}
                  endDate={dateFilter.endDate}
                  minDate={dateFilter.startDate}
                  placeholderText="End Date"
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <button
                onClick={handleNewInvoice}
                className="flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <FiPlus className="mr-2" />
                New Invoice
              </button>
            </div>
          </div>
        </div>
        
        {/* Invoices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentItems.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {invoice.customerName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.customerName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-300">
                          ${invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {format(new Date(invoice.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(invoice.status)}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="text-gray-500 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                              title="Download"
                            >
                              <FiDownload className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditInvoice(invoice)}
                              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                              title="Edit"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                              title="Delete"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={(currentPage + 1) * itemsPerPage >= filteredInvoices.length}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">{offset + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(offset + itemsPerPage, filteredInvoices.length)}</span> of{' '}
                      <span className="font-medium">{filteredInvoices.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: pageCount }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i
                              ? 'z-10 bg-green-50 dark:bg-green-900 border-green-500 text-green-600 dark:text-green-300'
                              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage >= pageCount - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Invoice Modal */}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" onClick={() => setIsModalOpen(false)}></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        id="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Invoice Date
                        </label>
                        <DatePicker
                          selected={formData.date}
                          onChange={(date) => handleDateChange('date', date)}
                          selectsStart
                          startDate={formData.date}
                          endDate={formData.dueDate}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Due Date
                        </label>
                        <DatePicker
                          selected={formData.dueDate}
                          onChange={(date) => handleDateChange('dueDate', date)}
                          selectsEnd
                          startDate={formData.date}
                          endDate={formData.dueDate}
                          minDate={formData.date}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSaveInvoice}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-base font-medium text-white hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? 'Update' : 'Create'} Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}