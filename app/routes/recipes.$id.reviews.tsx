import type { Route } from '.react-router/types/app/routes/+types/recipes.$id.reviews';

import { createReview, updateReview } from '@/mutations/reviews';
import { getLoggedInUserId } from '@/queries/users';
import { makeSSRClient } from '@/supa-client';
import { redirect } from 'react-router';

export const action = async ({ params, request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const { id: recipeId } = params;

  try {
    // Get current user
    const userId = await getLoggedInUserId(client);

    // Parse form data
    const formData = await request.formData();
    const rating = parseInt(formData.get('rating') as string);
    const content = formData.get('content') as string;
    const isEdit = formData.get('isEdit') === 'true';
    const reviewId = formData.get('reviewId') as string;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      throw new Error('Invalid rating');
    }

    if (isEdit && reviewId) {
      // Update existing review
      await updateReview(client, {
        reviewId,
        rating,
        content: content || undefined,
      });
    } else {
      // Create new review
      await createReview(client, {
        profileId: userId,
        recipeId,
        rating,
        content: content || undefined,
      });
    }

    // Redirect back to recipe page
    return redirect(`/recipes/${recipeId}`);
  } catch (error) {
    console.error('Failed to create review:', error);

    // If user is not authenticated, redirect to login
    if (error instanceof Response && error.status === 302) {
      return error; // This is the redirect from getLoggedInUserId
    }

    // For other errors, redirect back with error (could be enhanced with toast messages)
    return redirect(`/recipes/${recipeId}`);
  }
};
