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
 home: {
    valueProposition: {
      proposition: string | null;
      callToAction: string | null;
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
  infos: {} as CompanyInfoState,
  status: EnumStatus.Null,
};

export const createCompanyInfo = createAsyncThunk(
  'companyInfo/create',
  async () => {
    const response = await axios.post(
      `${BASE_URL}/companyInfo`,
      { withCredentials: true }
    );
    //createAsyncThunk - use for any code that needs to be aync

    return response.data;
  }
);
//withCredentials: true - this allows us to get the cookie


export const getCompanyInfo = createAsyncThunk(
  'companyInfo/getCompanyInfo',
  async () => {
    const response = await axios.get(
      `${BASE_URL}/companyInfo`,
      { withCredentials: true }
    );

    return response.data[0];
  }
);


export const updateCompanyInfo = createAsyncThunk(
  'user/updateCompanyInfo',
  async ({ id, data }: { id: string; data: Partial<CompanyInfoState> }) => {
    const response = await axios.put(
      `${BASE_URL}/companyInfo/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const getCompanyInfoById = createAsyncThunk(
  'user/getCompanyInfoById',
  async ({id}: {id: string}) => {
    const response = await axios.get(
      `${BASE_URL}/companyInfo/${id}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const deleteCompanyInfo = createAsyncThunk(
  'user/deleteCompanyInfo',
  async ({id}: {id: string}) => {
    const response = await axios.delete(
      `${BASE_URL}/companyInfo/${id}`,
      { withCredentials: true }
    );
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
      .addCase(createCompanyInfo.fulfilled, (state, action: PayloadAction<CompanyInfoState>) => {
        state.status = EnumStatus.Success;
        state.infos = action.payload;
      })
      .addCase(createCompanyInfo.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getCompanyInfo.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(getCompanyInfo.fulfilled, (state, action: PayloadAction<CompanyInfoState>) => {
        state.status = EnumStatus.Success;
        state.infos = action.payload;
      })
      .addCase(updateCompanyInfo.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(updateCompanyInfo.fulfilled, (state, action: PayloadAction<CompanyInfoState>) => {
        state.status = EnumStatus.Success;
        state.infos = action.payload;
      })
      .addCase(updateCompanyInfo.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getCompanyInfoById.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(getCompanyInfoById.fulfilled, (state, action: PayloadAction<CompanyInfoState>) => {
        state.status = EnumStatus.Success;
        state.infos = action.payload;
      })
      .addCase(getCompanyInfoById.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(deleteCompanyInfo.fulfilled, (state) => {
        state.status = EnumStatus.Success;
        state.infos = {} as CompanyInfoState;
      })
      
  },
});

export const companyInfoState = (state: RootState) => state.companyInfoReducer;

export default companyInfoSlice.reducer;
