import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/lib/mock/orders';
import type { Order } from '@/types';

let orders: Order[] = [...mockOrders];

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Not found
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ data: order });
}

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: "cancelled"
 *     responses:
 *       200:
 *         description: Updated order
 *       404:
 *         description: Not found
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const body = await request.json();
  orders[idx] = { ...orders[idx], ...body, id, updatedAt: new Date().toISOString() };
  return NextResponse.json({ data: orders[idx] });
}

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  orders.splice(idx, 1);
  return NextResponse.json({ success: true });
}
