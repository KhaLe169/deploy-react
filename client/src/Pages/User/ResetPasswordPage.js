import axios from 'axios'
import { Link, useParams } from "react-router-dom"
import { Navigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoadingPage from './LoadingPage'

export default function ResetPassword() {
    const params = useParams();
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [checkBox, setCheckBox] = useState('')
    const [error, setError] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [navigate, setNavigate] = useState(false);
    const [msg, setMsg] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const notify = (error) => {
        toast.error(error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            pauseOnHover: false,
            theme: "light",
        });
    }

    const success = (msg) => {
        toast.success(msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            pauseOnHover: false,
            theme: "light",
        });
    }

    const fetchData = useCallback(async () => {
        await axios.get(`http://localhost:4000/user/${params.token}/forgot-password`, { withCredentials: true })
            .then(res => {
                setUserEmail(res.data.userEmail.user)
                setIsLoading(false)
            }).catch(er => {
                window.location.href = '/login'
            })
    }, [params.token])

    useEffect(() => {
        fetchData();
        error && notify(error)
        msg && success(msg)
    }, [error, msg, fetchData])


    const postData = async () => {
        if (!password) { setError('The field is empty'); return }
        if (!confirmPassword) { setError('The field is empty'); return }
        if (!checkBox) { setError('The field is empty'); return }

        if (password !== confirmPassword) {
            setError("Password confirmation does not match the password. Please try again.");
            return;
        }

        const data = {
            userEmail: userEmail,
            password: password,
        }

        await axios.post(`http://localhost:4000/user/${params.token}/forgot-password`, data, { withCredentials: true })
            .then(res => {
                setMsg(res.data.msg)
                setTimeout(() => setNavigate(true), 5000); // navigate after 5 seconds
            })
            .catch(er => { console.log(er) })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        postData();
        if (error) notify(error);
        if (msg) success(msg);
    }

    if (isLoading) {
        return <LoadingPage />
    }

    return (<>
        {!userEmail && <Navigate to="/login" replace={true} />}
        {navigate && <Navigate to="/login" replace={true} />}
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
        <section className="bg-white">
            <div className="mx-auto max-w-screen-md">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full p-6 bg-gray-50 border-gray-50 rounded-lg shadow dark:border md:mt-0 sm:max-w-md sm:p-8">
                        <h2 className="mb-1 text-2xl font-bold leading-tight tracking-tight text-[#000053] md:text-xl">Password Reset</h2>
                        <p className="my-2 text-md font-light leading-tight tracking-tight text-gray-900 md:text-sm">Your New Password should different from Old Password</p>

                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                            <div>
                                <label for="password" className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 shadow-md" />
                            </div>
                            <div>
                                <label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                                <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" onChange={(e) => setConfirmPassword(e.target.value)} className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 shadow-md" />
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" onChange={() => setCheckBox(prevState => !prevState)} className="w-4 h-4 border border-gray-500 rounded bg-white focus:ring-3 focus:ring-primary-300" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label for="terms" className="font-light sm:text-sm text-md text-gray-900">I accept the <span className="font-medium text-primary-600 hover:underline">Terms and Conditions</span></label>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center my-5">
                                <button type="submit" onClick={handleSubmit} className="flex w-1/2 justify-center rounded-md bg-[#222160] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save New Password</button>

                                <div className="my-5">
                                    <label for="terms" className="font-light sm:text-sm text-md text-gray-900 text-center">Back to <Link className="font-medium text-[#E61E2A] text-md hover:underline text-center" to="/login">Login</Link></label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </>)
}