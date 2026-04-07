import type { Customer, ApiListResponse, ApiResponse } from '@/types';
import { apiFetch } from './client';

export const customersApi = {
  list: () => apiFetch<ApiListResponse<Customer>>('/customers'),
  get: (id: string) => apiFetch<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: Omit<Customer, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'loyaltyPoints' | 'totalSpent' | 'orderCount'>) =>
    apiFetch<ApiResponse<Customer>>('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Customer>) =>
    apiFetch<ApiResponse<Customer>>(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/customers/${id}`, { method: 'DELETE' }),
};
