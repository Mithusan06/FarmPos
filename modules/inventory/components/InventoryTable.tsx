'use client';
import { useEffect, useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { useUiStore } from '@/store/uiStore';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import StockAdjustModal from './StockAdjustModal';
import LowStockAlert from './LowStockAlert';
import type { InventoryItem } from '@/types';

export default function InventoryTable() {
  const { items, isLoading, fetchInventory, getLowStockItems } = useInventoryStore();
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const lowStock = getLowStockItems();

  const getStockBadge = (item: InventoryItem) => {
    if (item.availableStock === 0) return <Badge variant="red">Out of Stock</Badge>;
    if (item.availableStock <= item.lowStockThreshold) return <Badge variant="orange">Low Stock</Badge>;
    return <Badge variant="green">In Stock</Badge>;
  };

  return (
    <div className="space-y-6">
      {lowStock.length > 0 && <LowStockAlert items={lowStock} />}

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Reserved</th>
                <th className="px-4 py-3">Threshold</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 font-mono text-gray-500">{item.sku}</td>
                  <td className="px-4 py-3 font-semibold">{item.availableStock}</td>
                  <td className="px-4 py-3 text-gray-500">{item.reservedStock}</td>
                  <td className="px-4 py-3 text-gray-500">{item.lowStockThreshold}</td>
                  <td className="px-4 py-3">{getStockBadge(item)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setAdjustItem(item)}
                      className="text-xs rounded-lg bg-blue-50 text-blue-700 px-3 py-1.5 hover:bg-blue-100 font-medium"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StockAdjustModal item={adjustItem} onClose={() => setAdjustItem(null)} />
    </div>
  );
}
