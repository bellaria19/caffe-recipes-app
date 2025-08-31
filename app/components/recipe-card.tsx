import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onViewRecipe }: RecipeCardProps) {
  const handleViewRecipe = () => {
    onViewRecipe?.(recipe);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow min-h-[320px] max-h-[400px] min-w-[280px] max-w-[400px] w-full h-fit flex flex-col">
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

      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p className="line-clamp-1">{recipe.author}</p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{recipe.rating}/5</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleViewRecipe}
          className="w-full justify-end p-2 h-auto font-medium text-primary hover:text-primary/80 hover:bg-primary/5"
        >
          <span>레시피 보기</span>
          <span>→</span>
        </Button>
      </CardContent>
    </Card>
  );
}
