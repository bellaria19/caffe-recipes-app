import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectField({
  name,
  required,
  placeholder,
  options,
  value,
  onValueChange,
}: {
  name: string;
  required: boolean;
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      name={name}
      required={required}
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
