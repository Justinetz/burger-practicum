import { configureStore } from '@reduxjs/toolkit';

import ingredientsReducer from './ingredient/ingredients-reducer';
import orderReducer from './order/order-reducer';
import userReducer from './user/user-reducer';

export const store = configureStore({
  reducer: { ingredients: ingredientsReducer, order: orderReducer, user: userReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
