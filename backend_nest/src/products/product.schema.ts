import { Document, Model, Schema, model, models } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  image: string;
  supplier: string;
  category: string;
  description: string;
  supplierPrice: number;
  price: number;
  isChosen: boolean;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  supplier: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  supplierPrice: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  isChosen: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export const ProductModel: Model<ProductDocument> =
  (models.Product as Model<ProductDocument> | undefined) ?? model<ProductDocument>('Product', productSchema);
