import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "../components/Provider";
import { Notification } from "@/components/notification";
import { AuthButtons } from "@/components/AuthButton";
import { AppBar } from "@/components/AppBar";
import { Sidebar } from "@/components/Sidebar/SideBar";
import { cookieToInitialState } from "wagmi";
import getConfig from "next/config";
import { headers } from "next/headers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Decentralized Crowd Funding",
  description: "Decentralized Crowd Funding",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie')
  )
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-900  text-white`}>
        <Provider initialState={initialState}>
          <div className="relative flex min-h-screen flex-col">
            <AppBar/>
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </div>
          <Notification/>
        </Provider>
      </body>
    </html>
  );
}
