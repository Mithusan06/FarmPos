'use client';
import { create } from 'zustand';
import type { Customer } from '@/types';
import { customersApi } from '@/lib/api/customers';

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (data: Omit<Customer, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'loyaltyPoints' | 'totalSpent' | 'orderCount'>) => Promise<Customer>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await customersApi.list();
      set({ customers: res.data });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addCustomer: async (data) => {
    const res = await customersApi.create(data);
    set((state) => ({ customers: [...state.customers, res.data] }));
    return res.data;
  },

  updateCustomer: async (id, data) => {
    const res = await customersApi.update(id, data);
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? res.data : c)),
    }));
  },

  deleteCustomer: async (id) => {
    await customersApi.delete(id);
    set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
  },
}));
