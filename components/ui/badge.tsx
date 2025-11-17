import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'malachite' | 'amber' | 'bittersweet' | 'white' | 'default';
  className?: string;
}

const variantStyles = {
  malachite: 'bg-malachite/20 text-malachite border-malachite/30',
  amber: 'bg-amber/20 text-amber border-amber/30',
  bittersweet: 'bg-bittersweet/20 text-bittersweet border-bittersweet/30',
  white: 'bg-white/20 text-white border-white/30',
  default: 'bg-white/10 text-white/70 border-white/20',
};

export const Badge = ({
  children,
  variant = 'default',
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex px-3 py-1 rounded-full text-xs font-sans border transition-colors',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
