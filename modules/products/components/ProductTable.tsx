'use client';
import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import { useUiStore } from '@/store/uiStore';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import ProductForm from './ProductForm';
import type { Product } from '@/types';

export default function ProductTable() {
  const { products, isLoading, fetchProducts, deleteProduct } = useProductStore();
  const addToast = useUiStore((s) => s.addToast);
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    addToast('Product deleted', 'success');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => { setEditProduct(null); setShowForm(true); }}>
          + Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-gray-500">{p.sku}</td>
                  <td className="px-4 py-3"><Badge variant="blue">{p.category}</Badge></td>
                  <td className="px-4 py-3 font-semibold text-green-700">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= p.lowStockThreshold ? 'text-orange-600 font-semibold' : 'text-gray-700'}>
                      {p.stock}
                      {p.stock <= p.lowStockThreshold && p.stock > 0 && <span className="ml-1 text-xs">(Low)</span>}
                      {p.stock === 0 && <span className="ml-1 text-xs text-red-500">(Out)</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateShort(p.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setEditProduct(p); setShowForm(true); }}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ProductForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditProduct(null); }}
        product={editProduct}
      />
    </div>
  );
}
