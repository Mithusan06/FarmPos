'use client';
import { usePosStore } from '@/store/posStore';
import { formatCurrency } from '@/lib/utils';
import CartItem from './CartItem';
import Button from '@/components/ui/Button';

export default function CartPanel() {
  const cartItems = usePosStore((s) => s.cartItems);
  const taxRate = usePosStore((s) => s.taxRate);
  const discount = usePosStore((s) => s.discount);
  const getSubtotal = usePosStore((s) => s.getSubtotal);
  const getTax = usePosStore((s) => s.getTax);
  const getTotal = usePosStore((s) => s.getTotal);
  const getItemCount = usePosStore((s) => s.getItemCount);
  const clearCart = usePosStore((s) => s.clearCart);
  const openPaymentModal = usePosStore((s) => s.openPaymentModal);

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 py-12">
            <span className="text-4xl">🛒</span>
            <p className="text-sm">Cart is empty</p>
            <p className="text-xs">Tap a product to add it</p>
          </div>
        ) : (
          cartItems.map((item) => <CartItem key={item.product.id} item={item} />)
        )}
      </div>

      {/* Totals */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-100 px-4 pt-3 pb-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal ({itemCount} items)</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax ({taxRate}%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({discount}%)</span>
              <span>−{formatCurrency((subtotal + tax) * (discount / 100))}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span className="text-green-700">{formatCurrency(total)}</span>
          </div>

          <Button
            className="w-full mt-2"
            size="lg"
            onClick={openPaymentModal}
          >
            Pay {formatCurrency(total)}
          </Button>
        </div>
      )}
    </div>
  );
}
