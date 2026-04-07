import type { Order, ApiListResponse, ApiResponse } from '@/types';
import { apiFetch } from './client';

export const ordersApi = {
  list: () => apiFetch<ApiListResponse<Order>>('/orders'),
  get: (id: string) => apiFetch<ApiResponse<Order>>(`/orders/${id}`),
  create: (data: Omit<Order, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) =>
    apiFetch<ApiResponse<Order>>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Order>) =>
    apiFetch<ApiResponse<Order>>(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/orders/${id}`, { method: 'DELETE' }),
};
