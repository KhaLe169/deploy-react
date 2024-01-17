import axios from "axios";
import { Modal } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";

export default function MoreDetailOrder({ order, handleConfirmOrder }) {
    const { user } = useContext(UserContext);
    const [openModal, setOpenModal] = useState(false);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [orderPrice, setOrderPrice] = useState(0);
    const date = new Date(order.date);
    const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    useEffect(() => {
        let totalQuantity = 0;
        let totalPrice = 0;

        order.products.forEach(product => {
            totalQuantity += product.quantity;
            totalPrice += product.price * product.quantity;
        });

        setOrderQuantity(totalQuantity);
        setOrderPrice(totalPrice);
    }, [order]);

    const postData = async () => {
        await axios.post("http://localhost:4000/confirm-order", { orderId: order._id }, { withCredentials: true })
            .then(res => {
                notify(res.data.msg)
            })
            .catch(err => { notify(err.response.data.error) })
    }

    const notify = (msg) => {
        toast.success(msg, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            pauseOnHover: false,
            theme: "light",
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        postData()
        handleConfirmOrder(order._id)
        setOpenModal(false)
    }

    return (<>
        <span className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => setOpenModal(true)}>
            More
        </span>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>
                <div>
                    <p className='text-sm font-medium text-[#E61E2A]'>Order ID: <span className='font-light text-gray-500 text-sm ml-1'>{order._id}</span></p>
                    <p className='text-sm font-medium text-[#E61E2A]'>Order placed: <span className='font-light text-gray-500 text-sm ml-1'>{formattedDate}</span> </p>
                    <p className='text-sm font-medium text-[#E61E2A]'>Shipping Address: <span className='font-light text-gray-500 text-sm ml-1'>{order.shippingAddress}</span> </p>
                    <p className='text-sm font-medium text-[#E61E2A]'>Contact: <span className='font-light text-gray-500 text-sm ml-1'>{order.contactNumber}</span> </p>
                    <p className='text-sm font-medium text-[#E61E2A]'>Vendor: <span className='font-light text-gray-500 text-sm ml-1'>{user.businessName || order.vendorID.businessName}</span></p>
                    <p className='text-sm font-medium text-[#E61E2A]'>Vendor Address: <span className='font-light text-gray-500 text-sm ml-1'>{user.address || order.vendorID.address}</span> </p>
                </div>
            </Modal.Header>
            <Modal.Body className='overflow-y-auto'>
                <div className='space-y-6'>
                    {order.products.map((product) => (
                        <div className='flex'>
                            <div className='w-[50px] h-[70px] overflow-hidden'>
                                <img src={product.image_link} alt="product_img" className='object-fill w-full h-full' />
                            </div>

                            <div className="flex flex-col justify-between flex-1">
                                <p className="text-md leading-relaxed text-gray-900 line-clamp-1 ml-8">
                                    {product.product_name}
                                </p>

                                <div className="flex flex-col justify-between items-end">
                                    <div>
                                        x{product.quantity}
                                    </div>
                                    <div>
                                        <p className='text-[#E61E2A] font-bold mt-2'>${product.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div className='flex items-center justify-between w-full'>
                    <div>
                        <p className='font-light text-md text-gray-900'>Total Items: <span className='ml-2 font-light text-gray-500'>{orderQuantity} items</span></p>
                    </div>
                    <div>
                        <p className='font-light text-md text-gray-900'>Order Total: <span className='ml-2 font-light text-gray-500'>${orderPrice}</span></p>
                    </div>
                </div>
            </Modal.Footer>

            <Modal.Footer>
                <div className='flex items-center justify-between w-full'>
                    <div>
                        <p className='font-light text-md text-gray-900'>Order Payment Method: <span className='ml-2 font-light text-gray-500'>Cash On Delivery - COD</span></p>
                    </div>
                    <div className='flex items-center'>
                        <p className='font-light text-md text-gray-900'>Status</p>
                        <button className="ml-2 bg-transparent text-[#E61E2A] text-sm px-2 font-bold border border-[#E61E2A] rounded-lg">{order.status}</button>
                    </div>
                </div>
            </Modal.Footer>
            {(user && ((order.status === "Unpaid" && user.role === "Vendor") || ((order.status !== "Unpaid" && order.status !== "Completed" && order.status !== "Cancelled" && order.status !== "Failed Delivery") && user.role === "Shipper"))) &&
                <Modal.Footer>
                    <button type="button" class="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleSubmit}>Confirm</button>
                    <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => setOpenModal(false)}>Cancel</button>
                </Modal.Footer>
            }
        </Modal>
    </>)
}