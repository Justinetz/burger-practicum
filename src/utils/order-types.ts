import type { PayloadAction } from '@reduxjs/toolkit';

export type TOrderDetails = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type TOrderDetailsResponse = PayloadAction<TOrderDetails>;
