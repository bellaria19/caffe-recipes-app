import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrewingTypeSelectorProps {
  brewingType: "hot" | "ice";
  onBrewingTypeChange: (type: "hot" | "ice") => void;
}

export function BrewingTypeSelector({ 
  brewingType, 
  onBrewingTypeChange 
}: BrewingTypeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>추출 방식</CardTitle>
        <CardDescription>핫 드립 또는 아이스 드립 중 선택해주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex-1 flex items-center gap-2",
              brewingType === "hot"
                ? "bg-red-500 dark:bg-red-600 text-white border-red-500 dark:border-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                : "hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700"
            )}
            onClick={() => onBrewingTypeChange("hot")}
          >
            <Thermometer className="h-4 w-4" />
            HOT
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex-1 flex items-center gap-2",
              brewingType === "ice"
                ? "bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
                : "hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700"
            )}
            onClick={() => onBrewingTypeChange("ice")}
          >
            <Snowflake className="h-4 w-4" />
            ICE
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}