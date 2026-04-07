'use client';
import { create } from 'zustand';
import type { Product } from '@/types';
import { productsApi } from '@/lib/api/products';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await productsApi.list();
      set({ products: res.data });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (data) => {
    const res = await productsApi.create(data);
    set((state) => ({ products: [...state.products, res.data] }));
  },

  updateProduct: async (id, data) => {
    const res = await productsApi.update(id, data);
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? res.data : p)),
    }));
  },

  deleteProduct: async (id) => {
    await productsApi.delete(id);
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },
}));
