import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Snowflake, Thermometer } from 'lucide-react';

interface BrewingTypeDropdownProps {
  brewingType: 'hot' | 'ice' | '';
  onBrewingTypeChange: (type: 'hot' | 'ice' | '') => void;
}

export function BrewingTypeDropdown({
  brewingType,
  onBrewingTypeChange,
}: BrewingTypeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {brewingType === 'hot' ? (
            <>
              <Thermometer className="h-4 w-4" />
              HOT
            </>
          ) : brewingType === 'ice' ? (
            <>
              <Snowflake className="h-4 w-4" />
              ICE
            </>
          ) : (
            '추출 방식'
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onBrewingTypeChange('')}>
          전체
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onBrewingTypeChange('hot')}>
          <Thermometer className="mr-2 h-4 w-4" />
          HOT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onBrewingTypeChange('ice')}>
          <Snowflake className="mr-2 h-4 w-4" />
          ICE
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
