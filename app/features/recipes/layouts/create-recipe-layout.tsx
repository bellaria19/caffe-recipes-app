import { PageContainer } from '@/components/page-container';
import { type MetaFunction, Outlet } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Recipe | Moca' }];
};

export default function CreateRecipeLayout() {
  return (
    <PageContainer>
      <div className='container mx-auto max-w-2xl p-4'>
        <Outlet />
      </div>
    </PageContainer>
  );
}
