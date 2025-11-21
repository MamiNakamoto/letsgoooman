'use client';

import { Shield, Zap, BarChart3, Globe, Lock, Key } from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Bank-grade encryption and secure key management to protect your endpoints.'
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Global edge network ensures low latency and high availability for your APIs.'
    },
    {
        icon: BarChart3,
        title: 'Real-time Analytics',
        description: 'Detailed insights into usage patterns, error rates, and user behavior.'
    },
    {
        icon: Key,
        title: 'Key Management',
        description: 'Easy generation, rotation, and revocation of API keys for your users.'
    },
    {
        icon: Globe,
        title: 'Global Scaling',
        description: 'Automatically scale infrastructure to handle traffic spikes without downtime.'
    },
    {
        icon: Lock,
        title: 'Rate Limiting',
        description: 'Granular control over request limits to prevent abuse and ensure fair usage.'
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-charcoal relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Powerful tools designed to help you manage and monetize your APIs effectively.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-gold-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
