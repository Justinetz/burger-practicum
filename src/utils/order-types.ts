import type { PayloadAction } from '@reduxjs/toolkit';

export enum OrderStatus {
  PENDING = 'pending',
  DONE = 'done',
}

export type TSendOrderDetails = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type TSendOrderDetailsResponse = PayloadAction<TSendOrderDetails>;

export type TOrderIngredient = {
  id: string;
  img: string;
  name: string;
  price: number;
  qty: number;
};

export type TOrder = {
  _id: string;
  status: OrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];

  price?: number;

  ingredientsInfo?: TOrderIngredient[];
};

export type IWsOrderTotal = {
  total: number | undefined;
  totalToday: number | undefined;
};

export type IWsOrdersState = {
  orders: TOrder[] | undefined;
} & IWsOrderTotal;
