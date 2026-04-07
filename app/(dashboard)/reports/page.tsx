'use client';
import { useEffect, useState } from 'react';
import { reportsApi } from '@/lib/api/reports';
import SalesSummaryCard from '@/modules/reports/components/SalesSummaryCard';
import TopProductsTable from '@/modules/reports/components/TopProductsTable';
import RevenueByCategory from '@/modules/reports/components/RevenueByCategory';
import Topbar from '@/components/layout/Topbar';
import Spinner from '@/components/ui/Spinner';
import type { ReportSummary } from '@/types';

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reportsApi.summary().then((res) => setSummary(res.data)).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Reports" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner /></div>
        ) : summary ? (
          <>
            <SalesSummaryCard
              totalRevenue={summary.totalRevenue}
              totalOrders={summary.totalOrders}
              totalItemsSold={summary.totalItemsSold}
              averageOrderValue={summary.averageOrderValue}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopProductsTable topProducts={summary.topProducts} />
              <RevenueByCategory data={summary.revenueByCategory} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 py-24">Failed to load report data</p>
        )}
      </div>
    </div>
  );
}
