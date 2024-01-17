import "../../css/mangeorder.css";
import ReportInfo from "../../Components/ReportInfo";
import CustomerCard from "../../Components/ProfileCard/CustomerCard";
import VendorCard from "../../Components/ProfileCard/VendorCard";
import ShipperCard from "../../Components/ProfileCard/ShipperCard";
import { Navigate, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

export default function ReportInfoPage() {
  const params = useParams()
  const [userInfo, setUserInfo] = useState()
  const [orders, setOrders] = useState([])
  const [reports, setReports] = useState()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(UserContext)

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:4000/admin/${params.id}/report`, { withCredentials: true });
      const orders = res.data.orders
      const statusOrder = ["unpaid", "to ship", "shipping", "completed", "cancelled", "failed delivery"];
      orders.sort((a, b) => {
        return statusOrder.indexOf(a.status.toLowerCase()) - statusOrder.indexOf(b.status.toLowerCase());
      });
      setOrders(orders)
      setUserInfo(res.data.user);
      setReports(res.data.report);
      setIsLoading(false)
    } catch (error) {
      setError(error);
      setIsLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  if (isLoading || !user) {
    return null
  }

  return (
    <>
      <section class="max-w-full px-4 sm:px-0 lg:px-8 bg-gray-100 mb-10 pb-5 w-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-hidden">
        {error && <Navigate to={"/"} replace />}
        <div class="md:container mx-auto p-5">

          {/* <!-- Customer --> */}
          {userInfo && userInfo.role === "User" && <CustomerCard user={userInfo} orders={orders} />}
          {/* <!-- Vendor --> */}
          {userInfo && userInfo.role === "Vendor" && <VendorCard user={userInfo} orders={orders} />}
          {/* <!-- Shipper --> */}
          {userInfo && userInfo.role === "Shipper" && <ShipperCard user={userInfo} orders={orders} />}
          {/* Report Section */}
          {<ReportInfo reports={reports} />}
        </div>
      </section>
    </>
  );
}
