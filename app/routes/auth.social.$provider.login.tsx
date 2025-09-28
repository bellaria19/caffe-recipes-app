import type { Route } from '.react-router/types/app/routes/+types/auth.social.$provider.login';

import { makeSSRClient } from '@/supa-client';
import { redirect } from 'react-router';
import { z } from 'zod';

const paramSchema = z.object({
  provider: z.enum(['google', 'kakao']),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramSchema.safeParse(params);
  if (!success) {
    return redirect('/auth/login');
  }
  const { provider } = data;
  const redirectTo = `/auth/social/${provider}/callback`;
  const { client, headers } = makeSSRClient(request);
  const {
    data: { url },
    error,
  } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo,
    },
  });

  if (url) {
    return redirect(url, {
      headers,
    });
  }

  if (error) {
    throw error;
  }
};
