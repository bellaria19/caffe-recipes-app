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

const baseGrinderOptions = [
  { value: 'c40', label: 'C40' },
  { value: 'ek43', label: 'Ek43' },
];

const baseDripperOptions = [
  { value: 'hario-v60', label: 'Hario V60' },
  { value: 'kalita', label: 'Kalita Wave' },
  { value: 'origami', label: 'Origami' },
  { value: 'orea', label: 'Orea' },
];

// Dynamic option generators
const getDripperOptions = (currentValue?: string) => {
  const options = [...baseDripperOptions];

  // Add current value if it's not in base options
  if (currentValue && !options.find(opt => opt.value === currentValue)) {
    options.push({ value: currentValue, label: currentValue });
  }

  return [...options, { value: 'other', label: 'Other' }];
};

const getGrinderOptions = (currentValue?: string) => {
  const options = [...baseGrinderOptions];

  // Add current value if it's not in base options
  if (currentValue && !options.find(opt => opt.value === currentValue)) {
    options.push({ value: currentValue, label: currentValue });
  }

  return [...options, { value: 'other', label: 'Other' }];
};

export function RecipeOptionalInfo({
  recipeType,
  description,
  defaultBean,
  defaultDripper,
  defaultGrinder,
  defaultGrindSize,
  defaultGrinderSetting,
}: {
  recipeType: 'espresso' | 'drip';
  description: string;
  defaultBean?: string;
  defaultDripper?: string;
  defaultGrinder?: string;
  defaultGrindSize?: string;
  defaultGrinderSetting?: string;
}) {
  // Initialize state based on existing data
  const [useGrinder, setUseGrinder] = useState(
    !!(defaultGrinder || defaultGrinderSetting)
  );
  const [grinder, setGrinder] = useState(defaultGrinder || '');
  const [dripper, setDripper] = useState(defaultDripper || '');

  // Generate dynamic options
  const dripperOptions = getDripperOptions(defaultDripper);
  const grinderOptions = getGrinderOptions(defaultGrinder);

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
            defaultValue={defaultBean}
          />
        </div>

        {recipeType === 'drip' && (
          <div className='grid gap-2'>
            <Label htmlFor='dripper'>드리퍼</Label>
            <SelectField
              value={dripper}
              onValueChange={setDripper}
              name='dripper'
              defaultValue={defaultDripper}
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
                defaultValue={defaultGrinderSetting}
              />
            </div>
          ) : (
            <Input
              id='grindSize'
              name='grindSize'
              type='text'
              placeholder='1000 (μm)'
              defaultValue={defaultGrindSize}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
