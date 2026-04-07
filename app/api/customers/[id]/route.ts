import { NextRequest, NextResponse } from 'next/server';
import { mockCustomers } from '@/lib/mock/customers';
import type { Customer } from '@/types';

let customers: Customer[] = [...mockCustomers];

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Customer found
 *       404:
 *         description: Not found
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const customer = customers.find((c) => c.id === id);
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  return NextResponse.json({ data: customer });
}

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     tags: [Customers]
 *     summary: Update a customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Updated customer
 *       404:
 *         description: Not found
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  const body = await request.json();
  customers[idx] = { ...customers[idx], ...body, id, updatedAt: new Date().toISOString() };
  return NextResponse.json({ data: customers[idx] });
}

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     summary: Delete a customer
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
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  customers.splice(idx, 1);
  return NextResponse.json({ success: true });
}
