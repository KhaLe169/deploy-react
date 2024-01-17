import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import axios from 'axios';
import 'swiper/css/navigation';
import "swiper/css";
import '../css/homepage.css'

// import required modules
import { Navigation } from 'swiper/modules';


export default function Slider() {
    const [images, setImages] = useState();
    const fetchImages = async () => {
        try {
            const response = await axios.get("http://localhost:4000/slider", { withCredentials: true });
            setImages(response.data.images);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    useEffect(() => {
        fetchImages();
    }, []);
    return <>
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
            {images && images.map((image, index) => (
                <SwiperSlide key={index} className='w-[!600px]'>
                    <img src={image}
                        alt="..." className='object-cover' />
                </SwiperSlide>
            ))}
        </Swiper>
    </>
}