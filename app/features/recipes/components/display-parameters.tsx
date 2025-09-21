import type { Recipe } from '@/lib/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { BeakerIcon } from 'lucide-react';

export function DisplayParameters({ recipe }: { recipe: Recipe }) {
  if (recipe.brewType === 'espresso') {
    return <EspressoParametersDisplay recipe={recipe} />;
  } else if (recipe.brewType === 'drip') {
    return <DripParametersDisplay recipe={recipe} />;
  }
  return null;
}

function EspressoParametersDisplay({ recipe }: { recipe: Recipe }) {
  const params = recipe.espressoParams;

  if (!params) return null;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BeakerIcon className='h-5 w-5 text-red-500' />
          <CardTitle>에스프레소 파라미터</CardTitle>
        </div>
        <CardDescription>
          에스프레소 추출에 사용된 파라미터입니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>물 온도</TableHead>
              <TableHead className='text-center'>원두량</TableHead>
              <TableHead className='text-center'>추출 시간</TableHead>
              <TableHead className='text-center'>추출량</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='text-center font-medium'>
                {params?.waterTemperature}℃
              </TableCell>
              <TableCell className='text-center font-medium'>
                {params?.coffeeAmount}g
              </TableCell>
              <TableCell className='text-center font-medium'>
                {params?.extractionTime !== undefined
                  ? `${params.extractionTime}초`
                  : params?.extractionTimeMin !== undefined &&
                      params?.extractionTimeMax !== undefined
                    ? `${params.extractionTimeMin} ~ ${params.extractionTimeMax}초`
                    : '-'}
              </TableCell>
              <TableCell className='text-center font-medium'>
                {params?.extractionAmount !== undefined
                  ? `${params.extractionAmount}ml`
                  : params?.extractionAmountMin !== undefined &&
                      params?.extractionAmountMax !== undefined
                    ? `${params.extractionAmountMin} ~ ${params.extractionAmountMax}ml`
                    : '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function DripParametersDisplay({ recipe }: { recipe: Recipe }) {
  const params = recipe.dripParams;

  if (!params) return null;

  const totalWaterAmount = params.extractionSteps.reduce(
    (total, step) => total + step.waterAmount,
    0
  );

  const totalTime = params.extractionSteps.reduce(
    (total, step) => total + (step.duration || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BeakerIcon className='h-5 w-5 text-red-500' />
          <CardTitle>드립 파라미터</CardTitle>
        </div>
        <CardDescription>
          드립 커피 추출에 사용된 파라미터입니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>물 온도</TableHead>
              <TableHead className='text-center'>원두량</TableHead>
              <TableHead className='text-center'>총 물의 양</TableHead>
              <TableHead className='text-center'>총 추출 시간</TableHead>
              <TableHead className='text-center'>추출 방식</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='text-center font-medium'>
                {params.waterTemperature}℃
              </TableCell>
              <TableCell className='text-center font-medium'>
                {params.coffeeAmount}g
              </TableCell>
              <TableCell className='text-center font-medium'>
                {totalWaterAmount}g
              </TableCell>
              <TableCell className='text-center font-medium'>
                {Math.floor(totalTime / 60)}:
                {String(totalTime % 60).padStart(2, '0')}
              </TableCell>
              <TableCell className='text-center font-medium'>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                    params.brewingType === 'hot'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  )}
                >
                  {params.brewingType === 'hot' ? 'HOT' : 'ICE'}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
