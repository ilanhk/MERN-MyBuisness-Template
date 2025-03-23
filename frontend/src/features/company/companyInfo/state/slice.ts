import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../../../app/store';

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL!;

export enum EnumStatus {
  Loading,
  Success,
  Fail,
  Null,
}

export type CompanyInfoState = {
  _id: string;
  company: {
    name: string | null;
    logoImage: string | null; //need to save the file path of aws link or filepath of image in a local folder
    companyType: {
      isEcommerce: boolean | false;
      hasProducts: boolean | false;
    };
  };
  home: {
    valueProposition: {
      proposition: string | null;
      callToAction: string | null;
      image: string | null;
    };
    customerSection: {
      title: string | null;
      description: string | null;
    };
  };
  about: {
    title: string | null;
    description: string | null;
    image: string | null;
  };
  services: {
    title: string | null;
    description: string | null;
  };
  contactUs: {
    title: string | null;
    description: string | null;
    email: {
      contact: string | null;
      website: string | null;
    };
    phone: {
      countryCode: string | null;
      phone: string | null;
      fax: string | null;
    };
    address: {
      address1: string | null;
      address2: string | null;
      area: string | null;
      city: string | null;
      country: string | null;
      postalCode: string | null;
      fullAddress: string | null;
    };
    socialMedia: {
      linkedin: string | null;
      facebook: string | null;
      instagram: string | null;
      twitter: string | null;
      tiktok: string | null;
      youtube: string | null;
      amazon: string | null;
      aliexpress: string | null;
    };
  };
};

export type CompanyInfoStateType = {
  infos: CompanyInfoState;
  status: EnumStatus;
};

const initialState: CompanyInfoStateType = {
  infos: {
    _id: '',
    company: {
      name: null,
      logoImage: null,
      companyType: {
        isEcommerce: false,
        hasProducts: false,
      },
    },
    home: {
      valueProposition: {
        proposition: 'Our value proposition goes here',
        callToAction: 'Get Started with Us',
        image:
          'https://paulcollege.unh.edu/sites/default/files/styles/landscape_480x260/public/landing-page/header-image/2018/marketing-dept-tom-gruen-paul-college1920x475.jpg?h=2a536532&itok=HXpy1_Cd',
      },
      customerSection: {
        title: 'Our Customers',
        description: 'Description about customers and how we help them.',
      },
    },
    about: {
      title: 'About Our Company',
      description:
        'We are a company dedicated to providing top-notch services.',
      image: 'sample-image-url.jpg',
    },
    services: {
      title: 'Our Services',
      description: 'Description of the various services we offer.',
    },
    contactUs: {
      title: 'Contact Us',
      description: 'Reach out to us for more information.',
      email: {
        contact: 'contact@samplecompany.com',
        website: 'www.samplecompany.com',
      },
      phone: {
        countryCode: '+1',
        phone: '123-456-7890',
        fax: '123-456-7891',
      },
      address: {
        address1: '123 Sample St',
        address2: 'Suite 100',
        area: 'Business District',
        city: 'Sample City',
        country: 'Sample Country',
        postalCode: '12345',
        fullAddress:
          '123 Sample St, Suite 100, Business District, Sample City, Sample Country, 12345',
      },
      socialMedia: {
        linkedin: 'https://www.linkedin.com/in/ilan-lieberman-9a1043132/',
        facebook: null,
        instagram: null,
        twitter: null,
        tiktok: null,
        youtube: null,
        amazon: null,
        aliexpress: null,
      },
    },
  },
  status: EnumStatus.Null,
};

export const createCompanyInfo = createAsyncThunk(
  'companyInfo/create',
  async () => {
    const response = await axios.post(`${BASE_URL}/companyInfo`, {
      withCredentials: true,
    });
    //createAsyncThunk - use for any code that needs to be aync

    return response.data;
  }
);
//withCredentials: true - this allows us to get the cookie

export const getCompanyInfo = createAsyncThunk(
  'companyInfo/getCompanyInfo',
  async () => {
    const response = await axios.get(`${BASE_URL}/companyInfo`, {
      withCredentials: true,
    });

    return response.data[0];
  }
);

export const updateCompanyInfo = createAsyncThunk(
  'user/updateCompanyInfo',
  async ({ id, data }: { id: string; data: Partial<CompanyInfoState> }) => {
    const response = await axios.put(`${BASE_URL}/companyInfo/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const getCompanyInfoById = createAsyncThunk(
  'user/getCompanyInfoById',
  async ({ id }: { id: string }) => {
    const response = await axios.get(`${BASE_URL}/companyInfo/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const deleteCompanyInfo = createAsyncThunk(
  'user/deleteCompanyInfo',
  async ({ id }: { id: string }) => {
    const response = await axios.delete(`${BASE_URL}/companyInfo/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

const companyInfoSlice = createSlice({
  name: 'companyInfo',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<CompanyInfoStateType>): void {
    builder
      .addCase(createCompanyInfo.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        createCompanyInfo.fulfilled,
        (state, action: PayloadAction<CompanyInfoState>) => {
          state.status = EnumStatus.Success;
          state.infos = action.payload;
        }
      )
      .addCase(createCompanyInfo.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getCompanyInfo.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        getCompanyInfo.fulfilled,
        (state, action: PayloadAction<CompanyInfoState>) => {
          state.status = EnumStatus.Success;
          state.infos = action.payload;
        }
      )
      .addCase(updateCompanyInfo.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        updateCompanyInfo.fulfilled,
        (state, action: PayloadAction<CompanyInfoState>) => {
          state.status = EnumStatus.Success;
          state.infos = action.payload;
        }
      )
      .addCase(updateCompanyInfo.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getCompanyInfoById.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        getCompanyInfoById.fulfilled,
        (state, action: PayloadAction<CompanyInfoState>) => {
          state.status = EnumStatus.Success;
          state.infos = action.payload;
        }
      )
      .addCase(getCompanyInfoById.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(deleteCompanyInfo.fulfilled, (state) => {
        state.status = EnumStatus.Success;
        state.infos = {} as CompanyInfoState;
      });
  },
});

export const companyInfoState = (state: RootState) => state.companyInfoReducer;

export default companyInfoSlice.reducer;
