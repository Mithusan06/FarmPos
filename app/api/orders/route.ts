import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/lib/mock/orders';
import { mockInventory } from '@/lib/mock/inventory';
import { generateId, generateOrderNumber } from '@/lib/utils';
import type { Order } from '@/types';

let orders: Order[] = [...mockOrders];

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: List all orders
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, paid, cancelled] }
 *     responses:
 *       200:
 *         description: Array of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 total:
 *                   type: integer
 */
export async function GET(request: NextRequest) {
  const status = new URL(request.url).searchParams.get('status');
  const result = status ? orders.filter((o) => o.status === status) : orders;
  return NextResponse.json({ data: result, total: result.length });
}

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order (checkout)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             items:
 *               - productId: "prod_001"
 *                 productName: "Premium Dog Food 5kg"
 *                 sku: "PF-DOG-001"
 *                 quantity: 2
 *                 unitPrice: 24.99
 *                 discount: 0
 *                 subtotal: 49.98
 *             subtotal: 49.98
 *             tax: 4.50
 *             taxRate: 9
 *             discount: 0
 *             total: 54.48
 *             paymentMethod: "cash"
 *             amountPaid: 60.00
 *             change: 5.52
 *             status: "paid"
 *     responses:
 *       201:
 *         description: Created order
 *       400:
 *         description: Validation error
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.items?.length) return NextResponse.json({ error: 'items are required' }, { status: 400 });

  const now = new Date().toISOString();
  const order: Order = {
    ...body,
    id: generateId('ord'),
    orderNumber: body.orderNumber ?? generateOrderNumber(),
    tenantId: request.headers.get('x-tenant-id') ?? 'default',
    createdAt: now,
    updatedAt: now,
    status: body.status ?? 'paid',
  };
  orders.push(order);

  // Deduct stock from inventory
  for (const item of order.items) {
    const inv = mockInventory.find((i) => i.productId === item.productId);
    if (inv) {
      inv.currentStock = Math.max(0, inv.currentStock - item.quantity);
      inv.availableStock = inv.currentStock - inv.reservedStock;
    }
  }

  return NextResponse.json({ data: order }, { status: 201 });
}
