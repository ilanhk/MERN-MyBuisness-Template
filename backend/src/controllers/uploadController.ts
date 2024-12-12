import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import { uploadSingleImage, uploadSingleFile } from '../utils/uploadFunctions';

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
  uploadSingleFile(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    const csvFilePath = req.file?.path; // Path to uploaded file
    const results: any[] = [];
    const invalidRows: string[] = [];

    if (csvFilePath) {
      fs.createReadStream(csvFilePath)
        .pipe(csv()) // Parse CSV file
        .on("data", (row: { [key: string]: string }) => {
          try {
            // Process each row as a JSON object
            const processedData = {
              name: row.name,
              image: row.image,
              supplier: row.supplier,
              category: row.category,
              description: row.description,
              supplierPrice: parseFloat(row.supplierPrice),
            };

            // Check if parsing is valid (e.g., valid supplierPrice)
            if (isNaN(processedData.supplierPrice)) {
              throw new Error("Invalid supplierPrice");
            }

            results.push(processedData);
          } catch (error) {
            // If there's an error, add the row to the invalidRows list
            invalidRows.push(JSON.stringify(row)); // Save the raw row that couldn't be parsed
          }
        })
        .on("end", () => {
          console.log("CSV file successfully processed");

          // Write valid results to a JSON file
          const jsonFilePath = `./uploads/processed_data_${Date.now()}.json`;
          fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2), (err) => {
            if (err) {
              console.error("Error saving JSON file:", err);
              return res.status(500).json({ error: "Error saving JSON file" });
            }

            // Return the response
            return res.status(200).json({
              message: "CSV processed successfully",
              data: results, // Parsed data with column names
              invalidRows, // Rows that couldn't be parsed
              jsonFilePath, // Path to the saved JSON file
            });
          });
        })
        .on("error", (error: Error) => {
          console.error("Error processing CSV file:", error);
          return res.status(500).json({ error: "Error processing CSV file" });
        });
    } else {
      return res.status(400).json({ error: "No file uploaded" });
    }
  });
};






export { 
  uploadImage,
  uploadCsv 
};
