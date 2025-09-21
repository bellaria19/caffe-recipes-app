import type { Recipe } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved?: boolean;
  onSave?: (recipeId: string) => void;
  onUnsave?: (recipeId: string) => void;
}

export function RecipeCard({
  recipe,
  isSaved = false,
  onSave,
  onUnsave,
}: RecipeCardProps) {
  const handleSaveToggle = () => {
    if (isSaved) {
      onUnsave?.(recipe.id);
    } else {
      onSave?.(recipe.id);
    }
  };

  return (
    <Link to={`/recipes/${recipe.id}`} className='block'>
      <Card className='flex h-[240px] w-full flex-col transition-shadow hover:shadow-lg'>
        <CardHeader className='h-[40px] flex-shrink-0 pb-2'>
          <div className='flex items-start justify-between'>
            <CardTitle className='line-clamp-2 h-[2.5rem] text-lg leading-tight'>
              {recipe.title}
            </CardTitle>
            <Badge variant='outline' className='ml-2 flex-shrink-0'>
              {recipe.brewType === 'espresso' ? '에스프레소' : '드립'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='flex h-[100px] flex-col gap-2 pt-0'>
          <CardDescription className='line-clamp-2 overflow-hidden text-sm leading-relaxed'>
            {recipe.description || '레시피 설명이 없습니다.'}
          </CardDescription>
          <div className='text-muted-foreground mt-auto flex items-center text-sm'>
            <p className='line-clamp-1'>{recipe.author}</p>
          </div>
        </CardContent>

        <CardFooter className='flex h-[100px] items-center justify-between px-6 py-3'>
          <div className='flex items-center gap-1'>
            <Star
              className='h-4 w-4 flex-shrink-0 text-yellow-500'
              fill='currentColor'
            />
            <span className='text-foreground text-sm'>{recipe.rating}/5</span>
          </div>
          <div className='flex items-center gap-3'>
            {(onSave || onUnsave) && (
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveToggle();
                  }}
                  className='h-auto p-1 hover:bg-transparent'
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isSaved
                        ? 'fill-red-500 text-red-500'
                        : 'text-muted-foreground hover:text-red-500'
                    } transition-colors`}
                  />
                </Button>
                <span className='text-muted-foreground text-sm'>
                  {recipe.likesCount || 0}
                </span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
