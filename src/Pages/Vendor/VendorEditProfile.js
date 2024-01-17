import '../../css/profile.css'
import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../Context/UserContext';
import { ToastContainer, toast } from 'react-toastify'
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
export default function VendorEditProfile() {
  const [address, setAddress] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [file, setFile] = useState()
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(false);

  const notify = (error) => {
    toast.error(error, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      pauseOnHover: false,
      theme: "light",
    });
  }

  const success = (success) => {
    toast.success(success, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      pauseOnHover: false,
      theme: "light",
    });
  }

  const handleFileChange = (event) => {
    event.preventDefault()
    setFile(event.target.files[0]);
  };

  const data = {
    phoneNumber: phoneNumber,
    address: address,
    file: file,
  }

  async function axiosPostData() {
    try {
      setLoading(true);
      await axios.post('http://localhost:4000/update-vendor', data, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => {
          setMsg(res.data)
          setError('')
          setLoading(false)
        })
        .catch(er => { setError(er.response.data); setMsg() });
    } catch (error) {
      console.error('Failed to update.', error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosPostData();
    if (error) {
      notify(error);
    }
  }

  useEffect(() => {
    error && notify(error)
    msg && success(msg)
  }, [error, msg]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 bg-gray-100 mb-10 pb-5 w-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-hidden">
      {error && <Navigate to='/login' replace={true} />}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div>
        <h2 className="font-bold   text-black lg:md:text-2xl text-lg mt-8">Shop Profile</h2>
        <Link to="/edit-store" className='font-medium  lg:md:pt-1  text-gray-500 text-xs lg:md:text-base mb-3'>Edit Shop Frontpage</Link>
        <div className="border-b border-gray-900/10 pb-12">

          <div className="mt-5">
            <label for="photo" className="block text-sm font-medium leading-6 text-gray-900">Avatar picture</label>
            <div className="mt-2 flex items-center gap-x-8">
              {user && (user.img ? <img className="inline-block xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-8 sm:h-8 xs:w-5 xs:h-5 rounded-full object-fit ring-2 ring-white"
                src={`data:image/jpeg;base64,${user.img}`}
                alt="avatar_img" /> : <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
              </div>)}
              <input type="file" onChange={handleFileChange} id="fileUpload" name="photo" accept="image/*" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label for="address" className="block text-sm font-medium leading-6 text-gray-900">Address</label>
              <div className="mt-2">
                <input onChange={(e) => setAddress(e.target.value)} id="address" name="address" placeholder={user && user.address} type="text" autocomplete="address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                </input>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label for="phone" className="block text-sm font-medium leading-6 text-gray-900">Phone number</label>
              <div className="mt-2">
                <input onChange={(e) => setPhoneNumber(e.target.value)} id="phone" placeholder={user && user.phoneNumber} name="phone" type="phone" autocomplete="address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                </input>
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="reset" class="rounded-md px-3 py-2 text-sm font-semibold shadow-sm border-solid border-2  hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} type="submit" class={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 text-white'}`}>Save changes</button>
          </div>
        </div>
      </div>

    </div>
  )
}