import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'database.types';

import { redirect } from 'react-router';

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
  console.log('id getUserById', id);
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', id);

  if (error) {
    throw error;
  }
  console.log('data getUserById', data);
  console.log('error getUserById', error);

  return data;
};

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw redirect('/auth/login');
  }

  return data.user.id;
};
