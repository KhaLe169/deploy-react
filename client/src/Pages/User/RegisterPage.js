import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RegisterPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [distributionHub, setDistributionHub] = useState('')
    const [checkBox, setcheckBox] = useState(false)
    const [error, setError] = useState('')
    const [msg, setMsg] = useState('')
    const [formType, setFormType] = useState('customer')

    useEffect(() => {
        error && notify(error)
        msg && success(msg)
    }, [error, msg]);

    const data = {
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        address: address,
    }

    const notify = (error) => {
        toast.error(error, {
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

    const success = (error) => {
        toast.success(error, {
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

    async function axiosPostData() {
        try {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            switch (formType) {
                case 'customer':
                    data.name = name;
                    if (!(email && password && phoneNumber && address && name && checkBox)) {
                        setError("The field is empty");
                        setMsg('')
                        return;
                    }
                    if (!passwordPattern.test(password)) {
                        setError("Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.");
                        setMsg('')
                        return;
                    }
                    await axios.post('http://localhost:4000/user-register', data, { withCredentials: true })
                        .then(res => {
                            setMsg(res.data)
                            setError('')
                        })
                        .catch(er => { setError(er.response.data); setMsg() });
                    break;
                case 'business':
                    data.businessName = businessName;
                    if (!(email && password && phoneNumber && address && businessName && checkBox)) {
                        setError("The field is empty");
                        setMsg('');
                        return;
                    }
                    if (!passwordPattern.test(password)) {
                        setError("Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.");
                        setMsg('')
                        return;
                    }
                    await axios.post('http://localhost:4000/vendor-register', data, { withCredentials: true })
                        .then(res => {
                            setMsg(res.data)
                            setError('')
                        })
                        .catch(er => { setError(er.response.data); setMsg() });
                    break;
                case 'shipper':
                    data.name = name;
                    data.distributionHub = distributionHub;
                    if (!(email && password && phoneNumber && address && name && distributionHub)) {
                        setError("The field is empty");
                        setMsg('')
                        return;
                    }
                    if (!passwordPattern.test(password)) {
                        setError("Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.");
                        setMsg('')
                        return;
                    }
                    await axios.post('http://localhost:4000/shipper-register', data, { withCredentials: true })
                        .then(res => {
                            setMsg(res.data)
                            console.log(res.data)
                            setError('')
                        })
                        .catch(er => { setError(er.response.data); setMsg() });
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosPostData();
        if (error) {
            notify(error);
        }
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
            <section class="bg-white">
                <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                    <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">Sign Up</h2>
                    <p class="mb-5 lg:mb-7 font-light text-center text-gray-500 sm:text-xl">Already have account?
                        <Link to="/login" class="font-semibold leading-6 text-[#222160] hover:text-[#000053]"> Sign In</Link>
                    </p>
                    <div className="mb-4 border-b border-gray-200">
                        <ul className="text-lg flex justify-center flex-wrap -mb-px font-medium text-center " role="tablist">
                            <li className="me-2" role="presentation">
                                <button onClick={() => setFormType('customer')} className={`inline-block p-4 border-b-2 rounded-t-lg ${formType === 'customer' ? 'border-[#222160] bg-gray-50' : 'hover:text-gray-600 hover:border-gray-300'}`} role="tab" aria-selected={formType === 'customer'}>Personal Account</button>
                            </li>
                            <li className="me-2" role="presentation">
                                <button onClick={() => setFormType('business')} className={`inline-block p-4 border-b-2 rounded-t-lg ${formType === 'business' ? 'border-[#222160] bg-gray-50' : 'hover:text-gray-600 hover:border-gray-300'}`} role="tab" aria-selected={formType === 'business'}>Business Account</button>
                            </li>
                            <li role="presentation">
                                <button onClick={() => setFormType('shipper')} className={`inline-block p-4 border-b-2 rounded-t-lg ${formType === 'shipper' ? 'border-[#222160] bg-gray-50' : 'hover:text-gray-600 hover:border-gray-300'}`} role="tab" aria-selected={formType === 'shipper'}>Shipper</button>
                            </li>
                        </ul>
                    </div>
                    {/* <!-- Form of Customer --> */}
                    <div id="default-tab-content">
                        {formType === 'customer' && (
                            <div class=" p-4 rounded-lg bg-gray-50" id="customer" role="tabpanel" aria-labelledby="customer-tab">
                                {/* <!-- Sign up form of customer, name="signup-customer" --> */}
                                <form name="signup-customer" class="space-y-6">
                                    <div>
                                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                        <div class="mt-2">
                                            <input type="text" id="email" name="email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" onChange={(e) => { setEmail(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Email must be in the format: name@domain.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                        <div class="mt-2">
                                            <input id="password" name="password" type="password" pattern="(!@#$%^&*+ {8, 20}" onChange={(e) => { setPassword(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Password must contain at least one upper case letter, at least one lower case letter, at least one digit, at least one special letter, has a length from 8 to 20 characters." />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                        <div class="mt-2">
                                            <input type="text" name="name" id="name" onChange={(e) => { setName(e.target.value); setError() }} required minlength="5" title="Please enter at least 5 characters" class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="phoneNumber" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                                        <div class="mt-2 flex">
                                            <span class="inline-flex items-center px-3 text-sm bg-gray-200 border border-e-0 border-gray-300 rounded-s-md text-gray-400 shadow-sm ">
                                                <p>(+84)</p>
                                            </span>
                                            <input type="tel" name="phoneNumber" id="phoneNumber" pattern="^(\+84)?[0-9]{8,}$" onChange={(e) => { setPhoneNumber(e.target.value); setError() }} required class="p-2 block w-full rounded-none rounded-e-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
                                        <div class="mt-2">
                                            <input type="text" name="address" id="address" minlength="5" onChange={(e) => { setAddress(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="terms" type="checkbox" onChange={() => setcheckBox(prevState => !prevState)} value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " required />
                                        </div>
                                        <label for="terms" class="ms-2 text-sm font-medium text-gray-900 ">I agree with the <span data-modal-target="default-modal" data-modal-toggle="default-modal" class="text-blue-600 hover:underline">terms and conditions</span></label>
                                        {/* <!-- Main modal --> */}
                                        <div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                            <div class="relative p-4 w-full max-w-2xl max-h-full">
                                                {/* <!-- Modal content --> */}
                                                <div class="relative bg-white rounded-lg shadow">
                                                    {/* <!-- Modal header --> */}
                                                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                                        <h3 class="text-xl font-semibold text-gray-900">
                                                            Terms of Service
                                                        </h3>
                                                        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                                                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                            </svg>
                                                            <span class="sr-only">Close modal</span>
                                                        </button>
                                                    </div>
                                                    {/* <!-- Modal body --> */}
                                                    <div class="p-4 md:p-5 space-y-4">
                                                        <p class="text-base leading-relaxed text-gray-500">
                                                            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                                        </p>
                                                        <p class="text-base leading-relaxed text-gray-500">
                                                            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" onClick={handleSubmit} class="flex w-full justify-center rounded-md bg-[#222160] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000053]">Create Account</button>
                                    </div>
                                </form>
                            </div>
                        )}


                        {/* <!-- Form of Bussiness --> */}
                        {formType === 'business' && (
                            <div class=" p-4 rounded-lg bg-gray-50" id="business" role="tabpanel" aria-labelledby="business-tab">
                                {/* <!-- Sign up form of business, name="signup-business" --> */}
                                <form name="signup-business" class="space-y-6">
                                    <div>
                                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                        <div class="mt-2">
                                            <input type="text" id="email" name="email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" onChange={(e) => { setEmail(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Email must be in the format: name@domain.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                        <div class="mt-2">
                                            <input id="password" name="password" type="password" pattern="(!@#$%^&*+ {8, 20}" onChange={(e) => { setPassword(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Password must contain at least one upper case letter, at least one lower case letter, at least one digit, at least one special letter, has a length from 8 to 20 characters." />
                                        </div>
                                    </div>
                                    {/* <div>
                                    <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                    <div class="mt-2">
                                        <input type="text" name="name" id="name" required minlength="5" title="Please enter at least 5 characters" class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6"/>
                                    </div>
                                </div> */}
                                    <div>
                                        <label for="phoneNumber" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                                        <div class="mt-2 flex">
                                            <span class="inline-flex items-center px-3 text-sm bg-gray-200 border border-e-0 border-gray-300 rounded-s-md text-gray-400 shadow-sm ">
                                                <p>(+84)</p>
                                            </span>
                                            <input type="tel" name="phoneNumber" id="phoneNumber" pattern="^(\+84)?[0-9]{8,}$" onChange={(e) => { setPhoneNumber(e.target.value); setError() }} required class="p-2 block w-full rounded-none rounded-e-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="businessName" class="block text-sm font-medium leading-6 text-gray-900">Business Name</label>
                                        <div class="mt-2">
                                            <input type="text" name="businessName" id="businessName" required minlength="5" onChange={(e) => { setBusinessName(e.target.value); setError() }} title="Please enter at least 5 characters" class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    {/* <div>
                                    <label for="businessPhone" class="block text-sm font-medium leading-6 text-gray-900">Business Phone Number</label>
                                    <div class="mt-2 flex">
                                        <span class="inline-flex items-center px-3 text-sm bg-gray-200 border border-e-0 border-gray-300 rounded-s-md text-gray-400 shadow-sm ">
                                            <p>(+84)</p>
                                        </span>
                                        <input type="tel" name="businessPhone" id="businessPhone" pattern="^(\+84)?[0-9]{8,}$" required class="p-2 block w-full rounded-none rounded-e-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6"/>
                                    </div>
                                </div> */}
                                    <div>
                                        <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Business Address</label>
                                        <div class="mt-2">
                                            <input type="text" name="address" id="address" minlength="5" required onChange={(e) => { setAddress(e.target.value); setError() }} class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="terms" type="checkbox" onChange={() => setcheckBox(prevState => !prevState)} value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " required />
                                        </div>
                                        <label for="terms" class="ms-2 text-sm font-medium text-gray-900 ">I agree with the <span data-modal-target="business-modal" data-modal-toggle="business-modal" class="text-blue-600 hover:underline">terms and conditions</span></label>
                                    </div>
                                    {/* <!-- Main modal --> */}
                                    <div id="business-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                        <div class="relative p-4 w-full max-w-2xl max-h-full">
                                            {/* <!-- Modal content --> */}
                                            <div class="relative bg-white rounded-lg shadow">
                                                {/* <!-- Modal header --> */}
                                                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                                    <h3 class="text-xl font-semibold text-gray-900">
                                                        Terms of Service
                                                    </h3>
                                                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="business-modal">
                                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                        </svg>
                                                        <span class="sr-only">Close modal</span>
                                                    </button>
                                                </div>
                                                {/* <!-- Modal body --> */}
                                                <div class="p-4 md:p-5 space-y-4">
                                                    <p class="text-base leading-relaxed text-gray-500">
                                                        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                                    </p>
                                                    <p class="text-base leading-relaxed text-gray-500">
                                                        The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" onClick={handleSubmit} class="flex w-full justify-center rounded-md bg-[#222160] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000053]">Create Account</button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {/* <!-- Form of Shipper --> */}

                        {formType === 'shipper' && (
                            <div class=" p-4 rounded-lg bg-gray-50" id="shipper" role="tabpanel" aria-labelledby="shipper-tab">
                                {/* <!-- Sign up form of shipper, name="signup-shipper" --> */}
                                <form name="signup-shipper" class="space-y-6">
                                    <div>
                                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                        <div class="mt-2">
                                            <input type="text" id="email" name="email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" onChange={(e) => { setEmail(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Email must be in the format: name@domain.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                        <div class="mt-2">
                                            <input id="password" name="password" type="password" pattern="(!@#$%^&*+ {8, 20}" onChange={(e) => { setPassword(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" aria-describedby="usernameHelp" title="Password must contain at least one upper case letter, at least one lower case letter, at least one digit, at least one special letter, has a length from 8 to 20 characters." />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                        <div class="mt-2">
                                            <input type="text" name="name" id="name" required minlength="5" title="Please enter at least 5 characters" onChange={(e) => { setName(e.target.value); setError() }} class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="phoneNumber" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                                        <div class="mt-2 flex">
                                            <span class="inline-flex items-center px-3 text-sm text-gray-400 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                                                <p>(+84)</p>
                                            </span>
                                            <input type="tel" name="phoneNumber" id="phoneNumber" pattern="^(\+84)?[0-9]{8,}$" onChange={(e) => { setPhoneNumber(e.target.value); setError() }} required class="p-2 block w-full rounded-none rounded-e-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
                                        <div class="mt-2">
                                            <input type="text" name="address" id="address" minlength="5" onChange={(e) => { setAddress(e.target.value); setError() }} required class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#222160] sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="distributionHub" class="block text-sm font-medium leading-6 text-gray-900">Distribution Hub</label>
                                        <div class="mt-2">
                                            <select name="distributionHub" onChange={(e) => { setDistributionHub(e.target.value); setError() }} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" aria-label="Default select example">
                                                <option selected>Choose your distribution hub</option>
                                                <option value="HCM">Ho Chi Minh</option>
                                                <option value="HN">Ha Noi</option>
                                                <option value="DN">Da Nang</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="terms" type="checkbox" onChange={() => setcheckBox(prevState => !prevState)} value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 " required />
                                        </div>
                                        <label for="terms" class="ms-2 text-sm font-medium text-gray-900 ">I agree with the <span data-modal-target="shipper-modal" data-modal-toggle="shipper-modal" class="text-blue-600 hover:underline">terms and conditions</span></label>
                                    </div>
                                    {/* <!-- Main modal --> */}
                                    <div id="shipper-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                        <div class="relative p-4 w-full max-w-2xl max-h-full">
                                            {/* <!-- Modal content --> */}
                                            <div class="relative bg-white rounded-lg shadow">
                                                {/* <!-- Modal header --> */}
                                                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                                    <h3 class="text-xl font-semibold text-gray-900">
                                                        Terms of Service
                                                    </h3>
                                                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="shipper-modal">
                                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                        </svg>
                                                        <span class="sr-only">Close modal</span>
                                                    </button>
                                                </div>
                                                {/* <!-- Modal body --> */}
                                                <div class="p-4 md:p-5 space-y-4">
                                                    <p class="text-base leading-relaxed text-gray-500">
                                                        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                                                    </p>
                                                    <p class="text-base leading-relaxed text-gray-500">
                                                        The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" onClick={handleSubmit} class="flex w-full justify-center rounded-md bg-[#222160] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#000053] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000053]">Create Account</button>
                                    </div>

                                </form>

                            </div>
                        )}
                    </div>

                </div>
            </section>
        </>
    )
}