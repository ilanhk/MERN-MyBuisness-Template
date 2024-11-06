import mongoose, { Schema, Document } from 'mongoose';

// Interface for the web traffic document
export interface IWebTraffic extends Document {
  ipAddress: string;
  url: string;
  userAgent: string;
  referrer?: string;
  userId?: string;  // Optional: to track logged-in users
}

// Web traffic schema
const webTrafficSchema: Schema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  referrer: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Optional: If you want to track logged-in users
  },
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields
});

// Create the WebTraffic model
const WebTraffic = mongoose.model<IWebTraffic>('WebTraffic', webTrafficSchema);

export default WebTraffic;