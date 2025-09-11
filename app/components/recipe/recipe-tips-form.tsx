import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb } from 'lucide-react';

interface RecipeTipsFormProps {
  placeholder: string;
  rows?: number;
}

export function RecipeTipsForm({ placeholder, rows = 4 }: RecipeTipsFormProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Lightbulb className='h-5 w-5 text-yellow-500' />
          <CardTitle>팁 (선택사항)</CardTitle>
        </div>
        <CardDescription>
          다른 사용자들을 위한 추가 조언이나 노하우를 공유해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-2'>
          <Label htmlFor='tips'>레시피 팁</Label>
          <Textarea
            id='tips'
            name='tips'
            placeholder={placeholder}
            rows={rows}
          />
        </div>
      </CardContent>
    </Card>
  );
}
