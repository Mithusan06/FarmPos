'use client';
import { forwardRef } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';
import type { PrinterSettings } from '@/store/printerStore';

interface ThermalReceiptProps {
  order: Order;
  settings: PrinterSettings;
}

// Widths in px for screen preview (actual print uses CSS @page media)
const WIDTH_MAP = {
  '58mm': 'w-[218px]',   // 58mm ≈ 219px @96dpi
  '80mm': 'w-[302px]',   // 80mm ≈ 302px @96dpi
  'A4':   'w-[595px]',   // A4 width in px
};

const ThermalReceipt = forwardRef<HTMLDivElement, ThermalReceiptProps>(
  ({ order, settings }, ref) => {
    const { businessInfo, paperWidth, showItemSku, showTaxBreakdown, showCustomerInfo } = settings;
    const widthClass = WIDTH_MAP[paperWidth];
    const isNarrow = paperWidth === '58mm';

    return (
      <div
        ref={ref}
        className={`
          thermal-receipt
          ${widthClass}
          mx-auto bg-white
          font-mono text-black
          ${isNarrow ? 'text-[10px]' : 'text-[11px]'}
          leading-tight select-none
        `}
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        {/* ── Header ── */}
        <div className="text-center pb-2 border-b border-dashed border-gray-400">
          {businessInfo.showLogo && (
            <div className="text-2xl mb-1">🌾</div>
          )}
          <div className={`font-bold uppercase tracking-widest ${isNarrow ? 'text-sm' : 'text-base'}`}>
            {businessInfo.name}
          </div>
          {businessInfo.tagline && (
            <div className="text-gray-600 mt-0.5">{businessInfo.tagline}</div>
          )}
          <div className="mt-1 space-y-0.5 text-gray-700">
            {businessInfo.address && <div>{businessInfo.address}</div>}
            {businessInfo.phone && <div>Tel: {businessInfo.phone}</div>}
            {businessInfo.email && <div>{businessInfo.email}</div>}
            {businessInfo.website && <div>{businessInfo.website}</div>}
            {businessInfo.gstNumber && <div className="mt-1 font-semibold">{businessInfo.gstNumber}</div>}
          </div>
        </div>

        {/* ── Receipt meta ── */}
        <div className="py-2 border-b border-dashed border-gray-400 space-y-0.5">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Receipt#:</span>
            <span className="font-semibold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment:</span>
            <span className="capitalize">{order.paymentMethod}</span>
          </div>
          {showCustomerInfo && order.customerName && (
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{order.customerName}</span>
            </div>
          )}
        </div>

        {/* ── Column headers ── */}
        <div className="py-1 border-b border-dashed border-gray-400">
          <div className={`flex ${isNarrow ? 'gap-1' : 'gap-2'}`}>
            <span className="flex-1 font-bold uppercase">Item</span>
            <span className={`font-bold uppercase text-right ${isNarrow ? 'w-6' : 'w-8'}`}>Qty</span>
            <span className={`font-bold uppercase text-right ${isNarrow ? 'w-14' : 'w-16'}`}>Price</span>
            <span className={`font-bold uppercase text-right ${isNarrow ? 'w-14' : 'w-16'}`}>Total</span>
          </div>
        </div>

        {/* ── Items ── */}
        <div className="py-1 border-b border-dashed border-gray-400 space-y-1">
          {order.items.map((item, i) => (
            <div key={i}>
              <div className={`flex ${isNarrow ? 'gap-1' : 'gap-2'}`}>
                <span className="flex-1 leading-tight">{item.productName}</span>
                <span className={`text-right shrink-0 ${isNarrow ? 'w-6' : 'w-8'}`}>{item.quantity}</span>
                <span className={`text-right shrink-0 ${isNarrow ? 'w-14' : 'w-16'}`}>
                  {formatCurrency(item.unitPrice)}
                </span>
                <span className={`text-right shrink-0 font-semibold ${isNarrow ? 'w-14' : 'w-16'}`}>
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
              {showItemSku && (
                <div className="text-gray-500 pl-1">SKU: {item.sku}</div>
              )}
              {item.discount > 0 && (
                <div className="text-gray-500 pl-1">Disc: {item.discount}%</div>
              )}
            </div>
          ))}
        </div>

        {/* ── Totals ── */}
        <div className="py-2 border-b border-dashed border-gray-400 space-y-0.5">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          {showTaxBreakdown ? (
            <div className="flex justify-between text-gray-600">
              <span>Tax ({order.taxRate}%)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
          )}

          {order.discount > 0 && (
            <div className="flex justify-between">
              <span>Discount ({order.discount}%)</span>
              <span>-{formatCurrency((order.subtotal + order.tax) * (order.discount / 100))}</span>
            </div>
          )}

          {/* Bold total line */}
          <div className="flex justify-between font-bold border-t border-black mt-1 pt-1" style={{ fontSize: isNarrow ? '12px' : '14px' }}>
            <span>TOTAL</span>
            <span>{formatCurrency(order.total)}</span>
          </div>

          <div className="flex justify-between">
            <span>Paid ({order.paymentMethod.toUpperCase()})</span>
            <span>{formatCurrency(order.amountPaid)}</span>
          </div>

          {order.change > 0 && (
            <div className="flex justify-between font-semibold">
              <span>Change</span>
              <span>{formatCurrency(order.change)}</span>
            </div>
          )}
        </div>

        {/* ── Items count summary ── */}
        <div className="py-1 text-center text-gray-600 border-b border-dashed border-gray-400">
          {order.items.reduce((s, i) => s + i.quantity, 0)} item(s) — Thank you!
        </div>

        {/* ── Footer message ── */}
        {businessInfo.footerMessage && (
          <div className="py-3 text-center text-gray-600 whitespace-pre-line">
            {businessInfo.footerMessage}
          </div>
        )}

        {/* ── Barcode placeholder ── */}
        {settings.showBarcode && (
          <div className="pb-2 text-center">
            <div className="inline-block border border-gray-300 px-4 py-1 text-xs font-mono tracking-widest">
              {order.orderNumber}
            </div>
            <div className="text-xs text-gray-500 mt-1">{order.orderNumber}</div>
          </div>
        )}

        {/* Blank space at bottom for paper cut */}
        <div className="h-6" />
      </div>
    );
  },
);

ThermalReceipt.displayName = 'ThermalReceipt';
export default ThermalReceipt;
