import { Document, Model, Schema, model, models, Types } from 'mongoose';

export interface ProductClickedDocument extends Document {
  productId: Types.ObjectId;
}

const productClickedSchema = new Schema<ProductClickedDocument>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
}, { timestamps: true });

export const ProductClickedModel: Model<ProductClickedDocument> =
  (models.ProductClicked as Model<ProductClickedDocument> | undefined) ?? model<ProductClickedDocument>('ProductClicked', productClickedSchema);
