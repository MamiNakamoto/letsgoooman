'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApiKeyManagerProps {
    initialKey: string;
}

export default function ApiKeyManager({ initialKey }: ApiKeyManagerProps) {
    const [apiKey, setApiKey] = useState(initialKey);
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(apiKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const regenerateKey = async () => {
        if (!confirm('Are you sure you want to regenerate your API key? The old one will stop working immediately.')) {
            return;
        }

        setIsRegenerating(true);
        try {
            const response = await fetch('/api/keys', {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to regenerate key');

            const data = await response.json();
            setApiKey(data.key);
        } catch (error) {
            console.error('Error regenerating key:', error);
            alert('Failed to regenerate API key');
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <div className="bg-charcoal border border-white/10 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-white mb-4">Your API Key</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">Key</span>
                    </div>
                    <input
                        type={isVisible ? "text" : "password"}
                        value={apiKey}
                        readOnly
                        className="block w-full pl-12 pr-24 py-3 bg-obsidian border border-white/10 rounded-lg text-gray-300 focus:ring-gold-500 focus:border-gold-500 font-mono text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                        <button
                            onClick={() => setIsVisible(!isVisible)}
                            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
                            title={isVisible ? "Hide key" : "Show key"}
                        >
                            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
                            title="Copy to clipboard"
                        >
                            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={regenerateKey}
                    disabled={isRegenerating}
                    className="inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
                Keep this key secret. Do not share it in public repositories or client-side code.
            </p>
        </div>
    );
}
