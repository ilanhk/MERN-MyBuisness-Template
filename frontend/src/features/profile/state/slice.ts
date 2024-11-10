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

export type ProfileState = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isEmployee: string;
  inEmailList: boolean;
  
};

export type ProfileStateType = {
  profile: ProfileState;
  status: EnumStatus;
};

const initialState: ProfileStateType = {
  profile: {} as ProfileState,
  status: EnumStatus.Null,
};

export const getUserProfile = createAsyncThunk(
  'profile/getProfile',
  async () => {
    const response = await axios.get(
      `${BASE_URL}/users/profile`,
      { withCredentials: true }
    );
    //createAsyncThunk - use for any code that needs to be aync

    return response.data;
  }
);



export const updateUserProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: ProfileState) => {
    const response = await axios.put(
      `${BASE_URL}/profile`,
      data,
      { withCredentials: true }
    );
    return response.data;
  }
);


const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<ProfileStateType>): void {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<ProfileState>) => {
        state.status = EnumStatus.Success;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<ProfileState>) => {
        state.status = EnumStatus.Success;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
  },
});

export const profileState = (state: RootState) => state.profileReducer;

export default profileSlice.reducer;
