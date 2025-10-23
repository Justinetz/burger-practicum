import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { sendOrder } from '../remote-api-service';

import type { TOrderDetails, TOrderDetailsResponse } from '../../utils/order-types';

type IOrderState = {
  details: TOrderDetails;
  detailsLoading: boolean;
  detailsError: boolean;
};

const initialState: IOrderState = {
  details: {
    name: '',
    order: {
      number: -1,
    },
    success: false,
  } as TOrderDetails,
  detailsLoading: false,
  detailsError: false,
};

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  (ingredients: string[]) => {
    return sendOrder(ingredients);
  }
);

export const order = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrder.pending, (state) => {
      state.detailsLoading = true;
    });
    builder.addCase<any>(
      fetchOrder.fulfilled,
      (state, action: TOrderDetailsResponse) => {
        state.details = action.payload;
        state.detailsLoading = false;
        state.detailsError = false;
      }
    );
    builder.addCase(fetchOrder.rejected, (state) => {
      state.detailsError = true;
    });
  },
});

const { reducer } = order;

export default reducer;
