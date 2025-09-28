import type { Recipe } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export function DisplayTips({ recipe }: { recipe: Recipe }) {
  if (!recipe.tips) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Lightbulb className='h-5 w-5 text-yellow-500' />
          <CardTitle>팁</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className='prose prose-sm max-w-none'>
          <pre className='font-sans text-sm leading-relaxed whitespace-pre-wrap'>
            {recipe.tips}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
