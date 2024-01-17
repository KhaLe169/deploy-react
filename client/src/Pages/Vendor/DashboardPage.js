import VendorBarChart from "../../Components/VendorBarChart";
import Insight from "../../Components/Insight";
import ToDoList from "../../Components/ToDoList";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function DashboardPage() {
  const [ordersByStatus, setOrdersByStatus] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [orders, setOrders] = useState([])
  const { user } = useContext(UserContext)
  const [numberOfFollowers, setNumberOfFollowers] = useState()
  const [numberOfProducts, setNumberOfProducts] = useState()
  const [income, setIncome] = useState()

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/dashboard", { withCredentials: true })
      setOrdersByStatus(res.data.ordersByStatus);
      setOrders(res.data.orders)
      setNumberOfFollowers(res.data.numberOfFollowers)
      setIncome(res.data.income)
      setNumberOfProducts(res.data.numberOfProducts)
      setIsLoading(false)
    }
    catch (er) {
      setError(er);
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData])

  if (isLoading || !user) {
    return null
  }

  return (
    <>
      {error && <Navigate to={'/login'} />}
      <link
        rel="stylesheet"
        href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
      />
      <div class="max-w-full mb-10 pb-5 lg:md:w-full w-5/6 overflow:hidden">
        <div
          id="content"
          class="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-gray-100 mb-10 px-4"
        >
          <h1 class="font-bold  lg:pl-5 pt-4 uppercase text-black text-2xl ">
            To Do List
          </h1>
          <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-base lg:mb-3">
            Things your business need to deal with
          </h1>
          <ToDoList ordersByStatus={ordersByStatus} />
        </div>

        <div class="">
          <div
            id="content"
            class="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-gray-100 px-4 "
          >
            <h1 class="font-bold  lg:pl-5 pt-4 uppercase text-black text-2xl ">
              Business Insight
            </h1>
            <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-base mb-3">
              Critical business priorities encompass operational efficiency, market dynamics, and customer engagement
            </h1>

            <Insight orders={Object.values(ordersByStatus).reduce((total, orders) => total + Number(orders), 0)} numberOfFollowers={numberOfFollowers} income={income} numberOfProducts={numberOfProducts} />
            <div className="mt-4">
              <h1 class="font-bold  lg:pl-5 py-4 uppercase text-black text-2xl ">
                Last Month Incomes
              </h1>

            </div>
            <div className="relative" >
              <VendorBarChart orders={orders} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
