'use client';
import axios from 'axios';
import { Button, Modal } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function ReportInfo({ reports }) {
  const [openModalBlock, setOpenModalBlock] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const params = useParams()

  const banUser = useCallback(async () => {
    try {
      const res = await axios.post("http://localhost:4000/ban-user", { userId: params.id, startDate: startDate, endDate: endDate }, { withCredentials: true });
      toast.success(res.data.msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });
    } catch (error) {
      console.log(error)
    }
  }, [startDate, endDate, params])

  return (
    <>
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
      <div class="container mx-auto">
        <div class="p-4">
          <div>
            {reports && reports.map((report, index) => (
              <div key={index} class="flex py-5">
                <div class="relative inline-block shrink-0">
                  <img
                    class="w-12 h-12 rounded-full"
                    src={(report.user.img) ? `data:image/jpeg;base64,${report.user.img}` : require("../Components/images/defaultUserImage.png")}
                    alt="Jese Leos"
                  />
                </div>
                <div class="ms-3 text-sm font-normal">
                  <div class="text-sm font-semibold text-gray-900">
                    {report.user.name}
                  </div>
                  <div class="text-sm font-normal">
                    has reported this account:
                  </div>
                  <div class="text-sm font-semibold text-red-600 mt-2">
                    {report.title}
                  </div>
                  <div class="text-sm font-normal text-gray-900 my-3">
                    {report.description}
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    {report.evidence && report.evidence.map((img, imgindex) => (
                      <div key={imgindex}>
                        <img
                          class="object-fill h-full w-full"
                          src={img}
                          alt="report evidence"
                        />
                      </div>
                    ))}
                  </div>
                  <div class="text-sm text-gray-600 mt-3">05-12-2023 17:10</div>
                </div>
              </div>))}
          </div>
        </div>
        {/* Buttons */}
        <div class="flex justify-end my-5">
          {/* Warning Button */}
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 dark:hover:bg-yellow-500 mr-4"
            onClick={() => setOpenModalBlock(true)}
          >
            Block
          </Button>
          <Modal className='justify-center items-center'
            show={openModalBlock}
            onClose={() => setOpenModalBlock(false)}
          >
            <Modal.Header>Block User</Modal.Header>
            <Modal.Body>
              <div class="p-4 md:p-5 space-y-4">
                <form class="max-w-sm mx-auto">
                  <div class="mb-5">
                    <label
                      for="block-start-date"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      id="block-start-date"
                      name="block-start-date"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div class="mb-5">
                    <label
                      for="block-start-date"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      id="block-start-date"
                      name="block-start-date"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-end">
              <Button
                className=" bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                onClick={() => { setOpenModalBlock(false); banUser(); }}
                disabled={(new Date(startDate) > new Date(endDate)) || !(startDate && endDate)}
              >
                Block
              </Button>
              <Button color="gray" onClick={() => setOpenModalBlock(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}