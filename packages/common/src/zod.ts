import z from "zod";

const email=z.string()
.min(1, "Email is required")
.email("Invalid email format")
.regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email structure")

const password=z.string()
.min(8, "Password must be at least 8 characters")
.max(32, "Password must not exceed 32 characters")
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one digit")
.regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)")

export const signUpSchema=z.object({
    username: z.string().min(1, "Username is required"),
    email, 
    password,
    country: z.string().min(1, "Country is required"),
})
export const signInpSchema=z.object({
    email, 
    password
})
export const SentOtpSchema=z.object({
    email,
    exist:z.boolean()
})
export const VerifyOtpSchema=z.object({
    email,
    otp:z.string().length(4,"OTP should be in 4 digit"),
    exist:z.boolean()
})
export const ForgetPasswordSchema=z.object({
    email,
    password,
    otp:z.string().length(4,"OTP should be in 4 digit"),
})