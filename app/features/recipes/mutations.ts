// import type { EspressoParams } from '@/lib/types';
// import type { SupabaseClient } from '@supabase/supabase-js';
// import type { Database } from 'database.types';

// export const createEspressoRecipe = async (
//   client: SupabaseClient<Database>,
//   {
//     title,
//     description,
//     author,
//     espressoParams,
//     tips,
//     grindSize,
//     grinder,
//     grinderSetting,
//   }: {
//     title: string;
//     description: string;
//     author: string;
//     espressoParams: EspressoParams;
//     tips: string;
//     grindSize: string;
//     grinder: string;
//     grinderSetting: string;
//   }
// ) => {
//   const { data, error } = await client.from('recipes').insert({
//     title,
//     description,
//     author:,
//     espressoParams,
//     tips,
//     grindSize,
//     grinder,
//     grinderSetting,
//   }).select();
//   if (error) {
//     throw error;
//   }
//   return data;
// };
