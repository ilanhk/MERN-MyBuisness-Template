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
    profile: {},
    status: EnumStatus.Null,
};
export const getUserProfile = createAsyncThunk('profile/getProfile', async () => {
    const response = await axios.get(`${BASE_URL}/users/profile`, { withCredentials: true });
    //createAsyncThunk - use for any code that needs to be aync
    return response.data;
});
export const updateUserProfile = createAsyncThunk('profile/updateProfile', async (data) => {
    const response = await axios.put(`${BASE_URL}/profile`, data, { withCredentials: true });
    return response.data;
});
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(getUserProfile.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(getUserProfile.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.profile = action.payload;
        })
            .addCase(getUserProfile.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(updateUserProfile.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.profile = action.payload;
        })
            .addCase(updateUserProfile.rejected, (state) => {
            state.status = EnumStatus.Fail;
        });
    },
});
export const profileState = (state) => state.profileReducer;
export default profileSlice.reducer;
