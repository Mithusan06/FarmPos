import type { Product, ApiListResponse, ApiResponse } from '@/types';
import { apiFetch } from './client';

export const productsApi = {
  list: () => apiFetch<ApiListResponse<Product>>('/products'),
  get: (id: string) => apiFetch<ApiResponse<Product>>(`/products/${id}`),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'tenantId'>) =>
    apiFetch<ApiResponse<Product>>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Product>) =>
    apiFetch<ApiResponse<Product>>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),
};
