import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Postman-like UI",
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
          <div className="container mx-auto flex justify-between">
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
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
