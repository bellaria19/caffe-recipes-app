import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { SortType } from "@/lib/types";

interface SortDropdownProps {
  selectedSort: SortType | "";
  onSortChange: (sort: SortType) => void;
}

export function SortDropdown({ selectedSort, onSortChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedSort === "popularity"
            ? "인기순"
            : selectedSort === "newest"
              ? "최신순"
              : "정렬 선택"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onSortChange("popularity")}>
          인기순
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("newest")}>
          최신순
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}