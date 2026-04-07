'use client';
import { usePosStore } from '@/store/posStore';
import { formatCurrency } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

export default function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = usePosStore((s) => s.updateQuantity);
  const removeItem = usePosStore((s) => s.removeItem);

  const lineTotal = item.unitPrice * item.quantity * (1 - item.discount / 100);

  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
        <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} each</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="h-7 w-7 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold text-base"
        >
          −
        </button>
        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="h-7 w-7 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center font-bold text-base"
        >
          +
        </button>
      </div>

      <p className="w-16 text-right text-sm font-semibold text-gray-900 shrink-0">
        {formatCurrency(lineTotal)}
      </p>

      <button
        onClick={() => removeItem(item.product.id)}
        className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
