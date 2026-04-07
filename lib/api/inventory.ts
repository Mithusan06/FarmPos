import type { InventoryItem, ApiListResponse, ApiResponse } from '@/types';
import { apiFetch } from './client';

export const inventoryApi = {
  list: () => apiFetch<ApiListResponse<InventoryItem>>('/inventory'),
  get: (id: string) => apiFetch<ApiResponse<InventoryItem>>(`/inventory/${id}`),
  adjust: (id: string, adjustment: number) =>
    apiFetch<ApiResponse<InventoryItem>>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ adjustment }),
    }),
};
