import { Tabs } from "flowbite-react";
import { useEffect, useState } from "react";
import TableComponent from "./TableComponent";
import Pagination from "./Pagination";
import '../css/mangeorder.css'

export default function OrdersInfo({ orders, searchTerm, initialStatuses, filterOrders, headerContent, handleConfirmOrder }) {
    const [categorizedOrder, setCategorizedOrder] = useState({ "All": orders })
    useEffect(() => {
        const orderStatus = orders.reduce((acc, order) => {
            if (!acc[order.status]) {
                acc[order.status] = [];
            }
            acc[order.status].push(order);
            return acc;
        }, initialStatuses);

        orderStatus["All"] = orders;

        setCategorizedOrder(prevState => ({ ...prevState, ...orderStatus }));
    }, [orders, initialStatuses]);


    return (
        <Tabs aria-label="Tabs with icons">
            {Object.entries(categorizedOrder).map(([title, orders]) => (
                <Tabs.Item title={title} >
                    {orders ? <OrderContent orders={orders} searchTerm={searchTerm} filterOrders={filterOrders} headerContent={headerContent} handleConfirmOrder={handleConfirmOrder}/> : <div className="overflow-x-auto">
                        <div className='border border-gray my-1 py-32'>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='w-[100px] h-[80px]'>
                                    <img src={require("./images/noorder.png")}
                                        alt="No Order" className='w-full h-full' />
                                </div>
                                <p className="capitalize text-md text-gray-900 font-light my-2">no orders found</p>
                            </div>
                        </div>
                    </div>}
                </Tabs.Item>
            ))}
        </Tabs>
    )
}

function OrderContent({ orders, searchTerm, filterOrders, headerContent, handleConfirmOrder }) {
    const [dataslice, setDataSlice] = useState(orders)

    useEffect(() => {
        (searchTerm) ? setDataSlice(filterOrders(orders, searchTerm)) : setDataSlice(orders.slice(0, 10))
    }, [searchTerm, orders, filterOrders])

    return (
        <>
            {dataslice.length !== 0 ? <TableComponent orders={dataslice} headerContent={headerContent} handleConfirmOrder={handleConfirmOrder}/> : <div className="overflow-x-auto">
                <div className='border border-gray my-1 py-32'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='w-[100px] h-[80px]'>
                            <img src={require("./images/noorder.png")}
                                alt="No Order" className='w-full h-full' />
                        </div>
                        <p className="capitalize text-md text-gray-900 font-light my-2">no orders found</p>
                    </div>
                </div>
            </div>}
            {!searchTerm && Math.floor(orders.length / 10) > 1 && <Pagination pages={Math.ceil(orders.length / 10)} setDataSlice={setDataSlice} data={orders} />}
        </>
    )
}
