import { PackageSearch, Home, Store, Shirt, MessageCircle } from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { Link } from "react-router-dom";

export default function VendorSidebar() {
    return (<Sidebar>
        <Link to="/vendor/dashboard">
            <SidebarItem icon={<Home size={20} />} text="Dashboard" />
        </Link>

        <SidebarItem icon={<Shirt size={20} />} text="Product"
            subitems={[
                { text: "Add Product", href: "/add-product" },
                { text: "Manage Product", href: "/manage-product" },
                // Add more subitems as needed
            ]} />

        <Link to="/manage-order">
            <SidebarItem icon={<PackageSearch size={20} />} text="Orders" />
        </Link>

        <Link to="/vendor-chat">
            <SidebarItem icon={<MessageCircle size={20} />} text="Chat" />
        </Link>

        <SidebarItem icon={<Store size={20} />} text="Manage Shop"

            subitems={[
                { text: "Information", href: "/edit-vendor-profile" },
                { text: "Decoration", href: "/edit-store" },
            ]} />
    </Sidebar>)
}

