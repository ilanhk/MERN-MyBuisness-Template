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
    users: [],
    status: EnumStatus.Null,
};
export const createUser = createAsyncThunk('user/createUser', async ({ firstName, lastName, fullName, email, password, isEmployee, inEmailList, }) => {
    const response = await axios.post(`${BASE_URL}/users/create`, {
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
export const getUsers = createAsyncThunk('user/getUsers', async () => {
    const response = await axios.get(`${BASE_URL}/users`, {
        withCredentials: true, // <-- THIS sends the cookies!
    });
    return response.data;
});
export const getUserById = createAsyncThunk('user/getUserById', async ({ id }) => {
    const response = await axios.get(`${BASE_URL}/users/${id}`);
    return [response.data];
});
export const updateUser = createAsyncThunk('user/updateUser', async ({ id, data }) => {
    const response = await axios.put(`${BASE_URL}/users/${id}`, data, {
        withCredentials: true, // <-- THIS sends the cookies!
    });
    return [response.data];
});
export const deleteUser = createAsyncThunk('user/deleteUser', async ({ id }) => {
    const response = await axios.delete(`${BASE_URL}/users/${id}`, {
        withCredentials: true,
    });
    console.log(`User with id: ${id} was deleted`, response);
    return id;
});
// getUserProfile
// updateUserProfile
// forgotPassword
// resetPassword
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createUser.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(createUser.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.users.push(action.payload);
        })
            .addCase(createUser.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(getUsers.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(getUsers.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.users = action.payload;
        })
            .addCase(getUsers.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(getUserById.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(getUserById.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.users = action.payload;
        })
            .addCase(getUserById.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(updateUser.pending, (state) => {
            state.status = EnumStatus.Loading;
        })
            .addCase(updateUser.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.users = action.payload;
        })
            .addCase(updateUser.rejected, (state) => {
            state.status = EnumStatus.Fail;
        })
            .addCase(deleteUser.fulfilled, (state, action) => {
            state.status = EnumStatus.Success;
            state.users = state.users.filter((user) => user._id !== action.payload);
        });
    },
});
export const usersState = (state) => state.userReducer;
export default userSlice.reducer;
