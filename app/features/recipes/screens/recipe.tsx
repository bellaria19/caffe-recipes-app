import type { Route } from '.react-router/types/app/features/recipes/screens/+types/recipe';

import { Button } from '@/components/ui/button';
import { DisplayBasicInfo } from '@/features/recipes/components/display-basic-info';
import { DisplayExtractionSteps } from '@/features/recipes/components/display-extraction-steps';
import { DisplayOptionalInfo } from '@/features/recipes/components/display-optional-info';
import { DisplayParameters } from '@/features/recipes/components/display-parameters';
import { DisplayTips } from '@/features/recipes/components/display-tips';
import { getRecipeById } from '@/features/recipes/queries';
import { getLoggedInUserId } from '@/features/users/queries';
import { makeSSRClient } from '@/supa-client';
import { ArrowLeft, Edit } from 'lucide-react';
import { Link, useSearchParams, type MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ data }) => {
  const recipe = (data as any)?.recipe;
  return [
    {
      title: recipe ? `${recipe.title} | Moca` : 'Recipe | Moca',
    },
  ];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const { id } = params;

  try {
    const recipe = await getRecipeById(client, id);

    // Try to get current user (might be null if not logged in)
    let currentUserId: string | null = null;
    try {
      currentUserId = await getLoggedInUserId(client);
    } catch (error) {
      // User is not logged in, continue without user info
    }

    return { recipe, currentUserId };
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    throw new Response('Recipe not found', { status: 404 });
  }
};

export default function Recipe({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();

  // Get back URL from search params, default to home
  const backUrl = searchParams.get('back')
    ? decodeURIComponent(searchParams.get('back')!)
    : '/';

  const recipe = loaderData.recipe;
  const currentUserId = loaderData.currentUserId;

  // Check if current user is the owner of this recipe
  const isOwner = currentUserId && recipe?.profile_id === currentUserId;

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

        {isOwner && (
          <div className='flex gap-3'>
            <Button asChild>
              <Link to={`/recipes/edit/${recipe.brewType}/${recipe.id}`} className='flex items-center gap-2'>
                <Edit className='h-4 w-4' />
                레시피 수정
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recipe Header */}
      <div className='space-y-6'>
        {/* Basic Info */}
        <DisplayBasicInfo recipe={recipe} />
        {/* Recipe Parameters */}
        <DisplayParameters recipe={recipe} />
        {/* Optional Info */}
        <DisplayOptionalInfo recipe={recipe} />
        {/* Extraction Steps */}
        <DisplayExtractionSteps recipe={recipe} />
        {/* Tips */}
        <DisplayTips recipe={recipe} />
      </div>
    </>
  );
}
