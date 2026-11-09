interface DocumentsTablePaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
}

const DocumentsTablePagination = ({
  pagination,
  onPageChange,
}: DocumentsTablePaginationProps) => {
  const {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total} documents
      </p>

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {getVisiblePages().map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-9 cursor-pointer rounded-md border px-3 py-1.5 text-sm ${
                pageNumber === page
                  ? "border-primary bg-primary text-white"
                  : "border-border hover:bg-muted"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DocumentsTablePagination;
