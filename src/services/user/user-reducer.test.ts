import { describe, expect, it } from 'vitest';

import reducer, {
  allowPasswordReset,
  getUser,
  initialState,
  login,
  logout,
  patchUser,
  refreshToken,
  register,
  restrictPasswordReset,
} from './user-reducer';

import type { TRegisterUser, TUser } from '../../utils/user-types';

const buildInitialState = () => reducer(undefined, { type: 'vitest' });

const mockUser: TUser = {
  name: 'Test User',
  email: 'user@example.com',
};

const mockRegisterUser: TRegisterUser = {
  ...mockUser,
  password: 'password',
};

describe('user reducer: base', () => {
  it('should return the initial state', () => {
    expect(buildInitialState()).toEqual(initialState);
  });

  it('should change user can reset password flag', () => {
    const allowed = reducer(buildInitialState(), allowPasswordReset());
    expect(allowed.canResetPassword).toBe(true);

    const restricted = reducer(allowed, restrictPasswordReset());
    expect(restricted.canResetPassword).toBe(false);
  });
});

describe('user reducer: register', () => {
  it('shoult set register as loading and clears previous errors', () => {
    const action = { type: register.pending.type };
    const state = reducer(buildInitialState(), action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
  });

  it('should save access token and user after register successful', () => {
    const payload = { accessToken: 'token', user: mockUser };
    const state = reducer(buildInitialState(), register.fulfilled(payload as any, 'request1', mockRegisterUser));

    expect(state.accessToken).toBe('token');
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.authInitialized).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
  });

  it('shoult set error flag after register fails', () => {
    const action = { type: register.rejected.type };
    const state = reducer(buildInitialState(), action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(true);
  });
});

describe('user reducer: login', () => {
  it('should set loading if login pending', () => {
    const action = { type: login.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should set authenticated flag and save user after login success', () => {
    const mock = {
      accessToken: 'any_token',
      user: mockUser,
    };
    const action = {
      type: login.fulfilled.type,
      payload: mock,
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      accessToken: mock.accessToken,
      user: mock.user,
      isAuthenticated: true,
      authInitialized: true,
    });
  });

  it('should set error flag if login fails', () => {
    const action = { type: login.rejected.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      error: true,
    });
  });
});

describe('user reducer: tokens', () => {
  it('should set loading true whild refreshToken is pending', () => {
    const fromData = { ...initialState, authInitialized: true };
    const action = { type: refreshToken.pending.type };
    const state = reducer(fromData, action);

    expect(state).toEqual({
      ...fromData,
      loading: true,
    });
  });

  it('should clear auth data after refresh token fails', () => {
    const fromData = { ...buildInitialState(), isAuthenticated: true, accessToken: 'token' };
    const action = { type: refreshToken.rejected.type };
    const state = reducer(fromData, action);

    expect(state.isAuthenticated).toBe(false);
    expect(state.authInitialized).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(true);
  });

  it('should update refreshToken after receiving new one', () => {
    const fromData = { ...initialState, authInitialized: true, accessToken: 'old_token' };
    const mock = {
      ...fromData,
      accessToken: 'new_token',
    };
    const action = {
      type: refreshToken.fulfilled.type,
      payload: mock,
    };
    const state = reducer(fromData, action);

    expect(state).toEqual({
      ...fromData,
      accessToken: mock.accessToken,
      isAuthenticated: true,
    });
  });
});

describe('user reducer: logout', () => {
  it('should reset state on logout success but keeps authInitialized', () => {
    const fromData = {
      ...buildInitialState(),
      accessToken: 'token',
      isAuthenticated: true,
      user: mockUser,
      authInitialized: false,
    };

    const action = {
      type: logout.fulfilled.type,
    };
    const state = reducer(fromData, action);

    expect(state).toEqual({ ...initialState, authInitialized: true });
  });

  it('should set loading if logout pending', () => {
    const action = { type: logout.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should set error flag if logout fails', () => {
    const action = { type: logout.rejected.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      error: true,
    });
  });
});

describe('user reducer: get user', () => {
  it('should update user data', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: mockUser,
    };

    const state = reducer(buildInitialState(), action);

    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
  });

  it('should set loading if getUser pending', () => {
    const action = { type: getUser.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should set error flag if getUser fails', () => {
    const action = { type: getUser.rejected.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      error: true,
    });
  });
});

describe('user reducer: patchUser', () => {
  it('updates user data on patch success', () => {
    const state = reducer(buildInitialState(), patchUser.fulfilled(mockUser, 'request1', mockUser));

    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
  });
});
