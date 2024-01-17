import "../../css/mangeorder.css";
import { useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from 'flowbite-react';
import { FiAlertTriangle } from "react-icons/fi";
import { UserContext } from "../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";


export default function ReportedProductPage() {
  const params = useParams()
  const [product, setProduct] = useState()
  const [vendor, setVendor] = useState()
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(UserContext)

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:4000/admin/manage-vendor-product/${params.id}`, { withCredentials: true });
      setIsLoading(false)
      setProduct(res.data.product)
      setVendor(res.data.vendor)
      setReports(res.data.reports)
    } catch (error) {
      setIsLoading(false)
    }
  }, [params])


  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!user || isLoading) {
    return null
  }

  return (
    <>
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
      <section className="max-w-full px-4 sm:px-0 lg:px-8 bg-gray-100 mb-10 pb-5 w-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-hidden">
        <div className="container mx-auto p-5 xs:px-2 xs:py-5">
          {/* <!-- Vendor --> */}
          <ReportedVendorCard vendor={vendor} product={product} reports={reports} />
        </div>
      </section>
    </>
  );
}


function ReportedVendorCard({ vendor, product, reports }) {
  return <>

    <div className="p-6 space-y-6 bg-white rounded-lg shadow my-5 xs:p-4">
      <h1 className="m-2 text-2xl font-bold text-center xs:text-md">
        {(reports.length) ? "Reported" : ""} Product Information
      </h1>
      <div className="flex items-center gap-4 mt-4 xs:gap-3 ">
        {(vendor.img ? <img className="inline-block xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-8 sm:h-8 xs:w-5 xs:h-5 rounded-full object-fit ring-2 ring-white"
          src={`data:image/jpeg;base64,${vendor.img}`}
          alt="avatar_img" /> : <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </div>)}
        <div>
          <h2 className="text-2xl font-semibold mb-2 xs:text-md">{vendor.businessName}</h2>
          <div className="text-md text-gray-500 xs:text-xs">{vendor.email}</div>
          <div className="text-md text-gray-500 mb-2 xs:text-xs">{vendor.phoneNumber}</div>
          <span className="bg-[#000054] text-white text-sm font-medium me-2 px-2.5 py-1 rounded-full">
            {" "}
            <i className="fa-solid fa-shop"></i> Vendor
          </span>
        </div>
      </div>
      <div className="flex items-center mt-3 xs:flex-col xs:items-start">
        <div className="text-md text-black font-medium whitespace-nowrap">Business Address: </div>
        <div className="text-md text-gray-500 mx-2 line-clamp-2 xs:mx-0 xs:text-sm">{vendor.address}</div>
      </div>
      <hr className="my-2" />
      <ReportedTableComponent product={product} reports={reports} />
      {reports.length > 0 && <>
        <hr className="my-2" />
        <h1 className="m-0 font-bold text-sm text-gray-900">Reported information in details </h1>
      </>}
      <div>
        <ReportedProductInfo reports={reports} />
      </div>
    </div>
  </>
}

function ReportedTableComponent({ product, reports }) {
  return (
    <>
      <div>
        <div className="flex sm:flex-col lg:md:flex-row items-center">
          <div className="w-[200px] h-[200px]">
            <img src={product.image_link} alt="product_img" className="object-cover scale-90" />
          </div>
          <div className="ms-6">
            <p className="font-light text-gray-900 text-sm">ProductID: <span className="lg:md:ms-2 sm:ms-0 sm:mb-2 font-medium">{product._id}</span></p>
            <p className="font-light text-gray-900 text-sm">Product name: <span className="ms-2 font-medium">{product.product_name}</span></p>
            <p className="font-light text-gray-900 text-sm">Category: <span className="ms-2 font-medium">{product.category}</span></p>
            <p className="font-light text-gray-900 text-sm">Price: <span className="ms-8 font-medium">${product.price}</span></p>
            <p className="font-light text-gray-900 text-sm">Rating: <span className="ms-6 font-medium">{product.ratings} stars</span></p>
            <p className="font-light text-gray-900 text-sm">Status: <span className={reports.length > 0 ? "ms-7 font-medium text-red-500" : "ms-7 font-medium"}> {(reports.length > 0) ? "Reported" : "No report"}</span></p>
          </div>
        </div>
        <DeleteButtonPopup product={product} />
      </div >
    </>
  );
}

function ReportedProductInfo({ reports }) {
  return (
    <>
      <div className="container mx-auto">
        <div>
          {reports.map(report => {
            const date = new Date(report.date)
            const formtatedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <div className="flex py-5">
                <div className="relative inline-block shrink-0">
                  {report.user.img ? <img className="inline-block xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-8 sm:h-8 xs:w-5 xs:h-5 rounded-full object-fit ring-2 ring-white"
                    src={`data:image/jpeg;base64,${report.user.img}`}
                    alt="avatar_img" /> : <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                  </div>}
                </div>
                <div className="ms-3 text-sm font-normal">
                  <div className="text-md font-semibold text-gray-900">
                    {report.user.name}
                  </div>
                  <div className="text-xs font-light mb-2">
                    {report.user.email}
                  </div>
                  <div className="text-sm font-semibold text-red-600 mt-2">
                    {report.title}
                  </div>
                  <div className="text-sm font-normal text-gray-900 my-3">
                    {report.description}
                  </div>
                  <div className="text-sm text-gray-600 mt-3">{formtatedDate}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}

function DeleteButtonPopup({ product }) {
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const notify = (error) => {
    toast.error(error, {
      position: "top-center",
      autoClose: 200,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      pauseOnHover: false,
      theme: "light",
    });
  }

  const success = (success) => {
    toast.success(success, {
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

  const handleDelete = async () => {
    const apiUrl = `http://localhost:4000/delete-product/${product._id}`;
    try {
      await axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        setMsg(res.data)
        setError('')
        setTimeout(() => {
          window.location.href = "/admin/manage-product"
        }, 2500)
      })
        .catch(er => { setError(er.response.data); setMsg() });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    error && notify(error)
    msg && success(msg)
  }, [error, msg]);

  return (
    <>
      <div className="flex justify-end">
        <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm lg:md:px-5 sm:px-3 sm:py-2 py-2.5 me-2 mb-4" onClick={() => setOpenModal(true)}>Delete</button>
      </div>

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <FiAlertTriangle className="mx-auto mb-2 h-10 w-10 text-[#FAC800]" />
            <h3 className="mb-5 text-lg font-normal text-gray-900">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => { setOpenModal(false); handleDelete() }}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => { setOpenModal(false) }}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
