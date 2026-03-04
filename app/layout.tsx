import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { RoleProvider } from "@/lib/RoleProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpsBridge Command Center",
  description: "Hybrid Knowledge & Culture Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={`${inter.className} bg-[#0B0B10] text-zinc-300 min-h-screen antialiased`}>
        <AuthProvider>
          <RoleProvider>
            {children}
            <Toaster position="bottom-right" />
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
