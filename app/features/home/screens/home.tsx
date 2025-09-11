import type { BrewType, Recipe, SortType } from '@/lib/types';
import type { MetaFunction } from 'react-router';

import { BrewingTypeDropdown } from '@/components/home/brewing-type-dropdown';
import { FilterDropdown } from '@/components/home/filter-dropdown';
import { SortDropdown } from '@/components/home/sort-dropdown';
import { PageContainer } from '@/components/page-container';
import { RecipeCard } from '@/components/recipe-card';
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
import { Separator } from '@/components/ui/separator';
import { mockRecipes } from '@/lib/data/recipes';
import { useDynamicPagination } from '@/lib/hooks/use-dynamic-pagination';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Home | Moca' }];
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('type') as BrewType) || '';
  const initialSort = (searchParams.get('sort') as SortType) || '';
  const initialQuery = searchParams.get('q') || '';

  const [selectedFilter, setSelectedFilter] = useState<BrewType | ''>(
    initialFilter
  );
  const [selectedSort, setSelectedSort] = useState<SortType>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [brewingType, setBrewingType] = useState<'hot' | 'ice' | ''>(''); // For drip filtering

  const filteredRecipes = useMemo(() => {
    let results = [...mockRecipes];

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
  }, [selectedFilter, selectedSort, searchQuery, brewingType]);

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
    <PageContainer className='flex flex-col'>
      <div className='container mx-auto flex flex-1 flex-col p-4 py-10'>
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Moca에 오신 것을 환영합니다</h1>
          <p className="text-muted-foreground">
            전 세계의 놀라운 커피 레시피를 발견하고 공유하세요.
          </p>
        </div> */}

        <div className='mb-6 flex-shrink-0 space-y-10'>
          <div>
            {/* <div className="flex items-center justify-between mb-4"> */}
            <h2 className='mb-4 text-xl font-semibold'>레시피 검색</h2>
            {/* <Button asChild>
                <Link
                  to="/recipes/create"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>레시피 추가</span>
                </Link>
              </Button> */}
            {/* </div> */}
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder='이름, 설명, 작성자 또는 재료로 레시피를 검색하세요...'
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

          {pagination.totalPages >= 1 && (
            <div className='flex-shrink-0 py-6'>
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
    </PageContainer>
  );
}
