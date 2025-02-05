"use client";

import { FileUpload } from "@/components/fileUpload";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Sign Your PDF Documents</h1>
            <p className="mt-4 text-lg text-gray-600">Quick, secure, and easy-to-use PDF signing service</p>
          </div>
          <FileUpload />
        </div>
      </main>
      <Footer />
    </div>
  );
}
