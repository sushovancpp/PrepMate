"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black relative">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 h-80 w-80 bg-purple-600/30 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 bg-blue-500/20 blur-3xl rounded-full"></div>
      </div>

      {/* Left Panel (Brand + Welcome Message) */}
      <div className="hidden lg:flex flex-col justify-center max-w-md mx-10 z-10">
        <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
          Welcome to <span className="text-purple-400">PrepMate</span>
        </h1>

        <p className="text-gray-300 mt-5 text-lg">
          Your AI-powered mock interview partner.  
          Practice with real-time voice, webcam & AI feedback.
        </p>

        <Image
          src="/webcam.png"
          alt="Illustration"
          width={250}
          height={250}
          className="opacity-80 mt-10 drop-shadow-2xl"
        />
      </div>

      {/* Sign In Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 z-10 w-[90%] max-w-md">
        
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Sign In
        </h2>

        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg",
                card: "bg-transparent shadow-none",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          New here?{" "}
          <a
            href="/sign-up"
            className="text-purple-300 font-semibold hover:text-purple-400"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
