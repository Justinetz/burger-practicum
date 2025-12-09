import type { IWsOrderTotal, TOrder } from '../../utils/order-types';
import type { RootState } from '../store';

export const getWsOrders = (state: RootState): TOrder[] | undefined => {
  return state.wsOrders.orders;
};
export const getOrderByNumber =
  (number: number) =>
  (state: RootState): TOrder | undefined => {
    return state.wsOrders.orders?.find((o) => o.number === number);
  };
export const getTotals = (state: RootState): IWsOrderTotal => {
  const { total, totalToday } = state.wsOrders;
  return { total, totalToday };
};
