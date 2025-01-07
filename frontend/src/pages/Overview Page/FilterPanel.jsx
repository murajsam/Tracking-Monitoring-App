import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Globe, File, Package, Weight, Calendar } from "lucide-react";
import { filterTrackings } from "../../utils/filterTrackingUtils";

const FilterPanel = ({
  applyFilters,
  closePanel,
  selectedFilters,
  trackings,
}) => {
  const [localFilters, setLocalFilters] = useState(selectedFilters);
  const [filteredTrackings, setFilteredTrackings] = useState(trackings);

  // Ikone za svaki filter
  const getIcon = (key) => {
    switch (key) {
      case "carrier":
        return <Globe className="w-5 h-5 text-gray-500" />;
      case "status":
        return <File className="w-5 h-5 text-gray-500" />;
      case "shipper":
        return <Package className="w-5 h-5 text-gray-500" />;
      case "weight":
        return <Weight className="w-5 h-5 text-gray-500" />;
      case "dateRange":
        return <Calendar className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  // Dinamičko kreiranje opcija filtera
  const filterOptions = useMemo(() => {
    const carriers = new Set();
    const statuses = new Set();
    const shippers = new Set();

    filteredTrackings.forEach((filteredTracking) => {
      if (filteredTracking.data.Carrier)
        carriers.add(filteredTracking.data.Carrier);
      if (filteredTracking.data.Status)
        statuses.add(filteredTracking.data.Status);
      if (filteredTracking.data.Shipper)
        shippers.add(filteredTracking.data.Shipper);
    });

    return {
      carrier: ["All", ...Array.from(carriers).sort()],
      status: ["All", ...Array.from(statuses).sort()],
      shipper: ["All", ...Array.from(shippers).sort()],
      weight: ["All", "0 - 10 kg", "10 - 50 kg", "50 - 100 kg", "100+ kg"],
      dateRange: [
        "All",
        "Last 7 days",
        "Last 30 days",
        "Last 90 days",
        "Last 180 days",
        "Last 365 days",
        "Custom range",
      ],
    };
  }, [filteredTrackings]);

  useEffect(() => {
    setFilteredTrackings(filterTrackings(trackings, localFilters));
  }, [localFilters, trackings]); // Praćenje promena u filterima ili podacima

  // Promena vrednosti filtera
  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Promena datuma za prilagođeni raspon
  const handleDateChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      customDateRange: {
        ...prev.customDateRange,
        [key]: value,
      },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8 w-full max-w-[1200px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {getIcon(key)}
            </label>
            <div className="relative">
              <select
                value={localFilters[key] || "All"}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              >
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}

        {localFilters.dateRange === "Custom range" && (
          <div className="col-span-1 mt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  type="date"
                  value={localFilters.customDateRange?.start || ""}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">To</label>
                <input
                  type="date"
                  value={localFilters.customDateRange?.end || ""}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
        <button
          onClick={closePanel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
        <button
          onClick={() => {
            applyFilters(localFilters);
            closePanel();
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
