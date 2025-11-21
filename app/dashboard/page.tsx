import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import ApiKeyManager from "@/app/components/ApiKeyManager";
import UsageStats from "@/app/components/UsageStats";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return null; // Should be handled by layout redirect
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            apiKeys: true,
            _count: {
                select: { usageLogs: true }
            }
        }
    });

    if (!user) return null;

    const apiKey = user.apiKeys[0]?.key || "No API Key Generated";
    const usageCount = user._count.usageLogs;
    // Mock limit for now, or add to schema
    const limit = 1000;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 mb-8">Manage your API access and monitor usage.</p>

            <UsageStats usage={usageCount} limit={limit} credits={user.credits} />

            <ApiKeyManager initialKey={apiKey} />

            <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Quick Start</h3>
                <div className="bg-obsidian rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                    <p className="mb-2 text-gray-500"># Example Request</p>
                    <p>curl -X POST https://your-domain.com/api/v1/resource \</p>
                    <p>  -H "x-api-key: {apiKey}" \</p>
                    <p>  -d '{"{"}"data": "value"{"}"}'</p>
                </div>
            </div>
        </div>
    );
}
