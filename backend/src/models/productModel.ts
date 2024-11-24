import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  image: string;
  supplier: string;
  category: string;
  description: string;
  supplierPrice: number;
  price: number;
  isChosen: boolean;
  //affiliate link
};

const productSchema: Schema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    supplier: {
        type: String, 
        required: true,
    },
    category: {
        type: String, 
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    supplierPrice: {
      type: Number,
      required: true,
      default: 0,
  },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    isChosen: {
      type: Boolean, 
      required: true,
      default: false,
  },
}, {
    timestamps: true,
});


const Product = mongoose.model("Product", productSchema);

export default Product;