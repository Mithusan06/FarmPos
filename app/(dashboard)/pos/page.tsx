import ProductGrid from '@/modules/pos/components/ProductGrid';
import CartPanel from '@/modules/pos/components/CartPanel';
import PaymentModal from '@/modules/pos/components/PaymentModal';
import ReceiptModal from '@/modules/pos/components/ReceiptModal';
import Topbar from '@/components/layout/Topbar';

export default function POSPage() {
  return (
    <div className="flex flex-col h-full">
      <Topbar title="Point of Sale" />
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Product area: left 2/3 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ProductGrid />
        </div>
        {/* Cart: right 1/3 */}
        <div className="w-80 xl:w-96 shrink-0 flex flex-col">
          <CartPanel />
        </div>
      </div>
      <PaymentModal />
      <ReceiptModal />
    </div>
  );
}
