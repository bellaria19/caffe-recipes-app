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
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onViewRecipe }: RecipeCardProps) {
  const navigate = useNavigate();

  const handleViewRecipe = () => {
    navigate(`/recipes/${recipe.id}`);
    onViewRecipe?.(recipe);
  };

  return (
    <Card className='flex h-fit max-h-[400px] min-h-[280px] w-full max-w-[400px] min-w-[300px] flex-col transition-shadow hover:shadow-lg hover:dark:shadow-white/20'>
      <CardHeader className='flex-shrink-0 pb-3'>
        <div className='mb-2 flex items-start justify-between'>
          <CardTitle className='line-clamp-2 text-lg leading-tight'>
            {recipe.title}
          </CardTitle>
          <Badge variant='outline' className='ml-2 flex-shrink-0'>
            {recipe.brewType}
          </Badge>
        </div>
        <CardDescription className='line-clamp-2'>
          {recipe.description}
        </CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col justify-between py-2'>
        <div className='text-muted-foreground flex items-center justify-between text-sm'>
          <p className='line-clamp-1'>{recipe.author}</p>
          <div className='flex items-center gap-1'>
            <Star
              className='h-4 w-4 flex-shrink-0 text-yellow-500'
              fill='currentColor'
            />
            <span className='whitespace-nowrap'>{recipe.rating}/5</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-2'>
        <Button
          variant='ghost'
          onClick={handleViewRecipe}
          className='text-primary hover:text-primary/80 hover:bg-primary/5 h-auto w-full justify-end p-2 font-medium'
        >
          <span>레시피 보기</span>
          <span>→</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
