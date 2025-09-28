import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BeakerIcon } from 'lucide-react';

export function DripParameters({
  defaultWaterTemperature,
  defaultCoffeeAmount,
}: {
  defaultWaterTemperature?: number;
  defaultCoffeeAmount?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BeakerIcon className='h-5 w-5 text-red-500' />
          <CardTitle>드립 파라미터</CardTitle>
        </div>
        <CardDescription>
          드립 커피 추출에 필요한 핵심 정보를 입력해주세요
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
        </div>
      </CardContent>
    </Card>
  );
}
