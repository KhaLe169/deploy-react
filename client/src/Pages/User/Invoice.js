import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Invoice() {
    const [order, setOrder] = useState();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const res = await axios.get(`http://localhost:4000/${params.id}/view-invoice`, { withCredentials: true });
        setOrder(res.data.order);
        setIsLoading(false)
        console.log(res.data.order);
    }, [params])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <section class="mx-auto px-6 my-10 md:max-w-5xl">
                <div class="mb-10">
                    <h1 class="text-center text-4xl font-bold pb-5">
                        Order Invoice
                    </h1>
                </div>
                <div>
                    <div class="order-content">
                        <div class="checkout order-details">
                            {order.products.map((product) => (
                                <>
                                    <div class="order-columns">
                                        <div class="order-info-product px-3">
                                            <span class="text-lg font-semibold text-gray-900">
                                                {product.product_name}
                                            </span>
                                            <br />
                                            <div class="flex items-center justify-between">
                                                <span class="text-base font-bold text-gray-900">${product.price}</span>
                                                <span class="text-base font-bold text-gray-900">x{product.quantity}</span>
                                            </div>
                                        </div>
                                        <div class="order-product-img">
                                            <img
                                                alt=""
                                                src={product.image_link}
                                            />
                                        </div>
                                    </div>
                                    <hr class="h-px my-8 bg-gray-200 border-0" />
                                </>
                            ))}
                            <div class="space-y-2 font-medium">
                                <div class="flex justify-between">
                                    <p>Items</p>
                                    <p>{order.products.length}</p>
                                </div>
                                <div class="flex justify-between">
                                    <p>Subtotal</p>
                                    <p>${order.products.reduce((total, product) => total + product.price * product.quantity, 0)}</p>
                                </div>
                                <div class="flex justify-between">
                                    <p>Shipping - {order.shippingFee === 20 ? "Fastest Delivery" : "Standard Delivery"}</p>
                                    <p>${order.shippingFee || 0}</p>
                                </div>
                            </div>
                            <hr class="h-px my-8 bg-gray-200 border-0" />
                            <div class="flex justify-between text-lg font-medium">
                                <p>Total</p>
                                <p>${order.shippingFee || 0 + order.products.reduce((total, product) => total + product.price * product.quantity, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-20 space-y-7 md:grid md:grid-cols-2 md:space-y-0">
                        <div>
                            <p class="mb-4 text-lg font-medium">Shipping Address</p>
                            <div class="space-y-1 text-gray-500">
                                <p>{order.contactNumber}</p>
                                <p>{order.shippingAddress}</p>
                                <p>{order.ward} Ward, {order.district} District</p>
                                <p>{order.city} City</p>
                            </div>
                        </div>
                        <div>
                            <p class="mb-4 text-lg font-medium">Payment Information</p>
                            <p class="text-gray-500">Cash On Delivery (COD)</p>
                        </div>
                    </div>
                </div>
                <hr class="h-px my-8 bg-gray-200 border-0" />

                {/* Back to homepage */}
                <div class="flex justify-end">
                    <Link
                        to="/"
                        class=" inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <span class="w-full">Continue Shopping</span>
                        <svg
                            class="w-4 h-4 ms-2 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </Link>
                </div>
            </section>
        </>
    );
}