import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { Users, Shield, Activity, Sparkles, FileText, Globe } from "lucide-react";
import SignOutButton from "@/app/components/SignOutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/api/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-obsidian text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-charcoal hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-gold-500" />
                        <span className="text-lg font-bold tracking-wider">
                            API<span className="text-gold-500">ADMIN</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <Shield className="w-5 h-5 mr-3" />
                        Overview
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <Users className="w-5 h-5 mr-3" />
                        Users
                    </Link>
                    <Link
                        href="/admin/analytics"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <Activity className="w-5 h-5 mr-3" />
                        Analytics
                    </Link>
                    <Link
                        href="/admin/blog"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <FileText className="w-5 h-5 mr-3" />
                        Blog
                    </Link>
                    <Link
                        href="/admin/apis"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <Globe className="w-5 h-5 mr-3" />
                        APIs
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
