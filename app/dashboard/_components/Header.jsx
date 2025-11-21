"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

function Header() {
  const path = usePathname();

  return (
    <div
      className="
        sticky top-0 z-50
        w-full
        backdrop-blur-xl bg-white/10
        border-b border-white/20
        shadow-[0_2px_20px_rgba(0,0,0,0.25)]
        transition-all
      "
    >
      {/* Gradient Glow Behind Header */}
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
        <div
          className="absolute top-[-40%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(109,40,217,0.45), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-50%] right-[-10%] w-[35vw] h-[35vw] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)",
          }}
        />
      </div>

      <div className="flex items-center justify-between p-6">
        {/* Logo */}
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            width={170}
            height={80}
            alt="logo"
            className="cursor-pointer hover:opacity-90 transition-all"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10 text-sm font-medium">
          {/* Dashboard */}
          <li>
            <Link
              href="/dashboard"
              className={`
                transition-all duration-200 cursor-pointer
                ${
                  path === "/dashboard"
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white"
                }
              `}
            >
              Dashboard
            </Link>
          </li>

          {/* Interview History */}
          <li>
            <Link
              href="/dashboard/interview"
              className={`
                transition-all duration-200 cursor-pointer
                ${
                  path === "/dashboard/interview"
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white"
                }
              `}
            >
              Previous Interviews
            </Link>
          </li>
        </ul>

        {/* Clerk User Button */}
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
