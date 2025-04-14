import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DRID - UNIBEN",
  description: "Department of Research, Innovation and Development - UNIBEN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-screen h-screen overflow-x-hidden bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} w-full h-full antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
