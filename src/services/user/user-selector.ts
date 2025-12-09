import type { TUser } from '../../utils/user-types';
import type { RootState } from '../store';

export const isAuthenticated = (state: RootState): boolean => {
  return state.user.isAuthenticated;
};

export const getAccessToken = (state: RootState): string => {
  return state.user.accessToken;
};

export const getSelf = (state: RootState): TUser => {
  return state.user.user;
};

export const canResetPassword = (state: RootState): boolean => {
  return state.user.canResetPassword;
};

export const isAuthInitialized = (state: RootState): boolean => {
  return state.user.authInitialized;
};
