import type { Route } from '.react-router/types/app/features/auth/screens/+types/join';

import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkUsernameExists } from '@/features/auth/queries';
import { makeSSRClient } from '@/supa-client';
import {
  Form,
  Link,
  type MetaFunction,
  redirect,
  useNavigation,
} from 'react-router';
import { z } from 'zod';

export const meta: MetaFunction = () => {
  return [{ title: 'Join | Moca' }];
};

const formSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }

  const usernameExists = await checkUsernameExists(request, {
    username: data.username,
  });
  if (usernameExists) {
    return { formErrors: { username: 'Username already exists' } };
  }

  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
      },
    },
  });

  if (signUpError) {
    console.log(data);
    return { signUpError: signUpError.message };
  }

  return redirect('/', {
    headers,
  });
};

export default function Join({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === 'submitting' || navigation.state === 'loading';

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-bold'>Sign up to your account</h1>
          </div>

          <Form className='grid gap-6 space-y-3' method='post'>
            <div className='grid gap-3'>
              <Label htmlFor='username'>Username</Label>
              <Input
                name='username'
                id='username'
                type='text'
                placeholder='Enter your username'
                required
              />
            </div>
            {actionData && 'formErrors' in actionData && (
              <p className='text-sm text-red-500'>
                {actionData?.formErrors?.username}
              </p>
            )}

            <div className='grid gap-3'>
              <Label htmlFor='email'>Email</Label>
              <Input
                name='email'
                id='email'
                type='email'
                placeholder='moca@example.com'
                required
              />
            </div>
            {actionData && 'formErrors' in actionData && (
              <p className='text-sm text-red-500'>
                {actionData?.formErrors?.email}
              </p>
            )}

            <div className='grid gap-3'>
              <Label htmlFor='password'>Password</Label>
              <Input
                name='password'
                id='password'
                type='password'
                placeholder='password'
                required
              />
            </div>
            {actionData && 'formErrors' in actionData && (
              <p className='text-sm text-red-500'>
                {actionData?.formErrors?.password}
              </p>
            )}

            <Button type='submit' className='w-full'>
              Sign up
            </Button>
            {actionData && 'signUpError' in actionData && (
              <p className='text-sm text-red-500'>{actionData.signUpError}</p>
            )}

            <SocialAuthButtons />
          </Form>
          <div className='text-center text-sm'>
            Already have an account?{' '}
            <Link to='/auth/login' className='underline underline-offset-4'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
