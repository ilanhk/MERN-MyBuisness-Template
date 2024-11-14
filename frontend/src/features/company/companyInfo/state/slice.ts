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

// export const getCompanyInfos = createAsyncThunk('companyInfo/getAll', async () => {
//   const response = await axios.get(`${BASE_URL}/companyInfo`, {
//     withCredentials: true,
//   });

//   return response.data;
// });


// export const getCompanyInfoById = createAsyncThunk(
//   'user/getCompanyInfoById',
//   async ({id}: {id: string}) => {
//     const response = await axios.get(
//       `${BASE_URL}/companyInfo/${id}`,
//     );
//     return [response.data];
//   }
// );


export const updateCompanyInfo = createAsyncThunk(
  'user/updateCompanyInfo',
  async ({ id, data }: { id: string; data: CompanyInfoState}) => {
    const response = await axios.put(
      `${BASE_URL}/companyInfo/${id}`,
      data
    );
    return response.data;
  }
);

export const deleteCompanyInfo = createAsyncThunk(
  'user/deleteCompanyInfo',
  async ({id}: {id: string}) => {
    const response = await axios.delete(
      `${BASE_URL}/companyInfo/${id}`,
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
      .addCase(deleteCompanyInfo.fulfilled, (state) => {
        state.status = EnumStatus.Success;
        state.infos = {} as CompanyInfoState;
      })
      
  },
});

export const companyInfoState = (state: RootState) => state.companyInfoReducer;

export default companyInfoSlice.reducer;
