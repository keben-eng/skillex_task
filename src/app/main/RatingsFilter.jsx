import React, { useState } from 'react';

function RatingsFilter({handleRatingFilter}) {
    const [value, setValue] = useState(3);

    const handleChange = (event) => {
        setValue(event.target.value);
        handleRatingFilter(+event.target.value)
    };

    const labelPosition = `${((value - 1) / 4) * 100}%`

    return (
        <div className="relative mb-6">
            <label htmlFor="moving-value-range-input" className="sr-only">Moving value range</label>
            <input
                id="moving-value-range-input"
                type="range"
                min="1"
                max="5"
                value={value}
                onChange={handleChange}
                className="w-full h-2 mt-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div
                className="text-sm font-medium text-gray-700 dark:text-white absolute -top-5 mt-4"
                style={{ left: `calc(${labelPosition} - 0.4rem)` }}
            >
                {value}
            </div>
            <p className='italic text-xxs'>Please note that 3 is a default value, no filter applied to the current results!</p>

        </div>
    );
}

export default RatingsFilter;
