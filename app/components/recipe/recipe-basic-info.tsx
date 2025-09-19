import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NotebookPen } from 'lucide-react';

export function RecipeBasicInfo() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <NotebookPen className='h-5 w-5 text-blue-500' />
          <CardTitle>기본 정보</CardTitle>
        </div>
        <CardDescription>레시피의 기본 정보를 입력해주세요</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-2'>
          <Label htmlFor='title'>레시피 이름</Label>
          <Input
            id='title'
            name='title'
            type='text'
            placeholder='레시피 이름'
            required
          />
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='description'>설명</Label>
          <Textarea
            id='description'
            name='description'
            placeholder='레시피에 대한 간단한 설명'
            className='resize-none'
          />
        </div>
      </CardContent>
    </Card>
  );
}
