import { NextRequest, NextResponse } from 'next/server';
import { mockInventory } from '@/lib/mock/inventory';
import type { InventoryItem } from '@/types';

let inventory: InventoryItem[] = [...mockInventory];

type Params = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     tags: [Inventory]
 *     summary: Get inventory item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inventory item found
 *       404:
 *         description: Not found
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const item = inventory.find((i) => i.id === id);
  if (!item) return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
  return NextResponse.json({ data: item });
}

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     tags: [Inventory]
 *     summary: Adjust stock level for an inventory item
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
 *             adjustment: 25
 *     responses:
 *       200:
 *         description: Updated inventory item
 *       404:
 *         description: Not found
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const idx = inventory.findIndex((i) => i.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
  const { adjustment, ...rest } = await request.json();
  if (typeof adjustment === 'number') {
    inventory[idx].currentStock = Math.max(0, inventory[idx].currentStock + adjustment);
    inventory[idx].availableStock = inventory[idx].currentStock - inventory[idx].reservedStock;
    inventory[idx].lastRestocked = new Date().toISOString();
  }
  inventory[idx] = { ...inventory[idx], ...rest };
  return NextResponse.json({ data: inventory[idx] });
}
