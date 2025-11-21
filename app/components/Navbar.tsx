'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: 'Features', id: 'features' },
        { name: 'How it Works', id: 'how-it-works' },
        { name: 'Pricing', id: 'pricing' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-obsidian/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Sparkles className="w-6 h-6 text-gold-500" />
                        <span className="text-xl font-bold text-white tracking-wider">
                            API<span className="text-gold-500">GATEWAY</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                        <Link
                            href="/blog"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Blog
                        </Link>

                        {session ? (
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 text-sm font-medium text-black bg-gold-500 rounded-lg hover:bg-gold-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/auth/signin"
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 text-sm font-medium text-black bg-gold-500 rounded-lg hover:bg-gold-400 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-charcoal border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.id)}
                                    className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-gold-500 hover:bg-white/5 rounded-md"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <Link
                                href="/blog"
                                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-gold-500 hover:bg-white/5 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>

                            {session ? (
                                <Link
                                    href="/dashboard"
                                    className="block w-full text-center px-3 py-3 mt-4 text-base font-medium text-black bg-gold-500 rounded-md hover:bg-gold-400"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/signin"
                                        className="block w-full text-center px-3 py-3 mt-4 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="block w-full text-center px-3 py-3 mt-2 text-base font-medium text-black bg-gold-500 rounded-md hover:bg-gold-400"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
