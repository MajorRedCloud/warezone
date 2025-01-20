import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import React from 'react';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "warezone",
  description: "A Storage Management System for your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
