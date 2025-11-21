import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate new key
        const newKey = `ag_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;

        // Deactivate old keys and create new one
        // Ideally we might want to keep old ones active for a grace period, but for now we replace.
        // Or we can just update the existing one if we assume 1 key per user.
        // The schema allows multiple keys. Let's deactivate all old ones and create a new one.

        await prisma.$transaction([
            prisma.apiKey.updateMany({
                where: { userId: user.id, active: true },
                data: { active: false },
            }),
            prisma.apiKey.create({
                data: {
                    key: newKey,
                    userId: user.id,
                    active: true,
                },
            }),
        ]);

        return NextResponse.json({ key: newKey });
    } catch (error) {
        console.error("Error regenerating key:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
