import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { Form, Link } from 'react-router';

interface AuthFormContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  submitButton: React.ReactNode;
  generalError?: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export function AuthFormContainer({
  title,
  description,
  children,
  submitButton,
  generalError,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthFormContainerProps) {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            {description && (
              <p className='text-muted-foreground text-sm text-balance'>
                {description}
              </p>
            )}
          </div>

          <Form className='grid gap-6 space-y-3' method='post'>
            {children}
            
            {submitButton}
            
            {generalError && (
              <p className='text-sm text-red-500'>{generalError}</p>
            )}

            <SocialAuthButtons />
          </Form>
          
          <div className='text-center text-sm'>
            {footerText}{' '}
            <Link to={footerLinkTo} className='underline underline-offset-4'>
              {footerLinkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}