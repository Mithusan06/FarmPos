import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock/products';
import { generateId } from '@/lib/utils';
import type { Product } from '@/types';

// In-memory store (resets on server restart — replace with DB later)
let products: Product[] = [...mockProducts];

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List all products
 *     responses:
 *       200:
 *         description: Array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q')?.toLowerCase();

  let result = products;
  if (category) result = result.filter((p) => p.category === category);
  if (q) result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));

  return NextResponse.json({ data: result, total: result.length });
}

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             name: "Premium Dog Food 5kg"
 *             sku: "PF-DOG-999"
 *             category: "Pet Food"
 *             price: 24.99
 *             costPrice: 14.00
 *             stock: 50
 *             lowStockThreshold: 10
 *     responses:
 *       201:
 *         description: Created product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name || !body.sku || !body.category) {
    return NextResponse.json({ error: 'name, sku, and category are required' }, { status: 400 });
  }
  const now = new Date().toISOString();
  const product: Product = {
    ...body,
    id: generateId('prod'),
    tenantId: request.headers.get('x-tenant-id') ?? 'default',
    createdAt: now,
    updatedAt: now,
  };
  products.push(product);
  return NextResponse.json({ data: product }, { status: 201 });
}
