import type { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'ord_001', orderNumber: 'ORD-20250401-120001', customerId: 'cust_001', customerName: 'Alice Farmer',
    items: [
      { productId: 'prod_001', productName: 'Premium Dog Food 5kg', sku: 'PF-DOG-001', quantity: 2, unitPrice: 24.99, discount: 0, subtotal: 49.98 },
      { productId: 'prod_007', productName: 'Pet Shampoo 500ml', sku: 'ACC-PET-001', quantity: 1, unitPrice: 9.99, discount: 0, subtotal: 9.99 },
    ],
    subtotal: 59.97, tax: 5.40, taxRate: 9, discount: 0, total: 65.37,
    paymentMethod: 'card', amountPaid: 65.37, change: 0,
    status: 'paid', tenantId: 'default', createdAt: '2025-04-01T12:00:00Z', updatedAt: '2025-04-01T12:00:00Z',
  },
  {
    id: 'ord_002', orderNumber: 'ORD-20250401-140530', customerId: 'cust_003', customerName: 'Carol Grower',
    items: [
      { productId: 'prod_012', productName: 'Fertiliser NPK 5kg', sku: 'FS-FERT-001', quantity: 3, unitPrice: 19.99, discount: 5, subtotal: 56.97 },
      { productId: 'prod_019', productName: 'Sunflower Seeds 500g', sku: 'SP-SUN-001', quantity: 5, unitPrice: 4.49, discount: 0, subtotal: 22.45 },
    ],
    subtotal: 79.42, tax: 7.15, taxRate: 9, discount: 5, total: 81.57,
    paymentMethod: 'cash', amountPaid: 100.00, change: 18.43,
    status: 'paid', tenantId: 'default', createdAt: '2025-04-01T14:05:00Z', updatedAt: '2025-04-01T14:05:00Z',
  },
  {
    id: 'ord_003', orderNumber: 'ORD-20250402-093015', customerId: 'cust_002', customerName: 'Bob Rancher',
    items: [
      { productId: 'prod_008', productName: 'Cattle Feed 25kg', sku: 'LF-COW-001', quantity: 2, unitPrice: 39.99, discount: 0, subtotal: 79.98 },
    ],
    subtotal: 79.98, tax: 7.20, taxRate: 9, discount: 0, total: 87.18,
    paymentMethod: 'cash', amountPaid: 90.00, change: 2.82,
    status: 'paid', tenantId: 'default', createdAt: '2025-04-02T09:30:00Z', updatedAt: '2025-04-02T09:30:00Z',
  },
  {
    id: 'ord_004', orderNumber: 'ORD-20250403-161200',
    items: [
      { productId: 'prod_009', productName: 'Chicken Layer Pellets 20kg', sku: 'LF-CHKN-001', quantity: 1, unitPrice: 28.99, discount: 0, subtotal: 28.99 },
    ],
    subtotal: 28.99, tax: 2.61, taxRate: 9, discount: 0, total: 31.60,
    paymentMethod: 'card', amountPaid: 31.60, change: 0,
    status: 'pending', tenantId: 'default', createdAt: '2025-04-03T16:12:00Z', updatedAt: '2025-04-03T16:12:00Z',
  },
];
