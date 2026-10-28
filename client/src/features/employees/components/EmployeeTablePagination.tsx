interface EmployeeTablePaginationProps {
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

const EmployeeTablePagination = ({
  pagination,
  onPageChange,
}: EmployeeTablePaginationProps) => {
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

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total} employees
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

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-9 rounded-md border px-3 py-1.5 text-sm cursor-pointer ${
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

export default EmployeeTablePagination;
