import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface RecipePaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export function RecipePagination({
  currentPage,
  totalPages,
  goToPage,
  goToNextPage,
  goToPreviousPage,
}: RecipePaginationProps) {
  if (totalPages < 1) return null;

  return (
    <div className='flex-shrink-0 py-6'>
      <Pagination>
        <PaginationContent>
          {currentPage === 1 ? null : (
            <PaginationItem>
              <PaginationPrevious
                onClick={(event) => {
                  event.preventDefault();
                  goToPreviousPage();
                }}
                className='cursor-pointer'
              />
            </PaginationItem>
          )}

          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(currentPage - 1);
                }}
                className='cursor-pointer'
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              onClick={(event) => {
                event.preventDefault();
                goToPage(currentPage);
              }}
              isActive
              className='cursor-pointer'
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(currentPage + 1);
                }}
                className='cursor-pointer'
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage === totalPages ? null : (
            <PaginationItem>
              <PaginationNext
                onClick={(event) => {
                  event.preventDefault();
                  goToNextPage();
                }}
                className='cursor-pointer'
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
