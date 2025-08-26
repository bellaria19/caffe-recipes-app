import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { mockRecipes } from "@/lib/data/recipes";
import type { BrewType, Recipe } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, X } from "lucide-react";
import { usePagination } from "@/lib/hooks/use-pagination";
import { RecipeCard } from "@/components/recipe-card";

export default function Home() {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get("type") as BrewType) || "";
  const initialQuery = searchParams.get("q") || "";

  const [selectedFilter, setSelectedFilter] = useState<BrewType | "">(
    initialFilter
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredRecipes = useMemo(() => {
    let results = mockRecipes;

    if (searchQuery) {
      results = results.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          recipe.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedFilter) {
      results = results.filter((recipe) => recipe.brewType === selectedFilter);
    }

    return results;
  }, [selectedFilter, searchQuery]);

  const pagination = usePagination(filteredRecipes, 6);

  const handleFilterChange = (filter: BrewType | "") => {
    setSelectedFilter(filter);
    pagination.resetPage();
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    pagination.resetPage();
  };

  // Reset pagination when filters change
  useEffect(() => {
    pagination.resetPage();
  }, [filteredRecipes.length]);

  const handleViewRecipe = (recipe: Recipe) => {
    // TODO: Navigate to recipe detail page
    console.log("View recipe:", recipe.title);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="container mx-auto p-4 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome to Caffe Recipes</h1>
          <p className="text-muted-foreground">
            Discover and share amazing coffee recipes from around the world.
          </p>
        </div>

        <div className="mb-6 space-y-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Recipes</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search recipes by name, description, author, or ingredients..."
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSearchChange("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Filter by Brew Type</h2>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedFilter === "" ? "default" : "outline"}
                onClick={() => handleFilterChange("")}
              >
                All Types ({filteredRecipes.length})
              </Button>
              <Button
                variant={selectedFilter === "drip" ? "default" : "outline"}
                onClick={() => handleFilterChange("drip")}
              >
                Drip (
                {searchQuery
                  ? filteredRecipes.filter((r) => r.brewType === "drip").length
                  : mockRecipes.filter((r) => r.brewType === "drip").length}
                )
              </Button>
              <Button
                variant={selectedFilter === "espresso" ? "default" : "outline"}
                onClick={() => handleFilterChange("espresso")}
              >
                Espresso (
                {searchQuery
                  ? filteredRecipes.filter((r) => r.brewType === "espresso")
                      .length
                  : mockRecipes.filter((r) => r.brewType === "espresso").length}
                )
              </Button>
            </div>
          </div>

          {(searchQuery || selectedFilter) && (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.totalItems} result
              {pagination.totalItems !== 1 ? "s" : ""} • Page{" "}
              {pagination.currentPage} of {pagination.totalPages}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedFilter && ` (${selectedFilter} recipes)`}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {pagination.data.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewRecipe={handleViewRecipe}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="py-12 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No recipes found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter settings.
                  </p>
                </div>
              </div>
            )}
          </div>

          {pagination.totalPages >= 1 && (
            <div className="flex-shrink-0 pt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={pagination.goToPreviousPage}
                      className={
                        !pagination.hasPreviousPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => pagination.goToPage(page)}
                        isActive={page === pagination.currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={pagination.goToNextPage}
                      className={
                        !pagination.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
