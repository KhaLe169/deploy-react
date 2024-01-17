import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import aa from "search-insights";

export default function CartPage() {
  const { user } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);
  const [error, setError] = useState("");
  const [navigateTo, setNavigateTo] = useState("");
  const [checkedProducts, setCheckedProducts] = useState([]); // Array of products that are checked [
  const [products, setProducts] = useState([]); // Array of products in the cart

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/cart", {
        withCredentials: true,
      });
      setProducts(() =>
        res.data.products.map((product) => ({ ...product, checked: false }))
      );
    } catch (error) {
      setError(error);
    }
  }, []);

  const removeProduct = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/remove-product/${id}`,
        { withCredentials: true }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product !== id)
      );
      setCart(res.data.cart);
    } catch (error) {
      setError(error);
    }
  };

  const removeAllProducts = async () => {
    const productIds = products.map(product => product.product);
    try {
      const res = await axios.post(
        `http://localhost:4000/remove-all-products`,
        { productIds },
        { withCredentials: true }
      );
      setProducts([]);
      setCart(res.data.cart);
    } catch (error) {
      setError(error);
    }
  }

  const incrementQuantity = (id) => {
    setProducts(
      products.map((product) =>
        product.product === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const decrementQuantity = (id) => {
    setProducts(
      products.map((product) =>
        product.product === id
          ? {
            ...product,
            quantity: product.quantity - 1 > 0 ? product.quantity - 1 : 1,
          }
          : product
      )
    );
  };

  const toggleChecked = (id) => {
    setProducts(
      products.map((product) =>
        product.product === id
          ? { ...product, checked: !product.checked }
          : product
      )
    );
  };

  const toggleSelectAll = () => {
    const areAllProductsChecked = products.every(product => product.checked);
    setProducts(
      products.map((product) => ({ ...product, checked: !areAllProductsChecked }))
    );
  }

  useEffect(() => {
    fetchCart();
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, [fetchCart]);

  // Save products to local storage whenever they change
  useEffect(() => {
    setCheckedProducts(products.filter((product) => product.checked));
  }, [products]);

  const handleCheckout = async (user) => {
    if (checkedProducts.length === 0) {
      toast.error("Please select at least one product to checkout", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });
      return;
    }
    localStorage.setItem('products', JSON.stringify(checkedProducts));
    aa('addedToCartObjectIDs', {
      userToken: user._id, // required for Node.js
      eventName: 'addedToCartObjectIDs',
      index: 'rBuy',
      objectIDs: checkedProducts.map(product => product.product),
      objectData: checkedProducts.map(product => ({
        price: product.price,
        quantity: product.quantity,
      })),
      value: checkedProducts.reduce((total, product) => total + product.price * product.quantity, 0),
      currency: 'USD'
    });
    setNavigateTo('/checkout')
  }

  return (
    <>
      {error && <Navigate to="/" />}
      {navigateTo && <Navigate to={navigateTo} />}
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

      {!products.length ? <div class="md:container mx-auto md:px-6 px-2">
        <div class="flex flex-col items-center w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mb-2">
          <div class="flex justify-center">
            <img
              src={require("../../Components/images/cart-empty.png")}
              alt="product"
            />
          </div>
          <div class="text-center center">
            <p class="text-lg font-semibold">Your cart is empty</p>
            <p class="text-base text-gray-800">
              Looks like you haven't made your choice yet...
            </p>
          </div>
          <div class="pb-3 pt-5">
            <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#000054] to-[#E61E2A] group-hover:from-[#000054]  group-hover:to-[#E61E2A] hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
              <Link class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0" to="/">
                Start Shopping
              </Link>
            </button>
          </div>
        </div>
      </div> :
        <>

          <div class="text-center text-3xl my-5 sticky top-0">
            Shopping Cart <span class="text-xl">({cart.products?.length})</span>
          </div>
          <div class="md:container mx-auto md:px-6 px-2">
            <div class="grid md:grid-cols-3 md:gap-5 my-3">
              <div class="md:col-span-2 row-span-2">
                <div class="">
                  <div class="w-full items-center bg-white border border-gray-200 rounded-lg shadow  mb-4">
                    <div class='flex justify-between lg:px-10 md:px-14 sm:xs:px-4 py-5'>
                      <div class='flex items-center '>
                        <input
                          id="default-checkbox"
                          type="checkbox"
                          checked={products.every(product => product.checked)}
                          class="w-5 h-5 text-black bg-gray-100 border-gray-300 rounded mr-3"
                          onClick={toggleSelectAll}
                        />
                        <div class='text-md font-medium' >Select All Product</div>

                      </div>
                      <div class="flex justify-end text-md ">
                        <button
                          type="button"
                          class="font-medium text-indigo-600 hover:text-indigo-500 "
                          onClick={removeAllProducts}
                        >
                          Remove all
                        </button>
                      </div>
                    </div>


                  </div>
                  <div class="w-full lg:md:px-4 xs:px-4 py-2 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mb-2">
                    {/* Test */}
                    <div class="flex-1 md:py-6 md:px-6">
                      <div class="">
                        <div class="flow-root">
                          <ul class="-my-6 divide-y divide-gray-200">
                            {products.map((product) => (
                              <li class="flex py-6" key={product.product}>
                                <div>
                                  <input
                                    id="default-checkbox"
                                    type="checkbox"
                                    checked={product.checked}
                                    class="w-5 h-5 text-black bg-gray-100 border-gray-300 rounded mr-3"
                                    onClick={() => toggleChecked(product.product)}
                                  />
                                </div>
                                <div class="flex justify-center order-product-img">
                                  <img className="lg:md:h-40 sm:xs:h-24 w-auto " src={product.image_link} alt="product" />
                                </div>
                                <div class="ml-4 flex flex-1 flex-col">
                                  <div class="flex md:flex-row justify-between text-base font-medium text-gray-900 flex-col">
                                    <h3 className="lg:md:text-md xs:text-sm lg:md:w-2/3">{product.product_name}</h3>
                                    <p class="flex justify-start text-lg font-semibold text-indigo-600">${product.price}</p>
                                  </div>
                                  <div class="flex flex-wrap flex-1 lg:md:items-end xs:items-center justify-between text-sm">
                                    <div class="py-2 relative flex items-center max-w-[7rem]">
                                      <button
                                        type="button"
                                        id="decrement-button"
                                        data-input-counter-decrement="quantity-input"
                                        class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2 h-6 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                                        onClick={() =>
                                          decrementQuantity(product.product)
                                        }
                                      >
                                        <svg
                                          class="w-2 h-2 text-gray-900"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                      <input
                                        type="text"
                                        id="quantity-input"
                                        data-input-counter
                                        aria-describedby="helper-text-explanation"
                                        class="bg-gray-50 border-x-0 border-gray-300 h-6 w-full text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block py-2.5"
                                        placeholder={product.quantity}
                                        required
                                      />
                                      <button
                                        type="button"
                                        id="increment-button"
                                        data-input-counter-increment="quantity-input"
                                        class="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2 h-6 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                                        onClick={() =>
                                          incrementQuantity(product.product)
                                        }
                                      >
                                        <svg
                                          class="w-2 h-2 text-gray-900"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>

                                    <div class="flex md:py-2">
                                      <button
                                        type="button"
                                        class="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() =>
                                          removeProduct(product.product)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                            {/* <!-- More products... --> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="md:col-span-1">
                <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mb-2">
                  <div class="container mb-3">
                    <div class="text-3xl font-bold my-3">Order Summary</div>
                    <div class="flex items-center justify-between">
                      <span class="text-lg text-gray-900">Items:</span>
                      <span class="text-lg text-gray-900">
                        {products.reduce(
                          (count, product) => (product.checked ? count + 1 : count),
                          0
                        )}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-lg text-gray-900">Subtotal:</span>
                      <span class="text-lg text-gray-900">
                        $
                        {products.reduce(
                          (total, product) =>
                            product.checked
                              ? total + product.price * product.quantity
                              : total,
                          0
                        )}
                      </span>
                    </div>
                    <div class="my-5">
                      <span
                        class="flex w-full justify-center rounded-md bg-[#222160] px-3 py-1.5 text-lg font-medium leading-6 text-white shadow-sm hover:bg-[#000053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000053]"
                        onClick={() => handleCheckout(user)}
                      >
                        Proceed to checkout
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
}
