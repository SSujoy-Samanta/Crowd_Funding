"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputWithIcon from "../Inputs/InputWithIcon";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ForgetPasswordModal } from "./ForgetPassword";
import { motion } from "framer-motion";
import { LuTriangleAlert } from "react-icons/lu";

export const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);
    const setNotification = useSetRecoilState(notificationState);
    const [forget, setForget] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            if (!email.trim()) {
                setError("Please enter your email.");
            } else if (!password) {
                setError("Please enter your password.");
            } else {
                setError("Email and password are required.");
            }
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: email.trim(),
                password,
            });

            if (res?.error) {
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
                setNotification({ msg: "Login successful", type: "success" });
                router.push("/dashboard");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } }
    };

    if (!mounted) return null;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className=" mt-20 flex flex-col gap-4 items-center justify-center xl:w-1/4 rounded-xl p-8 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 mb-10 md:w-3/6 sm:w-3/5 shadow-2xl shadow-slate-900/60 border border-slate-700/40"
        >
            <motion.div 
                variants={itemVariants}
                className="flex justify-center items-center flex-col gap-2 mb-2"
            >
                <span className="lg:text-3xl md:text-2xl xxs:text-xl bg-gradient-to-b from-blue-400 to-blue-700  bg-clip-text font-black tracking-tight text-transparent">
                    Welcome Back
                </span>
                <span className="text-gray-400 text-sm">Sign in to your account</span>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="flex flex-col gap-4 pt-2 w-full"
            >
                <motion.div variants={itemVariants} className="group">
                    <InputWithIcon 
                        Icon={<IoMail className="text-amber-400 group-focus-within:text-amber-300 transition-colors duration-300" size={20}/>} 
                        placeholder="name@gmail.com" 
                        setInput={setEmail} 
                        input={email} 
                        name="email"
                        className="bg-slate-800/50 border border-slate-700 focus:border-cyan-500 transition-all duration-300"
                    />
                </motion.div>
                
                <motion.div variants={itemVariants} className="group">
                    <InputWithIcon 
                        Icon={<RiLockPasswordFill className="text-gray-400 group-focus-within:text-gray-300 transition-colors duration-300" size={20}/>} 
                        placeholder="password" 
                        setInput={setPassword} 
                        input={password} 
                        type="password" 
                        name="password"
                        className="bg-slate-800/50 border border-slate-700 focus:border-cyan-500 transition-all duration-300"
                    />
                </motion.div>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm px-2 py-1 bg-red-500/10 rounded-md border border-red-500/20"
                    >
                        <LuTriangleAlert className="text-red-400" size={14}/>
                        {error}
                    </motion.div>
                )}

                <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleSignIn}
                    disabled={loading}
                    className={`p-3 rounded-lg text-white font-medium transition-all duration-300 ease-in-out ${
                        loading 
                            ? "bg-gray-600 cursor-not-allowed" 
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/20"
                    } mt-2`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        "Sign In"
                    )}
                </motion.button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center mt-1">
                <button
                    onClick={() => setForget(true)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm"
                >
                    Forgot Password?
                </button>
                {forget && <ForgetPasswordModal setOpen={setForget}/>}
            </motion.div>
           
            <motion.div variants={itemVariants} className="w-full flex items-center gap-4 my-3">
                <div className="flex-1 border-t border-slate-700"></div>
                <span className="text-gray-400 text-sm">or continue with</span>
                <div className="flex-1 border-t border-slate-700"></div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="flex w-full gap-4 mt-1"
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
                    className="w-1/2 h-12 flex items-center justify-center gap-3 text-white bg-slate-800 border border-slate-700 rounded-lg cursor-pointer transition-all duration-300 hover:border-slate-600 hover:bg-slate-700"
                    onClick={() => signIn("github", {redirect: true, callbackUrl: "/dashboard" })}
                >
                    <FaGithub size={24}/>
                </motion.div>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="flex justify-center p-2 gap-1 items-center mt-2"
            >
                <div className="text-gray-400 text-sm">Don't have an account?</div>
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    className="text-cyan-400 font-medium hover:text-cyan-300 transition-all cursor-pointer"
                    onClick={() => router.push("/signup")}
                >
                    Sign up
                </motion.div>
            </motion.div>
        </motion.div>
    );
};