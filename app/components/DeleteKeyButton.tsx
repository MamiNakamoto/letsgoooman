'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteKeyButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this API key?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/keys/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete key');
            }
        } catch (error) {
            console.error('Error deleting key:', error);
            alert('An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
            title="Delete Key"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
