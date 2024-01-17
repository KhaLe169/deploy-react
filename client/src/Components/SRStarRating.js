import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import '../css/searchresult.css';
import { useRange } from "react-instantsearch";

const MIN = 0;
const MAX = 5;

export default function SRStarRating() {
  const { refine } = useRange({ attribute: 'ratings' });
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const handleRating = (ratingValue) => {
    setRating(ratingValue);
    refine([ratingValue, MAX]);
  }

  useEffect(() => {
    refine([MIN, MAX]);
  }, [refine]);


  return (
    <>
      <div className="px-6 border border-gray-50 py-6 bg-white">
        <h3 className='font-medium mb-2'>Rating</h3>
        <div className="flex flex-row">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <label className="flex flex-col justify-center items-center">
                <div className="starRating gap-2">
                  {ratingValue <= (rating || hover) ? (
                    index + 0.5 <= (rating || hover) ? (
                      //Full Star
                      <FaStar
                        className="star w-8 h-8 md:w-6 md:h-6"
                        color="#FAC800"
                        value={ratingValue}
                        onClick={() => handleRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    ) : (
                      //Half Star
                      <FaStarHalfAlt
                        className="star w-8 h-8 md:w-6 md:h-6"
                        color="#FAC800"
                        value={ratingValue}
                        onClick={() => handleRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    )
                  ) : (
                    //Empty Star
                    <FaRegStar
                      className="star w-8 h-8 md:w-6 md:h-6"
                      color="#FAC800"
                      value={ratingValue}
                      onClick={() => handleRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

    </>
  );
}