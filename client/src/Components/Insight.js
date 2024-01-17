import { Package } from 'lucide-react';
export default function Insight({ orders, numberOfFollowers, income, numberOfProducts }) {
  return (
    <>
      <div id="24h">
        <div class="flex flex-wrap ">
          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 lg:px-5 lg:mb-4">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class=" w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs ">
                      {" "}
                      Total Orders
                    </h5>
                    <span class="font-semibold text-xl text-gray-700">
                      {orders}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                      <i class="fas fa-chart-bar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class=" lg:mt-4 w-full lg:w-6/12 xl:w-3/12 lg:px-5">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class=" w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs">
                      Income
                    </h5>
                    <span class="font-semibold text-xl text-gray-700">
                      {income}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                      <i class="fa-solid fa-money-bill-wave"></i>                            </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:mt-4 w-full lg:w-6/12 xl:w-3/12 lg:px-5">
            <div class=" flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class=" w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-gray-400 uppercase font-bold lg:md:text-sm text-xs">
                      Followers
                    </h5>
                    <span class="font-semibold text-xl text-gray-700">
                      {numberOfFollowers}
                    </span>
                  </div>
                  <div class=" w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                      <i class="fas fa-users"></i>
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
                      {numberOfProducts}{" "}
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
      </div>
    </>
  )
}