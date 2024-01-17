import axios from "axios";
import { useSearchBox } from "react-instantsearch";
import { useState, useCallback, useEffect } from "react";
import { Modal } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function VandorNav({ user, vendor, activeTab, coverPhoto, numberOfFollowers, numberOfProducts, setFollow, follow }) {
  const { refine } = useSearchBox();
  const [openModal, setOpenModal] = useState(false)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [files, setFiles] = useState();

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  async function reportProduct() {
    try {
      setLoading(true);
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append('files', files[i]);
      }
      fd.append('vendorID', vendor._id);
      fd.append('title', title);
      fd.append('description', description);
      await axios.post('http://localhost:4000/report-vendor', fd, { withCredentials: true })
        .then(res => {
          setError('')
          setMsg(res.data)
          setLoading(false)
        })
        .catch(error => {
          setError("Failed to report!" + error)
          setLoading(false)
        });
    } catch (error) {
      console.error('Failed to report.', error);
    }
  }

  const handleReport = (e) => {
    e.preventDefault();
    reportProduct();
    if (error) {
      notify(error);
    }
  }

  const fetchData = useCallback(async () => {
    try {
      await axios.get(`http://localhost:4000/check-follow/${vendor._id}/${user._id}`, { withCredentials: true })
        .then(res => {
          setFollow(res.data.following);
        })
    } catch (error) {
      console.error(error);
    }
  }, [vendor._id, user])

  const handleUnfollow = async () => {
    const data = {
      vendorID: vendor._id,
      userID: user._id
    }
    try {
      await axios.post("http://localhost:4000/unfollow-vendor", data, { withCredentials: true })
        .then(res => {
          setFollow(res.data.following);
        })
    } catch (error) {
      console.error(error);
    }
  }

  const handleFollow = async () => {
    const data = {
      vendorID: vendor._id,
      userID: user._id
    }
    try {
      await axios.post("http://localhost:4000/follow-vendor", data, { withCredentials: true })
        .then(res => {
          setFollow(res.data.following);
        })
    } catch (error) {
      console.error(error);
    }
  }

  const getTabClass = (tabName) => {
    return `border-b-2 px-2 py-3 duration-700 transition ${activeTab === tabName ? 'border-black' : 'border-transparent hover:border-black'
      }`;
  };

  const createThread = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/chat", { vendorId: vendor._id }, { withCredentials: true });
      localStorage.setItem("threadId", res.data.thread._id);
      window.location.href = "/chat";
    } catch (err) {
      console.log(err);
    }
  }

  const notify = useCallback(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });
    }

    if (msg) {
      toast.success(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });
    }
  }, [error, msg]);

  useEffect(() => {
    if (error || msg) {
      notify();
    }
  }, [error, msg, notify]);

  useEffect(() => {
    user && fetchData();
  }, [fetchData, user])

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      {/* Profile Section */}
      <div class="md:container mx-auto">
        <img class="h-auto max-w-full" src={coverPhoto} alt="" />
        <div class="md:flex my-3 md:justify-between px-4 md:px-0">
          <div class="flex items-center gap-4">
            {vendor &&
              (vendor.img ? (
                <img
                  className="inline-block xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-8 sm:h-8 xs:w-5 xs:h-5 rounded-full object-fit ring-2 ring-white"
                  src={`data:image/jpeg;base64,${vendor.img}`}
                  alt="avatar_img"
                />
              ) : (
                <div class="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full">
                  <svg
                    class="absolute w-20 h-24 text-gray-400 -left-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              ))}
            <div class="font-medium">
              <div class="text-2xl">{vendor && vendor.businessName}</div>
              <div class="text-base text-gray-500 mb-2">
                <span class="border-r border-black pr-3">
                  {numberOfFollowers} follower(s)
                </span>
                <span class="pl-2">{numberOfProducts} product(s)</span>
              </div>
              <div>
                {user && (
                  <button
                    onClick={(e) => createThread(e)}
                    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    <i class="fa-regular fa-comment-dots"></i> Chat
                  </button>
                )}
                {user &&
                  (follow ? (
                    <button
                      onClick={handleUnfollow}
                      type="button"
                      class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    >
                      <i class="fa-solid fa-check"></i> Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      type="button"
                      class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    >
                      <i class="fa-regular fa-plus"></i> Follow
                    </button>
                  ))}
                <div
                  className="font-medium text-[#E61E2A] hover:underline"
                  onClick={() => setOpenModal(true)}
                >
                  {" "}
                  Report{" "}
                </div>
                <Modal
                  show={openModal}
                  onClose={() => setOpenModal(false)}
                  className="!my-auto"
                >
                  <Modal.Header>
                    <div>
                      <p className="font-semibold text-lg line-clamp-1">
                        Reporting Appliances Shop
                      </p>
                    </div>
                  </Modal.Header>
                  <Modal.Body className="overflow-y-auto">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      name="reportedReason"
                      id="reportedReason"
                      className="w-full my-2"
                      placeholder="Report Title"
                    />
                    <div className="my-2">
                      <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        id="w3review"
                        name="w3review"
                        rows="4"
                        cols="50"
                        placeholder="Report Description (10-50 character allowed)"
                        className="w-full"
                      ></textarea>
                    </div>
                    <p>Upload proof images</p>
                    <input
                      onChange={handleFileChange}
                      type="file"
                      name="files"
                      id="files"
                      className="w-full my-2"
                      accept="image/*" // Specify the file types allowed, adjust as needed
                      multiple // Allow multiple files to be selected
                    />
                  </Modal.Body>

                  <Modal.Footer>
                    <button
                      onClick={handleReport}
                      disabled={loading}
                      type="button"
                      class={`text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ${
                        loading ? "cursor-not-allowed" : ""
                      }`}
                    >
                      Send Report
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Nav */}
      <div div class="md:container mx-auto my-2 sticky top-0 border-b bg-white">
        <div class="px-4 py-2 mx-auto md:flex md:justify-between">
          <div class="md:order-last drop-shadow-md mt-2">
            <form>
              <div class="relative">
                {activeTab === "PRODUCTS" && (
                  <>
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      class="block w-full py-4 px-8 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Search in ${vendor && vendor.businessName}`}
                      onChange={(e) => refine(e.target.value)}
                    />
                  </>
                )}
              </div>
            </form>
          </div>
          <div class="flex items-center">
            <ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm py-3">
              <li className={getTabClass("HOME")}>
                <Link
                  to={vendor ? `/vendor/${vendor._id}/home` : ""}
                  class="text-gray-900hover:underline text-sm font-light md:text-lg"
                  aria-current="page"
                >
                  HOME
                </Link>
              </li>
              <li className={getTabClass("PRODUCTS")}>
                <Link
                  to={vendor ? `/vendor/${vendor._id}/product` : ""}
                  class="text-gray-900hover:underline text-sm md:text-lg font-light"
                >
                  PRODUCTS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
