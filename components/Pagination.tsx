import React, { useMemo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

const DOTS = '...';

const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
}) => {

    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);
            return [...leftRange, DOTS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }

        return [];

    }, [totalPages, siblingCount, currentPage]);


    if (currentPage === 0 || totalPages < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    return (
        <nav aria-label="Page navigation" className="flex justify-center items-center space-x-2 animate-fade-in">
            <button
                onClick={onPrevious}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 bg-base-100 dark:bg-base-dark-200 hover:bg-base-200 dark:hover:bg-base-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>

            {paginationRange?.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                    return <span key={`${DOTS}-${index}`} className="px-3 py-2 text-sm">...</span>;
                }
                
                const isCurrent = pageNumber === currentPage;
                return (
                    <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber as number)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isCurrent ? 'bg-primary-600 text-white' : 'bg-base-100 dark:bg-base-dark-200 hover:bg-base-200 dark:hover:bg-base-dark-100'}`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                onClick={onNext}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 bg-base-100 dark:bg-base-dark-200 hover:bg-base-200 dark:hover:bg-base-dark-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;
