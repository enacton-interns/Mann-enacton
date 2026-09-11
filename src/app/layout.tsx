import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/SideBar";
import MobileHeader from "@/components/layout/MobileHeader";

export const metadata: Metadata = {
  title: "ContentForge",
  description: "AI-powered content repurposing engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-[#07090c] dark:text-white antialiased transition-colors">
        <Sidebar />
        <MobileHeader />
        {children}
      </body>
    </html>
  );
}
