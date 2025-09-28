import type { BrewType, DripParams, EspressoParams, Recipe } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const getRecipes = async (
  client: SupabaseClient<Database>,
  {
    recipeType,
    sortBy = 'newest',
    limit = 20,
    offset = 0,
  }: {
    recipeType?: 'espresso' | 'drip';
    sortBy?: 'newest' | 'popularity' | 'popularity-daily' | 'popularity-weekly';
    limit?: number;
    offset?: number;
  } = {}
) => {
  let query = client.from('recipes').select(`
      *,
      profiles:profile_id (
        username,
        profile_image_url
      ),
      likes:likes!recipe_id (count),
      reviews:reviews!recipe_id (count)
    `);

  // Filter by recipe type
  if (recipeType) {
    query = query.eq('recipe_type', recipeType);
  }

  // Apply sorting
  switch (sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popularity':
    case 'popularity-daily':
    case 'popularity-weekly':
      // For now, sort by likes count (could be enhanced with proper popularity calculation)
      query = query.order('created_at', { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Transform database data to Recipe interface
  const recipes: Recipe[] = data.map((recipe) => ({
    id: recipe.id,
    profile_id: recipe.profile_id,
    title: recipe.title,
    description: recipe.description || undefined,
    brewType: recipe.recipe_type as BrewType,
    rating: 0, // TODO: Calculate from reviews
    author: recipe.author || 'Unknown',
    // profileImageUrl: (recipe.profiles as any)?.profile_image_url || undefined,
    tips: recipe.tips || undefined,
    createdAt: new Date(recipe.created_at),
    bean: recipe.bean || undefined,
    brewingTool: recipe.brewing_tool || undefined,
    espressoParams:
      recipe.recipe_type === 'espresso'
        ? (recipe.recipe_details as unknown as EspressoParams)
        : undefined,
    dripParams:
      recipe.recipe_type === 'drip'
        ? (recipe.recipe_details as unknown as DripParams)
        : undefined,
    likesCount: Array.isArray(recipe.likes) ? recipe.likes.length : 0,
    reviewsCount: Array.isArray(recipe.reviews) ? recipe.reviews.length : 0,
  }));

  return recipes;
};

export const getRecipeById = async (
  client: SupabaseClient<Database>,
  id: string
) => {
  const { data, error } = await client
    .from('recipes')
    .select(
      `
      *,
      profiles:profile_id (
        username,
        profile_image_url
      ),
      likes:likes!recipe_id (count),
      reviews:reviews!recipe_id (count)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  // Transform database data to Recipe interface
  const recipe: Recipe = {
    id: data.id,
    profile_id: data.profile_id,
    title: data.title,
    description: data.description || undefined,
    brewType: data.recipe_type as 'espresso' | 'drip',
    rating: 0, // TODO: Calculate from reviews
    author: data.author || 'Unknown',
    // profileImageUrl: (data.profiles as any)?.profile_image_url || undefined,
    tips: data.tips || undefined,
    createdAt: new Date(data.created_at),
    bean: data.bean || undefined,
    brewingTool: data.brewing_tool || undefined,
    espressoParams:
      data.recipe_type === 'espresso'
        ? (data.recipe_details as unknown as EspressoParams)
        : undefined,
    dripParams:
      data.recipe_type === 'drip'
        ? (data.recipe_details as unknown as DripParams)
        : undefined,
    likesCount: Array.isArray(data.likes) ? data.likes.length : 0,
    reviewsCount: Array.isArray(data.reviews) ? data.reviews.length : 0,
  };

  return recipe;
};

export const getUserRecipes = async (
  client: SupabaseClient<Database>,
  userId: string,
  {
    limit = 20,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  } = {}
) => {
  const { data, error } = await client
    .from('recipes')
    .select(
      `
      *,
      profiles:profile_id (
        username,
        profile_image_url
      ),
      likes:likes!recipe_id (count),
      reviews:reviews!recipe_id (count)
    `
    )
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  // Transform database data to Recipe interface
  const recipes: Recipe[] = data.map((recipe) => ({
    id: recipe.id,
    profile_id: recipe.profile_id,
    title: recipe.title,
    description: recipe.description || undefined,
    brewType: recipe.recipe_type as BrewType,
    rating: 0, // TODO: Calculate from reviews
    author: recipe.author || 'Unknown',
    // profileImageUrl: (recipe.profiles as any)?.profile_image_url || undefined,
    tips: recipe.tips || undefined,
    createdAt: new Date(recipe.created_at),
    bean: recipe.bean || undefined,
    brewingTool: recipe.brewing_tool || undefined,
    espressoParams:
      recipe.recipe_type === 'espresso'
        ? (recipe.recipe_details as unknown as EspressoParams)
        : undefined,
    dripParams:
      recipe.recipe_type === 'drip'
        ? (recipe.recipe_details as unknown as DripParams)
        : undefined,
    likesCount: Array.isArray(recipe.likes) ? recipe.likes.length : 0,
    reviewsCount: Array.isArray(recipe.reviews) ? recipe.reviews.length : 0,
  }));

  return recipes;
};
export const getLikedRecipes = async (
  client: SupabaseClient<Database>,
  userId: string,
  {
    limit = 20,
    offset = 0,
  }: {
    limit?: number;
    offset?: number;
  } = {}
) => {
  const { data, error } = await client
    .from('likes')
    .select(
      `
      recipes\!recipe_id (
        *,
        profiles:profile_id (
          username,
          profile_image_url
        ),
        likes:likes\!recipe_id (count),
        reviews:reviews\!recipe_id (count)
      )
    `
    )
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  // Transform database data to Recipe interface
  const recipes: Recipe[] = data
    .filter((like) => like.recipes) // Filter out null recipes
    .map((like) => {
      const recipe = like.recipes as any;
      return {
        id: recipe.id,
        profile_id: recipe.profile_id,
        title: recipe.title,
        description: recipe.description || undefined,
        brewType: recipe.recipe_type as BrewType,
        rating: 0, // TODO: Calculate from reviews
        author: recipe.author || 'Unknown',
        // profileImageUrl: recipe.profiles?.profile_image_url || undefined,
        tips: recipe.tips || undefined,
        createdAt: new Date(recipe.created_at),
        bean: recipe.bean || undefined,
        brewingTool: recipe.brewing_tool || undefined,
        espressoParams:
          recipe.recipe_type === 'espresso'
            ? (recipe.recipe_details as unknown as EspressoParams)
            : undefined,
        dripParams:
          recipe.recipe_type === 'drip'
            ? (recipe.recipe_details as unknown as DripParams)
            : undefined,
        likesCount: Array.isArray(recipe.likes) ? recipe.likes.length : 0,
        reviewsCount: Array.isArray(recipe.reviews) ? recipe.reviews.length : 0,
      };
    });

  return recipes;
};
