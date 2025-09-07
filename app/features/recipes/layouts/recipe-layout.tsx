import { Outlet } from "react-router";
import { PageContainer } from "@/components/page-container";

export default function RecipeLayout() {
  return (
    <PageContainer>
      <div className="container mx-auto p-4 max-w-4xl">
        <Outlet />
      </div>
    </PageContainer>
  );
}