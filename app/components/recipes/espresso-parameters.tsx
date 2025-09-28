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
import { Beaker } from 'lucide-react';
import { useState } from 'react';

interface EspressoParametersProps {
  defaultWaterTemperature?: number;
  defaultCoffeeAmount?: number;
  defaultExtractionTime?: number;
  defaultExtractionTimeMin?: number;
  defaultExtractionTimeMax?: number;
  defaultExtractionAmount?: number;
  defaultExtractionAmountMin?: number;
  defaultExtractionAmountMax?: number;
}

export function EspressoParameters({
  defaultWaterTemperature,
  defaultCoffeeAmount,
  defaultExtractionTime,
  defaultExtractionTimeMin,
  defaultExtractionTimeMax,
  defaultExtractionAmount,
  defaultExtractionAmountMin,
  defaultExtractionAmountMax,
}: EspressoParametersProps = {}) {
  // Determine if we should use range inputs based on existing data
  const [useTimeRange, setUseTimeRange] = useState(
    (defaultExtractionTimeMin !== undefined && defaultExtractionTimeMax !== undefined) ||
    (!defaultExtractionTime && !defaultExtractionTimeMin && !defaultExtractionTimeMax)
  );
  const [useAmountRange, setUseAmountRange] = useState(
    (defaultExtractionAmountMin !== undefined && defaultExtractionAmountMax !== undefined) ||
    (!defaultExtractionAmount && !defaultExtractionAmountMin && !defaultExtractionAmountMax)
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Beaker className='h-5 w-5 text-red-500' />
          <CardTitle>에스프레소 파라미터</CardTitle>
        </div>
        <CardDescription>
          에스프레소 추출에 필요한 값을 입력해주세요
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
              max='100'
              step='1'
              placeholder='92'
              defaultValue={defaultWaterTemperature}
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='coffeeAmount'>원두 (g)</Label>
            <Input
              id='coffeeAmount'
              name='coffeeAmount'
              type='number'
              min='0'
              max='30'
              step='1'
              placeholder='18'
              defaultValue={defaultCoffeeAmount}
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
                  id='extractionTimeMin'
                  name='extractionTimeMin'
                  type='number'
                  min='0'
                  max='60'
                  step='1'
                  placeholder='25'
                  defaultValue={defaultExtractionTimeMin}
                  required
                />
                <span className='flex items-center px-2'>~</span>
                <Input
                  id='extractionTimeMax'
                  name='extractionTimeMax'
                  type='number'
                  min='0'
                  max='60'
                  step='1'
                  placeholder='30'
                  defaultValue={defaultExtractionTimeMax}
                  required
                />
              </div>
            ) : (
              <Input
                id='extractionTime'
                name='extractionTime'
                type='number'
                min='0'
                max='60'
                step='1'
                placeholder='28'
                defaultValue={defaultExtractionTime}
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
                  onCheckedChange={(checked) => setUseAmountRange(!!checked)}
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
                  id='extractionAmountMin'
                  name='extractionAmountMin'
                  type='number'
                  min='0'
                  max='60'
                  step='1'
                  placeholder='30'
                  defaultValue={defaultExtractionAmountMin}
                  required
                />
                <span className='flex items-center px-2'>~</span>
                <Input
                  id='extractionAmountMax'
                  name='extractionAmountMax'
                  type='number'
                  min='0'
                  max='60'
                  step='1'
                  placeholder='40'
                  defaultValue={defaultExtractionAmountMax}
                  required
                />
              </div>
            ) : (
              <Input
                id='extractionAmount'
                name='extractionAmount'
                type='number'
                min='0'
                max='60'
                step='1'
                placeholder='36'
                defaultValue={defaultExtractionAmount}
                required
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
