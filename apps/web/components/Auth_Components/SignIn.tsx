"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputWithIcon from "../Inputs/InputWithIcon";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {  ForgetPasswordModal } from "./ForgetPassword";
import Button from "../Buttons/buttons";
export const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const setNotification=useSetRecoilState(notificationState);
    const [forget,setForget]=useState<boolean>(false);

    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            if (!email.trim()) {
                setError("Please enter your email.");
            }else if (!password) {
                setError("Please enter your password.");
            }else{
                setError("Email and password are required.");
            }
            return;
        }

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            const res = await signIn("credentials", {
                redirect: false, // Prevent auto-redirect for error handling
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
                    setError('oops something went wrong..!');
                }
            } else {
                setNotification({ msg: "Log in successfull", type: "success" });
                router.push("/dashboard"); // Redirect only on success
            }
        } catch (error: any) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col gap-2 items-center justify-center xl:w-1/5 rounded-md p-4 bg-gradient-to-b from-slate-700 via-slate-800 via-80% to-slate-800 mb-10 md:w-3/6 sm:w-3/5 shadow-xl shadow-slate-600">
            <div className="flex justify-center items-center flex-col gap-1">
                <span className="lg:text-2xl md:text-xl xxs:text-lg bg-gradient-to-b from-green-400 to-cyan-500 bg-white bg-clip-text pr-1 font-black tracking-tighter text-transparent">
                    Welcome Back
                </span>
                <span className="text-gray-400 italic">Login to your account</span>
            </div>

            <div className="flex flex-col gap-2 pt-4 w-full">
                <InputWithIcon Icon={<IoMail size={20}/>} placeholder="name@gmail.com" setInput={setEmail} input={email} name="email"/>
                <InputWithIcon Icon={<RiLockPasswordFill size={20}/>} placeholder="password" setInput={setPassword} input={password} type="password" name="password"/>
                
                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                    onClick={handleSignIn}
                    className={`p-2 rounded-md text-white transition-all duration-300 ease-in-out ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 active:scale-95"} mt-1`}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </div>
            
            <div className="text-center">
                <button
                    onClick={() => setForget(true)}
                    className="text-fuchsia-600 hover:text-fuchsia-700 hover:underline focus:outline-none"
                >
                    Forgot Password?
                </button>
                {forget && <ForgetPasswordModal setOpen={setForget}/>}
            </div>
           
            

            <div className="flex w-full gap-2 p-1 mt-1">
                {/* Google Login */}
                <div
                    className="flex justify-center items-center w-3/6 h-12 bg-white rounded-md cursor-pointer hover:bg-gray-300 transition-all duration-500 ease-in-out active:scale-95"
                    onClick={() => signIn("google", {redirect: true, callbackUrl: "/dashboard" })}
                >
                    <FcGoogle size={30}/>
                </div>

                {/* GitHub Login */}
                <div
                    className="w-3/6 h-12 flex items-center justify-center gap-3 font-bold text-white bg-gray-900 border border-gray-700 rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-lg active:scale-95"
                    onClick={() => signIn("github", {redirect: true, callbackUrl: "/dashboard" })}
                >
                    <FaGithub size={30}/>
                </div>
            </div>

            <div className="flex justify-start p-2 gap-1 items-center cursor-pointer">
                <div className="text-gray-400">Don't have an account?</div>
                <div
                    className="text-blue-500 underline font-semibold hover:text-blue-400 transition-all"
                    onClick={() => router.push("/signup")}
                >
                    Sign up
                </div>
            </div>
        </div>
    );
};
