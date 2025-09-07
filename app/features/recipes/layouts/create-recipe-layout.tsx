import { Outlet } from "react-router";
import { PageContainer } from "@/components/page-container";

export default function CreateRecipeLayout() {
  return (
    <PageContainer>
      <div className="container mx-auto p-4 max-w-2xl">
        <Outlet />
      </div>
    </PageContainer>
  );
}