import OrderTable from '@/modules/orders/components/OrderTable';
import Topbar from '@/components/layout/Topbar';

export default function OrdersPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Orders" />
      <div className="flex-1 overflow-auto p-6">
        <OrderTable />
      </div>
    </div>
  );
}
