import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { Rating } from 'flowbite-react';



export default function ProductCard({ product }) {
    const { setCart } = useContext(CartContext)
    const [error, setError] = useState('')
    const [msg, setMsg] = useState('')

    const notify = useCallback(() => {
        if (error) {
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

        if (msg) {
            toast.success(msg, {
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
    }, [error, msg]);

    useEffect(() => {
        if (error || msg) {
            notify();
        }
    }, [error, msg, notify]);


    const addProduct = async (productId) => {
        error && notify();
        msg && notify();
        try {
            const res = await axios.get(`http://localhost:4000/add-product/${productId}`, { withCredentials: true });
            setCart(res.data.cart)
            setMsg(res.data.msg);
            setError('');
        } catch (er) {
            setError(er.response.data.error);
            setMsg('');
        }
    }

    return (
        <div className="bg-white overflow-hidden group rounded-lg shadow-lg dark:border-gray-700 
    group xs:mx-auto"
            key={product._id}>
            <div className="relative">
                <div className="w-full h-[220px] md:h-[200px] sm:h-[180px] xs:h-[160px] xs:w-3/4 xs:mx-auto p-3">
                    <img src={product.image_link} className="object-full h-full w-full scale-75" alt={product.product_name} />


                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 sm:gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Link to={`/product/${product._id}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </Link>
                        <Link to={`/product/${product._id}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
                            <i className="fa-regular fa-heart"></i>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="pt-4 pb-3 px-4">
                <Link to={`/product/${product._id}`}>
                    <h4 className="capitalize font-medium xl:text-md lg:text-mb md:text-sm sm:text-sm xs:text-xs mb-2 text-gray-800 hover:text-primary-900 transition line-clamp-2">{product.product_name}</h4>
                </Link>
                <p className="text-lg text-red-500 font-semibold mb-2">${product.price}</p>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex text-xs text-[#FAC800]">
                        <Rating size="md">
                            {[...Array(5)].map((_, i) => (
                                <Rating.Star key={i} filled={i < Math.floor(product.ratings + 0.5)} className="!w-4 !h-4" />
                            ))}
                        </Rating>
                    </div>
                    <div className="text-xs xs:text-2xs text-gray-500 block" >Rating {product.ratings}</div>
                </div>
            </div>
            <span onClick={() => addProduct(product._id)} className="block w-full py-1 text-center text-md font-semibold text-white bg-red-500 border border-red-500 rounded-b hover:bg-transparent hover:text-red-500 hover:rounded transition">Add to cart</span>
        </div>
    )
}



