import { PageContainer } from '@/components/page-container';
import { Outlet } from 'react-router';

export default function CreateRecipeLayout() {
  return (
    <PageContainer>
      <div className="container mx-auto max-w-2xl p-4">
        <Outlet />
      </div>
    </PageContainer>
  );
}
