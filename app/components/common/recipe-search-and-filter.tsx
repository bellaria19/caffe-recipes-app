import type { RecipeType, SortType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

import { Card, CardContent } from '../ui/card';
import { FilterDropdown } from './filter-dropdown';
import { SortDropdown } from './sort-dropdown';

interface RecipeSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: RecipeType | '';
  onTypeChange: (type: RecipeType | '') => void;
  selectedSort: SortType;
  onSortChange: (sort: SortType) => void;
  placeholder?: string;
}

export function RecipeSearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSort,
  onSortChange,
  placeholder = '이름, 설명, 작성자로 레시피를 검색하세요...',
}: RecipeSearchAndFilterProps) {
  return (
    <Card>
      <CardContent>
        <div className='space-y-6'>
          <div>
            <h2 className='mb-4 text-xl font-semibold'>검색</h2>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={placeholder}
                  className='pl-10'
                />
              </div>
              {searchQuery && (
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => onSearchChange('')}
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
                onSortChange={onSortChange}
              />
              <FilterDropdown
                selectedFilter={selectedType}
                onFilterChange={onTypeChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
