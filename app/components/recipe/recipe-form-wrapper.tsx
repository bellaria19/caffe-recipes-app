import { Button } from '@/components/ui/button';
import { Form } from 'react-router';

interface RecipeFormWrapperProps {
  children: React.ReactNode;
  onCancel?: () => void;
  submitText?: string;
  hiddenInputs?: { name: string; value: string }[];
}

export function RecipeFormWrapper({
  children,
  onCancel,
  submitText = '',
  hiddenInputs = [],
}: RecipeFormWrapperProps) {
  return (
    <Form method='post' className='space-y-6'>
      {children}

      {hiddenInputs.map((input, index) => (
        <input
          key={index}
          type='hidden'
          name={input.name}
          value={input.value}
        />
      ))}

      <div className='flex gap-4'>
        <Button type='submit'>완료</Button>
        <Button type='button' variant='outline' onClick={onCancel}>
          취소
        </Button>
      </div>
    </Form>
  );
}
