import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DripRecipeForm } from "@/components/recipe/drip-recipe-form";

export default function CreateDrip() {
  return (
    <>
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/recipes/create">← 뒤로 가기</Link>
      </Button>
      <h1 className="text-3xl font-bold mb-6">드립 커피 레시피 만들기</h1>
      <DripRecipeForm />
    </>
  );
}
