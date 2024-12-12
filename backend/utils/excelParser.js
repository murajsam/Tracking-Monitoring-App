import XLSX from "xlsx";
import { convertWeight, validateDate } from "./dataConverters.js";

const predefinedStructure = {
  Status: { type: "string", convert: (value) => value },
  "PO Number": { type: "string", convert: (value) => value },
  ETD: { type: "date", convert: validateDate },
  ETA: { type: "date", convert: validateDate },
  ATD: { type: "date", convert: validateDate },
  ATA: { type: "date", convert: validateDate },
  Packages: {
    type: "number",
    convert: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0 ? num : null;
    },
  },
  Weight: { type: "number", convert: convertWeight },
  Volume: {
    type: "number",
    convert: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0 ? Number(num.toFixed(2)) : null;
    },
  },
  Shipper: { type: "string", convert: (value) => value },
  "Shipper Country": { type: "string", convert: (value) => value },
  Receiver: { type: "string", convert: (value) => value },
  "Receiver Country": { type: "string", convert: (value) => value },
  "House AWB": { type: "string", convert: (value) => value },
  "Shipper Ref. No": { type: "string", convert: (value) => value },
  Carrier: { type: "string", convert: (value) => value },
  "Inco Term": { type: "string", convert: (value) => value },
  "Flight No": { type: "string", convert: (value) => value },
  "Pick-up Date": { type: "date", convert: validateDate },
  "Latest Checkpoint": { type: "date", convert: validateDate },
};

const carriers = [
  {
    name: "Hellman",
    expectedHeaders: ["Consignee", "House", "Shipper Name"],
    aliasHeaders: ["Consignee Name", "House AWB", "Shipper"],
    dateFields: ["Flight ETD", "Flight ATD", "Flight ETA", "Flight ATA"],
  },
  {
    name: "DHL",
    expectedHeaders: [
      "Waybill Number",
      "Shipper Reference Number",
      "Estimated Delivery Date",
    ],
    aliasHeaders: [],
    dateFields: [
      "Pickup Date",
      "Latest Checkpoint Date/Time",
      "Estimated Delivery Date",
    ],
  },
  {
    name: "Logwin",
    expectedHeaders: ["House", "ETD", "ETA", "ATD", "ATA"],
    aliasHeaders: [],
    dateFields: ["ETD", "ATD", "ETA", "ATA"],
  },
];

const carrierMappings = {
  DHL: {
    "House AWB": "Waybill Number",
    "Shipper Ref. No": "Shipper Reference Number",
    Receiver: "Receiver",
    Packages: "Pieces",
    Weight: "Manifested Weight",
    ETA: "Estimated Delivery Date",
  },
  Hellman: {
    Status: "Status",
    "House AWB": "House AWB",
    Shipper: "Shipper Name",
    "Shipper Country": "Shipper Country",
    Receiver: "Consignee",
    "Receiver Country": "Consignee Country",
    Packages: "No of Packages",
    Weight: "Gross Weight (Kg)",
    ETD: "Flight ETD",
    ETA: "Flight ETA",
    ATD: "Flight ATD",
    ATA: "Flight ATA",
  },
  Logwin: {
    Status: "Status",
    "House AWB": "House",
    Shipper: "Shipper",
    Receiver: "Consignee",
    "PO Number": "PO Number",
    "Shipper Ref. No": "Shipper Ref.",
    ETD: "ETD",
    ETA: "ETA",
    ATD: "ATD",
    ATA: "ATA",
    Carrier: "Carrier",
    Packages: "Packages",
    Weight: "Weight",
    Volume: "Volume",
  },
};

export const parseExcelFile = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  let finalMappedData = [];
  let finalCarrier = "Unknown";

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    carriers.forEach((carrier) => {
      const headerRowIndex = allData.findIndex((row) => {
        const headers =
          row?.map((header) =>
            typeof header === "string"
              ? header.replace(/\s+/g, " ").trim()
              : ""
          ) || [];

        const matchedHeaders = carrier.expectedHeaders.filter((expected) =>
          headers.includes(expected)
        );

        if (matchedHeaders.length < carrier.expectedHeaders.length) {
          carrier.expectedHeaders.forEach((expected, idx) => {
            if (!matchedHeaders.includes(expected)) {
              const alias = carrier.aliasHeaders[idx];
              if (alias && headers.includes(alias)) {
                matchedHeaders.push(expected);
              }
            }
          });
        }

        return matchedHeaders.length === carrier.expectedHeaders.length;
      });

      if (headerRowIndex !== -1) {
        const headers = allData[headerRowIndex]?.map((header) =>
          typeof header === "string"
            ? header.replace(/\s+/g, " ").trim()
            : ""
        );

        const dataWithHeaders = allData
          .slice(headerRowIndex + 1)
          .map((row) => {
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index] || null;
            });
            return rowData;
          });

        const mappedData = dataWithHeaders.map((row) => {
          const mappedRow = {};

          Object.keys(predefinedStructure).forEach((field) => {
            const mappedField = carrierMappings[carrier.name][field];
            const originalValue = mappedField ? row[mappedField] : null;
            const { convert } = predefinedStructure[field];

            mappedRow[field] = convert(originalValue);
          });

          return mappedRow;
        });

        finalMappedData = mappedData;
        finalCarrier = carrier.name;
        console.log(`Carrier recognized: ${carrier.name}`);
      }
    });
  });

  if (finalMappedData.length === 0) {
    console.error("No matching template found.");
  }

  return {finalMappedData, finalCarrier};
};
