import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { Sparkles, ArrowLeft, Calendar } from "lucide-react";

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: { author: true }
    });

    return (
        <div className="min-h-screen bg-obsidian text-white">
            <header className="border-b border-white/10 bg-charcoal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Sparkles className="w-6 h-6 text-gold-500" />
                        <span className="text-xl font-bold tracking-wider">
                            API<span className="text-gold-500">BLOG</span>
                        </span>
                    </Link>
                    <Link href="/" className="text-sm text-gray-400 hover:text-white flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Latest <span className="text-gold-500">Updates</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Stay up to date with the latest news, tutorials, and API updates.
                    </p>
                </div>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                            <article className="bg-charcoal border border-white/10 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all flex flex-col md:flex-row h-full md:h-48">
                                {post.image && (
                                    <div className="w-full md:w-64 h-48 md:h-full flex-shrink-0 overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="flex items-center text-xs text-gray-500 mb-2">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-gold-500 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span>By {post.author.name || 'Admin'}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No posts published yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
