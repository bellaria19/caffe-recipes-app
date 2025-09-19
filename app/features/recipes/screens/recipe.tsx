import type { MetaFunction } from 'react-router';

import { DripRecipeDisplay } from '@/components/recipe/drip/drip-recipe-display';
import { EspressoRecipeDisplay } from '@/components/recipe/espresso/espresso-recipe-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRecipes } from '@/lib/data/recipes';
import { ArrowLeft, ChefHat, Clock, Lightbulb, Star } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router';

export const meta: MetaFunction = ({ params }) => {
  const { id } = params;
  const recipe = mockRecipes.find((r) => r.id === id);
  return [
    {
      title: recipe ? `${recipe.title} | Moca` : 'Recipe | Moca',
    },
  ];
};

export default function Recipe() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Get back URL from search params, default to home
  const backUrl = searchParams.get('back')
    ? decodeURIComponent(searchParams.get('back')!)
    : '/';

  // Find the recipe by ID
  const recipe = mockRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className='py-12 text-center'>
        <h1 className='mb-4 text-2xl font-bold'>레시피를 찾을 수 없습니다</h1>
        <p className='text-muted-foreground mb-6'>
          요청하신 레시피가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button asChild>
          <Link to='/'>홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-between pb-10'>
        <Button variant='ghost' asChild>
          <Link to={backUrl} className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            홈으로 돌아가기
          </Link>
        </Button>

        <div className='flex gap-3'>
          <Button asChild>
            <Link to={`/recipes/edit/${id}`}>레시피 수정</Link>
          </Button>
          <Button variant='outline'>레시피 공유</Button>
        </div>
      </div>

      <article className='space-y-6'>
        {/* Recipe Header */}
        <Card>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-3'>
                  <h1 className='text-3xl font-bold'>{recipe.title}</h1>
                  <Badge
                    variant={
                      recipe.brewType === 'espresso' ? 'default' : 'outline'
                    }
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
                    <Star
                      className='h-4 w-4 text-yellow-500'
                      fill='currentColor'
                    />
                    <span>{recipe.rating}/5</span>
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

        {/* Recipe Parameters */}
        {recipe.espressoParams && (
          <EspressoRecipeDisplay params={recipe.espressoParams} />
        )}

        {recipe.dripParams && <DripRecipeDisplay params={recipe.dripParams} />}

        {/* Tips */}
        {recipe.tips && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lightbulb className='h-5 w-5 text-yellow-500' />팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='prose prose-sm max-w-none'>
                <pre className='font-sans text-sm leading-relaxed whitespace-pre-wrap'>
                  {recipe.tips}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </>
  );
}
