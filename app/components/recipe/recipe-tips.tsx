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

export function RecipeTips() {
  const placeholder =
    '• 원두는 추출 직전에 갈아주세요\n• 첫 번째 드롭이 나올 때까지의 시간을 체크해보세요\n• 크레마의 색깔로 추출 상태를 확인할 수 있습니다';

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
            className='resize-none'
          />
        </div>
      </CardContent>
    </Card>
  );
}
