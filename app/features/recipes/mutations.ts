import type { DripParams, EspressoParams } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

import { getUserById } from '@/features/users/queries';

export const createEspressoRecipe = async (
  client: SupabaseClient<Database>,
  {
    userId,
    title,
    description,
    bean,
    tips,
    waterTemperature,
    coffeeAmount,
    extractionTime,
    extractionTimeMin,
    extractionTimeMax,
    extractionAmount,
    extractionAmountMin,
    extractionAmountMax,
    grinder,
    otherGrinder,
    grindSize,
    grinderSetting,
  }: {
    userId: string;
    title: string;
    description?: string;
    bean?: string;
    tips?: string;
    waterTemperature: number;
    coffeeAmount: number;
    extractionTime?: number;
    extractionTimeMin?: number;
    extractionTimeMax?: number;
    extractionAmount?: number;
    extractionAmountMin?: number;
    extractionAmountMax?: number;
    grinder?: string;
    otherGrinder?: string;
    grindSize?: string;
    grinderSetting?: string;
  }
) => {
  // Get user info for author field
  const userProfile = await getUserById(client, userId);
  const author = userProfile?.username || 'Unknown';

  const espressoParams: EspressoParams = {
    waterTemperature,
    coffeeAmount,
    extractionTime,
    extractionTimeMin,
    extractionTimeMax,
    extractionAmount,
    extractionAmountMin,
    extractionAmountMax,
    grindSize,
    grinder: grinder === 'other' ? otherGrinder : grinder,
    grinderSetting,
  };

  const { data, error } = await client
    .from('recipes')
    .insert({
      profile_id: userId,
      title,
      description,
      bean,
      recipe_type: 'espresso',
      tips,
      author,
      recipe_details: espressoParams as any,
    })
    .select();

  if (error) {
    throw error;
  }
  return data;
};

export const createDripRecipe = async (
  client: SupabaseClient<Database>,
  {
    userId,
    title,
    description,
    bean,
    tips,
    waterTemperature,
    coffeeAmount,
    dripType,
    dripper,
    otherDripper,
    grinder,
    otherGrinder,
    grindSize,
    grinderSetting,
    extractionSteps,
  }: {
    userId: string;
    title: string;
    description?: string;
    bean?: string;
    tips?: string;
    waterTemperature: number;
    coffeeAmount: number;
    dripType: 'hot' | 'ice';
    dripper?: string;
    otherDripper?: string;
    grinder?: string;
    otherGrinder?: string;
    grindSize?: string;
    grinderSetting?: string;
    extractionSteps: Array<{
      stepName: string;
      waterAmount: number;
      duration?: number;
    }>;
  }
) => {
  // Get user info for author field
  const userProfile = await getUserById(client, userId);
  const author = userProfile?.username || 'Unknown';

  const dripParams: DripParams = {
    coffeeAmount,
    waterTemperature,
    brewingType: dripType,
    dripper: dripper === 'other' ? otherDripper : dripper,
    grindSize,
    grinder: grinder === 'other' ? otherGrinder : grinder,
    grinderSetting,
    extractionSteps,
  };

  const { data, error } = await client
    .from('recipes')
    .insert({
      profile_id: userId,
      title,
      description,
      bean,
      recipe_type: 'drip',
      tips,
      author,
      recipe_details: dripParams as any,
    })
    .select();

  if (error) {
    throw error;
  }
  return data;
};
