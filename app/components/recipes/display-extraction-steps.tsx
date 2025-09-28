import type { Recipe } from '@/lib/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DropletsIcon } from 'lucide-react';

export function DisplayExtractionSteps({ recipe }: { recipe: Recipe }) {
  const params = recipe.dripParams;

  if (!params) {
    return null;
  }

  // Calculate cumulative time for each step
  const calculateCumulativeTime = (stepIndex: number) => {
    let cumulativeTime = 0;
    for (let i = 0; i < stepIndex; i++) {
      const step = params.extractionSteps[i];
      if (step.duration) {
        cumulativeTime += step.duration;
      }
    }
    return cumulativeTime;
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <DropletsIcon className='h-5 w-5 text-amber-500' />
          <CardTitle>추출 단계</CardTitle>
        </div>
        <CardDescription>단계별 추출 과정입니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {params.extractionSteps.map((step, index) => {
            const cumulativeTime = calculateCumulativeTime(index);
            return (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border px-4 py-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium'>
                    {index + 1}
                  </div>
                  {/* <div className='flex flex-col'> */}
                  <span className='font-medium'>{step.stepName}</span>
                  {/* <span className='text-muted-foreground text-xs'>
                      {formatTime(cumulativeTime)}
                    </span> */}
                  {/* </div> */}
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-lg font-semibold'>
                    {step.waterAmount}g
                  </span>
                  {/* {step.duration && (
                    <span className='text-muted-foreground text-sm'>
                      {step.duration}초
                    </span>
                  )} */}
                  <span className='text-muted-foreground text-sm'>
                    {formatTime(cumulativeTime)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
