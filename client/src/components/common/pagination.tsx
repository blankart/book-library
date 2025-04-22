import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from "../ui/pagination";

export const renderPaginationItems = ({
  totalPages,
  page,
  handlePageChange,
}: {
  totalPages: number;
  page?: number;
  handlePageChange: (i: number) => any;
}) => {
  if (!totalPages) return null;

  const items = [];
  const currentPage = page || 1;

  items.push(
    <PaginationItem key={1}>
      <PaginationLink
        onClick={() => handlePageChange(1)}
        isActive={currentPage === 1}
      >
        1
      </PaginationLink>
    </PaginationItem>
  );

  if (currentPage > 3) {
    items.push(
      <PaginationItem key="start-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    items.push(
      <PaginationItem key={i}>
        <PaginationLink
          onClick={() => handlePageChange(i)}
          isActive={currentPage === i}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  if (currentPage < totalPages - 2) {
    items.push(
      <PaginationItem key="end-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }

  if (totalPages > 1) {
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          onClick={() => handlePageChange(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return items;
};

interface PaginationProps {
  handlePageChange: (page: number) => any;
  page?: number;
  totalPages: number;
}

export function Pagination({
  handlePageChange,
  page,
  totalPages,
}: PaginationProps) {
  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange((page || 1) - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {renderPaginationItems({
          totalPages,
          page,
          handlePageChange,
        })}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange((page || 1) + 1)}
            className={
              (page || 1) === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
