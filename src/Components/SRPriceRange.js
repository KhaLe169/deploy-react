import { useEffect, useState } from 'react'
import { GoDash } from "react-icons/go";
import { useRange } from 'react-instantsearch';
const MIN = 0;
const MAX = 0;

export default function SRPriceRange() {
  const [values, setValues] = useState([MIN, MAX])
  const { refine } = useRange({ attribute: 'price' });

  useEffect(() => {
    refine(values);
  }, [refine, values]);

  return (
    <div className='flex px-6 border border-gray-50 py-6 bg-white'>
      <div>
        <h3 className='font-medium mb-2'>Price <span className='font-medium'>Range</span></h3>

        <div className='flex justify-center items-center'>
          <div className='flex items-center'>
            <i className="fa-solid fa-dollar-sign mr-2"></i>
            <input type="number" id="number-input"
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-2xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2 text-sm" placeholder="FROM" required
              onChange={(e) => setValues([(e.target.value), values[1]])}
              value={values[0] < 0 ? 0 : values[0]}
            />
          </div>
          <div className='mx-2'>
            <GoDash />
          </div>
          <div className='flex items-center'>
            <i className="fa-solid fa-dollar-sign mr-2"></i>
            <input type="number" id="number-input"
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-2xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2" placeholder="TO" required
              onChange={(e) => setValues([values[0], e.target.value])}
              value={values[1] < 0 ? 0 : values[1]}
            />
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}