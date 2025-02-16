import z from "zod";

export const signUpSchema=z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    country: z.string().min(1, "Country is required"),
})
export const signInpSchema=z.object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})