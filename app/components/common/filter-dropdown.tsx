import type { RecipeType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  selectedFilter: RecipeType | '';
  onFilterChange: (filter: RecipeType | '') => void;
}

export function FilterDropdown({
  selectedFilter,
  onFilterChange,
}: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          {selectedFilter === ''
            ? '전체'
            : selectedFilter === 'drip'
              ? '드립'
              : selectedFilter === 'espresso'
                ? '에스프레소'
                : '필터 선택'}
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuItem onClick={() => onFilterChange('')}>
          전체
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('drip')}>
          드립
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('espresso')}>
          에스프레소
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
