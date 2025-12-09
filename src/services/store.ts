import { configureStore } from '@reduxjs/toolkit';

import { socketMiddleware } from '../middleware/socket-middleware';
import { wsUrl, wsOrdersApi } from '../utils/constants';
import { wsStoreActions } from '../utils/socket-types';
import ingredientsReducer from './ingredient/ingredients-reducer';
import orderReducer from './order/order-reducer';
import userReducer from './user/user-reducer';
import wsOrderReducer from './ws-order/ws-order-reducer';

export const store = configureStore({
  reducer: { ingredients: ingredientsReducer, order: orderReducer, user: userReducer, wsOrders: wsOrderReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware(`${wsUrl}${wsOrdersApi}`, wsStoreActions)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
