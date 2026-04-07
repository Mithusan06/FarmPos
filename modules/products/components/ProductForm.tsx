'use client';
import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { useUiStore } from '@/store/uiStore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Product, ProductCategory } from '@/types';

const CATEGORIES: ProductCategory[] = [
  'Pet Food', 'Pet Accessories', 'Farm Supplies', 'Livestock Feed',
  'Veterinary', 'Seeds & Plants', 'Tools & Equipment', 'Other',
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

type FormData = {
  name: string; sku: string; category: ProductCategory;
  price: string; costPrice: string; stock: string;
  lowStockThreshold: string; description: string;
};

export default function ProductForm({ isOpen, onClose, product }: Props) {
  const { addProduct, updateProduct } = useProductStore();
  const addToast = useUiStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '', sku: '', category: 'Pet Food', price: '',
    costPrice: '', stock: '', lowStockThreshold: '10', description: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, sku: product.sku, category: product.category,
        price: String(product.price), costPrice: String(product.costPrice),
        stock: String(product.stock), lowStockThreshold: String(product.lowStockThreshold),
        description: product.description ?? '',
      });
    } else {
      setForm({ name: '', sku: '', category: 'Pet Food', price: '', costPrice: '', stock: '', lowStockThreshold: '10', description: '' });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        costPrice: parseFloat(form.costPrice),
        stock: parseInt(form.stock),
        lowStockThreshold: parseInt(form.lowStockThreshold),
      };
      if (product) {
        await updateProduct(product.id, data);
        addToast('Product updated', 'success');
      } else {
        await addProduct(data);
        addToast('Product added', 'success');
      }
      onClose();
    } catch {
      addToast('Failed to save product', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" value={form.name} onChange={set('name')} required />
          <Input label="SKU" value={form.sku} onChange={set('sku')} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.category}
            onChange={set('category')}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none min-h-[44px]"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Selling Price ($)" type="number" step="0.01" value={form.price} onChange={set('price')} required />
          <Input label="Cost Price ($)" type="number" step="0.01" value={form.costPrice} onChange={set('costPrice')} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Stock Qty" type="number" value={form.stock} onChange={set('stock')} required />
          <Input label="Low Stock Alert" type="number" value={form.lowStockThreshold} onChange={set('lowStockThreshold')} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={2}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isLoading}>{product ? 'Save Changes' : 'Add Product'}</Button>
        </div>
      </form>
    </Modal>
  );
}
