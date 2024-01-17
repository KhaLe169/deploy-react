import { useContext, useState } from "react"
import { UserContext } from '../Context/UserContext'
import { Link } from "react-router-dom";

export default function UserSidebar({ activeMenu }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
    const { user } = useContext(UserContext)

    const handleSidebarToggle = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <>
            {/* <!-- SIDEBAR --> */}
            <div className={`absolute left-0 top-24 h-[90%] transition-all overflow-hidden w-64 bg-white border-r border-gray-200 bottom-0 ${isSidebarCollapsed ? 'sidebar-collapse' : ''} z-4`} id="sidebar">
                <div class="relative p-4 pb-2 flex justify-between items-center">
                    <img src="" class="overflow-hidden transition-all w-32" alt=""></img>
                    <button class="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-first cursor-pointer toggle-sidebar " onClick={handleSidebarToggle}><path d="m17 18-6-6 6-6"></path>
                            <path d="M7 6v12"></path></svg>
                    </button>
                </div>
                <span className="p-4 flex items-center gap-4 hover:bg-blue-50">
                    <span href="#" className="flex items-center gap-4 hover:bg-blue-50" onClick={handleSidebarToggle}>
                        <img src={(user && user.img) ? `data:image/jpeg;base64,${user.img}` : require("../Components/images/defaultUserImage.png")} className="w-16 aspect-square object-cover rounded" alt="" />
                        <div className="whitespace-nowrap sidebar-user-profile">
                            <span className="py-1 px-2 rounded-full bg-yellow-500 text-white text-sm font-medium">Golden Membership</span>
                        </div>
                    </span>
                </span>
                <div className="py-4">
                    <span className="text-sm text-gray-500 uppercase ml-4 inline-block mb-2 sidebar-menu-title">Menu</span>
                    <ul className="sidebar-menu">
                        <li>
                            <Link to="/profile" className={(activeMenu === "profile") ? "active" : ""} >
                                <i className='bx bx-user-circle sidebar-menu-icon' ></i>
                                Account
                            </Link>
                        </li>
                        <li>
                            <Link to="/user-order" className={(activeMenu === "order") ? "active" : ""} >
                                <i className='bx bx-receipt sidebar-menu-icon'></i>
                                Order
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>


            <div className="pl-0 md:pl-64 transition-all" id="main">

                <div class="p-4 flex justify-between items-center visible md:hidden">
                    <button class="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-last cursor-pointer toggle-sidebar " onClick={handleSidebarToggle}>
                            <path d="m7 18 6-6-6-6"></path>
                            <path d="M17 6v12"></path>
                        </svg>
                    </button>
                </div>
            </div>


        </>
    )
}