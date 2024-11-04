'use client';

import {useState, useEffect} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Search from "@/app/main/Search";
import ClearFilters from "@/app/main/ClearFilters";
import RatingsFilter from "@/app/main/RatingsFilter";
import NoProductsFound from "@/app/main/NoProductsFound";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCaretRight, faXmark, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faReact } from '@fortawesome/free-brands-svg-icons';

export default function Home() {
    const [data, setData] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [rating, setRating] = useState([]);
    const [toggleCategory, setToggleCategory] = useState(false);
    const [toggleBrand, setToggleBrand] = useState(false);
    const [priceBar, setPriceBar] = useState(false);
    const [toggleRating, setToggleRating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [empty, setEmpty] = useState(false)
    const [toggleSorting, setToggleSorting] = useState(false)
    const [sortBy, setSortBy] = useState('price')
    const [sortDirectionPrice, setSortDirectionPrice] = useState('asc');
    const [sortDirectionRating, setSortDirectionRating] = useState('asc');
    const [selectedFilters, setSelectedFilters] = useState({})

    useEffect(() => {
        fetch('/data.json')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Unsuccessful operation');
                }
                return res.json();
            })
            .then((fetchedData) => {
                const uniqueCategories = Array.from(new Set(fetchedData.map(item => item.category)));
                const uniqueBrands = Array.from(new Set(fetchedData.map(item => item.brand)));
                const uniqueRating = [];
                fetchedData.forEach(item => {
                    if (!uniqueRating.includes(item.rating)) {
                        uniqueRating.push(item.rating);
                    }
                });

                setRating(uniqueRating);
                setBrands(uniqueBrands);
                setCategory(uniqueCategories);
                setData(fetchedData);
                setFilterData(fetchedData);
            })
            .catch((error) => {
                setError(true)
                console.error('Error fetching:', error);
            })
            .finally(() => setLoading(false));
    }, []);


    const handleToggle = (type) => {
        switch (type) {
            case 'category':
                setToggleCategory(prev => !prev);
                break;
            case 'brand':
                setToggleBrand(prev => !prev);
                break;
            case 'price':
                setPriceBar(prev => !prev);
                break;
            case 'rating':
                setToggleRating(prev => !prev);
                break;
            case 'sorting':
                setToggleSorting(prev => !prev);
                break;
            default:
                break;
        }
    };

    const handlePriceFilter = (event) => {
        if (event.key === 'Enter') {
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Infinity;
            if (min <= max) {
                const filteredByPrice = data.filter(item => item.price >= min && item.price <= max);
                setFilterData(filteredByPrice);
            }
            setSelectedFilters(prevState => ({...prevState, minPrice:min, maxPrice:max}))
        }
    };

    const handleFilterByCategory = (id) => {
        if (id === 'all') {
            setFilterData(data);
        } else {
            const filteredItems = data.filter(item => item.category === id);
            setFilterData(filteredItems);
            setSelectedCategory(id)
            setSelectedBrand(null)
        }
        setSelectedFilters(prevState => ({...prevState, category:id}))
    };

    const handleFilterByBrand = (brand) => {
        if (brand === 'all') {
            setFilterData(data);
        } else {
            const filteredItems = data.filter(item => item.brand === brand);
            setFilterData(filteredItems);
            setSelectedBrand(brand)
            setSelectedCategory(null)
        }
        setSelectedFilters(prevState => ({...prevState, brand}))
    };

    const handleRatingFilter = (rate) => {
        const filterRating = data.filter(item => item.rating <= rate)
        setFilterData(filterRating)
        setSelectedFilters(prevState => ({...prevState, rating:rate}))
    }

    useEffect(() => {
        const savedData = localStorage.getItem("filteredData");
        if (savedData) {
            setFilterData(JSON.parse(savedData));
        } else {
            setFilterData(data);
        }
    }, [data]);

    useEffect(() => {
        localStorage.setItem("filteredData", JSON.stringify(filterData));
    }, [filterData]);


    const handleClearFilters = () => {
        setFilterData(data);
        setMaxPrice('');
        setMinPrice('');
        setSelectedCategory(null);
        setSelectedBrand(null);
    };

    const handleRefresh = () => {
        window.location.reload()
    };

    const handleEmptyPriceRange = () => {
        if (minPrice.length > 0 || maxPrice.length ) {
            setEmpty(true)
            setMaxPrice('')
            setMinPrice('')
        }
    }


    const handleSorting = (sortDetail) => {
        let sortedData = [...filterData];

        if (sortDetail === 'price') {
            sortedData = sortedData.sort((a, b) => sortDirectionPrice === 'asc' ? a.price - b.price : b.price - a.price);
            setSortDirectionPrice((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else if (sortDetail === 'rating') {
            sortedData = sortedData.sort((a, b) => sortDirectionRating === 'asc' ? a.rating - b.rating : b.rating - a.rating);
            setSortDirectionRating((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        }

        setFilterData(sortedData);
    };
    console.log(selectedFilters)

    return (
        <div className='grid grid-cols-[220px_1fr] min-h-screen bg-blue-800 '>
            <div className='p-4 text-white font-bold h-screen overflow-y-auto bg-blue-800'>
                <FontAwesomeIcon icon={faReact} className={`w-14 h-14 cursor-pointer hover: ${faReact}`}
                                 onClick={handleRefresh}/>
                <h1 className='font-bold mt-6'>Apply Filter by</h1>
                <div className='flex flex-col space-y-2 mt-4 cursor-pointer'>

                    <span className='flex items-center hover:text-yellow-400' onClick={() => handleToggle('category')}>
                        Category <FontAwesomeIcon className='ml-1 size-4'
                                                  icon={toggleCategory ? faChevronUp : faChevronDown}/>
                    </span>
                    <div
                        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                            toggleCategory ? 'max-h-96' : 'max-h-0'
                        }`}
                    >
                        <div className='hover:text-yellow-400' onClick={() => handleFilterByCategory('all')}>All
                            Categories
                        </div>
                        {category.map((item, index) => (
                            <div key={index} onClick={() => handleFilterByCategory(item)}
                                 className={`cursor-pointer flex items-center hover:text-yellow-400 ${selectedCategory === item && 'text-yellow-500'}`}>
                                <FontAwesomeIcon className='mr-1' icon={faCaretRight}/> {item}
                            </div>
                        ))}
                    </div>

                    <span className='flex items-center hover:text-yellow-400' onClick={() => handleToggle('brand')}>
                        Brands <FontAwesomeIcon className=' ml-1 size-4'
                                                icon={toggleBrand ? faChevronUp : faChevronDown}/>
                    </span>
                    <div
                        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                            toggleBrand ? 'max-h-96' : 'max-h-0'
                        }`}
                    >
                        <div onClick={() => handleFilterByBrand('all')}
                             className="cursor-pointer hover:text-yellow-400">All Brands
                        </div>
                        {brands.map((brand, index) => (
                            <div key={index} onClick={() => handleFilterByBrand(brand)}
                                 className={`cursor-pointer flex items-center hover:text-yellow-400 ${selectedBrand === brand && "text-yellow-500"}`}>
                                <FontAwesomeIcon className='mr-1' icon={faCaretRight}/> {brand}
                            </div>
                        ))}
                    </div>

                    <span className='flex items-center cursor-pointer hover:text-yellow-400'
                          onClick={() => handleToggle('price')}>
                        Price range <FontAwesomeIcon className='ml-1 size-4'
                                                     icon={priceBar ? faChevronUp : faChevronDown}/>
                    </span>
                    <div
                        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                            priceBar ? 'max-h-96' : 'max-h-0'
                        }`}
                    >
                        <div className='flex'>
                            <input
                                onKeyDown={handlePriceFilter}
                                type="number"
                                placeholder="$-Min"
                                value={minPrice}
                                onChange={(event) => setMinPrice(event.target.value)}
                                className='border rounded mr-2 w-20 text-blue-900 outline-none caret-gray-600 pl-1'
                            />
                            <input
                                onKeyDown={handlePriceFilter}
                                type="number"
                                placeholder="$-Max"
                                value={maxPrice}
                                onChange={(event) => setMaxPrice(event.target.value)}
                                className='border w-20 rounded outline-none caret-gray-600 text-blue-900 pl-1'
                            />
                            <FontAwesomeIcon className='ml-1 mt-1' onClick={handleEmptyPriceRange} icon={faXmark}/>
                        </div>
                    </div>

                    <span className="flex items-center cursor-pointer hover:text-yellow-400"
                          onClick={() => handleToggle('rating')}>
                        Rating <FontAwesomeIcon className="ml-1 size-4" icon={toggleRating ? faChevronUp : faChevronDown}/>
                    </span>

                    <div
                        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${
                            toggleRating ? 'max-h-96' : 'max-h-0'
                        }`}
                    >
                        <RatingsFilter handleRatingFilter={handleRatingFilter}/>
                    </div>
                </div>
                <span
                    onClick={() => handleToggle('sorting')}
                    className='flex items-center mb-2 cursor-pointer hover:text-yellow-400'>
                        Sort
                    <FontAwesomeIcon className='ml-1 size-4 ' icon={faSort}/></span>
                {toggleSorting &&
                    <div className="flex flex-col space-y-2">
                <span
                    onClick={() => {setSortBy('price');handleSorting('price');}}
                    className="flex items-center cursor-pointer hover:text-yellow-400">
                    <FontAwesomeIcon icon={faCaretRight} className="mr-1"/>
                        By Price
                    <FontAwesomeIcon icon={sortDirectionPrice === 'asc' ? faSortUp : faSortDown} className="ml-1"/>
                </span>

                        <span onClick={() => {setSortBy('rating');handleSorting('rating');}}
                              className="flex items-center cursor-pointer hover:text-yellow-400">
                                <FontAwesomeIcon icon={faCaretRight} className="mr-1"/>
                                     By Rating
                                <FontAwesomeIcon icon={sortDirectionRating === 'asc' ? faSortUp : faSortDown} className="ml-1 "/>
                </span>
                    </div>
                }
                <ClearFilters data={data} handleClearFilters={handleClearFilters}/>
            </div>

            <div className="min-h-screen flex flex-col">
                <h1 className="text-2xl font-bold text-center p-4">React Market</h1>
                {loading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <ClipLoader color="55555" size={70}/>
                    </div>
                ) : error ? (
                    <NoProductsFound/>
                ) : (
                    <>
                        <Search
                            data={data}
                            onFilterUpdate={setFilterData}
                        />
                        <div className="flex flex-wrap p-4 bg-gray-200 gap-4 flex-grow">
                            {filterData.length === 0 ? (
                                <NoProductsFound />
                            ) : (
                                filterData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex cursor-pointer bg-white shadow-lg rounded-lg p-4 w-60 h-64 flex-col justify-between hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <h4 className="font-semibold text-gray-800 text-lg text-center">{item.name}</h4>
                                        <span className="text-gray-900 text-sm text-center">{item.brand}</span>
                                        <div className="flex justify-center mt-2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="object-cover h-20 w-20 rounded-lg"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-blue-900 mt-1 text-base">{`$${item.price}`}</p>
                                            <span className="text-blue-900">{`${item.rating} ★`}</span>
                                        </div>
                                    </div>

                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
