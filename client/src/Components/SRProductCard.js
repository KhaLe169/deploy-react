import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CartContext } from '../Context/CartContext';
import { Link } from 'react-router-dom';
import aa from 'search-insights';

export default function SRProductCard({ hit, user }) {
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const { setCart } = useContext(CartContext)

  const addProduct = async (productId) => {
    notify()
    try {
      const res = await axios.get(`http://localhost:4000/add-product/${productId}`, { params: { quantity: quantity }, withCredentials: true });
      setMsg(res.data.msg);
      setError('');
      setQuantity(1);
      setCart(res.data.cart);
    } catch (er) {
      setError(er.response.data.error);
      setMsg('');
    }
  }

  const notify = useCallback(() => {
    if (error) {
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

    if (msg) {
      toast.success(msg, {
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
  }, [error, msg]);

  useEffect(() => {
    if (error || msg) {
      notify();
    }
  }, [error, msg, notify]);

  const handleClickedObjectIDsAfterSearch = (hit) => {
    aa('clickedObjectIDsAfterSearch', {
      userToken: user ? user._id : null,
      eventName: 'Product clicked after search',
      index: 'rBuy',
      queryID: hit.__queryID,
      objectIDs: [hit.objectID],
      positions: [hit.__position],
    });
  }

  const handleAddedToCartObjectIDsAfterSearch = (hit) => {
    aa('addedToCartObjectIDsAfterSearch', {
      userToken: user ? user._id : null,
      eventName: 'Product added after Search',
      index: 'rBuy',
      queryID: hit.__queryID,
      objectIDs: [hit.objectID],
      objectData: [{ price: hit.price, quantity: 1 }],
      value: hit.price,
      currency: 'USD',
    });
    addProduct(hit.objectID);
  }

  const handlePurchasedObjectIDsAfterSearch = (hit) => {
    aa('purchasedObjectIDsAfterSearch', {
      userToken: user ? user._id : null,
      eventName: "Product purchased after search",
      index: 'rBuy',
      objectIDs: [hit.objectID],
      objectData: [{ price: hit.price, quantity: 1 }],
      value: hit.price,
      currency: 'USD',
    });
    buyProduct(hit);
  }

  const buyProduct = async (product) => {
    if (user === null) {
      toast.error("You need to login first", {
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
    product.checked = true
    product.quantity = 1
    localStorage.setItem('products', JSON.stringify([product]));
    window.location.href = '/checkout'
  }

  return <>


    <div className="bg-white overflow-hidden group rounded-lg shadow-lg dark:border-gray-700 
    group xs:mx-auto"
      key={hit.objectID}>
        
    <div className="bg-white p-4">
      <div className="relative">
        <div className="w-full h-[220px] md:h-[200px] sm:h-[180px] xs:h-[160px] xs:w-3/4 xs:mx-auto">
          <img src={hit.image_link} className="object-full h-full w-full scale-75 mb-3" alt={hit.product_name} />

          <hr className='border border-gray-200'></hr>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 sm:gap-2 opacity-0 group-hover:opacity-100 transition">
            <Link to={`/product/${hit.objectID}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
              <i className="fa-solid fa-magnifying-glass"></i>
            </Link>
            <Link to={`/product/${hit.objectID}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
              <i className="fa-regular fa-heart"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-4 pb-3 px-4">
        <Link to={`/product/${hit.objectID}`}>
          <h4 className="text-md text-gray-900 line-clamp-2 mt-2">{hit.product_name}</h4>
        </Link>
        <p className="mt-1 text-md font-bold text-[#E61E2A]">${hit.price}</p>
        <p className="mt-1 text-sm font-normal text-gray-700 mb-2">{hit.category}</p>
        <p className="text-sm font-medium text-[#fac800f1] mt-4">Rating: {hit.ratings}</p>

      </div>
      <span onClick={() => addProduct(hit.objectID)} className="block w-full py-1 text-center text-md font-semibold text-white bg-red-500 border border-red-500 rounded-b hover:bg-transparent hover:text-red-500 hover:rounded transition">Add to cart</span>
    </div>
    
  </>
}