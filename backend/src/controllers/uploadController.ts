import { Request, Response } from 'express';

import { Multer } from "multer";


declare namespace Express {
  export interface MulterS3File extends Multer {
    location: string; // Add other properties from multer-s3 if needed
  }
}

// @desc Upload a single file -any file
// @route POST /api/upload/image
// @access Admin
const uploadFile = async (req: Request, res: Response) => {
  console.log("Request received");
  const file = req.file as unknown as Express.MulterS3File | undefined;

  const fileUrl = file?.location;
  console.log(fileUrl);

  return res.status(200).json({ fileUrl });
};


export { 
  uploadFile,
  // uploadImage,
  // uploadCsv 
};

