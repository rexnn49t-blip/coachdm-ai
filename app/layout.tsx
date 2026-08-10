import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "CoachDM AI",
  description: "AI Sales Assistant for Coaches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-black text-white">
          <ScrollProgress />

          <Navbar />

          <main>{children}</main>

          <BackToTop />
           <Toaster
    richColors
    position="top-right"
  />
        </body>
      </html>
    </ClerkProvider>
  );
}