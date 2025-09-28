import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';

interface NavbarButtonProps {
  to: string;
  variant?: 'ghost' | 'outline' | 'default';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function NavbarButton({
  to,
  variant = 'ghost',
  icon,
  children,
  className,
}: NavbarButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size='sm'
      className={cn(
        'transition-all duration-200',
        variant === 'outline' && 'border-primary/30 hover:bg-primary/10 hover:border-primary',
        variant === 'default' && 'bg-primary hover:bg-primary/90',
        className
      )}
    >
      <Link to={to} className="flex items-center space-x-1">
        {icon}
        <span>{children}</span>
      </Link>
    </Button>
  );
}
