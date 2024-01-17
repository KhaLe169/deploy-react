import { useCallback, useContext, useEffect, useState } from "react";
import { Rating } from "flowbite-react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import VendorNav from "../../Components/VendorNav";
import axios from "axios";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import LoadingPage from "./LoadingPage";
export default function VendorHomePage() {
  const [follow, setFollow] = useState();
  const params = useParams()
  const [vendor, setVendor] = useState()
  const [numberOfProducts, setNumberOfProducts] = useState(0)
  const [numberOfFollowers, setNumberOfFollwers] = useState(0)
  const { user } = useContext(UserContext)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [trendingProducts, setTrendingProducts] = useState([])

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:4000/vendor/${params.id}`, { withCredentials: true })
      setVendor(res.data.vendor)
      setNumberOfFollwers(res.data.numberOfFollowers)
      setNumberOfProducts(res.data.numberOfProducts)
      setTrendingProducts(res.data.trendingProducts)
      setIsLoading(false)
    } catch (error) {
      setError(error)
    }
  }, [params.id])

  useEffect(() => {
    fetchData();
  }, [fetchData, follow])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      {error && <Navigate to={"/"} replace />}
      <section class="my-5">
        {/* <!-- Vendor Profile and Nav section --> */}
        <VendorNav
          user={user}
          vendor={vendor}
          activeTab={"HOME"}
          coverPhoto={vendor.coverPhoto ? vendor.coverPhoto : ""}
          numberOfFollowers={numberOfFollowers}
          numberOfProducts={numberOfProducts}
          setNumberOfFollwers={setNumberOfFollwers}
          follow={follow}
          setFollow={setFollow}
        />
        {/*  */}
        {/* Top Product */}
        <div className="lg:container md:container lg:px-12 md:px-12 sm:px-14 xs:px-3 mx-auto mb-10 bg-gray-50">
          <div className="lg:py-12 md:py-12 sm:py-8 xs:py-4">
            <h2 className="lg:text-2xl md:text-2xl  sm:xs:text-xl font-bold text-gray-600 mb-8 xs:mb-3 sm:mb-3 ">
              Top Products
            </h2>

            <Swiper
              breakpoints={{
                300: {
                  spaceBetween: 7,
                  slidesPerView: 2,
                },

                576: {
                  spaceBetween: 10,
                  slidesPerView: 2,
                },

                898: {
                  spaceBetween: 20,
                  slidesPerView: 4,
                },
                1200: {
                  spaceBetween: 15,
                  slidesPerView: 5,
                },
                1259: {
                  spaceBetween: 15,
                  slidesPerView: 5,
                },
              }}
            >
              <div className="mt-64">
                {/* Top Product */}
                  {/* Product Card */}
                  {trendingProducts.map((product) => (
                    <SwiperSlide>
                      <div className="bg-white overflow-hidden group rounded-lg shadow-lg dark:border-gray-700 group xs:mx-auto">
                        <div className="relative">
                          <Link
                            className="flex justify-center items-center w-full h-[220px] md:h-[200px] sm:h-[180px] xs:h-[160px] xs:w-3/4 xs:mx-auto"
                            to={`/product/${product._id}`}
                          >
                            <img
                              src={product.image_link}
                              alt=""
                              className="p-4 object-full lg:md:scale-75"
                            />
                          </Link>
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 sm:gap-2 opacity-0 group-hover:opacity-100 transition">
                            <Link
                              to={`/product/${product._id}`}
                              className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2"
                            >
                              <i className="fa-solid fa-magnifying-glass"></i>
                            </Link>
                            <Link
                              to={`/product/${product._id}`}
                              className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2"
                            >
                              <i className="fa-regular fa-heart"></i>
                            </Link>
                          </div>
                        </div>
                        <div className="pt-4 pb-3 px-4">
                          <Link to={`/product/${product._id}`}>
                            <h4
                              className="capitalize font-medium xl:text-md lg:text-[15px] md:text-sm sm:text-sm xs:text-xs mb-1 text-gray-800 hover:text-primary-900 transition line-clamp-2 "
                              href={`/product/${product._id}`}
                            >
                              {" "}
                              {product.product_name}
                            </h4>
                          </Link>
                          <div className="px-1">
                            <div className="flex items-center justify-center">
                              <Rating>
                                <p className="text-md text-gray-500 lg:md:text-[14px] sm:xs:text-[12px] font-medium">
                                  Ratings: {product.ratings}
                                </p>
                                <Rating.Star className="xs:sm:w-3 lg:md:w-4 h-auto ml-1" />
                              </Rating>
                            </div>
                            <p className="lg:md:text-lg sm:xs:text-sm text-red-500 font-semibold mb-2 text-center">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </div>
            </Swiper>
          </div>
        </div>

        {/* <!-- Banner --> */}
        <div class="md:container mx-auto grid grid-cols-4 gap-4">
          {vendor.smallBanner1 && (
            <div class="md:col-span-2 col-span-4">
              <img
                class="object-fill h-full w-full"
                src={vendor.smallBanner1}
                alt=""
              />
            </div>
          )}
          {vendor.smallBanner2 && (
            <div class="md:col-span-2 col-span-4">
              <img
                class="object-fill h-full w-full"
                src={vendor.smallBanner2}
                alt=""
              />
            </div>
          )}

          {vendor.bigBanner && (
            <div class="col-span-4">
              <img
                class="object-fill h-full w-full"
                src={vendor.bigBanner}
                alt=""
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
