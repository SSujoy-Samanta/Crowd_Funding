"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputWithIcon from "../Inputs/InputWithIcon";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import { IoMdPerson } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import { MdVerified } from "react-icons/md";
import axios from "axios";
import { OTPPopUP } from "./OtpValidator";
import { motion, AnimatePresence } from "framer-motion";
import { LuTriangleAlert } from "react-icons/lu";

export const SignUp = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [otpSent, setOtpSend] = useState<boolean>(false);
    const setNotification = useSetRecoilState(notificationState);
    const [verified, setVerified] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    async function sendOtp() {
        try {
            setLoading(true);
            const response = await axios.post('/api/otp/send', {
                email,
                exist: false
            });
            if (response.data.otp) {
                setNotification({ msg: response.data.msg, type: "success" });
                setOtpSend(true);
            }
        } catch (e:any) {
            if (e.response?.data?.errors) {
                setNotification({
                    msg: e.response?.data?.errors[0]?.message,
                    type: "error",
                });
            } else {
                setNotification({
                    msg: e.response?.data?.msg,
                    type: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSignUp = async () => {
        if (!email.trim() || !password || !username || !country || !confirmPassword || !verified) {
            if (!username) {
                setError("Please enter your username.");
            } else if (!email.trim()) {
                setError("Please enter your email.");
            }else if (country) {
                setError("Please enter your country.");
            }  else if (!password) {
                setError("Please enter your password.");
            } else if (!confirmPassword) {
                setError("Please confirm your password.");
            } else if (!verified) {
                setError("Please verify your email first.");
            } else {
                setError("Credentials required.");
            }
            return;
        }
        if (password != confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError(null); // Clear previous errors
        if (email.trim() && password && username && country && confirmPassword && verified && password === confirmPassword) {
            try {
                const response = await axios.post('/api/registration', {
                    username,
                    email,
                    password,
                    country,
                });
                if (!response.data.signup) {
                    setNotification({ msg: response.data.msg, type: "error" });
                } else {
                    const res = await signIn("credentials", {
                        redirect: false,
                        email: email.trim(),
                        password,
                    });

                    if (res?.error) {
                        setError(res.error);
                        if (res.status === 401) {
                            setError('Invalid Credentials, try again!');
                            setNotification({ msg: "Invalid Credentials, try again!", type: "error" });
                        } else if (res.status === 400) {
                            setError('Missing Credentials!');
                        } else if (res.status === 404) {
                            setError('Account not found!');
                        } else if (res.status === 403) {
                            setError('Forbidden!');
                        } else {
                            setError('Oops, something went wrong!');
                        }
                    } else {
                        router.push("/dashboard");
                        setNotification({ msg: response.data.msg, type: "success" });
                    }
                }
            } catch (e:any) {
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
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.03, transition: { duration: 0.2 } },
        tap: { scale: 0.97, transition: { duration: 0.1 } }
    };

    if (!mounted) return null;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-28 flex flex-col gap-3 items-center justify-center xl:w-1/4 rounded-xl p-6 bg-gradient-to-br from-indigo-800 via-indigo-900 to-slate-900 mb-10 md:w-3/6 sm:w-3/5 shadow-2xl shadow-indigo-900/50 border border-indigo-700/30"
        >
            <motion.div
                variants={itemVariants} 
                className="flex justify-center items-center flex-col gap-2 mb-2"
            >
                <span className="lg:text-3xl md:text-2xl xxs:text-xl bg-gradient-to-b from-slate-200 to-slate-600 bg-clip-text font-black tracking-tight text-transparent">
                    Create Account
                </span>
                <span className="text-gray-300 text-sm">Join our community today</span>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="flex flex-col gap-3 pt-2 w-full"
            >
                <div className="relative group">
                    <InputWithIcon 
                        Icon={<IoMdPerson className="text-amber-400 group-focus-within:text-amber-300 transition-colors duration-300" size={20}/>} 
                        placeholder="Username" 
                        setInput={setUsername} 
                        input={username} 
                        name="name"
                        className="bg-indigo-950/40 border border-indigo-700/50 focus:border-amber-400 transition-all duration-300 rounded-lg p-3 pl-10"
                    />
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: username ? `${Math.min(username.length * 8, 100)}%` : "0%" }}
                        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    />
                </div>

                <div className="relative group">
                    <InputWithIcon 
                        Icon={
                            verified ? 
                            <MdVerified className="text-green-400" size={20}/> : 
                            <IoMail className="text-cyan-400 group-focus-within:text-cyan-300 transition-colors duration-300" size={20}/>
                        } 
                        placeholder="name@gmail.com" 
                        setInput={setEmail} 
                        input={email} 
                        name="email"
                        className={`bg-indigo-950/40 border transition-all duration-300 rounded-lg p-3 pl-10 ${
                            verified ? "border-green-500/50" : "border-indigo-700/50 focus:border-cyan-400"
                        }`}
                    />
                </div>

                <div className="relative group">
                    <InputWithIcon 
                        Icon={<GiWorld className="text-blue-400 group-focus-within:text-blue-300 transition-colors duration-300" size={20}/>} 
                        placeholder="Country" 
                        setInput={setCountry} 
                        input={country} 
                        name="country"
                        className="bg-indigo-950/40 border border-indigo-700/50 focus:border-blue-400 transition-all duration-300 rounded-lg p-3 pl-10"
                    />
                </div>

                <div className="relative group">
                    <InputWithIcon 
                        Icon={<RiLockPasswordFill className="text-gray-400 group-focus-within:text-gray-300 transition-colors duration-300" size={20}/>} 
                        placeholder="Password" 
                        setInput={setPassword} 
                        input={password} 
                        type="password" 
                        name="password"
                        className="bg-indigo-950/40 border border-indigo-700/50 focus:border-gray-400 transition-all duration-300 rounded-lg p-3 pl-10"
                    />
                </div>

                <div className="relative group">
                    <InputWithIcon 
                        Icon={<TbPasswordUser className="text-zinc-400 group-focus-within:text-zinc-300 transition-colors duration-300" size={20}/>} 
                        placeholder="Confirm password" 
                        setInput={setConfirmPassword} 
                        input={confirmPassword} 
                        type="password" 
                        name="ConfirmPassword"
                        className={`bg-indigo-950/40 border transition-all duration-300 rounded-lg p-3 pl-10 ${
                            confirmPassword && password === confirmPassword ? "border-green-500/50" : "border-indigo-700/50 focus:border-zinc-400"
                        }`}
                    />
                    {confirmPassword && password === confirmPassword && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <MdVerified className="text-green-400" size={18}/>
                        </motion.div>
                    )}
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="flex gap-2 items-center text-red-400 text-sm px-3 py-2 bg-red-500/10 rounded-lg border border-red-500/20 mt-1"
                        >
                            <LuTriangleAlert className="text-red-400" size={14}/>
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {email && !verified ? (
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={sendOtp}
                        disabled={loading}
                        className="p-3 rounded-lg text-slate-900 font-medium transition-all duration-300 bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-lg hover:shadow-amber-500/20"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-slate-900 animate-spin"></div>
                                <span>Sending OTP...</span>
                            </div>
                        ) : (
                            "Verify Email"
                        )}
                    </motion.button>
                ) : (
                    <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleSignUp}
                        disabled={loading}
                        className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                            loading 
                                ? "bg-indigo-800/50 text-indigo-300 cursor-not-allowed" 
                                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20"
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </motion.button>
                )}
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="w-full flex items-center gap-4 my-3"
            >
                <div className="flex-1 border-t border-indigo-700/30"></div>
                <span className="text-gray-400 text-sm">or continue with</span>
                <div className="flex-1 border-t border-indigo-700/30"></div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="flex w-full gap-4"
            >
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex justify-center items-center w-1/2 h-12 bg-white/10 backdrop-blur-sm rounded-lg cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300"
                    onClick={() => signIn("google", {redirect: true, callbackUrl: "/dashboard" })}
                >
                    <FcGoogle size={24}/>
                </motion.div>

                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-1/2 h-12 flex items-center justify-center gap-3 text-white bg-gray-900/70 border border-gray-700/50 rounded-lg cursor-pointer transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/80"
                    onClick={() => signIn("github", {redirect: true, callbackUrl: "/dashboard" })}
                >
                    <FaGithub size={24}/>
                </motion.div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="flex justify-center p-2 gap-1 items-center mt-2"
            >
                <div className="text-gray-400 text-sm">Already have an account?</div>
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    className="text-amber-400 font-medium hover:text-amber-300 transition-all cursor-pointer"
                    onClick={() => router.push("/signin")}
                >
                    Sign In
                </motion.div>
            </motion.div>

            {otpSent && <OTPPopUP email={email} otpSent={otpSent} setOtpSend={setOtpSend} setVerified={setVerified}/>}
        </motion.div>
    );
};