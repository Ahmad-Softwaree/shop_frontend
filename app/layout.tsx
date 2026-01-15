import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/shared/scroll-to-top";
import Providers from "./providers";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learning Tracker - Track Your Learning Journey",
  description:
    "A modern web application to track and manage your learning activities. Log courses, books, tutorials, and visualize your progress with insights and analytics.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <Providers>
          <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
          </>
        </Providers>
      </body>
    </html>
  );
}
