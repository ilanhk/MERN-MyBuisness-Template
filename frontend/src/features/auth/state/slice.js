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
    auth: {},
    status: EnumStatus.Null,
};
export const login = createAsyncThunk('auth/login', async ({ email, password, twoFaCode }) => {
    const response = await axios.post(`${BASE_URL}/users/login`, { email, password, twoFaCode }, { withCredentials: true });
    //createAsyncThunk - use for any code that needs to be aync
    return response.data;
});
//withCredentials: true - this allows us to get the cookie
export const refresh = createAsyncThunk('auth/refresh', async () => {
    const response = await axios.get(`${BASE_URL}/users/refresh`, {
        withCredentials: true,
    });
    return response.data;
});
export const register = createAsyncThunk('auth/register', async ({ firstName, lastName, fullName, email, password, isEmployee, inEmailList, }) => {
    const response = await axios.post(`${BASE_URL}/users`, {
        firstName,
        lastName,
        fullName,
        email,
        password,
        isEmployee,
        inEmailList,
    }, { withCredentials: true });
    return response.data;
});
export const googleOAuth = createAsyncThunk('auth/googleOAuth', async ({ credential, domainName, }) => {
    const response = await axios.post(`${BASE_URL}/google/authenticate`, { credential, domainName }, { withCredentials: true });
    return response.data;
});
export const logout = createAsyncThunk('auth/logout', async () => {
    const response = await axios.post(`${BASE_URL}/users/logout`, {}, {
        withCredentials: true,
    });
    return response.data;
});
//{} is the payload because just sending empty data to loggout
export const forgotPassword = createAsyncThunk('auth/forgot-password', async ({ email }) => {
    const response = await axios.post(`${BASE_URL}/users/forgot-password`, { email }, { withCredentials: true });
    return response.data;
});
export const resetPassword = createAsyncThunk('auth/reset-password', async ({ newPassword }) => {
    const response = await axios.post(`${BASE_URL}/users/reset-password`, { newPassword }, { withCredentials: true });
    return response.data;
});
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(login.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.auth = action.payload;
        })
            .addCase(login.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(refresh.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(refresh.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.auth = action.payload;
        })
            .addCase(refresh.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(register.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(register.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.auth = action.payload;
        })
            .addCase(register.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(googleOAuth.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(googleOAuth.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.auth = action.payload;
        })
            .addCase(googleOAuth.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(logout.fulfilled, (state) => {
            state.status = EnumStatus.Success;
            state.auth = {};
        })
            .addCase(forgotPassword.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(forgotPassword.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.auth = action.payload;
        })
            .addCase(forgotPassword.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(resetPassword.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(resetPassword.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.auth = action.payload;
        })
            .addCase(resetPassword.rejected, (state) => {
            state.status = EnumStatus.Fail;
        });
    },
});
export const authState = (state) => state.authReducer;
export default authSlice.reducer;
