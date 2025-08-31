import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { mockRecipes } from "@/lib/data/recipes";
import type { BrewType, Recipe, SortType } from "@/lib/types";
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
import { Search, X, Plus } from "lucide-react";
import { useDynamicPagination } from "@/lib/hooks/use-dynamic-pagination";
import { RecipeCard } from "@/components/recipe-card";
import { Separator } from "@/components/ui/separator";

export default function MyRecipes() {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get("type") as BrewType) || "all";
  const initialSort = (searchParams.get("sort") as SortType) || "newest";
  const initialQuery = searchParams.get("q") || "";

  const [selectedFilter, setSelectedFilter] = useState<BrewType>(initialFilter);
  const [selectedSort, setSelectedSort] = useState<SortType>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // TODO: Replace with actual user recipes from API/database
  // For now, filtering mockRecipes by author to simulate user's recipes
  const userRecipes = mockRecipes.filter(
    (recipe) => recipe.author === "John Coffee Lover" // This should be current user
  );

  const filteredRecipes = useMemo(() => {
    let results = userRecipes;

    if (searchQuery) {
      results = results.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedFilter) {
      results = results.filter((recipe) => recipe.brewType === selectedFilter);
    }

    return results;
  }, [selectedFilter, searchQuery, userRecipes]);

  const pagination = useDynamicPagination(filteredRecipes);

  const handleFilterChange = (filter: BrewType) => {
    setSelectedFilter(filter);
    pagination.resetPage();
  };

  const handleSortChange = (sort: SortType) => {
    setSelectedSort(sort);
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
      <div className="container py-10 mx-auto p-4 flex-1 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">내 레시피</h1>
            <p className="text-muted-foreground">
              나만의 커피 레시피를 관리하고 공유하세요.
            </p>
          </div>
          {/* <Button asChild>
            <Link to="/recipes/create" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>새 레시피 추가</span>
            </Link>
          </Button> */}
        </div>

        <div className="mb-6 space-y-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold mb-4">레시피 검색</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="내 레시피에서 검색..."
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
            <h2 className="text-xl font-semibold mb-4">정렬 및 필터</h2>
            <div className="flex flex-wrap justify-between">
              <div className="flex gap-2">
                <Button
                  variant={
                    selectedSort === "popularity" ? "default" : "outline"
                  }
                  onClick={() => handleSortChange("popularity")}
                >
                  인기순
                </Button>
                <Button
                  variant={selectedSort === "newest" ? "default" : "outline"}
                  onClick={() => handleSortChange("newest")}
                >
                  최신순
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6 mx-4" />

              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  onClick={() => handleFilterChange("all")}
                >
                  전체
                </Button>
                <Button
                  variant={selectedFilter === "drip" ? "default" : "outline"}
                  onClick={() => handleFilterChange("drip")}
                >
                  드립
                </Button>
                <Button
                  variant={
                    selectedFilter === "espresso" ? "default" : "outline"
                  }
                  onClick={() => handleFilterChange("espresso")}
                >
                  에스프레소
                </Button>
              </div>
            </div>
          </div>
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

            {filteredRecipes.length === 0 && userRecipes.length > 0 && (
              <div className="py-12 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    레시피를 찾을 수 없습니다
                  </h3>
                  <p className="text-muted-foreground">
                    검색어나 필터 설정을 조정해보세요.
                  </p>
                </div>
              </div>
            )}

            {userRecipes.length === 0 && (
              <div className="py-12 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    아직 작성한 레시피가 없습니다
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    첫 번째 레시피를 만들거나 다른 사용자의 레시피를 둘러보세요!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link
                        to="/recipes/create"
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>새 레시피 추가</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/" className="flex items-center space-x-2">
                        <Search className="h-4 w-4" />
                        <span>레시피 둘러보기</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
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
