import { PageContainer } from '@/components/page-container';
import { Outlet } from 'react-router';

export default function RecipeLayout() {
  return (
    <PageContainer>
      <div className="container mx-auto max-w-4xl p-4">
        <Outlet />
      </div>
    </PageContainer>
  );
}
