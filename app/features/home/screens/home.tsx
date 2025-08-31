import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { mockRecipes } from "@/lib/data/recipes";
import type { BrewType, Recipe } from "@/lib/types";

type SortType = "" | "popularity" | "newest";
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

export default function Home() {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get("type") as BrewType) || "";
  const initialSort = (searchParams.get("sort") as SortType) || "";
  const initialQuery = searchParams.get("q") || "";

  const [selectedFilter, setSelectedFilter] = useState<BrewType | "">(
    initialFilter
  );
  const [selectedSort, setSelectedSort] = useState<SortType>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredRecipes = useMemo(() => {
    let results = [...mockRecipes];

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

    // Handle brew type filtering
    if (selectedFilter) {
      results = results.filter((recipe) => recipe.brewType === selectedFilter);
    }

    // Handle sorting
    if (selectedSort === "popularity") {
      results = results.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "newest") {
      results = results.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }

    return results;
  }, [selectedFilter, selectedSort, searchQuery]);

  const pagination = useDynamicPagination(filteredRecipes);

  const handleFilterChange = (filter: BrewType | "") => {
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
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Moca에 오신 것을 환영합니다</h1>
          <p className="text-muted-foreground">
            전 세계의 놀라운 커피 레시피를 발견하고 공유하세요.
          </p>
        </div> */}

        <div className="mb-6 space-y-10 flex-shrink-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">레시피 검색</h2>
              <Button asChild>
                <Link
                  to="/recipes/create"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>레시피 추가</span>
                </Link>
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="이름, 설명, 작성자 또는 재료로 레시피를 검색하세요..."
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
                  variant={selectedFilter === "" ? "default" : "outline"}
                  onClick={() => handleFilterChange("")}
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

            {filteredRecipes.length === 0 && (
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
          </div>

          {pagination.totalPages >= 1 && (
            <div className="flex-shrink-0 py-6">
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
