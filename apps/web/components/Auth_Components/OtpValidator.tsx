'use client'
import { notificationState } from "@/lib/atom";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { useSetRecoilState } from "recoil";

interface OTPInterFace {
  email: string;
  otpSent: boolean;
  setOtpSend: React.Dispatch<SetStateAction<boolean>>;
  setVerified:React.Dispatch<SetStateAction<boolean>>;
}

export const OTPPopUP = ({email, otpSent, setOtpSend,setVerified }: OTPInterFace) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // NEW: Track validation status
  const setNotification = useSetRecoilState(notificationState);

  // Start timer for resend OTP
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9A-Z]/g, ""); // Allow only digits and uppercase letters
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Ensure single-digit input
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
        newOtp[index] = ""; // Clear current input
      } else if (index > 0) {
        newOtp[index - 1] = ""; // Clear previous input if current is empty
        document.getElementById(`otp-${index - 1}`)?.focus(); // Move focus back
      }

      setOtp(newOtp);
    }
  };

  const handleSendOtp = async() => {
    if (email) {
      try {
        const response=await axios.post('/api/otp/send',{
          email,
          exist:false
        })
        if (response.data.otp) {
          setNotification({ msg: response.data.msg, type: "success" });
        } else {
          setNotification({ msg: response.data.msg, type: "error" });
          setError(response.data.msg);
        }
      }catch (e:any) {
        if(e.response?.data?.errors){
          setNotification({
            msg:e.response?.data?.errors[0]?.message ,
            type: "error",
          });
        }else{
          setNotification({
            msg:e.response?.data?.msg,
            type: "error",
          });
        }
      }
    }else{
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setOtpSend(true);
    setTimer(30);
    setOtp(["", "", "", ""]);

    console.log(`Sending OTP to ${email}...`);
  };

  const handleResendOtp = async() => {
    if (timer > 0) {
      setError(`Please wait ${timer}s before resending the OTP.`);
      return;
    }
    await handleSendOtp();
    
  };

  const handleSubmit = async () => {
    const otpString = otp.join("").trim();
    setLoading(true); // NEW: Show "Validating..."

    try {
      if (otpString.length < 4) {
        setError("Please enter all 4 digits.");
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/otp/verify', {
        otp: otpString,
        email,
        exist:false
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
      
      if(e.response?.data?.errors){
        setError(e.response?.data?.errors[0]?.message);
        setNotification({
          msg:e.response?.data?.errors[0]?.message ,
          type: "error",
        });
      }else{
        setError(e.response?.data?.msg);
        setNotification({
          msg:e.response?.data?.msg,
          type: "error",
        });
      }
    } finally {
      setLoading(false); // NEW: Hide "Validating..."
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gradient-to-bl from-sky-700 to-black p-8 rounded-lg shadow-lg w-96 relative">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-gray-300 focus:outline-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-1 text-center bg-gradient-to-b from-red-500 to-fuchsia-600 bg-clip-text pr-1 tracking-tighter text-transparent">
          Email Validation via OTP
        </h2>
        <p className="w-full text-center mb-4 text-gray-400">Check your email and don't share the otp.</p>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-amber-700">Email</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md text-white bg-slate-600 font-bold"
            placeholder="Enter your email"
            value={email || "name@gmail.com"}
            readOnly
          />
        </div>

        {/* OTP Input */}
        {otpSent && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-blue-500 mb-2">Enter OTP</label>
            <div className="flex space-x-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 p-3 border border-gray-800 rounded-md text-center bg-slate-400 text-lg font-bold focus:ring-2 focus:ring-blue-300"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col space-y-4">
          {otpSent ? (
            <button
              onClick={handleSubmit}
              className={`${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300`}
              disabled={loading}
            >
              {loading ? "Validating..." : "Validate OTP"}
            </button>
          ) : (
            <button
              onClick={handleSendOtp}
              className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Send OTP
            </button>
          )}

          {otpSent && (
            <button
              onClick={handleResendOtp}
              disabled={timer > 0}
              className={`${
                timer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
        {success && <div className="text-green-500 mt-4 text-sm">Email successfully validated!</div>}
      </div>
    </div>
  );
};
