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
    jobs: [],
    status: EnumStatus.Null,
};
export const createJob = createAsyncThunk('job/createJob', async () => {
    const response = await axios.post(`${BASE_URL}/jobs`, { withCredentials: true });
    return [response.data];
});
export const getJobs = createAsyncThunk('job/getJobs', async () => {
    const response = await axios.get(`${BASE_URL}/jobs`);
    return response.data;
});
export const getJobById = createAsyncThunk('job/getJobById', async ({ id }) => {
    const response = await axios.get(`${BASE_URL}/jobs/${id}`);
    return [response.data];
});
export const updateJob = createAsyncThunk('job/updateJob', async ({ id, data }) => {
    const response = await axios.put(`${BASE_URL}/jobs/${id}`, data);
    return [response.data];
});
export const deleteJob = createAsyncThunk('job/deleteJob', async ({ id }) => {
    const response = await axios.delete(`${BASE_URL}/jobs/${id}`);
    return [response.data];
});
const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createJob.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(createJob.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.jobs = action.payload;
        })
            .addCase(createJob.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(getJobs.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(getJobs.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.jobs = action.payload;
        })
            .addCase(getJobs.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(getJobById.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(getJobById.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.jobs = action.payload;
        })
            .addCase(getJobById.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(updateJob.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(updateJob.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.jobs = action.payload;
        })
            .addCase(updateJob.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(deleteJob.fulfilled, (state) => {
            state.status = EnumStatus.Success;
            state.jobs = [];
        });
    },
});
export const jobsState = (state) => state.jobReducer;
export default jobSlice.reducer;
