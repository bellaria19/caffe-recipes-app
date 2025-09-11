import { RecipeBasicInfo } from '@/components/recipe/recipe-basic-info';
import { RecipeFormWrapper } from '@/components/recipe/recipe-form-wrapper';
import { RecipeTipsForm } from '@/components/recipe/recipe-tips-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EspressoRecipeFormProps {
  onCancel?: () => void;
}

export function EspressoRecipeForm({ onCancel }: EspressoRecipeFormProps) {
  const tipPlaceholder =
    '예:\n• 원두는 추출 직전에 갈아주세요\n• 첫 번째 드롭이 나올 때까지의 시간을 체크해보세요\n• 크레마의 색깔로 추출 상태를 확인할 수 있습니다';

  return (
    <RecipeFormWrapper
      onCancel={onCancel}
      hiddenInputs={[{ name: 'brewType', value: 'espresso' }]}
    >
      <RecipeBasicInfo />

      <Card>
        <CardHeader>
          <CardTitle>에스프레소 파라미터</CardTitle>
          <CardDescription>
            에스프레소 추출에 필요한 4가지 핵심 값을 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='grid gap-2'>
              <Label htmlFor='waterTemperature'>물 온도 (°C)</Label>
              <Input
                id='waterTemperature'
                name='waterTemperature'
                type='number'
                min='85'
                max='96'
                step='0.1'
                placeholder='92.0'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='coffeeAmount'>원두 양 (g)</Label>
              <Input
                id='coffeeAmount'
                name='coffeeAmount'
                type='number'
                min='14'
                max='22'
                step='0.1'
                placeholder='18.0'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='extractionTime'>추출 시간 (초)</Label>
              <Input
                id='extractionTime'
                name='extractionTime'
                type='number'
                min='20'
                max='40'
                step='1'
                placeholder='28'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='extractionAmount'>추출량 (ml)</Label>
              <Input
                id='extractionAmount'
                name='extractionAmount'
                type='number'
                min='25'
                max='60'
                step='1'
                placeholder='36'
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <RecipeTipsForm placeholder={tipPlaceholder} rows={4} />
    </RecipeFormWrapper>
  );
}
