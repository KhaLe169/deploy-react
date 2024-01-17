import axios from "axios";
import { Tabs } from "flowbite-react";
import { Table } from "flowbite-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { HiUserCircle, HiTruck } from "react-icons/hi";
import { FaShoppingBag } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import Pagination from "../../Components/Pagination";
import SearchBox from "../../Components/SearchBox";
import { UserContext } from "../../Context/UserContext";

export default function ManageUserPage() {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useContext(UserContext)

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/manage-user", { withCredentials: true })
      setUsers(res.data.users);
      setVendors(res.data.vendors);
      console.log(res.data.vendors);
      setShippers(res.data.shippers);
      setIsLoading(false)
    }
    catch (error) {
      setError(error);
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
    <div className="max-w-full px-4 sm:px-6 lg:px-8 bg-gray-100 mb-10 pb-5 w-full">
      {error && <Navigate to={"/"} replace />}
      <div>
        <Tabs aria-label="Full width tabs" style="fullWidth">
          {/* Admin manage customer account */}
          <Tabs.Item active title="Customer" icon={HiUserCircle}>
            <UserTable data={users} type="user" />
          </Tabs.Item>
          {/* Admin manage vendor account */}
          <Tabs.Item title="Vendor" icon={FaShoppingBag}>
            <UserTable data={vendors} type="vendor" />
          </Tabs.Item>
          {/* Admin manage shipper account */}
          <Tabs.Item title="Shipper" icon={HiTruck}>
            <UserTable data={shippers} type="shipper" />
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
}

function filterUsers(users, searchTerm) {
  const regex = new RegExp(searchTerm, 'i');
  return users.filter(user => regex.test(user.email) || regex.test(user.name) || regex.test(user.phoneNumber) || regex.test(user.address) || regex.test(user.distributionHub));
}

function UserTable({ data, dataImage, type }) {
  const [dataSlice, setDataSlice] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (searchTerm) ? setDataSlice(filterUsers(data, searchTerm)) : setDataSlice(data.slice(0, 10))
  }, [searchTerm, data])

  useEffect(() => {
    setDataSlice(data.slice(0, 10));
  }, [data, dataImage]);

  const getHeadCellContent = () => {
    switch (type) {
      case 'vendor':
      case 'user':
        return (
          <>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Phone Number</Table.HeadCell>
            <Table.HeadCell>Default Address</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>View</Table.HeadCell>
          </>
        );
      case 'shipper':
        return (
          <>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Phone Number</Table.HeadCell>
            <Table.HeadCell>Default Address</Table.HeadCell>
            <Table.HeadCell>Distribution Hub</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>View</Table.HeadCell>
          </>
        );
      default:
        return null;
    }
  }

  const getCellContent = (item) => {
    switch (type) {
      case 'user':
        return (
          <>
            <Table.Cell>{item.phoneNumber}</Table.Cell>
            <Table.Cell>{item.address}</Table.Cell>
          </>
        );
      case 'vendor':
        return (
          <>
            <Table.Cell>{item.phoneNumber}</Table.Cell>
            <Table.Cell>{item.address}</Table.Cell>
          </>
        );
      case 'shipper':
        return (
          <>
            <Table.Cell>{item.phoneNumber}</Table.Cell>
            <Table.Cell>{item.address}</Table.Cell>
            <Table.Cell>{item.distributionHub}</Table.Cell>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-4 bg-gray-100">
        <div className="relative">
          <div class="flex items-center justify-end flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4">
            <SearchBox setSearchTerm={setSearchTerm} />
          </div>
          <Table hoverable>
            <Table.Head>
              {getHeadCellContent()}
            </Table.Head>
            {dataSlice.map((item, i) => (
              <>
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white">
                    <Table.Cell className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                      <img src={(dataSlice[i].img) ? `data:image/jpeg;base64,${dataSlice[i].img}` : require("../../Components/images/defaultUserImage.png")} className="w-10 h-10 aspect-square object-cover rounded-full" alt="avatar_img" />
                      <div class="ps-3">
                        <div class="text-base font-medium">{item.name}</div>
                        <div class="font-normal text-gray-500">
                          {item.email}
                        </div>
                      </div>
                    </Table.Cell>
                    {getCellContent(item)}
                    <Table.Cell>
                      <div class="flex items-center whitespace-nowrap">
                        <div class={`h-2.5 w-2.5 rounded-full me-2 ${item.reportCount ? "bg-red-500" : "bg-green-500"}`}></div>
                        {item.reportCount ? "Reported" : "No Report"}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/admin/${item._id}/report`}
                        className="font-medium text-cyan-600 hover:underline"
                      >
                        View
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </>
            ))}
          </Table>
        </div>
      </div>
      {!searchTerm && Math.ceil(data.length / 10) > 1 && <Pagination pages={Math.ceil(data.length / 10)} setDataSlice={setDataSlice} data={data} />}
    </>
  )
}

