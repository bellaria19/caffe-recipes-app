import type { MetaFunction } from 'react-router';

import type { Route } from '.react-router/types/app/routes/+types/auth.login';

import { AuthInputField } from '@/components/auth/auth-input-field';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { loginFormSchema } from '@/schemas/auth-schemas';
import { makeSSRClient } from '@/supa-client';
import { LoaderCircleIcon, LogIn } from 'lucide-react';
import {
  Form,
  Link,
  redirect,
  useNavigation,
} from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Login | Moca' }];
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = loginFormSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { loginError: null, formErrors: error.flatten().fieldErrors };
  }

  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      loginError: loginError.message,
      formErrors: null,
    };
  }

  return redirect('/?loggedIn=true', {
    headers,
  });
};

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === 'submitting' || navigation.state === 'loading';

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='w-full max-w-sm p-4'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-bold'>Login to your account</h1>
          </div>

          <Form className='space-y-6' method='post'>
            <AuthInputField
              label='Email'
              name='email'
              id='email'
              type='email'
              placeholder='moca@example.com'
              required
            />
            {actionData &&
              'formErrors' in actionData &&
              actionData.formErrors?.email && (
                <p className='text-sm text-red-500'>
                  {actionData.formErrors?.email}
                </p>
              )}

            <AuthInputField
              label='Password'
              name='password'
              id='password'
              type='password'
              placeholder='password'
              required
            >
              <Link
                to='#'
                className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
              >
                Forgot your password?
              </Link>
            </AuthInputField>

            {actionData &&
              'formErrors' in actionData &&
              actionData.formErrors?.password && (
                <p className='text-sm text-red-500'>
                  {actionData.formErrors?.password}
                </p>
              )}

            <Button
              type='submit'
              variant='default'
              className='w-full py-3 font-semibold'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircleIcon className='animate-spin' />
              ) : (
                <>
                  <LogIn className='mr-2 h-4 w-4' />
                  로그인
                </>
              )}
            </Button>

            {actionData &&
              'loginError' in actionData &&
              actionData.loginError && (
                <p className='text-sm text-red-500'>{actionData.loginError}</p>
              )}

            <SocialAuthButtons />
          </Form>

          <div className='text-center text-sm'>
            Don't have an account?{' '}
            <Link to='/auth/join' className='underline underline-offset-4'>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
