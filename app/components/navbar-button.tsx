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
    <Button asChild variant={variant} size="sm">
      <Link to={to} className={cn('flex items-center space-x-1', className)}>
        {icon}
        <span>{children}</span>
      </Link>
    </Button>
  );
}
