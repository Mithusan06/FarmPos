'use client';
import { useUiStore } from '@/store/uiStore';

export default function Topbar({ title }: { title?: string }) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Cashier: Admin</span>
        <div className="h-9 w-9 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}
