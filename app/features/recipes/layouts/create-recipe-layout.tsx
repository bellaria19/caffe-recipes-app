import { PageContainer } from '@/components/common/page-container';
import { type MetaFunction, Outlet } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Create Recipe | Moca' }];
};

export default function CreateRecipeLayout() {
  return (
    <PageContainer>
      <div className='container mx-auto max-w-3xl p-4 pb-20'>
        <Outlet />
      </div>
    </PageContainer>
  );
}
