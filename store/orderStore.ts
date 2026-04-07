'use client';
import { create } from 'zustand';
import type { Order } from '@/types';
import { ordersApi } from '@/lib/api/orders';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: Omit<Order, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await ordersApi.list();
      set({ orders: res.data });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (data) => {
    const res = await ordersApi.create(data);
    set((state) => ({ orders: [res.data, ...state.orders] }));
    return res.data;
  },

  updateOrderStatus: async (id, status) => {
    const res = await ordersApi.update(id, { status });
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? res.data : o)),
    }));
  },
}));
