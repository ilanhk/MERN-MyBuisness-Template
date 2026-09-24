import { Document, Model, Schema, model, models } from 'mongoose';

export interface ServiceDocument extends Document {
  name: string;
  image: string;
  description: string;
  isChosen: boolean;
}

const serviceSchema = new Schema<ServiceDocument>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  isChosen: { type: Boolean, default: false },
}, { timestamps: true });

export const ServiceModel: Model<ServiceDocument> =
  (models.Service as Model<ServiceDocument> | undefined) ?? model<ServiceDocument>('Service', serviceSchema);
