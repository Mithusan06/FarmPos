import type { InventoryItem } from '@/types';

export default function LowStockAlert({ items }: { items: InventoryItem[] }) {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-semibold text-orange-800">Low Stock Alert — {items.length} item{items.length > 1 ? 's' : ''} need attention</p>
          <ul className="mt-2 space-y-1 text-sm text-orange-700">
            {items.map((item) => (
              <li key={item.id}>
                <span className="font-medium">{item.productName}</span>
                {' '}— {item.availableStock === 0 ? 'Out of stock' : `Only ${item.availableStock} left`}
                {' '}(threshold: {item.lowStockThreshold})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
