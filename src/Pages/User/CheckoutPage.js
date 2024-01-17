import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import CheckoutInfo from "../../Components/CheckoutInfo"
import OrderSummary from "../../Components/OrderSummary";

export default function CheckoutPage() {
  const [products, setProducts] = useState()
  const [error, setError] = useState('')
  const [checkoutInfo, setCheckoutInfo] = useState({})

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/checkout", { withCredentials: true });
      setCheckoutInfo(res.data.checkoutInfo)
    } catch (er) {
      setError(er)
    }
  }, [])

  useEffect(() => {
    fetchData();
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, [fetchData]);

  return (
    <>
      {error && <Navigate to={"/"} replace />}
      <section>
        <div class="mx-auto px-10 my-10">
          <h1 class="text-center text-5xl">Checkout</h1>
          <div class="grid md:grid-cols-3 md:gap-5 my-3">
            <div class="md:col-span-2 row-span-2 my-3">
              <CheckoutInfo setCheckoutInfo={setCheckoutInfo} products={products} price={(products) ? products.reduce((total, product) => product.checked ? total + product.price * product.quantity : total, 0) : 0} checkoutInfo={checkoutInfo} />
            </div>
            <div class="md:col-span-1">
              <OrderSummary checkoutInfo={checkoutInfo} products={products} price={(products) ? products.reduce((total, product) => product.checked ? total + product.price * product.quantity : total, 0) : 0} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
