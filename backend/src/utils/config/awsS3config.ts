import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const config = {
  region: process.env.AWS_REGION || "us-east-1", // Provide a default region if necessary
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // Fallback to empty string to ensure type safety
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "", // Fallback to empty string to ensure type safety
  },
};


if (!config.credentials.accessKeyId || !config.credentials.secretAccessKey) {
  throw new Error("AWS credentials are missing. Please check your environment variables.");
}

export const s3 = new S3Client(config);
