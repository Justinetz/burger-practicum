import type { RootState } from '../store';

export const isAuthenticated = (state: RootState) => {
  return state.user.isAuthenticated;
};

export const getSelf = (state: RootState) => {
  return state.user.user;
};

export const canResetPassword = (state: RootState) => {
  return state.user.canResetPassword;
};

export const isAuthInitialized = (state: RootState) => {
  return state.user.authInitialized;
};
