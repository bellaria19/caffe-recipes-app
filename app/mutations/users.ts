import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const updateProfile = async (
  client: SupabaseClient<Database>,
  {
    userId,
    username,
    profileImageUrl,
  }: {
    userId: string;
    username: string;
    profileImageUrl?: string | null;
  }
) => {
  const { data, error } = await client
    .from('profiles')
    .update({
      username,
      profile_image_url: profileImageUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
