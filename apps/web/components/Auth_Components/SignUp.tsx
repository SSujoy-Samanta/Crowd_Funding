"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputWithIcon from "../Inputs/InputWithSvg";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import { IoMdPerson } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { GiWorld } from "react-icons/gi";
import axios from "axios";

export const SignUp = () => {
    const router = useRouter();
    const [username, setUsername] =useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const setNotification=useSetRecoilState(notificationState);

    const handleSignUp = async () => {
        if (!email.trim() || !password || !username || !confirmPassword) {
            if (!username) {
                setError("Please enter your username.");
            } else if (!email.trim()) {
                setError("Please enter your email.");
            } else if (!password) {
                setError("Please enter your password.");
            } else if (!confirmPassword) {
                setError("Please confirm your password.");
            }else{
                setError("Credentials required.");
            }
            return;
        }    
        if(password!=confirmPassword){
            setError("Passwords do not match.");
        }    
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            //const user=await axios.post('/api/signup')
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
        <div className="flex flex-col gap-2 items-center justify-center xl:w-1/5 rounded-md p-4 bg-gradient-to-b from-blue-700 via-blue-900 via-80% to-slate-800 mb-10 md:w-3/6 sm:w-3/5 shadow-xl shadow-blue-800">
            <div className="flex justify-center items-center flex-col gap-1">
                <span className="lg:text-2xl md:text-xl xxs:text-lg bg-gradient-to-b from-amber-200 to-orange-700 bg-white bg-clip-text pr-1 font-black tracking-tighter text-transparent">
                    Register
                </span>
                <span className="text-gray-400 italic">Create your account</span>
            </div>

            <div className="flex flex-col gap-2 pt-4 w-full">
                <InputWithIcon Icon={<IoMdPerson size={20}/>} placeholder="username" setInput={setUsername} input={username} name="name"/>
                <InputWithIcon Icon={<IoMail size={20}/>} placeholder="name@gmail.com" setInput={setEmail} input={email} name="email"/>
                <InputWithIcon Icon={<GiWorld size={20}/>} placeholder="country" setInput={setCountry} input={country} name="country"/>
                <InputWithIcon Icon={<RiLockPasswordFill size={20}/>} placeholder="password" setInput={setPassword} input={password} type="password" name="password"/>
                <InputWithIcon Icon={<TbPasswordUser size={20}/>} placeholder="confirm password" setInput={setConfirmPassword} input={confirmPassword} type="password" name="ConfirmPassword"/>
                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                    onClick={handleSignUp}
                    className={`p-2 rounded-md text-white transition-all duration-300 ease-in-out ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600 active:scale-95"}`}
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>
            </div>

            <div className="flex w-full gap-2 p-1 mt-3">
                {/* Google Login */}
                <div
                    className="flex justify-center items-center w-3/6 h-12 bg-white rounded-md cursor-pointer hover:bg-gray-300 transition-all duration-500 ease-in-out active:scale-95"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                >
                    <FcGoogle size={30}/>
                </div>

                {/* GitHub Login */}
                <div
                    className="w-3/6 h-12 flex items-center justify-center gap-3 font-bold text-white bg-gray-900 border border-gray-700 rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-lg active:scale-95"
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                >
                    <FaGithub size={30}/>
                </div>
            </div>

            <div className="flex justify-start p-2 gap-1 items-center cursor-pointer">
                <div className="text-gray-400">Already have an account?</div>
                <div
                    className="text-pink-600 underline font-semibold hover:text-pink-400 transition-all"
                    onClick={() => router.push("/signin")}
                >
                    Log in
                </div>
            </div>
        </div>
    );
};
