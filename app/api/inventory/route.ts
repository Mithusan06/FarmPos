import { NextRequest, NextResponse } from 'next/server';
import { mockInventory } from '@/lib/mock/inventory';
import type { InventoryItem } from '@/types';

let inventory: InventoryItem[] = [...mockInventory];

/**
 * @swagger
 * /inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: List all inventory items
 *     parameters:
 *       - in: query
 *         name: lowStock
 *         description: If true, return only items below their low-stock threshold
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Array of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryItem'
 *                 total:
 *                   type: integer
 */
export async function GET(request: NextRequest) {
  const lowStock = new URL(request.url).searchParams.get('lowStock') === 'true';
  const result = lowStock
    ? inventory.filter((i) => i.availableStock <= i.lowStockThreshold)
    : inventory;
  return NextResponse.json({ data: result, total: result.length });
}
