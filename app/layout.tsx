import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Signer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gray-50`}>
        <div className="min-h-full flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">PDF dokumentum aláírása</h1>
                <p className="mt-4 text-lg text-gray-600">
                  Az aláírt dokumentumról a szolgáltató automatikus másolatot kap
                </p>
              </div>
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
