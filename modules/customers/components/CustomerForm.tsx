'use client';
import { useState, useEffect } from 'react';
import { useCustomerStore } from '@/store/customerStore';
import { useUiStore } from '@/store/uiStore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Customer } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export default function CustomerForm({ isOpen, onClose, customer }: Props) {
  const { addCustomer, updateCustomer } = useCustomerStore();
  const addToast = useUiStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' });

  useEffect(() => {
    if (customer) {
      setForm({ name: customer.name, email: customer.email ?? '', phone: customer.phone ?? '', address: customer.address ?? '', notes: customer.notes ?? '' });
    } else {
      setForm({ name: '', email: '', phone: '', address: '', notes: '' });
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (customer) {
        await updateCustomer(customer.id, form);
        addToast('Customer updated', 'success');
      } else {
        await addCustomer(form);
        addToast('Customer added', 'success');
      }
      onClose();
    } catch {
      addToast('Failed to save customer', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customer ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" value={form.name} onChange={set('name')} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Email" type="email" value={form.email} onChange={set('email')} />
          <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} />
        </div>
        <Input label="Address" value={form.address} onChange={set('address')} />
        <div>
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea value={form.notes} onChange={set('notes')} rows={2}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isLoading}>{customer ? 'Save Changes' : 'Add Customer'}</Button>
        </div>
      </form>
    </Modal>
  );
}
