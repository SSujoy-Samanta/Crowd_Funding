"use client";

import { useState, SetStateAction, useRef, useEffect } from "react";
import axios from "axios";
import InputWithIcon from "../Inputs/InputWithIcon";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import { motion, AnimatePresence } from "framer-motion";

export const ForgetPasswordModal = ({ setOpen }: { setOpen: React.Dispatch<SetStateAction<boolean>> }) => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(false);
  const setNotification = useSetRecoilState(notificationState);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [setOpen]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/otp/send", { email, exist: true });
      setStep("otp");
      startTimer();
      // Focus on first OTP input
      setTimeout(() => {
        otpRefs[0]?.current?.focus();
      }, 300);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error sending OTP. Please try again.");
    }
    setLoading(false);
  };

  // Handle OTP input focus
  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9A-Z]/g.test(value)) return; // Allow only numbers
    
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input or previous if deleted
    if (value && index < 3) {
      otpRefs[index + 1]?.current?.focus();
    } else if (!value && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  // Handle key press for OTP inputs
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  // Handle pasting OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      otpRefs[3]?.current?.focus();
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    setError("");
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/otp/verify", { email, otp: otpCode, exist: true });
      if (res.data.verified) {
        setStep("reset");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error verifying code. Please try again.");
    }
    setLoading(false);
  };

  // Handle password reset
  const handleResetPassword = async () => {
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put("/api/password/reset", { 
        email, 
        password: newPassword, 
        otp: otp.join("").trim() 
      });
      setNotification({ 
        msg: res.data?.msg || "Password reset successful!", 
        type: "success" 
      });
      setOpen(false);
    } catch (e: any) {
      if (e.response?.data?.errors) {
        const errorMessage = e.response?.data?.errors[0]?.message;
        setError(errorMessage);
        setNotification({
          msg: errorMessage,
          type: "error",
        });
      } else {
        const errorMessage = e.response?.data?.msg || "An error occurred. Please try again.";
        setError(errorMessage);
        setNotification({
          msg: errorMessage,
          type: "error",
        });
      }
    }
    setLoading(false);
  };

  // Resend OTP with cooldown
  const handleResendOtp = async () => {
    if (resendDisabled) return;
    await handleSendOtp();
  };

  // Start timer for OTP resend
  const startTimer = () => {
    setTimer(30);
    setResendDisabled(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step title and icon
  const stepConfig = {
    email: {
      title: "Reset Your Password",
      subtitle: "Enter your email to receive a verification code"
    },
    otp: {
      title: "Enter Verification Code",
      subtitle: `We've sent a code to ${email}`
    },
    reset: {
      title: "Create New Password",
      subtitle: "Your new password must be at least 6 characters"
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        <motion.div 
          ref={modalRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="relative w-full max-w-md overflow-hidden"
        >
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white relative">
              <button 
                onClick={() => setOpen(false)} 
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <IoClose size={24} />
              </button>
              
              <h2 className="text-2xl font-bold">{stepConfig[step].title}</h2>
              <p className="mt-1 text-blue-100">{stepConfig[step].subtitle}</p>
            </div>
            
            {/* Content area */}
            <div className="bg-white dark:bg-gray-900 p-6 relative">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  {/* Step 1: Enter Email */}
                  {step === "email" && (
                    <div className="space-y-4">
                      <InputWithIcon 
                        Icon={<IoMail size={20} className="text-blue-500" />} 
                        placeholder="Your email address" 
                        type="email"
                        setInput={setEmail} 
                        input={email} 
                        name="email" 
                        className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500"
                      />
                      
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendOtp}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                          loading 
                            ? "bg-blue-400 dark:bg-blue-700 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        } transition-all duration-200 flex items-center justify-center`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Verification Code
                          </>
                        ) : (
                          "Continue"
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Step 2: Enter OTP */}
                  {step === "otp" && (
                    <div className="space-y-5">
                      <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { delay: index * 0.1 }
                            }}
                          >
                            <input
                              ref={otpRefs[index]}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              onPaste={index === 0 ? handleOtpPaste : undefined}
                              className="w-14 h-14 text-center text-xl font-semibold bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-300/40 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                            />
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                          loading 
                            ? "bg-blue-400 dark:bg-blue-700 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        } transition-all duration-200 flex items-center justify-center`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying Code
                          </>
                        ) : (
                          "Verify Code"
                        )}
                      </motion.button>
                      
                      <div className="flex flex-col items-center mt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Didn't receive the code?
                        </p>
                        <button
                          onClick={handleResendOtp}
                          disabled={resendDisabled}
                          className={`mt-1 text-sm font-medium ${
                            resendDisabled 
                              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" 
                              : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          }`}
                        >
                          {resendDisabled ? `Resend code in ${timer}s` : "Resend Code"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Reset Password */}
                  {step === "reset" && (
                    <div className="space-y-4">
                      <InputWithIcon 
                        Icon={<RiLockPasswordFill size={20} className="text-blue-500" />} 
                        placeholder="New password" 
                        setInput={setNewPassword} 
                        input={newPassword} 
                        type="password" 
                        name="password" 
                        className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500"
                      />
                      
                      <InputWithIcon 
                        Icon={<TbPasswordUser size={20} className="text-blue-500" />} 
                        placeholder="Confirm new password" 
                        setInput={setConfirmPassword} 
                        input={confirmPassword} 
                        type="password" 
                        name="confirmPassword" 
                        className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500"
                      />
                      
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleResetPassword}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                          loading 
                            ? "bg-blue-400 dark:bg-blue-700 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                        } transition-all duration-200 flex items-center justify-center`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Resetting Password
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Progress indicator */}
              <div className="flex justify-center mt-6">
                {["email", "otp", "reset"].map((s, i) => (
                  <div key={i} className="flex items-center">
                    <div 
                      className={`w-2.5 h-2.5 rounded-full ${
                        s === step 
                          ? "bg-blue-600 dark:bg-blue-400" 
                          : i < ["email", "otp", "reset"].indexOf(step) 
                            ? "bg-blue-400 dark:bg-blue-500" 
                            : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                    {i < 2 && (
                      <div 
                        className={`w-6 h-0.5 ${
                          i < ["email", "otp", "reset"].indexOf(step) 
                            ? "bg-blue-400 dark:bg-blue-500" 
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Back button except for first step */}
              {step !== "email" && (
                <button 
                  onClick={() => setStep(step === "otp" ? "email" : "otp")}
                  className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
                >
                  ← Back to previous step
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};