import { usePagination } from 'react-instantsearch';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/20/solid";


export default function Example() {
  const {
    pages,
    currentRefinement,
    nbPages,
    refine,
  } = usePagination();
  const previousPageIndex = (currentRefinement - 1) > 0 ? currentRefinement - 1 : 0;
  const nextPageIndex = (currentRefinement + 1) === nbPages ? currentRefinement : currentRefinement + 1;
  const lastPageIndex = nbPages - 1;
  const firstPageIndex = 0;
  return (
    <div className="flex items-center mt-5">
      <div className="xs:flex xs:flex-1 xs:justify-end sm:flex sm:flex-1 sm:items-center sm:justify-end lg:justify-end">
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">

            <span
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" onClick={() => { refine(firstPageIndex) }}/>
            </span>

            <span
              href="#"
              className="relative inline-flex items-center  px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => { refine(previousPageIndex) }}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </span>


            {pages.map((page) => (
              <span
                key={page}
                className={(page === currentRefinement) ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "relative items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"}
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  refine(page);
                }}>
                {page + 1}
              </span>
            ))}
            <span
              href="#"
              className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={() => { refine(nextPageIndex) }}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </span>

            <span
              className="relative inline-flex rounded-r-md items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" onClick={() => { refine(lastPageIndex) }} />
            </span>
          </nav>
        </div>
      </div>
    </div>
  )
}