import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

export const getUser = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const getUserById = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', id);

  if (error) {
    throw error;
  }
  console.log('data');
  console.log(data);
  console.log('error');
  console.log(error);
  return data;
};
