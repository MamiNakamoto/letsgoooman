import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-obsidian text-white">
            <header className="border-b border-white/10 bg-charcoal">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Sparkles className="w-6 h-6 text-gold-500" />
                        <span className="text-xl font-bold tracking-wider">
                            API<span className="text-gold-500">DOCS</span>
                        </span>
                    </Link>
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="prose prose-invert max-w-none">
                    <h1 className="text-4xl font-bold text-white mb-6">Documentation</h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Welcome to the API Gateway documentation. Here you'll find everything you need to integrate our API into your applications.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
                            <p className="text-gray-400 mb-4">Learn the basics of authentication, making requests, and handling responses.</p>
                            <span className="text-gold-500 font-medium">Read Guide →</span>
                        </div>
                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
                            <p className="text-gray-400 mb-4">Detailed reference for all available endpoints and parameters.</p>
                            <span className="text-gold-500 font-medium">View Reference →</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
