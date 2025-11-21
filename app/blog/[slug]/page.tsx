import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { Sparkles, ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Debug logging
    console.log("Fetching post with slug:", slug);

    const post = await prisma.post.findUnique({
        where: { slug },
        include: { author: true }
    });

    if (!post) {
        console.log("Post not found for slug:", slug);
        notFound();
    }

    if (!post.published) {
        const session = await getServerSession(authOptions);
        const user = await prisma.user.findUnique({
            where: { email: session?.user?.email || '' }
        });

        if (!user || user.role !== "ADMIN") {
            console.log("Access denied for unpublished post:", slug);
            notFound();
        }
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>

                <article className="bg-charcoal border border-white/10 rounded-2xl overflow-hidden">
                    {post.image && (
                        <div className="h-96 w-full relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-60" />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <div className="flex items-center space-x-6 text-sm text-gray-400 mb-8">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gold-500" />
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-gold-500" />
                                {post.author.name || 'Anonymous'}
                            </div>
                            {!post.published && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs border border-yellow-500/20">
                                    Draft
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div className="prose prose-invert prose-lg max-w-none">
                            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                                {post.content}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
