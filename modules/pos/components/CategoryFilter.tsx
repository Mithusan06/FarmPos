'use client';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types';

const CATEGORIES: Array<ProductCategory | 'All'> = [
  'All',
  'Pet Food',
  'Pet Accessories',
  'Livestock Feed',
  'Farm Supplies',
  'Seeds & Plants',
  'Tools & Equipment',
  'Veterinary',
  'Other',
];

interface CategoryFilterProps {
  selected: ProductCategory | 'All';
  onChange: (cat: ProductCategory | 'All') => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors min-h-[40px] whitespace-nowrap',
            selected === cat
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
