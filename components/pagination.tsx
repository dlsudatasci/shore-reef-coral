import { HTMLAttributes } from "react";
import { Table } from '@tanstack/react-table';
import cn from 'classnames';

type PaginationProps = {
  table: Table<any>;
	variant?: 'primary' | 'secondary';
} & HTMLAttributes<HTMLDivElement>;

export function Pagination({ table, variant = "primary" }: PaginationProps) {
  const {
    getState,
    getPageCount,
    setPageIndex,
    nextPage,
    previousPage,
    getCanNextPage,
    getCanPreviousPage,
  } = table;
  
  const { pageIndex } = getState().pagination;

  const pageCount = getPageCount();
  const pages = [];

  // Generate page numbers
  for (let i = 0; i < pageCount; i++) {
    if (i === 0 || i === pageCount - 1 || (i >= pageIndex - 3 && i <= pageIndex + 3)) {
      pages.push(i + 1);
    } else if (i === pageIndex - 4 || i === pageIndex + 4) {
      pages.push('...');
    }
  }

  return (
    <div className="pagination w-full flex flex-row justify-center mt-4">
      <button
        onClick={() => previousPage()}
        disabled={!getCanPreviousPage()}
				className={cn('mr-2', {
						'text-primary': variant === "primary",
						'text-secondary': variant === "secondary",
					}
				)}
      >
        {'<'}
      </button>
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => page !== '...' && setPageIndex(+page - 1)}
          disabled={page === '...'}
          className={cn('px-2 mx-0.5 rounded', 
						{
            	'text-primary bg-highlight': pageIndex + 1 === page,
							'text-t-highlight': variant === 'primary' && pageIndex + 1 !== page,
							'text-secondary': variant === 'secondary' && pageIndex + 1 !== page
          	}
					)}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => nextPage()}
        disabled={!getCanNextPage()}
				className={cn('ml-2', {
						'text-primary': variant === "primary",
						'text-secondary': variant === "secondary",
					}
				)}
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;