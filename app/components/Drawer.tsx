"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import Logo from "./Logo"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { MdOutlineNavigateNext } from "react-icons/md"
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

export function Drawer() {
    const { status } = useSession();
    return (
        <Sheet>
            <SheetTrigger>
                <MenuIcon size={40} className="p-2 hove:bg-gray-200 rounded-full" />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mx-auto my-5">
                        <Logo />
                    </SheetTitle>
                    <div className="flex flex-col w-full justify-start items-center">
                        {(status === "authenticated" ? authLinks : nonAuthLinks).map((item) => (
                            <Link className="bg-gray-100 rounded-xl flex items-center w-full px-10 py-3 my-1 hover:bg-orange-500 font-bold hover:text-white duration-300"
                                href={item.url}
                                key={item.id}>
                                {item.name}
                                <span className="ml-auto">
                                    <MdOutlineNavigateNext size={20} />
                                </span>
                            </Link>
                        ))}
                        {status === "authenticated" && (
                            <button className='my-1 w-full bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2 font-bold text-xl' onClick={() => signOut()}>Log Out</button>
                        )}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
