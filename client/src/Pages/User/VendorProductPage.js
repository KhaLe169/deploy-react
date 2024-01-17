import VendorNav from "../../Components/VendorNav";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  FunnelIcon
} from "@heroicons/react/20/solid";
import "../../css/searchresult.css";
import SRProductCard from "../../Components/SRProductCard";
import SRPagination from "../../Components/SRPagination";
import SRPriceRange from "../../Components/SRPriceRange";
import SRStarRating from "../../Components/SRStarRating";
import { useHits, useRefinementList } from "react-instantsearch";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import SortOptions from "../../Components/SortOptions";
import { UserContext } from "../../Context/UserContext";
import LoadingPage from "./LoadingPage";

export default function VendorProductPage() {
  const [follow, setFollow] = useState();
  const [sortOptions, setSortOptions] = useState([
    { label: 'Most Popular', value: 'rBuy_relavant_sort', current: false },
    { label: 'Price: Low to High', value: 'rBuy_price_asc', current: false },
    { label: 'Price: High to Low', value: 'rBuy_price_desc', current: false },
  ]);
  const { refine } = useRefinementList({ attribute: 'owner' });
  const params = useParams()
  const { hits } = useHits();
  const [vendor, setVendor] = useState()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(UserContext)
  const [numberOfProducts, setNumberOfProducts] = useState(0)
  const [numberOfFollowers, setNumberOfFollwers] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:4000/vendor/${params.id}/product`, { withCredentials: true })
      setVendor(res.data.vendor)
      setIsLoading(false)
      setNumberOfFollwers(res.data.numberOfFollowers)
      setNumberOfProducts(res.data.numberOfProducts)
    } catch (error) {
      setError(error)
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchData();
    vendor?.businessName && refine(vendor?.businessName);
  }, [fetchData, refine, vendor?.businessName])

  useEffect(() => {
    fetchData();
  }, [fetchData, follow])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      {error && <Navigate to={"/"} replace />}
      <section>
        {/* <!-- Vendor Profile and Nav section --> */}
        <VendorNav user={user} vendor={vendor} activeTab={"PRODUCTS"} numberOfFollowers={numberOfFollowers} numberOfProducts={numberOfProducts} setNumberOfFollwers={setNumberOfFollwers} follow={follow} setFollow={setFollow} />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              All Products <span class="text-lg">(90)</span>
            </h1>
            <div className="flex items-center">
              <SortOptions sortOptions={sortOptions} setSortOptions={setSortOptions} />
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            <div className="flex">
              <div className="w-[35%] md:pr-16 lg:pr-20">
                {/* Filters */}
                <div className="xs:hidden sm:hidden md:block lg:block wi ">
                  <SRPriceRange />
                  <SRStarRating />
                </div>
              </div>

              <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                {/* Product grid */}
                {hits.map((hit) => (
                  <SRProductCard hit={hit} />
                ))}
              </div>
            </div>
            <SRPagination />
          </section>
        </main>
      </section>
    </>
  );
}
