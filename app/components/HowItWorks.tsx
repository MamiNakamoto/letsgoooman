'use client';

import { ArrowRight } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Sign Up',
        description: 'Create your account and get instant access to your dashboard.'
    },
    {
        number: '02',
        title: 'Get API Key',
        description: 'Generate your unique API key to authenticate your requests.'
    },
    {
        number: '03',
        title: 'Start Building',
        description: 'Integrate our endpoints into your applications and start scaling.'
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-obsidian relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Get started with our platform in three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative text-center">
                            <div className="w-24 h-24 mx-auto bg-charcoal border border-gold-500/30 rounded-full flex items-center justify-center mb-8 relative z-10">
                                <span className="text-3xl font-bold text-gold-500">{step.number}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
