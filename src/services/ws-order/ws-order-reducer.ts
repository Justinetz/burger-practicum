import { createAction, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { wsStoreActions } from '../../utils/socket-types';

import type { IWsOrdersState, TOrder } from '../../utils/order-types';

const initialState: IWsOrdersState = {
  orders: undefined,
  total: undefined,
  totalToday: undefined,
};

export const updateOrders = createAction<TOrder[]>('updateOrders');

export const wsOrder = createSlice({
  name: 'wsOrder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateOrders, (state, action: PayloadAction<TOrder[]>) => {
        state.orders = action.payload;
      })
      .addCase(wsStoreActions.onMessage, (state, action: PayloadAction<IWsOrdersState>) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(wsStoreActions.onClose, () => initialState);
  },
});

const { reducer } = wsOrder;

export default reducer;
