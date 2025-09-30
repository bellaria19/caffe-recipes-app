import type { SortType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  selectedSort: SortType | '';
  onSortChange: (sort: SortType) => void;
}

export function SortDropdown({
  selectedSort,
  onSortChange,
}: SortDropdownProps) {
  const getSortLabel = (sort: SortType | '') => {
    switch (sort) {
      case 'popularity':
        return '인기순';
      // case 'popularity':
      //   return '전체 인기순';
      // case 'popularity-daily':
      //   return '일간 인기순';
      // case 'popularity-weekly':
      //   return '주간 인기순';
      case 'newest':
        return '최신순';
      default:
        return '정렬 선택';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          {getSortLabel(selectedSort)}
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuItem onClick={() => onSortChange('popularity')}>
          인기순
          {/* 전체 인기순 */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem onClick={() => onSortChange('popularity-daily')}>
          일간 인기순
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('popularity-weekly')}>
          주간 인기순
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={() => onSortChange('newest')}>
          최신순
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
