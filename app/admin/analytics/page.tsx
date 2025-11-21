import { prisma } from "@/app/lib/prisma";
import { BarChart, Activity, Globe, Key } from "lucide-react";

export default async function AnalyticsPage() {
    // Fetch all logs
    // In a real app, we would use aggregation queries (groupBy) but Prisma's groupBy is limited with relations.
    // For now, we'll fetch and process in JS or use raw query if needed.
    // Let's use a raw query for better performance on aggregation if possible, or just simple processing for MVP.

    // Let's try simple processing first as the dataset might be small.
    const logs = await prisma.usageLog.findMany({
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 1000 // Limit for now
    });

    // Process data
    const endpointStats: Record<string, { count: number, methods: Record<string, number> }> = {};
    const userStats: Record<string, { count: number, name: string, email: string }> = {};

    logs.forEach(log => {
        // Endpoint Stats
        if (!endpointStats[log.endpoint]) {
            endpointStats[log.endpoint] = { count: 0, methods: {} };
        }
        endpointStats[log.endpoint].count++;
        endpointStats[log.endpoint].methods[log.method] = (endpointStats[log.endpoint].methods[log.method] || 0) + 1;

        // User Stats
        const userKey = log.userId;
        if (!userStats[userKey]) {
            userStats[userKey] = {
                count: 0,
                name: log.user.name || 'Unknown',
                email: log.user.email || 'No Email'
            };
        }
        userStats[userKey].count++;
    });

    // Sort stats
    const topEndpoints = Object.entries(endpointStats)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 10);

    const topUsers = Object.entries(userStats)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 10);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Endpoints */}
                <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-white">Top Endpoints</h3>
                        <Globe className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="space-y-4">
                        {topEndpoints.map(([endpoint, stats], index) => (
                            <div key={endpoint} className="flex items-center justify-between p-4 bg-obsidian rounded-lg border border-white/5">
                                <div className="flex items-center space-x-4">
                                    <span className="text-gold-500 font-mono font-bold">#{index + 1}</span>
                                    <div>
                                        <p className="text-sm text-white font-mono">{endpoint}</p>
                                        <div className="flex space-x-2 mt-1">
                                            {Object.entries(stats.methods).map(([method, count]) => (
                                                <span key={method} className="text-xs text-gray-500">
                                                    {method}: {count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-white">{stats.count}</div>
                            </div>
                        ))}
                        {topEndpoints.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No data available</p>
                        )}
                    </div>
                </div>

                {/* Top Users */}
                <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-white">Top Users</h3>
                        <Activity className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="space-y-4">
                        {topUsers.map(([userId, stats], index) => (
                            <div key={userId} className="flex items-center justify-between p-4 bg-obsidian rounded-lg border border-white/5">
                                <div className="flex items-center space-x-4">
                                    <span className="text-gold-500 font-mono font-bold">#{index + 1}</span>
                                    <div>
                                        <p className="text-sm text-white font-medium">{stats.name}</p>
                                        <p className="text-xs text-gray-500">{stats.email}</p>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-white">{stats.count}</div>
                            </div>
                        ))}
                        {topUsers.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
