import { useContext, useEffect, useRef, useState } from 'react'
import { FaTimes } from "react-icons/fa";
import { FunnelIcon } from '@heroicons/react/20/solid'
import '../../css/searchresult.css';
import SRProductCard from '../../Components/SRProductCard'
import SRPagination from '../../Components/SRPagination'
import SRPriceRange from '../../Components/SRPriceRange'
import SRStarRating from '../../Components/SRStarRating'
import { useHits, useRefinementList } from 'react-instantsearch';
import { useParams } from 'react-router-dom';
import SortOptions from '../../Components/SortOptions';
import { UserContext } from '../../Context/UserContext';
import { ToastContainer } from 'react-toastify';

export default function Example() {
  const { hits, sendEvent } = useHits();
  const { user } = useContext(UserContext)
  const { refine, items } = useRefinementList({ attribute: 'category', operator: 'or' });
  const [valueFilter, setValueFilter] = useState([]);
  const [sortOptions, setSortOptions] = useState([
    { label: 'Most Popular', value: 'rBuy_relavant_sort', current: false },
    { label: 'Price: Low to High', value: 'rBuy_price_asc', current: false },
    { label: 'Price: High to Low', value: 'rBuy_price_desc', current: false },
  ]);
  const { query } = useParams();
  const { category } = useParams();
  const oldCategoryRef = useRef();
  const [searchQuery, setSearchQuery] = useState((query.split('='))[1]);

  useEffect(() => {
    setSearchQuery((query.split('='))[1]);
    if (items.length > 0) {
      setValueFilter(items.map(item => ({
        value: item.label,
        label: item.label,
        isRefined: item.isRefined,
      })));
    }
  }, [query, items]);

  useEffect(() => {
    if ((category.split('='))[1]) {
      if (oldCategoryRef.current) {
        // Refine with old state
        refine((oldCategoryRef.current.split('='))[1]);
      }

      // reset the refine 
      valueFilter.filter(option => option.isRefined && (!oldCategoryRef.current || option.value !== (oldCategoryRef.current.split('='))[1])).forEach(option => refine(option.value));

      // Refine with new state
      refine((category.split('='))[1]);
      // Update the old state
      oldCategoryRef.current = category;
    }
  }, [category, refine]);

  return (
    <div className="bg-gray-100">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div>
        {/* Mobile filter dialog */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 xs:text-lg">Search result for <span className='text-[#E61E2A] font-light xs:text-md'>"{searchQuery}"</span></h1>

            <div className="flex items-center ">
              <SortOptions sortOptions={sortOptions} setSortOptions={setSortOptions} />
              <FilterSideBar setValueFilter={setValueFilter} valueFilter={valueFilter} refine={refine} oldCategoryRef={oldCategoryRef} />
            </div>

          </div>

          {/* Normal Screen */}
          <section aria-labelledby="products-heading" className="pb-24 pt-6 " >
            <div className="xl:justify-start xl:gap-6 xl:flex lg:flex lg:justify-start lg:gap-6 md:flex sm:block">
              <div className='w-1/4 '>
                {/* Filters */}
                <div className="xs:hidden sm:hidden md:block lg:block wi shadow-lg">
                  <SRPriceRange />
                  <SRStarRating />
                  <CheckboxLabel setValueFilter={setValueFilter} valueFilter={valueFilter} refine={refine} oldCategoryRef={oldCategoryRef} />
                </div>
              </div>

              {hits.length > 0 ? <div className='xl:w-3/4 lg:w-3/4 grid xs:grid-cols-2 xs:gap-x-2 xs:gap-y-4 sm:grid-cols-4 sm:gap-x-2 sm:gap-y-4 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8'>
                {/* Product grid */}
                {hits.map(hit => (
                  <SRProductCard hit={hit} user={user} sendEvent={sendEvent} />
                ))}
              </div> : <div className='mx-auto items-center my-auto'>
                <div className='w-full mx-auto flex flex-col justify-center items-center border border-gray-100'>
                  <img src={require("../../Components/images/no_products.png")} className="object-cover" alt='no product found' />
                  <span className='font-bold text-5xl text-red-700 mb-5'>Oops!</span>
                  <span className='font-semibold text-4xl'>No Product Found</span>
                </div>
              </div>}
            </div>
            <SRPagination />
          </section>
        </main>
      </div>
    </div>
  )
}

function CheckboxLabel({ setValueFilter, valueFilter, refine, oldCategoryRef }) {
  const handleItemClick = (value) => {
    if (oldCategoryRef.current && value === (oldCategoryRef.current.split('='))[1]) { oldCategoryRef.current = null; }
    refine(value)
    setValueFilter(valueFilter.map(option => option.value === value ? { ...option, isRefined: !option.isRefined } : option));
  }

  return (
    <div className='flex px-6 border border-gray-50 py-6 bg-white'>
      <div className='w-full'>
        <h3 className='font-medium mb-2'>Categories</h3>
        {valueFilter.map(option => (
          <div className='mb-2 flex items-center'>
            <input type="checkbox" className='rounded-md' onClick={() => handleItemClick(option.value)} checked={option.isRefined} />
            <span className='ml-2 text-sm'>{option.label}</span>
          </div>
        ))}
      </div>
    </div>

  );
}

function FilterSideBar({ setValueFilter, valueFilter, refine, oldCategoryRef }) {
  const [open, setOpen] = useState(false);

  const handleFilterSidebar = () => {
    setOpen((open) => !open)
  };

  const handleCloseSidebar = () => {
    setOpen(false);
  };

  return (
    <div className="flex">
      <button
        type="button"
        className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 xs:ml-4 sm:ml-4 md:ml-4 lg:hidden  xl:hidden items-center justify-center "
        onClick={handleFilterSidebar}
      >
        {open.current ? (
          <span className="sr-only">Close</span>
        ) : (
          <FunnelIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* mobile menu */}
      <div className={open ? "relative inset-0 z-50 overflow-hidden" : "relative inset-0 z-50 overflow-hidden hidden"}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 pl-5 max-w-full flex">
            <div className="w-screen max-w-2xs">
              <div className="h-full bg-white border-l border-gray-200 py-16">
                {/* Sidebar content */}
                <button
                  type="button"
                  className="absolute top-0 right-0 p-4 text-gray-400 hover:text-gray-500"
                  onClick={handleCloseSidebar}
                >
                  <FaTimes className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </button>
                <div>
                  <SRPriceRange />
                  <SRStarRating />
                  <CheckboxLabel setValueFilter={setValueFilter} valueFilter={valueFilter} refine={refine} oldCategoryRef={oldCategoryRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





