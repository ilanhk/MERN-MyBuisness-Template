import { Request, Response } from 'express';
import axios from 'axios';
import { parse } from 'csv-parse';

export interface MulterS3File extends Express.Multer.File {
  location: string;
}

// @desc Upload a single file -any file
// @route POST /api/upload/image
// @access Admin
const uploadFile = async (req: Request, res: Response) => {
  console.log("Request received");

  const file = req.file as MulterS3File | undefined;
  const fileUrl = file?.location;

  console.log(fileUrl);
  return res.status(200).json({ fileUrl });
};


// @desc Upload a csv file
// @route POST /api/upload/csv
// @access Admin
const uploadCsvFile = async (req: Request, res: Response) => {
  const file = req.file as MulterS3File | undefined;

  if (!file || !file.location || !file.originalname.endsWith('.csv')) {
    return res.status(400).json({ message: 'Please upload a valid CSV file' });
  }

  try {
    const response = await axios.get(file.location, { responseType: 'stream' });
    const results: Record<string, string>[] = [];

    response.data
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => results.push(row))
      .on('end', () => res.json({ data: results }))
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ message: 'Failed to parse CSV' });
      });

  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch uploaded CSV' });
  }
};

export { 
  uploadFile,
  uploadCsvFile
};


