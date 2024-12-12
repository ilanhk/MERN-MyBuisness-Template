import { Request } from 'express';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Check if AWS credentials are set
const isAWSEnabled = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION;

// Define storage configuration
let storage: multer.StorageEngine;

if (isAWSEnabled) {
  // Configure S3Client
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION,
  });

  // Define S3 storage configuration
  storage = multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET || '',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueKey = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueKey);
    },
  });
} else {
  // Fallback to local storage if AWS credentials are not set
  const localFolder = path.join(__dirname, 'uploads');

  // Ensure the local folder exists
  if (!fs.existsSync(localFolder)) {
    fs.mkdirSync(localFolder, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, localFolder);
    },
    filename: (req, file, cb) => {
      const uniqueKey = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueKey);
    },
  });
}

// File filter function
function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const filetypes = /jpe?g|png|webp|csv|xls|xlsx|pdf|doc|docx/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|text\/csv|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(null, false); // Reject invalid file types
  }
}

// Initialize multer with the chosen storage
const upload = multer({ storage, fileFilter });

// Export the middleware for image and file uploads
export const uploadSingleImage = upload.single('image');
export const uploadSingleFile = upload.single('file'); // includes pdfs, word, csv and excel files
