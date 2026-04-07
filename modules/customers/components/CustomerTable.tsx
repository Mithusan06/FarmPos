'use client';
import { useEffect, useState } from 'react';
import { useCustomerStore } from '@/store/customerStore';
import { useUiStore } from '@/store/uiStore';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import CustomerForm from './CustomerForm';
import type { Customer } from '@/types';

export default function CustomerTable() {
  const { customers, isLoading, fetchCustomers, deleteCustomer } = useCustomerStore();
  const addToast = useUiStore((s) => s.addToast);
  const [search, setSearch] = useState('');
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter(
    (c) => !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input placeholder="Search customers…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Button onClick={() => { setEditCustomer(null); setShowForm(true); }}>+ Add Customer</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Loyalty Pts</th>
                <th className="px-4 py-3">Since</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3">{c.orderCount}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-4 py-3"><Badge variant="yellow">{c.loyaltyPoints} pts</Badge></td>
                  <td className="px-4 py-3 text-gray-500">{formatDateShort(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setEditCustomer(c); setShowForm(true); }}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={async () => {
                        if (confirm('Delete customer?')) {
                          await deleteCustomer(c.id);
                          addToast('Customer deleted', 'success');
                        }
                      }}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CustomerForm isOpen={showForm} onClose={() => { setShowForm(false); setEditCustomer(null); }} customer={editCustomer} />
    </div>
  );
}
