import {useEffect, useState} from "react";
import useDebounce from "@/app/main/hooks/useDebaunce";

function Search({ onFilterUpdate, data }) {
    const [searchInputValue, setSearchInputValue] = useState('');
    const debouncedSearchTerm = useDebounce(searchInputValue, 300);


    useEffect(() => {
        const filteredData = data.filter(item =>
            item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        onFilterUpdate(filteredData);
    }, [debouncedSearchTerm, data, onFilterUpdate]);

    return (
        <div>
            <input
                placeholder="Real time searching.."
                className="rounded-tl-2xl w-full h-10 border-amber-700 outline-none text-black pl-2"
                value={searchInputValue}
                onChange={(event) => setSearchInputValue(event.target.value)}
                type="text"
            />
        </div>
    );
}

export default Search;