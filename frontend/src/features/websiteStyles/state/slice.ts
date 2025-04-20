import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../../app/store';

const BASE_URL: string = import.meta.env.VITE_APP_BASE_URL!;

export enum EnumStatus {
  Loading,
  Success,
  Fail,
  Null,
}

export type websiteStylesState = {
  _id: string;
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

export type websiteStylesStateType = {
  styles: websiteStylesState;
  status: EnumStatus;
};

const initialState: websiteStylesStateType = {
  styles: {
    _id: '',
    general: {
      backgroundColor: '#ffffff',
      font: "'Serif', sans-serif",
      wordColor: '#0f0f75',
      wordSize: '16px',
      titleSize: '48px',
    },
    headerAndFooter: {
      backgroundColor: '#d4d1d1',
      fontSize: '16px',
      wordColor: '#000000',
      dropdown: {
        backgroundColor: '#dddcdc',
        wordColor: '#000000',
        hoverColor: '#aaa7a7',
      },
    },
    admin: {
      backgroundColor: '#ffffff',
      wordColor: '#0f0f75',
      sideBar: {
        backgroundColor: '#0AB7DA',
        wordColor: '#000000',
      },
    },
    saves: {
      colors: [
        '#ffffff',
        '#0f0f75',
        '#d4d1d1',
        '#000000',
        '#dddcdc',
        '#aaa7a7',
        '#0AB7DA'
      ],
      fonts: [
        "'Serif', sans-serif"
      ],
    },
   
  },
  status: EnumStatus.Null,
};

export const createWebsiteStyles = createAsyncThunk(
  'websiteStyles/create',
  async () => {
    const response = await axios.post(`${BASE_URL}/website-styles`, {
      withCredentials: true,
    });
    //createAsyncThunk - use for any code that needs to be aync

    return response.data;
  }
);
//withCredentials: true - this allows us to get the cookie

export const getWebsiteStyles = createAsyncThunk(
  'websiteStyles/getwebsiteStyles',
  async () => {
    const response = await axios.get(`${BASE_URL}/website-styles`, {
      withCredentials: true,
    });

    return response.data[0];
  }
);

export const updateWebsiteStyles = createAsyncThunk(
  'user/updatewebsiteStyles',
  async ({ id, data }: { id: string; data: Partial<websiteStylesState> }) => {
    const response = await axios.put(`${BASE_URL}/website-styles/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const getWebsiteStylesById = createAsyncThunk(
  'user/getwebsiteStylesById',
  async ({ id }: { id: string }) => {
    const response = await axios.get(`${BASE_URL}/website-styles/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const deleteWebsiteStyles = createAsyncThunk(
  'user/deletewebsiteStyles',
  async ({ id }: { id: string }) => {
    const response = await axios.delete(`${BASE_URL}/website-styles/${id}`, {
      withCredentials: true,
    });
    return response.data;
  }
);

const websiteStylesSlice = createSlice({
  name: 'websiteStyles',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<websiteStylesStateType>): void {
    builder
      .addCase(createWebsiteStyles.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        createWebsiteStyles.fulfilled,
        (state, action: PayloadAction<websiteStylesState>) => {
          state.status = EnumStatus.Success;
          state.styles = action.payload;
        }
      )
      .addCase(createWebsiteStyles.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getWebsiteStyles.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        getWebsiteStyles.fulfilled,
        (state, action: PayloadAction<websiteStylesState>) => {
          state.status = EnumStatus.Success;
          state.styles = action.payload;
        }
      )
      .addCase(updateWebsiteStyles.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        updateWebsiteStyles.fulfilled,
        (state, action: PayloadAction<websiteStylesState>) => {
          state.status = EnumStatus.Success;
          state.styles = action.payload;
        }
      )
      .addCase(updateWebsiteStyles.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getWebsiteStylesById.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        getWebsiteStylesById.fulfilled,
        (state, action: PayloadAction<websiteStylesState>) => {
          state.status = EnumStatus.Success;
          state.styles = action.payload;
        }
      )
      .addCase(getWebsiteStylesById.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(deleteWebsiteStyles.fulfilled, (state) => {
        state.status = EnumStatus.Success;
        state.styles = {} as websiteStylesState;
      });
  },
});

export const websiteStylesState = (state: RootState) => state.websiteStylesReducer;

export default websiteStylesSlice.reducer;
