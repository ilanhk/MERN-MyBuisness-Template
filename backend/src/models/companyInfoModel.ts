import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyInfo extends Document {
  valueProposition: {
    proposition: string;
    callToAction: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
  };
  services: {
    title: string;
  };
  contactUs: {
    email: string;
    address: string;
    socialmedia: {
      linkedin: string;
      facebook: string;
      instagram: string;
      twitter: string;
      tickTock: string;
      youtube: string;
    };
  };
}

const companyInfoSchema: Schema = new mongoose.Schema(
  {
    valueProposition: {
      proposition: {
        type: String,
        required: true,
      },
      callToAction: {
        type: String,
        required: true,
      },
    },
    about: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    services: {
      title: {
        type: String,
        required: true,
      },
    },
    contactUs: {
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      socialmedia: {
        linkedin: {
          type: String,
          required: true,
        },
        facebook: {
          type: String,
          required: false,
        },
        instagram: {
          type: String,
          required: false,
        },
        twitter: {
          type: String,
          required: false,
        },
        tickTock: {
          type: String,
          required: false,
        },
        youtube: {
          type: String,
          required: false,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema);

export default CompanyInfo;
