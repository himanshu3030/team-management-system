import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./provider/AuthProvider";


export const metadata: Metadata = {
  title: "Team access control",
  description: "Role-based access control system built with Next.js",
  keywords: ["team", "access control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-50 flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        
        </body>
    </html>
  );
}
