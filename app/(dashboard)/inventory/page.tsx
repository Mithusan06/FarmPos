import InventoryTable from '@/modules/inventory/components/InventoryTable';
import Topbar from '@/components/layout/Topbar';

export default function InventoryPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Inventory" />
      <div className="flex-1 overflow-auto p-6">
        <InventoryTable />
      </div>
    </div>
  );
}
