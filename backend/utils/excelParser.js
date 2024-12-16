import XLSX from "xlsx";
import { convertWeight, isPotentialDate } from "./dataConverters.js";

// Provider content carrier structure for DHL, Hellman & Logwin
const carriers = [
  {
    name: "DHL",
    fields: [
      "Payer Account Number",
      "Pickup Date",
      "Origin Country/Territory IATA code",
      "Origin City IATA Code",
      "Destination Country/Territory IATA code",
      "Destination City IATA Code",
      "Waybill Number",
      "Shipper Reference Number",
      "Receiver",
      "Receiver Postal Code",
      "Product Code",
      "Pieces",
      "Piece ID",
      "Manifested Weight",
      "Estimated Delivery Date",
      "Last Checkpoint Code",
      "Latest Checkpoint Date/Time",
      "Latest Checkpoint",
      "Latest Checkpoint's Remarks",
      "Location of Scan",
      "Customer Uploaded Comments",
      "Comments",
    ],
  },
  {
    name: "Hellman",
    fields: [
      "Status",
      "House AWB",
      "Shipper Name",
      "Shipper Country",
      "Consignee Name",
      "Consignee Country",
      "Departure Country",
      "Departure Port",
      "Destination Country",
      "Destination Port",
      "Incoterm",
      "Flight No",
      "No of Packages",
      "Gross Weight (Kg)",
      "Chargeable Weight (Kg)",
      "Act. Pick Up",
      "Flight ETD",
      "Flight ATD",
      "Flight ETA",
      "Flight ATA",
      "Act. Delivery",
    ],
  },
  {
    name: "Logwin",
    fields: [
      "Status",
      "MOT",
      "Port of Origin",
      "Port of Destination",
      "Shipment No.",
      "House",
      "Master",
      "Shipper",
      "Consignee",
      "PO Number",
      "Shipper Ref.",
      "ETD",
      "ETA",
      "ATD",
      "ATA",
      "Vessel",
      "Voyage / Flight",
      "Carrier",
      "Container",
      "Packages",
      "Weight",
      "Volume",
    ],
  },
];

// Field Mapping for Excel file. Function returns an array of objects with mapped data.
// Array is empty if no matching carrier is found.
export const processExcelFile = (buffer) => {
  // Load the Excel workbook from the provided buffer
  const workbook = XLSX.read(buffer, {
    type: "buffer", // Load the workbook from a buffer
    cellDates: true, // Parse dates in cells
    sheetStubs: true,
  });

  // Process each sheet and return the first matching carrier's data
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const trackingData = XLSX.utils.sheet_to_json(sheet, {
      defval: null, // Default value for empty cells
    });

    let matchingCarrierRow = -1; // Row index of the first row with matching carrier
    let matchingCarrier = { name: "Unknown", fields: [] }; // Matching carrier name (DHL, Hellman, Logwin)
    let mappedTrackingData = []; // Array of final mapped data

    // Identify the matching carrier by comparing fields in the data
    for (const trackingDataItem of trackingData) {
      matchingCarrierRow++;
      const trackingDataKeys = Object.keys(trackingDataItem).filter(
        (key) =>
          trackingDataItem[key] !== null && trackingDataItem[key] !== undefined
      );
      const trackingDataValues = Object.values(trackingDataItem).filter(
        (value) => value !== null && value !== undefined
      );

      // Find a carrier whose fields match either keys or values in the data
      matchingCarrier = carriers.find(
        (carrier) =>
          trackingDataValues.every((value) =>
            carrier.fields.includes(
              (value === null || value === undefined ? "" : String(value))
                .replaceAll(/\r|\n/g, " ")
                .replaceAll("  ", " ")
            )
          ) ||
          trackingDataKeys.every((key) =>
            carrier.fields.includes(
              (key === null || key === undefined ? "" : String(key))
                .replaceAll(/\r|\n/g, " ")
                .replaceAll("  ", " ")
            )
          )
      );

      if (matchingCarrier) {
        break;
      }
    }

    // If a matching carrier is found, process its data
    if (matchingCarrier) {
      const retrievedTrackingData = [];

      // Extract data starting from the row after the carrier is identified
      for (
        let i =
          matchingCarrierRow + (matchingCarrier.name === "Logwin" ? 0 : 1);
        i < trackingData.length;
        i++
      ) {
        const trackingDataItem = trackingData[i];
        if (!trackingDataItem) continue;

        const retrievedTrackingDataObject = {};
        matchingCarrier.fields.forEach((field, index) => {
          const value = Object.values(trackingDataItem)[index];

          retrievedTrackingDataObject[field] = isPotentialDate(value)
            ? (() => {
                const date = new Date(value);
                return isNaN(date.getTime()) ? null : date; // Proveri validnost datuma
              })()
            : value === ""
            ? null // Prazne vrednosti postavi na null
            : value; // Sve ostalo ostavi nepromenjeno
        });

        // Add the mapped data to the array
        retrievedTrackingData.push(retrievedTrackingDataObject);
      }

      // Maps and fills predefined fields based on the carrier
      switch (matchingCarrier.name) {
        case "DHL":
          mappedTrackingData = retrievedTrackingData.map(
            ({
              "Waybill Number": house,
              "Shipper Reference Number": shipperRef,
              Receiver: receiver,
              Pieces: packages,
              "Manifested Weight": weight,
              "Estimated Delivery Date": eta,
              ...rest
            }) => ({
              Status: null,
              "House AWB": house,
              Shipper: null,
              Receiver: null,
              "PO Number": null,
              "Shipper Ref. No": shipperRef,
              ETD: null,
              ETA: eta,
              ATD: null,
              ATA: null,
              Carrier: null,
              Packages: packages,
              Weight: convertWeight(weight),
              Volume: null,
              "Shipper Country": null,
              Receiver: receiver,
              "Receiver Country": null,
              Carrier: matchingCarrier.name,
              "Inco Term": null,
              "Flight No": null,
              "Pick-up Date": null,
              "Latest Checkpoint": null,
              "Additional Info": rest,
            })
          );
          break;
        case "Hellman":
          mappedTrackingData = retrievedTrackingData.map(
            ({
              Status: status,
              "House AWB": house,
              "Shipper Name": shipper,
              "Shipper Country": shipperCountry,
              Consignee: consignee,
              "Consignee Country": consigneeCountry,
              "Flight ETD": etd,
              "Flight ETA": eta,
              "Flight ATD": atd,
              "Flight ATA": ata,
              "No of Packages": packages,
              "Gross Weight (Kg)": weight,
              ...rest
            }) => ({
              Status: status,
              "House AWB": house,
              Shipper: shipper,
              Receiver: consignee,
              "PO Number": null,
              "Shipper Ref. No": null,
              ETD: etd,
              ETA: eta,
              ATD: atd,
              ATA: ata,
              Carrier: matchingCarrier.name,
              Packages: packages,
              Weight: convertWeight(weight),
              Volume: null,
              "Shipper Country": shipperCountry,
              Receiver: null,
              "Receiver Country": consigneeCountry,
              Carrier: matchingCarrier.name,
              "Inco Term": null,
              "Flight No": null,
              "Pick-up Date": null,
              "Latest Checkpoint": null,
              "Additional Info": rest,
            })
          );
          break;
        case "Logwin":
          mappedTrackingData = retrievedTrackingData.map(
            ({
              Status: status,
              House: house,
              Shipper: shipper,
              Consignee: consignee,
              "PO Number": poNumber,
              "Shipper Ref.": shipperRef,
              ETD: etd,
              ETA: eta,
              ATD: atd,
              ATA: ata,
              Carrier: carrier,
              Packages: packages,
              Weight: weight,
              Volume: volume,
              ...rest
            }) => ({
              Status: status,
              "House AWB": house,
              Shipper: shipper,
              Receiver: consignee,
              "PO Number": poNumber,
              "Shipper Ref. No": shipperRef,
              ETD: etd,
              ETA: eta,
              ATD: atd,
              ATA: ata,
              Carrier: carrier,
              Packages: packages,
              Weight: convertWeight(weight),
              Volume: volume,
              "Shipper Country": null,
              Receiver: null,
              "Receiver Country": null,
              Carrier: matchingCarrier.name,
              "Inco Term": null,
              "Flight No": null,
              "Pick-up Date": null,
              "Latest Checkpoint": null,
              "Additional Info": rest,
            })
          );
          break;
      }

      return {
        trackingData: mappedTrackingData,
        carrier: matchingCarrier.name,
      };
    }
  }

  // If no matching carrier is found in any sheet
  return { trackingData: [], carrier: "Unknown" };
};
