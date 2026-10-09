import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export var EnumStatus;
(function (EnumStatus) {
    EnumStatus[EnumStatus["Loading"] = 0] = "Loading";
    EnumStatus[EnumStatus["Success"] = 1] = "Success";
    EnumStatus[EnumStatus["Fail"] = 2] = "Fail";
    EnumStatus[EnumStatus["Null"] = 3] = "Null";
})(EnumStatus || (EnumStatus = {}));
const initialState = {
    services: [],
    status: EnumStatus.Null,
};
export const createService = createAsyncThunk('service/createService', async ({ name, image, description }) => {
    const response = await axios.post(`${BASE_URL}/services`, { name, image, description }, { withCredentials: true });
    return [response.data];
});
export const getServices = createAsyncThunk('service/getServices', async () => {
    const response = await axios.get(`${BASE_URL}/services`);
    return [response.data];
});
export const getServiceById = createAsyncThunk('service/getServiceById', async ({ id }) => {
    const response = await axios.get(`${BASE_URL}/services/${id}`);
    return [response.data];
});
export const updateService = createAsyncThunk('service/updateService', async ({ id, data }) => {
    const response = await axios.put(`${BASE_URL}/services/${id}`, data);
    return [response.data];
});
export const deleteService = createAsyncThunk('service/deleteService', async ({ id }) => {
    const response = await axios.delete(`${BASE_URL}/services/${id}`);
    return [response.data];
});
const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createService.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(createService.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.services = action.payload;
        })
            .addCase(createService.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(getServices.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(getServices.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.services = action.payload;
        })
            .addCase(getServices.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(getServiceById.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(getServiceById.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.services = action.payload;
        })
            .addCase(getServiceById.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(updateService.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(updateService.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.services = action.payload;
        })
            .addCase(updateService.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(deleteService.fulfilled, (state) => {
            state.status = EnumStatus.Success;
            state.services = [];
        });
    },
});
export const servicesState = (state) => state.serviceReducer;
export default serviceSlice.reducer;
