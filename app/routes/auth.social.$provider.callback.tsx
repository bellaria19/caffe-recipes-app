import type { Route } from '.react-router/types/app/routes/+types/auth.social.$provider.callback';

import { makeSSRClient } from '@/supa-client';
import { socialProviderParamSchema } from '@/schemas/auth-schemas';
import { redirect } from 'react-router';


export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success } = socialProviderParamSchema.safeParse(params);
  if (!success) {
    return redirect('/auth/login');
  }
  // const { provider } = data;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return redirect('/auth/login');
  }
  const { client, headers } = makeSSRClient(request);
  //   const { data: {user, session}, error } =
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) {
    throw error;
  }

  return redirect('/?socialLogin=true', {
    headers,
  });
};
