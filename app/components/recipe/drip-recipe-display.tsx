import type { DripParams } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DripRecipeDisplayProps {
  params: DripParams;
}

export function DripRecipeDisplay({ params }: DripRecipeDisplayProps) {
  return (
    <>
      {/* Drip Parameters Card */}
      <Card>
        <CardHeader>
          <CardTitle className='-mx-6 -mt-6 mb-4 rounded-t-lg bg-gray-700 py-3 text-center text-white'>
            드립 추출 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Brewing Type Badge */}
          <div className='text-center'>
            <span
              className={cn(
                'inline-flex items-center rounded px-6 pb-4 text-xl font-bold uppercase',
                params.brewingType === 'hot' ? 'text-red-500' : 'text-blue-500'
              )}
            >
              {params.brewingType === 'hot' ? 'Hot' : 'Ice'}
            </span>
          </div>

          {/* Parameters Table */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className='bg-muted/30 w-1/3 border-r text-center font-medium'>
                  도징량
                </TableCell>
                <TableCell className='text-center text-lg font-bold'>
                  {params.coffeeAmount}g
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='bg-muted/30 border-r text-center font-medium'>
                  추출량
                </TableCell>
                <TableCell className='text-center text-lg font-bold'>
                  {params.extractionSteps.reduce(
                    (total, step) => total + step.waterAmount,
                    0
                  )}
                  g
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='bg-muted/30 border-r text-center font-medium'>
                  추출 시간
                </TableCell>
                <TableCell className='text-center text-lg font-bold'>
                  {Math.floor(
                    params.extractionSteps.reduce(
                      (total, step) => total + (step.duration || 0),
                      0
                    ) / 60
                  )}
                  :
                  {String(
                    params.extractionSteps.reduce(
                      (total, step) => total + (step.duration || 0),
                      0
                    ) % 60
                  ).padStart(2, '0')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='bg-muted/30 border-r text-center font-medium'>
                  물온도
                </TableCell>
                <TableCell className='text-center text-lg font-bold'>
                  {params.waterTemperature}℃
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='bg-muted/30 border-r text-center font-medium'>
                  입자
                </TableCell>
                <TableCell className='text-center text-lg font-bold'>
                  {params.grindSize}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Extraction Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle className='-mx-6 -mt-6 mb-4 rounded-t-lg bg-gray-700 py-3 text-center text-white'>
            추출 단계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {params.extractionSteps.map((step, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border px-4 py-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium'>
                    {index + 1}
                  </div>
                  <span className='font-medium'>{step.stepName}</span>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-lg font-bold'>{step.waterAmount}g</span>
                  {step.duration && (
                    <span className='text-muted-foreground text-sm'>
                      {step.duration}초
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
