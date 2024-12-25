export const filterTrackings = (trackings, filters) => {
  return trackings.filter((tracking) => {
    // Carrier filter
    if (
      filters.carrier !== "All" &&
      tracking.data.Carrier !== filters.carrier
    ) {
      return false;
    }

    // Status filter
    if (filters.status !== "All" && tracking.data.Status !== filters.status) {
      return false;
    }

    // Shipper filter
    if (
      filters.shipper !== "All" &&
      tracking.data.Shipper !== filters.shipper
    ) {
      return false;
    }

    // Weight filter
    if (filters.weight !== "All") {
      const weight = parseFloat(tracking.data.Weight);
      const [min, max] = filters.weight.split(" - ").map(Number);
      if (isNaN(weight) || weight < min || (max && weight > max)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange !== "All") {
      const { start, end } = getDateRange(
        filters.dateRange,
        filters.customDateRange
      );
      const date = new Date(tracking.data.ETD);

      if (date < start || date > end) {
        return false;
      }
    }

    // Search logic
    if (filters.search.term) {
      const searchTerm = filters.search.term.toLowerCase();
      if (filters.search.field === "All") {
        return (
          Object.values(tracking.data).some(
            (value) =>
              value &&
              String(value).toLowerCase().includes(searchTerm) &&
              value !== "Not Specified"
          ) ||
          (tracking.fileName &&
            tracking.fileName.toLowerCase().includes(searchTerm) &&
            tracking.fileName !== "Not Specified")
        );
      } else {
        const fieldValue = tracking.data[filters.search.field];
        return (
          fieldValue &&
          String(fieldValue).toLowerCase().includes(searchTerm) &&
          fieldValue !== "Not Specified"
        );
      }
    }

    return true;
  });
};

const getWeightRange = (weightFilter) => {
  switch (weightFilter) {
    case "0 - 10 kg":
      return [0, 10];
    case "10 - 50 kg":
      return [10, 50];
    case "50 - 100 kg":
      return [50, 100];
    case "100+ kg":
      return [100, null];
    default:
      return [0, null];
  }
};

const getDateRange = (dateRangeFilter, customRange = {}) => {
  const end = new Date();
  const start = new Date();

  switch (dateRangeFilter) {
    case "Last 7 days":
      start.setDate(end.getDate() - 7);
      break;
    case "Last 30 days":
      start.setDate(end.getDate() - 30);
      break;
    case "Last 90 days":
      start.setDate(end.getDate() - 90);
      break;
    case "Last 180 days":
      start.setDate(end.getDate() - 180);
      break;
    case "Last 365 days":
      start.setDate(end.getDate() - 365);
      break;
    case "Custom range":
      // Koristimo customRange samo ako su datumi postavljeni
      if (customRange.start) {
        start.setTime(new Date(customRange.start).getTime());
      } else {
        start.setFullYear(start.getFullYear() - 100); // Efektivno nema početnog datuma
      }
      if (customRange.end) {
        end.setTime(new Date(customRange.end).getTime());
      }
      break;
    default:
      start.setFullYear(start.getFullYear() - 100); // Efektivno nema početnog datuma
  }

  return { start, end };
};
