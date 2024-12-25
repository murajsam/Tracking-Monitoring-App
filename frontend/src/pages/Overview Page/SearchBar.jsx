import React from "react";
import { Search, Filter } from "lucide-react";

const SearchBar = ({
  showFilters,
  setShowFilters,
  selectedFilters,
  setSelectedFilters,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex gap-2 text-sm text-gray-600">
        <span>Search in:</span>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-green-500 checked:border-green-500 focus:outline-none"
            name="search-type"
            value="All"
            checked={selectedFilters.search.field === "All"}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                search: { ...prev.search, field: e.target.value },
              }))
            }
          />
          All Fields
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-green-500 checked:border-green-500 focus:outline-none"
            name="search-type"
            value="Carrier"
            checked={selectedFilters.search.field === "Carrier"}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                search: { ...prev.search, field: e.target.value },
              }))
            }
          />
          Carrier
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-green-500 checked:border-green-500 focus:outline-none"
            name="search-type"
            value="PO Number"
            checked={selectedFilters.search.field === "PO Number"}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                search: { ...prev.search, field: e.target.value },
              }))
            }
          />
          PO Number
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-green-500 checked:border-green-500 focus:outline-none"
            name="search-type"
            value="Shipper"
            checked={selectedFilters.search.field === "Shipper"}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                search: { ...prev.search, field: e.target.value },
              }))
            }
          />
          Shipper
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            className="appearance-none w-5 h-5 border border-gray-300 rounded-full checked:bg-green-500 checked:border-green-500 focus:outline-none"
            name="search-type"
            value="House AWB"
            checked={selectedFilters.search.field === "House AWB"}
            onChange={(e) =>
              setSelectedFilters((prev) => ({
                ...prev,
                search: { ...prev.search, field: e.target.value },
              }))
            }
          />
          House AWB
        </label>
      </div>
      <div className="relative flex flex-row gap-5">
        <input
          type="text"
          placeholder="Search..."
          value={selectedFilters.search.term}
          onChange={(e) =>
            setSelectedFilters((prev) => ({
              ...prev,
              search: { ...prev.search, term: e.target.value },
            }))
          }
          className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
            showFilters
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-white border-gray-300"
          }`}
        >
          <Filter className="h-5 w-5" />
          Advanced Filters
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
