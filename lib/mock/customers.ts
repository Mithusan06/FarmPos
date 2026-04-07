import type { Customer } from '@/types';

export const mockCustomers: Customer[] = [
  { id: 'cust_001', name: 'Alice Farmer', email: 'alice@example.com', phone: '555-0101', address: '12 Meadow Lane', loyaltyPoints: 250, totalSpent: 489.75, orderCount: 12, tenantId: 'default', createdAt: '2024-10-01T10:00:00Z', updatedAt: '2025-03-15T10:00:00Z' },
  { id: 'cust_002', name: 'Bob Rancher', email: 'bob@example.com', phone: '555-0102', address: '45 Hillside Road', loyaltyPoints: 100, totalSpent: 210.30, orderCount: 6, tenantId: 'default', createdAt: '2024-11-05T10:00:00Z', updatedAt: '2025-02-20T10:00:00Z' },
  { id: 'cust_003', name: 'Carol Grower', email: 'carol@example.com', phone: '555-0103', address: '8 Orchard Street', loyaltyPoints: 520, totalSpent: 1040.00, orderCount: 25, tenantId: 'default', createdAt: '2024-08-12T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },
  { id: 'cust_004', name: 'Dave Shepherd', phone: '555-0104', loyaltyPoints: 75, totalSpent: 150.50, orderCount: 4, tenantId: 'default', createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-03-10T10:00:00Z' },
  { id: 'cust_005', name: 'Eve Breeder', email: 'eve@example.com', phone: '555-0105', address: '77 Stables Way', loyaltyPoints: 310, totalSpent: 624.00, orderCount: 15, tenantId: 'default', createdAt: '2024-09-18T10:00:00Z', updatedAt: '2025-04-03T10:00:00Z' },
];
