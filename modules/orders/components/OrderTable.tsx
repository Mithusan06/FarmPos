'use client';
import { useEffect, useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import OrderStatusBadge from './OrderStatusBadge';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import type { OrderStatus } from '@/types';

const STATUSES: Array<OrderStatus | 'all'> = ['all', 'pending', 'paid', 'cancelled'];

export default function OrderTable() {
  const { orders, isLoading, fetchOrders, updateOrderStatus } = useOrderStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search order number or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{o.orderNumber}</td>
                  <td className="px-4 py-3">{o.customerName ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{o.items.length} items</td>
                  <td className="px-4 py-3 font-semibold text-green-700">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{o.paymentMethod}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    {o.status === 'pending' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateOrderStatus(o.id, 'paid')}
                          className="text-xs rounded px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200"
                        >Mark Paid</button>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'cancelled')}
                          className="text-xs rounded px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200"
                        >Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
