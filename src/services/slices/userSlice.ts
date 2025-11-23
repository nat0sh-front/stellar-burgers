import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  error: string | null;
};

type TError = string;

export const initialState: TUserState = {
  user: { name: '', email: '' },
  isAuthenticated: false,
  isUserLoading: false,
  error: null
};

export const registerUserThunk = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: TError }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  } catch (err) {
    return rejectWithValue('Ошибка регистрации');
  }
});

export const loginUserThunk = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: TError }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  } catch (err) {
    return rejectWithValue('Ошибка входа');
  }
});

export const getUserThunk = createAsyncThunk<
  TUser,
  void,
  { rejectValue: TError }
>('user/getUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch (err) {
    return rejectWithValue('Ошибка получения пользователя');
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: TError }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(data);
    return res.user;
  } catch (err) {
    return rejectWithValue('Ошибка обновления');
  }
});

export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getError: (state) => state.error,
    getIsUserLoading: (state) => state.isUserLoading
  },
  extraReducers: (builder) => {
    builder.addCase(getUserThunk.pending, (state) => {
      state.isUserLoading = true;
      state.error = null;
    });
    builder.addCase(
      getUserThunk.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isUserLoading = false;
      state.error = action.payload ?? 'Ошибка получения пользователя';
      state.isAuthenticated = false;
      state.user = { name: '', email: '' };
    });

    builder.addCase(loginUserThunk.pending, (state) => {
      state.isUserLoading = true;
      state.error = null;
    });
    builder.addCase(
      loginUserThunk.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isUserLoading = false;
      state.error = action.payload ?? 'Ошибка входа';
      state.isAuthenticated = false;
      state.user = { name: '', email: '' };
    });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.user = { name: '', email: '' };
      state.isAuthenticated = false;
    });

    builder.addCase(updateUserThunk.pending, (state) => {
      state.isUserLoading = true;
      state.error = null;
    });
    builder.addCase(
      updateUserThunk.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isUserLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isUserLoading = false;
      state.error = action.payload ?? 'Ошибка обновления';
    });
  }
});

export const { getUser, getIsAuthenticated, getIsUserLoading, getError } =
  userSlice.selectors;
export const { clearError } = userSlice.actions;
export const userReducer = userSlice.reducer;
