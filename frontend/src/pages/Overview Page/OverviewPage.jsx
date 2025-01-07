import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchBar from "./SearchBar";
import ActiveFilters from "./ActiveFilters";
import FilterPanel from "./FilterPanel";
import TrackingTable from "./TrackingTable";
import Pagination from "./Pagination";
import { filterTrackings } from "../../utils/filterTrackingUtils";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";

const OverviewPage = () => {
  const [trackings, setTrackings] = useState([]);
  const [filteredTrackings, setFilteredTrackings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    carrier: "All",
    status: "All",
    shipper: "All",
    weight: "All",
    dateRange: "All",
    customDateRange: { start: null, end: null },
    search: { term: "", field: "All" },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    fetchTrackings();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [trackings, selectedFilters]);

  const fetchTrackings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/trackings/all"
      );
      if (response.status === 200) {
        setTrackings(response.data);
        setFilteredTrackings(response.data);
      }
    } catch (error) {
      console.error("Error fetching trackings:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    setShowFilters(false);
    let result = filterTrackings(trackings, selectedFilters);
    setFilteredTrackings(result);
    setCurrentPage(1);
  };

  const removeFilter = (key) => {
    setShowFilters(false);
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };

      if (key === "dateRange") {
        updatedFilters.dateRange = "All";
        updatedFilters.customDateRange = { start: null, end: null };
      } else if (key === "search") {
        updatedFilters.search = { term: "", field: "All" };
      } else {
        updatedFilters[key] = "All";
      }

      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setShowFilters(false);
    setSelectedFilters({
      carrier: "All",
      status: "All",
      shipper: "All",
      weight: "All",
      dateRange: "All",
      customDateRange: { start: null, end: null },
      search: { term: "", field: "All" },
    });
  };

  const totalPages = Math.ceil(filteredTrackings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrackings = filteredTrackings.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="bg-gray-100 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-700 text-center mb-6 sm:mb-10">
          Tracking Overview
        </h1>
        {!isLoading && (
          <div className="flex flex-col items-center">
            <SearchBar
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
            {showFilters && (
              <FilterPanel
                applyFilters={(filters) => setSelectedFilters(filters)}
                closePanel={() => setShowFilters(false)}
                selectedFilters={selectedFilters}
                trackings={trackings}
              />
            )}
            <ActiveFilters
              selectedFilters={selectedFilters}
              clearFilters={clearFilters}
              removeFilter={removeFilter}
            />
          </div>
        )}
      </div>
      <div className="flex-grow flex items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="w-full px-4 sm:px-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              {trackings.length === 0 ? (
                <ErrorDisplay message="No data available. Please import some data." />
              ) : filteredTrackings.length === 0 ? (
                <ErrorDisplay message="No results found. Try adjusting your filters or search query." />
              ) : (
                <TrackingTable trackings={currentTrackings} />
              )}
            </div>
            {filteredTrackings.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalResults={filteredTrackings.length}
              />
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OverviewPage;
