import CustomerTable from '@/modules/customers/components/CustomerTable';
import Topbar from '@/components/layout/Topbar';

export default function CustomersPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Customers" />
      <div className="flex-1 overflow-auto p-6">
        <CustomerTable />
      </div>
    </div>
  );
}
