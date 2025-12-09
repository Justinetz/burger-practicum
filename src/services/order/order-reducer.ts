import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { receiveOrders, receiveOrderByNumber, sendOrder } from '../remote-api-service';
import { updateOrders } from '../ws-order/ws-order-reducer';

import type { TOrder, TSendOrderDetails } from '../../utils/order-types';
import type { TReceiveOrdersResponseData, TSendOrderResponseData } from '../remote-api-service';
import type { AppDispatch, RootState } from '../store';

type TOrderState = {
  details: TSendOrderDetails;
  detailsLoading: boolean;
  detailsError: boolean;

  ordersLoading: boolean;

  activeOrder: TOrder | undefined;
  orders: TOrder[] | undefined;
};

const initialState: TOrderState = {
  details: {
    name: '',
    order: {
      number: -1,
    },
    success: false,
  } as TSendOrderDetails,
  detailsLoading: false,
  detailsError: false,

  ordersLoading: false,

  activeOrder: undefined,
  orders: undefined,
};

export const fetchOrders = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'order/receiveOrders',
  async (_, api) => {
    const { accessToken } = api.getState().user;
    const ordersResponse = await receiveOrders(accessToken);
    api.dispatch(updateOrders(ordersResponse.orders));
  }
);

export const fetchOrderByNum = createAsyncThunk<
  TReceiveOrdersResponseData,
  number,
  { state: RootState; dispatch: AppDispatch }
>('order/receiveOrderByNumber', async (orderNum: number, api) => {
  const { accessToken } = api.getState().user;
  return await receiveOrderByNumber(orderNum, accessToken);
});

export const postOrder = createAsyncThunk<
  TSendOrderResponseData,
  string[],
  { state: RootState; dispatch: AppDispatch }
>('order/sendOrder', (ingredients: string[], api) => {
  const { accessToken } = api.getState().user;
  return sendOrder(ingredients, accessToken);
});

export const order = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setActiveOrder: (state, action: PayloadAction<TOrder | undefined>) => {
      state.activeOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postOrder.pending, (state) => {
      state.detailsLoading = true;
    });
    builder.addCase(postOrder.fulfilled, (state, action: PayloadAction<TSendOrderResponseData>) => {
      state.details = action.payload;
      state.detailsLoading = false;
      state.detailsError = false;
    });
    builder.addCase(postOrder.rejected, (state) => {
      state.detailsLoading = false;
      state.detailsError = true;
    });
    builder.addCase(fetchOrderByNum.fulfilled, (state, action: PayloadAction<TReceiveOrdersResponseData>) => {
      state.activeOrder = action.payload.orders[0];
    });
  },
});

const { actions, reducer } = order;

export const { setActiveOrder } = actions;

export default reducer;
