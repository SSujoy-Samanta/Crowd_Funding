import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "../components/Provider";
import { Notification } from "@/components/notification";
import { AuthButtons } from "@/components/AuthButton";
import { AppBar } from "@/components/AppBar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-900  text-white`}>
        <Provider>
          <AppBar/>
          {children}
          <Notification/>
        </Provider>
      </body>
    </html>
  );
}
