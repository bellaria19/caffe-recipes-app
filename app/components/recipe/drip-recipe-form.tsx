import type { DripStep } from '@/lib/types';

import { BrewingTypeSelector } from '@/components/recipe/brewing-type-selector';
import { RecipeBasicInfo } from '@/components/recipe/recipe-basic-info';
import { RecipeFormWrapper } from '@/components/recipe/recipe-form-wrapper';
import { RecipeTipsForm } from '@/components/recipe/recipe-tips-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DripRecipeFormProps {
  onCancel?: () => void;
}

export function DripRecipeForm({ onCancel }: DripRecipeFormProps) {
  const [brewingType, setBrewingType] = useState<'hot' | 'ice'>('hot');
  const [extractionSteps, setExtractionSteps] = useState<DripStep[]>([
    { stepName: 'Blooming', waterAmount: 40, duration: 30 },
    { stepName: 'Pour 1st', waterAmount: 70 },
    { stepName: '2nd', waterAmount: 50 },
    { stepName: '3rd', waterAmount: 50 },
  ]);

  const tipPlaceholder =
    '예:\n• 필터를 충분히 적셔서 종이 맛을 제거해주세요\n• 뜸을 들일 때 원두가 균등하게 부풀어 오르는지 확인하세요\n• 물을 부을 때는 중심에서 바깥쪽으로 원을 그려주세요\n• 추출 시간이 너무 길면 분쇄도를 거칠게 조정하세요';

  const addStep = () => {
    setExtractionSteps([...extractionSteps, { stepName: '', waterAmount: 0 }]);
  };

  const removeStep = (index: number) => {
    if (extractionSteps.length > 1) {
      setExtractionSteps(extractionSteps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (
    index: number,
    field: keyof DripStep,
    value: string | number | undefined
  ) => {
    const updatedSteps = [...extractionSteps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setExtractionSteps(updatedSteps);
  };

  return (
    <RecipeFormWrapper
      onCancel={onCancel}
      hiddenInputs={[
        { name: 'brewType', value: 'drip' },
        { name: 'brewingType', value: brewingType },
        { name: 'extractionSteps', value: JSON.stringify(extractionSteps) },
      ]}
    >
      <RecipeBasicInfo />

      <BrewingTypeSelector
        brewingType={brewingType}
        onBrewingTypeChange={setBrewingType}
      />

      <Card>
        <CardHeader>
          <CardTitle>드립 파라미터</CardTitle>
          <CardDescription>
            드립 커피 추출에 필요한 핵심 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='grid gap-2'>
              <Label htmlFor='coffeeAmount'>원두 양 (g)</Label>
              <Input
                id='coffeeAmount'
                name='coffeeAmount'
                type='number'
                min='10'
                max='30'
                step='1'
                placeholder='20'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='waterTemperature'>물 온도 (°C)</Label>
              <Input
                id='waterTemperature'
                name='waterTemperature'
                type='number'
                min='85'
                max='96'
                step='1'
                placeholder='93'
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='grindSize'>분쇄도</Label>
              <Input
                id='grindSize'
                name='grindSize'
                type='text'
                placeholder='예: 중간 분쇄 (1,000-1,100μm)'
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>추출 단계</CardTitle>
              <CardDescription>
                각 단계별 물의 양과 시간을 설정해주세요
              </CardDescription>
            </div>
            <Button type='button' variant='outline' size='sm' onClick={addStep}>
              <Plus className='mr-1 h-4 w-4' />
              단계 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {extractionSteps.map((step, index) => (
            <div
              key={index}
              className='grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-4'
            >
              <div className='grid gap-2'>
                <Label>단계 이름</Label>
                <Input
                  placeholder='예: Blooming'
                  value={step.stepName}
                  onChange={(e) =>
                    updateStep(index, 'stepName', e.target.value)
                  }
                  required
                />
              </div>

              <div className='grid gap-2'>
                <Label>물의 양 (g)</Label>
                <Input
                  type='number'
                  min='10'
                  max='200'
                  step='5'
                  placeholder='40'
                  value={step.waterAmount}
                  onChange={(e) =>
                    updateStep(
                      index,
                      'waterAmount',
                      parseInt(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>

              <div className='grid gap-2'>
                <Label>시간 (초) - 선택사항</Label>
                <Input
                  type='number'
                  min='5'
                  max='120'
                  step='5'
                  placeholder='30'
                  value={step.duration || ''}
                  onChange={(e) =>
                    updateStep(
                      index,
                      'duration',
                      parseInt(e.target.value) || undefined
                    )
                  }
                />
              </div>

              <div className='flex items-end'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeStep(index)}
                  disabled={extractionSteps.length === 1}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <RecipeTipsForm placeholder={tipPlaceholder} rows={5} />
    </RecipeFormWrapper>
  );
}
