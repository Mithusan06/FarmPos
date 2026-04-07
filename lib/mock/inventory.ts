import type { InventoryItem } from '@/types';
import { mockProducts } from './products';

export const mockInventory: InventoryItem[] = mockProducts.map((p) => ({
  id: `inv_${p.id}`,
  productId: p.id,
  productName: p.name,
  sku: p.sku,
  currentStock: p.stock,
  reservedStock: 0,
  availableStock: p.stock,
  lowStockThreshold: p.lowStockThreshold,
  lastRestocked: '2025-03-28T08:00:00Z',
  tenantId: 'default',
}));
