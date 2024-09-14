"use client";
import React from 'react'
import Logo from './Logo';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Drawer } from './Drawer';

const authLinks = [
    { id: "1-1", name: "Blogs", url: "/blogs" },
    { id: "2-2", name: "Write", url: "/blogs/add" },
    { id: "3-3", name: "Profile", url: "/profile" },
    { id: "4-4", name: "Search", url: "/search" },
]
const nonAuthLinks = [
    { id: "2-1", name: "Blogs", url: "/blogs" },
    { id: "2-2", name: "Login", url: "/login" },
    { id: "2-3", name: "Register", url: "/register" },
]
const AppBar = () => {
    const { status } = useSession();
    return (
        <section className='sticky w-full bg-gray-100'>
            <nav className='xs:hidden md:flex flex items-center justify-between px-8 py-4 bg-transparent'>
                <div><Logo /></div>
                <div className='flex items-center gap-4 p-2' >
                    {(status === "authenticated" ? authLinks : nonAuthLinks).map((item) => (
                        <Link key={item.id} href={item.url} className='text-gray-900 text-lg font-semibold hover:text-orange-600 duration-300'>{item.name}</Link>
                    )
                    )}
                    {status === "authenticated" && (
                        <button className='hover:bg-slate-200 rounded-xl px-4 py-2 font-semibold text-xl' onClick={() => signOut()}>Log Out</button>
                    )}
                </div>
            </nav>
            <div className="md:hidden xs:visible">
                <div className="flex justify-between items-center p-6">
                    <div>
                        <Logo />
                    </div>
                    <Drawer />
                </div>
            </div>
        </section>
    )
}

export default AppBar