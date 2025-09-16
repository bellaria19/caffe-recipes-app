import { PageContainer } from '@/components/common/page-container';
import { type MetaFunction, Outlet } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Authentication | Moca' }];
};

export default function AuthLayout() {
  return (
    <PageContainer className='bg-background grid items-center justify-center overflow-hidden lg:grid-cols-2'>
      <Outlet />

      <div className='bg-muted relative hidden h-full md:block'>
        <img
          src='/images/placeholder2.jpg'
          alt='Image'
          className='absolute inset-0 w-full object-cover'
        />
      </div>
    </PageContainer>
  );
}
