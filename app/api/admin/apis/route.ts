import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const routes = await prisma.apiRoute.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(routes);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const { name, incomingPath, targetUrl } = body;

        if (!name || !incomingPath || !targetUrl) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const route = await prisma.apiRoute.create({
            data: { name, incomingPath, targetUrl }
        });

        return NextResponse.json(route);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create route" }, { status: 500 });
    }
}
