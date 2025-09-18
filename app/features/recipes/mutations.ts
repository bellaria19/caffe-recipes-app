import type { Recipe } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const createRecipe = async (
  client: SupabaseClient<Database>,
  { recipe }: { recipe: Recipe }
) => {
  const { data, error } = await client.from('recipes').insert(recipe).select();
  if (error) {
    throw error;
  }
  return data;
};
