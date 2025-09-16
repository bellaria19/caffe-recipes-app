import type { MetaFunction } from 'react-router';

import type { Route } from '.react-router/types/app/features/auth/screens/+types/login';

import { AuthFormContainer } from '@/components/auth/auth-form-container';
import { FormField } from '@/components/auth/form-field';
import { Button } from '@/components/ui/button';
import { makeSSRClient } from '@/supa-client';
import { LoaderCircleIcon } from 'lucide-react';
import { Link, redirect, useNavigation } from 'react-router';
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

  const submitButton = (
    <Button type='submit' className='w-full' disabled={isSubmitting}>
      {isSubmitting ? (
        <LoaderCircleIcon className='animate-spin' />
      ) : (
        'Log in'
      )}
    </Button>
  );

  return (
    <AuthFormContainer
      title='Login to your account'
      description='Enter your email below to login to your account'
      submitButton={submitButton}
      generalError={
        actionData && 'loginError' in actionData ? actionData.loginError || undefined : undefined
      }
      footerText="Don't have an account?"
      footerLinkText='Sign up'
      footerLinkTo='/auth/join'
    >
      <FormField
        label='Email'
        name='email'
        type='email'
        placeholder='moca@example.com'
        required
        error={
          actionData && 'formErrors' in actionData && actionData.formErrors && 'email' in actionData.formErrors
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
          actionData && 'formErrors' in actionData && actionData.formErrors && 'password' in actionData.formErrors
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
    </AuthFormContainer>
  );
}
