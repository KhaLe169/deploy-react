import { Textarea } from "flowbite-react";
import { Rating } from "flowbite-react";
import { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function ProductDetailComment({ product, setComments, user }) {
    const textMessage = () => {
        document.getElementById("customer_review").className = "block";
    }
    const [newComment, setNewComment] = useState('')
    const [title, setTitle] = useState('')

    const postComment = async () => {
        try {
            const res = await axios.post(`http://localhost:4000/product/${product._id}/post-comment`, { newComment: newComment, title: title }, { withCredentials: true });
            toast.success(res.data.msg, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                pauseOnHover: false,
                theme: "light",
            });
            setComments((prev) => [...prev, {
                commentText: newComment,
                like: [],
                likes: 0,
                postedOn: new Date(),
                productId: product._id,
                replyMessage: [],
                userImg: user.img,
                userName: user.name,
                title: title,
                _id: res.data.commentId,
            }])
            setNewComment('')
            setTitle('')
        }
        catch (error) {
            toast.error(error.response.data.error, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                pauseOnHover: false,
                theme: "light",
            });
            setNewComment('')
            setTitle('')
        }
    };

    const handleComment = (e) => {
        e.preventDefault();
        postComment();
    };

    return (<div className="w-full lg:md:py-12 md:pr-2 xs:py-3">
        <p className="lg:text-2xl md:text-2xl xs:text-xl font-semibold mb-2">
            Customer Reviews
        </p>
        <Rating size="mb-2">
            {[...Array(5)].map((_, i) => (
                <Rating.Star key={i} filled={i < Math.floor(product.ratings + 0.5)} className="!w-6 !h-6" />
            ))}
            <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {product.ratings} out of 5
            </p>
        </Rating>
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            {Number(product.no_of_ratings).toLocaleString()} global ratings
        </p>
        <Rating.Advanced percentFilled={70} className="mb-2 ">
            5 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={17} className="mb-2">
            4 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={8} className="mb-2">
            3 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={4} className="mb-2">
            2 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={1}>1 star</Rating.Advanced>

        <hr class="my-6 w-4/5 border-gray-300" />
        <div>
            <p className="lg:text-2xl md:text-2xl xs:text-xl font-semibold mb-1 ">
                Review This Product
            </p>
            <p className="text-md xs:text-sm font-normal">
                Share your thoughts with other customers
            </p>
            <div className=" flex cursor-pointer rounded-lg border border-slate-300 h-9 lg:md:w-[300px] xs:sm:w-auto hover:bg-slate-200 items-center mt-3 bg-white">
                <button
                    className="text-sm font-medium text-black text-center mx-auto"
                    onClick={textMessage}
                >
                    Write a customer review
                </button>
            </div>

            <div className="lg:md:w-96 mt-5 ">
                <div className="">
                    <div className="hidden mt-2" id="customer_review">
                        <Textarea
                            id="commentText"
                            placeholder="Title..."
                            required
                            rows={1}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="mb-2" />
                        <Textarea
                            id="commentText"
                            placeholder="Leave a review..."
                            required
                            rows={4}
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)} />

                        <button class="text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none font-medium rounded text-sm px-3 py-2 w-full text-center me-2 mt-2 mb-2" onClick={handleComment} type="submit">Post</button>
                    </div>


                </div>
            </div>
        </div>
    </div>)
}