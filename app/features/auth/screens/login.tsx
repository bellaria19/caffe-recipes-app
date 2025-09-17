import type { MetaFunction } from 'react-router';

import type { Route } from '.react-router/types/app/features/auth/screens/+types/login';

import { FormField } from '@/components/auth/form-field';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Button } from '@/components/ui/button';
import { makeSSRClient } from '@/supa-client';
import { LoaderCircleIcon } from 'lucide-react';
import { Form, Link, redirect, useNavigation } from 'react-router';
import { z } from 'zod';

export const meta: MetaFunction = () => {
  return [{ title: 'Login | Moca' }];
};

const formSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email is invalid',
    })
    .email('Invalid email address'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, {
      message: 'Password must be at least 8 characters',
    }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
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

  return redirect('/', {
    headers,
  });
};

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === 'submitting' || navigation.state === 'loading';

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-bold'>Login to your account</h1>
            <p className='text-muted-foreground text-sm text-balance'>
              Enter your email below to login to your account
            </p>
          </div>

          <Form className='grid gap-6 space-y-3' method='post'>
            <FormField
              label='Email'
              name='email'
              type='email'
              placeholder='moca@example.com'
              required
              error={
                actionData &&
                'formErrors' in actionData &&
                actionData.formErrors &&
                'email' in actionData.formErrors
                  ? actionData.formErrors?.email
                  : undefined
              }
            />

            <FormField
              label='Password'
              name='password'
              type='password'
              placeholder='password'
              required
              error={
                actionData &&
                'formErrors' in actionData &&
                actionData.formErrors &&
                'password' in actionData.formErrors
                  ? actionData.formErrors.password
                  : undefined
              }
            >
              <Link
                to='#'
                className='ml-auto text-sm underline-offset-4 hover:underline'
              >
                Forgot your password?
              </Link>
            </FormField>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircleIcon className='animate-spin' /> : 'Log in'}
            </Button>

            {actionData && 'loginError' in actionData && actionData.loginError && (
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
