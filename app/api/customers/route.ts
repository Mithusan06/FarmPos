import { NextRequest, NextResponse } from 'next/server';
import { mockCustomers } from '@/lib/mock/customers';
import { generateId } from '@/lib/utils';
import type { Customer } from '@/types';

let customers: Customer[] = [...mockCustomers];

/**
 * @swagger
 * /customers:
 *   get:
 *     tags: [Customers]
 *     summary: List all customers
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Search by name, email, or phone
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *                 total:
 *                   type: integer
 */
export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get('q')?.toLowerCase();
  const result = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q),
      )
    : customers;
  return NextResponse.json({ data: result, total: result.length });
}

/**
 * @swagger
 * /customers:
 *   post:
 *     tags: [Customers]
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *           example:
 *             name: "Jane Doe"
 *             email: "jane@example.com"
 *             phone: "555-0199"
 *             address: "99 Country Road"
 *     responses:
 *       201:
 *         description: Created customer
 *       400:
 *         description: Validation error
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  const now = new Date().toISOString();
  const customer: Customer = {
    loyaltyPoints: 0,
    totalSpent: 0,
    orderCount: 0,
    ...body,
    id: generateId('cust'),
    tenantId: request.headers.get('x-tenant-id') ?? 'default',
    createdAt: now,
    updatedAt: now,
  };
  customers.push(customer);
  return NextResponse.json({ data: customer }, { status: 201 });
}
