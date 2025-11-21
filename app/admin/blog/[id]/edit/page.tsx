'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Trash, Upload } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        image: '',
        published: false
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/blog/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        title: data.title,
                        slug: data.slug,
                        content: data.content,
                        image: data.image || '',
                        published: data.published
                    });
                } else {
                    alert('Failed to fetch post');
                    router.push('/admin/blog');
                }
            } catch (error) {
                console.error(error);
                alert('Error fetching post');
            } finally {
                setFetching(false);
            }
        };
        fetchPost();
    }, [id, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (file) {
                const uploadData = new FormData();
                uploadData.append('file', file);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadData,
                });

                if (!uploadRes.ok) {
                    throw new Error('Image upload failed');
                }

                const uploadJson = await uploadRes.json();
                imageUrl = uploadJson.url;
            }

            const res = await fetch(`/api/blog/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, image: imageUrl }),
            });

            if (res.ok) {
                router.push('/admin/blog');
                router.refresh();
            } else {
                alert('Failed to update post');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/admin/blog');
                router.refresh();
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setDeleting(false);
        }
    };

    if (fetching) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Link href="/admin/blog" className="mr-4 text-gray-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Edit Post</h1>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 font-medium transition-colors disabled:opacity-50"
                    >
                        <Trash className="w-5 h-5 mr-2" />
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <a
                        href={`/blog/${formData.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 font-medium transition-colors"
                    >
                        <Eye className="w-5 h-5 mr-2" />
                        Preview
                    </a>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-charcoal border border-white/10 rounded-xl p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-obsidian border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Slug (URL)</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-obsidian border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                        <div className="flex items-center space-x-4">
                            {formData.image && (
                                <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-white/10">
                                    <img
                                        src={formData.image}
                                        alt="Current"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-obsidian hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-400">
                                            {file ? file.name : 'Click to upload new image'}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                        <textarea
                            required
                            rows={10}
                            className="w-full bg-obsidian border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 font-mono"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="published"
                                className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            />
                            <label htmlFor="published" className="ml-2 text-sm text-gray-300">
                                Published
                            </label>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, published: false })}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-6 py-3 bg-gold-500 text-black rounded-lg hover:bg-gold-400 font-medium transition-colors disabled:opacity-50"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {loading ? 'Saving...' : (formData.published ? 'Update & Publish' : 'Save Draft')}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
