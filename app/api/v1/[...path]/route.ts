import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import axios from "axios";

async function handleRequest(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path: pathArray } = await params;

    // 1. Parse Path
    // Incoming: /api/v1/instagram-user/123
    // pathArray: ['instagram-user', '123']
    if (pathArray.length === 0) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const incomingPath = pathArray[0]; // 'instagram-user'
    const remainingPath = pathArray.slice(1).join("/"); // '123'

    // 2. Find API Route
    const apiRoute = await prisma.apiRoute.findUnique({
        where: { incomingPath },
    });

    if (!apiRoute || !apiRoute.active) {
        return NextResponse.json({ error: "API Route not found or inactive" }, { status: 404 });
    }

    // 3. Construct Target URL
    const url = new URL(req.url);
    const searchParams = url.searchParams.toString();

    // Remove trailing slash from targetUrl if exists
    const baseUrl = apiRoute.targetUrl.replace(/\/$/, "");
    const targetUrl = `${baseUrl}/${remainingPath}${searchParams ? `?${searchParams}` : ""}`;

    // 4. Get & Validate API Key
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
        return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const keyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: { user: true },
    });

    if (!keyRecord || !keyRecord.active) {
        return NextResponse.json({ error: "Invalid or inactive API Key" }, { status: 403 });
    }

    try {
        // 5. Forward Request
        const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

        // Filter headers
        const headers: Record<string, string> = {};
        req.headers.forEach((value, key) => {
            if (!['host', 'content-length', 'x-api-key'].includes(key.toLowerCase())) {
                headers[key] = value;
            }
        });

        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: headers,
            data: body,
            validateStatus: () => true,
        });

        // 6. Log Usage
        await prisma.usageLog.create({
            data: {
                userId: keyRecord.userId,
                endpoint: incomingPath, // Log the route name/path instead of full path
                method: req.method,
                status: response.status,
                ip: req.headers.get("x-forwarded-for") || "unknown",
            },
        });

        // 7. Return Response
        return new NextResponse(JSON.stringify(response.data), {
            status: response.status,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Internal Proxy Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request, context: any) { return handleRequest(req, context); }
export async function POST(req: Request, context: any) { return handleRequest(req, context); }
export async function PUT(req: Request, context: any) { return handleRequest(req, context); }
export async function DELETE(req: Request, context: any) { return handleRequest(req, context); }
export async function PATCH(req: Request, context: any) { return handleRequest(req, context); }
export async function HEAD(req: Request, context: any) { return handleRequest(req, context); }
export async function OPTIONS(req: Request, context: any) { return handleRequest(req, context); }
