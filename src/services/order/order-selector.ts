import type { TOrderDetails } from '../../utils/order-types';
import type { RootState } from '../store';

export const getOrderDetails = (state: RootState): TOrderDetails => {
  return state.order.details;
};

export const isOrderLoading = (state: RootState): boolean => {
  return state.order.detailsLoading;
};

export const isOrderFailed = (state: RootState): boolean => {
  return state.order.detailsError === true;
};
