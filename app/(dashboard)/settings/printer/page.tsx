'use client';
import { useState } from 'react';
import { usePrinterStore } from '@/store/printerStore';
import { useUiStore } from '@/store/uiStore';
import Topbar from '@/components/layout/Topbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import type { PaperWidth, PrinterConnection } from '@/store/printerStore';

const PAPER_OPTIONS: Array<{ value: PaperWidth; label: string; desc: string }> = [
  { value: '58mm', label: '58mm', desc: 'Small / compact printers' },
  { value: '80mm', label: '80mm', desc: 'Industry standard (recommended)' },
  { value: 'A4',   label: 'A4',   desc: 'Full page / laser printer' },
];

const CONNECTION_OPTIONS: Array<{ value: PrinterConnection; label: string; icon: string; desc: string }> = [
  { value: 'browser',   label: 'Browser Print', icon: '🖥️', desc: 'Uses system print dialog — works with any printer' },
  { value: 'wifi',      label: 'WiFi / Network', icon: '📶', desc: 'Connect via IP address on local network' },
  { value: 'bluetooth', label: 'Bluetooth',      icon: '🔵', desc: 'Pair via Web Bluetooth API (Chrome/Edge)' },
  { value: 'usb',       label: 'USB / Direct',   icon: '🔌', desc: 'USB connected — select from OS printer list' },
];

export default function PrinterSettingsPage() {
  const { settings, updateSettings, updateBusinessInfo, resetToDefaults } = usePrinterStore();
  const addToast = useUiStore((s) => s.addToast);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    addToast('Printer settings saved!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const bi = settings.businessInfo;

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Printer Settings" />
      <div className="flex-1 overflow-auto p-6 max-w-3xl space-y-6">

        {/* ── Business Info ── */}
        <Card>
          <h2 className="font-semibold text-gray-900 text-base mb-4 flex items-center gap-2">
            🏪 Business Information
            <span className="text-xs font-normal text-gray-400">(Printed on every receipt)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              value={bi.name}
              onChange={(e) => updateBusinessInfo({ name: e.target.value })}
              placeholder="FarmPOS Store"
            />
            <Input
              label="Tagline"
              value={bi.tagline}
              onChange={(e) => updateBusinessInfo({ tagline: e.target.value })}
              placeholder="Your trusted farm & pet shop"
            />
            <Input
              label="Address"
              value={bi.address}
              onChange={(e) => updateBusinessInfo({ address: e.target.value })}
              placeholder="123 Main St, City - 600001"
            />
            <Input
              label="Phone"
              value={bi.phone}
              onChange={(e) => updateBusinessInfo({ phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Email"
              value={bi.email}
              onChange={(e) => updateBusinessInfo({ email: e.target.value })}
              placeholder="info@yourstore.com"
            />
            <Input
              label="Website"
              value={bi.website}
              onChange={(e) => updateBusinessInfo({ website: e.target.value })}
              placeholder="www.yourstore.com"
            />
            <Input
              label="GST / Tax Number"
              value={bi.gstNumber}
              onChange={(e) => updateBusinessInfo({ gstNumber: e.target.value })}
              placeholder="GST: 33XXXXX1234X1Z5"
            />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Footer Message</label>
            <textarea
              value={bi.footerMessage}
              onChange={(e) => updateBusinessInfo({ footerMessage: e.target.value })}
              rows={3}
              placeholder="Thank you for shopping with us!"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="checkbox"
              id="showLogo"
              checked={bi.showLogo}
              onChange={(e) => updateBusinessInfo({ showLogo: e.target.checked })}
              className="h-4 w-4 accent-green-600"
            />
            <label htmlFor="showLogo" className="text-sm text-gray-700">Show logo / icon on receipt</label>
          </div>
        </Card>

        {/* ── Paper Width ── */}
        <Card>
          <h2 className="font-semibold text-gray-900 text-base mb-4 flex items-center gap-2">
            📏 Paper Width
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {PAPER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSettings({ paperWidth: opt.value })}
                className={`flex flex-col items-start rounded-xl p-4 border-2 transition-all text-left ${
                  settings.paperWidth === opt.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl mb-1">
                  {opt.value === '58mm' ? '📃' : opt.value === '80mm' ? '🧾' : '📄'}
                </span>
                <span className="font-bold text-gray-900">{opt.label}</span>
                <span className="text-xs text-gray-500 mt-0.5">{opt.desc}</span>
                {opt.value === '80mm' && (
                  <span className="mt-2 text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">
                    Recommended
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* ── Printer Connection ── */}
        <Card>
          <h2 className="font-semibold text-gray-900 text-base mb-4 flex items-center gap-2">
            🔗 Printer Connection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONNECTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSettings({ connection: opt.value })}
                className={`flex items-start gap-3 rounded-xl p-4 border-2 transition-all text-left ${
                  settings.connection === opt.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl shrink-0">{opt.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Printer name — shown for USB/WiFi */}
          {(settings.connection === 'usb' || settings.connection === 'wifi') && (
            <div className="mt-4">
              <Input
                label={settings.connection === 'wifi' ? 'Printer IP Address' : 'Printer Name (OS)'}
                value={settings.printerName}
                onChange={(e) => updateSettings({ printerName: e.target.value })}
                placeholder={settings.connection === 'wifi' ? '192.168.1.100' : 'e.g. EPSON_TM_T82'}
              />
              {settings.connection === 'wifi' && (
                <p className="mt-1.5 text-xs text-gray-500">
                  Enter the static IP of your thermal printer on the local network.
                </p>
              )}
            </div>
          )}

          {settings.connection === 'bluetooth' && (
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
              <p className="font-semibold">Web Bluetooth Setup</p>
              <p className="mt-1">
                1. Open this app in Chrome or Edge.<br />
                2. Click <strong>Print</strong> on any receipt.<br />
                3. A popup will ask you to select your Bluetooth printer.<br />
                4. Pair once — it will remember for future prints.
              </p>
            </div>
          )}

          {settings.connection === 'usb' && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
              <p className="font-semibold">USB / Direct Print Setup</p>
              <p className="mt-1">
                Make sure your thermal printer is installed as a system printer. <br />
                When you click Print, select your thermal printer from the print dialog.<br />
                Set <strong>Paper size</strong> to <strong>{settings.paperWidth}</strong> in the print dialog.
              </p>
            </div>
          )}
        </Card>

        {/* ── Receipt Options ── */}
        <Card>
          <h2 className="font-semibold text-gray-900 text-base mb-4">🧾 Receipt Options</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Auto-print on sale</p>
                <p className="text-xs text-gray-500">Automatically send to printer after payment</p>
              </div>
              <ToggleSwitch
                checked={settings.autoPrintOnSale}
                onChange={(v) => updateSettings({ autoPrintOnSale: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Print 2 copies</p>
                <p className="text-xs text-gray-500">One for customer, one for shop record</p>
              </div>
              <ToggleSwitch
                checked={settings.printCopies === 2}
                onChange={(v) => updateSettings({ printCopies: v ? 2 : 1 })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show item SKU</p>
                <p className="text-xs text-gray-500">Print SKU code below each item name</p>
              </div>
              <ToggleSwitch
                checked={settings.showItemSku}
                onChange={(v) => updateSettings({ showItemSku: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show tax breakdown</p>
                <p className="text-xs text-gray-500">Print tax % rate on receipt</p>
              </div>
              <ToggleSwitch
                checked={settings.showTaxBreakdown}
                onChange={(v) => updateSettings({ showTaxBreakdown: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show customer name</p>
                <p className="text-xs text-gray-500">Print customer name if attached to order</p>
              </div>
              <ToggleSwitch
                checked={settings.showCustomerInfo}
                onChange={(v) => updateSettings({ showCustomerInfo: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Show order barcode</p>
                <p className="text-xs text-gray-500">Print order number as barcode at bottom</p>
              </div>
              <ToggleSwitch
                checked={settings.showBarcode}
                onChange={(v) => updateSettings({ showBarcode: v })}
              />
            </div>
          </div>
        </Card>

        {/* ── Supported Printers ── */}
        <Card>
          <h2 className="font-semibold text-gray-900 text-base mb-3">🖨️ Compatible Printer Models</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {COMPATIBLE_PRINTERS.map((p) => (
              <div key={p} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-gray-700">
                {p}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Any ESC/POS compatible thermal printer works. For WiFi/Bluetooth models, ensure the printer is on the same network or paired.
          </p>
        </Card>

        {/* ── Save / Reset ── */}
        <div className="flex gap-3 pb-6">
          <Button variant="outline" onClick={resetToDefaults}>Reset to Defaults</Button>
          <Button onClick={handleSave} loading={false} className="flex-1">
            {saved ? '✓ Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Toggle Switch Component ──
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
        checked ? 'bg-green-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

const COMPATIBLE_PRINTERS = [
  'Epson TM-T82',
  'Epson TM-T88',
  'Epson TM-T20',
  'Star TSP143',
  'Star TSP654',
  'Bixolon SRP-350',
  'RP-326',
  'Sewoo SLK-TS400',
  'TVS RP-45',
  'TVS RP-3200',
  'Posiflex PP-8000',
  'iDPRT SP-420',
  'Xprinter XP-N160II',
  'SNBC BTP-R890',
  'Any ESC/POS printer',
];
