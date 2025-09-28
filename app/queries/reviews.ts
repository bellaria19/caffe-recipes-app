import type { Review } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const getReviewsByRecipeId = async (
  client: SupabaseClient<Database>,
  recipeId: string
): Promise<Review[]> => {
  const { data, error } = await client
    .from('reviews')
    .select(`
      id,
      profile_id,
      recipe_id,
      rating,
      content,
      created_at,
      updated_at,
      profiles!inner (
        username,
        profile_image_url
      )
    `)
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    data?.map((review) => ({
      id: review.id,
      profileId: review.profile_id,
      recipeId: review.recipe_id,
      rating: review.rating,
      content: review.content || undefined,
      createdAt: new Date(review.created_at),
      updatedAt: new Date(review.updated_at),
      author: {
        username: review.profiles.username,
        profileImageUrl: review.profiles.profile_image_url,
      },
    })) || []
  );
};

export const getUserReviewForRecipe = async (
  client: SupabaseClient<Database>,
  recipeId: string,
  userId: string
): Promise<Review | null> => {
  const { data, error } = await client
    .from('reviews')
    .select(`
      id,
      profile_id,
      recipe_id,
      rating,
      content,
      created_at,
      updated_at,
      profiles!inner (
        username,
        profile_image_url
      )
    `)
    .eq('recipe_id', recipeId)
    .eq('profile_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    profileId: data.profile_id,
    recipeId: data.recipe_id,
    rating: data.rating,
    content: data.content || undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    author: {
      username: data.profiles.username,
      profileImageUrl: data.profiles.profile_image_url,
    },
  };
};

export const getReviewStats = async (
  client: SupabaseClient<Database>,
  recipeId: string
) => {
  const { data, error } = await client
    .from('reviews')
    .select('rating')
    .eq('recipe_id', recipeId);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalReviews = data.length;
  const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.forEach((review) => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution,
  };
};