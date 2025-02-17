import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");
    const salt = await bcrypt.genSalt(10);
    // Ensure process.env.SECRET_USER_PASS is defined and not undefined or null
    if (!process.env.SECRET_USER_PASS|| !process.env.DEFAULT_OTP) {
        throw new Error(
            "SECRET_USER_PASS is not defined in the environment variables",
        );
    }
    const hashPassword = await bcrypt.hash(
        process.env.SECRET_USER_PASS,
        salt,
    );
    const hashedOTP = await bcrypt.hash(process.env.DEFAULT_OTP, salt);
    // Create a user with an address and OTP
    const user = await prisma.user.create({
        data: {
            username: "sujoy",
            email: "sujoysamanta1718@gmail.com",
            password: hashPassword,
            verified:true,
            address: {
                create: {
                    mobile: "1234567890",
                    country: "USA",
                    state: "California",
                    city: "Los Angeles",
                },
            },
            otp: {
                create: {
                    OTP: hashedOTP,
                    expired: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
                },
            },
        },
    });
    await prisma.verifyEmail.create({
        data:{
            OTP:hashedOTP,
            email:"sujoysamanta1718@gmail.com",
            verified:true,
            expired: new Date()
        }
    })

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
