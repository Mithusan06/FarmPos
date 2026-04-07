'use client';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductTileProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductTile({ product, onAdd }: ProductTileProps) {
  const outOfStock = product.stock <= 0;

  return (
    <button
      onClick={() => !outOfStock && onAdd(product)}
      disabled={outOfStock}
      className={cn(
        'flex flex-col items-start rounded-xl p-3 text-left border transition-all min-h-[100px] w-full',
        outOfStock
          ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
          : 'bg-white border-gray-200 hover:border-green-400 hover:shadow-md active:scale-[0.98] cursor-pointer',
      )}
    >
      <div className="w-full flex justify-between items-start mb-2">
        <span className="text-2xl">{getCategoryEmoji(product.category)}</span>
        {product.stock <= product.lowStockThreshold && product.stock > 0 && (
          <span className="text-xs text-orange-600 bg-orange-50 rounded px-1.5 py-0.5">Low</span>
        )}
        {outOfStock && (
          <span className="text-xs text-red-600 bg-red-50 rounded px-1.5 py-0.5">Out</span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{product.name}</p>
      <p className="mt-auto pt-2 text-base font-bold text-green-700">{formatCurrency(product.price)}</p>
    </button>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'Pet Food': '🐾',
    'Pet Accessories': '🎀',
    'Livestock Feed': '🐄',
    'Farm Supplies': '🌿',
    'Seeds & Plants': '🌱',
    'Tools & Equipment': '🔧',
    'Veterinary': '💉',
    'Other': '📦',
  };
  return map[category] ?? '📦';
}
