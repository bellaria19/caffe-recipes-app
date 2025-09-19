import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AuthInputField({
  label,
  children,
  ...props
}: {
  label: string;
  children?: React.ReactNode;
} & React.ComponentProps<'input'>) {
  return (
    <div className='grid gap-3'>
      <div className='flex items-center'>
        <Label htmlFor={props.id}>{label}</Label>
        {children}
      </div>
      <Input {...props} />
    </div>
  );
}
