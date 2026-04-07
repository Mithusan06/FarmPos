// ─── Domain Types ────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'Pet Food'
  | 'Pet Accessories'
  | 'Farm Supplies'
  | 'Livestock Feed'
  | 'Veterinary'
  | 'Seeds & Plants'
  | 'Tools & Equipment'
  | 'Other';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  imageUrl?: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
}

export type PaymentMethod = 'cash' | 'card' | 'mixed';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  status: OrderStatus;
  notes?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  orderCount: number;
  notes?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  lastRestocked?: string;
  tenantId: string;
}

export interface ReportSummary {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  averageOrderValue: number;
  topProducts: Array<{ productId: string; productName: string; quantitySold: number; revenue: number }>;
  revenueByCategory: Array<{ category: ProductCategory; revenue: number }>;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  error: string;
  details?: string;
}
