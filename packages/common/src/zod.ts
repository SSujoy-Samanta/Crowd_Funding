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

export const CampaignSchema=z.object({
    userId:z.number(),
    metadataId:z.number(),
    transactionHash:z.string().startsWith('0x', { message: "Hash must start with '0x'." }),
    tags: z.array(z.string()).min(3, "At least 3 tags are required").max(5, "No more than 5 tags allowed"),
})

export const MetadataStep1Schema = z.object({
    userId: z.number(),
    metadataId:z.number().nullable(),
    country: z.string().nonempty(),
    state: z.string().nonempty(),
    category: z.string().nonempty(),
});

export const MetadataStep2Schema =z.object({
    userId: z.number(),
    metadataId:z.number(),
    goal:z.string().nonempty()
})


export const MetadataStep3Schema = z.object({
    userId: z.number(),
    metadataId: z.number(),
    title: z.string().nonempty().min(10).max(50),
    description: z.string().nonempty().min(50).max(3000),
});

export const ContributionSchema=z.object({
    walletAddress:z.string().startsWith('0x', { message: "Wallet address must start with '0x'." }),
}) 

export const ContributorsEmailSchema=z.object({
    walletAddress:z.string().startsWith('0x', { message: "Wallet address must start with '0x'." }),
    contractAddress:z.string().startsWith('0x', { message: "Contract address must start with '0x'." }),
    email
})

export const CommentSchema = z.object({
    id: z.number(),
    walletAddress: z.string()
        .startsWith('0x', { message: "Wallet address must start with '0x'." }),
    comment: z.string()
        .min(2, { message: "Comment must be at least 2 characters long." })
        .max(200, { message: "Comment cannot exceed 200 characters." })
});

export const changePasswordSchema=z.object({
    userId: z.number({
        required_error: "User ID is required", 
        invalid_type_error: "User ID must be a number"
    }),
    password
})