import { Link } from "react-router-dom";

export default function Hit({ hit }) {
    return (
        <div className="bg-white overflow-hidden group rounded-lg shadow-lg dark:border-gray-700 group" key={hit.objectID}>
            <div className="relative">
                <div className="w-full h-[220px] md:h-[200px] sm:h-[180px] xs:h-[160px]">
                    <img src={hit.image_link} className="object-full h-full w-full" alt={hit.product_name} />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition">
                    <Link to={`/product/${hit._id}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </Link>
                    <Link to={`/product/${hit._id}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
                        <i className="fa-regular fa-heart"></i>
                    </Link>
                </div>
            </div>
            <div className="pt-4 pb-3 px-4">
                <Link to={`/product/${hit.objectID}`}>
                    <h4 className="capitalize font-medium text-md mb-2 text-gray-800 hover:text-primary-900 transition line-clamp-2">{hit.product_name}</h4>
                </Link>
                <p className="text-lg text-red-500 font-semibold mb-2">${hit.price}</p>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1 text-xs text-[#FAC800]">
                        <span><i className="fa-solid fa-star"></i></span>
                        <span><i className="fa-solid fa-star"></i></span>
                        <span><i className="fa-solid fa-star"></i></span>
                        <span><i className="fa-solid fa-star"></i></span>
                        <span><i className="fa-solid fa-star"></i></span>
                    </div>
                    <div className="text-xs text-gray-500 block" >Rating {hit.ratings}</div>
                </div>
            </div>
            <span className="block w-full py-1 text-center text-md font-semibold text-white bg-red-500 border border-red-500 rounded-b hover:bg-transparent hover:text-red-500 hover:rounded transition">Add to cart</span>
        </div>
    );
}