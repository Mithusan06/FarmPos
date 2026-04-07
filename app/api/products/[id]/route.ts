import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mock/products';
import type { Product } from '@/types';

let products: Product[] = [...mockProducts];

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not found
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({ data: product });
}

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Updated product
 *       404:
 *         description: Not found
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const body = await request.json();
  products[idx] = { ...products[idx], ...body, id, updatedAt: new Date().toISOString() };
  return NextResponse.json({ data: products[idx] });
}

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
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
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  products.splice(idx, 1);
  return NextResponse.json({ success: true });
}
