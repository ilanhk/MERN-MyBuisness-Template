import { Document, Model, Schema, model, models } from 'mongoose';

export interface ProductClickedDocument extends Document {
  productId: string;
}

const productClickedSchema = new Schema<ProductClickedDocument>({
  productId: { type: String, required: true },
}, { timestamps: true });

export const ProductClickedModel: Model<ProductClickedDocument> =
  (models.ProductClicked as Model<ProductClickedDocument> | undefined) ?? model<ProductClickedDocument>('ProductClicked', productClickedSchema);
