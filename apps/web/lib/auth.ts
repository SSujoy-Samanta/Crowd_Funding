
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/db";
import bcrypt from "bcrypt";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signInpSchema } from "@repo/common/zod";

interface User {
    id: string;
    email: string;
    name: string;
}
export const NEXT_AUTH={
    providers:[
        CredentialsProvider({
            name: "credintials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "name@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any) {
                try {
                    if(!credentials) return null;
                    const ParseCredentials= signInpSchema.safeParse(credentials);
                    if (!ParseCredentials.success) {
                        console.error("Invalid credentials:", ParseCredentials.error);
                        return null; 
                    }
                    const user = await db.user.findUnique({
                        where: {
                          email: ParseCredentials.data.email,
                        },
                    });
                    if(!user) {
                        console.error("User not found");
                        return null; // Return null for non-existent users
                    }
                    const isMatch = await bcrypt.compare(
                        ParseCredentials.data.password,
                        user.password,
                    );
                    if (!isMatch) {
                        return null;
                    }
                    return {
                        id: String(user.id), // Convert id to string
                        email: user.email,
                        name: user.username,
                    } as User;
                   
                } catch (e:any) {
                    console.log("Internal Server error");
                    console.log(e);
                    return null;
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async signIn({ user, account }: any) {
            if (
              account &&
              user &&
              (account.provider === "google" || account.provider === "github")
            ) {
                try {
                    const { email, name } = user;
        
                    const existUser = await db.user.findUnique({
                        where: {
                            email: email,
                        },
                    });
                    if (!existUser) {
                        const salt = await bcrypt.genSalt(10);
                        // Ensure process.env.SECRET_USER_PASS is defined and not undefined or null
                        if (!process.env.SECRET_USER_PASS || !process.env.DEFAULT_OTP) {
                            throw new Error(
                                "SECRET_USER_PASS is not defined in the environment variables",
                            );
                        }
                        const hashPassword = await bcrypt.hash(
                            process.env.SECRET_USER_PASS,
                            salt,
                        );
                        const hashedOTP = await bcrypt.hash(process.env.DEFAULT_OTP, salt);
                        const newUser = await db.user.create({
                            data: {
                                username:name,
                                email,
                                password: hashPassword,
                                verified:true
                            },
                        });
                        await db.verifyEmail.create({
                            data:{
                                OTP:hashedOTP,
                                email,
                                verified:true,
                                expired: new Date()
                            }
                        })
                        user.id = newUser.id.toString();
                        return true;
                    }
                    user.id = existUser.id.toString();
                    //console.log("user2"+JSON.stringify(user, null, 2));
                    return true;
                } catch (e: any) {
                    console.log("Internal Server error");
                    //console.log(e);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }: any) {
            if (
              account &&
              user &&
              (account.provider === "google" || account.provider === "github")
            ) {
                const { email, name } = user;
                //console.log("user3"+JSON.stringify(user, null, 2));
                try {
                    token.userId = user.id;
                    return token;
                } catch (e: any) {
                    console.log("Internal Server error");
                    console.log(e);
                    return null;
                }
            } else {
              token.userId = token.sub;
              return token;
            }
          },
        session: ({ session, token}: any) => {
            if (session && session.user) {
              session.user.id = token.userId;
            }
            return session;
        },
    }
}