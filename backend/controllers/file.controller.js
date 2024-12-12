import fs from 'fs';
import path from 'path';
import File from '../models/file.model.js';
import Data from '../models/data.model.js';
import { parseExcelFile } from '../utils/excelParser.js';

export const uploadFile = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ 
        message: 'File is required' 
      });
    }

    const filePath = path.resolve(file.path);
    const buffer = fs.readFileSync(filePath);

    // Parsiranje Excel fajla
    const { finalMappedData, finalCarrier } = parseExcelFile(buffer);

    // Kreiranje zapisa za fajl u bazi
    const fileRecord = new File({
      fileName: file.originalname,
      carrier: finalCarrier || 'Unknown',
      totalRows: finalMappedData.length,
      status: 'N/A',
    });

    // Provera nosioca
    if (!finalCarrier || finalCarrier === 'Unknown') {
      fileRecord.status = 'Failed';
      fileRecord.failureReason = 'Carrier is not recognized or is missing.';
      await fileRecord.save();

      fs.unlinkSync(filePath); // Brisanje fajla nakon obrade

      return res.status(200).json({
        message: 'File upload completed with failures.',
        file: fileRecord,
      });
    }

    let importedRows = 0;
    let duplicateCount = 0;

    // Obrada redova
    for (const row of finalMappedData) {
      try {
        const existingData = await Data.findOne({ 'House AWB': row['House AWB'] });

        if (!existingData) {
          const dataRecord = new Data({
            ...row,
            fileId: fileRecord._id, // Povezivanje sa fajlom
          });
          await dataRecord.save();
          importedRows++;
        } else {
          duplicateCount++;
        }
      } catch (error) {
        console.error(`Failed to process row: ${row}`, error.message);
      }
    }

    // Ažuriranje vrednosti u fajlu
    fileRecord.importedRows = importedRows;
    fileRecord.duplicatedRows = duplicateCount;
    fileRecord.calculateSuccessRate();
    fileRecord.status = importedRows > 0 ? 'Validated' : 'Failed';

    if (importedRows === 0) {
      fileRecord.failureReason = duplicateCount > 0 
        ? 'All rows are duplicates.' 
        : 'Unknown error prevented importing any rows.';
    }

    await fileRecord.save();

    // Brisanje privremenog fajla
    fs.unlinkSync(filePath);

    // Priprema odgovora
    const responseMessage = importedRows > 0
      ? 'File uploaded and processed successfully.'
      : `File processing completed with failures. ${fileRecord.failureReason}`;

    return res.status(200).json({
      message: responseMessage,
      file: fileRecord,
    });
  } catch (error) {
    console.error('Error processing file:', error.message);
    return res.status(500).json({
      message: 'An error occurred while processing the file.',
      error: error.message,
    });
  }
};
