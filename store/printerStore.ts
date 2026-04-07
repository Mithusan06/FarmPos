'use client';
import { create } from 'zustand';

export type PaperWidth = '58mm' | '80mm' | 'A4';
export type PrinterConnection = 'wifi' | 'bluetooth' | 'usb' | 'browser';

export interface BusinessInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gstNumber: string;
  footerMessage: string;
  showLogo: boolean;
}

export interface PrinterSettings {
  paperWidth: PaperWidth;
  connection: PrinterConnection;
  printerName: string; // for WiFi/USB — matches OS printer name
  autoPrintOnSale: boolean;
  printCopies: number; // 1 or 2
  showItemSku: boolean;
  showTaxBreakdown: boolean;
  showCustomerInfo: boolean;
  showBarcode: boolean;
  businessInfo: BusinessInfo;
}

const DEFAULT_BUSINESS: BusinessInfo = {
  name: 'FarmPOS Store',
  tagline: 'Your trusted farm & pet shop',
  address: '123 Main Street, City - 600001',
  phone: '+91 98765 43210',
  email: 'info@farmpos.com',
  website: 'www.farmpos.com',
  gstNumber: 'GST: 33XXXXX1234X1Z5',
  footerMessage: 'Thank you for shopping with us!\nVisit again soon.',
  showLogo: true,
};

const DEFAULT_SETTINGS: PrinterSettings = {
  paperWidth: '80mm',
  connection: 'browser',
  printerName: '',
  autoPrintOnSale: false,
  printCopies: 1,
  showItemSku: true,
  showTaxBreakdown: true,
  showCustomerInfo: true,
  showBarcode: false,
  businessInfo: DEFAULT_BUSINESS,
};

interface PrinterState {
  settings: PrinterSettings;
  updateSettings: (patch: Partial<PrinterSettings>) => void;
  updateBusinessInfo: (patch: Partial<BusinessInfo>) => void;
  resetToDefaults: () => void;
}

export const usePrinterStore = create<PrinterState>((set) => ({
  settings: DEFAULT_SETTINGS,

  updateSettings: (patch) =>
    set((state) => ({ settings: { ...state.settings, ...patch } })),

  updateBusinessInfo: (patch) =>
    set((state) => ({
      settings: {
        ...state.settings,
        businessInfo: { ...state.settings.businessInfo, ...patch },
      },
    })),

  resetToDefaults: () => set({ settings: DEFAULT_SETTINGS }),
}));
