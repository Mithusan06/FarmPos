'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/pos', label: 'POS', icon: '🛒' },
  { href: '/products', label: 'Products', icon: '📦' },
  { href: '/orders', label: 'Orders', icon: '📋' },
  { href: '/customers', label: 'Customers', icon: '👥' },
  { href: '/inventory', label: 'Inventory', icon: '🏭' },
  { href: '/reports', label: 'Reports', icon: '📊' },
  { href: '/settings/printer', label: 'Printer', icon: '🖨️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);

  return (
    <aside
      className={cn(
        'flex flex-col bg-gray-900 text-white transition-all duration-200',
        isSidebarOpen ? 'w-56' : 'w-16',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <span className="text-2xl">🌾</span>
        {isSidebarOpen && (
          <span className="font-bold text-lg tracking-tight">FarmPOS</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[48px]',
                active
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              )}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* API Docs link */}
      <div className="p-2 border-t border-gray-700">
        <Link
          href="/api-docs"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white min-h-[48px]"
        >
          <span className="text-xl">📖</span>
          {isSidebarOpen && <span>API Docs</span>}
        </Link>
      </div>
    </aside>
  );
}
