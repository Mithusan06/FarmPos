import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white shadow-sm border border-gray-100',
        padding && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
