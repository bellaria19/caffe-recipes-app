import type { Route } from '.react-router/types/app/features/auth/screens/+types/join';

import { AuthFormContainer } from '@/components/auth/auth-form-container';
import { FormField } from '@/components/auth/form-field';
import { Button } from '@/components/ui/button';
import { checkUsernameExists } from '@/features/auth/queries';
import { makeSSRClient } from '@/supa-client';
import { LoaderCircleIcon } from 'lucide-react';
import {
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

  const submitButton = (
    <Button type='submit' className='w-full' disabled={isSubmitting}>
      {isSubmitting ? (
        <LoaderCircleIcon className='animate-spin' />
      ) : (
        'Sign up'
      )}
    </Button>
  );

  return (
    <AuthFormContainer
      title='Sign up to your account'
      submitButton={submitButton}
      generalError={
        actionData && 'signUpError' in actionData ? actionData.signUpError || undefined : undefined
      }
      footerText='Already have an account?'
      footerLinkText='Login'
      footerLinkTo='/auth/login'
    >
      <FormField
        label='Username'
        name='username'
        type='text'
        placeholder='Enter your username'
        required
        error={
          actionData && 'formErrors' in actionData
            ? actionData?.formErrors?.username
            : undefined
        }
      />

      <FormField
        label='Email'
        name='email'
        type='email'
        placeholder='moca@example.com'
        required
        error={
          actionData && 'formErrors' in actionData && actionData.formErrors && 'email' in actionData.formErrors
            ? actionData.formErrors.email
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
      />
    </AuthFormContainer>
  );
}
