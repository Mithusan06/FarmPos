import { cn } from '@/lib/utils';

export default function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin',
        className,
      )}
    />
  );
}
