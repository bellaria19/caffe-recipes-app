import { useEffect, useMemo, useState } from 'react';

function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

function getItemsPerPage(width: number, height: number): number {
  // Based on Tailwind breakpoints and grid layout
  // grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

  let columns = 1;
  if (width >= 1280)
    columns = 4; // xl
  else if (width >= 1024)
    columns = 3; // lg
  else if (width >= 768)
    columns = 2; // md
  else columns = 1; // sm and below

  // Calculate rows based on available height
  // Each card is roughly 320-400px tall plus gaps
  const headerHeight = 200; // Search section + filters
  const footerHeight = 100; // Pagination
  const availableHeight = height - headerHeight - footerHeight;
  const cardHeight = 360; // Estimated card height + gap
  const rows = Math.max(1, Math.floor(availableHeight / cardHeight));

  return columns * rows;
}

export function useDynamicPagination<T>(items: T[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const { width, height } = useScreenSize();

  const itemsPerPage = useMemo(() => {
    return getItemsPerPage(width, height);
  }, [width, height]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  // Reset to page 1 when itemsPerPage changes due to screen resize
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return {
    data: paginatedData,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
    totalItems: items.length,
    itemsPerPage,
  };
}
