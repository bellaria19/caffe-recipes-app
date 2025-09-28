import type { Recipe } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { ChefHat, Clock, Star } from 'lucide-react';

interface DisplayBasicInfoProps {
  recipe: Recipe;
  averageRating?: number;
}

export function DisplayBasicInfo({ recipe, averageRating }: DisplayBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-3'>
              <h1 className='text-3xl font-bold'>{recipe.title}</h1>
              <Badge
                variant={recipe.brewType === 'espresso' ? 'default' : 'outline'}
              >
                {recipe.brewType === 'espresso' ? '에스프레소' : '드립'}
              </Badge>
            </div>
            <p className='text-muted-foreground mb-4 text-lg'>
              {recipe.description}
            </p>

            <div className='text-muted-foreground flex items-center gap-6 text-sm'>
              <div className='flex items-center gap-1'>
                <ChefHat className='h-4 w-4' />
                <span>{recipe.author}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 text-yellow-500' fill='currentColor' />
                <span>
                  {averageRating !== undefined && averageRating > 0
                    ? `${averageRating.toFixed(1)}/5`
                    : 'No ratings'}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>
                  {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
