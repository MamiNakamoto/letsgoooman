'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash, CheckCircle, XCircle, Globe, Link as LinkIcon } from 'lucide-react';

interface ApiRoute {
    id: string;
    name: string;
    incomingPath: string;
    targetUrl: string;
    active: boolean;
    createdAt: string;
}

export default function ApiListPage() {
    const [routes, setRoutes] = useState<ApiRoute[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const res = await fetch('/api/admin/apis');
            if (res.ok) {
                setRoutes(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/admin/apis/${id}`, { method: 'DELETE' });
            if (res.ok) fetchRoutes();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">API Routes</h1>
                    <p className="text-gray-400">Manage your dynamic API proxies.</p>
                </div>
                <Link
                    href="/admin/apis/new"
                    className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add API
                </Link>
            </div>

            <div className="bg-charcoal border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Public Path</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Target URL</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {routes.map((route) => (
                            <tr key={route.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{route.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full w-fit text-sm font-mono">
                                        <Globe className="w-3 h-3 mr-2" />
                                        /api/v1/{route.incomingPath}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-gray-400 text-sm max-w-xs truncate" title={route.targetUrl}>
                                        <LinkIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                                        {route.targetUrl}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {route.active ? (
                                        <span className="inline-flex items-center text-green-500 text-sm">
                                            <CheckCircle className="w-4 h-4 mr-1" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center text-red-500 text-sm">
                                            <XCircle className="w-4 h-4 mr-1" /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={`/admin/apis/${route.id}/edit`}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(route.id)}
                                            className="text-red-500/70 hover:text-red-500 transition-colors"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {routes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No API routes configured yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
