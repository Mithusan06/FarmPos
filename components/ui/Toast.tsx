'use client';
import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export default function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onDismiss={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-gray-800',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg min-w-[240px]',
        colors[type],
      )}
    >
      <span className="flex-1 text-sm">{message}</span>
      <button onClick={() => onDismiss(id)} className="text-white/70 hover:text-white text-lg leading-none">
        ×
      </button>
    </div>
  );
}
