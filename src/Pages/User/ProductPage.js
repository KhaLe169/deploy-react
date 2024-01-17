import "swiper/css";
import { Link, Navigate, useParams } from "react-router-dom"
import { useState, useEffect, useCallback, useContext } from 'react'
import axios from "axios"
import recommend from '@algolia/recommend';
import { useRelatedProducts } from '@algolia/recommend-react'
import RelatedProduct from "../../Components/RelatedProduct";
import CustomerReview from '../../Components/CustomerReview';
import ProductDetailCard from "../../Components/ProductDetailCard";
import ProductDetailComment from "../../Components/ProductDetailComment";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";
import { MessagesSquare, Store } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import LoadingPage from "./LoadingPage";
const recommendClient = recommend('DN0WBRQ8A3', '329a2a4f7a299b7d02bbc2fbd6d1da55');
const indexName = 'rBuy';

export default function TestingPage() {
  const [comments, setComments] = useState([]);
  const params = useParams()
  const [product, setProduct] = useState([])
  const [vendorName, setVendorName] = useState("")
  const [numberOfFollowers, setNumberOfFollowers] = useState(0)
  const [error, setError] = useState()
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  const { recommendations } = useRelatedProducts({
    recommendClient,
    indexName,
    objectIDs: [params.id],
    maxRecommendations: 30
  });

  const createThread = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/chat", { vendorId: product.owner }, { withCredentials: true });
      localStorage.setItem("threadId", res.data.thread._id);
      window.location.href = "/chat";
    } catch (error) {
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:4000/product/${params.id}`, { withCredentials: true });
      setProduct(res.data.product);
      setVendorName(res.data.vendorName);
      setNumberOfFollowers(res.data.numberOfFollowers);
      setIsLoading(false)
    } catch (error) {
      setError(error);
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchData()
  }, [fetchData, comments])

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      {error && <Navigate to={"/"} replace />}
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
      <section className="text-gray-600 body-font overflow-hidden ">
        <div className="lg:container md:container py-12 px-12 mx-auto mt-10 bg-slate-50 ">
          {/* product card */}
          <ProductDetailCard product={product} vendorName={vendorName} user={user} />
        </div>
      </section>
      <section className="lg:container md:container lg:px-12 md:px-12 sm:px-14 xs:px-3 mx-auto mb-10 mt-10 bg-gray-50">
        <div class="flex xs:sm:flex-col lg:md:flex-row items-center text-gray-800 ">
          <div className="flex flex-row my-8 w-full lg:w-3/5 items-center mx-auto lg:md:justify-normal sm:xs:justify-center">
            <img className="w-20 h-20" src="https://t4.ftcdn.net/jpg/04/08/24/43/360_F_408244382_Ex6k7k8XYzTbiXLNJgIL8gssebpLLBZQ.jpg" alt="" />
            <div className="ml-4">
              <div className="font-semibold lg:md:text-3xl xs:sm:text-2xl mb-2">{vendorName}</div>
              <div className="flex">
                <button class=" mr-2.5 text-md font-normal text-gray-900 bg-white rounded  border-gray-400 hover:bg-gray-200  inline-flex items-center py-0.5 px-2 border  hover:border-transparent  ">
                  <MessagesSquare size={21} />
                  <div className="ml-1.5 "
                    onClick={(e) => createThread(e)}
                  >Chat Now</div>
                </button>
                <button class="ml-1 text-md font-normal text-gray-900 bg-white rounded  border-gray-400 hover:bg-gray-200    inline-flex items-center py-0.5 px-2 border  hover:border-transparent  ">
                  <Store size={20} />
                  <Link to={`/vendor/${product.owner}/home`} className="ml-1.5">View Shop</Link>
                </button>
              </div>
            </div>
          </div>
          <div class="text-center lg:mb-0 xs:sm:md:mb-10 ">
            <div class="grid grid-cols-12 gap-4 place-content-between">
              <div class="col-span-12 sm:col-span-6 md:col-span-3">
                <div class="">
                  <div class="flex lg:flex-col  ml-4">
                    <div class="text-lg text-gray-500 ">Follower(s)</div>
                    <div class="font-semibold text-lg sm:ml-2">{numberOfFollowers}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="lg:container md:container mx-auto ">
        <div className="lg:container md:container lg:px-9 md:px-9 sm:px-3 xs:px-4 mx-auto mt-10 bg-gray-50 lg:flex ">
          {/*Comment section */}
          <ProductDetailComment product={product} setComments={setComments} user={user}/>
          <div className="flex flex-col">
            {/* comment  */}
            <CustomerReview product={product} comments={comments} setComments={setComments} />
          </div>
        </div>
      </section>
      <div className="lg:container md:container lg:px-12 md:px-12 sm:px-14 xs:px-3 mx-auto mb-10 mt-10 bg-gray-50">
        <div className="lg:py-12 md:py-12 sm:py-8 xs:py-4">
          <h2 className="lg:text-2xl md:text-2xl  sm:xs:text-xl font-bold text-gray-600 mb-8 xs:mb-3 sm:mb-3 ">
            Customers also purchased
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
              {/* Realated Product */}
              {!error && recommendations.map(recommendation => (
                <SwiperSlide>
                  <RelatedProduct item={recommendation} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>
    </>
  );
}