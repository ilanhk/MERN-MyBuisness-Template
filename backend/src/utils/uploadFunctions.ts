import { Request } from 'express';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';

// Use AWS S3 storage instead of diskStorage for production
const storage = multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, 'uploads/'); // cb is the callback, null is error, and 'uploads/' is the folder for uploads
    },
    filename(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Generates a unique filename
    }
});

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  // Adding csv, xls, and xlsx to the file extensions
  const filetypes = /jpe?g|png|webp|csv|xls|xlsx/;
  
  // Adding appropriate mimetypes for csv and excel files
  const mimetypes = /image\/jpe?g|image\/png|image\/webp|text\/csv|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
      cb(null, true);
  } else {
      cb(null, false); //Multer will automatically handle this as an invalid file.
  }
};

const upload = multer({ storage, fileFilter });

// Type the middleware explicitly as RequestHandler
export const uploadSingleImage = upload.single('image');
export const uploadCsvFile = upload.single('file');