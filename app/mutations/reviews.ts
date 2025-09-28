import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const createReview = async (
  client: SupabaseClient<Database>,
  {
    profileId,
    recipeId,
    rating,
    content,
  }: {
    profileId: string;
    recipeId: string;
    rating: number;
    content?: string;
  }
) => {
  const { data, error } = await client
    .from('reviews')
    .insert({
      profile_id: profileId,
      recipe_id: recipeId,
      rating,
      content,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateReview = async (
  client: SupabaseClient<Database>,
  {
    reviewId,
    rating,
    content,
  }: {
    reviewId: string;
    rating: number;
    content?: string;
  }
) => {
  const { data, error } = await client
    .from('reviews')
    .update({
      rating,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteReview = async (
  client: SupabaseClient<Database>,
  reviewId: string
) => {
  const { error } = await client
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    throw error;
  }
};