"use client";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

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
      <div className="flex items-center justify-between p-6">

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden mr-3"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-7 w-7 text-white" />
        </button>

        {/* Text Logo */}
        <Link href="/dashboard">
          <h1 className="text-2xl font-extrabold tracking-wide text-white">
            PrepMate
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10 text-sm font-medium">
          <li>
            <Link
              href="/dashboard"
              className={`transition-all duration-200 cursor-pointer ${
                path === "/dashboard"
                  ? "text-white font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/interview"
              className={`transition-all duration-200 cursor-pointer ${
                path === "/dashboard/interview"
                  ? "text-white font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Previous Interviews
            </Link>
          </li>
        </ul>

        {/* Clerk User Button */}
        <UserButton />
      </div>

      {/* Drawer For Mobile */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold text-center">Dashboard</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col text-center gap-4 py-4 font-medium text-lg">
            <Link href="/dashboard/interview" onClick={() => setOpen(false)}>
              Previous Interviews
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Create New Interview
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Header;
