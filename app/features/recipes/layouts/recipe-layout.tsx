import { PageContainer } from '@/components/page-container';
import { type MetaFunction, Outlet } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Recipe | Moca' }];
};

export default function RecipeLayout() {
  return (
    <PageContainer>
      <div className='container mx-auto max-w-4xl p-4'>
        <Outlet />
      </div>
    </PageContainer>
  );
}
