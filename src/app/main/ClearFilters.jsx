import React from 'react';

function ClearFilters({handleClearFilters}) {
    return (
        <div>
            <button
                onClick={handleClearFilters}
                className='px-6 ml-4 mt-4 py-3 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300 transform hover:scale-105'
            >
                Clear all filters
            </button>
        </div>
    );
}

export default ClearFilters;