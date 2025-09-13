import type { Route } from '.react-router/types/app/features/auth/screens/+types/logout';

import { makeSSRClient } from '@/supa-client';
import { redirect } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  await client.auth.signOut();
  return redirect('/', {
    headers,
  });
};
