import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!session) {
        return NextResponse.redirect(new URL('/blogs', req.url))
    }
    return NextResponse.next();
};

export const config = {
    matcher: ["/blogs/add", "/blogs/edit/:path*", "/profile"],
};