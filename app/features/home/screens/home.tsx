import type { BrewType, Recipe, SortType } from '@/lib/types';
import type { MetaFunction } from 'react-router';

import { PageContainer } from '@/components/common/page-container';
import { RecipeCard } from '@/components/common/recipe-card';
import { BrewingTypeDropdown } from '@/components/home/brewing-type-dropdown';
import { FilterDropdown } from '@/components/home/filter-dropdown';
import { SortDropdown } from '@/components/home/sort-dropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { mockRecipes } from '@/lib/data/recipes';
import { getPopularRecipes } from '@/lib/data/popular-recipes';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export const meta: MetaFunction = () => {
  return [{ title: 'Home | Moca' }];
};

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialFilter = (searchParams.get('type') as BrewType) || '';
  const initialSort = (searchParams.get('sort') as SortType) || '';
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedFilter, setSelectedFilter] = useState<BrewType | ''>(
    initialFilter
  );
  const [selectedSort, setSelectedSort] = useState<SortType>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [brewingType, setBrewingType] = useState<'hot' | 'ice' | ''>(''); // For drip filtering
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

          const recipes = await getPopularRecipes(period, 100, 0);
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
    // Use popular recipes for popularity sorts, otherwise use mock data
    let results = selectedSort.startsWith('popularity') && popularRecipes.length > 0
      ? [...popularRecipes]
      : [...mockRecipes];

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
        results = results.filter(
          (recipe) => recipe.dripParams?.brewingType === brewingType
        );
      }
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
  }, [selectedFilter, selectedSort, searchQuery, brewingType, popularRecipes]);

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

  const handleFilterChange = (filter: BrewType | '') => {
    setSelectedFilter(filter);
    // Reset brewing type when filter changes
    if (filter !== 'drip') {
      setBrewingType('');
    }
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

  // Pagination link generator
  const getPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        items.push(1);
        items.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      }
    }

    return items;
  };

  return (
    <PageContainer className='flex flex-col'>
      <div className='container mx-auto flex flex-1 flex-col p-4 py-10'>
        <div className='mb-6 flex-shrink-0 space-y-10'>
          <div>
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
              {paginatedRecipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
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

          {totalPages > 1 && (
            <Pagination className='mt-8'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage <= 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {getPaginationItems().map((item, index) => (
                  <PaginationItem key={index}>
                    {item === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(item as number)}
                        isActive={currentPage === item}
                        className='cursor-pointer'
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
