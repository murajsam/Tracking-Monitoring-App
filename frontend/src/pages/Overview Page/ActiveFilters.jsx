import React from "react";
import { X } from "lucide-react";

const ActiveFilters = ({ selectedFilters, clearFilters, removeFilter }) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {Object.entries(selectedFilters)
        .filter(([key, value]) => {
          if (key === "customDateRange") {
            // Prikazujemo samo ako je izabran "Custom range" i barem jedan datum nije prazan
            return (
              selectedFilters.dateRange === "Custom range" &&
              (value.start || value.end)
            );
          }
          if (key === "search") {
            return value.term !== ""; // Prikazujemo ako postoji pretraženi termin
          }
          if (key === "dateRange") {
            // Ne prikazujemo "dateRange" ako je "Custom range" i oba datuma prazna
            return (
              value !== "All" &&
              !(
                value === "Custom range" &&
                !selectedFilters.customDateRange.start &&
                !selectedFilters.customDateRange.end
              )
            );
          }
          return value !== "All"; // Prikazujemo sve ostale aktivne filtere
        })
        .map(([key, value]) => {
          if (key === "customDateRange") {
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 py-1 bg-green-50 text-green-700 rounded-full text-sm"
              >
                Custom Range: {value.start || "Not set"} -{" "}
                {value.end || "Not set"}
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => removeFilter("dateRange")}
                />
              </span>
            );
          }
          if (key === "search") {
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 py-1 bg-green-50 text-green-700 rounded-full text-sm"
              >
                Search: {value.term} ({value.field})
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => removeFilter("search")}
                />
              </span>
            );
          }
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1 py-1 bg-green-50 text-green-700 rounded-full text-sm"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={() =>
                  removeFilter(
                    key === "customDateRange" || key === "dateRange"
                      ? "dateRange"
                      : key
                  )
                }
              />
            </span>
          );
        })}
      {Object.entries(selectedFilters).some(([key, value]) => {
        if (key === "customDateRange") {
          // Proveri ako su oba datuma prazna
          return value?.start || value?.end;
        }
        if (key === "search") {
          return value.term !== ""; // Proveri ako postoji pretraženi termin
        }
        if (key === "dateRange") {
          // Ne prikazujemo "dateRange" ako je "Custom range" i oba datuma prazna
          return (
            value !== "All" &&
            !(
              value === "Custom range" &&
              !selectedFilters.customDateRange.start &&
              !selectedFilters.customDateRange.end
            )
          );
        }
        return value !== "All"; // Standardna provera za ostale filtere
      }) && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
