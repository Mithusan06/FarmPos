'use client';
import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { usePosStore } from '@/store/posStore';
import CategoryFilter from './CategoryFilter';
import ProductTile from './ProductTile';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import type { ProductCategory } from '@/types';

export default function ProductGrid() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const addItem = usePosStore((s) => s.addItem);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col h-full gap-3">
      <Input
        placeholder="Search product or SKU…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />
      <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((product) => (
              <ProductTile key={product.id} product={product} onAdd={addItem} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-gray-400 py-12">No products found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
