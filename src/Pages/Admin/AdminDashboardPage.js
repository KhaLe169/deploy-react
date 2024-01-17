"use client";
import AdminInsight from "../../Components/AdminInsight";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from 'flowbite-react';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { ToastContainer, toast } from 'react-toastify'

export default function DashboardPage() {
  const { user } = useContext(UserContext)
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfVendors, setNumberOfVendors] = useState(0);
  const [numberOfShippers, setNumberOfShippers] = useState(0);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [bigCarousel, setBigCarousel] = useState();
  const [smallCarousel, setSmallCarousel] = useState();
  const [error, setError] = useState();
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false);

  const handleBigCarouselChange = (event) => {
    setBigCarousel(event.target.files);
  };

  const handleSmallCarouselChange = (event) => {
    setSmallCarousel(event.target.files);
  };

  const success = (msg) => {
    toast.success(msg, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const notify = (error) => {
    toast.error(error, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      pauseOnHover: false,
      theme: "light",
    });
  }

  async function uploadHomepageCarousel(title, files) {
    if (!files) return;
    setLoading(true);
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }
    fd.append('title', title);
    await axios.post("http://localhost:4000/upload-homepage-carousel", fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      .then(res => {
        setMsg(res.data)
        setError('')
        setLoading(false)
      })
      .catch(er => { setError(er.response.data); setMsg() });
  }


  const handleSubmit = (title, files) => async (e) => {
    e.preventDefault()
    uploadHomepageCarousel(title, files)
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/dashboard", {
        withCredentials: true,
      });
      setNumberOfUsers(res.data.numberOfUsers);
      setNumberOfVendors(res.data.numberOfVendors);
      setNumberOfShippers(res.data.numberOfShippers);
      setNumberOfProducts(res.data.numberOfProducts);
    } catch (error) {
      setError(error);
    }
  }, []);

  const [bigImages, setBigImages] = useState();
  const [smallImages, setSmallImages] = useState();
  const fetchImages = async () => {
    try {
      await axios.get("http://localhost:4000/slider", { withCredentials: true })
        .then(res => setBigImages(res.data.images))
      await axios.get("http://localhost:4000/middle-banner", { withCredentials: true }).then(res => setSmallImages(res.data.images))
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (error) {
      notify(error);
    }
    if (msg) {
      success(msg);
    }
  }, [error, msg]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!user) {
    return null;
  }

  return (
    <>
      {user === null && <Navigate to={"/"} replace />}
      {error && <Navigate to={"/"} replace />}
      <link
        rel="stylesheet"
        href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
      />
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div class="max-w-full mb-10 pb-5 lg:md:w-full w-5/6 overflow:hidden">
        <div className="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-gray-100 mb-10 px-4">
          <h1 class="font-bold  lg:pl-5  uppercase text-black text-2xl  pt-10 ">
            Homepage Decoration
          </h1>
          <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-base mb-3">
            Upload real, high resolution, clear product images. You should
            choose images with 1:1 resolution
          </h1>
          <h1 class="font-bold  lg:pl-5  uppercase text-2xl text-gray-700  pt-10 mb-2">
            1. Carousel
          </h1>
          <div className="grid grid-cols-1">
            <div className="h-80 ">
              {!bigCarousel && (
                <Carousel leftControl={
                  <ArrowLeft />
                }
                  rightControl={
                    <ArrowRight />
                  }
                >
                  {bigImages && bigImages.map((image, index) => (
                    <div key={index}>
                      <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-xl  mb-3">
                        Carousel #{index + 1}
                      </h1>
                      {/* <div>
                      <img
                        src={require("../../Components/images/banner1.jpg")}
                        alt="banner"
                        class="bg-center bg-no-repeat bg-gray-700 bg-blend-multiply"
                      />
                    </div> */}
                      <div
                        id="image-preview"
                        class="max-w-full h-64 p-6 mb-4 bg-gray-700 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer object-fit bg-cover bg-center bg-no-repeat bg-blend-multiply"
                        style={{ backgroundImage: `url(${image})` }}
                      >
                        <input onChange={handleBigCarouselChange}
                          id="upload"
                          type="file"
                          class="hidden"
                          accept="image/*"
                          required
                        />
                        <label for="upload" class="cursor-pointer">
                          <div class="font-extrabold tracking-tight leading-none text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-8 h-8 mx-auto mb-4"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                            <h5 class="mb-2 text-xl">Upload Cover Image</h5>
                            <p class="font-normal text-sm md:px-6">
                              You should choose photo size with{" "}
                              <b class="italic ...">height {">"} 950px</b> and{" "}
                              <b class="italic ...">width {"<"} 300px</b>
                            </p>
                            <p class="font-normal text-sm md:px-6">
                              and must be in{" "}
                              <b class="italic ...">JPG, PNG, or GIF</b> format.
                            </p>
                            <span
                              id="filename"
                              class="text-gray-500 bg-gray-200 z-50"
                            ></span>
                          </div>
                        </label>
                      </div>
                    </div>))}
                </Carousel>
              )}
              {bigCarousel && (
                <Carousel leftControl={
                  <ArrowLeft />
                }
                  rightControl={
                    <ArrowRight />
                  }
                >
                  {Array.from(bigCarousel).map((file, index) => (
                    <div key={index}>
                      <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-xl  mb-3">
                        Carousel #{index + 1}
                      </h1>
                      {/* <div>
                    <img
                      src={require("../../Components/images/banner1.jpg")}
                      alt="banner"
                      class="bg-center bg-no-repeat bg-gray-700 bg-blend-multiply"
                    />
                  </div> */}
                      <div
                        id="image-preview"
                        class="max-w-full h-64 p-6 mb-4 bg-gray-700 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer object-fit bg-cover bg-center bg-no-repeat bg-blend-multiply"
                        style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
                      >
                        <input onChange={handleBigCarouselChange}
                          id="upload"
                          type="file"
                          class="hidden"
                          accept="image/*"
                          required
                        />
                        <label for="upload" class="cursor-pointer">
                          <div class="font-extrabold tracking-tight leading-none text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-8 h-8 mx-auto mb-4"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                            <h5 class="mb-2 text-xl">Upload Cover Image</h5>
                            <p class="font-normal text-sm md:px-6">
                              You should choose photo size with{" "}
                              <b class="italic ...">height {">"} 950px</b> and{" "}
                              <b class="italic ...">width {"<"} 300px</b>
                            </p>
                            <p class="font-normal text-sm md:px-6">
                              and must be in{" "}
                              <b class="italic ...">JPG, PNG, or GIF</b> format.
                            </p>
                            <span
                              id="filename"
                              class="text-gray-500 bg-gray-200 z-50"
                            ></span>
                          </div>
                        </label>
                      </div>
                    </div>))}
                </Carousel>
              )}
            </div>
          </div>
          <button
            onClick={handleSubmit("Big Banner", bigCarousel)}
            disabled={loading}
            type="submit"
            class={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 text-white"
              }`}
          >Save
          </button>

          <div className="pb-8">
            <h1 class="font-bold  lg:pl-5  uppercase text-2xl text-gray-700 pt-10 mb-2">
              2. Banner
            </h1>
            <div className="flex grid-cols-2 gap-x-4 xs:overflow-y divide-x-2 xl:grid lg:grid md:grid sm:flex-col xs:flex-col ">
              {!smallCarousel && (
                <Carousel leftControl={
                  <ArrowLeft />
                }
                  rightControl={
                    <ArrowRight />
                  }
                >
                  {smallImages && smallImages.map((image, index) =>
                    <div key={index}>
                      <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-xl  mb-3">
                        Carousel #{index + 1}
                      </h1>
                      <div
                        id="image-preview"
                        class="max-w-full h-64 p-6 mb-4 bg-gray-700 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer object-fit bg-cover bg-center bg-no-repeat bg-blend-multiply"
                        style={{ backgroundImage: `url(${image})` }}
                      >
                        <input onChange={handleSmallCarouselChange}
                          id="smallCarousel"
                          type="file"
                          class="hidden"
                          accept="image/*"
                          required multiple
                        />
                        <label for="smallCarousel" class="cursor-pointer">
                          <div class="font-extrabold tracking-tight leading-none text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-8 h-8 mx-auto mb-4"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                            <h5 class="mb-2 text-xl">Upload Cover Image</h5>
                            <p class="font-normal text-sm md:px-6">
                              You should choose photo size with{" "}
                              <b class="italic ...">height {">"} 950px</b> and{" "}
                              <b class="italic ...">width {"<"} 300px</b>
                            </p>
                            <p class="font-normal text-sm md:px-6">
                              and must be in{" "}
                              <b class="italic ...">JPG, PNG, or GIF</b> format.
                            </p>
                            <span
                              id="filename"
                              class="text-gray-500 bg-gray-200 z-50"
                            ></span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </Carousel>
              )}
              {smallCarousel && (
                <div>
                  <Carousel leftControl={
                    <ArrowLeft />
                  }
                    rightControl={
                      <ArrowRight />
                    }
                  >
                    {Array.from(smallCarousel).map((file, index) => (
                      <div key={index}>
                        <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-xl  mb-3">
                          Carousel #{index + 1}
                        </h1>
                        {/* <div>
                    <img
                      src={require("../../Components/images/banner1.jpg")}
                      alt="banner"
                      class="bg-center bg-no-repeat bg-gray-700 bg-blend-multiply"
                    />
                  </div> */}
                        <div
                          id="image-preview"
                          class="max-w-full h-64 p-6 mb-4 bg-gray-700 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer object-fit bg-cover bg-center bg-no-repeat bg-blend-multiply"
                          style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
                        >
                          <input onChange={handleSmallCarouselChange}
                            id="smallCarousel"
                            type="file"
                            class="hidden"
                            accept="image/*"
                            multiple
                          />
                          <label for="smallCarousel" class="cursor-pointer">
                            <div class="font-extrabold tracking-tight leading-none text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-8 h-8 mx-auto mb-4"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                />
                              </svg>
                              <h5 class="mb-2 text-xl">Upload Cover Image</h5>
                              <p class="font-normal text-sm md:px-6">
                                You should choose photo size with{" "}
                                <b class="italic ...">height {">"} 950px</b> and{" "}
                                <b class="italic ...">width {"<"} 300px</b>
                              </p>
                              <p class="font-normal text-sm md:px-6">
                                and must be in{" "}
                                <b class="italic ...">JPG, PNG, or GIF</b> format.
                              </p>
                              <span
                                id="filename"
                                class="text-gray-500 bg-gray-200 z-50"
                              ></span>
                            </div>
                          </label>
                        </div>
                      </div>))}
                  </Carousel>
                  <button
                    onClick={handleSubmit("Small Carousel", smallCarousel)}
                    disabled={loading}
                    type="submit"
                    class={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 text-white"
                      }`}
                  > Save
                  </button>
                </div>
              )}


              <div className="bg-white grid grid-cols-3 gap-x-4 px-4 py-6">
                <div className="flex items-center flex-col group cursor-pointer overflow-hidden">
                  <img
                    src={require("../../Components/images/tv.avif")}
                    alt="tv"
                    className="w-[100px] h-[100px] object-fit transition duration-300 group-hover:-translate-y-1 scale-95"
                    style={{ transformOrigin: "center center" }}
                  />
                  <div
                    className="transition duration-300 group-hover:-translate-y-1 mt-2 "
                    style={{ transformOrigin: "center center" }}
                  >
                    {" "}
                    Household Appliances
                  </div>
                </div>

                <div className="flex items-center flex-col group cursor-pointer overflow-hidden">
                  <img
                    src={require("../../Components/images/laptop.jpg")}
                    alt="tv"
                    className="w-[100px] h-[100px] object-fit transition duration-300 group-hover:-translate-y-1 scale-95"
                    style={{ transformOrigin: "center center" }}
                  />
                  <div
                    className="transition duration-300 group-hover:-translate-y-1 mt-2 "
                    style={{ transformOrigin: "center center" }}
                  >
                    {" "}
                    Electronics
                  </div>
                </div>

                <div className="flex items-center flex-col group cursor-pointer overflow-hidden">
                  <img
                    src={require("../../Components/images/fashion.jpg")}
                    alt="tv"
                    className="w-[100px] h-[100px] object-fit transition duration-300 group-hover:-translate-y-1 scale-95"
                    style={{ transformOrigin: "center center" }}
                  />
                  <div
                    className="transition duration-300 group-hover:-translate-y-1 mt-2 "
                    style={{ transformOrigin: "center center" }}
                  >
                    {" "}
                    Fashion
                  </div>
                </div>

                <div className="flex items-center flex-col group cursor-pointer overflow-hidden">
                  <img
                    src={require("../../Components/images/game.jpg")}
                    alt="tv"
                    className="w-[100px] h-[100px] object-fit transition duration-300 group-hover:-translate-y-1 scale-95"
                    style={{ transformOrigin: "center center" }}
                  />
                  <div
                    className="transition duration-300 group-hover:-translate-y-1 mt-2 "
                    style={{ transformOrigin: "center center" }}
                  >
                    {" "}
                    Toys & Game
                  </div>
                </div>

                <div className="flex items-center flex-col group cursor-pointer overflow-hidden">
                  <img
                    src={require("../../Components/images/beauty.jpg")}
                    alt="tv"
                    className="w-[100px] h-[100px] object-fit transition duration-300 group-hover:-translate-y-1 scale-95"
                    style={{ transformOrigin: "center center" }}
                  />
                  <div
                    className="transition duration-300 group-hover:-translate-y-1 mt-2 "
                    style={{ transformOrigin: "center center" }}
                  >
                    {" "}
                    Beauty & Personal Care
                  </div>
                </div>

                <div className="flex items-center flex-col group cursor-pointer overflow-hidden">
                  <img
                    src={require("../../Components/images/enter.jpg")}
                    alt="tv"
                    className="w-[100px] h-[100px] object-fit transition duration-300 group-hover:-translate-y-1 scale-95"
                    style={{ transformOrigin: "center center" }}
                  />
                  <div
                    className="transition duration-300 group-hover:-translate-y-1 mt-2 "
                    style={{ transformOrigin: "center center" }}
                  >
                    {" "}
                    Entertainment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-gray-100 mb-10 px-4 pt-10 pb-20">
          <div id="content" class="">
            <h1 class="font-bold  lg:pl-5 lg:pt-4 uppercase text-black text-2xl ">
              Admin Insight
            </h1>
            <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-base mb-3">
              Critical business priorities encompass operational efficiency,
              market dynamics, and customer engagement
            </h1>
            <AdminInsight
              numbersOfUser={numberOfUsers}
              numbersOfVendors={numberOfVendors}
              numbersOfShippers={numberOfShippers}
              numbersOfProducts={numberOfProducts}
            />
            <div id="last-users"></div>
          </div>
        </div>
      </div >
    </>
  );
}
