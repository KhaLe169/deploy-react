import { Link } from 'react-router-dom';

export default function SignUpHeader() {
    return (
        <>
            <div className="border py-3 px-6 gradient-background">
                <div className="flex items-center lg:ml-10 ">
                    <img src={require('./images/logo1.png')} className="w-14 mb-2 lg:w-14 md:w-12 sm:w-10 xs:w-8" alt="logo" />
                    <Link to='/' className="pl-3.5 font-semibold text-white lg:text-2xl md:text-2xl sm:text-lg xs:text-md ">rBuy</Link>
                    <h1 className="text-4xl text-white flex items-center font-semibold ml-16">Sign up</h1>
                </div>
            </div>
        </>
    )
}