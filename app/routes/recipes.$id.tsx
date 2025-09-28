import type { Route } from '.react-router/types/app/routes/+types/recipes.$id';

import { DisplayBasicInfo } from '@/components/recipes/display-basic-info';
import { DisplayExtractionSteps } from '@/components/recipes/display-extraction-steps';
import { DisplayOptionalInfo } from '@/components/recipes/display-optional-info';
import { DisplayParameters } from '@/components/recipes/display-parameters';
import { DisplayTips } from '@/components/recipes/display-tips';
import { RecipeReviewsSection } from '@/components/recipes/recipe-reviews-section';
import { Button } from '@/components/ui/button';
import { getRecipeById } from '@/queries/recipes';
import {
  getReviewStats,
  getReviewsByRecipeId,
  getUserReviewForRecipe,
} from '@/queries/reviews';
import { getLoggedInUserId } from '@/queries/users';
import { makeSSRClient } from '@/supa-client';
import { ArrowLeft, Edit } from 'lucide-react';
import { Link, type MetaFunction, useSearchParams } from 'react-router';

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

    // Get reviews and review stats
    const [reviews, reviewStats] = await Promise.all([
      getReviewsByRecipeId(client, id),
      getReviewStats(client, id),
    ]);

    // Get user's existing review if logged in
    let userReview = null;
    if (currentUserId) {
      try {
        userReview = await getUserReviewForRecipe(client, id, currentUserId);
      } catch (error) {
        // User doesn't have a review yet, that's fine
      }
    }

    return { recipe, currentUserId, reviews, reviewStats, userReview };
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
  const reviews = loaderData.reviews;
  const reviewStats = loaderData.reviewStats;
  const userReview = loaderData.userReview;

  // Check if current user is the owner of this recipe
  const isOwner = currentUserId && recipe?.profile_id === currentUserId;

  // Check if user can review (logged in and not owner)
  const canReview = !!currentUserId && !isOwner;

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
              <Link
                to={`/recipes/edit/${recipe.brewType}/${recipe.id}`}
                className='flex items-center gap-2'
              >
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
        <DisplayBasicInfo recipe={recipe} averageRating={reviewStats.averageRating} />
        {/* Recipe Parameters */}
        <DisplayParameters recipe={recipe} />
        {/* Optional Info */}
        <DisplayOptionalInfo recipe={recipe} />
        {/* Extraction Steps */}
        <DisplayExtractionSteps recipe={recipe} />
        {/* Tips */}
        <DisplayTips recipe={recipe} />
        {/* Reviews */}
        <RecipeReviewsSection
          recipeId={recipe.id}
          reviews={reviews}
          averageRating={reviewStats.averageRating}
          totalReviews={reviewStats.totalReviews}
          canReview={canReview}
          userReview={userReview}
        />
      </div>
    </>
  );
}
