import type { Route } from '.react-router/types/app/features/recipes/screens/+types/create-espresso';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { makeSSRClient } from '@/supa-client';
import { useState } from 'react';
import { Link, redirect, type MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Espresso Recipe | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }
};

export default function CreateEspresso() {
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [useAmountRange, setUseAmountRange] = useState(false);
  const [useGrinder, setUseGrinder] = useState(false);
  const [grindSize, setGrindSize] = useState('');
  const [grinder, setGrinder] = useState('');
  const [customGrinder, setCustomGrinder] = useState('');
  const [grinderSetting, setGrinderSetting] = useState('');

  const tipPlaceholder =
    '예:\n• 원두는 추출 직전에 갈아주세요\n• 첫 번째 드롭이 나올 때까지의 시간을 체크해보세요\n• 크레마의 색깔로 추출 상태를 확인할 수 있습니다';

  return (
    <>
      <Button variant='ghost' asChild className='mb-4'>
        <Link to='/recipes/create'>← 뒤로 가기</Link>
      </Button>
      <h1 className='mb-6 text-3xl font-bold'>에스프레소 레시피 만들기</h1>

      <RecipeFormWrapper
        hiddenInputs={[
          { name: 'brewType', value: 'espresso' },
          { name: 'grindSize', value: useGrinder ? '' : grindSize },
          {
            name: 'grinder',
            value: useGrinder
              ? grinder === 'other'
                ? customGrinder
                : grinder
              : '',
          },
          { name: 'grinderSetting', value: useGrinder ? grinderSetting : '' },
        ]}
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
                  min='80'
                  max='96'
                  step='1'
                  placeholder='92'
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
                <div className='flex items-center justify-between'>
                  <Label htmlFor='extractionTime'>추출 시간 (초)</Label>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='useTimeRange'
                      checked={useTimeRange}
                      onCheckedChange={(checked) => setUseTimeRange(!!checked)}
                    />
                    <Label
                      htmlFor='useTimeRange'
                      className='text-muted-foreground text-sm'
                    >
                      범위 입력
                    </Label>
                  </div>
                </div>
                {useTimeRange ? (
                  <div className='flex gap-2'>
                    <Input
                      name='extractionTimeMin'
                      type='number'
                      min='20'
                      max='40'
                      step='1'
                      placeholder='25'
                      required
                    />
                    <span className='flex items-center px-2'>~</span>
                    <Input
                      name='extractionTimeMax'
                      type='number'
                      min='20'
                      max='40'
                      step='1'
                      placeholder='30'
                      required
                    />
                  </div>
                ) : (
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
                )}
              </div>

              <div className='grid gap-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='extractionAmount'>추출량 (ml)</Label>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='useAmountRange'
                      checked={useAmountRange}
                      onCheckedChange={(checked) =>
                        setUseAmountRange(!!checked)
                      }
                    />
                    <Label
                      htmlFor='useAmountRange'
                      className='text-muted-foreground text-sm'
                    >
                      범위 입력
                    </Label>
                  </div>
                </div>
                {useAmountRange ? (
                  <div className='flex gap-2'>
                    <Input
                      name='extractionAmountMin'
                      type='number'
                      min='25'
                      max='60'
                      step='1'
                      placeholder='30'
                      required
                    />
                    <span className='flex items-center px-2'>~</span>
                    <Input
                      name='extractionAmountMax'
                      type='number'
                      min='25'
                      max='60'
                      step='1'
                      placeholder='40'
                      required
                    />
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>분쇄</CardTitle>
            <CardDescription>
              분쇄도 설정을 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>분쇄도</Label>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='useGrinder'
                    checked={useGrinder}
                    onCheckedChange={(checked) => setUseGrinder(!!checked)}
                  />
                  <Label
                    htmlFor='useGrinder'
                    className='text-muted-foreground text-sm'
                  >
                    그라인더 추가
                  </Label>
                </div>
              </div>

              {useGrinder ? (
                <div className='space-y-2'>
                  <Select value={grinder} onValueChange={setGrinder}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='그라인더를 선택하세요' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='comandante'>코만단테 C40</SelectItem>
                      <SelectItem value='ek43'>Ek43</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {grinder === 'other' && (
                    <Input
                      placeholder='그라인더 이름을 입력하세요'
                      value={customGrinder}
                      onChange={(e) => setCustomGrinder(e.target.value)}
                    />
                  )}
                  <Input
                    placeholder='그라인더 설정 값 (예: 25클릭, 설정 15)'
                    value={grinderSetting}
                    onChange={(e) => setGrinderSetting(e.target.value)}
                  />
                </div>
              ) : (
                <Input
                  placeholder='분쇄도 (예: 가는 분쇄, 200-300μm)'
                  value={grindSize}
                  onChange={(e) => setGrindSize(e.target.value)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <RecipeTipsForm placeholder={tipPlaceholder} rows={4} />
      </RecipeFormWrapper>
    </>
  );
}
