import type { Recipe, RecipeType, SortType } from '@/lib/types';
import type { MetaFunction } from 'react-router';

import type { Route } from '.react-router/types/app/features/users/screens/+types/my-recipes';

import { RecipeCard } from '@/components/common/recipe-card';
import { RecipePagination } from '@/components/common/recipe-pagination';
import { FilterDropdown } from '@/components/home/filter-dropdown';
import { SortDropdown } from '@/components/home/sort-dropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { addLike, removeLike } from '@/features/home/mutations';
import { getUserLikes } from '@/features/home/queries';
import { getLikedRecipes, getUserRecipes } from '@/features/recipes/queries';
import { getLoggedInUserId } from '@/features/users/queries';
import { browserClient, makeSSRClient } from '@/supa-client';
import { Bookmark, Plus, Search, User, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, redirect, useLocation, useNavigate, useSearchParams } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'My Recipes | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  try {
    const userId = await getLoggedInUserId(client);
    const userRecipes = await getUserRecipes(client, userId);
    const likedRecipes = await getLikedRecipes(client, userId);
    const userLikes = await getUserLikes(client, userId);

    return { userRecipes, likedRecipes, userLikes, currentUserId: userId };
  } catch (error) {
    console.error('Failed to fetch user recipes:', error);
    return redirect('/auth/login');
  }
};

const ITEMS_PER_PAGE = 12;

export default function MyRecipes({
  params,
  loaderData,
}: Route.ComponentProps) {
  const { username } = params;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialFilter = (searchParams.get('type') as RecipeType) || '';
  const initialSort = (searchParams.get('sort') as SortType) || 'newest';
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedFilter, setSelectedFilter] = useState<RecipeType | ''>(
    initialFilter
  );
  const [selectedSort, setSelectedSort] = useState<SortType | ''>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeTab, setActiveTab] = useState<'my-recipes' | 'saved-recipes'>(
    'my-recipes'
  );

  // Initialize state from loader data
  const [userRecipes, setUserRecipes] = useState<Recipe[]>(
    loaderData.userRecipes
  );
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>(
    loaderData.likedRecipes
  );

  // Initialize liked recipe IDs from server data
  const [likedRecipeIds, setLikedRecipeIds] = useState<string[]>(
    loaderData.userLikes || []
  );

  const handleLikeRecipe = async (recipeId: string) => {
    try {
      setLikedRecipeIds((prev) => [...prev, recipeId]);
      // Optimistically update likes count in both states
      setUserRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, likesCount: (recipe.likesCount || 0) + 1 }
            : recipe
        )
      );
      setLikedRecipes((prev) =>
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
      setUserRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                likesCount: Math.max((recipe.likesCount || 0) - 1, 0),
              }
            : recipe
        )
      );
      setLikedRecipes((prev) =>
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
      // Optimistically update likes count in both states
      setUserRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? {
                ...recipe,
                likesCount: Math.max((recipe.likesCount || 0) - 1, 0),
              }
            : recipe
        )
      );
      setLikedRecipes((prev) =>
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
      setUserRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, likesCount: (recipe.likesCount || 0) + 1 }
            : recipe
        )
      );
      setLikedRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, likesCount: (recipe.likesCount || 0) + 1 }
            : recipe
        )
      );
      console.error('Error unliking recipe:', error);
    }
  };

  const filteredRecipes = useMemo(() => {
    let results = activeTab === 'my-recipes' ? userRecipes : likedRecipes;

    if (searchQuery) {
      results = results.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (recipe.description || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Handle brew type filtering
    if (selectedFilter) {
      results = results.filter((recipe) => recipe.brewType === selectedFilter);
    }

    // Handle sorting
    if (selectedSort === 'popularity') {
      results = results.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'newest') {
      results = results.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }

    return results;
  }, [
    selectedFilter,
    selectedSort,
    searchQuery,
    activeTab,
    userRecipes,
    likedRecipes,
  ]);

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

    const newURL = params.toString()
      ? `/users/${username}/my-recipes?${params.toString()}`
      : `/users/${username}/my-recipes`;
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

  // Get current URL for back navigation
  const currentUrl = location.pathname + location.search;


  return (
    <div className='from-background to-muted/20 flex min-h-[calc(100vh-3.5rem)] flex-col bg-gradient-to-b'>
      <div className='container mx-auto flex flex-1 flex-col p-4 py-10'>
        {/* Enhanced Header Section */}
        <div className='mb-8'>
          <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <h1 className='from-foreground via-primary to-foreground/80 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl'>
                  My Coffee Lab
                </h1>
              </div>
              <p className='text-muted-foreground text-sm leading-relaxed md:text-lg'>
                당신만의 특별한 커피 레시피와 좋아하는 레시피를 한곳에서
                관리하고,
                <br />
                완벽한 한 잔을 위한 여정을 기록해보세요 ✨
              </p>
            </div>

            <Button
              asChild
              size='lg'
              className='shadow-lg transition-shadow hover:shadow-xl'
            >
              <Link
                to='/recipes/create'
                className='flex items-center space-x-2'
              >
                <Plus className='h-5 w-5' />
                <span>새 레시피 추가</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className='mb-6'>
          <CardContent>
            <div className='space-y-5'>
              {/* Search Section */}
              <div className='flex items-center gap-2'>
                <Search className='text-muted-foreground h-5 w-5' />
                <h2 className='text-base font-semibold sm:text-lg'>
                  레시피 검색
                </h2>
              </div>
              <div className='flex gap-3'>
                <div className='relative flex-1'>
                  <Search className='text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder='레시피 제목이나 설명으로 검색하세요...'
                    className='border-muted-foreground/20 focus:border-primary h-11 pl-11 transition-colors'
                  />
                </div>
                {searchQuery && (
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleSearchChange('')}
                    className='hover:bg-destructive hover:text-destructive-foreground h-11 w-11 transition-colors'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>

              {/* Filter Section */}
              <div className='flex items-center gap-2'>
                <svg
                  className='text-muted-foreground h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
                  />
                </svg>
                <h2 className='text-base font-semibold sm:text-lg'>
                  정렬 및 필터
                </h2>
              </div>
              <div className='flex flex-wrap gap-3'>
                <div className='flex-none'>
                  <SortDropdown
                    selectedSort={selectedSort}
                    onSortChange={handleSortChange}
                  />
                </div>
                <div className='flex-none'>
                  <FilterDropdown
                    selectedFilter={selectedFilter}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recipe Type Tabs - Moved below search section */}
        <div className='bg-card/50 mb-6 rounded-xl border p-1.5 shadow-sm backdrop-blur-sm'>
          <div className='flex gap-1'>
            <Button
              variant={activeTab === 'my-recipes' ? 'default' : 'ghost'}
              size='lg'
              onClick={() => setActiveTab('my-recipes')}
              className={`flex-1 justify-center gap-2 transition-all ${
                activeTab === 'my-recipes' ? 'shadow-md' : 'hover:bg-muted/50'
              }`}
            >
              <User className='h-4 w-4' />
              <span className='text-sm sm:text-base'>내 레시피</span>
              <span className='bg-muted/70 text-muted-foreground rounded-full px-2 py-1 text-xs font-medium'>
                {userRecipes.length}
              </span>
            </Button>
            <Button
              variant={activeTab === 'saved-recipes' ? 'default' : 'ghost'}
              size='lg'
              onClick={() => setActiveTab('saved-recipes')}
              className={`flex-1 justify-center gap-2 transition-all ${
                activeTab === 'saved-recipes'
                  ? 'shadow-md'
                  : 'hover:bg-muted/50'
              }`}
            >
              <Bookmark className='h-4 w-4' />
              <span className='text-sm sm:text-base'>좋아요한 레시피</span>
              <span className='bg-muted/70 text-muted-foreground rounded-full px-2 py-1 text-xs font-medium'>
                {likedRecipes.length}
              </span>
            </Button>
          </div>
        </div>

        <div className='flex flex-1 flex-col'>
          <div className='flex-1'>
            {/* Results Header */}
            {filteredRecipes.length > 0 && (
              <div className='mb-6 flex items-center justify-between'>
                <p className='text-muted-foreground text-xs sm:text-sm'>
                  {activeTab === 'my-recipes' ? '내 레시피' : '좋아요한 레시피'}{' '}
                  {filteredRecipes.length}개
                </p>
                {searchQuery && (
                  <p className='text-muted-foreground text-xs sm:text-sm'>
                    "{searchQuery}" 검색 결과
                  </p>
                )}
              </div>
            )}

            {/* Recipe Grid */}
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {paginatedRecipes.map((recipe: Recipe) => {
                const isOwnRecipe =
                  loaderData.currentUserId === recipe.profile_id;
                return (
                  <div
                    key={recipe.id}
                    className='transform transition-all duration-200 hover:scale-[1.02]'
                  >
                    <RecipeCard
                      recipe={recipe}
                      isLiked={likedRecipeIds.includes(recipe.id)}
                      onLike={handleLikeRecipe}
                      onUnlike={handleUnlikeRecipe}
                      disabled={isOwnRecipe}
                      backUrl={currentUrl}
                    />
                  </div>
                );
              })}
            </div>

            {/* Enhanced Empty States */}
            {filteredRecipes.length === 0 &&
              (activeTab === 'my-recipes'
                ? userRecipes.length > 0
                : likedRecipes.length > 0) && (
                <div className='flex items-center justify-center py-16'>
                  <div className='max-w-md text-center'>
                    <div className='bg-muted/50 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full p-6'>
                      <Search className='text-muted-foreground/70 h-8 w-8' />
                    </div>
                    <h3 className='text-foreground mb-3 text-lg font-semibold sm:text-xl'>
                      검색 결과가 없습니다
                    </h3>
                    <p className='text-muted-foreground mb-6 leading-relaxed'>
                      "{searchQuery}" 또는 선택한 필터 조건에 해당하는 레시피를
                      찾을 수 없습니다.
                      <br />
                      다른 검색어나 필터를 시도해보세요.
                    </p>
                    <Button
                      variant='outline'
                      onClick={() => {
                        handleSearchChange('');
                        setSelectedFilter('');
                        setSelectedSort('newest');
                      }}
                      className='gap-2'
                    >
                      <X className='h-4 w-4' />
                      필터 초기화
                    </Button>
                  </div>
                </div>
              )}

            {activeTab === 'my-recipes' && userRecipes.length === 0 && (
              <div className='flex items-center justify-center py-16'>
                <div className='max-w-md text-center'>
                  <div className='from-primary/10 to-primary/5 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br p-6'>
                    <User className='text-primary h-10 w-10' />
                  </div>
                  <h3 className='text-foreground mb-3 text-lg font-semibold sm:text-xl'>
                    첫 번째 레시피를 만들어보세요!
                  </h3>
                  <p className='text-muted-foreground mb-6 leading-relaxed'>
                    아직 작성한 레시피가 없습니다.
                    <br />
                    나만의 특별한 커피 레시피를 공유해보세요.
                  </p>
                  <div className='flex flex-col justify-center gap-3 sm:flex-row'>
                    <Button asChild size='lg' className='shadow-md'>
                      <Link
                        to='/recipes/create'
                        className='flex items-center gap-2'
                      >
                        <Plus className='h-4 w-4' />
                        <span>새 레시피 추가</span>
                      </Link>
                    </Button>
                    <Button asChild variant='outline' size='lg'>
                      <Link to='/' className='flex items-center gap-2'>
                        <Search className='h-4 w-4' />
                        <span>인기 레시피 둘러보기</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved-recipes' && likedRecipes.length === 0 && (
              <div className='flex items-center justify-center py-16'>
                <div className='max-w-md text-center'>
                  <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 p-6'>
                    <Bookmark className='h-10 w-10 text-red-500' />
                  </div>
                  <h3 className='text-foreground mb-3 text-lg font-semibold sm:text-xl'>
                    좋아하는 레시피를 저장해보세요
                  </h3>
                  <p className='text-muted-foreground mb-6 leading-relaxed'>
                    아직 좋아요한 레시피가 없습니다.
                    <br />
                    마음에 드는 레시피를 찾아서 ♥️를 눌러보세요!
                  </p>
                  <Button
                    asChild
                    variant='outline'
                    size='lg'
                    className='shadow-md'
                  >
                    <Link to='/' className='flex items-center gap-2'>
                      <Search className='h-4 w-4' />
                      <span>레시피 둘러보기</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <Card className='mt-8'>
              <CardContent className='p-4'>
                <RecipePagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
