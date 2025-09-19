import { SelectField } from '@/components/common/select-field';
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
import { BeanIcon } from 'lucide-react';
import { useState } from 'react';

const grinderOptions = [
  { value: 'c40', label: 'C40' },
  { value: 'ek43', label: 'Ek43' },
  { value: 'other', label: 'Other' },
];

const dripperOptions = [
  { value: 'hario-v60', label: 'Hario V60' },
  { value: 'kalita', label: 'Kalita Wave' },
  { value: 'origami', label: 'Origami' },
  { value: 'orea', label: 'Orea' },
  { value: 'other', label: 'Other' },
];

export function RecipeGrindSettings({
  recipeType,
  description,
}: {
  recipeType: 'espresso' | 'drip';
  description: string;
}) {
  const [useGrinder, setUseGrinder] = useState(false);
  const [grinder, setGrinder] = useState('');
  const [dripper, setDripper] = useState('');

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BeanIcon className='h-5 w-5 text-green-500' />
          <CardTitle>추가 정보 (선택사항)</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid gap-2'>
          <Label htmlFor='bean'>원두</Label>
          <Input
            id='bean'
            name='bean'
            type='text'
            placeholder='원두 이름을 입력하세요'
          />
        </div>

        {recipeType === 'drip' && (
          <div className='grid gap-2'>
            <Label htmlFor='dripper'>드리퍼</Label>
            <SelectField
              value={dripper}
              onValueChange={setDripper}
              name='dripper'
              required
              placeholder='드리퍼를 선택하세요'
              options={dripperOptions}
            />
            {dripper === 'other' && (
              <Input
                id='otherDripper'
                name='otherDripper'
                type='text'
                placeholder='드리퍼 이름을 입력하세요'
              />
            )}
          </div>
        )}

        <div className='grid gap-2'>
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
            <div className='grid gap-2'>
              <SelectField
                value={grinder}
                onValueChange={setGrinder}
                name='grinder'
                required
                placeholder='그라인더를 선택하세요'
                options={grinderOptions}
              />
              {grinder === 'other' && (
                <Input
                  id='otherGrinder'
                  name='otherGrinder'
                  type='text'
                  placeholder='그라인더 이름을 입력하세요'
                />
              )}
              <Input
                id='grinderSetting'
                name='grinderSetting'
                type='text'
                placeholder='그라인더 클릭 값 (예: 25)'
              />
            </div>
          ) : (
            <Input
              id='grindSize'
              name='grindSize'
              type='text'
              placeholder='1000 (μm)'
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
