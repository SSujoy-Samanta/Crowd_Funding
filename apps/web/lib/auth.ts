
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/db";
import bcrypt from "bcrypt";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signInpSchema } from "@repo/common/zod";
import crypto from "crypto";

interface User {
    id: string;
    email: string;
    name: string;
}

const generateRandomString = (length: number) => {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
};

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
                    if (!isMatch || !user.verified) {
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
        async signIn({ user, account,profile }: any) {
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
                        if (!process.env.SECRET_USER_PASS) {
                            throw new Error(
                                "SECRET_USER_PASS is not defined in the environment variables",
                            );
                        }

                        // Generate a strong random string (12 characters)
                        const randomString = generateRandomString(12);

                        // Create a strong combined password
                        const combinedPassword = `${process.env.SECRET_USER_PASS}${randomString}`;

                        const hashPassword = await bcrypt.hash(
                            combinedPassword,
                            salt,
                        );
                        
                        const newUser = await db.user.create({
                            data: {
                                username:name,
                                email,
                                password: hashPassword,
                                verified:true
                            },
                        });
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