import multerS3 from "multer-s3";
import multer from "multer";
import path from "path";
import { s3 } from "./config/awsS3config";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.AWS_BUCKET) {
  throw new Error("AWS_BUCKET is not defined in the environment variables.");
}

const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"]; // Add more extensions as needed

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      if (!allowedExtensions.includes(fileExt.toLowerCase())) {
        return cb(new Error("Unsupported file type"), "");
      }
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `${fileName}${fileExt}`);
    },
  }),
});





// import multerS3 from "multer-s3";
// import multer from "multer";
// import { S3Client } from "@aws-sdk/client-s3";
// import dotenv from "dotenv";

// dotenv.config();

// // Initialize S3Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION, // e.g., 'us-east-1'
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// // Set up multer and S3
// export const upload = multer({
//   storage: multerS3({
//     s3, // Use S3Client instance here
//     bucket: process.env.AWS_BUCKET!,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });





