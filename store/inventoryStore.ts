'use client';
import { create } from 'zustand';
import type { InventoryItem } from '@/types';
import { inventoryApi } from '@/lib/api/inventory';

interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchInventory: () => Promise<void>;
  adjustStock: (id: string, adjustment: number) => Promise<void>;
  getLowStockItems: () => InventoryItem[];
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await inventoryApi.list();
      set({ items: res.data });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  adjustStock: async (id, adjustment) => {
    const res = await inventoryApi.adjust(id, adjustment);
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? res.data : i)),
    }));
  },

  getLowStockItems: () =>
    get().items.filter((i) => i.availableStock <= i.lowStockThreshold),
}));
