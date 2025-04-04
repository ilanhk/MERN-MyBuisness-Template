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

export type AuthState = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isEmployee: string;
  isAdmin: boolean;
  IsSuperAdmin: boolean;
  inEmailList: boolean;
  accessToken: string | null;
  twoFaSecret: string | null;
  refreshToken: string | null;
};

export type AuthStateType = {
  auth: AuthState;
  status: EnumStatus;
};

const initialState: AuthStateType = {
  auth: {} as AuthState,
  status: EnumStatus.Null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, twoFaCode }: { email: string; password?: string, twoFaCode?: string }) => {
    const response = await axios.post(
      `${BASE_URL}/users/login`,
      { email, password, twoFaCode },
      { withCredentials: true }
    );
    //createAsyncThunk - use for any code that needs to be aync

    return response.data;
  }
);
//withCredentials: true - this allows us to get the cookie

export const refresh = createAsyncThunk('auth/refresh', async () => {
  const response = await axios.get(`${BASE_URL}/users/refresh`, {
    withCredentials: true,
  });

  return response.data;
});

export const register = createAsyncThunk(
  'auth/register',
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
      `${BASE_URL}/users`,
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

export const googleOAuth = createAsyncThunk(
  'auth/googleOAuth',
  async ({ credential }: { credential: string;  }) => {
    const response = await axios.post(
      `${BASE_URL}/google/authenticate`,
      { credential },
      { withCredentials: true }
    );
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await axios.post(`${BASE_URL}/users/logout`, {}, {
    withCredentials: true,
  });

  return response.data;
});
//{} is the payload because just sending empty data to loggout


export const forgotPassword = createAsyncThunk(
  'auth/forgot-password',
  async ({ email }: { email: string;}) => {
    const response = await axios.post(
      `${BASE_URL}/users/forgot-password`,
      { email },
      { withCredentials: true }
    );

    return response.data;
  }
);


export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async ({ newPassword }: { newPassword: string;}) => {
    const response = await axios.post(
      `${BASE_URL}/users/reset-password`,
      { newPassword },
      { withCredentials: true }
    );

    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<AuthStateType>): void {
    builder
      .addCase(login.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.status = EnumStatus.Success;
        state.auth = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(refresh.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(refresh.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.status = EnumStatus.Success;
        state.auth = action.payload;
      })
      .addCase(refresh.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(register.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthState>) => {
          state.status = EnumStatus.Success;
          state.auth = action.payload;
        }
      )
      .addCase(register.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(googleOAuth.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(googleOAuth.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.status = EnumStatus.Success;
        state.auth = action.payload;
      })
      .addCase(googleOAuth.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = EnumStatus.Success;
        state.auth = {} as AuthState;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.status = EnumStatus.Success;
        state.auth = action.payload;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = EnumStatus.Loading;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.status = EnumStatus.Success;
        state.auth = action.payload;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.status = EnumStatus.Fail;
      })
  },
});

export const authState = (state: RootState) => state.authReducer;

export default authSlice.reducer;
