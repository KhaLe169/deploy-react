export default function ToDoList({ ordersByStatus }) {
  return (
    <>
      <div id="24h">
        <div class="flex flex-wrap ">
          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full  max-w-full flex flex-col items-center">
                    <span class="font-bold text-xl text-blue-700">
                      {(ordersByStatus['Unpaid']) ? ordersByStatus['Unpaid'] : 0}
                    </span>
                    <h5 class="text-black uppercase font-semibold text-sm">
                      {" "}
                      Unpaid
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full max-w-full flex flex-col items-center">
                    <span class="font-bold text-xl text-blue-700">
                      {(ordersByStatus['To Ship']) ? ordersByStatus['To Ship'] : 0}
                    </span>
                    <h5 class="text-black uppercase font-semibold text-sm text-center">
                      {" "}
                      TO-PROCESS SHIPMENT
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full  max-w-full flex flex-col items-center">
                    <span class="font-bold text-xl text-blue-700">
                      {(ordersByStatus['Shipping']) ? ordersByStatus['Shipping'] : 0}
                    </span>
                    <h5 class="text-black uppercase font-semibold text-sm text-center">
                      {" "}
                      PROCESS SHIPMENT
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full  max-w-full flex flex-col items-center">
                    <span class="font-bold text-xl text-blue-700">
                      {(ordersByStatus['Completed']) ? ordersByStatus['Completed'] : 0}
                    </span>
                    <h5 class="text-black uppercase font-semibold text-sm text-center">
                      {" "}
                      COMPLETED
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full  max-w-full flex flex-col items-center">
                    <span class="font-bold text-xl text-blue-700">
                      {(ordersByStatus['Cancelled']) ? ordersByStatus['Cancelled'] : 0}
                    </span>
                    <h5 class="text-black uppercase font-semibold text-sm text-center">
                      {" "}
                      CANCELLED
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full  max-w-full flex flex-col items-center">
                    <span class="font-bold text-xl text-blue-700">
                      {(ordersByStatus['Failed Delivery']) ? ordersByStatus['Failed Delivery'] : 0}
                    </span>
                    <h5 class="text-black uppercase font-semibold text-sm text-center">
                      {" "}
                      FAILED DELIVERY
                    </h5>
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