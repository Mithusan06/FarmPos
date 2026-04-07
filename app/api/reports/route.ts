import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/lib/mock/orders';
import type { ReportSummary, ProductCategory } from '@/types';

/**
 * @swagger
 * /reports:
 *   get:
 *     tags: [Reports]
 *     summary: Get sales report summary
 *     parameters:
 *       - in: query
 *         name: from
 *         description: Start date (ISO 8601)
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         description: End date (ISO 8601)
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Report summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue: { type: number }
 *                     totalOrders: { type: integer }
 *                     totalItemsSold: { type: integer }
 *                     averageOrderValue: { type: number }
 *                     topProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                     revenueByCategory:
 *                       type: array
 *                       items:
 *                         type: object
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let orders = [...mockOrders].filter((o) => o.status === 'paid');
  if (from) orders = orders.filter((o) => o.createdAt >= from);
  if (to) orders = orders.filter((o) => o.createdAt <= to + 'T23:59:59Z');

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalItemsSold = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Top products
  const productMap = new Map<string, { productId: string; productName: string; quantitySold: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = productMap.get(item.productId) ?? { productId: item.productId, productName: item.productName, quantitySold: 0, revenue: 0 };
      existing.quantitySold += item.quantity;
      existing.revenue += item.subtotal;
      productMap.set(item.productId, existing);
    }
  }
  const topProducts = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Revenue by category (from mock products data)
  const { mockProducts } = await import('@/lib/mock/products');
  const catMap = new Map<ProductCategory, number>();
  for (const order of orders) {
    for (const item of order.items) {
      const product = mockProducts.find((p) => p.id === item.productId);
      if (product) {
        catMap.set(product.category, (catMap.get(product.category) ?? 0) + item.subtotal);
      }
    }
  }
  const revenueByCategory = Array.from(catMap.entries()).map(([category, revenue]) => ({ category, revenue }));

  const summary: ReportSummary = {
    date: new Date().toISOString().slice(0, 10),
    totalRevenue,
    totalOrders,
    totalItemsSold,
    averageOrderValue,
    topProducts,
    revenueByCategory,
  };

  return NextResponse.json({ data: summary });
}
