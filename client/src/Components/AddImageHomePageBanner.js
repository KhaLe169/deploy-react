'use client';

import { Label, Textarea } from 'flowbite-react';

export default function AddImageHomePageBanner() {
    return (
        <>

            <div class="mx-auto">
                <h2 class="mb-2 text-2xl tracking-tight font-bold text-gray-900">Upload Banners in Homepage</h2>
                <p class="text-sm text-gray-600">Upload real, high resolution, clear product images. You should choose images with 1:1 resolution</p>

                <div className="flex flex-col">


                    <section class="mx-auto">
                        <div class="max-w-sm  ">
                            <div class="px-4 py-6">
                                <div id="image-preview" class="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                                    <input id="upload" type="file" class="hidden" accept="image/*" />
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
                            </div>
                        </div>
                    </section>


                    <form>
                        <div className="max-w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="comment" value="Your Content" />
                            </div>
                            <Textarea id="comment" placeholder="Write a comment..." required rows={4} />
                        </div>

                        

                    </form>
                </div>

            </div>

        </>
    )

}

