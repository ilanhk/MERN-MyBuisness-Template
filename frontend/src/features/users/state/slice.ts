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

export type UserState = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isEmployee: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  inEmailList: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

export type UserStateType = {
  users: UserState[];
  status: EnumStatus;
};

const initialState: UserStateType = {
  users: [],
  status: EnumStatus.Null,
};

export const createUser = createAsyncThunk(
  'user/createUser',
  async ({
    firstName,
    lastName,
    fullName,
    email,
    password,
    isEmployee,
    inEmailList,
  }: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password?: string;
    isEmployee?: boolean;
    inEmailList: boolean;
  }) => {
    const response = await axios.post(
      `${BASE_URL}/users/create`,
      {
        firstName,
        lastName,
        fullName,
        email,
        password,
        isEmployee,
        inEmailList,
      },
      { withCredentials: true }
    );

    return response.data;
  }
);

export const getUsers = createAsyncThunk('user/getUsers', async () => {
  const response = await axios.get(`${BASE_URL}/users`, {
    withCredentials: true, // <-- THIS sends the cookies!
  });

  return response.data;
});

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async ({ id }: { id: string }) => {
    const response = await axios.get(`${BASE_URL}/users/${id}`);
    return [response.data];
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }: { id: string; data: Partial<UserState> }) => {
    const response = await axios.put(
      `${BASE_URL}/users/${id}`,
      data,
      {
        withCredentials: true, // <-- THIS sends the cookies!
      }
    );
    return [response.data];
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async ({ id }: { id: string }) => {
    const response = await axios.delete(`${BASE_URL}/users/${id}`, {
      withCredentials: true,
    });

    console.log(`User with id: ${id} was deleted`, response)
    return id;
  }
);

// getUserProfile
// updateUserProfile
// forgotPassword
// resetPassword

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<UserStateType>): void {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        createUser.fulfilled,
        (state, action: PayloadAction<UserState>) => {
          state.status = EnumStatus.Success;
          state.users.push(action.payload);
        }
      )
      .addCase(createUser.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getUsers.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        getUsers.fulfilled,
        (state, action: PayloadAction<UserState[]>) => {
          state.status = EnumStatus.Success;
          state.users = action.payload;
        }
      )
      .addCase(getUsers.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(getUserById.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        getUserById.fulfilled,
        (state, action: PayloadAction<UserState[]>) => {
          state.status = EnumStatus.Success;
          state.users = action.payload;
        }
      )
      .addCase(getUserById.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserState[]>) => {
          state.status = EnumStatus.Success;
          state.users = action.payload;
        }
      )
      .addCase(updateUser.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = EnumStatus.Success;
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export const usersState = (state: RootState) => state.userReducer;

export default userSlice.reducer;
