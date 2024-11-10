import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyInfo extends Document {
  home: {
    valueProposition: {
      proposition: string;
      callToAction: string;
    };
    customerSection: {
      title: string;
      description: string;
    };
  };
  about: {
    title: string;
    description: string;
    image: string;
  };
  services: {
    title: string;
    description: string;
  };
  contactUs: {
    title: string;
    description: string;
    email: {
      contact: string;
      website: string;
    };
    phone: {
      countryCode: string;
      phone: string;
      fax: string;
    };
    address: {
      address1: string;
      address2: string;
      area: string;
      city: string;
      country: string;
      postalCode: string;
      fullAddress: string;
    };
    socialmedia: {
      linkedin: string;
      facebook: string;
      instagram: string;
      twitter: string;
      tickTock: string;
      youtube: string;
      amazon: string;
      aliexpress: string;
    };
  };
}

const companyInfoSchema: Schema = new mongoose.Schema(
  {
    home: {
      valueProposition: {
        proposition: { type: String, required: true },
        callToAction: { type: String, required: true },
      },
      customerSection: {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    },
    about: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
    },
    services: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    contactUs: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      email: {
        contact: { type: String, required: true },
        website: { type: String, required: false },
      },
      phone: {
        countryCode: { type: String, required: true },
        phone: { type: String, required: true },
        fax: { type: String, required: false },
      },
      address: {
        address1: { type: String, required: true },
        address2: { type: String, required: false },
        area: { type: String, required: false },
        city: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
        fullAddress: { type: String, required: true },
      },
      socialmedia: {
        linkedin: { type: String, required: true },
        facebook: { type: String, required: false },
        instagram: { type: String, required: false },
        twitter: { type: String, required: false },
        tickTock: { type: String, required: false },
        youtube: { type: String, required: false },
        amazon: { type: String, required: false },
        aliexpress: { type: String, required: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

const CompanyInfo = mongoose.model<ICompanyInfo>('CompanyInfo', companyInfoSchema);

export default CompanyInfo;