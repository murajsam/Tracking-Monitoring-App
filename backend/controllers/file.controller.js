import fs from 'fs';
import path from 'path';
import File from '../models/file.model.js';
import Data from '../models/data.model.js';
import { parseExcelFile } from '../utils/excelParser.js';

export const uploadFile = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const filePath = path.resolve(file.path);
    const buffer = fs.readFileSync(filePath);

    // Parsiranje Excel fajla
    const { finalMappedData, finalCarrier } = parseExcelFile(buffer);

    // Kreiranje novog zapisa za fajl u bazi
    const fileRecord = new File({
      fileName: file.originalname,
      carrier: finalCarrier,
      totalRows: finalMappedData.length,
    });

    let importedRows = 0;

    // Čuvanje parsiranih podataka u bazi bez duplikata
    for (const row of finalMappedData) {
      try {
        // Proveri da li već postoji zapis sa istim 'House AWB'
        const existingData = await Data.findOne({
          'House AWB': row['House AWB'],
        });

        if (!existingData) {
          const dataRecord = new Data({
            ...row,
            fileId: fileRecord._id, // Povezivanje podataka sa fajlom
          });
          await dataRecord.save();
          importedRows++;
        } else {
          console.log(`Duplicate found for House AWB: ${row['House AWB']}`);
        }
      } catch (error) {
        console.error(`Failed to save row: ${row}`, error.message);
      }
    }

    // Ažuriranje zapisa fajla sa rezultatima uvoza
    fileRecord.importedRows = importedRows;
    fileRecord.calculateSuccessRate();
    fileRecord.status = importedRows > 0 ? 'Validated' : 'Failed';
    await fileRecord.save();

    // Brisanje učitanog fajla nakon obrade
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: 'File uploaded and processed successfully',
      carrier: finalCarrier,
      importedRows,
      totalRows: finalMappedData.length,
      successRate: fileRecord.successRate,
    });
  } catch (error) {
    console.error('Error processing file:', error.message);
    return res.status(500).json({ message: 'An error occurred while processing the file' });
  }
};
