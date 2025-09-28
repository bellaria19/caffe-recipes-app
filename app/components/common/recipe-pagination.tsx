import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface RecipePaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function RecipePagination({
  totalPages,
  currentPage,
  onPageChange,
}: RecipePaginationProps) {
  // Generate pagination items with ellipsis logic
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

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage <= 1
                ? 'pointer-events-none opacity-50'
                : 'hover:bg-primary/10 cursor-pointer transition-all duration-200'
            }
          />
        </PaginationItem>

        {getPaginationItems().map((item, index) => (
          <PaginationItem key={index}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(item as number)}
                isActive={currentPage === item}
                className={`cursor-pointer transition-all duration-200 ${
                  currentPage === item
                    ? 'bg-primary text-primary-foreground shadow-md border-primary'
                    : 'hover:bg-primary/10 hover:border-primary/30'
                }`}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage >= totalPages
                ? 'pointer-events-none opacity-50'
                : 'hover:bg-primary/10 cursor-pointer transition-all duration-200'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}