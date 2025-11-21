import { prisma } from "@/app/lib/prisma";
import CreditManager from "@/app/components/CreditManager";
import DeleteKeyButton from "@/app/components/DeleteKeyButton";
import { notFound } from "next/navigation";

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            apiKeys: true,
            usageLogs: {
                take: 50,
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) notFound();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-gray-400 mb-8">{user.email}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* API Keys */}
                    <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">API Keys</h3>
                        <div className="space-y-4">
                            {user.apiKeys.map((key) => (
                                <div key={key.id} className="flex items-center justify-between p-4 bg-obsidian rounded-lg border border-white/5">
                                    <code className="text-sm text-gray-300 font-mono">{key.key}</code>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${key.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {key.active ? 'Active' : 'Inactive'}
                                        </span>
                                        {!key.active && <DeleteKeyButton id={key.id} />}
                                    </div>
                                </div>
                            ))}
                            {user.apiKeys.length === 0 && (
                                <p className="text-gray-500 text-sm">No API keys generated.</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Usage */}
                    <div className="bg-charcoal border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Recent Usage</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-white/5">
                                    <tr>
                                        <th className="px-4 py-2">Method</th>
                                        <th className="px-4 py-2">Endpoint</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">IP</th>
                                        <th className="px-4 py-2">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {user.usageLogs.map((log) => (
                                        <tr key={log.id} className="text-sm">
                                            <td className="px-4 py-2 font-mono text-gold-500">{log.method}</td>
                                            <td className="px-4 py-2 text-gray-300">{log.endpoint}</td>
                                            <td className={`px-4 py-2 ${log.status >= 400 ? 'text-red-400' : 'text-green-400'}`}>
                                                {log.status}
                                            </td>
                                            <td className="px-4 py-2 text-gray-500">{log.ip}</td>
                                            <td className="px-4 py-2 text-gray-500">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div>
                    <CreditManager userId={user.id} initialCredits={user.credits} />
                </div>
            </div>
        </div>
    );
}
