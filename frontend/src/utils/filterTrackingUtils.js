export const filterTrackings = (trackings, filters) => {
  return trackings.filter((tracking) => {
    // Check carrier filter
    if (
      filters.carrier !== "All" &&
      tracking.data.Carrier !== filters.carrier &&
      tracking.data.Carrier !== null &&
      tracking.data.Carrier !== "Not Specified"
    ) {
      return false;
    }

    // Check status filter
    if (
      filters.status !== "All" &&
      tracking.data.Status !== filters.status &&
      tracking.data.Status !== null &&
      tracking.data.Status !== "Not Specified"
    ) {
      return false;
    }

    // Check shipper filter
    if (
      filters.shipper !== "All" &&
      tracking.data.Shipper !== filters.shipper &&
      tracking.data.Shipper !== null &&
      tracking.data.Shipper !== "Not Specified"
    ) {
      return false;
    }

    // Check weight filter
    if (filters.weight !== "All") {
      const weight = parseFloat(tracking.data.Weight);

      // If weight is null, "Not Specified", or not a valid number, exclude it
      if (
        !weight ||
        isNaN(weight) ||
        tracking.data.Weight === "Not Specified"
      ) {
        return false;
      }

      const [min, max] = getWeightRange(filters.weight);
      if (weight < min || (max && weight > max)) {
        return false;
      }
    }

    // Check date range
    if (filters.dateRange === "Custom range") {
      const trackingDate = new Date(tracking.data.ETD);
      const { start, end } = filters.customDateRange || {};
      if (start && trackingDate < new Date(start)) return false;
      if (end && trackingDate > new Date(end)) return false;
    } else if (filters.dateRange !== "All") {
      const trackingDate = new Date(tracking.data.ETD);
      const dateRange = getDateRange(filters.dateRange);
      if (trackingDate < dateRange.start || trackingDate > dateRange.end) {
        return false;
      }
    }

    return true;
  });
};

export const searchTrackings = (trackings, searchTerm, searchField) => {
  if (!searchTerm) return trackings;

  const term = searchTerm.toLowerCase();
  return trackings.filter((tracking) => {
    switch (searchField) {
      case "Carrier":
        return (
          tracking.data.Carrier &&
          tracking.data.Carrier.toLowerCase().includes(term) &&
          tracking.data.Carrier !== "Not Specified"
        );
      case "PO Number":
        return (
          tracking.data.AWB &&
          tracking.data["PO Number"].toLowerCase().includes(term)
        );
      case "Shipper":
        return (
          tracking.data.Shipper &&
          tracking.data.Shipper.toLowerCase().includes(term) &&
          tracking.data.Shipper !== "Not Specified"
        );
      case "House AWB":
        return (
          tracking.data["House AWB"] &&
          tracking.data["House AWB"].toLowerCase().includes(term) &&
          tracking.data["House AWB"] !== "Not Specified"
        );
      case "All":
      default:
        return Object.values(tracking.data).some(
          (value) =>
            value &&
            String(value).toLowerCase().includes(term) &&
            value !== "Not Specified"
        );
    }
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
      // Koristimo customRange za "Custom range"
      if (customRange.start)
        start.setTime(new Date(customRange.start).getTime());
      if (customRange.end) end.setTime(new Date(customRange.end).getTime());
      break;
    default:
      start.setFullYear(start.getFullYear() - 100); // Efektivno nema početnog datuma
  }

  return { start, end };
};
