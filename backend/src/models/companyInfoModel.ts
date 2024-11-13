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
    socialMedia: {
      linkedin: string;
      facebook: string;
      instagram: string;
      twitter: string;
      tiktok: string;
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
        proposition: { type: String, required: false },
        callToAction: { type: String, required: false },
      },
      customerSection: {
        title: { type: String, required: false },
        description: { type: String, required: false },
      },
    },
    about: {
      title: { type: String, required: false },
      description: { type: String, required: false },
      image: { type: String, required: false },
    },
    services: {
      title: { type: String, required: false },
      description: { type: String, required: false },
    },
    contactUs: {
      title: { type: String, required: false },
      description: { type: String, required: false },
      email: {
        contact: { type: String, required: false },
        website: { type: String, required: false },
      },
      phone: {
        countryCode: { type: String, required: false },
        phone: { type: String, required: false },
        fax: { type: String, required: false },
      },
      address: {
        address1: { type: String, required: false },
        address2: { type: String, required: false },
        area: { type: String, required: false },
        city: { type: String, required: false },
        country: { type: String, required: false },
        postalCode: { type: String, required: false },
        fullAddress: { type: String, required: false },
      },
      socialMedia: {
        linkedin: { type: String, required: false },
        facebook: { type: String, required: false },
        instagram: { type: String, required: false },
        twitter: { type: String, required: false },
        tiktok: { type: String, required: false },
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