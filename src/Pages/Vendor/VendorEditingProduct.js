import axios from 'axios'
import { useState, useEffect, useCallback, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function VendorEditPostingProduct() {
  const params = useParams();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [file, setFile] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('')
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext)

  const notify = (error) => {
    toast.error(error, {
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

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/edit-product/${params.id}`, { withCredentials: true });
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [params.id]);

  const data = {
    productName: productName,
    category: category,
    price: price,
    stock: stock,
    description: description,
    file: file,
  }

  const handleFileChange = (event) => {
    event.preventDefault()
    setFile(event.target.files[0]);
  };

  const handleDropdownChange = (event) => {
    setCategory(event.target.value);
  };

  async function axiosPostData() {
    setLoading(true)
    await axios.post(`http://localhost:4000/update-product/${params.id}`, data, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      .then(res => {
        setMsg(res.data)
        setError('')
        setLoading(false)
      })
      .catch(er => { setError(er.response.data); setMsg() });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosPostData();
    if (error) {
      notify(error);
    }
  }

  useEffect(() => {
    error && notify(error)
    msg && success(msg)
    fetchProduct();
  }, [error, msg, fetchProduct]);


  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto my-8 px-4 rounded-lg bg-white shadow p-4 max-w-4xl">
      {error && <Navigate to='/login' replace={true} />}
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
      <form>
        <h2 class="mb-4 text-2xl tracking-tight font-bold text-gray-900">Edit Product</h2>
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="col-span-full">
              <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Product Images</label>
              <p class="mt-1 text-sm leading-6 text-gray-600">Upload real, high resolution, clear product images. You should choose images with 1:1 resolution</p>
              <section class="container w-full mx-auto items-center py-4">
                <div class="max-w-sm mx-auto items-center">
                  <div class="px-4 py-6">
                    <div id="image-preview" class="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                      <input id="upload" onChange={handleFileChange} type="file" class="hidden" accept="image/*" />
                      <label for="upload" class="cursor-pointer">
                        {/* {file && (
                          <div>
                            <h2 class="font-normal text-sm text-gray-600 md:px-6 " >Image Preview:</h2>
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              style={{ maxWidth: '100%' }}
                            />
                            <p class="font-normal text-sm text-gray-400 md:px-6">File Name: {file.name}</p>
                          </div>
                        )} */}
                        {/* {!file && (
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-700 mx-auto mb-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-700">Upload picture</h5>
                            <p class="font-normal text-sm text-gray-400 md:px-6">Choose photo size should be less than <b class="text-gray-600">2mb</b></p>
                            <p class="font-normal text-sm text-gray-400 md:px-6">and should be in <b class="text-gray-600">JPG, PNG, or GIF</b> format.</p>
                            <span id="filename" class="text-gray-500 bg-gray-200 z-50"></span>
                          </div>
                        )} */}
                        <div style={file ? { backgroundImage: `url(${URL.createObjectURL(file)})` } : { backgroundImage: `url(${product.image_link})` }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-700 mx-auto mb-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-700">Upload picture</h5>
                          <p class="font-normal text-sm text-gray-400 md:px-6">Choose photo size should be less than <b class="text-gray-600">2mb</b></p>
                          <p class="font-normal text-sm text-gray-400 md:px-6">and should be in <b class="text-gray-600">JPG, PNG, or GIF</b> format.</p>
                          <span id="filename" class="text-gray-500 bg-gray-200 z-50"></span>
                          <input
                            id="upload"
                            onChange={handleFileChange}
                            type="file"
                            class="hidden"
                            accept="image/*"
                            required
                          />
                          <label for="upload" class="cursor-pointer">
                            <div class="font-extrabold tracking-tight leading-none text-gray-700">
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
                              <h5 class="mb-2 text-xl">Upload product Image</h5>
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
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full">
                <label for="street-address" class="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
                <p class="mt-3 text-sm leading-6 text-gray-600">Product name must use proper accented Vietnamese or English, with no shortened words, and contain at least 10 characters. For all Shop, maximum product name must not exceed 120 characters, including spaces.</p>
                <div class="mt-2">
                  <input onChange={(e) => setProductName(e.target.value)} placeholder={product && product.product_name} type="text" on name="street-address" id="street-address" autocomplete="street-address" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
              </div>
              <div class="col-span-full">
                <label for="street-address" class="block text-sm font-medium leading-6 text-gray-900">Category</label>
                <p class="mt-3 text-sm leading-6 text-gray-600">Uploading a product to the right category makes it easier for shoppers to find your product while searching in that category.</p>
                <select value={category} onChange={handleDropdownChange} id="dropdown" name="dropdown" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" >
                  <option value="Household Appliances">Household Appliances</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  <option value="Baby toys">Baby toys</option>
                </select>
              </div>

              <div class="col-span-3">
                <label for="street-address" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
                <p class="mt-3 text-sm leading-6 text-gray-600">Product's price must be in dollar.</p>
                <div class="mt-2">
                  <input onChange={(e) => setPrice(e.target.value)} placeholder={product && product.price} type="number" name="street-address" id="street-address" autocomplete="street-address" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div class="col-span-3">
                <label for="street-address" class="block text-sm font-medium leading-6 text-gray-900">Stock</label>
                <p class="mt-3 text-sm leading-6 text-gray-600">Quantity of goods in stock.</p>
                <div class="mt-2">
                  <input onChange={(e) => setStock(e.target.value)} placeholder={product && product.stock} type="Number" name="number" id="number" autocomplete="number" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div class="col-span-full">
                <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                <p class="mt-3 text-sm leading-6 text-gray-600">Provide detailed product information such as: Recommendations, Instructions for use, Technical specifications, Warning information,...</p>

                <div class="mt-2 relative">
                  <textarea placeholder={product && product.description} onChange={(e) => setDescription(e.target.value)} id="about" name="about" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" oninput="this.parentNode.querySelector('.counter').innerText = 4000 - this.value.length"></textarea>
                  <div class="counter text-xs text-gray-500 text-right pr-2 pt-1 absolute right-0 bottom-0">4000</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="rounded-md px-3 py-2 text-sm font-semibold shadow-sm border-solid border-2  hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} type="submit" class={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 text-white'}`}>Save and Publish</button>
          </div>
        </div>
      </form>
    </div>
  )
}