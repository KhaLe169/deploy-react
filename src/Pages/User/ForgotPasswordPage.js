import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ForgotPassword() {
    const [error, setError] = useState('')
    const [checkBox, setcheckBox] = useState(false);
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (error) {
            notify(error);
        }
        if (msg) {
            success(msg);
        }
    }, [error, msg]);

    const success = (msg) => {
        toast.success(msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

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

    async function axiosPostData() {
        const data = {
            email: email
        }
        if (!email) { setError('The field is empty'); return }
        if (!checkBox) { setError('The field is empty'); return }
        await axios.post("http://localhost:4000/forgot-password", data, { withCredentials: true })
            .then(res => { setMsg(res.data.msg) })
            .catch(er => { console.log(er) });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosPostData();
        if (msg && email && checkBox) {
            success(msg);
            return;
        }

        if (error && (!email || !checkBox)) {
            notify(error);
            return;
        }
    }
    
    return <>
        <ToastContainer
            position="top-center"
            autoClose={5000}
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
            <div className="mx-auto">
                <div className="flex flex-col items-center mx-auto py-10 xs:px-10">
                    <div className="w-full px-6 rounded-lg shadow dark:border md:mt-0 sm:max-w-md bg-gray-50 border-gray-50 sm:p-8">
                        <div className="flex flex-row items-center">
                            <button className="border-black">
                                <Link to="/login" className="text-2xl text-[#E61E2A]">
                                    <i className="fa-solid fa-arrow-left"></i>
                                </Link>
                            </button>
                            <h1 className="ml-10 text-2xl font-bold leading-tight tracking-tight text-[#000053] md:text-2xl xs:text-xl xs:ml-4">Forgot your password?</h1>
                        </div>

                        <hr className="h-px my-5 bg-gray-300 border-0"></hr>
                        <p className="font-light text-gray-500 xs:text-xs">Don't freak out! Just type in your email and we will send you a code to reset your password!</p>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                            <div>
                                <label for="email" className="block mb-2 text-md font-medium text-gray-900">Your email</label>
                                <div className="mt-2">
                                    <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 shadow-md" placeholder="Enter your email address" />
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" onChange={() => setcheckBox(prevState => !prevState)} className="w-4 h-4 border border-gray-500 rounded bg-white focus:ring-3 focus:ring-primary-300" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label for="terms" className="font-light sm:text-sm text-md text-gray-900">I accept the <span className="font-medium text-primary-600 hover:underline">Terms and Conditions</span></label>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center my-5">
                                <button type="submit" onClick={handleSubmit} className="flex w-1/2 justify-center rounded-md bg-[#222160] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send Email</button>

                                <div className="my-5">
                                    <label for="terms" className="font-light sm:text-sm text-md text-gray-900 text-center">If you still need help, contact <span className="font-medium text-[#E61E2A] hover:underline text-center" href="#">rBuy support.</span></label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </>
}