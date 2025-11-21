'use client';

import { useState } from 'react';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreditManagerProps {
    userId: string;
    initialCredits: number;
}

export default function CreditManager({ userId, initialCredits }: CreditManagerProps) {
    const [credits, setCredits] = useState(initialCredits);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async (action: 'add' | 'remove') => {
        if (!amount || isNaN(parseInt(amount))) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/users/${userId}/credits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseInt(amount), action }),
            });

            if (!response.ok) throw new Error('Failed to update credits');

            const data = await response.json();
            setCredits(data.credits);
            setAmount('');
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update credits');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-charcoal border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Manage Credits</h3>

            <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400">Current Balance</span>
                <span className="text-3xl font-bold text-white">{credits.toLocaleString()}</span>
            </div>

            <div className="flex gap-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="flex-1 px-4 py-2 bg-obsidian border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold-500"
                />

                <button
                    onClick={() => handleUpdate('add')}
                    disabled={isLoading || !amount}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 disabled:opacity-50 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>

                <button
                    onClick={() => handleUpdate('remove')}
                    disabled={isLoading || !amount}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                >
                    <Minus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
