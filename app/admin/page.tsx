import { prisma } from "@/app/lib/prisma";
import { Users, Activity, Server } from "lucide-react";

export default async function AdminDashboard() {
    const userCount = await prisma.user.count();
    const requestCount = await prisma.usageLog.count();
    const keyCount = await prisma.apiKey.count({
        where: { active: true }
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-400">Total Users</h4>
                        <Users className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{userCount}</div>
                </div>

                <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-400">Total Requests</h4>
                        <Activity className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{requestCount}</div>
                </div>

                <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-400">Active Keys</h4>
                        <Server className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{keyCount}</div>
                </div>
            </div>
        </div>
    );
}
