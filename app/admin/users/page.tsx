import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { Search, MoreHorizontal } from "lucide-react";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        include: {
            _count: {
                select: { apiKeys: true, usageLogs: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Users</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 bg-charcoal border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500"
                    />
                </div>
            </div>

            <div className="bg-charcoal border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Usage</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Keys</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold mr-3">
                                            {user.name?.[0] || "U"}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{user.name || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {user.credits.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {user._count.usageLogs.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {user._count.apiKeys}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <Link href={`/admin/users/${user.id}`} className="text-gold-500 hover:text-gold-400">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
