import type { BrewType, Recipe, SortType } from '@/lib/types';
import type { MetaFunction } from 'react-router';

import type { Route } from '.react-router/types/app/features/users/screens/+types/my-recipes';

import { RecipeCard } from '@/components/common/recipe-card';
import { BrewingTypeDropdown } from '@/components/home/brewing-type-dropdown';
import { FilterDropdown } from '@/components/home/filter-dropdown';
import { SortDropdown } from '@/components/home/sort-dropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { mockRecipes } from '@/lib/data/recipes';
import { useDynamicPagination } from '@/lib/hooks/use-dynamic-pagination';
import { makeSSRClient } from '@/supa-client';
import { Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, redirect, useSearchParams } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'My Recipes | Moca' }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    console.log('user');
    console.log(user);
    // const userRecipes = await getUserRecipes(client, { userId: user.id });
  } else {
    return redirect('/auth/login');
  }
};

export default function MyRecipes() {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('type') as BrewType) || '';
  const initialSort = (searchParams.get('sort') as SortType) || 'newest';
  const initialQuery = searchParams.get('q') || '';

  const [selectedFilter, setSelectedFilter] = useState<BrewType | ''>(
    initialFilter
  );
  const [selectedSort, setSelectedSort] = useState<SortType | ''>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [brewingType, setBrewingType] = useState<'hot' | 'ice' | ''>(''); // For drip filtering

  // TODO: Replace with actual user recipes from API/database
  // For now, filtering mockRecipes by author to simulate user's recipes
  const userRecipes = mockRecipes.filter(
    (recipe) => recipe.author === 'John Coffee Lover' // This should be current user
  );

  const filteredRecipes = useMemo(() => {
    let results = userRecipes;

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

      // Additional filtering for drip brewing type (hot/ice)
      if (selectedFilter === 'drip' && brewingType) {
        // Note: This would filter based on recipe.dripParams?.brewingType once the data includes this
        // For now, we'll show all drip recipes regardless of hot/ice selection
        // results = results.filter((recipe) => recipe.dripParams?.brewingType === brewingType);
      }
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
  }, [selectedFilter, selectedSort, searchQuery, brewingType, userRecipes]);

  const pagination = useDynamicPagination(filteredRecipes);

  const handleFilterChange = (filter: BrewType | '') => {
    setSelectedFilter(filter);
    // Reset brewing type when filter changes
    if (filter !== 'drip') {
      setBrewingType('');
    }
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
    console.log('View recipe:', recipe.title);
  };

  return (
    <div className='flex min-h-[calc(100vh-3.5rem)] flex-col'>
      <div className='container mx-auto flex flex-1 flex-col p-4 py-10'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold'>내 레시피</h1>
            <p className='text-muted-foreground'>
              나만의 커피 레시피를 관리하고 공유하세요.
            </p>
          </div>
          <Button asChild>
            <Link to='/recipes/create' className='flex items-center space-x-2'>
              <Plus className='h-4 w-4' />
              <span>새 레시피 추가</span>
            </Link>
          </Button>
        </div>

        <div className='mb-6 flex-shrink-0 space-y-4'>
          <div>
            <h2 className='mb-4 text-xl font-semibold'>레시피 검색</h2>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder='내 레시피에서 검색...'
                  className='pl-10'
                />
              </div>
              {searchQuery && (
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleSearchChange('')}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>

          <div>
            <h2 className='mb-4 text-xl font-semibold'>정렬 및 필터</h2>
            <div className='flex flex-wrap gap-4'>
              <SortDropdown
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
              />

              <FilterDropdown
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
              />

              {/* Conditional Hot/Ice dropdown for drip filter */}
              {selectedFilter === 'drip' && (
                <BrewingTypeDropdown
                  brewingType={brewingType}
                  onBrewingTypeChange={setBrewingType}
                />
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-1 flex-col'>
          <div className='flex-1'>
            <div className='grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {pagination.data.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewRecipe={handleViewRecipe}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && userRecipes.length > 0 && (
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

            {userRecipes.length === 0 && (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <h3 className='text-muted-foreground mb-2 text-xl font-semibold'>
                    아직 작성한 레시피가 없습니다
                  </h3>
                  <p className='text-muted-foreground mb-4'>
                    첫 번째 레시피를 만들거나 다른 사용자의 레시피를 둘러보세요!
                  </p>
                  <div className='flex justify-center gap-3'>
                    <Button asChild>
                      <Link
                        to='/recipes/create'
                        className='flex items-center space-x-2'
                      >
                        <Plus className='h-4 w-4' />
                        <span>새 레시피 추가</span>
                      </Link>
                    </Button>
                    <Button asChild variant='outline'>
                      <Link to='/' className='flex items-center space-x-2'>
                        <Search className='h-4 w-4' />
                        <span>레시피 둘러보기</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className='flex-shrink-0 pt-6'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={pagination.goToPreviousPage}
                      className={
                        !pagination.hasPreviousPage
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
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
                        className='cursor-pointer'
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
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
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
