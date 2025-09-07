import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { EspressoRecipeForm } from "@/components/recipe/espresso-recipe-form";

export default function CreateEspresso() {
  return (
    <>
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/recipes/create">← 뒤로 가기</Link>
      </Button>
      <h1 className="text-3xl font-bold mb-6">에스프레소 레시피 만들기</h1>
      <EspressoRecipeForm />
    </>
  );
}
