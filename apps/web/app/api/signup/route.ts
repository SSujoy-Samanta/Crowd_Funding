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

        const user = await db.user.findFirst({
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

        const isVeified= await db.verifyEmail.findFirst({
            where:{
                AND:{
                    email: parseBody.data.email,
                    verified:true,
                }
            }
        })
       
        if(!isVeified){
            return NextResponse.json(
                { msg: "Please Veify your Email First!" },
                { status: 403 },
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(parseBody.data.password, salt);

        console.log("Creating new user...");
        const newUser = await db.user.create({
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

        return NextResponse.json({ msg: "Signup successful" }, { status: 200 });
    } catch (error) {
        console.error("Error occurred during signup:", error); // Log the actual error
        return NextResponse.json({ msg: "An error occurred" }, { status: 500 });
    }
}
