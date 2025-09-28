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
  id: string
) => {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data; // null if not found, user object if found
};

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw redirect('/auth/login');
  }

  return data.user.id;
};
