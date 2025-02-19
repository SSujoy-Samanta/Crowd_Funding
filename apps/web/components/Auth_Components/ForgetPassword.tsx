"use client";

import { useState, SetStateAction  } from "react";
import axios from "axios";
import InputWithIcon from "../Inputs/InputWithIcon";
import { IoMail } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";

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
  const setNotification=useSetRecoilState(notificationState);

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/otp/send", { email, exist: true });
      setStep("otp");
      startTimer();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error sending OTP.");
    }
    setLoading(false);
  };

  // Handle OTP input focus
  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9A-Z]/g.test(value)) return; // Allow only numbers
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setError("Enter the full 4-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/otp/verify", { email, otp: otpCode,exist:true });
      if (res.data.verified) {
        setStep("reset");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error verifying OTP.");
    }
    setLoading(false);
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res=await axios.put("/api/password/reset", { email, password:newPassword,otp:otp.join("").trim() });
      if(!res.data){
        setNotification({ msg: res.data.msg, type: "error" });
      }
      setNotification({ msg: res.data.msg, type: "success" });
      setOpen(false);
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
    }
    setLoading(false);
  };

  // Resend OTP with cooldown
  const handleResendOtp = async () => {
    if (resendDisabled) return;
    await handleSendOtp();
    setResendDisabled(true);
    startTimer();
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-gradient-to-tr from-teal-800 via-sky-700 to-cyan-600 p-6 rounded-lg shadow-md w-96">
        <button onClick={()=>{setOpen(false)}} className="absolute top-3 right-3 text-black">
          <RxCross2 size={20}/>
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">
          {step === "email"
            ? "Forgot Password?"
            : step === "otp"
            ? "Enter OTP"
            : "Reset Password"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <div>
            <InputWithIcon Icon={<IoMail size={20} color="orange"/>} placeholder="name@gmail.com" setInput={setEmail} input={email} name="email" className="border-slate-800 bg-slate-800"/>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded-md mt-3 hover:bg-blue-600 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === "otp" && (
          <div className="flex flex-col items-center">
            <div className="flex space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border-2 rounded-md focus:outline-none focus:ring focus:border-black bg-slate-300 text-indigo-700 font-bold"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-white p-2 rounded-md mt-3 hover:bg-green-600 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className="mt-2 bg-rose-700 text-white w-full p-2 hover:bg-rose-600 rounded-md"
            >
              {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <div className="flex flex-col justify-center gap-2">
            <InputWithIcon Icon={<RiLockPasswordFill size={20} color="orange"/>} placeholder="password" setInput={setNewPassword} input={newPassword} type="password" name="password" className="border-black"/>
            <InputWithIcon Icon={<TbPasswordUser size={20} color="blue"/>} placeholder="confirm password" setInput={setConfirmPassword} input={confirmPassword} type="password" name="ConfirmPassword" className="border-black"/>
           
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-purple-500 text-white p-2 rounded-md mt-3 hover:bg-purple-600 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


