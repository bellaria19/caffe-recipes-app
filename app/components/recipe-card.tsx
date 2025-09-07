import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useNavigate } from "react-router";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onViewRecipe }: RecipeCardProps) {
  const navigate = useNavigate();
  
  const handleViewRecipe = () => {
    navigate(`/recipes/${recipe.id}`);
    onViewRecipe?.(recipe);
  };

  return (
    <Card className="hover:shadow-lg hover:dark:shadow-white/20 transition-shadow min-h-[280px] max-h-[400px] min-w-[300px] max-w-[400px] w-full h-fit flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg leading-tight line-clamp-2">
            {recipe.title}
          </CardTitle>
          <Badge variant="outline" className="flex-shrink-0 ml-2">
            {recipe.brewType}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {recipe.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2 flex flex-col justify-between">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p className="line-clamp-1">{recipe.author}</p>
          <div className="flex items-center gap-1">
            <Star
              className="h-4 w-4 flex-shrink-0 text-yellow-500"
              fill="currentColor"
            />
            <span className="whitespace-nowrap">{recipe.rating}/5</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          variant="ghost"
          onClick={handleViewRecipe}
          className="w-full justify-end p-2 h-auto font-medium text-primary hover:text-primary/80 hover:bg-primary/5"
        >
          <span>레시피 보기</span>
          <span>→</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
