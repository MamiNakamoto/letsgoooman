'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import Link from 'next/link';

export default function EditApiPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        targetUrl: '',
        incomingPath: '',
        active: true
    });

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const res = await fetch(`/api/admin/apis/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name,
                        targetUrl: data.targetUrl,
                        incomingPath: data.incomingPath,
                        active: data.active
                    });
                } else {
                    router.push('/admin/apis');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setFetching(false);
            }
        };
        fetchRoute();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/apis/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/admin/apis');
                router.refresh();
            } else {
                alert('Failed to update route');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex items-center mb-8">
                <Link href="/admin/apis" className="mr-4 text-gray-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-white">Edit API Route</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-charcoal border border-white/10 rounded-xl p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">API Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-obsidian border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Target URL (Private)</label>
                        <input
                            type="url"
                            required
                            className="w-full bg-obsidian border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 font-mono text-sm"
                            value={formData.targetUrl}
                            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Public Path</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500">/api/v1/</span>
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full bg-obsidian border border-white/10 rounded-lg pl-20 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 font-mono text-sm"
                                value={formData.incomingPath}
                                onChange={(e) => setFormData({ ...formData, incomingPath: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center pt-4 border-t border-white/10">
                        <input
                            type="checkbox"
                            id="active"
                            className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        <label htmlFor="active" className="ml-2 text-sm text-gray-300">
                            Active
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-3 bg-gold-500 text-black rounded-lg hover:bg-gold-400 font-medium transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {loading ? 'Saving...' : 'Update Route'}
                    </button>
                </div>
            </form>
        </div>
    );
}
