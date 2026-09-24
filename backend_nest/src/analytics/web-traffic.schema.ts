import { Document, Model, Schema, model, models } from 'mongoose';

export interface WebTrafficDocument extends Document {
  ipAddress: string;
  url: string;
  userAgent: string;
  referrer?: string;
  userId?: string;
}

const webTrafficSchema = new Schema<WebTrafficDocument>({
  ipAddress: { type: String, required: true },
  url: { type: String, required: true },
  userAgent: { type: String, required: true },
  referrer: { type: String },
  userId: { type: String },
}, { timestamps: true });

export const WebTrafficModel: Model<WebTrafficDocument> =
  (models.WebTraffic as Model<WebTrafficDocument> | undefined) ?? model<WebTrafficDocument>('WebTraffic', webTrafficSchema);
