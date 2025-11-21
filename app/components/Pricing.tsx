'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for testing and small projects.',
        features: [
            '1,000 requests/month',
            'Basic support',
            '1 API Key',
            'Standard rate limits'
        ],
        cta: 'Get Started',
        popular: false
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For growing applications and businesses.',
        features: [
            '100,000 requests/month',
            'Priority support',
            '5 API Keys',
            'Higher rate limits',
            'Advanced analytics'
        ],
        cta: 'Get Started',
        popular: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Tailored solutions for large scale needs.',
        features: [
            'Unlimited requests',
            '24/7 Dedicated support',
            'Unlimited API Keys',
            'Custom SLAs',
            'On-premise deployment'
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-charcoal">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that best fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border ${plan.popular
                                    ? 'bg-white/5 border-gold-500 ring-1 ring-gold-500'
                                    : 'bg-white/5 border-white/10'
                                } flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                    <span className="inline-block bg-gold-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-gray-400 ml-2">{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Check className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/auth/signup"
                                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular
                                        ? 'bg-gold-500 text-black hover:bg-gold-400'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
