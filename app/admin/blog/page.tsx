import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";

export default async function AdminBlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-400 font-medium transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Post
                </Link>
            </div>

            <div className="bg-charcoal border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-white/5">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Author</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{post.title}</td>
                                <td className="px-6 py-4 text-gray-300">{post.author.name || post.author.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="text-gray-400 hover:text-white"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="text-gray-400 hover:text-gold-500"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No posts found. Create your first post!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
