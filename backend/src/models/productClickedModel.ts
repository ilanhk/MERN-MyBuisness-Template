import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './productModel';


export interface IProductClicked extends Document {
  productId: IProduct['_id'];  // Referencing the product's ID
};

// Schema for product click with time
const productClickedSchema: Schema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,  // Use ObjectId type to reference another model
        ref: 'Product',  // Reference the Product model
        required: true,
    },
}, {
    timestamps: true,
});

const ProductClicked = mongoose.model<IProductClicked>("ProductClicked", productClickedSchema);

export default ProductClicked;