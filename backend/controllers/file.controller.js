import fs from "fs";
import path from "path";
import File from "../models/file.model.js";
import Tracking from "../models/tracking.model.js";
import { processExcelFile } from "../utils/excelParser.js";

export const uploadFile = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const filePath = path.resolve(file.path);
    const buffer = fs.readFileSync(filePath);
    // Parsiranje Excel fajla
    const { trackingData, carrier } = processExcelFile(buffer);

    console.log(trackingData);
    // Kreiranje zapisa za fajl u bazi
    const fileRecord = new File({
      fileName: file.originalname,
      carrier: carrier || "Unknown",
      totalRows: trackingData.length,
      status: "N/A",
    });

    // Provera nosioca
    if (!fileRecord.carrier || fileRecord.carrier === "Unknown") {
      fileRecord.status = "Failed";
      fileRecord.failureReason = "Carrier is not recognized or is missing.";
      await fileRecord.save();

      fs.unlinkSync(filePath); // Brisanje fajla nakon obrade

      return res.status(200).json({
        message: "File upload completed with failures.",
        file: fileRecord,
      });
    }

    let importedRows = 0;
    let duplicatedRows = 0;

    const fieldsToCheck = [
      "Status",
      "PO Number",
      "ETD",
      "ETA",
      "ATD",
      "ATA",
      "Packages",
      "Weight",
      "Volume",
      "Shipper",
      "Shipper Country",
      "Receiver",
      "Receiver Country",
      "House AWB",
      "Shipper Ref. No",
      "Carrier",
      "Inco Term",
      "Flight No",
      "Pick-up Date",
      "Latest Checkpoint",
    ];

    // Obrada redova
    for (const row of trackingData) {
      try {
        const query = {};
        fieldsToCheck.forEach((field) => {
          if (
            row[field] !== undefined &&
            row[field] !== 0 &&
            row[field] !== null &&
            row[field] !== "" &&
            (typeof row[field] !== "string" || row[field].trim() !== "")
          ) {
            query[`data.${field}`] = row[field];
          }
        });

        // Proveri da li postoji dokument sa istim vrednostima u navedenim poljima
        const existingData = await Tracking.findOne(query);

        if (!existingData) {
          const trackingRecord = new Tracking({
            data: row,
            fileId: fileRecord._id,
            fileName: fileRecord.fileName,
          });
          await trackingRecord.save();
          importedRows++;
        } else {
          duplicatedRows++;
        }
      } catch (error) {
        console.error(`Failed to process row: ${row}`, error.message);
      }
    }

    // Ažuriranje vrednosti u fajlu
    fileRecord.importedRows = importedRows;
    fileRecord.duplicatedRows = duplicatedRows;
    fileRecord.calculateSuccessRate();
    fileRecord.status = importedRows > 0 ? "Validated" : "Failed";

    if (importedRows === 0) {
      fileRecord.failureReason =
        duplicatedRows > 0
          ? "All rows are duplicates."
          : "Unknown error prevented importing any rows.";
    }

    await fileRecord.save();

    // Brisanje privremenog fajla
    fs.unlinkSync(filePath);

    // Priprema odgovora
    const responseMessage =
      importedRows > 0
        ? "File uploaded and processed successfully."
        : `File processing completed with failures. ${fileRecord.failureReason}`;

    return res.status(200).json({
      message: responseMessage,
      file: fileRecord,
    });
  } catch (error) {
    console.error("Error processing file:", error.message);
    return res.status(500).json({
      message: "An error occurred while processing the file.",
      error: error.message,
    });
  }
};
