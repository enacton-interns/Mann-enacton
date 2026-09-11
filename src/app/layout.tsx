import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

const inter = Inter({ subsets: ["latin"], variable: "--font-primary" });

export const metadata: Metadata = {
  title: "InvenPro — Inventory Management System",
  description: "Professional inventory management system for tracking products, suppliers, categories, purchases, and sales.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let role = "STAFF";
  let name = "User";

  if (token) {
    try {
      const payload = await verifyToken(token);
      role = payload.role;
      name = payload.userId || "User";
    } catch (e:any) {
      console.error(e.message)
    }
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans flex flex-col">
        <AppShell role={role} userName={name}>{children}</AppShell>
      </body>
    </html>
  );
}
