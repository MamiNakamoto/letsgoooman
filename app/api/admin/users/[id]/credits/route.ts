import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!admin || admin.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { amount, action } = await req.json();
        const { id } = await params;

        if (!amount || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let newCredits = user.credits;
        if (action === "add") {
            newCredits += parseInt(amount);
        } else if (action === "remove") {
            newCredits = Math.max(0, newCredits - parseInt(amount));
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { credits: newCredits },
        });

        return NextResponse.json({ credits: updatedUser.credits });
    } catch (error) {
        console.error("Error updating credits:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
