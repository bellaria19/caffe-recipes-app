import type { EspressoParams } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EspressoRecipeDisplayProps {
  params: EspressoParams;
}

export function EspressoRecipeDisplay({ params }: EspressoRecipeDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='-mx-6 -mt-6 mb-4 rounded-t-lg bg-gray-700 py-3 text-center text-white'>
          에스프레소 추출 가이드
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Quick Reference */}
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          <div className='bg-muted/20 rounded p-3 text-center'>
            <p className='text-muted-foreground mb-1 text-xs font-bold'>온도</p>
            <p className='text-lg font-bold'>{params.waterTemperature}℃</p>
          </div>

          <div className='bg-muted/20 rounded p-3 text-center'>
            <p className='text-muted-foreground mb-1 text-xs font-bold'>
              도징량
            </p>
            <p className='text-lg font-bold'>{params.coffeeAmount}g</p>
          </div>
          <div className='bg-muted/20 rounded p-3 text-center'>
            <p className='text-muted-foreground mb-1 text-xs font-bold'>
              추출시간
            </p>
            <p className='text-lg font-bold'>
              {params.extractionTime !== undefined
                ? `${params.extractionTime}초`
                : params.extractionTimeMin !== undefined && params.extractionTimeMax !== undefined
                ? `${params.extractionTimeMin}~${params.extractionTimeMax}초`
                : '-'}
            </p>
          </div>
          <div className='bg-muted/20 rounded p-3 text-center'>
            <p className='text-muted-foreground mb-1 text-xs font-bold'>
              추출량
            </p>
            <p className='text-lg font-bold'>
              {params.extractionAmount !== undefined
                ? `${params.extractionAmount}ml`
                : params.extractionAmountMin !== undefined && params.extractionAmountMax !== undefined
                ? `${params.extractionAmountMin}~${params.extractionAmountMax}ml`
                : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
