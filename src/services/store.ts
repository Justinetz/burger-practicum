import { configureStore } from '@reduxjs/toolkit';

import ingredientsReducer from './reducers/ingredients-reducer';
import orderReducer from './reducers/order-reducer';

export const store = configureStore({
  reducer: { ingredients: ingredientsReducer, order: orderReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
