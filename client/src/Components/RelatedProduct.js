import { Rating } from "flowbite-react";
import { Link } from "react-router-dom";

export default function RelatedProduct({ item }) {
  return (
    <>
      <div className="bg-white overflow-hidden group rounded-lg shadow-lg dark:border-gray-700 
    group xs:mx-auto">
        <div className="relative">
          <Link className="flex justify-center items-center w-full h-[220px] md:h-[200px] sm:h-[180px] xs:h-[160px] xs:w-3/4 xs:mx-auto" to={`/product/${item.objectID}`}>
            <img src={item.image_link} alt="" className="p-4 object-full lg:md:scale-75" />
          </Link>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 sm:gap-2 opacity-0 group-hover:opacity-100 transition">
            <Link to={`/product/${item.objectID}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
              <i className="fa-solid fa-magnifying-glass"></i>
            </Link>
            <Link to={`/product/${item.objectID}`} className="text-white text-xl w-9 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-800 transition p-2">
              <i className="fa-regular fa-heart"></i>
            </Link>
          </div>
        </div>
        <div className="pt-4 pb-3 px-4">
          <Link to={`/product/${item.objectID}`}>
            <h4 className="capitalize font-medium xl:text-md lg:text-[15px] md:text-sm sm:text-sm xs:text-xs mb-1 text-gray-800 hover:text-primary-900 transition line-clamp-2 " href={`/product/${item.objectID}`}> {item.product_name}</h4>
          </Link>
          <div className="px-1">
            <div className="flex items-center justify-center">
              <Rating>
                <p className="text-md text-gray-500 lg:md:text-[14px] sm:xs:text-[12px] font-medium">Ratings: {item.ratings}</p>
                <Rating.Star className="xs:sm:w-3 lg:md:w-4 h-auto ml-1" />
              </Rating>
            </div>
            <p className="lg:md:text-lg sm:xs:text-sm text-red-500 font-semibold mb-2 text-center">${item.price}.00</p>
          </div>
        </div>
      </div>
    </>
  )
}