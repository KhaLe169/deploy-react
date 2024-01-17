import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function Pagination({ pages, setDataSlice, data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const maxPageNumbersToShow = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setDataSlice(data.slice((pageNumber - 1) * 10, pageNumber * 10))
    };

    const getPaginationNumbers = () => {
        const numbers = [];
        let start = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
        let end = Math.min(pages, start + maxPageNumbersToShow - 1);
        if (currentPage <= Math.floor(maxPageNumbersToShow / 2)) {
            end = Math.min(pages, maxPageNumbersToShow);
        }
        if (currentPage > pages - Math.floor(maxPageNumbersToShow / 2)) {
            start = Math.max(1, pages - maxPageNumbersToShow + 1);
        }
        for (let i = start; i <= end; i++) {
            numbers.push(i);
        }
        return numbers;
    };

    return (
        <div className="flex items-center justify-end mt-5 w-full">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                {pages > 1 &&
                    <>
                        <span
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => handlePageChange(1)}
                        >
                            <span className="sr-only">First page</span>
                            <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span
                            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => { (currentPage - 1) > 0 && handlePageChange(currentPage - 1) }}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </span>

                        {getPaginationNumbers().map((pageNumber) => (
                            <span
                                key={pageNumber}
                                className={(pageNumber === currentPage) ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "relative items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    handlePageChange(pageNumber);
                                    setDataSlice(data.slice((pageNumber - 1) * 10, pageNumber * 10))
                                }}>
                                {pageNumber}
                            </span>
                        ))}
                        <span
                            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => { (currentPage + 1) <= pages && handlePageChange(currentPage + 1) }}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span
                            className="relative inline-flex rounded-r-md items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => handlePageChange(pages)}
                        >
                            <span className="sr-only">Last page</span>
                            <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    </>
                }
            </nav>
        </div>
    )
}