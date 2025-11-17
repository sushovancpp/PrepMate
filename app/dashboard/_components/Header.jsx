"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

function Header() {

    const path = usePathname();

    return (
        <div 
            className="
                flex p-6 items-center justify-between
                bg-white/10 
                backdrop-blur-xl 
                shadow-lg 
                border-b border-white/20
                sticky top-0 z-50
            "
        >
            <Image src={'/logo.png'} width={170} height={80} alt='logo' />

            <ul className="hidden md:flex gap-10">

                {/* Dashboard */}
                <li>
                    <Link
                        href="/dashboard"
                        className={`hover:text-white transition-all cursor-pointer
                            ${path === '/dashboard' ? 'text-white font-bold' : 'text-gray-300'}
                        `}
                    >
                        Dashboard
                    </Link>
                </li>

                {/* Previous Interviews */}
                <li>
                    <Link
                        href="/dashboard/interview"
                        className={`hover:text-white transition-all cursor-pointer
                            ${path === '/dashboard/interview' ? 'text-white font-bold' : 'text-gray-300'}
                        `}
                    >
                        Previous Interviews
                    </Link>
                </li>

            </ul>

            <UserButton />
        </div>
    )
}

export default Header
