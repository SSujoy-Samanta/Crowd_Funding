'use client'
import { notificationState } from "@/lib/atom";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { useSetRecoilState } from "recoil";
import { motion } from "framer-motion";
import { CheckCircle, Mail, XCircle, Clock, AlertCircle } from "lucide-react";

interface OTPInterFace {
  email: string;
  otpSent: boolean;
  setOtpSend: React.Dispatch<SetStateAction<boolean>>;
  setVerified: React.Dispatch<SetStateAction<boolean>>;
}

export const OTPPopUP = ({ email, otpSent, setOtpSend, setVerified }: OTPInterFace) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const setNotification = useSetRecoilState(notificationState);

  // Start timer for resend OTP
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9A-Z]/g, "");
    // Fixed: Remove inputType check as it might not be available in all event types
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus to next input
    if (index < otp.length - 1 && value) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        document.getElementById(`otp-${index - 1}`)?.focus();
      }

      setOtp(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9A-Z]/g, "").slice(0, 4);
    if (pastedData) {
      // Fixed: Ensure we're handling each character as a string
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 4; i++) {
        // Fixed: Ensure index access is within bounds
        const char = pastedData.charAt(i);
        newOtp[i] = char;
      }
      setOtp(newOtp);
    }
  };

  const handleSendOtp = async () => {
    if (email) {
      setLoading(true);
      try {
        const response = await axios.post('/api/otp/send', {
          email,
          exist: false
        });
        if (response.data.otp) {
          setNotification({ msg: response.data.msg, type: "success" });
        } else {
          setNotification({ msg: response.data.msg, type: "error" });
          setError(response.data.msg);
        }
      } catch (e: any) {
        if (e.response?.data?.errors) {
          setNotification({
            msg: e.response?.data?.errors[0]?.message,
            type: "error",
          });
          setError(e.response?.data?.errors[0]?.message);
        } else {
          setNotification({
            msg: e.response?.data?.msg,
            type: "error",
          });
          setError(e.response?.data?.msg);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setOtpSend(true);
    setTimer(30);
    setOtp(["", "", "", ""]);
  };

  const handleResendOtp = async () => {
    if (timer > 0) {
      setError(`Please wait ${timer}s before resending the OTP.`);
      return;
    }
    await handleSendOtp();
  };

  const handleSubmit = async () => {
    const otpString = otp.join("").trim();
    setLoading(true);

    try {
      if (otpString.length < 4) {
        setError("Please enter all 4 digits.");
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/otp/verify', {
        otp: otpString,
        email,
        exist: false
      });

      if (response.data.verified) {
        setSuccess(true);
        setVerified(true);
        setOtpSend(false);
        setNotification({ msg: "OTP Verification Successfully", type: "success" });
      } else {
        setNotification({ msg: response.data.msg, type: "error" });
        setError(response.data.msg);
      }
    } catch (e: any) {
      if (e.response?.data?.errors) {
        setError(e.response?.data?.errors[0]?.message);
        setNotification({
          msg: e.response?.data?.errors[0]?.message,
          type: "error",
        });
      } else {
        setError(e.response?.data?.msg);
        setNotification({
          msg: e.response?.data?.msg,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOtp(["", "", "", ""]);
    setOtpSend(false);
    setTimer(30);
    setError(null);
    setSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl w-96 relative border border-slate-700"
      >
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white focus:outline-none transition-colors duration-200"
        >
          <XCircle size={24} />
        </button>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
              <Mail size={30} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-1 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Verify Your Email
          </h2>
          
          <p className="w-full text-center mb-6 text-slate-400 text-sm">
            We've sent a verification code to your email
          </p>
        </motion.div>

        {/* Email Display */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="py-2 px-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center">
            <Mail size={16} className="text-indigo-400 mr-2" />
            <p className="text-slate-200 text-sm font-medium truncate">{email || "name@gmail.com"}</p>
          </div>
        </motion.div>

        {/* OTP Input */}
        {otpSent && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-indigo-400 mb-3 text-center">
              Enter Verification Code
            </label>
            <div className="flex space-x-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <input
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 p-1 border border-slate-700 rounded-lg text-center bg-slate-800/80 text-xl font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    autoFocus={index === 0}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timer display when OTP sent */}
        {otpSent && timer > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center text-sm text-slate-400 mb-4"
          >
            <Clock size={14} className="mr-1" />
            <span>Resend available in {timer}s</span>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col space-y-3"
        >
          {otpSent ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className={`
                relative w-full py-3 rounded-lg font-medium transition-all duration-200 overflow-hidden
                ${loading 
                  ? "bg-slate-700 text-slate-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span>Verify Code</span>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendOtp}
              disabled={loading}
              className={`
                relative w-full py-3 rounded-lg font-medium transition-all duration-200 overflow-hidden
                ${loading 
                  ? "bg-slate-700 text-slate-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span>Send Verification Code</span>
              )}
            </motion.button>
          )}

          {otpSent && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResendOtp}
              disabled={timer > 0}
              className={`
                w-full py-3 rounded-lg font-medium text-sm transition-all duration-200
                ${timer > 0 
                  ? "bg-slate-800/80 text-slate-500 cursor-not-allowed" 
                  : "bg-slate-800 text-indigo-400 hover:bg-slate-700/80 border border-slate-700/50"
                }
              `}
            >
              Resend Code
            </motion.button>
          )}
        </motion.div>

        {/* Error and Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-2 bg-red-900/20 border border-red-800/30 rounded-lg flex items-center text-sm text-red-400"
          >
            <AlertCircle size={14} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-2 bg-green-900/20 border border-green-800/30 rounded-lg flex items-center text-sm text-green-400"
          >
            <CheckCircle size={14} className="mr-2 flex-shrink-0" />
            <span>Email successfully verified!</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};