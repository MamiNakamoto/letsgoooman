'use client';

import { BarChart, Activity, AlertCircle } from 'lucide-react';

interface UsageStatsProps {
    usage: number;
    limit: number;
    credits: number;
}

export default function UsageStats({ usage, limit, credits }: UsageStatsProps) {
    const percentage = Math.min(Math.round((usage / limit) * 100), 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Requests */}
            <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-400">Total Requests</h4>
                    <Activity className="w-5 h-5 text-gold-500" />
                </div>
                <div className="text-3xl font-bold text-white">{usage.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">This billing period</p>
            </div>

            {/* Credits Remaining */}
            <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-400">Credits Remaining</h4>
                    <BarChart className="w-5 h-5 text-gold-500" />
                </div>
                <div className="text-3xl font-bold text-white">{credits.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Available for use</p>
            </div>

            {/* Usage Limit */}
            <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-400">Usage Limit</h4>
                    <AlertCircle className="w-5 h-5 text-gold-500" />
                </div>
                <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-medium">{percentage}%</span>
                        <span className="text-gray-500">{usage} / {limit}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gold-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Resets in 12 days</p>
            </div>
        </div>
    );
}
