import z from "zod";

export const signUpSchema=z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email structure"), 
    password: z.string().min(6, "Password must be at least 6 characters"),
    country: z.string().min(1, "Country is required"),
})
export const signInpSchema=z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email structure"), 
    password: z.string().min(6, "Password must be at least 6 characters"),
})
export const SentOtp=z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email structure"),
    exist:z.boolean()
})
export const VerifyOtp=z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email structure"),
    otp:z.string().length(4,"OTP should be in 4 digit"),
    exist:z.boolean()
})