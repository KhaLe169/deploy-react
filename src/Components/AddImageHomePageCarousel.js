import { Label, Textarea } from 'flowbite-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'


export default function AddImageHomePageBanner() {
    const [files, setFiles] = useState()
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [msg, setMsg] = useState('')

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    async function uploadHomepageCarousel() {
        const fd = new FormData();

        for (let i = 0; i < files.length; i++) {
            fd.append('files', files[i]);
        }
        fd.append('title', title);
        await axios.post("http://localhost:4000/upload-homepage-carousel", fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => {
                setMsg(res.data)
                setError('')
            })
            .catch(er => { setError(er.response.data); setMsg() });
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        uploadHomepageCarousel()
        if (error) {
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
    }

    useEffect(() => {
        if (error || msg) {
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
    }, [error, msg]);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={10000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
            <div class="mx-auto">
                <h2 class="mb-2 text-2xl tracking-tight font-bold text-gray-900">Upload Banners in Homepage</h2>
                <p class="text-sm text-gray-600">Upload real, high resolution, clear product images. You should choose images with 1:1 resolution</p>

                <div className="flex flex-col">


                    <section class="mx-auto">
                        <div class="max-w-sm  ">
                            <div class="px-4 py-6">
                                <div id="image-preview" class="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                                    <input onChange={handleFileChange} id="upload" type="file" name="files" class="hidden" accept="image/*" multiple />
                                    <label for="upload" class="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-700 mx-auto mb-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-700">Upload picture</h5>
                                        <p class="font-normal text-sm text-gray-400 md:px-6">Choose photo size should be less than <b class="text-gray-600">2mb</b></p>
                                        <p class="font-normal text-sm text-gray-400 md:px-6">and should be in <b class="text-gray-600">JPG, PNG, or GIF</b> format.</p>
                                        <span id="filename" class="text-gray-500 bg-gray-200 z-50"></span>
                                    </label>
                                </div>
                                <button onClick={handleSubmit} type="button" class="rounded-md px-3 py-2 text-sm font-semibold shadow-sm border-solid border-2  hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Submit</button>
                            </div>
                        </div>
                    </section>


                    <form>
                        <div className="max-w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="comment" value="Your Content" />
                            </div>
                            <Textarea onChange={(e) => setTitle(e.target.value)} id="comment" placeholder="Write a comment..." required rows={4} />
                        </div>



                    </form>
                </div>

            </div>

        </>
    )

}
