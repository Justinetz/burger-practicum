import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as remoteApi from '../remote-api-service';
import { jwtExpiredErrorText } from '../remote-api-service';

import type { TUser } from '../../utils/user-types';
import type { AppDispatch, RootState } from '../store';

type IUserState = {
  accessToken: string;
  isAuthenticated: boolean;

  user: TUser;

  loading: boolean;
  error: boolean;

  canResetPassword: boolean;
  authInitialized: boolean;
};

const initialState: IUserState = {
  accessToken: '',
  isAuthenticated: false,

  user: {
    name: '',
    email: '',
  },

  loading: false,
  error: false,

  canResetPassword: false,
  authInitialized: false,
};

const saveRefreshToken = (refreshToken: any): void => {
  localStorage.setItem('refresh-token', refreshToken);
};

const cleanRefreshToken = (): void => {
  localStorage.removeItem('refresh-token');
};

const getRefreshToken = (): string => {
  return localStorage.getItem('refresh-token')!;
};

const validateRefreshToken = (refreshToken: any): { result: boolean; error?: Error } => {
  if (!refreshToken) {
    return {
      result: false,
      error: new Error('В Local Storage нет сохраненного refresh token'),
    };
  }
  return { result: true };
};

export const register = createAsyncThunk('user/register', (data: { name: string; email: string; password: string }) => {
  return remoteApi
    .register(data)
    .then((data) => {
      saveRefreshToken(data.refreshToken);

      return { ...data, accessToken: data.accessToken.split('Bearer ')[1] };
    })
    .catch((_) => {
      throw new Error('Ошибка регистрации!');
    });
});

export const login = createAsyncThunk('user/login', (data: { email: string; password: string }) => {
  return remoteApi.login(data).then((data) => {
    saveRefreshToken(data.refreshToken);

    return { ...data, accessToken: data.accessToken.split('Bearer ')[1] };
  });
});

export const refreshToken = createAsyncThunk('user/refresh-token', () => {
  const refreshToken = getRefreshToken();

  const validationResult = validateRefreshToken(refreshToken);
  if (validationResult.result) {
    return remoteApi.refreshToken(refreshToken).then((data) => {
      saveRefreshToken(data.refreshToken);

      return { ...data, accessToken: data.accessToken.split('Bearer ')[1] };
    });
  }
  throw validationResult.error!;
});

export const logout = createAsyncThunk('user/logout', () => {
  const refreshToken = getRefreshToken();

  const validationResult = validateRefreshToken(refreshToken);
  if (validationResult.result) {
    return remoteApi.logout(refreshToken).then((data) => {
      cleanRefreshToken();

      return data;
    });
  }
  throw validationResult.error!;
});

export const forgotPassword = createAsyncThunk('user/forgot-password', (email: string) => {
  return remoteApi.forgotPassword(email);
});

export const getUser = createAsyncThunk<TUser, void, { state: RootState; dispatch: AppDispatch }>(
  'user/get-user',
  (_, api) => {
    const { accessToken } = api.getState().user;
    return remoteApi
      .getUser(accessToken)
      .then((data) => data.user)
      .catch(async (err) => {
        if (err.message === jwtExpiredErrorText) {
          const resultAction = await api.dispatch(refreshToken());
          if (refreshToken.fulfilled.match(resultAction)) {
            api.dispatch(getUser());
          }
        }
        api.rejectWithValue('error');
      });
  }
);

export const patchUser = createAsyncThunk<TUser, TUser, { state: RootState; dispatch: AppDispatch }>(
  'user/patch-user',
  async (data, api) => {
    const { accessToken } = api.getState().user;
    try {
      const res = await remoteApi.patchUser(accessToken, data);
      return res.user;
    } catch (err: any) {
      if (err.message === jwtExpiredErrorText) {
        const result = await api.dispatch(refreshToken());
        if (refreshToken.fulfilled.match(result)) {
          const { accessToken: newToken } = (result as any).payload;
          const retried = await remoteApi.patchUser(newToken, data);
          return retried.user;
        }
      }
      return api.rejectWithValue('error');
    }
  }
);

export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    allowPasswordReset: (state) => {
      state.canResetPassword = true;
    },
    restrictPasswordReset: (state) => {
      state.canResetPassword = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshToken.pending, (state) => {
      state.error = false;
      state.loading = true;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.authInitialized = true;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.loading = false;
      state.error = true;
      state.isAuthenticated = false;
      state.authInitialized = true;
    });

    // Логин/логаут тоже должны выставлять флаг
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authInitialized = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authInitialized = true;
    });
    builder.addCase(logout.fulfilled, () => ({
      ...initialState,
      authInitialized: true,
    }));
  },
});

const { actions, reducer } = user;

export const { allowPasswordReset, restrictPasswordReset } = actions;

export default reducer;
