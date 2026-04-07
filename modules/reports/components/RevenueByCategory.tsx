import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import type { ReportSummary } from '@/types';

export default function RevenueByCategory({ data }: { data: ReportSummary['revenueByCategory'] }) {
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-4">Revenue by Category</h3>
      <div className="space-y-3">
        {data.sort((a, b) => b.revenue - a.revenue).map((d) => {
          const pct = total > 0 ? (d.revenue / total) * 100 : 0;
          return (
            <div key={d.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{d.category}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(d.revenue)}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
        {data.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No data</p>}
      </div>
    </Card>
  );
}
