import ProductTable from '@/modules/products/components/ProductTable';
import Topbar from '@/components/layout/Topbar';

export default function ProductsPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Products" />
      <div className="flex-1 overflow-auto p-6">
        <ProductTable />
      </div>
    </div>
  );
}
