import { Store, CircleUserRound, Users, Package, Truck } from 'lucide-react';
export default function AdminInsight({ numbersOfUser, numbersOfVendors, numbersOfShippers, numbersOfProducts }) {
  return (
    <>
      <div id="24h">
        <div class="flex flex-wrap ">
          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 mb-4 lg:px-5">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4 ">
                <div class="flex flex-wrap">
                  <div class=" w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs ">
                      {" "}
                      Total Accounts
                    </h5>
                    <span class="font-semibold text-xl text-gray-700">
                      {numbersOfUser + numbersOfVendors + numbersOfShippers}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                      <CircleUserRound />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class=" mt-4 w-full lg:w-6/12 xl:w-3/12 lg:px-5">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class=" w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs">
                      Total Customers
                    </h5>
                    <span class="font-semibold text-xl text-gray-700">
                      {numbersOfUser}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-purple-700">
                      <Users />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 lg:px-5">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class=" w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs">
                      Total Vendors
                    </h5>
                    <span class="font-semibold text-xl text-gray-700">
                      {numbersOfVendors}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-yellow-400">
                      <Store />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 lg:px-5">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class=" w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs">
                      Total Shippers
                    </h5>
                    <span class="font-semibold text-xl text-gray-700">
                      {numbersOfShippers}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-yellow-400">
                      <Truck />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 lg:px-5">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs">
                      Total Products
                    </h5>

                    <span class="font-semibold text-xl text-gray-700">
                      {numbersOfProducts}{" "}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-orange-500">
                      <Package />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></>
  )
}