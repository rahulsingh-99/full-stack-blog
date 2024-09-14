import prisma from "@/prisma"
import { DefaultUser } from "next-auth";
import { NextResponse } from "next/server";

export const connectToDb = async () => {
    try {
        await prisma.$connect();
    } catch (error: any) {
        throw new Error(error);
    }
}

export const generateErrorMessage = (data: any, status: number) => {
    return NextResponse.json(
        { message: "Error", ...data },
        { status, statusText: "ERROR" }
    );
}

export const generateSuccessMessage = (data: any, status: number) => {
    return NextResponse.json(
        { message: "Success", ...data },
        { status, statusText: "OK" }
    );
}

export const getAllBlogs = async (count?: number) => {
    const res = await fetch("http://localhost:3000/api/blogs", {
        next: { revalidate: 60 }
    });
    const data = await res.json();
    if (count) {
        return data.blogs.slice(0, count);
    }
    return data.blogs;
}

export const getBlogById = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/blogs/${id}`, {})
    const data = await res.json();
    return data.blog;
}

export const getUserById = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        cache: "no-store",
    })
    const data = await res.json();
    return data;
}

export const verifyUserDetails = async (user: DefaultUser) => {
    await connectToDb();

    const isUserExists = await prisma.user.findFirst({
        where: { email: user.email as string }
    });

    if (isUserExists) {
        return null;
    } else {
        const newUser = await prisma.user.create({
            data: {
                email: user.email as string,
                name: user.name as string,
            },
        })
        return newUser;
    }
}
