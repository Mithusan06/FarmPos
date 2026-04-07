import Badge from '@/components/ui/Badge';
import type { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { variant: 'green' | 'blue' | 'red'; label: string }> = {
  paid: { variant: 'green', label: 'Paid' },
  pending: { variant: 'blue', label: 'Pending' },
  cancelled: { variant: 'red', label: 'Cancelled' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { variant, label } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}
