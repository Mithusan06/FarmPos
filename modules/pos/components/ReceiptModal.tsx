'use client';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { usePosStore } from '@/store/posStore';
import { useOrderStore } from '@/store/orderStore';
import { usePrinterStore } from '@/store/printerStore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ThermalReceipt from './ThermalReceipt';
import type { PaperWidth } from '@/store/printerStore';

// CSS @page sizes for each paper width
const PAGE_STYLE: Record<PaperWidth, string> = {
  '58mm': `
    @page { size: 58mm auto; margin: 0; }
    @media print { body { margin: 0; } .thermal-receipt { width: 58mm !important; } }
  `,
  '80mm': `
    @page { size: 80mm auto; margin: 0; }
    @media print { body { margin: 0; } .thermal-receipt { width: 80mm !important; } }
  `,
  'A4': `
    @page { size: A4; margin: 10mm; }
    @media print { body { margin: 0; } .thermal-receipt { width: 100% !important; } }
  `,
};

export default function ReceiptModal() {
  const isOpen = usePosStore((s) => s.isReceiptModalOpen);
  const lastOrderId = usePosStore((s) => s.lastOrderId);
  const closeReceiptModal = usePosStore((s) => s.closeReceiptModal);
  const orders = useOrderStore((s) => s.orders);
  const settings = usePrinterStore((s) => s.settings);

  const order = orders.find((o) => o.id === lastOrderId);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: PAGE_STYLE[settings.paperWidth],
    documentTitle: order ? `Receipt-${order.orderNumber}` : 'Receipt',
    onAfterPrint: () => {
      // If 2 copies requested, print again automatically
      if (settings.printCopies === 2) {
        setTimeout(() => handlePrint(), 500);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeReceiptModal}
      title="Receipt Preview"
      size="lg"
    >
      {order ? (
        <div className="flex flex-col gap-4">
          {/* ── Print controls ── */}
          <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 border border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>📄</span>
              <span>
                <strong>{settings.paperWidth}</strong> · {settings.connection.toUpperCase()} ·{' '}
                {settings.printerName || 'Default Printer'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/settings/printer', '_blank')}
              >
                ⚙️ Settings
              </Button>
              <Button
                size="sm"
                onClick={() => handlePrint()}
              >
                🖨️ Print {settings.printCopies > 1 ? `(${settings.printCopies}×)` : ''}
              </Button>
            </div>
          </div>

          {/* ── Receipt preview ── */}
          <div className="overflow-auto max-h-[60vh] rounded-xl border border-gray-200 bg-gray-100 p-4 flex justify-center">
            <ThermalReceipt ref={receiptRef} order={order} settings={settings} />
          </div>

          {/* ── Bottom actions ── */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={closeReceiptModal}>
              Close
            </Button>
            <Button className="flex-1" onClick={() => handlePrint()}>
              🖨️ Print Receipt
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">Receipt not available</p>
      )}
    </Modal>
  );
}
