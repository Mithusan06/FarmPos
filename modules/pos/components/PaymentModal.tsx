'use client';
import { useState } from 'react';
import { usePosStore } from '@/store/posStore';
import { useOrderStore } from '@/store/orderStore';
import { useUiStore } from '@/store/uiStore';
import { formatCurrency, generateOrderNumber } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { PaymentMethod, OrderItem } from '@/types';

export default function PaymentModal() {
  const isOpen = usePosStore((s) => s.isPaymentModalOpen);
  const closePaymentModal = usePosStore((s) => s.closePaymentModal);
  const openReceiptModal = usePosStore((s) => s.openReceiptModal);
  const clearCart = usePosStore((s) => s.clearCart);
  const cartItems = usePosStore((s) => s.cartItems);
  const activeCustomer = usePosStore((s) => s.activeCustomer);
  const taxRate = usePosStore((s) => s.taxRate);
  const discount = usePosStore((s) => s.discount);
  const paymentMethod = usePosStore((s) => s.paymentMethod);
  const setPaymentMethod = usePosStore((s) => s.setPaymentMethod);
  const getSubtotal = usePosStore((s) => s.getSubtotal);
  const getTax = usePosStore((s) => s.getTax);
  const getTotal = usePosStore((s) => s.getTotal);

  const createOrder = useOrderStore((s) => s.createOrder);
  const addToast = useUiStore((s) => s.addToast);

  const [amountPaid, setAmountPaid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotal();
  const subtotal = getSubtotal();
  const tax = getTax();
  const paid = parseFloat(amountPaid) || 0;
  const change = Math.max(0, paid - total);

  const handlePayment = async () => {
    if (paymentMethod === 'cash' && paid < total) return;
    setIsProcessing(true);
    try {
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        subtotal: item.unitPrice * item.quantity * (1 - item.discount / 100),
      }));

      const order = await createOrder({
        orderNumber: generateOrderNumber(),
        customerId: activeCustomer?.id,
        customerName: activeCustomer?.name,
        items: orderItems,
        subtotal,
        tax,
        taxRate,
        discount,
        total,
        paymentMethod,
        amountPaid: paymentMethod === 'card' ? total : paid,
        change: paymentMethod === 'card' ? 0 : change,
        status: 'paid',
      });

      closePaymentModal();
      clearCart();
      addToast('Payment successful!', 'success');
      openReceiptModal(order.id);
    } catch {
      addToast('Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string; icon: string }> = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Card', icon: '💳' },
    { value: 'mixed', label: 'Split', icon: '🔀' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={closePaymentModal} title="Payment" size="md">
      <div className="space-y-5">
        {/* Amount Summary */}
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-sm text-gray-600">Total Due</p>
          <p className="text-4xl font-bold text-green-700 mt-1">{formatCurrency(total)}</p>
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setPaymentMethod(m.value)}
                className={`flex flex-col items-center gap-1 rounded-xl p-3 border-2 transition-colors min-h-[72px] ${
                  paymentMethod === m.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="text-sm font-medium text-gray-700">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cash input */}
        {paymentMethod !== 'card' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Amount Received</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder={`${total.toFixed(2)}`}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl font-semibold focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {/* Quick amounts */}
            <div className="flex gap-2 flex-wrap">
              {[total, Math.ceil(total / 10) * 10, Math.ceil(total / 50) * 50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmountPaid(amt.toFixed(2))}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
            {paid >= total && (
              <div className="flex justify-between rounded-lg bg-blue-50 px-4 py-2 text-sm">
                <span className="text-gray-600">Change</span>
                <span className="font-semibold text-blue-700">{formatCurrency(change)}</span>
              </div>
            )}
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handlePayment}
          loading={isProcessing}
          disabled={paymentMethod === 'cash' && paid < total}
        >
          Confirm Payment
        </Button>
      </div>
    </Modal>
  );
}
