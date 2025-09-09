import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Snowflake, Thermometer } from 'lucide-react';

interface BrewingTypeSelectorProps {
  brewingType: 'hot' | 'ice';
  onBrewingTypeChange: (type: 'hot' | 'ice') => void;
}

export function BrewingTypeSelector({
  brewingType,
  onBrewingTypeChange,
}: BrewingTypeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>추출 방식</CardTitle>
        <CardDescription>
          핫 드립 또는 아이스 드립 중 선택해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className={cn(
              'flex flex-1 items-center gap-2',
              brewingType === 'hot'
                ? 'border-red-500 bg-red-500 text-white hover:bg-red-600 dark:border-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                : 'hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-700 dark:hover:bg-red-950 dark:hover:text-red-400',
            )}
            onClick={() => onBrewingTypeChange('hot')}
          >
            <Thermometer className="h-4 w-4" />
            HOT
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'flex flex-1 items-center gap-2',
              brewingType === 'ice'
                ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                : 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-400',
            )}
            onClick={() => onBrewingTypeChange('ice')}
          >
            <Snowflake className="h-4 w-4" />
            ICE
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
