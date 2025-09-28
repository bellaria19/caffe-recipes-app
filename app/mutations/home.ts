import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const addLike = async (
  client: SupabaseClient<Database>,
  {
    userId,
    recipeId,
  }: {
    userId: string;
    recipeId: string;
  }
) => {
  const { data, error } = await client
    .from('likes')
    .insert({
      profile_id: userId,
      recipe_id: recipeId,
    })
    .select();

  if (error) {
    throw error;
  }

  return data;
};

export const removeLike = async (
  client: SupabaseClient<Database>,
  {
    userId,
    recipeId,
  }: {
    userId: string;
    recipeId: string;
  }
) => {
  const { data, error } = await client
    .from('likes')
    .delete()
    .eq('profile_id', userId)
    .eq('recipe_id', recipeId)
    .select();

  if (error) {
    throw error;
  }

  return data;
};
