"use client"

import { useState, useRef, useEffect } from "react"
import { Moon, Sun, X, Bell, MessageCircle } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { Link } from "react-router"

export default function Header({ toggleSidebar, onLogout, userEmail }) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showFullPageNotifications, setShowFullPageNotifications] = useState(false)
  const [showFullPageMessages, setShowFullPageMessages] = useState(false)
  const [activeMessageTab, setActiveMessageTab] = useState("all")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New message from John",
      time: "2 mins ago",
      read: false,
      icon: "fa-envelope",
      type: "message",
      description:
        "John sent you a message about the upcoming project deadline. Please review the attached documents and provide your feedback by tomorrow.",
    },
    {
      id: 2,
      text: "Payment received of $250",
      time: "1 hour ago",
      read: true,
      icon: "fa-dollar-sign",
      type: "payment",
      description:
        "Your payment of $250 has been successfully processed. The transaction ID is #TXN123456789. Thank you for your business!",
    },
    {
      id: 3,
      text: "Your subscription is expiring soon",
      time: "5 hours ago",
      read: false,
      icon: "fa-exclamation-circle",
      type: "warning",
      description:
        "Your premium subscription will expire in 3 days. Renew now to continue enjoying all premium features without interruption.",
    },
    {
      id: 4,
      text: "New feature available: Dark Mode",
      time: "1 day ago",
      read: true,
      icon: "fa-bell",
      type: "update",
      description:
        "We've added a new dark mode feature to improve your viewing experience. You can toggle it using the theme button in the header.",
    },
    {
      id: 5,
      text: "Security alert: New login detected",
      time: "2 days ago",
      read: false,
      icon: "fa-shield-alt",
      type: "security",
      description:
        "A new login was detected from Chrome on Windows. If this wasn't you, please secure your account immediately.",
    },
    {
      id: 6,
      text: "Weekly report is ready",
      time: "3 days ago",
      read: true,
      icon: "fa-chart-bar",
      type: "report",
      description:
        "Your weekly analytics report is now available. View insights about your account activity and performance metrics.",
    },
    {
      id: 7,
      text: "System maintenance scheduled",
      time: "1 week ago",
      read: true,
      icon: "fa-tools",
      type: "maintenance",
      description:
        "Scheduled maintenance will occur on Sunday from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable.",
    },
    {
      id: 8,
      text: "Profile updated successfully",
      time: "1 week ago",
      read: true,
      icon: "fa-user",
      type: "profile",
      description:
        "Your profile information has been updated successfully. All changes are now active across your account.",
    },
  ])
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      text: "Hey, how are you doing with the project?",
      time: "10:30 AM",
      unread: true,
      avatar: "JD",
      type: "work",
      fullMessage:
        "Hey, how are you doing with the project? I wanted to check in on the progress and see if you need any help with the upcoming deadline. The client is expecting the first draft by Friday, so let me know if there's anything I can assist with.",
      priority: "high",
    },
    {
      id: 2,
      sender: "Sarah Smith",
      text: "Meeting at 2 PM tomorrow",
      time: "Yesterday",
      unread: true,
      avatar: "SS",
      type: "meeting",
      fullMessage:
        "Hi! Just a reminder that we have our weekly team meeting scheduled for tomorrow at 2 PM in the conference room. We'll be discussing the Q4 roadmap and reviewing the current project status. Please bring your progress reports.",
      priority: "medium",
    },
    {
      id: 3,
      sender: "Support Team",
      text: "Your ticket #4567 has been resolved",
      time: "Jul 12",
      unread: false,
      avatar: "ST",
      type: "support",
      fullMessage:
        "Good news! Your support ticket #4567 regarding the login issue has been successfully resolved. Our technical team has implemented a fix and the issue should no longer occur. If you experience any further problems, please don't hesitate to contact us.",
      priority: "low",
    },
    {
      id: 4,
      sender: "Alex Johnson",
      text: "Please review the documents I shared",
      time: "Jul 10",
      unread: false,
      avatar: "AJ",
      type: "work",
      fullMessage:
        "Hi there! I've shared some important documents with you via Google Drive. Could you please review them when you get a chance? They contain the updated project specifications and timeline. Your feedback would be greatly appreciated before we proceed to the next phase.",
      priority: "medium",
    },
    {
      id: 5,
      sender: "Marketing Team",
      text: "New campaign launch next week",
      time: "Jul 8",
      unread: false,
      avatar: "MT",
      type: "announcement",
      fullMessage:
        "Exciting news! We're launching our new marketing campaign next week. The campaign will run across all major platforms and we expect significant traffic increases. Please ensure all systems are optimized and ready to handle the additional load.",
      priority: "high",
    },
    {
      id: 6,
      sender: "HR Department",
      text: "Annual performance review reminder",
      time: "Jul 5",
      unread: false,
      avatar: "HR",
      type: "hr",
      fullMessage:
        "This is a friendly reminder that your annual performance review is scheduled for next month. Please start preparing your self-assessment and gather any relevant documentation of your achievements throughout the year.",
      priority: "medium",
    },
    {
      id: 7,
      sender: "Finance Team",
      text: "Expense report approval needed",
      time: "Jul 3",
      unread: false,
      avatar: "FT",
      type: "finance",
      fullMessage:
        "Your expense report for June has been submitted and is pending approval. The total amount is $1,247.50. Please ensure all receipts are attached and properly categorized. We'll process the reimbursement within 5 business days of approval.",
      priority: "low",
    },
    {
      id: 8,
      sender: "IT Security",
      text: "Security training completion required",
      time: "Jun 28",
      unread: false,
      avatar: "IT",
      type: "security",
      fullMessage:
        "As part of our ongoing security initiatives, all employees are required to complete the updated cybersecurity training module by the end of this month. The training covers phishing awareness, password security, and data protection best practices.",
      priority: "high",
    },
  ])
  const [email, setemail] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("admin_email")
    setemail(user)
  })

  const notificationsRef = useRef(null)
  const messagesRef = useRef(null)
  const profileRef = useRef(null)

  const getInitials = (email) => {
    if (!email) return "Ar" // Default if no email
    const parts = email.split("@")[0].split(/[. _-]/)
    return parts
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        !event.target.closest(".notifications")
      ) {
        setShowNotifications(false)
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target) && !event.target.closest(".Messages")) {
        setShowMessages(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target) && !event.target.closest(".profileButton")) {
        setShowProfile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowMessages(false)
    setShowProfile(false)
  }

  const toggleMessages = () => {
    setShowMessages(!showMessages)
    setShowNotifications(false)
    setShowProfile(false)
  }

  const toggleProfile = () => {
    setShowProfile(!showProfile)
    setShowNotifications(false)
    setShowMessages(false)
  }

  const openFullPageNotifications = () => {
    setShowFullPageNotifications(true)
    setShowNotifications(false)
    setShowMessages(false)
    setShowProfile(false)
  }

  const closeFullPageNotifications = () => {
    setShowFullPageNotifications(false)
  }

  const openFullPageMessages = () => {
    setShowFullPageMessages(true)
    setShowNotifications(false)
    setShowMessages(false)
    setShowProfile(false)
  }

  const closeFullPageMessages = () => {
    setShowFullPageMessages(false)
  }

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const markMessageAsRead = (id) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, unread: false } : message)))
  }

  const markAllMessagesAsRead = () => {
    setMessages(messages.map((message) => ({ ...message, unread: false })))
  }

  const filteredMessages = activeMessageTab === "unread" ? messages.filter((m) => m.unread) : messages

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length
  const unreadMessagesCount = messages.filter((m) => m.unread).length

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "message":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400"
      case "payment":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      case "warning":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
      case "security":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      case "update":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400"
      case "report":
        return "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
      case "maintenance":
        return "bg-orange-500/20 text-orange-600 dark:text-orange-400"
      case "profile":
        return "bg-teal-500/20 text-teal-600 dark:text-teal-400"
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400"
    }
  }

  const getMessageTypeColor = (type) => {
    switch (type) {
      case "work":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400"
      case "meeting":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400"
      case "support":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      case "announcement":
        return "bg-orange-500/20 text-orange-600 dark:text-orange-400"
      case "hr":
        return "bg-pink-500/20 text-pink-600 dark:text-pink-400"
      case "finance":
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
      case "security":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case "work":
        return "fa-briefcase"
      case "meeting":
        return "fa-calendar"
      case "support":
        return "fa-life-ring"
      case "announcement":
        return "fa-bullhorn"
      case "hr":
        return "fa-users"
      case "finance":
        return "fa-dollar-sign"
      case "security":
        return "fa-shield-alt"
      default:
        return "fa-envelope"
    }
  }

  // Full Page Notifications Component
  const FullPageNotifications = () => (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Notifications</h1>
          {unreadNotificationsCount > 0 && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadNotificationsCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="text-green-500 hover:text-green-600 text-sm font-medium hover:underline"
          >
            Mark all as read
          </button>
          <button
            onClick={closeFullPageNotifications}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-500 dark:text-gray-400">You're all caught up! Check back later for new updates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 ${
                  !notification.read ? "ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-900/10" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${getNotificationTypeColor(notification.type)}`}
                  >
                    <i className={`fas ${notification.icon} text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-medium ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {notification.text}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                          {notification.description}
                        </p>
                        <div className="flex items-center mt-3 space-x-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <i className="far fa-clock mr-1"></i>
                            {notification.time}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getNotificationTypeColor(notification.type)}`}
                          >
                            {notification.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                          title={notification.read ? "Already read" : "Mark as read"}
                        >
                          <i className={`fas ${notification.read ? "fa-check-circle" : "fa-circle"}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // Full Page Messages Component
  const FullPageMessages = () => (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Messages</h1>
          {unreadMessagesCount > 0 && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{unreadMessagesCount} unread</span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllMessagesAsRead}
            className="text-green-500 hover:text-green-600 text-sm font-medium hover:underline"
          >
            Mark all as read
          </button>
          <button
            onClick={closeFullPageMessages}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages</h3>
            <p className="text-gray-500 dark:text-gray-400">Your inbox is empty. New messages will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 ${
                  message.unread ? "ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-medium shadow-md">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3
                            className={`text-lg font-medium ${message.unread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {message.sender}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(message.priority)}`}
                          >
                            {message.priority} priority
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{message.fullMessage}</p>
                        <div className="flex items-center mt-3 space-x-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <i className="far fa-clock mr-1"></i>
                            {message.time}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getMessageTypeColor(message.type)} flex items-center`}
                          >
                            <i className={`fas ${getMessageIcon(message.type)} mr-1`}></i>
                            {message.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {message.unread && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                        <button
                          onClick={() => markMessageAsRead(message.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                          title={message.unread ? "Mark as read" : "Already read"}
                        >
                          <i className={`fas ${message.unread ? "fa-circle" : "fa-check-circle"}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="h-[8%] w-full border-b-2 border-gray-400/20 dark:border-gray-600/30 flex items-center justify-between px-3 py-5 bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Left Side - Logo and Menu */}
        <div className="LeftSide flex h-full items-center">
          <div className="GreenDot h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-10 bg-gradient-to-b from-green-400 via-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold ">
            i
          </div>
          <h4 className="text-gray-800 dark:text-white font-bold sm:block hidden ms-2 text-2xl transition-colors duration-300">
            IdharUdhar
          </h4>
          <button
            className="MenuToggle-button h-8 w-8 bg-green-600/30 rounded-full flex justify-center items-center text-green-700 dark:text-green-400 ms-4 md:hidden hover:bg-green-600/50 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <i className="fas fa-stream"></i>
          </button>
        </div>

        {/* Right Side - Search, Theme Toggle and Icons */}
        <div className="Right-side h-full flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <div className="InputBox h-7 md:h-8 lg:h-9 w-30 sm:w-40 md:w-50 sm:block hidden relative">
            <input
              type="text"
              placeholder="Search.."
              className="bg-gray-100 dark:bg-gray-800/60 h-full w-full rounded-full border border-gray-300 dark:border-gray-400/20 text-gray-700 dark:text-gray-300 ps-7 md:ps-8 lg:ps-9 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
            />
            <i className="fas fa-search absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs md:text-sm"></i>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex justify-center items-center text-green-500 rounded-full relative hover:bg-green-500/20 hover:text-green-600 transition-all duration-200 text-xs md:text-sm cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <div
              className="notifications h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex justify-center items-center text-green-500 rounded-full relative hover:bg-green-500/20 hover:text-green-600 transition-all duration-200 text-xs md:text-sm cursor-pointer"
              onClick={toggleNotifications}
            >
              <i className="far fa-bell"></i>
              {unreadNotificationsCount > 0 && (
                <div className="NotificationDot absolute -right-1 top-0 h-2 w-2 md:h-3 md:w-3 bg-green-400 rounded-full text-[8px] md:text-[10px] text-white flex items-center justify-center">
                  {unreadNotificationsCount}
                </div>
              )}
            </div>

            {showNotifications && (
              <div
                ref={notificationsRef}
                className="absolute sm:right-0 -right-14 mt-2 sm:w-80 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 transform transition-all duration-200 origin-top"
                style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-gray-800 dark:text-white font-semibold">Notifications</h3>
                  <button onClick={markAllAsRead} className="text-green-400 text-xs hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications available</div>
                  ) : (
                    notifications.slice(0, 4).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 flex items-start ${!notification.read ? "bg-green-50 dark:bg-gray-700/30" : ""}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${notification.read ? "bg-gray-200 dark:bg-gray-600/30" : "bg-green-500/20"} mr-3`}
                        >
                          <i
                            className={`fas ${notification.icon} ${notification.read ? "text-gray-500 dark:text-gray-400" : "text-green-400"} text-sm`}
                          ></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm truncate ${notification.read ? "text-gray-600 dark:text-gray-300" : "text-gray-800 dark:text-white font-medium"}`}
                          >
                            {notification.text}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="ml-2 w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                  <button
                    onClick={openFullPageNotifications}
                    className="text-green-400 text-sm hover:underline font-medium"
                  >
                    View More
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages Dropdown */}
          <div className="relative">
            <div
              className="Messages h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex justify-center items-center text-green-500 rounded-full relative hover:bg-green-500/20 hover:text-green-600 transition-all duration-200 text-xs md:text-sm cursor-pointer"
              onClick={toggleMessages}
            >
              <i className="far fa-comment-alt"></i>
              {unreadMessagesCount > 0 && (
                <div className="NotificationDot absolute -right-1 top-0 h-2 w-2 md:h-3 md:w-3 bg-green-400 rounded-full text-[8px] md:text-[10px] text-white flex items-center justify-center">
                  {unreadMessagesCount}
                </div>
              )}
            </div>

            {showMessages && (
              <div
                ref={messagesRef}
                className="absolute sm:right-0 -right-10 mt-2 sm:w-80 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 transform transition-all duration-200 origin-top"
                style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-gray-800 dark:text-white font-semibold">Messages</h3>
                  <div className="flex mt-2 border-b border-gray-200 dark:border-gray-700 -mx-3">
                    <button
                      className={`flex-1 py-1 text-xs font-medium ${activeMessageTab === "all" ? "text-green-400 border-b-2 border-green-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"}`}
                      onClick={() => setActiveMessageTab("all")}
                    >
                      All Messages
                    </button>
                    <button
                      className={`flex-1 py-1 text-xs font-medium ${activeMessageTab === "unread" ? "text-green-400 border-b-2 border-green-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"}`}
                      onClick={() => setActiveMessageTab("unread")}
                    >
                      Unread ({unreadMessagesCount})
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {filteredMessages.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">No messages found</div>
                  ) : (
                    filteredMessages.slice(0, 4).map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 flex items-start ${message.unread ? "bg-blue-50 dark:bg-gray-700/30" : ""}`}
                        onClick={() => markMessageAsRead(message.id)}
                      >
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium mr-3">
                          {message.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h4
                              className={`text-sm truncate ${message.unread ? "text-gray-800 dark:text-white font-medium" : "text-gray-600 dark:text-gray-300"}`}
                            >
                              {message.sender}
                            </h4>
                            <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 whitespace-nowrap">
                              {message.time}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 truncate">{message.text}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getPriorityColor(message.priority)}`}
                            >
                              {message.priority}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getMessageTypeColor(message.type)}`}
                            >
                              {message.type}
                            </span>
                          </div>
                        </div>
                        {message.unread && <div className="ml-2 w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>}
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                  <button onClick={openFullPageMessages} className="text-green-400 text-sm hover:underline font-medium">
                    View More
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              className="profileButton h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white flex items-center justify-center font-semibold hover:bg-gradient-to-l transition-all duration-700 text-xs md:text-sm lg:text-base cursor-pointer shadow-lg hover:shadow-green-500/20"
              onClick={toggleProfile}
            >
              {getInitials(email)}
            </div>

            {showProfile && (
              <div
                ref={profileRef}
                className="absolute right-0 mt-2  bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 transform transition-all duration-200 origin-top"
                style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white flex items-center justify-center font-semibold shadow-md">
                      {getInitials(email)}
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 dark:text-white font-medium">
                        {email ? email.split("@")[0] : "User"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{email || "admin@idharudhar.com"}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    to="bills"
                    className="bloc px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-colors duration-150 flex items-center"
                  >
                    <i className="fas fa-credit-card mr-3 text-gray-500 dark:text-gray-400 w-4 text-center"></i>
                    Billing
                  </Link>
                  <Link
                    to=""
                    className="bloc px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-colors duration-150 flex items-center"
                  >
                    <i className="fas fa-tachometer-alt mr-3 text-gray-500 dark:text-gray-400 w-4 text-center"></i>
                    Dashboard
                  </Link>
                </div>
                <div className="py-1 border-t border-gray-200 dark:border-gray-700" onClick={onLogout}>
                  <a
                    href="#"
                    className="bloc px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-150 flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-4 text-center"></i>
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Page Notifications Overlay */}
      {showFullPageNotifications && <FullPageNotifications />}

      {/* Full Page Messages Overlay */}
      {showFullPageMessages && <FullPageMessages />}
    </>
  )
}
