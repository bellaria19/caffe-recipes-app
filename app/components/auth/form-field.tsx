import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  error?: string | string[];
  children?: React.ReactNode;
}

export function FormField({
  label,
  name,
  type,
  placeholder,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className='grid gap-3'>
      <div className='flex items-center'>
        <Label htmlFor={name}>{label}</Label>
        {children}
      </div>
      <Input
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
      {error && (
        <p className='text-sm text-red-500'>
          {Array.isArray(error) ? error.join(', ') : error}
        </p>
      )}
    </div>
  );
}
