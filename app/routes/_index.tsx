import type { Recipe, RecipeType, SortType } from '@/lib/types';

import type { Route } from '.react-router/types/app/routes/+types/_index';

import { PageContainer } from '@/components/common/page-container';
import { RecipeCard } from '@/components/common/recipe-card';
import { RecipePagination } from '@/components/common/recipe-pagination';
import { RecipeSearchAndFilter } from '@/components/common/recipe-search-and-filter';
// import { getPopularRecipes } from '@/lib/data/popular-recipes';
import { addLike, removeLike } from '@/mutations/home';
import { getUserLikes } from '@/queries/home';
import { getRecipes } from '@/queries/recipes';
import { getLoggedInUserId } from '@/queries/users';
import { browserClient, makeSSRClient } from '@/supa-client';
import { useEffect, useMemo, useState } from 'react';
import { type MetaFunction, useNavigate, useSearchParams } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Home | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  const url = new URL(request.url);
  const recipeType = url.searchParams.get('type') as
    | 'espresso'
    | 'drip'
    | undefined;
  const sortBy = url.searchParams.get('sort') as
    | 'newest'
    | 'popularity'
    | 'popularity-daily'
    | 'popularity-weekly'
    | undefined;
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  const ITEMS_PER_PAGE = 12;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    const recipes = await getRecipes(client, {
      recipeType: recipeType || undefined,
      sortBy: sortBy || 'newest',
      limit: ITEMS_PER_PAGE,
      offset,
    });

    // Try to get user likes, but don't fail if user is not authenticated
    let userLikes: string[] = [];
    let currentUserId: string | null = null;
    try {
      const userId = await getLoggedInUserId(client);
      userLikes = await getUserLikes(client, userId);
      currentUserId = userId;
    } catch (authError) {
      // User is not authenticated, continue without likes data
    }

    return { recipes, userLikes, currentUserId };
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    return { recipes: [], userLikes: [], currentUserId: null };
  }
};

const ITEMS_PER_PAGE = 12;

export default function Home({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize liked recipes from server data
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>(
    loaderData.userLikes || []
  );

  // Initialize recipes state for dynamic updates
  const [recipes, setRecipes] = useState<Recipe[]>(loaderData.recipes || []);

  const handleLikeRecipe = async (recipeId: string) => {
    try {
      setLikedRecipeIds((prev) => [...prev, recipeId]);
      // Optimistically update likes count
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, likesCount: (recipe.likesCount || 0) + 1 }
            : recipe
        )
      );

      const userId = await getLoggedInUserId(browserClient);
      await addLike(browserClient, { userId, recipeId });
    } catch (error) {
      // Revert optimistic updates on error
      setLikedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                likesCount: Math.max((recipe.likesCount || 0) - 1, 0),
              }
            : recipe
        )
      );
      console.error('Error liking recipe:', error);
    }
  };

  const handleUnlikeRecipe = async (recipeId: string) => {
    try {
      setLikedRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      // Optimistically update likes count
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                likesCount: Math.max((recipe.likesCount || 0) - 1, 0),
              }
            : recipe
        )
      );

      const userId = await getLoggedInUserId(browserClient);
      await removeLike(browserClient, { userId, recipeId });
    } catch (error) {
      // Revert optimistic updates on error
      setLikedRecipeIds((prev) => [...prev, recipeId]);
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, likesCount: (recipe.likesCount || 0) + 1 }
            : recipe
        )
      );
      console.error('Error unliking recipe:', error);
    }
  };

  const initialFilter = (searchParams.get('type') as RecipeType) || '';
  const initialSort = (searchParams.get('sort') as SortType) || '';
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedFilter, setSelectedFilter] = useState<RecipeType | ''>(
    initialFilter
  );
  const [selectedSort, setSelectedSort] = useState<SortType>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);

  // Fetch popular recipes when sort type changes
  useEffect(() => {
    const fetchPopularRecipes = async () => {
      if (selectedSort.startsWith('popularity')) {
        try {
          let period: 'all' | 'daily' | 'weekly' = 'all';
          if (selectedSort === 'popularity-daily') period = 'daily';
          else if (selectedSort === 'popularity-weekly') period = 'weekly';

          // const recipes = await getPopularRecipes(period, 100, 0);
          setPopularRecipes(recipes);
        } catch (error) {
          console.error('Failed to fetch popular recipes:', error);
          setPopularRecipes([]);
        }
      }
    };

    fetchPopularRecipes();
  }, [selectedSort]);

  const filteredRecipes = useMemo(() => {
    // Use popular recipes for popularity sorts, otherwise use state recipes data
    let results =
      selectedSort.startsWith('popularity') && popularRecipes.length > 0
        ? [...popularRecipes]
        : [...recipes];

    if (searchQuery) {
      results = results.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (recipe.description || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          recipe.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Handle brew type filtering
    if (selectedFilter) {
      results = results.filter((recipe) => recipe.brewType === selectedFilter);
    }

    // Handle sorting for non-popularity sorts
    if (selectedSort === 'newest') {
      results = results.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    } else if (selectedSort === 'popularity' && !popularRecipes.length) {
      // Fallback to rating-based sorting when no popular recipes data
      results = results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [selectedFilter, selectedSort, searchQuery, popularRecipes, recipes]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Function to update URL with current state
  const updateURL = (page: number = currentPage) => {
    const params = new URLSearchParams();
    if (selectedFilter) params.set('type', selectedFilter);
    if (selectedSort) params.set('sort', selectedSort);
    if (searchQuery) params.set('q', searchQuery);
    if (page > 1) params.set('page', page.toString());

    const newURL = params.toString() ? `/?${params.toString()}` : '/';
    navigate(newURL, { replace: true });
  };

  // Custom pagination handlers that update URL
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page);
  };

  const handleFilterChange = (filter: RecipeType | '') => {
    setSelectedFilter(filter);
    setCurrentPage(1);
    updateURL(1);
  };

  const handleSortChange = (sort: SortType) => {
    setSelectedSort(sort);
    setCurrentPage(1);
    updateURL(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateURL(1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    updateURL(1);
  }, [filteredRecipes.length]);

  return (
    <PageContainer className='flex flex-col'>
      <div className='container mx-auto flex max-w-6xl flex-1 flex-col p-4 py-10'>
        <div className='mb-6'>
          <RecipeSearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedType={selectedFilter}
            onTypeChange={handleFilterChange}
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
          />
        </div>

        <div className='flex flex-1 flex-col'>
          <div className='flex-1'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {paginatedRecipes.map((recipe: Recipe) => {
                const isOwnRecipe =
                  loaderData.currentUserId === recipe.profile_id;
                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isLiked={likedRecipeIds.includes(recipe.id)}
                    onLike={handleLikeRecipe}
                    onUnlike={handleUnlikeRecipe}
                    disabled={isOwnRecipe}
                  />
                );
              })}
            </div>

            {filteredRecipes.length === 0 && (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <h3 className='text-muted-foreground mb-2 text-xl font-semibold'>
                    레시피를 찾을 수 없습니다
                  </h3>
                  <p className='text-muted-foreground'>
                    검색어나 필터 설정을 조정해보세요.
                  </p>
                </div>
              </div>
            )}
          </div>

          <RecipePagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </PageContainer>
  );
}
