'use client';
import { useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { useUiStore } from '@/store/uiStore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { InventoryItem } from '@/types';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function StockAdjustModal({ item, onClose }: Props) {
  const adjustStock = useInventoryStore((s) => s.adjustStock);
  const addToast = useUiStore((s) => s.addToast);
  const [adjustment, setAdjustment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    const adj = parseInt(adjustment);
    if (isNaN(adj) || adj === 0) return;
    setIsLoading(true);
    try {
      await adjustStock(item.id, adj);
      addToast(`Stock adjusted by ${adj > 0 ? '+' : ''}${adj}`, 'success');
      setAdjustment('');
      onClose();
    } catch {
      addToast('Failed to adjust stock', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={!!item} onClose={onClose} title="Adjust Stock" size="sm">
      {item && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <p className="font-medium text-gray-900">{item.productName}</p>
            <p className="text-gray-500">Current stock: <strong>{item.availableStock}</strong></p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Adjustment (use negative to reduce)</label>
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              placeholder="+25 or -5"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold focus:border-green-500 focus:outline-none min-h-[44px]"
              required
            />
          </div>
          {adjustment && !isNaN(parseInt(adjustment)) && (
            <p className="text-sm text-gray-600">
              New stock: <strong>{Math.max(0, item.availableStock + parseInt(adjustment))}</strong>
            </p>
          )}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isLoading}>Apply</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
