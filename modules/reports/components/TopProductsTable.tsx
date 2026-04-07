import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import type { ReportSummary } from '@/types';

export default function TopProductsTable({ topProducts }: { topProducts: ReportSummary['topProducts'] }) {
  return (
    <Card padding={false}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
            <th className="px-5 py-3">Rank</th>
            <th className="px-5 py-3">Product</th>
            <th className="px-5 py-3">Qty Sold</th>
            <th className="px-5 py-3">Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {topProducts.map((p, i) => (
            <tr key={p.productId} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-bold text-gray-400">#{i + 1}</td>
              <td className="px-5 py-3 font-medium text-gray-900">{p.productName}</td>
              <td className="px-5 py-3">{p.quantitySold}</td>
              <td className="px-5 py-3 font-semibold text-green-700">{formatCurrency(p.revenue)}</td>
            </tr>
          ))}
          {topProducts.length === 0 && (
            <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No data</td></tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
