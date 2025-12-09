import type { TOrder, TSendOrderDetails } from '../../utils/order-types';
import type { RootState } from '../store';

export const geTSendOrderDetails = (state: RootState): TSendOrderDetails => {
  return state.order.details;
};

export const isOrderLoading = (state: RootState): boolean => {
  return state.order.detailsLoading;
};

export const isOrderFailed = (state: RootState): boolean => {
  return state.order.detailsError === true;
};

export const getActiveOrder = (state: RootState): TOrder | undefined => {
  return state.order.activeOrder;
};
