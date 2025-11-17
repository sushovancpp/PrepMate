"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, CheckCircle, BrainCircuit, Mic, WebcamIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black text-white">

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-extrabold tracking-wide">PrepMate</h1>

        <Link href="/sign-in">
          <Button className="bg-purple-600 hover:bg-purple-700 px-6">Login</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-10 mt-10">
        
        {/* Text Section */}
        <div className="max-w-xl">
          <h2 className="text-5xl font-extrabold leading-tight">
            Ace Every Interview With <span className="text-purple-400">AI-Powered</span> Mock Practice
          </h2>

          <p className="mt-5 text-lg text-gray-300">
            PrepMate helps you simulate real interview environments with
            AI-generated questions, voice answers, webcam evaluation and detailed feedback.
          </p>

          <Link href="/sign-up?redirect_url=/dashboard">
            <Button className="mt-7 px-7 py-6 text-lg bg-purple-600 hover:bg-purple-700">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Illustration */}
        <div className="mt-10 lg:mt-0">
          <Image
            src="/webcam.png"
            alt="AI Interview"
            width={350}
            height={350}
            className="opacity-90 drop-shadow-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-24 px-10">
        <h3 className="text-center text-3xl font-bold">Why Choose PrepMate?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          
          {/* Feature 1 */}
          <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <BrainCircuit className="h-12 w-12 text-purple-300" />
            <h4 className="text-xl font-semibold mt-4">Smart AI Questions</h4>
            <p className="text-gray-300 mt-2">
              Get role-based AI interview questions based on your experience.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <Mic className="h-12 w-12 text-purple-300" />
            <h4 className="text-xl font-semibold mt-4">Speech-to-Text Answers</h4>
            <p className="text-gray-300 mt-2">
              Answer naturally using your voice. No typing needed.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
            <WebcamIcon className="h-12 w-12 text-purple-300" />
            <h4 className="text-xl font-semibold mt-4">Realistic Interview Setup</h4>
            <p className="text-gray-300 mt-2">
              Simulate real interviews using webcam and mic for maximum confidence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center mt-24 mb-20">
        <h3 className="text-3xl font-bold">Ready to Supercharge Your Career?</h3>
        <p className="text-gray-300 mt-3">Join thousands of users preparing for tech interviews the right way.</p>

        <Link href="/sign-up?redirect_url=/dashboard">
          <Button className="mt-7 px-10 py-6 text-lg bg-purple-600 hover:bg-purple-700">
            Start Free Now <CheckCircle className="ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
