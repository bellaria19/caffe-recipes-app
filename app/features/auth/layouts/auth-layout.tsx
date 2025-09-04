import { Outlet } from "react-router";
import { PageContainer } from "@/components/page-container";

export default function AuthLayout() {
  return (
    <PageContainer className="grid lg:grid-cols-2 items-center justify-center bg-background overflow-hidden">
      <Outlet />

      <div className="bg-muted relative hidden md:block h-full">
        <img
          src="/images/placeholder2.jpg"
          alt="Image"
          className="absolute inset-0 w-full object-cover"
        />
      </div>
    </PageContainer>
  );
}
