export default function Banner() {
    return <>
        <div className="flex xl:flex-row lg:flex-row items-center md:flex-row sm:flex-row xs:flex-col xl:justify-between lg:justify-between md:justify-between py-4 my-6 xs:hidden">

            <div className="border border-[#FAC800] rounded-md flex items-center xl:px-6 xl:py-4 lg:px-4 lg:py-2 md:px-2 md:py-2 sm:px-1 sm:py-2 xs:hidden shadow-lg shadow-gray-100 bg-white hover:bg-[#fac800e1] transition">

                <div className="xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:h-6 sm:w-6">
                    <img src={require("../Components/images/free.png")} className="object-cover" />
                </div>

                <div className="xl:ml-4 lg:ml-2 md:ml-2">
                    <h4 className="font-bold capitalize text-xs md:text-sm lg:text-lg text-[#E61E2A] text-start sm:line-clamp-1">Free Shipping</h4>
                    <p className="text-[#000054] xl:text-md lg:text-sm md:text-xs sm:text-2xs sm:line-clamp-1">order over $200</p>
                </div>
            </div>



            <div className="border border-[#FAC800] rounded-md flex items-center xl:px-6 xl:py-4 lg:px-4 lg:py-2 md:px-2 md:py-2 sm:px-1 sm:py-2 xs:hidden shadow-lg shadow-gray-100 bg-white hover:bg-[#fac800e1] transition">

                <div className="xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:h-6 sm:w-6">
                    <img src={require("../Components/images/save-money.png")} className="object-contain" />
                </div>

                <div className="xl:ml-4 lg:ml-2 md:ml-2">
                    <h4 className="font-bold capitalize text-xs md:text-sm lg:text-lg text-[#E61E2A] text-start sm:line-clamp-1">Money Returns</h4>
                    <p className="text-[#000054] xl:text-md lg:text-sm md:text-xs sm:text-2xs sm:line-clamp-1">30 days money return</p>
                </div>
            </div>


            <div className="border border-[#FAC800] rounded-md flex items-center xl:px-6 xl:py-4 lg:px-4 lg:py-2 md:px-2 md:py-2 sm:px-1 sm:py-2 xs:hidden shadow-lg shadow-gray-100 bg-white hover:bg-[#fac800e1] transition">
                <div className='xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:h-6 sm:w-6'>
                    <img src={require("../Components/images/credit-card.png")} className="object-contain" />
                </div>
                <div className="xl:ml-4 lg:ml-2 md:ml-2">
                    <h4 className="font-bold capitalize text-xs md:text-sm lg:text-lg text-[#E61E2A] text-start sm:line-clamp-1">Security Payment</h4>
                    <p className="text-[#000054] xl:text-md lg:text-sm md:text-xs sm:text-2xs sm:line-clamp-1">Protected by PayPal</p>
                </div>
            </div>


            <div className="border border-[#FAC800] rounded-md flex items-center xl:px-6 xl:py-4 lg:px-4 lg:py-2 md:px-2 md:py-2 sm:px-1 sm:py-2 xs:hidden shadow-lg shadow-gray-100 bg-white hover:bg-[#fac800e1] transition">
                <div className='xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:h-6 sm:w-6'>
                    <img src={require("../Components/images/delivery.png")} className=" object-contain" />
                </div>
                <div className="xl:ml-4 lg:ml-2 md:ml-2">
                    <h4 className="font-bold capitalize text-xs md:text-sm lg:text-lg text-[#E61E2A] text-start sm:line-clamp-1">24/7 Support</h4>
                    <p className="text-[#000054] xl:text-md lg:text-sm md:text-xs sm:text-2xs sm:line-clamp-1">Customer support</p>
                </div>
            </div>

            <div className="border border-[#FAC800] rounded-md flex items-center xl:px-6 xl:py-4 lg:px-4 lg:py-2 md:px-2 md:py-2 sm:px-1 sm:py-2 xs:hidden shadow-lg shadow-gray-100 bg-white hover:bg-[#fac800e1] transition">
                <div className='xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:h-6 sm:w-6'>
                    <img src={require("../Components/images/coupon.png")} className=" object-contain" />
                </div>
                <div className="xl:ml-4 lg:ml-2 md:ml-2">
                    <h4 className="font-bold capitalize text-xs md:text-sm lg:text-lg text-[#E61E2A] text-start sm:line-clamp-1">Voucher</h4>
                    <p className="text-[#000054] xl:text-md lg:text-sm md:text-xs sm:text-2xs sm:line-clamp-1">Discount up to 90%</p>
                </div>
            </div>
        </div>
    </>
}