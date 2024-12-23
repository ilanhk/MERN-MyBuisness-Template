import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  image: string;
  description: string;
  isChosen: boolean;
};

const serviceSchema: Schema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    image: {
        type: String, 
        required: true,
    },
    description: {
          type: String, 
          required: true,

    },
    isChosen: {
        type: Boolean, 
        required: false,
        default: false,

  },
}, {
    timestamps: true,
});


const Service = mongoose.model("Service", serviceSchema);

export default Service;