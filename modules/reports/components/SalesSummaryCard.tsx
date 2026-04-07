import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface Props {
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  averageOrderValue: number;
}

export default function SalesSummaryCard({ totalRevenue, totalOrders, totalItemsSold, averageOrderValue }: Props) {
  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: '💰', color: 'text-green-700' },
    { label: 'Total Orders', value: String(totalOrders), icon: '📋', color: 'text-blue-700' },
    { label: 'Items Sold', value: String(totalItemsSold), icon: '📦', color: 'text-purple-700' },
    { label: 'Avg Order Value', value: formatCurrency(averageOrderValue), icon: '📈', color: 'text-orange-700' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
            <span className="text-3xl">{s.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
