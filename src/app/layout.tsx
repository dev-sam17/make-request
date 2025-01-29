import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  fallback: ["Arial", "sans-serif"],
});

export const metadata = {
  title: "Make Request",
  description: "A simple Postman-like UI built with React",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container-fluid mx-auto flex justify-between">
            <Link href="/" className="text-xl font-bold">
              MAKE REQUEST
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-gray-300">
                Make Request
              </Link>
              <Link href="/manage-urls" className="hover:text-gray-300">
                Manage URLs
              </Link>
              <Link href="/formatter" className="hover:text-gray-300">
                Format JSON
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
