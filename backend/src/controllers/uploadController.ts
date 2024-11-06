import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { uploadSingleImage, uploadCsvFile } from '../utils/uploadFunctions';

// @desc Upload a single Image
// @route POST /api/upload/image
// @access Admin
const uploadImage = (req: Request, res: Response) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${req.file?.path}`,
    });
  });
};


// @desc Upload a single CSV file
// @route POST /api/upload/csv
// @access Admin
const uploadCsv = (req: Request, res: Response) => {
  uploadCsvFile(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
    };

    const csvFilePath = req.file?.path; // Path to uploaded file
    const results: any[] = [];

    if (csvFilePath) {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row: { [key: string]: string }) => {
          // Process the row
          const processedData = {
            name: row.name,
            image: row.image,
            supplier: row.supplier,
            category: row.category,
            description: row.description,
            supplierPrice: parseFloat(row.supplierPrice),
            
          };
          results.push(processedData);
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
          res.json({
            message: 'CSV processed successfully',
            data: results,
          });
        })
        .on('error', (error: Error) => {
          console.error('Error processing CSV file:', error);
          res.status(500).json({ error: 'Error processing CSV file' });
        });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  });
};



export { 
  uploadImage,
  uploadCsv 
};
