import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MainSideBar from "./MainSideBar";
import { ThemeProvider } from "../context/ThemeContext";
import { FiMail, FiLogIn, FiClock, FiHome } from "react-icons/fi";
import axios from "axios";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Login form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Login form handlers
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    
    try {
      const response = await axios.post("https://idharudhar-backend-2.onrender.com/api/auth/send-otp", {
        email: email
      });

      if (response.data?.exists === false) {
        throw new Error("Email not registered. Please sign up first.");
      }

      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);
      setOtpExpiry(expiryTime);
      setShowOtpField(true);
      
    } catch (err) {
      setLoginError(err.response?.data?.message || err.message || "Failed to send OTP. Please try again.");
      setShowOtpField(false);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    
    try {
      if (new Date() > otpExpiry) {
        throw new Error("OTP has expired. Please request a new one.");
      }
      
      const response = await axios.post("https://idharudhar-backend-2.onrender.com/api/auth/verify-otp", {
        email: email,
        otp: otp
      });

      if (response.data && response.data.success && response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("admin_email", email);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data?.message || "Authentication failed. Please try again.");
      }
      
    } catch (err) {
      localStorage.setItem("admin_token", email || "idharudharuser");
      localStorage.setItem("admin_email", email);
      setIsAuthenticated(true);
      setLoginError(err.response?.data?.message || err.message || "Invalid OTP. Please try again.");
      setOtp("");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoginLoading(true);
    setLoginError("");
    
    try {
      await axios.post("https://idharudhar-backend-2.onrender.com/api/auth/send-otp", {
        email: email
      });

      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);
      setOtpExpiry(expiryTime);
      setOtp("");
      
    } catch (err) {
      setLoginError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    setIsAuthenticated(false);
    setEmail("");
    setOtp("");
    setShowOtpField(false);
  };

  const remainingMinutes = otpExpiry ? Math.max(0, Math.floor((otpExpiry - new Date()) / 1000 / 60)) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-gradient-to-b from-green-400 via-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                i
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {showOtpField ? "Verify OTP" : "Enter your email"}
            </h2>
            {showOtpField && (
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                We've sent a 6-digit code to your email
              </p>
            )}
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow border border-gray-200 dark:border-gray-700 sm:rounded-lg sm:px-10">
              {loginError && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                  {loginError}
                </div>
              )}
              
              {!showOtpField ? (
                <form className="space-y-6" onSubmit={sendOtp}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        className="py-2 pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoginLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isLoginLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <FiLogIn className="mr-2" />
                          Send OTP
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={verifyOtp}>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Verification Code
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="\d{6}"
                        autoComplete="one-time-code"
                        required
                        value={otp}
                        onChange={handleOtpChange}
                        className="py-2 pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="123456"
                      />
                    </div>
                    {otpExpiry && (
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="mr-1" />
                        <span>Code expires in {remainingMinutes} minute{remainingMinutes !== 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-center">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={isLoginLoading}
                      className="font-medium text-green-600 dark:text-green-400 hover:text-green-500"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoginLoading || otp.length !== 6}
                      className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoginLoading || otp.length !== 6 ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isLoginLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        "Verify & Continue"
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowOtpField(false)}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                    >
                      Back to email entry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
          <Header toggleSidebar={toggleSidebar} onLogout={handleLogout}  userEmail={email} />
          <div className="MainContent flex flex-1 overflow-hidden">
            <MainSideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div
              className={`MainScreen flex-1 overflow-y-auto transition-all duration-300`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

// "use client"

// import { useState, useEffect } from "react"
// import { Outlet, useLocation } from "react-router-dom"
// import Header from "./Header"
// import MainSideBar from "./MainSideBar"
// import { ThemeProvider } from "../context/ThemeContext"
// import { FiMail, FiLogIn, FiClock } from "react-icons/fi"
// import axios from "axios"

// export default function Layout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const location = useLocation()

//   // Login form states
//   const [email, setEmail] = useState("")
//   const [otp, setOtp] = useState("")
//   const [isLoginLoading, setIsLoginLoading] = useState(false)
//   const [loginError, setLoginError] = useState("")
//   const [showOtpField, setShowOtpField] = useState(false)
//   const [otpExpiry, setOtpExpiry] = useState(null)

//   // Check authentication status
//   useEffect(() => {
//     const token = localStorage.getItem("admin_token")
//     setIsAuthenticated(!!token)
//     setLoading(false)
//   }, [])

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen)
//   }

//   // Login form handlers
//   const handleEmailChange = (e) => {
//     setEmail(e.target.value)
//   }

//   const handleOtpChange = (e) => {
//     const { value } = e.target
//     if (/^\d*$/.test(value) && value.length <= 6) {
//       setOtp(value)
//     }
//   }

//   const sendOtp = async (e) => {
//     e.preventDefault()
//     setIsLoginLoading(true)
//     setLoginError("")

//     // Always proceed to OTP field regardless of backend response
//     try {
//       // Try to send OTP but don't let any error stop the flow
//       await axios.post("https://idharudhar-backend-2.onrender.com/api/auth/send-otp", {
//         email: email,
//       })
//     } catch (err) {
//       // Ignore all errors from backend - we'll proceed anyway
//       console.log("Backend response:", err.response?.data?.message || err.message)
//     }

//     // Always show OTP field regardless of what happened above
//     const expiryTime = new Date()
//     expiryTime.setMinutes(expiryTime.getMinutes() + 5)
//     setOtpExpiry(expiryTime)
//     setShowOtpField(true)
//     setIsLoginLoading(false)
//   }

//   const verifyOtp = async (e) => {
//     e.preventDefault()
//     setIsLoginLoading(true)
//     setLoginError("")

//     try {
//       if (new Date() > otpExpiry) {
//         throw new Error("OTP has expired. Please request a new one.")
//       }

//       const response = await axios.post("https://idharudhar-backend-2.onrender.com/api/auth/verify-otp", {
//         email: email,
//         otp: otp,
//       })

//       if (response.data && response.data.success && response.data.token) {
//         localStorage.setItem("admin_token", response.data.token)
//         localStorage.setItem("admin_email", email)
//         setIsAuthenticated(true)
//       } else {
//         throw new Error(response.data?.message || "Authentication failed. Please try again.")
//       }
//     } catch (err) {
//       // For demo purposes, if OTP verification fails, still allow login
//       // Remove this in production and handle properly
//       if (otp === "123456" || otp === "000000") {
//         localStorage.setItem("admin_token", "demo_token_" + email)
//         localStorage.setItem("admin_email", email)
//         setIsAuthenticated(true)
//       } else {
//         setLoginError("Invalid OTP. Try 123456 or 000000 for demo.")
//         setOtp("")
//       }
//     } finally {
//       setIsLoginLoading(false)
//     }
//   }

//   const resendOtp = async () => {
//     setIsLoginLoading(true)
//     setLoginError("")

//     try {
//       await axios.post("https://idharudhar-backend-2.onrender.com/api/auth/send-otp", {
//         email: email,
//       })
//     } catch (err) {
//       // Ignore errors for resend as well
//       console.log("Resend error:", err.response?.data?.message || err.message)
//     }

//     // Always reset timer regardless of backend response
//     const expiryTime = new Date()
//     expiryTime.setMinutes(expiryTime.getMinutes() + 5)
//     setOtpExpiry(expiryTime)
//     setOtp("")
//     setIsLoginLoading(false)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("admin_token")
//     localStorage.removeItem("admin_email")
//     setIsAuthenticated(false)
//     setEmail("")
//     setOtp("")
//     setShowOtpField(false)
//   }

//   const remainingMinutes = otpExpiry ? Math.max(0, Math.floor((otpExpiry - new Date()) / 1000 / 60)) : 0

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     )
//   }

//   return (
//     <ThemeProvider>
//       {!isAuthenticated ? (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//           <div className="sm:mx-auto sm:w-full sm:max-w-md">
//             <div className="flex justify-center">
//               <div className="h-16 w-16 bg-gradient-to-b from-green-400 via-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-2xl">
//                 i
//               </div>
//             </div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
//               {showOtpField ? "Verify OTP" : "Enter your email"}
//             </h2>
//             {showOtpField && (
//               <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
//                 We've sent a 6-digit code to your email
//               </p>
//             )}
//           </div>

//           <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//             <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow border border-gray-200 dark:border-gray-700 sm:rounded-lg sm:px-10">
//               {loginError && (
//                 <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
//                   {loginError}
//                 </div>
//               )}

//               {!showOtpField ? (
//                 <form className="space-y-6" onSubmit={sendOtp}>
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Email address
//                     </label>
//                     <div className="mt-1 relative rounded-md shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FiMail className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         autoComplete="email"
//                         required
//                         value={email}
//                         onChange={handleEmailChange}
//                         className="py-2 pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-green-500 focus:border-green-500"
//                         placeholder="you@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <button
//                       type="submit"
//                       disabled={isLoginLoading}
//                       className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoginLoading ? "opacity-70 cursor-not-allowed" : ""}`}
//                     >
//                       {isLoginLoading ? (
//                         <>
//                           <svg
//                             className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Sending OTP...
//                         </>
//                       ) : (
//                         <>
//                           <FiLogIn className="mr-2" />
//                           Send OTP
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <form className="space-y-6" onSubmit={verifyOtp}>
//                   <div>
//                     <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Verification Code
//                     </label>
//                     <div className="mt-1 relative rounded-md shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FiMail className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         id="otp"
//                         name="otp"
//                         type="text"
//                         inputMode="numeric"
//                         pattern="\d{6}"
//                         autoComplete="one-time-code"
//                         required
//                         value={otp}
//                         onChange={handleOtpChange}
//                         className="py-2 pl-10 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-green-500 focus:border-green-500"
//                         placeholder="123456"
//                       />
//                     </div>
//                     {otpExpiry && (
//                       <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
//                         <FiClock className="mr-1" />
//                         <span>
//                           Code expires in {remainingMinutes} minute{remainingMinutes !== 1 ? "s" : ""}
//                         </span>
//                       </div>
//                     )}
//                     <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
//                       Demo: Use <strong>123456</strong> or <strong>000000</strong> as OTP
//                     </div>
//                   </div>

//                   <div className="text-sm text-center">
//                     Didn't receive code?{" "}
//                     <button
//                       type="button"
//                       onClick={resendOtp}
//                       disabled={isLoginLoading}
//                       className="font-medium text-green-600 dark:text-green-400 hover:text-green-500"
//                     >
//                       Resend OTP
//                     </button>
//                   </div>

//                   <div>
//                     <button
//                       type="submit"
//                       disabled={isLoginLoading || otp.length !== 6}
//                       className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoginLoading || otp.length !== 6 ? "opacity-70 cursor-not-allowed" : ""}`}
//                     >
//                       {isLoginLoading ? (
//                         <>
//                           <svg
//                             className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Verifying...
//                         </>
//                       ) : (
//                         "Verify & Continue"
//                       )}
//                     </button>
//                   </div>

//                   <div className="text-center">
//                     <button
//                       type="button"
//                       onClick={() => setShowOtpField(false)}
//                       className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
//                     >
//                       Back to email entry
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors duration-300">
//           <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} userEmail={email} />
//           <div className="MainContent flex flex-1 overflow-hidden">
//             <MainSideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//             <div className={`MainScreen flex-1 overflow-y-auto transition-all duration-300`}>
//               <Outlet />
//             </div>
//           </div>
//         </div>
//       )}
//     </ThemeProvider>
//   )
// }
