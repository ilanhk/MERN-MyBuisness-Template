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

export type ServiceState = {
  _id: string;
  name: string;
  image: string;
  description: string;
  isChosen: boolean;
};

export type ServiceStateType = {
  services: ServiceState[];
  status: EnumStatus;
};

const initialState: ServiceStateType = {
  services: [],
  status: EnumStatus.Null,
};

export const createService = createAsyncThunk(
  'service/createService',
  async ({ name, image, description }: { name: string; image: string, description: string }) => {
    const response = await axios.post(
      `${BASE_URL}/services`,
      { name, image, description },
      { withCredentials: true }
    );

    return [response.data];
  }
);

export const getServices = createAsyncThunk(
  'service/getServices',
  async () => {
    const response = await axios.get(
      `${BASE_URL}/services`,
    );
    return [response.data];
  }
);

export const getServiceById = createAsyncThunk(
  'service/getServiceById',
  async ({id}: {id: string}) => {
    const response = await axios.get(
      `${BASE_URL}/services/${id}`,
    );
    return [response.data];
  }
);

export const updateService = createAsyncThunk(
  'service/updateService',
  async ({ id, data }: { id: string; data: Partial<ServiceState> }) => {
    const response = await axios.put(
      `${BASE_URL}/services/${id}`,
      data
    );
    return [response.data];
  }
);

export const deleteService = createAsyncThunk(
  'service/deleteService',
  async ({id}: {id: string}) => {
    const response = await axios.delete(
      `${BASE_URL}/services/${id}`,
    );
    return [response.data];
  }
);



const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<ServiceStateType>): void {
    builder
      .addCase(createService.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(createService.fulfilled, (state, action: PayloadAction<ServiceState[]>) => {
        state.status = EnumStatus.Success;
        state.services = action.payload;
      })
      .addCase(createService.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getServices.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(getServices.fulfilled, (state, action: PayloadAction<ServiceState[]>) => {
        state.status = EnumStatus.Success;
        state.services = action.payload;
      })
      .addCase(getServices.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getServiceById.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(getServiceById.fulfilled, (state, action: PayloadAction<ServiceState[]>) => {
        state.status = EnumStatus.Success;
        state.services = action.payload;
      })
      .addCase(getServiceById.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(updateService.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(updateService.fulfilled, (state, action: PayloadAction<ServiceState[]>) => {
        state.status = EnumStatus.Success;
        state.services = action.payload;
      })
      .addCase(updateService.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(deleteService.fulfilled, (state) => {
        state.status = EnumStatus.Success;
        state.services = [];
      })
  },
});

export const servicesState = (state: RootState) => state.serviceReducer;

export default serviceSlice.reducer;
