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

export type JobState = {
  _id: string;
  name: string;
  department: string;
  description: {
    position: string,
    yourRole: string,
    qualifications: string,
    advantagesToHave: string
  };
  location: {
    city: string,
    country: string
  };
  jobType: string;
  createdAt: string;
};

export type jobstateType = {
  jobs: JobState[];
  status: EnumStatus;
};

const initialState: jobstateType = {
  jobs: [],
  status: EnumStatus.Null,
};

export const createJob = createAsyncThunk(
  'job/createJob',
  async () => {
    const response = await axios.post(
      `${BASE_URL}/jobs`,
      { withCredentials: true }
    );

    return [response.data];
  }
);

export const getJobs = createAsyncThunk(
  'job/getJobs',
  async () => {
    const response = await axios.get(
      `${BASE_URL}/jobs`,
    );
    return [response.data];
  }
);

export const getJobById = createAsyncThunk(
  'job/getJobById',
  async ({id}: {id: string}) => {
    const response = await axios.get(
      `${BASE_URL}/jobs/${id}`,
    );
    return [response.data];
  }
);

export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ id, data }: { id: string; data: Partial<JobState> }) => {
    const response = await axios.put(
      `${BASE_URL}/jobs/${id}`,
      data
    );
    return [response.data];
  }
);

export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async ({id}: {id: string}) => {
    const response = await axios.delete(
      `${BASE_URL}/jobs/${id}`,
    );
    return [response.data];
  }
);



const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<jobstateType>): void {
    builder
      .addCase(createJob.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<JobState[]>) => {
        state.status = EnumStatus.Success;
        state.jobs = action.payload;
      })
      .addCase(createJob.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getJobs.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(getJobs.fulfilled, (state, action: PayloadAction<JobState[]>) => {
        state.status = EnumStatus.Success;
        state.jobs = action.payload;
      })
      .addCase(getJobs.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getJobById.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(getJobById.fulfilled, (state, action: PayloadAction<JobState[]>) => {
        state.status = EnumStatus.Success;
        state.jobs = action.payload;
      })
      .addCase(getJobById.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(updateJob.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<JobState[]>) => {
        state.status = EnumStatus.Success;
        state.jobs = action.payload;
      })
      .addCase(updateJob.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(deleteJob.fulfilled, (state) => {
        state.status = EnumStatus.Success;
        state.jobs = [];
      })
  },
});

export const jobsState = (state: RootState) => state.jobReducer;

export default jobSlice.reducer;
