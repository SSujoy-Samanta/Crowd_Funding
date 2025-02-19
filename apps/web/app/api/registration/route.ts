import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import bcrypt from "bcrypt";
import { signUpSchema } from "@repo/common/zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // Parse the JSON body
        const parseBody = signUpSchema.safeParse(body); // Validate using the schema

        if (!parseBody.success) {
            return NextResponse.json(
                { msg: "Wrong Inputs", errors: parseBody.error.errors },
                { status: 411 },
            );
        }

        const user = await db.user.findUnique({
            where: {
                email: parseBody.data.email,
            },
        });
        if (user) {
            return NextResponse.json(
                { msg: "This user already exists!" },
                { status: 409 },
            );
        }
        const verifyEmail=await db.verifyEmail.findUnique({
            where:{
                email:parseBody.data.email
            },
            select:{
                verified:true
            }
        })
        if(!verifyEmail || !verifyEmail.verified){
            return NextResponse.json(
                { msg: "Email must be verified" },
                { status: 411 },
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(parseBody.data.password, salt);

        console.log("Creating new user...");
        await db.user.create({
            data: {
                username: parseBody.data.username,
                email: parseBody.data.email,
                password: hashPassword,
                verified:true,
                address:{
                    create:{
                        country:parseBody.data.country
                    }
                }
            },
        });
        
        return NextResponse.json({ msg: "Registration success.", signup:true }, { status: 200 });
    } catch (error) {
        console.error("Error occurred during signup:", error); 
        return NextResponse.json({ msg: "An error occurred" }, { status: 500 });
    }
}
