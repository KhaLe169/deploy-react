import { Link } from 'react-router-dom';

export default function LogInHeader() {
    return (
        <>
            <div className="border py-3 px-6 gradient-background">
                <div className="flex justify-between items-center lg:ml-10 ">
                <div className='flex items-center'>
                    <Link to='/'>
                        <img src={require('./images/logo1.png')} className="w-14 mb-2 lg:w-14 md:w-12 sm:w-10 xs:w-8" alt="logo" />
                    </Link>
                    <Link to='/' className="pl-3.5 font-semibold text-white lg:text-2xl md:text-2xl sm:text-lg xs:text-md ">rBuy</Link>
                    </div>
                    <h1 className="lg:text-[33px] md:text-3xl sm:text-2xl xs:text-xl text-white font-semibold mr-20">Sign in</h1>
                </div>
            </div>
        </>
    )
}