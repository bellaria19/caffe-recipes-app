import { PageContainer } from '@/components/common/page-container';
import { type MetaFunction, Outlet } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Authentication | Moca' }];
};

export default function AuthLayout() {
  return (
    <PageContainer className='grid items-center justify-center overflow-hidden lg:grid-cols-2'>
      <Outlet />

      <div className='bg-muted relative hidden h-full lg:block'>
        <img
          src='/images/placeholder2.jpg'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover'
        />
      </div>
    </PageContainer>
  );
}
