import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteStyles extends Document {
  general: {
    backgroundColor: string;
    font: string;
    wordColor: string;
    wordSize: string;
    titleSize: string
  };
  headerAndFooter: {
    backgroundColor: string;
    fontSize: string;
    wordColor: string;
    dropdown: {
      backgroundColor: string;
      wordColor: string;
      hoverColor: string;
    };
  };
  admin: {
    backgroundColor: string;
    wordColor: string;
    sideBar:{
      backgroundColor: string;
      wordColor: string;
    };
  };
  saves: {
    colors: string[];
    fonts: string[];
  }
};

const WebsiteStylesSchema: Schema = new mongoose.Schema({
  general: {
    backgroundColor: { type: String, required: true },
    font: { type: String, required: true },
    wordColor: { type: String, required: true },
    wordSize: { type: String, required: true },
    titleSize: { type: String, required: true },
  },
  headerAndFooter: {
    backgroundColor: { type: String, required: true },
    fontSize: { type: String, required: true },
    wordColor:{ type: String, required: true },
    dropdown: {
      backgroundColor: { type: String, required: true },
      wordColor: { type: String, required: true },
      hoverColor: { type: String, required: true },
    },
  },
  admin: {
    backgroundColor: { type: String, required: true },
    wordColor: { type: String, required: true },
    sideBar:{
      backgroundColor: { type: String, required: true },
      wordColor: { type: String, required: true },
    },
  },
  saves: {
    colors: { type: [String], required: false, default: [] },
    fonts: { type: [String], required: false, default: [] },
  }, 
}, {
    timestamps: true,
});


const WebsiteStyles = mongoose.model("WebsiteStyles", WebsiteStylesSchema);

export default WebsiteStyles;