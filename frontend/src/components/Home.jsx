import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white text-center px-6">
      
      {/* 🌍 Hero Section */}
      <section className="max-w-3xl">
        <h1 className="text-5xl font-bold text-emerald-600 mb-4">
          Welcome to Your Project
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Build fast, scalable, and elegant web applications with React, Tailwind, and shadcn/ui.
        </p>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-lg rounded-xl shadow-lg transition">
          Get Started
        </Button>
      </section>

      {/* 💡 About Section */}
      <section className="mt-20 max-w-4xl">
        <h2 className="text-3xl font-semibold text-emerald-700 mb-4">About This App</h2>
        <p className="text-gray-700 leading-relaxed">
          This landing page serves as your starting point. Easily extend it with new sections like
          <span className="font-semibold text-emerald-600"> Services</span>, 
          <span className="font-semibold text-emerald-600"> Projects</span>, and 
          <span className="font-semibold text-emerald-600"> Contact</span> — all styled with Tailwind CSS and
          prebuilt shadcn components.
        </p>
      </section>

      {/* 🚀 Highlights Section */}
      <section className="mt-20 grid gap-6 md:grid-cols-3 w-full max-w-5xl">
        <Card className="shadow-md border-emerald-100">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">⚡ Fast</h3>
            <p className="text-gray-600 text-sm">
              Lightweight and optimized for performance from the ground up.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-emerald-100">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">🧩 Modular</h3>
            <p className="text-gray-600 text-sm">
              Add or remove components effortlessly — fully reusable structure.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-emerald-100">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">🌱 Modern UI</h3>
            <p className="text-gray-600 text-sm">
              Styled using Tailwind and shadcn/ui for a clean, modern look.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 📞 Footer */}
      <footer className="mt-24 py-6 border-t w-full text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Your Project Name. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
