import { useCallback, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify'
import { Button, Modal } from 'flowbite-react';
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import Pagination from "../../Components/Pagination";

export default function VendorMyProduct() {
  const [products, setProducts] = useState([])
  const [dataSlice, setDataSlice] = useState([])
  const { user } = useContext(UserContext)
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')


  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get(`http://localhost:4000/manage-product?product_name=${productName}&category=${category}`, { withCredentials: true });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    handleSearch(e); // Update the searchTerm state with the current input value
  };

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/manage-product?product_name=${productName}&category=${category}`, { withCredentials: true });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [productName, category]);

  useEffect(() => {
    setDataSlice(products.slice(0, 10));
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!user) {
    return null;
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
      <div class="max-w-full px-4 sm:px-6 lg:px-8 bg-gray-100 mb-10 pb-5 w-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-hidden  ">
        <div className="container mx-auto my-8 px-4 rounded-lg bg-white shadow p-4">
          <div className="mb-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label for="product-name" className="block text-sm">Product Name</label>
                    <input onChange={(e) => setProductName(e.target.value)} type="text" id="product-name" name="product-name" placeholder="Please input at least 2 characters or words" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    <p className="text-xs text-gray-400"></p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label for="category" className="block text-sm">Category</label>
                    <input onChange={(e) => setCategory(e.target.value)} type="text" id="category" name="category" placeholder="Category" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Search</button>
                <button type="reset" className=" border-solid border-2 hover:bg-gray-100 ml-2 px-3 py-1 rounded-md ">Reset</button>
              </div>
            </form>
          </div>
        </div>


        <div class="container mx-auto my-8 px-4 rounded-lg bg-white shadow p-4 mb-4">
          <div class="mb-4 flex justify-between items-center" />
          <div class="relative overflow-x-auto sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Stock
                  </th>
                  <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataSlice.map((product) => (
                  <tr key={product._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    {/* ... Table data goes here ... */}
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {product.product_name}
                    </td>
                    <td className="px-6 py-4">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a href={`/edit-product/${product._id}`} className="font-medium pr-4 text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                      <DeleteButtonPopup productId={product._id} setProducts={setProducts} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {Math.floor(products.length / 10) >= 1 && <Pagination pages={Math.ceil(products.length / 10)} setDataSlice={setDataSlice} data={products} />}
        </div>
      </div>
    </>
  )
}

function DeleteButtonPopup({ productId, setProducts }) {
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
    const apiUrl = `http://localhost:4000/delete-product/${productId}`;
    try {
      await axios.delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        setMsg(res.data)
        setError('')
        setProducts(prev => prev.filter(product => product._id !== productId));
      })
        .catch(er => { setError(er.response.data); setMsg() });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    error && notify(error)
    msg && success(msg)
  }, [error, msg]);

  return (
    <>
      <span className="font-medium text-[#E61E2A] hover:underline" onClick={() => setOpenModal(true)}>
        Delete
      </span>
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