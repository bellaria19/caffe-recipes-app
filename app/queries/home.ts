import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const getUserLikes = async (
  client: SupabaseClient<Database>,
  userId: string
) => {
  const { data, error } = await client
    .from('likes')
    .select('recipe_id')
    .eq('profile_id', userId);

  if (error) {
    throw error;
  }

  // Return array of recipe IDs that user has liked
  return data.map((like) => like.recipe_id);
};

export const checkUserLikedRecipe = async (
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
    .select('id')
    .eq('profile_id', userId)
    .eq('recipe_id', recipeId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  // Return true if like exists, false otherwise
  return data !== null;
};
