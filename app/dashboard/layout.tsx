import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Key, Settings, LogOut, Sparkles, BookOpen } from "lucide-react";
import SignOutButton from "@/app/components/SignOutButton";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="min-h-screen bg-obsidian text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-charcoal hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-gold-500" />
                        <span className="text-lg font-bold tracking-wider">
                            API<span className="text-gold-500">GATEWAY</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Overview
                    </Link>
                    <Link
                        href="/docs"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <BookOpen className="w-5 h-5 mr-3" />
                        Docs
                    </Link>
                    <Link
                        href="/dashboard/keys"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <Key className="w-5 h-5 mr-3" />
                        API Keys
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-gold-500 rounded-lg transition-colors"
                    >
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center mb-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold mr-3">
                            {session.user?.name?.[0] || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                    </div>
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
