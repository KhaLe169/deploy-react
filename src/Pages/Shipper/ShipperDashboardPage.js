import '../../css/mangeorder.css'
import React, { useCallback, useContext, useEffect, useState } from "react";
import ToDoListShipper from '../../Components/ToDoListShipper';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import OrdersInfo from '../../Components/OrdersInfo';
import { UserContext } from '../../Context/UserContext';
import { ToastContainer } from 'react-toastify';

export default function ManageOrderPage() {
    const [orders, setOrders] = useState();
    const { user } = useContext(UserContext);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('')
    const [ordersCountByStatus, setOrdersCountByStatus] = useState({});
    const initialStatuses = {
        "To Ship": null,
        "Shipping": null,
        "Completed": null,
        "Cancelled": null,
        "Failed Delivery": null
    };
    const headerContent = ["Order ID", "Customer Name", "Order Date", "Shipping Address", "Contact Number", "Status"]

    const getData = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:4000/shipper/dashboard", { withCredentials: true })
            const orders = res.data.orders
            const statusOrder = ["to ship", "shipping", "completed", "cancelled", "failed delivery"];
            orders.sort((a, b) => {
                return statusOrder.indexOf(a.status.toLowerCase()) - statusOrder.indexOf(b.status.toLowerCase());
            });
            setOrders(orders)
            setOrdersCountByStatus(res.data.ordersCountByStatus);
        } catch (error) {
            setError(error)
        }
    }, [])

    useEffect(() => {
        getData();
    }, [getData])

    if (!user) {
        return null;
    }

    const handleConfirmOrder = async (orderId) => {
        const orderIndex = orders.findIndex(order => order._id === orderId);
        if (orderIndex !== -1) {
            let newStatus = '';
            if (orders[orderIndex].status === "To Ship") {
                newStatus = "Shipping";
                setOrdersCountByStatus(prev => ({ ...prev, "To Ship": prev["To Ship"] - 1, "Shipping": prev["Shipping"] + 1 }));
            } else if (orders[orderIndex].status === "Shipping") {
                newStatus = "Completed";
                setOrdersCountByStatus(prev => ({ ...prev, "Shipping": prev["Shipping"] - 1, "Completed": prev["Completed"] + 1 }));
            }

            // Update the status of the order in the orders array
            const newOrders = [...orders];
            newOrders[orderIndex].status = newStatus;
            setOrders(newOrders);
        }
    }

    return (
        <>
            {error && <Navigate to={"/"} replace />}
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
            <div class="max-w-full mb-10 pb-5 lg:md:w-full w-5/6 overflow:hidden">
                <div
                    id="content"
                    class="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-gray-100 mb-10 px-4"
                >
                    <h1 class="font-bold  lg:pl-5 pt-4 uppercase text-black lg:md:text-2xl text-xl">
                        To Do List
                    </h1>
                    <h1 class="font-medium  lg:md:pt-1 lg:pl-5 text-gray-500 text-xs lg:md:text-base lg:mb-3">
                        Things your business need to deal with
                    </h1>
                    <ToDoListShipper ordersCountByStatus={ordersCountByStatus} />
                </div>


                <div className='shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-gray-100 mb-10 px-4'>
                    <div className="flex items-center py-10 px-4">
                        <div className="flex flex-row items-center">
                            <input type="text" name="search" placeholder="Search orders here.... "
                                className="rounded-md w-full border border-slate-400 pl-4 pr-20 py-2 text-md hover:border-black"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                    </div>

                    <div>
                        {orders && <OrdersInfo orders={orders} searchTerm={searchTerm} initialStatuses={initialStatuses} filterOrders={filterOrders} headerContent={headerContent} handleConfirmOrder={handleConfirmOrder} />}
                    </div>
                </div>
            </div>
        </>
    )
}

function filterOrders(orders, searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return orders.filter(order => regex.test(order._id) || regex.test(order.status) || regex.test(order.userName) || regex.test(order.date) || regex.test(order.contactNumber) || regex.test(order.shippingAddress)).map(order => {
        return order
    });
}