import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserContext } from '../../Context/UserContext'

export default function LogInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const { user, setUser } = useContext(UserContext);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
        if (error) {
            notify(error);
        }
    }, [error]);

    const notify = (error) => {
        toast.error(error, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            pauseOnHover: false,
            theme: "light",
        });
    }

    const axiosPostData = async () => {
        const postData = {
            email: email, password: password
        }

        await axios.post('http://localhost:4000/login', postData, { withCredentials: true })
            .then(res => {
                setUser(res.data.user);
                setError(res.data.message);
                if (rememberMe) {
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);
                }
            })
            .catch(er => {
                console.log(er);
            });

    };

    const googleLogin = async () => {
        const loginWindow = window.open("http://localhost:4000/auth/google", "_blank");

        window.addEventListener('message', (event) => {
            if (event.origin !== "http://localhost:4000/") return;

            const { data } = event;
            if (data.user) {
                setUser(data.user);
            } else if (data.error) {
                setError(data.error);
            }
            loginWindow.close();
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosPostData();
        if (error) {
            notify(error);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
            {user && user.role === "User" && <Navigate to="/" replace={true} />}
            {user && user.role === "Admin" && <Navigate to="/admin/dashboard" replace={true} />}
            {user && user.role === "Vendor" && <Navigate to="/vendor/dashboard" replace={true} />}
            {user && user.role === "Shipper" && <Navigate to="/shipper/dashboard" replace={true} />}
            <section className="bg-white ">
                <div className="py-8 lg:py-16 px-8 mx-auto max-w-screen-md">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">Sign In</h2>
                    <p className="mb-5 lg:mb-7 font-light text-center text-gray-500 sm:text-xl">Welcome back, We hope you have a great day!</p>

                    <div className="p-4 rounded-lg bg-gray-50">
                        <form name="SignIn" className="space-y-6">
                            <div>
                                <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                <div className="mt-2">
                                    <input type="text" id="email" name="email" required defaultValue={email} className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Email must be in the format: name@domain.com" onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label for="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div className="mt-2">
                                    <input id="password" name="password" type="password" defaultValue={password} required className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Password must contain at least one upper case letter, at least one lower case letter, at least one digit, at least one special letter, has a length from 8 to 20 characters." onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <div>
                                    <input id="terms" type="checkbox" checked={rememberMe} onChange={() => setRememberMe(prev => !prev)} value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " />
                                    <label className="ms-2 text-sm font-medium text-gray-900" >Remember Me</label>
                                </div>
                                <div>
                                    <Link to="/forgot-password" className="ms-2 text-sm font-medium text-blue-600 hover:underline">Forgot password?</Link>
                                </div>
                            </div>
                            <div>
                                <button type="submit" onClick={handleSubmit} className="flex w-full justify-center rounded-md bg-[#222160] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign In</button>
                            </div>
                            <div className="relative flex mt-3 items-center">
                                <div className="flex-grow border-t border-gray-400"></div>
                                <span className="flex-shrink mx-2 text-gray-400">OR</span>
                                <div className="flex-grow border-t border-gray-400"></div>
                            </div>
                            <div className="mt-4">
                                <button className="border-2 flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 gap-2 w-full hover:bg-transparent hover:text-indigo-600" onClick={googleLogin}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                    </svg>
                                    Sign in with Google</button>
                            </div>
                            <div className="mt-6 flex justify-center items-center gap-1">
                                <p className="font-medium text-base">Don't have an account yet?</p>
                                <button className="font-semibold leading-6 text-[#222160] hover:text-[#000053]" >
                                    <Link to='/register'>
                                        Sign up
                                    </Link>
                                </button>
                            </div>

                            <div className="mt-6 flex justify-center items-center gap-1">
                                <p className="font-medium text-base">Forgot to verify your email?</p>
                                <button className="font-semibold leading-6 text-[#222160] hover:text-[#000053]" >
                                    <Link to='/verify-email'>
                                        Verify email
                                    </Link>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}