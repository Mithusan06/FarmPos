import type { ReportSummary, ApiResponse } from '@/types';
import { apiFetch } from './client';

export const reportsApi = {
  summary: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    return apiFetch<ApiResponse<ReportSummary>>(`/reports${qs ? `?${qs}` : ''}`);
  },
};
